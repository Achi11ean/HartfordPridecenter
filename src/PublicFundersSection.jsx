import React, { useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";
import { FaTimes, FaGlobe, FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;

function safeHref(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  const raw = value.trim();
  if (/^[a-z][a-z\d+.-]*:/i.test(raw) && !/^https?:/i.test(raw)) return "";
  try { const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
}

function CommunityImage({ src, alt, className = "", eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && !failed ? <img className={className} src={src} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)}/> : <span className={`fc-image-fallback ${className}`} role="img" aria-label={alt}><span aria-hidden="true">✦</span><span>{alt}</span></span>;
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
  return createPortal(<div className="fc-scope fc-modal" onClick={event => { if (event.target === event.currentTarget) onClose(); }}><motion.section ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`fc-modal-panel${wide ? " fc-modal-wide" : ""}`} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}><header className="fc-modal-head"><h2 id={titleId}>{title}</h2><button ref={close} type="button" className="fc-icon-button" onClick={onClose} aria-label="Close details"><FaTimes aria-hidden="true"/></button></header><div className="fc-modal-body">{children}</div></motion.section></div>, document.body);
}

function Rail({ children, label, resetKey }) {
  const ref = useRef(null), id = useId();
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
  return <div className="fc-rail-wrap"><div className="fc-rail" id={id} ref={ref} aria-label={label} role="region" tabIndex={0}>{children}</div>{!(edges.start && edges.end) && <div className="fc-rail-footer"><span>Swipe or scroll to explore</span><div><button type="button" className="fc-icon-button" aria-label={`Previous ${label}`} aria-controls={id} disabled={edges.start} onClick={() => scroll(-1)}><FaArrowLeft/></button><button type="button" className="fc-icon-button" aria-label={`Next ${label}`} aria-controls={id} disabled={edges.end} onClick={() => scroll(1)}><FaArrowRight/></button></div></div>}</div>;
}

export default function PublicFundersSection({ embedded = false, onHasFunders }) {
  const [funders, setFunders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [activeFunder, setActiveFunder] = useState(null);
  const reduced = useReducedMotion();
  const heading = useId();

  useEffect(() => {
    let current = true;
    const controller = new AbortController();
    setLoading(true); setError("");
    axios.get(`${API}/api/pride/${PRIDE_ID}/funders`, { signal: controller.signal })
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error("Invalid funder response");
        if (current) setFunders(data.filter(funder => funder.is_active));
      })
      .catch(err => { if (current && err.code !== "ERR_CANCELED") { setError("Our community funders couldn’t load. Please try again."); setFunders([]); } })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; controller.abort(); };
  }, [attempt]);
  useEffect(() => { if (!loading) onHasFunders?.(funders.length > 0); }, [loading, funders.length, onHasFunders]);
  const website = safeHref(activeFunder?.website_url);

  return <><style>{STYLES}</style><section className="fc-scope fc-board" aria-busy={loading} aria-label={embedded ? "Community funders" : undefined} aria-labelledby={embedded ? undefined : heading}>
    {!embedded && <header className="fc-heading"><p>Good people. Lasting impact.</p><h2 id={heading}>Generosity that <em>shines.</em></h2><span>Our community funders help turn care into connection.</span></header>}
    <div className="fc-board-caption"><span><FaHeart aria-hidden="true"/> Our community’s golden hearts</span>{!loading && !error && <span>{funders.length} {funders.length === 1 ? "funder" : "funders"}</span>}</div>
    {loading ? <div className="fc-state" role="status"><span className="fc-loading" aria-hidden="true"/>Loading community funders…</div> : error ? <div className="fc-state" role="alert"><p>{error}</p><button type="button" className="fc-button" onClick={() => setAttempt(value => value + 1)}>Try again</button></div> : !funders.length ? <div className="fc-state">No community funders are currently listed. Check back soon.</div> : <Rail label="community funders">
      {funders.map((funder, index) => <motion.button type="button" key={funder.id} className={`fc-card ${index % 2 ? "fc-silver" : "fc-gold"}`} aria-haspopup="dialog" onClick={() => setActiveFunder(funder)} initial={reduced ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} whileHover={reduced ? undefined : { y: -4 }} whileTap={reduced ? undefined : { scale: .985 }} transition={{ duration: .3 }}>
        <span className="fc-paperclip" aria-hidden="true"/><div className="fc-logo"><CommunityImage src={funder.logo_url} alt={funder.organization_name || "Community funder"}/></div><div className="fc-card-copy"><p className="fc-kicker">Community funder</p><h3>{funder.organization_name}</h3>{funder.details && <p className="fc-excerpt">{funder.details}</p>}<span className="fc-card-action">A little more about us <span aria-hidden="true">↗</span></span></div><span className="fc-foil-edge" aria-hidden="true"/>
      </motion.button>)}
    </Rail>}
    <p className="fc-signoff">Every act of generosity leaves a little light. <span aria-hidden="true">✧</span></p>
  </section>
  {activeFunder && <Modal title={activeFunder.organization_name || "Community funder"} onClose={() => setActiveFunder(null)}><CommunityImage className="fc-detail-image" src={activeFunder.logo_url} alt={activeFunder.organization_name || "Community funder"}/><p className="fc-detail-label">With gratitude · Community funder</p>{activeFunder.details && <p className="fc-detail-text">{activeFunder.details}</p>}{website && <div className="fc-links"><a href={website} target="_blank" rel="noopener noreferrer" className="fc-button"><FaGlobe aria-hidden="true"/>Visit website <span aria-hidden="true">↗</span></a></div>}</Modal>}
  </>;
}

