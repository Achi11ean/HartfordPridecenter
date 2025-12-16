// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Admin from "./Admin";
import Volunteers from "./Volunteers";
import Sponsors from "./Sponsors";
import Sponsor from "./Sponsor";
import Staff from "./Staff"; // 👈 your new component
import CreateProspect from "./CreateProspect";
import ManageProspects from "./ManageProspects";

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
  console.log("AUTH USER:", user);
const [sponsorSubTab, setSponsorSubTab] = useState("add");



 return (
  <div className="min-h-screen bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25] text-yellow-100 pb-16 pt-24">
    <div className="max-w-7xl mx-auto px">

      {/* Header */}
      <div className="mb-10 mt-16 text-center sm:text-left">
        <h1 className="text-4xl border-b font-extrabold text-yellow-300">
          🏳️‍🌈 Admin Dashboard
        </h1>
        <p className="text-yellow-200 mt-2">
          Welcome back, <span className="font-bold">{user?.name}</span>
        </p>
      </div>

      {/* Main Grid */}
      <div className="">

        {/* LEFT COLUMN — Tabs */}
        <aside className="
          
   p-2 space-y-3
    
        ">
 

          <div className="grid grid-cols-3 gap-3">
                        <TabButton
              label="Admins"
              active={activeTab === "admins"}
              onClick={() => setActiveTab("admins")}
            />
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
              label="Settings"
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            />
          </div>
        </aside>

        {/* RIGHT COLUMN — Content */}
        <section className="
          bg-black/40 border border-yellow-500/20
          rounded-2xl p-6 justify-center items-center flex
          shadow-2xl min-h-[300px]
        ">
          {activeTab === "staff" && <Staff />}
          {activeTab === "volunteers" && <Volunteers />}
{activeTab === "sponsors" && (
  <div className="space-y-6">

    {/* Sponsor Sub Tabs */}
<div className="flex gap-3 flex-wrap">
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
  <SubTabButton
    label="🌱 Add Prospect"
    active={sponsorSubTab === "add_prospect"}
    onClick={() => setSponsorSubTab("add_prospect")}
  />
  <SubTabButton
    label="📋 Manage Prospects"
    active={sponsorSubTab === "manage_prospects"}
    onClick={() => setSponsorSubTab("manage_prospects")}
  />
</div>


    {/* Sub Tab Content */}
<div >
  {sponsorSubTab === "add" && <Sponsor />}

  {sponsorSubTab === "manage" && <Sponsors />}

  {sponsorSubTab === "add_prospect" && <CreateProspect />}

  {sponsorSubTab === "manage_prospects" && (
<ManageProspects
  onConvert={() => setSponsorSubTab("add")}
/>

  )}
</div>


  </div>
)}
          {activeTab === "admins" && <Admin />}
          {activeTab === "settings" && (
            <Placeholder title="Pride Settings" />
          )}
        </section>

      </div>
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
        w-full py-3 rounded-xl font-semibold transition text-sm
        ${
          active
            ? "bg-yellow-400 text-black shadow-md"
            : "bg-black/50 text-yellow-200 border border-yellow-500/30 hover:bg-black/70"
        }
      `}
    >
      {label}
    </button>
  );
}


function SubTabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg text-sm font-bold transition
        ${
          active
            ? "bg-yellow-300 text-black shadow"
            : "bg-black/60 text-yellow-200 hover:bg-yellow-300/20"
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

