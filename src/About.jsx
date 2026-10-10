// About.jsx — complete replacement; styles are scoped to this page.
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  FaArrowRight, FaHeart, FaUsers, FaEnvelope, FaCalendarAlt,
  FaHandsHelping, FaStar, FaBookOpen, FaHandHoldingHeart,
} from "react-icons/fa";

const INTRO_MS = 2200;
const RAINBOW = ["#db627e", "#e4a06b", "#d9be63", "#73ae8b", "#7d9ccf", "#ac83be"];
const LINKS = [
  { label: "Contact", detail: "Let’s start a conversation.", to: "/contact", color: "#345f9c", wash: "#eaf1fc", icon: FaEnvelope },
  { label: "Events", detail: "Make room for a little joy.", href: "https://karaoverse.com/event/capital-city-pride", color: "#a32d47", wash: "#fce9ec", icon: FaCalendarAlt },
  { label: "Volunteer", detail: "Your time makes a difference.", to: "/volunteer", color: "#256645", wash: "#e5f2e8", icon: FaHandsHelping },
  { label: "Sponsors", detail: "Grow something good together.", to: "/sponsors", color: "#97511c", wash: "#fff0df", icon: FaStar },
  { label: "Resources", detail: "Find your next step.", to: "/resources", color: "#796315", wash: "#fcf5d7", icon: FaBookOpen },
  { label: "Donate", detail: "Help belonging bloom.", to: "/support", color: "#795095", wash: "#f0e7f8", icon: FaHeart },
];
const WORDS = ["Empower", "Educate", "Celebrate", "Connect", "Uplift", "Belong"];
const FLAG_COLORS = [
  { name: "Rainbow Pride", colors: ["#e40303", "#ff8c00", "#ffed00", "#008026", "#004dff", "#750787"] },
  { name: "Transgender Pride", colors: ["#5bcefa", "#f5a9b8", "#fff", "#f5a9b8", "#5bcefa"] },
  { name: "Bisexual Pride", colors: ["#d60270", "#d60270", "#9b4f96", "#0038a8", "#0038a8"] },
  { name: "Lesbian Pride", colors: ["#d52d00", "#ff9a56", "#fff", "#d362a4", "#a30262"] },
  { name: "Nonbinary Pride", colors: ["#fff430", "#fff", "#9c59d1", "#2c2c2c"] },
];

function RainbowStrip() {
  return <div className="hpa-rainbow" aria-hidden="true">{RAINBOW.map(color => <span key={color} style={{ backgroundColor: color }} />)}</div>;
}

function AboutIntro({ onComplete }) {
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

  const intro = <div className="hpa-intro" role="dialog" aria-modal="true" aria-labelledby="hpa-intro-title" aria-describedby="hpa-intro-subtitle" onKeyDown={event => {
    if (event.key === "Escape") onComplete();
    if (event.key === "Tab") { event.preventDefault(); skipRef.current?.focus(); }
  }}>
    <div className="hpa-intro-inner">
      <span className="hpa-intro-heart" aria-hidden="true"><FaHeart /></span>
      <p className="hpa-intro-kicker">Every identity. One community.</p>
      <h2 id="hpa-intro-title">Hartford <span>Pride Center</span></h2>
      <div className="hpa-intro-flags">{FLAG_COLORS.map(flag => <span className="hpa-flag" role="img" aria-label={flag.name} key={flag.name}>{flag.colors.map((color, i) => <span key={i} style={{ backgroundColor: color }} />)}</span>)}</div>
      <p id="hpa-intro-subtitle" className="hpa-intro-neon">About Us</p>
      <p className="hpa-intro-caption">A little about us. A place for you.</p>
      <div className="hpa-intro-progress" aria-hidden="true"><span /></div>
      <button ref={skipRef} type="button" className="hpa-intro-skip" onClick={onComplete}>Explore our story <FaArrowRight aria-hidden="true" /></button>
    </div>
  </div>;
  return typeof document === "undefined" ? intro : createPortal(intro, document.body);
}

