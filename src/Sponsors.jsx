import React, { useEffect, useState, useRef, useId } from "react";

import axios from "axios";

import { toast } from "react-toastify";

import { useAuth } from "./AuthContext";

import { createPortal } from "react-dom";

import { useNavigate } from "react-router-dom";

const API = "https://singspacebackend.onrender.com";

const CLOUD_NAME = "dincfzdau";

const UPLOAD_PRESET = "pridecenters";

const STATUS_OPTIONS = [

  "pending",

  "contacted", 

  "Unpaid - Awaiting Payment",

  "approved",

  "declined",

];

export default function Sponsors() {

    const cleanPayload = (obj) =>

  Object.fromEntries(

    Object.entries(obj).filter(

      ([_, v]) => v !== "" && v !== null && v !== undefined

    )

  );

  const SOCIAL_OPTIONS = {

  facebook: "https://facebook.com/",

  instagram: "https://instagram.com/",

};

const [socialInputs, setSocialInputs] = useState([]);

const navigate = useNavigate();

  const [selectedSponsor, setSelectedSponsor] = useState(null);

const [searchTerm, setSearchTerm] = useState("");

const [statusFilter, setStatusFilter] = useState("all");

const statusColors = {

  pending: "bg-yellow-400/20 border-yellow-400 text-yellow-200",

  contacted: "bg-blue-400/20 border-blue-400 text-blue-200",

  approved: "bg-green-400/20 border-green-400 text-green-200",

  declined: "bg-red-400/20 border-red-400 text-red-200",

  "Unpaid - Awaiting Payment":

    "bg-orange-400/20 border-orange-400 text-orange-200",

  paid: "bg-emerald-400/20 border-emerald-400 text-emerald-200",

  confirmed: "bg-purple-400/20 border-purple-400 text-purple-200",

};

  const { token, prideId, isAdmin } = useAuth();

const normalizeImageUrl = (value) => {

  if (!value) return "";

  return value.startsWith("http") ? value : `https://${value}`;

};

const handleLogoUrlChange = (e) => {

  const value = e.target.value;

  setEditForm((prev) => ({

    ...prev,

    logo_url: normalizeImageUrl(value),

  }));

};

  const [sponsors, setSponsors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [largeText, setLargeText] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({

    organization: "",

    contact_name: "",

    email: "",

    phone: "",

    tier: "",

    wants_booth: false,

    status: "pending",

    website: "",

    social_links: "",

    message: "",

     logo_url: "",

     additional_notes: "",

  });

  // ───────────────────────────────

  // Fetch Sponsors

  // ───────────────────────────────

  const fetchSponsors = async () => {

    if (!prideId || !token) { setLoading(false); return; }
    setLoading(true); setError("");

    try {

      const res = await axios.get(

        `${API}/api/pride/${prideId}/sponsors`,

        { headers: { Authorization: `Bearer ${token}` } }

      );

      setSponsors(res.data || []);

    } catch {

      setError("Couldn’t load sponsor inquiries. Please try again.");
    toast.error("Failed to load sponsor inquiries");

    } finally {

      setLoading(false);

    }

  };

useEffect(() => {

  fetchSponsors();

}, [prideId, token]);

  // ───────────────────────────────

  // Open Edit

  // ───────────────────────────────

const openEdit = (s) => {

  setEditingId(s.id);

  // 🔗 Parse social links into inputs

 const parsedSocials = (s.social_links || "")

  .split(",")

  .map((url) => url.trim())

  .filter(Boolean)

  .map((url) => {

    if (url.includes("facebook.com/")) {

      return {

        platform: "facebook",

        username: url

          .split("facebook.com/")[1]

          .replace(/^@/, "")

          .replace(/\/.*$/, ""),

      };

    }

    if (url.includes("instagram.com/")) {

      return {

        platform: "instagram",

        username: url

          .split("instagram.com/")[1]

          .replace(/^@/, "")

          .replace(/\/.*$/, ""),

      };

    }

    return null;

  })

  .filter(Boolean);

  setSocialInputs(parsedSocials);

  setEditForm({

    organization: s.organization || "",

    contact_name: s.contact_name || "",

    email: s.email || "",

    phone: s.phone || "",

    tier: s.tier || "",

    wants_booth:

      s.wants_booth === true ||

      s.wants_booth === 1 ||

      s.wants_booth === "1" ||

      s.wants_booth === "true",

    status: s.status || "pending",

    website: s.website || "",

    social_links: s.social_links || "",

    message: s.message || "",

    logo_url: s.logo_url || "",

      additional_notes: s.additional_notes || "", 

  });

};

const filteredSponsors = sponsors.filter((s) => {

  const q = searchTerm.toLowerCase();

  const matchesSearch =

    (s.organization || "").toLowerCase().includes(q) ||

    (s.contact_name || "").toLowerCase().includes(q) ||

    (s.email || "").toLowerCase().includes(q) ||

    (s.tier || "").toLowerCase().includes(q) ||

    (s.status || "").toLowerCase().includes(q);

  const matchesStatus =

    statusFilter === "all" ||

    (s.status || "") === statusFilter;

  return matchesSearch && matchesStatus;

});

const handleLogoUpload = async (e) => {

  const file = e.target.files[0];

  if (!file) return;

  setUploading(true);
  const toastId = toast.loading("Uploading logo…");

  try {

    const data = new FormData();

    data.append("file", file);

    data.append("upload_preset", UPLOAD_PRESET);

    const res = await axios.post(

      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

      data

    );

    setEditForm((prev) => ({

      ...prev,

      logo_url: res.data.secure_url,

    }));

    toast.update(toastId, {

      render: "Logo uploaded",

      type: "success",

      isLoading: false,

      autoClose: 2000,

    });

  } catch (err) {

    toast.update(toastId, {

      render: "Logo upload failed",

      type: "error",

      isLoading: false,

      autoClose: 3000,

    });

  } finally { setUploading(false); }
};

  // ───────────────────────────────
  // Save Edit

  // ───────────────────────────────

const saveEdit = async () => {
  if (saving || uploading) return;
  setSaving(true);

  try {

const social_links = socialInputs

  .filter((s) => s.username)

  .map(

    (s) => `${SOCIAL_OPTIONS[s.platform]}${s.username}`

  )

  .join(",");

const payload = {

  ...editForm,

  social_links,

    additional_notes: editForm.additional_notes?.trim() || null, // ⭐ NEW

};

    const res = await axios.patch(

      `${API}/api/sponsors/${editingId}`,

      payload,

      { headers: { Authorization: `Bearer ${token}` } }

    );

setSponsors((prev) =>

  prev.map((s) =>

    s.id === editingId ? res.data.sponsor : s

  )

);

console.log("PATCH response:", res.data);

    toast.success("Sponsor updated");

    setEditingId(null);

  } catch (err) {

    toast.error(err.response?.data?.error || "Update failed");

  } finally { setSaving(false); }

};

const DELETE_PIN = "HPC2025";

  // ───────────────────────────────

  // Delete

  // ───────────────────────────────

const deleteSponsor = async (id) => {

  const pin = window.prompt(

    "Enter delete PIN to confirm removal of this sponsor:"

  );

  if (!pin) {

    toast.info("Delete cancelled");

    return;

  }

  if (pin !== DELETE_PIN) {

    toast.error("Incorrect PIN. Delete denied.");

    return;

  }

  if (!window.confirm("This action is permanent. Delete this sponsor inquiry?")) {

    return;

  }

  try {

    await axios.delete(

      `${API}/api/sponsors/${id}`,

      { headers: { Authorization: `Bearer ${token}` } }

    );

    setSponsors((prev) => prev.filter((s) => s.id !== id));

    toast.success("Sponsor inquiry deleted");

  } catch {

    toast.error("Failed to delete sponsor inquiry");

  }

};

  const locked = saving || uploading;
  const statusOptions = [...new Set([...STATUS_OPTIONS,...sponsors.map(s=>s.status).filter(Boolean)])];
  return <section className={`sp-panel${largeText ? " sp-large" : ""}`} aria-label="Sponsor inquiries"><style>{STYLES}</style>
    <header className="sp-header"><div><p className="sp-eyebrow">Community partnerships</p><h2>Sponsor inquiries <span>{sponsors.length}</span></h2><p>Manage relationships, sponsorship details, and next steps.</p></div><div className="sp-tools"><button type="button" aria-pressed={largeText} onClick={()=>setLargeText(v=>!v)}>A+ Larger text</button><button type="button" disabled={loading || locked || editingId !== null} onClick={fetchSponsors}>↻ Refresh</button></div></header>
    <div className="sp-toolbar"><label className="sp-search"><span>Search sponsors</span><input type="search" value={searchTerm} disabled={editingId !== null} onChange={e=>setSearchTerm(e.target.value)} placeholder="Organization, contact, email, or tier…"/></label><label className="sp-filter"><span>Status</span><select value={statusFilter} disabled={editingId !== null} onChange={e=>setStatusFilter(e.target.value)}><option value="all">All statuses</option>{statusOptions.map(opt=><option key={opt} value={opt}>{opt}</option>)}</select></label></div>
    <div className="sp-results" role="status">{editingId !== null ? "Save or cancel your edit to search and filter." : `${filteredSponsors.length} sponsors shown`}{(searchTerm || statusFilter!=="all") && editingId===null && <button type="button" onClick={()=>{setSearchTerm("");setStatusFilter("all");}}>Clear filters</button>}</div>
    {error ? <div className="sp-state" role="alert">{error}<button type="button" onClick={fetchSponsors}>Try again</button></div> : loading ? <div className="sp-state" role="status">Loading sponsor inquiries…</div> : !filteredSponsors.length ? <div className="sp-state"><strong>{sponsors.length ? "No matching sponsors" : "No sponsor inquiries yet"}</strong><p>{sponsors.length ? "Try another search or status." : "New inquiries will appear here."}</p></div> : <div className="sp-grid">{filteredSponsors.map(s=>{
      const colors = {pending:["#fff0d3","#805815"],contacted:["#dfedff","#315c94"],approved:["#def1e6","#296449"],declined:["#fbe1e8","#963955"],"Unpaid - Awaiting Payment":["#ffead9","#985022"]};
      const [wash,ink]=colors[s.status]||["#e9e2fa","#63458b"];
      return <article className={`sp-card${editingId===s.id ? " sp-editing" : ""}`} key={s.id} style={{"--sp-wash":wash,"--sp-ink":ink}}>
        <div className="sp-sponsor-heading"><SponsorLogo src={editingId===s.id ? editForm.logo_url : s.logo_url} name={s.organization}/><div><span className="sp-badge">{s.status || "pending"}</span><h3>{s.organization || "Unnamed organization"}</h3><p>{s.contact_name}</p></div></div>
        {editingId===s.id ? <form onSubmit={e=>{e.preventDefault();saveEdit();}}>
          <fieldset disabled={locked} className="sp-editor"><div className="sp-edit-fields">{[["organization","Organization"],["contact_name","Contact name"],["email","Email"],["phone","Phone"],["tier","Sponsorship tier"],["website","Website"]].map(([field,label])=><label key={field}><span>{label}</span><input autoFocus={field==="organization"} type={field==="email"?"email":field==="phone"?"tel":"text"} value={editForm[field]||""} onChange={e=>setEditForm({...editForm,[field]:e.target.value})}/></label>)}
          <label className="sp-wide"><span>Status</span><select value={editForm.status} onChange={e=>setEditForm({...editForm,status:e.target.value})}>{statusOptions.map(opt=><option key={opt} value={opt}>{opt}</option>)}</select></label>
          <label className="sp-check sp-wide"><input type="checkbox" checked={editForm.wants_booth} onChange={e=>setEditForm({...editForm,wants_booth:e.target.checked})}/>Booth requested</label>
          </div>
          <div className="sp-edit-section"><h4>Social media</h4>{socialInputs.map((item,idx)=><div className="sp-social-edit" key={idx}><label><span>{item.platform}</span><input value={item.username} placeholder="Username" onChange={e=>setSocialInputs(prev=>prev.map((x,i)=>i===idx?{...x,username:e.target.value}:x))}/></label><button type="button" className="sp-delete" aria-label={`Remove ${item.platform}`} onClick={()=>setSocialInputs(socialInputs.filter((_,i)=>i!==idx))}>Remove</button></div>)}<div className="sp-social-add">{Object.keys(SOCIAL_OPTIONS).filter(p=>!socialInputs.some(s=>s.platform===p)).map(platform=><button type="button" key={platform} onClick={()=>setSocialInputs([...socialInputs,{platform,username:""}])}>+ {platform}</button>)}</div></div>
          <div className="sp-edit-fields sp-edit-section"><label className="sp-wide"><span>Upload logo</span><input type="file" accept="image/*" onChange={handleLogoUpload}/></label><label className="sp-wide"><span>Or paste a logo URL</span><input value={editForm.logo_url || ""} onChange={handleLogoUrlChange}/></label>{[["message","Message"],["additional_notes","Additional notes"]].map(([field,label])=><label className="sp-wide" key={field}><span>{label}</span><textarea rows={4} value={editForm[field]||""} onChange={e=>setEditForm({...editForm,[field]:e.target.value})}/></label>)}</div></fieldset>
          <footer className="sp-actions"><button type="submit" className="sp-primary" disabled={locked}>{uploading?"Uploading…":saving?"Saving…":"Save changes"}</button><button type="button" disabled={locked} onClick={()=>setEditingId(null)}>Cancel</button></footer>
        </form> : <>
          <div className="sp-reach">{s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}{s.phone && <a href={`tel:${String(s.phone).replace(/[^+\d]/g,"")}`}>{s.phone}</a>}</div>
          <div className="sp-facts"><span><small>Tier</small><strong>{s.tier||"Not specified"}</strong></span><span><small>Booth</small><strong>{hasBooth(s.wants_booth)?"Requested":"Not requested"}</strong></span></div>
          {(s.message || s.additional_notes) && <div className="sp-message" role="region" tabIndex={0} aria-label={`Message and notes for ${s.organization}`}><p>{s.message}</p>{s.additional_notes && <p><strong>Notes</strong><br/>{s.additional_notes}</p>}</div>}
          <footer className="sp-actions"><button type="button" onClick={()=>setSelectedSponsor(s)}>View details</button><button type="button" className="sp-primary" disabled={editingId!==null} onClick={()=>openEdit(s)}>Edit</button><button type="button" className="sp-delete" disabled={editingId!==null} onClick={()=>deleteSponsor(s.id)}>Delete</button></footer>
        </>}
      </article>;
    })}</div>}
    {selectedSponsor && <SponsorDialog sponsor={selectedSponsor} largeText={largeText} onClose={()=>setSelectedSponsor(null)}/>}
  </section>;
}

function hasBooth(value){return value===true || value===1 || value==="1" || value==="true";}
function safeLink(value){try{const raw=String(value||"").trim();if(!raw)return "";const url=new URL(/^[a-z][a-z\d+.-]*:/i.test(raw)?raw:`https://${raw}`);return ["https:","http:"].includes(url.protocol)?url.href:"";}catch{return "";}}
function SponsorLogo({src,name}){const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[src]);return src&&!failed?<img className="sp-logo" src={src} alt={`${name||"Sponsor"} logo`} loading="lazy" onError={()=>setFailed(true)}/>:<span className="sp-logo sp-logo-fallback" aria-hidden="true">{(name||"S").slice(0,1).toUpperCase()}</span>;}
function SponsorDialog({sponsor:s,largeText,onClose}){
  const panel=useRef(null),close=useRef(null),callback=useRef(onClose),titleId=useId();callback.current=onClose;
  useEffect(()=>{const prior=document.activeElement,overflow=document.body.style.overflow;document.body.style.overflow="hidden";const background=Array.from(document.body.children).filter(node=>!node.contains(panel.current)).map(node=>[node,node.inert]);background.forEach(([node])=>{node.inert=true;});close.current?.focus();const key=e=>{if(e.key==="Escape"){e.preventDefault();callback.current();}if(e.key!=="Tab")return;const nodes=Array.from(panel.current.querySelectorAll('button,a[href],[tabindex="0"]')).filter(n=>n.getClientRects().length);const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}};document.addEventListener("keydown",key);return()=>{document.body.style.overflow=overflow;background.forEach(([node,inert])=>{node.inert=inert;});document.removeEventListener("keydown",key);if(prior?.isConnected)prior.focus?.();};},[]);
  return createPortal(<div className={`sp-panel sp-overlay${largeText?" sp-large":""}`} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><section className="sp-dialog" ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId}><header><h2 id={titleId}>{s.organization}</h2><button ref={close} type="button" onClick={onClose} aria-label="Close sponsor details">✕</button></header><div className="sp-dialog-body"><div className="sp-sponsor-heading"><SponsorLogo src={s.logo_url} name={s.organization}/><div><h3>{s.contact_name}</h3><div className="sp-reach">{s.email&&<a href={`mailto:${s.email}`}>{s.email}</a>}{s.phone&&<a href={`tel:${String(s.phone).replace(/[^+\d]/g,"")}`}>{s.phone}</a>}</div></div></div><div className="sp-facts"><span><small>Tier</small><strong>{s.tier||"—"}</strong></span><span><small>Status</small><strong>{s.status||"pending"}</strong></span><span><small>Booth</small><strong>{hasBooth(s.wants_booth)?"Requested":"Not requested"}</strong></span></div><div className="sp-external">{safeLink(s.website)&&<a href={safeLink(s.website)} target="_blank" rel="noopener noreferrer">Visit website ↗</a>}{String(s.social_links||"").split(",").map(x=>x.trim()).filter(x=>safeLink(x)).map((url,i)=><a key={i} href={safeLink(url)} target="_blank" rel="noopener noreferrer">{url.includes("instagram.com")?"Instagram":url.includes("facebook.com")?"Facebook":"Social profile"} ↗</a>)}</div>{[["Message",s.message],["Additional notes",s.additional_notes]].filter(([,text])=>text).map(([label,text])=><div className="sp-detail-copy" key={label}><h3>{label}</h3><p>{text}</p></div>)}</div></section></div>,document.body);
}

