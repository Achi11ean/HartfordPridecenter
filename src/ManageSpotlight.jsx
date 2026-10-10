import React, { useEffect, useState, useRef } from "react";

import axios from "axios";



import { useAuth } from "./AuthContext";

import { toast } from "react-toastify";

const API = "https://singspacebackend.onrender.com";

/* 🌤 Cloudinary */

const CLOUD_NAME = "dincfzdau";

const UPLOAD_PRESET = "pridecenters";

export default function ManageSpotlights() {

  const { prideId, token, isAdmin, isStaff } = useAuth();

  const [spotlights, setSpotlights] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [largeText, setLargeText] = useState(false);
  const editRef = useRef(null);
  useEffect(() => () => { editRef.current = null; }, []);

  const authHeaders = {

    headers: { Authorization: `Bearer ${token}` },

  };

  /* ---------------- LOAD SPOTLIGHTS ---------------- */

  const loadSpotlights = () => {

    if (!prideId || !token || (!isAdmin && !isStaff)) { setLoading(false); return; }

    setLoading(true);
    setError("");

    return axios

      .get(`${API}/api/pride/${prideId}/volunteer-spotlights`, authHeaders)

      .then((res) => setSpotlights(res.data || []))

      .catch(() => setError("Couldn’t load volunteer spotlights. Please try again."))

      .finally(() => setLoading(false));

  };

  useEffect(() => {

    loadSpotlights();

  }, [prideId, token, isAdmin, isStaff]);

  /* ---------------- CLOUDINARY ---------------- */

  const openUploadWidget = (spotlightId) => {

    if (!window.cloudinary?.openUploadWidget) { toast.error("Photo uploader is unavailable. Try again or paste an image URL."); return; }
    window.cloudinary.openUploadWidget(

      {

        cloudName: CLOUD_NAME,

        uploadPreset: UPLOAD_PRESET,

        sources: ["local", "url", "camera"],

        multiple: false,

        cropping: true,

        folder: "volunteer_spotlights",

      },

      (error, result) => {

        if (error) { toast.error("Photo upload failed. Please try again."); return; }
      if (editRef.current !== spotlightId) return;
      if (result?.event === "success") {

          setEditForm((prev) => ({

            ...prev,

            image_url: result.info.secure_url,

          }));

          toast.success("📸 Image uploaded!");

        }

      }

    );

  };

  /* ---------------- ACTIONS ---------------- */

  const startEdit = (s) => {

    editRef.current = s.id;
    setEditingId(s.id);

    setEditForm({ ...s });

  };

  const saveEdit = async (id) => {
    if (busy) return;
    setBusy(true);

    try {

      await axios.patch(

        `${API}/api/volunteer-spotlights/${id}`,

        editForm,

        authHeaders

      );

      toast.success("✨ Spotlight updated");

      editRef.current = null;
    setEditingId(null);

      loadSpotlights();

    } catch {

      toast.error("Failed to update spotlight");

    } finally { setBusy(false); }

  };

  const toggleActive = async (s) => {
    if (busy) return;
    setBusy(true);

    try {

      await axios.patch(

        `${API}/api/volunteer-spotlights/${s.id}`,

        { is_active: !s.is_active },

        authHeaders

      );

      loadSpotlights();

    } catch {

      toast.error("Failed to update status");

    } finally { setBusy(false); }

  };

  const deleteSpotlight = async (id) => {

    if (busy || !window.confirm("Delete this spotlight permanently?")) return;
    setBusy(true);

    try {

      await axios.delete(

        `${API}/api/volunteer-spotlights/${id}`,

        authHeaders

      );

      toast.success("🗑 Spotlight deleted");

      loadSpotlights();

    } catch {

      toast.error("Failed to delete spotlight");

    } finally { setBusy(false); }

  };

  if (!isAdmin && !isStaff) return null;

  const filtered = spotlights.filter(s => (filter === "all" || Boolean(s.is_active) === (filter === "active")) && [s.name,s.role,s.bio].some(value => String(value || "").toLowerCase().includes(query.trim().toLowerCase())));
  const locked = busy || loading;
  const cancelEdit = () => { editRef.current = null; setEditingId(null); setEditForm({}); };
  return <section className={`ms-panel${largeText ? " ms-large" : ""}`} aria-label="Manage volunteer spotlights">
    <style>{STYLES}</style>
    <header className="ms-header"><div><p className="ms-eyebrow">People who make a difference</p><h2>Volunteer spotlights <span>{spotlights.length}</span></h2><p>Celebrate your volunteers and manage their stories.</p></div><div className="ms-tools"><button type="button" aria-pressed={largeText} onClick={()=>setLargeText(v=>!v)}>A+ Larger text</button><button type="button" disabled={locked || editingId !== null} onClick={loadSpotlights}>{loading ? "Refreshing…" : "↻ Refresh"}</button></div></header>
    <div className="ms-toolbar"><label className="ms-search"><span>Search volunteers</span><input type="search" value={query} disabled={editingId !== null} onChange={e=>setQuery(e.target.value)} placeholder="Name, role, or bio…"/></label><label className="ms-filter"><span>Visibility</span><select value={filter} disabled={editingId !== null} onChange={e=>setFilter(e.target.value)}><option value="all">All spotlights</option><option value="active">Active</option><option value="inactive">Inactive</option></select></label></div>
    <div className="ms-results" role="status">{editingId !== null ? "Save or cancel your edit to search and filter." : `${filtered.length} spotlights · ${spotlights.filter(s=>s.is_active).length} active`}{(query || filter !== "all") && editingId === null && <button type="button" onClick={()=>{setQuery("");setFilter("all");}}>Clear filters</button>}</div>
    {error ? <div className="ms-state" role="alert">{error}<button type="button" onClick={loadSpotlights}>Try again</button></div> : loading && !spotlights.length ? <div className="ms-state" role="status">Loading volunteer spotlights…</div> : !filtered.length ? <div className="ms-state"><strong>{spotlights.length ? "No matching volunteers" : "No spotlights yet"}</strong><p>{spotlights.length ? "Try a different search or visibility filter." : "Volunteer spotlights will appear here once added."}</p></div> : <div className="ms-grid" aria-busy={loading}>{filtered.map(s=>{
      const editing = editingId === s.id;
      return <article key={s.id} className={`ms-card${editing ? " ms-editing" : ""}`} style={{"--ms-ink":s.is_active?"#356f59":"#796884","--ms-wash":s.is_active?"#e0f1e8":"#eee8f3"}}>
        <div className="ms-spot-head"><SpotlightPhoto src={editing ? editForm.image_url : s.image_url} name={editing ? editForm.name : s.name}/><div><span className="ms-badge">{s.is_active ? "Active" : "Inactive"}</span><h3>{s.name || "Unnamed volunteer"}</h3>{s.role && <p>{s.role}</p>}{s.years_of_service !== null && s.years_of_service !== undefined && s.years_of_service !== "" && <small>{s.years_of_service} {Number(s.years_of_service)===1 ? "year" : "years"} of service</small>}</div></div>
        {editing ? <form onSubmit={e=>{e.preventDefault();saveEdit(s.id);}}><div className="ms-edit-fields">
          <label><span>Name</span><input autoFocus value={editForm.name || ""} disabled={locked} onChange={e=>setEditForm({...editForm,name:e.target.value})}/></label>
          <label><span>Role</span><input value={editForm.role || ""} disabled={locked} onChange={e=>setEditForm({...editForm,role:e.target.value})}/></label>
          <label><span>Years of service</span><input type="number" min="0" value={editForm.years_of_service ?? ""} disabled={locked} onChange={e=>setEditForm({...editForm,years_of_service:e.target.value})}/></label>
          <div className="ms-upload"><button type="button" disabled={locked} onClick={()=>openUploadWidget(s.id)}>↥ Upload photo</button></div>
          <label className="ms-wide"><span>Photo URL</span><input value={editForm.image_url || ""} disabled={locked} onChange={e=>setEditForm({...editForm,image_url:e.target.value})} placeholder="Or paste an image URL"/><small>Photo changes are published when you save.</small></label>
          <label className="ms-wide"><span>Volunteer bio</span><textarea rows={6} value={editForm.bio || ""} disabled={locked} onChange={e=>setEditForm({...editForm,bio:e.target.value})} placeholder="Share their story and impact…"/></label>
        </div><footer className="ms-actions"><button type="submit" className="ms-primary" disabled={locked}>{busy ? "Saving…" : "Save changes"}</button><button type="button" disabled={locked} onClick={cancelEdit}>Cancel</button></footer></form> : <>
          <div className="ms-bio-label">Volunteer story</div><div className="ms-message" role="region" tabIndex={0} aria-label={`Bio for ${s.name || "volunteer"}`}>{s.bio || "No bio added yet. Edit this spotlight to share their story."}</div>
          <footer className="ms-actions"><button type="button" className="ms-primary" disabled={locked || editingId !== null} onClick={()=>startEdit(s)}>Edit spotlight</button><button type="button" disabled={locked || editingId !== null} onClick={()=>toggleActive(s)}>{s.is_active ? "Deactivate" : "Activate"}</button><button type="button" className="ms-delete" disabled={locked || editingId !== null} onClick={()=>deleteSpotlight(s.id)}>Delete</button></footer>
        </>}
      </article>;
    })}</div>}
  </section>;
}

