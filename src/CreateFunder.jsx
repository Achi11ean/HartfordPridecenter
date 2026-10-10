import React, { useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";
const CLOUD_NAME = "dincfzdau";
const UPLOAD_PRESET = "pridecenters";
const EMPTY_FORM = { organization_name: "", contact_name: "", contact_email: "", website_url: "", details: "", logo_url: "" };

export default function CreateFunder({ onCreated }) {
  const { prideId, isAuthenticated, isAdmin, isStaff } = useAuth();
  const id = useId();
  const fileInput = useRef(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const allowed = isAuthenticated && prideId && (isAdmin || isStaff);
  const locked = uploading || submitting;
  const change = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleUpload = async file => {
    if (!file || locked || !allowed) return;
    setUploading(true); setError(null); setSuccess(null);
    try {
      const data = new FormData(); data.append("file", file); data.append("upload_preset", UPLOAD_PRESET);
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, data);
      setForm(prev => ({ ...prev, logo_url: res.data.secure_url }));
    } catch { setError("Image upload failed. Please try again or paste a logo URL."); }
    finally { setUploading(false); }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (locked || !allowed) return;
    setError(null); setSuccess(null);
    if (!form.organization_name.trim()) { setError("Organization name is required."); return; }
    setSubmitting(true);
    let funder;
    try {
      const res = await axios.post(`${API}/api/pride/${prideId}/funders`, form);
      funder = res.data.funder;
      setForm({ ...EMPTY_FORM });
      if (fileInput.current) fileInput.current.value = "";
      setSuccess("Funder created successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create funder");
      return;
    } finally { setSubmitting(false); }
    onCreated?.(funder);
  };
  return <section className="cf-panel" aria-label="Create Pride funder"><style>{STYLES}</style>
    {!isAuthenticated || !prideId ? <div className="cf-error" role="alert">Authentication required to create funders.</div> : !isAdmin && !isStaff ? <div className="cf-error" role="alert">You do not have permission to add funders.</div> : <>
      <header className="cf-header"><div><p className="cf-eyebrow">Community, made possible</p><h2>Add a Pride funder</h2><p>Recognize the organizations helping our community grow.</p></div><span className="cf-header-icon" aria-hidden="true">✦</span></header>
      <form onSubmit={handleSubmit} aria-busy={locked}>
        <p className="cf-required">Organization name is required. All other fields are optional.</p>
        {error && <div className="cf-error" role="alert">{error}</div>}{success && <div className="cf-success" role="status">✓ {success}</div>}
        <fieldset disabled={locked} className="cf-fields">
          <section className="cf-card"><h3><span>01</span>Organization & contact</h3><div className="cf-grid">
            <label className="cf-wide" htmlFor={`${id}-organization`}><span>Organization name *</span><input id={`${id}-organization`} name="organization_name" autoComplete="organization" value={form.organization_name} onChange={change} placeholder="Organization or foundation name" required/></label>
            <label htmlFor={`${id}-contact`}><span>Contact name</span><input id={`${id}-contact`} name="contact_name" autoComplete="name" value={form.contact_name} onChange={change} placeholder="Who should we contact?"/></label>
            <label htmlFor={`${id}-email`}><span>Contact email</span><input id={`${id}-email`} name="contact_email" type="email" autoComplete="email" value={form.contact_email} onChange={change} placeholder="name@organization.org"/></label>
            <label className="cf-wide" htmlFor={`${id}-website`}><span>Website</span><input id={`${id}-website`} name="website_url" inputMode="url" autoComplete="url" value={form.website_url} onChange={change} placeholder="https://organization.org"/></label>
          </div></section>
          <section className="cf-card"><h3><span>02</span>Their story & logo <small>Optional</small></h3><div className="cf-grid">
            <label htmlFor={`${id}-details`}><span>Message or description</span><textarea id={`${id}-details`} name="details" rows={6} value={form.details} onChange={change} placeholder="Share a message or tell us about the organization."/></label>
            <div className="cf-logo-fields"><label htmlFor={`${id}-file`}><span>Upload logo</span><input ref={fileInput} id={`${id}-file`} type="file" accept="image/*" onChange={e=>handleUpload(e.target.files[0])}/></label><label htmlFor={`${id}-url`}><span>Or paste a logo URL</span><input id={`${id}-url`} name="logo_url" inputMode="url" value={form.logo_url} onChange={change} placeholder="https://…"/></label>{form.logo_url ? <div className="cf-preview-row"><LogoPreview src={form.logo_url}/><button type="button" className="cf-remove" onClick={()=>{setForm(prev=>({...prev,logo_url:""}));if(fileInput.current)fileInput.current.value="";}}>Remove logo</button></div> : <p className="cf-logo-hint">A clear logo on a simple background works best.</p>}</div>
          </div></section>
        </fieldset>
        {uploading && <p className="cf-upload-status" role="status">Uploading logo…</p>}
        <footer className="cf-footer"><button type="submit" disabled={locked}>{uploading ? "Uploading logo…" : submitting ? "Creating…" : "Create funder"}<span aria-hidden="true">+</span></button></footer>
      </form>
    </>}
  </section>;
}
function LogoPreview({src}) {
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[src]);
  return failed ? <p className="cf-preview-error">Preview unavailable. Check the URL or upload an image.</p> : <img className="cf-logo-preview" src={src} alt="Funder logo preview" onError={()=>setFailed(true)}/>;
}

