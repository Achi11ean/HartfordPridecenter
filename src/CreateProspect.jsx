import React, { useId, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = "https://singspacebackend.onrender.com";
const EMPTY_FORM = {
  organization: "", contact_name: "", contact_email: "",
  contact_phone: "", notes: "", status: "new",
};

const formatPhoneNumber = (value) => {
  const digits = (value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function CreateProspect() {
  const id = useId();
  const pending = useRef(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [largeNotes, setLargeNotes] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSuccess(false);
    setForm(prev => ({ ...prev, [name]: name === "contact_phone" ? formatPhoneNumber(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending.current) return;
    setError("");
    setSuccess(false);
    if (!form.organization.trim()) {
      setError("Please enter an organization name.");
      return;
    }
    let token, admin;
    try {
      token = localStorage.getItem("prideToken");
      admin = JSON.parse(localStorage.getItem("prideUser") || "{}");
    } catch {
      setError("Your account information could not be read. Please sign in again.");
      return;
    }
    if (!token || !admin?.pride_id) {
      setError("Missing account information. Please sign in again.");
      return;
    }
    pending.current = true;
    setLoading(true);
    try {
      await axios.post(`${API}/api/sponsor-prospects`, {
        pride_id: admin.pride_id,
        organization: form.organization,
        contact_name: form.contact_name || null,
        contact_email: form.contact_email || null,
        contact_phone: form.contact_phone || null,
        notes: form.notes || null,
        status: form.status,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Sponsor prospect created 🌱");
      setForm({ ...EMPTY_FORM });
      setSuccess(true);
    } catch (err) {
      const message = typeof err.response?.data?.error === "string"
        ? err.response.data.error : "Failed to create prospect";
      setError(message);
      toast.error(message);
    } finally {
      pending.current = false;
      setLoading(false);
    }
  };

  return (
    <section className="cp-panel" aria-labelledby={`${id}-heading`}>
      <style>{STYLES}</style>
      <header className="cp-header">
        <div>
          <p className="cp-eyebrow">Grow our community</p>
          <h2 id={`${id}-heading`}>Add a sponsor prospect</h2>
          <p>A new connection starts here. Keep the details in one place.</p>
        </div>
        <span className="cp-header-icon" aria-hidden="true">✦</span>
      </header>
      <form onSubmit={handleSubmit} aria-busy={loading}>
        <p className="cp-required">* Required. All other fields are optional.</p>
        {error && <div className="cp-error" role="alert">{error}</div>}
        {success && <div className="cp-success" role="status">✓ Prospect created. You can add another below.</div>}
        <fieldset className="cp-fields" disabled={loading}>
          <section className="cp-card">
            <h3><span>01</span>Organization & contact</h3>
            <div className="cp-grid">
              <label className="cp-wide" htmlFor={`${id}-organization`}>
                <span>Organization name *</span>
                <input id={`${id}-organization`} name="organization" autoComplete="organization" value={form.organization} onChange={handleChange} placeholder="e.g. Riverfront Coffee Co." required />
              </label>
              <label className="cp-wide" htmlFor={`${id}-name`}>
                <span>Contact name</span>
                <input id={`${id}-name`} name="contact_name" autoComplete="name" value={form.contact_name} onChange={handleChange} placeholder="Who should we connect with?" />
              </label>
              <label htmlFor={`${id}-email`}>
                <span>Contact email</span>
                <input id={`${id}-email`} type="email" name="contact_email" autoComplete="email" value={form.contact_email} onChange={handleChange} placeholder="hello@organization.com" />
              </label>
              <label htmlFor={`${id}-phone`}>
                <span>Contact phone</span>
                <input id={`${id}-phone`} type="tel" inputMode="tel" name="contact_phone" autoComplete="tel-national" value={form.contact_phone} onChange={handleChange} placeholder="(555) 123-4567" />
              </label>
            </div>
          </section>
          <section className="cp-card">
            <h3><span>02</span>Notes & next steps</h3>
            <div className="cp-notes-toolbar">
              <label htmlFor={`${id}-notes`}>Notes / follow-up details</label>
              <button type="button" aria-pressed={largeNotes} aria-controls={`${id}-notes`} onClick={() => setLargeNotes(v => !v)}>{largeNotes ? "A− Standard text" : "A+ Larger text"}</button>
            </div>
            <div className="cp-grid">
              <textarea className="cp-wide cp-notes" style={{ fontSize: largeNotes ? "20px" : "16px" }} id={`${id}-notes`} name="notes" value={form.notes} onChange={handleChange} rows={4} placeholder="How you connected, what interests them, or what to follow up on…" />
            </div>
            <p className="cp-note-hint">Long notes scroll inside this field.</p>
          </section>
        </fieldset>
        <footer className="cp-footer">
          <p className="cp-status"><span aria-hidden="true" />Starts with status: <strong>New</strong></p>
          <button type="submit" disabled={loading}>{loading ? "Creating…" : "Create prospect"}<span aria-hidden="true">+</span></button>
        </footer>
      </form>
    </section>
  );
}

const STYLES = `

.cp-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;border:1px solid #ded5e5;border-radius:12px;color:#392f43;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.cp-panel *{box-sizing:border-box}.cp-panel :is(h2,h3,p){margin:0}.cp-panel :is(input,textarea,button){font:inherit}.cp-panel :is(input,textarea,button):focus-visible{outline:3px solid #805995;outline-offset:3px}.cp-header{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid #e1d5e7;padding-bottom:15px;margin-bottom:14px}.cp-eyebrow{font-size:10px;letter-spacing:1.4px;font-weight:750;text-transform:uppercase;color:#79578b}.cp-header h2{font-size:clamp(21px,2.5vw,28px);font-weight:750;letter-spacing:-.6px;line-height:1.3;margin:5px 0}.cp-header p:last-child{font-size:12px;color:#73617e}.cp-header-icon{display:grid;place-items:center;width:44px;height:44px;flex-shrink:0;border-radius:12px;background:linear-gradient(135deg,#eedced,#e8e4fb,#e0efe7);color:#82608f;font-size:25px}.cp-required{font-size:11px;color:#776580;margin-bottom:12px!important}.cp-fields{display:grid;gap:12px;min-width:0;padding:0;margin:0;border:0}.cp-card{min-width:0;background:#fff;padding:clamp(14px,2vw,20px);border:1px solid #dfd4e7;border-top:3px solid #b49bc7;border-radius:9px;box-shadow:0 3px 12px #68457806}.cp-card:nth-child(2){border-top-color:#97bca9}.cp-card h3{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:14px;font-weight:750;color:#513d5d;margin-bottom:14px}.cp-card h3>span{display:grid;place-items:center;width:25px;height:25px;border-radius:7px;background:#f0e7f6;font-size:10px;color:#77548a}.cp-card h3>small{font-size:10px;color:#7b6982;font-weight:400;margin-left:auto}.cp-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.cp-grid label{min-width:0}.cp-grid label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#685173}.cp-grid small{font-weight:400;color:#7f6c87;margin-left:5px}.cp-grid :is(input,textarea){display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font-size:16px;line-height:1.5}.cp-grid :is(input,textarea)::placeholder{color:#8a7b92}.cp-grid textarea{resize:vertical;min-height:120px}.cp-wide{grid-column:1/-1}.cp-active{display:flex;align-items:center;gap:11px;padding:13px 15px;background:#eef5f0;border:1px solid #c8ddcf;border-radius:8px;cursor:pointer}.cp-active>input{width:20px;height:20px;flex-shrink:0;accent-color:#42735b}.cp-active>span:nth-child(2){flex:1;min-width:0}.cp-active strong{display:block;font-size:13px;color:#3e5949}.cp-active small{display:block;font-size:11px;color:#627467;margin-top:2px}.cp-badge{padding:3px 9px;border-radius:20px;background:#d8ebdf;color:#316047;font-size:10px;font-weight:750;flex-shrink:0}.cp-inactive{background:#e8e4ed;color:#6e5f79}.cp-footer{display:flex;justify-content:flex-end;margin-top:16px}.cp-footer button{display:inline-flex;align-items:center;justify-content:space-between;gap:25px;min-height:48px;padding:11px 18px;border:1px solid #765083;border-radius:7px;background:#795587;color:#fff;font-size:13px;font-weight:750;cursor:pointer;transition:background .18s}.cp-footer button:hover:not(:disabled){background:#62406e}.cp-footer button:disabled{opacity:.6;cursor:wait}.cp-error,.cp-success{padding:12px 14px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px;font-size:13px;margin-bottom:13px;overflow-wrap:anywhere}.cp-success{border-color:#bdd9c7;background:#e7f3eb;color:#326046}@media(max-width:640px){.cp-grid{grid-template-columns:1fr;gap:13px}.cp-panel{padding:12px}.cp-active{align-items:flex-start;flex-wrap:wrap;padding:12px}.cp-active>input{margin-top:3px}.cp-badge{margin-top:3px}.cp-footer button{width:100%}.cp-header-icon{width:38px;height:38px}}@media(prefers-reduced-motion:reduce){.cp-panel *{transition:none!important}}

.cp-panel{max-width:100%;margin-inline:auto}.cp-notes-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:7px}.cp-notes-toolbar label{font-size:12px;font-weight:750;color:#685173}.cp-notes-toolbar button{min-height:44px;border:1px solid #d4c8df;background:#f5eff9;color:#634577;padding:7px 11px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer}.cp-notes-toolbar button[aria-pressed=true]{background:#e9ddf1;border-color:#9a7aad}.cp-grid .cp-notes{height:140px;min-height:120px;max-height:260px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#ae96bc #f6f1f8;overscroll-behavior:contain}.cp-note-hint{font-size:11px;color:#73617e;margin-top:6px!important}.cp-footer{align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.cp-status{display:flex;align-items:center;gap:6px;font-size:12px;color:#65536f}.cp-status>span{width:7px;height:7px;background:#568368;border-radius:50%}.cp-status strong{color:#39624a}.cp-fields:disabled{opacity:.72}.cp-panel button:disabled{cursor:wait}@media(max-width:640px){.cp-footer button{width:100%}.cp-status{font-size:11px}}
`;
