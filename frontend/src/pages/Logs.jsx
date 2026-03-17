import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchLogs, createLog, updateLog, deleteLog } from "../api/logs";
import LogForm from "../components/LogForm";
import LogList from "../components/LogList";

export default function Logs() {
  const { token } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [editingLog, setEditingLog] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadLogs = async () => {
    try {
      const data = await fetchLogs(token);
      setLogs(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch logs");
    }
  };

  useEffect(() => {
    if (token) loadLogs();
  }, [token]);

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      if (editingLog) {
        await updateLog(editingLog.id, form, token);
        setEditingLog(null);
      } else {
        await createLog(form, token);
      }
      loadLogs();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;
    try {
      await deleteLog(id, token);
      loadLogs();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">OJT Logs</h1>
      <p className="text-gray-500 text-sm mb-6">Record your daily tasks and activities.</p>

      {error && (
        <p className="text-red-500 bg-red-50 border border-red-200 rounded p-3 mb-4 text-sm">
          {error}
        </p>
      )}

      <LogForm
        onSubmit={handleSubmit}
        editingLog={editingLog}
        onCancel={() => setEditingLog(null)}
        loading={loading}
      />

      <LogList
        logs={logs}
        onEdit={setEditingLog}
        onDelete={handleDelete}
      />
    </div>
  );
}