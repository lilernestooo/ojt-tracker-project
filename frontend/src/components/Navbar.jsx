// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex gap-4 font-bold text-lg">
        <Link to="/dashboard" className="hover:text-gray-200 transition">Dashboard</Link>
        <Link to="/logs" className="hover:text-gray-200 transition">Logs</Link>
      </div>
      <button
        onClick={logout}
        className="bg-red-500 px-3 py-1 rounded-none hover:bg-red-600 transition"
      >
        Logout
      </button>
    </nav>
  );
}