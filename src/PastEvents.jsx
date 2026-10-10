// PastEvents.jsx — compact Pride scrapbook; sits below the live Events board.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaCalendarAlt, FaHandHoldingHeart, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaTimes, FaImages, FaHeart, FaExpand } from "react-icons/fa";
import missConnecticut from "./MissConnecticut";

// Add imported retrospective data objects here, newest events are sorted first.
const EVENTS = [missConnecticut];
const PAGE_SIZE = 10;
const INKS = ["#a13966", "#995222", "#7e661a", "#317452", "#4468ab", "#814ba0"];
const WASHES = ["#ffe5ef", "#ffecd8", "#fff3ce", "#dff3e8", "#e5edff", "#eee1fb"];
function parseDateOnly(raw) {
  const m = String(raw || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const [y, month, day] = m.slice(1).map(Number), date = new Date(y, month - 1, day);
  return date.getFullYear() === y && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}
function formatEventDate(raw) {
  return parseDateOnly(raw)?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) || raw || null;
}
function normalizeImages(images) {
  return (Array.isArray(images) ? images : []).map(image => typeof image === "string" ? { src: image, alt: "" } : image).filter(image => image && typeof image.src === "string" && image.src.trim());
}
function scrollBehavior() { return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"; }
function MemoryImage({ src, alt, ...props }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && !failed ? <img src={src} alt={alt} onError={() => setFailed(true)} {...props} /> : <span className="hpm-image-fallback" role="img" aria-label={alt}><FaImages aria-hidden="true" /><span>A memory worth keeping</span></span>;
}
export default function PastEvents() {
  const ordered = useMemo(() => [...EVENTS].filter(Boolean).sort((a,b) => (parseDateOnly(b.date)?.getTime() || 0) - (parseDateOnly(a.date)?.getTime() || 0)), []);
  if (!ordered.length) return null;
  return <section id="past-events" className="hpm-section" aria-labelledby="hpm-title"><style>{STYLES}</style>
    <div className="hpm-heading"><div><p className="hpm-eyebrow">Our community scrapbook</p><h2 id="hpm-title">Little moments.<br className="hpm-mobile-break" /> <em>Lasting Pride.</em></h2><p className="hpm-intro">Nights we showed up for each other — captured with love.</p></div><span className="hpm-heading-note"><FaHeart aria-hidden="true" /> Swipe. Explore. Remember.</span></div>
    <div className="hpm-albums">{ordered.map((event,index) => <MemoryAlbum key={event.id || event.name || index} event={event} index={index} />)}</div>
  </section>;
}
function MemoryAlbum({ event, index }) {
  const shots = useMemo(() => normalizeImages(event.images), [event.images]);
  const [page, setPage] = useState(0), [viewer, setViewer] = useState(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const railRef = useRef(null);
  const pageCount = Math.max(1, Math.ceil(shots.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1), start = safePage * PAGE_SIZE;
  const visible = shots.slice(start, start + PAGE_SIZE);
  const dateLabel = formatEventDate(event.date);
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    rail.scrollLeft = 0;
    const update = () => setEdges({ left: rail.scrollLeft > 2, right: rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 2 });
    update(); rail.addEventListener("scroll", update, { passive: true });
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(rail); window.addEventListener("resize", update);
    return () => { rail.removeEventListener("scroll", update); observer?.disconnect(); window.removeEventListener("resize", update); };
  }, [safePage, shots.length]);
  const move = direction => {
    const rail = railRef.current;
    if (!rail) return;
    if (direction > 0 && !edges.right && safePage < pageCount - 1) { setPage(p => p + 1); return; }
    if (direction < 0 && !edges.left && safePage > 0) { setPage(p => p - 1); return; }
    const card = rail.querySelector(".hpm-polaroid");
    const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap) || 18;
    rail.scrollBy({ left: direction * ((card?.offsetWidth || 184) + gap), behavior: scrollBehavior() });
  };
  return <article className="hpm-album" style={{ "--album-wash": WASHES[index % 6], "--album-ink": INKS[index % 6], "--event-accent": event.accent || INKS[index % 6] }}>
    <header className="hpm-album-header"><div className="hpm-album-summary"><span className="hpm-album-number" aria-hidden="true">{String(index+1).padStart(2,"0")}</span><div><h3><button type="button" onClick={() => setViewer(0)}>{event.name}</button></h3><div className="hpm-meta">{dateLabel && <span><FaCalendarAlt aria-hidden="true" />{dateLabel}</span>}{event.location && <span><FaMapMarkerAlt aria-hidden="true" />{event.location}</span>}{event.cause && <span><FaHandHoldingHeart aria-hidden="true" />{event.cause}</span>}</div></div></div><div className="hpm-rail-controls"><span><FaImages aria-hidden="true" /> {shots.length}</span>{shots.length > 0 && <><button type="button" onClick={() => move(-1)} disabled={!edges.left && safePage===0} aria-label={`Previous photos from ${event.name}`}><FaChevronLeft aria-hidden="true" /></button><button type="button" onClick={() => move(1)} disabled={!edges.right && safePage===pageCount-1} aria-label={`Next photos from ${event.name}`}><FaChevronRight aria-hidden="true" /></button></>}</div></header>
    {event.blurb && <p className="hpm-blurb">{event.blurb}</p>}
    {shots.length > 0 ? <><div ref={railRef} className="hpm-rail" role="region" aria-label={`${event.name} photo strip`} tabIndex={0} onKeyDown={e => { if(e.target!==e.currentTarget)return;if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();move(e.key==="ArrowRight"?1:-1);} }}>
      {visible.map((shot,i) => { const flatIndex=start+i; return <button type="button" className="hpm-polaroid" key={`${shot.src}-${flatIndex}`} onClick={() => setViewer(flatIndex)} aria-label={`Open ${event.name}, photo ${flatIndex+1} of ${shots.length}`} style={{ "--tilt": `${[-2,1.6,-1,2,.3][i%5]}deg`, "--tape": WASHES[(index+i)%6] }}><span className="hpm-tape" aria-hidden="true"/><span className="hpm-photo"><MemoryImage src={shot.src} alt={shot.alt || `${event.name} — photo ${flatIndex+1}`} loading="lazy" decoding="async"/><span className="hpm-expand" aria-hidden="true"><FaExpand /></span></span><span className="hpm-photo-caption">{shot.alt || "A little moment of Pride"}</span><span className="hpm-photo-footer"><span>{String(flatIndex+1).padStart(2,"0")}</span><span aria-hidden="true">✦</span><span>With love.</span></span></button>; })}
    </div><div className="hpm-album-bottom"><span>Click a Polaroid to open the full gallery</span>{pageCount>1 && <div className="hpm-pages"><button type="button" disabled={safePage===0} onClick={() => setPage(p=>Math.max(0,p-1))} aria-label="Previous ten photos"><FaChevronLeft aria-hidden="true"/></button><span aria-live="polite">{start+1}–{Math.min(start+PAGE_SIZE,shots.length)} of {shots.length}</span><button type="button" disabled={safePage===pageCount-1} onClick={() => setPage(p=>Math.min(pageCount-1,p+1))} aria-label="Next ten photos"><FaChevronRight aria-hidden="true"/></button></div>}</div></> : <button type="button" className="hpm-empty" onClick={() => setViewer(0)}><FaHeart aria-hidden="true"/> Read this community story <span aria-hidden="true">→</span></button>}
    {viewer!==null && <MemoryViewer event={event} shots={shots} initialIndex={viewer} onClose={() => setViewer(null)} />}
  </article>;
}
function MemoryViewer({ event, shots, initialIndex, onClose }) {
  const [index, setIndex] = useState(Math.min(initialIndex, Math.max(0,shots.length-1)));
  const [showStory, setShowStory] = useState(shots.length===0);
  const panelRef=useRef(null),closeRef=useRef(null),touchRef=useRef(null),closeCallback=useRef(onClose);
  closeCallback.current=onClose;
  const current=Math.min(index,Math.max(0,shots.length-1)), shot=shots[current];
  const move = direction => setIndex(i=>Math.max(0,Math.min(shots.length-1,i+direction)));
  useEffect(() => {
    const previous=document.activeElement, overflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const modalRoot=panelRef.current?.parentElement;
    const background=Array.from(document.body.children).filter(n=>n!==modalRoot&&n instanceof HTMLElement).map(n=>[n,n.inert]);background.forEach(([n])=>{n.inert=true;});
    closeRef.current?.focus({preventScroll:true});
    const key=e=>{
      if(e.key==="Escape"){e.preventDefault();closeCallback.current();}
      if(e.key==="ArrowRight"){e.preventDefault();setIndex(i=>Math.min(shots.length-1,i+1));}
      if(e.key==="ArrowLeft"){e.preventDefault();setIndex(i=>Math.max(0,i-1));}
      if(e.key!=="Tab")return;
      const nodes=Array.from(panelRef.current.querySelectorAll('button:not([disabled]),a[href]')).filter(n=>n.getClientRects().length);
      const first=nodes[0],last=nodes[nodes.length-1];
      if(e.shiftKey&&(document.activeElement===first||!panelRef.current.contains(document.activeElement))){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&(document.activeElement===last||!panelRef.current.contains(document.activeElement))){e.preventDefault();first.focus();}
    };
    document.addEventListener("keydown",key);
    return()=>{document.removeEventListener("keydown",key);document.body.style.overflow=overflow;background.forEach(([n,v])=>{n.inert=v;});if(previous?.isConnected)previous.focus?.({preventScroll:true});};
  },[shots.length]);
  return createPortal(<div className="hpm-modal" onClick={e=>{if(e.target===e.currentTarget)onClose();}}><section ref={panelRef} className="hpm-viewer" role="dialog" aria-modal="true" aria-labelledby="hpm-viewer-title"><header className="hpm-viewer-header"><div><p>From our community scrapbook</p><h2 id="hpm-viewer-title">{event.name}</h2></div><button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo gallery"><FaTimes aria-hidden="true"/></button></header>
    <div className="hpm-viewer-scroll">{shot && <figure className="hpm-full-photo"><div className="hpm-full-image" onTouchStart={e=>{touchRef.current=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;}} onTouchCancel={()=>{touchRef.current=null;}} onTouchEnd={e=>{const start=touchRef.current;touchRef.current=null;if(!start||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1);}}><MemoryImage key={shot.src} src={shot.src} alt={shot.alt || `${event.name} — photo ${current+1}`}/></div><figcaption>{shot.alt || event.name}</figcaption></figure>}
    <div className="hpm-viewer-toolbar">{shots.length>0&&<div className="hpm-photo-navigation"><button type="button" onClick={()=>move(-1)} disabled={current===0} aria-label="Previous photo"><FaChevronLeft aria-hidden="true"/></button><span aria-live="polite" aria-atomic="true">{current+1} / {shots.length}</span><button type="button" onClick={()=>move(1)} disabled={current===shots.length-1} aria-label="Next photo"><FaChevronRight aria-hidden="true"/></button></div>}<button className="hpm-story-button" type="button" aria-expanded={showStory} aria-controls="hpm-event-story" onClick={()=>setShowStory(v=>!v)}>{showStory?"Hide event story":"Read event story"}</button></div>
    {showStory&&<div id="hpm-event-story" className="hpm-story">{formatEventDate(event.date)&&<p><FaCalendarAlt aria-hidden="true"/>{formatEventDate(event.date)}</p>}{event.location&&<p><FaMapMarkerAlt aria-hidden="true"/>{event.location}</p>}{event.cause&&<p><FaHandHoldingHeart aria-hidden="true"/>{event.cause}</p>}{event.blurb&&<div>{event.blurb}</div>}</div>}
    </div>
  </section></div>,document.body);
}
const STYLES = `
.hpm-section,.hpm-modal{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.6;color:#55405c;-webkit-font-smoothing:antialiased;color-scheme:light}.hpm-section *,.hpm-modal *{box-sizing:border-box}.hpm-section{width:97%;max-width:1560px;margin-inline:auto;padding:20px clamp(12px,2.3vw,34px) 29px;scroll-margin-top:calc(var(--hpc-header-offset,64px) + 16px)}.hpm-section h2,.hpm-section h3,.hpm-section p,.hpm-modal h2,.hpm-modal p,.hpm-modal figure{margin:0}.hpm-section button,.hpm-modal button{font:inherit;cursor:pointer}.hpm-section button:focus-visible,.hpm-section [tabindex="0"]:focus-visible,.hpm-modal button:focus-visible{outline:3px solid #a477b7;outline-offset:4px}.hpm-section button:disabled,.hpm-modal button:disabled{cursor:default;opacity:.35}.hpm-heading{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:19px}.hpm-eyebrow{font-size:10px;color:#986f92;letter-spacing:1.3px;text-transform:uppercase;font-weight:650}.hpm-heading h2{font-weight:500;font-size:clamp(28px,3vw,40px);line-height:1.18;letter-spacing:-1px;margin-top:7px}.hpm-heading h2 em{font-family:Georgia,"Times New Roman",serif;font-weight:400;background:linear-gradient(105deg,#b63566,#a55b2c,#826c23,#367956,#436da8,#8b4d9e);background-clip:text;-webkit-background-clip:text;color:transparent;padding-right:3px}.hpm-mobile-break{display:none}.hpm-intro{font-size:12px;color:#92788c;margin-top:9px!important}.hpm-heading-note{display:flex;align-items:center;gap:8px;white-space:nowrap;font-family:Georgia,serif;font-style:italic;font-size:15px;color:#a47793}.hpm-heading-note>svg{font-size:11px;color:#c66f9b}.hpm-albums{display:grid;gap:18px}
.hpm-album{min-width:0;border:1px solid transparent;border-radius:23px;padding:17px 17px 11px;background:linear-gradient(120deg,#fff9f9,#fffaf3 35%,#f5faf6 68%,#f7f0fc) padding-box,linear-gradient(110deg,#e998b1,#eac18a,#dace8c,#a0d2b5,#adc5e9,#cca4e4) border-box;box-shadow:0 7px 22px #905a8310}.hpm-album-header{display:flex;align-items:center;justify-content:space-between;gap:14px}.hpm-album-summary{display:flex;align-items:center;gap:12px;min-width:0}.hpm-album-summary>div{min-width:0}.hpm-album-number{display:grid;place-items:center;width:39px;height:44px;border-radius:12px;background:var(--album-wash);color:var(--album-ink);font-family:Georgia,serif;font-style:italic;font-size:22px;flex-shrink:0;border-top:3px solid var(--event-accent)}.hpm-album h3{font-size:19px;line-height:1.25;font-weight:550;letter-spacing:-.3px;color:var(--album-ink);overflow-wrap:anywhere}.hpm-album h3>button{padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;min-height:44px}.hpm-album h3>button:hover{text-decoration:underline;text-underline-offset:4px}.hpm-meta{display:flex;flex-wrap:wrap;gap:4px 13px;font-size:10px;color:#8f788c}.hpm-meta>span{display:inline-flex;gap:6px;align-items:center}.hpm-meta svg{flex-shrink:0;color:#a580a0}.hpm-rail-controls{display:flex;align-items:center;gap:5px;flex-shrink:0}.hpm-rail-controls>span{font-size:11px;display:flex;align-items:center;gap:6px;margin-right:5px;color:#a18399}.hpm-rail-controls>button,.hpm-pages>button,.hpm-viewer-header>button,.hpm-photo-navigation>button{display:grid;place-items:center;width:44px;height:44px;border:1px solid #e1cbe1;border-radius:50%;background:#fffbfd;color:#8e608c;font-size:11px}.hpm-rail-controls>button:not(:disabled):hover,.hpm-pages>button:not(:disabled):hover{background:#f5e7f1}.hpm-blurb{color:#8c728a;font-size:12px;line-height:1.75;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-top:9px!important;max-width:900px}
.hpm-rail{display:flex;gap:22px;overflow-x:auto;padding:22px 9px 17px;scroll-snap-type:x proximity;scroll-padding-inline:9px;overscroll-behavior-x:contain;scrollbar-width:thin;scrollbar-color:#cca9c9 transparent;-webkit-overflow-scrolling:touch}.hpm-rail::-webkit-scrollbar{height:5px}.hpm-rail::-webkit-scrollbar-thumb{background:#cca9c9;border-radius:99px}.hpm-polaroid{position:relative;flex:0 0 184px;min-width:0;align-self:flex-start;scroll-snap-align:start;transform:rotate(var(--tilt));border:1px solid #e4d8df;border-radius:3px;padding:9px 9px 11px;background:#fffefd;box-shadow:0 4px 7px #5f3b6214,0 10px 17px #5f3b620c;text-align:left;transition:transform .2s,box-shadow .2s;color:#7c5b78}.hpm-polaroid:hover,.hpm-polaroid:focus-visible{transform:rotate(0) translateY(-3px);box-shadow:0 9px 19px #6d417324;z-index:1}.hpm-tape{position:absolute;top:-9px;left:calc(50% - 23px);width:46px;height:18px;z-index:1;background:var(--tape);opacity:.85;transform:rotate(-5deg);border-inline:1px dashed #987a962f}.hpm-photo{display:block;position:relative;width:100%;aspect-ratio:1;overflow:hidden;background:#f2e8f1}.hpm-photo img{display:block;width:100%;height:100%;object-fit:cover}.hpm-expand{position:absolute;right:6px;bottom:6px;display:grid;place-items:center;width:24px;height:24px;background:#fffdfae8;border-radius:50%;color:#865d87;font-size:10px}.hpm-photo-caption{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-family:Georgia,serif;font-style:italic;font-size:15px;line-height:1.3;margin-top:10px;height:39px}.hpm-photo-footer{display:flex;align-items:center;justify-content:space-between;font-size:9px;color:#b491a8;margin-top:6px;letter-spacing:.4px}.hpm-photo-footer>span:nth-child(2){color:#bf8fad}.hpm-album-bottom{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:10px;color:#a08599;padding-top:6px}.hpm-pages{display:flex;align-items:center;gap:6px;flex-shrink:0}.hpm-pages>span{min-width:92px;text-align:center;font-size:11px}.hpm-empty{display:flex;align-items:center;gap:10px;width:100%;min-height:70px;border:1px dashed #dcbfda;border-radius:14px;background:#fff9fc;color:#956889;font-size:13px!important;margin-top:14px;padding:18px;text-align:left}.hpm-image-fallback{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;width:100%;height:100%;min-height:140px;background:linear-gradient(130deg,#f8dce9,#faf0d6,#e1f1e7,#e7dffa);color:#a07695;padding:15px;text-align:center;font-size:12px}.hpm-image-fallback>svg{font-size:28px}
.hpm-modal{position:fixed;inset:0;z-index:2100;display:flex;align-items:center;justify-content:center;padding:20px;background:#25182fba;backdrop-filter:blur(7px)}.hpm-viewer{width:100%;max-width:1030px;max-height:94vh;max-height:94dvh;display:flex;flex-direction:column;min-height:0;background:linear-gradient(135deg,#fff8fa,#f8f3fc) padding-box,linear-gradient(110deg,#e985aa,#eec285,#dace7d,#8fc9a8,#95b6e4,#c497e0) border-box;border:2px solid transparent;border-radius:23px;box-shadow:0 25px 90px #120a2466;overflow:hidden}.hpm-viewer-header{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:16px 20px;border-bottom:1px solid #e8d9e6;flex-shrink:0}.hpm-viewer-header>div{min-width:0}.hpm-viewer-header p{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#a17a96}.hpm-viewer-header h2{font-size:20px;font-weight:500;line-height:1.3;color:#855a82;margin-top:5px;overflow-wrap:anywhere}.hpm-viewer-header>button{flex-shrink:0}.hpm-viewer-scroll{overflow-y:auto;min-height:0;padding:16px 20px 20px;overscroll-behavior:contain}.hpm-full-photo{padding:9px 9px 13px!important;background:#fffefd;border:1px solid #e3d8e0;box-shadow:0 4px 15px #6843690d}.hpm-full-image{height:min(58dvh,600px);display:flex;align-items:center;justify-content:center;background:#f3ecf2}.hpm-full-image img{display:block;width:100%;height:100%;object-fit:contain}.hpm-full-photo figcaption{font-family:Georgia,serif;font-style:italic;font-size:16px;color:#96758e;text-align:center;padding-top:10px;overflow-wrap:anywhere}.hpm-viewer-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding-top:13px}.hpm-photo-navigation{display:flex;align-items:center;gap:12px}.hpm-photo-navigation>span{font-size:12px;color:#98758f;min-width:53px;text-align:center}.hpm-story-button{min-height:44px;padding:10px 15px;border:1px solid #ddc4e0;border-radius:99px;background:#f7eafa;color:#895587;font-size:12px!important}.hpm-story{padding:17px;margin-top:13px;background:#f2e9f7;border:1px solid #e2cfe8;border-radius:15px;font-size:13px;color:#856b85}.hpm-story>p{display:flex;gap:9px;align-items:flex-start;margin-bottom:8px}.hpm-story>p>svg{flex-shrink:0;margin-top:4px;color:#a1749a}.hpm-story>div{white-space:pre-line;line-height:1.85;margin-top:12px}
@media(max-width:760px){.hpm-heading-note{display:none}.hpm-album-header{align-items:flex-start;flex-wrap:wrap;gap:8px}.hpm-rail-controls{margin-left:auto}.hpm-album-summary{flex:1 1 240px}.hpm-album-bottom{flex-wrap:wrap}.hpm-pages{margin-left:auto}.hpm-viewer-header{padding:13px 15px}.hpm-viewer-scroll{padding:13px 15px 16px}}
@media(max-width:520px){.hpm-section{padding:17px 10px 24px}.hpm-heading h2{font-size:29px}.hpm-mobile-break{display:block}.hpm-intro{font-size:12px}.hpm-album{padding:13px 11px 9px;border-radius:19px}.hpm-album h3{font-size:18px}.hpm-album-number{width:34px;height:40px;font-size:19px}.hpm-album-summary{gap:9px}.hpm-meta{font-size:10px;gap:4px 9px}.hpm-rail{gap:18px;padding:20px 7px 15px}.hpm-polaroid{flex-basis:158px;padding:8px 8px 10px}.hpm-photo-caption{font-size:14px;height:36px}.hpm-blurb{font-size:11px}.hpm-modal{padding:9px}.hpm-viewer{border-radius:18px;max-height:96dvh}.hpm-viewer-header h2{font-size:17px}.hpm-viewer-header p{font-size:8px}.hpm-viewer-scroll{padding:10px}.hpm-full-image{height:51dvh}.hpm-full-photo figcaption{font-size:14px}.hpm-story-button{font-size:11px!important;padding-inline:12px}.hpm-photo-navigation{gap:6px}.hpm-story{padding:14px;font-size:12px}}
@media(prefers-reduced-motion:reduce){.hpm-section *,.hpm-modal *{animation:none!important;transition:none!important;scroll-behavior:auto!important}.hpm-polaroid:hover,.hpm-polaroid:focus-visible{transform:rotate(0)}}
@media(forced-colors:active){.hpm-heading h2 em{background:none;color:CanvasText}.hpm-album,.hpm-polaroid,.hpm-viewer{border-color:CanvasText}}
`;
