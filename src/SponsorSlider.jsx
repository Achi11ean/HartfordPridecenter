import React, { useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";
import { FaTimes, FaGlobe, FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;
const ACCENTS = ["#96345f", "#995323", "#7b6520", "#326c54", "#3d60a0", "#79509b"];
const PAPERS = ["#f8e6ef", "#fbecdf", "#f7f0d9", "#e4f1e9", "#e6edfb", "#eee4f8"];

function safeHref(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  const raw = value.trim();
  if (/^[a-z][a-z\d+.-]*:/i.test(raw) && !/^https?:/i.test(raw)) return "";
  try { const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
}

function linkList(value) {
  const entries = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[\n,]+/) : [];
  return [...new Set(entries.map(safeHref).filter(Boolean))];
}

function CommunityImage({ src, alt, className = "", eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && !failed ? <img className={className} src={src} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)}/> : <span className={`sc-image-fallback ${className}`} role="img" aria-label={alt}><span aria-hidden="true">✦</span><span>{alt}</span></span>;
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
  return createPortal(<div className="sc-scope sc-modal" onClick={event => { if (event.target === event.currentTarget) onClose(); }}><motion.section ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`sc-modal-panel${wide ? " sc-modal-wide" : ""}`} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}><header className="sc-modal-head"><h2 id={titleId}>{title}</h2><button ref={close} type="button" className="sc-icon-button" onClick={onClose} aria-label="Close details"><FaTimes aria-hidden="true"/></button></header><div className="sc-modal-body">{children}</div></motion.section></div>, document.body);
}

function Rail({ children, label, resetKey }) {
  const ref = useRef(null), id = useId();
  const drag = useRef(null), suppressClick = useRef(false);
  const reduced = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: true });
  useEffect(() => {
    const node = ref.current;
    const update = () => setEdges({ start: node.scrollLeft < 2, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 2 });
    node.scrollLeft = 0; update();
    node.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = window.ResizeObserver ? new ResizeObserver(update) : null;
    observer?.observe(node);
    return () => { node.removeEventListener("scroll", update); window.removeEventListener("resize", update); observer?.disconnect(); };
  }, [resetKey, React.Children.count(children)]);
  const scroll = direction => ref.current?.scrollBy({ left: direction * ref.current.clientWidth * .8, behavior: reduced ? "auto" : "smooth" });
  return <div className="sc-rail-wrap"><div className="sc-rail" id={id} ref={ref}
      onPointerDown={event => { suppressClick.current = false; if (event.pointerType === "mouse" && event.button === 0) drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, active: false }; }}
      onPointerMove={event => { const start = drag.current; if (!start || event.buttons !== 1) return; const distance = event.clientX - start.x; if (Math.abs(distance) > 6 || start.active) { start.active = true; suppressClick.current = true; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.style.scrollSnapType = "none"; event.preventDefault(); event.currentTarget.scrollLeft = start.left - distance; } }}
      onPointerUp={event => { drag.current = null; event.currentTarget.style.removeProperty("scroll-snap-type"); }}
      onPointerCancel={event => { drag.current = null; event.currentTarget.style.removeProperty("scroll-snap-type"); }}
      onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}
      onDragStart={event => event.preventDefault()}
      aria-label={label} role="region" tabIndex={0}>{children}</div>{!(edges.start && edges.end) && <div className="sc-rail-footer"><span>Swipe or scroll to explore</span><div><button type="button" className="sc-icon-button" aria-label={`Previous ${label}`} aria-controls={id} disabled={edges.start} onClick={() => scroll(-1)}><FaArrowLeft/></button><button type="button" className="sc-icon-button" aria-label={`Next ${label}`} aria-controls={id} disabled={edges.end} onClick={() => scroll(1)}><FaArrowRight/></button></div></div>}</div>;
}

