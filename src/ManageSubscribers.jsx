import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import EmailSubscriber from "./EmailSubscribe";

const API = "https://singspacebackend.onrender.com/api/pride/2";
const typesOf = sub => Array.isArray(sub.subscription_types) ? sub.subscription_types.filter(t => typeof t === "string") : [];
const nameOf = sub => [sub.first_name, sub.last_name].filter(Boolean).join(" ") || "Subscriber";

export default function ManageSubscribers() {
  const id = useId();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(null);
  const [largeText, setLargeText] = useState(false);
  const requestVersion = useRef(0);
  const mutationPending = useRef(false);
  const currentQuery = useRef("");

  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchSubscribers = useCallback(async (email = currentQuery.current) => {
    const version = ++requestVersion.current;
    setLoading(true); setError("");
    try {
      const res = await axios.get(`${API}/subscriptions`, {
        params: email ? { email } : {},
      });
      if (version === requestVersion.current) setSubs(Array.isArray(res.data) ? res.data : []);
    } catch {
      if (version === requestVersion.current) setError("Could not load subscribers. Please try again.");
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    currentQuery.current = query;
    fetchSubscribers(query);
    return () => { requestVersion.current++; };
  }, [query, fetchSubscribers]);

  const changeSubscriber = async (sub, action) => {
    if (mutationPending.current) return;
    if (action === "delete" && !window.confirm("Delete this subscriber permanently?")) return;
    mutationPending.current = true;
    setBusy({ id: sub.id, action }); setError(""); setNotice("");
    try {
      if (action === "delete") {
        await axios.delete(`${API}/subscription/${sub.id}`);
      } else if (sub.is_active) {
        await axios.patch(`${API}/unsubscribe-email`, { email: sub.email });
      } else {
        await axios.post(`${API}/subscribe`, {
          first_name: sub.first_name,
          last_name: sub.last_name,
          email: sub.email,
          subscription_types: typesOf(sub).map(t => t.toLowerCase()),
        });
      }
      setNotice(action === "delete" ? "Subscriber deleted." : sub.is_active ? "Subscriber deactivated." : "Subscriber reactivated.");
      await fetchSubscribers();
    } catch {
      setError(action === "delete" ? "Could not delete this subscriber. Please try again." : "Could not update this subscriber. Please try again.");
    } finally {
      mutationPending.current = false; setBusy(null);
    }
  };

  const filtered = subs.filter(s => filterActive === "all" || (filterActive === "active" ? s.is_active : !s.is_active));
  const searching = search.trim() !== query;

  return (
    <section className={`ms-panel${largeText ? " ms-large" : ""}`} aria-labelledby={`${id}-heading`}>
      <style>{STYLES}</style>
      <header className="ms-header">
        <div><p className="ms-eyebrow">Keep our community connected</p><h2 id={`${id}-heading`}>Email subscribers</h2><p>Manage contacts, interests, and subscription status.</p></div>
        <button className="ms-button" type="button" aria-pressed={largeText} onClick={() => setLargeText(v => !v)}>{largeText ? "A− Standard text" : "A+ Larger text"}</button>
      </header>

      {/* Existing signup component and its behavior remain intact. */}
      <div className="ms-signup"><EmailSubscriber /></div>

      <div className="ms-toolbar">
        <label className="ms-field" htmlFor={`${id}-search`}><span>Search by email</span><input id={`${id}-search`} type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Enter an email address…" /></label>
        <label className="ms-field" htmlFor={`${id}-filter`}><span>Subscription status</span><select id={`${id}-filter`} value={filterActive} onChange={e => setFilterActive(e.target.value)}><option value="all">All subscribers</option><option value="active">Active only</option><option value="inactive">Inactive only</option></select></label>
        <button className="ms-button" type="button" onClick={() => fetchSubscribers()} disabled={loading || searching || !!busy}>Refresh list</button>
      </div>
      <p className="ms-hint">Added someone using the signup form? Refresh the list to see them here.</p>
      {error && <div className="ms-error" role="alert">{error}<button type="button" className="ms-button" disabled={loading || !!busy} onClick={() => fetchSubscribers()}>Refresh list</button></div>}
      {notice && <p className="ms-success" role="status">✓ {notice}</p>}

      <div aria-busy={loading || searching}>
        {loading || searching ? <p className="ms-empty" role="status">Loading subscribers…</p> : <>
          <p className="ms-count" role="status">{filtered.length} {filtered.length === 1 ? "subscriber" : "subscribers"}{query ? " matching your email search" : ""}{filterActive !== "all" ? ` · ${filterActive}` : ""}</p>
          {filtered.length ? <div className="ms-grid">
            {filtered.map(sub => {
              const name = nameOf(sub);
              const initials = [sub.first_name, sub.last_name].filter(Boolean).map(n => String(n).slice(0, 1)).join("").toUpperCase() || "@";
              const pending = busy?.id === sub.id;
              return <article key={sub.id} className="ms-card" data-active={sub.is_active ? "true" : "false"} aria-busy={pending}>
                <div className="ms-card-heading"><span className="ms-avatar" aria-hidden="true">{initials}</span><div><h3>{name}</h3><span className="ms-status"><span aria-hidden="true" />{sub.is_active ? "Active" : "Inactive"}</span></div></div>
                <div className="ms-email"><span>Email address</span>{sub.email ? <a href={`mailto:${sub.email}`}>{sub.email}</a> : <p>No email provided</p>}</div>
                <div className="ms-interests"><p>Subscribed to</p><ul>{typesOf(sub).length ? typesOf(sub).map((type, index) => <li key={`${type}-${index}`} data-type={type.toLowerCase()}>{type.replace(/_/g, " ")}</li>) : <li>No interests listed</li>}</ul></div>
                <footer className="ms-actions">
                  <button type="button" className="ms-button ms-toggle" disabled={!!busy} onClick={() => changeSubscriber(sub,"toggle")} aria-label={`${sub.is_active ? "Deactivate" : "Reactivate"} ${name}`}>{pending && busy.action === "toggle" ? "Updating…" : sub.is_active ? "Deactivate" : "Reactivate"}</button>
                  <button type="button" className="ms-button ms-delete" disabled={!!busy} onClick={() => changeSubscriber(sub,"delete")} aria-label={`Delete ${name}`}>{pending && busy.action === "delete" ? "Deleting…" : "Delete"}</button>
                </footer>
              </article>;
            })}
          </div> : !error && <div className="ms-empty"><span className="ms-empty-icon" aria-hidden="true">✉</span><h3>{query || filterActive !== "all" ? "No matching subscribers" : "No subscribers yet"}</h3><p>{query || filterActive !== "all" ? "Try a different email or subscription status." : "Use the signup form above to add your first contact."}</p>{(query || filterActive !== "all") && <button className="ms-button" type="button" onClick={() => {setSearch("");setFilterActive("all");}}>Clear filters</button>}</div>}
        </>}
      </div>
    </section>
  );
}

const STYLES = `
.ms-panel{width:100%;min-width:0;padding:clamp(12px,2vw,22px);background:#f6f3f8;border:1px solid #ded5e5;border-radius:12px;color:#392f43;font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:light}
.ms-header,.ms-toolbar,.ms-grid,.ms-card,.ms-card *,.ms-field,.ms-field *{box-sizing:border-box}
.ms-header :is(h2,p),.ms-card :is(h3,p),.ms-empty :is(h3,p){margin:0}
.ms-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-bottom:15px;border-bottom:1px solid #e1d5e7}
.ms-eyebrow{font-size:10px;letter-spacing:1.4px;font-weight:750;text-transform:uppercase;color:#79578b}
.ms-header h2{font-size:clamp(22px,2.5vw,29px);line-height:1.3;font-weight:750;letter-spacing:-.6px;margin:5px 0}
.ms-header p:last-child{font-size:12px;color:#73617e}.ms-header>.ms-button{flex-shrink:0}
.ms-button{font:700 12px/1.4 Inter,ui-sans-serif,system-ui,sans-serif;min-height:44px;padding:9px 13px;border:1px solid #d1c3dc;border-radius:7px;background:#fff;color:#604671;cursor:pointer;transition:background .18s}
.ms-button:hover:not(:disabled){background:#eee5f5}.ms-button:disabled{opacity:.55;cursor:not-allowed}
.ms-button:focus-visible,.ms-field :is(input,select):focus-visible,.ms-email a:focus-visible{outline:3px solid #805995;outline-offset:3px}
.ms-signup{margin:16px 0;min-width:0;display:flow-root}
.ms-toolbar{display:grid;grid-template-columns:minmax(0,1fr) minmax(150px,220px) auto;gap:12px;align-items:end;margin-top:16px}
.ms-field{display:block;min-width:0}.ms-field>span{display:block;font-size:12px;font-weight:750;color:#685173;margin-bottom:5px}
.ms-field :is(input,select){display:block;width:100%;min-width:0;min-height:46px;padding:10px 12px;border:1px solid #cfc3d9;border-radius:6px;background:#fff;color:#392f43;font:16px/1.5 Inter,ui-sans-serif,system-ui,sans-serif}
.ms-field input::placeholder{color:#80718a}.ms-hint{font-size:11px;color:#73617e;margin:8px 0 14px}.ms-count{font-size:12px;color:#73617e;margin:13px 0}
.ms-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:14px;align-items:stretch}
.ms-card{--accent:#7ca78f;--tint:#e9f4ed;--ink:#38634b;display:flex;flex-direction:column;min-width:0;background:#fff;border:1px solid #ddd2e5;border-top:3px solid var(--accent);border-radius:10px;padding:16px;box-shadow:0 4px 14px #68457807}
.ms-card[data-active=false]{--accent:#b6a0bd;--tint:#f0eaf4;--ink:#765c83}
.ms-card-heading{display:flex;gap:12px;align-items:center;min-width:0}.ms-card-heading>div{min-width:0}
.ms-avatar{display:grid;place-items:center;flex-shrink:0;width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#f5dfeb,#e9e2f7,#e0f0ed);color:#735382;font-size:16px;font-weight:750}
.ms-card h3{font-size:17px;font-weight:750;line-height:1.4;overflow-wrap:anywhere}
.ms-status{display:inline-flex;align-items:center;gap:5px;padding:2px 8px;background:var(--tint);color:var(--ink);border-radius:20px;font-size:10px;font-weight:750;margin-top:5px}.ms-status>span{width:5px;height:5px;border-radius:50%;background:currentColor}
.ms-email{margin-top:15px;padding:10px 12px;background:#f7f3fa;border:1px solid #ede5f2;border-radius:7px;min-width:0}.ms-email>span,.ms-interests>p{display:block;font-size:10px;font-weight:750;letter-spacing:.6px;color:#73617e;margin-bottom:4px;text-transform:uppercase}.ms-email a{display:inline-block;color:#5e4873;text-decoration:underline;text-underline-offset:3px;font-size:13px;overflow-wrap:anywhere}.ms-email p{font-size:13px;color:#73617e}
.ms-interests{margin:14px 0}.ms-interests ul{display:flex;flex-wrap:wrap;gap:6px;padding:0;margin:6px 0 0;list-style:none}.ms-interests li{font-size:11px;font-weight:650;text-transform:capitalize;padding:3px 8px;border-radius:5px;background:#eee8f6;color:#68527e;overflow-wrap:anywhere}.ms-interests li[data-type=sponsors]{background:#fbefd7;color:#7c5c25}.ms-interests li[data-type=vendors]{background:#f8e4ed;color:#8c4666}.ms-interests li[data-type=general]{background:#e5effa;color:#476582}.ms-interests li[data-type=programs]{background:#e3f2eb;color:#3c6c55}
.ms-actions{display:flex;flex-wrap:wrap;gap:8px;border-top:1px solid #eee6f2;padding-top:12px;margin-top:auto}.ms-toggle{flex:1;background:var(--tint);color:var(--ink);border-color:var(--accent)}.ms-delete{background:#fdf0f4;color:#923b59;border-color:#e8c9d4}.ms-delete:hover:not(:disabled){background:#f7e0e9}
.ms-error,.ms-success{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px 14px;border:1px solid #e6bbc9;background:#fceaf0;color:#933954;border-radius:7px;font-size:13px;margin:12px 0;overflow-wrap:anywhere}.ms-success{border-color:#bdd9c7;background:#e7f3eb;color:#326046}
.ms-empty{padding:28px 14px;border:1px dashed #d5c6df;border-radius:8px;text-align:center;color:#73617e;margin:14px 0}.ms-empty-icon{font-size:27px;color:#8d6ca0}.ms-empty h3{font-size:18px;color:#53415f;margin:6px 0}.ms-empty p{font-size:13px}.ms-empty .ms-button{margin-top:12px}
.ms-large .ms-card h3{font-size:21px}.ms-large .ms-email a,.ms-large .ms-email p{font-size:17px}.ms-large .ms-interests li,.ms-large .ms-status{font-size:14px}.ms-large .ms-actions .ms-button{font-size:15px}
@media(max-width:560px){.ms-header{align-items:flex-start;flex-direction:column;gap:10px}.ms-toolbar{grid-template-columns:minmax(0,1fr) auto;gap:9px}.ms-toolbar>.ms-field:first-child{grid-column:1/-1}.ms-card{padding:14px}.ms-panel{padding:12px}}
@media(prefers-reduced-motion:reduce){.ms-button{transition:none}}
`;
