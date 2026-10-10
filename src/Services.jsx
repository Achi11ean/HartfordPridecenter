// Services.jsx — complete replacement, including scoped styles.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaArrowRight, FaChevronLeft, FaChevronRight, FaPause, FaPlay, FaTimes, FaHandsHelping } from "react-icons/fa";

const API = "https://singspacebackend.onrender.com";
const INTRO_MS = 2200;
const STATIC_BANNER = "https://www.garlandcounty.org/ImageRepository/Document?documentId=260";
const WORDS = ["Support", "Programs", "Wellness", "Advocacy", "Connection", "Care"];
const COLORS = ["#a44564", "#996033", "#80671e", "#397555", "#446fa6", "#815596"];
const WASHES = ["#fcebf0", "#fff0e2", "#faf4dc", "#eaf5ee", "#eaf0fb", "#f2eafa"];
const safeExternal = value => {
  if (typeof value !== "string" || !value.trim()) return null;
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) ? url.href : null; } catch { return null; }
};
function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return undefined;
    const update = () => setReduced(media.matches);
    update();
    if (media.addEventListener) media.addEventListener("change", update); else media.addListener(update);
    return () => { if (media.removeEventListener) media.removeEventListener("change", update); else media.removeListener(update); };
  }, []);
  return reduced;
}
function ServiceImage({ src, alt, ...props }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && !failed ? <img src={src} alt={alt} onError={() => setFailed(true)} {...props} /> : <div className="hps-image-fallback" role="img" aria-label={alt}><FaHandsHelping aria-hidden="true" /><span>Support. Connection. Community.</span></div>;
}
function ServiceModal({ service, contactPath, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const modalRoot = panelRef.current?.parentElement;
    const background = Array.from(document.body.children).filter(node => node !== modalRoot && node instanceof HTMLElement).map(node => [node, node.inert]);
    background.forEach(([node]) => { node.inert = true; });
    closeRef.current?.focus();
    const onKey = event => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      const nodes = Array.from(panel.querySelectorAll('button:not([disabled]),a[href]')).filter(node => node.getClientRects().length);
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      background.forEach(([node, inert]) => { node.inert = inert; });
      if (previousFocus?.isConnected) previousFocus.focus?.({ preventScroll: true });
    };
  }, [onClose]);
  const external = safeExternal(service.service_url);
  return createPortal(<div className="hps-modal" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={panelRef} className="hps-modal-panel" role="dialog" aria-modal="true" aria-labelledby="hps-modal-title">
      <button ref={closeRef} type="button" className="hps-modal-close" onClick={onClose} aria-label="Close program details"><FaTimes aria-hidden="true" /></button>
      {service.image && <div className="hps-modal-image"><ServiceImage src={service.image} alt={service.title} /></div>}
      <div className="hps-modal-copy"><p className="hps-eyebrow">Community programs & services</p><h2 id="hps-modal-title">{service.title}</h2><p className="hps-details">{service.details}</p>
        {(service.contact_name || service.contact_email) && <div className="hps-contact-info">{service.contact_name && <p><strong>Contact:</strong> {service.contact_name}</p>}{service.contact_email && <p><strong>Email:</strong> <a href={`mailto:${service.contact_email}`}>{service.contact_email}</a></p>}</div>}
        <div className="hps-modal-actions">{external && <a href={external} target="_blank" rel="noopener noreferrer" className="hps-button hps-primary">Visit Service Page <FaArrowRight aria-hidden="true" /></a>}<Link className="hps-button" to={contactPath} onClick={onClose}>Contact Us</Link></div>
      </div>
    </section>
  </div>, document.body);
}
const FLAG_COLORS = [
  { name: "Rainbow Pride", colors: ["#e40303", "#ff8c00", "#ffed00", "#008026", "#004dff", "#750787"] },
  { name: "Transgender Pride", colors: ["#5bcefa", "#f5a9b8", "#fff", "#f5a9b8", "#5bcefa"] },
  { name: "Bisexual Pride", colors: ["#d60270", "#d60270", "#9b4f96", "#0038a8", "#0038a8"] },
  { name: "Lesbian Pride", colors: ["#d52d00", "#ff9a56", "#fff", "#d362a4", "#a30262"] },
  { name: "Nonbinary Pride", colors: ["#fff430", "#fff", "#9c59d1", "#2c2c2c"] },
];
function ServicesIntro({ onComplete }) {
  const skipRef = useRef(null);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(onComplete, reduceMotion ? 900 : INTRO_MS);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus?.({ preventScroll: true });
    };
  }, [onComplete]);

  const intro = <div className="hps-intro" role="dialog" aria-modal="true" aria-labelledby="hps-intro-title" aria-describedby="hps-intro-subtitle" onKeyDown={event => {
    if (event.key === "Escape") onComplete();
    if (event.key === "Tab") { event.preventDefault(); skipRef.current?.focus(); }
  }}>
    <div className="hps-intro-inner">
      <span className="hps-intro-heart" aria-hidden="true"><FaHeart /></span>
      <p className="hps-intro-kicker">Every identity. One community.</p>
      <h2 id="hps-intro-title">Hartford <span>Pride Center</span></h2>
      <div className="hps-intro-flags">{FLAG_COLORS.map(flag => <span className="hps-flag" role="img" aria-label={flag.name} key={flag.name}>{flag.colors.map((color, i) => <span key={i} style={{ backgroundColor: color }} />)}</span>)}</div>
      <p id="hps-intro-subtitle" className="hps-intro-neon">Services</p>
      <p className="hps-intro-caption">Support, connection, and a place to grow.</p>
      <div className="hps-intro-progress" aria-hidden="true"><span /></div>
      <button ref={skipRef} type="button" className="hps-intro-skip" onClick={onComplete}>Explore our story <FaArrowRight aria-hidden="true" /></button>
    </div>
  </div>;
  return typeof document === "undefined" ? intro : createPortal(intro, document.body);
}

