// Admin.jsx — admin account management, styled to match the other admin panels (Create Funder, etc.)
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";
const CLOUD_NAME = "dincfzdau";
const UPLOAD_PRESET = "pridecenters";

const ROLE_OPTIONS = [
  "Director",
  "Coordinator",
  "Event Lead",
  "Volunteer Manager",
  "Social Media & Marketing",
  "Web Developer",
  "Finance",
  "Community Outreach",
].map((r) => ({ value: r, label: r }));

const EMPTY_FORM = { name: "", email: "", username: "", pin: "", roles: [], image_url: "", bio: "" };

// "Admin" is permanent, so only the extra roles are stored in other_roles.
function parseRoles(otherRoles) {
  return otherRoles
    ? otherRoles.split(",").map((r) => r.trim()).filter((r) => r && r !== "Admin")
    : [];
}

function Avatar({ src, name, size = "md" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return src && !failed ? (
    <img className={`aa-avatar aa-avatar-${size}`} src={src} alt="" onError={() => setFailed(true)} />
  ) : (
    <span className={`aa-avatar aa-avatar-${size} aa-avatar-initial`} aria-hidden="true">{initial}</span>
  );
}

export default function Admin() {
  const { token, prideId, isAdmin } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [admins, setAdmins] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [pendingId, setPendingId] = useState(null); // admin with an action in progress

  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formError, setFormError] = useState("");

  // ───────── Fetch admins ─────────
  const fetchAdmins = useCallback(async () => {
    if (!prideId) { setStatus("ready"); return; }
    setStatus("loading");
    try {
      const res = await axios.get(`${API}/api/pride/${prideId}/admins`, { headers: { Authorization: `Bearer ${token}` } });
      setAdmins(Array.isArray(res.data) ? res.data : []);
      setStatus("ready");
    } catch {
      setStatus("error");
      toast.error("Failed to load admins");
    }
  }, [prideId, token]);

  useEffect(() => {
    if (isAdmin) fetchAdmins();
  }, [isAdmin, fetchAdmins]);

  const replaceAdmin = (updated) =>
    setAdmins((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));

  // ───────── Activate / deactivate ─────────
  const toggleActive = async (admin) => {
    setPendingId(admin.id);
    try {
      const res = await axios.patch(`${API}/api/pride-admins/${admin.id}`, { is_active: !admin.is_active }, { headers });
      const updated = res.data.admin ?? res.data;
      replaceAdmin(updated);
      toast.success(updated.is_active ? "Admin activated" : "Admin deactivated");
    } catch {
      toast.error("Failed to update admin");
    } finally {
      setPendingId(null);
    }
  };

  // ───────── Delete ─────────
  const deleteAdmin = async (admin) => {
    if (!window.confirm(`Delete the admin account for ${admin.name || admin.username}? This can’t be undone.`)) return;
    setPendingId(admin.id);
    try {
      await axios.delete(`${API}/api/pride-admins/${admin.id}`, { headers });
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      toast.success("Admin deleted");
    } catch {
      toast.error("Failed to delete admin");
    } finally {
      setPendingId(null);
    }
  };

  // ───────── Edit ─────────
  const openEdit = (admin) => {
    setEditingAdmin(admin);
    setFormError("");
    setEditForm({
      name: admin.name || "",
      email: admin.email || "",
      username: admin.username || "",
      pin: "",
      image_url: admin.image_url || "",
      bio: admin.bio || "",
      roles: parseRoles(admin.other_roles),
    });
  };

  const closeEdit = useCallback(() => {
    if (saving) return;
    setEditingAdmin(null);
  }, [saving]);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", UPLOAD_PRESET);
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, data);
      setEditForm((prev) => ({ ...prev, image_url: res.data.secure_url }));
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const generateAdminBio = async () => {
    if (!editForm.name.trim()) {
      setFormError("Add a name before generating a bio.");
      return;
    }
    setGenerating(true);
    setFormError("");
    try {
      const keyPoints = `
Name: ${editForm.name}
Roles: ${["Admin", ...editForm.roles].join(", ")}

User-written notes to include:
${editForm.bio || "(none provided)"}
`;
      const res = await axios.post(
        `${API}/api/pride/generate-bio`,
        { key_points: keyPoints, role_type: "Pride Administrator" },
        { headers }
      );
      setEditForm((prev) => ({ ...prev, bio: res.data.bio }));
      toast.success("Bio generated ✨");
    } catch {
      toast.error("Failed to generate bio");
    } finally {
      setGenerating(false);
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) { setFormError("Name is required."); return; }
    if (!editForm.username.trim()) { setFormError("Username is required."); return; }
    setSaving(true);
    setFormError("");
    try {
      const payload = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        username: editForm.username.trim(),
        image_url: editForm.image_url || null,
        bio: editForm.bio || null,
        other_roles: editForm.roles.length ? editForm.roles.join(", ") : null,
      };
      if (editForm.pin.trim()) payload.pin = editForm.pin.trim();

      const res = await axios.patch(`${API}/api/pride-admins/${editingAdmin.id}`, payload, { headers });
      replaceAdmin(res.data.admin ?? res.data);
      toast.success("Admin updated");
      setEditingAdmin(null);
    } catch (err) {
      setFormError(err.response?.data?.error || "Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ───────── Render ─────────
  let body;
  if (!isAdmin) {
    body = <div className="aa-error" role="alert">You need admin access to manage admin accounts.</div>;
  } else if (status === "loading") {
    body = <div className="aa-state" role="status"><span className="aa-loading-line" aria-hidden="true" />Loading admin accounts…</div>;
  } else if (status === "error") {
    body = (
      <div className="aa-state" role="alert">
        Admin accounts couldn’t load.
        <button type="button" className="aa-btn aa-btn-secondary" onClick={fetchAdmins}>Try again</button>
      </div>
    );
  } else if (!admins.length) {
    body = <div className="aa-state">No admin accounts yet.</div>;
  } else {
    body = (
      <ul className="aa-grid">
        {admins.map((admin) => {
          const roles = parseRoles(admin.other_roles);
          const busy = pendingId === admin.id;
          return (
            <li key={admin.id} className={`aa-card ${admin.is_active ? "" : "aa-card-inactive"}`} aria-busy={busy}>
              <div className="aa-card-head">
                <Avatar src={admin.image_url} name={admin.name} />
                <div className="aa-identity">
                  <span className={`aa-badge ${admin.is_active ? "" : "aa-badge-off"}`}>
                    {admin.is_active ? "Active" : "Inactive"}
                  </span>
                  <h3>{admin.name || "Unnamed admin"}</h3>
                  {admin.username && <p className="aa-username">@{admin.username}</p>}
                  {admin.email && <a className="aa-email" href={`mailto:${admin.email}`}>{admin.email}</a>}
                </div>
              </div>

              <div className="aa-details">
                <p className="aa-label">Roles</p>
                <ul className="aa-roles">
                  <li className="aa-role aa-role-admin">Admin</li>
                  {roles.map((r) => <li key={r} className="aa-role">{r}</li>)}
                </ul>
                <p className="aa-label">Public bio</p>
                <p className={`aa-bio ${admin.bio ? "" : "aa-bio-empty"}`}>{admin.bio || "No bio yet."}</p>
              </div>

              <div className="aa-actions">
                <button type="button" className="aa-btn aa-btn-primary" onClick={() => openEdit(admin)} disabled={busy}>
                  Edit
                </button>
                <button type="button" className="aa-btn aa-btn-secondary" onClick={() => toggleActive(admin)} disabled={busy}>
                  {busy ? "Working…" : admin.is_active ? "Deactivate" : "Activate"}
                </button>
                <button type="button" className="aa-btn aa-btn-danger" onClick={() => deleteAdmin(admin)} disabled={busy}>
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section className="aa-panel" aria-label="Admin accounts">
      <style>{STYLES}</style>
      <header className="aa-header">
        <div>
          <p className="aa-eyebrow">Team & access</p>
          <h2>Admin accounts</h2>
          <p>Manage who can sign in, their roles, and how they appear on the Our Team page.</p>
        </div>
        <div className="aa-header-side">
          {status === "ready" && isAdmin && (
            <span className="aa-count">{admins.length} {admins.length === 1 ? "admin" : "admins"}</span>
          )}
          <span className="aa-header-icon" aria-hidden="true">♛</span>
        </div>
      </header>

      {body}

      {editingAdmin && (
        <EditAdminModal
          admin={editingAdmin}
          form={editForm}
          setForm={setEditForm}
          onClose={closeEdit}
          onSubmit={saveEdit}
          onUpload={handleImageUpload}
          onGenerate={generateAdminBio}
          saving={saving}
          uploading={uploading}
          generating={generating}
          error={formError}
        />
      )}
    </section>
  );
}

function EditAdminModal({ admin, form, setForm, onClose, onSubmit, onUpload, onGenerate, saving, uploading, generating, error }) {
  const id = useId();
  const firstField = useRef(null);
  const fileInput = useRef(null);
  const locked = saving || uploading || generating;
  const change = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Lock page scroll, focus the first field, close on Escape.
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstField.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus?.();
    };
  }, [onClose]);

  return (
    <div className="aa-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="aa-modal" role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}>
        <header className="aa-modal-head">
          <div>
            <p className="aa-eyebrow">Edit admin</p>
            <h2 id={`${id}-title`}>{admin.name || admin.username || "Admin account"}</h2>
          </div>
          <button type="button" className="aa-close" onClick={onClose} disabled={saving} aria-label="Close">✕</button>
        </header>

        <form onSubmit={onSubmit} className="aa-modal-body" aria-busy={locked}>
          {error && <div className="aa-error" role="alert">{error}</div>}

          <section className="aa-form-card">
            <h3><span>01</span>Account</h3>
            <div className="aa-form-grid">
              <label htmlFor={`${id}-name`}>
                <span>Name *</span>
                <input ref={firstField} id={`${id}-name`} name="name" autoComplete="name" value={form.name} onChange={change} required disabled={saving} />
              </label>
              <label htmlFor={`${id}-username`}>
                <span>Username *</span>
                <input id={`${id}-username`} name="username" autoComplete="username" value={form.username} onChange={change} required disabled={saving} />
              </label>
              <label htmlFor={`${id}-email`}>
                <span>Email</span>
                <input id={`${id}-email`} name="email" type="email" autoComplete="email" value={form.email} onChange={change} disabled={saving} placeholder="name@example.org" />
              </label>
              <label htmlFor={`${id}-pin`}>
                <span>New PIN <small>Leave blank to keep the current PIN</small></span>
                <input id={`${id}-pin`} name="pin" type="password" inputMode="numeric" autoComplete="new-password" value={form.pin} onChange={change} disabled={saving} placeholder="••••" />
              </label>
            </div>
          </section>

          <section className="aa-form-card aa-form-card-alt">
            <h3><span>02</span>Public profile <small>Shown on the Our Team page</small></h3>

            <div className="aa-photo-row">
              <Avatar src={form.image_url} name={form.name} size="lg" />
              <div className="aa-photo-fields">
                <label htmlFor={`${id}-photo`}>
                  <span>Profile photo</span>
                  <input ref={fileInput} id={`${id}-photo`} type="file" accept="image/*" disabled={locked} onChange={(e) => onUpload(e.target.files[0])} />
                </label>
                {uploading ? (
                  <p className="aa-hint" role="status">Uploading photo…</p>
                ) : form.image_url ? (
                  <button
                    type="button"
                    className="aa-btn aa-btn-danger aa-btn-small"
                    disabled={locked}
                    onClick={() => { setForm((prev) => ({ ...prev, image_url: "" })); if (fileInput.current) fileInput.current.value = ""; }}
                  >
                    Remove photo
                  </button>
                ) : (
                  <p className="aa-hint">A clear, well-lit headshot works best.</p>
                )}
              </div>
            </div>

            <div className="aa-field">
              <label htmlFor={`${id}-roles`}><span>Additional roles</span></label>
              <div className="aa-roles-select">
                <span className="aa-role aa-role-admin aa-role-fixed" title="Admin is permanent">Admin</span>
                <div className="aa-select-wrap">
                  <Select
                    inputId={`${id}-roles`}
                    isMulti
                    isSearchable
                    isDisabled={saving}
                    options={ROLE_OPTIONS}
                    value={form.roles.map((r) => ({ value: r, label: r }))}
                    onChange={(selected) => setForm((prev) => ({ ...prev, roles: (selected || []).map((o) => o.value) }))}
                    placeholder="Search & add roles…"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    styles={SELECT_STYLES}
                  />
                </div>
              </div>
              <p className="aa-hint">The Admin role is permanent and can’t be removed.</p>
            </div>

            <div className="aa-field">
              <div className="aa-bio-head">
                <label htmlFor={`${id}-bio`}><span>Public bio</span></label>
                <button type="button" className="aa-btn aa-btn-secondary aa-btn-small" onClick={onGenerate} disabled={locked}>
                  {generating ? "Writing…" : "✨ Generate bio"}
                </button>
              </div>
              <textarea
                id={`${id}-bio`}
                name="bio"
                rows={5}
                value={form.bio}
                onChange={change}
                disabled={saving || generating}
                placeholder="Tell the community about this admin, or jot a few notes and use Generate bio."
              />
              <p className="aa-hint">Any notes you write here are used when generating a bio.</p>
            </div>
          </section>

          <footer className="aa-modal-foot">
            <button type="button" className="aa-btn aa-btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="aa-btn aa-btn-primary aa-btn-save" disabled={locked}>
              {saving ? "Saving…" : uploading ? "Uploading photo…" : "Save changes"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

// react-select, themed to the gold-and-stone admin palette.
const SELECT_STYLES = {
  control: (base, state) => ({
    ...base,
    minHeight: 46,
    borderRadius: 6,
    borderColor: state.isFocused ? "#8b732f" : "#ccc7bd",
    boxShadow: state.isFocused ? "0 0 0 2px #8b732f40" : "none",
    backgroundColor: "#fff",
    fontSize: 15,
    ":hover": { borderColor: "#a99a77" },
  }),
  menuPortal: (base) => ({ ...base, zIndex: 3100 }),
  menu: (base) => ({ ...base, border: "1px solid #ddd7c9", borderRadius: 8, boxShadow: "0 10px 26px #4a3f2a22", overflow: "hidden" }),
  option: (base, state) => ({
    ...base,
    fontSize: 14,
    cursor: "pointer",
    backgroundColor: state.isFocused ? "#f3ead3" : "#fff",
    color: "#443e34",
  }),
  multiValue: (base) => ({ ...base, backgroundColor: "#efe6d0", borderRadius: 99, border: "1px solid #ddcfa8" }),
  multiValueLabel: (base) => ({ ...base, color: "#5c5140", fontWeight: 650, fontSize: 12, paddingLeft: 9 }),
  multiValueRemove: (base) => ({ ...base, color: "#80682f", borderRadius: 99, ":hover": { backgroundColor: "#e4ce92", color: "#443d30" } }),
  placeholder: (base) => ({ ...base, color: "#807b73" }),
  input: (base) => ({ ...base, color: "#403c36" }),
};

const STYLES = `
.aa-panel,.aa-overlay{color:#443e34;font:14px/1.6 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color-scheme:light}
.aa-panel *,.aa-overlay *{box-sizing:border-box}
.aa-panel :is(h2,h3,p,ul),.aa-overlay :is(h2,h3,p,ul){margin:0}
.aa-panel :is(input,textarea,button),.aa-overlay :is(input,textarea,button){font:inherit}
.aa-panel :is(a,input,textarea,button):focus-visible,.aa-overlay :is(a,input,textarea,button):focus-visible{outline:3px solid #8b732f;outline-offset:3px}

.aa-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f7f6f2;border:1px solid #ded9ca;border-radius:12px}
.aa-header{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid #ddd7c8;padding-bottom:15px;margin-bottom:16px}
.aa-eyebrow{font-size:10px;letter-spacing:1.4px;font-weight:750;text-transform:uppercase;color:#80682f}
.aa-header h2{font-size:clamp(21px,2.5vw,28px);font-weight:750;letter-spacing:-.6px;line-height:1.3;margin:5px 0!important;color:#443d30}
.aa-header p:last-child{font-size:12px;color:#7a7263}
.aa-header-side{display:flex;align-items:center;gap:10px;flex-shrink:0}
.aa-count{padding:4px 10px;border-radius:99px;background:#eeeae0;border:1px solid #ddd7c8;color:#715c33;font-size:11px;font-weight:700;white-space:nowrap}
.aa-header-icon{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#e4ce92,#fff8e2 45%,#d5dae0 75%,#f3f5f7);color:#856b30;border:1px solid #d6c8a5;font-size:22px}

.aa-state{display:flex;flex-direction:column;align-items:center;gap:12px;padding:30px 16px;text-align:center;color:#7a7263;font-size:13px;background:#fff;border:1px dashed #d8d1bf;border-radius:9px}
.aa-loading-line{display:block;width:90px;height:3px;border-radius:3px;background:linear-gradient(90deg,#c8ae6b,#e4ce92,#a9b1bd);animation:aa-pulse 1.6s ease-in-out infinite}
@keyframes aa-pulse{0%,100%{opacity:.35}50%{opacity:1}}
.aa-error{padding:12px 14px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px;font-size:13px;margin-bottom:13px;overflow-wrap:anywhere}

.aa-grid{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.aa-card{display:flex;flex-direction:column;min-width:0;background:#fff;border:1px solid #ddd7c9;border-top:3px solid #c8ae6b;border-radius:9px;box-shadow:0 3px 12px #4a3f2a08;padding:clamp(14px,2vw,20px)}
.aa-card-inactive{border-top-color:#a9b1bd;background:#fbfbf9}
.aa-card-inactive .aa-avatar{filter:grayscale(.6);opacity:.8}
.aa-card-head{display:flex;align-items:center;gap:14px}
.aa-identity{min-width:0}
.aa-identity h3{font-size:18px;font-weight:750;letter-spacing:-.3px;line-height:1.3;color:#443d30;margin-top:4px!important;overflow-wrap:anywhere}
.aa-username{font-size:12px;color:#655a46;font-weight:600}
.aa-email{display:inline-block;font-size:12px;color:#80682f;text-decoration:underline;text-underline-offset:3px;overflow-wrap:anywhere}
.aa-email:hover{color:#5f4b1f}
.aa-badge{display:inline-block;padding:2px 9px;border-radius:20px;background:#d8ebdf;color:#316047;font-size:10px;font-weight:750;letter-spacing:.3px}
.aa-badge-off{background:#e9edf2;color:#5d6574}

.aa-avatar{display:block;flex-shrink:0;border-radius:50%;object-fit:cover;background:#fff;border:2px solid #e4ce92;box-shadow:0 2px 6px #4a3f2a14}
.aa-avatar-md{width:60px;height:60px}
.aa-avatar-lg{width:84px;height:84px}
.aa-avatar-initial{display:grid;place-items:center;background:linear-gradient(135deg,#efe0b9,#faf5e9);color:#82672e;font-weight:800;font-size:22px}
.aa-avatar-lg.aa-avatar-initial{font-size:30px}

.aa-details{flex:1;margin-top:14px;padding:13px 14px;background:#faf8f3;border:1px solid #ebe5d8;border-radius:8px}
.aa-label{font-size:10px;font-weight:750;letter-spacing:1.2px;text-transform:uppercase;color:#80682f;margin-bottom:6px!important}
.aa-label:not(:first-child){margin-top:12px!important}
.aa-roles{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.aa-role{display:inline-flex;align-items:center;padding:3px 10px;border-radius:99px;background:#e9edf2;border:1px solid #d6dce4;color:#4f5867;font-size:11px;font-weight:650}
.aa-role-admin{background:linear-gradient(135deg,#efe0b9,#faf5e9);border-color:#dccb9c;color:#6e5726}
.aa-bio{font-size:13px;color:#5c5446;white-space:pre-wrap;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}
.aa-bio-empty{color:#9a9384;font-style:italic}

.aa-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin-top:14px;padding-top:13px;border-top:1px solid #ece7dc}
.aa-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:40px;padding:8px 15px;border-radius:7px;border:1px solid transparent;font-size:13px;font-weight:700;cursor:pointer;transition:background .18s,border-color .18s}
.aa-btn:disabled{opacity:.55;cursor:not-allowed}
.aa-btn-primary{background:#806731;border-color:#806731;color:#fff}
.aa-btn-primary:hover:not(:disabled){background:#665024}
.aa-btn-secondary{background:#fff;border-color:#d4cdbd;color:#5c5140}
.aa-btn-secondary:hover:not(:disabled){background:#f3efe5}
.aa-btn-danger{background:#fff;border-color:#e2c4cb;color:#8b4c58}
.aa-btn-danger:hover:not(:disabled){background:#fbf0f2}
.aa-btn-small{min-height:36px;padding:6px 12px;font-size:12px}

.aa-overlay{position:fixed;inset:0;z-index:3000;display:grid;place-items:center;padding:16px;background:#2b261c99;backdrop-filter:blur(3px)}
.aa-modal{width:100%;max-width:640px;max-height:92dvh;display:flex;flex-direction:column;background:#f7f6f2;border:1px solid #ded9ca;border-radius:12px;box-shadow:0 24px 60px #2b261c40;overflow:hidden}
.aa-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #ddd7c8;background:#fff}
.aa-modal-head h2{font-size:20px;font-weight:750;letter-spacing:-.4px;color:#443d30;margin-top:3px!important;overflow-wrap:anywhere}
.aa-close{display:grid;place-items:center;width:38px;height:38px;flex-shrink:0;border-radius:8px;border:1px solid #ddd7c9;background:#fff;color:#655a46;font-size:15px;cursor:pointer}
.aa-close:hover:not(:disabled){background:#f3efe5}
.aa-modal-body{display:grid;gap:12px;padding:16px 20px 0;overflow-y:auto;overscroll-behavior:contain}
.aa-form-card{min-width:0;background:#fff;padding:16px;border:1px solid #ddd7c9;border-top:3px solid #c8ae6b;border-radius:9px}
.aa-form-card-alt{border-top-color:#a9b1bd;display:grid;gap:16px}
.aa-form-card h3{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:14px;font-weight:750;color:#5c5140}
.aa-form-card:not(.aa-form-card-alt) h3{margin-bottom:14px}
.aa-form-card h3>span{display:grid;place-items:center;width:25px;height:25px;border-radius:7px;background:linear-gradient(135deg,#efe0b9,#faf5e9);font-size:10px;color:#82672e}
.aa-form-card-alt h3>span{background:#e9edf2;color:#5d6574}
.aa-form-card h3>small{font-size:10px;color:#7a7263;font-weight:400;margin-left:auto}
.aa-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
.aa-form-grid label,.aa-field>label,.aa-photo-fields label{display:block;min-width:0}
.aa-overlay label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#655a46}
.aa-overlay label>span small{display:block;font-weight:400;color:#7f786b;font-size:10px}
.aa-overlay :is(input:not([type=file]),textarea){display:block;width:100%;min-width:0;min-height:46px;border:1px solid #ccc7bd;border-radius:6px;background:#fff;color:#403c36;padding:10px 12px;font-size:16px;line-height:1.5}
.aa-overlay :is(input,textarea)::placeholder{color:#807b73}
.aa-overlay :is(input,textarea):disabled{background:#f4f2ed}
.aa-overlay textarea{resize:vertical;min-height:120px}
.aa-overlay input[type=file]{width:100%;max-width:100%;font-size:12px;padding:8px;border:1px dashed #ccc7bd;border-radius:6px;background:#fdfcf9}
.aa-photo-row{display:flex;align-items:center;gap:16px}
.aa-photo-fields{flex:1;min-width:0;display:grid;gap:8px;justify-items:start}
.aa-photo-fields label{width:100%}
.aa-roles-select{display:flex;align-items:flex-start;gap:8px}
.aa-role-fixed{min-height:46px;padding-inline:13px;font-size:12px;flex-shrink:0;border-radius:6px}
.aa-select-wrap{flex:1;min-width:0}
.aa-bio-head{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;margin-bottom:5px}
.aa-bio-head label>span{margin-bottom:0}
.aa-hint{font-size:11px;color:#7a7263;margin-top:5px!important}
.aa-modal-foot{position:sticky;bottom:0;display:flex;justify-content:flex-end;gap:8px;margin:0 -20px;padding:14px 20px;background:#f7f6f2;border-top:1px solid #ddd7c8}
.aa-btn-save{min-width:150px}

@media(max-width:900px){.aa-grid{grid-template-columns:1fr}}
@media(max-width:640px){
  .aa-panel{padding:12px}
  .aa-header-icon{width:38px;height:38px;font-size:19px}
  .aa-actions .aa-btn{flex:1}
  .aa-overlay{padding:0;place-items:end center}
  .aa-modal{max-height:94dvh;border-radius:14px 14px 0 0}
  .aa-modal-head{padding:14px 16px}
  .aa-modal-body{padding:14px 16px 0}
  .aa-modal-foot{margin:0 -16px;padding:12px 16px}
  .aa-modal-foot .aa-btn{flex:1}
  .aa-form-grid{grid-template-columns:1fr}
  .aa-photo-row{align-items:flex-start}
  .aa-avatar-lg{width:68px;height:68px}
  .aa-roles-select{flex-direction:column;align-items:stretch}
  .aa-role-fixed{min-height:32px;align-self:flex-start}
  .aa-form-card h3>small{margin-left:0;flex-basis:100%}
}
@media(prefers-reduced-motion:reduce){.aa-panel *,.aa-overlay *{animation:none!important;transition:none!important}}
@media(forced-colors:active){.aa-card,.aa-form-card,.aa-modal{border:1px solid CanvasText}}
`;