function SpotlightPhoto({src,name}) {
  const [failed,setFailed] = useState(false);
  useEffect(()=>setFailed(false),[src]);
  return src && !failed ? <img className="ms-photo" src={src} alt={name || "Volunteer"} loading="lazy" onError={()=>setFailed(true)}/> : <div className="ms-photo ms-photo-fallback" role="img" aria-label={name || "Volunteer"}>{(name || "♡").trim().split(/\s+/).slice(0,2).map(word=>word[0]).join("").toUpperCase()}</div>;
}

const STYLES = `
.ms-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;color:#392f43;border:1px solid #ded5e5;border-radius:12px;font:14px/1.55 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.ms-panel *{box-sizing:border-box}.ms-panel :is(h2,h3,p){margin:0}.ms-panel :is(button,input,select,textarea){font:inherit}.ms-panel button{min-height:44px;padding:9px 13px;border:1px solid #d4c6df;border-radius:7px;background:#fff;color:#564263;font-weight:650;cursor:pointer;transition:background .18s}.ms-panel button:hover:not(:disabled){background:#f0e8f7}.ms-panel button:disabled{opacity:.5;cursor:not-allowed}.ms-panel :is(button,a,input,select,textarea,[tabindex]):focus-visible{outline:3px solid #795394;outline-offset:3px}.ms-panel :is(input,select,textarea){width:100%;min-width:0;min-height:44px;border:1px solid #cfc3d9;border-radius:7px;background:#fff;color:#392f43;padding:9px 11px;font-size:16px}.ms-panel textarea{resize:vertical;min-height:140px}.ms-header{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:18px}.ms-eyebrow{font-size:10px;font-weight:750;letter-spacing:1.4px;text-transform:uppercase;color:#77538b}.ms-header h2{display:flex;align-items:center;flex-wrap:wrap;gap:9px;font-size:clamp(20px,2.5vw,27px);letter-spacing:-.6px;font-weight:750;line-height:1.3;margin:5px 0}.ms-header h2>span{font-size:12px;letter-spacing:0;padding:3px 8px;border-radius:20px;background:#e9def1;color:#68477c}.ms-header>div>p:last-child{font-size:12px;color:#74647e}.ms-tools{display:flex;gap:7px;flex-shrink:0}.ms-tools button{font-size:12px}.ms-tools button[aria-pressed=true]{background:#77518a;color:#fff;border-color:#77518a}.ms-toolbar{display:flex;gap:12px;align-items:end}.ms-toolbar label>span,.ms-edit-fields label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#695575}.ms-search{flex:1;min-width:0}.ms-filter{width:195px;flex-shrink:0}.ms-results{display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:42px;font-size:11px;color:#73627e}.ms-results button{font-size:11px;border:0;background:none;text-decoration:underline;padding:4px;min-height:36px}.ms-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:13px;align-items:start}.ms-card{min-width:0;display:flex;flex-direction:column;background:#fff;border:1px solid #ded6e5;border-top:3px solid var(--ms-ink);border-radius:10px;padding:16px;box-shadow:0 4px 15px #4c335a08}.ms-card-top{display:flex;align-items:center;gap:11px}.ms-avatar{width:42px;height:42px;flex-shrink:0;display:grid;place-items:center;background:var(--ms-wash);color:var(--ms-ink);font-weight:800;border-radius:12px;font-size:14px}.ms-person{min-width:0}.ms-card h3{font-size:16px;font-weight:750;line-height:1.35;overflow-wrap:anywhere}.ms-badge{display:inline-block;font-size:10px;font-weight:750;padding:2px 8px;border-radius:20px;background:var(--ms-wash);color:var(--ms-ink);margin-top:4px}.ms-reach{display:flex;flex-direction:column;gap:2px;margin:10px 0;min-width:0}.ms-reach a{font-size:13px;color:#65507e;text-underline-offset:3px;overflow-wrap:anywhere;min-height:28px;display:flex;align-items:center}.ms-message{max-height:145px;overflow-y:auto;min-height:75px;padding:11px 12px;background:#f8f6fa;border:1px solid #e9e2ed;border-radius:6px;font-size:13px;line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere;scrollbar-width:thin;scrollbar-color:#b19bbd #f1ebf5}.ms-status-control{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px}.ms-status-control>span{font-size:11px;font-weight:650;color:#74617f}.ms-status-control select{width:155px;font-size:14px;background:var(--ms-wash);color:var(--ms-ink);border-color:transparent;font-weight:650}.ms-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid #eee7f1}.ms-actions button{font-size:12px}.ms-panel .ms-primary{background:#77518a;color:#fff;border-color:#77518a}.ms-panel .ms-primary:hover:not(:disabled){background:#603d73}.ms-panel .ms-delete{margin-left:auto;background:#fff;color:#9b3d57;border-color:#ead5dc}.ms-panel .ms-delete:hover:not(:disabled){background:#fbeaf0}.ms-actions>span{font-size:11px;color:#745181}.ms-edit-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px}.ms-editing{box-shadow:0 0 0 2px #ad91bd}.ms-edit-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.ms-wide{grid-column:1/-1}.ms-state{padding:35px 16px;text-align:center;border:1px dashed #cdbed8;border-radius:9px;background:#fff;color:#6f5b7b}.ms-state strong{display:block;color:#4f3a5c;font-size:17px;margin-bottom:5px}.ms-state button{display:block;margin:13px auto 0}.ms-error{color:#963955;background:#fff6f8}.ms-large .ms-message{font-size:18px}.ms-large .ms-reach a{font-size:16px}.ms-large .ms-card h3{font-size:19px}
@media(max-width:700px){.ms-header{align-items:flex-start;flex-direction:column;gap:10px}.ms-tools{width:100%}.ms-tools button{flex:1}.ms-toolbar{flex-wrap:wrap;gap:9px}.ms-search{flex-basis:100%}.ms-filter{width:100%}.ms-panel{padding:12px}.ms-card{padding:14px}.ms-edit-fields{grid-template-columns:1fr}.ms-panel .ms-status-control select{font-size:16px}}
@media(prefers-reduced-motion:reduce){.ms-panel *{transition:none!important}}

.ms-grid{grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr))}.ms-spot-head{display:flex;align-items:center;gap:14px;margin-bottom:14px}.ms-spot-head>div{min-width:0}.ms-photo{display:block;width:78px;height:88px;object-fit:cover;border-radius:9px;border:3px solid #fff;outline:1px solid #e1d5e5;flex-shrink:0;background:#f0e8f6;box-shadow:0 4px 12px #56336512}.ms-photo-fallback{display:grid;place-items:center;color:#7d588c;font-size:23px;font-weight:750;background:linear-gradient(135deg,#f5deeb,#e4edf9)}.ms-spot-head h3{margin-top:5px}.ms-spot-head p{font-size:13px;color:#675570;margin-top:3px;overflow-wrap:anywhere}.ms-spot-head small{display:block;font-size:11px;color:#706075;margin-top:4px}.ms-bio-label{font-size:10px;font-weight:750;letter-spacing:1px;text-transform:uppercase;color:#7c6386;margin-bottom:6px}.ms-edit-fields{padding-top:14px;border-top:1px solid #eee5f2}.ms-upload{display:flex;align-items:flex-end}.ms-upload button{width:100%}.ms-edit-fields small{display:block;font-size:11px;color:#716179;margin-top:5px}.ms-large .ms-spot-head p{font-size:16px}.ms-card .ms-actions{gap:6px}.ms-card .ms-actions button{padding-inline:10px}
`;
