// Resources.jsx — Hartford Pride Center. Styled to match the Hartford homepage (community noticeboard).
// Dependencies: React, react-router-dom, framer-motion, react-icons.
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaPhoneAlt, FaCommentDots, FaHeart, FaHandsHelping, FaBook, FaGlobeAmericas,
  FaInstagram, FaFacebook, FaEnvelope, FaLink, FaSearch, FaArrowRight, FaShieldAlt,
} from "react-icons/fa";

const RAINBOW = ["#e40303", "#ff8c00", "#ffed00", "#008026", "#004dff", "#750787"];

/* ───────── Get help now ─────────
   Numbers checked October 2026. Re-check these periodically. */
const URGENT = [
  {
    name: "988 Suicide & Crisis Lifeline",
    note: "24/7 · free & confidential",
    actions: [
      { label: "Call 988", href: "tel:988", icon: FaPhoneAlt },
      { label: "Text 988", href: "sms:988", icon: FaCommentDots },
    ],
  },
  {
    name: "The Trevor Project",
    note: "24/7 · LGBTQ+ young people",
    actions: [
      { label: "1-866-488-7386", href: "tel:+18664887386", icon: FaPhoneAlt },
      { label: "Text START to 678-678", href: "sms:678678?&body=START", icon: FaCommentDots },
    ],
  },
  {
    name: "Trans Lifeline",
    note: "Peer support by trans people · check site for hours",
    actions: [{ label: "877-565-8860", href: "tel:+18775658860", icon: FaPhoneAlt }],
  },
];

/* ───────── Resource directory ───────── */
const CATEGORIES = [
  {
    id: "crisis",
    chip: "Crisis",
    title: "Crisis & Immediate Support",
    blurb: "Someone to talk to, any time.",
    icon: FaPhoneAlt,
    color: "#a32d47",
    wash: "#fce9ec",
    items: [
      { label: "988 Suicide & Crisis Lifeline", desc: "24/7 confidential support for emotional distress. Call or text 988.", link: "https://988lifeline.org" },
      { label: "The Trevor Project", desc: "24/7 crisis support for LGBTQ+ young people by phone, text, or chat.", link: "https://www.thetrevorproject.org/get-help/" },
      { label: "Trans Lifeline", desc: "Peer support run by and for trans people.", link: "https://translifeline.org" },
    ],
  },
  {
    id: "local",
    chip: "Local",
    title: "Local Community & Advocacy",
    blurb: "Close to home in Greater Hartford.",
    icon: FaHandsHelping,
    color: "#97511c",
    wash: "#fff0df",
    items: [
      { label: "Hartford Pride Center", tag: "Hartford", desc: "Local LGBTQ+ support, programming, and events.", link: "https://hartfordpridecenter.org" },
      { label: "True Colors, Inc.", tag: "Connecticut", desc: "Connecticut nonprofit supporting LGBTQ+ youth, families, and the people who serve them.", link: "https://ourtruecolors.org" },
      { label: "PFLAG Hartford", tag: "Hartford", desc: "Support for families, allies, and loved ones.", link: "https://pflag.org" },
    ],
  },
  {
    id: "health",
    chip: "Health",
    title: "Health & Wellness",
    blurb: "Care that sees you.",
    icon: FaHeart,
    color: "#256645",
    wash: "#e5f2e8",
    items: [
      { label: "Planned Parenthood", desc: "Inclusive sexual and reproductive health care.", link: "https://www.plannedparenthood.org" },
      { label: "GLMA Provider Directory", desc: "Find LGBTQ+-friendly health care providers.", link: "https://www.glma.org" },
    ],
  },
  {
    id: "legal",
    chip: "Legal",
    title: "Education & Legal Resources",
    blurb: "Know your rights.",
    icon: FaBook,
    color: "#345f9c",
    wash: "#e7effb",
    items: [
      { label: "ACLU — LGBTQ Rights", desc: "Know your rights and legal protections.", link: "https://www.aclu.org/issues/lgbtq-rights" },
      { label: "Lambda Legal", desc: "Legal help desk and advocacy.", link: "https://www.lambdalegal.org" },
    ],
  },
];

