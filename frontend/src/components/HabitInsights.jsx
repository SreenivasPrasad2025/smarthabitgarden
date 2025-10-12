import React from "react";
import { motion } from "framer-motion";

export default function HabitInsights({ insights }) {
  if (!insights) return null;

  const { total_habits, total_streaks, average_streak, best_habit, top_3 } =
    insights;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow p-6 mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-green-700 mb-4">🌿 Habit Insights</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-3 rounded-lg bg-green-50">
          <h3 className="text-3xl font-bold text-green-700">{total_habits}</h3>
          <p className="text-gray-600 text-sm">Total Habits</p>
        </div>
        <div className="p-3 rounded-lg bg-green-50">
          <h3 className="text-3xl font-bold text-green-700">{total_streaks}</h3>
          <p className="text-gray-600 text-sm">Total Days Logged</p>
        </div>
        <div className="p-3 rounded-lg bg-green-50">
          <h3 className="text-3xl font-bold text-green-700">{average_streak}</h3>
          <p className="text-gray-600 text-sm">Avg Streak</p>
        </div>
        {best_habit && (
          <div className="p-3 rounded-lg bg-green-100 border border-green-200">
            <h3 className="text-lg font-semibold text-green-700">
              🏆 {best_habit.name}
            </h3>
            <p className="text-gray-600 text-sm">
              {best_habit.description || "Keep it up!"}
            </p>
            <p className="text-sm text-green-800 mt-1">
              Best Streak: {best_habit.streak} days
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 text-left">
        <h4 className="font-semibold text-green-700 mb-2">
          🌱 Top 3 Consistent Habits
        </h4>
        <ul className="list-disc list-inside text-gray-700">
          {top_3.map((h) => (
            <li key={h._id}>
              {h.name} — <span className="text-green-600">{h.streak} days</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
