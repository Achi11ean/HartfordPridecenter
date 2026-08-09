import { useState, useEffect, useMemo, useRef } from "react";

/* ============================================================
   CONFIG — replace these as details are confirmed.
   Leave a value as "" (empty) to keep its "Coming Soon" state.
   ============================================================ */
const GALA = {
  email: "gala@hartfordpridecenter.org", // ← where form submissions are emailed
  tickets: "",                           // ← ticket sales URL
  donate: ["", "", ""],                  // ← 3 donation URLs (One-Time / Monthly / Legacy)
};

const SECTIONS = [
  { id: "evening",  label: "The Evening" },
  { id: "legacy",   label: "The Legacy" },
  { id: "nominate", label: "Nominate a Leader" },
  { id: "patron",   label: "Become a Patron" },
  { id: "giving",   label: "Tickets & Giving" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500;600;700&display=swap');

:root{
  --stage:#0b0b0d; --card:#131317; --ash:#2b2b31; --ash-soft:#202026;
  --ivory:#f3efe6; --ivory-dim:#cbc6ba; --muted:#8f8a80; --muted-2:#6c6860;
  --spot:255,246,224; --spot-cool:225,232,240;
  --serif:"Fraunces","Georgia",serif;
  --sans:"Inter",system-ui,-apple-system,"Segoe UI",sans-serif;
  --gutter:clamp(1.15rem,5vw,3.25rem); --maxw:1080px; --hair:rgba(243,239,230,.12);
}
*{ box-sizing:border-box; }
html{ scroll-behavior:smooth; -webkit-text-size-adjust:100%; }
body{ margin:0; background:var(--stage); color:var(--ivory); font-family:var(--sans);
  font-weight:400; line-height:1.6; letter-spacing:.005em; overflow-x:hidden;
  text-rendering:optimizeLegibility; -webkit-font-smoothing:antialiased; }
.kg img{ max-width:100%; display:block; }
.kg a{ color:inherit; }
.kg ::selection{ background:rgba(var(--spot),.28); color:#fff; }
.sr-only{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }

/* Ambient stage */
.stage-bg{ position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden;
  background:radial-gradient(120% 90% at 50% -10%, #16161b 0%, var(--stage) 46%, #060608 100%); }
.spot{ position:absolute; width:70vmax; height:70vmax; border-radius:50%; left:15%; top:-10%;
  mix-blend-mode:screen; opacity:.5; filter:blur(6px);
  background:radial-gradient(circle at center, rgba(var(--spot),.28) 0%, rgba(var(--spot),.09) 30%, transparent 62%);
  animation:kgRoam1 26s ease-in-out infinite alternate; }
.spot.cool{ left:55%; top:22%; opacity:.36; width:60vmax; height:60vmax;
  background:radial-gradient(circle at center, rgba(var(--spot-cool),.2) 0%, rgba(var(--spot-cool),.06) 32%, transparent 60%);
  animation:kgRoam2 34s ease-in-out infinite alternate; animation-delay:-8s; }
@keyframes kgRoam1{ 0%{transform:translate(-8%,-4%) scale(1);} 50%{transform:translate(22%,10%) scale(1.12);} 100%{transform:translate(-4%,24%) scale(1.02);} }
@keyframes kgRoam2{ 0%{transform:translate(6%,0) scale(1.05);} 50%{transform:translate(-18%,14%) scale(.95);} 100%{transform:translate(10%,-8%) scale(1.1);} }

.sparkles{ position:fixed; inset:0; z-index:1; pointer-events:none; overflow:hidden; }
.sparkle{ position:absolute; top:-6vh; border-radius:50%;
  background:radial-gradient(circle, rgba(var(--spot),.95) 0%, rgba(var(--spot),.35) 45%, transparent 70%);
  animation:kgFall linear infinite, kgTwinkle ease-in-out infinite; will-change:transform,opacity; }
@keyframes kgFall{ to{ transform:translateY(112vh); } }
@keyframes kgTwinkle{ 0%,100%{opacity:.15;} 50%{opacity:.9;} }

/* Curtain reveal */
#curtain{ position:fixed; inset:0; z-index:1000; }
#curtain .valance{ position:absolute; left:0; right:0; top:0; height:74px; z-index:2;
  background:linear-gradient(#0c0c0e,#050506),repeating-linear-gradient(90deg,#111 0 22px,#0a0a0b 22px 44px);
  border-bottom:2px solid #000; box-shadow:0 10px 26px rgba(0,0,0,.7);
  transition:transform 1.2s cubic-bezier(.7,0,.2,1); }
#curtain .valance::after{ content:""; position:absolute; left:0; right:0; bottom:0; height:2px;
  background:linear-gradient(90deg,transparent,#9a948650,#e8e4da,#9a948650,transparent); opacity:.7; }
.panel{ position:absolute; top:0; bottom:0; width:52%; z-index:1;
  background:linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,0) 12%, rgba(255,255,255,.03) 50%, rgba(0,0,0,0) 88%, rgba(0,0,0,.55)),
  repeating-linear-gradient(90deg,#141416 0 26px,#0b0b0d 26px 40px,#050506 40px 56px);
  box-shadow:inset 0 0 120px rgba(0,0,0,.9); transition:transform 1.45s cubic-bezier(.76,0,.18,1); }
.panel.left{ left:0; border-right:1px solid #000; transform:translateX(0); }
.panel.right{ right:0; border-left:1px solid #000; transform:translateX(0); }
#curtain.is-open .panel.left{ transform:translateX(-101%); }
#curtain.is-open .panel.right{ transform:translateX(101%); }
#curtain.is-open .valance{ transform:translateY(-101%); }

/* Shell */
.wrap{ position:relative; z-index:5; }
.container{ width:100%; max-width:var(--maxw); margin-inline:auto; padding-inline:var(--gutter); }

/* Banner (top, wide) */
.banner{ position:relative; width:100%; overflow:hidden; background:#0a0a0c; }
.banner-img{ display:block; width:100%; height:auto; }
.banner-fallback{ display:none; }
.banner.is-missing .banner-img{ display:none; }
.banner.is-missing .banner-fallback{ display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.55rem;
  width:100%; aspect-ratio:16/5; min-height:168px; text-align:center; padding:1.5rem;
  background:radial-gradient(80% 130% at 50% 0%, rgba(var(--spot),.12), transparent 62%), repeating-linear-gradient(90deg,#111114 0 22px,#0b0b0e 22px 40px); }
.banner-fallback .bf-title{ font-family:var(--serif); font-weight:700; text-transform:uppercase; letter-spacing:.02em;
  font-size:clamp(1.8rem,7vw,3.4rem); line-height:1;
  background:linear-gradient(180deg,#fdfbf6,#d7d1c4); -webkit-background-clip:text; background-clip:text; color:transparent; }
.banner-fallback .bf-sub{ color:var(--muted); font-size:.72rem; letter-spacing:.28em; text-transform:uppercase; }

/* Sticky filter bar */
.filterbar{ position:sticky; top:0; z-index:40; background:rgba(11,11,13,.85); backdrop-filter:blur(10px); border-bottom:1px solid var(--hair); }
.filter-in{ display:flex; align-items:center; justify-content:space-between; gap:1rem; padding-block:.55rem; }
.fb-mark{ font-family:var(--serif); font-weight:600; letter-spacing:.12em; text-transform:uppercase; font-size:.92rem; white-space:nowrap; }
.fb-mark span{ color:var(--muted); font-weight:400; }
.fb-select{ width:auto; min-width:158px; padding:.5rem 2.2rem .5rem .85rem; font-size:.82rem; }
.filter-right{ display:flex; align-items:center; gap:.5rem; }
.share-btn{ padding:.5rem .95rem; min-height:40px; }
.share-btn svg{ display:block; }
.fb-share-text{ line-height:1; }

/* Buttons */
.btn{ display:inline-flex; align-items:center; justify-content:center; gap:.5em; font-family:var(--sans);
  font-size:.82rem; font-weight:600; letter-spacing:.11em; text-transform:uppercase; padding:.85em 1.5em;
  border-radius:2px; cursor:pointer; text-decoration:none; border:1px solid var(--ash); background:transparent; color:var(--ivory);
  transition:border-color .3s, background .3s, color .3s, transform .3s, box-shadow .3s; min-height:44px; }
.btn:hover{ border-color:rgba(var(--spot),.6); box-shadow:0 0 26px rgba(var(--spot),.10); transform:translateY(-1px); }
.btn.solid{ background:linear-gradient(180deg,#f6f2e9,#d9d3c6); color:#151318; border-color:#efe9dd; }
.btn.solid:hover{ box-shadow:0 8px 28px rgba(var(--spot),.22); }
.btn.ghost{ border-color:var(--ash-soft); color:var(--ivory-dim); }
.btn.small{ padding:.6em 1em; font-size:.72rem; min-height:38px; }
.btn[aria-disabled="true"]{ cursor:not-allowed; opacity:.62; border-style:dashed; color:var(--muted); background:transparent; box-shadow:none; transform:none; }
.btn[aria-disabled="true"]:hover{ border-color:var(--ash); box-shadow:none; transform:none; }
.kg :focus-visible{ outline:2px solid rgba(var(--spot),.85); outline-offset:2px; }

/* Type helpers */
.eyebrow{ font-size:.72rem; letter-spacing:.34em; text-transform:uppercase; color:var(--muted); margin:0 0 1rem; font-weight:500; display:inline-flex; align-items:center; gap:.75rem; }
.eyebrow::before{ content:""; width:26px; height:1px; background:var(--muted-2); display:inline-block; }
.eyebrow.center{ justify-content:center; }
.act-no{ font-family:var(--serif); font-style:italic; color:var(--ivory-dim); }
.h{ font-family:var(--serif); font-weight:500; line-height:1.08; font-size:clamp(1.8rem,5vw,2.85rem); margin:0 0 1rem; letter-spacing:-.01em; }
.lede{ color:var(--ivory-dim); font-size:1.02rem; max-width:62ch; margin:0; }
.center-block{ text-align:center; }
.center-block .lede{ margin-inline:auto; }
.spectrum{ height:2px; width:118px; border-radius:2px; margin:1.5rem 0 0; background:linear-gradient(90deg,#c9877e,#cbb98a,#8faf8f,#8aa1b8,#a494b4); opacity:.6; }

/* Masthead */
.masthead{ text-align:center; padding-block:clamp(1.5rem,4vw,2.4rem) clamp(2rem,6vw,3rem); }
.marquee{ font-family:var(--serif); font-weight:700; line-height:.94; font-size:clamp(2.6rem,10vw,5rem); margin:.2rem 0 0;
  letter-spacing:-.01em; text-transform:uppercase; background:linear-gradient(180deg,#fdfbf6 0%,#f1ebde 55%,#d7d1c4 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent; text-shadow:0 0 40px rgba(var(--spot),.08); }
.mast-sub{ color:var(--ivory-dim); font-family:var(--serif); font-style:italic; font-size:clamp(1rem,3vw,1.24rem); margin:.9rem auto 0; max-width:38ch; }
.mast-date{ display:inline-block; margin-top:1.1rem; color:var(--muted); font-size:.8rem; letter-spacing:.18em; text-transform:uppercase; }
.mast-date b{ color:var(--ivory); font-weight:600; }
.mast-cta{ display:flex; flex-wrap:wrap; gap:.7rem; justify-content:center; margin-top:1.7rem; }

/* Section + panel */
.section{ padding-block:clamp(2.8rem,7vw,4.4rem); border-top:1px solid var(--hair); }
.panel-anim{ animation:kgFadeUp .5s cubic-bezier(.2,.7,.2,1) both; scroll-margin-top:60px; }
@keyframes kgFadeUp{ from{opacity:0; transform:translateY(16px);} to{opacity:1; transform:none;} }

/* Triptych */
.triptych{ display:grid; grid-template-columns:1fr; gap:1px; background:var(--hair); border:1px solid var(--hair); border-radius:3px; overflow:hidden; }
.tri{ background:var(--card); padding:clamp(1.4rem,4vw,1.9rem); }
.tri h3{ font-family:var(--serif); font-weight:500; font-size:1.42rem; margin:.2rem 0 .5rem; }
.tri .n{ font-family:var(--serif); font-style:italic; color:var(--muted); font-size:.9rem; }
.tri p{ margin:0; color:var(--ivory-dim); font-size:.93rem; }

/* Timeline */
.timeline{ margin:0; position:relative; }
.tl-item{ position:relative; padding:0 0 1.6rem 1.7rem; border-left:1px solid var(--ash); }
.tl-item:last-child{ padding-bottom:0; }
.tl-item::before{ content:""; position:absolute; left:-5px; top:5px; width:9px; height:9px; border-radius:50%; background:var(--ivory); box-shadow:0 0 0 4px var(--stage), 0 0 16px rgba(var(--spot),.5); }
.tl-year{ font-family:var(--serif); font-style:italic; color:var(--ivory); font-size:1.02rem; letter-spacing:.02em; }
.tl-text{ color:var(--ivory-dim); font-size:.93rem; margin-top:.15rem; }
.tl-item.peak::before{ background:linear-gradient(180deg,#fff,#d9d3c6); box-shadow:0 0 0 4px var(--stage),0 0 22px rgba(var(--spot),.85); }

/* Program */
.program{ display:grid; grid-template-columns:1fr; gap:1px; background:var(--hair); border:1px solid var(--hair); border-radius:3px; overflow:hidden; margin-top:1.4rem; }
.pgm{ background:var(--card); padding:1.25rem 1.35rem; display:flex; align-items:baseline; gap:1rem; }
.pgm .num{ font-family:var(--serif); font-style:italic; color:var(--muted); font-size:1.1rem; min-width:1.8rem; }
.pgm .lbl{ font-family:var(--serif); font-size:1.2rem; }
.pgm .desc{ color:var(--muted); font-size:.84rem; margin-left:auto; text-align:right; letter-spacing:.02em; }

/* Forms */
.form-card{ background:var(--card); border:1px solid var(--hair); border-radius:4px; padding:clamp(1.4rem,4.5vw,2.2rem); }
.field{ margin-bottom:1.05rem; }
.field:last-of-type{ margin-bottom:0; }
.field label{ display:block; font-size:.72rem; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); margin-bottom:.5rem; font-weight:500; }
.field label .opt{ color:var(--muted-2); letter-spacing:.08em; }
.field label .req{ color:rgba(var(--spot),.9); margin-left:.25em; }
.input,.textarea,.select{ width:100%; font-family:var(--sans); font-size:16px; color:var(--ivory); background:#0c0c0f; border:1px solid var(--ash); border-radius:3px; padding:.8rem .9rem; transition:border-color .25s, background .25s; }
.textarea{ resize:vertical; min-height:92px; line-height:1.55; }
.select{ appearance:none; -webkit-appearance:none; padding-right:2.4rem;
  background-image:linear-gradient(45deg,transparent 50%,var(--muted) 50%),linear-gradient(135deg,var(--muted) 50%,transparent 50%);
  background-position:calc(100% - 18px) 55%, calc(100% - 13px) 55%; background-size:5px 5px,5px 5px; background-repeat:no-repeat; }
.input:focus,.textarea:focus,.select:focus{ border-color:rgba(var(--spot),.7); background:#0e0e12; outline:none; }
.input.invalid,.textarea.invalid,.select.invalid{ border-color:rgba(210,120,110,.85); }
.input::placeholder,.textarea::placeholder{ color:var(--muted-2); }
.form-actions{ margin-top:1.4rem; display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
.form-note{ color:var(--muted); font-size:.78rem; }
.form-success{ display:none; margin-top:1.1rem; padding:1rem 1.1rem; border-radius:3px; border:1px solid rgba(var(--spot),.4); background:rgba(var(--spot),.06); color:var(--ivory); font-size:.9rem; }
.form-success.show{ display:block; }
.form-success b{ font-family:var(--serif); font-style:italic; font-weight:500; }

/* Box office */
.boxoffice{ text-align:center; }
.tickets-block{ margin:1.6rem auto 2.2rem; }
.give-grid{ display:grid; grid-template-columns:1fr; gap:.7rem; max-width:640px; margin:0 auto; }
.give{ background:var(--card); border:1px solid var(--hair); border-radius:3px; padding:1.1rem 1rem; text-align:center; }
.give .g-k{ font-family:var(--serif); font-size:1.14rem; }
.give .g-d{ color:var(--muted); font-size:.76rem; letter-spacing:.02em; margin:.35rem 0 .8rem; }
.give .btn{ width:100%; }
.give-foot{ color:var(--muted-2); font-size:.74rem; margin-top:1rem; letter-spacing:.04em; }

/* Footer */
.foot{ padding-block:clamp(2.4rem,7vw,3.6rem); border-top:1px solid var(--hair); text-align:center; }
.foot .curtain-call{ font-family:var(--serif); font-style:italic; font-size:clamp(1.25rem,4vw,1.7rem); color:var(--ivory); }
.foot .spectrum{ margin:1.3rem auto; }
.foot-tag{ color:var(--muted); font-size:.82rem; max-width:44ch; margin:1rem auto 0; letter-spacing:.02em; }
.foot-org{ color:var(--ivory-dim); font-size:.85rem; margin-top:1.4rem; letter-spacing:.04em; }
.foot-org b{ font-weight:600; color:var(--ivory); }
.foot-fine{ color:var(--muted-2); font-size:.72rem; margin-top:.6rem; letter-spacing:.14em; text-transform:uppercase; }

@media (min-width:720px){
  .triptych{ grid-template-columns:repeat(3,1fr); }
  .give-grid{ grid-template-columns:repeat(3,1fr); }
  .fb-select{ min-width:184px; }
}
@media (min-width:940px){
  .split{ display:grid; grid-template-columns:1.05fr .95fr; gap:clamp(2rem,5vw,4rem); align-items:start; }
}
@media (max-width:559px){
  .fb-mark span{ display:none; }
  .fb-share-text{ display:none; }
  .fb-select{ min-width:132px; }
  .filter-in{ gap:.6rem; }
  .share-btn{ padding:.5rem .7rem; }
}
@media (prefers-reduced-motion:reduce){
  html{ scroll-behavior:auto; }
  .spot,.sparkle{ animation:none !important; }
  .panel,.valance{ transition:none !important; }
  .panel-anim{ animation:none !important; }
}
`;

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function KalosGala() {
  const reduce = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [active, setActive] = useState("evening");
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [curtainDone, setCurtainDone] = useState(false);
  const [posterMissing, setPosterMissing] = useState(false);
  const panelRef = useRef(null);

  const [nom, setNom] = useState({ nominee: "", cause: "", why: "", social: "", contact: "", message: "" });
  const [nomErr, setNomErr] = useState({});
  const [nomOk, setNomOk] = useState(false);

  const [sp, setSp] = useState({ name: "", org: "", contact: "", message: "" });
  const [spErr, setSpErr] = useState({});
  const [spOk, setSpOk] = useState(false);
  const [shared, setShared] = useState(false);

  const sparkles = useMemo(() => {
    const count = typeof window !== "undefined" && window.innerWidth < 640 ? 14 : 24;
    return Array.from({ length: count }, () => {
      const size = (Math.random() * 3 + 2).toFixed(1);
      const fall = Math.random() * 8 + 7;
      const twk = Math.random() * 2.5 + 2;
      return {
        size,
        left: (Math.random() * 100).toFixed(2),
        duration: `${fall.toFixed(1)}s, ${twk.toFixed(1)}s`,
        delay: `-${(Math.random() * fall).toFixed(1)}s, -${(Math.random() * twk).toFixed(1)}s`,
      };
    });
  }, []);

  useEffect(() => {
    if (reduce) { setCurtainDone(true); return; }
    const t1 = setTimeout(() => setCurtainOpen(true), 420);
    const t2 = setTimeout(() => setCurtainDone(true), 2020);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [reduce]);

  const go = (id) => {
    setActive(id);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const el = panelRef.current;
        if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      })
    );
  };

  const updNom = (e) => {
    const { name, value } = e.target;
    setNom((p) => ({ ...p, [name]: value }));
    setNomErr((p) => (p[name] ? { ...p, [name]: false } : p));
  };
  const updSp = (e) => {
    const { name, value } = e.target;
    setSp((p) => ({ ...p, [name]: value }));
    setSpErr((p) => (p[name] ? { ...p, [name]: false } : p));
  };

  const sendMail = (subject, lines) => {
    const body = lines.filter((l) => l !== undefined && l !== null).join("\n");
    window.location.href =
      `mailto:${encodeURIComponent(GALA.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const submitNom = () => {
    const required = ["nominee", "cause", "why", "contact"];
    const errs = {};
    required.forEach((k) => { if (!nom[k] || !nom[k].trim()) errs[k] = true; });
    setNomErr(errs);
    if (Object.keys(errs).length) return;
    sendMail(`Kalos Gala — Nomination: ${nom.nominee}`, [
      "KALOS GALA — NOMINATION",
      "----------------------------------",
      `Nominee: ${nom.nominee}`,
      `Recognized for: ${nom.cause}`,
      "",
      "Why this person:",
      nom.why,
      "",
      `Nominee social link: ${nom.social || "—"}`,
      `Submitted by (follow-up): ${nom.contact}`,
      "",
      "Additional notes:",
      nom.message || "—",
    ]);
    setNomOk(true);
  };

  const submitSp = () => {
    const required = ["name", "contact"];
    const errs = {};
    required.forEach((k) => { if (!sp[k] || !sp[k].trim()) errs[k] = true; });
    setSpErr(errs);
    if (Object.keys(errs).length) return;
    sendMail(`Kalos Gala — Sponsorship Inquiry: ${sp.name}`, [
      "KALOS GALA — SPONSORSHIP INQUIRY",
      "----------------------------------",
      `Name: ${sp.name}`,
      `Organization: ${sp.org || "—"}`,
      `Contact: ${sp.contact}`,
      "",
      "Message:",
      sp.message || "—",
    ]);
    setSpOk(true);
  };

const handleShare = () => {
  const shareUrl = "https://share.karaoverse.com/og/kalos-gala";

  if (navigator.share) {
    navigator
      .share({
        title: "Kalos Gala",
        text: "Kalos Gala — Honoring CT's LGBTQIA+ Legacy",
        url: shareUrl,
      })
      .catch(() => {});
  } else {
    navigator.clipboard.writeText(shareUrl);
    alert("Share link copied to clipboard!");
  }
};
  const stop = (e) => e.preventDefault();
  const linkProps = (url) =>
    url ? { href: url, target: "_blank", rel: "noopener" } : { href: "#", "aria-disabled": "true", onClick: stop };
  const ticketsOn = !!GALA.tickets;

  const renderPanel = () => {
    if (active === "legacy") {
      return (
        <div className="split">
          <div>
            <p className="eyebrow"><span className="act-no">Act I</span>&nbsp;&nbsp;The Legacy</p>
            <h2 className="h">A movement that began here.</h2>
            <p className="lede">
              On May 1, 1991, Governor Lowell P. Weicker signed Connecticut's landmark gay-rights law — barring
              discrimination in employment, housing, and credit, and making Connecticut only the fourth state in the nation
              to do so. It capped an eighteen-year struggle that began in 1973, the year the Kalos Society closed its doors.
              Short-lived but pivotal, Kalos helped ignite the state's modern LGBTQIA+ movement — building community,
              staging demonstrations, and founding <em>The Griffin</em>, one of Connecticut's earliest LGBTQ publications.
            </p>
          </div>
          <div className="timeline" role="list">
            <div className="tl-item" role="listitem">
              <div className="tl-year">1973</div>
              <div className="tl-text">The Kalos Society concludes — lighting the first spark of the modern movement.</div>
            </div>
            <div className="tl-item" role="listitem">
              <div className="tl-year">1973 – 1991</div>
              <div className="tl-text">Eighteen years of legislative struggle for basic protections.</div>
            </div>
            <div className="tl-item peak" role="listitem">
              <div className="tl-year">May 1, 1991</div>
              <div className="tl-text">Gov. Weicker signs the gay-rights law — the 4th state in the nation to do so.</div>
            </div>
            <div className="tl-item" role="listitem">
              <div className="tl-year">The 2000s</div>
              <div className="tl-text">Anne Stanback leads Love Makes a Family — the campaign from which CLARO Inc. emerged.</div>
            </div>
            <div className="tl-item" role="listitem">
              <div className="tl-year">Today</div>
              <div className="tl-text">The Hartford Pride Center carries the lineage forward as a program of CLARO Inc.</div>
            </div>
            <div className="tl-item peak" role="listitem">
              <div className="tl-year">May 1, 2027</div>
              <div className="tl-text">The inaugural Kalos Gala — on the exact anniversary of the law it commemorates.</div>
            </div>
          </div>
        </div>
      );
    }

    if (active === "nominate") {
      return (
        <div className="split">
          <div>
            <p className="eyebrow"><span className="act-no">Act III</span>&nbsp;&nbsp;The Honors</p>
            <h2 className="h">Submit a nomination.</h2>
            <p className="lede">
              Know someone advancing equity, visibility, safety, culture, healthcare, housing stability, or belonging in
              Connecticut? Put their name forward — nominations help us honor the people moving our state toward dignity and belonging.
            </p>
          </div>
          <div className="form-card">
            <div className="field">
              <label htmlFor="nom-name">Who are you nominating? <span className="req">*</span></label>
              <input className={`input ${nomErr.nominee ? "invalid" : ""}`} type="text" id="nom-name" name="nominee" placeholder="Full name" value={nom.nominee} onChange={updNom} />
            </div>
            <div className="field">
              <label htmlFor="nom-cause">What are they being recognized for? <span className="req">*</span></label>
              <select className={`select ${nomErr.cause ? "invalid" : ""}`} id="nom-cause" name="cause" value={nom.cause} onChange={updNom}>
                <option value="" disabled>Choose a cause…</option>
                <option>Equity &amp; Justice</option>
                <option>Visibility &amp; Representation</option>
                <option>Community Safety</option>
                <option>Arts &amp; Culture</option>
                <option>Healthcare</option>
                <option>Housing Stability</option>
                <option>Belonging &amp; Youth</option>
                <option>Lifetime Legacy</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="nom-why">Why this person? <span className="req">*</span></label>
              <textarea className={`textarea ${nomErr.why ? "invalid" : ""}`} id="nom-why" name="why" placeholder="Tell us about their impact." value={nom.why} onChange={updNom} />
            </div>
            <div className="field">
              <label htmlFor="nom-social">Nominee's social media link <span className="opt">(optional)</span></label>
              <input className="input" type="url" id="nom-social" name="social" placeholder="https://" value={nom.social} onChange={updNom} />
            </div>
            <div className="field">
              <label htmlFor="nom-contact">Your phone or email — for follow-up <span className="req">*</span></label>
              <input className={`input ${nomErr.contact ? "invalid" : ""}`} type="text" id="nom-contact" name="contact" placeholder="So we can reach you" value={nom.contact} onChange={updNom} />
            </div>
            <div className="field">
              <label htmlFor="nom-msg">Anything else? <span className="opt">(optional)</span></label>
              <textarea className="textarea" id="nom-msg" name="message" placeholder="Additional context or a message for the committee." value={nom.message} onChange={updNom} />
            </div>
            <div className="form-actions">
              <button className="btn solid" type="button" onClick={submitNom}>Send Nomination</button>
              <span className="form-note">Opens your email to send securely.</span>
            </div>
            <div className={`form-success ${nomOk ? "show" : ""}`} role="status">
              <b>Thank you.</b> Your nomination is ready in your email app — just hit send, and our committee will follow up.
            </div>
          </div>
        </div>
      );
    }

    if (active === "patron") {
      return (
        <div className="split">
          <div>
            <p className="eyebrow">Patrons &amp; Benefactors</p>
            <h2 className="h">Would you like to sponsor this event?</h2>
            <p className="lede">
              Sponsorship puts your name behind Connecticut's LGBTQIA+ legacy and directly sustains the Hartford Pride
              Center. Share your details and we'll reach out with sponsorship levels and benefits.
            </p>
          </div>
          <div className="form-card">
            <div className="field">
              <label htmlFor="sp-name">Your name <span className="req">*</span></label>
              <input className={`input ${spErr.name ? "invalid" : ""}`} type="text" id="sp-name" name="name" placeholder="Full name" value={sp.name} onChange={updSp} />
            </div>
            <div className="field">
              <label htmlFor="sp-org">Organization name <span className="opt">(optional)</span></label>
              <input className="input" type="text" id="sp-org" name="org" placeholder="Company or organization" value={sp.org} onChange={updSp} />
            </div>
            <div className="field">
              <label htmlFor="sp-contact">Phone number or email <span className="req">*</span></label>
              <input className={`input ${spErr.contact ? "invalid" : ""}`} type="text" id="sp-contact" name="contact" placeholder="Best way to reach you" value={sp.contact} onChange={updSp} />
            </div>
            <div className="field">
              <label htmlFor="sp-msg">Message <span className="opt">(optional)</span></label>
              <textarea className="textarea" id="sp-msg" name="message" placeholder="Tell us how you'd like to support the evening." value={sp.message} onChange={updSp} />
            </div>
            <div className="form-actions">
              <button className="btn solid" type="button" onClick={submitSp}>Send Inquiry</button>
              <span className="form-note">Opens your email to send securely.</span>
            </div>
            <div className={`form-success ${spOk ? "show" : ""}`} role="status">
              <b>Wonderful.</b> Your sponsorship inquiry is ready in your email app — send it along and we'll be in touch soon.
            </div>
          </div>
        </div>
      );
    }

    if (active === "giving") {
      return (
        <div className="boxoffice">
          <p className="eyebrow center">The Box Office</p>
          <h2 className="h">Reserve your seat. Fuel the future.</h2>
          <div className="tickets-block">
            <a className="btn solid" {...linkProps(GALA.tickets)}>
              {ticketsOn ? "Buy Tickets" : "Buy Tickets — Coming Soon"}
            </a>
          </div>
          <div className="give-grid">
            {[{ k: "One-Time Gift" }, { k: "Monthly Support" }, { k: "Legacy Giving" }].map((d, i) => {
              const url = GALA.donate[i];
              return (
                <div className="give" key={i}>
                  <div className="g-k">{d.k}</div>
                  <div className="g-d">Link &amp; details coming soon</div>
                  <a className="btn small" {...linkProps(url)}>{url ? "Give Now" : "Coming Soon"}</a>
                </div>
              );
            })}
          </div>
          <p className="give-foot">Every gift strengthens the Hartford Pride Center as an anchor for LGBTQIA+ Connecticut.</p>
        </div>
      );
    }

    // default: evening
    return (
      <div>
        <div className="center-block">
          <p className="eyebrow center"><span className="act-no">Act II</span>&nbsp;&nbsp;The Evening</p>
          <h2 className="h">One evening, three purposes.</h2>
          <p className="lede">
            Celebratory and elegant — with substance. A plated dinner, open bar, and live entertainment, built around an
            awards celebration for the leaders moving Connecticut forward.
          </p>
        </div>
        <div className="triptych" style={{ marginTop: "2rem" }}>
          <div className="tri"><span className="n">i.</span><h3>Remember</h3><p>Preserving the stories and people who made Connecticut's progress possible.</p></div>
          <div className="tri"><span className="n">ii.</span><h3>Recognize</h3><p>Honoring the leaders advancing equity, safety, culture, health, housing, and belonging today.</p></div>
          <div className="tri"><span className="n">iii.</span><h3>Invest</h3><p>Fueling the Hartford Pride Center — an anchor for LGBTQIA+ people and marginalized communities.</p></div>
        </div>
        <div className="program">
          <div className="pgm"><span className="num">01</span><span className="lbl">Plated Dinner</span><span className="desc">Seated · served</span></div>
          <div className="pgm"><span className="num">02</span><span className="lbl">Open Bar</span><span className="desc">Cocktails all evening</span></div>
          <div className="pgm"><span className="num">03</span><span className="lbl">Live Entertainment</span><span className="desc">On the main stage</span></div>
          <div className="pgm"><span className="num">04</span><span className="lbl">Awards Celebration</span><span className="desc">Honoring local LGBTQIA+ leaders</span></div>
        </div>
      </div>
    );
  };

  return (
    <div className="kg">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="stage-bg" aria-hidden="true">
        <div className="spot" />
        <div className="spot cool" />
      </div>

      {!reduce && (
        <div className="sparkles" aria-hidden="true">
          {sparkles.map((s, i) => (
            <span key={i} className="sparkle" style={{ width: `${s.size}px`, height: `${s.size}px`, left: `${s.left}%`, animationDuration: s.duration, animationDelay: s.delay }} />
          ))}
        </div>
      )}

      {!curtainDone && (
        <div id="curtain" className={curtainOpen ? "is-open" : ""} aria-hidden="true">
          <div className="valance" />
          <div className="panel left" />
          <div className="panel right" />
        </div>
      )}

      <div className="wrap">
        {/* Banner — top, full width */}
        <div className={`banner ${posterMissing ? "is-missing" : ""}`}>
          <img
            className="banner-img mt-16 lg:mt-26"
            src="/kalosgala.jpg"
            alt="Kalos Gala 2027 — Connecticut's LGBTQIA+ leadership and recognition evening"
            onError={() => setPosterMissing(true)}
          />
          <div className="banner-fallback" aria-hidden="true">
            <div className="bf-title">Kalos Gala</div>
            <div className="bf-sub">May 1 · 2027</div>
          </div>
        </div>

        {/* Sticky section filter */}
        <div className="filterbar">
          <div className="container filter-in">
            <span className="fb-mark">Kalos Gala <span>· CT</span></span>
            <div className="filter-right">
              <div>
                <label className="sr-only" htmlFor="section-filter">View section</label>
                <select id="section-filter" className="select fb-select" value={active} onChange={(e) => go(e.target.value)}>
                  {SECTIONS.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <button type="button" className="btn small ghost share-btn" onClick={handleShare} aria-label={shared ? "Link copied" : "Share this page"}>
                {shared ? <CheckIcon /> : <ShareIcon />}
                <span className="fb-share-text">{shared ? "Copied" : "Share"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Masthead */}
        <div className="masthead container">
          <p className="eyebrow center">The Inaugural Evening</p>
          <h1 className="marquee">Kalos Gala</h1>
          <p className="mast-sub">Connecticut's LGBTQIA+ leadership &amp; recognition evening</p>
          <span className="mast-date"><b>Saturday · May 1, 2027</b></span>
          <div className="mast-cta">
            <button className="btn solid" type="button" onClick={() => go("giving")}>Buy Tickets</button>
            <button className="btn" type="button" onClick={() => go("nominate")}>Submit a Nomination</button>
            <button className="btn ghost" type="button" onClick={() => go("patron")}>Become a Patron</button>
          </div>
        </div>

        {/* Filtered section */}
        <section className="section container">
          <div className="panel-anim" key={active} ref={panelRef}>
            {renderPanel()}
          </div>
        </section>

        <footer className="foot container">
          <p className="curtain-call">The movement is still evolving — and so are we.</p>
          <div className="spectrum" aria-hidden="true" />
          <p className="foot-tag">Honoring Connecticut's LGBTQIA+ Legacy. Recognizing Today's Leaders. Sustaining Our Future.</p>
          <p className="foot-org">The <b>Kalos Gala</b> &nbsp;·&nbsp; A signature fundraiser of the <b>Hartford Pride Center</b>, a program of CLARO Inc.</p>
          <p className="foot-fine">Saturday · May 1 · 2027</p>
        </footer>
      </div>
    </div>
  );
}