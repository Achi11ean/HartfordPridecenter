import React, { useCallback, useEffect, useRef, useState } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import { motion, useReducedMotion } from "framer-motion";

import { FaCalendarAlt, FaEnvelope, FaFacebook, FaInstagram, FaPaperPlane } from "react-icons/fa";

import AnnualPrideEventDetails from "./AnnualPrideEventDetails";

import SponsorSlider from "./SponsorSlider";

import VendorSlider from "./VendorSlider";

import PublicFundersSection from "./PublicFundersSection";

// Single-file page replacement. Existing child components remain separate.

const API = "https://singspacebackend.onrender.com";

const INKS = ["#a52d59", "#995120", "#7b651c", "#28694e", "#365fab", "#80509b"];

function safeHref(value) {

  if (typeof value !== "string" || !value.trim()) return "";

  const raw = value.trim();

  if (/^[a-z][a-z\d+.-]*:/i.test(raw) && !/^https?:/i.test(raw)) return "";

  try { const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }

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

  return <section id={id} className={`hcp3-scope hcp3-band hcp3-band-${tone}`}><Reveal className="hcp3-container"><header className="hcp3-section-head"><div>{eyebrow && <p className="hcp3-eyebrow">{eyebrow}</p>}<h2>{title}</h2>{intro && <p className="hcp3-intro">{intro}</p>}</div>{extra}</header>{children}</Reveal></section>;

}

function CommunityImage({ src, alt, className = "", eager = false }) {

  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return src && !failed ? <img className={className} src={src} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)}/> : <span className={`hcp3-image-fallback ${className}`} role="img" aria-label={alt}><span aria-hidden="true">✦</span><span>{alt}</span></span>;

}

function ExternalLink({ href, children, className = "hcp3-inline-link", fallback = false }) {

  const safe = safeHref(href);

  return safe ? <a className={className} href={safe} target="_blank" rel="noopener noreferrer">{children}</a> : fallback ? <span className={className}>{children}</span> : null;

}

const VALUES = ["Trans inclusive", "Community programs", "Advocacy", "Wellness", "Events", "Everyone welcome"];

// Transparent section: a parent's heart-comet canvas can continue behind the hero.

// The supplied festival page provides the shared light background.

function PrideHero({ festival = false, date, children, appearance = "light" }) {

  return <section className={`hcp3-scope hcp3-hero${appearance === "dark" ? " hcp3-hero-dark" : ""}`}><div className="hcp3-hero-aurora" aria-hidden="true"/><div className="hcp3-container"><Reveal className="hcp3-hero-grid"><div className="hcp3-hero-copy"><p className="hcp3-eyebrow">Hartford Pride Center · Connecticut</p><h1>{festival ? <>Capital City Pride.<br/><em>All heart. All of us.</em></> : <>Building community,<br/><em>together.</em></>}</h1><p>{festival ? "Hartford’s Pride celebration — a place for queer joy, local creativity, and the people who make this city feel like home." : "A welcoming place where LGBTQIA+ people, families, and allies connect, find support, and build a future where everyone belongs exactly as they are."}</p>{date && <div className="hcp3-hero-date">{date}</div>}<ul className="hcp3-values">{VALUES.map((value, index) => <li key={value} style={{ "--value-ink": INKS[index] }}>{value}</li>)}</ul></div><figure className="hcp3-hero-logo"><CommunityImage eager src={festival ? "/ccp.jpg" : "/PrideLogo3.jpg"} alt={festival ? "Capital City Pride" : "Hartford Pride Center"}/><figcaption>A little more joy. A lot more belonging.</figcaption></figure></Reveal></div>{children}</section>;

}

const MENU_COLORS = ["#ff6b7b", "#ffac65", "#ffe078", "#80e2ad", "#8cbcff", "#cf9fff"];
const MENU_INKS = ["#8b1930", "#803900", "#645000", "#155437", "#214880", "#593178"];
const MENU_ITEMS = [["The day", "details"], ["Itinerary", "itinerary"], ["Talent", "talent"], ["Sponsors", "sponsors"], ["Vendors", "vendors"], ["Funders", "funders"]];

