import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import axios from "axios";

import { useReducedMotion } from "framer-motion";

import { FaChevronLeft, FaChevronRight, FaClock, FaHeadphones, FaMapMarkerAlt } from "react-icons/fa";

const API = "https://singspacebackend.onrender.com";

const PINS = ["#d9577f", "#d98a3d", "#c9a72c", "#3f9a6e", "#4f7fd0", "#9a62b8"];

function formatTime(time) {

  if (!time) return "TBD";

  const [h, m = "0"] = String(time).split(":");

  const hours = Number(h), minutes = Number(m);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return "TBD";

  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

}

function timeRange(start, end) {

  if (!start && !end) return "Time to be announced";

  if (!end) return formatTime(start);

  return `${formatTime(start)} – ${formatTime(end)}`;

}

function karaoverseLink(kind, slug) {

  return slug ? `https://karaoverse.com/${kind}/${encodeURIComponent(slug)}` : "";

}

function Portrait({ src, name }) {

  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return <span className="hcp3-it-portrait" aria-hidden="true">{src && !failed ? <img src={src} alt="" loading="lazy" onError={() => setFailed(true)}/> : <span className="hcp3-it-initial">{(name || "✦").trim().charAt(0).toUpperCase()}</span>}</span>;

}

function ItineraryCard({ item, pin }) {

  const performers = Array.isArray(item.performers) ? item.performers : [];

  const hosts = Array.isArray(item.hosts) ? item.hosts : [];

  return <article className="hcp3-it-card" style={{ "--pin": pin }}>

    <p className="hcp3-it-time"><FaClock aria-hidden="true"/>{timeRange(item.start_time, item.end_time)}</p>

    <h3>{item.title || "Pride moment"}</h3>

    {item.description && <p className="hcp3-it-desc">{item.description}</p>}

    {performers.length > 0 && <div className="hcp3-it-group">

      <h4>Featured artists <span>{performers.length} {performers.length === 1 ? "artist" : "artists"}</span></h4>

      <ul className="hcp3-it-artists">{performers.map((performer, index) => {

        const href = karaoverseLink("artist", performer.slug);

        const inner = <><Portrait src={performer.image_url} name={performer.artist_name}/><span className="hcp3-it-name">{performer.artist_name || "Artist"}</span></>;

        return <li key={performer.id ?? `${performer.slug}-${index}`}>{href ? <a className="hcp3-it-artist" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${performer.artist_name || "Artist"} on Karaoverse`}>{inner}</a> : <div className="hcp3-it-artist">{inner}</div>}</li>;

      })}</ul>

    </div>}

    {hosts.length > 0 && <div className="hcp3-it-group">

      <h4>Hosted by</h4>

      <ul className="hcp3-it-hosts">{hosts.map((host, index) => {

        const href = karaoverseLink("host", host.slug);

        const inner = <><span className="hcp3-it-host-icon" aria-hidden="true"><FaHeadphones/></span><span><small>Event host</small>{host.dj_name || "Host"}</span></>;

        return <li key={host.id ?? `${host.slug}-${index}`}>{href ? <a className="hcp3-it-host" href={href} target="_blank" rel="noopener noreferrer">{inner}</a> : <span className="hcp3-it-host">{inner}</span>}</li>;

      })}</ul>

    </div>}

  </article>;

}

export default function PrideItinerary({ prideId = 2, embedded = false }) {

  const reduced = useReducedMotion();

  const [items, setItems] = useState([]);

  const [status, setStatus] = useState("loading");

  const [attempt, setAttempt] = useState(0);

  const [activeLocation, setActiveLocation] = useState("");

  const [canPrev, setCanPrev] = useState(false), [canNext, setCanNext] = useState(false);

  const rail = useRef(null);

  useEffect(() => {

    let current = true;

    const controller = new AbortController();

    setStatus("loading");

    axios.get(`${API}/eventitinerary/pride/${prideId}`, { signal: controller.signal }).then(response => {

      if (!current) return;

      const list = Array.isArray(response.data) ? [...response.data] : [];

      list.sort((a, b) => {

        if (!a.start_time) return 1;

        if (!b.start_time) return -1;

        return String(a.start_time).localeCompare(String(b.start_time));

      });

      setItems(list);

      setStatus("ready");

    }).catch(error => {

      if (current && error.code !== "ERR_CANCELED") setStatus("error");

    });

    return () => { current = false; controller.abort(); };

  }, [prideId, attempt]);

  const locations = useMemo(() => [...new Set(items.map(item => item.location || "General"))], [items]);

  useEffect(() => {

    if (!locations.includes(activeLocation)) setActiveLocation(locations[0] || "");

  }, [locations, activeLocation]);

  const filtered = useMemo(() => items.filter(item => (item.location || "General") === activeLocation), [items, activeLocation]);

  const updateArrows = useCallback(() => {

    const el = rail.current;

    if (!el) return;

    setCanPrev(el.scrollLeft > 4);

    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);

  }, []);

  useEffect(() => {

    const el = rail.current;

    if (!el) return;

    el.scrollLeft = 0;

    updateArrows();

    el.addEventListener("scroll", updateArrows, { passive: true });

    window.addEventListener("resize", updateArrows);

    return () => { el.removeEventListener("scroll", updateArrows); window.removeEventListener("resize", updateArrows); };

  }, [filtered, updateArrows]);

  const scrollRail = direction => {

    const el = rail.current;

    if (el) el.scrollBy({ left: direction * el.clientWidth * .85, behavior: reduced ? "auto" : "smooth" });

  };

  // Nothing scheduled yet: keep the page tidy, same as before.

  if (status === "ready" && !items.length) return null;

  let body;

  if (status === "loading") {

    body = <div className="hcp3-state" role="status"><span className="hcp3-loading-line" aria-hidden="true"/>Pinning up the schedule…</div>;

  } else if (status === "error") {

    body = <div className="hcp3-state" role="alert">The itinerary couldn’t load. Please try again.<br/><button type="button" className="hcp3-button" onClick={() => setAttempt(value => value + 1)}>Try again</button></div>;

  } else {

    body = <>

      {locations.length > 1 && <div className="hcp3-it-picker">

        <p className="hcp3-it-label" id={`hcp3-it-locations-${prideId}`}>Choose a location</p>

        <div className="hcp3-it-locations" role="group" aria-labelledby={`hcp3-it-locations-${prideId}`}>{locations.map((location, index) => <button

          key={location} type="button" className="hcp3-it-tag" aria-pressed={location === activeLocation}

          style={{ "--pin": PINS[index % PINS.length] }} onClick={() => setActiveLocation(location)}

        ><FaMapMarkerAlt aria-hidden="true"/>{location}</button>)}</div>

      </div>}

      <div className="hcp3-it-board-head">

        <p className="hcp3-it-where"><FaMapMarkerAlt aria-hidden="true"/>{activeLocation}</p>

        <p className="hcp3-count">{filtered.length} {filtered.length === 1 ? "moment" : "moments"} on the board</p>

      </div>

      {filtered.length ? <ol ref={rail} className="hcp3-it-rail" tabIndex={0} aria-label={`Schedule for ${activeLocation}, scroll horizontally`}>

        {filtered.map((item, index) => <li key={item.id ?? `${item.title}-${index}`}><ItineraryCard item={item} pin={PINS[index % PINS.length]}/></li>)}

      </ol> : <p className="hcp3-it-empty">Nothing pinned for this location yet — check back soon.</p>}

      {(canPrev || canNext) && <div className="hcp3-it-controls">

        <p className="hcp3-it-hint">Swipe or use the arrows to see more ↔</p>

        <div className="hcp3-it-arrows">

          <button type="button" className="hcp3-icon-button" onClick={() => scrollRail(-1)} disabled={!canPrev} aria-label="Previous schedule items"><FaChevronLeft aria-hidden="true"/></button>

          <button type="button" className="hcp3-icon-button" onClick={() => scrollRail(1)} disabled={!canNext} aria-label="More schedule items"><FaChevronRight aria-hidden="true"/></button>

        </div>

      </div>}

    </>;

  }

  return <>

    <style>{ITINERARY_STYLES}</style>

    {embedded ? <div className="hcp3-scope hcp3-it">{body}</div> : <section id="pride-itinerary" className="hcp3-scope hcp3-band hcp3-band-cork hcp3-it">

      <div className="hcp3-container">

        <header className="hcp3-section-head"><div><p className="hcp3-eyebrow">Plan your Pride</p><h2>The <em>itinerary.</em></h2><p className="hcp3-intro">Pick a location, then browse what’s happening, when, and who’s taking the stage.</p></div></header>

        {body}

      </div>

    </section>}

  </>;

}

const ITINERARY_STYLES = `

.hcp3-band-cork{background-color:#f4e9da;background-image:radial-gradient(#dcc6a6 .8px,transparent 1.2px),radial-gradient(#e9d8bf .8px,transparent 1.2px);background-size:15px 15px,23px 23px;background-position:0 0,7px 11px;--hcp3-accent:#8a5a2b;--hcp3-line:#e0ceb4;--hcp3-wash:#f3e5cf;border-top:3px solid #d2b48c}

.hcp3-it-label{font-size:10px;font-weight:750;letter-spacing:1.7px;text-transform:uppercase;color:var(--hcp3-accent);margin:0 0 10px!important}

.hcp3-it-locations{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:24px}

.hcp3-it-tag{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:8px 15px 8px 12px;background:#fffdf8;border:1px solid #e3d3bd;border-radius:3px;color:var(--hcp3-text);font-size:13px;font-weight:650;box-shadow:0 2px 0 #eadcc8,0 6px 14px #6b4a2a12;transition:background .2s,color .2s,transform .2s}

.hcp3-it-tag svg{color:var(--pin)}

.hcp3-it-tag:hover{transform:translateY(-1px);background:#fff}

.hcp3-it-tag[aria-pressed="true"]{background:#3a2a40;border-color:#3a2a40;color:#fff8ff;box-shadow:0 2px 0 var(--pin),0 8px 18px #3a2a4029}

.hcp3-it-board-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap}

.hcp3-it-where{display:inline-flex;align-items:center;gap:8px;font-family:Georgia,"Times New Roman",serif;font-style:italic;font-size:21px;color:var(--hcp3-text)}

.hcp3-it-where svg{font-size:15px;color:var(--hcp3-accent)}

.hcp3-it-rail{list-style:none;margin:0;padding:26px 8px 28px;display:flex;align-items:stretch;gap:24px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:8px;overscroll-behavior-x:contain;scrollbar-width:thin;scrollbar-color:#c9a983 transparent;-webkit-overflow-scrolling:touch}

.hcp3-it-rail::-webkit-scrollbar{height:6px}.hcp3-it-rail::-webkit-scrollbar-thumb{background:#c9a983;border-radius:4px}

.hcp3-it-rail>li{flex:0 0 clamp(270px,31%,410px);scroll-snap-align:start;display:flex}

.hcp3-it-card{position:relative;width:100%;padding:26px 20px 20px;background:#fffdf8;border:1px solid #e6d8c4;box-shadow:0 10px 24px #5a3b2014,0 2px 4px #5a3b200f;transform:rotate(-.8deg);transition:transform .25s,box-shadow .25s}

.hcp3-it-rail>li:nth-child(even) .hcp3-it-card{transform:rotate(.9deg)}

.hcp3-it-rail>li:nth-child(3n) .hcp3-it-card{transform:rotate(-.3deg)}

.hcp3-it-rail>li .hcp3-it-card:hover,.hcp3-it-rail>li .hcp3-it-card:focus-within{transform:rotate(0) translateY(-3px);box-shadow:0 16px 32px #5a3b201f,0 2px 4px #5a3b200f}

.hcp3-it-card:before{content:"";position:absolute;top:-9px;left:50%;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffffffa6 0 18%,transparent 24%),var(--pin);box-shadow:0 3px 4px #3a22142e,inset 0 -2px 0 #0000001f}

.hcp3-it-time{display:inline-flex;align-items:center;gap:7px;padding:4px 10px;background:var(--hcp3-wash);border:1px dashed #d4bc9a;font-size:12px;font-weight:700;color:#6c4a28;letter-spacing:.2px}

.hcp3-it-card h3{font-size:clamp(20px,2vw,25px);line-height:1.2;letter-spacing:-.5px;font-weight:650;margin-top:14px!important;overflow-wrap:anywhere}

.hcp3-it-desc{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-size:14px;line-height:1.7;color:var(--hcp3-muted);margin-top:10px!important;padding-top:10px;border-top:1px solid #efe3d2}

.hcp3-it-group{margin-top:18px}

.hcp3-it-group h4{display:flex;justify-content:space-between;align-items:baseline;gap:10px;font-size:10px;font-weight:750;letter-spacing:1.6px;text-transform:uppercase;color:var(--hcp3-accent);margin:0 0 10px}

.hcp3-it-group h4 span{letter-spacing:.3px;text-transform:none;font-weight:500;color:var(--hcp3-muted)}

.hcp3-it-artists{list-style:none;margin:0;padding:4px 2px 8px;display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:thin;scrollbar-color:#d8c3a5 transparent}

.hcp3-it-artists>li{flex:0 0 92px;scroll-snap-align:start}

.hcp3-it-artist{display:flex;flex-direction:column;align-items:center;gap:7px;text-align:center;text-decoration:none;color:var(--hcp3-text)}

.hcp3-it-portrait{display:block;width:72px;height:72px;border-radius:50%;padding:3px;background:#fff;border:2px solid var(--pin);box-shadow:0 4px 10px #5a3b201a;overflow:hidden;transition:transform .25s}

.hcp3-it-portrait img{display:block;width:100%;height:100%;border-radius:50%;object-fit:cover}

.hcp3-it-initial{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,#f8e0e9,#fff1d2,#dff0e8,#e4eafa);font-family:Georgia,serif;font-size:24px;color:#76547c}

.hcp3-it-name{font-size:12px;font-weight:650;line-height:1.3;overflow-wrap:anywhere}

a.hcp3-it-artist:hover .hcp3-it-portrait{transform:scale(1.05)}

a.hcp3-it-artist:hover .hcp3-it-name{text-decoration:underline;text-underline-offset:3px}

.hcp3-it-hosts{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}

.hcp3-it-host{display:inline-flex;align-items:center;gap:9px;min-height:44px;padding:5px 15px 5px 5px;border:1px solid var(--hcp3-line);border-radius:99px;background:#fff;text-decoration:none;color:var(--hcp3-text);font-size:13px;font-weight:650;line-height:1.25}

a.hcp3-it-host:hover{background:var(--hcp3-wash)}

.hcp3-it-host small{display:block;font-size:9px;letter-spacing:1.4px;text-transform:uppercase;color:var(--hcp3-muted);font-weight:700}

.hcp3-it-host-icon{display:grid;place-items:center;flex-shrink:0;width:34px;height:34px;border-radius:50%;background:var(--pin);color:#fff;font-size:14px}

.hcp3-it-controls{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:2px}

.hcp3-it-hint{font-size:12px;color:var(--hcp3-muted)}

.hcp3-it-arrows{display:flex;gap:8px}

.hcp3-it-empty{margin-top:20px!important;padding:30px 16px;text-align:center;font-family:Georgia,"Times New Roman",serif;font-style:italic;color:var(--hcp3-muted);background:#fffdf8;border:1px dashed #d8c3a5}

@media(max-width:760px){.hcp3-it-rail{gap:18px;padding-block:22px 24px}.hcp3-it-rail>li{flex-basis:82%}.hcp3-it-card{padding:24px 16px 18px}.hcp3-it-where{font-size:18px}.hcp3-it-locations{gap:8px;margin-bottom:20px}.hcp3-it-tag{font-size:12px;padding:8px 12px 8px 10px}.hcp3-it-hint{font-size:11px}}

@media(max-width:480px){.hcp3-it-rail>li{flex-basis:88%}.hcp3-it-artists>li{flex-basis:82px}.hcp3-it-portrait{width:64px;height:64px}}

@media(prefers-reduced-motion:reduce){.hcp3-it-card,.hcp3-it-tag,.hcp3-it-portrait{transition:none!important}}

@media(forced-colors:active){.hcp3-it-card,.hcp3-it-tag,.hcp3-it-host,.hcp3-it-empty{border:1px solid CanvasText}.hcp3-it-tag[aria-pressed="true"]{background:Highlight;color:HighlightText}.hcp3-it-card:before{forced-color-adjust:none}}
`;