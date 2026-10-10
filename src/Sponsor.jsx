import React, { useState, useEffect } from "react";



import axios from "axios";

    const API_BASE = "https://singspacebackend.onrender.com";

const PRIDE_ID = 2;

// 🔐 Cloudinary (same pattern as before)

const CLOUD_NAME = "dincfzdau";

const UPLOAD_PRESET = "pridecenters";

// ⭐ Sponsor tiers

const SPONSOR_TIERS = [

    "Customized Tier",

  "Community Supporter",

  "Bronze Sponsor",

  "Silver Sponsor",

  "Gold Sponsor",

  "Platinum Sponsor",

  "In-Kind Sponsor",

];

  const SOCIAL_OPTIONS = [

  { key: "facebook", label: "Facebook", prefix: "https://facebook.com/" },

  { key: "instagram", label: "Instagram", prefix: "https://instagram.com/" },

];

export default function Sponsor() {

const normalizeWebsite = (value) => {

  return value

    .replace(/^https?:\/\//i, "") // strip http:// or https://

    .trim();

};

const formatPhoneNumber = (value) => {

  // Remove all non-digits

  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length === 0) return "";

  if (digits.length < 4) return `(${digits}`;

  if (digits.length < 7)

    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;

};

  const [form, setForm] = useState({

    organization: "",

    contact_name: "",

    email: "",

    phone: "",

    tier: "",

    wants_booth: false,

    website: "",

    social_links: "",

    logo_url: "",

    message: "",

      additional_notes: "",    // ⭐ NEW

  });

const [socialInputs, setSocialInputs] = useState({});

const handleAddSocial = (platform) => {

  setSocialInputs((prev) => ({

    ...prev,

    [platform]: "",

  }));

};

const handleSocialChange = (platform, value) => {

  setSocialInputs((prev) => ({

    ...prev,

    [platform]: value,

  }));

};

  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState(null);

useEffect(() => {

  const stored = localStorage.getItem("pendingSponsorProspect");

  if (!stored) return;

  try {

    const prospect = JSON.parse(stored);

    setForm((prev) => ({

      ...prev,

      organization: prospect.organization || "",

      contact_name: prospect.contact_name || "",

      email: prospect.email || "",

      phone: prospect.phone || "",

      message: prospect.message || "",

    }));

    // 🔥 Important: clear it so it only autofills once

    localStorage.removeItem("pendingSponsorProspect");

  } catch (err) {

    console.error("Failed to parse pending sponsor prospect", err);

  }

}, []);

  // ───────────────────────────────

  // Form Change

  // ───────────────────────────────

const handleChange = (e) => {

  const { name, value, type, checked } = e.target;

  if (name === "phone") {

    setForm((prev) => ({

      ...prev,

      phone: formatPhoneNumber(value),

    }));

    return;

  }

  if (name === "website") {

    setForm((prev) => ({

      ...prev,

      website: normalizeWebsite(value),

    }));

    return;

  }

  setForm((prev) => ({

    ...prev,

    [name]: type === "checkbox" ? checked : value,

  }));

};

  // ───────────────────────────────

  // Logo Upload (Cloudinary)

  // ───────────────────────────────

  const handleLogoUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setUploading(true);

    try {

      const data = new FormData();

      data.append("file", file);

      data.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(

        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

        data

      );

      setForm((prev) => ({

        ...prev,

        logo_url: res.data.secure_url,

      }));

    } catch (err) {

      console.error("❌ Logo upload failed", err);

      setError("Logo upload failed. Please try again.");

    } finally {

      setUploading(false);

    }

  };

  // ───────────────────────────────

  // Submit

  // ───────────────────────────────

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (loading || uploading) return;

    setError(null);

    setLoading(true);

    try {

const socialLinksJoined = Object.entries(socialInputs)

  .map(([platform, value]) => {

    if (!value.trim()) return null;

    const prefix = SOCIAL_OPTIONS.find(o => o.key === platform)?.prefix;

    return `${prefix}${value.trim()}`;

  })

  .filter(Boolean)

  .join(",");

await axios.post(

  `${API_BASE}/api/pride/${PRIDE_ID}/sponsors`,

  {

    organization: form.organization,

    contact_name: form.contact_name,

    email: form.email,

    phone: form.phone || null,

    tier: form.tier,

    wants_booth: form.wants_booth,

website: form.website

  ? `https://${form.website}`

  : null,

    social_links: socialLinksJoined || null,

    logo_url: form.logo_url || null,

    status: "pending",

    message: form.message || null,

        additional_notes: form.additional_notes?.trim() || null, // ⭐ NEW

  },

  { headers: { "Content-Type": "application/json" } }

);

      setSubmitted(true);

    } catch (err) {

      console.error("❌ Sponsor inquiry failed", err);

      setError(err.response?.data?.error || "Submission failed.");

    } finally {

      setLoading(false);

    }

  };

