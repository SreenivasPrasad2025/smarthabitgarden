import React, { useState } from "react";
import api from "../services/api";

export default function HabitForm({ onAdd }) {
  const [form, setForm] = useState({ name: "", description: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await api.post("/habits/", form);
    setForm({ name: "", description: "" });
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 my-4">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="New Habit (e.g., Read 30m)"
        className="flex-1 p-3 border rounded-lg"
      />
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Short description"
        className="flex-1 p-3 border rounded-lg"
      />
      <button className="bg-green-600 text-white px-5 py-3 rounded-lg">
        Plant 🌿
      </button>
    </form>
  );
}
