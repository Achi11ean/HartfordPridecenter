// StaffDashboard.jsx — self-contained dashboard shell; existing tools are retained.
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateProspect from "./CreateProspect";
import ManageProspects from "./ManageProspects";
import Volunteers from "./Volunteers";
import Sponsor from "./Sponsor";
import Sponsors from "./Sponsors";
import CreateVendor from "./CreateVendor";
import ManageVendors from "./ManageVendors";
import ManageContacts from "./ManageContacts";
import AdminMessaging from "./AdminMessaging";
import ManageSubscribers from "./ManageSubscribers";
const SECTIONS = [
  { id: "dashboard", icon: "home", label: "Overview", color: "#75528e", wash: "#f0e8f7", description: "Your people, partnerships, and community — all in one place." },
  { id: "sponsors", icon: "sparkle", label: "Sponsors", color: "#a74470", wash: "#fbeaf1", description: "Build partnerships, follow up with prospects, and manage sponsors." },
  { id: "volunteers", icon: "heart", label: "Volunteers", color: "#39745b", wash: "#e7f3eb", description: "Review volunteer submissions and connect with people ready to help." },
  { id: "subscribers", icon: "mail", label: "Subscribers", color: "#956421", wash: "#fcf1db", description: "Manage the community members who want to stay connected." },
  { id: "vendors", icon: "bag", label: "Vendors", color: "#426f9e", wash: "#eaf1fb", description: "Add new vendors and keep your existing vendor records organized." },
  { id: "contacts", icon: "users", label: "Contacts", color: "#7b5793", wash: "#f1eafb", description: "Keep your community connections close and their details up to date." },
  { id: "messaging", icon: "chat", label: "Messaging", color: "#9c5949", wash: "#fbede6", description: "Open your messages and keep the conversation moving." },
];
const SPONSOR_VIEWS = [
  ["add_prospect", "Add prospect", "plus"],
  ["manage_prospects", "Manage prospects", "list"],
  ["add", "Add sponsor", "plus"],
  ["manage", "Manage sponsors", "list"],
];
const VENDOR_VIEWS = [["add", "Add vendor", "plus"], ["manage", "Manage vendors", "list"]];
function Icon({ name, size = 20, ...props }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></>,
    sparkle: <><path d="m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7z" /></>,
    heart: <><path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>,
    bag: <><path d="M4 8h16l1 13H3zM8 8V6a4 4 0 0 1 8 0v2" /></>,
    users: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-17a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v3" /></>,
    chat: <><path d="M21 11a9 9 0 0 1-9 9H4l-3 2 2-6a9 9 0 1 1 18-5Z" /><path d="M8 10h8m-8 4h5" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    list: <><path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    logout: <><path d="M9 3H4v18h5m0-9h12m-5-5 5 5-5 5" /></>,
    shield: <><path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6z" /><path d="m8 12 3 3 5-6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{paths[name] || paths.sparkle}</svg>;
}
function readStaff() {
  try {
    const value = JSON.parse(localStorage.getItem("prideUser") || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}
function ViewSwitcher({ views, value, onChange, label }) {
  return <div className="hpsd-switcher" role="group" aria-label={label}>
    {views.map(([id, title, icon]) => <button type="button" key={id} aria-pressed={value === id} onClick={() => onChange(id)} className={`hpsd-view-button${value === id ? " is-active" : ""}`}><Icon name={icon} size={15} /><span>{title}</span></button>)}
  </div>;
}
export default function StaffDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("prideToken");
  const role = localStorage.getItem("prideRole");
  const [staff] = useState(readStaff);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sponsorSubTab, setSponsorSubTab] = useState("add");
  const [vendorsSubTab, setVendorsSubTab] = useState("add");
  const authorized = !!token && role === "staff";
  const current = SECTIONS.find(section => section.id === activeTab) || SECTIONS[0];
  const name = typeof staff.first_name === "string" && staff.first_name.trim() ? staff.first_name.trim() : "Staff";
  const lastName = typeof staff.last_name === "string" ? staff.last_name.trim() : "";
  const initials = `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  useEffect(() => {
    if (!authorized) navigate("/login", { replace: true });
  }, [authorized, navigate]);
  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };
  const openTool = (id, view) => {
    if (id === "sponsors" && view) setSponsorSubTab(view);
    if (id === "vendors" && view) setVendorsSubTab(view);
    setActiveTab(id);
  };
  if (!authorized) return null;
  return <div className="hpsd-root" style={{ "--hpsd-accent": current.color, "--hpsd-wash": current.wash }}>
    <style>{STYLES}</style>
    <div className="hpsd-frame">
      <header className="hpsd-header">
        <div className="hpsd-brand"><span className="hpsd-brand-icon"><Icon name="heart" size={23} /></span><div><p className="hpsd-kicker">Hartford Pride Center</p><h1 className="hpsd-title">Staff dashboard<span>.</span></h1></div></div>
        <div className="hpsd-account"><span className="hpsd-staff-label"><span className="hpsd-status-dot" />Staff portal</span><button type="button" className="hpsd-logout" onClick={logout}><Icon name="logout" size={16} /><span>Log out</span></button></div>
      </header>
      <div className="hpsd-layout">
        <aside className="hpsd-sidebar">
          <p className="hpsd-nav-label">Your workspace</p>
          <nav className="hpsd-nav" aria-label="Staff dashboard sections">
            {SECTIONS.map(section => <button type="button" key={section.id} aria-pressed={activeTab === section.id} onClick={() => setActiveTab(section.id)} className={`hpsd-nav-button${activeTab === section.id ? " is-active" : ""}`} style={{ "--nav-color": section.color, "--nav-wash": section.wash }}><span className="hpsd-nav-icon"><Icon name={section.icon} size={19} /></span><span>{section.label}</span><span className="hpsd-nav-indicator" aria-hidden="true" /></button>)}
          </nav>
          <div className="hpsd-sidebar-note"><Icon name="heart" size={19} /><p>Good people.<br /><strong>Meaningful work.</strong></p><span>Thank you for showing up for our community.</span></div>
          <div className="hpsd-mini-profile"><span className="hpsd-avatar">{initials}</span><div><strong>{name}</strong><span>Staff member</span></div></div>
        </aside>
        <main className="hpsd-main">
          <section className="hpsd-workspace" aria-labelledby="hpsd-workspace-title">
            <div className="hpsd-panel-heading"><div><p className="hpsd-kicker">Staff workspace / {current.label}</p><h2 id="hpsd-workspace-title" className="hpsd-section-title">{activeTab === "dashboard" ? `Welcome back, ${name}.` : current.label}</h2><p className="hpsd-description">{current.description}</p></div><span className="hpsd-section-icon"><Icon name={current.icon} size={27} /></span></div>
            {activeTab === "dashboard" ? <div className="hpsd-overview">
              <div className="hpsd-welcome-note"><span className="hpsd-welcome-heart"><Icon name="heart" size={22} /></span><div><strong>A little care. A stronger community.</strong><p>Pick a task below and make a little good happen today.</p></div></div>
              <div className="hpsd-block-title"><h3>Start something good</h3><span>Quick actions</span></div>
              <div className="hpsd-quick-actions">
                <button type="button" onClick={() => openTool("sponsors", "add_prospect")}><Icon name="plus" size={17} /><span>Add prospect</span></button>
                <button type="button" onClick={() => openTool("sponsors", "add")}><Icon name="plus" size={17} /><span>Add sponsor</span></button>
                <button type="button" onClick={() => openTool("vendors", "add")}><Icon name="plus" size={17} /><span>Add vendor</span></button>
                <button type="button" onClick={() => openTool("messaging")}><Icon name="chat" size={17} /><span>Open messages</span></button>
              </div>
              <div className="hpsd-block-title"><h3>Your community toolkit</h3><span>Everything in reach</span></div>
              <div className="hpsd-tool-grid">
                {SECTIONS.filter(section => section.id !== "dashboard").map(section => <button type="button" className="hpsd-tool-card" key={section.id} onClick={() => openTool(section.id, section.id === "sponsors" || section.id === "vendors" ? "manage" : undefined)} style={{ "--tool-color": section.color, "--tool-wash": section.wash }}><span className="hpsd-tool-top"><span className="hpsd-tool-icon"><Icon name={section.icon} size={23} /></span><Icon name="arrow" size={17} /></span><strong>{section.label}</strong><span className="hpsd-tool-description">{section.description}</span><span className="hpsd-tool-link">Open {section.label.toLowerCase()} <Icon name="arrow" size={14} /></span></button>)}
              </div>
              <div className="hpsd-profile-card"><span className="hpsd-avatar">{initials}</span><div className="hpsd-profile-copy"><span>Your staff profile</span><strong>{name}{lastName ? ` ${lastName}` : ""}</strong>{typeof staff.email === "string" && staff.email && <span>{staff.email}</span>}</div><span className="hpsd-profile-badge"><Icon name="shield" size={14} />Staff access</span></div>
            </div> : <>
              {activeTab === "sponsors" && <ViewSwitcher views={SPONSOR_VIEWS} value={sponsorSubTab} onChange={setSponsorSubTab} label="Sponsor and prospect tools" />}
              {activeTab === "vendors" && <ViewSwitcher views={VENDOR_VIEWS} value={vendorsSubTab} onChange={setVendorsSubTab} label="Vendor tools" />}
              <div className="hpsd-tool-content">
                {activeTab === "messaging" && <AdminMessaging />}
                {activeTab === "volunteers" && <Volunteers />}
                {activeTab === "subscribers" && <ManageSubscribers />}
                {activeTab === "contacts" && <ManageContacts />}
                {activeTab === "vendors" && vendorsSubTab === "add" && <CreateVendor />}
                {activeTab === "vendors" && vendorsSubTab === "manage" && <ManageVendors />}
                {activeTab === "sponsors" && sponsorSubTab === "add" && <Sponsor />}
                {activeTab === "sponsors" && sponsorSubTab === "manage" && <Sponsors />}
                {activeTab === "sponsors" && sponsorSubTab === "add_prospect" && <CreateProspect />}
                {activeTab === "sponsors" && sponsorSubTab === "manage_prospects" && <ManageProspects onConvert={() => setSponsorSubTab("add")} />}
              </div>
            </>}
          </section>
          <footer className="hpsd-footer"><span>Every identity. One community.</span><span>Hartford Pride Center · Staff portal</span></footer>
        </main>
      </div>
    </div>
  </div>;
}
const STYLES = `
.hpsd-root{--hpsd-ink:#322c3c;--hpsd-muted:#6d6576;--hpsd-border:#e8e1eb;--hpsd-header-offset:148px;min-height:100vh;padding:calc(var(--hpsd-header-offset) + 18px) 0 22px;background:radial-gradient(ellipse at 0 0,#f9e3ed80,transparent 40%),radial-gradient(ellipse at 100% 70%,#e5edf680,transparent 45%),#f8f6f3;color:var(--hpsd-ink);font:14px/1.55 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color-scheme:light}
.hpsd-frame{width:97%;max-width:1760px;margin:0 auto;min-width:0}
.hpsd-header,.hpsd-sidebar,.hpsd-panel-heading,.hpsd-overview,.hpsd-switcher,.hpsd-footer{box-sizing:border-box}
.hpsd-header *,.hpsd-sidebar *,.hpsd-panel-heading *,.hpsd-overview *,.hpsd-switcher *{box-sizing:border-box}
.hpsd-root :is(.hpsd-title,.hpsd-section-title,.hpsd-kicker,.hpsd-description,.hpsd-nav-label){margin:0}
.hpsd-root :is(.hpsd-logout,.hpsd-nav-button,.hpsd-view-button,.hpsd-tool-card,.hpsd-quick-actions>button){font-family:inherit;cursor:pointer;transition:background .18s,border-color .18s,box-shadow .18s}
.hpsd-root :is(.hpsd-logout,.hpsd-nav-button,.hpsd-view-button,.hpsd-tool-card,.hpsd-quick-actions>button):focus-visible{outline:3px solid #79528f;outline-offset:3px}
.hpsd-header{position:relative;display:flex;justify-content:space-between;align-items:center;gap:18px;background:#fffdfa;border:1px solid var(--hpsd-border);border-radius:18px;padding:21px 25px;margin-bottom:16px;box-shadow:0 4px 17px #48365305}
.hpsd-header::before{content:"";position:absolute;inset:0 16px auto;height:3px;border-radius:0 0 8px 8px;background:linear-gradient(90deg,#cd668b,#d7a068,#d4b759,#74a98d,#769dc5,#a17fba)}
.hpsd-brand,.hpsd-account{display:flex;align-items:center;gap:13px;min-width:0}.hpsd-brand-icon{display:grid;place-items:center;flex:0 0 48px;height:48px;border:1px solid #e6cfe0;border-radius:15px;background:linear-gradient(135deg,#f8e4ed,#efe9fa);color:#956484}
.hpsd-kicker{font-size:10px;line-height:1.5;text-transform:uppercase;letter-spacing:1.2px;color:#75647d;font-weight:700}
.hpsd-root .hpsd-title{font-size:clamp(21px,2.1vw,29px);letter-spacing:-.8px;font-weight:750;line-height:1.3;color:var(--hpsd-ink);margin-top:3px}.hpsd-title>span{color:#b06a91}
.hpsd-staff-label{display:flex;align-items:center;gap:6px;font-size:11px;color:#6d6474;white-space:nowrap}.hpsd-status-dot{width:6px;height:6px;background:#729b7d;border-radius:50%}
.hpsd-logout{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:40px;padding:8px 12px;border:1px solid #e4dce6;border-radius:10px;background:#fff;color:#76576b;font-size:12px;font-weight:650;white-space:nowrap}.hpsd-logout:hover{background:#f9edf3;border-color:#cdafc1}
.hpsd-layout{display:grid;grid-template-columns:210px minmax(0,1fr);align-items:start;gap:16px}
.hpsd-sidebar{background:#fffdfb;border:1px solid var(--hpsd-border);border-radius:16px;padding:18px 10px 10px;min-width:0}.hpsd-nav-label{font-size:9px;font-weight:750;color:#817388;text-transform:uppercase;letter-spacing:1.4px;padding:0 12px 12px}
.hpsd-nav{display:grid;gap:5px}.hpsd-nav-button{display:flex;align-items:center;gap:10px;min-width:0;width:100%;min-height:47px;border:1px solid transparent;border-radius:10px;background:transparent;color:#655d6e;padding:6px 9px;text-align:left;font-size:12px;font-weight:650}
.hpsd-nav-icon{display:grid;place-items:center;width:31px;height:31px;flex-shrink:0;border-radius:9px;background:var(--nav-wash);color:var(--nav-color)}.hpsd-nav-button:hover{background:#f7f3f8}.hpsd-nav-button.is-active{background:var(--nav-wash);border-color:var(--nav-color);color:var(--nav-color)}.hpsd-nav-indicator{margin-left:auto;width:5px;height:5px;border-radius:50%;background:transparent;flex-shrink:0}.hpsd-nav-button.is-active .hpsd-nav-indicator{background:currentColor}
.hpsd-sidebar-note{margin:23px 6px 15px;padding:16px 12px;border:1px dashed #ded0df;border-radius:12px;background:linear-gradient(135deg,#fff2f6,#faf6e9);color:#a3738f}.hpsd-sidebar-note>p{margin:9px 0 7px;color:#65516c;font-size:13px;line-height:1.5}.hpsd-sidebar-note>span{display:block;font-size:10px;line-height:1.6;color:#77697c}
.hpsd-mini-profile{display:flex;align-items:center;gap:9px;border-top:1px solid #eee6ef;padding:14px 5px 2px}.hpsd-avatar{display:grid;place-items:center;width:36px;height:36px;flex-shrink:0;background:#eae3f3;border:1px solid #ded0e8;border-radius:11px;color:#6b5181;font-size:12px;font-weight:800}.hpsd-mini-profile>div{min-width:0}.hpsd-mini-profile strong{display:block;font-size:12px;overflow-wrap:anywhere}.hpsd-mini-profile div>span{display:block;font-size:10px;color:#807288}
.hpsd-main{min-width:0}.hpsd-workspace{background:#fff;border:1px solid var(--hpsd-border);border-radius:16px;min-width:0;box-shadow:0 5px 20px #44334904}
.hpsd-panel-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:24px 25px 22px;border-bottom:1px solid #eee8ef;background:linear-gradient(115deg,#fff,var(--hpsd-wash));border-radius:15px 15px 0 0}.hpsd-panel-heading>div{min-width:0}.hpsd-root .hpsd-section-title{font-size:clamp(23px,2.6vw,32px);line-height:1.25;letter-spacing:-.8px;color:#382f40;font-weight:700;margin:7px 0 8px;overflow-wrap:anywhere}.hpsd-description{font-size:12px;line-height:1.7;color:#6d6175;max-width:650px}.hpsd-section-icon{display:grid;place-items:center;width:55px;height:55px;flex-shrink:0;background:#fff9;border:1px solid #ffffffd9;border-radius:17px;color:var(--hpsd-accent)}
.hpsd-overview{padding:23px 25px 25px}.hpsd-welcome-note{display:flex;align-items:center;gap:12px;padding:15px 17px;border:1px solid #e7d9e4;border-radius:12px;background:linear-gradient(110deg,#fff1f6,#fffaee 48%,#f0f7f0);margin-bottom:25px}.hpsd-welcome-heart{display:grid;place-items:center;width:39px;height:39px;flex-shrink:0;border-radius:12px;background:#fff9;color:#b16b8b}.hpsd-welcome-note strong{font-size:14px;color:#59445d}.hpsd-welcome-note p{margin:4px 0 0;font-size:12px;color:#746679}
.hpsd-block-title{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:0 0 12px}.hpsd-block-title h3{margin:0;font-size:14px;letter-spacing:-.2px;color:#413747;font-weight:750}.hpsd-block-title>span{font-size:10px;color:#87798d}
.hpsd-quick-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-bottom:27px}.hpsd-quick-actions>button{display:flex;align-items:center;justify-content:center;gap:8px;min-height:43px;padding:9px 8px;border:1px solid #dac9e4;border-radius:9px;background:#f8f3fc;color:#705183;font-size:11px;font-weight:700}.hpsd-quick-actions>button:hover{background:#eee4f7;border-color:#b59bc5}.hpsd-quick-actions svg{flex-shrink:0}
.hpsd-tool-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}.hpsd-tool-card{position:relative;display:flex;align-items:stretch;flex-direction:column;min-width:0;min-height:195px;padding:17px;text-align:left;border:1px solid #e5dfe8;border-top:3px solid var(--tool-color);border-radius:12px;background:linear-gradient(150deg,var(--tool-wash),#fff 72%);color:var(--tool-color)}.hpsd-tool-card:hover{border-color:var(--tool-color);box-shadow:0 5px 14px #4c335911}.hpsd-tool-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px}.hpsd-tool-icon{display:grid;place-items:center;width:39px;height:39px;border-radius:12px;background:#fff9;border:1px solid #ffffffbc}.hpsd-tool-card>strong{font-size:16px;line-height:1.4;color:#423448}.hpsd-tool-description{font-size:11px;line-height:1.7;color:#736778;margin:6px 0 16px}.hpsd-tool-link{display:flex;align-items:center;gap:7px;font-size:10px;font-weight:750;margin-top:auto}
.hpsd-profile-card{display:flex;align-items:center;gap:11px;border:1px solid #e8e1eb;border-radius:11px;background:#fcfafc;margin-top:21px;padding:14px}.hpsd-profile-copy{display:flex;flex-direction:column;gap:2px;min-width:0;overflow-wrap:anywhere}.hpsd-profile-copy>span{font-size:10px;color:#7c6d83}.hpsd-profile-copy>strong{font-size:13px;color:#4c3d55}.hpsd-profile-badge{display:inline-flex;align-items:center;gap:5px;margin-left:auto;font-size:10px;color:#617565;white-space:nowrap;background:#edf4ed;padding:5px 8px;border-radius:7px}
.hpsd-switcher{display:flex;flex-wrap:wrap;gap:7px;padding:15px 20px;border-bottom:1px solid #eee7ef;background:#fcfafd}.hpsd-view-button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:40px;padding:9px 13px;border:1px solid #e1d8e5;border-radius:9px;color:#75657c;background:#fff;font-size:11px;font-weight:650}.hpsd-view-button.is-active{border-color:var(--hpsd-accent);background:var(--hpsd-wash);color:var(--hpsd-accent);font-weight:750}.hpsd-view-button:hover{border-color:var(--hpsd-accent)}
/* Child tools keep their own styles; do not clip their menus or modal overlays. */
.hpsd-tool-content{min-width:0;padding:18px;display:flow-root}.hpsd-tool-content> *{min-width:0;max-width:100%}
.hpsd-footer{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:10px;color:#897a91;padding:15px 4px 0}
@media(min-width:1700px){.hpsd-layout{grid-template-columns:230px minmax(0,1fr)}.hpsd-tool-card{min-height:210px}}
@media(max-width:1100px){.hpsd-layout{grid-template-columns:185px minmax(0,1fr);gap:12px}.hpsd-tool-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hpsd-quick-actions{grid-template-columns:repeat(2,minmax(0,1fr))}.hpsd-panel-heading{padding:21px}.hpsd-overview{padding:20px}.hpsd-staff-label{display:none}}
@media(max-width:760px){.hpsd-root{--hpsd-header-offset:136px;padding-top:calc(var(--hpsd-header-offset) + 12px)}.hpsd-frame{width:97%}.hpsd-header{padding:17px 13px;margin-bottom:10px;border-radius:14px;gap:9px}.hpsd-brand{gap:9px}.hpsd-brand-icon{flex-basis:37px;height:37px;border-radius:12px}.hpsd-brand-icon svg{width:20px;height:20px}.hpsd-kicker{font-size:8px;letter-spacing:.7px}.hpsd-root .hpsd-title{font-size:21px;letter-spacing:-.6px}.hpsd-account{gap:0}.hpsd-logout{min-height:38px;padding:7px 9px;font-size:10px;gap:5px}.hpsd-logout svg{width:14px}.hpsd-layout{display:flex;flex-direction:column;gap:10px}.hpsd-sidebar,.hpsd-main{width:100%}.hpsd-sidebar{padding:7px;border-radius:13px}.hpsd-nav-label,.hpsd-sidebar-note,.hpsd-mini-profile{display:none}.hpsd-nav{grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}.hpsd-nav-button{flex-direction:column;justify-content:center;gap:4px;min-height:59px;padding:6px 2px;border-radius:8px;font-size:10px;line-height:1.3}.hpsd-nav-icon{width:25px;height:25px;border-radius:7px}.hpsd-nav-icon svg{width:17px;height:17px}.hpsd-nav-indicator{display:none}.hpsd-workspace{border-radius:13px}.hpsd-panel-heading{padding:19px 15px 17px;border-radius:12px 12px 0 0;gap:10px}.hpsd-root .hpsd-section-title{font-size:25px;margin:7px 0}.hpsd-section-icon{width:41px;height:41px;border-radius:12px}.hpsd-section-icon svg{width:23px;height:23px}.hpsd-description{font-size:11px}.hpsd-overview{padding:15px}.hpsd-welcome-note{padding:12px;gap:9px;margin-bottom:21px}.hpsd-welcome-note strong{font-size:12px}.hpsd-welcome-note p{font-size:10px}.hpsd-welcome-heart{width:31px;height:31px}.hpsd-welcome-heart svg{width:18px}.hpsd-block-title h3{font-size:13px}.hpsd-block-title>span{font-size:9px}.hpsd-quick-actions{gap:7px;margin-bottom:23px}.hpsd-quick-actions>button{font-size:10px;min-height:42px;gap:6px}.hpsd-tool-grid{gap:10px}.hpsd-tool-card{padding:13px;min-height:195px}.hpsd-tool-top{margin-bottom:10px}.hpsd-tool-icon{width:32px;height:32px;border-radius:10px}.hpsd-tool-icon svg{width:19px;height:19px}.hpsd-tool-card>strong{font-size:14px}.hpsd-tool-description{font-size:10px;line-height:1.6;margin-bottom:13px}.hpsd-tool-link{font-size:9px;gap:4px}.hpsd-profile-card{padding:11px;gap:9px;flex-wrap:wrap}.hpsd-profile-badge{font-size:9px}.hpsd-switcher{padding:10px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.hpsd-view-button{padding:8px 6px;font-size:10px;gap:5px;min-width:0}.hpsd-tool-content{padding:10px}.hpsd-footer{font-size:9px;padding:13px 4px 0;gap:5px}}
@media(max-width:370px){.hpsd-header{padding-inline:10px}.hpsd-brand-icon{display:none}.hpsd-root .hpsd-title{font-size:20px}.hpsd-panel-heading{padding:16px 12px}.hpsd-section-icon{display:none}.hpsd-overview{padding:12px}.hpsd-block-title>span{display:none}.hpsd-tool-card{padding:11px}.hpsd-tool-card>strong{font-size:13px}.hpsd-tool-link svg{display:none}.hpsd-profile-badge{margin-left:45px}}
@media(prefers-reduced-motion:reduce){.hpsd-root :is(.hpsd-logout,.hpsd-nav-button,.hpsd-view-button,.hpsd-tool-card,.hpsd-quick-actions>button){transition:none}}
`;