const STYLES = `
.sp-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;color:#392f43;border:1px solid #ded5e5;border-radius:12px;font:14px/1.55 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.sp-panel *{box-sizing:border-box}.sp-panel :is(h2,h3,p){margin:0}.sp-panel :is(button,input,select,textarea){font:inherit}.sp-panel button{min-height:44px;padding:9px 13px;border:1px solid #d4c6df;border-radius:7px;background:#fff;color:#564263;font-weight:650;cursor:pointer;transition:background .18s}.sp-panel button:hover:not(:disabled){background:#f0e8f7}.sp-panel button:disabled{opacity:.5;cursor:not-allowed}.sp-panel :is(button,a,input,select,textarea,[tabindex]):focus-visible{outline:3px solid #795394;outline-offset:3px}.sp-panel :is(input,select,textarea){width:100%;min-width:0;min-height:44px;border:1px solid #cfc3d9;border-radius:7px;background:#fff;color:#392f43;padding:9px 11px;font-size:16px}.sp-panel textarea{resize:vertical;min-height:140px}.sp-header{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:18px}.sp-eyebrow{font-size:10px;font-weight:750;letter-spacing:1.4px;text-transform:uppercase;color:#77538b}.sp-header h2{display:flex;align-items:center;flex-wrap:wrap;gap:9px;font-size:clamp(20px,2.5vw,27px);letter-spacing:-.6px;font-weight:750;line-height:1.3;margin:5px 0}.sp-header h2>span{font-size:12px;letter-spacing:0;padding:3px 8px;border-radius:20px;background:#e9def1;color:#68477c}.sp-header>div>p:last-child{font-size:12px;color:#74647e}.sp-tools{display:flex;gap:7px;flex-shrink:0}.sp-tools button{font-size:12px}.sp-tools button[aria-pressed=true]{background:#77518a;color:#fff;border-color:#77518a}.sp-toolbar{display:flex;gap:12px;align-items:end}.sp-toolbar label>span,.sp-edit-fields label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#695575}.sp-search{flex:1;min-width:0}.sp-filter{width:195px;flex-shrink:0}.sp-results{display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:42px;font-size:11px;color:#73627e}.sp-results button{font-size:11px;border:0;background:none;text-decoration:underline;padding:4px;min-height:36px}.sp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:13px;align-items:start}.sp-card{min-width:0;display:flex;flex-direction:column;background:#fff;border:1px solid #ded6e5;border-top:3px solid var(--sp-ink);border-radius:10px;padding:16px;box-shadow:0 4px 15px #4c335a08}.sp-card-top{display:flex;align-items:center;gap:11px}.sp-avatar{width:42px;height:42px;flex-shrink:0;display:grid;place-items:center;background:var(--sp-wash);color:var(--sp-ink);font-weight:800;border-radius:12px;font-size:14px}.sp-person{min-width:0}.sp-card h3{font-size:16px;font-weight:750;line-height:1.35;overflow-wrap:anywhere}.sp-badge{display:inline-block;font-size:10px;font-weight:750;padding:2px 8px;border-radius:20px;background:var(--sp-wash);color:var(--sp-ink);margin-top:4px}.sp-reach{display:flex;flex-direction:column;gap:2px;margin:10px 0;min-width:0}.sp-reach a{font-size:13px;color:#65507e;text-underline-offset:3px;overflow-wrap:anywhere;min-height:28px;display:flex;align-items:center}.sp-message{max-height:145px;overflow-y:auto;min-height:75px;padding:11px 12px;background:#f8f6fa;border:1px solid #e9e2ed;border-radius:6px;font-size:13px;line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere;scrollbar-width:thin;scrollbar-color:#b19bbd #f1ebf5}.sp-status-control{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px}.sp-status-control>span{font-size:11px;font-weight:650;color:#74617f}.sp-status-control select{width:155px;font-size:14px;background:var(--sp-wash);color:var(--sp-ink);border-color:transparent;font-weight:650}.sp-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid #eee7f1}.sp-actions button{font-size:12px}.sp-panel .sp-primary{background:#77518a;color:#fff;border-color:#77518a}.sp-panel .sp-primary:hover:not(:disabled){background:#603d73}.sp-panel .sp-delete{margin-left:auto;background:#fff;color:#9b3d57;border-color:#ead5dc}.sp-panel .sp-delete:hover:not(:disabled){background:#fbeaf0}.sp-actions>span{font-size:11px;color:#745181}.sp-edit-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px}.sp-editing{box-shadow:0 0 0 2px #ad91bd}.sp-edit-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.sp-wide{grid-column:1/-1}.sp-state{padding:35px 16px;text-align:center;border:1px dashed #cdbed8;border-radius:9px;background:#fff;color:#6f5b7b}.sp-state strong{display:block;color:#4f3a5c;font-size:17px;margin-bottom:5px}.sp-state button{display:block;margin:13px auto 0}.sp-error{color:#963955;background:#fff6f8}.sp-large .sp-message{font-size:18px}.sp-large .sp-reach a{font-size:16px}.sp-large .sp-card h3{font-size:19px}
@media(max-width:700px){.sp-header{align-items:flex-start;flex-direction:column;gap:10px}.sp-tools{width:100%}.sp-tools button{flex:1}.sp-toolbar{flex-wrap:wrap;gap:9px}.sp-search{flex-basis:100%}.sp-filter{width:100%}.sp-panel{padding:12px}.sp-card{padding:14px}.sp-edit-fields{grid-template-columns:1fr}.sp-panel .sp-status-control select{font-size:16px}}
@media(prefers-reduced-motion:reduce){.sp-panel *{transition:none!important}}

.sp-grid{grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr))}.sp-sponsor-heading{display:flex;align-items:center;gap:13px;margin-bottom:12px}.sp-sponsor-heading>div{min-width:0}.sp-sponsor-heading h3{margin-top:5px}.sp-sponsor-heading p{font-size:12px;color:#72607d}.sp-logo{width:68px;height:68px;object-fit:contain;flex-shrink:0;border:1px solid #e0d6e7;padding:7px;border-radius:9px;background:#fff}.sp-logo-fallback{display:grid;place-items:center;font-size:25px;color:#886492;background:#f1e9f6}.sp-badge{text-transform:capitalize}.sp-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:10px 0;padding:10px;background:#f8f4fa;border-radius:6px}.sp-facts span{min-width:0}.sp-facts small{display:block;font-size:10px;color:#786282}.sp-facts strong{font-size:12px;font-weight:650;overflow-wrap:anywhere;text-transform:capitalize}.sp-message p+p{margin-top:10px}.sp-editor{padding:0;margin:0;border:0;min-width:0}.sp-edit-section{border-top:1px solid #e9e0ee;padding-top:14px;margin-top:14px}.sp-edit-section h4{font-size:12px;margin:0 0 8px}.sp-social-edit{display:flex;align-items:end;gap:8px;margin-bottom:9px}.sp-social-edit label{flex:1;min-width:0}.sp-social-edit label span{display:block;font-size:11px;text-transform:capitalize;margin-bottom:4px}.sp-social-add{display:flex;flex-wrap:wrap;gap:7px}.sp-social-add button{font-size:12px;text-transform:capitalize}.sp-panel .sp-check{display:flex;align-items:center;gap:9px;font-size:13px}.sp-panel .sp-check input{width:20px;min-height:20px;accent-color:#79518d}.sp-panel input[type=file]{font-size:12px;padding:10px 6px}.sp-panel.sp-overlay{position:fixed;inset:0;z-index:2500;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#2c1d3ab3;border:0;border-radius:0;padding:16px;backdrop-filter:blur(5px)}.sp-dialog{display:flex;flex-direction:column;width:100%;max-width:650px;max-height:92vh;max-height:92dvh;background:#fff;border:1px solid #d7c7e1;border-top:4px solid #a282b2;border-radius:12px;box-shadow:0 20px 70px #170c3433;overflow:hidden}.sp-dialog>header{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 18px;border-bottom:1px solid #e8dfed}.sp-dialog h2{font-size:20px;line-height:1.3;overflow-wrap:anywhere}.sp-dialog>header button{flex-shrink:0}.sp-dialog-body{padding:18px;overflow-y:auto;min-height:0;overscroll-behavior:contain}.sp-external{display:flex;flex-wrap:wrap;gap:8px 17px}.sp-external a{min-height:44px;display:inline-flex;align-items:center;color:#725080;font-size:13px;text-underline-offset:4px}.sp-detail-copy{margin-top:16px;padding-top:14px;border-top:1px solid #e8dfed}.sp-detail-copy h3{font-size:12px;color:#725982;margin-bottom:6px}.sp-detail-copy p{font-size:14px;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.8}.sp-large .sp-detail-copy p{font-size:18px}@media(max-width:480px){.sp-panel.sp-overlay{padding:10px}.sp-dialog-body{padding:14px}.sp-dialog h2{font-size:18px}}
`;
