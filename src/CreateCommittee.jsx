import React, { useId, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_BASE = "https://singspacebackend.onrender.com";
const EMPTY_FORM = { name: "", mission_statement: "", details: "", contact_email: "", contact_phone: "", is_active: true };

export default function CreateCommittee({ onCreated }) {
  const { prideId, token, isAdmin } = useAuth();
  const id = useId();
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (loading) return;
    setError(null); setSuccess(null);
    if (!isAdmin) { setError("Only Pride admins can create committees."); return; }
    if (!prideId || !token) { setError("Missing account information. Please re-login."); return; }
    if (!formData.name.trim() || !formData.mission_statement.trim()) { setError("Name and mission statement are required."); return; }
    setLoading(true);
    let committee;
    try {
      const res = await axios.post(`${API_BASE}/api/pride-committees`, {
        pride_id: prideId,
        name: formData.name,
        mission_statement: formData.mission_statement,
        details: formData.details || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        is_active: formData.is_active,
      }, { headers: { Authorization: `Bearer ${token}` } });
      committee = res.data.committee;
      setSuccess("Committee created successfully!");
      setFormData({ ...EMPTY_FORM });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create committee");
      return;
    } finally { setLoading(false); }
    if (onCreated) onCreated(committee);
  };

  return <section className="cc-panel" aria-label="Create committee"><style>{STYLES}</style>
    {!isAdmin ? <div className="cc-error" role="alert">Only Pride admins can create committees.</div> : <>
      <header className="cc-header"><div><p className="cc-eyebrow">Community leadership</p><h2>Create a committee</h2><p>Give your team a purpose and a way to connect.</p></div><span className="cc-header-icon" aria-hidden="true">✦</span></header>
      <form onSubmit={handleSubmit} aria-busy={loading}>
        <p className="cc-required">Fields marked * are required.</p>
        {error && <div className="cc-error" role="alert">{error}</div>}
        {success && <div className="cc-success" role="status">✓ {success}</div>}
        <fieldset className="cc-fields" disabled={loading}>
          <section className="cc-card"><h3><span>01</span>Purpose & details</h3><div className="cc-grid">
            <label className="cc-wide" htmlFor={`${id}-name`}><span>Committee name *</span><input id={`${id}-name`} type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Health & Wellness Committee" required/></label>
            <label htmlFor={`${id}-mission`}><span>Mission statement *</span><textarea id={`${id}-mission`} name="mission_statement" value={formData.mission_statement} onChange={handleChange} rows={4} placeholder="What is this committee responsible for?" required/></label>
            <label htmlFor={`${id}-details`}><span>Additional details <small>Optional</small></span><textarea id={`${id}-details`} name="details" value={formData.details} onChange={handleChange} rows={4} placeholder="Projects, priorities, or other helpful context"/></label>
          </div></section>
          <section className="cc-card"><h3><span>02</span>Contact information <small>Optional</small></h3><div className="cc-grid">
            <label htmlFor={`${id}-email`}><span>Contact email</span><input id={`${id}-email`} type="email" autoComplete="email" name="contact_email" value={formData.contact_email} onChange={handleChange} placeholder="committee@pride.org"/></label>
            <label htmlFor={`${id}-phone`}><span>Contact phone</span><input id={`${id}-phone`} type="tel" autoComplete="tel" name="contact_phone" value={formData.contact_phone} onChange={handleChange} placeholder="(555) 123-4567"/></label>
          </div></section>
          <label className="cc-active" htmlFor={`${id}-active`}><input id={`${id}-active`} type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange}/><span><strong>Committee is active</strong><small>You can create it as inactive by unchecking this option.</small></span><span className={`cc-badge${formData.is_active ? "" : " cc-inactive"}`}>{formData.is_active ? "Active" : "Inactive"}</span></label>
        </fieldset>
        <footer className="cc-footer"><button type="submit" disabled={loading}>{loading ? "Creating…" : "Create committee"}<span aria-hidden="true">+</span></button></footer>
      </form>
    </>}
  </section>;
}