/* ───────── Featured: The Perseus Project ───────── */
const PERSEUS_LINKS = [
  { label: "Aid & Bystander Hotline", value: "860-352-0590", href: "tel:+18603520590", icon: FaPhoneAlt, highlight: true },
  { label: "Instagram", value: "@theperseusproject", href: "https://instagram.com/theperseusproject", icon: FaInstagram, external: true },
  { label: "Facebook", value: "facebook.com/theperseusproject", href: "https://facebook.com/theperseusproject", icon: FaFacebook, external: true },
  { label: "Support their work", value: "gofundme.com/u/perseusproject", href: "https://gofundme.com/u/perseusproject", icon: FaLink, external: true },
  { label: "Email", value: "wetakecareofus1@proton.me", href: "mailto:wetakecareofus1@proton.me", icon: FaEnvelope },
  { label: "Free whistles", value: "Request up to 3,000 · whistlerequests@proton.me", href: "mailto:whistlerequests@proton.me", icon: FaEnvelope },
  { label: "Know Your Rights cards", value: "Order free Red Cards (up to 250 weekly) at ILRC.org", href: "https://www.ilrc.org", icon: FaBook, external: true, wide: true },
];

export default function Resources() {
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");

  const reveal = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: reduced ? 0 : 0.5, delay, ease: "easeOut" },
  });

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATEGORIES
      .filter((c) => active === "all" || c.id === active)
      .map((c) => ({
        ...c,
        items: q
          ? c.items.filter((i) => [i.label, i.desc, i.tag, c.title].filter(Boolean).join(" ").toLowerCase().includes(q))
          : c.items,
      }))
      .filter((c) => c.items.length);
  }, [query, active]);

  const total = visible.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div className="hrs-page">
      <style>{STYLES}</style>
      <RainbowBar className="hrs-top-rainbow" />

      {/* ================= HERO ================= */}
      <section className="hrs-hero hrs-container" aria-labelledby="hrs-title">
        <motion.div className="hrs-hero-copy" {...reveal()}>
          <p className="hrs-eyebrow">Hartford Pride Center · Resources</p>
          <h1 id="hrs-title">Support,<br /><em>whenever</em> you <span className="hrs-underline">need it.</span></h1>
          <p className="hrs-lede">
            Support, safety, education, advocacy, and mutual aid — curated for community members seeking
            immediate help, legal information, bystander assistance, wellness support, and trusted organizations.
          </p>
          <a className="hrs-jump" href="#hrs-board">Browse the resource board <FaArrowRight aria-hidden="true" /></a>
        </motion.div>

        <motion.aside className="hrs-help" aria-labelledby="hrs-help-title" {...reveal(0.1)}>
          <div className="hrs-help-head">
            <span>Need to talk to someone right now?</span>
            <FaHeart aria-hidden="true" />
          </div>
          <h2 id="hrs-help-title" className="hrs-sr-only">Get help now</h2>
          <ul className="hrs-help-list">
            {URGENT.map((line) => (
              <li key={line.name}>
                <strong>{line.name}</strong>
                <small>{line.note}</small>
                <div className="hrs-help-actions">
                  {line.actions.map(({ label, href, icon: Icon }) => (
                    <a key={label} href={href}><Icon aria-hidden="true" /> {label}</a>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <RainbowBar className="hrs-help-rainbow" />
          <p className="hrs-help-foot">In immediate danger? <a href="tel:911">Call 911</a>.</p>
        </motion.aside>
      </section>

      {/* ================= NOTICEBOARD ================= */}
      <section id="hrs-board" className="hrs-board" aria-labelledby="hrs-board-title">
        <div className="hrs-container">
          <div className="hrs-section-heading">
            <div>
              <p className="hrs-eyebrow">Pinned with Pride</p>
              <h2 id="hrs-board-title">Your resource <em>noticeboard.</em></h2>
            </div>
            <p>Find support. Find your people.<br />There’s help for you here.</p>
          </div>

          <div className="hrs-tools">
            <label className="hrs-search">
              <span className="hrs-sr-only">Search resources</span>
              <FaSearch aria-hidden="true" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resources, places, or topics…" />
            </label>
            <div className="hrs-chips" role="group" aria-label="Filter by category">
              {[{ id: "all", chip: "All", color: "#71378b" }, ...CATEGORIES].map((c) => (
                <button key={c.id} type="button" aria-pressed={active === c.id} onClick={() => setActive(c.id)} style={{ "--chip": c.color }}>
                  {c.chip}
                </button>
              ))}
            </div>
          </div>
          <p className="hrs-count" role="status">
            {total} {total === 1 ? "resource" : "resources"}{query.trim() ? ` matching “${query.trim()}”` : ""}
          </p>

          {visible.length ? (
            <div className="hrs-grid">
              {visible.map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <motion.section
                    key={cat.id}
                    className="hrs-card"
                    style={{ "--card-color": cat.color, "--card-wash": cat.wash }}
                    aria-labelledby={`hrs-${cat.id}`}
                    {...reveal(index * 0.05)}
                  >
                    <header className="hrs-card-head">
                      <span className="hrs-card-icon" aria-hidden="true"><Icon /></span>
                      <div>
                        <h3 id={`hrs-${cat.id}`}>{cat.title}</h3>
                        <p>{cat.blurb}</p>
                      </div>
                    </header>
                    <ul className="hrs-items">
                      {cat.items.map((item) => (
                        <li key={item.label}>
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <span className="hrs-item-copy">
                              <span className="hrs-item-title">
                                <strong>{item.label}</strong>
                                {item.tag && <small>{item.tag}</small>}
                              </span>
                              <span className="hrs-item-desc">{item.desc}</span>
                            </span>
                            <FaArrowRight className="hrs-item-arrow" aria-hidden="true" />
                            <span className="hrs-sr-only"> (opens in a new tab)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.section>
                );
              })}
            </div>
          ) : (
            <div className="hrs-empty">
              <strong>No matches yet</strong>
              <p>Try another word, or show every category.</p>
              <button type="button" onClick={() => { setQuery(""); setActive("all"); }}>Clear search</button>
            </div>
          )}
        </div>
      </section>

      {/* ================= FEATURED: PERSEUS ================= */}
      <section className="hrs-container hrs-featured-wrap" aria-labelledby="hrs-perseus-title">
        <motion.article className="hrs-featured" {...reveal()}>
          <div className="hrs-featured-copy">
            <span className="hrs-featured-icon" aria-hidden="true"><FaShieldAlt /></span>
            <p className="hrs-eyebrow">Featured · Community safety</p>
            <h2 id="hrs-perseus-title">The Perseus <em>Project.</em></h2>
            <p>
              Community-based rapid response, bystander aid, know-your-rights access, whistle distribution, and
              mutual support tools helping people protect one another, stay informed, and mobilize safely in the
              face of threats, violence, and injustice.
            </p>
          </div>
          <ul className="hrs-perseus-links">
            {PERSEUS_LINKS.map(({ label, value, href, icon: Icon, external, highlight, wide }) => (
              <li key={label} className={`${highlight ? "is-highlight" : ""} ${wide ? "is-wide" : ""}`}>
                <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <span className="hrs-perseus-icon" aria-hidden="true"><Icon /></span>
                  <span className="hrs-perseus-text"><small>{label}</small><strong>{value}</strong></span>
                  {external && <span className="hrs-sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </motion.article>
      </section>

      {/* ================= SUGGEST A RESOURCE ================= */}
      <section className="hrs-band">
        <div className="hrs-container">
          <span className="hrs-band-star" aria-hidden="true"><FaGlobeAmericas /></span>
          <p className="hrs-eyebrow">Always growing</p>
          <h2>Know a resource <em>we should add?</em></h2>
          <p>We’re continually expanding this library of support and mutual aid. Tell us about a local organization, hotline, or service that cares for our community.</p>
          <Link to="/contact" className="hrs-button-light">Suggest a resource <FaArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <p className="hrs-disclaimer hrs-container">
        Hartford Pride Center shares these links for information. We aren’t affiliated with every organization listed.
      </p>
      <RainbowBar />
    </div>
  );
}

function RainbowBar({ className = "" }) {
  return <div className={`hrs-rainbow ${className}`} aria-hidden="true">{RAINBOW.map((c) => <span key={c} style={{ backgroundColor: c }} />)}</div>;
}

const STYLES = `
.hrs-page{--ink:#292239;--muted:#5f526b;--purple:#71378b;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:15px;line-height:1.65;color:var(--ink);background:radial-gradient(ellipse at 0 0,#ffdce76b,transparent 35%),radial-gradient(ellipse at 100% 18%,#cbdfff70,transparent 32%),radial-gradient(ellipse at 0 70%,#d5f0df70,transparent 30%),#fffaf5;min-width:0;color-scheme:light;-webkit-font-smoothing:antialiased}
.hrs-page *{box-sizing:border-box}
.hrs-page :is(h1,h2,h3,p,ul){margin:0}
.hrs-page a{color:inherit;text-decoration:none}
.hrs-page button,.hrs-page input{font:inherit}
.hrs-page :is(a,button,input):focus-visible{outline:3px solid #aa72d4;outline-offset:3px}
.hrs-page em{font-family:Georgia,"Times New Roman",serif;font-weight:400}
.hrs-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.hrs-container{width:97%;max-width:1380px;margin-inline:auto;padding-inline:clamp(10px,2vw,32px)}
.hrs-rainbow{display:flex;height:4px;overflow:hidden}.hrs-rainbow>span{flex:1}
.hrs-top-rainbow{height:7px}
.hrs-eyebrow{font-size:10px;font-weight:750;letter-spacing:1.7px;text-transform:uppercase;color:var(--purple);line-height:1.5}

/* Hero */
.hrs-hero{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);align-items:center;gap:clamp(26px,4.5vw,70px);padding-top:calc(var(--hpc-header-offset,64px) + 40px);padding-bottom:48px}
.hrs-hero h1{font-size:clamp(40px,5.6vw,76px);line-height:1.04;letter-spacing:-3px;font-weight:650;margin:18px 0 20px}
.hrs-hero h1 em{color:#a12c73}
.hrs-underline{position:relative;display:inline-block;color:#58317c}
.hrs-underline::after{content:"";position:absolute;left:2px;right:0;bottom:-6px;height:6px;border-radius:6px;background:linear-gradient(90deg,#d84668,#dd8939,#d9b63d,#35976c,#487dc5,#9460b9)}
.hrs-lede{max-width:560px;font-size:14px;line-height:1.9;color:var(--muted)}
.hrs-jump{display:inline-flex;align-items:center;gap:9px;margin-top:22px;min-height:44px;padding:11px 17px;border-radius:11px;background:linear-gradient(115deg,#963268,#653698 70%,#414c98);color:#fff!important;font-size:12px;font-weight:650;box-shadow:0 4px 12px #85408920;transition:transform .2s}
.hrs-jump:hover{transform:translateY(-2px)}
.hrs-jump svg{font-size:11px}

.hrs-help{position:relative;padding:20px;background:linear-gradient(135deg,#ffe1eb,#fff2d5 38%,#e4f5ec 67%,#e7e1ff);border:1px solid #dfbfce;border-radius:14px;box-shadow:0 16px 36px #51335818,3px 4px 0 #f9f0e7,4px 5px 0 #d9c9d6;transform:rotate(.8deg)}
.hrs-help::before,.hrs-featured::before{content:"";position:absolute;z-index:2;pointer-events:none;top:-10px;left:calc(50% - 38px);width:76px;height:23px;border:1px solid #fff9;background:repeating-linear-gradient(90deg,#f1a4beaa 0 12px,#f6d18eaa 12px 24px,#c3e3c8bb 24px 36px,#b4d4eeaa 36px 48px,#d3b5ebaa 48px 60px);transform:rotate(-5deg);box-shadow:0 2px 4px #76547512}
.hrs-help-head{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#603968;margin-bottom:12px}
.hrs-help-head svg{color:#b92e6b;flex-shrink:0}
.hrs-help-list{list-style:none;padding:0;display:grid;gap:9px}
.hrs-help-list li{padding:12px 13px;background:#fffffff0;border:1px solid #ead7e2;border-radius:10px}
.hrs-help-list strong{display:block;font-size:14px;font-weight:700;line-height:1.3;color:#3e2b4c}
.hrs-help-list small{display:block;font-size:11px;color:#7a6681;margin-top:2px}
.hrs-help-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
.hrs-help-actions a{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:6px 12px;border-radius:999px;background:#5a2f72;color:#fff!important;font-size:12px;font-weight:700;transition:background .2s}
.hrs-help-actions a:hover{background:#7d3a8e}
.hrs-help-actions svg{font-size:10px}
.hrs-help-rainbow{width:48%;height:4px;border-radius:10px;margin:14px auto 10px}
.hrs-help-foot{text-align:center;font-size:12px;color:#654360}
.hrs-help-foot a{font-weight:750;text-decoration:underline!important;text-underline-offset:3px;color:#8b1d4f!important}

/* Noticeboard */
.hrs-board{position:relative;background:radial-gradient(#99744e1c .8px,transparent .8px) 0 0/5px 5px,linear-gradient(120deg,#efdfce,#f6e9d9 45%,#eadedb);border-block:7px solid #dac1ac;box-shadow:inset 0 2px 6px #77533418,inset 0 -2px 6px #77533418;padding-block:38px;scroll-margin-top:calc(var(--hpc-header-offset,64px) + 12px)}
.hrs-section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding-bottom:16px;border-bottom:1px dashed #b8a08f}
.hrs-section-heading h2,.hrs-featured h2,.hrs-band h2{font-size:clamp(29px,3.3vw,43px);line-height:1.15;letter-spacing:-1.4px;font-weight:550;margin-top:9px}
.hrs-section-heading h2 em,.hrs-featured h2 em{color:#8c387c}
.hrs-section-heading>p{font-size:11px;color:var(--muted);text-align:right;line-height:1.9;max-width:240px}

.hrs-tools{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:20px}
.hrs-search{position:relative;flex:1 1 280px;max-width:440px}
.hrs-search svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:13px;color:#8a6a96;pointer-events:none}
.hrs-search input{width:100%;min-height:44px;padding:10px 14px 10px 38px;border:1px solid #cfb9c6;border-radius:999px;background:#fffdfb;color:var(--ink);font-size:16px;box-shadow:0 2px 0 #e9d9cc}
.hrs-search input::placeholder{color:#8f7f8e}
.hrs-chips{display:flex;flex-wrap:wrap;gap:7px}
.hrs-chips button{min-height:38px;padding:6px 14px;border:1px solid color-mix(in srgb,var(--chip) 35%,white);border-radius:999px;background:#fffdfb;color:var(--chip);font-size:12px;font-weight:750;cursor:pointer;box-shadow:0 2px 0 #e9d9cc;transition:background .2s,color .2s}
.hrs-chips button:hover{background:#fff}
.hrs-chips button[aria-pressed=true]{background:var(--chip);border-color:var(--chip);color:#fff}
.hrs-count{margin-top:10px!important;font-size:11px;font-weight:650;color:#7a6669}

.hrs-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:26px 22px;padding-top:24px}
.hrs-card{position:relative;min-width:0;background:var(--card-wash);border:1px solid color-mix(in srgb,var(--card-color) 27%,white);border-top:5px solid var(--card-color);border-radius:4px 4px 15px 4px;box-shadow:2px 5px 0 #6e503814,0 9px 18px #63423510;transform:rotate(-.6deg);transition:transform .25s,box-shadow .25s}
.hrs-card:nth-child(even){transform:rotate(.6deg)}
.hrs-card:hover,.hrs-card:focus-within{transform:rotate(0) translateY(-3px);box-shadow:0 12px 22px #63423522}
.hrs-card::before{content:"";position:absolute;top:-12px;left:calc(50% - 6px);width:12px;height:12px;border-radius:50%;background:radial-gradient(circle at 32% 25%,#fff 0 12%,var(--card-color) 40%);border:1px solid #fff8;box-shadow:1px 3px 3px #40233340}
.hrs-card-head{display:flex;align-items:center;gap:12px;padding:20px 18px 12px}
.hrs-card-icon{display:grid;place-items:center;flex-shrink:0;width:38px;height:38px;border-radius:10px;background:#fffc;border:1px solid color-mix(in srgb,var(--card-color) 20%,transparent);color:var(--card-color);font-size:15px}
.hrs-card-head h3{font-size:17px;font-weight:700;letter-spacing:-.3px;line-height:1.25;color:var(--card-color)}
.hrs-card-head p{font-size:11px;color:color-mix(in srgb,var(--card-color) 70%,#444)}
.hrs-items{list-style:none;padding:0 10px 10px}
.hrs-items li+li{border-top:1px dashed color-mix(in srgb,var(--card-color) 22%,transparent)}
.hrs-items a{display:flex;align-items:flex-start;gap:12px;padding:12px 8px;border-radius:8px;transition:background .2s}
.hrs-items a:hover{background:#ffffffb3}
.hrs-item-copy{flex:1;min-width:0}
.hrs-item-title{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px}
.hrs-item-title strong{font-size:14px;font-weight:700;color:#33283c}
.hrs-item-title small{padding:1px 8px;border-radius:999px;background:#fffc;border:1px solid color-mix(in srgb,var(--card-color) 25%,white);color:var(--card-color);font-size:10px;font-weight:750}
.hrs-item-desc{display:block;margin-top:2px;font-size:12px;line-height:1.6;color:#5f5560}
.hrs-item-arrow{margin-top:5px;flex-shrink:0;font-size:11px;color:var(--card-color);opacity:.6;transition:transform .2s,opacity .2s}
.hrs-items a:hover .hrs-item-arrow{opacity:1;transform:translateX(3px)}

.hrs-empty{margin-top:22px;padding:28px 16px;text-align:center;background:#fffdfb;border:1px dashed #c4a990;border-radius:10px}
.hrs-empty strong{font-family:Georgia,serif;font-size:20px;font-weight:400;color:#5c3a69}
.hrs-empty p{font-size:12px;color:var(--muted);margin-top:4px!important}
.hrs-empty button{margin-top:14px;min-height:40px;padding:8px 16px;border:0;border-radius:999px;background:#5a2f72;color:#fff;font-size:12px;font-weight:700;cursor:pointer}

/* Featured */
.hrs-featured-wrap{padding-top:52px;padding-bottom:52px}
.hrs-featured{position:relative;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(20px,4vw,48px);align-items:start;padding:clamp(22px,3vw,34px);background:linear-gradient(140deg,#f5e3ff,#e6efff);border:1px solid #ccb0e4;border-radius:6px 6px 20px 6px;box-shadow:0 9px 22px #61416912}
.hrs-featured-icon{display:grid;place-items:center;width:42px;height:42px;margin-bottom:18px;border:1px solid #d6c2df;border-radius:12px;background:#fdf6ff;color:#734398;font-size:17px}
.hrs-featured-copy>p:last-child{margin-top:14px!important;font-size:13px;line-height:1.9;color:var(--muted)}
.hrs-perseus-links{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.hrs-perseus-links li.is-wide{grid-column:1/-1}
.hrs-perseus-links a{display:flex;align-items:center;gap:11px;height:100%;min-height:58px;padding:11px 13px;background:#fffffff0;border:1px solid #dccbe9;border-radius:10px;transition:border-color .2s,transform .2s}
.hrs-perseus-links a:hover{border-color:#9b72b8;transform:translateY(-2px)}
.hrs-perseus-icon{display:grid;place-items:center;flex-shrink:0;width:34px;height:34px;border-radius:9px;background:#efe3f8;color:#6a3d8a;font-size:14px}
.hrs-perseus-text{min-width:0}
.hrs-perseus-text small{display:block;font-size:9px;font-weight:750;letter-spacing:1px;text-transform:uppercase;color:#80628f}
.hrs-perseus-text strong{display:block;font-size:13px;font-weight:650;line-height:1.35;color:#3e2b4c;overflow-wrap:anywhere}
.hrs-perseus-links li.is-highlight a{background:#5a2f72;border-color:#5a2f72}
.hrs-perseus-links li.is-highlight .hrs-perseus-icon{background:#ffffff22;color:#ffd98d}
.hrs-perseus-links li.is-highlight small{color:#e9cff5}
.hrs-perseus-links li.is-highlight strong{color:#fff;font-size:16px}

/* Closing band */
.hrs-band{position:relative;padding:46px 0;text-align:center;background:radial-gradient(ellipse at 0 100%,#98406866,transparent 55%),radial-gradient(ellipse at 100% 0,#2b777766,transparent 55%),#2b1d3b;color:#f9eff9;border-block:4px solid transparent;border-image:linear-gradient(90deg,#d35b7d,#d4a356,#65a888,#598cb7,#9864b0) 1}
.hrs-band-star{display:inline-grid;place-items:center;width:44px;height:44px;margin-bottom:10px;border-radius:50%;background:#ffffff12;border:1px solid #ffffff30;color:#ffd98d;font-size:19px}
.hrs-band .hrs-eyebrow{color:#d0b2dc;font-size:9px}
.hrs-band h2{font-weight:450;margin-top:10px}
.hrs-band h2 em{color:#f1d5e8}
.hrs-band .hrs-container>p:not(.hrs-eyebrow){max-width:620px;margin:14px auto 22px!important;font-size:13px;line-height:1.9;color:#d6c1df}
.hrs-button-light{display:inline-flex;align-items:center;gap:10px;min-height:46px;padding:12px 18px;border-radius:11px;background:#f3e8f6;color:#432e51!important;font-size:12px;font-weight:700;transition:transform .2s}
.hrs-button-light:hover{transform:translateY(-2px)}
.hrs-button-light svg{font-size:11px}

.hrs-disclaimer{padding-block:18px;text-align:center;font-size:11px;color:#86788c}

@media(max-width:1050px){.hrs-hero h1{letter-spacing:-2.4px}.hrs-featured{grid-template-columns:1fr}}
@media(max-width:760px){
  .hrs-container{padding-inline:12px}
  .hrs-hero{grid-template-columns:1fr;gap:30px;padding-top:calc(var(--hpc-header-offset,64px) + 24px);padding-bottom:34px}
  .hrs-hero h1{font-size:clamp(40px,10vw,60px);letter-spacing:-2px;margin:14px 0 16px}
  .hrs-lede{font-size:13px}
  .hrs-help{transform:none}
  .hrs-board{padding-block:30px}
  .hrs-section-heading{display:block}
  .hrs-section-heading>p{text-align:left;max-width:none;margin-top:8px!important}
  .hrs-section-heading>p br{display:none}
  .hrs-grid{grid-template-columns:1fr;gap:24px}
  .hrs-card,.hrs-card:nth-child(even){transform:none}
  .hrs-featured-wrap{padding-top:36px;padding-bottom:36px}
  .hrs-band{padding:36px 0}
}
@media(max-width:520px){
  .hrs-container{padding-inline:8px}
  .hrs-eyebrow{font-size:8px;letter-spacing:1.2px}
  .hrs-help{padding:16px 14px}
  .hrs-perseus-links{grid-template-columns:1fr}
  .hrs-chips{gap:6px}
  .hrs-chips button{padding:6px 11px}
}
@media(prefers-reduced-motion:reduce){.hrs-page *{transition:none!important}.hrs-card,.hrs-card:nth-child(even),.hrs-help{transform:none}}
@media(forced-colors:active){.hrs-card,.hrs-help,.hrs-featured{border:1px solid CanvasText}.hrs-underline::after{background:CanvasText}}
`;