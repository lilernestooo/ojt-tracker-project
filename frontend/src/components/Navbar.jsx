import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LayoutDashboard, NotebookPen, User, LogOut, Menu, X, ShieldCheck } from "lucide-react";
import logo from "../assets/logo (2).png";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const activeClass = "flex items-center gap-2 bg-blue-900 bg-opacity-50 px-3 py-2 rounded-lg text-white font-semibold text-sm";
  const inactiveClass = "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-900 hover:bg-opacity-30 transition text-white text-sm";

  const navLinks = (
    <>
      {/* Admin link — only for admin */}
      {isAdmin && (
        <NavLink
          to="/admin"
          className={({ isActive }) => isActive ? activeClass : inactiveClass}
          onClick={() => setMenuOpen(false)}
        >
          <ShieldCheck size={16} />
          Admin
        </NavLink>
      )}

      {/* Intern links — only for interns */}
      {!isAdmin && (
        <>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => isActive ? activeClass : inactiveClass}
            onClick={() => setMenuOpen(false)}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink
            to="/logs"
            className={({ isActive }) => isActive ? activeClass : inactiveClass}
            onClick={() => setMenuOpen(false)}
          >
            <NotebookPen size={16} />
            Logs
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white shadow-md">

      {/* Main bar */}
      <div className="px-6 py-3 flex justify-between items-center">

        {/* Left — App name + Nav Links (desktop) */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="TrackMe Logo" className="h-8 w-8 object-contain" />
            <span className="text-lg font-bold tracking-wide text-white">
              TrackMe!
            </span>
          </div>
          <div className="hidden md:flex gap-2">
            {navLinks}
          </div>
        </div>

        {/* Right — User name, Logout (desktop) + Hamburger (mobile) */}
        <div className="flex items-center gap-4 text-sm">

          {/* User name — hidden on mobile */}
          {user?.name && (
            <span className="hidden md:flex items-center gap-1 text-blue-100">
              <User size={16} />
              {user.name}
              {isAdmin && (
                <span className="ml-1 text-xs bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full font-semibold">
                  Admin
                </span>
              )}
            </span>
          )}

          {/* Logout — hidden on mobile */}
          <button
            onClick={logout}
            className="hidden md:flex items-center gap-1 bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={16} />
            Logout
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-2 border-t border-blue-400 pt-3">
          {navLinks}

          {/* User name */}
          {user?.name && (
            <span className="flex items-center gap-2 text-blue-100 text-sm px-3 py-2">
              <User size={16} />
              {user.name}
              {isAdmin && (
                <span className="text-xs bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full font-semibold">
                  Admin
                </span>
              )}
            </span>
          )}

          {/* Logout */}
          <button
            onClick={() => { logout(); setMenuOpen(false); }}
            className="flex items-center gap-2 bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600 transition text-white text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}

    </nav>
  );
}