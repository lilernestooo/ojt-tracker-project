import { useState } from "react";
import { timeIn, timeOut } from "../api/attendance";
import { LogIn, LogOut, CheckCircle, XCircle } from "lucide-react";

export default function TimeControls({ token, onUpdate, attendance }) {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '' }

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000); // auto dismiss after 4s
  };

  // Check today's record from attendance prop
  const todayRecord = attendance?.find((r) => {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
    const recordDate = new Date(r.date).toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
    return recordDate === today;
  });

  const hasTimedInToday = !!todayRecord?.time_in;
  const hasTimedOutToday = !!todayRecord?.time_out;

  const handleTimeIn = async () => {
    if (hasTimedInToday) {
      showAlert("error", "You have already timed in today. Come back tomorrow!");
      return;
    }
    setLoading(true);
    try {
      await timeIn(token);
      onUpdate();
      showAlert("success", "Time In recorded successfully! Have a productive day 💪");
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Time In failed");
    }
    setLoading(false);
  };

  const handleTimeOut = async () => {
    if (!hasTimedInToday) {
      showAlert("error", "You need to Time In first before timing out!");
      return;
    }
    if (hasTimedOutToday) {
      showAlert("error", "You have already timed out today. See you tomorrow!");
      return;
    }
    setLoading(true);
    try {
      await timeOut(token);
      onUpdate();
      showAlert("success", "Time Out recorded successfully! Great work today 🎉");
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Time Out failed");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Attendance</h3>

      {/* Alert */}
      {alert && (
        <div
          className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg mb-3 transition-all ${
            alert.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {alert.type === "success"
            ? <CheckCircle size={16} />
            : <XCircle size={16} />
          }
          {alert.message}
        </div>
      )}

      <div className="flex gap-3">

        {/* Time In */}
        <button
          onClick={handleTimeIn}
          disabled={loading || hasTimedInToday}
          className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-lg transition-all active:scale-95 
            ${hasTimedInToday
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <LogIn size={18} />
          {hasTimedInToday ? "Timed In ✓" : loading ? "Loading..." : "Time In"}
        </button>

        {/* Time Out */}
        <button
          onClick={handleTimeOut}
          disabled={loading || !hasTimedInToday || hasTimedOutToday}
          className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-lg transition-all active:scale-95
            ${hasTimedOutToday
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : !hasTimedInToday
              ? "bg-orange-300 text-white cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 text-white"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <LogOut size={18} />
          {hasTimedOutToday ? "Timed Out ✓" : loading ? "Loading..." : "Time Out"}
        </button>

      </div>

      {/* Status hint */}
      <p className="text-xs text-gray-400 mt-3 text-center">
        {hasTimedOutToday
          ? "✅ Attendance complete for today!"
          : hasTimedInToday
          ? "⏳ Don't forget to Time Out before you leave."
          : "👋 Start your day by clicking Time In."}
      </p>

    </div>
  );
}