export default function About() {
  const [showIntro, setShowIntro] = useState(true);
  const headingRef = useRef(null);
  const completeIntro = useCallback(() => setShowIntro(false), []);
  useEffect(() => {
    if (!showIntro) headingRef.current?.focus({ preventScroll: true });
  }, [showIntro]);

  return <>
    <style>{ABOUT_STYLES}</style>
    {showIntro ? <AboutIntro onComplete={completeIntro} /> : <main className="hpa-page">
      <RainbowStrip />
      <section className="hpa-container hpa-hero" aria-labelledby="hpa-title">
        <div className="hpa-hero-copy">
          <p className="hpa-kicker"><FaHeart aria-hidden="true" /> Empower · Educate · Celebrate</p>
          <h1 id="hpa-title" ref={headingRef} tabIndex={-1}>About us.<br /><em>All of us.</em></h1>
          <p className="hpa-hero-lead">Building a future where every voice is heard, every identity celebrated, and every person empowered — across Hartford and the Capital Region.</p>
          <span className="hpa-location">Rooted in Hartford. Open to you.</span>
        </div>
        <figure className="hpa-photo-note">
          <div className="hpa-tape" aria-hidden="true" />
          <div className="hpa-photo-top"><span>With Pride. With love. With you.</span><FaHeart aria-hidden="true" /></div>
          <img src="https://wp25.s3.amazonaws.com/wp-content/uploads/2025/01/29053539/Parade-Banner.webp" alt="A community Pride celebration" fetchPriority="high" />
          <RainbowStrip />
          <figcaption><span>Since Day One</span><em>Greater Hartford. Greater together.</em></figcaption>
        </figure>
      </section>

      <div className="hpa-container">
        <div className="hpa-words" role="region" aria-label="Our values — moving from left to right; focus to pause" tabIndex={0}>
          <span className="hpa-sr-only">Empower, Educate, Celebrate, Connect, Uplift, Belong.</span>
          <div className="hpa-words-track" aria-hidden="true">{[0, 1, 2, 3].map(copy => <div className="hpa-words-group" key={copy}>{WORDS.map((word, index) => <span key={word} style={{ "--word-ink": LINKS[index].color }}>{word}</span>)}</div>)}</div>
        </div>
      </div>

      <section className="hpa-container hpa-explore" aria-labelledby="hpa-explore-title">
        <div className="hpa-section-heading"><div><p className="hpa-eyebrow">Pinned with Pride</p><h2 id="hpa-explore-title">Explore <em>the center.</em></h2></div><p>Find your people.<br />Find your next step.</p></div>
        <nav aria-label="Explore the center" className="hpa-link-grid">{LINKS.map(item => {
          const Icon = item.icon;
          const content = <><span className="hpa-pin" aria-hidden="true" /><span className="hpa-card-icon"><Icon aria-hidden="true" /></span><strong>{item.label}</strong><span className="hpa-card-detail">{item.detail}</span><FaArrowRight className="hpa-card-arrow" aria-hidden="true" /></>;
          const props = { className: "hpa-link-card", style: { "--card-ink": item.color, "--card-wash": item.wash } };
          return item.href ? <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" {...props}>{content}<span className="hpa-sr-only"> (opens in a new tab)</span></a> : <Link key={item.label} to={item.to} {...props}>{content}</Link>;
        })}</nav>
        <Link to="/ourteam" className="hpa-team"><span className="hpa-team-icon"><FaUsers aria-hidden="true" /></span><span><strong>People make this place.</strong><small>Meet the team behind Hartford Pride Center.</small></span><span className="hpa-team-cta">Meet Our Team <FaArrowRight aria-hidden="true" /></span></Link>
      </section>

      <section className="hpa-container hpa-purpose" aria-label="Our mission and values">
        <article className="hpa-purpose-card hpa-mission"><span className="hpa-purpose-icon"><FaHandHoldingHeart aria-hidden="true" /></span><p className="hpa-eyebrow">The heart of what we do</p><h2>Our <em>mission.</em></h2><p>To create a welcoming and affirming space for all members of the LGBTQIA+ community by fostering connection, promoting self-expression, and providing essential resources that empower individuals and strengthen our collective voice in Greater Hartford.</p></article>
        <article className="hpa-purpose-card hpa-values"><span className="hpa-purpose-icon"><FaStar aria-hidden="true" /></span><p className="hpa-eyebrow">What brings us together</p><h2>Our <em>values.</em></h2><p>We believe in authenticity, inclusivity, and collaboration. Through creativity and compassion, we build bridges across communities and celebrate the beauty of being unapologetically ourselves. Together, we thrive.</p></article>
      </section>

      <section className="hpa-closing" aria-labelledby="hpa-closing-title"><div className="hpa-container hpa-closing-inner"><span className="hpa-closing-heart" aria-hidden="true"><FaHeart /></span><p className="hpa-eyebrow">Not just a place. A feeling.</p><h2 id="hpa-closing-title">Uplifting and connecting<br /><em>the LGBTQIA+ community.</em></h2><p className="hpa-closing-copy">The Hartford Pride Center is dedicated to uplifting and connecting the LGBTQIA+ community through advocacy, art, education, and celebration. We provide inclusive programming, support services, and cultural events that amplify queer voices and promote equality.</p><div className="hpa-actions"><Link className="hpa-button hpa-button-primary" to="/support"><FaHeart aria-hidden="true" /> Donate</Link><Link className="hpa-button" to="/volunteer">Volunteer <FaArrowRight aria-hidden="true" /></Link><Link className="hpa-button" to="/contact">Contact <FaEnvelope aria-hidden="true" /></Link></div></div></section>
      <RainbowStrip />
    </main>}
  </>;
}

