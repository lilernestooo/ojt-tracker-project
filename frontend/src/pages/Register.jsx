import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    required_hours: 600,
    previous_hours: 0,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/register", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg p-8 w-full max-w-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-1">Create Account</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Set up your OJT tracker</p>

        {error && <p className="text-red-500 mb-4 text-center text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Basic Info */}
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            required
          />

          {/* OJT Hours */}
          <div className="border-t pt-4 mt-2">
            <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">
              OJT Hours Setup
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Required OJT Hours</label>
                <input
                  name="required_hours"
                  type="number"
                  value={form.required_hours}
                  onChange={handleChange}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  min="1"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">
                  Previous Hours <span className="text-gray-400">(hours before using this app)</span>
                </label>
                <input
                  name="previous_hours"
                  type="number"
                  value={form.previous_hours}
                  onChange={handleChange}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition text-sm font-semibold"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-gray-500 text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}