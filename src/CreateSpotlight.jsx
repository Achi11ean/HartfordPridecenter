import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const API = "https://singspacebackend.onrender.com";
const CLOUD_NAME = "dincfzdau";
const UPLOAD_PRESET = "pridecenters";
const EMPTY_FORM = { name: "", email: "", phone: "", role: "", years_of_service: "", bio: "", image_url: "" };

function PhotoPreview({ src }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return <div className="csp-preview">{src && !failed ? <img src={src} alt="Volunteer spotlight preview" onError={() => setFailed(true)}/> : <><span aria-hidden="true">✦</span><p>{failed ? "Unable to preview this image. Check the URL or upload another photo." : "A face behind the difference."}</p></>}</div>;
}

export default function CreateSpotlight() {
  const { prideId, token, isAdmin, isStaff } = useAuth();
  const allowed = !!(isAdmin || isStaff);
  const id = useId();
  const fileInput = useRef(null);
  const pending = useRef(false);
  const requestId = useRef(0);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const busy = uploading || submitting;

  const fetchSubmissions = useCallback(async () => {
    const request = ++requestId.current;
    if (!allowed || !prideId || !token) { setSubmissions([]); setLoadingSubmissions(false); return; }
    setLoadingSubmissions(true); setSubmissionError("");
    try {
      const res = await axios.get(`${API}/api/pride/${prideId}/volunteers`, { headers: { Authorization: `Bearer ${token}` } });
      if (request === requestId.current) setSubmissions(Array.isArray(res.data) ? res.data : []);
    } catch {
      if (request === requestId.current) { setSubmissions([]); setSubmissionError("Volunteer submissions could not be loaded. You can retry or enter details manually."); }
    } finally { if (request === requestId.current) setLoadingSubmissions(false); }
  }, [allowed, prideId, token]);
  useEffect(() => { fetchSubmissions(); return () => { requestId.current++; }; }, [fetchSubmissions]);
  useEffect(() => { setSelectedSubmission(null); }, [prideId]);

  const update = (key, value) => { setSuccess(false); setForm(prev => ({ ...prev, [key]: value })); };
  const resetForm = () => {
    setSelectedSubmission(null); setForm({ ...EMPTY_FORM });
    if (fileInput.current) fileInput.current.value = "";
  };
  const selectSubmission = value => {
    const submission = submissions.find(s => String(s.id) === value) || null;
    setSelectedSubmission(submission); setSuccess(false);
    if (submission) setForm(prev => ({ ...prev, name: submission.name || "", email: submission.email || "", phone: submission.phone || "" }));
  };
  const handleFileUpload = async file => {
    if (!file || pending.current || !allowed) return;
    pending.current = true; setUploading(true); setError(""); setSuccess(false);
    try {
      const data = new FormData(); data.append("file", file); data.append("upload_preset", UPLOAD_PRESET); data.append("folder", "volunteer_spotlights");
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: data });
      const result = await res.json();
      if (!res.ok || !result.secure_url) throw new Error("Upload failed");
      setForm(prev => ({ ...prev, image_url: result.secure_url })); toast.success("📸 Image uploaded!");
    } catch { setError("Image upload failed. Please try again."); toast.error("Image upload failed"); }
    finally { pending.current = false; setUploading(false); if (fileInput.current) fileInput.current.value = ""; }
  };
  const createSpotlight = async e => {
    e.preventDefault();
    if (pending.current || !allowed) return;
    setError(""); setSuccess(false);
    if (!form.name.trim()) { setError("Name is required."); toast.error("Name is required"); return; }
    if (!prideId || !token) { setError("Missing account information. Please sign in again."); return; }
    pending.current = true; setSubmitting(true);
    try {
      await axios.post(`${API}/api/pride/${prideId}/volunteer-spotlights`, {
        ...form,
        years_of_service: form.years_of_service === "" ? null : form.years_of_service,
        source_submission_id: selectedSubmission?.id ?? null,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("🌟 Volunteer spotlight created!"); resetForm(); setSuccess(true);
    } catch { setError("Failed to create spotlight. Your entries have been kept so you can try again."); toast.error("Failed to create spotlight"); }
    finally { pending.current = false; setSubmitting(false); }
  };
  if (!allowed) return null;

  return <section className="csp-panel" aria-labelledby={`${id}-heading`}>
    <style>{STYLES}</style>
    <header className="csp-header"><div><p className="csp-eyebrow">People who make a difference</p><h2 id={`${id}-heading`}>Create a volunteer spotlight</h2><p>Celebrate the people who help our community shine.</p></div><span className="csp-header-icon" aria-hidden="true">✦</span></header>
    <form onSubmit={createSpotlight} aria-busy={busy}>
      <p className="csp-required">* Required. All other fields are optional.</p>
      {error && <div className="csp-error" role="alert">{error}</div>}
      {success && <div className="csp-success" role="status">✓ Volunteer spotlight created. You can add another below.</div>}
      <fieldset className="csp-fields" disabled={busy}>
        <div className="csp-source"><label className="csp-field" htmlFor={`${id}-submission`}><span>Start with a volunteer submission <small>Optional</small></span><select id={`${id}-submission`} value={selectedSubmission?.id ?? ""} onChange={e => selectSubmission(e.target.value)} disabled={loadingSubmissions}><option value="">{loadingSubmissions ? "Loading volunteers…" : "Enter manually / no linked submission"}</option>{submissions.map(s => <option key={s.id} value={s.id}>{s.name || "Volunteer"}{s.email ? ` — ${s.email}` : ""}</option>)}</select></label><p className="csp-hint">Selecting a volunteer fills their name, email, and phone. Your role, years of service, bio, and photo stay as entered.</p>{submissionError ? <div className="csp-source-error" role="alert">{submissionError}<button type="button" onClick={fetchSubmissions}>Retry</button></div> : !loadingSubmissions && !submissions.length && <p className="csp-hint">No submissions available. You can still create a spotlight manually.</p>}</div>
        <div className="csp-columns"><section className="csp-card"><h3><span>01</span>Volunteer & story</h3><div className="csp-grid">
          {[
            ["name", "Name", "text", "Volunteer name"], ["role", "Role", "text", "e.g. Event volunteer"],
            ["email", "Email", "email", "name@example.com"], ["phone", "Phone", "tel", "(555) 123-4567"],
            ["years_of_service", "Years of service", "number", "e.g. 2"],
          ].map(([key,label,type,placeholder]) => <label key={key} className="csp-field" htmlFor={`${id}-${key}`}><span>{label}{key === "name" && " *"}</span><input id={`${id}-${key}`} type={type} value={form[key] ?? ""} onChange={e => update(key,e.target.value)} placeholder={placeholder} required={key === "name"} step={type === "number" ? "any" : undefined}/></label>)}
          <div className="csp-wide"><div className="csp-bio-label"><label htmlFor={`${id}-bio`}>Volunteer bio</label><button type="button" aria-pressed={largeText} aria-controls={`${id}-bio`} onClick={() => setLargeText(v => !v)}>{largeText ? "A− Standard text" : "A+ Larger text"}</button></div><textarea id={`${id}-bio`} value={form.bio} onChange={e => update("bio",e.target.value)} rows={5} style={{fontSize:largeText ? "20px" : "16px"}} placeholder="Tell their story: what they do, what inspires them, and the difference they make."/><p className="csp-hint">Long bios scroll inside this field.</p></div>
        </div></section>
        <section className="csp-card"><h3><span>02</span>Spotlight photo <small>Optional</small></h3><div className="csp-photo-fields"><PhotoPreview src={form.image_url}/><label className="csp-field" htmlFor={`${id}-file`}><span>Upload a photo</span><input id={`${id}-file`} ref={fileInput} type="file" accept="image/*" onChange={e => handleFileUpload(e.target.files?.[0])}/></label><label className="csp-field" htmlFor={`${id}-image`}><span>Or paste an image URL</span><input id={`${id}-image`} value={form.image_url} onChange={e => update("image_url",e.target.value)} placeholder="https://…"/></label>{form.image_url && <button className="csp-remove" type="button" onClick={() => update("image_url","")}>Remove photo</button>}</div></section></div>
      </fieldset>
      <footer className="csp-footer"><p role="status">{uploading ? "Uploading photo…" : submitting ? "Creating spotlight…" : selectedSubmission ? "Linked to a volunteer submission." : "Creating a standalone spotlight."}</p><button type="submit" disabled={busy}>{submitting ? "Creating…" : uploading ? "Uploading photo…" : "Create spotlight"}<span aria-hidden="true">✦</span></button></footer>
    </form>
  </section>;
}

const STYLES = `
.csp-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;border:1px solid #ded5e5;border-radius:12px;color:#392f43;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.csp-panel *{box-sizing:border-box}.csp-panel :is(h2,h3,p){margin:0}.csp-panel :is(input,textarea,button){font:inherit}.csp-panel :is(input,textarea,button):focus-visible{outline:3px solid #805995;outline-offset:3px}.csp-header{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid #e1d5e7;padding-bottom:15px;margin-bottom:14px}.csp-eyebrow{font-size:10px;letter-spacing:1.4px;font-weight:750;text-transform:uppercase;color:#79578b}.csp-header h2{font-size:clamp(21px,2.5vw,28px);font-weight:750;letter-spacing:-.6px;line-height:1.3;margin:5px 0}.csp-header p:last-child{font-size:12px;color:#73617e}.csp-header-icon{display:grid;place-items:center;width:44px;height:44px;flex-shrink:0;border-radius:12px;background:linear-gradient(135deg,#eedced,#e8e4fb,#e0efe7);color:#82608f;font-size:25px}.csp-required{font-size:11px;color:#776580;margin-bottom:12px!important}.csp-fields{display:grid;gap:12px;min-width:0;padding:0;margin:0;border:0}.csp-card{min-width:0;background:#fff;padding:clamp(14px,2vw,20px);border:1px solid #dfd4e7;border-top:3px solid #b49bc7;border-radius:9px;box-shadow:0 3px 12px #68457806}.csp-card:nth-child(2){border-top-color:#97bca9}.csp-card h3{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:14px;font-weight:750;color:#513d5d;margin-bottom:14px}.csp-card h3>span{display:grid;place-items:center;width:25px;height:25px;border-radius:7px;background:#f0e7f6;font-size:10px;color:#77548a}.csp-card h3>small{font-size:10px;color:#7b6982;font-weight:400;margin-left:auto}.csp-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.csp-grid label{min-width:0}.csp-grid label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#685173}.csp-grid small{font-weight:400;color:#7f6c87;margin-left:5px}.csp-grid :is(input,textarea){display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font-size:16px;line-height:1.5}.csp-grid :is(input,textarea)::placeholder{color:#8a7b92}.csp-grid textarea{resize:vertical;min-height:120px}.csp-wide{grid-column:1/-1}.csp-active{display:flex;align-items:center;gap:11px;padding:13px 15px;background:#eef5f0;border:1px solid #c8ddcf;border-radius:8px;cursor:pointer}.csp-active>input{width:20px;height:20px;flex-shrink:0;accent-color:#42735b}.csp-active>span:nth-child(2){flex:1;min-width:0}.csp-active strong{display:block;font-size:13px;color:#3e5949}.csp-active small{display:block;font-size:11px;color:#627467;margin-top:2px}.csp-badge{padding:3px 9px;border-radius:20px;background:#d8ebdf;color:#316047;font-size:10px;font-weight:750;flex-shrink:0}.csp-inactive{background:#e8e4ed;color:#6e5f79}.csp-footer{display:flex;justify-content:flex-end;margin-top:16px}.csp-footer button{display:inline-flex;align-items:center;justify-content:space-between;gap:25px;min-height:48px;padding:11px 18px;border:1px solid #765083;border-radius:7px;background:#795587;color:#fff;font-size:13px;font-weight:750;cursor:pointer;transition:background .18s}.csp-footer button:hover:not(:disabled){background:#62406e}.csp-footer button:disabled{opacity:.6;cursor:wait}.csp-error,.csp-success{padding:12px 14px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px;font-size:13px;margin-bottom:13px;overflow-wrap:anywhere}.csp-success{border-color:#bdd9c7;background:#e7f3eb;color:#326046}@media(max-width:640px){.csp-grid{grid-template-columns:1fr;gap:13px}.csp-panel{padding:12px}.csp-active{align-items:flex-start;flex-wrap:wrap;padding:12px}.csp-active>input{margin-top:3px}.csp-badge{margin-top:3px}.csp-footer button{width:100%}.csp-header-icon{width:38px;height:38px}}@media(prefers-reduced-motion:reduce){.csp-panel *{transition:none!important}}

.csp-panel{max-width:1100px;margin-inline:auto}.csp-columns{display:grid;grid-template-columns:1.35fr 1fr;gap:12px;min-width:0}.csp-field{display:block;min-width:0}.csp-field>span{display:block;font-size:12px;font-weight:750;color:#685173;margin-bottom:5px}.csp-field small{font-size:11px;font-weight:400;margin-left:5px;color:#7f6c87}.csp-panel .csp-field :is(input,select),.csp-panel textarea{display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font:16px/1.5 Inter,ui-sans-serif,system-ui,sans-serif}.csp-panel input::placeholder,.csp-panel textarea::placeholder{color:#80718a}.csp-panel select:focus-visible{outline:3px solid #805995;outline-offset:3px}.csp-panel textarea{height:160px;min-height:120px;max-height:300px;resize:vertical;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#b59cc4 #f6f1f8}.csp-bio-label{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px}.csp-bio-label label{font-size:12px;font-weight:750;color:#685173}.csp-bio-label button,.csp-remove,.csp-source-error button{min-height:44px;padding:7px 10px;font-size:12px;font-weight:700;border:1px solid #d4c8df;border-radius:6px;background:#f5eff9;color:#634577;cursor:pointer}.csp-bio-label button[aria-pressed=true]{background:#e9ddf1}.csp-hint{font-size:11px;color:#73617e;margin-top:6px!important}.csp-source{padding:13px 15px;border:1px solid #d8c9e5;border-left:3px solid #b998ca;border-radius:8px;background:#f0e9f6}.csp-source-error{display:flex;align-items:center;gap:10px;flex-wrap:wrap;color:#933954;font-size:12px;margin-top:10px}.csp-photo-fields{display:grid;gap:13px}.csp-panel input[type=file]{padding:8px;font-size:12px;overflow:hidden}.csp-panel input::file-selector-button{padding:6px 9px;border:0;border-radius:4px;background:#eee6f5;color:#654775;margin-right:7px}.csp-preview{display:grid;place-items:center;min-height:170px;padding:12px;background:linear-gradient(135deg,#fbecf2,#eeebf8,#e9f3ee);border:1px dashed #cabbda;border-radius:8px;color:#7f638f;overflow-wrap:anywhere}.csp-preview img{display:block;max-width:100%;height:180px;object-fit:contain;border-radius:5px}.csp-preview p{font-size:12px;text-align:center}.csp-preview>span{font-size:36px;color:#ae81b3}.csp-remove{justify-self:start;background:#fff}.csp-footer{align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.csp-footer p{font-size:12px;color:#73617e}.csp-fields:disabled{opacity:.7}@media(max-width:800px){.csp-columns{grid-template-columns:1fr}.csp-preview img{height:150px}.csp-preview{min-height:120px}}@media(max-width:640px){.csp-footer{align-items:stretch;flex-direction:column}.csp-footer button{width:100%}}
`;
