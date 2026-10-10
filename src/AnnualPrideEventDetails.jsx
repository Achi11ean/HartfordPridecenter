import React, { useEffect, useId, useMemo, useRef, useState } from "react";

import { createPortal } from "react-dom";

import axios from "axios";

import { motion, useReducedMotion } from "framer-motion";

import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaTimes } from "react-icons/fa";

import PrideItinerary from "./PrideItinerary";

// Single-file replacement. Uses the existing PrideItinerary component unchanged.

const API = "https://singspacebackend.onrender.com";

const PRIDE_ID = 2;

function safeHref(value) {

  if (typeof value !== "string" || !value.trim()) return "";

  const raw = value.trim();

  if (/^[a-z][a-z\d+.-]*:/i.test(raw) && !/^https?:/i.test(raw)) return "";

  try { const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }

}

function formatTime(value) {

  if (!value) return "TBD";

  const match = String(value).match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

  if (match) { const h = Number(match[1]), m = Number(match[2]); return h < 24 && m < 60 ? `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}` : "TBD"; }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "TBD" : date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

}

function formatDate(value) {

  if (!value) return "Date to be announced";

  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);

  return Number.isNaN(date.getTime()) ? "Date to be announced" : date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

}

function usePrideResource(path, enabled = true) {

  const [state, setState] = useState({ data: null, loading: enabled, error: "" });

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {

    if (!enabled) return;

    let current = true;

    const controller = new AbortController();

    setState(previous => ({ ...previous, loading: true, error: "" }));

    axios.get(`${API}${path}`, { signal: controller.signal }).then(response => {

      if (current) setState({ data: response.data, loading: false, error: "" });

    }).catch(error => {

      if (current && error.code !== "ERR_CANCELED") setState({ data: null, loading: false, error: "This part of the community board couldn’t load. Please try again." });

    });

    return () => { current = false; controller.abort(); };

  }, [path, enabled, attempt]);

  return { ...state, retry: () => setAttempt(value => value + 1) };

}

function Reveal({ children, className = "" }) {

  const reduced = useReducedMotion();

  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: "some", margin: "0px 0px -24px 0px" }} transition={{ duration: reduced ? 0 : .6, ease: "easeOut" }}>{children}</motion.div>;

}

function Section({ id, tone = "cream", eyebrow, title, intro, children, extra }) {

  return <section id={id} className={`ape-scope ape-band ape-band-${tone}`}><Reveal className="ape-container"><header className="ape-section-head"><div>{eyebrow && <p className="ape-eyebrow">{eyebrow}</p>}<h2>{title}</h2>{intro && <p className="ape-intro">{intro}</p>}</div>{extra}</header>{children}</Reveal></section>;

}

function Status({ loading, error, retry, empty }) {

  return <div className="ape-state" role={error ? "alert" : "status"}>{loading ? <><span className="ape-loading-line" aria-hidden="true"/><p>Gathering our community…</p></> : error ? <><p>{error}</p>{retry && <button type="button" className="ape-button" onClick={retry}>Try again</button>}</> : <p>{empty}</p>}</div>;

}

function CommunityImage({ src, alt, className = "", eager = false }) {

  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return src && !failed ? <img className={className} src={src} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)}/> : <span className={`ape-image-fallback ${className}`} role="img" aria-label={alt}><span aria-hidden="true">✦</span><span>{alt}</span></span>;

}

function ExternalLink({ href, children, className = "ape-inline-link", fallback = false }) {

  const safe = safeHref(href);

  return safe ? <a className={className} href={safe} target="_blank" rel="noopener noreferrer">{children}</a> : fallback ? <span className={className}>{children}</span> : null;

}

