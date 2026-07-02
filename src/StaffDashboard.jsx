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
import Contacts from "./ManageContacts";
import ManageSubscribers from "./ManageSubscribers"; // Import ManageSubscribers
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
  <div className="relative min-h-screen overflow-hidden bg-[#07130f] text-yellow-100 px-4 py-10">
    {/* Background Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-black to-yellow-950" />
    <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />
    <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

    <div className="relative z-10 max-w-7xl mx-auto space-y-10 pt-24">

      {/* HEADER */}
      <div
        className="
          relative overflow-hidden rounded-[2rem]
          border border-yellow-400/20
          bg-black/50 backdrop-blur-xl
          shadow-[0_30px_80px_rgba(0,0,0,.65)]
          p-7 md:p-8
        "
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,.18),transparent_40%)]" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-yellow-400 font-bold">
              Pride Staff Portal
            </p>

            <h1 className="mt-2 text-4xl md:text-5xl font-black text-yellow-300">
              👋 Staff Dashboard
            </h1>

            <p className="mt-3 text-yellow-100/70">
              Welcome back,{" "}
              <span className="font-black text-white">
                {staff.first_name || "Staff"}!
              </span>
            </p>
          </div>

          <button
            onClick={logout}
            className="
              rounded-2xl px-5 py-3
              bg-red-500/15 border border-red-400/30
              text-red-200 font-black
              hover:bg-red-500/25 transition
            "
          >
            Logout
          </button>
        </div>
      </div>

      {/* PRIMARY TABS */}
      <div
        className="
          rounded-[2rem]
          border border-yellow-400/20
          bg-black/40 backdrop-blur-xl
          p-3 shadow-xl
        "
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {[
            ["dashboard", "🏠", "Dashboard"],
            ["sponsors", "💎", "Sponsors"],
            ["volunteers", "🤝", "Volunteers"],
            ["subscribers", "📬", "Subscribers"],
            ["vendors", "🛍", "Vendors"],
            ["contacts", "👥", "Contacts"],
            ["messaging", "💌", "Messaging"],
          ].map(([id, icon, label]) => (
            <TabButton
              key={id}
              icon={icon}
              label={label}
              active={activeTab === id}
              onClick={() => setActiveTab(id)}
            />
          ))}
        </div>
      </div>

      {/* CONTENT PANEL */}
      <div
        className="
          relative overflow-hidden rounded-[2rem]
          border border-yellow-400/20
          bg-black/50 backdrop-blur-xl
          shadow-[0_30px_80px_rgba(0,0,0,.6)]
          p-5 md:p-7
        "
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,215,0,.10),transparent_35%)]" />

        <div className="relative z-10">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <StaffCard icon="👤" title="My Profile" desc="View and manage your staff information." />
              <StaffCard icon="🤝" title="Volunteer Info" desc="Review community volunteer submissions." />
              <StaffCard icon="💎" title="Sponsor Messages" desc="Track sponsors, prospects, and outreach." />
              <StaffCard icon="📣" title="Pride Announcements" desc="Manage important event updates." />
            </div>
          )}

          {activeTab === "messaging" && <AdminMessaging />}
          {activeTab === "volunteers" && <Volunteers />}
          {activeTab === "subscribers" && <ManageSubscribers />}

          {activeTab === "vendors" && (
            <div className="space-y-6">
              <SubTabs>
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
              </SubTabs>

              {vendorsSubTab === "add" && <CreateVendor />}
              {vendorsSubTab === "manage" && <ManageVendors />}
            </div>
          )}

          {activeTab === "sponsors" && (
            <div className="space-y-6">
              <SubTabs>
                <SubTabButton
                  label="✨ Add Prospect"
                  active={sponsorSubTab === "add_prospect"}
                  onClick={() => setSponsorSubTab("add_prospect")}
                />
                <SubTabButton
                  label="📋 Manage Prospects"
                  active={sponsorSubTab === "manage_prospects"}
                  onClick={() => setSponsorSubTab("manage_prospects")}
                />
                <SubTabButton
                  label="💎 Add Sponsor"
                  active={sponsorSubTab === "add"}
                  onClick={() => setSponsorSubTab("add")}
                />
                <SubTabButton
                  label="🏆 Manage Sponsors"
                  active={sponsorSubTab === "manage"}
                  onClick={() => setSponsorSubTab("manage")}
                />
              </SubTabs>

              {sponsorSubTab === "add" && <Sponsor />}
              {sponsorSubTab === "manage" && <Sponsors />}
              {sponsorSubTab === "add_prospect" && <CreateProspect />}
              {sponsorSubTab === "manage_prospects" && (
                <ManageProspects onConvert={() => setSponsorSubTab("add")} />
              )}
            </div>
          )}

          {activeTab === "contacts" && <Contacts />}
        </div>
      </div>
    </div>
  </div>
);

}

function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl px-4 py-4
        font-black transition-all duration-300
        border
        ${
          active
            ? "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 text-black border-yellow-200 shadow-[0_0_35px_rgba(255,215,0,.35)]"
            : "bg-white/5 text-yellow-100/70 border-white/10 hover:bg-yellow-400/10 hover:text-yellow-200 hover:border-yellow-400/30"
        }
      `}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs uppercase tracking-widest">{label}</div>
    </button>
  );
}

function SubTabs({ children }) {
  return (
    <div
      className="
        flex flex-wrap gap-3
        rounded-2xl
        border border-yellow-400/15
        bg-black/40
        p-3
      "
    >
      {children}
    </div>
  );
}

function SubTabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-3 rounded-xl text-sm font-black transition
        ${
          active
            ? "bg-yellow-300 text-black shadow-[0_0_25px_rgba(255,215,0,.25)]"
            : "bg-white/5 border border-white/10 text-yellow-100/70 hover:bg-yellow-300/10 hover:text-yellow-200"
        }
      `}
    >
      {label}
    </button>
  );
}

function StaffCard({ icon, title, desc }) {
  return (
    <div
      className="
        group relative overflow-hidden rounded-[1.75rem]
        border border-yellow-400/15
        bg-gradient-to-br from-yellow-500/10 via-black/70 to-emerald-500/10
        p-6 shadow-xl
        hover:-translate-y-1 hover:border-yellow-400/40
        transition-all duration-300
      "
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,.16),transparent_45%)]" />

      <div className="relative z-10">
        <div className="text-4xl mb-5">{icon}</div>

        <h3 className="text-xl font-black text-yellow-300">
          {title}
        </h3>

        <p className="text-sm text-yellow-100/60 mt-2 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}