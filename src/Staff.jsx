import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";

const CLOUD_NAME = "dcw0wqlse";
const UPLOAD_PRESET = "karaoke";
const API = "https://singspacebackend.onrender.com";
const STAFF_ROLES = [
  "Executive Director",
  "Full-Stack Software Developer",
  "Program Director",
  "Operations Manager",
  "Volunteer Coordinator",
  "Community Outreach Coordinator",
  "Events Coordinator",
  "Fundraising Manager",
  "Development Director",
  "Communications Manager",
  "Marketing & Social Media",
  "Education Coordinator",
  "Youth Program Coordinator",
  "Health & Wellness Coordinator",
  "Advocacy & Policy Lead",
  "Grant Writer",
  "Finance Manager",
  "Office Administrator",
  "Board Member",
  "Intern",
  "Volunteer",
  "Support Staff",
];
const STAFF_ROLE_OPTIONS = STAFF_ROLES.map(r => ({
  value: r,
  label: r,
}));

const PAGE_SIZE = 8;
const FIELD_LABELS = { first_name: "First name", last_name: "Last name", email: "Email address", phone: "Phone number", username: "Username", pin: "PIN" };
const fullName = s => [s.first_name, s.last_name].filter(Boolean).join(" ") || s.username || "Staff member";
const initials = s => [s.first_name, s.last_name].filter(Boolean).map(value => String(value)[0]).join("").toUpperCase() || "SP";
const formatPhoneNumber = value => {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};
function readAccount() {
  try { const user = JSON.parse(localStorage.getItem("prideUser") || "{}"); return user && typeof user === "object" ? user : {}; } catch { return {}; }
}
function StaffIcon({ name, size = 18 }) {
  const paths = {
    users: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-17a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v3" /></>,
    search: <><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6 6a8 8 0 0 1 14 6M4 12a8 8 0 0 0 14 6" /></>,
    edit: <><path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15z" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>,
    phone: <path d="m8 3 2 5-3 2c1 4 3 6 7 7l2-3 5 2v4c-10 2-20-8-18-17z" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    sparkle: <path d="m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7z" />,
    trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] || paths.users}</svg>;
}
function Avatar({ member, large = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [member.image_url]);
  return <span className={`hpsm-avatar${large ? " hpsm-avatar-large" : ""}`}>
    {member.image_url && !failed ? <img src={member.image_url} alt={fullName(member)} loading="lazy" onError={() => setFailed(true)} /> : <span aria-hidden="true">{initials(member)}</span>}
  </span>;
}

function StaffCard({ member, busy, onEdit, onStatus, onDelete }) {
  const date = member.created_at ? new Date(member.created_at) : null;
  return <article className={`hpsm-card${member.is_active ? "" : " is-inactive"}`}>
    <div className="hpsm-card-top"><Avatar member={member} /><span className={`hpsm-status ${member.is_active ? "is-active" : "is-inactive"}`}><i />{member.is_active ? "Active" : "Inactive"}</span></div>
    <h3>{fullName(member)}</h3>
    <div className="hpsm-roles">{String(member.role || "").split(",").map(r => r.trim()).filter(Boolean).map((role, i) => <span key={`${role}-${i}`}>{role}</span>)}{!member.role && <span>Role not assigned</span>}</div>
    <p className="hpsm-username">@{member.username || "—"}</p>
    <div className="hpsm-contact">
      {member.email && <a href={`mailto:${member.email}`}><StaffIcon name="mail" size={15} /><span>{member.email}</span></a>}
      {member.phone && <a href={`tel:${member.phone}`}><StaffIcon name="phone" size={15} /><span>{member.phone}</span></a>}
      {!member.email && !member.phone && <span className="hpsm-muted">No contact details added.</span>}
    </div>
    {member.bio && <details className="hpsm-bio"><summary>About {member.first_name || "this staff member"}</summary><p>{member.bio}</p></details>}
    <p className="hpsm-created">{date && !Number.isNaN(date.getTime()) ? `Added ${date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}` : "Date unavailable"}</p>
    <div className="hpsm-card-actions">
      <button type="button" className="hpsm-button hpsm-primary" onClick={onEdit} disabled={busy}><StaffIcon name="edit" size={14} />Edit</button>
      <button type="button" className={`hpsm-button ${member.is_active ? "hpsm-neutral" : "hpsm-activate"}`} onClick={onStatus} disabled={busy}>{busy ? "Working…" : member.is_active ? "Deactivate" : "Activate"}</button>
      <button type="button" className="hpsm-button hpsm-delete" onClick={onDelete} disabled={busy} aria-label={`Permanently delete ${fullName(member)}`} title="Permanently delete staff member"><StaffIcon name="trash" size={15} /><span>Delete</span></button>
    </div>
  </article>;
}

