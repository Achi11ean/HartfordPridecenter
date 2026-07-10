import React, { useEffect, useRef, useState } from "react";
import { Heart, X, ArrowUpRight, Clock } from "lucide-react";

/* ================================================================== */
/*  STRIPE LINK CONFIGURATION — the only section you need to edit     */
/*                                                                    */
/*  Each Stripe payment link is fixed-price, so every fund + amount   */
/*  combination needs its own link. Paste a real Stripe URL to turn   */
/*  a button on; leave a value as `null` and the button renders as    */
/*  a graceful "coming soon" state (no broken links, no alerts).      */
/*                                                                    */
/*  If a fund has no dedicated one-time link yet, it automatically    */
/*  falls back to the shared one-time link below.                     */
/* ================================================================== */

const SHARED_ONE_TIME_LINK =
  "https://buy.stripe.com/7sY8wQedb5iTgfMepGcIE06";

const MONTHLY_AMOUNTS = [10, 20, 50];

const FUNDS = [
  {
    id: "medication",
    name: "Medication Assistance",
    emoji: "💊",
    hue: "#FF6B6B",
    blurb:
      "Help community members afford life-sustaining medications and prescription costs.",
    oneTime: null, // falls back to SHARED_ONE_TIME_LINK
    monthly: {
      10: "https://buy.stripe.com/dRm8wQfhf4eP6Fc6XecIE09",
      20: null,
      50: null,
    },
  },
  {
    id: "programming",
    name: "Community Programming",
    emoji: "🤝",
    hue: "#FFA94D",
    blurb:
      "Fund workshops, support groups, education, and events that bring our community together.",
    oneTime: null,
    monthly: { 10: null, 20: null, 50: null },
  },
  {
    id: "general",
    name: "General Support",
    emoji: "🏳️‍🌈",
    hue: "#FFD43B",
    blurb:
      "Keep the lights on and the doors open — your gift goes wherever the need is greatest.",
    oneTime: SHARED_ONE_TIME_LINK,
    monthly: { 10: null, 20: null, 50: null },
  },
  {
    id: "pantry",
    name: "Food Pantry",
    emoji: "🥫",
    hue: "#69DB7C",
    blurb:
      "Stock our pantry so no one has to choose between food and other essentials.",
    oneTime: null,
    monthly: { 10: null, 20: null, 50: null },
  },
  {
    id: "transcare",
    name: "TransCare Support System",
    emoji: "🏳️‍⚧️",
    hue: "#74C0FC",
    blurb:
      "Support gender-affirming care resources, navigation help, and community for trans folks.",
    oneTime: null,
    monthly: { 10: null, 20: null, 50: null },
  },
  {
    id: "housing",
    name: "Housing & Safety Resources",
    emoji: "🏠",
    hue: "#B197FC",
    blurb:
      "Provide emergency housing assistance and safety resources for LGBTQIA+ people in crisis.",
    oneTime: null,
    monthly: { 10: null, 20: null, 50: null },
  },
];

/* Where to send people who want an amount that isn't set up yet */
const CONTACT_URL = "/contact";

/* ================================================================== */
/*  THEME                                                             */
/*                                                                    */
/*  Static palette + font stacks. Layout, spacing, and typography     */
/*  are all Tailwind utilities; these values cover the custom colors  */
/*  (which aren't in Tailwind's default palette) and the per-fund     */
/*  hue tints (which are runtime values from the FUNDS data, so they  */
/*  can't be Tailwind class names — Tailwind only compiles classes    */
/*  it can see statically in your source).                            */
/* ================================================================== */

const INK = "#0d0a1a";
const SURFACE = "#171226";
const SURFACE_2 = "#1f1833";
const LINE = "rgba(255, 255, 255, 0.09)";
const TEXT = "#f5f2fa";
const MUTED = "rgba(238, 233, 248, 0.64)";

const FONT_BODY = "'Inter', system-ui, -apple-system, sans-serif";
const FONT_DISPLAY = "'Bricolage Grotesque', 'Inter', sans-serif";