function Modal({ title, onClose, children, wide = false }) {

  const panel = useRef(null), close = useRef(null), callback = useRef(onClose);

  const titleId = useId();

  const reduced = useReducedMotion();

  callback.current = onClose;

  useEffect(() => {

    const previous = document.activeElement;

    const overflow = document.body.style.overflow;

    const background = Array.from(document.body.children).filter(node => !node.contains(panel.current)).map(node => [node, node.inert]);

    background.forEach(([node]) => { node.inert = true; });

    document.body.style.overflow = "hidden";

    close.current?.focus();

    const onKey = event => {

      if (event.key === "Escape") { event.preventDefault(); callback.current(); }

      if (event.key !== "Tab") return;

      const nodes = Array.from(panel.current.querySelectorAll('button:not([disabled]),a[href],input,select,textarea,iframe,[tabindex="0"]')).filter(node => node.getClientRects().length);

      const first = nodes[0], last = nodes[nodes.length - 1];

      if (event.shiftKey && (document.activeElement === first || !panel.current.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }

      else if (!event.shiftKey && (document.activeElement === last || !panel.current.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }

    };

    document.addEventListener("keydown", onKey);

    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; background.forEach(([node, inert]) => { node.inert = inert; }); if (previous?.isConnected) previous.focus?.({ preventScroll: true }); };

  }, []);

  return createPortal(<div className="ape-scope ape-modal" onClick={event => { if (event.target === event.currentTarget) onClose(); }}><motion.section ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`ape-modal-panel${wide ? " ape-modal-wide" : ""}`} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}><header className="ape-modal-head"><h2 id={titleId}>{title}</h2><button ref={close} type="button" className="ape-icon-button" onClick={onClose} aria-label="Close details"><FaTimes aria-hidden="true"/></button></header><div className="ape-modal-body">{children}</div></motion.section></div>, document.body);

}

function People({ people, hosts = false }) {

  return <div className="ape-lineup">{people.map(person => {

    const name = hosts ? person.dj_name?.replace(/^dj\s*/i, "DJ ") : person.artist_name;

    // Retain the existing featured-host route; itinerary hosts use /host/:slug.

    const href = person.slug ? `https://karaoverse.com/${hosts ? "" : "artist/"}${person.slug}` : "";

    const content = <><CommunityImage className="ape-portrait" src={hosts ? person.photo_url || "/default-dj.png" : person.image_url} alt={name || "Pride performer"}/><strong>{name}</strong><small>{hosts ? "DJ · Host" : "Featured artist"}</small></>;

    return href ? <ExternalLink key={person.id} className="ape-person" href={href}>{content}</ExternalLink> : <div key={person.id} className="ape-person">{content}</div>;

  })}</div>;

}

function ReadableNotes({ description, hosts, error, retry }) {
  const [textSize, setTextSize] = useState(16);
  const regionId = useId();
  const notes = hosts.filter(host => host.notes);
  if (!description && !notes.length && !error) return null;
  return <div className="ape-reading-panel">
    <div className="ape-reading-toolbar">
      <h3 id={`${regionId}-title`}>About the day & notes</h3>
      <div className="ape-reading-controls" role="group" aria-label="Description and notes text size">
        <button type="button" aria-label="Make description and notes text smaller" aria-controls={regionId} disabled={textSize <= 16} onClick={() => setTextSize(size => Math.max(16, size - 3))}>A−</button>
        <span role="status" aria-live="polite">{textSize === 16 ? "Standard" : textSize === 19 ? "Large" : "Largest"}</span>
        <button type="button" aria-label="Make description and notes text bigger" aria-controls={regionId} disabled={textSize >= 22} onClick={() => setTextSize(size => Math.min(22, size + 3))}>A+</button>
      </div>
    </div>
    <div id={regionId} className="ape-reading-scroll" role="region" aria-labelledby={`${regionId}-title`} tabIndex={0} style={{ "--ape-reading-size": `${textSize / 16}rem` }}>
      <div className="ape-notes-list">
        {description && <p className="ape-detail-text">{description}</p>}
        {notes.map(host => <div key={host.id} className="ape-note">{host.notes}</div>)}
        {error && <Status error="Event host notes couldn’t load." retry={retry}/>}
      </div>
    </div>
  </div>;
}

