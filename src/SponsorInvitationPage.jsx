import React, { useEffect, useMemo, useRef, useState } from "react";
import { Heart, X, ArrowUpRight, Clock, Share2 } from "lucide-react";
import PrideHero from "./PrideHero";
import {
  INK,
  SURFACE,
  SURFACE_SOLID,
  LINE,
  TEXT,
  MUTED,
  FONT_BODY,
  FONT_DISPLAY,
  SPECTRUM,
  FOCUS,
  safeLink,
} from "./prideTheme";

const SHARED_ONE_TIME_LINK = "https://buy.stripe.com/8x24gs2cj5Mm1Sy0Gccwg0e";

const MONTHLY_AMOUNTS = [10, 20, 50];

/* Fund hues are indexes into the shared spectrum, so the comet trails,
   the hero aurora, and these cards can never fall out of sync. */
const FUNDS = [
  {
    id: "medication",
    name: "Medication Assistance",
    emoji: "💊",
    hue: SPECTRUM[0],
    blurb:
      "Help community members afford life-sustaining medications and prescription costs.",
    oneTime: "https://buy.stripe.com/3cIbIUaIP0s20OugFacwg0i",
    monthly: {
      10: null,
      20: "https://buy.stripe.com/28E4gseZ55MmdBg4Wscwg0j",
      50: null,
    },
  },
  {
    id: "programming",
    name: "Community Programming",
    emoji: "🤝",
    hue: SPECTRUM[1],
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
    hue: SPECTRUM[2],
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
    hue: SPECTRUM[3],
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
    hue: SPECTRUM[4],
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
    hue: SPECTRUM[5],
    blurb:
      "Provide emergency housing assistance and safety resources for LGBTQIA+ people in crisis.",
    oneTime: "https://buy.stripe.com/8x24gs3gn1w654KcoUcwg09",
    monthly: {
      10: null,
      20: "https://buy.stripe.com/fZubIUeZ50s268O2Okcwg08",
      50: null,
    },
  },
];

const CONTACT_URL = "/contact";
const SHARE_URL = "https://share.karaoverse.com/og/support";

