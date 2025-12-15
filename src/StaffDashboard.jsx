// StaffDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ⬇️ Import your sponsor components
import Sponsor from "./Sponsor";     // Add Sponsor
import Sponsors from "./Sponsors";   // Manage Sponsors

export default function StaffDashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("prideToken");
  const role = localStorage.getItem("prideRole");
  const staff = JSON.parse(localStorage.getItem("prideUser") || "{}");

  // 🧭 Tabs
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sponsorSubTab, setSponsorSubTab] = useState("add");

  // 🔒 Guard
  useEffect(() => {
    if (!token || role !== "staff") {
      navigate("/login");
    }
  }, [token, role, navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25] text-yellow-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-yellow-300 mb-2">
          👋 Staff Dashboard
        </h1>

        <p className="text-yellow-200 mb-8">
          Welcome,{" "}
          <span className="font-bold">
            {staff.first_name} {staff.last_name}
          </span>
        </p>

        {/* Top Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <TabButton
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <TabButton
            label="Sponsors"
            active={activeTab === "sponsors"}
            onClick={() => setActiveTab("sponsors")}
          />
        </div>

        {/* DASHBOARD VIEW */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StaffCard title="My Profile" />
            <StaffCard title="Volunteer Info" />
            <StaffCard title="Sponsor Messages" />
            <StaffCard title="Pride Announcements" />
          </div>
        )}

        {/* SPONSORS VIEW */}
        {activeTab === "sponsors" && (
          <div className="bg-black/50 border border-yellow-500/30 rounded-2xl p-6 shadow-xl">

            {/* Sponsor Sub Tabs */}
            <div className="flex gap-4 mb-6">
              <SubTabButton
                label="➕ Add Sponsor"
                active={sponsorSubTab === "add"}
                onClick={() => setSponsorSubTab("add")}
              />
              <SubTabButton
                label="🛠 Manage Sponsors"
                active={sponsorSubTab === "manage"}
                onClick={() => setSponsorSubTab("manage")}
              />
            </div>

            {/* Sub Tab Content */}
            {sponsorSubTab === "add" && <Sponsor />}
            {sponsorSubTab === "manage" && <Sponsors />}
          </div>
        )}


      </div>
    </div>
  );
}

/* -------------------- Reusable Components -------------------- */

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-xl font-bold transition
        ${
          active
            ? "bg-yellow-400 text-black"
            : "bg-black/60 text-yellow-200 hover:bg-yellow-400/20"
        }`}
    >
      {label}
    </button>
  );
}

function SubTabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-bold transition
        ${
          active
            ? "bg-yellow-300 text-black"
            : "bg-black/60 text-yellow-200 hover:bg-yellow-300/20"
        }`}
    >
      {label}
    </button>
  );
}

function StaffCard({ title }) {
  return (
    <div className="bg-black/60 border border-yellow-500/30 rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition">
      <h3 className="text-xl font-bold text-yellow-300">{title}</h3>
      <p className="text-sm text-yellow-200 mt-2">
        Access {title.toLowerCase()}
      </p>
    </div>
  );
}