export default function AnnualPrideEventDetails({ event: suppliedEvent, loading: suppliedLoading, error: suppliedError, onRetry }) {

  const supplied = suppliedEvent !== undefined;

  const annual = usePrideResource(`/pride/${PRIDE_ID}/annual`, !supplied);

  const artists = usePrideResource("/hireband/public");

  const hosts = usePrideResource(`/api/pride/${PRIDE_ID}/event-hosts`);

  const schedule = usePrideResource(`/eventitinerary/pride/${PRIDE_ID}`);

  const event = supplied ? suppliedEvent : annual.data;

  const loading = supplied ? suppliedLoading : annual.loading;

  const error = supplied ? suppliedError : annual.error;

  const [showMap, setShowMap] = useState(false);

  const { featuredArtists, itineraryHosts } = useMemo(() => {

    const performers = new Map(), hostsById = new Map();

    (Array.isArray(schedule.data) ? schedule.data : []).forEach(item => {

      (item.performers || []).forEach(person => performers.set(person.id, person));

      (item.hosts || []).forEach(person => hostsById.set(person.id, person));

    });

    const related = (Array.isArray(event?.related_artist_ids) ? event.related_artist_ids : []).map(Number);

    return { featuredArtists: performers.size ? [...performers.values()] : (Array.isArray(artists.data) ? artists.data : []).filter(person => related.includes(Number(person.id))), itineraryHosts: [...hostsById.values()] };

  }, [schedule.data, event, artists.data]);

  const eventHosts = Array.isArray(hosts.data?.event_hosts) ? hosts.data.event_hosts : [];

  const address = [event?.address, event?.city, event?.state].filter(Boolean).join(", ");

  const mapSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`;

  return <><style>{STYLES}</style>

    <Section tone="mint" id="pride-details" eyebrow="Plan a day that feels like you" title={<>A city full of <em>Pride.</em></>} intro="The details, the people, and the places bringing us together.">

      {loading || error ? <Status loading={loading} error={error} retry={onRetry || annual.retry}/> : !event ? <Status empty="Annual Pride Festival details are coming soon."/> : <div className="ape-event-summary"><div className="ape-event-facts">{address && <div className="ape-map-preview"><iframe title={`Event location preview: ${address}`} src={mapEmbed} loading="lazy" tabIndex={-1} aria-hidden="true"/><button type="button" onClick={() => setShowMap(true)} aria-haspopup="dialog" aria-label="Open event map"><span><FaMapMarkerAlt aria-hidden="true"/> Explore the neighborhood ↗</span></button></div>}<div className="ape-fact"><FaCalendarAlt aria-hidden="true"/><div><strong>{formatDate(event.date)}</strong>{(event.start_time || event.end_time) && <small>{formatTime(event.start_time)}{event.end_time && ` – ${formatTime(event.end_time)}`}</small>}</div></div>{address && <div className="ape-fact"><FaMapMarkerAlt aria-hidden="true"/><div><strong>{event.address || address}</strong>{event.address && <small>{[event.city, event.state].filter(Boolean).join(", ")}</small>}<button type="button" className="ape-location-button" aria-haspopup="dialog" onClick={() => setShowMap(true)}>View the event map ↗</button></div></div>}<div className="ape-link-row">{safeHref(event.eventbrite_url) && <ExternalLink className="ape-button ape-button-primary" href={event.eventbrite_url}><FaTicketAlt aria-hidden="true"/>Get tickets ↗</ExternalLink>}{address && <ExternalLink href={mapSearch}>Get directions ↗</ExternalLink>}</div></div><ReadableNotes description={event.description} hosts={eventHosts} error={hosts.error} retry={hosts.retry}/></div>}

    </Section>

    <div id="pride-itinerary" className="ape-itinerary-slot"><PrideItinerary /></div>

    <Section id="pride-talent" tone="pink" eyebrow="Drag · Bands · Artists · DJs" title={<>Meet the <em>magic-makers.</em></>} intro="The voices, personalities, and creative spirits lighting up the celebration.">

      {schedule.loading || artists.loading ? <Status loading/> : <>{featuredArtists.length ? <People people={featuredArtists}/> : <Status error={artists.error || schedule.error} retry={() => { artists.retry(); schedule.retry(); }} empty="Our artist lineup is coming soon."/>}{itineraryHosts.length > 0 && <><h3 className="ape-host-heading">Behind the mic <span aria-hidden="true">✦</span> DJs & hosts</h3><People people={itineraryHosts} hosts/></>}{schedule.error && featuredArtists.length > 0 && <Status error="Additional itinerary performers and hosts couldn’t load." retry={schedule.retry}/>}</>}

    </Section>

    {showMap && address && <Modal wide title="Find us at Pride" onClose={() => setShowMap(false)}><iframe className="ape-map" title={`Pride event location: ${address}`} src={mapEmbed} loading="lazy" allowFullScreen/><p className="ape-detail-time">{address}</p><ExternalLink href={mapSearch}>Open directions in Google Maps ↗</ExternalLink></Modal>}

  </>;

}

const STYLES = `

.ape-scope{--ape-text:#49364f;--ape-muted:#735f75;--ape-line:#dfd0de;--ape-accent:#89507e;--ape-wash:#f7e9f2;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:14px;line-height:1.65;color:var(--ape-text);color-scheme:light;-webkit-font-smoothing:antialiased}

.ape-scope *{box-sizing:border-box}.ape-scope :is(h1,h2,h3,h4,p,figure){margin:0}.ape-scope a{color:inherit}.ape-scope button,.ape-scope input,.ape-scope select{font:inherit}.ape-scope button{cursor:pointer}.ape-scope button:disabled{cursor:default;opacity:.35}.ape-scope :is(a,button,input,select,[tabindex="0"]):focus-visible{outline:3px solid #8754a0;outline-offset:4px}.ape-scope [hidden]{display:none!important}.ape-scope em{font-family:Georgia,"Times New Roman",serif;font-weight:400}.ape-container{width:97%;max-width:1560px;padding-inline:clamp(12px,2.3vw,34px);margin-inline:auto;min-width:0}.ape-page{background:#fcf9f5;min-height:100vh;padding-top:var(--hape-header-offset,64px)}

.ape-band{width:100%;border-block-start:1px solid var(--ape-line);border-radius:0;padding-block:36px 40px;scroll-margin-top:calc(var(--hape-header-offset,64px) + 12px)}

.ape-band-cream{background:#fcf8ee;--ape-accent:#806529;--ape-line:#e2d4b6;--ape-wash:#f8edce}.ape-band-mint{background:#edf6f1;--ape-accent:#2c6e54;--ape-line:#bfd9cb;--ape-wash:#dff1e7}.ape-band-pink{background:#fbecf1;--ape-accent:#98385e;--ape-line:#e7c8d5;--ape-wash:#f6dce7}.ape-band-lavender{background:#f0eafa;--ape-accent:#785297;--ape-line:#d2c4e5;--ape-wash:#e8dcf6}.ape-band-blue{background:#ebf2fc;--ape-accent:#3a6199;--ape-line:#c5d5eb;--ape-wash:#dfebfc}

.ape-section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;padding-bottom:20px;border-bottom:1px solid var(--ape-line);margin-bottom:24px}.ape-eyebrow{font-size:10px;font-weight:750;letter-spacing:1.7px;text-transform:uppercase;color:var(--ape-accent)}.ape-section-head h2{font-size:clamp(29px,3.2vw,43px);letter-spacing:-1.1px;line-height:1.18;font-weight:600;margin-top:7px}.ape-section-head h2 em{color:var(--ape-accent)}.ape-intro{max-width:740px;font-size:13px;line-height:1.8;color:var(--ape-muted);margin-top:10px!important}.ape-count{font-size:11px;white-space:nowrap;color:var(--ape-accent)}

.ape-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:9px 17px;border:1px solid var(--ape-line);border-radius:99px;background:#fffafde6;color:var(--ape-accent)!important;font-size:12px!important;font-weight:650;text-decoration:none;transition:background .2s,transform .2s}.ape-button:hover{background:var(--ape-wash);transform:translateY(-1px)}.ape-button-primary{background:#79517f;color:#fff!important;border-color:#79517f}.ape-button-primary:hover{background:#62406a}.ape-icon-button{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:44px;height:44px;border:1px solid var(--ape-line);border-radius:50%;background:#fffc;color:var(--ape-accent)}.ape-icon-button:hover:not(:disabled){background:var(--ape-wash)}.ape-link-row{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;margin-top:20px}.ape-inline-link{display:inline-flex;align-items:center;gap:7px;min-height:44px;font-size:13px;color:var(--ape-accent)!important;text-decoration:underline!important;text-decoration-thickness:1px;text-underline-offset:5px;overflow-wrap:anywhere}.ape-inline-link:hover{text-decoration-thickness:2px!important}

.ape-state{padding:25px 16px;text-align:center;color:var(--ape-muted);font-size:13px}.ape-state .ape-button{margin-top:15px}.ape-loading-line{display:block;width:100px;height:3px;margin:0 auto 15px;background:linear-gradient(90deg,#d5668b,#dcb956,#62a381,#748ecd,#a276bb);animation:ape-soft-pulse 1.8s ease-in-out infinite}.ape-image-fallback{display:flex!important;align-items:center;justify-content:center;flex-direction:column;gap:7px;text-align:center;padding:14px;background:linear-gradient(135deg,#f8e0e9,#fff1d2,#dff0e8,#e4eafa,#f0e0f6);color:#76547c;font-weight:650;overflow-wrap:anywhere}.ape-image-fallback>span:first-child{font-size:29px;font-family:Georgia,serif}

.ape-modal{position:fixed;inset:0;z-index:2200;display:flex;align-items:center;justify-content:center;padding:18px;background:#271b37b8;backdrop-filter:blur(7px)}.ape-modal-panel{width:100%;max-width:620px;max-height:92vh;max-height:92dvh;display:flex;flex-direction:column;min-height:0;border:1px solid #e1cce4;border-top:4px solid #ac7fb6;border-radius:18px;background:#fffbfd;box-shadow:0 25px 90px #140c2940;overflow:hidden}.ape-modal-wide{max-width:960px}.ape-modal-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:17px 21px;border-bottom:1px solid var(--ape-line);flex-shrink:0}.ape-modal-head h2{font-size:23px;font-weight:600;letter-spacing:-.5px;line-height:1.25;overflow-wrap:anywhere}.ape-modal-body{overflow-y:auto;overscroll-behavior:contain;padding:22px;min-height:0}.ape-detail-image{display:block;max-width:100%;width:100%;height:210px;object-fit:contain;background:#fff;margin-bottom:20px}.ape-detail-type{font-size:12px;font-weight:700;color:var(--ape-accent);margin-bottom:12px!important}.ape-detail-text{font-size:14px;line-height:1.85;white-space:pre-line;overflow-wrap:anywhere}.ape-map{display:block;width:100%;height:380px;border:0;background:#e8e4e9}.ape-detail-time{font-size:12px;color:var(--ape-muted);margin-top:13px!important}

.ape-event-summary{display:grid;grid-template-columns:1.1fr .9fr;gap:24px;align-items:start}.ape-event-facts{display:grid;gap:12px}.ape-fact{display:flex;gap:12px;align-items:flex-start;font-size:14px}.ape-fact>svg{flex-shrink:0;color:var(--ape-accent);margin-top:5px}.ape-fact small{display:block;color:var(--ape-muted);font-size:12px;margin-top:3px}.ape-notes-list{display:grid;gap:14px}.ape-note{border-left:2px solid #91b6a3;padding-left:16px;color:var(--ape-muted);font-size:13px;white-space:pre-line;line-height:1.85}.ape-location-button{border:0;border-bottom:1px solid var(--ape-accent);background:none;color:var(--ape-accent);padding:0;min-height:44px;font-size:12px!important;font-weight:650}

.ape-location-tabs{display:flex;gap:20px;overflow-x:auto;padding-bottom:7px;margin-bottom:16px;scrollbar-width:thin}.ape-location-tabs button{flex-shrink:0;min-height:44px;padding:7px 2px;border:0;border-bottom:2px solid transparent;background:none;color:#776141;font-size:12px;font-weight:650}.ape-location-tabs button[aria-pressed="true"]{border-color:#976322;color:#6b481d}.ape-schedule-row{display:grid;grid-template-columns:104px minmax(0,1fr);gap:20px;padding:22px 0;border-bottom:1px solid #e5d7bd}.ape-schedule-row:last-child{border-bottom:0}.ape-schedule-time{display:flex;flex-direction:column;color:#896125;font-size:12px;font-weight:700;line-height:1.8;padding-top:2px}.ape-schedule-time span{font-size:11px;font-weight:400;color:#796b53}.ape-schedule-content h3{font-size:21px;font-weight:600;letter-spacing:-.4px;line-height:1.3}.ape-schedule-description{max-width:850px;white-space:pre-line;font-size:13px;color:#77654e;margin-top:9px!important}.ape-mini-people{display:flex;gap:15px;overflow-x:auto;padding-block:14px 4px;scrollbar-width:thin}.ape-mini-person{display:flex;align-items:center;gap:9px;min-width:120px;max-width:205px;flex-shrink:0;text-decoration:none}.ape-mini-person img,.ape-mini-person>.ape-image-fallback{width:40px;height:40px;object-fit:cover;border-radius:50%;flex-shrink:0}.ape-mini-person>.ape-image-fallback{font-size:0;padding:0}.ape-mini-person>.ape-image-fallback>span:first-child{font-size:20px}.ape-mini-person strong{font-size:11px;line-height:1.4;display:block;overflow-wrap:anywhere}.ape-mini-person small{font-size:9px;color:var(--ape-muted)}.ape-lineup{display:grid;grid-template-columns:repeat(auto-fill,minmax(135px,1fr));gap:23px 16px}.ape-person{text-align:center;text-decoration:none;min-width:0}.ape-person .ape-portrait{display:block;width:100%;aspect-ratio:1;object-fit:cover;border:5px solid #fff;box-shadow:0 5px 14px #8b456617;border-radius:4px;transition:transform .25s}.ape-person:hover .ape-portrait{transform:translateY(-3px) rotate(-1deg)}.ape-person strong{display:block;font-size:13px;margin-top:9px;line-height:1.4;overflow-wrap:anywhere}.ape-person small{font-size:10px;color:#956276}.ape-host-heading{font-size:18px;font-weight:600;margin:27px 0 17px!important;padding-top:22px;border-top:1px solid #e7c8d5}

@keyframes ape-soft-pulse{0%,100%{opacity:.4}50%{opacity:1}}

@media(min-width:1400px){.ape-lineup{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}}

@media(max-width:760px){.ape-band{padding-block:27px 30px}.ape-section-head{gap:12px;margin-bottom:19px;padding-bottom:17px}.ape-section-head h2{font-size:31px}.ape-hero{padding-block:25px 20px}.ape-hero-grid{grid-template-columns:1fr;gap:24px;text-align:center}.ape-hero-logo{grid-row:1;width:min(53vw,210px);transform:rotate(-2deg)}.ape-hero-logo img,.ape-hero-logo>.ape-image-fallback{height:145px}.ape-hero-logo figcaption{font-size:13px}.ape-hero h1{font-size:clamp(38px,8vw,53px);letter-spacing:-1.6px;margin:13px 0 16px}.ape-hero-copy>p:not(.ape-eyebrow){font-size:14px;margin-inline:auto}.ape-hero-date .ape-inline-link{justify-content:center}.ape-hero-date{margin-top:9px}.ape-values{justify-content:center;gap:6px 12px;margin-top:14px}.ape-values li{font-size:10px}.ape-quick-nav{gap:20px;margin-top:19px;padding-top:9px}.ape-quick-nav a{font-size:11px}.ape-event-summary{grid-template-columns:1fr;gap:20px}.ape-footer-grid{grid-template-columns:1fr 1fr;gap:25px}.ape-footer-grid>div:first-child{grid-column:1/-1}.ape-modal{padding:10px}.ape-modal-panel{max-height:94dvh}.ape-modal-head{padding:13px 16px}.ape-modal-head h2{font-size:20px}.ape-modal-body{padding:17px}.ape-lineup{grid-template-columns:repeat(3,minmax(0,1fr));gap:20px 12px}.ape-directory-art{height:135px}.ape-rail>*{flex-basis:200px}}

@media(max-width:480px){.ape-filters{grid-template-columns:1fr;gap:9px}.ape-filters input,.ape-filters select{font-size:16px}.ape-directory-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.ape-directory-grid .ape-directory-art{height:106px}.ape-directory-grid h3{font-size:14px}.ape-directory-copy{padding-inline:3px}.ape-directory-card{padding:6px 6px 11px}.ape-schedule-row{grid-template-columns:72px minmax(0,1fr);gap:12px;padding-block:18px}.ape-schedule-time{font-size:11px}.ape-schedule-time span{font-size:10px}.ape-schedule-content h3{font-size:19px}.ape-schedule-description{font-size:12px}.ape-lineup{grid-template-columns:repeat(2,minmax(0,1fr))}.ape-footer-grid{grid-template-columns:1fr;gap:23px}.ape-footer-grid>div:first-child{grid-column:auto}.ape-detail-image{height:170px}.ape-map{height:310px}.ape-section-head{align-items:start}.ape-count{font-size:10px;margin-top:6px}}

@media(prefers-reduced-motion:reduce){.ape-scope *{animation:none!important;transition:none!important;scroll-behavior:auto!important}.ape-directory-card:hover,.ape-person:hover .ape-portrait{transform:none}}

@media(forced-colors:active){.ape-hero h1 em{background:none;color:CanvasText}.ape-directory-card,.ape-hero-logo{border:1px solid CanvasText}.ape-welcome p{text-shadow:none;color:CanvasText}}

.ape-map-preview{position:relative;min-width:0;height:172px;overflow:hidden;background:#dde9e1;border:1px solid #bcd3c4;margin-bottom:4px}

.ape-map-preview iframe{display:block;width:100%;height:100%;border:0;pointer-events:none}

.ape-map-preview>button{position:absolute;inset:0;display:flex;align-items:flex-end;padding:12px;border:0;background:linear-gradient(0deg,#193a2d70,transparent 65%);text-align:left}

.ape-map-preview>button>span{display:inline-flex;align-items:center;gap:8px;min-height:36px;background:#fffcf5f2;padding:7px 12px;color:#315d49;font-size:12px;font-weight:650}

.ape-map-preview>button:focus-visible{outline-offset:-5px}

.ape-itinerary-slot{width:100%;scroll-margin-top:calc(var(--hpc-header-offset,64px) + 12px)}

.ape-band-mint{border-top:3px solid #8cb7a0}

.ape-band-pink{border-top:3px solid #d99ab6}

.ape-person .ape-portrait{border-top:5px solid #fff;box-shadow:0 6px 17px #84405e14}

.ape-section-head h2 em{background:linear-gradient(100deg,#a63061,#a25c2b,#7b6d20,#377653,#476daa,#88539b);background-clip:text;-webkit-background-clip:text;color:transparent;padding-right:4px}

.ape-event-summary{grid-template-columns:minmax(240px,.8fr) minmax(0,1.2fr);gap:clamp(22px,4vw,60px)}

.ape-lineup{grid-template-columns:repeat(auto-fill,minmax(135px,1fr))}

@media(max-width:760px){.ape-event-summary{grid-template-columns:1fr;gap:20px}.ape-lineup{grid-template-columns:repeat(3,minmax(0,1fr))}.ape-map-preview{height:155px}.ape-section-head h2{font-size:clamp(28px,7vw,36px)}}

@media(max-width:420px){.ape-lineup{grid-template-columns:repeat(2,minmax(0,1fr));gap:19px 12px}.ape-person strong{font-size:12px}}

@media(forced-colors:active){.ape-section-head h2 em{color:CanvasText;background:none}}

/* Toolbar stays visible while long descriptions and host notes scroll below. */
.ape-reading-panel{min-width:0;border:1px solid #b6cfc0;background:#fffef9;box-shadow:0 5px 18px #264e3510}
.ape-reading-toolbar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 12px;padding:10px 14px;border-bottom:1px solid #c6dbcf;background:#e3f0e7}
.ape-reading-toolbar h3{font-size:14px;font-weight:750;color:#294c3a}
.ape-reading-controls{display:flex;align-items:center;gap:8px}
.ape-reading-controls button{display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;border:1px solid #8daa99;border-radius:5px;background:#fffefa;color:#244632;font-size:18px;font-weight:750;line-height:1}
.ape-reading-controls button:hover:not(:disabled){background:#cde5d6;border-color:#38654b}
.ape-reading-controls button:disabled{opacity:.48}
.ape-reading-controls>span{min-width:60px;text-align:center;font-size:12px;color:#385341}
.ape-reading-scroll{max-height:340px;max-height:min(340px,48dvh);overflow-y:auto;overflow-x:hidden;scrollbar-gutter:stable;padding:16px 18px;scrollbar-color:#678b75 #e4ece6;scrollbar-width:thin;-webkit-overflow-scrolling:touch}
.ape-reading-scroll:focus-visible{outline:3px solid #735389;outline-offset:-3px}
.ape-reading-scroll::-webkit-scrollbar{width:7px}
.ape-reading-scroll::-webkit-scrollbar-thumb{background:#678b75;border-radius:6px}
.ape-reading-scroll::-webkit-scrollbar-track{background:#e4ece6}
.ape-reading-scroll .ape-detail-text,.ape-reading-scroll .ape-note{font-size:var(--ape-reading-size,1rem);line-height:1.8;color:#344c3e;overflow-wrap:anywhere;white-space:pre-line}
.ape-reading-scroll .ape-note{padding-left:13px;border-left:3px solid #8cab96}
@media(max-width:480px){.ape-reading-toolbar{padding:9px 12px}.ape-reading-scroll{padding:14px;max-height:300px;max-height:min(300px,45dvh)}}
`;
