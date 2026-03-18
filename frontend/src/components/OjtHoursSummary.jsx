import { useState, useEffect } from "react";
import { updateOjtHours } from "../api/ojtHours";

export default function OjtHoursSummary({ ojtHours, computedHours, token, onUpdate }) {
  const [editing, setEditing] = useState(false);

  // Initialize form state
  const [form, setForm] = useState({
    required_hours: 600,
    previous_hours: 0,
  });

  // Sync form state whenever ojtHours changes (from backend)
  useEffect(() => {
    setForm({
      required_hours: Number(ojtHours?.required_hours) || 600,
      previous_hours: Number(ojtHours?.previous_hours) || 0,
    });
  }, [ojtHours]);

  // Convert inputs to numbers for calculations
  const previousHours = parseFloat(form.previous_hours || 0); // live editable value
  const requiredHours = parseFloat(form.required_hours || 600);
  const totalHours = previousHours + parseFloat(computedHours || 0); // always a number
  const percentage = Math.min((totalHours / requiredHours) * 100, 100).toFixed(1);

  const handleSave = async () => {
    try {
      await updateOjtHours(
        {
          required_hours: Number(form.required_hours),
          previous_hours: Number(form.previous_hours),
        },
        token
      ); // PUT to backend
      onUpdate(); // refresh Dashboard data
      setEditing(false);
    } catch (err) {
      console.error("Failed to update OJT hours", err);
      alert("Failed to save changes. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-semibold text-gray-700">OJT Hours Progress</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="text-xs text-blue-500 hover:underline"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500">Required Hours</label>
            <input
              type="number"
              min="0"
              value={form.required_hours}
              onChange={(e) =>
                setForm({ ...form, required_hours: e.target.value })
              }
              className="border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500">Previous Hours (before app)</label>
            <input
              type="number"
              min="0"
              value={form.previous_hours}
              onChange={(e) =>
                setForm({ ...form, previous_hours: e.target.value })
              }
              className="border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Hours breakdown */}
      <div className="flex gap-6 text-sm text-gray-600 mb-3">
        <div>
          <p className="text-xs text-gray-400">Previous</p>
          <p className="font-semibold">{previousHours.toFixed(2)} hrs</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">From App</p>
          <p className="font-semibold">{parseFloat(computedHours || 0).toFixed(2)} hrs</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Total</p>
          <p className="font-semibold text-blue-600">{totalHours.toFixed(2)} hrs</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Required</p>
          <p className="font-semibold">{requiredHours} hrs</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${
            percentage >= 100 ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{percentage}% complete</span>
        <span>{Math.max(requiredHours - totalHours, 0).toFixed(2)} hrs remaining</span>
      </div>
    </div>
  );
}