/*  The few things Tailwind can't express here: the Google Fonts
    import, entrance keyframes, and hover states that mix the
    runtime --hue color. Everything else lives in the markup.  */
const hueStyles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&display=swap');

.cd-hue-chip {
  background: color-mix(in srgb, var(--hue) 14%, transparent);
  border-color: color-mix(in srgb, var(--hue) 26%, transparent);
}
.cd-hue-card:hover {
  border-color: color-mix(in srgb, var(--hue) 45%, transparent);
  box-shadow: 0 14px 34px -14px color-mix(in srgb, var(--hue) 35%, transparent);
}
.cd-hue-btn {
  background: color-mix(in srgb, var(--hue) 20%, transparent);
  border-color: color-mix(in srgb, var(--hue) 45%, transparent);
}
.cd-hue-btn:hover {
  background: color-mix(in srgb, var(--hue) 32%, transparent);
  border-color: color-mix(in srgb, var(--hue) 70%, transparent);
}
.cd-ghost-btn:hover {
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: ${TEXT} !important;
}
.cd-close-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: ${TEXT} !important;
}
.cd-hue-amount {
  background: color-mix(in srgb, var(--hue) 8%, transparent);
  border-color: color-mix(in srgb, var(--hue) 30%, transparent);
}
a.cd-hue-amount:hover {
  background: color-mix(in srgb, var(--hue) 20%, transparent);
  border-color: color-mix(in srgb, var(--hue) 60%, transparent);
  transform: translateY(-2px);
}

