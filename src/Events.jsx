// Events.jsx — pastel community board with a Connecticut neon welcome.
// EventCard and EventDetailModal exports are retained for PastEvents.
import React, { useCallback, useEffect, useMemo, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaArrowRight, FaExternalLinkAlt, FaMicrophoneAlt, FaTicketAlt, FaRedoAlt, FaUsers, FaTimes, FaHeart, FaPlay, FaPause } from "react-icons/fa";
import PastEvents from "./PastEvents";
const API_BASE = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;
const EVENT_DETAIL_BASE = "";
const INTRO_MS = 3900;
const COLORS = ["#ac2853", "#9f481b", "#786008", "#216b47", "#315bb0", "#793caf"];
const WASHES = ["#ffe5ed", "#ffecda", "#fff5ce", "#e0f5e8", "#e3edff", "#efe2ff"];
// City-level starting marker until the center's exact address is supplied.
// Set latitude/longitude and address to verified center values when available.
export const PRIDE_CENTER_LOCATION = { latitude: 41.764, longitude: -72.682, address: "", label: "Hartford Pride Center" };
// Decorative statewide pins, NOT claims about real partner venues.
const CELEBRATION_PINS = [
  [-72.91,41.31],[-73.05,41.56],[-72.10,41.36],[-73.45,41.40],[-72.64,41.56],
  [-72.23,41.70],[-73.21,41.17],[-72.98,41.82],[-72.58,41.99],[-71.91,41.81],
  [-73.06,41.34],[-72.47,41.31],[-73.35,41.85],[-72.00,41.53],[-73.55,41.09],
];
// Simplified Connecticut silhouette for a decorative animation, not navigation.
const CT_BOUNDARY = [
  [-73.49,42.05],[-73.00,42.04],[-72.82,42.04],[-72.82,42.00],[-72.76,42.00],[-72.76,42.04],
  [-71.80,42.02],[-71.80,41.64],[-71.79,41.42],[-71.85,41.32],[-71.96,41.33],[-72.05,41.31],
  [-72.10,41.33],[-72.13,41.30],[-72.20,41.31],[-72.25,41.29],[-72.31,41.30],[-72.36,41.27],
  [-72.41,41.28],[-72.46,41.25],[-72.50,41.27],[-72.55,41.26],[-72.61,41.28],[-72.67,41.26],
  [-72.73,41.27],[-72.78,41.25],[-72.82,41.26],[-72.86,41.25],[-72.90,41.28],[-72.94,41.24],
  [-72.99,41.22],[-73.02,41.20],[-73.08,41.18],[-73.11,41.15],[-73.16,41.15],[-73.20,41.12],
  [-73.24,41.12],[-73.28,41.10],[-73.31,41.08],[-73.35,41.07],[-73.39,41.04],[-73.43,41.05],
  [-73.47,41.02],[-73.52,41.03],[-73.56,41.01],[-73.60,41.02],[-73.65,41.00],[-73.73,41.10],
  [-73.55,41.22],[-73.53,41.52],[-73.49,42.05],
];
const projectCT = (lon, lat) => [35 + (lon + 73.74) / 1.98 * 470, 42 + (42.06 - lat) / 1.08 * 270];
const CT_PATH = CT_BOUNDARY.map(([lon,lat],i) => `${i ? "L" : "M"}${projectCT(lon,lat).join(",")}`).join(" ") + " Z";
function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => { const media = window.matchMedia?.("(prefers-reduced-motion: reduce)"); if (!media) return undefined; const update = () => setReduced(media.matches); update(); if (media.addEventListener) media.addEventListener("change", update); else media.addListener(update); return () => { if (media.removeEventListener) media.removeEventListener("change", update); else media.removeListener(update); }; }, []);
  return reduced;
}
function ConnecticutIntro({ onComplete }) {
  const skipRef = useRef(null);
  const id = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  useEffect(() => {
    const before = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });
    const timer = window.setTimeout(onComplete, reduced ? 1100 : INTRO_MS);
    return () => { window.clearTimeout(timer); document.body.style.overflow = before; if (previousFocus?.isConnected) previousFocus.focus?.({ preventScroll: true }); };
  }, [onComplete, reduced]);
  const [hx,hy] = projectCT(PRIDE_CENTER_LOCATION.longitude, PRIDE_CENTER_LOCATION.latitude);
  return createPortal(<div className="hpe-intro" role="dialog" aria-modal="true" aria-labelledby="hpe-intro-title" aria-describedby="hpe-intro-caption" onKeyDown={event => { if (event.key === "Escape") onComplete(); if (event.key === "Tab") { event.preventDefault(); skipRef.current?.focus(); } }}>
    <div className="hpe-intro-inner"><p className="hpe-intro-eyebrow">One state. So many ways to belong.</p><h2 id="hpe-intro-title">Hartford <span>Pride Center</span></h2><p className="hpe-intro-subtitle">& its partnering events</p>
      <svg className="hpe-ct-map" viewBox="0 0 550 355" role="img" aria-label="Illustrated Connecticut map: Hartford lights up first, followed by colorful celebration pins around the state.">
        <defs><linearGradient id={`${id}-rainbow`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff97b1" /><stop offset=".22" stopColor="#ffc38b" /><stop offset=".42" stopColor="#f6df96" /><stop offset=".60" stopColor="#a6e5c0" /><stop offset=".79" stopColor="#a8cfff" /><stop offset="1" stopColor="#d4a7ff" /></linearGradient><filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter></defs>
        <path d={CT_PATH} fill="#251c36" stroke={`url(#${id}-rainbow)`} strokeWidth="11" opacity=".7" filter={`url(#${id}-glow)`} />
        <path className="hpe-ct-outline" pathLength="1" d={CT_PATH} fill="#251c3680" stroke={`url(#${id}-rainbow)`} strokeWidth="3" strokeLinejoin="round" />
        {CELEBRATION_PINS.map(([lon,lat],index) => { const [x,y] = projectCT(lon,lat); return <g key={index} transform={`translate(${x} ${y})`}><g className="hpe-map-pin" style={{ "--pin-delay": `${1000 + index * 105}ms`, color: ["#ff91b4","#ffbd84","#ffe197","#9de3b5","#99c9ff","#cba2ff"][index % 6] }}><circle className="hpe-pin-halo" r="11" fill="currentColor" opacity=".13" /><path d="M0 0 C-2 -4 -7 -8 -7 -13 A7 7 0 1 1 7 -13 C7 -8 2 -4 0 0Z" fill="currentColor" stroke="#fff" strokeOpacity=".65" strokeWidth=".8" /><circle cy="-13" r="2.4" fill="#34253d" /></g></g>; })}
        <g transform={`translate(${hx} ${hy})`}><g className="hpe-map-pin hpe-home-pin" style={{ "--pin-delay": "250ms" }}><circle r="18" fill="#ffb0dd" opacity=".13" /><circle r="11" fill="none" stroke="#ffc6e8" strokeOpacity=".7" /><path d="M0 0 C-3 -5 -10 -12 -10 -19 A10 10 0 1 1 10 -19 C10 -12 3 -5 0 0Z" fill="#ffc4e5" stroke="#fff" strokeWidth="1.4" /><path d="M0 -15 L-4 -19 C-7 -23 -2 -25 0 -22 C2 -25 7 -23 4 -19Z" fill="#9e457d" /></g><text x="0" y="27" textAnchor="middle" className="hpe-map-label">Hartford</text></g>
        <text x="45" y="340" className="hpe-map-footnote">An illustration of connection across Connecticut</text>
      </svg>
      <p id="hpe-intro-caption">A little Pride. A whole state of connection.</p>{PRIDE_CENTER_LOCATION.address && <p className="hpe-center-address">{PRIDE_CENTER_LOCATION.address}</p>}<button ref={skipRef} type="button" onClick={onComplete} className="hpe-intro-skip">Explore events <FaArrowRight aria-hidden="true" /></button><div className="hpe-intro-progress" aria-hidden="true"><span /></div>
    </div>
  </div>, document.body);
}
const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
/* ── date + time helpers ─────────────────────────────────── */
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
/* "YYYY-MM-DD" → local Date (built from parts, so no UTC shift) */
function parseDateOnly(s) {
  if (!s) return null;
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}
/* Date → "YYYY-MM-DD" in LOCAL time (toISOString would shift the day) */
function isoDate(d) {
  if (!d) return undefined;
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
/* "HH:MM" → "8:00 PM" */
function formatTime(hhmm) {
  if (!hhmm) return null;
  const m = String(hhmm).match(/^(\d{1,2}):(\d{2})/);
  if (!m) return String(hhmm);
  let h = Number(m[1]);
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m[2]} ${suffix}`;
}
function timeRange(e) {
  const start = formatTime(e.start_time);
  const end = formatTime(e.end_time);
  if (!start) return null;
  return end ? `${start} – ${end}` : start;
}
function titleCase(s) {
  return String(s)
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}
/* nth (or last) weekday of a month, on or after `from` */
function nextMonthlyOrdinal(from, weekdayIdx, ordinalWord) {
  const ORDINALS = {
    first: 1,
    "1st": 1,
    second: 2,
    "2nd": 2,
    third: 3,
    "3rd": 3,
    fourth: 4,
    "4th": 4,
  };
  const isLast = ordinalWord === "last";
  const n = ORDINALS[ordinalWord] || 1;
  for (let i = 0; i < 14; i++) {
    const base = new Date(from.getFullYear(), from.getMonth() + i, 1);
    let d;
    if (isLast) {
      d = new Date(base.getFullYear(), base.getMonth() + 1, 0); // last day of month
      d.setDate(d.getDate() - ((d.getDay() - weekdayIdx + 7) % 7));
    } else {
      d = new Date(base);
      d.setDate(1 + ((weekdayIdx - base.getDay() + 7) % 7) + (n - 1) * 7);
      if (d.getMonth() !== base.getMonth()) continue; // e.g. no 5th Thursday
    }
    if (d >= from) return d;
  }
  return null;
}
/* The date this event actually next happens.
   One-offs use `date`; recurring events get their next occurrence computed. */
function nextOccurrence(e) {
  const today = startOfToday();
  // ─────────────────────────────────────────────
  // ONE-TIME EVENT
  // Must have a real explicit date.
  // ─────────────────────────────────────────────
  if (!e.recurring) {
    return parseDateOnly(e.date);
  }
  // ─────────────────────────────────────────────
  // RECURRING EVENT
  // Calculate its NEXT occurrence instead of
  // blindly using an old explicit date.
  // ─────────────────────────────────────────────
  if (!e.recurring_day) return null;
  const weekdayIdx = WEEKDAYS.indexOf(
    String(e.recurring_day).trim().toLowerCase()
  );
  if (weekdayIdx < 0) return null;
  const pattern = String(e.recurrence_pattern || "weekly").toLowerCase();
  // Monthly
  const ordinal = pattern.match(
    /\b(1st|first|2nd|second|3rd|third|4th|fourth|last)\b/
  );
  if (ordinal || /month/.test(pattern)) {
    return nextMonthlyOrdinal(today, weekdayIdx, ordinal ? ordinal[1] : "first");
  }
  // Weekly / bi-weekly
  const d = new Date(today);
  d.setDate(d.getDate() + ((weekdayIdx - d.getDay() + 7) % 7));
  if (/bi-?weekly|every other|fortnight|two weeks|2 weeks/.test(pattern)) {
    const anchor = parseDateOnly(e.recurrence_anchor_date);
    if (anchor) {
      const weeks = Math.round((d - anchor) / (7 * 24 * 60 * 60 * 1000));
      if (Math.abs(weeks % 2) === 1) {
        d.setDate(d.getDate() + 7);
      }
    }
  }
  return d;
}
function recurrenceLabel(e) {
  if (!e.recurring) return null;
  const day = e.recurring_day ? titleCase(e.recurring_day) : null;
  const raw = String(e.recurrence_pattern || "").trim();
  if (!raw) return day ? `Every ${day}` : "Recurring";
  const p = raw.toLowerCase();
  if (/^weekly$/.test(p)) return day ? `Every ${day}` : "Weekly";
  if (/bi-?weekly|every other|fortnight/.test(p)) {
    return day ? `Every other ${day}` : "Every other week";
  }
  const label = titleCase(raw);
  if (day && !p.includes(day.toLowerCase())) return `${label} · ${day}s`;
  return label;
}
const eventTypes = (e) =>
  (Array.isArray(e.event_type) ? e.event_type : [])
    .map((t) => String(t).trim())
    .filter(Boolean);
function fullAddress(e) {
  return [e.address, e.city, e.state].filter(Boolean).join(", ");
}
function mapsUrl(e) {
  const q = [e.venue_name, e.address, e.city, e.state].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
function longDate(d) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
// Fresh regex each call; cleaned of the Markdown escapes in the supplied file.
const urlRe = () => /\b(?:https?:\/\/|www\.)[^\s<>"'()[\]]+/gi;
const stripPunctuation = raw => String(raw).replace(/[.,;:!?)\]}'"]+$/, "");
function normalizeHref(raw) {
  const trimmed = stripPunctuation(String(raw).trim());
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : /^www\./i.test(trimmed) ? `https://${trimmed}` : null;
  if (!candidate) return null;
  try { const u = new URL(candidate); return ["http:","https:"].includes(u.protocol) ? u.href : null; } catch { return null; }
}
function linkLabel(href) {
  let host="", path=""; try { const u = new URL(href); host=u.hostname.replace(/^www\./, "").toLowerCase(); path=u.pathname.toLowerCase(); } catch { return "More info"; }
  if (/eventbrite|ticketmaster|tickettailor|seetickets|showclix|etix|axs\.com|dice\.fm|universe\.com|posh\.vip|prekindle|eventzilla|ticketweb|withfriends/.test(host) || /^tickets?\./.test(host) || /\/(tickets?|rsvp|register|checkout)\b/.test(path)) return "Tickets";
  if (/facebook\.com|fb\.me|fb\.com/.test(host)) return "Facebook event";
  if (/instagram\.com/.test(host)) return "Instagram";
  if (/linktr\.ee|beacons\.ai|lnk\.bio|linkin\.bio/.test(host)) return "All links";
  if (/gofundme|donorbox|givebutter|paypal\.me|venmo\.com/.test(host)) return "Donate";
  if (/maps\.app\.goo\.gl|goo\.gl\/maps/.test(host+path)) return "Map";
  if (/karaoverse\.com/.test(host)) return "View on Karaoverse";
  return "More info";
}
const LINK_FIELDS = ["website","website_url","url","link","info_url","more_info_url","ticket_url","tickets_url","facebook_url","instagram_url"];
function eventLinks(event) {
  if (!event) return [];
  const tagged = [...(String(event.notes || "").match(urlRe()) || []).map(raw=>({raw,source:"notes"})), ...LINK_FIELDS.filter(f=>typeof event[f]==="string").map(f=>({raw:event[f],source:"field"}))];
  const key = href => href.replace(/\/+$/, "");
  const dedicated = normalizeHref(event.eventbrite_url || "");
  const seen = new Set(dedicated ? [key(dedicated)] : []);
  return tagged.reduce((out,{raw,source})=>{const href=normalizeHref(raw);if(!href||seen.has(key(href)))return out;seen.add(key(href));out.push({href,label:linkLabel(href),source});return out;},[]);
}
function LinkedNotes({ text, className="", onLinkClick, hideTickets=false }) {
  if (!text) return null;
  const src=String(text), re=urlRe(), nodes=[]; let last=0,m;
  while((m=re.exec(src))!==null){if(m.index>last)nodes.push(src.slice(last,m.index));const cleaned=stripPunctuation(m[0]), href=normalizeHref(cleaned);nodes.push(href && !(hideTickets && linkLabel(href)==="Tickets") ? <a key={m.index} href={href} target="_blank" rel="noopener noreferrer" onClick={onLinkClick}>{linkLabel(href)}</a> : cleaned);nodes.push(m[0].slice(cleaned.length));last=re.lastIndex;}
  if(last<src.length)nodes.push(src.slice(last));return <p className={className}>{nodes}</p>;
}
function DateTile({when}) { return <div className="hpe-date">{when ? <><span>{when.toLocaleDateString("en-US",{month:"short"})}</span><strong>{when.getDate()}</strong><small>{when.getFullYear()}</small></> : <span>TBA</span>}</div>; }
function EventFacts({event,when}) {
  const address=fullAddress(event), times=timeRange(event), count=Array.isArray(event.related_artist_ids)?event.related_artist_ids.length:0;
  return <div className="hpe-facts">{when && <p><FaCalendarAlt aria-hidden="true" /><time dateTime={isoDate(when)}>{longDate(when)}{event.recurring && <small> · next occurrence</small>}</time></p>}{times && <p><FaClock aria-hidden="true" />{times}</p>}{address && <p><FaMapMarkerAlt aria-hidden="true" /><span>{address}</span></p>}{count>0 && <p><FaUsers aria-hidden="true" />{count} {count===1?"artist":"artists"} on the bill</p>}{event.host && <p><FaMicrophoneAlt aria-hidden="true" />{event.host}</p>}</div>;
}
function EventTags({event}) {const types=eventTypes(event), repeat=recurrenceLabel(event);return <div className="hpe-tags">{types.map(t=><span key={t}>{t}</span>)}{repeat && <span><FaRedoAlt aria-hidden="true" />{repeat}</span>}</div>;}
function ExternalAction({href,children,onClick,primary=false}) {return <a href={href} target="_blank" rel="noopener noreferrer" className={`hpe-button${primary?" hpe-primary":""}`} onClick={onClick}>{children}<FaExternalLinkAlt aria-hidden="true" /></a>;}
export function EventCard({event,when,index=0,isPast=false,onOpen}) {
  const color=COLORS[index%6], open=()=>onOpen?.({raw:event,when,color,isPast}), stop=e=>e.stopPropagation();
  const ticket=!isPast && normalizeHref(event.eventbrite_url||"");
  const links=eventLinks(event).filter(l=>!(isPast&&l.label==="Tickets"));
  const detailTo=EVENT_DETAIL_BASE&&event.slug?`${EVENT_DETAIL_BASE}/${event.slug}`:null;
  return <article className="hpe-card" style={{"--card-ink":color,"--card-wash":WASHES[index%6]}} onClick={onOpen?open:undefined}>
    <style>{EVENTS_STYLES}</style><span className="hpe-card-pin" aria-hidden="true" /><div className="hpe-card-heading"><DateTile when={when}/><div><h3>{onOpen?<button type="button" onClick={e=>{stop(e);open();}}>{event.venue_name}</button>:event.venue_name}</h3><p>{[event.city,event.state].filter(Boolean).join(", ")}</p></div></div><EventTags event={event}/><EventFacts event={event} when={when}/><LinkedNotes text={event.notes} onLinkClick={stop} hideTickets={isPast} className="hpe-notes hpe-clamp"/>
    <div className="hpe-actions">{onOpen && <button type="button" className="hpe-button" onClick={e=>{stop(e);open();}}>View details <FaArrowRight aria-hidden="true" /></button>}{ticket && <ExternalAction href={ticket} onClick={stop} primary><FaTicketAlt aria-hidden="true" />Tickets</ExternalAction>}{links.map(l=><ExternalAction key={l.href} href={l.href} onClick={stop}>{l.label}</ExternalAction>)}{detailTo && <Link className="hpe-button" to={detailTo} onClick={stop}>Full page <FaArrowRight aria-hidden="true" /></Link>}</div>
  </article>;
}
export function EventDetailModal({entry,onClose}) {
  const panelRef=useRef(null), closeRef=useRef(null), onCloseRef=useRef(onClose);
  onCloseRef.current=onClose;
  useEffect(()=>{
    if(!entry)return undefined;
    const previousFocus=document.activeElement, overflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const modalRoot=panelRef.current?.parentElement;
    const background=Array.from(document.body.children).filter(n=>n!==modalRoot&&n instanceof HTMLElement).map(n=>[n,n.inert]);background.forEach(([n])=>{n.inert=true;});
    closeRef.current?.focus();
    const key=e=>{if(e.key==="Escape")onCloseRef.current?.();if(e.key!=="Tab")return;const panel=panelRef.current;const nodes=Array.from(panel.querySelectorAll('button:not([disabled]),a[href]')).filter(n=>n.getClientRects().length);const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&(document.activeElement===first||!panel.contains(document.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||!panel.contains(document.activeElement))){e.preventDefault();first.focus();}};
    document.addEventListener("keydown",key);return()=>{document.removeEventListener("keydown",key);document.body.style.overflow=overflow;background.forEach(([n,v])=>{n.inert=v;});if(previousFocus?.isConnected)previousFocus.focus?.({preventScroll:true});};
  },[entry]);
  if(!entry)return null;
  const {raw:event,when,isPast}=entry, ticket=!isPast&&normalizeHref(event.eventbrite_url||"");
  const links=eventLinks(event).filter(l=>!(isPast&&l.label==="Tickets")), primary=!ticket&&links.find(l=>l.label==="Tickets");
  return createPortal(<div className="hpe-modal" onClick={e=>{if(e.target===e.currentTarget)onClose();}}><style>{EVENTS_STYLES}</style><section ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="hpe-detail-title" className="hpe-modal-panel"><div className="hpe-rainbow" aria-hidden="true"/><button ref={closeRef} className="hpe-close" type="button" onClick={onClose} aria-label="Close event details"><FaTimes aria-hidden="true" /></button><div className="hpe-modal-copy"><div className="hpe-card-heading"><DateTile when={when}/><div><p className="hpe-eyebrow">{isPast?"From our community archive":"Make a little room for joy"}</p><h2 id="hpe-detail-title">{event.venue_name}</h2></div></div><EventTags event={event}/><EventFacts event={event} when={when}/>{event.notes&&<div className="hpe-detail-notes"><p className="hpe-eyebrow">About this event</p><LinkedNotes text={event.notes} hideTickets={isPast} className="hpe-notes"/></div>}<div className="hpe-actions">{ticket&&<ExternalAction href={ticket} primary><FaTicketAlt aria-hidden="true"/>Get tickets</ExternalAction>}{primary&&<ExternalAction href={primary.href} primary>Get tickets</ExternalAction>}{links.filter(l=>l!==primary&&l.source==="field").map(l=><ExternalAction key={l.href} href={l.href}>{l.label}</ExternalAction>)}{fullAddress(event)&&<ExternalAction href={mapsUrl(event)}>Directions</ExternalAction>}{EVENT_DETAIL_BASE&&event.slug&&<Link to={`${EVENT_DETAIL_BASE}/${event.slug}`} className="hpe-button" onClick={onClose}>Full page</Link>}</div></div></section></div>,document.body);
}
// Decorative brand illustration: four communities orbit one shared center.
function PlanetIcon({ type }) {
  const props = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "mic") return <g {...props}><rect x="-3" y="-8" width="6" height="11" rx="3"/><path d="M-6 -1v1a6 6 0 0 0 12 0v-1M0 6v4M-4 10h8"/></g>;
  if (type === "cocktail") return <g {...props}><path d="M-8 -7H8L0 2Z M0 2v8 M-5 10H5 M-4 -4H4 M3 -7l3 -5"/></g>;
  if (type === "dj") return <g {...props}><rect x="-12" y="-7" width="24" height="15" rx="2"/><circle cx="-6" cy="0" r="3.5"/><circle cx="6" cy="0" r="3.5"/><path d="M-1 -4v8M1 -4v8M-8 11h16M-6 -1v2M5 0h2"/></g>;
  return <g {...props}><path d="M-6 -6h12c3 0 5 10 4 13-1 3-5-1-7-3h-6c-2 2-6 6-7 3-1-3 1-13 4-13Z"/><path d="M-6 -2v5M-8.5 .5h5"/><circle cx="5" cy="-1" r=".8"/><circle cx="7.5" cy="2" r=".8"/></g>;
}
function KaraoverseSolarSystem() {
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const planets = [
    { icon: "mic", name: "Artists", radius: 58, angle: "-35deg", time: "23s", color: "#ffafcf" },
    { icon: "dj", name: "Hosts", radius: 95, angle: "135deg", time: "33s", color: "#ffd995" },
    { icon: "cocktail", name: "Venues", radius: 134, angle: "30deg", time: "44s", color: "#a2e8cf" },
    { icon: "game", name: "Patrons", radius: 173, angle: "205deg", time: "57s", color: "#c7b0ff" },
  ];
  return <figure className={`hpe-cosmos${paused ? " hpe-cosmos-paused" : ""}`} aria-labelledby="hpe-cosmos-caption">
    <div className="hpe-cosmos-top"><span>Different worlds. One community.</span>{!reduced && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Resume solar system animation" : "Pause solar system animation"} aria-pressed={paused}>{paused ? <FaPlay aria-hidden="true"/> : <FaPause aria-hidden="true"/>}<span>{paused ? "Play" : "Pause"}</span></button>}</div>
    <svg className="hpe-solar-system" viewBox="0 0 600 335" role="img" aria-label="A brilliant white star with fine luminous rays, slowly brightening and dimming, surrounded by four orbiting planets, with microphone, DJ table, cocktail and game controller icons representing artists, hosts, venues and patrons.">
      <defs>
        <radialGradient id={`${id}-sun`}><stop offset="0" stopColor="#fff" stopOpacity="1"/><stop offset=".12" stopColor="#fff" stopOpacity=".95"/><stop offset=".3" stopColor="#f3f6ff" stopOpacity=".45"/><stop offset=".62" stopColor="#e6eeff" stopOpacity=".12"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
        <radialGradient id={`${id}-halo`}><stop offset="0" stopColor="#fff" stopOpacity=".32"/><stop offset=".38" stopColor="#edf3ff" stopOpacity=".1"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
        <linearGradient id={`${id}-orbit`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4c394"/><stop offset=".45" stopColor="#edabd1"/><stop offset="1" stopColor="#9bade5"/></linearGradient>
      </defs>
      <g className="hpe-cosmos-stars" fill="#e4c9ee" aria-hidden="true">{[[70,66],[143,31],[232,52],[393,38],[522,70],[556,194],[438,283],[129,286],[43,221],[314,300],[483,121],[107,165]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%3===0?1.5:1} opacity={i%2===0?.65:.3}/>)}</g>
      <g transform="translate(300 163) scale(1.25 .72)">{planets.map(planet=><circle key={planet.name} r={planet.radius} fill="none" stroke={`url(#${id}-orbit)`} strokeWidth=".9" opacity=".35"/>)}</g>
      <g transform="translate(300 163)" aria-hidden="true">
        <g className="hpe-solar-sun">
          <ellipse rx="104" ry="76" fill={`url(#${id}-halo)`}/>
          <circle r="49" fill={`url(#${id}-sun)`}/>
          <path d="M0 -67 C2 -15 3 -3 76 0 C3 3 2 15 0 67 C-2 15 -3 3 -76 0 C-3 -3 -2 -15 0 -67Z" fill="#fff" opacity=".95"/>
          <path d="M0 -39 Q2 -2 43 0 Q2 2 0 39 Q-2 2 -43 0 Q-2 -2 0 -39Z" transform="rotate(45)" fill="#f5f8ff" opacity=".75"/>
          <path d="M-95 0H95M0 -78V78" stroke="#fff" strokeWidth=".45" opacity=".48"/>
          <circle r="18" fill={`url(#${id}-sun)`}/>
          <path d="M0 -10 3 -3 10 0 3 3 0 10 -3 3 -10 0 -3 -3Z" fill="#fff"/>
        </g>
      </g>
      <g transform="translate(300 163) scale(1.25 .72)">{planets.map(planet=><g key={planet.name} style={{ "--orbit-start": planet.angle, "--orbit-time": planet.time }}><g className="hpe-planet-orbit"><g transform={`translate(${planet.radius} 0)`}><g className="hpe-planet-counter"><g transform="scale(.8 1.388889)"><circle r="22" fill={planet.color} opacity=".13"/><circle r="18" fill="#2c2338" stroke={planet.color} strokeWidth="1.4"/><circle cx="-5" cy="-6" r="7" fill={planet.color} opacity=".13"/><g style={{color:planet.color}}><PlanetIcon type={planet.icon}/></g></g></g></g></g></g>)}</g>
    </svg>
    <figcaption id="hpe-cosmos-caption">Karaoverse <span>Brings it all together</span></figcaption>
    <div className="hpe-cosmos-legend" aria-hidden="true">{planets.map(planet=><span key={planet.name} style={{color:planet.color}}><svg viewBox="-14 -14 28 28"><PlanetIcon type={planet.icon}/></svg>{planet.name}</span>)}</div>
  </figure>;
}

function ScrollReveal({ children, className = "" }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || !window.IntersectionObserver) return;
    const reveal = () => { node.classList.remove("hpe-reveal-waiting"); observer.disconnect(); };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) reveal();
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
    if (node.getBoundingClientRect().top >= window.innerHeight - 24) {
      node.classList.add("hpe-reveal-waiting");
      observer.observe(node);
      node.addEventListener("focusin", reveal);
    }
    return () => { observer.disconnect(); node.removeEventListener("focusin", reveal); node.classList.remove("hpe-reveal-waiting"); };
  }, [reduced]);
  return <div ref={ref} className={`hpe-scroll-reveal ${className}`}>{children}</div>;
}

