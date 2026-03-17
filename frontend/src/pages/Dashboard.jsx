// src/pages/Dashboard.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchAttendance, markAbsent, timeIn, timeOut } from "../api/attendance";
import TimeControls from "../components/TimesControls";
import Calendar from "../components/Calendar";
import dayjs from "dayjs";

export default function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);

  // Attendance state
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));

  // Load attendance for current month
  const loadAttendance = async () => {
    try {
      const data = await fetchAttendance(month, token);
      setAttendance(data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load attendance");
    }
  };

  useEffect(() => {
    if (token) loadAttendance();
  }, [token, month]);

  // Handle marking a day as absent
  const handleMarkAbsent = async (date) => {
    try {
      await markAbsent(date, token);
      loadAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark absent");
    }
  };

  // Handle Time In / Time Out directly (optional if using TimeControls component)
  const handleTimeIn = async () => {
    try {
      await timeIn(token);
      loadAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Time In failed");
    }
  };

  const handleTimeOut = async () => {
    try {
      await timeOut(token);
      loadAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Time Out failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome & Logout */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-600 mb-4">
          This is your dashboard. Track your attendance and manage your OJT logs.
        </p>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-none hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Time In / Time Out controls */}
      <TimeControls token={token} onUpdate={loadAttendance} />

      {/* Attendance Calendar */}
      <Calendar month={month} attendance={attendance} onMarkAbsent={handleMarkAbsent} />
    </div>
  );
}