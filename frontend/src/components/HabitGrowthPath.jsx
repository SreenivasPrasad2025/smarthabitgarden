import React from "react";
import { motion } from "framer-motion";

export default function HabitGrowthPath() {
  const stages = [
    { emoji: "🌱", label: "Seedling", range: "Days 0–2" },
    { emoji: "🌿", label: "Sprout", range: "Days 3–6" },
    { emoji: "🌴", label: "Tree", range: "Days 7–13" },
    { emoji: "🌸", label: "Blossom", range: "Day 14+" },
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow p-6 mt-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-bold text-green-700 mb-4 text-center">
        🌼 Growth Path — How Your Plant Evolves
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {stages.map((stage, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl bg-green-50 border border-green-100"
          >
            <div className="text-4xl mb-2">{stage.emoji}</div>
            <p className="font-semibold text-green-700">{stage.label}</p>
            <p className="text-xs text-gray-600">{stage.range}</p>
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-gray-500 text-center mt-4">
        🌱 Keep growing daily to evolve your plant to the next stage!
      </p>
    </motion.div>
  );
}
