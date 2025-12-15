import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = "https://singspacebackend.onrender.com";

export default function AdminSignup() {
  const [prides, setPrides] = useState([]);
  const [loading, setLoading] = useState(false);
const [successData, setSuccessData] = useState(null);

  const [form, setForm] = useState({
    pride_id: "",
    name: "",
    email: "",
    username: "",
    pin: "",
  });

  // ───────────────────────────────
  // Load Pride Centers (auto-select first)
  // ───────────────────────────────
  useEffect(() => {
    fetchPrides();
  }, []);

  const fetchPrides = async () => {
    try {
      const res = await axios.get(`${API}/api/pride/active`);
      const list = res.data || [];
      setPrides(list);

      if (list.length > 0) {
        // ✅ Auto-lock to first Pride Center
        setForm((prev) => ({
          ...prev,
          pride_id: list[0].id,
        }));
      }
    } catch (err) {
      toast.error("Failed to load Pride Centers");
    }
  };

  // ───────────────────────────────
  // Form Handlers
  // ───────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const prideName =
    prides.find((p) => p.id === form.pride_id)?.name || "Loading…";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

  try {
  const res = await axios.post(
    `${API}/api/pride/${form.pride_id}/admins`,
    {
      name: form.name,
      email: form.email,
      username: form.username,
      pin: form.pin,
    }
  );

  const admin = res.data?.admin;

setSuccessData({
  prideName,
  name: admin?.name,
  username: admin?.username,
  isActive: admin?.is_active,
});

  toast.success("Pride admin created successfully 🎉");

  setForm({
    pride_id: form.pride_id,
    name: "",
    email: "",
    username: "",
    pin: "",
  });
} catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to create Pride admin"
      );
    } finally {
      setLoading(false);
    }
  };


  // ───────────────────────────────
  // UI
  // ───────────────────────────────
  return (
    <div className="
       w-full
      bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25]
      flex items-center justify-center
      px-4 py-6
    ">
      <div className="
        w-full max-w-full
        bg-black/60 backdrop-blur-xl
        border border-yellow-500/40
        rounded-3xl shadow-2xl
        p-8
      ">
        <h1 className="text-4xl font-extrabold text-center text-yellow-300 mb-2">
          🏳️‍🌈 Pride Admin Signup
        </h1>

        <p className="text-center text-yellow-200 mb-8">
          Admin account for:
          <span className="block mt-1 text-yellow-400 font-bold">
            {prideName}
          </span>
        </p>

<form
  onSubmit={handleSubmit}
  className="space-y-4"
  style={{ pointerEvents: successData ? "none" : "auto", opacity: successData ? 0.4 : 1 }}
>
          {/* Locked Pride Center */}
          <input
            type="text"
            value={prideName}
            disabled
            className="
              w-full p-3 rounded-xl
              bg-black/30 border border-yellow-500/30
              text-yellow-300 font-bold cursor-not-allowed
            "
          />

          <input
          autoFocus
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
          />

          <input
            type="text"
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
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder="PIN"
  value={form.pin}
  onChange={handleChange}
  required
  className="w-full p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
/>


          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-4 py-3 rounded-xl
              font-extrabold tracking-wide
              bg-gradient-to-r from-yellow-400 to-yellow-600
              text-black shadow-lg
              hover:scale-105 transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Creating Admin..." : "Create Pride Admin"}
          </button>
        </form>

      </div>
      {successData && (
  <div className="
    fixed inset-0 z-50
    bg-black/70 backdrop-blur-sm
    flex items-center justify-center
    px-4
  ">
    <div className="
      w-full max-w-md
      bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25]
      border border-yellow-400/50
      rounded-3xl shadow-2xl
      p-8 text-center
      animate-fade-in
    ">
      <h2 className="text-3xl font-extrabold text-yellow-300 mb-2">
        🎉 Admin Created!
      </h2>

      <p className="text-yellow-200 mb-4">
        Pride Center
        <span className="block text-yellow-400 font-bold mt-1">
          {successData.prideName}
        </span>
      </p>

      <div className="bg-black/50 border border-yellow-500/30 rounded-xl p-4 mb-4">
        <p className="text-yellow-200">
          <strong>Name:</strong> {successData.name}
        </p>
        <p className="text-yellow-200">
          <strong>Username:</strong> {successData.username}
        </p>
        <p className={`mt-2 font-bold ${
          successData.isActive
            ? "text-green-400"
            : "text-orange-400"
        }`}>
          {successData.isActive
            ? "✅ Admin is active immediately"
            : "⏳ Admin pending activation"}
        </p>
      </div>

      <button
        onClick={() => setSuccessData(null)}
        className="
          w-full mt-2 py-3 rounded-xl
          bg-gradient-to-r from-yellow-400 to-yellow-600
          text-black font-extrabold
          shadow-lg hover:scale-105 transition
        "
      >
        Create Another Admin
      </button>
    </div>
  </div>
)}

    </div>
  );
}
