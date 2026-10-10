// Replace your existing AdminDashboard.jsx with this file.
// Styling is included and scoped. No additional packages or image assets required.
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Admin from "./Admin";
import Volunteers from "./Volunteers";
import Sponsors from "./Sponsors";
import Sponsor from "./Sponsor";
import Staff from "./Staff";
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
import CreateSpotlight from "./CreateSpotlight";
import ManageSpotlights from "./ManageSpotlight";

const MODULES = [
  { id: "staff", label: "Staff", group: "People & community", icon: "people", color: "#b9acf9", description: "Your people. Your shared purpose.", action: "Open staff", keywords: "team members" },
  { id: "volunteers", label: "Volunteers", group: "People & community", icon: "heart", color: "#f4a9cc", description: "Welcome helpers and celebrate their impact.", action: "Open volunteers", keywords: "submissions spotlight" },
  { id: "committees", label: "Committees", group: "People & community", icon: "network", color: "#99d9c5", description: "Bring great people together around a mission.", action: "Open committees", keywords: "create manage public" },
  { id: "contacts", label: "Contacts", group: "People & community", icon: "contact", color: "#96c8f5", description: "Keep your community connections close.", action: "Open contacts", keywords: "directory phone email" },
  { id: "sponsors", label: "Sponsors", group: "Partnerships", icon: "spark", color: "#ebc28d", description: "Turn promising connections into partnerships.", action: "Open sponsors", keywords: "prospects convert add manage" },
  { id: "vendors", label: "Vendors", group: "Partnerships", icon: "bag", color: "#a7d4a3", description: "Coordinate the businesses that show up for Pride.", action: "Open vendors", keywords: "add manage businesses" },
  { id: "funders", label: "Funders", group: "Partnerships", icon: "gift", color: "#e7acf0", description: "Build relationships that support your mission.", action: "Open funders", keywords: "create manage funding" },
  { id: "events", label: "Events", group: "Programs & outreach", icon: "calendar", color: "#f3a997", description: "Make room for your next meaningful gathering.", action: "Request an event", keywords: "request event planning" },
  { id: "services", label: "Services", group: "Programs & outreach", icon: "grid", color: "#94d7da", description: "Manage what your network has to offer.", action: "Open services", keywords: "add manage service" },
  { id: "messaging", label: "Messaging", group: "Programs & outreach", icon: "message", color: "#a9bafa", description: "Keep conversations moving forward.", action: "Open messaging", keywords: "inbox messages communication" },
  { id: "newsletters", label: "Newsletters", group: "Programs & outreach", icon: "mail", color: "#e9b3cd", description: "Share your story with the people who care.", action: "Open newsletters", keywords: "subscribers create past letters" },
  { id: "admins", label: "Admins", group: "Administration", icon: "shield", color: "#b9bdd2", description: "Manage the people entrusted with your network.", action: "Open admins", keywords: "admin administrators access" },
];
const GROUPS = [...new Set(MODULES.map((item) => item.group))];
const FLAGS = [
  { name: "Rainbow Pride", colors: ["#e40303", "#ff8c00", "#ffed00", "#008026", "#004dff", "#750787"] },
  { name: "Transgender Pride", colors: ["#5bcefa", "#f5a9b8", "#ffffff", "#f5a9b8", "#5bcefa"] },
  { name: "Bisexual Pride", colors: ["#d60270", "#d60270", "#9b4f96", "#0038a8", "#0038a8"] },
  { name: "Lesbian Pride", colors: ["#d52d00", "#ff9a56", "#ffffff", "#d362a4", "#a30262"] },
  { name: "Pansexual Pride", colors: ["#ff218c", "#ffd800", "#21b1ff"] },
  { name: "Nonbinary Pride", colors: ["#fff430", "#ffffff", "#9c59d1", "#2c2c2c"] },
  { name: "Asexual Pride", colors: ["#161616", "#a3a3a3", "#ffffff", "#800080"] },
  { name: "Genderqueer Pride", colors: ["#b57edc", "#ffffff", "#4a8123"] },
];
const NEON = ["#ff87a6", "#ffb17f", "#f7df84", "#9be8b2", "#86d9fa", "#bca4ff", "#efa0e1"];
const SUBTABS = {
  sponsors: [["add_prospect", "Add prospect"], ["manage_prospects", "Manage prospects"], ["add", "Add sponsor"], ["manage", "Manage sponsors"]],
  volunteers: [["submissions", "Submissions"], ["create_spotlight", "Create spotlight"], ["manage_spotlights", "Manage spotlights"]],
  committees: [["create", "Create committee"], ["manage", "Manage committees"], ["view", "Public view"]],
  funders: [["create", "Create funder"], ["manage", "Manage funders"]],
  services: [["add", "Add service"], ["manage", "Manage services"]],
  newsletters: [["subscribers", "Subscribers"], ["create", "Create newsletter"], ["past", "Past letters"]],
};