const STYLES = `
.cf-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;border:1px solid #ded5e5;border-radius:12px;color:#392f43;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.cf-panel *{box-sizing:border-box}.cf-panel :is(h2,h3,p){margin:0}.cf-panel :is(input,textarea,button){font:inherit}.cf-panel :is(input,textarea,button):focus-visible{outline:3px solid #805995;outline-offset:3px}.cf-header{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid #e1d5e7;padding-bottom:15px;margin-bottom:14px}.cf-eyebrow{font-size:10px;letter-spacing:1.4px;font-weight:750;text-transform:uppercase;color:#79578b}.cf-header h2{font-size:clamp(21px,2.5vw,28px);font-weight:750;letter-spacing:-.6px;line-height:1.3;margin:5px 0}.cf-header p:last-child{font-size:12px;color:#73617e}.cf-header-icon{display:grid;place-items:center;width:44px;height:44px;flex-shrink:0;border-radius:12px;background:linear-gradient(135deg,#eedced,#e8e4fb,#e0efe7);color:#82608f;font-size:25px}.cf-required{font-size:11px;color:#776580;margin-bottom:12px!important}.cf-fields{display:grid;gap:12px;min-width:0;padding:0;margin:0;border:0}.cf-card{min-width:0;background:#fff;padding:clamp(14px,2vw,20px);border:1px solid #dfd4e7;border-top:3px solid #b49bc7;border-radius:9px;box-shadow:0 3px 12px #68457806}.cf-card:nth-child(2){border-top-color:#97bca9}.cf-card h3{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:14px;font-weight:750;color:#513d5d;margin-bottom:14px}.cf-card h3>span{display:grid;place-items:center;width:25px;height:25px;border-radius:7px;background:#f0e7f6;font-size:10px;color:#77548a}.cf-card h3>small{font-size:10px;color:#7b6982;font-weight:400;margin-left:auto}.cf-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.cf-grid label{min-width:0}.cf-grid label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#685173}.cf-grid small{font-weight:400;color:#7f6c87;margin-left:5px}.cf-grid :is(input,textarea){display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font-size:16px;line-height:1.5}.cf-grid :is(input,textarea)::placeholder{color:#8a7b92}.cf-grid textarea{resize:vertical;min-height:120px}.cf-wide{grid-column:1/-1}.cf-active{display:flex;align-items:center;gap:11px;padding:13px 15px;background:#eef5f0;border:1px solid #c8ddcf;border-radius:8px;cursor:pointer}.cf-active>input{width:20px;height:20px;flex-shrink:0;accent-color:#42735b}.cf-active>span:nth-child(2){flex:1;min-width:0}.cf-active strong{display:block;font-size:13px;color:#3e5949}.cf-active small{display:block;font-size:11px;color:#627467;margin-top:2px}.cf-badge{padding:3px 9px;border-radius:20px;background:#d8ebdf;color:#316047;font-size:10px;font-weight:750;flex-shrink:0}.cf-inactive{background:#e8e4ed;color:#6e5f79}.cf-footer{display:flex;justify-content:flex-end;margin-top:16px}.cf-footer button{display:inline-flex;align-items:center;justify-content:space-between;gap:25px;min-height:48px;padding:11px 18px;border:1px solid #765083;border-radius:7px;background:#795587;color:#fff;font-size:13px;font-weight:750;cursor:pointer;transition:background .18s}.cf-footer button:hover:not(:disabled){background:#62406e}.cf-footer button:disabled{opacity:.6;cursor:wait}.cf-error,.cf-success{padding:12px 14px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px;font-size:13px;margin-bottom:13px;overflow-wrap:anywhere}.cf-success{border-color:#bdd9c7;background:#e7f3eb;color:#326046}@media(max-width:640px){.cf-grid{grid-template-columns:1fr;gap:13px}.cf-panel{padding:12px}.cf-active{align-items:flex-start;flex-wrap:wrap;padding:12px}.cf-active>input{margin-top:3px}.cf-badge{margin-top:3px}.cf-footer button{width:100%}.cf-header-icon{width:38px;height:38px}}@media(prefers-reduced-motion:reduce){.cf-panel *{transition:none!important}}

.cf-panel{background:#f7f6f2;border-color:#ded9ca;color:#443e34}.cf-header{border-color:#ddd7c8}.cf-eyebrow{color:#80682f}.cf-header h2{color:#443d30}.cf-header-icon{background:linear-gradient(135deg,#e4ce92,#fff8e2 45%,#d5dae0 75%,#f3f5f7);color:#856b30;border:1px solid #d6c8a5}.cf-card{border-color:#ddd7c9;border-top-color:#c8ae6b}.cf-card:nth-child(2){border-top-color:#a9b1bd}.cf-card h3{color:#5c5140}.cf-card h3>span{background:linear-gradient(135deg,#efe0b9,#faf5e9);color:#82672e}.cf-card:nth-child(2) h3>span{background:#e9edf2;color:#5d6574}.cf-grid label>span{color:#655a46}.cf-grid :is(input,textarea){border-color:#ccc7bd;color:#403c36}.cf-grid :is(input,textarea)::placeholder{color:#807b73}.cf-footer button{background:#806731;border-color:#806731}.cf-footer button:hover:not(:disabled){background:#665024}.cf-panel :is(input,textarea,button):focus-visible{outline-color:#8b732f}.cf-logo-fields{min-width:0;display:grid;gap:12px;align-content:start}.cf-logo-fields label{display:block}.cf-panel input[type=file]{font-size:12px;padding:9px;max-width:100%}.cf-logo-preview{display:block;width:86px;height:86px;object-fit:contain;background:#fff;border:1px solid #d4d1ca;padding:7px;border-radius:7px;flex-shrink:0}.cf-preview-row{display:flex;align-items:center;flex-wrap:wrap;gap:12px}.cf-remove{min-height:44px;padding:8px 12px;border:1px solid #d9ced0;border-radius:6px;background:#fff;color:#8b4c58;font-size:12px!important;cursor:pointer}.cf-remove:hover:not(:disabled){background:#fbf0f2}.cf-logo-hint{font-size:11px;color:#7a7263}.cf-preview-error{font-size:12px;color:#914757;max-width:260px}.cf-upload-status{padding:10px 13px;background:#eeeae0;color:#715c33;border-radius:7px;font-size:12px;margin-top:13px!important}
`;
