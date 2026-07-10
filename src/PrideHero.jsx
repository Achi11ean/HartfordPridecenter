import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ================================================================== */
/*  THEME — identical tokens to SponsorInvitation so the hero,        */
/*  donations section, and footer read as one page.                   */
/* ================================================================== */

const INK = "#0d0a1a";
const SURFACE = "#171226";
const LINE = "rgba(255, 255, 255, 0.09)";
const TEXT = "#f5f2fa";
const MUTED = "rgba(238, 233, 248, 0.64)";

const FONT_BODY = "'Inter', system-ui, -apple-system, sans-serif";
const FONT_DISPLAY = "'Bricolage Grotesque', 'Inter', sans-serif";

/* Same pride spectrum as the fund cards / footer accents */
const SPECTRUM = ["#FF6B6B", "#FFA94D", "#FFD43B", "#69DB7C", "#74C0FC", "#B197FC"];

/* Quiet aurora built from the spectrum — same hues, low opacity,
   so it whispers instead of competing with the content. */
const AURORA = `
  radial-gradient(60% 50% at 15% 0%,   ${SPECTRUM[0]}14, transparent),
  radial-gradient(50% 45% at 85% 10%,  ${SPECTRUM[4]}16, transparent),
  radial-gradient(55% 50% at 70% 90%,  ${SPECTRUM[5]}14, transparent),
  radial-gradient(45% 40% at 25% 95%,  ${SPECTRUM[3]}10, transparent)
`;

const PILLARS = [
  {
    emoji: "🌈",
    hue: SPECTRUM[0],
    title: "Celebrate Pride",
    blurb: "Events, festivals, and gatherings that bring us together.",
  },
  {
    emoji: "❤️",
    hue: SPECTRUM[2],
    title: "Find Support",
    blurb: "Resources, programs, advocacy, and community connection.",
  },
  {
    emoji: "✨",
    hue: SPECTRUM[4],
    title: "Be Yourself",
    blurb: "Every identity celebrated. Every voice belongs.",
  },
];

const IDENTITY_CHIPS = [
  { label: "Trans Inclusive", hue: SPECTRUM[0] },
  { label: "Community Programs", hue: SPECTRUM[1] },
  { label: "Advocacy", hue: SPECTRUM[2] },
  { label: "Wellness", hue: SPECTRUM[3] },
  { label: "Events", hue: SPECTRUM[4] },
  { label: "Everyone Welcome", hue: SPECTRUM[5] },
];

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function PrideHero() {
  const reduceMotion = useReducedMotion();

  const fadeUp = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
      };

  return (
    <section
      className="relative overflow-hidden border-b"
      style={{
        background: INK,
        borderColor: LINE,
        color: TEXT,
        fontFamily: FONT_BODY,
      }}
    >
      {/* Quiet spectrum aurora */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: AURORA }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-28">
        <motion.div
          {...fadeUp}
          className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-14"
        >
          {/* ---------- LEFT: message ---------- */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <p
              className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] sm:mb-6"
              style={{
                borderColor: LINE,
                background: "rgba(255,255,255,0.04)",
                color: MUTED,
              }}
            >
              <span aria-hidden="true">🏳️‍🌈</span> Hartford Pride Center
            </p>

            <h1
              className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Building community,
              <br />
              together.
            </h1>

            {/* Spectrum rule — the same segmented bar used in the
                donations header, so the whole page shares one motif */}
            <div
              className="mx-auto mt-5 flex h-1 w-32 overflow-hidden rounded-full lg:mx-0"
              aria-hidden="true"
            >
              {SPECTRUM.map((hue) => (
                <span key={hue} className="flex-1" style={{ background: hue }} />
              ))}
            </div>

            <p
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg lg:mx-0"
              style={{ color: MUTED }}
            >
              A welcoming place where LGBTQIA+ people, families, and allies
              connect, find support, and build a future where everyone belongs
              exactly as they are.
            </p>

            {/* Identity chips — compact, quiet, hue-dotted like the
                footer column accents */}
            <ul className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
              {IDENTITY_CHIPS.map((chip) => (
                <li
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
                  style={{ borderColor: LINE, background: SURFACE, color: MUTED }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: chip.hue }}
                    aria-hidden="true"
                  />
                  {chip.label}
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- RIGHT: logo ---------- */}
          <motion.div
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.96 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { delay: 0.15, duration: 0.6, ease: "easeOut" },
                })}
            className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none"
          >
            <div
              className="overflow-hidden rounded-2xl border"
              style={{
                borderColor: LINE,
                background: SURFACE,
                boxShadow: "0 24px 60px -24px rgba(0,0,0,0.6)",
              }}
            >
              <div
                className="h-1"
                style={{
                  background: `linear-gradient(90deg, ${SPECTRUM.join(", ")})`,
                }}
                aria-hidden="true"
              />
              <img
                src="/PrideLogo3.jpg"
                alt="Hartford Pride Center"
                className="w-full object-cover"
                loading="eager"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* ---------- Pillars — one compact strip instead of three
             heavy cards. Hairline-divided on desktop, stacked with
             comfortable spacing on mobile. ---------- */}
       
      </div>
    </section>
  );
}