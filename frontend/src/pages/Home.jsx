import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import HabitForm from "../components/HabitForm";
import HabitGarden from "../components/HabitGarden";
import HabitInsights from "../components/HabitInsights";
import HabitGrowthPath from "../components/HabitGrowthPath";
import HeatmapCalendar from "../components/HeatmapCalendar";

export default function Home() {
  const [habits, setHabits] = useState([]);
  const [insights, setInsights] = useState(null);
  const { user, logout } = useAuth();

  // 🪴 Fetch habits
  const fetchHabits = async () => {
    try {
      const res = await api.get("/habits/");
      setHabits(res.data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  // 🧠 Fetch insights
  const fetchInsights = async () => {
    try {
      const res = await api.get("/habits/insights");
      setInsights(res.data);
    } catch (error) {
      console.error("Error fetching insights:", error);
    }
  };

  // 🔁 Fetch both
  const refreshAll = async () => {
    await fetchHabits();
    await fetchInsights();
  };

  // 📦 On mount
  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header with user info and logout */}
      <header className="bg-white shadow-sm mb-6">
        <div className="max-w-5xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
              🌱 Smart Habit Garden
            </h1>
            <p className="text-gray-600 mt-2">Grow habits like plants — one day at a time.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome,</p>
              <p className="font-medium text-gray-800">{user?.full_name}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4">
        {/* 🌿 Insights Section */}
        <HabitInsights insights={insights} />

        <HabitGrowthPath />

        {/* 📊 Analytics Section */}
        <div className="mt-6">
          <HeatmapCalendar />
        </div>

        {/* 🌱 Add Habit */}
        <HabitForm onAdd={refreshAll} />

        {/* 🌼 Habit Cards */}
        <HabitGarden habits={habits} onUpdate={refreshAll} />
      </div>
    </div>
  );
}
