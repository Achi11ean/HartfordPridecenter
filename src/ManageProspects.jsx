import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API = "https://singspacebackend.onrender.com";
const STATUS_OPTIONS = ["new", "contacted", "interested", "follow_up", "converted", "not_interested", "closed"];
const LABELS = { new: "New", contacted: "Contacted", interested: "Interested", follow_up: "Follow up", converted: "Converted", not_interested: "Not interested", closed: "Closed" };
const COLORS = { new: ["#eee2fa", "#73458b"], contacted: ["#dfedff", "#315c94"], interested: ["#def1e6", "#296449"], follow_up: ["#fff0d3", "#805815"], converted: ["#d9f0ec", "#236459"], not_interested: ["#fbe1e8", "#963955"], closed: ["#ecebf0", "#625d70"] };

export default function ManageProspects({ onConvert }) {
  const [{ token, prideId }] = useState(() => {
    try { const admin = JSON.parse(localStorage.getItem("prideUser") || "{}"); return { token: localStorage.getItem("prideToken"), prideId: admin?.pride_id }; }
    catch { return { token: null, prideId: null }; }
  });
  const [prospects, setProspects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [largeText, setLargeText] = useState(false);
  const fetchProspects = useCallback(async (signal) => {
    if (!token || !prideId) { setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.get(`${API}/api/sponsor-prospects?pride_id=${prideId}`, { headers: { Authorization: `Bearer ${token}` }, signal });
      if (!signal?.aborted) setProspects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.code !== "ERR_CANCELED") { setError("Couldn't load prospects. Please try again."); toast.error("Failed to load prospects"); }
    } finally { if (!signal?.aborted) setLoading(false); }
  }, [token, prideId]);
  useEffect(() => { const controller = new AbortController(); fetchProspects(controller.signal); return () => controller.abort(); }, [fetchProspects]);
  const saveEdit = async () => {
    if (busy || !editing) return;
    setBusy(true);
    try {
      await axios.patch(`${API}/api/sponsor-prospects/${editing.id}`, editing, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Prospect updated"); setEditing(null); await fetchProspects();
    } catch { toast.error("Update failed"); }
    finally { setBusy(false); }
  };
  const deleteProspect = async id => {
    if (busy || !window.confirm("Delete this prospect?")) return;
    setBusy(true);
    try {
      await axios.delete(`${API}/api/sponsor-prospects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Prospect deleted"); await fetchProspects();
    } catch { toast.error("Delete failed"); }
    finally { setBusy(false); }
  };
  const convertToSponsor = p => {
    try {
      localStorage.setItem("pendingSponsorProspect", JSON.stringify({ organization: p.organization, contact_name: p.contact_name, email: p.contact_email, phone: p.contact_phone, message: p.notes }));
    } catch { toast.error("Couldn't prepare the sponsor form. Please try again."); return; }
    if (onConvert) onConvert();
    else toast.success("Details prepared. Open the sponsor form to continue.");
  };
  const filtered = prospects.filter(p => (filter === "all" || (p.status || "new") === filter) && [p.organization,p.contact_name,p.contact_email,p.contact_phone,p.notes].some(value => String(value || "").toLowerCase().includes(query.trim().toLowerCase())));
  return <section className={`mp-panel${largeText ? " mp-large" : ""}`} aria-label="Sponsor prospects"><style>{STYLES}</style>
    <header className="mp-header"><div><p className="mp-eyebrow">Grow community partnerships</p><h2>Sponsor prospects <span>{prospects.length}</span></h2><p>Track conversations and turn interest into support.</p></div><div className="mp-tools"><button type="button" aria-pressed={largeText} onClick={()=>setLargeText(v=>!v)}>A+ Larger text</button><button type="button" disabled={busy || loading || !token || !prideId} onClick={()=>fetchProspects()}>{loading?"Refreshing…":"↻ Refresh"}</button></div></header>
    <div className="mp-toolbar"><label className="mp-search"><span>Search prospects</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Organization, contact, email, or notes…"/></label><label className="mp-filter"><span>Status</span><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All statuses</option>{STATUS_OPTIONS.map(status=><option key={status} value={status}>{LABELS[status]}</option>)}</select></label></div>
    <div className="mp-results" role="status">{filtered.length} prospects shown{(query || filter!=="all")&&<button type="button" onClick={()=>{setQuery("");setFilter("all");}}>Clear filters</button>}</div>
    {!token || !prideId ? <div className="mp-state">Sign in to a Pride account to view prospects.</div> : error ? <div className="mp-state" role="alert">{error}<button type="button" onClick={()=>fetchProspects()}>Try again</button></div> : loading && !prospects.length ? <div className="mp-state" role="status">Loading sponsor prospects…</div> : !filtered.length ? <div className="mp-state"><strong>{prospects.length?"No matching prospects":"No prospects yet"}</strong><p>{prospects.length?"Try another search or status.":"Your sponsor prospects will appear here."}</p></div> : <div className="mp-grid" aria-busy={loading}>{filtered.map(p=>{
      const [wash,ink]=COLORS[p.status]||COLORS.new;
      return <article key={p.id} className="mp-card" style={{"--mp-wash":wash,"--mp-ink":ink}}>
        <div className="mp-card-top"><span className="mp-avatar" aria-hidden="true">{(p.organization||"P").slice(0,1).toUpperCase()}</span><div className="mp-person"><h3>{p.organization||"Unnamed organization"}</h3><span className="mp-badge">{LABELS[p.status]||p.status||"New"}</span></div></div>
        <p className="mp-contact-name">{p.contact_name||"No contact name"}</p><div className="mp-reach">{p.contact_email&&<a href={`mailto:${p.contact_email}`}>{p.contact_email}</a>}{p.contact_phone&&<a href={`tel:${String(p.contact_phone).replace(/[^+\d]/g,"")}`}>{p.contact_phone}</a>}</div>
        <div className="mp-notes-label">Conversation notes</div><div className="mp-message" role="region" tabIndex={0} aria-label={`Notes for ${p.organization||"prospect"}`}>{p.notes||"No notes yet. Add a conversation update when you edit."}</div>
        <footer className="mp-actions"><button type="button" disabled={busy||loading} onClick={()=>setEditing({...p})}>Edit</button><button type="button" className="mp-primary" disabled={busy||loading} onClick={()=>convertToSponsor(p)}>+ Add Sponsor</button><button type="button" className="mp-delete" disabled={busy||loading} onClick={()=>deleteProspect(p.id)}>Delete</button></footer>
      </article>;
    })}</div>}
    {editing && <ProspectEditor editing={editing} setEditing={setEditing} busy={busy} onSave={saveEdit} onClose={()=>setEditing(null)}/>}
  </section>;
}

function ProspectEditor({editing,setEditing,busy,onSave,onClose}) {
  const panel=useRef(null), first=useRef(null), callback=useRef(onClose),busyRef=useRef(busy),title=useId();callback.current=onClose;busyRef.current=busy;
  useEffect(()=>{
    const prior=document.activeElement,overflow=document.body.style.overflow;
    const background=Array.from(document.body.children).filter(node=>!node.contains(panel.current)).map(node=>[node,node.inert]);background.forEach(([node])=>{node.inert=true;});document.body.style.overflow="hidden";first.current?.focus();
    const key=e=>{if(e.key==="Escape"&&!busyRef.current){e.preventDefault();callback.current();}if(e.key!=="Tab")return;const nodes=Array.from(panel.current.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled)')).filter(node=>node.getClientRects().length);if(!nodes.length){e.preventDefault();panel.current.focus();return;}const a=nodes[0],b=nodes[nodes.length-1];if(e.shiftKey&&(document.activeElement===a||!nodes.includes(document.activeElement))){e.preventDefault();b.focus();}else if(!e.shiftKey&&(document.activeElement===b||!nodes.includes(document.activeElement))){e.preventDefault();a.focus();}};
    document.addEventListener("keydown",key);return()=>{document.removeEventListener("keydown",key);document.body.style.overflow=overflow;background.forEach(([node,inert])=>{node.inert=inert;});if(prior?.isConnected)prior.focus?.({preventScroll:true});};
  },[]);
  return createPortal(<div className="mp-panel mp-overlay" onClick={e=>{if(e.target===e.currentTarget&&!busy)onClose();}}><section ref={panel} className="mp-dialog" role="dialog" aria-modal="true" aria-labelledby={title} tabIndex={-1}><header><div><p className="mp-eyebrow">Sponsor prospect</p><h2 id={title}>Edit prospect</h2></div><button type="button" disabled={busy} onClick={onClose} aria-label="Close prospect editor">✕</button></header><form onSubmit={e=>{e.preventDefault();onSave();}} aria-busy={busy}><div className="mp-dialog-body"><fieldset disabled={busy} className="mp-edit-fields">{[["organization","Organization","text"],["contact_name","Contact name","text"],["contact_email","Email","email"],["contact_phone","Phone","tel"]].map(([field,label,type],i)=><label key={field}><span>{label}</span><input ref={i===0?first:undefined} type={type} value={editing[field]||""} onChange={e=>setEditing(prev=>({...prev,[field]:e.target.value}))}/></label>)}<label className="mp-wide"><span>Status</span><select value={editing.status||"new"} onChange={e=>setEditing(prev=>({...prev,status:e.target.value}))}>{STATUS_OPTIONS.map(s=><option key={s} value={s}>{LABELS[s]}</option>)}</select></label><label className="mp-wide"><span>Conversation notes</span><textarea rows={6} value={editing.notes||""} onChange={e=>setEditing(prev=>({...prev,notes:e.target.value}))} placeholder="Capture the conversation and next steps…"/></label></fieldset></div><footer className="mp-dialog-actions"><button type="button" disabled={busy} onClick={onClose}>Cancel</button><button type="submit" className="mp-primary" disabled={busy}>{busy?"Saving…":"Save changes"}</button></footer></form></section></div>,document.body);
}

const STYLES = `
.mp-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;color:#392f43;border:1px solid #ded5e5;border-radius:12px;font:14px/1.55 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.mp-panel *{box-sizing:border-box}.mp-panel :is(h2,h3,p){margin:0}.mp-panel :is(button,input,select,textarea){font:inherit}.mp-panel button{min-height:44px;padding:9px 13px;border:1px solid #d4c6df;border-radius:7px;background:#fff;color:#564263;font-weight:650;cursor:pointer;transition:background .18s}.mp-panel button:hover:not(:disabled){background:#f0e8f7}.mp-panel button:disabled{opacity:.5;cursor:not-allowed}.mp-panel :is(button,a,input,select,textarea,[tabindex]):focus-visible{outline:3px solid #795394;outline-offset:3px}.mp-panel :is(input,select,textarea){width:100%;min-width:0;min-height:44px;border:1px solid #cfc3d9;border-radius:7px;background:#fff;color:#392f43;padding:9px 11px;font-size:16px}.mp-panel textarea{resize:vertical;min-height:140px}.mp-header{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:18px}.mp-eyebrow{font-size:10px;font-weight:750;letter-spacing:1.4px;text-transform:uppercase;color:#77538b}.mp-header h2{display:flex;align-items:center;flex-wrap:wrap;gap:9px;font-size:clamp(20px,2.5vw,27px);letter-spacing:-.6px;font-weight:750;line-height:1.3;margin:5px 0}.mp-header h2>span{font-size:12px;letter-spacing:0;padding:3px 8px;border-radius:20px;background:#e9def1;color:#68477c}.mp-header>div>p:last-child{font-size:12px;color:#74647e}.mp-tools{display:flex;gap:7px;flex-shrink:0}.mp-tools button{font-size:12px}.mp-tools button[aria-pressed=true]{background:#77518a;color:#fff;border-color:#77518a}.mp-toolbar{display:flex;gap:12px;align-items:end}.mp-toolbar label>span,.mp-edit-fields label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#695575}.mp-search{flex:1;min-width:0}.mp-filter{width:195px;flex-shrink:0}.mp-results{display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:42px;font-size:11px;color:#73627e}.mp-results button{font-size:11px;border:0;background:none;text-decoration:underline;padding:4px;min-height:36px}.mp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:13px;align-items:start}.mp-card{min-width:0;display:flex;flex-direction:column;background:#fff;border:1px solid #ded6e5;border-top:3px solid var(--mp-ink);border-radius:10px;padding:16px;box-shadow:0 4px 15px #4c335a08}.mp-card-top{display:flex;align-items:center;gap:11px}.mp-avatar{width:42px;height:42px;flex-shrink:0;display:grid;place-items:center;background:var(--mp-wash);color:var(--mp-ink);font-weight:800;border-radius:12px;font-size:14px}.mp-person{min-width:0}.mp-card h3{font-size:16px;font-weight:750;line-height:1.35;overflow-wrap:anywhere}.mp-badge{display:inline-block;font-size:10px;font-weight:750;padding:2px 8px;border-radius:20px;background:var(--mp-wash);color:var(--mp-ink);margin-top:4px}.mp-reach{display:flex;flex-direction:column;gap:2px;margin:10px 0;min-width:0}.mp-reach a{font-size:13px;color:#65507e;text-underline-offset:3px;overflow-wrap:anywhere;min-height:28px;display:flex;align-items:center}.mp-message{max-height:145px;overflow-y:auto;min-height:75px;padding:11px 12px;background:#f8f6fa;border:1px solid #e9e2ed;border-radius:6px;font-size:13px;line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere;scrollbar-width:thin;scrollbar-color:#b19bbd #f1ebf5}.mp-status-control{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px}.mp-status-control>span{font-size:11px;font-weight:650;color:#74617f}.mp-status-control select{width:155px;font-size:14px;background:var(--mp-wash);color:var(--mp-ink);border-color:transparent;font-weight:650}.mp-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid #eee7f1}.mp-actions button{font-size:12px}.mp-panel .mp-primary{background:#77518a;color:#fff;border-color:#77518a}.mp-panel .mp-primary:hover:not(:disabled){background:#603d73}.mp-panel .mp-delete{margin-left:auto;background:#fff;color:#9b3d57;border-color:#ead5dc}.mp-panel .mp-delete:hover:not(:disabled){background:#fbeaf0}.mp-actions>span{font-size:11px;color:#745181}.mp-edit-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px}.mp-editing{box-shadow:0 0 0 2px #ad91bd}.mp-edit-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mp-wide{grid-column:1/-1}.mp-state{padding:35px 16px;text-align:center;border:1px dashed #cdbed8;border-radius:9px;background:#fff;color:#6f5b7b}.mp-state strong{display:block;color:#4f3a5c;font-size:17px;margin-bottom:5px}.mp-state button{display:block;margin:13px auto 0}.mp-error{color:#963955;background:#fff6f8}.mp-large .mp-message{font-size:18px}.mp-large .mp-reach a{font-size:16px}.mp-large .mp-card h3{font-size:19px}
@media(max-width:700px){.mp-header{align-items:flex-start;flex-direction:column;gap:10px}.mp-tools{width:100%}.mp-tools button{flex:1}.mp-toolbar{flex-wrap:wrap;gap:9px}.mp-search{flex-basis:100%}.mp-filter{width:100%}.mp-panel{padding:12px}.mp-card{padding:14px}.mp-edit-fields{grid-template-columns:1fr}.mp-panel .mp-status-control select{font-size:16px}}
@media(prefers-reduced-motion:reduce){.mp-panel *{transition:none!important}}

.mp-contact-name{font-size:13px;color:#65516f;margin-top:11px!important}.mp-notes-label{font-size:10px;font-weight:750;letter-spacing:.8px;text-transform:uppercase;color:#796283;margin:8px 0 6px}.mp-grid{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}.mp-panel.mp-overlay{position:fixed;inset:0;z-index:2500;display:flex;align-items:center;justify-content:center;width:100%;height:100%;padding:16px;border:0;border-radius:0;background:#2c1d3ab3;backdrop-filter:blur(5px)}.mp-dialog{display:flex;flex-direction:column;width:100%;max-width:600px;max-height:92vh;max-height:92dvh;background:#fff;border:1px solid #d9c9e3;border-top:4px solid #a888b7;border-radius:12px;box-shadow:0 20px 70px #190b3433;overflow:hidden}.mp-dialog>header{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:14px 18px;border-bottom:1px solid #e8dfed}.mp-dialog h2{font-size:21px;line-height:1.3;margin-top:4px}.mp-dialog>form{display:flex;flex-direction:column;min-height:0}.mp-dialog-body{overflow-y:auto;min-height:0;padding:18px;overscroll-behavior:contain}.mp-dialog fieldset{margin:0;padding:0;border:0;min-width:0}.mp-dialog-actions{display:flex;justify-content:flex-end;gap:9px;padding:13px 18px;border-top:1px solid #e8dfed;background:#faf7fc}.mp-large .mp-contact-name{font-size:16px}@media(max-width:480px){.mp-panel.mp-overlay{padding:10px}.mp-dialog-body{padding:14px}.mp-dialog-actions button{flex:1}.mp-actions button{padding-inline:10px}}
`;
