from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timedelta, timezone
import secrets

try:
    # Try relative imports (for deployment)
    from ..models import UserCreate, UserLogin, UserResponse, Token, ForgotPasswordRequest, ResetPasswordRequest
    from ..database import users_collection, reset_tokens_collection
    from ..auth import (
        get_password_hash,
        verify_password,
        create_access_token,
        get_current_active_user,
        ACCESS_TOKEN_EXPIRE_MINUTES
    )
    from ..email_service import send_password_reset_email
except ImportError:
    # Fall back to absolute imports (for local development)
    from models import UserCreate, UserLogin, UserResponse, Token, ForgotPasswordRequest, ResetPasswordRequest
    from database import users_collection, reset_tokens_collection
    from auth import (
        get_password_hash,
        verify_password,
        create_access_token,
        get_current_active_user,
        ACCESS_TOKEN_EXPIRE_MINUTES
    )
    from email_service import send_password_reset_email

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    user_dict = {
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": get_password_hash(user.password),
        "is_active": True,
        "created_at": datetime.now(timezone.utc)
    }

    result = users_collection.insert_one(user_dict)
    created_user = users_collection.find_one({"_id": result.inserted_id})

    return UserResponse(
        id=str(created_user["_id"]),
        email=created_user["email"],
        full_name=created_user["full_name"],
        is_active=created_user["is_active"]
    )

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login user and return JWT token"""
    user = users_collection.find_one({"email": user_credentials.email})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    """Send password reset email"""
    user = users_collection.find_one({"email": request.email})

    # Don't reveal if user exists or not for security
    if not user:
        return {"message": "If the email exists, a password reset link has been sent"}

    # Generate reset token
    reset_token = secrets.token_urlsafe(32)

    # Store reset token in database
    reset_token_dict = {
        "token": reset_token,
        "email": request.email,
        "created_at": datetime.now(timezone.utc),
        "used": False
    }

    # Delete any existing unused tokens for this email
    reset_tokens_collection.delete_many({"email": request.email, "used": False})

    # Insert new token
    reset_tokens_collection.insert_one(reset_token_dict)

    # Send email
    send_password_reset_email(request.email, reset_token)

    return {"message": "If the email exists, a password reset link has been sent"}

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    """Reset password using token"""
    # Find token in database
    token_doc = reset_tokens_collection.find_one({
        "token": request.token,
        "used": False
    })

    if not token_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    # Check if token is expired (1 hour)
    token_created_at = token_doc["created_at"].replace(tzinfo=timezone.utc)
    token_age = datetime.now(timezone.utc) - token_created_at
    if token_age > timedelta(hours=1):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired"
        )

    # Update user password
    email = token_doc["email"]
    hashed_password = get_password_hash(request.new_password)

    result = users_collection.update_one(
        {"email": email},
        {"$set": {"hashed_password": hashed_password}}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Mark token as used
    reset_tokens_collection.update_one(
        {"token": request.token},
        {"$set": {"used": True}}
    )

    return {"message": "Password has been reset successfully"}
