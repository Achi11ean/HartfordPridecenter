import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const API = "https://singspacebackend.onrender.com";
const CLOUD_NAME = "dincfzdau";
const UPLOAD_PRESET = "pridecenters";
const safeUrl = value => {
  try { const text = String(value || "").trim(); if (!text) return null; const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`); return ["http:","https:"].includes(url.protocol) ? url.href : null; } catch { return null; }
};
function ServiceImage({src,title}) {
  const [failed,setFailed] = useState(false);
  useEffect(() => setFailed(false),[src]);
  return <div className="mse-photo">{src && !failed ? <img src={src} alt={title || "Service image"} loading="lazy" onError={() => setFailed(true)}/> : <span aria-hidden="true">✦</span>}</div>;
}
export default function ManageServices() {
  const {token,prideId} = useAuth();
  const id = useId();
  const [services,setServices] = useState([]);
  const [editingId,setEditingId] = useState(null);
  const [editForm,setEditForm] = useState({});
  const [loading,setLoading] = useState(true);
  const [busy,setBusy] = useState("");
  const [error,setError] = useState("");
  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("all");
  const [largeText,setLargeText] = useState(false);
  const pending = useRef(false);
  const request = useRef(0);
  const editorHeading = useRef(null);
  const editTrigger = useRef(null);
  const fileInput = useRef(null);
  const fetchServices = useCallback(async () => {
    const version = ++request.current;
    setLoading(true);setError("");
    if (!token || !prideId) {setServices([]);setLoading(false);setError("Sign in with your Pride account to manage services.");return;}
    try {
      const res = await axios.get(`${API}/api/pride/${prideId}/services`,{headers:{Authorization:`Bearer ${token}`}});
      if(version === request.current) setServices(Array.isArray(res.data) ? res.data : []);
    } catch {if(version === request.current) {setError("Failed to load services. Please refresh to try again.");toast.error("Failed to load services");}}
    finally {if(version === request.current) setLoading(false);}
  },[token,prideId]);
  useEffect(() => {setServices([]);setEditingId(null);fetchServices();return () => {request.current++;};},[fetchServices]);
  useEffect(() => {if(editingId !== null) editorHeading.current?.focus();},[editingId]);
  const startEdit = (service,target) => {if(pending.current)return;editTrigger.current=target;setEditingId(service.id);setEditForm({...service});setError("");};
  const cancelEdit = () => {if(pending.current)return;setEditingId(null);setEditForm({});requestAnimationFrame(() => editTrigger.current?.focus());};
  const update = (key,value) => setEditForm(prev => ({...prev,[key]:value}));
  const handleImageUpload = async file => {
    if(!file || pending.current)return;
    pending.current=true;setBusy("upload");setError("");
    try {
      const data=new FormData();data.append("file",file);data.append("upload_preset",UPLOAD_PRESET);
      const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{method:"POST",body:data});
      const json=await res.json();if(!res.ok || !json.secure_url)throw new Error("Upload failed");
      update("image_url",json.secure_url);toast.success("🖼 Image uploaded");
    }catch {setError("Image upload failed. Please try again.");toast.error("Image upload failed");}
    finally {pending.current=false;setBusy("");if(fileInput.current)fileInput.current.value="";}
  };
  const saveEdit = async e => {
    e.preventDefault();if(pending.current)return;
    pending.current=true;setBusy("save");setError("");
    try {
      await axios.patch(`${API}/api/pride-services/${editingId}`,editForm,{headers:{Authorization:`Bearer ${token}`}});
      toast.success("Service updated");setEditingId(null);setEditForm({});await fetchServices();
    }catch {setError("Update failed. Your changes are still in the editor.");toast.error("Update failed");}
    finally {pending.current=false;setBusy("");}
  };
  const deleteService = async serviceId => {
    if(pending.current || !window.confirm("Delete this service permanently?"))return;
    pending.current=true;setBusy("delete");setError("");
    try {
      await axios.delete(`${API}/api/pride-services/${serviceId}`,{headers:{Authorization:`Bearer ${token}`}});
      toast.info("Service deleted");setServices(prev => prev.filter(s => s.id !== serviceId));
    }catch {setError("Delete failed. Please try again.");toast.error("Delete failed");}
    finally {pending.current=false;setBusy("");}
  };
  const query=search.trim().toLowerCase();
  const filtered=services.filter(s => (!query || [s.title,s.description,s.contact_name,s.contact_email].some(value => String(value || "").toLowerCase().includes(query))) && (filter === "all" || (filter === "active" ? s.is_active : !s.is_active)));
  const selected=services.find(s => s.id === editingId);
  const field=(key,label,type="text") => <label className="mse-field"><span>{label}</span><input type={type} value={editForm[key] || ""} onChange={e => update(key,e.target.value)}/></label>;
  return <section className={`mse-panel${largeText ? " mse-large" : ""}`} aria-labelledby={`${id}-title`}>
    <style>{STYLES}</style>
    <header className="mse-header"><div><p className="mse-eyebrow">Care, connection & community</p><h2 id={`${id}-title`}>Manage services <span>{services.length}</span></h2><p>Keep programs, resources, and contact details up to date.</p></div><button type="button" aria-pressed={largeText} onClick={() => setLargeText(v => !v)}>{largeText ? "A− Standard text" : "A+ Larger text"}</button></header>
    <div className="mse-toolbar"><label className="mse-field"><span>Find a service</span><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Title, description, or contact…"/></label><label className="mse-field"><span>Status</span><select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All services</option><option value="active">Active only</option><option value="inactive">Inactive only</option></select></label><button type="button" onClick={fetchServices} disabled={loading || !!busy || editingId !== null}>Refresh</button></div>
    {error && <div className="mse-error" role="alert">{error}</div>}
    {loading ? <p className="mse-empty" role="status">Loading services…</p> : <>
      {selected && <form className="mse-editor" onSubmit={saveEdit} aria-busy={!!busy}><header className="mse-edit-heading"><div><p className="mse-eyebrow">Editing service</p><h3 ref={editorHeading} tabIndex={-1}>{selected.title}</h3></div><button type="button" disabled={!!busy} onClick={cancelEdit}>Cancel</button></header>
        <fieldset disabled={!!busy}><div className="mse-edit-grid"><section className="mse-form-section"><h4>01 · Details & contact</h4><div className="mse-stack">{field("title","Service title")}<label className="mse-field"><span>Description</span><textarea rows={5} value={editForm.description || ""} onChange={e => update("description",e.target.value)}/></label><div className="mse-fields">{field("contact_name","Contact name")}{field("contact_email","Contact email","email")}</div><label className="mse-check"><input type="checkbox" checked={!!editForm.is_active} onChange={e => update("is_active",e.target.checked)}/><span>Service is active</span></label></div></section>
        <section className="mse-form-section"><h4>02 · Links & image</h4><div className="mse-stack">{field("service_url","Resource URL")}{field("url","Additional website / intake form")}<label className="mse-field"><span>Upload image</span><input ref={fileInput} type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files?.[0])}/></label>{field("image_url","Or paste an image URL")}<ServiceImage src={editForm.image_url} title="Service preview"/>{editForm.image_url && <button className="mse-remove-image" type="button" onClick={() => update("image_url","")}>Remove image</button>}</div></section></div></fieldset>
        <footer className="mse-edit-footer"><p role="status">{busy === "upload" ? "Uploading image…" : busy === "save" ? "Saving changes…" : "Save to apply your changes."}</p><div className="mse-actions"><button type="button" onClick={cancelEdit} disabled={!!busy}>Cancel</button><button type="submit" className="mse-primary" disabled={!!busy}>{busy === "save" ? "Saving…" : "Save changes"}</button></div></footer>
      </form>}
      <p className="mse-count" role="status">Showing {filtered.length} of {services.length} services</p>
      <div className="mse-grid">{filtered.map(s => <article key={s.id} className="mse-card"><ServiceImage src={s.image_url} title={s.title}/><div className="mse-service-heading"><h3>{s.title || "Untitled service"}</h3><span className={`mse-active${s.is_active ? "" : " mse-inactive"}`}>{s.is_active ? "Active" : "Inactive"}</span></div>{s.description && <div className="mse-notes" role="region" tabIndex={0} aria-label={`${s.title} description`}>{s.description}</div>}<div className="mse-contact"><strong>{s.contact_name || "No contact name"}</strong>{s.contact_email && <a href={`mailto:${s.contact_email}`}>{s.contact_email}</a>}</div><div className="mse-links">{[[s.service_url,"Resource"],[s.url,"Additional link"]].map(([url,label]) => {const href=safeUrl(url);return href ? <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a> : null;})}</div><footer className="mse-card-footer"><div className="mse-actions"><button type="button" disabled={!!busy || editingId !== null} onClick={e => startEdit(s,e.currentTarget)}>Edit</button><button type="button" className="mse-delete" disabled={!!busy || editingId !== null} onClick={() => deleteService(s.id)}>Delete</button></div></footer></article>)}</div>
      {!filtered.length && !error && <div className="mse-empty"><h3>{services.length ? "No matching services" : "No services added yet"}</h3><p>{services.length ? "Try a different search or status." : "Your community programs and resources will appear here."}</p>{services.length > 0 && <button type="button" onClick={() => {setSearch("");setFilter("all");}}>Clear filters</button>}</div>}
    </>}
  </section>;
}

const STYLES = `
.mse-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);border:1px solid #ded5e5;border-radius:12px;background:#f6f3f8;color:#392f43;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.mse-panel *{box-sizing:border-box}.mse-panel :is(h2,h3,h4,p){margin:0}.mse-panel :is(button,input,textarea,select){font:inherit}.mse-panel button{min-height:44px;border:1px solid #d1c3dc;border-radius:7px;padding:8px 13px;background:#fff;color:#604671;font-size:12px;font-weight:750;cursor:pointer;transition:background .18s}.mse-panel button:hover:not(:disabled){background:#efe7f6}.mse-panel button:disabled{opacity:.5;cursor:not-allowed}.mse-panel :is(button,input,textarea,select,a,[tabindex]):focus-visible{outline:3px solid #805995;outline-offset:3px}.mse-header{display:flex;justify-content:space-between;align-items:center;gap:14px;border-bottom:1px solid #e1d5e7;padding-bottom:15px}.mse-eyebrow{color:#79578b;font-size:10px;letter-spacing:1.5px;font-weight:750;text-transform:uppercase}.mse-header h2{font-size:clamp(22px,2.5vw,29px);line-height:1.3;letter-spacing:-.6px;margin:5px 0}.mse-header h2>span{display:inline-block;vertical-align:middle;padding:2px 9px;background:#e9dff0;border-radius:20px;color:#70567f;font-size:12px;letter-spacing:0}.mse-header p:last-child{font-size:12px;color:#73617e}.mse-header>button{flex-shrink:0}.mse-toolbar{display:grid;grid-template-columns:minmax(0,1fr) minmax(150px,210px) auto;gap:12px;align-items:end;margin:16px 0}.mse-field{display:block;min-width:0}.mse-field>span{display:block;font-size:12px;font-weight:750;color:#685173;margin-bottom:5px}.mse-panel :is(input:not([type=checkbox]),select,textarea){display:block;width:100%;min-width:0;min-height:44px;padding:10px 12px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;font-size:16px;line-height:1.5}.mse-panel input::placeholder,.mse-panel textarea::placeholder{color:#80718a}.mse-count{color:#73617e;font-size:12px;margin:12px 0!important}.mse-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,350px),1fr));gap:14px;align-items:start}.mse-card{--status:#896999;--badge:#eee5f4;--ink:#644579;min-width:0;padding:16px;background:#fff;border:1px solid #ddd2e5;border-top:3px solid var(--status);border-radius:10px;box-shadow:0 4px 14px #68457807}.mse-card[data-status=pending]{--status:#bf9a50;--badge:#fff2d9;--ink:#725114}.mse-card[data-status=approved]{--status:#79a68d;--badge:#e7f3ec;--ink:#35634b}.mse-card[data-status=confirmed]{--status:#7b9fc5;--badge:#e7effa;--ink:#3d5f85}.mse-card[data-status=declined]{--status:#c3879d;--badge:#fae9ef;--ink:#913c59}.mse-card[data-status=cancelled]{--status:#9b98a4;--badge:#efedf2;--ink:#605969}.mse-card-header{display:flex;gap:13px;align-items:center}.mse-card-header>div:last-child{min-width:0}.mse-card h3{font-size:18px;line-height:1.35;font-weight:750;overflow-wrap:anywhere}.mse-card-header p{color:#73617e;font-size:12px;margin-top:3px}.mse-image{display:grid;place-items:center;flex-shrink:0;width:74px;height:74px;background:#f7f4f9;border:1px solid #e4dcea;border-radius:8px;padding:6px;color:#795c8c;font-size:23px;font-weight:750}.mse-image img{display:block;max-width:100%;max-height:100%;object-fit:contain}.mse-active{display:inline-block;font-size:10px;font-weight:700;color:#3b6850;background:#e5f1e9;padding:1px 7px;border-radius:12px;margin-top:5px}.mse-inactive{color:#726b7a;background:#efecf2}.mse-contact{display:flex;flex-direction:column;padding:10px 12px;margin-top:13px;background:#f7f3fa;border-radius:7px;font-size:12px;overflow-wrap:anywhere}.mse-contact a{color:#66517e;text-decoration:underline}.mse-notes{font-size:13px;line-height:1.7;color:#5e5268;white-space:pre-wrap;overflow-wrap:anywhere;max-height:130px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#b59cc4 #f6f1f8;padding-right:8px;margin-top:12px}.mse-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.mse-links a{display:inline-flex;align-items:center;min-height:44px;color:#5d5281;font-size:12px;font-weight:650;text-underline-offset:3px;padding:2px 5px}.mse-card-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:10px;padding-top:12px;border-top:1px solid #eee6f2}.mse-panel .mse-status{background:var(--badge);border-color:var(--status);color:var(--ink);text-transform:capitalize;display:flex;align-items:center;gap:14px}.mse-actions{display:flex;gap:7px;flex-wrap:wrap}.mse-panel .mse-delete{color:#963c58;background:#fceef2;border-color:#e5c5d0}.mse-panel .mse-primary{background:#795587;border-color:#795587;color:white}.mse-panel .mse-primary:hover:not(:disabled){background:#62406e}.mse-empty{padding:28px 14px;text-align:center;color:#766280;border:1px dashed #d5c6df;border-radius:8px;margin:12px 0}.mse-empty h3{font-size:18px;color:#53415f}.mse-empty button{margin-top:12px}.mse-error{padding:12px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px}.mse-editor{margin:16px 0;border:1px solid #c8b3d6;background:#ede6f4;border-radius:10px;padding:clamp(12px,2vw,20px)}.mse-edit-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:15px}.mse-edit-heading h3{font-size:21px;overflow-wrap:anywhere}.mse-editor fieldset{min-width:0;padding:0;border:0;margin:0}.mse-edit-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mse-form-section{min-width:0;background:#fff;border:1px solid #ddd1e6;border-top:3px solid #b49bc7;border-radius:8px;padding:15px}.mse-form-section:nth-child(2){border-top-color:#92b7a1}.mse-form-section h4{font-size:13px;color:#685173;margin-bottom:12px}.mse-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mse-link-editor{margin-top:18px}.mse-link-editor h4{margin-bottom:8px}.mse-link-row{display:flex;gap:7px;margin-bottom:8px;min-width:0}.mse-link-row>input{flex:1;min-width:0}.mse-link-row>button{flex-shrink:0;font-size:20px;min-width:44px}.mse-upload{display:flex;gap:12px;align-items:center;margin-bottom:12px}.mse-upload .mse-field{flex:1;min-width:0}.mse-panel input[type=file]{font-size:12px;padding:7px;overflow:hidden}.mse-panel input::file-selector-button{border:0;border-radius:4px;padding:6px;background:#eee6f5;color:#654775;margin-right:7px}.mse-times{margin:14px 0}.mse-check{display:flex;align-items:center;gap:9px;min-height:44px;margin-top:10px;font-size:13px;font-weight:650}.mse-check input{width:20px;height:20px;accent-color:#795587}.mse-description{margin-top:12px;border-top-color:#d4ae91}.mse-description-title{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}.mse-description-title label{font-size:13px;font-weight:750}.mse-description-title button[aria-pressed=true]{background:linear-gradient(110deg,#fae4e9,#eee3fa,#e0f2ef);color:#59416d}.mse-panel textarea{resize:vertical;min-height:125px;max-height:280px;overflow:auto;overscroll-behavior:contain}.mse-counter{text-align:right;font-size:11px;color:#7c6887;margin-top:5px!important}.mse-edit-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:14px}.mse-edit-footer p{font-size:12px;color:#71577f}.mse-large :is(.mse-notes,.mse-contact,.mse-card-header p){font-size:17px}.mse-large textarea{font-size:20px}.mse-large .mse-card h3{font-size:21px}@media(max-width:800px){.mse-edit-grid{grid-template-columns:1fr}}@media(max-width:520px){.mse-header{align-items:flex-start;flex-direction:column;gap:10px}.mse-toolbar{grid-template-columns:minmax(0,1fr) auto;gap:9px}.mse-toolbar>label:first-child{grid-column:1/-1}.mse-card{padding:12px}.mse-fields{grid-template-columns:1fr}.mse-edit-footer{align-items:stretch;flex-direction:column}.mse-edit-footer .mse-actions{display:grid;grid-template-columns:1fr 1fr}.mse-upload{align-items:flex-start;flex-direction:column}.mse-upload .mse-field{width:100%}.mse-card-header h3{font-size:17px}.mse-image{width:64px;height:64px}}@media(prefers-reduced-motion:reduce){.mse-panel *{transition:none!important}}

.mse-grid{grid-template-columns:minmax(0,1fr);gap:12px}.mse-card{padding:12px;display:flex;flex-direction:column;height:100%;border-top:3px solid #b59bc8}.mse-card:nth-child(4n+2){border-top-color:#97bca9}.mse-card:nth-child(4n+3){border-top-color:#d3a599}.mse-card:nth-child(4n+4){border-top-color:#92afcc}.mse-photo{height:120px;display:grid;place-items:center;background:linear-gradient(135deg,#f9edf2,#ece8f7,#e7f2ed);border:1px solid #e2d7eb;border-radius:7px;padding:7px;overflow:hidden}.mse-photo img{display:block;width:100%;height:100%;object-fit:contain}.mse-photo>span{font-size:30px;color:#ad8ab9}.mse-service-heading{margin-top:10px}.mse-service-heading h3{font-size:16px}.mse-card .mse-notes{max-height:110px;font-size:12px;line-height:1.6;margin-top:9px}.mse-card .mse-contact{font-size:11px;padding:8px 9px;margin-top:10px}.mse-card .mse-links{gap:5px;margin-top:5px}.mse-card .mse-links a{font-size:11px}.mse-card-footer{margin-top:auto}.mse-card-footer .mse-actions{width:100%;display:grid;grid-template-columns:1fr 1fr}.mse-card-footer button{padding:7px 10px}.mse-stack{display:grid;gap:12px}.mse-form-section h4{margin:0 0 12px;font-size:13px;color:#685173}.mse-editor .mse-photo{height:150px}.mse-remove-image{justify-self:start}.mse-large .mse-card .mse-notes,.mse-large .mse-card .mse-contact{font-size:17px}.mse-large .mse-service-heading h3{font-size:20px}@media(min-width:640px){.mse-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(min-width:1024px){.mse-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
`;
