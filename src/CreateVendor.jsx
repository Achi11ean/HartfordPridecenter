import React, { useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";
const CLOUD_NAME = "dincfzdau";
const UPLOAD_PRESET = "pridecenters";
const VENDOR_TYPES = ["Merchandise", "Arts and Crafts", "Wellness or Beauty", "Travel or Tourism Agency", "Food and Beverage", "Community Service or Nonprofit", "Political or Activism"];
const STATUS_OPTIONS = ["pending", "approved", "confirmed", "declined", "cancelled"];
const emptyForm = () => ({ company_name: "", vendor_type: "", contact_name: "", contact_email: "", websites: [""], socials: [""], image_url: "", start_time: "", end_time: "", status: "pending" });
function Preview({ src }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return <div className="cv-preview">{src && !failed ? <img src={src} alt="Vendor image preview" onError={() => setFailed(true)}/> : <p>{failed ? "Unable to preview this image. Check the URL or upload another file." : "Your vendor image will appear here."}</p>}</div>;
}
export default function CreateVendor() {
  const { token, prideId } = useAuth();
  const id = useId();
  const fileInput = useRef(null);
  const pending = useRef(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const busy = submitting || uploading;
  const update = (name,value) => { setSuccess(false); setForm(prev => ({...prev,[name]:value})); };
  const handleChange = e => update(e.target.name,e.target.value);
  const updateListItem = (type,index,value) => { setSuccess(false); setForm(prev => ({...prev,[type]:prev[type].map((item,i) => i === index ? value : item)})); };
  const addListItem = type => { setSuccess(false); setForm(prev => ({...prev,[type]:[...prev[type],""]})); };
  const removeListItem = (type,index) => { setSuccess(false); setForm(prev => ({...prev,[type]:prev[type].filter((_,i) => i !== index)})); };
  const handleImageUpload = async e => {
    const file = e.target.files?.[0];
    if (!file || pending.current) return;
    pending.current = true; setUploading(true); setError(""); setSuccess(false);
    try {
      const data = new FormData(); data.append("file",file); data.append("upload_preset",UPLOAD_PRESET);
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,data);
      if (!res.data.secure_url) throw new Error("Missing image URL");
      setForm(prev => ({...prev,image_url:res.data.secure_url})); toast.success("📸 Image uploaded!");
    } catch { setError("Image upload failed. Please try again."); toast.error("❌ Image upload failed"); }
    finally { pending.current = false; setUploading(false); if (fileInput.current) fileInput.current.value = ""; }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (pending.current) return;
    setError(""); setSuccess(false);
    if (!prideId || !token) { setError("Missing account information. Please sign in again."); return; }
    if (![form.company_name,form.vendor_type,form.contact_name,form.contact_email].every(value => value.trim())) { setError("Please complete all required fields."); return; }
    pending.current = true; setSubmitting(true);
    try {
      await axios.post(`${API}/api/pride/${prideId}/vendors`, {
        ...form,
        website_url: form.websites.filter(w => w && w.trim()).join(","),
        social_links: form.socials.filter(s => s && s.trim()).join(","),
        start_time: form.start_time || null,
        end_time: form.end_time || null,
      }, {headers:{Authorization:`Bearer ${token}`}});
      toast.success("🏳️‍🌈 Vendor added successfully!"); setForm(emptyForm()); setSuccess(true);
      if (fileInput.current) fileInput.current.value = "";
    } catch { setError("Failed to add vendor. Your entries have been kept so you can try again."); toast.error("❌ Failed to add vendor"); }
    finally { pending.current = false; setSubmitting(false); }
  };
  const input = (name,label,type="text",required=false) => <label className="cv-field" htmlFor={`${id}-${name}`}><span>{label}{required && " *"}</span><input id={`${id}-${name}`} name={name} type={type} value={form[name]} onChange={handleChange} required={required}/></label>;
  return <section className="cv-panel" aria-labelledby={`${id}-heading`}>
    <style>{STYLES}</style>
    <header className="cv-header"><div><p className="cv-eyebrow">Make room for something wonderful</p><h2 id={`${id}-heading`}>Add a Pride vendor</h2><p>Bring local businesses, makers, and community partners together.</p></div><span className="cv-header-icon" aria-hidden="true">✦</span></header>
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <p className="cv-required">* Required. Links, image, and participation times are optional.</p>
      {error && <div className="cv-error" role="alert">{error}</div>}{success && <div className="cv-success" role="status">✓ Vendor added successfully. You can add another below.</div>}
      <fieldset className="cv-fields" disabled={busy}><div className="cv-columns">
        <section className="cv-card"><h3><span>01</span>Business & contact</h3><div className="cv-stack">
          {input("company_name","Company / organization","text",true)}
          <div className="cv-grid"><label className="cv-field" htmlFor={`${id}-type`}><span>Vendor type *</span><select id={`${id}-type`} name="vendor_type" value={form.vendor_type} onChange={handleChange} required><option value="">Select type</option>{VENDOR_TYPES.map(type => <option key={type} value={type}>{type}</option>)}</select></label><label className="cv-field" htmlFor={`${id}-status`}><span>Status</span><select id={`${id}-status`} name="status" value={form.status} onChange={handleChange}>{STATUS_OPTIONS.map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase()+status.slice(1)}</option>)}</select></label></div>
          <div className="cv-grid">{input("contact_name","Contact name","text",true)}{input("contact_email","Contact email","email",true)}</div>
          <div className="cv-times"><h4>Participation times</h4><div className="cv-grid">{input("start_time","Start date & time","datetime-local")}{input("end_time","End date & time","datetime-local")}</div></div>
        </div></section>
        <section className="cv-card"><h3><span>02</span>Websites & social links <small>Optional</small></h3><div className="cv-stack">
          {[["websites","Website"],["socials","Social link"]].map(([type,label]) => <div className="cv-link-group" key={type}><h4>{type === "websites" ? "Websites" : "Social links"}</h4>{form[type].map((value,i) => <div className="cv-link-row" key={i}><input aria-label={`${label} ${i+1}`} value={value} onChange={e => updateListItem(type,i,e.target.value)} placeholder="https://…"/>{form[type].length > 1 && <button type="button" aria-label={`Remove ${label.toLowerCase()} ${i+1}`} className="cv-remove-link" onClick={() => removeListItem(type,i)}>×</button>}</div>)}<button type="button" className="cv-secondary" onClick={() => addListItem(type)}>+ Add {label.toLowerCase()}</button></div>)}
        </div></section>
        <section className="cv-card cv-wide"><h3><span>03</span>Vendor image <small>Optional</small></h3><div className="cv-image-layout"><div className="cv-stack"><label className="cv-field" htmlFor={`${id}-upload`}><span>Upload an image</span><input id={`${id}-upload`} ref={fileInput} type="file" accept="image/*" onChange={handleImageUpload}/></label>{input("image_url","Or paste an image URL")}{form.image_url && <button type="button" className="cv-secondary cv-remove-image" onClick={() => update("image_url","")}>Remove image</button>}</div><Preview src={form.image_url}/></div></section>
      </div></fieldset>
      <footer className="cv-footer"><p role="status">{uploading ? "Uploading image…" : submitting ? "Saving vendor…" : "Ready when you are."}</p><button type="submit" disabled={busy}>{submitting ? "Saving…" : uploading ? "Uploading image…" : "Save vendor"}<span aria-hidden="true">+</span></button></footer>
    </form>
  </section>;
}