const ABOUT_STYLES = `
.hpa-page,.hpa-intro{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
.hpa-page *,.hpa-intro *{box-sizing:border-box}
.hpa-page{color:#42314e;background:radial-gradient(circle at 10% 8%,#f8dce744,transparent 28%),radial-gradient(circle at 90% 40%,#e6e0f84a,transparent 35%),#faf8f4;min-height:100vh;padding-top:var(--hpc-header-offset,64px);isolation:isolate;color-scheme:light}
.hpa-page h1,.hpa-page h2,.hpa-page p,.hpa-page figure,.hpa-intro h2,.hpa-intro p{margin:0}
.hpa-page a{color:inherit;text-decoration:none}
.hpa-page h1,.hpa-page h2{color:inherit;font-weight:550;line-height:1.12;letter-spacing:-1px}
.hpa-page em,.hpa-intro h2>span{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-weight:400}
.hpa-page a:focus-visible,.hpa-intro button:focus-visible{outline:3px solid #9864b0;outline-offset:5px}
.hpa-page h1:focus{outline:none}
.hpa-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.hpa-container{width:97%;max-width:1440px;margin-inline:auto;padding-inline:clamp(12px,2.3vw,34px)}
.hpa-rainbow{display:flex;height:4px;overflow:hidden}.hpa-rainbow>span{flex:1}
.hpa-hero{display:grid;grid-template-columns:1.1fr 1fr;align-items:center;gap:clamp(28px,6vw,90px);padding-block:60px 44px}
.hpa-kicker{display:inline-flex;align-items:center;gap:9px;border:1px solid #e3cedf;border-radius:999px;background:#fff8fc;padding:8px 13px;color:#845478;font-size:11px;font-weight:650;letter-spacing:.5px}
.hpa-kicker svg{color:#b45179;flex-shrink:0}
.hpa-page .hpa-hero h1{font-size:clamp(48px,6.8vw,92px);letter-spacing:-3px;line-height:1.05;margin:22px 0}
.hpa-hero h1 em{color:#88577f}
.hpa-hero-lead{font-size:clamp(14px,1.3vw,17px);line-height:1.85;color:#716175;max-width:570px}
.hpa-location{display:block;font-size:12px;color:#7d5c7a;margin-top:20px;letter-spacing:.35px}
.hpa-photo-note{position:relative;background:#fffdfb;border:1px solid #e5d7dd;padding:16px;border-radius:24px;box-shadow:0 12px 30px #65476312;transform:rotate(1.5deg);min-width:0}
.hpa-tape{position:absolute;top:-10px;left:calc(50% - 35px);width:70px;height:23px;background:#e9d5edd9;transform:rotate(-5deg);border-inline:1px dashed #c4a6c933;z-index:1}
.hpa-photo-top{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:10px;letter-spacing:.6px;color:#8c6681;padding:2px 2px 12px}
.hpa-photo-note img{display:block;width:100%;aspect-ratio:1.55;object-fit:cover;object-position:center 25%;border-radius:15px 15px 0 0;background:#efdeeb}
.hpa-photo-note figcaption{text-align:center;padding:13px 4px 2px;line-height:1.5}
.hpa-photo-note figcaption>span{display:block;color:#9a788f;font-size:10px;letter-spacing:1px;text-transform:uppercase}
.hpa-photo-note figcaption em{display:block;font-size:clamp(17px,1.7vw,23px);color:#765574;margin-top:4px}
.hpa-words{overflow:hidden;border-block:1px solid #e9dfe8;padding-block:19px;--values-cycle:840px;mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)}
.hpa-words:focus-visible{outline:3px solid #9864b0;outline-offset:4px;mask-image:none;-webkit-mask-image:none}
.hpa-words-track{display:flex;width:max-content;animation:hpa-values-right 28s linear infinite}
.hpa-words-group{display:flex;align-items:center;flex:0 0 var(--values-cycle);width:var(--values-cycle)}
.hpa-words-group>span{position:relative;flex:1;text-align:center;padding:3px 16px;color:var(--word-ink);font-family:Georgia,"Times New Roman",serif;font-size:22px;font-style:italic;font-weight:400;line-height:1.5;letter-spacing:.15px;white-space:nowrap}
.hpa-words-group>span::after{content:"";position:absolute;right:0;top:50%;width:3px;height:3px;border-radius:50%;background:#c5adc4;transform:translate(50%,-50%)}
.hpa-words:hover .hpa-words-track,.hpa-words:focus-within .hpa-words-track{animation-play-state:paused}
@keyframes hpa-values-right{from{transform:translateX(calc(-1 * var(--values-cycle)))}to{transform:translateX(0)}}
@media(prefers-reduced-motion:reduce){.hpa-words{mask-image:none;-webkit-mask-image:none}.hpa-words-track{width:100%;transform:none}.hpa-words-group{width:100%;flex-basis:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px 0}.hpa-words-group:not(:first-child){display:none}.hpa-words-group>span{padding-inline:4px;font-size:18px}.hpa-words-group>span:nth-child(3n)::after{display:none}}

.hpa-explore{padding-block:38px 32px}
.hpa-section-heading{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:25px}
.hpa-eyebrow{color:#895d83;font-size:10px;font-weight:750;letter-spacing:1.5px;text-transform:uppercase;line-height:1.6}
.hpa-page .hpa-section-heading h2{font-size:clamp(29px,3.3vw,43px);margin-top:8px}
.hpa-section-heading>p{font-size:12px;line-height:1.7;color:#806f82;text-align:right}
.hpa-link-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px;padding-top:6px}
.hpa-link-card{position:relative;display:flex;flex-direction:column;align-items:flex-start;min-width:0;padding:23px 15px 17px;background:var(--card-wash);border:1px solid #67536c16;border-radius:15px;box-shadow:0 5px 12px #68446908;transition:box-shadow .2s,transform .2s}
.hpa-link-card:nth-child(odd){transform:rotate(-.6deg)}.hpa-link-card:nth-child(even){transform:rotate(.6deg)}.hpa-link-card:hover{transform:translateY(-3px);box-shadow:0 8px 20px #68446918}
.hpa-pin{position:absolute;top:-4px;left:calc(50% - 4px);width:9px;height:9px;border:2px solid #ffffffb0;border-radius:50%;background:var(--card-ink);box-shadow:0 2px 4px #0002}
.hpa-card-icon{display:grid;place-items:center;width:34px;height:34px;background:#ffffff9c;color:var(--card-ink);border-radius:11px;margin-bottom:15px}
.hpa-link-card strong{font-size:16px;color:var(--card-ink);line-height:1.35}.hpa-card-detail{font-size:11px;line-height:1.6;margin-top:5px;color:#615468}.hpa-card-arrow{position:absolute;top:32px;right:14px;color:var(--card-ink);font-size:11px}
.hpa-team{display:flex;align-items:center;gap:14px;margin-top:18px;padding:15px 18px;border:1px solid #e5d8e7;border-radius:17px;background:#fffcfe}
.hpa-team-icon{display:grid;place-items:center;width:40px;height:40px;flex-shrink:0;background:#f1e8f5;color:#885789;border-radius:13px;font-size:19px}
.hpa-team strong{display:block;font-size:14px}.hpa-team small{display:block;font-size:12px;color:#7c6a7f;margin-top:2px}.hpa-team-cta{display:flex;align-items:center;gap:12px;margin-left:auto;font-size:12px;font-weight:650;color:#855982}
.hpa-purpose{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;padding-bottom:40px}
.hpa-purpose-card{position:relative;padding:26px;border:1px solid #e8d6e3;border-radius:22px;box-shadow:0 6px 20px #68446907;background:#fff4f6}
.hpa-values{background:#f0f3fc;border-color:#dbe0ed}.hpa-purpose-icon{display:grid;place-items:center;width:40px;height:40px;margin-bottom:17px;border-radius:13px;background:#ffffffc9;color:#a85c7e;font-size:19px}.hpa-values .hpa-purpose-icon{color:#6781ac}
.hpa-page .hpa-purpose-card h2{font-size:34px;margin:8px 0 15px}.hpa-purpose-card>p:last-child{font-size:14px;line-height:1.85;color:#6e5e75}
.hpa-closing{border-top:1px solid #e8dae8;background:radial-gradient(ellipse at 10% 10%,#f9e2edaa,transparent 50%),radial-gradient(ellipse at 90% 85%,#e8e4fcaa,transparent 55%),#fffaf7;text-align:center}
.hpa-closing-inner{padding-block:35px 40px}.hpa-closing-heart{display:grid;place-items:center;width:38px;height:38px;margin:0 auto 13px;border-radius:14px;background:#f5e0ec;color:#b66c91;transform:rotate(-7deg)}
.hpa-page .hpa-closing h2{font-size:clamp(28px,3.5vw,44px);margin:11px auto 17px;line-height:1.2;max-width:800px}.hpa-closing h2 em{color:#84577e}.hpa-closing-copy{max-width:780px;margin-inline:auto!important;font-size:14px;line-height:1.85;color:#78657b}
.hpa-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:24px}.hpa-page .hpa-button{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:10px 20px;border:1px solid #d9c3de;border-radius:999px;background:#fffafc;color:#7d527e;font-size:12px;font-weight:650;transition:background .2s}.hpa-page .hpa-button-primary{color:#fff;background:#80567f;border-color:#80567f}.hpa-page .hpa-button:hover{background:#f3e3f0}.hpa-page .hpa-button-primary:hover{background:#6e456e}
.hpa-intro{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;min-height:100dvh;overflow:auto;padding:28px 20px;background:radial-gradient(ellipse at 15% 15%,#b34e7930,transparent 50%),radial-gradient(ellipse at 85% 70%,#5878b42b,transparent 55%),#191321;color:#fff;color-scheme:dark;text-align:center}
.hpa-intro-inner{width:100%;max-width:700px;animation:hpa-intro-in .55s ease both}.hpa-intro-heart{display:grid;place-items:center;width:43px;height:43px;margin:0 auto 20px;border:1px solid #dca2c12e;border-radius:16px;background:#ffbfd00c;color:#edb5d1;box-shadow:0 0 30px #d982ba13}
.hpa-intro-kicker{font-size:10px;letter-spacing:1.7px;color:#d2bbda;font-weight:550}
.hpa-intro h2{font-size:clamp(34px,5.8vw,66px);font-weight:450;line-height:1.13;letter-spacing:-1.5px;margin-top:20px;color:#f8edf5}
.hpa-intro h2>span{display:block;background:linear-gradient(100deg,#ffa7b9,#ffca98,#f6e7a6,#b2e4c7,#b5d8ff,#d5b6fa);background-clip:text;-webkit-background-clip:text;color:transparent;padding-bottom:8px}
.hpa-intro-flags{display:flex;justify-content:center;gap:11px;margin:22px auto 24px}.hpa-flag{display:flex;flex-direction:column;width:36px;height:24px;border-radius:4px;overflow:hidden;border:1px solid #ffffff29;box-shadow:0 4px 10px #0002}.hpa-flag>span{flex:1}
.hpa-intro .hpa-intro-neon{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-size:clamp(32px,5vw,48px);line-height:1.25;letter-spacing:.3px;color:#f7d9f3;text-shadow:0 0 8px #ee9ad36b,0 0 25px #ce80d14d,0 0 48px #ab74ce2b}
.hpa-intro-caption{font-size:12px;color:#c8b2d2;margin-top:10px!important;letter-spacing:.2px}.hpa-intro-progress{height:3px;width:115px;margin:25px auto 12px;background:#ffffff15;overflow:hidden;border-radius:99px}.hpa-intro-progress>span{display:block;height:100%;transform-origin:left;background:linear-gradient(90deg,#ff98ac,#ffc58a,#f4df92,#a2dfb6,#a9cfff,#d0a2f0);animation:hpa-progress ${INTRO_MS}ms linear both}
.hpa-intro-skip{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:10px 16px;border:1px solid #d5b8df36;border-radius:999px;background:#ffffff05;color:#e4d1ec;font:inherit;font-size:12px;cursor:pointer}.hpa-intro-skip:hover{background:#ffffff10}.hpa-intro-skip svg{font-size:10px}
@keyframes hpa-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes hpa-intro-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
@media(min-width:1600px){.hpa-container{max-width:1560px}}
@media(max-width:1050px){.hpa-link-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:18px 14px}.hpa-hero{gap:30px}}
@media(max-width:760px){.hpa-hero{grid-template-columns:1fr;gap:27px;padding-block:29px}.hpa-page .hpa-hero h1{font-size:clamp(48px,10vw,72px);letter-spacing:-2px;margin:17px 0}.hpa-hero-lead{font-size:14px;max-width:none}.hpa-location{margin-top:13px}.hpa-photo-note{transform:none;max-width:540px;width:100%;justify-self:center;padding:13px;border-radius:19px}.hpa-photo-note img{aspect-ratio:1.8}.hpa-photo-note figcaption em{font-size:20px}.hpa-words{--values-cycle:720px;padding-block:16px}.hpa-words-group>span{font-size:19px}.hpa-explore{padding-block:26px}.hpa-section-heading{margin-bottom:21px}.hpa-section-heading>p{font-size:11px}.hpa-purpose{gap:14px;padding-bottom:28px}.hpa-purpose-card{padding:20px}.hpa-purpose-card>p:last-child{font-size:13px}.hpa-page .hpa-purpose-card h2{font-size:30px}.hpa-team{flex-wrap:wrap;gap:11px}.hpa-team-cta{width:100%;margin:0;padding-left:51px;justify-content:space-between}.hpa-closing-copy{font-size:13px}.hpa-closing-inner{padding-block:27px 30px}}
@media(max-width:520px){.hpa-container{padding-inline:10px}.hpa-kicker{font-size:9px;padding:7px 10px;letter-spacing:.3px}.hpa-link-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:17px 10px}.hpa-link-card:nth-child(n){transform:none}.hpa-link-card{padding:21px 13px 15px}.hpa-card-arrow{right:13px;top:31px}.hpa-card-detail{font-size:11px}.hpa-link-card strong{font-size:16px}.hpa-section-heading{align-items:start;gap:12px}.hpa-section-heading>p{display:none}.hpa-purpose{grid-template-columns:1fr}.hpa-purpose-card{padding:20px;border-radius:19px}.hpa-purpose-icon{margin-bottom:12px}.hpa-team{padding:13px}.hpa-team strong{font-size:13px}.hpa-team small{font-size:11px}.hpa-team>span:nth-child(2){flex:1;min-width:0}.hpa-photo-top{font-size:9px}.hpa-closing h2 br{display:none}.hpa-actions{gap:8px}.hpa-page .hpa-button{padding:10px 15px}.hpa-intro{padding:24px 16px}.hpa-intro-kicker{font-size:9px;letter-spacing:1px}.hpa-intro h2{font-size:clamp(34px,10vw,46px)}.hpa-intro-heart{margin-bottom:16px}.hpa-intro-flags{margin-block:18px 22px}.hpa-intro-caption{font-size:11px}}
@media(prefers-reduced-motion:reduce){.hpa-page *,.hpa-intro *{animation:none!important;transition:none!important;scroll-behavior:auto!important}.hpa-intro-progress>span{transform:scaleX(1)}}
@media(forced-colors:active){.hpa-intro h2>span{color:CanvasText;background:none}.hpa-intro-neon{text-shadow:none}.hpa-link-card,.hpa-purpose-card,.hpa-team,.hpa-photo-note{border-color:CanvasText}}
`;
