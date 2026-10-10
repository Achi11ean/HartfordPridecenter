import React, { useEffect, useMemo, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";
import { FaTimes, FaGlobe, FaInstagram, FaFacebook, FaYoutube, FaStar, FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;
const PAPER = ["#fce9ef", "#fff0df", "#fbf3d5", "#e5f2e8", "#e6eefe", "#eee4f7"];
const PINS = ["#af385d", "#ae6029", "#8b7324", "#387459", "#416caf", "#8453a4"];
const isLgbtqOwnedVendor = vendor => (vendor.description || "").includes("LGBTQIA+ Owned");
function publicVendors(data) { return (Array.isArray(data) ? data : []).filter(vendor => vendor.is_active && ["approved", "confirmed"].includes(vendor.status)); }
function filterVendors(vendors, type, query) {
  const search = query.toLowerCase().trim();
  return vendors.filter(vendor => (type === "all" || vendor.vendor_type === type) && (!search || [vendor.company_name, vendor.vendor_type, vendor.description].some(value => String(value || "").toLowerCase().includes(search))));
}
function getPlatform(url) {
  const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  const matches = name => host === name || host.endsWith(`.${name}`);
  if (matches("instagram.com")) return { Icon: FaInstagram, label: "Instagram" };
  if (matches("facebook.com")) return { Icon: FaFacebook, label: "Facebook" };
  if (matches("youtube.com") || matches("youtu.be")) return { Icon: FaYoutube, label: "YouTube" };
  if (matches("tiktok.com")) return { Icon: SiTiktok, label: "TikTok" };
  return { Icon: FaGlobe, label: "Social link" };
}

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

function formatTime(value) {
  if (!value) return "TBD";
  const match = String(value).match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match) { const h = Number(match[1]), m = Number(match[2]); return h < 24 && m < 60 ? `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}` : "TBD"; }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "TBD" : date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function CommunityImage({ src, alt, className = "", eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && !failed ? <img className={className} src={src} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)}/> : <span className={`vc-image-fallback ${className}`} role="img" aria-label={alt}><span aria-hidden="true">✦</span><span>{alt}</span></span>;
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
  return createPortal(<div className="vc-scope vc-modal" onClick={event => { if (event.target === event.currentTarget) onClose(); }}><motion.section ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`vc-modal-panel${wide ? " vc-modal-wide" : ""}`} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}><header className="vc-modal-head"><h2 id={titleId}>{title}</h2><button ref={close} type="button" className="vc-icon-button" onClick={onClose} aria-label="Close details"><FaTimes aria-hidden="true"/></button></header><div className="vc-modal-body">{children}</div></motion.section></div>, document.body);
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
  return <div className="vc-rail-wrap"><div className="vc-rail" id={id} ref={ref} aria-label={label} role="region" tabIndex={0}>{children}</div>{!(edges.start && edges.end) && <div className="vc-rail-footer"><span>Swipe or scroll to explore</span><div><button type="button" className="vc-icon-button" aria-label={`Previous ${label}`} aria-controls={id} disabled={edges.start} onClick={() => scroll(-1)}><FaArrowLeft/></button><button type="button" className="vc-icon-button" aria-label={`Next ${label}`} aria-controls={id} disabled={edges.end} onClick={() => scroll(1)}><FaArrowRight/></button></div></div>}</div>;
}


