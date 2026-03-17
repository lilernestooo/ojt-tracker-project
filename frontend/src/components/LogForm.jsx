import { useState, useEffect } from "react";

const emptyForm = { title: "", description: "", date: "" };

export default function LogForm({ onSubmit, editingLog, onCancel, loading }) {
  const [form, setForm] = useState(emptyForm);

  // Populate form when editing
  useEffect(() => {
    if (editingLog) {
      setForm({
        title: editingLog.title || "",
        description: editingLog.description || "",
        date: editingLog.date?.split("T")[0] || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingLog]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!editingLog) setForm(emptyForm);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        {editingLog ? "✏️ Edit Log" : "➕ Add New Log"}
      </h2>

      <div className="flex flex-col gap-3">
        {/* Title & Date row */}
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            name="title"
            placeholder="What did you work on today?"
            value={form.title}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Describe what you did in detail (optional)..."
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
        />

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          {editingLog && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white text-sm disabled:opacity-50 ${
              editingLog
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : editingLog ? "Update Log" : "Add Log"}
          </button>
        </div>
      </div>
    </form>
  );
}