from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime, timedelta, timezone

try:
    # Try relative imports (for deployment)
    from ..models import Habit, UserResponse
    from ..database import habits_collection, days_log_collection
    from ..utils import to_str_id
    from ..auth import get_current_active_user
except ImportError:
    # Fall back to absolute imports (for local development)
    from models import Habit, UserResponse
    from database import habits_collection, days_log_collection
    from utils import to_str_id
    from auth import get_current_active_user

router = APIRouter(prefix="/habits", tags=["habits"])

@router.get("/")
def get_habits(current_user: UserResponse = Depends(get_current_active_user)):
    habits = [to_str_id(h) for h in habits_collection.find({"user_id": current_user.id}).sort("_id", -1)]
    return habits

@router.post("/")
def add_habit(habit: Habit, current_user: UserResponse = Depends(get_current_active_user)):
    # Do not persist 'id' field; let Mongo create _id
    hdict = habit.model_dump()
    hdict.pop("id", None)
    hdict["user_id"] = current_user.id
    result = habits_collection.insert_one(hdict)
    created = habits_collection.find_one({"_id": result.inserted_id})
    return to_str_id(created)

@router.put("/{habit_id}")
def update_habit(habit_id: str, habit: Habit, current_user: UserResponse = Depends(get_current_active_user)):
    if not ObjectId.is_valid(habit_id):
        raise HTTPException(status_code=400, detail="Invalid habit id")
    payload = habit.model_dump()
    payload.pop("id", None)
    res = habits_collection.update_one({"_id": ObjectId(habit_id), "user_id": current_user.id}, {"$set": payload})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Habit not found")
    updated = habits_collection.find_one({"_id": ObjectId(habit_id)})
    return to_str_id(updated)

@router.delete("/{habit_id}")
def delete_habit(habit_id: str, current_user: UserResponse = Depends(get_current_active_user)):
    if not ObjectId.is_valid(habit_id):
        raise HTTPException(status_code=400, detail="Invalid habit id")
    res = habits_collection.delete_one({"_id": ObjectId(habit_id), "user_id": current_user.id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Habit not found")
    return {"message": "Habit deleted", "id": habit_id}


@router.get("/calendar")
def get_calendar_data(current_user: UserResponse = Depends(get_current_active_user)):
    """Get heatmap calendar data for the last 365 days"""
    # Get all days_log entries for this user
    days_logs = list(days_log_collection.find({"user_id": current_user.id}))

    # Create a dictionary of dates with counts
    calendar_data = {}
    for log in days_logs:
        date_str = log["date"]
        calendar_data[date_str] = calendar_data.get(date_str, 0) + 1

    # Generate last 365 days
    today = datetime.now(timezone.utc).date()
    calendar = []
    for i in range(365):
        date = today - timedelta(days=i)
        date_str = str(date)
        calendar.append({
            "date": date_str,
            "count": 1 if date_str in calendar_data else 0,
            "level": 1 if date_str in calendar_data else 0  # 0 = no activity, 1 = active
        })

    return {"calendar": list(reversed(calendar))}


@router.get("/insights")
def habit_insights(current_user: UserResponse = Depends(get_current_active_user)):
    habits = list(habits_collection.find({"user_id": current_user.id}))
    total_logged_days = days_log_collection.count_documents({"user_id": current_user.id})

    if total_logged_days == 0:
        total_logged_days = 1

    if not habits:
        return {
            "total_habits": 0,
            "total_streaks": total_logged_days,  # portal-level total days
            "average_streak": 1,
            "best_habit": {
                "name": "Welcome Habit 🌱",
                "streak": 1,
                "description": "Start your first habit today!"
            },
            "top_3": [],
        }

    total_streaks = sum(h.get("streak", 0) for h in habits)
    avg_streak = round(max(total_streaks / len(habits), 1), 2)
    sorted_habits = sorted(habits, key=lambda h: h.get("streak", 0), reverse=True)
    best = sorted_habits[0]
    top3 = sorted_habits[:3]

    for h in top3:
        h["_id"] = str(h["_id"])

    return {
        "total_habits": len(habits),
        "total_streaks": total_logged_days,
        "average_streak": avg_streak,
        "best_habit": {
            "name": best.get("name", "Your Habit"),
            "streak": max(best.get("streak", 1), 1),
            "description": best.get("description", ""),
        },
        "top_3": top3,
    }


@router.put("/{habit_id}/grow")
def grow_habit(habit_id: str, current_user: UserResponse = Depends(get_current_active_user)):
    habit = habits_collection.find_one({"_id": ObjectId(habit_id), "user_id": current_user.id})
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    today = datetime.now(timezone.utc).date()
    last_streak = habit.get("last_streak_date")

    if last_streak:
        if last_streak.tzinfo is None:
            last_streak = last_streak.replace(tzinfo=timezone.utc)
        if last_streak.date() == today:
            raise HTTPException(status_code=400, detail="Already grown today 🌱")


    if last_streak:
        days_since = (today - last_streak.date()).days
        if days_since == 1:
            new_streak = habit.get("streak", 0) + 1
        elif days_since > 1:
            new_streak = 1
    else:
        new_streak = 1

    updated = {
        "streak": new_streak,
        "last_streak_date": datetime.now(timezone.utc),
        "last_updated": datetime.now(timezone.utc),
    }

    habits_collection.update_one({"_id": ObjectId(habit_id)}, {"$set": updated})


    today_str = str(today)
    existing_day = days_log_collection.find_one({"date": today_str, "user_id": current_user.id})
    if not existing_day:
        days_log_collection.insert_one({"date": today_str, "user_id": current_user.id, "created_at": datetime.now(timezone.utc)})

    new_doc = habits_collection.find_one({"_id": ObjectId(habit_id)})
    return to_str_id(new_doc)