function Icon({ name, size = 20, ...props }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-4-5" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
    network: <><circle cx="12" cy="5" r="3" /><circle cx="5" cy="19" r="3" /><circle cx="19" cy="19" r="3" /><path d="M12 8v4M5 16v-4h14v4" /></>,
    contact: <><rect x="5" y="3" width="16" height="18" rx="3" /><circle cx="13" cy="9" r="2" /><path d="M9 17a4 4 0 0 1 8 0M3 7h3M3 12h3M3 17h3" /></>,
    spark: <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" />,
    bag: <><path d="M4 8h16l1 13H3L4 8ZM8 8V6a4 4 0 0 1 8 0v2" /></>,
    gift: <><path d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8H8a3 3 0 1 1 3-3l1 3Zm0 0h4a3 3 0 1 0-3-3l-1 3Z" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4M17 3v4M3 11h18M7 15h3M14 15h3M7 18h3" /></>,
    message: <path d="M21 11.5a9 9 0 0 1-9 9 10 10 0 0 1-4-.9L3 21l1.4-4.7A9 9 0 1 1 21 11.5Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    logout: <><path d="M9 4H4v16h5M10 12h11m-4-4 4 4-4 4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    play: <path d="m8 4 12 8-12 8V4Z" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.grid}</svg>;
}

function PrideFlag({ flag, index, animated = false }) {
  return <span className={`pn-flag ${animated ? "pn-flag-animated" : ""}`} style={{ "--flag-delay": `${index * 140}ms`, "--flag-tilt": `${index % 2 ? 7 : -7}deg` }} role="img" aria-label={flag.name} title={flag.name}>
    {flag.colors.map((color, i) => <span key={i} style={{ backgroundColor: color }} />)}
  </span>;
}

