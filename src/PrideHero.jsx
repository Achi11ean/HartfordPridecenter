import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  SURFACE,
  SURFACE_SOLID,
  LINE,
  TEXT,
  MUTED,
  FONT_BODY,
  FONT_DISPLAY,
  SPECTRUM,
} from "./PrideTheme";

/* ------------------------------------------------------------------
   Deliberately NO background color on this section.

   SponsorInvitation paints the ink and runs the heart-comet canvas
   behind the whole page. If the hero painted its own background it
   would sit on top of that canvas and the hearts would stop dead at
   the fold. Transparent means they fall through the hero and carry
   straight down into the funds.
   ------------------------------------------------------------------ */

/* Quiet aurora built from the spectrum — same hues, low opacity, so it
   whispers under the comets instead of competing with them. */
const AURORA = `
  radial-gradient(60% 50% at 15% 0%,   ${SPECTRUM[0]}12, transparent),
  radial-gradient(50% 45% at 85% 10%,  ${SPECTRUM[4]}14, transparent),
  radial-gradient(55% 50% at 70% 90%,  ${SPECTRUM[5]}12, transparent),
  radial-gradient(45% 40% at 25% 95%,  ${SPECTRUM[3]}0e, transparent)
`;

const IDENTITY_CHIPS = [
  { label: "Trans Inclusive", hue: SPECTRUM[0] },
  { label: "Community Programs", hue: SPECTRUM[1] },
  { label: "Advocacy", hue: SPECTRUM[2] },
  { label: "Wellness", hue: SPECTRUM[3] },
  { label: "Events", hue: SPECTRUM[4] },
  { label: "Everyone Welcome", hue: SPECTRUM[5] },
];

export default function PrideHero() {
  const reduceMotion = useReducedMotion();

  const fadeUp = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: "easeOut" },
      };

  const scaleIn = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.97 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: 0.12, duration: 0.55, ease: "easeOut" },
      };

  return (
    <section
      className="relative overflow-hidden border-b"
      style={{ borderColor: LINE, color: TEXT, fontFamily: FONT_BODY }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: AURORA }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-20">
        <motion.div
          {...fadeUp}
          className="grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-12"
        >
          {/* ---------- Message ---------- */}
          <div className="text-center lg:text-left">
            <p
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[11px]"
              style={{ borderColor: LINE, background: SURFACE, color: MUTED }}
            >
              <span aria-hidden="true">🏳️‍🌈</span> Hartford Pride Center
            </p>

            <h1
              className="text-[2.25rem] font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.5rem]"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Building community,
              <br />
              together.
            </h1>

            {/* Spectrum rule — the page's recurring motif */}
            <div
              className="mx-auto mt-4 flex h-1 w-28 overflow-hidden rounded-full lg:mx-0"
              aria-hidden="true"
            >
              {SPECTRUM.map((hue) => (
                <span key={hue} className="flex-1" style={{ background: hue }} />
              ))}
            </div>

            <p
              className="mx-auto mt-4 max-w-lg text-[0.9rem] leading-relaxed sm:text-base lg:mx-0"
              style={{ color: MUTED }}
            >
              A welcoming place where LGBTQIA+ people, families, and allies
              connect, find support, and build a future where everyone belongs
              exactly as they are.
            </p>

            <ul className="mt-5 flex list-none flex-wrap justify-center gap-1.5 p-0 lg:justify-start">
              {IDENTITY_CHIPS.map((chip) => (
                <li
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold sm:text-xs"
                  style={{ borderColor: LINE, background: SURFACE, color: MUTED }}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: chip.hue }}
                    aria-hidden="true"
                  />
                  {chip.label}
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Logo ---------- */}
          <motion.div
            {...scaleIn}
            className="mx-auto w-full max-w-[15rem] sm:max-w-xs lg:max-w-none"
          >
            <div
              className="overflow-hidden rounded-2xl border"
              style={{
                borderColor: LINE,
                background: SURFACE_SOLID,
                boxShadow: "0 24px 60px -24px rgba(0,0,0,0.65)",
              }}
            >
              <div
                className="h-1"
                style={{ background: `linear-gradient(90deg, ${SPECTRUM.join(", ")})` }}
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
      </div>
    </section>
  );
}