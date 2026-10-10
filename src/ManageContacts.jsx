import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";
const STATUS_OPTIONS = ["new", "contacted", "in_progress", "resolved", "closed", "flagged"];
const LABELS = { new: "New", contacted: "Contacted", in_progress: "In progress", resolved: "Resolved", closed: "Closed", flagged: "Flagged" };
const COLORS = { new: ["#e9e2fa", "#63458b"], contacted: ["#dfedff", "#315c94"], in_progress: ["#fff0d3", "#805815"], resolved: ["#def1e6", "#296449"], closed: ["#ecebf0", "#625d70"], flagged: ["#fbe1e8", "#963955"] };

export default function ManageContacts() {
  const { token, prideId } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [busy, setBusy] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [largeText, setLargeText] = useState(false);

  const fetchContacts = useCallback(async (signal) => {
    if (!token || !prideId) { setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.get(`${API}/api/pride/${prideId}/contacts`, { headers: { Authorization: `Bearer ${token}` }, signal });
      if (!signal?.aborted) setContacts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.code !== "ERR_CANCELED") { setError("Couldn't load contacts. Please try again."); toast.error("Failed to load contacts"); }
    } finally { if (!signal?.aborted) setLoading(false); }
  }, [token, prideId]);
  useEffect(() => {
    const controller = new AbortController();
    setContacts([]); setEditingId(null); setEditForm({});
    fetchContacts(controller.signal);
    return () => controller.abort();
  }, [fetchContacts]);

  const startEdit = contact => { setEditingId(contact.id); setEditForm({ ...contact }); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };
  const saveEdit = async id => {
    if (busy !== null) return;
    setBusy(id);
    try {
      await axios.patch(`${API}/api/pride/contact/${id}`, editForm, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Contact updated"); cancelEdit(); await fetchContacts();
    } catch { toast.error("Failed to update contact"); }
    finally { setBusy(null); }
  };
  const updateStatus = async (id, status) => {
    if (busy !== null) return;
    setBusy(id);
    try {
      await axios.patch(`${API}/api/pride/contacts/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Status updated"); await fetchContacts();
    } catch { toast.error("Failed to update status"); }
    finally { setBusy(null); }
  };
  const deleteContact = async id => {
    if (busy !== null || !window.confirm("Delete this contact permanently?")) return;
    setBusy(id);
    try {
      await axios.delete(`${API}/api/pride/contact/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Contact deleted"); await fetchContacts();
    } catch { toast.error("Failed to delete contact"); }
    finally { setBusy(null); }
  };
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return contacts.filter(c => (filter === "all" || (c.status || "new") === filter) && (!term || [c.name, c.email, c.phone, c.message].some(value => String(value || "").toLowerCase().includes(term))));
  }, [contacts, query, filter]);
  const counts = useMemo(() => contacts.reduce((acc, c) => { const key = c.status || "new"; acc[key] = (acc[key] || 0) + 1; return acc; }, {}), [contacts]);
  const options = STATUS_OPTIONS.map(status => <option key={status} value={status}>{LABELS[status]}</option>);
  const locked = busy !== null || loading;

  return <section className={`mc-panel${largeText ? " mc-large" : ""}`} aria-label="Manage contact submissions">
    <style>{STYLES}</style>
    <header className="mc-header"><div><p className="mc-eyebrow">Community inbox</p><h2>Contact submissions <span>{contacts.length}</span></h2><p>Read, respond, and keep every conversation moving.</p></div><div className="mc-tools"><button type="button" aria-pressed={largeText} onClick={() => setLargeText(v => !v)}>A+ <span>Larger text</span></button><button type="button" disabled={locked || !token || !prideId || editingId !== null} onClick={() => fetchContacts()}>{loading ? "Refreshing…" : "↻ Refresh"}</button></div></header>
    <div className="mc-toolbar"><label className="mc-search"><span>Search contacts</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Name, email, phone, or message…" disabled={editingId !== null}/></label><label className="mc-filter"><span>Status</span><select value={filter} onChange={e => setFilter(e.target.value)} disabled={editingId !== null}><option value="all">All statuses ({contacts.length})</option>{STATUS_OPTIONS.map(status => <option key={status} value={status}>{LABELS[status]} ({counts[status] || 0})</option>)}</select></label></div>
    <div className="mc-results" role="status">{editingId !== null ? "Finish or cancel your edit to search and filter." : `${filtered.length} ${filtered.length === 1 ? "contact" : "contacts"} shown`}{(query || filter !== "all") && editingId === null && <button type="button" onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</button>}</div>
    {!token || !prideId ? <div className="mc-state">Sign in to a Pride account to view contacts.</div> : error ? <div className="mc-state mc-error" role="alert">{error}<button type="button" onClick={() => fetchContacts()}>Try again</button></div> : loading && !contacts.length ? <div className="mc-state" role="status">Loading community contacts…</div> : !filtered.length ? <div className="mc-state"><strong>{contacts.length ? "No matching contacts" : "Your inbox is ready"}</strong><p>{contacts.length ? "Try another search or status." : "New contact submissions will appear here."}</p></div> : <div className="mc-grid" aria-busy={loading}>
      {filtered.map(c => {
        const status = c.status || "new";
        const [wash, ink] = COLORS[status] || COLORS.new;
        const editing = editingId === c.id;
        return <article key={c.id} className={`mc-card${editing ? " mc-editing" : ""}`} style={{ "--mc-wash": wash, "--mc-ink": ink }} aria-label={`Contact from ${c.name || "Unnamed contact"}`}>
          {editing ? <form onSubmit={e => { e.preventDefault(); saveEdit(c.id); }}>
            <div className="mc-edit-head"><h3>Edit contact</h3><span className="mc-badge">{LABELS[status] || status}</span></div>
            <div className="mc-edit-fields">{[["name", "Name", "text"], ["email", "Email", "email"], ["phone", "Phone", "tel"]].map(([key, label, type]) => <label key={key}><span>{label}</span><input autoFocus={key === "name"} type={type} value={editForm[key] || ""} disabled={locked} onChange={e => setEditForm(prev => ({ ...prev, [key]: e.target.value }))}/></label>)}<label><span>Status</span><select value={editForm.status || "new"} disabled={locked} onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value }))}>{options}</select></label><label className="mc-wide"><span>Message</span><textarea rows={6} value={editForm.message || ""} disabled={locked} onChange={e => setEditForm(prev => ({ ...prev, message: e.target.value }))}/></label></div>
            <footer className="mc-actions"><button className="mc-primary" type="submit" disabled={locked}>{busy === c.id ? "Saving…" : "Save changes"}</button><button type="button" disabled={locked} onClick={cancelEdit}>Cancel</button></footer>
          </form> : <>
            <div className="mc-card-top"><span className="mc-avatar" aria-hidden="true">{(c.name || "?").trim().split(/\s+/).slice(0,2).map(word => word[0]).join("").toUpperCase()}</span><div className="mc-person"><h3>{c.name || "Unnamed contact"}</h3><span className="mc-badge">{LABELS[status] || status}</span></div></div>
            <div className="mc-reach">{c.email && <a href={`mailto:${c.email}`} title={`Email ${c.name || c.email}`}>{c.email}</a>}{c.phone && <a href={`tel:${String(c.phone).replace(/[^+\d]/g, "")}`}>{c.phone}</a>}</div>
            <div className="mc-message" tabIndex={0} role="region" aria-label={`Message from ${c.name || "contact"}`}>{c.message || "No message provided."}</div>
            <label className="mc-status-control"><span>Update status</span><select value={status} disabled={locked || editingId !== null} onChange={e => updateStatus(c.id, e.target.value)}>{options}</select></label>
            <footer className="mc-actions"><button className="mc-primary" type="button" disabled={locked || editingId !== null} onClick={() => startEdit(c)}>Edit contact</button><button className="mc-delete" type="button" disabled={locked || editingId !== null} onClick={() => deleteContact(c.id)}>Delete</button>{busy === c.id && <span role="status">Updating…</span>}</footer>
          </>}
        </article>;
      })}
    </div>}
  </section>;
}

