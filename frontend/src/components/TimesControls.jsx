// src/components/TimeControls.jsx
import React, { useState } from "react";
import { timeIn, timeOut } from "../api/attendance";

export default function TimeControls({ token, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleTimeIn = async () => {
    setLoading(true);
    try {
      await timeIn(token);
      onUpdate(); // refresh attendance in parent
    } catch (err) {
      alert(err.response?.data?.message || "Time In failed");
    }
    setLoading(false);
  };

  const handleTimeOut = async () => {
    setLoading(true);
    try {
      await timeOut(token);
      onUpdate(); // refresh attendance in parent
    } catch (err) {
      alert(err.response?.data?.message || "Time Out failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={handleTimeIn}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        Time In
      </button>
      <button
        onClick={handleTimeOut}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Time Out
      </button>
    </div>
  );
}