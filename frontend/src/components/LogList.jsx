import dayjs from "dayjs";

export default function LogList({ logs, onEdit, onDelete }) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400 text-sm">
        No logs yet. Start by adding your first daily log!
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {logs.map((log) => (
        <li key={log.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            {/* Log info */}
            <div className="flex-1 pr-4">
              <p className="font-semibold text-gray-800">{log.title}</p>
              {log.description && (
                <p className="text-gray-500 text-sm mt-1">{log.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                📅 {dayjs(log.date).format("MMMM D, YYYY")}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onEdit(log)}
                className="bg-yellow-400 text-gray-800 px-3 py-1 rounded text-sm hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(log.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}