export default function Staff() {
  const token = localStorage.getItem("prideToken");
  const [account] = useState(readAccount);
  const prideId = account.pride_id;
  const [staff, setStaff] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busyIds, setBusyIds] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const requestVersion = useRef(0);
  const memberLocks = useRef(new Set());
  const editorLock = useRef(false);
  const mounted = useRef(true);
  const editorBusy = saving || uploading || generating;
  const editingId = editing?.id;

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; requestVersion.current += 1; }; }, []);
  const fetchStaff = useCallback(async () => {
    const version = ++requestVersion.current;
    if (!token || prideId == null) { setLoadError("Your staff session could not be loaded. Please sign in again."); setLoading(false); return; }
    setLoading(true); setLoadError("");
    try {
      const res = await axios.get(`${API}/api/pride/${prideId}/staff`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data != null && !Array.isArray(res.data)) throw new Error("Unexpected staff response");
      if (mounted.current && version === requestVersion.current) setStaff(res.data || []);
    } catch {
      if (mounted.current && version === requestVersion.current) setLoadError("We couldn’t load the staff directory. Please try again.");
    } finally { if (mounted.current && version === requestVersion.current) setLoading(false); }
  }, [token, prideId]);
  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  useEffect(() => {
    if (editingId == null) return undefined;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { if (dialog?.open) dialog.close(); document.body.style.overflow = overflow; triggerRef.current?.focus({ preventScroll: true }); };
  }, [editingId]);

  const closeEditor = () => { if (!editorLock.current) setEditing(null); };
  const beginEdit = (member, event) => { triggerRef.current = event.currentTarget; setShowPin(false); setEditing({ ...member, role: member.role || "" }); };
  const updateField = (name, value) => setEditing(previous => previous ? { ...previous, [name]: value } : previous);

  const changeStatus = async member => {
    if (memberLocks.current.has(member.id)) return;
    const nextActive = !member.is_active;
    if (!window.confirm(`${nextActive ? "Activate" : "Deactivate"} ${fullName(member)}?`)) return;
    memberLocks.current.add(member.id); setBusyIds(new Set(memberLocks.current));
    try {
      await axios.patch(`${API}/api/pride-staff/${member.id}`, { is_active: nextActive }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(nextActive ? "Staff activated" : "Staff deactivated");
      if (mounted.current) { setStaff(previous => previous.map(s => s.id === member.id ? { ...s, is_active: nextActive } : s)); await fetchStaff(); }
    } catch { toast.error(nextActive ? "Failed to activate staff" : "Failed to deactivate staff"); }
    finally { memberLocks.current.delete(member.id); if (mounted.current) setBusyIds(new Set(memberLocks.current)); }
  };
  const deleteStaff = async member => {
    if (memberLocks.current.has(member.id)) return;
    if (!window.confirm(`PERMANENT DELETE\n\nThis will permanently remove ${fullName(member)}.\n\nThis action cannot be undone.\n\nAre you sure?`)) return;
    memberLocks.current.add(member.id); setBusyIds(new Set(memberLocks.current));
    try {
      await axios.delete(`${API}/api/pride-staff/${member.id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Staff member permanently deleted");
      if (mounted.current) { setStaff(previous => previous.filter(s => s.id !== member.id)); await fetchStaff(); }
    } catch { toast.error("Failed to delete staff member"); }
    finally { memberLocks.current.delete(member.id); if (mounted.current) setBusyIds(new Set(memberLocks.current)); }
  };
  const saveEdit = async event => {
    event.preventDefault();
    if (!editing || editorLock.current) return;
    editorLock.current = true; setSaving(true);
    try {
      await axios.patch(`${API}/api/pride-staff/${editing.id}`, editing, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Staff updated");
      if (mounted.current) { setEditing(null); await fetchStaff(); }
    } catch { toast.error("Failed to update staff"); }
    finally { editorLock.current = false; if (mounted.current) setSaving(false); }
  };
  const handleImageUpload = async event => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editing || editorLock.current) return;
    if (file.type && !file.type.startsWith("image/")) { toast.error("Please choose an image file."); return; }
    const id = editing.id;
    editorLock.current = true; setUploading(true);
    const data = new FormData(); data.append("file", file); data.append("upload_preset", UPLOAD_PRESET);
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, data);
      if (!res.data.secure_url) throw new Error("Missing image URL");
      if (mounted.current) setEditing(previous => previous?.id === id ? { ...previous, image_url: res.data.secure_url } : previous);
      toast.success("Image uploaded ✨");
    } catch { toast.error("Image upload failed"); }
    finally { editorLock.current = false; if (mounted.current) setUploading(false); }
  };
  const generateStaffBio = async () => {
    if (editorLock.current) return;
    if (!editing?.first_name || !editing?.role) { toast.error("Name and role are required to generate a bio"); return; }
    const id = editing.id;
    editorLock.current = true; setGenerating(true);
    try {
      const keyPoints = `Name: ${editing.first_name} ${editing.last_name || ""}\nRole: ${editing.role}\n\nUser-written notes to include:\n${editing.bio || "(none provided)"}`;
      const res = await axios.post(`${API}/api/pride/generate-bio`, { key_points: keyPoints, role_type: "Pride Staff Member" }, { headers: { Authorization: `Bearer ${token}` } });
      if (typeof res.data.bio !== "string") throw new Error("Missing bio");
      if (mounted.current) setEditing(previous => previous?.id === id ? { ...previous, bio: res.data.bio } : previous);
      toast.success("Bio generated ✨");
    } catch { toast.error("Failed to generate bio"); }
    finally { editorLock.current = false; if (mounted.current) setGenerating(false); }
  };

  const counts = useMemo(() => ({ all: staff.length, active: staff.filter(s => s.is_active).length, inactive: staff.filter(s => !s.is_active).length }), [staff]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return staff.filter(s => (status === "all" || (status === "active" ? !!s.is_active : !s.is_active)) && [s.first_name, s.last_name, s.role, s.username, s.email, s.phone].filter(Boolean).join(" ").toLowerCase().includes(q));
  }, [staff, search, status]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const resetFilters = () => { setSearch(""); setStatus("all"); setPage(1); };

  return <section className="hpsm-root" aria-labelledby="hpsm-title">
    <style>{STYLES}</style>
    <header className="hpsm-header"><div className="hpsm-heading"><span className="hpsm-heading-icon"><StaffIcon name="users" size={25} /></span><div><p className="hpsm-eyebrow">People behind the Pride</p><h2 id="hpsm-title">Your staff community<span>.</span></h2><p>Good people. Shared purpose. Everything in one place.</p></div></div><button type="button" className="hpsm-button hpsm-neutral" disabled={loading} onClick={fetchStaff}><StaffIcon name="refresh" size={15} />{loading ? "Refreshing…" : "Refresh"}</button></header>
    <div className="hpsm-toolbar"><label className="hpsm-search"><StaffIcon name="search" /><span className="hpsm-sr">Search staff by name, role, username, email, or phone</span><input type="search" placeholder="Search your team…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></label><div className="hpsm-filters" role="group" aria-label="Filter staff by status">{[["all", "Everyone"], ["active", "Active"], ["inactive", "Inactive"]].map(([value, label]) => <button type="button" key={value} aria-pressed={status === value} className={status === value ? "is-selected" : ""} onClick={() => { setStatus(value); setPage(1); }}>{label}<span>{counts[value]}</span></button>)}</div></div>
    <p className="hpsm-results" role="status">{loading ? "Loading staff directory…" : `${filtered.length} ${filtered.length === 1 ? "staff member" : "staff members"}${search ? " match your search" : " in this view"}`}</p>
    {loadError && <div className="hpsm-load-error" role="alert"><span>{loadError}</span><button type="button" onClick={fetchStaff} disabled={loading}>Try again</button></div>}
    {loading && staff.length === 0 ? <div className="hpsm-loading"><span className="hpsm-loader" aria-hidden="true" /><strong>Gathering your community</strong><span>Your staff directory will appear here.</span></div> : !loadError && filtered.length === 0 ? <div className="hpsm-empty"><StaffIcon name="users" size={31} /><h3>{staff.length ? "No matching staff members" : "Your team starts here"}</h3><p>{staff.length ? "Try another name, role, or status." : "Staff members will appear here when they’re added."}</p>{(search || status !== "all") && <button type="button" className="hpsm-button hpsm-neutral" onClick={resetFilters}>Clear filters</button>}</div> : <div className="hpsm-grid" aria-busy={loading}>{visible.map(member => <StaffCard key={member.id} member={member} busy={busyIds.has(member.id)} onEdit={event => beginEdit(member, event)} onStatus={() => changeStatus(member)} onDelete={() => deleteStaff(member)} />)}</div>}
    {filtered.length > PAGE_SIZE && <nav className="hpsm-pagination" aria-label="Staff directory pages"><button type="button" className="hpsm-button hpsm-neutral" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>← Previous</button><span>Page {currentPage} of {pages}</span><button type="button" className="hpsm-button hpsm-neutral" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next →</button></nav>}

    {editing && createPortal(<dialog ref={dialogRef} className="hpsm-dialog" aria-labelledby="hpsm-edit-title" onCancel={event => { event.preventDefault(); closeEditor(); }}>
      <form className="hpsm-editor" onSubmit={saveEdit} aria-busy={editorBusy}>
        <header className="hpsm-modal-heading"><div><p className="hpsm-eyebrow">Staff profile</p><h2 id="hpsm-edit-title">Edit {editing.first_name || "staff member"}</h2></div><button type="button" className="hpsm-close" onClick={closeEditor} disabled={editorBusy} aria-label="Close staff editor" autoFocus><StaffIcon name="close" size={20} /></button></header>
        <div className="hpsm-editor-body">
          <div className="hpsm-photo-edit"><Avatar member={editing} large /><div><label htmlFor="hpsm-photo">Profile photo</label><p>A familiar face for your community.</p><input id="hpsm-photo" type="file" accept="image/*" disabled={editorBusy} onChange={handleImageUpload} /><span role="status">{uploading ? "Uploading photo…" : "Choose an image to update this profile."}</span></div></div>
          <div className="hpsm-field-grid">{Object.entries(FIELD_LABELS).map(([field, label]) => <div className="hpsm-field" key={field}><label htmlFor={`hpsm-${field}`}>{label}</label><div className={field === "pin" ? "hpsm-pin-wrap" : ""}><input id={`hpsm-${field}`} type={field === "email" ? "email" : field === "phone" ? "tel" : field === "pin" && !showPin ? "password" : "text"} autoComplete={field === "pin" ? "new-password" : "off"} value={editing[field] ?? ""} disabled={editorBusy} onChange={event => updateField(field, field === "phone" ? formatPhoneNumber(event.target.value) : event.target.value)} />{field === "pin" && <button type="button" disabled={editorBusy} aria-label={showPin ? "Hide PIN" : "Show PIN"} aria-pressed={showPin} onClick={() => setShowPin(value => !value)}>{showPin ? "Hide" : "Show"}</button>}</div></div>)}</div>
          <div className="hpsm-field hpsm-role-field"><label htmlFor="hpsm-role">Staff roles</label><Select inputId="hpsm-role" instanceId="hpsm-role-select" isMulti isDisabled={editorBusy} options={STAFF_ROLE_OPTIONS} placeholder="Search or select roles…" value={String(editing.role || "").split(",").map(r => r.trim()).filter(Boolean).map(r => ({ value: r, label: r }))} onChange={selected => updateField("role", (selected || []).map(option => option.value).join(", "))} menuPortalTarget={dialogRef.current} menuPosition="fixed" menuPlacement="auto" styles={SELECT_STYLES} /></div>
          <div className="hpsm-field"><div className="hpsm-bio-label"><label htmlFor="hpsm-bio">About this staff member</label><button type="button" className="hpsm-button hpsm-bio-generate" disabled={editorBusy} onClick={generateStaffBio}><StaffIcon name="sparkle" size={14} />{generating ? "Writing…" : "Generate bio"}</button></div><textarea id="hpsm-bio" rows={5} value={editing.bio || ""} disabled={editorBusy} onChange={event => updateField("bio", event.target.value)} placeholder="Write a bio or add a few notes to help generate one." /><p className="hpsm-helper">Bio generation uses the name, roles, and notes above. Review the result before saving.</p></div>
        </div>
        <footer className="hpsm-modal-actions"><span role="status">{saving ? "Saving profile…" : uploading ? "Uploading photo…" : generating ? "Generating biography…" : "Changes are saved when you’re ready."}</span><div><button type="button" className="hpsm-button hpsm-neutral" disabled={editorBusy} onClick={closeEditor}>Cancel</button><button type="submit" className="hpsm-button hpsm-primary" disabled={editorBusy}><StaffIcon name="check" size={16} />{saving ? "Saving…" : "Save changes"}</button></div></footer>
      </form>
    </dialog>, document.body)}
  </section>;
}

const SELECT_STYLES = {
  control: (base, state) => ({ ...base, minHeight: 44, borderRadius: 10, background: "#fff", borderColor: state.isFocused ? "#9c7cb0" : "#ddd2e4", boxShadow: state.isFocused ? "0 0 0 3px #9c7cb015" : "none", fontSize: 14 }),
  menuPortal: base => ({ ...base, zIndex: 10 }),
  menu: base => ({ ...base, background: "#fff", color: "#4b3e55", borderRadius: 10, overflow: "hidden", fontSize: 14 }),
  option: (base, state) => ({ ...base, background: state.isFocused ? "#f1e9f8" : "#fff", color: "#4b3e55" }),
  multiValue: base => ({ ...base, background: "#eee5f6", borderRadius: 6 }),
  multiValueLabel: base => ({ ...base, color: "#735287", fontWeight: 600, fontSize: 12 }),
  multiValueRemove: base => ({ ...base, color: "#735287", ":hover": { background: "#e1d0eb", color: "#51345f" } }),
  input: base => ({ ...base, color: "#4b3e55", fontSize: 16 }),
  placeholder: base => ({ ...base, color: "#8a7b94", fontSize: 13 }),
};

const STYLES = `
.hpsm-root,.hpsm-dialog{font:14px/1.6 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#403547;color-scheme:light}.hpsm-root{width:100%;min-width:0;padding:20px;border:1px solid #e8dfeb;border-radius:17px;background:#fcfaf8}.hpsm-root *,.hpsm-dialog *{box-sizing:border-box}.hpsm-root :is(h2,h3,p),.hpsm-dialog :is(h2,p){margin:0}.hpsm-root button,.hpsm-dialog button{font-family:inherit;cursor:pointer}.hpsm-root button:disabled,.hpsm-dialog button:disabled{opacity:.5;cursor:not-allowed}.hpsm-root button:focus-visible,.hpsm-root a:focus-visible,.hpsm-root summary:focus-visible,.hpsm-dialog button:focus-visible{outline:3px solid #9471aa;outline-offset:3px}
.hpsm-header{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:23px}.hpsm-heading{display:flex;align-items:center;gap:12px;min-width:0}.hpsm-heading-icon{display:grid;place-items:center;width:48px;height:48px;flex-shrink:0;background:linear-gradient(135deg,#f7e3ed,#ece7fa);color:#9a6d92;border:1px solid #e2cee1;border-radius:15px}.hpsm-eyebrow{font-size:9px;letter-spacing:1.1px;font-weight:750;text-transform:uppercase;color:#89718e}.hpsm-heading h2{font-size:clamp(21px,2.4vw,29px);line-height:1.25;font-weight:750;letter-spacing:-.7px;color:#44314c;margin:5px 0 7px}.hpsm-heading h2>span{color:#b47699}.hpsm-heading>div>p:last-child{font-size:11px;color:#817089}
.hpsm-button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:38px;padding:8px 11px;border:1px solid transparent;border-radius:9px;font-size:11px;font-weight:700;line-height:1.3;white-space:nowrap}.hpsm-button svg{flex-shrink:0}.hpsm-neutral{background:#fff;border-color:#ded3e6;color:#80668d}.hpsm-neutral:hover{background:#f6eff9}.hpsm-primary{background:#81608e;color:#fff;border-color:#81608e}.hpsm-primary:hover{background:#6c4b79}.hpsm-activate{background:#eaf5ee;color:#397154;border-color:#bcd8c6}.hpsm-delete{background:#fff8fa;color:#a55a73;border-color:#ead4dc}.hpsm-delete:hover{background:#fbe9ef}.hpsm-muted{font-size:11px;color:#796880}
.hpsm-toolbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}.hpsm-search{display:flex;align-items:center;gap:10px;flex:1 1 240px;border:1px solid #e0d4e6;background:#fff;border-radius:11px;min-height:44px;padding:0 12px;color:#80678d}.hpsm-search:focus-within{border-color:#a482b4;box-shadow:0 0 0 3px #9a7ca412}.hpsm-search>input{min-width:0;width:100%;border:0;outline:0;background:transparent;font-family:inherit;font-size:16px;line-height:1.4;color:#54415d;padding:11px 0}.hpsm-search input::placeholder{font-size:12px;color:#816c8d}.hpsm-search svg{flex-shrink:0}.hpsm-filters{display:flex;align-items:center;gap:4px;padding:4px;border:1px solid #e7dfe9;border-radius:11px;background:#f2edf4}.hpsm-filters>button{display:flex;align-items:center;justify-content:center;gap:7px;min-height:35px;padding:7px 10px;border:1px solid transparent;background:transparent;border-radius:8px;font-size:11px;font-weight:650;color:#806d8b}.hpsm-filters>button.is-selected{border-color:#dfcde9;background:#fff;color:#77548b;box-shadow:0 2px 5px #59326905}.hpsm-filters button>span{padding:1px 5px;background:#eee7f3;border-radius:6px;font-size:9px;color:#83668f}
.hpsm-results{font-size:10px;color:#8b7a94;margin:12px 0 16px!important}.hpsm-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr));gap:13px}.hpsm-card{display:flex;flex-direction:column;min-width:0;background:#fff;border:1px solid #e6dfea;border-top:3px solid #91b19a;border-radius:13px;padding:17px;box-shadow:0 3px 12px #62436905}.hpsm-card.is-inactive{border-top-color:#c5abc6;background:#fffdfd}.hpsm-card-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}.hpsm-avatar{display:grid;place-items:center;width:57px;height:57px;flex-shrink:0;border-radius:17px;background:linear-gradient(135deg,#f6e5ee,#eae7f9);border:1px solid #e4d3e5;color:#9a749d;font-size:18px;font-weight:750;overflow:hidden}.hpsm-avatar img{display:block;width:100%;height:100%;object-fit:cover}.hpsm-avatar-large{width:78px;height:78px;border-radius:20px}.hpsm-status{display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:700;padding:4px 8px;border-radius:99px;background:#f2eaf4;color:#97709b}.hpsm-status.is-active{background:#edf5ee;color:#587961}.hpsm-status i{width:5px;height:5px;border-radius:50%;background:currentColor}.hpsm-card h3{font-size:17px;font-weight:750;color:#4c3855;line-height:1.35;overflow-wrap:anywhere;margin-bottom:7px}.hpsm-roles{display:flex;flex-wrap:wrap;gap:4px}.hpsm-roles>span{font-size:9px;line-height:1.5;color:#8a6794;background:#f5eef8;border-radius:5px;padding:3px 6px;overflow-wrap:anywhere}.hpsm-username{font-size:10px;color:#7f6c87;margin:8px 0 10px!important;overflow-wrap:anywhere}.hpsm-contact{display:grid;gap:7px;padding:10px 0;border-block:1px solid #f1ebf3}.hpsm-contact a{display:flex;align-items:center;gap:7px;min-width:0;color:#766183;text-decoration:none;font-size:11px}.hpsm-contact a:hover{text-decoration:underline}.hpsm-contact a>span{overflow-wrap:anywhere;min-width:0}.hpsm-contact svg{flex-shrink:0;color:#84628f}.hpsm-bio{font-size:11px;color:#7c6687;margin-top:12px}.hpsm-bio summary{cursor:pointer;font-weight:650}.hpsm-bio p{margin-top:7px!important;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere;color:#6e5f78}.hpsm-created{font-size:9px;color:#7a6a82;padding:12px 0;margin-top:auto!important}.hpsm-card-actions{display:flex;gap:6px;flex-wrap:wrap}.hpsm-card-actions>.hpsm-primary{flex:1}.hpsm-card-actions>.hpsm-button{font-size:10px;padding:8px 10px}
.hpsm-pagination{display:flex;justify-content:center;align-items:center;gap:15px;margin-top:22px}.hpsm-pagination>span{font-size:11px;color:#8a7395}.hpsm-loading,.hpsm-empty{display:flex;align-items:center;flex-direction:column;gap:10px;text-align:center;padding:44px 15px;border:1px dashed #dfcee7;border-radius:13px;color:#9b7da5;background:#fffdfd}.hpsm-empty h3{font-size:17px;color:#70567c}.hpsm-loading strong{font-size:14px;color:#795e86}.hpsm-loading>span:last-child,.hpsm-empty p{font-size:12px;color:#7b6585}.hpsm-loader{width:37px;height:37px;border-radius:50%;background:conic-gradient(#d981a3,#e1b276,#c9c780,#91b99e,#8fadda,#b896d2,#d981a3);padding:4px;animation:hpsm-spin 1.5s linear infinite}.hpsm-loader::after{content:"";display:block;width:100%;height:100%;border-radius:50%;background:#fffdfd}@keyframes hpsm-spin{to{transform:rotate(360deg)}}.hpsm-load-error{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;background:#fff0f3;border:1px solid #e9c8d3;border-radius:10px;padding:13px;color:#a1546d;font-size:12px;margin-bottom:15px}.hpsm-load-error button{background:#fff;border:1px solid #e7c8d3;border-radius:7px;padding:8px;color:inherit;font-size:11px}.hpsm-sr{position:absolute;width:1px;height:1px;padding:0;clip-path:inset(50%);overflow:hidden;white-space:nowrap}
.hpsm-dialog{position:fixed;inset:0;width:min(640px,calc(100% - 28px));max-width:none;max-height:none;margin:auto;padding:0;border:1px solid #dfcfe6;border-radius:18px;background:#fffdfa;overflow:visible;box-shadow:0 25px 90px #30203338}.hpsm-dialog::backdrop{background:#2d22346b;backdrop-filter:blur(5px)}.hpsm-editor{display:flex;flex-direction:column;max-height:88dvh;min-height:0}.hpsm-modal-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:20px 23px;border-bottom:1px solid #ebdfed;flex-shrink:0;background:linear-gradient(110deg,#fff4f8,#f4eef9);border-radius:17px 17px 0 0}.hpsm-modal-heading h2{font-size:22px;font-weight:700;line-height:1.3;color:#65456d;overflow-wrap:anywhere;margin-top:4px}.hpsm-close{display:grid;place-items:center;width:38px;height:38px;flex-shrink:0;border:1px solid #e2cfe6;border-radius:11px;background:#fffb;color:#99769f}.hpsm-editor-body{padding:21px 23px;overflow:auto;overscroll-behavior:contain;min-height:0}.hpsm-photo-edit{display:flex;align-items:center;gap:14px;padding:14px;border:1px solid #e7dbea;background:linear-gradient(120deg,#fff4f8,#f9f5ed);border-radius:12px;margin-bottom:20px}.hpsm-photo-edit>div{min-width:0;flex:1}.hpsm-photo-edit label{font-size:12px;font-weight:700;color:#80598b}.hpsm-photo-edit p,.hpsm-photo-edit span[role=status]{display:block;font-size:10px;color:#7e6688;margin:3px 0 7px}.hpsm-photo-edit input{display:block;max-width:100%;width:100%;font-family:inherit;font-size:10px;color:#987ea2}.hpsm-photo-edit input::file-selector-button{border:1px solid #d9c3e1;border-radius:7px;padding:7px 9px;background:#f6e9f8;color:#92659c;font-weight:650;font-size:10px;margin-right:8px;cursor:pointer}.hpsm-field-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-bottom:16px}.hpsm-field{min-width:0}.hpsm-field label{display:block;font-size:11px;font-weight:750;color:#87638f;margin-bottom:6px}.hpsm-field input,.hpsm-field textarea{width:100%;min-width:0;border:1px solid #dfd1e5;border-radius:9px;padding:10px 11px;background:#fff;color:#60416b;font-family:inherit;font-size:16px;line-height:1.4;outline:0}.hpsm-field textarea{resize:vertical;min-height:112px}.hpsm-field input:focus,.hpsm-field textarea:focus{border-color:#b88ac5;box-shadow:0 0 0 3px #bc95c817}.hpsm-field input:disabled,.hpsm-field textarea:disabled{opacity:.65}.hpsm-field textarea::placeholder{font-size:12px;color:#826c8e}.hpsm-pin-wrap{display:flex;border:1px solid #dfd1e5;border-radius:9px;background:#fff}.hpsm-pin-wrap input{border:0}.hpsm-pin-wrap button{border:0;background:transparent;font-size:10px;color:#80548c;padding:8px 10px}.hpsm-role-field{margin-bottom:17px}.hpsm-bio-label{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px}.hpsm-bio-label label{margin:0}.hpsm-bio-generate{font-size:10px;background:#f5eaf9;color:#9a6da6;border-color:#e2cce9;min-height:32px;padding:6px 9px}.hpsm-helper{font-size:10px;color:#7c6485;margin-top:6px!important}.hpsm-modal-actions{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-shrink:0;padding:15px 23px;border-top:1px solid #e9dcec;background:#fffdfa;border-radius:0 0 17px 17px}.hpsm-modal-actions>span{font-size:10px;color:#796180}.hpsm-modal-actions>div{display:flex;gap:7px}
@media(max-width:650px){.hpsm-root{padding:13px;border-radius:13px}.hpsm-header{align-items:flex-start;gap:8px;margin-bottom:18px}.hpsm-heading{gap:9px}.hpsm-heading-icon{width:35px;height:35px;border-radius:11px}.hpsm-heading-icon svg{width:20px}.hpsm-heading h2{font-size:21px}.hpsm-heading>div>p:last-child{font-size:10px}.hpsm-header>.hpsm-button{font-size:0;padding:8px;min-width:36px}.hpsm-header>.hpsm-button svg{width:15px}.hpsm-eyebrow{font-size:8px;letter-spacing:.7px}.hpsm-toolbar{gap:9px}.hpsm-search{flex-basis:100%}.hpsm-filters{width:100%}.hpsm-filters>button{flex:1;font-size:10px;padding:7px}.hpsm-grid{gap:11px}.hpsm-card{padding:15px}.hpsm-card-actions>.hpsm-button{min-height:40px}.hpsm-dialog{width:calc(100% - 14px);border-radius:15px}.hpsm-editor{max-height:92dvh}.hpsm-modal-heading{padding:16px;border-radius:14px 14px 0 0}.hpsm-modal-heading h2{font-size:20px}.hpsm-editor-body{padding:15px}.hpsm-field-grid{gap:11px}.hpsm-photo-edit{gap:10px;padding:11px}.hpsm-avatar-large{width:61px;height:61px;border-radius:15px}.hpsm-modal-actions{padding:12px 15px;flex-wrap:wrap;border-radius:0 0 14px 14px}.hpsm-modal-actions>span{flex-basis:100%;font-size:9px}.hpsm-modal-actions>div{width:100%}.hpsm-modal-actions .hpsm-button{flex:1;min-height:42px}.hpsm-bio-generate{font-size:9px;padding:6px 7px}.hpsm-bio-label label{font-size:10px}.hpsm-pagination{gap:9px}.hpsm-pagination>span{font-size:10px}}
@media(max-width:370px){.hpsm-heading-icon{display:none}.hpsm-field-grid{grid-template-columns:1fr}.hpsm-card-actions .hpsm-delete span{display:none}}
@media(prefers-reduced-motion:reduce){.hpsm-loader{animation:none}}
`;
