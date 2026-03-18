import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchAllInterns, fetchInternAttendance, fetchInternLogs, deleteIntern, updateInternOjtHours } from "../api/admin";
import { Users, Calendar, BookOpen, Trash2, ChevronDown, ChevronUp, Pencil, Check, X } from "lucide-react";
import InternSearch from "../components/admin/InternSearch";
import InternPagination from "../components/admin/InternPagination";
import dayjs from "dayjs";

const PAGE_SIZE = 10;

export default function Admin() {
  const { token } = useContext(AuthContext);
  const [interns, setInterns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("attendance");
  const [attendance, setAttendance] = useState([]);
  const [logs, setLogs] = useState([]);
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [loading, setLoading] = useState(false);

  // Search & pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Edit OJT hours
  const [editingOjt, setEditingOjt] = useState(false);
  const [ojtForm, setOjtForm] = useState({ required_hours: 600, previous_hours: 0 });

  const loadInterns = async () => {
    try {
      const data = await fetchAllInterns(token);
      setInterns(data);
    } catch (err) {
      console.error("Failed to load interns");
    }
  };

  useEffect(() => {
    loadInterns();
  }, [token]);

  // Filter interns by search
  const filteredInterns = interns.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredInterns.length / PAGE_SIZE);
  const paginatedInterns = filteredInterns.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset to page 1 when search changes
  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
    setSelected(null);
  };

  const handleSelectIntern = async (intern) => {
    if (selected?.id === intern.id) {
      setSelected(null);
      setEditingOjt(false);
      return;
    }
    setSelected(intern);
    setEditingOjt(false);
    setOjtForm({
      required_hours: intern.required_hours || 600,
      previous_hours: intern.previous_hours || 0,
    });
    setLoading(true);
    try {
      const att = await fetchInternAttendance(intern.id, month, token);
      const lg = await fetchInternLogs(intern.id, token);
      setAttendance(att);
      setLogs(lg);
    } catch (err) {
      console.error("Failed to load intern data");
    }
    setLoading(false);
  };

  const handleMonthChange = async (newMonth) => {
    setMonth(newMonth);
    if (!selected) return;
    const att = await fetchInternAttendance(selected.id, newMonth, token);
    setAttendance(att);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this intern?")) return;
    try {
      await deleteIntern(id, token);
      loadInterns();
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error("Failed to delete intern");
    }
  };

  const handleSaveOjtHours = async () => {
    try {
      await updateInternOjtHours(selected.id, ojtForm, token);
      await loadInterns();
      // Update selected with new values
      setSelected((prev) => ({ ...prev, ...ojtForm }));
      setEditingOjt(false);
    } catch (err) {
      console.error("Failed to update OJT hours");
    }
  };

  // Compute total hours for selected intern
  const computedHours = attendance.reduce((total, r) => {
    return total + parseFloat(r.hours_worked || 0);
  }, 0);

  const totalHours = parseFloat(selected?.previous_hours || 0) + computedHours;
  const requiredHours = parseFloat(selected?.required_hours || 600);
  const percentage = Math.min((totalHours / requiredHours) * 100, 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Users size={28} /> Admin Dashboard
        </h1>
        <p className="text-gray-500 text-sm">Manage and monitor all interns.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{interns.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Interns</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-500">
            {interns.filter((i) => i.required_hours).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Active Interns</p>
        </div>
      </div>

      {/* Interns List */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">All Interns</h2>
          {/* Search */}
          <InternSearch search={search} onSearch={handleSearch} />
        </div>

        {filteredInterns.length === 0 ? (
          <p className="text-center text-gray-400 text-sm p-6">
            {search ? "No interns found." : "No interns registered yet."}
          </p>
        ) : (
          <>
            <ul className="divide-y divide-gray-100">
              {paginatedInterns.map((intern) => (
                <li key={intern.id}>
                  <div
                    className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectIntern(intern)}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{intern.name}</p>
                      <p className="text-xs text-gray-400">{intern.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {intern.required_hours} hrs required
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(intern.id); }}
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                      {selected?.id === intern.id
                        ? <ChevronUp size={16} className="text-gray-400" />
                        : <ChevronDown size={16} className="text-gray-400" />
                      }
                    </div>
                  </div>

                  {/* Expanded intern details */}
                  {selected?.id === intern.id && (
                    <div className="bg-gray-50 border-t p-4">
                      {loading ? (
                        <p className="text-center text-gray-400 text-sm py-4">Loading...</p>
                      ) : (
                        <>
                          {/* OJT Progress + Edit */}
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-500">OJT Progress</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {totalHours.toFixed(2)} / {requiredHours} hrs
                                </span>
                                {/* Edit button */}
                                {!editingOjt ? (
                                  <button
                                    onClick={() => setEditingOjt(true)}
                                    className="text-blue-400 hover:text-blue-600 transition"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                ) : (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={handleSaveOjtHours}
                                      className="text-green-500 hover:text-green-700 transition"
                                    >
                                      <Check size={14} />
                                    </button>
                                    <button
                                      onClick={() => setEditingOjt(false)}
                                      className="text-red-400 hover:text-red-600 transition"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Edit OJT form */}
                            {editingOjt && (
                              <div className="flex gap-3 mb-3">
                                <div className="flex flex-col gap-1 flex-1">
                                  <label className="text-xs text-gray-400">Required Hours</label>
                                  <input
                                    type="number"
                                    value={ojtForm.required_hours}
                                    onChange={(e) => setOjtForm({ ...ojtForm, required_hours: e.target.value })}
                                    className="border rounded p-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                                  />
                                </div>
                                <div className="flex flex-col gap-1 flex-1">
                                  <label className="text-xs text-gray-400">Previous Hours</label>
                                  <input
                                    type="number"
                                    value={ojtForm.previous_hours}
                                    onChange={(e) => setOjtForm({ ...ojtForm, previous_hours: e.target.value })}
                                    className="border rounded p-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-3 rounded-full transition-all duration-500 ${
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

                          {/* View toggle */}
                          <div className="flex gap-2 mb-4">
                            <button
                              onClick={() => setView("attendance")}
                              className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition ${
                                view === "attendance"
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                              }`}
                            >
                              <Calendar size={13} /> Attendance
                            </button>
                            <button
                              onClick={() => setView("logs")}
                              className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition ${
                                view === "logs"
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                              }`}
                            >
                              <BookOpen size={13} /> Logs
                            </button>
                            {view === "attendance" && (
                              <input
                                type="month"
                                value={month}
                                onChange={(e) => handleMonthChange(e.target.value)}
                                className="ml-auto border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                              />
                            )}
                          </div>

                          {/* Attendance Table */}
                          {view === "attendance" && (
                            <div className="overflow-x-auto">
                              {attendance.length === 0 ? (
                                <p className="text-center text-gray-400 text-xs py-4">
                                  No attendance records for this month.
                                </p>
                              ) : (
                                <table className="w-full text-xs text-left">
                                  <thead>
                                    <tr className="text-gray-500 border-b">
                                      <th className="py-2 pr-4">Date</th>
                                      <th className="py-2 pr-4">Status</th>
                                      <th className="py-2 pr-4">Time In</th>
                                      <th className="py-2 pr-4">Time Out</th>
                                      <th className="py-2">Hours</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {attendance.map((r, idx) => (
                                      <tr key={idx} className="border-b last:border-0 hover:bg-gray-100">
                                        <td className="py-2 pr-4">
                                          {dayjs(r.date).format("MMM D, YYYY")}
                                        </td>
                                        <td className="py-2 pr-4">
                                          <span className={`px-2 py-0.5 rounded-full font-medium ${
                                            r.status === "present"
                                              ? "bg-green-100 text-green-700"
                                              : "bg-red-100 text-red-700"
                                          }`}>
                                            {r.status}
                                          </span>
                                        </td>
                                        <td className="py-2 pr-4">
                                          {r.time_in ? dayjs(r.time_in).format("hh:mm A") : "—"}
                                        </td>
                                        <td className="py-2 pr-4">
                                          {r.time_out ? dayjs(r.time_out).format("hh:mm A") : "—"}
                                        </td>
                                        <td className="py-2">
                                          {r.hours_worked > 0 ? `${r.hours_worked}h` : "—"}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          )}

                          {/* Logs List */}
                          {view === "logs" && (
                            <div>
                              {logs.length === 0 ? (
                                <p className="text-center text-gray-400 text-xs py-4">No logs yet.</p>
                              ) : (
                                <ul className="flex flex-col gap-2">
                                  {logs.map((log) => (
                                    <li key={log.id} className="bg-white rounded p-3 border">
                                      <p className="font-semibold text-gray-800 text-sm">{log.title}</p>
                                      {log.description && (
                                        <p className="text-gray-500 text-xs mt-1">{log.description}</p>
                                      )}
                                      <p className="text-xs text-gray-400 mt-1">
                                        📅 {dayjs(log.date).format("MMMM D, YYYY")}
                                      </p>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <InternPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

    </div>
  );
}