export default function VendorSlider({ embedded = false }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [activeVendor, setActiveVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const reduced = useReducedMotion();
  const headingId = useId();

  useEffect(() => {
    const controller = new AbortController();
    let current = true;
    setLoading(true); setError("");
    axios.get(`${API}/api/pride/${PRIDE_ID}/vendors`, { signal: controller.signal })
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error("Invalid vendor response");
        if (current) setVendors(publicVendors(data));
      })
      .catch(err => { if (current && err.code !== "ERR_CANCELED") setError("Our vendor board couldn’t load. Please try again."); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; controller.abort(); };
  }, [attempt]);

  const availableTypes = useMemo(() => [...new Set(vendors.map(v => v.vendor_type).filter(Boolean))].sort(), [vendors]);
  const filtered = useMemo(() => filterVendors(vendors, selectedType, searchTerm), [vendors, selectedType, searchTerm]);
  const rows = filtered.length < 10
    ? (filtered.length ? [filtered] : [])
    : [filtered.filter((_, index) => index % 2 === 0), filtered.filter((_, index) => index % 2 === 1)];
  const websites = activeVendor ? linkList(activeVendor.websites?.length ? activeVendor.websites : activeVendor.website_url) : [];
  const socials = activeVendor ? linkList(activeVendor.socials?.length ? activeVendor.socials : activeVendor.social_links) : [];

  return <><style>{STYLES}</style><section className="vc-scope vc-board" aria-label={embedded ? "Community vendor board" : undefined} aria-labelledby={embedded ? undefined : headingId} aria-busy={loading}>
    {!embedded && <header className="vc-heading"><p>Shop small · Celebrate big</p><h2 id={headingId}>Our community <em>noticeboard.</em></h2><span>Local makers, good food, and lovely things to discover.</span></header>}
    <div className="vc-filter-paper">
      <div className="vc-filters"><label><span><FaSearch aria-hidden="true"/> Find something lovely</span><input type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Company, category, or keyword…"/></label><label><span>Browse by category</span><select value={selectedType} onChange={e => setSelectedType(e.target.value)}><option value="all">All vendor types</option>{availableTypes.map(type => <option key={type} value={type}>{type}</option>)}</select></label></div>
      <div className="vc-summary"><p role="status">{loading ? "Pinning up our community…" : error ? "Board temporarily unavailable" : <><strong>{filtered.length}</strong> {filtered.length === 1 ? "vendor" : "vendors"}{selectedType !== "all" && <> in <strong>{selectedType}</strong></>}</>}</p><span className="vc-legend"><FaStar aria-hidden="true"/> LGBTQIA+ owned</span>{(searchTerm || selectedType !== "all") && <button type="button" className="vc-clear" onClick={() => { setSearchTerm(""); setSelectedType("all"); }}>Clear filters</button>}</div>
    </div>

    {loading ? <div className="vc-state" role="status"><span className="vc-loading" aria-hidden="true"/>Loading our vendor community…</div> : error ? <div className="vc-state" role="alert"><p>{error}</p><button type="button" className="vc-button" onClick={() => setAttempt(value => value + 1)}>Try again</button></div> : filtered.length === 0 ? <div className="vc-state">{vendors.length ? "No vendors match your search. Try another word or category." : "New neighbors are on their way. Our vendor list is coming soon."}</div> : <div className="vc-board-rows">{rows.map((row, rowIndex) => <Rail key={rowIndex} label={`vendor row ${rowIndex + 1}`} resetKey={`${selectedType}:${searchTerm}`}>
      {row.map((vendor, index) => {
        const color = (index * 2 + rowIndex) % PAPER.length;
        return <motion.button type="button" key={vendor.id} className="vc-card" aria-haspopup="dialog" onClick={() => setActiveVendor(vendor)} style={{ "--vc-paper": PAPER[color], "--vc-pin": PINS[color], "--vc-tilt": `${index % 2 ? 1.2 : -1.2}deg` }} whileHover={reduced ? undefined : { y: -4, rotate: 0 }} whileTap={reduced ? undefined : { scale: .985 }}>
          <span className="vc-pin" aria-hidden="true"/><div className="vc-photo"><CommunityImage src={vendor.image_url} alt={vendor.company_name || "Local vendor"}/>{isLgbtqOwnedVendor(vendor) && <span className="vc-owned" role="img" aria-label="LGBTQIA+ owned"><FaStar aria-hidden="true"/></span>}</div>
          <div className="vc-card-copy"><h3>{vendor.company_name}</h3>{vendor.vendor_type && <p>{vendor.vendor_type}</p>}<span>Meet this vendor <span aria-hidden="true">↗</span></span></div>
        </motion.button>;
      })}
    </Rail>)}</div>}
    <p className="vc-board-signoff">Made with care. Shared with Pride. <span aria-hidden="true">♡</span></p>
  </section>

  {activeVendor && <Modal title={activeVendor.company_name || "Meet our vendor"} onClose={() => setActiveVendor(null)}>
    <CommunityImage className="vc-detail-image" src={activeVendor.image_url} alt={activeVendor.company_name || "Local vendor"}/>
    {activeVendor.vendor_type && <p className="vc-detail-category">{activeVendor.vendor_type}</p>}
    {isLgbtqOwnedVendor(activeVendor) && <p className="vc-detail-owned"><FaStar aria-hidden="true"/> LGBTQIA+ owned business</p>}
    {activeVendor.description && <p className="vc-description">{activeVendor.description}</p>}
    {(activeVendor.start_time || activeVendor.end_time) && <p className="vc-times">{activeVendor.start_time && `Starts: ${formatTime(activeVendor.start_time)}`}{activeVendor.start_time && activeVendor.end_time && " · "}{activeVendor.end_time && `Ends: ${formatTime(activeVendor.end_time)}`}</p>}
    {websites.length > 0 && <div className="vc-links">{websites.map((url, index) => <a key={url} className="vc-button" href={url} target="_blank" rel="noopener noreferrer"><FaGlobe aria-hidden="true"/>{websites.length === 1 ? "Visit website" : `Website ${index + 1}`} <span aria-hidden="true">↗</span></a>)}</div>}
    {socials.length > 0 && <div className="vc-links vc-socials">{socials.map(url => { const { Icon, label } = getPlatform(url); return <a key={url} className="vc-button" href={url} target="_blank" rel="noopener noreferrer"><Icon aria-hidden="true"/>{label} <span aria-hidden="true">↗</span></a>; })}</div>}
  </Modal>}
  </>;
}

