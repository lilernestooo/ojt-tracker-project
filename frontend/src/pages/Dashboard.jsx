import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchAttendance, markAbsent } from "../api/attendance";
import { fetchOjtHours, fetchAllTimeComputedHours } from "../api/ojtHours";
import TimeControls from "../components/TimesControls";
import Calendar from "../components/Calendar";
import OjtHoursSummary from "../components/OjtHoursSummary";
import LiveClock from "../components/LiveClock";
import dayjs from "dayjs";

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [ojtHours, setOjtHours] = useState({ required_hours: 600, previous_hours: 0 });
  const [allTimeHours, setAllTimeHours] = useState(0); // ← all-time computed hours

  const loadAttendance = async () => {
    try {
      const data = await fetchAttendance(month, token);
      setAttendance(data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load attendance");
    }
  };

  const loadOjtHours = async () => {
    try {
      const data = await fetchOjtHours(token);
      if (data) setOjtHours(data);
    } catch (err) {
      console.error("Failed to load OJT hours");
    }
  };

  const loadAllTimeHours = async () => {
    try {
      const hours = await fetchAllTimeComputedHours(token);
      setAllTimeHours(hours || 0);
    } catch (err) {
      console.error("Failed to load all-time hours");
    }
  };

  useEffect(() => {
    if (token) {
      loadAttendance();
      loadOjtHours();
      loadAllTimeHours();
    }
  }, [token, month]);

  const handleMarkAbsent = async (date) => {
    try {
      await markAbsent(date, token);
      loadAttendance();
      loadAllTimeHours(); // refresh all-time hours after marking absent
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark absent");
    }
  };

  // Weekly summary — current month only
  const weeklyStats = (() => {
    const weeks = {};
    attendance.forEach((record) => {
      const date = dayjs(record.date);
      const dayOfWeek = date.day();
      if (dayOfWeek === 0 || dayOfWeek === 6) return;
      const weekNum = Math.ceil(date.date() / 7);
      if (!weeks[weekNum]) weeks[weekNum] = { present: 0, hours: 0 };
      if (record.status === "present") {
        weeks[weekNum].present += 1;
        weeks[weekNum].hours += parseFloat(record.hours_worked || 0);
      }
    });
    return weeks;
  })();

  // Monthly stats
  const totalPresentDays = attendance.filter((r) => r.status === "present").length;
  const totalAbsentDays = attendance.filter((r) => r.status === "absent").length;
  const totalWeekdaysThisMonth = (() => {
    const start = dayjs(month + "-01");
    let count = 0;
    for (let i = 1; i <= start.daysInMonth(); i++) {
      const day = start.date(i).day();
      if (day !== 0 && day !== 6) count++;
    }
    return count;
  })();

  const prevMonth = () => setMonth(dayjs(month).subtract(1, "month").format("YYYY-MM"));
  const nextMonth = () => setMonth(dayjs(month).add(1, "month").format("YYYY-MM"));

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-500 text-sm">
          Track your attendance and manage your OJT logs.
        </p>
      </div>

      {/* Live Clock */}
      <LiveClock />

      {/* OJT Hours Progress — uses all-time hours */}
      <OjtHoursSummary
        ojtHours={ojtHours}
        computedHours={allTimeHours}
        token={token}
        onUpdate={() => { loadOjtHours(); loadAllTimeHours(); }}
      />

      {/* Monthly Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{totalPresentDays}</p>
          <p className="text-xs text-gray-500 mt-1">Present Days</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{totalAbsentDays}</p>
          <p className="text-xs text-gray-500 mt-1">Absent Days</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{totalWeekdaysThisMonth}</p>
          <p className="text-xs text-gray-500 mt-1">Weekdays This Month</p>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Weekly Summary (Mon–Fri, max 8hrs/day)
        </h3>
        <div className="flex flex-col gap-2">
          {Object.entries(weeklyStats).map(([week, stats]) => (
            <div key={week} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-16">Week {week}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-400 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((stats.hours / 40) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 w-28 text-right">
                {stats.present}/5 days · {stats.hours.toFixed(1)}h/40h
              </span>
            </div>
          ))}
          {Object.keys(weeklyStats).length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">
              No attendance records this month yet.
            </p>
          )}
        </div>
      </div>

      {/* Time Controls */}
      <TimeControls
        token={token}
        onUpdate={() => { loadAttendance(); loadAllTimeHours(); }}
        attendance={attendance}
      />

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          ← Prev
        </button>
        <h2 className="text-lg font-semibold text-gray-700">
          {dayjs(month).format("MMMM YYYY")}
        </h2>
        <button
          onClick={nextMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          Next →
        </button>
      </div>

      {/* Calendar */}
      <Calendar
        month={month}
        attendance={attendance}
        onMarkAbsent={handleMarkAbsent}
      />

    </div>
  );
}