function PrideIntro({ onComplete }) {
  const skipRef = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(onComplete, reduce ? 1400 : 5400);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });
    return () => { window.clearTimeout(timer); document.body.style.overflow = previousOverflow; };
  }, [onComplete]);
  return <div className="pn-intro" onKeyDown={(event) => { if (event.key === "Escape") onComplete(); }} aria-label="Welcome to Pride Network">
    <div className="pn-intro-glow" aria-hidden="true" />
    <div className="pn-intro-inner">
      <p className="pn-eyebrow">Every identity. One community.</p>
      <div className="pn-intro-flags">{FLAGS.map((flag, index) => <PrideFlag key={flag.name} flag={flag} index={index} animated />)}</div>
      <h1 className="pn-neon" aria-label="Pride Network">
        {["Pride", "Network"].map((word, wordIndex) => <span className="pn-neon-word" key={word} aria-hidden="true">{[...word].map((letter, i) => <span key={i} style={{ "--neon": NEON[(i + wordIndex * 5) % NEON.length], "--letter-delay": `${400 + (i + wordIndex * 5) * 85}ms` }}>{letter}</span>)}</span>)}
      </h1>
      <p className="pn-powered">Powered by <strong>Karaoverse</strong></p>
      <button ref={skipRef} type="button" className="pn-skip" onClick={onComplete}>Skip intro <Icon name="arrow" size={14} /></button>
      <div className="pn-intro-progress" aria-hidden="true"><span /></div>
    </div>
  </div>;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [subTabs, setSubTabs] = useState({ services: "add", newsletters: "subscribers", committees: "create", funders: "create", volunteers: "create_spotlight", sponsors: "add_prospect" });
  const [showCreate, setShowCreate] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const headingRef = useRef(null);
  const shouldFocusHeading = useRef(false);
  const finishIntro = useCallback(() => { shouldFocusHeading.current = true; setShowIntro(false); }, []);

  // Preserve the original admin guard and login destination.
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) navigate("/login");
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    if (!showIntro && shouldFocusHeading.current) {
      headingRef.current?.focus({ preventScroll: true });
      shouldFocusHeading.current = false;
    }
  }, [showIntro, activeTab]);

  useEffect(() => {
    const handleKeys = (event) => {
      if (showIntro || !isAuthenticated || !isAdmin) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); searchRef.current?.focus();
      }
      if (event.key === "Escape") { setQuery(""); setMenuOpen(false); }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [showIntro, isAuthenticated, isAdmin]);

  const openModule = (id, subTab) => {
    shouldFocusHeading.current = true;
    setActiveTab(id);
    if (subTab) setSubTabs((previous) => ({ ...previous, [id]: subTab }));
    setMenuOpen(false);
    setQuery("");
    if (id === activeTab) { headingRef.current?.focus({ preventScroll: true }); shouldFocusHeading.current = false; }
  };
  const handleLogout = () => { logout(); navigate("/login"); };
  const current = MODULES.find((item) => item.id === activeTab);
  const filtered = MODULES.filter((item) => `${item.label} ${item.group} ${item.keywords}`.toLowerCase().includes(query.trim().toLowerCase()));
  const displayName = user?.name?.trim() || "friend";
  const firstName = displayName.split(/\s+/)[0];
  const initials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const currentSubTab = subTabs[activeTab];
  const updateSubTab = (value) => setSubTabs((previous) => ({ ...previous, [activeTab]: value }));

  const renderContent = () => {
    switch (activeTab) {
      case "admins": return <Admin />;
      case "staff": return <Staff />;
      case "contacts": return <ManageContacts />;
      case "messaging": return <AdminMessaging />;
      case "events": return <RequestEvent />;
      case "vendors": return <>
        <div className="pn-vendor-actions"><p>Add a new vendor or manage your existing partners.</p><button type="button" className="pn-primary" aria-expanded={showCreate} aria-controls="pn-create-vendor" onClick={() => setShowCreate((previous) => !previous)}><Icon name={showCreate ? "close" : "plus"} size={17} />{showCreate ? "Close form" : "Add vendor"}</button></div>
        {showCreate && <div className="pn-vendor-create" id="pn-create-vendor"><CreateVendor /></div>}
        <ManageVendors />
      </>;
      case "funders": return currentSubTab === "create" ? <CreateFunder /> : <ManageFunders />;
      case "committees": return currentSubTab === "create" ? <CreateCommittee /> : currentSubTab === "manage" ? <ManageCommittee /> : <CommitteesPublic />;
      case "volunteers": return currentSubTab === "submissions" ? <Volunteers /> : currentSubTab === "create_spotlight" ? <CreateSpotlight /> : <ManageSpotlights />;
      case "services": return currentSubTab === "add" ? <CreateServices /> : <ManageServices />;
      // Keep the original newsletter IDs and props exactly as provided.
      case "newsletters": return currentSubTab === "subscribers" ? <ManageSubscribers prideId={2} /> : currentSubTab === "create" ? <CreateNewsletters prideId={2} /> : <PastNewsletters prideId={user?.pride_id} />;
      case "sponsors": return currentSubTab === "add" ? <Sponsor /> : currentSubTab === "manage" ? <Sponsors /> : currentSubTab === "add_prospect" ? <CreateProspect /> : <ManageProspects onConvert={() => setSubTabs((previous) => ({ ...previous, sponsors: "add" }))} />;
      default: return null;
    }
  };

  if (!isAuthenticated || !isAdmin) return null;
  if (showIntro) return <><style>{STYLES}</style><PrideIntro onComplete={finishIntro} /></>;

  return <div className="pn-center">
    <style>{STYLES}</style>
    <a className="pn-skip-content" href="#pn-main">Skip to workspace</a>
    <div className="pn-shell">
      <header className="pn-topbar">
        <button type="button" className="pn-brand" onClick={() => openModule("home")} aria-label="Pride Network command center home"><span className="pn-brand-mark"><Icon name="spark" size={24} /></span><span><strong>Pride Network</strong><small>Powered by Karaoverse</small></span></button>
        <form className="pn-search" role="search" onSubmit={(event) => { event.preventDefault(); if (filtered.length) openModule(filtered[0].id); }}>
          <Icon name="search" size={18} /><input ref={searchRef} aria-label="Find a tool" placeholder="Find a tool…" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" aria-controls={query.trim() ? "pn-search-results" : undefined} />
          {query ? <button type="button" className="pn-search-clear" aria-label="Clear search" onClick={() => { setQuery(""); searchRef.current?.focus(); }}><Icon name="close" size={15} /></button> : <kbd>⌘ / Ctrl K</kbd>}
          {query.trim() && <div id="pn-search-results" className="pn-search-results"><p role="status">{filtered.length ? `${filtered.length} matching ${filtered.length === 1 ? "tool" : "tools"}` : "No matching tools. Try sponsors, events, or staff."}</p>{filtered.map((item) => <button type="button" key={item.id} onClick={() => openModule(item.id)}><span style={{ color: item.color }}><Icon name={item.icon} size={18} /></span><span>{item.label}<small>{item.group}</small></span><Icon name="arrow" size={15} /></button>)}</div>}
        </form>
        <div className="pn-account"><span className="pn-avatar" aria-hidden="true">{initials}</span><span className="pn-account-copy"><strong>{displayName}</strong><small>Administrator</small></span><button type="button" className="pn-icon-button" aria-label="Sign out" title="Sign out" onClick={handleLogout}><Icon name="logout" size={18} /></button></div>
      </header>

      <div className="pn-mobile-bar"><span>{current?.label || "Command Center"}</span><button type="button" aria-expanded={menuOpen} aria-controls="pn-navigation" onClick={() => setMenuOpen((previous) => !previous)}><Icon name={menuOpen ? "close" : "menu"} size={18} />{menuOpen ? "Close menu" : "All tools"}</button></div>
      <div className="pn-layout">
        <aside id="pn-navigation" className={`pn-sidebar ${menuOpen ? "pn-sidebar-open" : ""}`}>
          <nav aria-label="Command center navigation">
            <button type="button" className={`pn-nav-item pn-home-link ${activeTab === "home" ? "pn-selected" : ""}`} aria-current={activeTab === "home" ? "page" : undefined} onClick={() => openModule("home")}><Icon name="grid" size={18} /><span>Command Center</span></button>
            {GROUPS.map((group) => <div className="pn-nav-group" key={group}><p>{group}</p>{MODULES.filter((item) => item.group === group).map((item) => <button type="button" key={item.id} className={`pn-nav-item ${activeTab === item.id ? "pn-selected" : ""}`} style={{ "--accent": item.color }} aria-current={activeTab === item.id ? "page" : undefined} onClick={() => openModule(item.id)}><span className="pn-nav-icon"><Icon name={item.icon} size={18} /></span><span>{item.label}</span>{activeTab === item.id && <span className="pn-active-dot" />}</button>)}</div>)}
          </nav>
          <div className="pn-sidebar-note"><div className="pn-mini-flags" aria-hidden="true">{FLAGS.slice(0, 4).map((flag, index) => <PrideFlag key={flag.name} flag={flag} index={index} />)}</div><strong>Built for belonging.</strong><p>A little more connection.<br />A lot more possibility.</p><button type="button" onClick={() => setShowIntro(true)}><Icon name="play" size={13} /> Replay welcome</button></div>
        </aside>

        <main className="pn-main" id="pn-main" tabIndex={-1}>
          {activeTab === "home" ? <>
            <section className="pn-welcome">
              <div className="pn-welcome-copy"><p className="pn-eyebrow"><span /> Your community, connected</p><h1 ref={headingRef} tabIndex={-1}>A little pride.<br /><em>A world of possibility.</em></h1><p className="pn-welcome-text">Welcome back, {firstName}. Your people, partnerships, and next big moments — all in one place.</p><div className="pn-welcome-actions"><button type="button" className="pn-primary" onClick={() => openModule("events")}><Icon name="plus" size={17} /> Request an event</button><button type="button" className="pn-text-button" onClick={() => openModule("messaging")}>Open messaging <Icon name="arrow" size={16} /></button></div></div>
              <div className="pn-welcome-art" aria-hidden="true"><div className="pn-orbit pn-orbit-one" /><div className="pn-orbit pn-orbit-two" /><div className="pn-art-center"><Icon name="spark" size={46} /></div>{FLAGS.slice(0, 6).map((flag, index) => <div className={`pn-art-flag pn-art-flag-${index}`} key={flag.name}><PrideFlag flag={flag} index={index} /></div>)}<span className="pn-art-caption">Many voices. One network.</span></div>
            </section>
            <section className="pn-quick-section" aria-labelledby="pn-quick-title"><div className="pn-section-label"><h2 id="pn-quick-title">Make something happen</h2><span>Quick actions</span></div><div className="pn-quick-grid">{[
              { label: "Add a prospect", detail: "Start a partnership", id: "sponsors", sub: "add_prospect", icon: "spark", color: "#ebc28d" },
              { label: "Create a spotlight", detail: "Celebrate your people", id: "volunteers", sub: "create_spotlight", icon: "heart", color: "#f4a9cc" },
              { label: "Write a newsletter", detail: "Share what’s next", id: "newsletters", sub: "create", icon: "mail", color: "#b9acf9" },
              { label: "View your staff", detail: "Bring the team together", id: "staff", icon: "people", color: "#99d9c5" },
            ].map((item) => <button type="button" key={item.id} className="pn-quick-card" style={{ "--accent": item.color }} onClick={() => openModule(item.id, item.sub)}><span className="pn-tool-icon"><Icon name={item.icon} size={20} /></span><span><strong>{item.label}</strong><small>{item.detail}</small></span><Icon name="arrow" size={16} /></button>)}</div></section>
            <section className="pn-tools-section" aria-labelledby="pn-tools-title"><div className="pn-section-label"><div><p className="pn-eyebrow">Your workspace</p><h2 id="pn-tools-title">The right tools. Real impact.</h2></div><span>{MODULES.length} connected tools</span></div><div className="pn-module-grid">{MODULES.map((item) => <button type="button" className="pn-module-card" key={item.id} style={{ "--accent": item.color }} onClick={() => openModule(item.id)}><span className="pn-card-top"><span className="pn-tool-icon"><Icon name={item.icon} size={21} /></span><span className="pn-card-group">{item.group}</span></span><strong className="pn-card-title">{item.label}</strong><span className="pn-card-description">{item.description}</span><span className="pn-card-action">{item.action}<Icon name="arrow" size={16} /></span></button>)}</div></section>
          </> : <>
            <div className="pn-workspace-heading"><div><div className="pn-breadcrumb"><button type="button" onClick={() => openModule("home")}>Command Center</button><span>/</span><span>{current?.group}</span></div><div className="pn-title-row"><span className="pn-tool-icon" style={{ "--accent": current?.color }}><Icon name={current?.icon} size={23} /></span><h1 ref={headingRef} tabIndex={-1}>{current?.label}</h1></div><p>{current?.description}</p></div><span className="pn-workspace-badge">Admin workspace</span></div>
            <section className="pn-workspace" aria-label={`${current?.label} workspace`}>
              {SUBTABS[activeTab] && <div className="pn-subtabs" role="group" aria-label={`${current.label} views`}>{SUBTABS[activeTab].map(([id, label]) => <button type="button" key={id} className={currentSubTab === id ? "pn-subtab-selected" : ""} aria-pressed={currentSubTab === id} onClick={() => updateSubTab(id)}>{label}</button>)}</div>}
              <div className="pn-module-content">{renderContent()}</div>
            </section>
          </>}
          <footer className="pn-footer"><span>Pride Network <span aria-hidden="true">✦</span> Built for belonging.</span><span>Powered by <strong>Karaoverse</strong></span></footer>
        </main>
      </div>
    </div>
  </div>;
}