export default function Events() {
  const [events,setEvents]=useState([]),[status,setStatus]=useState("loading"),[errorMsg,setErrorMsg]=useState(""),[retry,setRetry]=useState(0),[selected,setSelected]=useState(null),[showIntro,setShowIntro]=useState(true);
  const headingRef=useRef(null), reduced=useReducedMotion();
  const completeIntro=useCallback(()=>setShowIntro(false),[]),closeModal=useCallback(()=>setSelected(null),[]);
  useEffect(()=>{if(!showIntro)headingRef.current?.focus({preventScroll:true});},[showIntro]);
  useEffect(()=>{const controller=new AbortController();let active=true;(async()=>{try{setStatus("loading");setErrorMsg("");const res=await fetch(`${API_BASE}/karaokeevents/pride/${PRIDE_ID}`,{signal:controller.signal,headers:{Accept:"application/json"}});if(!res.ok)throw new Error(`Server returned ${res.status}`);const data=await res.json();if(!Array.isArray(data))throw new Error("Unexpected events response");if(active){setEvents(data);setStatus("ready");}}catch(err){if(!active||err.name==="AbortError")return;setErrorMsg(err.message||"Something went wrong");setStatus("error");}})();return()=>{active=false;controller.abort();};},[retry]);
  const upcoming=useMemo(()=>{const today=startOfToday();return events.map(raw=>({raw,when:nextOccurrence(raw)})).filter(({when})=>when&&when>=today&&when.getFullYear()===today.getFullYear()).sort((a,b)=>a.when-b.when);},[events]);
  const nextUp=upcoming[0]||null;
  return <><style>{EVENTS_STYLES}</style>{showIntro?<ConnecticutIntro onComplete={completeIntro}/>:<main className="hpe-page"><div className="hpe-rainbow" aria-hidden="true"/>
    <section className="hpe-container hpe-hero"><div><p className="hpe-kicker"><FaHeart aria-hidden="true"/>Capital City Pride · Hartford, CT</p><h1 ref={headingRef} tabIndex={-1}>Pride events.<br/><em>All year. All heart.</em></h1><p className="hpe-hero-description">Drag shows, karaoke nights, support groups, and street-filling celebrations — one-offs and the weeklies you can count on. Everything here is live from our events board.</p><a href="#events" className="hpe-button">Find your next moment <FaArrowRight aria-hidden="true"/></a></div><div className="hpe-next"><p className="hpe-eyebrow">Pinned for you · Next up</p>{status==="loading"?<p role="status">Finding your next moment…</p>:status==="error"?<p>Our events board is taking a moment. Please try again below.</p>:nextUp?<button type="button" onClick={()=>setSelected({...nextUp,color:COLORS[5]})}><span className="hpe-next-date">{nextUp.when.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span><strong>{nextUp.raw.venue_name}</strong><span>{[timeRange(nextUp.raw),nextUp.raw.city].filter(Boolean).join(" · ")}</span><small>{[eventTypes(nextUp.raw)[0],recurrenceLabel(nextUp.raw)].filter(Boolean).join(" · ")}</small><span className="hpe-next-action">Take a closer look <FaArrowRight aria-hidden="true"/></span></button>:<><img src="/banner.jpeg" alt="Capital City Pride"/><p>Something good is always growing.</p></>}<div className="hpe-rainbow" aria-hidden="true"/></div></section>
    <div className="hpe-container"><div className="hpe-marquee" role="region" aria-label="Karaoke, Drag, Dancing, Gathering, Marching, Singing. Focus to pause." tabIndex={0}><div className="hpe-marquee-track" aria-hidden="true">{[0,1,2,3].map(copy=><div className="hpe-marquee-group" key={copy}>{["Karaoke","Drag","Dancing","Gathering","Marching","Singing"].map((word,i)=><span key={word} style={{color:COLORS[i]}}>{word}</span>)}</div>)}</div></div></div>
    <section id="events" className="hpe-events" aria-busy={status==="loading"}><ScrollReveal className="hpe-container"><div className="hpe-section-heading"><div><p className="hpe-eyebrow hpe-chapter-label"><FaCalendarAlt aria-hidden="true"/> Upcoming events</p><h2>What’s <em>coming up.</em></h2><p className="hpe-chapter-description">Your next reason to get together.</p></div>{status==="ready"&&upcoming.length>0&&<span>{upcoming.length} {upcoming.length===1?"event":"events"}</span>}</div>{status==="loading"?<div className="hpe-state" role="status">Loading our community calendar…</div>:status==="error"?<div className="hpe-state" role="alert"><h3>The events board didn’t load</h3><p>{errorMsg}</p><div className="hpe-actions"><button type="button" className="hpe-button" onClick={()=>setRetry(x=>x+1)}>Try again</button><ExternalAction href="https://karaoverse.com/venue/capital-city-pride">Open Karaoverse</ExternalAction></div></div>:upcoming.length===0?<div className="hpe-state"><FaCalendarAlt aria-hidden="true"/><h3>Nothing on the board yet</h3><p>The next round of events is still being booked. Check our past events, or head straight to Karaoverse to find local community events in your area.</p></div>:<div className="hpe-grid">{upcoming.map(({raw,when},index)=><EventCard key={raw.id} event={raw} when={when} index={index} onOpen={setSelected}/>)}</div>}</ScrollReveal></section>
    <div className="hpe-past hpe-memory-chapter"><ScrollReveal><div className="hpe-container hpe-memory-label"><p className="hpe-eyebrow hpe-chapter-label"><FaClock aria-hidden="true"/> Past events · The scrapbook</p></div><PastEvents/></ScrollReveal></div>
    <section className="hpe-partner hpe-partner-universe" aria-labelledby="hpe-partner-title"><ScrollReveal className="hpe-container">
      <div className="hpe-partner-lead"><p className="hpe-eyebrow">Meet Karaoverse · Our community partner</p><h2 id="hpe-partner-title">Built with <em>Karaoverse.</em></h2><p>Karaoverse is an <strong>18+ platform</strong> supporting artists of all kinds with unique technology that connects creative people, the hosts who bring an evening to life, the places that welcome them, and the patrons who make it all worthwhile.</p></div>
      <div className="hpe-partner-story">
        <div className="hpe-video"><video src="/Video.mov" poster="/banner.jpeg" autoPlay={!reduced} controls loop muted playsInline preload="metadata" aria-label="Karaoverse community collaboration"><a href="/Video.mov">Watch the collaboration video</a></video><div className="hpe-rainbow" aria-hidden="true"/></div>
        <div className="hpe-partner-copy"><p>From singers, musicians, drag performers, and other <strong>artists</strong> to <strong>DJ, karaoke, and trivia hosts</strong>, Karaoverse brings talent and opportunity into the same space. <strong>Venues, including bars and restaurants,</strong> can connect with the people who fill their rooms with energy.</p><p>And <strong>patrons</strong> — the people who love watching, singing, playing, or simply being part of the night — can discover something to look forward to. <a className="hpe-inline-cosmic" href="https://karaoverse.com/events" target="_blank" rel="noopener noreferrer">Explore events on Karaoverse <FaArrowRight aria-hidden="true"/></a> and find your next connection.</p></div>
      </div>
      <KaraoverseSolarSystem />
      <div className="hpe-network-story" aria-labelledby="hpe-network-heading"><span className="hpe-network-heart" aria-hidden="true"><FaHeart/></span><p className="hpe-eyebrow">Proud partner of the Pride Network</p><h3 id="hpe-network-heading">More connection.<br className="hpe-mobile-network-break"/> <em>More room to belong.</em></h3><p>Through the <a className="hpe-inline-cosmic" href="https://karaoverse.com/pride-network" target="_blank" rel="noopener noreferrer">Pride Network <FaArrowRight aria-hidden="true"/></a>, Karaoverse supports Pride centers by helping their programs, events, and community voices reach more people and connect with artists, hosts, venues, and patrons.</p><p>Represent a Pride center? <a className="hpe-inline-cosmic" href="https://karaoverse.com/pride-network" target="_blank" rel="noopener noreferrer">Visit the Pride Network to connect with us <FaArrowRight aria-hidden="true"/></a> — we’d love to hear what your community is building and explore how we can support it together.</p></div>
      <p className="hpe-credit hpe-partner-credit">Karaoverse was created and engineered by our on-staff software designer <strong>Jonathen Whitford</strong> of <a href="https://jwhitproductions.com" target="_blank" rel="noopener noreferrer">JWhit Productions</a>.</p>
    </ScrollReveal></section>

    <section className="hpe-closing"><div className="hpe-container"><FaHeart aria-hidden="true"/><h2>Build safe spaces.<br/><em>Be seen. Get connected.</em></h2><p>Karaoverse lets LGBTQIA+ artists, nightlife hosts, safe-space venues, and allies create a profile, connect with their community, share what they do, and get discovered. Whether you’re building a place to belong, running events, or raising your artistic voice — this platform exists to celebrate you.</p><p>From drag shows to support groups, karaoke hosts to queer musicians — it’s how people find local safe spaces, live events, and real opportunities in our community.</p><div className="hpe-actions"><ExternalAction href="https://karaoverse.com" primary>Join Karaoverse</ExternalAction><Link to="/volunteer" className="hpe-button">Volunteer</Link><Link to="/contact" className="hpe-button">Contact</Link></div></div></section><p className="hpe-signoff">Pride never sleeps — and neither does our community.</p><div className="hpe-rainbow" aria-hidden="true"/></main>}<EventDetailModal entry={selected} onClose={closeModal}/></>;
}
const EVENTS_STYLES = `
.hpe-page,.hpe-card,.hpe-modal,.hpe-intro{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.6;color:#49364f;-webkit-font-smoothing:antialiased;color-scheme:light}.hpe-page *,.hpe-card *,.hpe-modal *,.hpe-intro *{box-sizing:border-box}.hpe-page h1,.hpe-page h2,.hpe-page h3,.hpe-page p,.hpe-card h3,.hpe-card p,.hpe-modal h2,.hpe-modal p,.hpe-intro h2,.hpe-intro p{margin:0}.hpe-page a,.hpe-card a,.hpe-modal a{color:inherit;text-decoration:none}.hpe-page button,.hpe-card button,.hpe-modal button,.hpe-intro button{font:inherit;cursor:pointer}.hpe-page a:focus-visible,.hpe-page button:focus-visible,.hpe-page [tabindex="0"]:focus-visible,.hpe-card button:focus-visible,.hpe-card a:focus-visible,.hpe-modal button:focus-visible,.hpe-modal a:focus-visible,.hpe-intro button:focus-visible{outline:3px solid #ac7cb9;outline-offset:4px}.hpe-page h1:focus{outline:none}
.hpe-page{min-height:100vh;background:radial-gradient(ellipse at 0 0,#f9e3ed77,transparent 35%),#faf8f4;padding-top:var(--hpc-header-offset,64px)}.hpe-container{width:97%;max-width:1560px;margin-inline:auto;padding-inline:clamp(12px,2.3vw,34px)}.hpe-rainbow{height:3px;background:linear-gradient(90deg,#d9627f,#dda06a,#d4bb64,#78ad8e,#7e9bce,#b087be)}.hpe-page em{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-weight:400;color:#895b83}.hpe-eyebrow{font-size:10px;color:#926b88;letter-spacing:1.25px;text-transform:uppercase;font-weight:650}.hpe-kicker{display:inline-flex;align-items:center;gap:9px;padding:7px 12px;border:1px solid #e5d2e3;border-radius:999px;background:#fffafb;font-size:11px;color:#926784}
.hpe-hero{display:grid;grid-template-columns:1.2fr .8fr;align-items:center;gap:clamp(28px,5vw,75px);padding-block:42px 35px}.hpe-hero h1{font-size:clamp(42px,5.8vw,79px);font-weight:500;line-height:1.08;letter-spacing:-2.5px;margin:20px 0}.hpe-hero-description{font-size:14px;color:#79677c;line-height:1.85;max-width:590px}.hpe-hero-description+.hpe-button{margin-top:21px}.hpe-next{position:relative;border:1px solid #e4cfe2;border-radius:23px;background:linear-gradient(125deg,#fff4f8,#f0eafa);padding:23px;box-shadow:0 10px 28px #694b6510;transform:rotate(1deg)}.hpe-next::before{content:"";position:absolute;width:64px;height:19px;top:-8px;left:calc(50% - 32px);background:#dcc5e4bb;transform:rotate(-6deg)}.hpe-next>button{display:flex;flex-direction:column;gap:10px;width:100%;text-align:left;border:0;background:none;padding:17px 0;color:#6f4c71}.hpe-next>button>strong{font-size:24px;line-height:1.3;font-weight:550;overflow-wrap:anywhere}.hpe-next-date{font-family:Georgia,serif;font-style:italic;font-size:44px;color:#9e648a;line-height:1.2}.hpe-next>button>span:not(.hpe-next-date){font-size:13px}.hpe-next small{font-size:11px;color:#91768d}.hpe-next-action{display:flex;align-items:center;gap:9px;font-weight:650;margin-top:6px}.hpe-next>img{display:block;width:100%;max-height:230px;object-fit:contain;border-radius:13px;margin-top:14px}.hpe-next>p:not(.hpe-eyebrow){font-size:13px;padding-block:18px;color:#80657c}
.hpe-marquee{--cycle:900px;overflow:hidden;border-block:1px solid #e4d9e3;padding-block:17px;mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)}.hpe-marquee-track{display:flex;width:max-content;animation:hpe-marquee 30s linear infinite}.hpe-marquee-group{display:flex;flex:0 0 var(--cycle);width:var(--cycle)}.hpe-marquee-group>span{position:relative;flex:1;padding-inline:13px;text-align:center;font-family:Georgia,serif;font-style:italic;font-size:22px;white-space:nowrap}.hpe-marquee-group>span::after{content:"";position:absolute;right:0;top:50%;width:3px;height:3px;border-radius:50%;background:#cbb4c8}.hpe-marquee:hover .hpe-marquee-track,.hpe-marquee:focus-within .hpe-marquee-track{animation-play-state:paused}
.hpe-events{padding-block:34px 38px;scroll-margin-top:calc(var(--hpc-header-offset,64px) + 16px)}.hpe-section-heading{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:25px}.hpe-section-heading h2,.hpe-partner h2{font-size:clamp(29px,3.2vw,42px);font-weight:500;line-height:1.2;letter-spacing:-1px;margin-top:7px}.hpe-section-heading>span{font-size:12px;color:#8c6888;background:#f4eaf4;padding:6px 12px;border-radius:99px}.hpe-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:23px 18px}.hpe-card{position:relative;display:flex;flex-direction:column;min-width:0;padding:22px 19px 17px;background:var(--card-wash,#f3eaf6);border:1px solid #ddcedf;border-radius:20px;box-shadow:0 5px 18px #6844690a;transition:box-shadow .2s}.hpe-card:hover{box-shadow:0 9px 25px #68446918}.hpe-card-pin{position:absolute;top:-5px;left:calc(50% - 5px);width:10px;height:10px;background:var(--card-ink);border:2px solid #ffffffac;border-radius:50%;box-shadow:0 2px 5px #0002}.hpe-card-heading{display:flex;align-items:center;gap:13px;min-width:0}.hpe-card-heading>div:last-child{min-width:0}.hpe-card h3{font-size:20px;line-height:1.25;font-weight:550;letter-spacing:-.4px;overflow-wrap:anywhere;color:var(--card-ink,#815a83)}.hpe-card h3 button{display:block;text-align:left;background:none;border:0;padding:0;color:inherit;font:inherit;min-height:44px}.hpe-card h3 button:hover{text-decoration:underline;text-underline-offset:4px}.hpe-card-heading>div>p:not(.hpe-eyebrow){font-size:11px;color:#92788c;margin-top:5px}.hpe-date{width:61px;min-height:75px;display:flex;flex-shrink:0;flex-direction:column;align-items:center;justify-content:center;border:1px solid #e0cede;background:#fffc;border-radius:14px;color:var(--card-ink,#875985);line-height:1.2}.hpe-date>span{font-size:10px;letter-spacing:1px;text-transform:uppercase}.hpe-date>strong{font-size:29px;font-family:Georgia,serif;font-weight:400;margin:2px 0}.hpe-date>small{font-size:9px;color:#9b8297}.hpe-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}.hpe-tags:empty{display:none}.hpe-tags>span{display:inline-flex;align-items:center;gap:5px;border:1px solid #785c771b;border-radius:99px;background:#ffffff75;color:var(--card-ink,#855d83);font-size:10px;padding:4px 8px}.hpe-tags svg{font-size:9px}.hpe-facts{display:grid;gap:7px;margin-top:17px;font-size:12px;color:#765f77}.hpe-facts p{display:flex;align-items:flex-start;gap:9px;overflow-wrap:anywhere}.hpe-facts svg{flex-shrink:0;font-size:11px;margin-top:4px;color:#a17e99}.hpe-facts small{font-size:10px;color:#927c93}.hpe-notes{font-size:13px;line-height:1.8;white-space:pre-line;color:#7c687d;overflow-wrap:anywhere;margin-top:15px!important}.hpe-notes a{color:var(--card-ink,#805a85);text-decoration:underline;text-underline-offset:3px;font-weight:650}.hpe-clamp{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.hpe-actions{display:flex;flex-wrap:wrap;gap:8px;padding-top:18px}.hpe-card>.hpe-actions{margin-top:auto}.hpe-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:10px 14px;border:1px solid #dcc8df;border-radius:999px;background:#fffafcb3;color:#805a83!important;font-size:11px!important;font-weight:650;line-height:1.5;transition:background .2s}.hpe-button svg{font-size:10px;flex-shrink:0}.hpe-button:hover{background:#f2e4ef}.hpe-primary{background:#80577e;color:#fff!important;border-color:#80577e}.hpe-primary:hover{background:#6c466e}.hpe-state{border:1px solid #e4d3e2;border-radius:20px;padding:30px 22px;background:#fffafc;text-align:center;color:#8c7188;font-size:14px}.hpe-state h3{font-size:23px;font-family:Georgia,serif;font-weight:400;margin:10px 0}.hpe-state .hpe-actions{justify-content:center}
.hpe-partner{display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:center;padding-block:30px 40px}.hpe-video{padding:10px;border:1px solid #e4d5e2;border-radius:21px;background:#fffafc;margin-top:20px}.hpe-video video{display:block;width:100%;aspect-ratio:16/9;object-fit:contain;border-radius:13px 13px 0 0;background:#211b29}.hpe-partner-copy{font-size:14px;line-height:1.85;color:#7d687d}.hpe-credit{padding:19px;border:1px solid #e4d5e4;border-radius:17px;background:#f5edf7;margin-block:18px!important;font-size:13px}.hpe-credit a{color:#7c5587;text-decoration:underline;text-underline-offset:3px}.hpe-closing{padding-block:32px;background:radial-gradient(ellipse at 0 0,#f8e1ebbb,transparent 60%),#f4eff7;border-top:1px solid #e5d8e6;text-align:center}.hpe-closing>.hpe-container>svg{color:#b978a0;font-size:22px;margin-bottom:12px}.hpe-closing h2{font-size:clamp(29px,3.3vw,43px);font-weight:500;letter-spacing:-1px;line-height:1.25;margin-bottom:18px}.hpe-closing p{max-width:800px;margin:12px auto!important;font-size:13px;line-height:1.85;color:#826d84}.hpe-closing .hpe-actions{justify-content:center}.hpe-signoff{text-align:center;font-family:Georgia,serif;font-size:20px;font-style:italic;color:#96738e;padding:24px 15px!important}
.hpe-modal{position:fixed;inset:0;z-index:2000;display:flex;justify-content:center;align-items:center;padding:20px;background:#281b325c;backdrop-filter:blur(5px)}.hpe-modal-panel{position:relative;width:100%;max-width:730px;max-height:91vh;max-height:91dvh;overflow:auto;background:#fffaf8;border:1px solid #dbc8df;border-radius:24px;box-shadow:0 24px 75px #2a173333}.hpe-modal-copy{padding:27px}.hpe-modal-copy>.hpe-card-heading{padding-right:40px}.hpe-modal h2{font-size:28px;font-weight:500;line-height:1.25;letter-spacing:-.5px;overflow-wrap:anywhere}.hpe-modal .hpe-eyebrow{font-size:9px;margin-bottom:7px}.hpe-modal .hpe-facts{font-size:13px}.hpe-detail-notes{border:1px solid #e5d4e4;border-radius:16px;background:#f7eff7;padding:18px;margin-top:20px}.hpe-close{position:sticky;float:right;top:10px;z-index:1;display:grid;place-items:center;width:44px;height:44px;margin:10px 10px -54px 0;border:1px solid #dec7de;border-radius:50%;background:#fffbfd;color:#865c83}
.hpe-intro{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;min-height:100dvh;overflow:auto;padding:25px 18px;color:#f8e8f7;background:radial-gradient(ellipse at 14% 18%,#b34c7930,transparent 50%),radial-gradient(ellipse at 86% 76%,#4678a92d,transparent 55%),#171220;text-align:center;color-scheme:dark}.hpe-intro-inner{width:100%;max-width:710px}.hpe-intro-eyebrow{font-size:10px;color:#cdb5d8;letter-spacing:1.6px}.hpe-intro h2{font-size:clamp(32px,5.5vw,60px);font-weight:450;line-height:1.12;letter-spacing:-1.4px;margin-top:16px}.hpe-intro h2>span{display:block;font-family:Georgia,serif;font-style:italic;font-weight:400;background:linear-gradient(100deg,#ffa1b6,#ffca94,#f5e3a5,#a8e4be,#a9cfff,#d0adff);background-clip:text;-webkit-background-clip:text;color:transparent;padding-bottom:7px}.hpe-intro .hpe-intro-subtitle{font-family:Georgia,serif;font-style:italic;color:#f4d6f1;font-size:clamp(22px,3.3vw,32px);text-shadow:0 0 10px #eca0d865,0 0 30px #c580d144;margin-top:8px}.hpe-ct-map{display:block;width:min(100%,560px);height:auto;margin:3px auto 0;overflow:visible}.hpe-ct-outline{stroke-dasharray:1;stroke-dashoffset:1;animation:hpe-map-draw 1.1s ease forwards}.hpe-map-pin{opacity:0;transform:translateY(-12px) scale(.4);animation:hpe-pin-pop .5s cubic-bezier(.2,.85,.3,1.3) forwards;animation-delay:var(--pin-delay);filter:drop-shadow(0 0 4px currentColor)}.hpe-home-pin{color:#ffc4e5}.hpe-map-label{font-family:Inter,system-ui,sans-serif;font-size:12px;font-weight:550;fill:#f8d9f0;paint-order:stroke;stroke:#22172c;stroke-width:5px;stroke-linejoin:round}.hpe-map-footnote{font-family:Inter,system-ui,sans-serif;font-size:9px;letter-spacing:.2px;fill:#b59fc4}.hpe-intro #hpe-intro-caption{font-size:12px;color:#cbb3d6;margin-top:2px}.hpe-center-address{font-size:11px;color:#cbb3d6}.hpe-intro-skip{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:10px 17px;border:1px solid #d6b6df42;border-radius:99px;background:#ffffff07;color:#ecd9f4;font-size:12px!important;margin-top:15px}.hpe-intro-skip:hover{background:#ffffff13}.hpe-intro-skip svg{font-size:10px}.hpe-intro-progress{width:115px;height:3px;overflow:hidden;border-radius:99px;background:#ffffff13;margin:16px auto 0}.hpe-intro-progress>span{display:block;height:100%;transform-origin:left;background:linear-gradient(90deg,#ff91ae,#ffbd84,#ffe197,#9de3b5,#99c9ff,#cba2ff);animation:hpe-progress ${INTRO_MS}ms linear forwards}
@keyframes hpe-map-draw{to{stroke-dashoffset:0}}@keyframes hpe-pin-pop{0%{opacity:0;transform:translateY(-12px) scale(.4)}65%{opacity:1;transform:translateY(0) scale(1.15)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes hpe-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes hpe-marquee{from{transform:translateX(calc(-1 * var(--cycle)))}to{transform:translateX(0)}}
@media(max-width:1050px){.hpe-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hpe-hero{gap:30px}.hpe-next{padding:20px}}
@media(max-width:760px){.hpe-hero{grid-template-columns:1fr;gap:27px;padding-block:28px}.hpe-hero h1{font-size:clamp(43px,8vw,65px);letter-spacing:-1.8px;margin:17px 0}.hpe-hero-description{font-size:14px}.hpe-next{transform:none}.hpe-next>button{gap:8px}.hpe-next-date{font-size:37px}.hpe-next>button>strong{font-size:23px}.hpe-marquee{--cycle:780px;padding-block:14px}.hpe-marquee-group>span{font-size:19px}.hpe-events{padding-block:26px}.hpe-grid{gap:20px 13px}.hpe-card{padding:20px 15px 14px}.hpe-card-heading{gap:10px}.hpe-date{width:54px;min-height:68px}.hpe-partner{grid-template-columns:1fr;gap:19px;padding-block:24px 30px}.hpe-partner-copy{font-size:13px}.hpe-modal-copy{padding:22px}.hpe-modal h2{font-size:25px}}
@media(max-width:520px){.hpe-container{padding-inline:10px}.hpe-kicker{font-size:9px;letter-spacing:.15px}.hpe-grid{grid-template-columns:1fr}.hpe-card{padding:20px 17px 15px}.hpe-card h3{font-size:22px}.hpe-card-heading{gap:13px}.hpe-date{width:60px}.hpe-modal{padding:9px}.hpe-modal-panel{max-height:94dvh;border-radius:20px}.hpe-modal-copy{padding:19px}.hpe-modal .hpe-card-heading{align-items:flex-start;gap:10px}.hpe-modal .hpe-eyebrow{font-size:8px;letter-spacing:.7px}.hpe-modal h2{font-size:22px}.hpe-detail-notes{padding:14px}.hpe-signoff{font-size:18px}.hpe-intro{padding:22px 13px}.hpe-intro h2{font-size:clamp(33px,10vw,46px)}.hpe-intro-eyebrow{font-size:9px;letter-spacing:.8px}.hpe-intro .hpe-intro-subtitle{font-size:24px}.hpe-intro #hpe-intro-caption{font-size:11px}}
@media(max-height:620px) and (min-width:600px){.hpe-intro{padding-block:15px}.hpe-intro h2{font-size:30px;margin-top:8px}.hpe-intro h2>span{display:inline}.hpe-intro .hpe-intro-subtitle{font-size:22px}.hpe-ct-map{max-width:350px}.hpe-intro-skip{margin-top:9px}.hpe-intro-progress{margin-top:9px}}
@media(prefers-reduced-motion:reduce){.hpe-page *,.hpe-card *,.hpe-modal *,.hpe-intro *{animation:none!important;transition:none!important;scroll-behavior:auto!important}.hpe-map-pin{opacity:1;transform:none}.hpe-ct-outline{stroke-dashoffset:0}.hpe-intro-progress>span{transform:scaleX(1)}.hpe-marquee{mask-image:none}.hpe-marquee-track{width:100%;transform:none}.hpe-marquee-group{width:100%;flex-basis:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px 0}.hpe-marquee-group:not(:first-child){display:none}.hpe-marquee-group>span{font-size:17px;padding-inline:3px}.hpe-marquee-group>span:nth-child(3n)::after{display:none}}
@media(forced-colors:active){.hpe-intro h2>span{background:none;color:CanvasText}.hpe-intro-subtitle{text-shadow:none}.hpe-card,.hpe-next,.hpe-modal-panel{border-color:CanvasText}}
/* Fuller Pride palette: rainbow frames, vivid accents, and readable ink. */
.hpe-page{background:radial-gradient(ellipse at 0 0,#ffd6e66b,transparent 32%),radial-gradient(ellipse at 100% 18%,#ffe9b965,transparent 30%),radial-gradient(ellipse at 0 50%,#c9efdf60,transparent 32%),radial-gradient(ellipse at 100% 72%,#d8d0ff66,transparent 34%),#fffaf5}
.hpe-rainbow{height:5px;background:linear-gradient(90deg,#e85375 0%,#ed9150 19%,#dfbf45 37%,#52a975 55%,#5484d0 74%,#a66bd2 91%,#d963a6 100%)}
.hpe-kicker{background:linear-gradient(105deg,#ffe3ec,#fff0da 38%,#e3f4ec 68%,#eae3fc);border-color:#dfbfdc;color:#804268}
.hpe-kicker>svg{color:#c84679}
.hpe-page .hpe-hero h1 em,.hpe-page .hpe-section-heading h2 em,.hpe-page .hpe-partner h2 em,.hpe-page .hpe-closing h2 em{background:linear-gradient(100deg,#b82f62 0%,#a65020 20%,#7d6511 36%,#25744c 53%,#315eac 73%,#8441a4 94%);background-clip:text;-webkit-background-clip:text;color:transparent;padding-right:4px}
.hpe-next{border:2px solid transparent;background:linear-gradient(130deg,#fff0f7,#fff7e5 35%,#eaf6f1 63%,#eee6ff) padding-box,linear-gradient(125deg,#e77da0,#e9af74,#dec879,#80c69d,#8aaee1,#ba8cda) border-box;box-shadow:0 11px 29px #98578719}
.hpe-next::before{background:linear-gradient(90deg,#edb0c7bb,#f0cf95bb,#b4dccaBB,#b9b5e8bb)}
.hpe-next-date{color:#ad3d7b}.hpe-next>button>strong{color:#734483}.hpe-next-action{color:#654a98}
.hpe-marquee{border-color:#d4bbdd;background:linear-gradient(90deg,#ffe6ee70,#ffefdc70,#fff6ce70,#e0f5e970,#e2edff70,#eee0ff70)}
.hpe-card{border:1px solid transparent;border-top-width:4px;background:linear-gradient(145deg,#fffefbe6,var(--card-wash)) padding-box,linear-gradient(100deg,#e77795,#eba66b,#d9c365,#6bb990,#749bd9,#b17bd0) border-box;box-shadow:0 7px 21px #8c569018}
.hpe-card:hover{box-shadow:0 11px 27px #8c569028}.hpe-card-pin{width:11px;height:11px;top:-6px;left:calc(50% - 5.5px);box-shadow:0 2px 6px #79458033}
.hpe-date{background:linear-gradient(140deg,#fffc,var(--card-wash,#f0e3fc));border-color:var(--card-ink,#8c55a2);box-shadow:0 3px 9px #89508a10}
.hpe-tags>span{background:var(--card-wash,#f1e5fc);border-color:#795c732b}.hpe-facts svg{color:var(--card-ink,#9454a0)}
.hpe-section-heading>span{color:#77448c;background:linear-gradient(115deg,#fbe0ed,#eee1fc);border:1px solid #dcbde0}
.hpe-button{border:1px solid transparent;background:linear-gradient(#fffafc,#fffafc) padding-box,linear-gradient(105deg,#dd819f,#d9b767,#76b591,#85a5d8,#b381cb) border-box;color:#794582!important}
.hpe-button:hover{background:linear-gradient(#f8e9f6,#f8e9f6) padding-box,linear-gradient(105deg,#dd819f,#d9b767,#76b591,#85a5d8,#b381cb) border-box}
.hpe-primary{background:linear-gradient(110deg,#a93269,#865095 50%,#4b67a4) padding-box,linear-gradient(105deg,#ee98b4,#ead084,#9dd4bc,#ab9bea) border-box;color:#fff!important}
.hpe-primary:hover{background:linear-gradient(110deg,#94295e,#754385 50%,#405b98) padding-box,linear-gradient(105deg,#ee98b4,#ead084,#9dd4bc,#ab9bea) border-box}
.hpe-video{border:2px solid transparent;background:linear-gradient(#fffbfd,#fffbfd) padding-box,linear-gradient(120deg,#e87699,#eeb77b,#dec979,#8bcba2,#8dafde,#bc8cdf) border-box}
.hpe-credit{background:linear-gradient(120deg,#fce7f0,#f7efdb 40%,#ebf3ed 67%,#eee7fc);border-color:#dfc6e0}
.hpe-closing{background:radial-gradient(ellipse at 8% 20%,#ffcfdfa0,transparent 50%),radial-gradient(ellipse at 65% 0%,#ffe8ada0,transparent 40%),radial-gradient(ellipse at 20% 100%,#c6efdca0,transparent 40%),radial-gradient(ellipse at 95% 80%,#d0c3ffa0,transparent 50%),#fff9f4;border-color:#e3c9e0}
.hpe-closing>.hpe-container>svg{color:#c54d88}.hpe-signoff{color:#8d5188}
.hpe-modal-panel{border:2px solid transparent;background:linear-gradient(#fffaf8,#fffaf8) padding-box,linear-gradient(140deg,#e87699,#eeb77b,#daca6c,#80c29a,#83a6dd,#b584d8) border-box}
.hpe-detail-notes{background:linear-gradient(120deg,#fcedf5,#f1ecfc);border-color:#ddc7e3}
.hpe-intro{background:radial-gradient(ellipse at 6% 8%,#db427349,transparent 42%),radial-gradient(ellipse at 88% 7%,#d49f2926,transparent 38%),radial-gradient(ellipse at 4% 94%,#269a7338,transparent 44%),radial-gradient(ellipse at 97% 82%,#7751d548,transparent 48%),#171120}
.hpe-intro::before{content:"";position:fixed;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#ff6f94,#ffb361,#ffe073,#76dfaa,#82b9ff,#c28aff)}
.hpe-intro h2>span{background-image:linear-gradient(100deg,#ff9cb5,#ffc38a,#ffe89b,#a0edbd,#a9d0ff,#d3acff);filter:drop-shadow(0 0 10px #e2a3df28)}
.hpe-intro .hpe-intro-subtitle{color:#ffe1f7;text-shadow:-6px 0 18px #ff659b60,0 0 9px #ffdff17a,7px 0 24px #8c99ff60}
.hpe-ct-map{filter:drop-shadow(0 0 16px #b56dff20)}
.hpe-intro-skip{border-color:#dab4e467;background:linear-gradient(110deg,#b6438028,#7972c02b);color:#ffedfc}
.hpe-intro-skip:hover{background:linear-gradient(110deg,#b6438045,#7972c045)}
.hpe-intro-progress{width:150px;height:4px}
@media(forced-colors:active){.hpe-page .hpe-hero h1 em,.hpe-page .hpe-section-heading h2 em,.hpe-page .hpe-partner h2 em,.hpe-page .hpe-closing h2 em,.hpe-intro h2>span{background:none;color:CanvasText;filter:none}.hpe-card,.hpe-next,.hpe-modal-panel,.hpe-button{border-color:ButtonText}.hpe-button,.hpe-primary{background:Canvas;color:LinkText!important}}
/* Karaoverse editorial partnership and decorative solar system. */
.hpe-partner.hpe-partner-universe{display:block;padding-block:34px 38px}
.hpe-partner-lead{max-width:850px}.hpe-partner-lead>p:last-child{font-size:15px;line-height:1.9;color:#7c637c;margin-top:17px}.hpe-partner-universe strong{font-weight:650;color:#735078}
.hpe-partner-story{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:30px;margin-top:23px}.hpe-partner-story .hpe-video{margin-top:0}.hpe-partner-story .hpe-partner-copy>p+p{margin-top:17px}.hpe-partner-story .hpe-partner-copy{font-size:14px;line-height:1.9}
.hpe-page a.hpe-inline-cosmic{display:inline;color:#8c3f87;font-weight:650;text-decoration:underline;text-decoration-color:#c890bba1;text-decoration-thickness:1.5px;text-underline-offset:4px;border:0;border-radius:0;background:none;box-shadow:none;padding:0;transition:color .2s,text-decoration-color .2s}.hpe-page a.hpe-inline-cosmic:hover{color:#485fab;text-decoration-color:#768cd6}.hpe-inline-cosmic>svg{display:inline-block;font-size:.7em;margin-inline:3px;vertical-align:baseline}
.hpe-page .hpe-cosmos{position:relative;isolation:isolate;max-width:910px;margin:30px auto 28px;padding:14px 24px 22px;overflow:hidden;text-align:center;border:1px solid #baa0ce55;border-radius:28px;background:radial-gradient(ellipse at 30% 25%,#ae518b21,transparent 55%),radial-gradient(ellipse at 75% 80%,#4b75a227,transparent 60%),#201829;box-shadow:0 15px 36px #59336013;color:#f2dcef}
.hpe-cosmos::after{content:"";position:absolute;bottom:0;left:0;right:0;height:2px;opacity:.65;background:linear-gradient(90deg,#ed8ca9,#ebbd79,#ddd581,#8ac9ac,#97b9ee,#ca9cea)}
.hpe-cosmos-top{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:44px;font-size:10px;color:#c3a8ce;letter-spacing:.6px;text-align:left}.hpe-cosmos-top>button{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:44px;min-width:44px;padding:7px 10px;border:1px solid #c2a0d02e;border-radius:99px;background:#ffffff04;color:#dbc5e4;font-size:10px}.hpe-cosmos-top>button:hover{background:#ffffff0b}.hpe-cosmos-top>button>svg{font-size:9px}
.hpe-solar-system{display:block;width:min(100%,650px);height:auto;margin:-6px auto -9px;overflow:visible}
.hpe-planet-orbit{transform-origin:0 0;transform:rotate(var(--orbit-start));animation:hpe-orbit-around var(--orbit-time) linear infinite}
.hpe-planet-counter{transform-origin:0 0;transform:rotate(calc(-1 * var(--orbit-start)));animation:hpe-orbit-counter var(--orbit-time) linear infinite}
.hpe-solar-sun{transform-origin:0 0;opacity:.9;filter:drop-shadow(0 0 9px #ffffffaa);animation:hpe-star-breathe 7s ease-in-out infinite}
.hpe-cosmos figcaption{position:relative;font-family:Georgia,"Times New Roman",serif;font-style:italic;font-size:clamp(25px,3.4vw,38px);line-height:1.35;letter-spacing:.2px;color:#fbe1f6;text-shadow:0 0 8px #f1a6d968,0 0 23px #c37ee653;margin:0}.hpe-cosmos figcaption>span{display:block;font-size:.63em;letter-spacing:.6px;color:#e4d0f3;text-shadow:0 0 12px #a8aff35a}
.hpe-cosmos-legend{display:flex;justify-content:center;flex-wrap:wrap;gap:10px 23px;margin-top:18px}.hpe-cosmos-legend>span{display:inline-flex;align-items:center;gap:7px;font-size:10px;letter-spacing:.5px}.hpe-cosmos-legend svg{width:19px;height:19px;overflow:visible;flex-shrink:0}
.hpe-cosmos-paused .hpe-planet-orbit,.hpe-cosmos-paused .hpe-planet-counter,.hpe-cosmos-paused .hpe-solar-sun{animation-play-state:paused}
.hpe-network-story{max-width:850px;margin:0 auto;text-align:center;padding:8px 8px 0}.hpe-network-heart{display:grid;place-items:center;width:39px;height:39px;margin:0 auto 12px;border-radius:14px;background:linear-gradient(135deg,#f9dce9,#eee1fa);color:#b95b94;transform:rotate(-7deg)}.hpe-network-story h3{font-size:clamp(26px,3vw,36px);font-weight:500;line-height:1.2;letter-spacing:-.6px;margin:9px 0 18px}.hpe-network-story h3 em{background:linear-gradient(100deg,#a73667,#9c6329,#377957,#436aad,#8e4e9d);background-clip:text;-webkit-background-clip:text;color:transparent;padding-right:3px}.hpe-network-story>p:not(.hpe-eyebrow){font-size:14px;line-height:1.9;color:#846a81;max-width:800px;margin:12px auto}.hpe-mobile-network-break{display:none}.hpe-partner-universe .hpe-partner-credit{max-width:850px;margin:23px auto 0!important;background:none;border:0;border-top:1px solid #e4d2e2;border-radius:0;text-align:center;font-size:11px;line-height:1.8;padding:15px 5px 0;color:#947b8f}
@keyframes hpe-orbit-around{from{transform:rotate(var(--orbit-start))}to{transform:rotate(calc(var(--orbit-start) + 360deg))}}
@keyframes hpe-orbit-counter{from{transform:rotate(calc(-1 * var(--orbit-start)))}to{transform:rotate(calc(-1 * var(--orbit-start) - 360deg))}}
@keyframes hpe-star-breathe{0%,100%{opacity:.48;transform:scale(.88);filter:drop-shadow(0 0 5px #ffffff60)}50%{opacity:1;transform:scale(1.08);filter:drop-shadow(0 0 13px #ffffffdd) drop-shadow(0 0 23px #eaf2ff80)}}
@media(max-width:760px){.hpe-partner.hpe-partner-universe{padding-block:27px 30px}.hpe-partner-story{grid-template-columns:1fr;gap:19px;margin-top:19px}.hpe-partner-lead>p:last-child{font-size:14px}.hpe-partner-story .hpe-partner-copy{font-size:13px}.hpe-page .hpe-cosmos{padding:11px 15px 20px;margin-block:25px;border-radius:22px}.hpe-network-story>p:not(.hpe-eyebrow){font-size:13px}}
@media(max-width:520px){.hpe-cosmos-top{font-size:8px;letter-spacing:.3px;gap:7px}.hpe-solar-system{width:calc(100% + 14px);max-width:none;margin:2px -7px 0}.hpe-cosmos figcaption{font-size:28px}.hpe-cosmos figcaption>span{font-size:18px;letter-spacing:0}.hpe-cosmos-legend{gap:9px 15px;margin-top:17px}.hpe-cosmos-legend>span{font-size:9px;letter-spacing:.2px}.hpe-cosmos-legend svg{width:16px;height:16px}.hpe-network-story{padding-inline:0}.hpe-mobile-network-break{display:block}}
@media(prefers-reduced-motion:reduce){.hpe-planet-orbit,.hpe-planet-counter,.hpe-solar-sun{animation:none!important}.hpe-planet-orbit{transform:rotate(var(--orbit-start))}.hpe-planet-counter{transform:rotate(calc(-1 * var(--orbit-start)))}}
@media(forced-colors:active){.hpe-network-story h3 em{background:none;color:CanvasText}.hpe-cosmos figcaption,.hpe-cosmos figcaption>span{text-shadow:none;color:CanvasText}.hpe-cosmos{border-color:CanvasText}.hpe-page a.hpe-inline-cosmic{color:LinkText;text-decoration-color:LinkText}}

/* Three distinct chapters: fresh mint calendar, warm scrapbook, lavender partner. */
.hpe-page .hpe-events{position:relative;margin-block:28px 36px;padding-block:30px 34px;border:1px solid #acd7c7;border-top:4px solid #479c83;border-radius:25px;background:linear-gradient(135deg,#effaf5,#e7f3f0);box-shadow:0 10px 28px #345f4810}
.hpe-page .hpe-chapter-label{display:flex;align-items:center;gap:9px;font-size:11px;font-weight:750;letter-spacing:1.6px;color:#286953}
.hpe-page .hpe-chapter-label svg{font-size:14px;flex-shrink:0}
.hpe-page .hpe-chapter-description{font-size:13px;line-height:1.65;color:#4f7164;margin-top:9px}
.hpe-page .hpe-events .hpe-section-heading{padding-bottom:20px;border-bottom:1px solid #bcd8cc;margin-bottom:27px}
.hpe-page .hpe-events .hpe-section-heading>span{color:#286953;background:#fff9;border:1px solid #b6d9c9;white-space:nowrap}
.hpe-page .hpe-memory-chapter{position:relative;background:radial-gradient(circle at 1px 1px,#c0a67c24 1px,transparent 1.5px) 0 0/17px 17px,#fbf2e3;border-block:1px solid #dfc9a7;padding-block:29px 22px;margin-block:0 38px}
.hpe-page .hpe-memory-label .hpe-chapter-label{color:#875426}
.hpe-page .hpe-memory-chapter .hpm-section{padding-top:13px;padding-bottom:12px}
.hpe-page .hpe-memory-chapter .hpm-heading{padding-bottom:20px;border-bottom:1px solid #dec9ad;margin-bottom:24px}
.hpe-page .hpe-memory-chapter .hpm-eyebrow{color:#875f3b}
.hpe-page .hpe-partner.hpe-partner-universe{position:relative;border:1px solid #cab9e4;border-top:4px solid #9472c4;border-radius:25px;background:radial-gradient(ellipse at 90% 0,#e5d9f9,transparent 55%),#f3edfb;padding-block:32px;margin-bottom:38px;box-shadow:0 10px 28px #66488310}
.hpe-page .hpe-partner-universe .hpe-partner-lead{max-width:none;padding-bottom:25px;border-bottom:1px solid #d6c7e8}
.hpe-page .hpe-partner-universe .hpe-partner-lead>.hpe-eyebrow{color:#704895;font-weight:750;letter-spacing:1.5px}
.hpe-page .hpe-partner-universe .hpe-partner-lead>p:last-child{max-width:850px;margin-inline:auto}
.hpe-page .hpe-partner-universe .hpe-partner-copy{color:#614f70}
.hpe-page .hpe-partner-universe .hpe-network-story{padding-top:25px;border-top:1px solid #d6c7e8}
@media(max-width:760px){.hpe-page .hpe-events{margin-block:21px 25px;padding-block:23px 26px;border-radius:20px}.hpe-page .hpe-memory-chapter{padding-block:23px 17px;margin-bottom:26px}.hpe-page .hpe-partner.hpe-partner-universe{padding-block:25px;margin-bottom:26px;border-radius:20px}.hpe-page .hpe-chapter-label{font-size:10px;letter-spacing:1px}.hpe-page .hpe-events .hpe-section-heading{gap:10px;align-items:start;padding-bottom:17px}.hpe-page .hpe-events .hpe-section-heading>span{font-size:10px;padding:5px 8px}.hpe-page .hpe-partner-universe .hpe-partner-lead{padding-bottom:20px}}

/* Edge-to-edge section bands, with content aligned inside the shared container. */
.hpe-page .hpe-events,.hpe-page .hpe-memory-chapter,.hpe-page .hpe-partner.hpe-partner-universe{width:100%;max-width:none;margin:0;padding-inline:0;border-radius:0;border-inline:0;box-shadow:none}
.hpe-page .hpe-events{margin-top:24px;padding-block:36px 40px}
.hpe-page .hpe-memory-chapter{padding-block:34px 30px}
.hpe-page .hpe-partner.hpe-partner-universe{display:block;padding-block:38px 40px}
.hpe-scroll-reveal{opacity:1;transform:none;transition:opacity .75s ease,transform .75s cubic-bezier(.2,.65,.3,1)}
.hpe-reveal-waiting{opacity:0;transform:translateY(18px)}
.hpe-reveal-waiting:focus-within{opacity:1;transform:none}
@media(max-width:760px){.hpe-page .hpe-events{margin-top:18px;padding-block:27px 30px}.hpe-page .hpe-memory-chapter{padding-block:27px 23px}.hpe-page .hpe-partner.hpe-partner-universe{padding-block:29px 30px}}
@media(prefers-reduced-motion:reduce){.hpe-scroll-reveal,.hpe-reveal-waiting{opacity:1!important;transform:none!important;transition:none!important}}
@media print{.hpe-scroll-reveal,.hpe-reveal-waiting{opacity:1!important;transform:none!important}}
`;
