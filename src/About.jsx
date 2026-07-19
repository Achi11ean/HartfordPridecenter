import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   HARTFORD PRIDE CENTER — ABOUT PAGE
   "Community Poster" redesign to match HomePage:
   cream paper, flat pride-flag color blocks, ink outlines,
   hard offset shadows, huge Archivo type, rainbow marquee.
   All content + links preserved.
   ───────────────────────────────────────────────────────────── */

const FLAG = ["#E40303", "#FF8C00", "#FFED00", "#008026", "#004DFF", "#750787"];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

/* Shared poster button (hard shadow, presses in on hover) */
const posterBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#181310] px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310]";

export default function About() {
  const links = [
    { label: "Contact", to: "/contact", bg: "#004DFF", text: "#ffffff" },
    {
      label: "Events",
      href: "https://karaoverse.com/event/capital-city-pride",
      bg: "#E40303",
      text: "#ffffff",
    },
    { label: "Volunteer", to: "/volunteer", bg: "#008026", text: "#ffffff" },
    { label: "Sponsors", to: "/sponsors", bg: "#FF8C00", text: "#181310" },
    { label: "Resources", to: "/resources", bg: "#FFED00", text: "#181310" },
    { label: "Donate", to: "/support", bg: "#750787", text: "#ffffff" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-[#181310] overflow-x-hidden hpc-body">
      {/* local styles: display font + marquee animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..900&display=swap');
        .hpc-display { font-family: 'Archivo', system-ui, sans-serif; font-stretch: 87%; }
        .hpc-body { font-family: 'Archivo', system-ui, sans-serif; }
        @keyframes hpc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .hpc-marquee-track { animation: hpc-marquee 26s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hpc-marquee-track { animation: none; }
        }
      `}</style>

      {/* ── FLAG STRIPE TOPBAR ── */}
      <div className="flex h-2.5 mt-16 w-full" aria-hidden="true">
        {FLAG.map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 sm:pb-14">
        <div className="grid lg:grid-cols-[1fr,1fr] gap-10 lg:gap-14 items-center">
          {/* headline side */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p className="inline-block rounded-full bg-[#181310] text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-2">
              Empower · Educate · Celebrate
            </p>

            <h1 className="hpc-display mt-6 font-black uppercase leading-[0.92] tracking-tight text-[clamp(2.6rem,9vw,5.5rem)]">
              About
              <br />
              <span
                className="inline-block -rotate-1 rounded-lg px-3"
                style={{ backgroundColor: "#FFED00" }}
              >
                us.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#4a4038] font-medium">
              Building a future where every voice is heard, every identity
              celebrated, and every person empowered — across Hartford and the
              Capital Region.
            </p>
          </motion.div>

          {/* banner / poster side */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative rotate-2 rounded-2xl border-2 border-[#181310] bg-white p-3 shadow-[8px_8px_0_#181310]">
              <div
                className="h-56 sm:h-72 w-full rounded-xl bg-cover"
                style={{
                  backgroundImage:
                    "url('https://wp25.s3.amazonaws.com/wp-content/uploads/2025/01/29053539/Parade-Banner.webp')",
                  backgroundPosition: "center 25%",
                }}
                role="img"
                aria-label="Community celebration banner"
              />
              <div
                className="mt-3 flex h-2 w-full overflow-hidden rounded-full"
                aria-hidden="true"
              >
                {FLAG.map((c) => (
                  <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* sticker badges */}
            <div
              className="absolute -top-4 -left-3 -rotate-6 rounded-full border-2 border-[#181310] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_#181310]"
              style={{ backgroundColor: "#750787" }}
            >
              Since Day One
            </div>
            <div
              className="absolute -bottom-4 -right-2 rotate-3 rounded-full border-2 border-[#181310] px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0_#181310]"
              style={{ backgroundColor: "#FF8C00" }}
            >
              Greater Hartford
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RAINBOW MARQUEE (signature) ── */}
      <div className="overflow-hidden border-y-2 border-[#181310] bg-[#181310] py-3 sm:py-4">
        <div className="hpc-marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
              {["Empower", "Educate", "Celebrate", "Connect", "Uplift", "Belong"].map(
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

      {/* ── QUICK LINKS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div {...fadeUp}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#750787]">
            Jump to
          </p>
          <h2 className="hpc-display mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight">
            Explore the center
          </h2>
        </motion.div>

        <nav aria-label="Primary">
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {links.map((l) =>
              l.href ? (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={posterBtn}
                  style={{ backgroundColor: l.bg, color: l.text }}
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  to={l.to}
                  className={posterBtn}
                  style={{ backgroundColor: l.bg, color: l.text }}
                >
                  {l.label}
                </Link>
              )
            )}
          </div>

          {/* Meet Our Team — full-width feature button */}
          <Link
            to="/ourteam"
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-[#181310] bg-white px-6 py-5 text-lg font-black uppercase tracking-wide shadow-[6px_6px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#181310]"
          >
            Meet Our Team <span aria-hidden="true">🧑‍🧑‍🧒‍🧒</span>
          </Link>
        </nav>
      </section>

      {/* ── MISSION + VALUES ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Mission */}
          <motion.article
            {...fadeUp}
            className="flex flex-col overflow-hidden rounded-2xl border-2 border-[#181310] bg-white shadow-[6px_6px_0_#181310]"
          >
            <div className="h-3" style={{ backgroundColor: "#E40303" }} aria-hidden="true" />
            <div className="p-6 md:p-8">
              <h2 className="hpc-display text-2xl sm:text-3xl font-black uppercase tracking-tight">
                Our Mission
              </h2>
              <p className="mt-3 text-base leading-relaxed font-medium text-[#4a4038]">
                To create a welcoming and affirming space for all members of the
                LGBTQIA+ community by fostering connection, promoting
                self-expression, and providing essential resources that empower
                individuals and strengthen our collective voice in Greater
                Hartford.
              </p>
            </div>
          </motion.article>

          {/* Values */}
          <motion.article
            {...fadeUp}
            className="flex flex-col overflow-hidden rounded-2xl border-2 border-[#181310] bg-white shadow-[6px_6px_0_#181310]"
          >
            <div className="h-3" style={{ backgroundColor: "#004DFF" }} aria-hidden="true" />
            <div className="p-6 md:p-8">
              <h2 className="hpc-display text-2xl sm:text-3xl font-black uppercase tracking-tight">
                Our Values
              </h2>
              <p className="mt-3 text-base leading-relaxed font-medium text-[#4a4038]">
                We believe in authenticity, inclusivity, and collaboration.
                Through creativity and compassion, we build bridges across
                communities and celebrate the beauty of being unapologetically
                ourselves. Together, we thrive.
              </p>
            </div>
          </motion.article>
        </div>
      </section>

      {/* ── INTRO / CLOSING BLOCK ── */}
      <section className="border-y-2 border-[#181310]" style={{ backgroundColor: "#FFED00" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <motion.div {...fadeUp}>
            <h2 className="hpc-display mx-auto max-w-3xl text-2xl sm:text-4xl font-black uppercase leading-tight tracking-tight">
              Uplifting and connecting the LGBTQIA+ community.
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base sm:text-lg font-semibold leading-relaxed text-[#4a3d00]">
              The Hartford Pride Center is dedicated to uplifting and connecting
              the LGBTQIA+ community through advocacy, art, education, and
              celebration. We provide inclusive programming, support services,
              and cultural events that amplify queer voices and promote equality.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/support"
                className="rounded-full border-2 border-[#181310] bg-white px-5 py-2.5 text-sm font-black uppercase tracking-wide hover:bg-[#181310] hover:text-white transition-colors"
              >
                Donate
              </Link>
              <Link
                to="/volunteer"
                className="rounded-full border-2 border-[#181310] bg-white px-5 py-2.5 text-sm font-black uppercase tracking-wide hover:bg-[#181310] hover:text-white transition-colors"
              >
                Volunteer
              </Link>
              <Link
                to="/contact"
                className="rounded-full border-2 border-[#181310] bg-white px-5 py-2.5 text-sm font-black uppercase tracking-wide hover:bg-[#181310] hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BOTTOM FLAG STRIPE ── */}
      <div className="flex h-2.5 w-full" aria-hidden="true">
        {FLAG.map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  );
}