const STYLES = `
.mc-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;color:#392f43;border:1px solid #ded5e5;border-radius:12px;font:14px/1.55 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}.mc-panel *{box-sizing:border-box}.mc-panel :is(h2,h3,p){margin:0}.mc-panel :is(button,input,select,textarea){font:inherit}.mc-panel button{min-height:44px;padding:9px 13px;border:1px solid #d4c6df;border-radius:7px;background:#fff;color:#564263;font-weight:650;cursor:pointer;transition:background .18s}.mc-panel button:hover:not(:disabled){background:#f0e8f7}.mc-panel button:disabled{opacity:.5;cursor:not-allowed}.mc-panel :is(button,a,input,select,textarea,[tabindex]):focus-visible{outline:3px solid #795394;outline-offset:3px}.mc-panel :is(input,select,textarea){width:100%;min-width:0;min-height:44px;border:1px solid #cfc3d9;border-radius:7px;background:#fff;color:#392f43;padding:9px 11px;font-size:16px}.mc-panel textarea{resize:vertical;min-height:140px}.mc-header{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:18px}.mc-eyebrow{font-size:10px;font-weight:750;letter-spacing:1.4px;text-transform:uppercase;color:#77538b}.mc-header h2{display:flex;align-items:center;flex-wrap:wrap;gap:9px;font-size:clamp(20px,2.5vw,27px);letter-spacing:-.6px;font-weight:750;line-height:1.3;margin:5px 0}.mc-header h2>span{font-size:12px;letter-spacing:0;padding:3px 8px;border-radius:20px;background:#e9def1;color:#68477c}.mc-header>div>p:last-child{font-size:12px;color:#74647e}.mc-tools{display:flex;gap:7px;flex-shrink:0}.mc-tools button{font-size:12px}.mc-tools button[aria-pressed=true]{background:#77518a;color:#fff;border-color:#77518a}.mc-toolbar{display:flex;gap:12px;align-items:end}.mc-toolbar label>span,.mc-edit-fields label>span{display:block;margin-bottom:5px;font-size:11px;font-weight:750;color:#695575}.mc-search{flex:1;min-width:0}.mc-filter{width:195px;flex-shrink:0}.mc-results{display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:42px;font-size:11px;color:#73627e}.mc-results button{font-size:11px;border:0;background:none;text-decoration:underline;padding:4px;min-height:36px}.mc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:13px;align-items:start}.mc-card{min-width:0;display:flex;flex-direction:column;background:#fff;border:1px solid #ded6e5;border-top:3px solid var(--mc-ink);border-radius:10px;padding:16px;box-shadow:0 4px 15px #4c335a08}.mc-card-top{display:flex;align-items:center;gap:11px}.mc-avatar{width:42px;height:42px;flex-shrink:0;display:grid;place-items:center;background:var(--mc-wash);color:var(--mc-ink);font-weight:800;border-radius:12px;font-size:14px}.mc-person{min-width:0}.mc-card h3{font-size:16px;font-weight:750;line-height:1.35;overflow-wrap:anywhere}.mc-badge{display:inline-block;font-size:10px;font-weight:750;padding:2px 8px;border-radius:20px;background:var(--mc-wash);color:var(--mc-ink);margin-top:4px}.mc-reach{display:flex;flex-direction:column;gap:2px;margin:10px 0;min-width:0}.mc-reach a{font-size:13px;color:#65507e;text-underline-offset:3px;overflow-wrap:anywhere;min-height:28px;display:flex;align-items:center}.mc-message{max-height:145px;overflow-y:auto;min-height:75px;padding:11px 12px;background:#f8f6fa;border:1px solid #e9e2ed;border-radius:6px;font-size:13px;line-height:1.75;white-space:pre-wrap;overflow-wrap:anywhere;scrollbar-width:thin;scrollbar-color:#b19bbd #f1ebf5}.mc-status-control{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px}.mc-status-control>span{font-size:11px;font-weight:650;color:#74617f}.mc-status-control select{width:155px;font-size:14px;background:var(--mc-wash);color:var(--mc-ink);border-color:transparent;font-weight:650}.mc-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid #eee7f1}.mc-actions button{font-size:12px}.mc-panel .mc-primary{background:#77518a;color:#fff;border-color:#77518a}.mc-panel .mc-primary:hover:not(:disabled){background:#603d73}.mc-panel .mc-delete{margin-left:auto;background:#fff;color:#9b3d57;border-color:#ead5dc}.mc-panel .mc-delete:hover:not(:disabled){background:#fbeaf0}.mc-actions>span{font-size:11px;color:#745181}.mc-edit-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px}.mc-editing{box-shadow:0 0 0 2px #ad91bd}.mc-edit-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mc-wide{grid-column:1/-1}.mc-state{padding:35px 16px;text-align:center;border:1px dashed #cdbed8;border-radius:9px;background:#fff;color:#6f5b7b}.mc-state strong{display:block;color:#4f3a5c;font-size:17px;margin-bottom:5px}.mc-state button{display:block;margin:13px auto 0}.mc-error{color:#963955;background:#fff6f8}.mc-large .mc-message{font-size:18px}.mc-large .mc-reach a{font-size:16px}.mc-large .mc-card h3{font-size:19px}
@media(max-width:700px){.mc-header{align-items:flex-start;flex-direction:column;gap:10px}.mc-tools{width:100%}.mc-tools button{flex:1}.mc-toolbar{flex-wrap:wrap;gap:9px}.mc-search{flex-basis:100%}.mc-filter{width:100%}.mc-panel{padding:12px}.mc-card{padding:14px}.mc-edit-fields{grid-template-columns:1fr}.mc-panel .mc-status-control select{font-size:16px}}
@media(prefers-reduced-motion:reduce){.mc-panel *{transition:none!important}}
`;