useEffect(() => {

  if (!submitted) return;

  const timer = setTimeout(() => {

    setSubmitted(false);

    // optional: reset form after thank-you disappears

    setForm({

      organization: "",

      contact_name: "",

      email: "",

      phone: "",

      tier: "",

      wants_booth: false,

      website: "",

      social_links: "",

      logo_url: "",

      message: "",

        additional_notes: "",    // ⭐ NEW

    });

    setSocialInputs({});

  }, 3000);

  return () => clearTimeout(timer);
}, [submitted]);

  return <section className="sf-panel" aria-label="Sponsorship inquiry"><style>{STYLES}</style>
    <header className="sf-header"><div><p className="sf-eyebrow">Hartford Pride Center · Community partnerships</p><h2>Become a sponsor</h2><p>Tell us about your organization and how you'd like to get involved.</p></div><span className="sf-header-icon" aria-hidden="true">✦</span></header>
    {!submitted ? <form onSubmit={handleSubmit} aria-busy={loading || uploading}>
      <p className="sf-required">Fields marked * are required.</p>
      <fieldset disabled={loading || uploading} className="sf-form-body">
        <section className="sf-form-card"><h3><span>01</span>Your contact details</h3><div className="sf-edit-fields">
          {[["organization","Organization name","text","organization"],["contact_name","Contact name","text","name"],["email","Email","email","email"],["phone","Phone","tel","tel"]].map(([name,label,type,autoComplete])=><label key={name}><span>{label} {name!=="phone" ? "*" : <small>(optional)</small>}</span><input name={name} type={type} autoComplete={autoComplete} value={form[name]} onChange={handleChange} required={name!=="phone"} maxLength={name==="phone"?14:undefined} placeholder={name==="phone"?"(123) 456-7890":undefined}/></label>)}
        </div></section>
        <section className="sf-form-card"><h3><span>02</span>Your sponsorship</h3><div className="sf-edit-fields"><label><span>Sponsorship tier *</span><select name="tier" value={form.tier} onChange={handleChange} required><option value="">Select a tier</option>{SPONSOR_TIERS.map(t=><option key={t} value={t}>{t}</option>)}</select></label><label className="sf-booth"><input type="checkbox" name="wants_booth" checked={form.wants_booth} onChange={handleChange}/><span>Request a booth at the event</span></label></div></section>
        <section className="sf-form-card"><h3><span>03</span>Your organization online <small>Optional</small></h3><div className="sf-online-grid"><div>
          <label className="sf-field"><span>Website</span><div className="sf-url"><span aria-hidden="true">https://</span><input type="text" inputMode="url" name="website" autoComplete="url" value={form.website} onChange={handleChange} placeholder="example.com" aria-label="Website, https prefix included"/></div></label>
          <div className="sf-socials"><h4>Social media</h4>{SOCIAL_OPTIONS.filter(opt=>Object.prototype.hasOwnProperty.call(socialInputs,opt.key)).map(opt=><div className="sf-social-row" key={opt.key}><label className="sf-field"><span>{opt.label}</span><small>{opt.prefix}</small><input value={socialInputs[opt.key]} placeholder="Username or page" onChange={e=>handleSocialChange(opt.key,e.target.value)}/></label><button type="button" aria-label={`Remove ${opt.label}`} onClick={()=>setSocialInputs(prev=>{const next={...prev};delete next[opt.key];return next;})}>Remove</button></div>)}<div className="sf-add-social">{SOCIAL_OPTIONS.filter(opt=>!Object.prototype.hasOwnProperty.call(socialInputs,opt.key)).map(opt=><button type="button" key={opt.key} onClick={()=>handleAddSocial(opt.key)}>+ {opt.label}</button>)}</div></div>
        </div><div className="sf-logo-area"><label className="sf-field"><span>Sponsor logo</span><input type="file" accept="image/*" onChange={handleLogoUpload}/></label><label className="sf-field"><span>Or paste an image URL</span><input type="text" inputMode="url" value={form.logo_url} onChange={e=>setForm(prev=>({...prev,logo_url:e.target.value}))} placeholder="https://…"/></label>{form.logo_url && <LogoPreview src={form.logo_url}/>}</div></div></section>
        <section className="sf-form-card"><h3><span>04</span>A little more about your plans <small>Optional</small></h3><div className="sf-edit-fields">{[["message","Message","How would you like to support Pride?"],["additional_notes","Additional notes","Anything else we should know?"]].map(([name,label,placeholder])=><label key={name}><span>{label}</span><textarea name={name} rows={4} maxLength={500} value={form[name]} onChange={handleChange} placeholder={placeholder}/><small className="sf-counter">{form[name].length}/500</small></label>)}</div></section>
      </fieldset>
      {uploading && <p role="status" className="sf-feedback">Uploading your logo…</p>}
      {error && <p role="alert" className="sf-error">{error}</p>}
      <footer className="sf-submit-row"><p>This sends an inquiry to our team.</p><button className="sf-primary" type="submit" disabled={loading || uploading}>{loading ? "Submitting…" : uploading ? "Uploading logo…" : "Submit sponsorship inquiry"}<span aria-hidden="true">↗</span></button></footer>
    </form> : <div className="sf-success" role="status"><span aria-hidden="true">✓</span><h3>Thank you!</h3><p>Your sponsorship inquiry has been received.<br/>We’ll be in touch soon.</p></div>}
  </section>;
}
function LogoPreview({src}){const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[src]);return failed?<p className="sf-preview-error">The image preview couldn't load. Check the URL or upload a file.</p>:<img className="sf-logo-preview" src={src} alt="Sponsor logo preview" onError={()=>setFailed(true)}/>;}