const STYLES = `
.vc-scope{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.6;color:#342a28;color-scheme:light;-webkit-font-smoothing:antialiased}.vc-scope *{box-sizing:border-box}.vc-scope :is(h2,h3,p){margin:0}.vc-scope :is(button,input,select){font:inherit}.vc-scope button{cursor:pointer}.vc-scope :is(a,button,input,select,[tabindex="0"]):focus-visible{outline:3px solid #5b3979;outline-offset:4px}.vc-scope a{color:#4d315b}.vc-scope button:disabled{opacity:.35;cursor:default}
.vc-board{width:100%;min-width:0;padding:clamp(14px,2.3vw,28px);border:1px solid #b1875c;border-radius:0;background:radial-gradient(circle at 2px 3px,#66431d20 1px,transparent 1.8px) 0 0/11px 13px,radial-gradient(circle at 5px 8px,#fff8df4d 1px,transparent 2px) 0 0/17px 19px,linear-gradient(115deg,#d8b488,#cfa474 55%,#dfbd93);box-shadow:inset 0 2px 8px #71421f17;text-align:left}
.vc-board .vc-heading{margin-bottom:23px;text-align:center}.vc-board .vc-heading>p{font-size:10px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;color:#54391e}.vc-board .vc-heading h2{font-size:clamp(28px,3vw,39px);font-weight:750;letter-spacing:-.9px;line-height:1.15;margin:8px 0 10px;color:#34251d}.vc-heading h2 em{font-family:Georgia,serif;font-weight:500;color:#603443}.vc-heading>span{font-size:13px;color:#47311f;font-weight:550}
.vc-filter-paper{position:relative;padding:17px 18px 12px;background:#fffcf5;border:1px solid #ddc7a8;box-shadow:0 4px 9px #59381715;margin-bottom:18px}.vc-filter-paper:before{content:"";position:absolute;left:calc(50% - 26px);top:-9px;width:52px;height:17px;background:#dcc3e2bb;transform:rotate(-4deg);border-inline:1px dashed #9e7ba177}.vc-filters{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,300px);gap:13px}.vc-filters label{display:grid;gap:7px;color:#463631;font-size:12px;font-weight:750}.vc-filters label>span{display:flex;align-items:center;gap:7px}.vc-filters input,.vc-filters select{width:100%;min-width:0;min-height:46px;border:1px solid #bba596;border-radius:6px;background:#fff;color:#312924;font-size:15px;padding:10px 12px;font-weight:550}.vc-filters input::placeholder{color:#70625b;opacity:1}.vc-summary{display:flex;align-items:center;flex-wrap:wrap;gap:9px 20px;margin-top:12px;font-size:12px;color:#514138}.vc-summary strong{font-weight:800;color:#35251e}.vc-legend{display:inline-flex;align-items:center;gap:7px}.vc-legend svg{color:#76500c}.vc-clear{background:none;border:0;padding:4px 0;min-height:44px;font-size:12px!important;font-weight:700;color:#61416d;text-decoration:underline;text-underline-offset:4px;margin-left:auto}
.vc-board-rows{display:grid;gap:15px}.vc-rail-wrap{min-width:0;width:100%}.vc-rail{display:flex;align-items:stretch;gap:21px;overflow-x:auto;padding:19px 9px 16px;scroll-snap-type:x proximity;scroll-padding-inline:9px;overscroll-behavior-x:contain;scrollbar-width:thin;scrollbar-color:#886046 #f5dfc36b}.vc-rail>*{flex:0 0 220px;min-width:0;scroll-snap-align:start}.vc-rail-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;color:#473121;font-size:12px;font-weight:650;margin-top:5px}.vc-rail-footer>div{display:flex;gap:7px}.vc-icon-button{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:44px;height:44px;border:1px solid #ac8f79;border-radius:50%;background:#fff9f0;color:#49392d}.vc-icon-button:hover:not(:disabled){background:#f0e1f1}
.vc-board .vc-card{position:relative;display:flex;flex-direction:column;padding:10px 10px 15px;border:1px solid #a98c7155;border-radius:2px;background:var(--vc-paper,#fff6e4);box-shadow:2px 5px 7px #58381c25,0 11px 17px #58381c12;text-align:left;transform:rotate(var(--vc-tilt));color:#342a28;transition:box-shadow .25s;white-space:normal}.vc-card:hover{box-shadow:2px 8px 12px #58381c30,0 12px 22px #58381c1a}.vc-pin{position:absolute;top:-8px;left:calc(50% - 7px);width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 35% 28%,#fff9 0 12%,transparent 28%),var(--vc-pin);border:1px solid #0002;box-shadow:1px 3px 3px #48250f65;z-index:2}.vc-photo{position:relative;width:100%;aspect-ratio:1.25;overflow:hidden;background:#fff9}.vc-photo img,.vc-photo>.vc-image-fallback{display:block;width:100%;height:100%;object-fit:cover}.vc-owned{position:absolute;top:7px;left:7px;display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#fffaf0;color:#704807;border:1px solid #e6d8b3;box-shadow:0 2px 5px #432a1a22}.vc-card-copy{display:flex;flex:1;flex-direction:column;gap:8px;padding:13px 4px 0}.vc-board .vc-card-copy h3{font-size:18px;font-weight:800;line-height:1.3;letter-spacing:-.3px;color:#302522;overflow-wrap:anywhere}.vc-board .vc-card-copy p{color:#55443f;font-size:12px;font-weight:650;line-height:1.5;overflow-wrap:anywhere}.vc-card-copy>span{display:flex;justify-content:space-between;gap:10px;margin-top:auto;padding-top:9px;font-size:12px;font-weight:750;color:#593550}.vc-card-copy>span>span{font-size:16px}.vc-board .vc-board-signoff{font-family:Georgia,serif;font-style:italic;font-size:15px;color:#513822;text-align:center;margin:20px 0 0}.vc-board-signoff>span{color:#74344f;font-size:19px}
.vc-image-fallback{display:flex!important;align-items:center;justify-content:center;flex-direction:column;gap:9px;text-align:center;padding:12px;background:linear-gradient(135deg,#f6dbe6,#f9ebc6,#dfefe3,#e8e2f6);color:#463545;font-weight:700;font-size:13px;overflow-wrap:anywhere}.vc-image-fallback>span:first-child{font-size:32px}.vc-state{background:#fffaf1;border:1px dashed #a98b71;padding:24px 18px;margin:18px 0;color:#48362d;font-size:14px;text-align:center;font-weight:550}.vc-state .vc-button{margin-top:12px}.vc-loading{display:block;height:3px;width:110px;margin:0 auto 15px;background:linear-gradient(90deg,#bc5072,#c18b4a,#b6a251,#5a9271,#6485b9,#9864ae);animation:vc-load 1.8s ease-in-out infinite}
.vc-modal{position:fixed;inset:0;z-index:2400;display:flex;align-items:center;justify-content:center;padding:18px;background:#2c2018b5;backdrop-filter:blur(6px)}.vc-modal-panel{width:100%;max-width:620px;max-height:92vh;max-height:92dvh;display:flex;flex-direction:column;min-height:0;background:#fffcf5;border:1px solid #cdbca5;border-top:5px solid #bd87a9;border-radius:12px;box-shadow:0 25px 80px #1e120e55;overflow:hidden}.vc-modal-head{display:flex;align-items:center;justify-content:space-between;gap:13px;padding:17px 20px;border-bottom:1px solid #dfd2bf;flex-shrink:0}.vc-modal-head h2{font-size:24px;color:#302522;font-weight:800;line-height:1.25;letter-spacing:-.5px;overflow-wrap:anywhere}.vc-modal-body{overflow-y:auto;overscroll-behavior:contain;min-height:0;padding:21px}.vc-detail-image{display:block;width:100%;height:215px;object-fit:contain;background:#fff;margin-bottom:17px;border:1px solid #e6dccd}.vc-modal .vc-detail-category{font-size:14px;font-weight:750;color:#573f5b;margin-bottom:9px}.vc-modal .vc-detail-owned{display:flex;gap:8px;align-items:center;font-size:12px;color:#5d4219;font-weight:700;margin-bottom:15px}.vc-description{white-space:pre-line;color:#40332e;font-size:14px;line-height:1.85;overflow-wrap:anywhere}.vc-modal .vc-times{font-size:13px;font-weight:650;color:#54453b;margin-top:16px}.vc-links{display:flex;gap:9px;flex-wrap:wrap;margin-top:19px}.vc-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;border:1px solid #b9a3bd;border-radius:7px;background:#ecdef0;color:#3e294a!important;padding:10px 15px;font-size:13px;font-weight:750;text-decoration:none;transition:background .2s}.vc-button:hover{background:#e0cbe8}.vc-socials .vc-button{background:#fffaf1;border-color:#cbbb9f;color:#493729!important}.vc-socials .vc-button:hover{background:#f2e8d9}
@keyframes vc-load{0%,100%{opacity:.45}50%{opacity:1}}
@media(max-width:640px){.vc-board{padding:16px 11px}.vc-filter-paper{padding:16px 12px 10px}.vc-filters{grid-template-columns:1fr;gap:11px}.vc-filters input,.vc-filters select{font-size:16px}.vc-summary{gap:7px 13px;font-size:11px}.vc-rail{gap:17px;padding-inline:6px}.vc-rail>*{flex-basis:188px}.vc-board .vc-card-copy h3{font-size:16px}.vc-board .vc-card-copy p{font-size:12px}.vc-rail-footer{font-size:11px}.vc-board-rows{gap:10px}.vc-modal{padding:10px}.vc-modal-panel{max-height:94dvh}.vc-modal-head{padding:13px 15px}.vc-modal-head h2{font-size:21px}.vc-modal-body{padding:16px}.vc-detail-image{height:185px}}
@media(prefers-reduced-motion:reduce){.vc-scope *{animation:none!important;transition:none!important;scroll-behavior:auto!important}.vc-board .vc-card{transform:none}}
@media(forced-colors:active){.vc-board,.vc-filter-paper,.vc-card{background:Canvas;border:1px solid CanvasText}.vc-pin{background:Highlight}.vc-board .vc-card-copy h3,.vc-board .vc-card-copy p,.vc-summary,.vc-legend{color:CanvasText}}
`;
