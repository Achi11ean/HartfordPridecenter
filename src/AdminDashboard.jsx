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
import RequestEvent from "./RequestEvent";
import CreateServices from "./CreateServices";
import ManageServices from "./ManageServices";
import CreateVendor from "./CreateVendor";
import ManageVendors from "./ManageVendors";
import ManageContacts from "./ManageContacts";
import AdminMessaging from "./AdminMessaging";
import ManageSubscribers from "./ManageSubscribers";
import CreateNewsletters from "./CreateNewsletters";
import CreateCommittee from "./CreateCommittee";
import ManageCommittee from "./ManageCommittee";
import PastNewsletters from "./PastNewsletters";
import CommitteesPublic from "./CommitteesPublic";
import CreateFunder from "./CreateFunder";
import ManageFunders from "./ManageFunders";
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
const [servicesSubTab, setServicesSubTab] = useState("add");
const [vendorsSubTab, setVendorsSubTab] = useState("add");
const [newsletterSubTab, setNewsletterSubTab] = useState("subscribers");
const [committeesSubTab, setCommitteesSubTab] = useState("create");
const [fundersSubTab, setFundersSubTab] = useState("create");


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
const [sponsorSubTab, setSponsorSubTab] = useState("add_prospect");



 return (
  <div className="min-h-screen bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25] text-yellow-100 pb-16 pt-24">
    <div className="max-w-full px-1 mx-auto px">

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
 

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
  label="Committees"
  active={activeTab === "committees"}
  onClick={() => setActiveTab("committees")}
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
  label="Vendors"
  active={activeTab === "vendors"}
  onClick={() => setActiveTab("vendors")}
/>
<TabButton
  label="Funders"
  active={activeTab === "funders"}
  onClick={() => setActiveTab("funders")}
/>

<TabButton
  label="Events"
  active={activeTab === "events"}
  onClick={() => setActiveTab("events")}
/>

<TabButton
  label="Services"
  active={activeTab === "services"}
  onClick={() => setActiveTab("services")}
/>
<TabButton
  label="Contacts"
  active={activeTab === "contacts"}
  onClick={() => setActiveTab("contacts")}
/>
<TabButton
  label="Messaging"
  active={activeTab === "messaging"}
  onClick={() => setActiveTab("messaging")}
/>
<TabButton
  label="Newsletters"
  active={activeTab === "newsletters"}
  onClick={() => setActiveTab("newsletters")}
/>


          </div>
        </aside>

        {/* RIGHT COLUMN — Content */}
        <section className="
          bg-black/40 border border-white w-full
          rounded-none mt-6 p-6 justify-center items-center flex
          shadow-2xl min-h-[300px]
        ">
            {activeTab === "vendors" && (
  <div className="w-full space-y-6">

    {/* Vendors Sub Tabs */}
    <div className="flex gap-3 flex-wrap">
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

    {/* Sub Tab Content */}
    {vendorsSubTab === "add" && <CreateVendor />}

    {vendorsSubTab === "manage" && (
      <ManageVendors />

    )}

  </div>
)}

{activeTab === "funders" && (
  <div className="w-full space-y-6">

    {/* Funders Sub Tabs */}
    <div className="flex gap-3 flex-wrap">
      <SubTabButton
        label="➕ Create"
        active={fundersSubTab === "create"}
        onClick={() => setFundersSubTab("create")}
      />
      <SubTabButton
        label="🛠 Manage"
        active={fundersSubTab === "manage"}
        onClick={() => setFundersSubTab("manage")}
      />
    </div>

    {/* Sub Tab Content */}
    {fundersSubTab === "create" && <CreateFunder />}
    {fundersSubTab === "manage" && <ManageFunders />}

  </div>
)}

{activeTab === "committees" && (
  <div className="w-full space-y-6">

    {/* Committees Sub Tabs */}
    <div className="flex gap-3 flex-wrap">
      <SubTabButton
        label="➕ Create"
        active={committeesSubTab === "create"}
        onClick={() => setCommitteesSubTab("create")}
      />
      <SubTabButton
        label="🛠 Manage"
        active={committeesSubTab === "manage"}
        onClick={() => setCommitteesSubTab("manage")}
      />
      <SubTabButton
        label="👁 View"
        active={committeesSubTab === "view"}
        onClick={() => setCommitteesSubTab("view")}
      />
    </div>

    {/* Sub Tab Content */}
    {committeesSubTab === "create" && <CreateCommittee />}
    {committeesSubTab === "manage" && <ManageCommittee />}
    {committeesSubTab === "view" && <CommitteesPublic />}



  </div>
)}


{activeTab === "messaging" && <AdminMessaging />}

          {activeTab === "staff" && <Staff />}
          {activeTab === "volunteers" && <Volunteers />}
          {activeTab === "services" && (
  <div className="w-full space-y-6">

    {/* Services Sub Tabs */}
    <div className="flex gap-3 flex-wrap">
      <SubTabButton
        label="➕ Add Service"
        active={servicesSubTab === "add"}
        onClick={() => setServicesSubTab("add")}
      />
      <SubTabButton
        label="🛠 Manage Services"
        active={servicesSubTab === "manage"}
        onClick={() => setServicesSubTab("manage")}
      />
    </div>

    {/* Sub Tab Content */}
    {servicesSubTab === "add" && <CreateServices />}

  {servicesSubTab === "manage" && <ManageServices />}

  </div>
)}
{activeTab === "newsletters" && (
  <div className="w-full space-y-6">

    {/* Newsletter Sub Tabs */}
    <div className="flex gap-3 flex-wrap">
      <SubTabButton
        label="Subscribers"
        active={newsletterSubTab === "subscribers"}
        onClick={() => setNewsletterSubTab("subscribers")}
      />

      <SubTabButton
        label="Create"
        active={newsletterSubTab === "create"}
        onClick={() => setNewsletterSubTab("create")}
      />
            <SubTabButton
        label="Past Letters"
        active={newsletterSubTab === "past"}
        onClick={() => setNewsletterSubTab("past")}
      />
    </div>

    {/* Sub Tab Content */}
    {newsletterSubTab === "subscribers" && (
      <ManageSubscribers prideId={1} />
    )}

    {newsletterSubTab === "create" && (
<CreateNewsletters prideId={1} />
    )}
    {newsletterSubTab === "past" && (
<PastNewsletters prideId={user?.pride_id} />
)}

  </div>
)}

{activeTab === "sponsors" && (
  <div className="space-y-6">

    {/* Sponsor Sub Tabs */}
<div className="flex gap-3 flex-wrap">
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

{activeTab === "contacts" && <ManageContacts />}

{activeTab === "events" && (
  <div className="w-full">
    <RequestEvent />
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
        w-full py-3 rounded-none font-semibold transition text-xl
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

