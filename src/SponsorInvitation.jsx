import React, { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, ArrowUpRight, Share2, X } from "lucide-react";
const PALETTE = ["#df9db0", "#dbb08b", "#cbb878", "#96b9a1", "#99b5d0", "#b4a0cc"];
const SHARED_ONE_TIME_LINK = "https://buy.stripe.com/8x24gs2cj5Mm1Sy0Gccwg0e";
const MONTHLY_AMOUNTS = [10, 20, 50];
const FUNDS = [
  {
    id: "medication",
    name: "Driscoll Fund",
    emoji: "💊",
    pastelHue: "#FF6B6B",
    blurb:
      "Help community members afford life-sustaining medications and prescription costs.",
    oneTime: "https://buy.stripe.com/3cIbIUaIP0s20OugFacwg0i",
    monthly: {
      10: null,
      20: "https://buy.stripe.com/7sYaEQ04ba2C40Gex2cwg0k",
      50: null,
    },
  },
  {
    id: "programming",
    name: "Capital City Pride",
    emoji: "🤝",
    pastelHue: "#FFA94D",
    blurb:
      "Fund workshops, support groups, education, and events that bring our community together.",
    oneTime: "https://buy.stripe.com/28E5kwbMT8YyeFkex2cwg0h",
    monthly: {
      10: null,
      20: "https://buy.stripe.com/9B6fZa2cjeiS8gWfB6cwg0g",
      50: null,
    },
  },
  {
    id: "general",
    name: "Employee Resource Group Support",
    emoji: "🏳️‍🌈",
    pastelHue: "#FFD43B",
    blurb:
      "Keep the lights on and the doors open — your gift goes wherever the need is greatest.",
    oneTime: SHARED_ONE_TIME_LINK,
    monthly: {
      10: null,
      20: "https://buy.stripe.com/cNi8wI18f0s2eFkex2cwg0f",
      50: null,
    },
  },
  {
    id: "pantry",
    name: "Pride Prosperity Partnership",
    emoji: "🥫",
    pastelHue: "#69DB7C",
    blurb:
      "Stock our pantry so no one has to choose between food and other essentials.",
    oneTime: "https://buy.stripe.com/aFaeV69EL6Qq2WCfB6cwg0d",
    monthly: {
      10: null,
      20: "https://buy.stripe.com/dRm8wI9ELa2C40G9cIcwg0c",
      50: null,
    },
  },
  {
    id: "transcare",
    name: "PRIDE Community Cares",
    emoji: "🏳️‍⚧️",
    pastelHue: "#74C0FC",
    blurb:
      "Support gender-affirming care resources, navigation help, and community for trans folks.",
    oneTime: "https://buy.stripe.com/4gM9AMdV1caKdBgex2cwg0b",
    monthly: {
      10: null,
      20: "https://buy.stripe.com/9B67sE3gnb6G54KagMcwg0a",
      50: null,
    },
  },
  {
    id: "housing",
    name: "Support Groups",
    emoji: "🏠",
    pastelHue: "#B197FC",
    blurb:
      "Provide emergency housing assistance and safety resources for LGBTQIA+ people in crisis.",
    oneTime: "https://buy.stripe.com/8x24gs3gn1w654KcoUcwg09",
    monthly: {
      10: null,
      20: "https://buy.stripe.com/fZubIUeZ50s268O2Okcwg08",
      50: null,
    },
  },
].map((f, i) => ({ ...f, hue: PALETTE[i % PALETTE.length] }));
const CONTACT_URL = "/contact";
const SHARE_URL = "https://share.karaoverse.com/og/pride/support";
const safeLink = value => {
  if (typeof value !== "string") return null;
  try { const url = new URL(value.trim()); return url.protocol === "https:" ? url.href : null; } catch { return null; }
};
const ANIMATION_COLORS = ["#e88ba6", "#edac80", "#e8ca78", "#90bba0", "#87afd3", "#b699ce"];
function DonationAnimation({ sceneRef, replay, onReplay }) {
  const reduced = useReducedMotion();
  const id = useId().replace(/:/g, "");
  return <div className="hpd-animation">
    <svg ref={sceneRef} key={replay} className={reduced ? "hpd-scene hpd-still" : "hpd-scene"} viewBox="0 0 560 350" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>A little generosity. A little more belonging.</title>
      <desc id={`${id}-desc`}>A hand places a banknote into a community donation box. A single six-color rainbow emerges from the donation slot, arches to the right, and continues to the bottom of the page.</desc>
      <defs>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff8ef"/><stop offset="1" stopColor="#f2e2ee"/></linearGradient>
        <linearGradient id={`${id}-box`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffdf6"/><stop offset="1" stopColor="#f0e4d5"/></linearGradient>
        <clipPath id={`${id}-above`}><rect x="0" y="0" width="560" height="213"/></clipPath>
      </defs>
      <ellipse cx="280" cy="309" rx="126" ry="13" fill="#6f447e" opacity=".08"/>
      <circle cx="280" cy="170" r="143" fill={`url(#${id}-paper)`}/>
      <g className="hpd-sparkles" fill="#b48ac6">
        <path d="M119 132l4 12 12 4-12 4-4 12-4-12-12-4 12-4z"/>
        <path d="M440 147l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/>
        <path d="M392 77l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#d4ae63"/>
        <circle cx="151" cy="92" r="3" fill="#d4ae63"/><circle cx="427" cy="235" r="3" fill="#87afd3"/>
      </g>
      <g className="hpd-hearts" fill="#d581a4">
        <path d="M154 186c-16-10-20-19-12-23 5-3 10 0 12 5 2-5 7-8 12-5 8 4 4 13-12 23z"/>
        <path d="M408 123c-12-8-15-15-9-18 4-2 7 0 9 4 2-4 5-6 9-4 6 3 3 10-9 18z"/>
      </g>
      {/* Box rear and slot sit behind the banknote. */}
      <path d="M184 216l24-26h144l24 26v77H184z" fill="#e5d4c4" stroke="#a98e79" strokeWidth="2"/>
      <path d="M184 216l24-26h144l24 26z" fill="#f5e9dc" stroke="#a98e79" strokeWidth="2"/>
      <path d="M240 207h80" stroke="#66505c" strokeWidth="6" strokeLinecap="round"/>
      {/* The note is clipped at the slot so it disappears inside the box. */}
      <g clipPath={`url(#${id}-above)`}>
        <g className="hpd-note">
          <rect x="261" y="80" width="38" height="89" rx="4" fill="#b5d9b7" stroke="#56836b" strokeWidth="2"/>
          <rect x="266" y="86" width="28" height="77" rx="3" fill="none" stroke="#75a17f"/>
          <ellipse cx="280" cy="124" rx="10" ry="15" fill="#e4f0d6"/>
          <text x="280" y="130" textAnchor="middle" fontFamily="Georgia, serif" fontSize="19" fill="#47745d">$</text>
        </g>
      </g>
      <g className="hpd-hand">
        <path d="M387-22h55l-27 83-46 33-67 9-10-23 54-13 24-25z" fill="#be865e" stroke="#8f5b44" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M381-22h66l-12 39-67-17z" fill="#a691c8" stroke="#7b659f" strokeWidth="2"/>
        <path d="M348 67l-48 4-28 6c-13 3-12 19 1 21l20-3 18 2" fill="#ce986e" stroke="#8f5b44" strokeWidth="2" strokeLinecap="round"/>
        <path d="M286 78l-11 3c-5 2-5 6-1 8l10-1" fill="#ebc0a0"/>
      </g>
      {/* Front hides the lower note once it passes through the slot. */}
      <rect x="184" y="216" width="192" height="82" rx="8" fill={`url(#${id}-box)`} stroke="#a98e79" strokeWidth="2"/>
      <rect x="218" y="234" width="124" height="47" rx="5" fill="#fffdf9" stroke="#dcc4cd"/>
      <path d="M236 258c-9-6-11-11-7-13 3-2 6 0 7 3 1-3 4-5 7-3 4 2 2 7-7 13z" fill="#c77797"/>
      <text x="283" y="254" textAnchor="middle" fill="#674b66" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700">FOR OUR</text>
      <text x="283" y="268" textAnchor="middle" fill="#674b66" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700">COMMUNITY</text>
      <g className="hpd-glow" fill="#fffdf1"><circle cx="245" cy="205" r="3"/><circle cx="315" cy="205" r="3"/><path d="M280 173l3 11 11 3-11 3-3 11-3-11-11-3 11-3z"/></g>
    </svg>
    <div className="hpd-animation-caption"><span>A little generosity. A lot of belonging.</span><button type="button" onClick={onReplay} disabled={reduced} aria-label="Replay donation animation">{reduced ? "Motion reduced" : "↻ Replay"}</button></div>
  </div>;
}
// Measure the actual slot in page coordinates, including responsive SVG scaling.
function PageRainbow({ pageRef, sceneRef, replay, reduced }) {
  const rainbowId = useId().replace(/:/g, "");
  const [geometry, setGeometry] = useState(null);
  useEffect(() => {
    const page = pageRef.current;
    const scene = sceneRef.current;
    if (!page || !scene) return;
    let frame;
    const measure = () => {
      const matrix = scene.getScreenCTM();
      if (!matrix) return;
      const bounds = page.getBoundingClientRect();
      const point = scene.createSVGPoint();
      point.x = 280;
      point.y = 207; // Exact center of the money slot.
      const slot = point.matrixTransform(matrix);
      const scale = Math.hypot(matrix.a, matrix.b);
      setGeometry({
        width: page.clientWidth,
        height: page.clientHeight,
        x: slot.x - bounds.left,
        y: slot.y - bounds.top,
        band: Math.min(6, 7 * scale),
        scale,
      });
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(page);
    observer.observe(scene);
    window.addEventListener("resize", schedule);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [pageRef, sceneRef, replay]);
  if (!geometry) return null;
  const { width, height, x, y, band, scale } = geometry;
  const outerStart = x - 2.5 * band;
  // A true semicircle, sized to the illustration rather than the page edge.
  const outerRadius = Math.min(165 * scale, (width - 8 - outerStart) / 2, y - 20);
  const center = outerStart + outerRadius;
  return <svg
    key={replay}
    className={`hps-page-rainbow${reduced ? " hps-page-rainbow-still" : ""}`}
    viewBox={`0 0 ${width} ${height}`}
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      {ANIMATION_COLORS.map((color, index) => <linearGradient
        key={color}
        id={`${rainbowId}-band-${index}`}
        gradientUnits="userSpaceOnUse"
        x1="0" x2="0" y1={y} y2={y + 100 * scale}
      >
        <stop offset="0" stopColor={color} stopOpacity="1" />
        <stop offset="1" stopColor={color} stopOpacity="0.14" />
      </linearGradient>)}
    </defs>
    {ANIMATION_COLORS.map((color, index) => {
      const radius = outerRadius - index * band;
      return <path
        key={color}
        d={`M ${center - radius} ${y} A ${radius} ${radius} 0 0 1 ${center + radius} ${y} V ${height}`}
        fill="none"
        stroke={`url(#${rainbowId}-band-${index})`}
        strokeWidth={band + 0.15}
        strokeLinecap="butt"
        pathLength="1"
      />;
    })}
  </svg>;
}

export default function SponsorInvitation() {
  const pageRef = useRef(null);
  const sceneRef = useRef(null);
  const [replay, setReplay] = useState(0);
  const [mode, setMode] = useState("once");
  const [activeFund, setActiveFund] = useState(null);
  const [copied, setCopied] = useState(false);
  const [paused, setPaused] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const copyTimer = useRef(null);
  const id = useId();
  const reduced = useReducedMotion();
  const reveal = reduced ? {} : { initial: {opacity:0,y:16}, whileInView:{opacity:1,y:0}, viewport:{once:true,amount:.1}, transition:{duration:.5} };
  const closeSheet = () => {setActiveFund(null);requestAnimationFrame(()=>trigger.current?.focus());};
  useEffect(()=>()=>clearTimeout(copyTimer.current),[]);
  useEffect(()=>{
    if(!activeFund)return;
    const node=dialog.current;if(node&&!node.open)node.showModal();
    const previous=document.body.style.overflow;document.body.style.overflow="hidden";
    return()=>{if(node?.open)node.close();document.body.style.overflow=previous;};
  },[activeFund]);
  const handleShare = async () => {
    if(navigator.share){try{await navigator.share({title:"Support Hartford Pride Center",text:"Six funds, one community. Pick where your gift goes.",url:SHARE_URL});return;}catch(err){if(err.name==="AbortError")return;}}
    try{await navigator.clipboard.writeText(SHARE_URL);setCopied(true);clearTimeout(copyTimer.current);copyTimer.current=setTimeout(()=>setCopied(false),2000);}catch{window.open(SHARE_URL,"_blank","noopener,noreferrer");}
  };
  return <main ref={pageRef} className="hps-page">
    <style>{STYLES}</style>
    <PageRainbow pageRef={pageRef} sceneRef={sceneRef} replay={replay} reduced={reduced} />
    <section className="hps-hero hps-inner">
      <motion.div {...reveal}><p className="hps-eyebrow">Support · Hartford Pride Center</p><h1>Give where<br/>it <em>matters most.</em></h1><p className="hps-lead">Six funds, one community. Pick exactly where your gift goes — medication, food, housing, trans care, programming, or wherever the need is greatest.</p><div className="hps-actions"><a className="hps-primary" href="#funds">Choose a fund <ArrowUpRight size={17} aria-hidden="true"/></a><button className="hps-secondary" type="button" onClick={handleShare}><Share2 size={15} aria-hidden="true"/>{copied?"Link copied":"Share"}</button></div></motion.div>
      <div className="hps-donation-art"><DonationAnimation sceneRef={sceneRef} replay={replay} onReplay={() => setReplay(v => v + 1)}/><p className="hps-animation-reassurance">100% of every dollar stays in the community. <span>501(c)(3) nonprofit</span></p></div>
    </section>
    <div className="hps-word-band"><div className="hps-marquee-window"><div className="hps-track" style={{animationPlayState:paused?"paused":"running"}}>{[0,1].map(copy=><div className="hps-word-copy" key={copy} aria-hidden={copy===1}>{["Give","Sustain","Uplift","Protect","Nourish","Together"].map((word,i)=><span key={word} style={{color:PALETTE[i]}}>{word}<b aria-hidden="true">✦</b></span>)}</div>)}</div></div><button type="button" className="hps-pause" onClick={()=>setPaused(v=>!v)} aria-pressed={paused} disabled={reduced}>{reduced?"Still":paused?"Play":"Pause"}</button></div>
    <section id="funds" className="hps-funds"><div className="hps-inner"><motion.header className="hps-funds-heading" {...reveal}><div><p className="hps-eyebrow">Where your gift goes</p><h2>Find your way to give.</h2></div><fieldset className="hps-frequency"><legend>Giving frequency</legend>{[["once","Give once"],["monthly","Give monthly"]].map(([value,label])=><label key={value}><input type="radio" name={`${id}-frequency`} value={value} checked={mode===value} onChange={()=>setMode(value)}/><span>{label}</span></label>)}</fieldset></motion.header><p className="hps-mode-note" aria-live="polite">{mode==="once"?"Make a one-time gift to the fund you choose.":"Choose a fund, then select an available monthly amount."}</p>
      <ul className="hps-grid">{FUNDS.map(fund=>{
        const oneTime=safeLink(fund.oneTime)||safeLink(SHARED_ONE_TIME_LINK);
        const hasMonthly=MONTHLY_AMOUNTS.some(amount=>safeLink(fund.monthly?.[amount]));
        return <motion.li key={fund.id} className="hps-card" style={{"--fund-color":fund.hue}} {...reveal}><span className="hps-pin" aria-hidden="true"/><div className="hps-card-top"><span className="hps-emoji" aria-hidden="true">{fund.emoji}</span><span className="hps-frequency-label">{mode==="once"?"One-time gift":"Monthly support"}</span></div><h3>{fund.name}</h3><p>{fund.blurb}</p>{mode==="once"?<a className="hps-card-cta" href={oneTime} target="_blank" rel="noopener noreferrer" aria-label={`Give once to ${fund.name} (opens Stripe in a new tab)`}>Give once <ArrowUpRight size={16} aria-hidden="true"/></a>:hasMonthly?<button type="button" className="hps-card-cta" onClick={e=>{trigger.current=e.currentTarget;setActiveFund(fund);}} aria-label={`Choose a monthly amount for ${fund.name}`}>Choose an amount <span aria-hidden="true">→</span></button>:<a className="hps-card-cta" href={CONTACT_URL}>Ask us to set it up <ArrowUpRight size={16} aria-hidden="true"/></a>}</motion.li>;
      })}</ul><p className="hps-stripe-note">Donation links open Stripe in a new tab.</p></div></section>
    <section className="hps-closing"><motion.div className="hps-inner" {...reveal}><Heart size={22} aria-hidden="true"/><h2>Every dollar stays<br/><em>in the community.</em></h2><p>Hartford Pride Center is a 501(c)(3) nonprofit. You can cancel a monthly gift anytime, and your support goes directly to the people who need it.</p><div className="hps-actions"><a className="hps-primary" href="#funds">Give now <ArrowUpRight size={16} aria-hidden="true"/></a><a className="hps-text-link" href={CONTACT_URL}>Contact us</a><button className="hps-secondary" type="button" onClick={handleShare}><Share2 size={15} aria-hidden="true"/>{copied?"Copied":"Share this page"}</button></div></motion.div></section><footer className="hps-footer">Thank you for supporting Hartford Pride Center.</footer><div className="hps-rainbow" aria-hidden="true"/>
    <span className="hps-sr" role="status">{copied?"Share link copied to clipboard.":""}</span>
    {activeFund&&<dialog ref={dialog} className="hps-dialog" aria-labelledby={`${id}-sheet-title`} onCancel={e=>{e.preventDefault();closeSheet();}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeSheet();}}} style={{"--fund-color":activeFund.hue}}><button type="button" className="hps-close" onClick={closeSheet} aria-label="Close monthly donation options" autoFocus><X size={20}/></button><p className="hps-eyebrow">Monthly gift</p><span className="hps-dialog-emoji" aria-hidden="true">{activeFund.emoji}</span><h2 id={`${id}-sheet-title`}>{activeFund.name}</h2><p className="hps-dialog-note">Choose an available amount to continue to Stripe.</p><div className="hps-amounts">{MONTHLY_AMOUNTS.map(amount=>{const link=safeLink(activeFund.monthly?.[amount]);return link?<a key={amount} href={link} target="_blank" rel="noopener noreferrer" aria-label={`Give $${amount} per month to ${activeFund.name} (opens Stripe in a new tab)`}><strong>${amount}</strong><span>/ month ↗</span></a>:<div key={amount} className="hps-unavailable" aria-disabled="true"><strong>${amount}</strong><span>Unavailable</span></div>;})}</div><p className="hps-other-amount">Want a different amount? <a href={CONTACT_URL}>Contact us</a> and we'll set it up.</p></dialog>}
  </main>;
}
const STYLES = `
/* Content stays in its original layout; the rainbow occupies no layout space.
   Section backgrounds stay beneath it, while text, cards and controls sit above. */
.hps-hero > div:first-child,
.hps-funds > .hps-inner,
.hps-closing > .hps-inner,
.hps-word-band,
.hps-footer,
.hpd-animation-caption,
.hps-animation-reassurance{position:relative;z-index:3}
.hps-page-rainbow{position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;overflow:hidden}

.hps-page{position:relative;isolation:isolate;--hps-header-clearance:96px;padding-top:var(--hps-header-clearance);min-height:100vh;background:#faf6f0;color:#493749;font:15px/1.7 Inter,ui-sans-serif,system-ui,sans-serif}.hps-page *{box-sizing:border-box}.hps-page :is(h1,h2,h3,p){margin:0}.hps-page :is(a,button,input):focus-visible{outline:3px solid #805995;outline-offset:4px}.hps-inner{width:94%;max-width:1120px;margin-inline:auto}.hps-hero{display:grid;grid-template-columns:1.15fr 1fr;align-items:center;gap:55px;padding-block:35px 42px}.hps-eyebrow{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#986f85;font-weight:750}.hps-hero h1{font:400 clamp(38px,5.5vw,68px)/1.08 Georgia,serif;letter-spacing:-2px;margin:15px 0 20px}.hps-hero h1 em{color:#8d5b84}.hps-lead{font-size:14px;line-height:1.85;color:#7b6678;max-width:530px}.hps-actions{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-top:23px}.hps-primary,.hps-secondary{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:46px;padding:11px 18px;border:1px solid #795482;border-radius:7px;font:700 13px/1.5 system-ui,sans-serif;text-decoration:none;cursor:pointer}.hps-primary{background:#795482;color:#fff}.hps-secondary{background:#fffafc;color:#755780;border-color:#d5c6dc}.hps-primary:hover{background:#63426d}.hps-secondary:hover{background:#efe5f5}.hps-poster{position:relative;max-width:420px;width:100%;margin-inline:auto;background:#fffdf8;border:1px solid #e5d9cc;border-radius:3px;padding:30px 25px;text-align:center;box-shadow:0 7px 22px #6b476b0a}.hps-tape{position:absolute;top:-9px;left:calc(50% - 30px);width:60px;height:20px;background:#dac8aa88;transform:rotate(-4deg)}.hps-heart{color:#b781a0;margin:18px auto 10px}.hps-poster h2{font:400 27px/1.3 Georgia,serif}.hps-poster h2 em{color:#92718e}.hps-symbols{display:flex;justify-content:center;gap:7px;margin:20px 0 16px}.hps-symbols>span{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;font-size:19px}.hps-poster>p:last-of-type{font-size:12px;color:#7e697b}.hps-nonprofit{font-size:10px;color:#917c92}.hps-word-band{display:flex;align-items:center;background:#392c44;padding:10px 12px;gap:12px}.hps-marquee-window{overflow:hidden;flex:1;min-width:0}.hps-track{display:flex;width:max-content;animation:hps-travel 25s linear infinite}.hps-word-copy{display:flex;flex-shrink:0;align-items:center}.hps-word-copy>span{display:flex;align-items:center;gap:30px;padding-right:30px;font:italic 24px/1.5 Georgia,serif;white-space:nowrap}.hps-word-copy b{font-size:12px;font-style:normal;color:#c1aaca}.hps-pause{min-height:44px;min-width:50px;background:transparent;border:1px solid #9b7da8;border-radius:6px;color:#e1d2e7;font-size:10px;cursor:pointer}.hps-pause:disabled{cursor:default}@keyframes hps-travel{from{transform:translateX(-50%)}to{transform:translateX(0)}}.hps-funds{padding:35px 0 30px;background:#eef3ee;scroll-margin-top:calc(var(--hps-header-clearance) + 12px)}.hps-funds-heading{display:flex;align-items:end;justify-content:space-between;gap:18px;flex-wrap:wrap}.hps-funds-heading h2{font:400 clamp(26px,3vw,35px)/1.25 Georgia,serif;margin-top:6px}.hps-frequency{display:flex;gap:4px;margin:0;padding:4px;background:#e1e6e0;border:1px solid #ccd8ce;border-radius:9px}.hps-frequency legend{position:absolute;clip-path:inset(50%);width:1px;height:1px;overflow:hidden}.hps-frequency label{position:relative;cursor:pointer}.hps-frequency input{position:absolute;opacity:0;width:1px;height:1px}.hps-frequency span{display:flex;align-items:center;justify-content:center;min-height:44px;padding:8px 17px;border-radius:6px;font-size:12px;font-weight:700;color:#6a786c}.hps-frequency input:checked+span{background:#fff;color:#655070;box-shadow:0 2px 7px #49374910}.hps-frequency input:focus-visible+span{outline:3px solid #805995;outline-offset:2px}.hps-mode-note{font-size:12px;color:#748071;margin:13px 0 21px!important}.hps-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px 16px;padding:0;margin:0;list-style:none}.hps-card{position:relative;display:flex;flex-direction:column;background:#fffdf9;border:1px solid #e0d7d1;border-top:3px solid var(--fund-color);border-radius:4px;padding:19px;box-shadow:0 4px 12px #55425d05}.hps-pin{position:absolute;right:17px;top:-6px;width:9px;height:9px;border-radius:50%;background:var(--fund-color);box-shadow:1px 2px 2px #684d7130}.hps-card-top{display:flex;align-items:center;justify-content:space-between;gap:10px}.hps-emoji{font-size:25px}.hps-frequency-label{font-size:9px;color:#9b859c;letter-spacing:.5px}.hps-card h3{font:400 22px/1.25 Georgia,serif;margin:10px 0}.hps-card>p{font-size:13px;color:#7c6b7b;line-height:1.75;margin-bottom:17px}.hps-card-cta{display:flex;justify-content:space-between;align-items:center;gap:8px;min-height:46px;margin-top:auto;padding:10px 13px;border:1px solid #cbbad5;border-radius:6px;background:#f4edf7;color:#6a487b;font:700 12px/1.4 system-ui,sans-serif;text-decoration:none;cursor:pointer}.hps-card-cta:hover{background:#eaddf2}.hps-stripe-note{text-align:center;color:#818d7f;font-size:10px;margin-top:17px!important}.hps-closing{background:#f1e9f3;padding:36px 0;text-align:center;border-top:1px solid #ded2e5}.hps-closing svg{color:#af7b9c}.hps-closing h2{font:400 clamp(28px,4vw,40px)/1.2 Georgia,serif;margin:12px auto}.hps-closing h2 em{color:#8c668f}.hps-closing p{max-width:660px;margin:auto;font-size:13px;color:#826d88}.hps-closing .hps-actions{justify-content:center}.hps-text-link{color:#785284;font-size:12px;text-underline-offset:4px;padding:10px;min-height:44px}.hps-footer{background:#392c44;padding:20px;text-align:center;color:#d4bedc;font-size:11px}.hps-rainbow{height:4px;background:linear-gradient(90deg,#df9db0,#dbb08b,#cbb878,#96b9a1,#99b5d0,#b4a0cc)}.hps-sr{position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden}.hps-dialog{position:fixed;inset:0;margin:auto;width:min(440px,calc(100% - 28px));max-height:85dvh;overflow:auto;border:1px solid #d8c8df;border-top:5px solid var(--fund-color);border-radius:13px;background:#fdf9fc;padding:24px;color:#493749;box-shadow:0 25px 80px #241b3940}.hps-dialog::backdrop{background:#291d38aa;backdrop-filter:blur(4px)}.hps-close{position:absolute;right:9px;top:9px;display:grid;place-items:center;width:44px;height:44px;border:1px solid #d7c5df;border-radius:50%;background:#fff;color:#795482;cursor:pointer}.hps-dialog>.hps-eyebrow{padding-right:45px}.hps-dialog-emoji{display:block;font-size:29px;margin-top:13px}.hps-dialog h2{font:400 27px/1.25 Georgia,serif;margin:9px 0}.hps-dialog-note{font-size:12px;color:#89718c}.hps-amounts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:21px 0}.hps-amounts>a,.hps-amounts>div{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:85px;border:1px solid #baa0ca;border-radius:8px;background:#efe3f5;color:#684078;text-decoration:none}.hps-amounts strong{font:400 29px/1.3 Georgia,serif}.hps-amounts span{font-size:10px}.hps-amounts .hps-unavailable{background:#f1edf2;border-style:dashed;border-color:#d6ccd9;color:#988a9e}.hps-other-amount{font-size:12px;color:#826b87;line-height:1.7}.hps-other-amount a{color:#725080;font-weight:700}.hps-page .hps-primary svg{color:inherit}
@media(max-width:800px){.hps-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hps-hero{gap:25px}.hps-symbols{gap:4px}.hps-symbols>span{width:31px;height:31px;font-size:16px}.hps-poster{padding:25px 15px}}@media(max-width:600px){.hps-page{--hps-header-clearance:112px}.hps-hero{grid-template-columns:1fr;gap:27px;padding-block:22px 28px}.hps-hero h1{font-size:43px;letter-spacing:-1.2px}.hps-hero .hps-actions>*{flex:1}.hps-poster{max-width:none;padding:22px}.hps-poster h2{font-size:25px}.hps-heart{margin:10px auto 7px}.hps-symbols{margin:14px 0 10px}.hps-funds{padding-top:27px}.hps-grid{grid-template-columns:1fr;gap:16px}.hps-frequency{width:100%}.hps-frequency label{flex:1}.hps-card{padding:17px}.hps-card h3{font-size:23px}.hps-word-copy>span{font-size:21px}.hps-dialog{inset:auto 0 0;margin:0 auto;width:100%;max-width:500px;border-radius:16px 16px 0 0;padding-bottom:max(24px,env(safe-area-inset-bottom))}}
@media(prefers-reduced-motion:reduce){.hps-track{animation:none}}
.hpd-animation{position:relative}.hpd-scene{display:block;width:100%;height:auto;overflow:hidden}.hpd-animation-caption{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 12px;color:#8a7289;font-size:11px}.hpd-animation-caption button{min-height:28px;padding:3px 9px;border:1px solid #d9c9dc;border-radius:20px;color:#755480;background:#fff9fc;font:700 10px/1.4 system-ui,sans-serif;cursor:pointer;flex-shrink:0}.hpd-animation-caption button:hover{background:#efe5f5}.hpd-animation-caption button:disabled{cursor:default;color:#807487}
/* One complete sequence: approach, release, withdraw, then rainbow reveal. */
.hpd-note{animation:hpd-note 5.8s ease-in-out both}.hpd-hand{animation:hpd-hand 5.8s ease-in-out both}.hps-page-rainbow path{stroke-dasharray:1;stroke-dashoffset:1;animation:hpd-rainbow-draw 5.8s ease-in-out both}.hpd-hearts,.hpd-sparkles,.hpd-glow{animation:hpd-celebrate 5.8s ease-out both}
@keyframes hpd-note{0%,10%{transform:translateY(-115px)}34%,40%{transform:translateY(36px)}53%,100%{transform:translateY(145px)}}
@keyframes hpd-hand{0%,10%{transform:translateY(-115px)}34%,40%{transform:translateY(36px)}58%,100%{transform:translate(65px,-170px)}}
@keyframes hpd-rainbow-draw{0%,55%{opacity:0;stroke-dashoffset:1}56%{opacity:1;stroke-dashoffset:1}85%,100%{opacity:1;stroke-dashoffset:0}}
.hps-page-rainbow-still path{animation:none;stroke-dashoffset:0;opacity:1}
@keyframes hpd-celebrate{0%,70%{opacity:0;transform:translateY(12px)}90%,100%{opacity:1;transform:translateY(0)}}
.hpd-still .hpd-hand,.hpd-still .hpd-note{display:none}.hpd-still :is(.hpd-rainbow,.hpd-hearts,.hpd-sparkles,.hpd-glow){animation:none;opacity:1;transform:none}
.hps-donation-art{min-width:0;width:100%;max-width:540px;margin-inline:auto}.hps-animation-reassurance{text-align:center;color:#88718b;font-size:11px;margin-top:12px!important}.hps-animation-reassurance span{display:block;font-size:10px;color:#958199}.hps-page .hpd-animation-caption button:focus-visible{outline:3px solid #805995;outline-offset:4px}
@media(max-width:600px){.hps-donation-art{order:-1;max-width:440px}.hps-hero{gap:20px}.hpd-animation-caption{font-size:10px;padding:0 5px}.hps-animation-reassurance{margin-top:8px!important}}
@media(prefers-reduced-motion:reduce){.hps-page-rainbow path{animation:none!important;stroke-dashoffset:0;opacity:1}.hpd-scene *{animation:none!important}.hpd-scene .hpd-rainbow path{stroke-dashoffset:0;opacity:1}.hpd-scene .hpd-note,.hpd-scene .hpd-hand{display:none}}
/* Neutral ink and solid surfaces keep decorative color away from letterforms. */
.hps-page{color:#302e33}
.hps-page :is(h1,h2,h3){color:#302e33}
.hps-hero h1 em,.hps-closing h2 em{color:#594058}
.hps-lead,.hps-card>p,.hps-closing p,.hps-dialog-note,.hps-other-amount{color:#504b53}
.hps-eyebrow,.hps-frequency-label,.hps-mode-note,.hps-stripe-note{color:#625967}
.hps-hero>div:first-child,.hpd-animation-caption,.hps-animation-reassurance{background:#faf6f0}
.hpd-animation-caption,.hps-animation-reassurance,.hps-animation-reassurance span{color:#5c535f}
.hpd-animation-caption button{color:#493d4f}
.hps-funds-heading,.hps-mode-note,.hps-stripe-note{background:#eef3ee}
.hps-closing h2,.hps-closing p{background:#f1e9f3}

`;