@keyframes cd-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes cd-rise {
  from { opacity: 0; transform: translateY(14px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.cd-anim-fade { animation: cd-fade 0.2s ease; }
.cd-anim-rise { animation: cd-rise 0.24s ease; }

@media (prefers-reduced-motion: reduce) {
  .cd-anim-fade, .cd-anim-rise { animation: none; }
  a.cd-hue-amount:hover { transform: none; }
}
`;

/* Shared focus ring for every interactive element */
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/* ================================================================== */
/*  COMPONENT                                                         */
/* ================================================================== */

export default function CommunityDonations() {
  const [activeFund, setActiveFund] = useState(null);
  const closeButtonRef = useRef(null);

  const closeModal = () => setActiveFund(null);

  /* Close on Escape + lock body scroll while the modal is open */
  useEffect(() => {
    if (!activeFund) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeFund]);

  return (
    <section
      className="mx-auto max-w-full px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-6"
      style={{ background: INK, color: TEXT, fontFamily: FONT_BODY }}
    >
      <style>{hueStyles}</style>

      {/* ---------- Header ---------- */}
      <header className="mx-auto mb-14 max-w-xl text-center">

        <h2
          className="mb-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl"
          style={{ fontFamily: FONT_DISPLAY }}
        >
          Give where it matters most
        </h2>
        <div
          className="mx-auto mb-5 flex h-1 w-32 overflow-hidden rounded-full"
          aria-hidden="true"
        >
          {FUNDS.map((f) => (
            <span key={f.id} className="flex-1" style={{ background: f.hue }} />
          ))}
        </div>
        <p className="text-base leading-relaxed" style={{ color: MUTED }}>
          Choose the fund your support goes to. Give once, or set up a
          monthly gift to keep these programs running all year.
        </p>
      </header>

      {/* ---------- Fund cards ---------- */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FUNDS.map((fund) => {
          const oneTimeLink = fund.oneTime || SHARED_ONE_TIME_LINK;
          return (
            <article
              key={fund.id}
              className="cd-hue-card relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              style={{
                "--hue": fund.hue,
                background: SURFACE,
                borderColor: LINE,
              }}
            >
              <div className="h-1" style={{ background: fund.hue }} aria-hidden="true" />
              <div className="flex flex-1 flex-col p-6">
                <span
                  className="cd-hue-chip mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border text-2xl"
                  aria-hidden="true"
                >
                  {fund.emoji}
                </span>
                <h3
                  className="mb-2.5 text-xl font-bold tracking-tight"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  {fund.name}
                </h3>
                <p
                  className="mb-6 flex-1 text-sm leading-relaxed"
                  style={{ color: MUTED }}
                >
                  {fund.blurb}
                </p>

                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <a
                    className={`cd-hue-btn inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-sm font-semibold no-underline transition-colors ${FOCUS}`}
                    style={{ color: TEXT }}
                    href={oneTimeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Give once
                    <ArrowUpRight size={15} strokeWidth={2.5} />
                  </a>
                  <button
                    type="button"
                    className={`cd-ghost-btn inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border bg-transparent px-3.5 py-2.5 text-sm font-semibold transition-colors ${FOCUS}`}
                    style={{ borderColor: LINE, color: MUTED }}
                    onClick={() => setActiveFund(fund)}
                  >
                    Give monthly
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p
        className="mt-11 flex items-center justify-center gap-2 text-center text-xs"
        style={{ color: MUTED }}
      >
        <Heart size={13} aria-hidden="true" /> Hartford Pride Center is a
        501(c)(3) nonprofit. Every dollar stays in the community, and monthly
        gifts can be canceled anytime.
      </p>

      {/* ---------- Monthly giving modal ---------- */}
      {activeFund && (
        <div
          className="cd-anim-fade fixed inset-0 z-50 flex items-center justify-center p-5 backdrop-blur-sm"
          style={{ background: "rgba(7, 5, 14, 0.72)" }}
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="cd-anim-rise relative w-full max-w-md rounded-2xl border p-7 pt-8 sm:p-8"
            style={{
              "--hue": activeFund.hue,
              background: SURFACE_2,
              borderColor: LINE,
              borderTopWidth: 4,
              borderTopColor: activeFund.hue,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cd-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className={`cd-close-btn absolute right-3.5 top-3.5 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-colors ${FOCUS}`}
              style={{ color: MUTED }}
              onClick={closeModal}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mb-6 text-center">
              <span
                className="cd-hue-chip mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-xl border text-3xl"
                aria-hidden="true"
              >
                {activeFund.emoji}
              </span>
              <h3
                id="cd-modal-title"
                className="mb-1.5 text-xl font-bold"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                {activeFund.name}
              </h3>
              <p className="text-sm" style={{ color: MUTED }}>
                Choose your monthly gift amount
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {MONTHLY_AMOUNTS.map((amount) => {
                const link = activeFund.monthly?.[amount] || null;
                const base =
                  "flex items-center justify-between gap-1 rounded-xl border px-4 py-3.5 sm:flex-col sm:justify-center sm:px-2 sm:pb-3.5 sm:pt-4";
                return link ? (
                  <a
                    key={amount}
                    className={`cd-hue-amount ${base} no-underline transition-all ${FOCUS} motion-reduce:transition-none`}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className="text-2xl font-extrabold"
                      style={{ fontFamily: FONT_DISPLAY, color: TEXT }}
                    >
                      ${amount}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs"
                      style={{ color: MUTED }}
                    >
                      per month
                    </span>
                  </a>
                ) : (
                  <span
                    key={amount}
                    className={`${base} cursor-not-allowed border-dashed bg-transparent opacity-50`}
                    style={{ borderColor: LINE }}
                    aria-disabled="true"
                  >
                    <span
                      className="text-2xl font-extrabold"
                      style={{ fontFamily: FONT_DISPLAY, color: TEXT }}
                    >
                      ${amount}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs"
                      style={{ color: MUTED }}
                    >
                      <Clock size={11} aria-hidden="true" /> coming soon
                    </span>
                  </span>
                );
              })}
            </div>

            <p
              className="mt-5 text-center text-xs leading-relaxed"
              style={{ color: MUTED }}
            >
              Want a different amount or need help setting up your gift?{" "}
              <a
                href={CONTACT_URL}
                className="font-semibold underline underline-offset-2"
                style={{ color: TEXT }}
              >
                Contact us
              </a>{" "}
              — we'll take care of it.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}