const STYLES = `
.cv-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;border:1px solid #ded5e5;border-radius:12px;color:#392f43;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.cv-panel *{box-sizing:border-box}.cv-panel :is(h2,h3,p){margin:0}.cv-panel :is(input,textarea,button){font:inherit}.cv-panel :is(input,textarea,button):focus-visible{outline:3px solid #805995;outline-offset:3px}.cv-header{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid #e1d5e7;padding-bottom:15px;margin-bottom:14px}.cv-eyebrow{font-size:10px;letter-spacing:1.4px;font-weight:750;text-transform:uppercase;color:#79578b}.cv-header h2{font-size:clamp(21px,2.5vw,28px);font-weight:750;letter-spacing:-.6px;line-height:1.3;margin:5px 0}.cv-header p:last-child{font-size:12px;color:#73617e}.cv-header-icon{display:grid;place-items:center;width:44px;height:44px;flex-shrink:0;border-radius:12px;background:linear-gradient(135deg,#eedced,#e8e4fb,#e0efe7);color:#82608f;font-size:25px}.cv-required{font-size:11px;color:#776580;margin-bottom:12px!important}.cv-fields{display:grid;gap:12px;min-width:0;padding:0;margin:0;border:0}.cv-card{min-width:0;background:#fff;padding:clamp(14px,2vw,20px);border:1px solid #dfd4e7;border-top:3px solid #b49bc7;border-radius:9px;box-shadow:0 3px 12px #68457806}.cv-card:nth-child(2){border-top-color:#97bca9}.cv-card h3{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:14px;font-weight:750;color:#513d5d;margin-bottom:14px}.cv-card h3>span{display:grid;place-items:center;width:25px;height:25px;border-radius:7px;background:#f0e7f6;font-size:10px;color:#77548a}.cv-card h3>small{font-size:10px;color:#7b6982;font-weight:400;margin-left:auto}.cv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.cv-grid label{min-width:0}.cv-grid label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#685173}.cv-grid small{font-weight:400;color:#7f6c87;margin-left:5px}.cv-grid :is(input,textarea){display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font-size:16px;line-height:1.5}.cv-grid :is(input,textarea)::placeholder{color:#8a7b92}.cv-grid textarea{resize:vertical;min-height:120px}.cv-wide{grid-column:1/-1}.cv-active{display:flex;align-items:center;gap:11px;padding:13px 15px;background:#eef5f0;border:1px solid #c8ddcf;border-radius:8px;cursor:pointer}.cv-active>input{width:20px;height:20px;flex-shrink:0;accent-color:#42735b}.cv-active>span:nth-child(2){flex:1;min-width:0}.cv-active strong{display:block;font-size:13px;color:#3e5949}.cv-active small{display:block;font-size:11px;color:#627467;margin-top:2px}.cv-badge{padding:3px 9px;border-radius:20px;background:#d8ebdf;color:#316047;font-size:10px;font-weight:750;flex-shrink:0}.cv-inactive{background:#e8e4ed;color:#6e5f79}.cv-footer{display:flex;justify-content:flex-end;margin-top:16px}.cv-footer button{display:inline-flex;align-items:center;justify-content:space-between;gap:25px;min-height:48px;padding:11px 18px;border:1px solid #765083;border-radius:7px;background:#795587;color:#fff;font-size:13px;font-weight:750;cursor:pointer;transition:background .18s}.cv-footer button:hover:not(:disabled){background:#62406e}.cv-footer button:disabled{opacity:.6;cursor:wait}.cv-error,.cv-success{padding:12px 14px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px;font-size:13px;margin-bottom:13px;overflow-wrap:anywhere}.cv-success{border-color:#bdd9c7;background:#e7f3eb;color:#326046}@media(max-width:640px){.cv-grid{grid-template-columns:1fr;gap:13px}.cv-panel{padding:12px}.cv-active{align-items:flex-start;flex-wrap:wrap;padding:12px}.cv-active>input{margin-top:3px}.cv-badge{margin-top:3px}.cv-footer button{width:100%}.cv-header-icon{width:38px;height:38px}}@media(prefers-reduced-motion:reduce){.cv-panel *{transition:none!important}}

.cv-panel{max-width:1150px;margin-inline:auto}.cv-columns{display:grid;grid-template-columns:1.15fr 1fr;gap:12px;min-width:0}.cv-stack{display:grid;gap:13px}.cv-field{display:block;min-width:0}.cv-field>span{display:block;font-size:12px;font-weight:750;color:#685173;margin-bottom:5px}.cv-panel .cv-field :is(input,select),.cv-link-row input{display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font:16px/1.5 Inter,ui-sans-serif,system-ui,sans-serif}.cv-panel select:focus-visible{outline:3px solid #805995;outline-offset:3px}.cv-panel input::placeholder{color:#80718a}.cv-panel h4{margin:0 0 8px;font-size:12px;color:#685173;font-weight:750}.cv-times{padding-top:12px;border-top:1px solid #e6ddea}.cv-link-row{display:flex;gap:7px;margin-bottom:8px;min-width:0}.cv-link-row input{flex:1;min-width:0}.cv-secondary,.cv-remove-link{min-height:44px;padding:7px 11px;border:1px solid #d4c8df;border-radius:6px;background:#f5eff9;color:#634577;font-size:12px;font-weight:700;cursor:pointer}.cv-remove-link{flex-shrink:0;min-width:44px;background:#fceef2;border-color:#e6c4d0;color:#963c58;font-size:20px}.cv-link-group+.cv-link-group{border-top:1px solid #e6ddea;padding-top:13px}.cv-image-layout{display:grid;grid-template-columns:1.4fr 1fr;gap:18px;align-items:center}.cv-preview{display:grid;place-items:center;min-height:115px;padding:10px;background:linear-gradient(135deg,#faf0e8,#f1eafa,#e9f3ef);border:1px dashed #d1c2de;border-radius:7px;color:#7a6486;overflow-wrap:anywhere}.cv-preview img{display:block;max-width:100%;height:145px;object-fit:contain}.cv-preview p{font-size:12px;text-align:center}.cv-panel input[type=file]{padding:8px;font-size:12px;overflow:hidden}.cv-panel input::file-selector-button{padding:6px 9px;border:0;border-radius:4px;background:#eee6f5;color:#654775;margin-right:7px}.cv-remove-image{justify-self:start}.cv-card:nth-child(3){border-top-color:#d8aa9e}.cv-footer{align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.cv-footer p{font-size:12px;color:#73617e}.cv-fields:disabled{opacity:.7}@media(max-width:850px){.cv-columns{grid-template-columns:1fr}}@media(max-width:640px){.cv-image-layout{grid-template-columns:1fr}.cv-footer{align-items:stretch;flex-direction:column}.cv-footer button{width:100%}}
`;