export default function Services({ prideId = 2, contactPath = "/contact" }) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const headingRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const completeIntro = useCallback(() => setShowIntro(false), []);
  const closeModal = useCallback(() => setSelectedService(null), []);
  useEffect(() => { if (!showIntro) headingRef.current?.focus({ preventScroll: true }); }, [showIntro]);
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setLoading(true); setError(""); setServices([]); setSelectedService(null); setCarouselIndex(0);
    axios.get(`${API}/api/pride/${prideId}/services`, { signal: controller.signal }).then(res => {
      if (cancelled) return;
      if (!Array.isArray(res.data)) throw new Error("Unexpected services response");
      setServices(res.data.map(s => ({ id: s.id, slug: s.slug, title: s.title, desc: s.description, details: s.description, image: s.image_url, contact_name: s.contact_name, contact_email: s.contact_email, url: s.url, service_url: s.service_url })));
    }).catch(() => { if (!cancelled) setError("We couldn’t load our programs. Please try again."); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; controller.abort(); };
  }, [prideId, retry]);
  const slides = useMemo(() => [{ src: STATIC_BANNER, title: "Community programs & services" }, ...services.filter(s => s.image).map(s => ({ src: s.image, title: s.title }))], [services]);
  const slideIndex = carouselIndex % slides.length;
  useEffect(() => {
    if (slides.length < 2 || paused || hovering || focused || reducedMotion || showIntro || selectedService) return undefined;
    const timer = window.setInterval(() => { if (!document.hidden) setCarouselIndex(index => (index + 1) % slides.length); }, 5500);
    return () => window.clearInterval(timer);
  }, [slides.length, paused, hovering, focused, reducedMotion, showIntro, selectedService]);
  const moveSlide = direction => setCarouselIndex(index => (index + direction + slides.length) % slides.length);

  return <>
    <style>{SERVICES_STYLES}</style>
    {showIntro ? <ServicesIntro onComplete={completeIntro} /> : <main className="hps-page">
      <div className="hps-rainbow" aria-hidden="true" />
      <section className="hps-container hps-hero" aria-labelledby="hps-title">
        <div className="hps-hero-copy"><p className="hps-kicker"><FaHeart aria-hidden="true" /> Powered by Karaoverse</p><h1 id="hps-title" ref={headingRef} tabIndex={-1}>Community programs<br /><em>& services.</em></h1><p>Grow your voice, find support, build community — programming and services across Hartford and the Capital Region.</p><span className="hps-hero-note">A little support. A world of possibility.</span></div>
        <div className="hps-carousel" role="region" aria-roledescription="carousel" aria-label="Community highlights" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
          <div className="hps-carousel-heading"><span>A window into our community</span><FaHeart aria-hidden="true" /></div>
          <div className="hps-slide" role="group" aria-roledescription="slide" aria-label={`${slideIndex + 1} of ${slides.length}: ${slides[slideIndex].title}`}><ServiceImage key={slides[slideIndex].src} src={slides[slideIndex].src} alt={slides[slideIndex].title} /></div><div className="hps-rainbow" aria-hidden="true" />
          <div className="hps-carousel-controls"><p>{slides[slideIndex].title}</p>{slides.length > 1 && <div className="hps-carousel-buttons"><button type="button" onClick={() => moveSlide(-1)} aria-label="Previous slide"><FaChevronLeft aria-hidden="true" /></button><span>{slideIndex + 1} / {slides.length}</span>{!reducedMotion && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Resume slideshow" : "Pause slideshow"}>{paused ? <FaPlay aria-hidden="true" /> : <FaPause aria-hidden="true" />}</button>}<button type="button" onClick={() => moveSlide(1)} aria-label="Next slide"><FaChevronRight aria-hidden="true" /></button></div>}</div>
          {slides.length > 1 && <div className="hps-slide-dots" aria-label="Choose a slide">{slides.map((slide, index) => <button key={`${slide.src}-${index}`} type="button" aria-label={`Go to slide ${index + 1}: ${slide.title}`} aria-pressed={index === slideIndex} onClick={() => setCarouselIndex(index)}><span /></button>)}</div>}
        </div>
      </section>
      <div className="hps-container"><div className="hps-marquee" tabIndex={0} role="region" aria-label="Our focus — moving values; focus to pause"><span className="hps-sr-only">Support, Programs, Wellness, Advocacy, Connection, Care.</span><div className="hps-marquee-track" aria-hidden="true">{[0, 1, 2, 3].map(copy => <div className="hps-marquee-group" key={copy}>{WORDS.map((word, index) => <span key={word} style={{ color: COLORS[index] }}>{word}</span>)}</div>)}</div></div></div>
      <section className="hps-container hps-programs" aria-labelledby="hps-programs-title" aria-busy={loading}>
        <div className="hps-section-heading"><div><p className="hps-eyebrow">Pinned with Pride</p><h2 id="hps-programs-title">Our <em>programs.</em></h2></div><p>Explore the possibilities.<br />Find the support that feels right.</p></div>
        {loading ? <div className="hps-state" role="status"><FaHandsHelping aria-hidden="true" /><h3>Loading programs…</h3><p>Making room for connection.</p></div> : error ? <div className="hps-state" role="alert"><h3>Let’s try that again.</h3><p>{error}</p><button type="button" className="hps-button hps-primary" onClick={() => setRetry(value => value + 1)}>Retry</button></div> : services.length === 0 ? <div className="hps-state"><FaHeart aria-hidden="true" /><h3>No programs published yet</h3><p>Come back soon!</p></div> : <div className="hps-grid">{services.map((service, index) => <article key={service.id} className="hps-card" style={{ "--card-ink": COLORS[index % 6], "--card-wash": WASHES[index % 6] }}>
          <span className="hps-pin" aria-hidden="true" />
          {service.slug ? <Link to={`/services/${service.slug}`} className="hps-card-main"><div className="hps-card-image"><ServiceImage src={service.image} alt={service.title} loading="lazy" /></div><div className="hps-card-copy"><h3>{service.title}</h3><p>{service.desc}</p><span className="hps-explore">Explore program <FaArrowRight aria-hidden="true" /></span></div></Link> : <div className="hps-card-main"><div className="hps-card-image"><ServiceImage src={service.image} alt={service.title} loading="lazy" /></div><div className="hps-card-copy"><h3>{service.title}</h3><p>{service.desc}</p></div></div>}
          <button type="button" className="hps-quick-view" aria-label={`Quick view: ${service.title}`} onClick={() => setSelectedService(service)}>Quick view <span aria-hidden="true">+</span></button>
        </article>)}</div>}
      </section>
      <section className="hps-closing"><div className="hps-container"><FaHeart className="hps-closing-heart" aria-hidden="true" /><p className="hps-eyebrow">Every person. Every possibility.</p><h2>“Community isn’t a concept —<br /><em>it’s a lifeline.</em>”</h2><p>Every profile. Every voice. Every story adds strength.</p><Link to={contactPath} className="hps-button">Let’s connect <FaArrowRight aria-hidden="true" /></Link></div></section><div className="hps-rainbow" aria-hidden="true" />
    </main>}
    {selectedService && <ServiceModal service={selectedService} contactPath={contactPath} onClose={closeModal} />}
  </>;
}
const SERVICES_STYLES = `
.hps-page,.hps-intro,.hps-modal{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased;color:#49364f}.hps-page *,.hps-intro *,.hps-modal *{box-sizing:border-box}.hps-page h1,.hps-page h2,.hps-page h3,.hps-page p,.hps-intro h2,.hps-intro p,.hps-modal h2,.hps-modal p{margin:0}.hps-page a,.hps-modal a{color:inherit;text-decoration:none}.hps-page button,.hps-intro button,.hps-modal button{font:inherit;cursor:pointer}.hps-page a:focus-visible,.hps-page button:focus-visible,.hps-page [tabindex="0"]:focus-visible,.hps-intro button:focus-visible,.hps-modal a:focus-visible,.hps-modal button:focus-visible{outline:3px solid #9864b0;outline-offset:4px}.hps-page h1:focus{outline:none}.hps-page{min-height:100vh;padding-top:var(--hpc-header-offset,64px);background:radial-gradient(ellipse at 0 0,#f9e2ec66,transparent 40%),#faf8f4;color-scheme:light}.hps-container{width:97%;max-width:1560px;margin-inline:auto;padding-inline:clamp(12px,2.3vw,34px)}.hps-rainbow{height:3px;background:linear-gradient(90deg,#d9627f,#dda06a,#d4bb64,#78ad8e,#7e9bce,#b087be)}.hps-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.hps-page em{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-weight:400;color:#86567e}
.hps-hero{display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(24px,4vw,65px);align-items:center;padding-block:42px 30px}.hps-kicker{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border:1px solid #e6d1e3;border-radius:999px;background:#fff9fc;color:#966884;font-size:11px;letter-spacing:.4px}.hps-hero h1{font-weight:500;font-size:clamp(37px,4.6vw,66px);line-height:1.08;letter-spacing:-2px;margin:21px 0}.hps-hero-copy>p:not(.hps-kicker){font-size:14px;line-height:1.85;color:#78677c;max-width:540px}.hps-hero-note{display:block;margin-top:18px;font-family:Georgia,serif;font-style:italic;font-size:18px;color:#99758f}
.hps-carousel{min-width:0;padding:13px;background:#fffdfa;border:1px solid #e5d5e3;border-radius:22px;box-shadow:0 9px 28px #68446910}.hps-carousel-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:10px;letter-spacing:.5px;color:#96728d;padding:0 3px 11px}.hps-slide{aspect-ratio:1.65;overflow:hidden;border-radius:14px 14px 0 0;background:#f1e6f1}.hps-slide img,.hps-card-image img,.hps-modal-image img{display:block;width:100%;height:100%;object-fit:cover}.hps-slide>img{animation:hps-image-in .45s ease both}.hps-image-fallback{height:100%;min-height:140px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;background:linear-gradient(130deg,#f7e2ec,#f5eddf,#e3ecef,#ece1f8);color:#916786;font-size:12px;padding:20px;text-align:center}.hps-image-fallback>svg{font-size:33px}.hps-carousel-controls{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:8px}.hps-carousel-controls>p{font-family:Georgia,serif;font-style:italic;font-size:17px;color:#87657f;overflow-wrap:anywhere}.hps-carousel-buttons{display:flex;align-items:center;gap:3px;flex-shrink:0}.hps-carousel-buttons>button{display:grid;place-items:center;min-width:44px;min-height:44px;border:0;background:none;border-radius:50%;color:#8a6386;font-size:11px}.hps-carousel-buttons>button:hover{background:#f2e7f0}.hps-carousel-buttons>span{font-size:10px;color:#957e94;white-space:nowrap}.hps-slide-dots{display:flex;overflow-x:auto;max-width:100%;padding:0 2px;justify-content:flex-start}.hps-slide-dots>button{display:grid;place-items:center;flex:0 0 44px;height:44px;border:0;background:transparent}.hps-slide-dots>button>span{width:6px;height:6px;border-radius:50%;background:#ddccdf}.hps-slide-dots>button[aria-pressed="true"]>span{width:17px;border-radius:9px;background:#946c90}
.hps-marquee{--cycle:900px;overflow:hidden;border-block:1px solid #e6dae5;padding-block:17px;mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)}.hps-marquee-track{display:flex;width:max-content;animation:hps-marquee-right 30s linear infinite}.hps-marquee-group{display:flex;width:var(--cycle);flex:0 0 var(--cycle)}.hps-marquee-group>span{position:relative;flex:1;text-align:center;font-family:Georgia,serif;font-style:italic;font-size:22px;white-space:nowrap;padding:0 13px}.hps-marquee-group>span::after{content:"";position:absolute;width:3px;height:3px;right:0;top:50%;background:#cbb4c6;border-radius:50%}.hps-marquee:hover .hps-marquee-track,.hps-marquee:focus-within .hps-marquee-track{animation-play-state:paused}
.hps-programs{padding-block:32px 40px}.hps-section-heading{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:25px}.hps-eyebrow{font-size:10px;color:#956988;letter-spacing:1.3px;text-transform:uppercase;font-weight:650}.hps-section-heading h2{font-size:39px;font-weight:500;line-height:1.2;margin-top:6px;letter-spacing:-1px}.hps-section-heading>p{font-size:12px;text-align:right;color:#8a758a}.hps-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px 20px}.hps-card{position:relative;display:flex;flex-direction:column;min-width:0;border:1px solid #e2d5df;border-radius:20px;background:var(--card-wash);box-shadow:0 5px 18px #6844690b;padding:10px 10px 0;transition:box-shadow .2s}.hps-card:hover{box-shadow:0 9px 24px #6844691b}.hps-pin{position:absolute;top:-5px;left:calc(50% - 5px);width:10px;height:10px;border:2px solid #ffffffa8;background:var(--card-ink);border-radius:50%;box-shadow:0 2px 4px #0002;z-index:1}.hps-card-main{display:flex;flex-direction:column;flex:1;min-width:0}.hps-card-image{aspect-ratio:1.8;border-radius:13px;overflow:hidden;background:#fff7}.hps-card-copy{padding:16px 10px 12px;flex:1;display:flex;flex-direction:column}.hps-card h3{font-size:21px;font-weight:550;line-height:1.25;letter-spacing:-.4px;color:var(--card-ink);overflow-wrap:anywhere}.hps-card-copy>p{font-size:13px;line-height:1.75;color:#746378;margin-top:9px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.hps-explore{display:flex;align-items:center;gap:9px;color:var(--card-ink);font-size:12px;font-weight:650;padding-top:18px;margin-top:auto}.hps-explore>svg{font-size:10px}.hps-quick-view{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:44px;padding:10px;margin-top:2px;background:none;border:0;border-top:1px solid #72566d18;color:var(--card-ink);font-size:12px!important;border-radius:0 0 13px 13px}.hps-quick-view:hover{background:#ffffff66}
.hps-state{padding:38px 20px;text-align:center;border:1px solid #e5d7e3;border-radius:20px;background:#fffafc;color:#896980}.hps-state>svg{font-size:27px;margin-bottom:12px}.hps-state h3{font-family:Georgia,serif;font-size:25px;font-weight:400}.hps-state p{font-size:13px;margin-top:7px}.hps-state .hps-button{margin-top:18px}.hps-button{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:10px 18px;border:1px solid #d9c3df;border-radius:999px;background:#fffafb;color:#80597e!important;font-size:12px!important;font-weight:650}.hps-button:hover{background:#f3e6f1}.hps-primary{background:#80577e;border-color:#80577e;color:#fff!important}.hps-primary:hover{background:#6e466e}
.hps-closing{text-align:center;background:radial-gradient(ellipse at 0 0,#f7e1edaa,transparent 60%),#f6f0f7;border-top:1px solid #e4d6e5;padding-block:31px}.hps-closing-heart{font-size:20px;color:#b27094;margin-bottom:11px}.hps-closing h2{font-size:clamp(27px,3.3vw,43px);font-weight:500;line-height:1.25;margin:10px 0 14px;letter-spacing:-.7px}.hps-closing p:not(.hps-eyebrow){font-size:13px;color:#8b7086}.hps-closing .hps-button{margin-top:18px}
.hps-modal{position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;background:#2a1b335c;backdrop-filter:blur(5px);color-scheme:light}.hps-modal-panel{position:relative;width:100%;max-width:740px;max-height:90vh;max-height:90dvh;overflow:auto;border:1px solid #dfc9e1;border-radius:24px;background:#fffaf8;box-shadow:0 25px 80px #23162f33}.hps-modal-close{position:sticky;top:10px;float:right;margin:10px 10px -54px 0;z-index:1;display:grid;place-items:center;width:44px;height:44px;background:#fffafc;border:1px solid #dec8df;border-radius:50%;color:#805d7e}.hps-modal-image{height:260px}.hps-modal-copy{padding:28px;overflow-wrap:anywhere}.hps-modal-copy h2{font-size:32px;font-weight:500;line-height:1.2;margin-top:10px;padding-right:28px}.hps-details{white-space:pre-line;font-size:14px;line-height:1.85;margin-top:20px!important;color:#78627b}.hps-contact-info{padding:15px;border-radius:14px;background:#f3eaf4;margin-top:20px;font-size:13px}.hps-contact-info a{text-decoration:underline}.hps-modal-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
@keyframes hps-image-in{from{opacity:.6}to{opacity:1}}@keyframes hps-marquee-right{from{transform:translateX(calc(-1 * var(--cycle)))}to{transform:translateX(0)}}
.hps-intro{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;min-height:100dvh;overflow:auto;padding:28px 20px;background:radial-gradient(ellipse at 15% 15%,#b34e7930,transparent 50%),radial-gradient(ellipse at 85% 70%,#5878b42b,transparent 55%),#191321;color:#fff;color-scheme:dark;text-align:center}
.hps-intro-inner{width:100%;max-width:700px;animation:hps-intro-in .55s ease both}.hps-intro-heart{display:grid;place-items:center;width:43px;height:43px;margin:0 auto 20px;border:1px solid #dca2c12e;border-radius:16px;background:#ffbfd00c;color:#edb5d1;box-shadow:0 0 30px #d982ba13}
.hps-intro-kicker{font-size:10px;letter-spacing:1.7px;color:#d2bbda;font-weight:550}
.hps-intro h2{font-size:clamp(34px,5.8vw,66px);font-weight:450;line-height:1.13;letter-spacing:-1.5px;margin-top:20px;color:#f8edf5}
.hps-intro h2>span{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-weight:400;display:block;background:linear-gradient(100deg,#ffa7b9,#ffca98,#f6e7a6,#b2e4c7,#b5d8ff,#d5b6fa);background-clip:text;-webkit-background-clip:text;color:transparent;padding-bottom:8px}
.hps-intro-flags{display:flex;justify-content:center;gap:11px;margin:22px auto 24px}.hps-flag{display:flex;flex-direction:column;width:36px;height:24px;border-radius:4px;overflow:hidden;border:1px solid #ffffff29;box-shadow:0 4px 10px #0002}.hps-flag>span{flex:1}
.hps-intro .hps-intro-neon{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-size:clamp(32px,5vw,48px);line-height:1.25;letter-spacing:.3px;color:#f7d9f3;text-shadow:0 0 8px #ee9ad36b,0 0 25px #ce80d14d,0 0 48px #ab74ce2b}
.hps-intro-caption{font-size:12px;color:#c8b2d2;margin-top:10px!important;letter-spacing:.2px}.hps-intro-progress{height:3px;width:115px;margin:25px auto 12px;background:#ffffff15;overflow:hidden;border-radius:99px}.hps-intro-progress>span{display:block;height:100%;transform-origin:left;background:linear-gradient(90deg,#ff98ac,#ffc58a,#f4df92,#a2dfb6,#a9cfff,#d0a2f0);animation:hps-progress ${INTRO_MS}ms linear both}
.hps-intro-skip{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:10px 16px;border:1px solid #d5b8df36;border-radius:999px;background:#ffffff05;color:#e4d1ec;font:inherit;font-size:12px;cursor:pointer}.hps-intro-skip:hover{background:#ffffff10}.hps-intro-skip svg{font-size:10px}
@keyframes hps-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes hps-intro-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:1000px){.hps-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hps-hero{gap:24px}.hps-carousel-controls{flex-wrap:wrap}.hps-carousel-buttons{margin-left:auto}}
@media(max-width:760px){.hps-hero{grid-template-columns:1fr;padding-block:27px}.hps-hero h1{font-size:clamp(36px,7vw,53px);letter-spacing:-1.5px;margin:17px 0}.hps-hero-copy>p:not(.hps-kicker){font-size:14px}.hps-hero-note{font-size:17px;margin-top:12px}.hps-carousel{padding:11px;border-radius:19px}.hps-slide{aspect-ratio:1.8}.hps-marquee{--cycle:780px;padding-block:14px}.hps-marquee-group>span{font-size:19px}.hps-programs{padding-block:26px 30px}.hps-grid{gap:21px 13px}.hps-card{padding:8px 8px 0}.hps-card-copy{padding:13px 7px 10px}.hps-card h3{font-size:19px}.hps-section-heading h2{font-size:33px}.hps-section-heading>p{font-size:11px}.hps-modal-copy{padding:22px}.hps-modal-image{height:210px}}
@media(max-width:520px){.hps-container{padding-inline:10px}.hps-grid{grid-template-columns:1fr;gap:21px}.hps-card-image{aspect-ratio:2}.hps-card-copy>p{font-size:13px}.hps-card h3{font-size:22px}.hps-section-heading>p{display:none}.hps-carousel-controls>p{font-size:16px}.hps-carousel-buttons>button{min-width:44px}.hps-carousel-controls{gap:2px}.hps-carousel-controls>p{width:100%}.hps-modal{padding:10px}.hps-modal-panel{border-radius:19px;max-height:94dvh}.hps-modal-copy{padding:19px}.hps-modal-copy h2{font-size:27px}.hps-modal-actions{flex-direction:column}.hps-closing h2 br{display:none}.hps-intro{padding:24px 16px}.hps-intro h2{font-size:clamp(34px,10vw,46px)}.hps-intro-kicker{font-size:9px;letter-spacing:1px}}
@media(prefers-reduced-motion:reduce){.hps-page *,.hps-intro *,.hps-modal *{animation:none!important;transition:none!important;scroll-behavior:auto!important}.hps-intro-progress>span{transform:scaleX(1)}.hps-marquee{mask-image:none}.hps-marquee-track{width:100%;transform:none}.hps-marquee-group{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px 0;width:100%;flex-basis:100%}.hps-marquee-group:not(:first-child){display:none}.hps-marquee-group>span{font-size:17px;padding-inline:3px}.hps-marquee-group>span:nth-child(3n)::after{display:none}}
@media(forced-colors:active){.hps-intro h2>span{background:none;color:CanvasText}.hps-intro-neon{text-shadow:none}.hps-card,.hps-carousel,.hps-modal-panel{border-color:CanvasText}}
`;
