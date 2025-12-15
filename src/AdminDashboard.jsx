// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Admin from "./Admin";
import Volunteers from "./Volunteers";
import Sponsors from "./Sponsors";
// Tabs
import Staff from "./Staff"; // 👈 your new component

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("staff");

  // 🔒 Guard: admin-only
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25] text-yellow-100 px-6 py-24">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-yellow-300">
            🏳️‍🌈 Pride Admin Dashboard
          </h1>
          <p className="text-yellow-200 mt-2">
            Welcome back, <span className="font-bold">{user?.name}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <TabButton
            label="Staff"
            active={activeTab === "staff"}
            onClick={() => setActiveTab("staff")}
          />
          <TabButton
            label="Volunteers"
            active={activeTab === "volunteers"}
            onClick={() => setActiveTab("volunteers")}
          />
          <TabButton
            label="Sponsors"
            active={activeTab === "sponsors"}
            onClick={() => setActiveTab("sponsors")}
          />
          <TabButton
            label="Admins"
            active={activeTab === "admins"}
            onClick={() => setActiveTab("admins")}
          />
          <TabButton
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </div>

        {/* Content */}
        <div className="bg-black/60 border border-yellow-500/30 rounded-3xl p-6 shadow-2xl">
          {activeTab === "staff" && <Staff />}
{activeTab === "volunteers" && <Volunteers />}

          {activeTab === "sponsors" && (
<Sponsors/>          )}
          {activeTab === "admins" && (
<Admin />
          )}
          {activeTab === "settings" && (
            <Placeholder title="Pride Settings" />
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-10 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────────── */
/* Reusable Components */
/* ───────────────────────────── */

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2 rounded-xl font-bold transition
        ${
          active
            ? "bg-yellow-400 text-black shadow-lg"
            : "bg-black/50 text-yellow-200 border border-yellow-500/30 hover:bg-black/70"
        }
      `}
    >
      {label}
    </button>
  );
}

function Placeholder({ title }) {
  return (
    <div className="text-center py-20 text-yellow-200">
      <h2 className="text-2xl font-bold text-yellow-300 mb-2">
        {title}
      </h2>
      <p className="opacity-80">
        This section is coming next.
      </p>
    </div>
  );
}
