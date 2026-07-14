import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaCalendarAlt,
  FaHandHoldingHeart,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import "./App.css";
import EmailSubscribe from "./EmailSubscribe";

/* ─────────────────────────────────────────────────────────────
   HARTFORD PRIDE CENTER — "Community Poster" redesign
   Bright paper background, flat pride-flag color blocks,
   huge stacked type, sticker badges, rainbow marquee.
   Mobile-first: everything stacks to one column.
   ───────────────────────────────────────────────────────────── */

const FLAG = ["#E40303", "#FF8C00", "#FFED00", "#008026", "#004DFF", "#750787"];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-[#181310] font-sans overflow-x-hidden">
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
      <div className="flex h-2.5 w-full" aria-hidden="true">
        {FLAG.map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* ── HEADER ROW ── */}
   
      {/* ── HERO ── */}
      <section className="max-w-6xl mt-16  mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-20">
        <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-10 lg:gap-14 items-center">
          {/* headline side */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p className="inline-block rounded-full bg-[#181310] text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-2">
              Hartford, Connecticut · Capital Region
            </p>

            <h1 className="hpc-display mt-6 font-black uppercase leading-[0.92] tracking-tight text-[clamp(2.6rem,9vw,5.5rem)]">
              Every
              <span className="mx-2 inline-block -rotate-1 rounded-lg px-3" style={{ backgroundColor: "#FFED00" }}>
                one
              </span>
              <br />
              belongs
              <br />
<span
  className="inline-block rotate-1 rounded-lg px-3 text-white"
  style={{ backgroundColor: "#A855F7" }}
>                here.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#4a4038] font-medium">
              Hartford Pride Center strengthens LGBTQIA+ visibility, safe
              spaces, advocacy, resources, and community partnerships across
              Hartford and the Capital Region — one unified hub, year-round.
            </p>

            {/* primary CTAs */}
       <div className="mt-8 flex flex-col flex-wrap gap-3 sm:flex-row">
  <Link
    to="/pride"
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
    Capital City Pride 2026 <FaArrowRight />
  </Link>

  <a
    href="https://karaoverse.com/event/capital-city-pride"
    target="_blank"
    rel="noopener noreferrer"
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
    <FaCalendarAlt /> Upcoming events
  </a>

  <Link
    to="/support"
    className="
      inline-flex items-center justify-center gap-2
      rounded-xl border-2 border-[#181310]
      bg-green-300 px-6 py-4
      text-sm font-black uppercase tracking-wide text-[#181310]
      shadow-[4px_4px_0_#181310]
      transition-all
      hover:translate-x-[2px] hover:translate-y-[2px]
      hover:bg-green-400
      hover:shadow-[2px_2px_0_#181310]
    "
  >
    <FaHandHoldingHeart /> Donate
  </Link>
</div>
          </motion.div>

          {/* poster / logo side */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-sm lg:max-w-none"
          >
            <div className="relative rotate-2 rounded-2xl border-2 border-[#181310] bg-white p-3 shadow-[8px_8px_0_#181310]">
              <img
                src="/PrideLogo3.jpg"
                alt="Hartford Pride Center"
                className="w-full rounded-xl object-cover"
              />
              <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full" aria-hidden="true">
                {FLAG.map((c) => (
                  <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* sticker badges */}
            <div
              className="absolute -top-4 -left-3 -rotate-6 rounded-full border-2 border-[#181310] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_#181310]"
              style={{ backgroundColor: "#008026" }}
            >
              Community
            </div>
            <div
              className="absolute -bottom-4 -right-2 rotate-3 rounded-full border-2 border-[#181310] px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0_#181310]"
              style={{ backgroundColor: "#FF8C00" }}
            >
              Advocacy
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RAINBOW MARQUEE (signature) ── */}
      <div className="overflow-hidden border-y-2 border-[#181310] bg-[#181310] py-3 sm:py-4">
        <div className="hpc-marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
              {["Seen", "Safe", "Celebrated", "Connected", "Proud", "Welcome"].map((word, i) => (
                <span key={word} className="flex items-center gap-8">
                  <span
                    className="hpc-display text-2xl sm:text-3xl font-black uppercase tracking-tight"
                    style={{ color: FLAG[i % FLAG.length] }}
                  >
                    {word}
                  </span>
                  <span className="text-white/60 text-xl">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── WHAT YOU CAN DO ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <motion.div {...fadeUp}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#750787]">
            Get involved
          </p>
          <h2 className="hpc-display mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight">
            What you can do here
          </h2>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          <ActionCard
            color="#E40303"
            icon={<FaCalendarAlt />}
            title="Find events"
            desc="Pride celebrations, gatherings, and local community happenings across the Capital Region."
            cta="See the calendar"
            href="https://karaoverse.com/event/capital-city-pride"
          />
          <ActionCard
            color="#008026"
            icon={<FaHandHoldingHeart />}
            title="Volunteer"
            desc="Offer your time, your voice, and your skills to help strengthen our mission."
            cta="Raise your hand"
            to="/volunteer"
          />
          <ActionCard
            color="#004DFF"
            icon={<FaUsers />}
            title="Connect"
            desc="Reach our team for partnerships, advocacy questions, sponsorships, or support."
            cta="Say hello"
            to="/contact"
          />
        </div>
      </section>

      {/* ── MISSION BLOCK ── */}
      <section className="border-y-2 border-[#181310]" style={{ backgroundColor: "#FFED00" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <motion.div {...fadeUp}>
            <h2 className="hpc-display mx-auto max-w-3xl text-2xl sm:text-4xl font-black uppercase leading-tight tracking-tight">
              A place where you feel seen, protected, celebrated, and connected.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg font-semibold leading-relaxed text-[#4a3d00]">
              Through advocacy, education, outreach, and shared resources, we're
              building a more inclusive future — where authenticity shines,
              partnerships grow stronger, and every voice matters.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                { label: "About us", to: "/about" },
                { label: "Resources", to: "/resources" },
                { label: "Services", to: "/services" },
                { label: "Sponsors", to: "/sponsors" },
                { label: "Community funders", to: "/funders" },
              ].map((btn) => (
                <Link
                  key={btn.to}
                  to={btn.to}
                  className="rounded-full border-2 border-[#181310] bg-white px-5 py-2.5 text-sm font-black uppercase tracking-wide hover:bg-[#181310] hover:text-white transition-colors"
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED COLLABORATION ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <motion.div {...fadeUp}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E40303]">
            Featured community collaboration
          </p>
          <h2 className="hpc-display mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Watch what we're building
          </h2>
        </motion.div>

        <motion.a
          {...fadeUp}
          href="https://karaoverse.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 block"
        >
          <div className="rounded-2xl border-2 border-[#181310] bg-white p-2 shadow-[8px_8px_0_#181310] transition-transform group-hover:-translate-y-1">
            <video
              src="/Video.mov"
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-xl object-cover"
            />
            <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full" aria-hidden="true">
              {FLAG.map((c) => (
                <div key={c} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </motion.a>

        {/* EMAIL */}
        <motion.div {...fadeUp} className="mt-12 rounded-2xl border-2 border-[#181310] bg-white p-6 sm:p-8 shadow-[8px_8px_0_#181310]">
          <h3 className="hpc-display text-xl sm:text-2xl font-black uppercase tracking-tight">
            Stay in the loop
          </h3>
          <p className="mt-1 text-sm font-semibold text-[#6b5f57]">
            Events, resources, and community news — straight to your inbox.
          </p>
          <div className="mt-4">
            <EmailSubscribe prideId={2} />
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t-2 border-[#181310] bg-[#181310] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* org */}
            <div>
              <p className="hpc-display text-2xl font-black uppercase tracking-tight">
                Hartford Pride Center
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/70 font-medium">
                Year-round visibility, resources, volunteerism, wellness,
                advocacy, sponsorship, support services, and joyful LGBTQIA+
                community building across Hartford and beyond.
              </p>
              <div className="mt-5 flex h-2 w-32 overflow-hidden rounded-full" aria-hidden="true">
                {FLAG.map((c) => (
                  <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">
                Explore
              </p>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-bold">
                <Link to="/about" className="hover:underline underline-offset-4">About</Link>
                <Link to="/services" className="hover:underline underline-offset-4">Services</Link>
                <Link to="/events" className="hover:underline underline-offset-4">Events</Link>
                <Link to="/volunteer" className="hover:underline underline-offset-4">Volunteer</Link>
                <Link to="/resources" className="hover:underline underline-offset-4">Resources</Link>
                <Link to="/contact" className="hover:underline underline-offset-4">Contact</Link>
                <Link to="/support" className="hover:underline underline-offset-4">Donate</Link>
                <Link to="/sponsors" className="hover:underline underline-offset-4">Sponsors</Link>
              </div>
            </div>

            {/* contact */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">
                Stay connected
              </p>
              <p className="mt-4 text-sm font-bold">
                <a
                  href="mailto:david@hartfordpridecenter.org"
                  className="underline underline-offset-4 hover:text-[#FFED00]"
                >
                  david@hartfordpridecenter.org
                </a>
              </p>
              <p className="mt-2 text-sm font-semibold text-white/70">
                Hartford, Connecticut
              </p>
              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://www.instagram.com/hartfordpride/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-lg hover:bg-white hover:text-[#181310] transition-colors"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.facebook.com/HartfordPrideCenter"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-lg hover:bg-white hover:text-[#181310] transition-colors"
                >
                  <FaFacebook />
                </a>
                <a
                  href="mailto:david@hartfordpridecenter.org"
                  aria-label="Email"
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-lg hover:bg-white hover:text-[#181310] transition-colors"
                >
                  <FaEnvelope />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/15 pt-6 text-center text-xs font-semibold text-white/50">
            © {year} Hartford Pride Center · A program of CLARO Inc. · Built for
            advocacy, inclusion, and community joy.
          </div>
        </div>

        {/* bottom flag stripe */}
        <div className="flex h-2.5 w-full" aria-hidden="true">
          {FLAG.map((c) => (
            <div key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>
      </footer>
    </div>
  );
}

/* ── Action card: flat panel with a flag-color top bar ── */
function ActionCard({ color, icon, title, desc, cta, to, href }) {
  const inner = (
    <div className="flex h-full flex-col rounded-2xl border-2 border-[#181310] bg-white shadow-[6px_6px_0_#181310] transition-transform hover:-translate-y-1">
      <div className="h-3 rounded-t-[0.9rem]" style={{ backgroundColor: color }} />
      <div className="flex flex-1 flex-col p-6">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#181310] text-xl text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <h3 className="hpc-display mt-4 text-xl font-black uppercase tracking-tight">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm font-semibold leading-relaxed text-[#4a4038]">
          {desc}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide" style={{ color }}>
          {cta} <FaArrowRight className="text-xs" />
        </span>
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {inner}
    </a>
  ) : (
    <Link to={to} className="block h-full">
      {inner}
    </Link>
  );
}