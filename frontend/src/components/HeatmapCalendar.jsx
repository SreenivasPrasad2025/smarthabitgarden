import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

export default function HeatmapCalendar() {
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      const response = await api.get("/habits/calendar");
      setCalendarData(response.data.calendar);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      setLoading(false);
    }
  };

  // Get color based on activity level
  const getColor = (level) => {
    if (level === 0) return "bg-gray-100";
    return "bg-green-500";
  };

  // Get tooltip text
  const getTooltip = (day) => {
    if (!day) return "";
    const date = new Date(day.date + "T00:00:00"); // Parse as local date
    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return day.count > 0
      ? `${formatted}: Active day`
      : `${formatted}: No activity`;
  };

  // Generate grid layout (like GitHub - vertical weeks)
  const generateGrid = () => {
    if (!calendarData.length) return { grid: [], months: [] };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from January 1st of current year
    const currentYear = today.getFullYear();
    const yearStart = new Date(currentYear, 0, 1); // January 1st
    const yearEnd = new Date(currentYear, 11, 31); // December 31st

    // Find the previous Sunday to start the grid
    const startDate = new Date(yearStart);
    const startDay = startDate.getDay();
    if (startDay !== 0) {
      startDate.setDate(startDate.getDate() - startDay);
    }

    // Create a map of dates for quick lookup
    const dataMap = {};
    calendarData.forEach((day) => {
      dataMap[day.date] = day;
    });

    // Generate grid data (7 rows x ~52 columns)
    const grid = Array(7)
      .fill(null)
      .map(() => []);
    const months = [];
    let currentMonth = -1;

    let date = new Date(startDate);
    let weekIndex = 0;

    while (date <= yearEnd) {
      const dateStr = date.toISOString().split("T")[0];
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

      // Only add data if the date is within the current year
      const isInCurrentYear = date >= yearStart && date <= yearEnd;

      if (isInCurrentYear) {
        const dayData = dataMap[dateStr] || { date: dateStr, count: 0, level: 0 };
        grid[dayOfWeek].push(dayData);
      } else {
        // Add null for dates outside current year (placeholder)
        grid[dayOfWeek].push(null);
      }

      // Track month changes for labels
      if (dayOfWeek === 0) {
        // Start of a new week (Sunday)
        const month = date.getMonth();
        if (month !== currentMonth && isInCurrentYear) {
          months.push({ week: weekIndex, month: month });
          currentMonth = month;
        }
        weekIndex++;
      }

      date.setDate(date.getDate() + 1);
    }

    return { grid, months };
  };

  const { grid, months } = generateGrid();
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow">
        <p className="text-gray-500">Loading calendar...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 bg-white rounded-2xl shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        📅 Your Habit Journey
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Activity from January to December {new Date().getFullYear()} - each square represents a day
      </p>

      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Month labels */}
          <div className="flex mb-2" style={{ marginLeft: '30px' }}>
            {months.map((m, i) => {
              const prevWeek = i === 0 ? 0 : months[i - 1]?.week || 0;
              const weekGap = m.week - prevWeek;
              // Calculate spacing: base spacing + month borders
              const monthsInBetween = i === 0 ? 0 : i;
              const borderSpacing = monthsInBetween ; // 6px for border + padding per month
              const baseSpacing = weekGap * 14;

              return (
                <div
                  key={i}
                  className="text-xs text-gray-500"
                  style={{
                    marginLeft: i === 0 ? 0 : `${baseSpacing + borderSpacing}px`,
                  }}
                >
                  {monthLabels[m.month]}
                </div>
              );
            })}
          </div>

          {/* Calendar grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col gap-1 pr-2 text-xs text-gray-500">
              {dayLabels.map((day) => (
                <div key={day} className="h-3 flex items-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid of squares */}
            <div className="flex gap-1">
              {grid[0].map((_, weekIdx) => {
                // Check if this week starts a new month
                const isMonthStart = months.some(m => m.week === weekIdx);

                return (
                  <div
                    key={weekIdx}
                    className={`flex flex-col gap-1 ${isMonthStart && weekIdx > 0 ? 'ml-2 border-l-2 border-gray-200 pl-1' : ''}`}
                  >
                    {grid.map((row, dayIdx) => {
                      const day = row[weekIdx];
                      return (
                        <div key={`${weekIdx}-${dayIdx}`} className="relative group">
                          <div
                            className={`w-3 h-3 rounded-sm transition-all duration-200 ${
                              day ? getColor(day.level) : "bg-transparent"
                            } ${
                              day && day.level > 0
                                ? "hover:ring-2 hover:ring-green-400"
                                : ""
                            }`}
                            title={day ? getTooltip(day) : ""}
                          />
                          {/* Tooltip */}
                          {day && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              {getTooltip(day)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-600">
            <span>Less</span>
            <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span>More</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
