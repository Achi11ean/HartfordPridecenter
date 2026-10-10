import React, { useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";
const CLOUD_NAME = "dincfzdau";
const UPLOAD_PRESET = "pridecenters";
const EMPTY_FORM = { title: "", description: "", contact_name: "", contact_email: "", url: "", image_url: "", service_url: "" };

function ImagePreview({ src }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src) return <div className="cs-preview cs-placeholder"><span aria-hidden="true">▧</span><p>Your service image will appear here.</p></div>;
  return <div className="cs-preview">{failed ? <p>Unable to preview this image. Check the URL or upload another file.</p> : <img src={src} alt="Service preview" onError={() => setFailed(true)}/>}</div>;
}

export default function CreateServices() {
  const { token, prideId } = useAuth();
  const id = useId();
  const fileInput = useRef(null);
  const pending = useRef(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const busy = uploading || submitting;

  const handleChange = e => {
    const { name, value } = e.target;
    setSuccess(false);
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleImageUpload = async e => {
    const file = e.target.files?.[0];
    if (!file || pending.current) return;
    pending.current = true; setUploading(true); setError(""); setSuccess(false);
    try {
      const data = new FormData(); data.append("file", file); data.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok || !json.secure_url) throw new Error("Upload failed");
      setForm(prev => ({ ...prev, image_url: json.secure_url }));
      toast.success("🖼 Image uploaded!");
    } catch {
      setError("Image upload failed. Please try again.");
      toast.error("❌ Image upload failed");
    } finally {
      pending.current = false; setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (pending.current) return;
    setError(""); setSuccess(false);
    if (!prideId || !token) { setError("Missing account information. Please sign in again."); return; }
    if (![form.title, form.description, form.contact_name, form.contact_email].every(value => value.trim())) {
      setError("Please complete the title, description, contact name, and contact email."); return;
    }
    pending.current = true; setSubmitting(true);
    try {
      await axios.post(`${API}/api/pride/${prideId}/services`, form, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("🏳️‍🌈 Service added successfully!");
      setForm({ ...EMPTY_FORM }); setSuccess(true);
      if (fileInput.current) fileInput.current.value = "";
    } catch {
      setError("Failed to add service. Your entries are still here so you can try again.");
      toast.error("❌ Failed to add service");
    } finally { pending.current = false; setSubmitting(false); }
  };
  const input = (name, label, placeholder, required = false, type = "text") => <label className="cs-field" htmlFor={`${id}-${name}`}><span>{label}{required && " *"}</span><input id={`${id}-${name}`} name={name} type={type} value={form[name]} onChange={handleChange} placeholder={placeholder} required={required}/></label>;

  return <section className={`cs-panel${largeText ? " cs-large" : ""}`} aria-labelledby={`${id}-heading`}>
    <style>{STYLES}</style>
    <header className="cs-header"><div><p className="cs-eyebrow">Support starts here</p><h2 id={`${id}-heading`}>Add a Pride service</h2><p>Help our community find the resources and care they need.</p></div><span className="cs-header-icon" aria-hidden="true">✦</span></header>
    <form onSubmit={handleSubmit} aria-busy={busy}>
      <p className="cs-required">* Required. Links and images are optional.</p>
      {error && <div className="cs-error" role="alert">{error}</div>}
      {success && <div className="cs-success" role="status">✓ Service added successfully. You can add another below.</div>}
      <fieldset className="cs-fields" disabled={busy}>
        <div className="cs-columns"><section className="cs-card"><h3><span>01</span>Service & contact</h3><div className="cs-stack">
          {input("title", "Service title", "e.g. Community Wellness Program", true)}
          <div><div className="cs-description-label"><label htmlFor={`${id}-description`}>Description *</label><button type="button" aria-pressed={largeText} aria-controls={`${id}-description`} onClick={() => setLargeText(v => !v)}>{largeText ? "A− Standard text" : "A+ Larger text"}</button></div><textarea id={`${id}-description`} name="description" value={form.description} onChange={handleChange} placeholder="What does this service offer, and who can it help?" rows={5} required/><p className="cs-hint">Long descriptions scroll inside this field.</p></div>
          <div className="cs-grid">{input("contact_name", "Contact name", "Point of contact", true)}{input("contact_email", "Contact email", "hello@organization.org", true, "email")}</div>
        </div></section>
        <section className="cs-card"><h3><span>02</span>Links & image <small>Optional</small></h3><div className="cs-stack">
          {input("service_url", "Resource URL", "https://…")}
          {input("url", "Additional website / intake form", "https://…")}
          <div className="cs-image-block"><label className="cs-field" htmlFor={`${id}-upload`}><span>Upload an image</span><input ref={fileInput} id={`${id}-upload`} type="file" accept="image/*" onChange={handleImageUpload}/></label>
            {input("image_url", "Or paste an image URL", "https://…")}
            <ImagePreview src={form.image_url}/>
            {form.image_url && <button className="cs-remove" type="button" onClick={() => {setForm(prev => ({...prev,image_url:""}));setSuccess(false);}}>Remove image</button>}
          </div>
        </div></section></div>
      </fieldset>
      <footer className="cs-footer"><p role="status">{uploading ? "Uploading image…" : submitting ? "Saving your service…" : "Ready when you are."}</p><button type="submit" disabled={busy}>{submitting ? "Saving…" : uploading ? "Uploading image…" : "Save service"}<span aria-hidden="true">+</span></button></footer>
    </form>
  </section>;
}

const STYLES = `
.cs-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;border:1px solid #ded5e5;border-radius:12px;color:#392f43;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.cs-panel *{box-sizing:border-box}.cs-panel :is(h2,h3,p){margin:0}.cs-panel :is(input,textarea,button){font:inherit}.cs-panel :is(input,textarea,button):focus-visible{outline:3px solid #805995;outline-offset:3px}.cs-header{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid #e1d5e7;padding-bottom:15px;margin-bottom:14px}.cs-eyebrow{font-size:10px;letter-spacing:1.4px;font-weight:750;text-transform:uppercase;color:#79578b}.cs-header h2{font-size:clamp(21px,2.5vw,28px);font-weight:750;letter-spacing:-.6px;line-height:1.3;margin:5px 0}.cs-header p:last-child{font-size:12px;color:#73617e}.cs-header-icon{display:grid;place-items:center;width:44px;height:44px;flex-shrink:0;border-radius:12px;background:linear-gradient(135deg,#eedced,#e8e4fb,#e0efe7);color:#82608f;font-size:25px}.cs-required{font-size:11px;color:#776580;margin-bottom:12px!important}.cs-fields{display:grid;gap:12px;min-width:0;padding:0;margin:0;border:0}.cs-card{min-width:0;background:#fff;padding:clamp(14px,2vw,20px);border:1px solid #dfd4e7;border-top:3px solid #b49bc7;border-radius:9px;box-shadow:0 3px 12px #68457806}.cs-card:nth-child(2){border-top-color:#97bca9}.cs-card h3{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:14px;font-weight:750;color:#513d5d;margin-bottom:14px}.cs-card h3>span{display:grid;place-items:center;width:25px;height:25px;border-radius:7px;background:#f0e7f6;font-size:10px;color:#77548a}.cs-card h3>small{font-size:10px;color:#7b6982;font-weight:400;margin-left:auto}.cs-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.cs-grid label{min-width:0}.cs-grid label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#685173}.cs-grid small{font-weight:400;color:#7f6c87;margin-left:5px}.cs-grid :is(input,textarea){display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font-size:16px;line-height:1.5}.cs-grid :is(input,textarea)::placeholder{color:#8a7b92}.cs-grid textarea{resize:vertical;min-height:120px}.cs-wide{grid-column:1/-1}.cs-active{display:flex;align-items:center;gap:11px;padding:13px 15px;background:#eef5f0;border:1px solid #c8ddcf;border-radius:8px;cursor:pointer}.cs-active>input{width:20px;height:20px;flex-shrink:0;accent-color:#42735b}.cs-active>span:nth-child(2){flex:1;min-width:0}.cs-active strong{display:block;font-size:13px;color:#3e5949}.cs-active small{display:block;font-size:11px;color:#627467;margin-top:2px}.cs-badge{padding:3px 9px;border-radius:20px;background:#d8ebdf;color:#316047;font-size:10px;font-weight:750;flex-shrink:0}.cs-inactive{background:#e8e4ed;color:#6e5f79}.cs-footer{display:flex;justify-content:flex-end;margin-top:16px}.cs-footer button{display:inline-flex;align-items:center;justify-content:space-between;gap:25px;min-height:48px;padding:11px 18px;border:1px solid #765083;border-radius:7px;background:#795587;color:#fff;font-size:13px;font-weight:750;cursor:pointer;transition:background .18s}.cs-footer button:hover:not(:disabled){background:#62406e}.cs-footer button:disabled{opacity:.6;cursor:wait}.cs-error,.cs-success{padding:12px 14px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px;font-size:13px;margin-bottom:13px;overflow-wrap:anywhere}.cs-success{border-color:#bdd9c7;background:#e7f3eb;color:#326046}@media(max-width:640px){.cs-grid{grid-template-columns:1fr;gap:13px}.cs-panel{padding:12px}.cs-active{align-items:flex-start;flex-wrap:wrap;padding:12px}.cs-active>input{margin-top:3px}.cs-badge{margin-top:3px}.cs-footer button{width:100%}.cs-header-icon{width:38px;height:38px}}@media(prefers-reduced-motion:reduce){.cs-panel *{transition:none!important}}

.cs-panel{max-width:100%;margin-inline:auto}.cs-columns{display:grid;grid-template-columns:1.15fr 1fr;gap:12px;min-width:0}.cs-stack{display:grid;gap:13px}.cs-field{display:block;min-width:0}.cs-field>span{display:block;font-size:12px;font-weight:750;color:#685173;margin-bottom:5px}.cs-panel .cs-field input,.cs-panel textarea{display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font-size:16px;line-height:1.5}.cs-panel input::placeholder,.cs-panel textarea::placeholder{color:#80718a}.cs-panel textarea{height:158px;min-height:120px;max-height:300px;resize:vertical;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#b59cc4 #f6f1f8}.cs-description-label{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px}.cs-description-label label{font-size:12px;font-weight:750;color:#685173}.cs-description-label button,.cs-remove{min-height:44px;padding:7px 10px;font-size:12px;font-weight:700;border:1px solid #d4c8df;border-radius:6px;background:#f5eff9;color:#634577;cursor:pointer}.cs-description-label button[aria-pressed=true]{background:#e9ddf1}.cs-hint{font-size:11px;color:#73617e;margin-top:6px!important}.cs-image-block{display:grid;gap:12px;padding-top:13px;border-top:1px solid #e8deed}.cs-panel input[type=file]{padding:8px;font-size:12px;overflow:hidden}.cs-panel input::file-selector-button{padding:6px 9px;border:0;border-radius:4px;background:#eee6f5;color:#654775;margin-right:7px}.cs-preview{display:grid;place-items:center;min-height:110px;padding:10px;background:#f6f7f7;border:1px dashed #c7d8ce;border-radius:7px;color:#687b70;overflow-wrap:anywhere}.cs-preview img{display:block;max-width:100%;height:130px;object-fit:contain}.cs-preview p{font-size:12px;text-align:center}.cs-placeholder span{font-size:24px;color:#7e9d8b}.cs-remove{justify-self:start;background:#fff}.cs-footer{align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.cs-footer p{font-size:12px;color:#73617e}.cs-fields:disabled{opacity:.7}.cs-large textarea{font-size:20px}@media(max-width:800px){.cs-columns{grid-template-columns:1fr}}@media(max-width:640px){.cs-footer{align-items:stretch;flex-direction:column}.cs-footer button{width:100%}}
`;