const STYLES = `
.fc-scope{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.65;color:#302d28;color-scheme:light;-webkit-font-smoothing:antialiased}.fc-scope *{box-sizing:border-box}.fc-scope :is(h2,h3,p){margin:0}.fc-scope button{font:inherit;cursor:pointer}.fc-scope :is(button,a,[tabindex="0"]):focus-visible{outline:3px solid #765215;outline-offset:4px}.fc-scope button:disabled{opacity:.35;cursor:default}.fc-scope a{color:#4c3915}
.fc-board{width:100%;min-width:0;padding:clamp(14px,2.3vw,28px);border:1px solid #c0ae8e;border-radius:0;background:radial-gradient(circle at 2px 2px,#88745318 1px,transparent 1.8px) 0 0/9px 12px,radial-gradient(ellipse at 0 0,#eed9a860,transparent 60%),linear-gradient(120deg,#e1d6c1,#deddd8 60%,#ddd1b8);box-shadow:inset 0 2px 8px #72623d0f;text-align:left}
.fc-board .fc-heading{text-align:center;margin-bottom:22px}.fc-heading>p{font-size:10px;letter-spacing:1.5px;font-weight:800;text-transform:uppercase;color:#5b4a29}.fc-heading h2{font-size:clamp(29px,3vw,40px);font-weight:750;line-height:1.18;letter-spacing:-.9px;margin:8px 0 10px;color:#302b22}.fc-heading h2 em{font-family:Georgia,serif;font-weight:500;color:#72521b}.fc-heading>span{font-size:13px;color:#534b3f}.fc-board-caption{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-bottom:14px;margin-bottom:8px;border-bottom:1px solid #a191744d;color:#52462f;font-size:11px;font-weight:750}.fc-board-caption>span:first-child{display:flex;gap:8px;align-items:center}.fc-board-caption svg{color:#795817}
.fc-rail-wrap{width:100%;min-width:0}.fc-rail{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:23px 17px;padding:20px 5px 13px;overflow-x:auto;scrollbar-width:thin;scrollbar-color:#aa946e #ffffff55;overscroll-behavior-x:contain}.fc-rail>*{min-width:0}.fc-rail-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:11px;color:#504735;font-weight:650;margin-top:8px}.fc-rail-footer>div{display:flex;gap:7px}.fc-icon-button{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;flex-shrink:0;border:1px solid #b4a488;border-radius:50%;background:#fffcf5;color:#4b402b}.fc-icon-button:hover:not(:disabled){background:#ece5d5}
.fc-card{--metal:#a8833a;--paper:#fffaec;--ink:#6a4d16;--shine:linear-gradient(115deg,#8d6927,#ddbf74,#fff2c7,#b98f38,#ead096);position:relative;display:flex;flex-direction:column;border:1px solid #bcac8c;border-radius:3px;padding:12px 12px 0;background:var(--paper);box-shadow:2px 5px 8px #6350301c;isolation:isolate;text-align:left;color:#302a21;transition:box-shadow .2s}.fc-card:hover{box-shadow:2px 9px 18px #63503029}.fc-silver{--metal:#899299;--paper:#f7f8f9;--ink:#4b5862;--shine:linear-gradient(115deg,#727d87,#c5cbd1,#f7faff,#969fa8,#e1e7ec);border-color:#b6bdc2}
.fc-paperclip{position:absolute;z-index:2;top:-12px;left:22px;width:17px;height:39px;border:3px solid var(--metal);border-radius:10px 10px 7px 7px;transform:rotate(-11deg);box-shadow:1px 2px 2px #0003,inset 1px 0 0 #fff9;background:transparent}.fc-paperclip:after{content:"";position:absolute;top:5px;left:2px;width:6px;height:24px;border:2px solid var(--metal);border-top:0;border-radius:0 0 5px 5px}
.fc-logo{height:136px;display:flex;align-items:center;justify-content:center;width:100%;overflow:hidden;background:#fff;border:1px solid #e4e0d8}.fc-logo img,.fc-logo>.fc-image-fallback{display:block;width:100%;height:100%;object-fit:contain;padding:15px}.fc-image-fallback{display:flex!important;align-items:center;justify-content:center;flex-direction:column;gap:8px;padding:15px;background:linear-gradient(135deg,#f4e7c6,#f8f6ed,#e6eaee);color:#51472f;text-align:center;font-size:13px;font-weight:750;overflow-wrap:anywhere}.fc-image-fallback>span:first-child{font-size:28px}
.fc-card-copy{display:flex;flex:1;flex-direction:column;gap:9px;padding:16px 3px}.fc-board .fc-kicker{font-size:9px;text-transform:uppercase;letter-spacing:1.2px;color:var(--ink);font-weight:800}.fc-board .fc-card h3{color:#302d28;font-size:18px;font-weight:800;line-height:1.3;letter-spacing:-.3px;overflow-wrap:anywhere}.fc-board .fc-excerpt{color:#544e44;font-size:12px;font-weight:500;line-height:1.7;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}.fc-card-action{display:flex;align-items:center;justify-content:space-between;gap:9px;margin-top:auto;padding-top:10px;font-size:11px;font-weight:750;color:var(--ink)}.fc-card-action>span{font-size:16px}.fc-foil-edge{display:block;position:relative;overflow:hidden;width:calc(100% + 24px);height:5px;margin-left:-12px;background:var(--shine)}.fc-foil-edge:after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent,#ffffffd9,transparent);transform:translateX(-110%)}.fc-card:hover .fc-foil-edge:after,.fc-card:focus-visible .fc-foil-edge:after{animation:fc-shine 1.2s ease-out}
.fc-board .fc-signoff{text-align:center;font-family:Georgia,serif;font-style:italic;font-size:15px;margin-top:18px;color:#5b4c32}.fc-signoff span{font-size:21px;color:#6b5428}.fc-state{text-align:center;font-size:14px;color:#504735;background:#fffcf4;padding:25px 17px;border:1px dashed #b5a180;margin:15px 0;font-weight:550}.fc-state .fc-button{margin-top:13px}.fc-loading{display:block;width:110px;height:3px;background:linear-gradient(90deg,#a47b2e,#ead6a1,#a8afb7,#e5eaef);margin:0 auto 15px;animation:fc-pulse 1.8s ease-in-out infinite}
.fc-modal{position:fixed;inset:0;z-index:2400;display:flex;align-items:center;justify-content:center;padding:18px;background:#28241dcc;backdrop-filter:blur(6px)}.fc-modal-panel{display:flex;flex-direction:column;min-height:0;width:100%;max-width:650px;max-height:92vh;max-height:92dvh;border:1px solid #bfb19a;border-top:5px solid #b1975f;border-radius:12px;background:linear-gradient(130deg,#fffaf0,#f5f6f8);box-shadow:0 25px 80px #16130d55;overflow:hidden}.fc-modal-head{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:17px 20px;border-bottom:1px solid #d9d2c5;flex-shrink:0}.fc-modal-head h2{font-size:23px;line-height:1.25;color:#302d28;font-weight:800;letter-spacing:-.5px;overflow-wrap:anywhere}.fc-modal-body{overflow-y:auto;min-height:0;padding:22px;overscroll-behavior:contain}.fc-detail-image{display:block;width:100%;height:210px;object-fit:contain;padding:15px;background:#fff;border:1px solid #e2dfd6;margin-bottom:18px}.fc-modal .fc-detail-label{font-size:12px;font-weight:750;color:#6a501d;margin-bottom:12px}.fc-detail-text{white-space:pre-line;font-size:14px;color:#413b32;line-height:1.85;overflow-wrap:anywhere}.fc-links{display:flex;flex-wrap:wrap;gap:10px;margin-top:21px}.fc-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;background:linear-gradient(125deg,#f2e3bc,#fbf4de,#e8ecf0);border:1px solid #af9870;border-radius:7px;padding:10px 16px;color:#493615!important;font-size:13px;font-weight:750;text-decoration:none}.fc-button:hover{background:#e9dab6}
@keyframes fc-shine{from{transform:translateX(-110%)}to{transform:translateX(110%)}}@keyframes fc-pulse{0%,100%{opacity:.5}50%{opacity:1}}
@media(min-width:1500px){.fc-rail{grid-template-columns:repeat(6,minmax(0,1fr))}}
@media(max-width:640px){.fc-board{padding:16px 11px}.fc-rail{display:flex;gap:17px;padding:20px 5px 15px;scroll-snap-type:x proximity;scroll-padding-inline:5px}.fc-rail>*{flex:0 0 min(79vw,220px);scroll-snap-align:start}.fc-logo{height:131px}.fc-board .fc-card h3{font-size:17px}.fc-board-caption{font-size:10px}.fc-modal{padding:10px}.fc-modal-panel{max-height:94dvh}.fc-modal-head{padding:13px 16px}.fc-modal-head h2{font-size:20px}.fc-modal-body{padding:17px}.fc-detail-image{height:170px}}
@media(prefers-reduced-motion:reduce){.fc-scope *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
@media(forced-colors:active){.fc-board,.fc-card{background:Canvas;border:1px solid CanvasText}.fc-paperclip{border-color:CanvasText}.fc-board .fc-kicker,.fc-card-action{color:CanvasText}}
`;
