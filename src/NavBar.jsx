// PrideCenterNavBar.jsx — complete replacement; no Tailwind configuration needed.
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Menu, X, ChevronDown, Heart, ExternalLink, ArrowRight } from "lucide-react";
import { useAuth } from "./AuthContext";

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Driscoll", path: "/driscoll-funds" },
  { name: "Events", path: "/events" },
  { name: "Pride", path: "/pride" },
  { name: "Contact", path: "/contact" },
];
const COLORS = ["#ad456b", "#a16839", "#8a712c", "#47805f", "#5079ae", "#8c5ca4", "#a35387"];
const WASHES = ["#fbeaf0", "#fff0e3", "#faf3da", "#eaf4ec", "#eaf0fb", "#f2eafa", "#f9eaf4"];
const isActivePath = (pathname, path) => path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);

export default function NavBar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const headerRef = useRef(null);
  const drawerRef = useRef(null);
  const closeRef = useRef(null);
  const menuRef = useRef(null);
  const accountRef = useRef(null);
  const accountButtonRef = useRef(null);
  const dashboardPath = isAdmin ? "/admin-dashboard" : "/staff-dashboard";
  const roleLabel = isAuthenticated ? (isAdmin ? "Admin" : "Staff") : "Account";
  const activeIndex = NAV_ITEMS.findIndex(item => isActivePath(location.pathname, item.path));
  const accentIndex = activeIndex < 0 ? 5 : activeIndex;

  useEffect(() => { setDrawerOpen(false); setAccountOpen(false); }, [location.pathname, location.search, location.hash]);

  // Keep Home/About's shared header offset accurate as the mobile header wraps.
  useEffect(() => {
    const root = document.documentElement;
    const oldValue = root.style.getPropertyValue("--hpc-header-offset");
    const oldPriority = root.style.getPropertyPriority("--hpc-header-offset");
    const measure = () => {
      if (headerRef.current) root.style.setProperty("--hpc-header-offset", `${Math.ceil(headerRef.current.getBoundingClientRect().height)}px`);
    };
    measure();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (headerRef.current) observer?.observe(headerRef.current);
    const handleResize = () => {
      measure();
      if (window.innerWidth >= 1180) setDrawerOpen(false);
      else setAccountOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      observer?.disconnect(); window.removeEventListener("resize", handleResize);
      if (oldValue) root.style.setProperty("--hpc-header-offset", oldValue, oldPriority);
      else root.style.removeProperty("--hpc-header-offset");
    };
  }, []);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const outside = event => { if (!accountRef.current?.contains(event.target)) setAccountOpen(false); };
    const escape = event => {
      if (event.key === "Escape") { setAccountOpen(false); accountButtonRef.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [accountOpen]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Native inert prevents clicks and keyboard/screen-reader navigation behind the modal.
    const panel = drawerRef.current;
    const modalRoot = panel?.parentElement;
    const backgroundNodes = Array.from(document.body.children).filter(node => node !== modalRoot && node instanceof HTMLElement);
    const previousInert = backgroundNodes.map(node => [node, node.inert]);
    backgroundNodes.forEach(node => { node.inert = true; });
    closeRef.current?.focus({ preventScroll: true });
    const onKey = event => {
      if (event.key === "Escape") { event.preventDefault(); setDrawerOpen(false); return; }
      if (event.key !== "Tab") return;
      const focusables = Array.from(panel?.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]') || []).filter(node => node.getClientRects().length);
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousInert.forEach(([node, value]) => { node.inert = value; });
      if (menuRef.current?.getClientRects().length) menuRef.current.focus({ preventScroll: true });
    };
  }, [drawerOpen]);

  const closeMenus = () => { setDrawerOpen(false); setAccountOpen(false); };
  const accountLinks = () => !isAuthenticated ? <>
    <Link to="/login" onClick={closeMenus}>Login <ArrowRight size={15} aria-hidden="true" /></Link>
    <Link to="/signup" onClick={closeMenus}>Sign Up <ArrowRight size={15} aria-hidden="true" /></Link>
  </> : <>
    <Link to={dashboardPath} onClick={closeMenus}>Dashboard <ArrowRight size={15} aria-hidden="true" /></Link>
    <button className="hpn-logout" type="button" onClick={() => { closeMenus(); logout(); }}>Logout</button>
  </>;

  const drawer = drawerOpen && <div className="hpn-modal">
    <div className="hpn-backdrop" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
    <aside ref={drawerRef} className="hpn-drawer" role="dialog" aria-modal="true" aria-labelledby="hpn-drawer-title">
      <div className="hpn-drawer-header"><div><p className="hpn-eyebrow">Hartford Pride Center</p><h2 id="hpn-drawer-title">A place to <em>belong.</em></h2></div><button ref={closeRef} className="hpn-icon-button" type="button" onClick={() => setDrawerOpen(false)} aria-label="Close menu"><X size={21} aria-hidden="true" /></button></div>
      <div className="hpn-drawer-scroll">
        <nav aria-label="Main navigation"><ul className="hpn-drawer-links">{NAV_ITEMS.map((item, index) => {
          const active = !item.external && isActivePath(location.pathname, item.path);
          const props = { className: `hpn-drawer-link${active ? " hpn-active" : ""}`, style: { "--item-color": COLORS[index], "--item-wash": WASHES[index], "--item-delay": `${index * 35}ms` }, onClick: closeMenus };
          const content = <><span className="hpn-nav-dot" aria-hidden="true" /><span>{item.name}</span>{item.external ? <ExternalLink size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}</>;
          return <li key={item.path}>{item.external ? <a href={item.path} target="_blank" rel="noopener noreferrer" {...props}>{content}</a> : <Link to={item.path} aria-current={active ? "page" : undefined} {...props}>{content}</Link>}</li>;
        })}</ul></nav>
        <div className="hpn-drawer-account"><p className="hpn-eyebrow">{roleLabel}</p><div className="hpn-account-links">{accountLinks()}</div></div>
        <div className="hpn-drawer-footer"><Link to="/support" className="hpn-donate" onClick={closeMenus}><Heart size={16} aria-hidden="true" /> Donate <ArrowRight size={16} aria-hidden="true" /></Link><p>A little kindness. A lasting difference.</p><div className="hpn-socials"><a href="https://www.facebook.com/HartfordPrideCenter" target="_blank" rel="noopener noreferrer" aria-label="Hartford Pride Center on Facebook (opens in a new tab)"><FaFacebook aria-hidden="true" /></a><span>With Pride. With you.</span><a href="https://www.instagram.com/hartfordpride/" target="_blank" rel="noopener noreferrer" aria-label="Hartford Pride on Instagram (opens in a new tab)"><FaInstagram aria-hidden="true" /></a></div></div>
      </div>
    </aside>
  </div>;

  return <>
    <style>{NAV_STYLES}</style>
    <header ref={headerRef} className="hpn-header" style={{ "--nav-accent": COLORS[accentIndex], "--nav-wash": WASHES[accentIndex] }}>
      <div className="hpn-bar">
        <Link to="/" className="hpn-brand" onClick={closeMenus} aria-label="Hartford Pride Center home"><img src="/PrideLogo3.jpg" alt="" /><span className="hpn-brand-copy"><span>Hartford</span><strong>Pride Center</strong></span></Link>
        <nav className="hpn-desktop" aria-label="Main navigation"><ul>{NAV_ITEMS.map((item, index) => {
          const active = !item.external && isActivePath(location.pathname, item.path);
          const props = { className: `hpn-desktop-link${active ? " hpn-active" : ""}`, style: { "--item-color": COLORS[index], "--item-wash": WASHES[index] } };
          return <li key={item.path}>{item.external ? <a href={item.path} target="_blank" rel="noopener noreferrer" {...props}>{item.name}</a> : <Link to={item.path} aria-current={active ? "page" : undefined} {...props}>{item.name}</Link>}</li>;
        })}<li className="hpn-account" ref={accountRef} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setAccountOpen(false); }}><button ref={accountButtonRef} type="button" className="hpn-account-button" aria-expanded={accountOpen} aria-controls="hpn-account-panel" onClick={() => setAccountOpen(value => !value)}>{roleLabel}<ChevronDown size={15} aria-hidden="true" style={{ transform: accountOpen ? "rotate(180deg)" : undefined }} /></button>{accountOpen && <div id="hpn-account-panel" className="hpn-account-panel hpn-account-links">{accountLinks()}</div>}</li></ul></nav>
        <div className="hpn-actions"><Link to="/support" className="hpn-donate" onClick={closeMenus}><Heart size={15} aria-hidden="true" /><span>Donate</span></Link><button ref={menuRef} type="button" className="hpn-menu-button" onClick={() => { setAccountOpen(false); setDrawerOpen(true); }} aria-label="Open navigation menu" aria-expanded={drawerOpen} aria-haspopup="dialog"><Menu size={22} aria-hidden="true" /><span>Menu</span></button></div>
      </div>
    </header>
    {drawer && typeof document !== "undefined" ? createPortal(drawer, document.body) : null}
  </>;
}

