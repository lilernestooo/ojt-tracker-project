// src/pages/Logs.jsx
import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Logs() {
  const { token } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", date: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch logs for the logged-in user
  const fetchLogs = async () => {
    try {
      const res = await api.get("/logs", { headers: { Authorization: `Bearer ${token}` } });
      setLogs(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch logs");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  // Handle add / edit submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/logs/${editingId}`, form, { headers: { Authorization: `Bearer ${token}` } });
        setEditingId(null);
      } else {
        await api.post("/logs", form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setForm({ title: "", date: "" });
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
    setLoading(false);
  };

  // Set form for editing
  const handleEdit = (log) => {
    setForm({ title: log.title, date: log.date });
    setEditingId(log.id);
  };

  // Delete a log with confirmation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;
    try {
      await api.delete(`/logs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">OJT Logs</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form for Add / Edit */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border border-gray-300 p-2 rounded-none flex-1"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border border-gray-300 p-2 rounded-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-none text-white ${editingId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Logs List */}
      <ul className="border border-gray-300 rounded-none divide-y divide-gray-300">
        {logs.map((log) => (
          <li key={log.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">{log.title}</p>
              <p className="text-gray-600">{log.date}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(log)}
                className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-none hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(log.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-none hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}