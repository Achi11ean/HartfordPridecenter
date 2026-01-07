// StaffDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateProspect from "./CreateProspect";
import ManageProspects from "./ManageProspects";
import Volunteers from "./Volunteers";
import Sponsor from "./Sponsor";     // Add Sponsor
import Sponsors from "./Sponsors";   // Manage Sponsors
import CreateVendor from "./CreateVendor";
import ManageVendors from "./ManageVendors";
import ManageContacts from "./ManageContacts";
import AdminMessaging from "./AdminMessaging";

export default function StaffDashboard() {
  const navigate = useNavigate();
const [vendorsSubTab, setVendorsSubTab] = useState("add");

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
  <div className="min-h-screen bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25] text-yellow-100 px-4 py-10">
    <div className="max-w-7xl mx-auto space-y-10">

      {/* ───────── HEADER CARD ───────── */}
      <div className="
        bg-black/50 border mt-24 border-yellow-500/30
        rounded-3xl p-6 shadow-xl
        flex flex-col md:flex-row md:items-center md:justify-between
        gap-6
      ">
        <div>
          <h1 className="text-4xl font-extrabold text-yellow-300">
            👋 Staff Dashboard
          </h1>
          <p className="text-yellow-200 mt-1">
            Welcome back,&nbsp;
            <span className="font-bold">
              {staff.first_name} {staff.last_name}
            </span>
          </p>
        </div>
      </div>

      {/* ───────── PRIMARY TABS ───────── */}
      <div className="
        flex flex-wrap gap-3
        bg-black/40 border border-yellow-500/20
        rounded-2xl p-3
      ">
        {[
          ["dashboard", "Dashboard"],
          ["sponsors", "Sponsors"],
          ["volunteers", "Volunteers"],
          ["vendors", "Vendors"],
          ["contacts", "Contacts"],
          ["messaging", "Messaging"],
        ].map(([id, label]) => (
          <TabButton
            key={id}
            label={label}
            active={activeTab === id}
            onClick={() => setActiveTab(id)}
          />
        ))}
      </div>

      {/* ───────── CONTENT PANEL ───────── */}
      <div className="
        bg-black/50 border border-yellow-500/30
        rounded-3xl p-6 shadow-xl
      ">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StaffCard title="My Profile" />
            <StaffCard title="Volunteer Info" />
            <StaffCard title="Sponsor Messages" />
            <StaffCard title="Pride Announcements" />
          </div>
        )}

        {/* MESSAGING */}
        {activeTab === "messaging" && <AdminMessaging />}

        {/* VOLUNTEERS */}
        {activeTab === "volunteers" && <Volunteers />}

        {/* VENDORS */}
        {activeTab === "vendors" && (
          <div className="space-y-6">

            {/* Vendor Sub Tabs */}
            <div className="flex flex-wrap gap-3 border-b border-yellow-500/20 pb-4">
              <SubTabButton
                label="➕ Add Vendor"
                active={vendorsSubTab === "add"}
                onClick={() => setVendorsSubTab("add")}
              />
              <SubTabButton
                label="🛠 Manage Vendors"
                active={vendorsSubTab === "manage"}
                onClick={() => setVendorsSubTab("manage")}
              />
            </div>

            {/* Vendor Content */}
            <div className="pt-4">
              {vendorsSubTab === "add" && <CreateVendor />}
              {vendorsSubTab === "manage" && <ManageVendors />}
            </div>
          </div>
        )}

        {/* SPONSORS */}
        {activeTab === "sponsors" && (
          <div className="space-y-6">

            {/* Sponsor Sub Tabs */}
            <div className="flex flex-wrap gap-3 border-b border-yellow-500/20 pb-4">
              <SubTabButton
                label="Add Prospect"
                active={sponsorSubTab === "add_prospect"}
                onClick={() => setSponsorSubTab("add_prospect")}
              />
              <SubTabButton
                label="Manage Prospects"
                active={sponsorSubTab === "manage_prospects"}
                onClick={() => setSponsorSubTab("manage_prospects")}
              />
              <SubTabButton
                label="Add Sponsor"
                active={sponsorSubTab === "add"}
                onClick={() => setSponsorSubTab("add")}
              />
              <SubTabButton
                label="Manage Sponsors"
                active={sponsorSubTab === "manage"}
                onClick={() => setSponsorSubTab("manage")}
              />
            </div>

            {/* Sponsor Content */}
            <div className="pt-4">
              {sponsorSubTab === "add" && <Sponsor />}
              {sponsorSubTab === "manage" && <Sponsors />}
              {sponsorSubTab === "add_prospect" && <CreateProspect />}
              {sponsorSubTab === "manage_prospects" && (
                <ManageProspects onConvert={() => setSponsorSubTab("add")} />
              )}
            </div>
          </div>
        )}

      </div>
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