const STYLES = `
.cc-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;border:1px solid #ded5e5;border-radius:12px;color:#392f43;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.cc-panel *{box-sizing:border-box}.cc-panel :is(h2,h3,p){margin:0}.cc-panel :is(input,textarea,button){font:inherit}.cc-panel :is(input,textarea,button):focus-visible{outline:3px solid #805995;outline-offset:3px}.cc-header{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid #e1d5e7;padding-bottom:15px;margin-bottom:14px}.cc-eyebrow{font-size:10px;letter-spacing:1.4px;font-weight:750;text-transform:uppercase;color:#79578b}.cc-header h2{font-size:clamp(21px,2.5vw,28px);font-weight:750;letter-spacing:-.6px;line-height:1.3;margin:5px 0}.cc-header p:last-child{font-size:12px;color:#73617e}.cc-header-icon{display:grid;place-items:center;width:44px;height:44px;flex-shrink:0;border-radius:12px;background:linear-gradient(135deg,#eedced,#e8e4fb,#e0efe7);color:#82608f;font-size:25px}.cc-required{font-size:11px;color:#776580;margin-bottom:12px!important}.cc-fields{display:grid;gap:12px;min-width:0;padding:0;margin:0;border:0}.cc-card{min-width:0;background:#fff;padding:clamp(14px,2vw,20px);border:1px solid #dfd4e7;border-top:3px solid #b49bc7;border-radius:9px;box-shadow:0 3px 12px #68457806}.cc-card:nth-child(2){border-top-color:#97bca9}.cc-card h3{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:14px;font-weight:750;color:#513d5d;margin-bottom:14px}.cc-card h3>span{display:grid;place-items:center;width:25px;height:25px;border-radius:7px;background:#f0e7f6;font-size:10px;color:#77548a}.cc-card h3>small{font-size:10px;color:#7b6982;font-weight:400;margin-left:auto}.cc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.cc-grid label{min-width:0}.cc-grid label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#685173}.cc-grid small{font-weight:400;color:#7f6c87;margin-left:5px}.cc-grid :is(input,textarea){display:block;width:100%;min-width:0;min-height:46px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;padding:10px 12px;font-size:16px;line-height:1.5}.cc-grid :is(input,textarea)::placeholder{color:#8a7b92}.cc-grid textarea{resize:vertical;min-height:120px}.cc-wide{grid-column:1/-1}.cc-active{display:flex;align-items:center;gap:11px;padding:13px 15px;background:#eef5f0;border:1px solid #c8ddcf;border-radius:8px;cursor:pointer}.cc-active>input{width:20px;height:20px;flex-shrink:0;accent-color:#42735b}.cc-active>span:nth-child(2){flex:1;min-width:0}.cc-active strong{display:block;font-size:13px;color:#3e5949}.cc-active small{display:block;font-size:11px;color:#627467;margin-top:2px}.cc-badge{padding:3px 9px;border-radius:20px;background:#d8ebdf;color:#316047;font-size:10px;font-weight:750;flex-shrink:0}.cc-inactive{background:#e8e4ed;color:#6e5f79}.cc-footer{display:flex;justify-content:flex-end;margin-top:16px}.cc-footer button{display:inline-flex;align-items:center;justify-content:space-between;gap:25px;min-height:48px;padding:11px 18px;border:1px solid #765083;border-radius:7px;background:#795587;color:#fff;font-size:13px;font-weight:750;cursor:pointer;transition:background .18s}.cc-footer button:hover:not(:disabled){background:#62406e}.cc-footer button:disabled{opacity:.6;cursor:wait}.cc-error,.cc-success{padding:12px 14px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px;font-size:13px;margin-bottom:13px;overflow-wrap:anywhere}.cc-success{border-color:#bdd9c7;background:#e7f3eb;color:#326046}@media(max-width:640px){.cc-grid{grid-template-columns:1fr;gap:13px}.cc-panel{padding:12px}.cc-active{align-items:flex-start;flex-wrap:wrap;padding:12px}.cc-active>input{margin-top:3px}.cc-badge{margin-top:3px}.cc-footer button{width:100%}.cc-header-icon{width:38px;height:38px}}@media(prefers-reduced-motion:reduce){.cc-panel *{transition:none!important}}
`;
