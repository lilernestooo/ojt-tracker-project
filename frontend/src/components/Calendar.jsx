// src/components/Calendar.jsx
import React from "react";
import dayjs from "dayjs";

export default function Calendar({ month, attendance, onMarkAbsent }) {
  const startOfMonth = dayjs(month + "-01");
  const daysInMonth = startOfMonth.daysInMonth();
  const firstDayIndex = startOfMonth.startOf("month").day(); // Sunday = 0

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getStatus = (day) => {
    const dateStr = `${month}-${String(day).padStart(2, "0")}`;
    const record = attendance.find((a) => a.date === dateStr);
    return record?.status || "none";
  };

  const handleClick = (day) => {
    const status = getStatus(day);
    if (status === "none" && window.confirm("Mark this day as absent?")) {
      onMarkAbsent(`${month}-${String(day).padStart(2, "0")}`);
    }
  };

  return (
    <div className="grid grid-cols-7 gap-1 border border-gray-300 p-2">
      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
        <div key={d} className="text-center font-semibold">{d}</div>
      ))}
      {days.map((day, idx) => {
        if (!day) return <div key={idx}></div>;
        const status = getStatus(day);
        let bg = "bg-gray-100";
        if (status === "present") bg = "bg-green-400";
        if (status === "absent") bg = "bg-red-400";

        return (
          <div
            key={idx}
            className={`h-12 flex items-center justify-center cursor-pointer ${bg} border border-gray-300`}
            onClick={() => handleClick(day)}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
}