export default function SponsorSlider({ embedded = false }) {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [activeSponsor, setActiveSponsor] = useState(null);
  const reduced = useReducedMotion();
  const heading = useId();
  useEffect(() => {
    const controller = new AbortController();
    let current = true;
    setLoading(true); setError("");
    axios.get(`${API}/api/pride/${PRIDE_ID}/sponsors/approved`, { signal: controller.signal })
      .then(({ data }) => { if (!Array.isArray(data)) throw new Error("Invalid sponsor response"); if (current) setSponsors(data); })
      .catch(err => { if (current && err.code !== "ERR_CANCELED") setError("Our sponsor board couldn’t load. Please try again."); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; controller.abort(); };
  }, [attempt]);
  const website = safeHref(activeSponsor?.website);
  const socials = linkList(activeSponsor?.social_links);
  return <><style>{STYLES}</style><section className={`sc-scope sc-board${sponsors.length === 1 ? " sc-single" : ""}`} aria-label={embedded ? "Pride sponsor board" : undefined} aria-labelledby={embedded ? undefined : heading} aria-busy={loading}>
    {!embedded && <header className="sc-heading"><p>Community powered · Pride together</p><h2 id={heading}>A little support.<br/><em>A whole spectrum of possibility.</em></h2><span>Meet the generous people and organizations helping Pride shine.</span></header>}
    <div className="sc-board-caption"><span><FaHeart aria-hidden="true"/> Pinned with gratitude</span><span>{!loading && !error && `${sponsors.length} ${sponsors.length === 1 ? "sponsor" : "sponsors"}`}</span></div>
    {loading ? <div className="sc-state" role="status"><span className="sc-loading" aria-hidden="true"/>Gathering our Pride supporters…</div> : error ? <div className="sc-state" role="alert"><p>{error}</p><button type="button" className="sc-button" onClick={() => setAttempt(value => value + 1)}>Try again</button></div> : !sponsors.length ? <div className="sc-state">Our sponsors will be announced here soon. Good things are growing.</div> : <Rail label="sponsors">
      {sponsors.map((sponsor, index) => <motion.button type="button" key={sponsor.id} className="sc-sponsor-card" style={{ "--sc-accent": ACCENTS[index % 6], "--sc-paper": PAPERS[index % 6], "--sc-tilt": `${index % 2 ? 1.3 : -1.3}deg` }} aria-haspopup="dialog" onClick={() => setActiveSponsor(sponsor)} whileHover={reduced ? undefined : { y: -5, rotate: 0 }} whileTap={reduced ? undefined : { scale: .985 }}>
        <span className="sc-foil-tape" aria-hidden="true"/><span className="sc-card-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <div className="sc-logo"><CommunityImage src={sponsor.logo_url} alt={sponsor.organization || "Pride sponsor"}/></div>
        <div className="sc-sponsor-copy"><p className="sc-tier">{sponsor.tier ? `${sponsor.tier} sponsor` : "Pride sponsor"}</p><h3>{sponsor.organization}</h3><span className="sc-sponsor-cta">Meet our supporter <span aria-hidden="true">↗</span></span></div><span className="sc-spectrum-edge" aria-hidden="true"/>
      </motion.button>)}
    </Rail>}
    <p className="sc-board-signoff">Different colors. One community. <span aria-hidden="true">✦</span></p>
  </section>
  {activeSponsor && <Modal title={activeSponsor.organization || "Our Pride supporter"} onClose={() => setActiveSponsor(null)}><CommunityImage className="sc-detail-image" src={activeSponsor.logo_url} alt={activeSponsor.organization || "Pride sponsor"}/><p className="sc-detail-category">{activeSponsor.tier || "Pride"} Sponsor</p>{(activeSponsor.message || activeSponsor.additional_notes) && <p className="sc-description">{activeSponsor.message || activeSponsor.additional_notes}</p>}<div className="sc-links">{website && <a className="sc-button" href={website} target="_blank" rel="noopener noreferrer"><FaGlobe aria-hidden="true"/>Visit website ↗</a>}{socials.map((url, index) => <a key={url} className="sc-button sc-social-link" href={url} target="_blank" rel="noopener noreferrer">{socials.length === 1 ? "Social profile" : `Social profile ${index + 1}`} ↗</a>)}</div></Modal>}
  </>;
}

const STYLES = `

.sc-scope{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.6;color:#342a28;color-scheme:light;-webkit-font-smoothing:antialiased}.sc-scope *{box-sizing:border-box}.sc-scope :is(h2,h3,p){margin:0}.sc-scope :is(button,input,select){font:inherit}.sc-scope button{cursor:pointer}.sc-scope :is(a,button,input,select,[tabindex="0"]):focus-visible{outline:3px solid #5b3979;outline-offset:4px}.sc-scope a{color:#4d315b}.sc-scope button:disabled{opacity:.35;cursor:default}
.sc-board{width:100%;min-width:0;padding:clamp(14px,2.3vw,28px);border:1px solid #b1875c;border-radius:0;background:radial-gradient(circle at 2px 3px,#66431d20 1px,transparent 1.8px) 0 0/11px 13px,radial-gradient(circle at 5px 8px,#fff8df4d 1px,transparent 2px) 0 0/17px 19px,linear-gradient(115deg,#d8b488,#cfa474 55%,#dfbd93);box-shadow:inset 0 2px 8px #71421f17;text-align:left}
.sc-board .sc-heading{margin-bottom:23px;text-align:center}.sc-board .sc-heading>p{font-size:10px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;color:#54391e}.sc-board .sc-heading h2{font-size:clamp(28px,3vw,39px);font-weight:750;letter-spacing:-.9px;line-height:1.15;margin:8px 0 10px;color:#34251d}.sc-heading h2 em{font-family:Georgia,serif;font-weight:500;color:#603443}.sc-heading>span{font-size:13px;color:#47311f;font-weight:550}
.sc-filter-paper{position:relative;padding:17px 18px 12px;background:#fffcf5;border:1px solid #ddc7a8;box-shadow:0 4px 9px #59381715;margin-bottom:18px}.sc-filter-paper:before{content:"";position:absolute;left:calc(50% - 26px);top:-9px;width:52px;height:17px;background:#dcc3e2bb;transform:rotate(-4deg);border-inline:1px dashed #9e7ba177}.sc-filters{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,300px);gap:13px}.sc-filters label{display:grid;gap:7px;color:#463631;font-size:12px;font-weight:750}.sc-filters label>span{display:flex;align-items:center;gap:7px}.sc-filters input,.sc-filters select{width:100%;min-width:0;min-height:46px;border:1px solid #bba596;border-radius:6px;background:#fff;color:#312924;font-size:15px;padding:10px 12px;font-weight:550}.sc-filters input::placeholder{color:#70625b;opacity:1}.sc-summary{display:flex;align-items:center;flex-wrap:wrap;gap:9px 20px;margin-top:12px;font-size:12px;color:#514138}.sc-summary strong{font-weight:800;color:#35251e}.sc-legend{display:inline-flex;align-items:center;gap:7px}.sc-legend svg{color:#76500c}.sc-clear{background:none;border:0;padding:4px 0;min-height:44px;font-size:12px!important;font-weight:700;color:#61416d;text-decoration:underline;text-underline-offset:4px;margin-left:auto}
.sc-board-rows{display:grid;gap:15px}.sc-rail-wrap{min-width:0;width:100%}.sc-rail{display:flex;align-items:stretch;gap:21px;overflow-x:auto;padding:19px 9px 16px;scroll-snap-type:x proximity;scroll-padding-inline:9px;overscroll-behavior-x:contain;scrollbar-width:thin;scrollbar-color:#886046 #f5dfc36b}.sc-rail>*{flex:0 0 220px;min-width:0;scroll-snap-align:start}.sc-rail-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;color:#473121;font-size:12px;font-weight:650;margin-top:5px}.sc-rail-footer>div{display:flex;gap:7px}.sc-icon-button{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:44px;height:44px;border:1px solid #ac8f79;border-radius:50%;background:#fff9f0;color:#49392d}.sc-icon-button:hover:not(:disabled){background:#f0e1f1}
.sc-board .sc-card{position:relative;display:flex;flex-direction:column;padding:10px 10px 15px;border:1px solid #a98c7155;border-radius:2px;background:var(--sc-paper,#fff6e4);box-shadow:2px 5px 7px #58381c25,0 11px 17px #58381c12;text-align:left;transform:rotate(var(--sc-tilt));color:#342a28;transition:box-shadow .25s;white-space:normal}.sc-card:hover{box-shadow:2px 8px 12px #58381c30,0 12px 22px #58381c1a}.sc-pin{position:absolute;top:-8px;left:calc(50% - 7px);width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 35% 28%,#fff9 0 12%,transparent 28%),var(--sc-pin);border:1px solid #0002;box-shadow:1px 3px 3px #48250f65;z-index:2}.sc-photo{position:relative;width:100%;aspect-ratio:1.25;overflow:hidden;background:#fff9}.sc-photo img,.sc-photo>.sc-image-fallback{display:block;width:100%;height:100%;object-fit:cover}.sc-owned{position:absolute;top:7px;left:7px;display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#fffaf0;color:#704807;border:1px solid #e6d8b3;box-shadow:0 2px 5px #432a1a22}.sc-card-copy{display:flex;flex:1;flex-direction:column;gap:8px;padding:13px 4px 0}.sc-board .sc-card-copy h3{font-size:18px;font-weight:800;line-height:1.3;letter-spacing:-.3px;color:#302522;overflow-wrap:anywhere}.sc-board .sc-card-copy p{color:#55443f;font-size:12px;font-weight:650;line-height:1.5;overflow-wrap:anywhere}.sc-card-copy>span{display:flex;justify-content:space-between;gap:10px;margin-top:auto;padding-top:9px;font-size:12px;font-weight:750;color:#593550}.sc-card-copy>span>span{font-size:16px}.sc-board .sc-board-signoff{font-family:Georgia,serif;font-style:italic;font-size:15px;color:#513822;text-align:center;margin:20px 0 0}.sc-board-signoff>span{color:#74344f;font-size:19px}
.sc-image-fallback{display:flex!important;align-items:center;justify-content:center;flex-direction:column;gap:9px;text-align:center;padding:12px;background:linear-gradient(135deg,#f6dbe6,#f9ebc6,#dfefe3,#e8e2f6);color:#463545;font-weight:700;font-size:13px;overflow-wrap:anywhere}.sc-image-fallback>span:first-child{font-size:32px}.sc-state{background:#fffaf1;border:1px dashed #a98b71;padding:24px 18px;margin:18px 0;color:#48362d;font-size:14px;text-align:center;font-weight:550}.sc-state .sc-button{margin-top:12px}.sc-loading{display:block;height:3px;width:110px;margin:0 auto 15px;background:linear-gradient(90deg,#bc5072,#c18b4a,#b6a251,#5a9271,#6485b9,#9864ae);animation:sc-load 1.8s ease-in-out infinite}
.sc-modal{position:fixed;inset:0;z-index:2400;display:flex;align-items:center;justify-content:center;padding:18px;background:#2c2018b5;backdrop-filter:blur(6px)}.sc-modal-panel{width:100%;max-width:620px;max-height:92vh;max-height:92dvh;display:flex;flex-direction:column;min-height:0;background:#fffcf5;border:1px solid #cdbca5;border-top:5px solid #bd87a9;border-radius:12px;box-shadow:0 25px 80px #1e120e55;overflow:hidden}.sc-modal-head{display:flex;align-items:center;justify-content:space-between;gap:13px;padding:17px 20px;border-bottom:1px solid #dfd2bf;flex-shrink:0}.sc-modal-head h2{font-size:24px;color:#302522;font-weight:800;line-height:1.25;letter-spacing:-.5px;overflow-wrap:anywhere}.sc-modal-body{overflow-y:auto;overscroll-behavior:contain;min-height:0;padding:21px}.sc-detail-image{display:block;width:100%;height:215px;object-fit:contain;background:#fff;margin-bottom:17px;border:1px solid #e6dccd}.sc-modal .sc-detail-category{font-size:14px;font-weight:750;color:#573f5b;margin-bottom:9px}.sc-modal .sc-detail-owned{display:flex;gap:8px;align-items:center;font-size:12px;color:#5d4219;font-weight:700;margin-bottom:15px}.sc-description{white-space:pre-line;color:#40332e;font-size:14px;line-height:1.85;overflow-wrap:anywhere}.sc-modal .sc-times{font-size:13px;font-weight:650;color:#54453b;margin-top:16px}.sc-links{display:flex;gap:9px;flex-wrap:wrap;margin-top:19px}.sc-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;border:1px solid #b9a3bd;border-radius:7px;background:#ecdef0;color:#3e294a!important;padding:10px 15px;font-size:13px;font-weight:750;text-decoration:none;transition:background .2s}.sc-button:hover{background:#e0cbe8}.sc-socials .sc-button{background:#fffaf1;border-color:#cbbb9f;color:#493729!important}.sc-socials .sc-button:hover{background:#f2e8d9}
@keyframes sc-load{0%,100%{opacity:.45}50%{opacity:1}}
@media(max-width:640px){.sc-board{padding:16px 11px}.sc-filter-paper{padding:16px 12px 10px}.sc-filters{grid-template-columns:1fr;gap:11px}.sc-filters input,.sc-filters select{font-size:16px}.sc-summary{gap:7px 13px;font-size:11px}.sc-rail{gap:17px;padding-inline:6px}.sc-rail>*{flex-basis:188px}.sc-board .sc-card-copy h3{font-size:16px}.sc-board .sc-card-copy p{font-size:12px}.sc-rail-footer{font-size:11px}.sc-board-rows{gap:10px}.sc-modal{padding:10px}.sc-modal-panel{max-height:94dvh}.sc-modal-head{padding:13px 15px}.sc-modal-head h2{font-size:21px}.sc-modal-body{padding:16px}.sc-detail-image{height:185px}}
@media(prefers-reduced-motion:reduce){.sc-scope *{animation:none!important;transition:none!important;scroll-behavior:auto!important}.sc-board .sc-card{transform:none}}
@media(forced-colors:active){.sc-board,.sc-filter-paper,.sc-card{background:Canvas;border:1px solid CanvasText}.sc-pin{background:Highlight}.sc-board .sc-card-copy h3,.sc-board .sc-card-copy p,.sc-summary,.sc-legend{color:CanvasText}}

/* Chromatic foil over a warm community pinboard; lettering stays solid ink. */
.sc-board{background:radial-gradient(ellipse at 0 0,#f1b9d766,transparent 55%),radial-gradient(ellipse at 100% 100%,#a8d4db55,transparent 50%),radial-gradient(circle at 2px 3px,#68452a1c 1px,transparent 1.8px) 0 0/9px 12px,#d9bc99;border:1px solid #bba080;box-shadow:inset 0 2px 9px #75583215}
.sc-board .sc-heading h2{font-size:clamp(27px,3vw,38px);color:#322632}.sc-board .sc-heading h2 em{color:#663954}.sc-board-caption{display:flex;justify-content:space-between;gap:12px;align-items:center;font-size:11px;color:#493643;font-weight:750;letter-spacing:.2px;border-bottom:1px solid #8c706644;padding:0 3px 12px;margin-bottom:7px}.sc-board-caption>span:first-child{display:flex;gap:8px;align-items:center}.sc-board-caption svg{color:#81365e}
.sc-rail{padding:25px 10px 20px;gap:24px;cursor:grab;user-select:none;scroll-snap-type:x proximity}.sc-rail:active{cursor:grabbing}.sc-rail>*{flex-basis:246px}.sc-single .sc-rail{justify-content:center}.sc-single .sc-rail>*{flex-basis:min(100%,290px)}
.sc-sponsor-card{position:relative;display:flex;flex-direction:column;min-width:0;padding:12px 12px 0;border:1px solid transparent;border-radius:3px;isolation:isolate;background:linear-gradient(150deg,#fffdf9,var(--sc-paper)) padding-box,conic-gradient(from 40deg,#f2c3df,#a2ccdf,#d9c6f4,#fff1b6,#f2bdd5,#b8dacc,#f2c3df) border-box;box-shadow:3px 5px 8px #51322d25,0 12px 22px #51322d12;transform:rotate(var(--sc-tilt));text-align:left;color:#332734;transition:box-shadow .25s}
.sc-sponsor-card:hover{box-shadow:3px 7px 13px #51322d28,0 15px 24px #51322d18}
.sc-foil-tape{position:absolute;top:-11px;left:calc(50% - 37px);width:74px;height:25px;z-index:2;transform:rotate(-5deg);border-inline:1px dashed #90648777;box-shadow:0 1px 2px #35244315;background:linear-gradient(115deg,#f3c7e8bb,#c5e6ecdd 23%,#f9f0c6cc 43%,#d0c9f0dd 66%,#f4bfd9cc);overflow:hidden}
.sc-foil-tape:after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 15%,#fff9 48%,transparent 75%);transform:translateX(-130%)}
.sc-sponsor-card:hover .sc-foil-tape:after,.sc-sponsor-card:focus-visible .sc-foil-tape:after{animation:sc-foil-pass 1.1s ease-out}
.sc-card-number{position:absolute;right:15px;top:19px;z-index:1;font-family:Georgia,serif;font-size:10px;letter-spacing:1px;color:#655265;background:#fffdf6de;padding:2px 5px}
.sc-logo{height:155px;width:100%;background:#fff;display:flex;align-items:center;justify-content:center;border:1px solid #e6dbe7;overflow:hidden}.sc-logo img,.sc-logo>.sc-image-fallback{width:100%;height:100%;object-fit:contain;padding:19px}.sc-logo img{background:#fff}.sc-sponsor-copy{display:flex;flex:1;flex-direction:column;gap:8px;padding:17px 5px 16px}.sc-board .sc-tier{color:var(--sc-accent);font-size:10px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;line-height:1.5}.sc-board .sc-sponsor-copy h3{color:#322535;font-size:20px;font-weight:800;line-height:1.25;letter-spacing:-.4px;overflow-wrap:anywhere}.sc-sponsor-cta{display:flex;justify-content:space-between;gap:10px;font-size:12px;color:#593954;font-weight:750;margin-top:auto;padding-top:14px}.sc-sponsor-cta>span{font-size:17px}.sc-spectrum-edge{height:4px;width:calc(100% + 24px);margin-left:-12px;background:linear-gradient(90deg,#c86187,#c79154,#bba44d,#5d957c,#6688bc,#9c70b4)}
.sc-modal-panel{border:1px solid #cdb7d3;border-top:5px solid #ac7dbe;background:linear-gradient(135deg,#fffbf7,#f7f1fb);border-radius:13px}.sc-modal-head h2{color:#322535}.sc-detail-category{color:#603e70!important}.sc-detail-image{object-fit:contain;padding:14px}.sc-description{color:#443346}.sc-social-link{background:#fffcf7!important;color:#49324f!important}
@keyframes sc-foil-pass{from{transform:translateX(-130%)}to{transform:translateX(130%)}}
@media(max-width:640px){.sc-rail{gap:19px;padding:23px 7px 18px}.sc-rail>*{flex-basis:208px}.sc-logo{height:137px}.sc-logo img{padding:17px}.sc-board .sc-sponsor-copy h3{font-size:18px}.sc-sponsor-copy{padding:15px 3px 14px}.sc-sponsor-cta{font-size:11px}.sc-board-caption{font-size:10px}.sc-foil-tape{width:62px;left:calc(50% - 31px)}}
@media(prefers-reduced-motion:reduce){.sc-sponsor-card{transform:none}.sc-foil-tape:after{animation:none!important}}
@media(forced-colors:active){.sc-sponsor-card{border:1px solid CanvasText;background:Canvas}.sc-board .sc-tier,.sc-board .sc-sponsor-copy h3,.sc-sponsor-cta{color:CanvasText}}

`;
