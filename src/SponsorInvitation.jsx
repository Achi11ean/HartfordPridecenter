import { Link } from "react-router-dom";
import { FaPaperPlane, FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { Heart, X, ArrowUpRight, Clock } from "lucide-react";
import PrideHero from "./PrideHero";

const SHARED_ONE_TIME_LINK = "https://buy.stripe.com/7sY8wQedb5iTgfMepGcIE06";

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
/*  THEME — one system for the whole page                             */
/*                                                                    */
/*  Everything (donations + footer) now draws from the same tokens:   */
/*  ink background, two surface levels, one hairline, one display     */
/*  face — and the fund hues doing all the color work as a shared     */
/*  "pride spectrum" that threads the page together.                  */
/* ================================================================== */

const INK = "#0d0a1a";
const SURFACE = "#171226";
const SURFACE_2 = "#1f1833";
const LINE = "rgba(255, 255, 255, 0.09)";
const TEXT = "#f5f2fa";
const MUTED = "rgba(238, 233, 248, 0.64)";

const FONT_BODY = "'Inter', system-ui, -apple-system, sans-serif";
const FONT_DISPLAY = "'Bricolage Grotesque', 'Inter', sans-serif";

/* The pride spectrum — derived from the fund hues so the divider in
   the donations header, the footer's top rule, and the column accents
   are all literally the same palette. */
const SPECTRUM = FUNDS.map((f) => f.hue);
const SPECTRUM_GRADIENT = `linear-gradient(90deg, ${SPECTRUM.join(", ")})`;

/* Footer nav data — same rendering path for every column keeps the
   markup small and the mobile layout predictable. Each column borrows
   a hue from the spectrum. */
const FOOTER_NAV = [
  {
    heading: "Explore",
    hue: SPECTRUM[0],
    links: [
      { to: "/artists", label: "Artists" },
      { to: "/hosts", label: "Hosts" },
      { to: "/venues", label: "Venues" },
      { to: "/events", label: "Events" },
    ],
  },
  {
    heading: "Creators",
    hue: SPECTRUM[1],
    links: [
      { to: "/artist-tips", label: "Artist Guide" },
      { to: "/host-tips", label: "DJ Guide" },
      { to: "/venue-tips", label: "Venue Guide" },
      { to: "/school-of-karaoke", label: "School of Karaoke" },
    ],
  },
  {
    heading: "Connect",
    hue: SPECTRUM[3],
    links: [
      { to: "/job-postings", label: "Jobs" },
      { to: "/From-drags-2-riches", label: "Marketplace" },
      { to: "/bandmixer", label: "Band Mixer" },
      { to: "/supersinger", label: "Singers" },
      { to: "/supergamers", label: "Gamers" },
      { to: "/karao-match", label: "KaraoMatch" },
    ],
  },
  {
    heading: "Platform",
    hue: SPECTRUM[5],
    links: [
      { to: "/about", label: "About" },
      { to: "/newsletters", label: "Newsletters" },
      { to: "/partners", label: "Partners" },
      { to: "/pridefestivals", label: "Pride Festivals" },
      { to: "/volunteer", label: "Volunteers" },
      { to: "/updates", label: "Updates" },
      { to: "/contact", label: "Contact" },
      { to: "/donations", label: "Donations" },
      { to: "/feedback", label: "Feedback" },
    ],
  },
];

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

/* Footer links pick up their column's hue on hover/focus */
.cd-foot-link {
  color: ${MUTED};
}
.cd-foot-link:hover,
.cd-foot-link:focus-visible {
  color: color-mix(in srgb, var(--hue) 75%, ${TEXT});
}

/* Social buttons share the chip treatment used on the fund cards */
.cd-social:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
  color: ${TEXT};
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

/* A 1px pride-spectrum rule — the visual thread that ties the
   donations header, the footer, and the bottom bar together. */
function SpectrumRule({ className = "" }) {
  return (
    <div
      className={`h-px w-full ${className}`}
      style={{ background: SPECTRUM_GRADIENT, opacity: 0.7 }}
      aria-hidden="true"
    />
  );
}

/* ================================================================== */
/*  COMPONENT                                                         */
/* ================================================================== */

export default function SponsorInvitation() {
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

  const handleShare = async () => {
    const shareUrl = "https://share.karaoverse.com/og/support";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Support Karaoverse",
          text: "Help empower artists, venues, hosts, Pride organizations, and communities by supporting Karaoverse's mission to build the future of live entertainment!",
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Share link copied!");
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: INK, color: TEXT, fontFamily: FONT_BODY }}
    >
      <style>{hueStyles}</style>

      {/* HERO */}
      <PrideHero />

      {/* ============================================================ */}
      {/*  DONATIONS                                                   */}
      {/* ============================================================ */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10">
        {/* ---------- Header ---------- */}
        <header className="mx-auto mb-10 max-w-xl text-center sm:mb-14">
          <h2
            className="mb-4 text-3xl font-extrabold leading-tight tracking-tight sm:mb-5 sm:text-5xl"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            Give where it matters most
          </h2>
          <div
            className="mx-auto mb-4 flex h-1 w-32 overflow-hidden rounded-full sm:mb-5"
            aria-hidden="true"
          >
            {FUNDS.map((f) => (
              <span key={f.id} className="flex-1" style={{ background: f.hue }} />
            ))}
          </div>
          <p className="text-sm leading-relaxed sm:text-base" style={{ color: MUTED }}>
            Choose the fund your support goes to. Give once, or set up a
            monthly gift to keep these programs running all year.
          </p>
        </header>

        {/* ---------- Fund cards ---------- */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="mb-3 flex items-center gap-3 sm:mb-4 sm:block">
                    <span
                      className="cd-hue-chip inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl sm:h-12 sm:w-12 sm:text-2xl"
                      aria-hidden="true"
                    >
                      {fund.emoji}
                    </span>
                    <h3
                      className="text-lg font-bold tracking-tight sm:mt-4 sm:text-xl"
                      style={{ fontFamily: FONT_DISPLAY }}
                    >
                      {fund.name}
                    </h3>
                  </div>
                  <p
                    className="mb-5 flex-1 text-sm leading-relaxed sm:mb-6"
                    style={{ color: MUTED }}
                  >
                    {fund.blurb}
                  </p>

                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <a
                      className={`cd-hue-btn inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3.5 py-3 text-sm font-semibold no-underline transition-colors sm:py-2.5 ${FOCUS}`}
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
                      className={`cd-ghost-btn inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border bg-transparent px-3.5 py-3 text-sm font-semibold transition-colors sm:py-2.5 ${FOCUS}`}
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
          className="mt-10 flex items-center justify-center gap-2 px-4 text-center text-xs leading-relaxed sm:mt-11"
          style={{ color: MUTED }}
        >
          <Heart size={13} className="shrink-0" aria-hidden="true" />
          Hartford Pride Center is a 501(c)(3) nonprofit. Every dollar stays in
          the community, and monthly gifts can be canceled anytime.
        </p>
      </section>

      {/* ---------- Monthly giving modal ---------- */}
      {activeFund && (
        <div
          className="cd-anim-fade fixed inset-0 z-50 flex items-end justify-center p-0 backdrop-blur-sm sm:items-center sm:p-5"
          style={{ background: "rgba(7, 5, 14, 0.72)" }}
          onClick={closeModal}
          role="presentation"
        >
          {/* Bottom sheet on mobile, centered card on larger screens */}
          <div
            className="cd-anim-rise relative max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-2xl border p-6 pt-8 sm:rounded-2xl sm:p-8"
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
              className={`cd-close-btn absolute right-3.5 top-3.5 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-colors sm:h-9 sm:w-9 ${FOCUS}`}
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

      {/* ============================================================ */}
      {/*  FOOTER — same ink, same surfaces, same type, spectrum rule  */}
      {/* ============================================================ */}
      <footer style={{ background: SURFACE }}>
        <SpectrumRule />

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          {/* Brand */}
          <div className="mb-10 max-w-md sm:mb-12">
            <p
              className="mb-2 text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Karaoverse
            </p>
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: MUTED }}
            >
              The Entertainment Empire
            </p>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              Connecting singers, DJs, venues, and artists across the United
              States. Say NoMo to FoMo with Karaoverse!
            </p>
          </div>

          {/* Nav columns — 2-up on phones, 4-up on desktop */}
          <nav
            className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4"
            aria-label="Footer"
          >
            {FOOTER_NAV.map((col) => (
              <div key={col.heading} style={{ "--hue": col.hue }}>
                <h4
                  className="mb-3.5 flex items-center gap-2 text-sm font-bold tracking-tight"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: col.hue }}
                    aria-hidden="true"
                  />
                  {col.heading}
                </h4>
                <ul className="space-y-0.5">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className={`cd-foot-link -mx-2 block rounded-lg px-2 py-2 text-sm no-underline transition-colors sm:py-1.5 ${FOCUS}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Contact + social */}
          <div
            className="mt-12 flex flex-col items-center gap-5 rounded-2xl border p-6 text-center sm:flex-row sm:justify-between sm:text-left"
            style={{ background: SURFACE_2, borderColor: LINE }}
          >
            <div>
              <h4
                className="mb-1 text-base font-bold"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Get in touch
              </h4>
              <p className="text-sm" style={{ color: MUTED }}>
                United States ·{" "}
                <a
                  href="mailto:karaoverse@gmail.com"
                  className={`font-semibold underline underline-offset-2 ${FOCUS}`}
                  style={{ color: TEXT }}
                >
                  karaoverse@gmail.com
                </a>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/thekaraoverse/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={`cd-social inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${FOCUS}`}
                style={{ borderColor: LINE, color: MUTED }}
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="https://www.facebook.com/groups/549718571500039"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={`cd-social inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${FOCUS}`}
                style={{ borderColor: LINE, color: MUTED }}
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="mailto:karaoverse@gmail.com"
                aria-label="Email"
                className={`cd-social inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${FOCUS}`}
                style={{ borderColor: LINE, color: MUTED }}
              >
                <FaEnvelope className="text-xl" />
              </a>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share"
                className={`cd-social inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border bg-transparent transition-colors ${FOCUS}`}
                style={{ borderColor: LINE, color: MUTED }}
              >
                <FaPaperPlane className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <SpectrumRule className="opacity-40" />
        <div
          className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs sm:flex-row sm:px-6"
          style={{ color: MUTED }}
        >
          <p>© {new Date().getFullYear()} Karaoverse · The Entertainment Empire</p>
          <Link to="/privacy" className={`cd-foot-link rounded px-1 py-1 ${FOCUS}`} style={{ "--hue": SPECTRUM[4] }}>
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}