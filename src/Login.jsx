import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";

export default function Login() {
  const [mode, setMode] = useState("admin");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    pin: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const endpoint =
    mode === "admin"
      ? "/api/pride-admin/login"
      : "/api/pride-staff/login";

  try {
    const res = await axios.post(`${API}${endpoint}`, {
      username: form.username,
      pin: form.pin,
    });

    // 🔐 Store in AuthContext
    login({
      token: res.data.token,
      role: mode, // "admin" | "staff"
      user: mode === "admin" ? res.data.admin : res.data.staff,
    });

    toast.success(
      `Welcome ${mode === "admin" ? "Pride Admin" : "Pride Staff"} 🎉`
    );

    // 👉 ROLE-BASED REDIRECT
    if (mode === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/staff-dashboard");
    }
  } catch (err) {
    toast.error(err.response?.data?.error || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25] px-4">
      <div className="w-full max-w-md bg-black/60 border border-yellow-500/40 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center text-yellow-300 mb-6">
          🏳️‍🌈 Pride Login
        </h1>

        {/* Toggle */}
        <div className="flex mb-6 rounded-xl overflow-hidden border border-yellow-500/40">
          {["admin", "staff"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setMode(t)}
              className={`w-1/2 py-2 font-bold ${
                mode === t
                  ? "bg-yellow-400 text-black"
                  : "bg-black/40 text-yellow-200"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
          />

          <input
            type="password"
            name="pin"
            placeholder="PIN"
            value={form.pin}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-extrabold hover:scale-105 transition"
          >
            {loading ? "Logging in…" : `Login as ${mode}`}
          </button>
        </form>
      </div>
    </div>
  );
}
