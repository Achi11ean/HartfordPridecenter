import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";
const CLOUD_NAME = "dincfzdau";
const UPLOAD_PRESET = "pridecenters";
const safeUrl = value => {
  try { const text = String(value || "").trim(); if (!text) return null; const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`); return ["http:", "https:"].includes(url.protocol) ? url.href : null; } catch { return null; }
};
function Logo({ src, name }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return <div className="mf-image">{src && !failed ? <img src={src} alt={name || "Funder logo"} loading="lazy" onError={() => setFailed(true)}/> : <span aria-hidden="true">{(name || "F").slice(0,2).toUpperCase()}</span>}</div>;
}

export default function ManageFunders() {
  const { prideId, isAuthenticated, isAdmin, isStaff } = useAuth();
  const allowed = !!(prideId && isAuthenticated && (isAdmin || isStaff));
  const id = useId();
  const [funders, setFunders] = useState([]);
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [servicesError, setServicesError] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [largeText, setLargeText] = useState(false);
  const [busy, setBusy] = useState("");
  const lock = useRef(false);
  const version = useRef(0);
  const editorHeading = useRef(null);
  const trigger = useRef(null);

  const loadData = useCallback(async () => {
    if (!allowed) return;
    const request = ++version.current;
    setLoading(true); setError("");
    const results = await Promise.allSettled([
      axios.get(`${API}/api/pride/${prideId}/funders`),
      axios.get(`${API}/api/pride/${prideId}/services`),
    ]);
    if (request !== version.current) return;
    if (results[0].status === "fulfilled") setFunders(Array.isArray(results[0].value.data) ? results[0].value.data : []);
    else setError("Could not load funders. Please refresh to try again.");
    if (results[1].status === "fulfilled") { setServices(Array.isArray(results[1].value.data) ? results[1].value.data : []); setServicesError(false); }
    else { setServices([]); setServicesError(true); }
    setLoading(false);
  }, [allowed, prideId]);
  // All hooks run before the permission guards, including when auth is loading.
  useEffect(() => { setFunders([]); setServices([]); setEditingId(null); loadData(); return () => { version.current++; }; }, [loadData]);
  useEffect(() => { if (editingId !== null) editorHeading.current?.focus(); }, [editingId]);

  const startEdit = (f, target) => {
    if (lock.current) return;
    trigger.current = target; setEditingId(f.id); setError(""); setNotice("");
    setEditForm({ organization_name: f.organization_name || "", contact_name: f.contact_name || "", contact_email: f.contact_email || "", details: f.details || "", logo_url: f.logo_url || "", is_active: f.is_active, website_url: f.website_url || "" });
  };
  const cancelEdit = () => { if (lock.current) return; setEditingId(null); setEditForm({}); requestAnimationFrame(() => trigger.current?.focus()); };
  const update = (key, value) => setEditForm(prev => ({ ...prev, [key]: value }));
  const runAction = async (label, action, message, closeEditor = false) => {
    if (!allowed || lock.current) return;
    lock.current = true; setBusy(label); setError(""); setNotice("");
    try {
      await action();
      if (closeEditor) { setEditingId(null); setEditForm({}); }
      setNotice(message); await loadData();
    } catch (err) { setError(typeof err.response?.data?.error === "string" ? err.response.data.error : "This change could not be completed. Please try again."); }
    finally { lock.current = false; setBusy(""); }
  };
  const uploadLogo = async file => {
    if (!file || !allowed || lock.current) return;
    lock.current = true; setBusy("upload"); setError("");
    try {
      const data = new FormData(); data.append("file",file); data.append("upload_preset",UPLOAD_PRESET);
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,data);
      if (!res.data.secure_url) throw new Error("Missing logo URL");
      update("logo_url",res.data.secure_url);
    } catch { setError("Logo upload failed. Please try again."); }
    finally { lock.current = false; setBusy(""); }
  };
  const saveEdit = e => { e.preventDefault(); runAction("save", () => axios.patch(`${API}/api/pride-funders/${editingId}`, editForm), "Funder updated.", true); };
  const deactivate = funderId => { if (!lock.current && window.confirm("Deactivate this funder?")) runAction("deactivate", () => axios.post(`${API}/api/pride-funders/${funderId}/deactivate`), "Funder deactivated."); };
  const deleteFunder = funderId => { if (!lock.current && window.confirm("DELETE this funder permanently?")) runAction("delete", () => axios.delete(`${API}/api/pride-funders/${funderId}`), "Funder deleted."); };
  const addService = (funderId, serviceId) => { if (serviceId) runAction("link", () => axios.post(`${API}/api/pride-funders/${funderId}/services`,{ service_id: serviceId }), "Service linked."); };
  const removeService = (funderId, serviceId) => runAction("unlink", () => axios.delete(`${API}/api/pride-funders/${funderId}/services/${serviceId}`), "Service unlinked.");
  const query = search.trim().toLowerCase();
  const filtered = funders.filter(f => (!query || [f.organization_name,f.contact_name,f.contact_email].some(value => String(value || "").toLowerCase().includes(query))) && (filter === "all" || (filter === "active" ? f.is_active : !f.is_active)));
  const activeFunder = funders.find(f => f.id === editingId);
  const field = (key,label,type="text") => <label className="mf-field"><span>{label}</span><input type={type} value={editForm[key] || ""} onChange={e => update(key,e.target.value)}/></label>;

  return <section className={`mf-panel${largeText ? " mf-large" : ""}`} aria-labelledby={`${id}-title`}>
    <style>{STYLES}</style>
    {!allowed ? <div className="mf-error" role="alert">{!isAuthenticated || !prideId ? "Authentication required to manage funders." : "You do not have permission to manage funders."}</div> : <>
      <header className="mf-header"><div><p className="mf-eyebrow">Partners in possibility</p><h2 id={`${id}-title`}>Manage funders <span className="mf-total">{funders.length}</span></h2><p>Celebrate support. Keep every connection organized.</p></div><button type="button" aria-pressed={largeText} onClick={() => setLargeText(v => !v)}>{largeText ? "A− Standard text" : "A+ Larger text"}</button></header>
      <div className="mf-toolbar"><label className="mf-field"><span>Find a funder</span><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Organization, contact, or email…"/></label><label className="mf-field"><span>Status</span><select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All funders</option><option value="active">Active only</option><option value="inactive">Inactive only</option></select></label><button type="button" onClick={loadData} disabled={loading || !!busy || editingId !== null}>Refresh</button></div>
      {error && <div className="mf-error" role="alert">{error}</div>}{servicesError && <div className="mf-error" role="alert">Services could not be loaded. Refresh to try again.</div>}{notice && <p className="mf-success" role="status">✓ {notice}</p>}
      {loading ? <p className="mf-empty" role="status">Loading funders…</p> : <>
        {activeFunder && <form className="mf-editor" onSubmit={saveEdit} aria-busy={!!busy}>
          <header className="mf-edit-heading"><div><p className="mf-eyebrow">Editing funder</p><h3 ref={editorHeading} tabIndex={-1}>{activeFunder.organization_name}</h3></div><button type="button" disabled={!!busy} onClick={cancelEdit}>Cancel</button></header>
          <fieldset disabled={!!busy}><div className="mf-edit-grid">
            <section className="mf-form-section"><h4>01 · Organization & contact</h4><div className="mf-form-stack">{field("organization_name","Organization name")}{field("contact_name","Contact name")}{field("contact_email","Contact email","email")}{field("website_url","Website URL")}</div></section>
            <section className="mf-form-section"><h4>02 · Logo & visibility</h4><div className="mf-upload"><Logo src={editForm.logo_url} name={editForm.organization_name}/><label className="mf-field"><span>Upload logo</span><input type="file" accept="image/*" onChange={e => uploadLogo(e.target.files?.[0])}/></label></div>{field("logo_url","Or paste a logo URL")}<label className="mf-check"><input type="checkbox" checked={!!editForm.is_active} onChange={e => update("is_active",e.target.checked)}/><span>Funder is active</span></label></section>
          </div><section className="mf-form-section mf-description"><label className="mf-field"><span>Message / details</span><textarea rows={5} value={editForm.details || ""} onChange={e => update("details",e.target.value)} placeholder="A message from this organization…"/></label></section></fieldset>
          <footer className="mf-edit-footer"><p role="status">{busy === "upload" ? "Uploading logo…" : busy === "save" ? "Saving changes…" : "Save to apply your changes."}</p><div className="mf-actions"><button type="button" onClick={cancelEdit} disabled={!!busy}>Cancel</button><button className="mf-primary" type="submit" disabled={!!busy}>{busy === "save" ? "Saving…" : "Save changes"}</button></div></footer>
        </form>}
        <p className="mf-count" role="status">Showing {filtered.length} of {funders.length} funders</p>
        <div className="mf-grid">{filtered.map(f => {
          const linked = Array.isArray(f.services) ? f.services : [];
          const available = services.filter(s => !linked.some(item => String(item.id) === String(s.id)));
          const website = safeUrl(f.website_url);
          return <article className="mf-card" key={f.id}>
            <div className="mf-card-header"><Logo src={f.logo_url} name={f.organization_name}/><div><h3>{f.organization_name || "Unnamed funder"}</h3><span className={`mf-active${f.is_active ? "" : " mf-inactive"}`}>{f.is_active ? "Active" : "Inactive"}</span></div></div>
            {(f.contact_name || f.contact_email) && <div className="mf-contact">{f.contact_name && <strong>{f.contact_name}</strong>}{f.contact_email && <a href={`mailto:${f.contact_email}`}>{f.contact_email}</a>}</div>}
            {f.details && <section className="mf-message"><h4>Message from this funder</h4><div className="mf-notes" tabIndex={0} role="region" aria-label={`${f.organization_name} details`}>{f.details}</div></section>}
            {website && <div className="mf-links"><a href={website} target="_blank" rel="noopener noreferrer">Visit website ↗</a></div>}
            <section className="mf-services"><h4>Funded services <span>{linked.length}</span></h4>{linked.length ? <ul>{linked.map(s => <li key={s.id}><span>{s.title}</span><button type="button" disabled={!!busy || editingId !== null} className="mf-remove" aria-label={`Unlink ${s.title} from ${f.organization_name}`} onClick={() => removeService(f.id,s.id)}>×</button></li>)}</ul> : <p>No services linked yet.</p>}<label className="mf-field"><span>Link a service</span><select value="" disabled={!!busy || editingId !== null || servicesError || !available.length} onChange={e => addService(f.id,e.target.value)}><option value="" disabled>{servicesError ? "Services unavailable" : !available.length ? "No additional services available" : "Choose a service…"}</option>{available.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></label></section>
            <footer className="mf-card-footer"><div className="mf-actions"><button type="button" disabled={!!busy || editingId !== null} onClick={e => startEdit(f,e.currentTarget)}>Edit</button>{f.is_active && <button type="button" disabled={!!busy || editingId !== null} onClick={() => deactivate(f.id)}>Deactivate</button>}<button type="button" className="mf-delete" disabled={!!busy || editingId !== null} onClick={() => deleteFunder(f.id)}>Delete</button></div></footer>
          </article>;
        })}</div>
        {!filtered.length && !error && <div className="mf-empty"><h3>{funders.length ? "No matching funders" : "No funders added yet"}</h3><p>{funders.length ? "Try a different name or status." : "Your community supporters will appear here."}</p>{funders.length > 0 && <button type="button" onClick={() => {setSearch("");setFilter("all");}}>Clear filters</button>}</div>}
      </>}
    </>}
  </section>;
}

const STYLES = `
.mf-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);border:1px solid #ddd7c9;border-radius:12px;background:#f7f5ef;color:#3d3930;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.mf-panel *{box-sizing:border-box}.mf-panel :is(h2,h3,h4,p){margin:0}.mf-panel :is(button,input,textarea,select){font:inherit}.mf-panel button{min-height:44px;border:1px solid #d1c3dc;border-radius:7px;padding:8px 13px;background:#fff;color:#675631;font-size:12px;font-weight:750;cursor:pointer;transition:background .18s}.mf-panel button:hover:not(:disabled){background:#efe7f6}.mf-panel button:disabled{opacity:.5;cursor:not-allowed}.mf-panel :is(button,input,textarea,select,a,[tabindex]):focus-visible{outline:3px solid #805995;outline-offset:3px}.mf-header{display:flex;justify-content:space-between;align-items:center;gap:14px;border-bottom:1px solid #e1d5e7;padding-bottom:15px}.mf-eyebrow{color:#827047;font-size:10px;letter-spacing:1.5px;font-weight:750;text-transform:uppercase}.mf-header h2{font-size:clamp(22px,2.5vw,29px);line-height:1.3;letter-spacing:-.6px;margin:5px 0}.mf-header h2>span{display:inline-block;vertical-align:middle;padding:2px 9px;background:#e9dff0;border-radius:20px;color:#70567f;font-size:12px;letter-spacing:0}.mf-header p:last-child{font-size:12px;color:#746e62}.mf-header>button{flex-shrink:0}.mf-toolbar{display:grid;grid-template-columns:minmax(0,1fr) minmax(150px,210px) auto;gap:12px;align-items:end;margin:16px 0}.mf-field{display:block;min-width:0}.mf-field>span{display:block;font-size:12px;font-weight:750;color:#6e6045;margin-bottom:5px}.mf-panel :is(input:not([type=checkbox]),select,textarea){display:block;width:100%;min-width:0;min-height:44px;padding:10px 12px;border:1px solid #cec8bb;border-radius:6px;background:#fff;color:#3d3930;font-size:16px;line-height:1.5}.mf-panel input::placeholder,.mf-panel textarea::placeholder{color:#80718a}.mf-count{color:#746e62;font-size:12px;margin:12px 0!important}.mf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,350px),1fr));gap:14px;align-items:start}.mf-card{--status:#896999;--badge:#eee5f4;--ink:#644579;min-width:0;padding:16px;background:#fff;border:1px solid #dad5ca;border-top:3px solid var(--status);border-radius:10px;box-shadow:0 4px 14px #68457807}.mf-card[data-status=pending]{--status:#bf9a50;--badge:#fff2d9;--ink:#725114}.mf-card[data-status=approved]{--status:#79a68d;--badge:#e7f3ec;--ink:#35634b}.mf-card[data-status=confirmed]{--status:#7b9fc5;--badge:#e7effa;--ink:#3d5f85}.mf-card[data-status=declined]{--status:#c3879d;--badge:#fae9ef;--ink:#913c59}.mf-card[data-status=cancelled]{--status:#9b98a4;--badge:#efedf2;--ink:#605969}.mf-card-header{display:flex;gap:13px;align-items:center}.mf-card-header>div:last-child{min-width:0}.mf-card h3{font-size:18px;line-height:1.35;font-weight:750;overflow-wrap:anywhere}.mf-card-header p{color:#746e62;font-size:12px;margin-top:3px}.mf-image{display:grid;place-items:center;flex-shrink:0;width:74px;height:74px;background:#f7f4f9;border:1px solid #e4dcea;border-radius:8px;padding:6px;color:#795c8c;font-size:23px;font-weight:750}.mf-image img{display:block;max-width:100%;max-height:100%;object-fit:contain}.mf-active{display:inline-block;font-size:10px;font-weight:700;color:#3b6850;background:#e5f1e9;padding:1px 7px;border-radius:12px;margin-top:5px}.mf-inactive{color:#726b7a;background:#efecf2}.mf-contact{display:flex;flex-direction:column;padding:10px 12px;margin-top:13px;background:#f6f5f1;border-radius:7px;font-size:12px;overflow-wrap:anywhere}.mf-contact a{color:#66517e;text-decoration:underline}.mf-notes{font-size:13px;line-height:1.7;color:#5e5268;white-space:pre-wrap;overflow-wrap:anywhere;max-height:130px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#b59cc4 #f6f1f8;padding-right:8px;margin-top:12px}.mf-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.mf-links a{display:inline-flex;align-items:center;min-height:44px;color:#5d5281;font-size:12px;font-weight:650;text-underline-offset:3px;padding:2px 5px}.mf-card-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:10px;padding-top:12px;border-top:1px solid #eee6f2}.mf-panel .mf-status{background:var(--badge);border-color:var(--status);color:var(--ink);text-transform:capitalize;display:flex;align-items:center;gap:14px}.mf-actions{display:flex;gap:7px;flex-wrap:wrap}.mf-panel .mf-delete{color:#963c58;background:#fceef2;border-color:#e5c5d0}.mf-panel .mf-primary{background:#806b3c;border-color:#806b3c;color:white}.mf-panel .mf-primary:hover:not(:disabled){background:#68542c}.mf-empty{padding:28px 14px;text-align:center;color:#766280;border:1px dashed #d5c6df;border-radius:8px;margin:12px 0}.mf-empty h3{font-size:18px;color:#53415f}.mf-empty button{margin-top:12px}.mf-error{padding:12px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px}.mf-editor{margin:16px 0;border:1px solid #c8b3d6;background:#eeeae0;border-radius:10px;padding:clamp(12px,2vw,20px)}.mf-edit-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:15px}.mf-edit-heading h3{font-size:21px;overflow-wrap:anywhere}.mf-editor fieldset{min-width:0;padding:0;border:0;margin:0}.mf-edit-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mf-form-section{min-width:0;background:#fff;border:1px solid #ddd1e6;border-top:3px solid #b7a169;border-radius:8px;padding:15px}.mf-form-section:nth-child(2){border-top-color:#aab0ba}.mf-form-section h4{font-size:13px;color:#6e6045;margin-bottom:12px}.mf-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mf-link-editor{margin-top:18px}.mf-link-editor h4{margin-bottom:8px}.mf-link-row{display:flex;gap:7px;margin-bottom:8px;min-width:0}.mf-link-row>input{flex:1;min-width:0}.mf-link-row>button{flex-shrink:0;font-size:20px;min-width:44px}.mf-upload{display:flex;gap:12px;align-items:center;margin-bottom:12px}.mf-upload .mf-field{flex:1;min-width:0}.mf-panel input[type=file]{font-size:12px;padding:7px;overflow:hidden}.mf-panel input::file-selector-button{border:0;border-radius:4px;padding:6px;background:#eee6f5;color:#654775;margin-right:7px}.mf-times{margin:14px 0}.mf-check{display:flex;align-items:center;gap:9px;min-height:44px;margin-top:10px;font-size:13px;font-weight:650}.mf-check input{width:20px;height:20px;accent-color:#806b3c}.mf-description{margin-top:12px;border-top-color:#d4ae91}.mf-description-title{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}.mf-description-title label{font-size:13px;font-weight:750}.mf-description-title button[aria-pressed=true]{background:linear-gradient(110deg,#fae4e9,#eee3fa,#e0f2ef);color:#59416d}.mf-panel textarea{resize:vertical;min-height:125px;max-height:280px;overflow:auto;overscroll-behavior:contain}.mf-counter{text-align:right;font-size:11px;color:#7c6887;margin-top:5px!important}.mf-edit-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:14px}.mf-edit-footer p{font-size:12px;color:#71577f}.mf-large :is(.mf-notes,.mf-contact,.mf-card-header p){font-size:17px}.mf-large textarea{font-size:20px}.mf-large .mf-card h3{font-size:21px}@media(max-width:800px){.mf-edit-grid{grid-template-columns:1fr}}@media(max-width:520px){.mf-header{align-items:flex-start;flex-direction:column;gap:10px}.mf-toolbar{grid-template-columns:minmax(0,1fr) auto;gap:9px}.mf-toolbar>label:first-child{grid-column:1/-1}.mf-card{padding:12px}.mf-fields{grid-template-columns:1fr}.mf-edit-footer{align-items:stretch;flex-direction:column}.mf-edit-footer .mf-actions{display:grid;grid-template-columns:1fr 1fr}.mf-upload{align-items:flex-start;flex-direction:column}.mf-upload .mf-field{width:100%}.mf-card-header h3{font-size:17px}.mf-image{width:64px;height:64px}}@media(prefers-reduced-motion:reduce){.mf-panel *{transition:none!important}}

.mf-header h2 .mf-total{background:#eee6d0;color:#766036}.mf-card{border-top:3px solid #b7a169}.mf-card:nth-child(even){border-top-color:#aab0ba}.mf-form-stack{display:grid;gap:12px}.mf-message{margin-top:14px}.mf-message h4,.mf-services h4{font-size:12px;color:#756344;font-weight:750;margin:0 0 7px}.mf-services{margin-top:14px;padding-top:14px;border-top:1px solid #e7e2d8}.mf-services h4{display:flex;align-items:center;gap:7px}.mf-services h4>span{font-size:10px;padding:1px 7px;border-radius:12px;background:#e9e7e1;color:#66625a}.mf-services ul{list-style:none;padding:0;margin:0 0 12px;max-height:200px;overflow-y:auto}.mf-services li{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#f2f3f5;border:1px solid #dce0e4;padding:3px 7px 3px 10px;border-radius:6px;margin-bottom:6px;font-size:13px;color:#555e6a}.mf-services li>span{overflow-wrap:anywhere;min-width:0}.mf-services .mf-remove{min-width:44px;background:transparent;border:0;color:#905363;font-size:20px;flex-shrink:0}.mf-services>p{font-size:12px;color:#797367;margin-bottom:10px}.mf-success{padding:12px 14px;border:1px solid #bdd9c7;background:#e7f3eb;color:#326046;border-radius:7px;margin:12px 0!important;font-size:13px}.mf-large .mf-services li{font-size:17px}.mf-card .mf-notes{margin-top:6px}.mf-check input{accent-color:#806b3c}

/* Compact funder cards: one column on phones, two on tablets, four on desktop. */
.mf-grid{grid-template-columns:minmax(0,1fr);gap:10px}
.mf-card{padding:12px;border-radius:8px}
.mf-card-header{gap:9px;align-items:flex-start}
.mf-card .mf-image{width:52px;height:52px;padding:5px;font-size:18px;border-radius:6px}
.mf-card h3{font-size:15px;line-height:1.35}
.mf-card .mf-contact{padding:7px 9px;margin-top:9px;font-size:11px}
.mf-card .mf-message{margin-top:10px}
.mf-card .mf-notes{max-height:90px;font-size:12px;line-height:1.55}
.mf-card .mf-links{margin-top:5px}
.mf-card .mf-services{margin-top:8px;padding-top:10px}
.mf-card .mf-services ul{max-height:140px;margin-bottom:8px}
.mf-card .mf-services li{font-size:12px;padding-left:8px;margin-bottom:4px}
.mf-card .mf-services>p{font-size:11px;margin-bottom:7px}
.mf-card .mf-field>span{font-size:11px}
.mf-card select{padding:8px;font-size:14px}
.mf-card-footer{margin-top:9px;padding-top:9px}
.mf-card-footer .mf-actions{display:grid;grid-template-columns:repeat(auto-fit,minmax(65px,1fr));gap:5px;width:100%}
.mf-card-footer button{font-size:11px;padding:7px 6px;min-height:44px}
.mf-large .mf-card h3{font-size:19px}
.mf-large .mf-card .mf-notes,.mf-large .mf-card .mf-contact,.mf-large .mf-card .mf-services li{font-size:17px}
@media(min-width:640px){.mf-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:1024px){.mf-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
`;