function PrideQuickNav() {
  const reduced = useReducedMotion();
  const [introduced, setIntroduced] = useState(false);
  return <motion.nav
    className={`hcp3-quick-nav${introduced && !reduced ? " hcp3-nav-introduced" : ""}`}
    aria-label="Explore the Pride celebration"
    viewport={{ once: true, amount: .6 }}
    onViewportEnter={() => setIntroduced(true)}
  >
    <p className="hcp3-nav-caption">Your Pride day <span>Explore · swipe to browse ↔</span></p>
    <div className="hcp3-nav-links" tabIndex={0} role="region" aria-label="Pride section links, scroll horizontally">
      {MENU_ITEMS.map(([label, target], index) => <a
        key={target} href={`#pride-${target}`}
        style={{ "--menu-color": MENU_COLORS[index], "--menu-ink": MENU_INKS[index], "--menu-delay": `${.25 + index * .9}s` }}
        onClick={event => {
          const section = document.getElementById(`pride-${target}`);
          if (!section) return;
          event.preventDefault();
          const page = event.currentTarget.closest(".hcp3-page");
          const clearance = page ? parseFloat(getComputedStyle(page).paddingTop) : 144;
          window.scrollTo({ top: Math.max(0, section.getBoundingClientRect().top + window.scrollY - clearance - 12), behavior: reduced ? "auto" : "smooth" });
          // Move keyboard focus with the section jump without changing the scroll position.
          const previousTabIndex = section.getAttribute("tabindex");
          section.setAttribute("tabindex", "-1");
          section.focus({ preventScroll: true });
          section.addEventListener("blur", () => {
            if (previousTabIndex === null) section.removeAttribute("tabindex");
            else section.setAttribute("tabindex", previousTabIndex);
          }, { once: true });
        }}
      ><span aria-hidden="true">✦</span>{label}<span className="hcp3-nav-arrow" aria-hidden="true">↘</span></a>)}
    </div>
  </motion.nav>;
}

const SHARE_URL = "https://share.karaoverse.com/og/pride";

function PrideWelcome({ onComplete }) {

  const reduced = useReducedMotion();

  const skip = useRef(null);

  useEffect(() => {

    if (reduced) { onComplete(); return; }

    const previous = document.activeElement, overflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    skip.current?.focus();

    const timer = window.setTimeout(onComplete, 3000);

    const key = event => { if (event.key === "Escape") onComplete(); if (event.key === "Tab") { event.preventDefault(); skip.current?.focus(); } };

    window.addEventListener("keydown", key);

    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", key); document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus?.(); };

  }, [onComplete, reduced]);

  return <div className="hcp3-scope hcp3-welcome" role="dialog" aria-modal="true" aria-label="Welcome to Capital City Pride"><div className="hcp3-welcome-inner"><img src="/ccp.jpg" alt="Capital City Pride"/><h2>Hartford Pride Center</h2><p>Capital City Pride</p><div className="hcp3-welcome-rule" aria-hidden="true"/><button ref={skip} type="button" onClick={onComplete}>Come celebrate ↗</button></div></div>;

}