const NAV_STYLES = `
.hpn-header,.hpn-modal{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#49364f;line-height:1.5;-webkit-font-smoothing:antialiased;color-scheme:light}
.hpn-header *,.hpn-modal *{box-sizing:border-box}.hpn-header a,.hpn-modal a{color:inherit;text-decoration:none}.hpn-header button,.hpn-modal button{font:inherit;cursor:pointer}.hpn-header ul,.hpn-modal ul{list-style:none;margin:0;padding:0}.hpn-modal h2,.hpn-modal p{margin:0}
.hpn-header a:focus-visible,.hpn-header button:focus-visible,.hpn-modal a:focus-visible,.hpn-modal button:focus-visible{outline:3px solid #9864b0;outline-offset:3px}
.hpn-header{position:fixed;inset:0 0 auto;z-index:50;background:linear-gradient(110deg,#fff9fbed,#fffdf7f5 45%,#f5f1fcf2);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-bottom:1px solid #e4d7e4;box-shadow:0 4px 20px #6844690a;padding-bottom:3px}
.hpn-header::after{content:"";position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#d9627f,#dda06a,#d4bb64,#78ad8e,#7e9bce,#b087be)}
.hpn-bar{width:97%;max-width:1560px;margin:auto;padding:9px clamp(6px,1.4vw,22px);display:flex;align-items:center;gap:22px;min-height:72px}
.hpn-brand{display:flex;align-items:center;gap:10px;flex-shrink:0}.hpn-brand img{width:46px;height:46px;object-fit:contain;background:#fff;padding:3px;border:1px solid #eadbe5;border-radius:12px}.hpn-brand-copy{display:flex;flex-direction:column;line-height:1.13}.hpn-brand-copy>span{font-size:11px;letter-spacing:1.3px;color:#82637e}.hpn-brand-copy strong{font-family:Georgia,"Times New Roman",serif;font-size:21px;font-style:italic;font-weight:400;margin-top:3px;background:linear-gradient(100deg,#a7365d,#965123,#79621e,#326f53,#3c659f,#814b92);background-clip:text;-webkit-background-clip:text;color:transparent;padding-right:3px}
.hpn-desktop{margin-left:auto}.hpn-desktop>ul{display:flex;align-items:center;gap:3px}.hpn-desktop-link{position:relative;display:flex;align-items:center;justify-content:center;min-height:44px;padding:10px 10px;font-size:13px;font-weight:550;border-radius:11px;transition:background .2s,color .2s}.hpn-desktop .hpn-desktop-link:hover,.hpn-desktop .hpn-desktop-link.hpn-active{background:var(--item-wash);color:var(--item-color)}.hpn-desktop-link.hpn-active::after{content:"";position:absolute;bottom:4px;left:calc(50% - 7px);width:14px;height:2px;border-radius:4px;background:var(--item-color)}
.hpn-account{position:relative;margin-left:6px}.hpn-account-button{display:flex;align-items:center;gap:6px;min-height:44px;padding:10px;background:none;border:0;border-radius:11px;color:#765379;font-size:12px!important}.hpn-account-button:hover{background:#f0e6f2}.hpn-account-button svg{transition:transform .2s}.hpn-account-panel{position:absolute;top:calc(100% + 13px);right:0;width:200px;padding:7px;border:1px solid #e3d4e7;border-radius:16px;background:#fffcfe;box-shadow:0 12px 35px #49324f1c}
.hpn-account-links>a,.hpn-account-links>button{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:44px;padding:11px 13px;border:0;border-radius:10px;background:none;color:#765078;font-size:13px;text-align:left}.hpn-account-links>a:hover,.hpn-account-links>button:hover{background:#f1e7f4}.hpn-account-links>.hpn-logout{color:#a34460}
.hpn-actions{display:flex;align-items:center;gap:10px;flex-shrink:0}.hpn-header .hpn-donate,.hpn-modal .hpn-donate{display:flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:10px 17px;background:#80577e;border:1px solid #80577e;border-radius:999px;color:#fff;font-size:12px;font-weight:650;box-shadow:0 3px 10px #80577e12;transition:background .2s}.hpn-header .hpn-donate:hover,.hpn-modal .hpn-donate:hover{background:#70446e}.hpn-donate>svg:first-child{fill:#ffffff24}.hpn-menu-button{display:none;align-items:center;justify-content:center;gap:7px;min-height:44px;min-width:44px;padding:8px 10px;border:1px solid #ddc9df;border-radius:13px;background:#fffafc;color:#765178;font-size:12px!important}
.hpn-modal{position:fixed;inset:0;z-index:1000}.hpn-backdrop{position:absolute;inset:0;background:#27192e55;backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);animation:hpn-fade .2s ease both}.hpn-drawer{position:absolute;inset:0 0 0 auto;width:min(90vw,390px);height:100%;height:100dvh;display:flex;flex-direction:column;min-height:0;background:radial-gradient(ellipse at 100% 0,#f3deee77,transparent 50%),#fffaf7;box-shadow:-15px 0 50px #31203629;animation:hpn-slide .38s cubic-bezier(.22,1,.36,1) both;padding-left:4px}.hpn-drawer::before{content:"";position:absolute;inset:0 auto 0 0;width:4px;background:linear-gradient(#d9627f,#dda06a,#d4bb64,#78ad8e,#7e9bce,#b087be)}
.hpn-drawer-header{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:calc(23px + env(safe-area-inset-top,0px)) 20px 20px;border-bottom:1px solid #e8dce6;flex-shrink:0}.hpn-eyebrow{font-size:10px;font-weight:650;color:#916e8a;letter-spacing:1px}.hpn-drawer h2{font-size:23px;line-height:1.25;font-weight:500;color:#59405e;margin-top:7px}.hpn-drawer h2 em{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-weight:400;color:#986589}.hpn-icon-button{display:grid;place-items:center;width:44px;height:44px;flex-shrink:0;border:1px solid #e6d3e4;border-radius:50%;background:#ffffffb3;color:#845c83}.hpn-icon-button:hover{background:#f2e5ef}
.hpn-drawer-scroll{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px 16px calc(18px + env(safe-area-inset-bottom,0px))}.hpn-drawer-links{display:grid;gap:5px}.hpn-drawer-link{display:flex;align-items:center;gap:12px;min-height:47px;padding:11px 13px;border-radius:13px;font-size:15px;font-weight:550;animation:hpn-item .35s ease both;animation-delay:var(--item-delay)}.hpn-drawer-link>svg{margin-left:auto;opacity:.65}.hpn-nav-dot{width:7px;height:7px;border-radius:50%;background:var(--item-color);flex-shrink:0}.hpn-drawer .hpn-drawer-link.hpn-active,.hpn-drawer .hpn-drawer-link:hover{background:var(--item-wash);color:var(--item-color)}
.hpn-drawer-account{margin-top:18px;padding-top:17px;border-top:1px solid #e9dfe7}.hpn-drawer-account>.hpn-eyebrow{padding:0 13px 7px;text-transform:uppercase}.hpn-drawer-footer{border-top:1px solid #e9dfe7;margin-top:16px;padding:18px 3px 0}.hpn-drawer-footer>.hpn-donate{width:100%}.hpn-drawer-footer>p{text-align:center;font-size:11px;color:#927b91;margin-top:9px}.hpn-socials{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:14px}.hpn-socials>a{display:grid;place-items:center;min-width:44px;min-height:44px;border:1px solid #e6d9e8;border-radius:50%;background:#fffdfd;color:#886183;font-size:19px}.hpn-socials>a:hover{background:#f4e9f2}.hpn-socials>span{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-size:14px;color:#96778e}
@keyframes hpn-slide{from{transform:translateX(100%)}to{transform:translateX(0)}}@keyframes hpn-fade{from{opacity:0}to{opacity:1}}@keyframes hpn-item{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
@media(max-width:1179px){.hpn-desktop{display:none}.hpn-menu-button{display:flex}.hpn-actions{margin-left:auto}.hpn-bar{gap:12px}}
@media(max-width:600px){.hpn-bar{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 12px;min-height:0;padding:10px 8px}.hpn-brand{grid-column:1/-1;justify-content:center;gap:10px;padding-bottom:8px;border-bottom:1px solid #eaddE866}.hpn-brand img{width:38px;height:38px;border-radius:11px}.hpn-brand-copy{align-items:center}.hpn-brand-copy>span{font-size:11px;letter-spacing:1.7px}.hpn-brand-copy strong{font-size:25px;margin-top:2px}.hpn-actions{grid-column:1/-1;justify-content:space-between;width:100%;gap:10px;margin:0}.hpn-menu-button{order:0;min-height:44px;padding:8px 13px;border-color:transparent;background:transparent}.hpn-header .hpn-donate{min-height:44px;padding:9px 17px}.hpn-drawer-header{padding-inline:16px}.hpn-drawer-scroll{padding-inline:12px}}
@media(prefers-reduced-motion:reduce){.hpn-header *,.hpn-modal *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
@media(forced-colors:active){.hpn-brand-copy strong{background:none;color:LinkText}.hpn-drawer{border-left:1px solid CanvasText}.hpn-desktop-link.hpn-active,.hpn-drawer-link.hpn-active{outline:1px solid Highlight}}
`;