/* ------------------------------------------------------------------ */
/*  SIGNATURE — heart comets                                           */
/*                                                                     */
/*  Hearts fall as shooting stars, each trailing one fund hue, behind  */
/*  the entire page — hero included, since the hero is transparent.    */
/*  Canvas over DOM: one compositor layer, no reflow, fewer particles  */
/*  on phones, and it idles at ~0% CPU when the tab is hidden.         */
/* ------------------------------------------------------------------ */
function HeartComets() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ctx = canvas.getContext("2d", { alpha: true });
    let raf = null;
    let comets = [];
    let width = 0;
    let height = 0;
    let last = 0;

    const rand = (min, max) => min + Math.random() * (max - min);

    /* Spawn along the top and right edges so every comet crosses the
       viewport diagonally rather than clipping a corner. */
    const spawn = (seeded = false) => {
      const angle = rand(0.62, 0.82); // radians, down-and-left
      const fromTop = Math.random() > 0.35;
      const travel = (seeded ? Math.random() : 0) * height * 1.4;
      const dx = -Math.cos(angle);
      const dy = Math.sin(angle);

      return {
        x: (fromTop ? rand(0, width * 1.5) : width + rand(0, 200)) + dx * travel,
        y: (fromTop ? -rand(20, 160) : rand(0, height * 0.6)) + dy * travel,
        dx,
        dy,
        speed: rand(120, 260),
        size: rand(5, 11),
        trail: rand(60, 150),
        alpha: rand(0.35, 0.85),
        spin: rand(-0.5, 0.5),
        rot: rand(-0.4, 0.4),
        hue: SPECTRUM[Math.floor(Math.random() * SPECTRUM.length)],
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* Same density, less battery. */
      const count = width < 640 ? 7 : width < 1100 ? 11 : 16;
      comets = Array.from({ length: count }, () => spawn(true));
    };

    const drawHeart = (x, y, size, rot, hue, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(size, size);
      ctx.beginPath();
      ctx.moveTo(0, 0.36);
      ctx.bezierCurveTo(0, 0.12, -0.52, -0.14, -0.52, -0.46);
      ctx.bezierCurveTo(-0.52, -0.82, -0.1, -0.86, 0, -0.5);
      ctx.bezierCurveTo(0.1, -0.86, 0.52, -0.82, 0.52, -0.46);
      ctx.bezierCurveTo(0.52, -0.14, 0, 0.12, 0, 0.36);
      ctx.closePath();
      ctx.restore();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = hue;
      ctx.fill();
    };

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05) || 0;
      last = now;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < comets.length; i++) {
        const c = comets[i];
        c.x += c.dx * c.speed * dt;
        c.y += c.dy * c.speed * dt;
        c.rot += c.spin * dt;

        const tailX = c.x - c.dx * c.trail;
        const tailY = c.y - c.dy * c.trail;

        const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        grad.addColorStop(0, c.hue);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.globalAlpha = c.alpha * 0.55;
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(1, c.size * 0.22);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        drawHeart(c.x, c.y, c.size, c.rot, c.hue, c.alpha);

        if (c.x < -160 || c.y > height + 160) comets[i] = spawn(false);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    /* Reduced motion keeps the hearts, drops the movement. */
    const drawStill = () => {
      ctx.clearRect(0, 0, width, height);
      comets.forEach((c) =>
        drawHeart(c.x, c.y, c.size, c.rot, c.hue, c.alpha * 0.5)
      );
      ctx.globalAlpha = 1;
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    };

    const start = () => {
      stop();
      if (motionQuery.matches) return drawStill();
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      resize();
      start();
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    start();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener?.("change", start);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener?.("change", start);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  CSS the markup can't carry: font import, hue mixing, keyframes.    */
/*  Loaded here rather than per-section — the hero renders inside this */
/*  component and inherits it.                                         */
/* ------------------------------------------------------------------ */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Inter:wght@400;500;600;700&display=swap');

.cd-chip {
  background: color-mix(in srgb, var(--hue) 16%, transparent);
  border-color: color-mix(in srgb, var(--hue) 30%, transparent);
}
.cd-card { transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease; }
.cd-cta {
  background: color-mix(in srgb, var(--hue) 20%, transparent);
  border-color: color-mix(in srgb, var(--hue) 44%, transparent);
  transition: background .18s ease, border-color .18s ease;
}
.cd-amount {
  background: color-mix(in srgb, var(--hue) 9%, transparent);
  border-color: color-mix(in srgb, var(--hue) 32%, transparent);
  transition: background .18s ease, border-color .18s ease;
}
.cd-quiet { transition: color .18s ease, border-color .18s ease; }

/* Gated so phones don't get stuck in a hover state after a tap */
@media (hover: hover) {
  .cd-card:hover {
    transform: translateY(-3px);
    border-color: color-mix(in srgb, var(--hue) 50%, transparent);
    box-shadow: 0 18px 40px -18px color-mix(in srgb, var(--hue) 55%, transparent);
  }
  .cd-cta:hover {
    background: color-mix(in srgb, var(--hue) 34%, transparent);
    border-color: color-mix(in srgb, var(--hue) 72%, transparent);
  }
  .cd-amount:hover {
    background: color-mix(in srgb, var(--hue) 22%, transparent);
    border-color: color-mix(in srgb, var(--hue) 62%, transparent);
  }
  .cd-quiet:hover { color: ${TEXT}; border-color: rgba(255,255,255,.28); }
}

.cd-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
@media (min-width: 640px) { .cd-clamp { -webkit-line-clamp: 3; } }

.cd-sheet { padding-bottom: max(1.5rem, env(safe-area-inset-bottom)); }

@keyframes cd-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes cd-rise {
  from { opacity: 0; transform: translateY(18px) }
  to { opacity: 1; transform: translateY(0) }
}
.cd-fade { animation: cd-fade .18s ease }
.cd-rise { animation: cd-rise .26s cubic-bezier(.22,1,.36,1) }

@media (prefers-reduced-motion: reduce) {
  .cd-fade, .cd-rise { animation: none }
  .cd-card:hover { transform: none }
}
`;

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
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: INK, color: TEXT, fontFamily: FONT_BODY }}
    >
      <style>{styles}</style>

      <HeartComets />

      {/* Everything above the comet field */}
      <div className="relative" style={{ zIndex: 1 }}>
        <PrideHero />

        <section className="mx-auto max-w-5xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
          {/* ---------- Header ---------- */}
          <header className="mx-auto mb-6 max-w-lg text-center sm:mb-8">
            <h2
              className="text-[1.75rem] font-extrabold leading-[1.1] tracking-tight sm:text-[2.5rem]"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Give where it matters most
            </h2>
            <p
              className="mx-auto mt-3 max-w-sm text-sm leading-relaxed"
              style={{ color: MUTED }}
            >
              Six funds, one community. Pick where your gift goes.
            </p>
          </header>

          {/* ---------- Mode toggle ----------
              One decision up front means each card carries a single
              button instead of two — the whole grid gets shorter. */}
          <div
            className="mx-auto mb-6 grid w-full max-w-[17rem] grid-cols-2 gap-1 rounded-full border p-1 sm:mb-8"
            style={{ borderColor: LINE, background: SURFACE }}
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
                  className={`cursor-pointer rounded-full border-0 px-3 py-2.5 text-[0.8rem] font-semibold transition-colors ${FOCUS}`}
                  style={{ background: on ? TEXT : "transparent", color: on ? INK : MUTED }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* ---------- Fund cards ---------- */}
          <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {FUNDS.map((fund) => {
              const oneTime = safeLink(fund.oneTime) || SHARED_ONE_TIME_LINK;
              const hasMonthly = MONTHLY_AMOUNTS.some((a) =>
                safeLink(fund.monthly?.[a])
              );
              return (
                <li
                  key={fund.id}
                  className="cd-card flex flex-col overflow-hidden rounded-2xl border"
                  style={{ "--hue": fund.hue, background: SURFACE, borderColor: LINE }}
                >
                  <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <span
                        className="cd-chip inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg"
                        aria-hidden="true"
                      >
                        {fund.emoji}
                      </span>
                      <h3
                        className="text-[1.02rem] font-bold leading-snug tracking-tight"
                        style={{ fontFamily: FONT_DISPLAY }}
                      >
                        {fund.name}
                      </h3>
                    </div>

                    <p
                      className="cd-clamp flex-1 text-[0.83rem] leading-relaxed"
                      style={{ color: MUTED }}
                    >
                      {fund.blurb}
                    </p>

                    {mode === "once" ? (
                      <a
                        href={oneTime}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`cd-cta inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border text-[0.85rem] font-semibold no-underline ${FOCUS}`}
                        style={{ color: TEXT }}
                      >
                        Give once
                        <ArrowUpRight size={15} strokeWidth={2.5} />
                      </a>
                    ) : hasMonthly ? (
                      <button
                        type="button"
                        onClick={() => setActiveFund(fund)}
                        className={`cd-cta inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border text-[0.85rem] font-semibold ${FOCUS}`}
                        style={{ color: TEXT }}
                      >
                        Choose an amount
                      </button>
                    ) : (
                      <a
                        href={CONTACT_URL}
                        className={`cd-quiet inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border bg-transparent text-[0.85rem] font-semibold no-underline ${FOCUS}`}
                        style={{ borderColor: LINE, color: MUTED }}
                      >
                        <Clock size={14} aria-hidden="true" />
                        Ask us to set it up
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* ---------- Reassurance + share ---------- */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10">
            <p
              className="flex max-w-md items-start justify-center gap-2 text-center text-[0.75rem] leading-relaxed"
              style={{ color: MUTED }}
            >
              <Heart size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                Hartford Pride Center is a 501(c)(3) nonprofit. Every dollar stays
                in the community, and you can cancel a monthly gift anytime.
              </span>
            </p>

            <button
              type="button"
              onClick={handleShare}
              className={`cd-quiet inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-full border bg-transparent px-4 text-[0.78rem] font-semibold ${FOCUS}`}
              style={{ borderColor: LINE, color: MUTED }}
            >
              <Share2 size={13} aria-hidden="true" />
              {copied ? "Link copied" : "Share this page"}
            </button>
          </div>
        </section>
      </div>

      {/* ---------- Monthly amount sheet ---------- */}
      {activeFund && (
        <div
          className="cd-fade fixed inset-0 flex items-end justify-center backdrop-blur-md sm:items-center sm:p-5"
          style={{ background: "rgba(6, 4, 12, .74)", zIndex: 50 }}
          onClick={closeSheet}
          role="presentation"
        >
          <div
            className="cd-rise cd-sheet relative max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-t-3xl border px-5 pt-7 sm:rounded-3xl sm:px-6 sm:pb-6"
            style={{
              "--hue": activeFund.hue,
              background: SURFACE_SOLID,
              borderColor: LINE,
              borderTopWidth: 3,
              borderTopColor: activeFund.hue,
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
              className={`cd-quiet absolute right-2.5 top-2.5 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent ${FOCUS}`}
              style={{ color: MUTED }}
            >
              <X size={18} />
            </button>

            <div className="mb-5 flex items-center gap-3 pr-10">
              <span
                className="cd-chip inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl"
                aria-hidden="true"
              >
                {activeFund.emoji}
              </span>
              <div>
                <h3
                  id="cd-sheet-title"
                  className="text-base font-bold leading-tight"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  {activeFund.name}
                </h3>
                <p className="mt-0.5 text-[0.78rem]" style={{ color: MUTED }}>
                  Monthly gift
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {monthlyLinks.map(({ amount, link }) =>
                link ? (
                  <a
                    key={amount}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`cd-amount flex min-h-[76px] flex-col items-center justify-center gap-0.5 rounded-2xl border no-underline ${FOCUS}`}
                  >
                    <span
                      className="text-xl font-extrabold"
                      style={{ fontFamily: FONT_DISPLAY, color: TEXT }}
                    >
                      ${amount}
                    </span>
                    <span className="text-[0.68rem]" style={{ color: MUTED }}>
                      / month
                    </span>
                  </a>
                ) : (
                  <span
                    key={amount}
                    aria-disabled="true"
                    className="flex min-h-[76px] cursor-not-allowed flex-col items-center justify-center gap-0.5 rounded-2xl border border-dashed opacity-45"
                    style={{ borderColor: LINE }}
                  >
                    <span
                      className="text-xl font-extrabold"
                      style={{ fontFamily: FONT_DISPLAY, color: TEXT }}
                    >
                      ${amount}
                    </span>
                    <span className="text-[0.68rem]" style={{ color: MUTED }}>
                      soon
                    </span>
                  </span>
                )
              )}
            </div>

            <p
              className="mt-4 text-center text-[0.72rem] leading-relaxed"
              style={{ color: MUTED }}
            >
              Want a different amount?{" "}
              <a
                href={CONTACT_URL}
                className="font-semibold underline underline-offset-2"
                style={{ color: TEXT }}
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