export default function HartfordCityPride() {

  const annual = usePrideResource("/pride/2/annual");

  const [intro, setIntro] = useState(true), [shareMessage, setShareMessage] = useState(""), [copyFallback, setCopyFallback] = useState(false);

  const main = useRef(null);

  const finish = useCallback(() => setIntro(false), []);

  useEffect(() => { if (!intro) main.current?.focus({ preventScroll: true }); }, [intro]);

  const share = async () => {

    try {

      if (navigator.share) { await navigator.share({ title: "Capital City Pride", text: "Celebrate with our Hartford Pride community!", url: SHARE_URL }); return; }

      await navigator.clipboard.writeText(SHARE_URL); setShareMessage("Share link copied.");

    } catch (error) { if (error.name !== "AbortError") { setCopyFallback(true); setShareMessage("Copy the link below to share Pride."); } }

  };

  const address = [annual.data?.address, annual.data?.city, annual.data?.state].filter(Boolean).join(", ") || "Pratt Street, Hartford, CT";

  return <><style>{STYLES}</style>{intro ? <PrideWelcome onComplete={finish}/> : <main ref={main} tabIndex={-1} className="hcp3-scope hcp3-page" aria-label="Capital City Pride"><div className="hcp3-rainbow" aria-hidden="true"/>

    <PrideHero festival date={<ExternalLink href="https://karaoverse.com/venue/capital-city-pride"><FaCalendarAlt aria-hidden="true"/>{annual.loading ? "Finding our festival date…" : formatDate(annual.data?.date)} <span aria-hidden="true">↗</span></ExternalLink>}><PrideQuickNav/></PrideHero>

    <AnnualPrideEventDetails event={annual.data} loading={annual.loading} error={annual.error} onRetry={annual.retry}/>

    <Section id="pride-sponsors" tone="lavender" eyebrow="The people behind the celebration" title={<>Proud <em>sponsors.</em></>} intro="Local generosity. A whole city of possibility." extra={<Link className="hcp3-inline-link" to="/sponsorinvitation">Support Pride ↗</Link>}><SponsorSlider embedded/></Section>

    <Section id="pride-vendors" tone="mint" eyebrow="The Pride marketplace" title={<>Meet the <em>makers.</em></>} intro="Good food, creative finds, and the local businesses that make our community shine."><VendorSlider embedded/></Section>

    <Section id="pride-funders" tone="blue" eyebrow="Community, made possible" title={<>Generosity with <em>heart.</em></>} intro="Champions whose support helps connection, creativity, and Pride grow."><PublicFundersSection embedded/></Section>

    <footer className="hcp3-footer"><Reveal className="hcp3-container"><div className="hcp3-footer-grid"><div><p className="hcp3-eyebrow">Hartford Pride Center</p><h2>More visibility.<br/><em>More joy. More community.</em></h2><p>Uplifting, supporting, and connecting LGBTQIA+ people through advocacy, wellness resources, volunteerism, partnerships, events, education, and year-round community engagement.</p><div className="hcp3-footer-map"><iframe title="Capital City Pride location" src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`} loading="lazy"/></div>{address && <ExternalLink href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}>{address} ↗</ExternalLink>}</div><div><h3>Explore Hartford Pride</h3><div className="hcp3-footer-links">{[["About", "/about"], ["Services", "/services"], ["Events", "/events"], ["Volunteer", "/volunteer"], ["Resources", "/resources"], ["Contact", "/contact"], ["Donate", "/support"], ["Sponsors", "/sponsors"]].map(([label, to]) => <Link to={to} key={to}>{label} ↗</Link>)}</div></div><div><h3>Stay connected</h3><p>Volunteer, sponsor, collaborate, find support, or just say hello. There’s a place for you here.</p><a className="hcp3-inline-link hcp3-footer-email" href="mailto:david@hartfordpridecenter.org">david@hartfordpridecenter.org</a><div className="hcp3-footer-socials"><a className="hcp3-icon-button" href="https://www.instagram.com/hartfordpride/" target="_blank" rel="noopener noreferrer" aria-label="Hartford Pride on Instagram"><FaInstagram/></a><a className="hcp3-icon-button" href="https://www.facebook.com/HartfordPrideCenter" target="_blank" rel="noopener noreferrer" aria-label="Hartford Pride Center on Facebook"><FaFacebook/></a><a className="hcp3-icon-button" href="mailto:david@hartfordpridecenter.org" aria-label="Email Hartford Pride"><FaEnvelope/></a><button type="button" className="hcp3-button" onClick={share}><FaPaperPlane aria-hidden="true"/>Share</button></div><p className="hcp3-share-message" role="status">{shareMessage}</p>{copyFallback && <input className="hcp3-share-fallback" aria-label="Share link" readOnly value={SHARE_URL} onFocus={event => event.target.select()}/>}</div></div><p className="hcp3-copyright">© {new Date().getFullYear()} Hartford Pride Center · Built with Pride, for Hartford and beyond.</p></Reveal></footer><div className="hcp3-rainbow" aria-hidden="true"/>

  </main>}</>;

}

const STYLES = `

.hcp3-scope{--hcp3-text:#49364f;--hcp3-muted:#735f75;--hcp3-line:#dfd0de;--hcp3-accent:#89507e;--hcp3-wash:#f7e9f2;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:14px;line-height:1.65;color:var(--hcp3-text);color-scheme:light;-webkit-font-smoothing:antialiased}

.hcp3-scope *{box-sizing:border-box}.hcp3-scope :is(h1,h2,h3,h4,p,figure){margin:0}.hcp3-scope a{color:inherit}.hcp3-scope button,.hcp3-scope input,.hcp3-scope select{font:inherit}.hcp3-scope button{cursor:pointer}.hcp3-scope button:disabled{cursor:default;opacity:.35}.hcp3-scope :is(a,button,input,select,[tabindex="0"]):focus-visible{outline:3px solid #8754a0;outline-offset:4px}.hcp3-scope [hidden]{display:none!important}.hcp3-scope em{font-family:Georgia,"Times New Roman",serif;font-weight:400}.hcp3-container{width:97%;max-width:1560px;padding-inline:clamp(12px,2.3vw,34px);margin-inline:auto;min-width:0}.hcp3-page{background:#fcf9f5;min-height:100vh;padding-top:var(--hhcp3-header-offset,var(--hcp3-header-clearance))}

.hcp3-rainbow{height:4px;background:linear-gradient(90deg,#dc789c,#e5af7d,#d9c677,#90bca0,#8dabe0,#b692d0)}

.hcp3-band{width:100%;border-block-start:1px solid var(--hcp3-line);border-radius:0;padding-block:36px 40px;scroll-margin-top:calc(var(--hhcp3-header-offset,var(--hcp3-header-clearance)) + 12px)}

.hcp3-band-cream{background:#fcf8ee;--hcp3-accent:#806529;--hcp3-line:#e2d4b6;--hcp3-wash:#f8edce}.hcp3-band-mint{background:#edf6f1;--hcp3-accent:#2c6e54;--hcp3-line:#bfd9cb;--hcp3-wash:#dff1e7}.hcp3-band-pink{background:#fbecf1;--hcp3-accent:#98385e;--hcp3-line:#e7c8d5;--hcp3-wash:#f6dce7}.hcp3-band-lavender{background:#f0eafa;--hcp3-accent:#785297;--hcp3-line:#d2c4e5;--hcp3-wash:#e8dcf6}.hcp3-band-blue{background:#ebf2fc;--hcp3-accent:#3a6199;--hcp3-line:#c5d5eb;--hcp3-wash:#dfebfc}

.hcp3-section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;padding-bottom:20px;border-bottom:1px solid var(--hcp3-line);margin-bottom:24px}.hcp3-eyebrow{font-size:10px;font-weight:750;letter-spacing:1.7px;text-transform:uppercase;color:var(--hcp3-accent)}.hcp3-section-head h2{font-size:clamp(29px,3.2vw,43px);letter-spacing:-1.1px;line-height:1.18;font-weight:600;margin-top:7px}.hcp3-section-head h2 em{color:var(--hcp3-accent)}.hcp3-intro{max-width:740px;font-size:13px;line-height:1.8;color:var(--hcp3-muted);margin-top:10px!important}.hcp3-count{font-size:11px;white-space:nowrap;color:var(--hcp3-accent)}

.hcp3-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:9px 17px;border:1px solid var(--hcp3-line);border-radius:99px;background:#fffafde6;color:var(--hcp3-accent)!important;font-size:12px!important;font-weight:650;text-decoration:none;transition:background .2s,transform .2s}.hcp3-button:hover{background:var(--hcp3-wash);transform:translateY(-1px)}.hcp3-button-primary{background:#79517f;color:#fff!important;border-color:#79517f}.hcp3-button-primary:hover{background:#62406a}.hcp3-icon-button{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:44px;height:44px;border:1px solid var(--hcp3-line);border-radius:50%;background:#fffc;color:var(--hcp3-accent)}.hcp3-icon-button:hover:not(:disabled){background:var(--hcp3-wash)}.hcp3-link-row{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;margin-top:20px}.hcp3-inline-link{display:inline-flex;align-items:center;gap:7px;min-height:44px;font-size:13px;color:var(--hcp3-accent)!important;text-decoration:underline!important;text-decoration-thickness:1px;text-underline-offset:5px;overflow-wrap:anywhere}.hcp3-inline-link:hover{text-decoration-thickness:2px!important}

.hcp3-state{padding:25px 16px;text-align:center;color:var(--hcp3-muted);font-size:13px}.hcp3-state .hcp3-button{margin-top:15px}.hcp3-loading-line{display:block;width:100px;height:3px;margin:0 auto 15px;background:linear-gradient(90deg,#d5668b,#dcb956,#62a381,#748ecd,#a276bb);animation:hcp3-soft-pulse 1.8s ease-in-out infinite}.hcp3-image-fallback{display:flex!important;align-items:center;justify-content:center;flex-direction:column;gap:7px;text-align:center;padding:14px;background:linear-gradient(135deg,#f8e0e9,#fff1d2,#dff0e8,#e4eafa,#f0e0f6);color:#76547c;font-weight:650;overflow-wrap:anywhere}.hcp3-image-fallback>span:first-child{font-size:29px;font-family:Georgia,serif}

.hcp3-hero{position:relative;isolation:isolate;padding-block:20px 0;border-bottom:1px solid #e6d4e0;overflow:hidden}.hcp3-hero-aurora{position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(ellipse at 12% 0,#f2c3d54a,transparent 55%),radial-gradient(ellipse at 90% 100%,#c6b6eb36,transparent 50%)}.hcp3-hero-grid{display:grid;grid-template-columns:1.12fr .88fr;align-items:center;gap:clamp(25px,5vw,80px)}.hcp3-hero h1{font-size:clamp(39px,5.4vw,73px);line-height:1.03;letter-spacing:-2px;font-weight:580;margin:17px 0 21px}.hcp3-hero h1 em{background:linear-gradient(100deg,#a83568,#a7612a,#81701c,#327253,#4368a3,#87509e);background-clip:text;-webkit-background-clip:text;color:transparent;padding-right:5px}.hcp3-hero-copy>p:not(.hcp3-eyebrow){font-size:15px;line-height:1.85;color:#725d73;max-width:650px}.hcp3-hero-logo{position:relative;justify-self:center;width:min(100%,340px);padding:10px;background:#fffdfd;border:1px solid #e7d5df;box-shadow:0 12px 28px #79527b14;transform:rotate(2deg)}.hcp3-hero-logo:before{content:"";position:absolute;width:66px;height:23px;top:-11px;left:calc(50% - 33px);background:#e4c8eaac;transform:rotate(-5deg);border-inline:1px dashed #bc95c755}.hcp3-hero-logo img,.hcp3-hero-logo>.hcp3-image-fallback{display:block;width:100%;height:245px;object-fit:contain}.hcp3-hero-logo figcaption{font-family:Georgia,serif;font-style:italic;text-align:center;color:#895d81;font-size:16px;padding:10px 2px 2px}.hcp3-hero-date{margin-top:16px}.hcp3-hero-date .hcp3-inline-link{font-size:13px;font-weight:650}.hcp3-values{display:flex;flex-wrap:wrap;gap:5px 17px;list-style:none;margin:20px 0 0;padding:0}.hcp3-values li{font-size:11px;color:#6e596e;display:flex;gap:7px;align-items:center}.hcp3-values li:before{content:"✦";color:var(--value-ink);font-size:9px}.hcp3-quick-nav{display:flex;gap:22px;overflow-x:auto;padding-block:18px 0;margin-top:20px;border-top:1px solid #e1d1dd;scrollbar-width:thin}.hcp3-quick-nav a{flex-shrink:0;display:inline-flex;align-items:center;gap:7px;min-height:44px;text-decoration:none;font-size:12px;font-weight:650;color:#6e526f;border-bottom:2px solid var(--value-ink)}

.hcp3-footer{padding-block:34px 22px;background:#f7f1f8;border-top:1px solid #dfcde4}.hcp3-footer-grid{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:35px}.hcp3-footer h2{font-size:29px;line-height:1.2;letter-spacing:-.7px;font-weight:550}.hcp3-footer h3{font-size:15px;font-weight:700;margin-bottom:11px}.hcp3-footer p{font-size:12px;line-height:1.8;color:#776179;margin-top:12px}.hcp3-footer-links{display:grid;grid-template-columns:1fr 1fr;gap:0 16px}.hcp3-footer-links a{font-size:12px;min-height:44px;display:flex;align-items:center;text-decoration:none}.hcp3-footer-socials{display:flex;flex-wrap:wrap;gap:9px;margin-top:13px}.hcp3-footer-email{overflow-wrap:anywhere}.hcp3-copyright{padding-top:19px;margin-top:24px;border-top:1px solid #dfcde4;font-size:10px!important;text-align:center}.hcp3-share-message{font-size:11px;min-height:18px;margin-top:8px}.hcp3-share-fallback{width:100%;font-size:12px;margin-top:9px;padding:9px;border:1px solid #d7c4dc}

.hcp3-welcome{position:fixed;inset:0;z-index:2300;display:grid;place-items:center;padding:20px;text-align:center;color:#fff;background:radial-gradient(ellipse at 30% 15%,#55354f88,transparent 50%),radial-gradient(ellipse at 75% 85%,#24386588,transparent 50%),#181321}.hcp3-welcome-inner{max-width:650px}.hcp3-welcome img{width:min(62vw,210px);height:150px;object-fit:contain;margin:0 auto 22px;border-radius:5px}.hcp3-welcome h2{font-family:Georgia,serif;font-size:clamp(34px,6vw,57px);font-weight:400;line-height:1.12;letter-spacing:-1px}.hcp3-welcome p{font-size:clamp(22px,5vw,39px);font-family:Georgia,serif;font-style:italic;letter-spacing:.5px;margin-top:15px;color:#fff2fb;text-shadow:0 0 10px #f9b4dd,0 0 25px #d482b9,0 0 42px #9372d1}.hcp3-welcome-rule{height:2px;background:linear-gradient(90deg,#f38fae,#eeb879,#f6e092,#9bdcb4,#a5c7fa,#d4b3f0);width:min(70vw,350px);margin:25px auto}.hcp3-welcome button{border:1px solid #ffffff50;border-radius:99px;background:#ffffff0c;color:#fff;min-height:44px;padding:9px 20px;font-size:12px;margin-top:10px}

@keyframes hcp3-soft-pulse{0%,100%{opacity:.4}50%{opacity:1}}

@media(min-width:1400px){.hcp3-lineup{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}}

@media(max-width:760px){.hcp3-band{padding-block:27px 30px}.hcp3-section-head{gap:12px;margin-bottom:19px;padding-bottom:17px}.hcp3-section-head h2{font-size:31px}.hcp3-hero{padding-block:20px 0}.hcp3-hero-grid{grid-template-columns:1fr;gap:24px;text-align:center}.hcp3-hero-logo{grid-row:1;width:min(53vw,210px);transform:rotate(-2deg)}.hcp3-hero-logo img,.hcp3-hero-logo>.hcp3-image-fallback{height:145px}.hcp3-hero-logo figcaption{font-size:13px}.hcp3-hero h1{font-size:clamp(38px,8vw,53px);letter-spacing:-1.6px;margin:13px 0 16px}.hcp3-hero-copy>p:not(.hcp3-eyebrow){font-size:14px;margin-inline:auto}.hcp3-hero-date .hcp3-inline-link{justify-content:center}.hcp3-hero-date{margin-top:9px}.hcp3-values{justify-content:center;gap:6px 12px;margin-top:14px}.hcp3-values li{font-size:10px}.hcp3-quick-nav{gap:20px;margin-top:19px;padding-top:9px}.hcp3-quick-nav a{font-size:11px}.hcp3-event-summary{grid-template-columns:1fr;gap:20px}.hcp3-footer-grid{grid-template-columns:1fr 1fr;gap:25px}.hcp3-footer-grid>div:first-child{grid-column:1/-1}.hcp3-modal{padding:10px}.hcp3-modal-panel{max-height:94dvh}.hcp3-modal-head{padding:13px 16px}.hcp3-modal-head h2{font-size:20px}.hcp3-modal-body{padding:17px}.hcp3-lineup{grid-template-columns:repeat(3,minmax(0,1fr));gap:20px 12px}.hcp3-directory-art{height:135px}.hcp3-rail>*{flex-basis:200px}}

@media(max-width:480px){.hcp3-filters{grid-template-columns:1fr;gap:9px}.hcp3-filters input,.hcp3-filters select{font-size:16px}.hcp3-directory-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.hcp3-directory-grid .hcp3-directory-art{height:106px}.hcp3-directory-grid h3{font-size:14px}.hcp3-directory-copy{padding-inline:3px}.hcp3-directory-card{padding:6px 6px 11px}.hcp3-schedule-row{grid-template-columns:72px minmax(0,1fr);gap:12px;padding-block:18px}.hcp3-schedule-time{font-size:11px}.hcp3-schedule-time span{font-size:10px}.hcp3-schedule-content h3{font-size:19px}.hcp3-schedule-description{font-size:12px}.hcp3-lineup{grid-template-columns:repeat(2,minmax(0,1fr))}.hcp3-footer-grid{grid-template-columns:1fr;gap:23px}.hcp3-footer-grid>div:first-child{grid-column:auto}.hcp3-detail-image{height:170px}.hcp3-map{height:310px}.hcp3-section-head{align-items:start}.hcp3-count{font-size:10px;margin-top:6px}}

@media(prefers-reduced-motion:reduce){.hcp3-scope *{animation:none!important;transition:none!important;scroll-behavior:auto!important}.hcp3-directory-card:hover,.hcp3-person:hover .hcp3-portrait{transform:none}}

@media(forced-colors:active){.hcp3-hero h1 em{background:none;color:CanvasText}.hcp3-directory-card,.hcp3-hero-logo{border:1px solid CanvasText}.hcp3-welcome p{text-shadow:none;color:CanvasText}}

.hcp3-page:focus{outline:none}

.hcp3-footer-map{width:100%;max-width:400px;margin-top:16px;border:1px solid #dac7dc;background:#e5dfe8}

.hcp3-footer-map iframe{display:block;width:100%;height:150px;border:0}

.hcp3-band-lavender{border-top:3px solid #b198d1}

.hcp3-band-mint{border-top:3px solid #91baa3}

.hcp3-band-blue{border-top:3px solid #9ab7dc}

.hcp3-section-head h2 em{background:linear-gradient(100deg,#a52d59,#995120,#7b651c,#28694e,#365fab,#80509b);background-clip:text;-webkit-background-clip:text;color:transparent;padding-right:4px}

.hcp3-band :is(.pc-directory,.pc-scope){min-width:0}

@media(max-width:600px){.hcp3-section-head{flex-wrap:wrap}.hcp3-section-head>.hcp3-inline-link{min-height:44px;font-size:12px}}

@media(forced-colors:active){.hcp3-section-head h2 em{background:none;color:CanvasText}}

/* Clear the fixed site header, including the taller mobile branding row.
   A parent can override --hhcp3-header-offset if its navigation changes height. */
.hcp3-page{--hcp3-header-clearance:calc(96px + env(safe-area-inset-top,0px))}
.hcp3-quick-nav{display:block;width:100%;max-width:none;border-radius:0;overflow:visible;margin-top:30px;padding:17px 20px 19px;background:#302038;border:1px solid #6e5177;border-top:3px solid #c4a0d0;box-shadow:0 9px 24px #42214926;color:#fff8ff}
.hcp3-nav-caption{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:15px;font-weight:750;color:#fff8ff;letter-spacing:.15px}
.hcp3-nav-caption>span{font-size:11px;font-weight:500;color:#e0cde8}
.hcp3-nav-links{display:flex;flex-wrap:nowrap;gap:10px;margin-top:10px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x proximity;scroll-padding-inline:8px;padding:8px 6px 12px;scrollbar-width:thin;scrollbar-color:#bd98cf #493251;-webkit-overflow-scrolling:touch}.hcp3-nav-links>a{flex:1 0 135px;white-space:nowrap;scroll-snap-align:start}.hcp3-nav-links::-webkit-scrollbar{height:5px}.hcp3-nav-links::-webkit-scrollbar-thumb{background:#bd98cf;border-radius:4px}.hcp3-nav-links::-webkit-scrollbar-track{background:#493251}
.hcp3-quick-nav a{position:relative;display:flex;align-items:center;gap:8px;min-width:0;min-height:49px;padding:10px 12px;background:#493251;border:1px solid #84638d;border-bottom:3px solid var(--menu-color);border-radius:3px;color:#fff8ff;font-size:13px;font-weight:750;text-decoration:none;transition:background .2s,color .2s,box-shadow .2s}
.hcp3-quick-nav a>span:first-child{color:var(--menu-color);font-size:16px}
.hcp3-nav-arrow{margin-left:auto;color:var(--menu-color)}
.hcp3-quick-nav a:hover,.hcp3-quick-nav a:focus-visible{background:var(--menu-color);color:var(--menu-ink);box-shadow:0 0 18px -5px var(--menu-color);animation:none}
.hcp3-quick-nav a:hover>span,.hcp3-quick-nav a:focus-visible>span{color:inherit}
.hcp3-quick-nav a:focus-visible{outline:3px solid #fff;outline-offset:3px}
.hcp3-nav-introduced a{animation:hcp3-menu-light .85s ease-in-out var(--menu-delay) 1}
.hcp3-nav-introduced a>span{animation:hcp3-menu-symbol .85s ease-in-out var(--menu-delay) 1}
@keyframes hcp3-menu-light{0%,100%{background:#493251;color:#fff8ff;box-shadow:0 0 0 transparent}30%,65%{background:var(--menu-color);color:var(--menu-ink);box-shadow:0 0 22px -4px var(--menu-color)}}
@keyframes hcp3-menu-symbol{0%,100%{color:var(--menu-color)}30%,65%{color:var(--menu-ink)}}

@media(max-width:760px){.hcp3-page{--hcp3-header-clearance:calc(112px + env(safe-area-inset-top,0px))}.hcp3-hero{padding-top:20px}.hcp3-quick-nav{margin-top:25px;padding:14px 12px 15px}.hcp3-nav-caption{font-size:14px}.hcp3-nav-caption>span{font-size:10px}.hcp3-nav-links{gap:9px 7px}.hcp3-quick-nav a{font-size:12px;padding:9px 8px;gap:5px}.hcp3-nav-arrow{display:none}}
@media(max-width:360px){.hcp3-nav-caption{align-items:flex-start;flex-direction:column;gap:2px}.hcp3-quick-nav a{font-size:11px}}
@media(prefers-reduced-motion:reduce){.hcp3-nav-introduced a,.hcp3-nav-introduced a>span{animation:none!important}}
@media(forced-colors:active){.hcp3-quick-nav,.hcp3-quick-nav a{background:Canvas;color:CanvasText;border-color:CanvasText}.hcp3-quick-nav a>span{color:LinkText;animation:none}}
`;