const STYLES = `
.pn-center,.pn-intro{--pn-bg:#111017;--pn-surface:#1b1923;--pn-line:rgba(226,218,248,.12);--pn-muted:#b4aec2;--pn-text:#f6f1ed;--pn-lilac:#cbbafa;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--pn-text);font-size:14px;line-height:1.5;color-scheme:dark}
.pn-center *,.pn-intro *{box-sizing:border-box}
.pn-center{min-height:100vh;background:radial-gradient(ellipse at 85% 0,rgba(113,69,127,.1),transparent 50%),var(--pn-bg);padding:var(--pn-top-offset,88px) 0 20px}
.pn-shell{width:97%;max-width:1920px;margin-top:60px;margin-left:auto;margin-right:auto}
:where(.pn-center) button,.pn-intro button{font:inherit;cursor:pointer}
:where(.pn-center) button{color:inherit}
.pn-center button,.pn-center input,.pn-intro button{-webkit-tap-highlight-color:transparent}
.pn-center button:focus-visible,.pn-center a:focus-visible,.pn-center input:focus-visible,.pn-intro button:focus-visible{outline:2px solid #e5cef9;outline-offset:4px}
.pn-center h1:focus,.pn-main:focus{outline:none}
.pn-topbar{min-height:84px;display:flex;align-items:center;gap:28px;border-bottom:1px solid var(--pn-line);padding:12px 16px 18px}
.pn-brand{display:flex;align-items:center;gap:12px;padding:0;border:0;background:transparent;text-align:left;flex-shrink:0}
.pn-brand-mark{width:42px;height:46px;display:grid;place-items:center;border:1px solid #82718c;border-radius:14px;background:linear-gradient(145deg,#614347,#413b60 50%,#284e48);color:#f4debb;box-shadow:0 5px 25px #0003}
.pn-brand strong{display:block;font-size:18px;letter-spacing:-.6px;line-height:1.4}
.pn-brand small{display:block;font-size:10px;color:var(--pn-muted);letter-spacing:1px}
.pn-search{position:relative;display:flex;align-items:center;gap:10px;max-width:380px;flex:1;margin:auto;color:var(--pn-muted);background:#211e2a;border:1px solid var(--pn-line);border-radius:12px;padding:0 12px;min-width:100px}
.pn-search input{width:100%;min-width:0;height:42px;border:0;background:transparent;color:var(--pn-text);font:inherit;outline:none}
.pn-search:focus-within{border-color:#ad91d6;box-shadow:0 0 0 3px #cbbafa0c}
.pn-search input::placeholder{color:#ada4b9}
.pn-search kbd{font:10px inherit;white-space:nowrap;border:1px solid #ffffff20;padding:2px 5px;border-radius:4px}
.pn-search-clear{display:grid;place-items:center;border:0;background:transparent;min-width:28px;height:32px}
.pn-search-results{position:absolute;top:calc(100% + 8px);left:0;right:0;z-index:30;background:#24202e;border:1px solid #675676;border-radius:14px;box-shadow:0 20px 50px #0008;padding:8px;max-height:65vh;overflow:auto}
.pn-search-results>p{font-size:12px;padding:6px;margin:0;color:#c3bacf}
.pn-search-results button{display:flex;width:100%;align-items:center;text-align:left;gap:12px;border:0;background:transparent;border-radius:8px;padding:10px}
.pn-search-results button:hover{background:#ffffff0c}.pn-search-results button>span:nth-child(2){flex:1}.pn-search-results small{display:block;font-size:10px;color:var(--pn-muted)}
.pn-account{display:flex;align-items:center;gap:10px}.pn-avatar{width:36px;height:36px;display:grid;place-items:center;flex-shrink:0;background:#3c354a;border:1px solid #706178;border-radius:50%;color:#e7d9fe;font-size:12px;font-weight:700}.pn-account-copy{max-width:150px}.pn-account-copy strong{display:block;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pn-account-copy small{display:block;font-size:10px;color:var(--pn-muted)}.pn-icon-button{display:grid;place-items:center;width:40px;height:40px;border:1px solid var(--pn-line);border-radius:11px;background:transparent}.pn-icon-button:hover{background:#ffffff0a}
.pn-layout{display:grid;grid-template-columns:215px minmax(0,1fr);gap:26px}.pn-sidebar{padding:24px 16px 0 6px;border-right:1px solid var(--pn-line)}.pn-nav-group{margin-top:21px}.pn-nav-group>p{font-size:9px;letter-spacing:1.3px;text-transform:uppercase;color:#a79cb6;margin:0 10px 8px;font-weight:700}.pn-nav-item{width:100%;display:flex;align-items:center;gap:11px;min-height:42px;padding:9px 11px;border:1px solid transparent;border-radius:10px;background:transparent;text-align:left;font-size:12px!important;transition:background .18s,color .18s}.pn-nav-item:hover{background:#ffffff07}.pn-nav-item.pn-selected{background:#cbbafa12;border-color:#cbbafa25;color:#eee2ff}.pn-nav-icon{display:flex;color:var(--accent)}.pn-active-dot{width:5px;height:5px;border-radius:50%;background:var(--accent);margin-left:auto}.pn-home-link{color:#d5c5ff!important}.pn-sidebar-note{margin:32px 5px 24px;padding:17px 12px;background:linear-gradient(145deg,#cbbafa0a,#f4a9cc06);border:1px solid var(--pn-line);border-radius:14px}.pn-sidebar-note strong{display:block;font-size:12px;margin:12px 0 4px}.pn-sidebar-note p{font-size:11px;color:var(--pn-muted);margin:0}.pn-sidebar-note button{font-size:10px;display:flex;align-items:center;gap:6px;background:transparent;border:0;padding:12px 0 0;color:#d2bceb}.pn-mini-flags{display:flex;gap:7px}.pn-mini-flags .pn-flag{width:27px;height:18px;border-radius:3px}
.pn-main{min-width:0;padding:26px 10px 0 0}.pn-welcome{position:relative;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(210px,1fr);isolation:isolate;overflow:hidden;background:radial-gradient(ellipse at 100% 5%,#52436380,transparent 65%),linear-gradient(115deg,#25212c,#2c2531);border:1px solid #dcc4e528;border-radius:24px;padding:clamp(24px,3vw,44px);min-height:300px}.pn-welcome::after{content:"";height:2px;position:absolute;bottom:0;left:0;right:0;background:linear-gradient(90deg,#ed94a4,#e9bb86,#e5d699,#95c6aa,#96b6dc,#b494d8);opacity:.65}.pn-eyebrow{margin:0 0 14px;font-size:9px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#d1bfdc;display:flex;align-items:center;gap:7px}.pn-eyebrow>span{width:5px;height:5px;background:#b7dcc2;border-radius:100%}.pn-welcome h1{margin:0;font-size:clamp(30px,3.3vw,54px);font-weight:500;letter-spacing:-1.9px;line-height:1.12}.pn-welcome h1 em{font-family:Georgia,"Times New Roman",serif;font-weight:400;color:#e6c8dd;letter-spacing:-1.7px}.pn-welcome-text{font-size:12px;line-height:1.8;color:#c3b8cd;max-width:420px;margin:17px 0 20px}.pn-welcome-actions{display:flex;align-items:center;gap:20px;flex-wrap:wrap}.pn-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:41px;border:1px solid #decbff;background:#d9c7f6;border-radius:10px;color:#2a2036!important;padding:9px 14px;font-weight:650!important;font-size:12px!important;box-shadow:0 3px 16px #0002}.pn-primary:hover{background:#e6d6ff}.pn-text-button{display:flex;align-items:center;gap:10px;padding:8px 0;background:transparent;border:0;font-size:11px!important;color:#e3d8eb!important}
.pn-welcome-art{position:relative;min-height:240px;max-width:330px;width:100%;margin:auto}.pn-orbit{position:absolute;border:1px solid #e3c8ed20;border-radius:50%;left:50%;top:46%;transform:translate(-50%,-50%)}.pn-orbit-one{width:180px;height:180px}.pn-orbit-two{width:260px;height:260px}.pn-art-center{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);width:92px;height:92px;border-radius:30px;display:grid;place-items:center;color:#ecd1df;border:1px solid #e8c4f338;background:linear-gradient(135deg,#c78fbd24,#ffffff03);box-shadow:0 0 75px #c383d928}.pn-art-flag{position:absolute;transform:rotate(-8deg)}.pn-art-flag .pn-flag{width:67px;height:44px;border:1px solid #ffffff40;box-shadow:0 10px 25px #0005}.pn-art-flag-0{top:5%;left:27%}.pn-art-flag-1{top:20%;right:2%;transform:rotate(12deg)}.pn-art-flag-2{bottom:18%;right:5%;transform:rotate(-9deg)}.pn-art-flag-3{bottom:4%;left:34%;transform:rotate(8deg)}.pn-art-flag-4{bottom:22%;left:0;transform:rotate(8deg)}.pn-art-flag-5{top:25%;left:1%;transform:rotate(-15deg)}.pn-art-caption{position:absolute;bottom:-19px;width:100%;text-align:center;font-size:9px;text-transform:uppercase;letter-spacing:1.4px;color:#b9a8c4}
.pn-section-label{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}.pn-section-label h2{font-weight:550;font-size:17px;letter-spacing:-.4px;margin:0}.pn-section-label>span{font-size:10px;color:#a69aad;white-space:nowrap}.pn-section-label .pn-eyebrow{margin-bottom:5px;font-size:8px}.pn-quick-section{margin-top:29px}.pn-quick-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.pn-quick-card{display:flex;align-items:center;gap:10px;min-width:0;text-align:left;border:1px solid var(--pn-line);border-radius:13px;background:#1d1a24;padding:13px 12px;transition:border-color .2s,transform .2s}.pn-quick-card:hover{border-color:var(--accent);transform:translateY(-2px)}.pn-quick-card>span:nth-child(2){flex:1;min-width:0}.pn-quick-card strong{display:block;font-size:11px;font-weight:600}.pn-quick-card small{display:block;font-size:9px;color:var(--pn-muted);margin-top:3px}.pn-quick-card>svg{color:var(--accent);flex-shrink:0}.pn-tool-icon{display:inline-grid;place-items:center;flex-shrink:0;width:38px;height:38px;border-radius:11px;border:1px solid #ffffff13;background:#ffffff05;color:var(--accent,#cbbafa)}.pn-tools-section{margin-top:30px}.pn-module-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}.pn-module-card{display:flex;flex-direction:column;align-items:stretch;text-align:left;min-width:0;padding:20px;border:1px solid var(--pn-line);border-radius:17px;background:linear-gradient(135deg,#25212e66,#1b1923);transition:transform .2s,border-color .2s,background .2s}.pn-module-card:hover{transform:translateY(-3px);border-color:var(--accent);background:#27222f}.pn-card-top{display:flex;align-items:center;justify-content:space-between;gap:8px}.pn-card-group{font-size:8px;color:#b1a7be;border:1px solid #ffffff10;border-radius:20px;padding:4px 7px}.pn-card-title{font-size:18px;font-weight:550;letter-spacing:-.4px;margin-top:17px}.pn-card-description{font-size:11px;line-height:1.75;color:var(--pn-muted);margin:5px 0 20px;max-width:255px}.pn-card-action{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:13px;border-top:1px solid var(--pn-line);font-size:10px;font-weight:600;color:var(--accent)}
.pn-workspace-heading{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:0 0 24px}.pn-breadcrumb{display:flex;align-items:center;gap:8px;font-size:10px;color:var(--pn-muted);margin-bottom:18px;flex-wrap:wrap}.pn-breadcrumb button{font-size:10px;background:none;border:0;padding:0;color:#d7c7ec}.pn-title-row{display:flex;align-items:center;gap:12px}.pn-title-row h1{font-size:32px;font-weight:550;letter-spacing:-1px;margin:0}.pn-workspace-heading p{font-size:12px;color:var(--pn-muted);margin:10px 0 0}.pn-workspace-badge{font-size:9px;white-space:nowrap;letter-spacing:.6px;background:#cbbafa09;color:#d0c0e2;border:1px solid #cbbafa25;padding:7px 10px;border-radius:30px}.pn-workspace{background:#1b1822;border:1px solid var(--pn-line);border-radius:18px;min-height:420px;min-width:0}.pn-subtabs{display:flex;flex-wrap:wrap;gap:6px;padding:14px;border-bottom:1px solid var(--pn-line)}.pn-subtabs button{min-height:40px;padding:8px 13px;background:transparent;border:1px solid transparent;border-radius:9px;font-size:11px;color:#c5bacf}.pn-subtabs button:hover{background:#ffffff07}.pn-subtabs button.pn-subtab-selected{background:#d7c5f3;color:#30223c;border-color:#decef5;font-weight:650}.pn-module-content{min-width:0;padding:clamp(10px,1.8vw,24px);color:#fff4c4}.pn-module-content>div{min-width:0;max-width:100%}.pn-vendor-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px;color:var(--pn-text)}.pn-vendor-actions p{font-size:12px;color:var(--pn-muted);margin:0}.pn-vendor-create{margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--pn-line)}.pn-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;border-top:1px solid var(--pn-line);margin-top:30px;padding:18px 2px;font-size:9px;color:#a398b1}.pn-footer>span>span{color:#d4badf;margin:0 5px}.pn-footer strong{font-weight:500;color:#c8bad5}.pn-mobile-bar{display:none}.pn-skip-content{position:fixed;left:16px;top:-100px;z-index:100;background:#eee1ff;color:#21172c;padding:10px 18px;border-radius:8px}.pn-skip-content:focus{top:10px}
.pn-flag{display:flex;flex-direction:column;width:72px;height:48px;overflow:hidden;border-radius:6px;box-shadow:0 4px 20px #0003;flex-shrink:0}.pn-flag>span{display:block;flex:1;min-height:0}
.pn-intro{position:fixed;inset:0;z-index:2147483000;min-height:100dvh;overflow:auto;display:grid;place-items:center;background:#100c19;padding:32px 20px;isolation:isolate}.pn-intro-glow{position:absolute;inset:0;z-index:-1;background:radial-gradient(ellipse at 23% 30%,#e4679730,transparent 44%),radial-gradient(ellipse at 77% 38%,#655edb35,transparent 44%),radial-gradient(ellipse at 50% 88%,#54b6a31c,transparent 45%)}.pn-intro-inner{width:100%;text-align:center;max-width:900px}.pn-intro .pn-eyebrow{justify-content:center;font-size:10px;letter-spacing:3px;color:#c7b7d8}.pn-intro-flags{display:flex;justify-content:center;flex-wrap:wrap;gap:14px;margin:42px auto 38px;max-width:760px}.pn-intro-flags .pn-flag{width:70px;height:46px;border:1px solid #ffffff30}.pn-flag-animated{animation:pn-flag-arrive .9s both;animation-delay:var(--flag-delay)}.pn-neon{display:flex;flex-wrap:wrap;justify-content:center;gap:0 .25em;margin:0;font-size:clamp(42px,8.5vw,100px);line-height:1.2;font-weight:750;letter-spacing:-4px}.pn-neon-word{display:inline-flex}.pn-neon-word>span{color:var(--neon);text-shadow:0 0 8px var(--neon),0 0 38px color-mix(in srgb,var(--neon) 45%,transparent);animation:pn-neon-arrive 1s both;animation-delay:var(--letter-delay)}.pn-powered{margin:22px 0 20px;color:#bcaacb;font-size:12px;letter-spacing:1.5px}.pn-powered strong{color:#eee4f5;font-weight:550}.pn-skip{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:36px;padding:7px 15px;border:1px solid #e7cbf340;border-radius:999px;background:#ffffff08;color:#eee0f8;font-size:11px!important;transition:background .2s,transform .2s}.pn-skip:hover{background:#ffffff14;transform:translateY(-1px)}.pn-intro-progress{margin:30px auto 0;width:100px;height:2px;border-radius:5px;overflow:hidden;background:#ffffff10}.pn-intro-progress span{display:block;height:100%;transform-origin:left;background:linear-gradient(90deg,#f597b6,#efc985,#92d6ba,#a0b8ef,#d8a9eb);animation:pn-progress 5.4s linear both}
@keyframes pn-flag-arrive{from{opacity:0;transform:translateY(18px) rotate(0) scale(.88)}to{opacity:1;transform:translateY(0) rotate(var(--flag-tilt)) scale(1)}}
@keyframes pn-neon-arrive{from{opacity:0;transform:translateY(8px);filter:blur(4px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
@keyframes pn-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media(min-width:1500px){.pn-module-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.pn-layout{grid-template-columns:235px minmax(0,1fr);gap:32px}.pn-nav-item{min-height:44px;font-size:13px!important}.pn-welcome{min-height:340px}}
@media(max-width:1150px){.pn-quick-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.pn-topbar{gap:18px}.pn-account-copy{display:none}.pn-layout{grid-template-columns:190px minmax(0,1fr);gap:20px}.pn-sidebar{padding-right:12px}.pn-module-card{padding:16px}.pn-card-group{display:none}.pn-welcome{grid-template-columns:minmax(0,1.4fr) minmax(165px,1fr);padding:26px}.pn-welcome-art{transform:scale(.82)}.pn-orbit-two{width:220px;height:220px}.pn-welcome h1{font-size:36px}}
@media(max-width:800px){.pn-shell{width:97%}.pn-topbar{padding:8px 5px 15px;gap:12px;flex-wrap:wrap}.pn-brand{margin-right:auto}.pn-brand strong{font-size:17px}.pn-brand small{font-size:9px}.pn-brand-mark{width:36px;height:40px}.pn-account{gap:7px}.pn-avatar{width:32px;height:32px}.pn-search{order:3;flex-basis:100%;max-width:none;margin:0}.pn-search kbd{display:none}.pn-layout{display:block}.pn-mobile-bar{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--pn-line);padding:10px 5px;font-size:11px;color:#d0c3dc}.pn-mobile-bar button{display:flex;align-items:center;gap:7px;min-height:38px;padding:7px 11px;border:1px solid var(--pn-line);border-radius:8px;background:#292232;font-size:11px}.pn-sidebar{display:none;border:1px solid var(--pn-line);border-radius:13px;padding:12px;margin-top:10px;background:#1c1823}.pn-sidebar.pn-sidebar-open{display:block}.pn-sidebar nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.pn-home-link{grid-column:1/-1}.pn-nav-group{margin:0}.pn-nav-group>p{font-size:8px;margin-top:8px}.pn-nav-item{min-height:43px}.pn-sidebar-note{display:none}.pn-main{padding:16px 3px 0}.pn-welcome{padding:26px;grid-template-columns:minmax(0,1.5fr) minmax(180px,1fr);min-height:275px}.pn-welcome h1{font-size:38px}.pn-welcome-art{transform:scale(.85)}.pn-module-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.pn-card-group{display:block;font-size:7px}.pn-workspace-heading{margin:3px 0 20px}.pn-workspace-badge{display:none}.pn-title-row h1{font-size:28px}.pn-workspace{min-height:300px}.pn-subtabs{padding:10px}.pn-subtabs button{min-height:42px}}
@media(max-width:520px){.pn-welcome{padding:23px 20px 22px;display:block;min-height:0;border-radius:18px}.pn-welcome-art{display:none}.pn-welcome h1{font-size:36px;letter-spacing:-1.5px}.pn-welcome h1 em{letter-spacing:-1.2px}.pn-welcome-text{font-size:11px;margin:14px 0 18px;max-width:295px}.pn-eyebrow{font-size:8px;letter-spacing:1.5px}.pn-welcome-actions{gap:14px}.pn-primary{font-size:11px!important;padding:9px 11px}.pn-text-button{font-size:10px!important;gap:6px}.pn-quick-grid{gap:8px}.pn-quick-card{padding:12px 10px;gap:8px;align-items:flex-start}.pn-quick-card .pn-tool-icon{width:29px;height:32px;border-radius:8px}.pn-quick-card .pn-tool-icon svg{width:17px;height:17px}.pn-quick-card>svg{display:none}.pn-quick-card strong{font-size:10px}.pn-quick-card small{font-size:9px;line-height:1.5}.pn-section-label h2{font-size:15px}.pn-section-label>span{font-size:8px}.pn-module-grid{gap:9px}.pn-module-card{border-radius:13px;padding:14px 12px}.pn-card-group{display:none}.pn-card-title{font-size:17px;margin-top:13px}.pn-card-description{font-size:10px;margin-bottom:15px}.pn-card-action{font-size:9px;gap:5px}.pn-tools-section,.pn-quick-section{margin-top:24px}.pn-vendor-actions{align-items:flex-start;flex-direction:column}.pn-subtabs{gap:5px}.pn-subtabs button{font-size:10px;padding:8px 10px}.pn-module-content{padding:10px}.pn-footer{font-size:8px;gap:7px;margin-top:24px}.pn-intro-flags{display:grid;grid-template-columns:repeat(4,1fr);gap:17px 13px;max-width:295px;margin:35px auto}.pn-intro-flags .pn-flag{width:100%;height:39px}.pn-neon{font-size:clamp(39px,11.5vw,60px);letter-spacing:-2.5px;gap:0 .2em}.pn-powered{font-size:10px}.pn-intro .pn-eyebrow{font-size:8px;letter-spacing:2px}}
@media(prefers-reduced-motion:reduce){.pn-center *,.pn-intro *{animation:none!important;transition:none!important;scroll-behavior:auto!important}.pn-neon-word>span{opacity:1;filter:none;transform:none}.pn-flag-animated{opacity:1;transform:rotate(var(--flag-tilt))}.pn-intro-progress span{transform:scaleX(1)}}
`;
