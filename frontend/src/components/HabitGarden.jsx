import React from "react";
import { motion } from "framer-motion";
import api from "../services/api";

function Stage({ streak }) {
  // 🌱 Simple visual growth: height scales with streak; emoji changes
  const height = Math.min(40 + streak * 6, 140);
  const stage =
    streak < 3 ? "🌱" : streak < 7 ? "🌿" : streak < 14 ? "🌴" : "🌸";

  return (
    <motion.div
      className="flex flex-col items-center justify-end h-40"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-4xl">{stage}</div>
      <div
        className="mt-2 w-2 rounded-full"
        style={{ background: "var(--leaf)", height }}
        aria-hidden
      />
    </motion.div>
  );
}

export default function HabitGarden({ habits, onUpdate }) {
  // 🌿 Grow habit once per day
  const growHabit = async (habit) => {
    try {
      const res = await api.put(`/habits/${habit._id}/grow`);
      onUpdate(); // refresh habits after growing
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert("🌿 You already grew this habit today!");
      } else {
        alert("⚠️ Could not grow habit. Please try again.");
      }
    }
  };

  // 🗑 Delete habit
  const deleteHabit = async (habit) => {
    await api.delete(`/habits/${habit._id}`);
    onUpdate();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {habits.map((habit) => {
        // ✅ Determine if grown today
        const grownToday =
          habit.last_streak_date &&
          new Date(habit.last_streak_date).toDateString() ===
            new Date().toDateString();

        // 📅 Format readable date
        const formattedDate = habit.last_streak_date
          ? new Date(habit.last_streak_date).toLocaleDateString()
          : "—";

        return (
          <motion.div
            key={habit._id}
            className="p-4 bg-white rounded-2xl shadow border hover:shadow-md transition"
            whileHover={{ scale: 1.02 }}
          >
            {/* 🧠 Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-lg text-green-700">
                  {habit.name}
                </h3>
                <p className="text-sm text-gray-600">{habit.description}</p>
              </div>
              <button
                onClick={() => deleteHabit(habit)}
                className="text-red-500 hover:underline text-sm"
                title="Delete habit"
              >
                Delete
              </button>
            </div>

            {/* 📊 Progress Bar */}
            <div
              className="mt-3 w-full h-3 bg-green-100 rounded-full overflow-hidden"
              aria-label="Streak progress"
            >
              <motion.div
                className="h-3 bg-green-600"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((habit.streak || 0) * 10, 100)}%`,
                }}
                transition={{ duration: 0.6 }}
              />
            </div>

            {/* 🔢 Streak Info + Date */}
            <div className="mt-4 flex flex-col gap-1">
              <span className="text-sm text-gray-700">
                Streak: <strong>{habit.streak || 0}</strong> day(s)
              </span>
              <p className="text-xs text-gray-500">
                Last grown: <strong>{formattedDate}</strong>
              </p>
            </div>

            {/* 🌿 Grow Button */}
            <div className="mt-4">
              <button
                onClick={() => growHabit(habit)}
                disabled={grownToday}
                className={`px-3 py-1.5 rounded-lg w-full ${
                  grownToday
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white font-medium`}
              >
                {grownToday ? "Done for Today ✅" : "Grow 🌿"}
              </button>
            </div>

            {/* 🌸 Growth Stage */}
            <div className="mt-4">
              <Stage streak={habit.streak || 0} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
