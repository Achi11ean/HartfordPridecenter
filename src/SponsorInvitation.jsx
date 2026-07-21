import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  X,
  ArrowUpRight,
  ArrowRight,
  Clock,
  Share2,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   HARTFORD PRIDE CENTER — SUPPORT / SPONSOR PAGE
   "Community Poster" redesign to match HomePage:
   cream paper, flat pride-flag color blocks, ink outlines,
   hard offset shadows, huge Archivo type, rainbow marquee.
   All donation logic (Stripe links, once/monthly, amount
   sheet, share, link validation) is unchanged.
   ───────────────────────────────────────────────────────────── */

const FLAG = ["#E40303", "#FF8C00", "#FFED00", "#008026", "#004DFF", "#750787"];
const INK = "#181310";

/* ------------------------------------------------------------------ */
/*  DATA — Stripe links untouched.                                     */
/*  `hue` is now the poster flag color for each card (assigned by      */
/*  order below). `pastelHue` keeps the old soft color if you want it. */
/* ------------------------------------------------------------------ */
const SHARED_ONE_TIME_LINK = "https://buy.stripe.com/8x24gs2cj5Mm1Sy0Gccwg0e";

const MONTHLY_AMOUNTS = [10, 20, 50];

const FUNDS = [
  {
    id: "medication",
    name: "Medication Assistance",
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
    name: "Community Programming",
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
    name: "General Support",
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
    name: "Food Pantry",
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
    name: "TransCare Support System",
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
    name: "Housing & Safety Resources",
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
].map((f, i) => ({ ...f, hue: FLAG[i % FLAG.length] }));

const CONTACT_URL = "/contact";
const SHARE_URL = "https://share.karaoverse.com/og/pride/support";

/* ------------------------------------------------------------------ */
/*  Link safety — config typos are the one bug class that costs real   */
/*  donations, so every URL is validated at render instead of trusted. */
/* ------------------------------------------------------------------ */
const safeLink = (value) => {
  if (typeof value !== "string") return null;
  const url = value.trim();
  return /^https:\/\/\S+$/i.test(url) ? url : null;
};

/* Pick ink or white text for a given flag color so labels stay legible
   on yellow/orange as well as the darker hues. */
const readableText = (hex) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const L = 0.299 * r + 0.587 * g + 0.114 * b;
  return L > 150 ? INK : "#ffffff";
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181310]";

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
export default function SponsorInvitation() {
  const [mode, setMode] = useState("once");
  const [activeFund, setActiveFund] = useState(null);
  const [copied, setCopied] = useState(false);
  const closeRef = useRef(null);

  const closeSheet = () => setActiveFund(null);

  useEffect(() => {
    if (!activeFund) return;
    const onKey = (e) => e.key === "Escape" && closeSheet();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [activeFund]);

  const handleShare = async () => {
    const payload = {
      title: "Support Hartford Pride Center",
      text: "Six funds, one community. Pick where your gift goes.",
      url: SHARE_URL,
    };
    if (navigator.share) {
      try {
        await navigator.share(payload);
      } catch {
        /* dismissed */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(SHARE_URL, "_blank", "noopener");
    }
  };

  const monthlyLinks = useMemo(() => {
    if (!activeFund) return [];
    return MONTHLY_AMOUNTS.map((amount) => ({
      amount,
      link: safeLink(activeFund.monthly?.[amount]),
    }));
  }, [activeFund]);

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-[#181310] overflow-x-hidden hpc-body">
      {/* local styles: display font + marquee animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..900&display=swap');
        .hpc-display { font-family: 'Archivo', system-ui, sans-serif; font-stretch: 87%; }
        .hpc-body { font-family: 'Archivo', system-ui, sans-serif; }
        @keyframes hpc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .hpc-marquee-track { animation: hpc-marquee 26s linear infinite; }
        @keyframes cd-rise {
          from { opacity: 0; transform: translateY(18px) }
          to { opacity: 1; transform: translateY(0) }
        }
        .cd-rise { animation: cd-rise .26s cubic-bezier(.22,1,.36,1) }
        @media (prefers-reduced-motion: reduce) {
          .hpc-marquee-track { animation: none; }
          .cd-rise { animation: none; }
        }
      `}</style>

      {/* ── FLAG STRIPE TOPBAR ── */}
      <div className="flex h-2.5 mt-10 w-full" aria-hidden="true">
        {FLAG.map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 sm:pb-14">
        <div className="grid lg:grid-cols-[1.15fr,0.85fr] gap-10 lg:gap-14 items-center">
          {/* headline side */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p className="inline-block rounded-full bg-[#181310] text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-2">
              Support · Hartford Pride Center
            </p>

            <h1 className="hpc-display mt-6 font-black uppercase leading-[0.92] tracking-tight text-[clamp(2.4rem,8vw,5rem)]">
              Give where
              <br />
              it
              <span
                className="mx-2 inline-block -rotate-1 rounded-lg px-3"
                style={{ backgroundColor: "#FFED00" }}
              >
                matters
              </span>
              <br />
              <span
                className="inline-block rotate-1 rounded-lg px-3 text-white"
                style={{ backgroundColor: "#750787" }}
              >
                most.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#4a4038] font-medium">
              Six funds, one community. Pick exactly where your gift goes —
              medication, food, housing, trans care, programming, or wherever
              the need is greatest.
            </p>

            {/* quick CTAs */}
            <div className="mt-8 flex flex-col flex-wrap gap-3 sm:flex-row">
              <a
                href="#funds"
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl border-2 border-[#181310]
                  bg-blue-500 px-6 py-4
                  text-sm font-black uppercase tracking-wide text-white
                  shadow-[4px_4px_0_#181310]
                  transition-all
                  hover:translate-x-[2px] hover:translate-y-[2px]
                  hover:bg-blue-600
                  hover:shadow-[2px_2px_0_#181310]
                "
              >
                Choose a fund <ArrowRight size={16} />
              </a>

              <button
                type="button"
                onClick={handleShare}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl border-2 border-[#181310]
                  bg-white px-6 py-4
                  text-sm font-black uppercase tracking-wide
                  shadow-[4px_4px_0_#181310]
                  transition-all
                  hover:translate-x-[2px] hover:translate-y-[2px]
                  hover:shadow-[2px_2px_0_#181310]
                "
              >
                <Share2 size={15} /> {copied ? "Link copied" : "Share"}
              </button>
            </div>
          </motion.div>

          {/* poster / badge side */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-sm lg:max-w-none"
          >
            <div className="relative rotate-2 rounded-2xl border-2 border-[#181310] bg-white p-6 sm:p-8 shadow-[8px_8px_0_#181310]">
              <p className="hpc-display text-6xl sm:text-7xl font-black leading-none tracking-tight">
                100%
              </p>
              <p className="mt-3 text-sm sm:text-base font-bold uppercase tracking-wide text-[#4a4038]">
                of every dollar stays in the community
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {FUNDS.map((f) => (
                  <div
                    key={f.id}
                    className="flex h-12 items-center justify-center rounded-lg border-2 border-[#181310] text-xl"
                    style={{ backgroundColor: f.hue }}
                    aria-hidden="true"
                  >
                    <span>{f.emoji}</span>
                  </div>
                ))}
              </div>
              <div
                className="mt-5 flex h-2 w-full overflow-hidden rounded-full"
                aria-hidden="true"
              >
                {FLAG.map((c) => (
                  <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* sticker badges */}
            <div
              className="absolute -top-4 -left-3 -rotate-6 rounded-full border-2 border-[#181310] px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0_#181310]"
              style={{ backgroundColor: "#FFED00" }}
            >
              6 Funds
            </div>
            <div
              className="absolute -bottom-4 -right-2 rotate-3 rounded-full border-2 border-[#181310] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_#181310]"
              style={{ backgroundColor: "#008026" }}
            >
              501(c)(3)
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RAINBOW MARQUEE (signature) ── */}
      <div className="overflow-hidden border-y-2 border-[#181310] bg-[#181310] py-3 sm:py-4">
        <div className="hpc-marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
              {["Give", "Sustain", "Uplift", "Protect", "Nourish", "Together"].map(
                (word, i) => (
                  <span key={word} className="flex items-center gap-8">
                    <span
                      className="hpc-display text-2xl sm:text-3xl font-black uppercase tracking-tight"
                      style={{ color: FLAG[i % FLAG.length] }}
                    >
                      {word}
                    </span>
                    <span className="text-white/60 text-xl">✦</span>
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── FUNDS ── */}
      <section id="funds" className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <motion.div {...fadeUp}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#750787]">
            Where your gift goes
          </p>
          <h2 className="hpc-display mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Pick your fund
          </h2>
        </motion.div>

        {/* ---------- Mode toggle ---------- */}
        <div className="mt-6 sm:mt-8">
          <div
            className="grid w-full max-w-[19rem] grid-cols-2 gap-1 rounded-full border-2 border-[#181310] bg-white p-1 shadow-[3px_3px_0_#181310]"
            role="tablist"
            aria-label="Giving frequency"
          >
            {[
              { id: "once", label: "Give once" },
              { id: "monthly", label: "Give monthly" },
            ].map((opt) => {
              const on = mode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setMode(opt.id)}
                  className={`cursor-pointer rounded-full px-3 py-2.5 text-[0.8rem] font-black uppercase tracking-wide transition-colors ${FOCUS}`}
                  style={{
                    background: on ? INK : "transparent",
                    color: on ? "#ffffff" : "#4a4038",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- Fund cards ---------- */}
        <ul className="mt-8 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {FUNDS.map((fund, i) => {
            const oneTime = safeLink(fund.oneTime) || SHARED_ONE_TIME_LINK;
            const hasMonthly = MONTHLY_AMOUNTS.some((a) =>
              safeLink(fund.monthly?.[a])
            );
            const txt = readableText(fund.hue);

            return (
              <motion.li
                key={fund.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
                className="flex"
              >
                <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 border-[#181310] bg-white shadow-[6px_6px_0_#181310] transition-transform hover:-translate-y-1">
                  {/* flag-color top bar */}
                  <div
                    className="h-3"
                    style={{ backgroundColor: fund.hue }}
                    aria-hidden="true"
                  />
                  <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#181310] text-xl"
                        style={{ backgroundColor: fund.hue }}
                        aria-hidden="true"
                      >
                        {fund.emoji}
                      </span>
                      <h3 className="hpc-display text-lg font-black uppercase leading-tight tracking-tight">
                        {fund.name}
                      </h3>
                    </div>

                    <p className="flex-1 text-sm font-semibold leading-relaxed text-[#4a4038]">
                      {fund.blurb}
                    </p>

                    {mode === "once" ? (
                      <a
                        href={oneTime}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-[#181310] px-4 text-sm font-black uppercase tracking-wide no-underline shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310] ${FOCUS}`}
                        style={{ backgroundColor: fund.hue, color: txt }}
                      >
                        Give once
                        <ArrowUpRight size={16} strokeWidth={2.75} />
                      </a>
                    ) : hasMonthly ? (
                      <button
                        type="button"
                        onClick={() => setActiveFund(fund)}
                        className={`inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-[#181310] px-4 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310] ${FOCUS}`}
                        style={{ backgroundColor: fund.hue, color: txt }}
                      >
                        Choose an amount
                      </button>
                    ) : (
                      <a
                        href={CONTACT_URL}
                        className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-[#181310] bg-white px-4 text-sm font-black uppercase tracking-wide text-[#181310] no-underline shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310] ${FOCUS}`}
                      >
                        <Clock size={15} aria-hidden="true" />
                        Ask us to set it up
                      </a>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </section>

      {/* ── REASSURANCE BLOCK ── */}
      <section className="border-y-2 border-[#181310]" style={{ backgroundColor: "#FFED00" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <motion.div {...fadeUp}>
            <h2 className="hpc-display mx-auto max-w-3xl text-2xl sm:text-4xl font-black uppercase leading-tight tracking-tight">
              Every dollar stays in the community.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg font-semibold leading-relaxed text-[#4a3d00]">
              Hartford Pride Center is a 501(c)(3) nonprofit. You can cancel a
              monthly gift anytime, and your support goes directly to the people
              who need it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#funds"
                className="rounded-full border-2 border-[#181310] bg-white px-5 py-2.5 text-sm font-black uppercase tracking-wide hover:bg-[#181310] hover:text-white transition-colors"
              >
                Give now
              </a>
              <a
                href={CONTACT_URL}
                className="rounded-full border-2 border-[#181310] bg-white px-5 py-2.5 text-sm font-black uppercase tracking-wide hover:bg-[#181310] hover:text-white transition-colors"
              >
                Contact us
              </a>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#181310] bg-white px-5 py-2.5 text-sm font-black uppercase tracking-wide hover:bg-[#181310] hover:text-white transition-colors"
              >
                <Share2 size={14} />
                {copied ? "Copied" : "Share this page"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER STRIPE ── */}
      <div className="bg-[#181310] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-2 text-center">
          <Heart size={16} className="text-white/70" aria-hidden="true" />
          <p className="text-xs font-semibold text-white/60">
            Thank you for supporting Hartford Pride Center.
          </p>
        </div>
      </div>
      <div className="flex h-2.5 w-full" aria-hidden="true">
        {FLAG.map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* ---------- Monthly amount sheet ---------- */}
      {activeFund && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-5"
          style={{ background: "rgba(24, 19, 16, .55)" }}
          onClick={closeSheet}
          role="presentation"
        >
          <div
            className="cd-rise relative max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-t-3xl border-2 border-[#181310] bg-white px-5 pt-7 shadow-[0_-8px_0_#181310] sm:rounded-3xl sm:px-6 sm:pb-6 sm:shadow-[8px_8px_0_#181310]"
            style={{
              borderTopWidth: 8,
              borderTopColor: activeFund.hue,
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cd-sheet-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={closeSheet}
              aria-label="Close"
              className={`absolute right-3 top-3 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-[#181310] bg-white text-[#181310] transition-colors hover:bg-[#181310] hover:text-white ${FOCUS}`}
            >
              <X size={18} />
            </button>

            <div className="mb-5 flex items-center gap-3 pr-12">
              <span
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#181310] text-xl"
                style={{ backgroundColor: activeFund.hue }}
                aria-hidden="true"
              >
                {activeFund.emoji}
              </span>
              <div>
                <h3
                  id="cd-sheet-title"
                  className="hpc-display text-base font-black uppercase leading-tight tracking-tight"
                >
                  {activeFund.name}
                </h3>
                <p className="mt-0.5 text-[0.72rem] font-bold uppercase tracking-wider text-[#6b5f57]">
                  Monthly gift
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {monthlyLinks.map(({ amount, link }) =>
                link ? (
                  <a
                    key={amount}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex min-h-[80px] flex-col items-center justify-center gap-0.5 rounded-2xl border-2 border-[#181310] bg-white no-underline shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310] ${FOCUS}`}
                  >
                    <span className="hpc-display text-2xl font-black text-[#181310]">
                      ${amount}
                    </span>
                    <span className="text-[0.66rem] font-bold uppercase tracking-wider text-[#6b5f57]">
                      / month
                    </span>
                  </a>
                ) : (
                  <span
                    key={amount}
                    aria-disabled="true"
                    className="flex min-h-[80px] cursor-not-allowed flex-col items-center justify-center gap-0.5 rounded-2xl border-2 border-dashed border-[#181310]/40 opacity-50"
                  >
                    <span className="hpc-display text-2xl font-black text-[#181310]">
                      ${amount}
                    </span>
                    <span className="text-[0.66rem] font-bold uppercase tracking-wider text-[#6b5f57]">
                      soon
                    </span>
                  </span>
                )
              )}
            </div>

            <p className="mt-5 text-center text-[0.75rem] font-semibold leading-relaxed text-[#6b5f57]">
              Want a different amount?{" "}
              <a
                href={CONTACT_URL}
                className="font-black underline underline-offset-2 text-[#181310]"
              >
                Contact us
              </a>{" "}
              and we'll set it up.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}