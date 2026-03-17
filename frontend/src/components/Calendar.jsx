import dayjs from "dayjs";

export default function Calendar({ month, attendance, onMarkAbsent }) {
  const startOfMonth = dayjs(month + "-01");
  const daysInMonth = startOfMonth.daysInMonth();
  const firstDayIndex = startOfMonth.day();

  const days = [
    ...Array(firstDayIndex).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getRecord = (day) => {
    const dateStr = dayjs(`${month}-${String(day).padStart(2, "0")}`).format("YYYY-MM-DD");
    return attendance.find((a) => dayjs(a.date).format("YYYY-MM-DD") === dateStr) || null;
  };

 const getHours = (record) => {
  if (!record?.hours_worked || record.hours_worked <= 0) return null;
  const hrs = Math.floor(record.hours_worked);
  const mins = Math.round((record.hours_worked - hrs) * 60);
  return `${hrs}h ${mins}m`;
};

  const isWeekend = (day) => {
    const d = dayjs(`${month}-${String(day).padStart(2, "0")}`).day();
    return d === 0 || d === 6;
  };

  const handleClick = (day) => {
    if (isWeekend(day)) return; // no action on weekends
    const record = getRecord(day);
    if (!record && window.confirm("Mark this day as absent?")) {
      onMarkAbsent(`${month}-${String(day).padStart(2, "0")}`);
    }
  };

  const cellStyle = (day) => {
    if (isWeekend(day)) return "bg-gray-50 text-gray-300 cursor-default";
    const record = getRecord(day);
    const status = record?.status || "none";
    if (status === "present") return "bg-green-400 text-white cursor-pointer";
    if (status === "absent") return "bg-red-400 text-white cursor-pointer";
    return "bg-gray-100 text-gray-700 cursor-pointer";
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-semibold py-1 ${
              i === 0 || i === 6 ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const record = getRecord(day);
          const hours = getHours(record);

          return (
            <div
              key={idx}
              onClick={() => handleClick(day)}
              className={`h-16 flex flex-col items-center justify-center rounded text-sm font-medium transition hover:opacity-80 ${cellStyle(day)}`}
            >
              <span>{day}</span>
              {hours && (
                <span className="text-xs mt-1 opacity-90">{hours}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-400 inline-block" /> Present
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-400 inline-block" /> Absent
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-100 border inline-block" /> No record
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-50 border inline-block" /> Weekend
        </span>
      </div>
    </div>
  );
}