const STYLES = `
.sf-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;color:#392f43;border:1px solid #ded5e5;border-radius:12px;font:14px/1.55 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.sf-panel *{box-sizing:border-box}.sf-panel :is(h2,h3,p){margin:0}.sf-panel :is(button,input,select,textarea){font:inherit}.sf-panel button{min-height:44px;padding:9px 13px;border:1px solid #d4c6df;border-radius:7px;background:#fff;color:#564263;font-weight:650;cursor:pointer;transition:background .18s}.sf-panel button:hover:not(:disabled){background:#f0e8f7}.sf-panel button:disabled{opacity:.5;cursor:not-allowed}.sf-panel :is(button,a,input,select,textarea,[tabindex]):focus-visible{outline:3px solid #795394;outline-offset:3px}.sf-panel :is(input,select,textarea){width:100%;min-width:0;min-height:44px;border:1px solid #cfc3d9;border-radius:7px;background:#fff;color:#392f43;padding:9px 11px;font-size:16px}.sf-panel textarea{resize:vertical;min-height:140px}.sf-header{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:18px}.sf-eyebrow{font-size:10px;font-weight:750;letter-spacing:1.4px;text-transform:uppercase;color:#77538b}.sf-header h2{display:flex;align-items:center;flex-wrap:wrap;gap:9px;font-size:clamp(20px,2.5vw,27px);letter-spacing:-.6px;font-weight:750;line-height:1.3;margin:5px 0}.sf-header h2>span{font-size:12px;letter-spacing:0;padding:3px 8px;border-radius:20px;background:#e9def1;color:#68477c}.sf-header>div>p:last-child{font-size:12px;color:#74647e}.sf-tools{display:flex;gap:7px;flex-shrink:0}.sf-tools button{font-size:12px}.sf-tools button[aria-pressed=true]{background:#77518a;color:#fff;border-color:#77518a}.sf-toolbar{display:flex;gap:12px;align-items:end}.sf-toolbar label>span,.sf-edit-fields label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#695575}.sf-search{flex:1;min-width:0}.sf-filter{width:195px;flex-shrink:0}.sf-results{display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:42px;font-size:11px;color:#73627e}.sf-results button{font-size:11px;border:0;background:none;text-decoration:underline;padding:4px;min-height:36px}.sf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:13px;align-items:start}.sf-card{min-width:0;display:flex;flex-direction:column;background:#fff;border:1px solid #ded6e5;border-top:3px solid var(--sf-ink);border-radius:10px;padding:16px;box-shadow:0 4px 15px #4c335a08}.sf-card-top{display:flex;align-items:center;gap:11px}.sf-avatar{width:42px;height:42px;flex-shrink:0;display:grid;place-items:center;background:var(--sf-wash);color:var(--sf-ink);font-weight:800;border-radius:12px;font-size:14px}.sf-person{min-width:0}.sf-card h3{font-size:16px;font-weight:750;line-height:1.35;overflow-wrap:anywhere}.sf-badge{display:inline-block;font-size:10px;font-weight:750;padding:2px 8px;border-radius:20px;background:var(--sf-wash);color:var(--sf-ink);margin-top:4px}.sf-reach{display:flex;flex-direction:column;gap:2px;margin:10px 0;min-width:0}.sf-reach a{font-size:13px;color:#65507e;text-underline-offset:3px;overflow-wrap:anywhere;min-height:28px;display:flex;align-items:center}.sf-message{max-height:145px;overflow-y:auto;min-height:75px;padding:11px 12px;background:#f8f6fa;border:1px solid #e9e2ed;border-radius:6px;font-size:13px;line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere;scrollbar-width:thin;scrollbar-color:#b19bbd #f1ebf5}.sf-status-control{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px}.sf-status-control>span{font-size:11px;font-weight:650;color:#74617f}.sf-status-control select{width:155px;font-size:14px;background:var(--sf-wash);color:var(--sf-ink);border-color:transparent;font-weight:650}.sf-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid #eee7f1}.sf-actions button{font-size:12px}.sf-panel .sf-primary{background:#77518a;color:#fff;border-color:#77518a}.sf-panel .sf-primary:hover:not(:disabled){background:#603d73}.sf-panel .sf-delete{margin-left:auto;background:#fff;color:#9b3d57;border-color:#ead5dc}.sf-panel .sf-delete:hover:not(:disabled){background:#fbeaf0}.sf-actions>span{font-size:11px;color:#745181}.sf-edit-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px}.sf-editing{box-shadow:0 0 0 2px #ad91bd}.sf-edit-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.sf-wide{grid-column:1/-1}.sf-state{padding:35px 16px;text-align:center;border:1px dashed #cdbed8;border-radius:9px;background:#fff;color:#6f5b7b}.sf-state strong{display:block;color:#4f3a5c;font-size:17px;margin-bottom:5px}.sf-state button{display:block;margin:13px auto 0}.sf-error{color:#963955;background:#fff6f8}.sf-large .sf-message{font-size:18px}.sf-large .sf-reach a{font-size:16px}.sf-large .sf-card h3{font-size:19px}
@media(max-width:700px){.sf-header{align-items:flex-start;flex-direction:column;gap:10px}.sf-tools{width:100%}.sf-tools button{flex:1}.sf-toolbar{flex-wrap:wrap;gap:9px}.sf-search{flex-basis:100%}.sf-filter{width:100%}.sf-panel{padding:12px}.sf-card{padding:14px}.sf-edit-fields{grid-template-columns:1fr}.sf-panel .sf-status-control select{font-size:16px}}
@media(prefers-reduced-motion:reduce){.sf-panel *{transition:none!important}}

.sf-panel{background:#f7f4f9}.sf-header{border-bottom:1px solid #e1d5e7;padding-bottom:15px;margin-bottom:16px}.sf-header-icon{display:grid;place-items:center;width:48px;height:48px;border-radius:13px;background:linear-gradient(130deg,#efdced,#eee3ce,#dfebf6);color:#865b93;font-size:26px;flex-shrink:0}.sf-required{font-size:11px;color:#73617e;margin-bottom:12px!important}.sf-form-body{padding:0;margin:0;border:0;min-width:0;display:grid;gap:13px}.sf-form-card{min-width:0;padding:clamp(14px,2vw,21px);background:#fff;border:1px solid #ddd2e5;border-radius:10px;box-shadow:0 3px 12px #58336106}.sf-form-card:nth-child(2){border-top:3px solid #c6b07a}.sf-form-card:nth-child(3){border-top:3px solid #bda0cd}.sf-form-card h3{display:flex;align-items:center;flex-wrap:wrap;gap:9px;font-size:14px;font-weight:750;color:#4e395d;margin-bottom:15px}.sf-form-card h3>span{display:grid;place-items:center;width:27px;height:27px;border-radius:8px;background:#f0e7f6;color:#79548d;font-size:10px;flex-shrink:0}.sf-form-card h3>small{margin-left:auto;font-size:10px;font-weight:500;color:#79677f}.sf-field{display:block;min-width:0}.sf-field>span{display:block;font-size:11px;font-weight:750;color:#695575;margin-bottom:5px}.sf-field>small{display:block;font-size:11px;color:#7b6985;margin-bottom:4px;overflow-wrap:anywhere}.sf-edit-fields small{font-weight:400;color:#75667d}.sf-panel .sf-booth{display:flex;align-items:center;gap:10px;background:#faf6ed;border:1px solid #e6dcc5;border-radius:7px;padding:10px 12px;align-self:end;min-height:46px}.sf-panel .sf-booth input{width:20px;min-height:20px;height:20px;flex-shrink:0;accent-color:#81538b}.sf-panel .sf-booth>span{margin:0;font-size:13px;color:#66513a;font-weight:600}.sf-online-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.sf-online-grid>div{min-width:0}.sf-url{display:flex;align-items:center;border:1px solid #cfc3d9;border-radius:7px;background:#f5f0f8;min-width:0}.sf-url>span{padding-inline:10px;color:#705e7b;font-size:12px}.sf-panel .sf-url input{border:0;border-radius:0 7px 7px 0}.sf-socials{margin-top:16px}.sf-socials h4{font-size:12px;font-weight:750;margin:0 0 8px}.sf-social-row{display:flex;align-items:flex-end;gap:8px;margin-bottom:12px}.sf-social-row label{flex:1;min-width:0}.sf-social-row button{font-size:11px;padding-inline:9px}.sf-add-social{display:flex;flex-wrap:wrap;gap:8px}.sf-add-social button{font-size:12px}.sf-logo-area{padding-left:20px;border-left:1px solid #e9e1ee}.sf-logo-area .sf-field+.sf-field{margin-top:13px}.sf-panel input[type=file]{font-size:12px;padding:9px;min-height:44px;max-width:100%}.sf-logo-preview{display:block;width:84px;height:84px;object-fit:contain;background:#fff;padding:6px;border:1px solid #ddcde6;border-radius:8px;margin-top:12px}.sf-preview-error{font-size:12px;color:#8e425e;margin-top:10px!important}.sf-counter{display:block;text-align:right;margin-top:4px;font-size:11px}.sf-submit-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:18px}.sf-submit-row p{font-size:12px;color:#73617e}.sf-submit-row button{display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:48px}.sf-feedback,.sf-error{padding:12px 14px;margin-top:14px!important;border-radius:7px;font-size:13px;background:#ede5f4;color:#634177}.sf-error{background:#fbe7ed;color:#953850;border:1px solid #ebc2cf}.sf-success{padding:36px 16px;text-align:center;background:#edf6f0;border:1px solid #c6dece;border-radius:10px;color:#326448}.sf-success>span{display:grid;place-items:center;width:46px;height:46px;background:#d4ecde;border-radius:50%;margin:0 auto 13px;font-size:24px}.sf-success h3{font-size:25px;margin-bottom:8px}.sf-success p{font-size:14px;color:#4d6c59}
@media(max-width:700px){.sf-header{flex-direction:row}.sf-header-icon{width:39px;height:39px}.sf-online-grid{grid-template-columns:1fr;gap:17px}.sf-logo-area{padding:16px 0 0;border-left:0;border-top:1px solid #e9e1ee}.sf-submit-row{flex-direction:column;align-items:stretch;gap:9px}.sf-submit-row button{width:100%;font-size:13px}.sf-form-card h3>small{margin-left:0}.sf-form-card{padding:14px}}
`;
