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
} from "react-icons/fa";
import "./App.css";
import EmailSubscribe from "./EmailSubscribe";

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
<div className="min-h-screen bg-gradient-to-br from-pink-600 via-slate-500 to-red-700 text-white">
      {/* Top Hero */}
<header className="relative overflow-hidden pt-10 sm:pt-16 lg:pt-28 pb-16 sm:pb-20 lg:pb-24">

  {/* ───────────────── BACKGROUND IMAGE ───────────────── */}
  <div
    className="absolute inset-0 bg-cover bg-center scale-105 pointer-events-none"
    style={{
      backgroundImage:
        "url('https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg?cs=srgb&dl=pexels-pixabay-207142.jpg&fm=jpg')",
    }}
  />

  {/* DARK CINEMATIC OVERLAY */}
  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom_right,rgba(20,0,0,.78),rgba(0,0,0,.78),rgba(50,0,0,.74))]" />


  {/* SUBTLE GRID */}
  <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] bg-[size:42px_42px] pointer-events-none" />

  <div className="relative mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="grid lg:grid-cols-[420px,1fr] gap-8 lg:gap-14 items-center">

      {/* ───────────────── LOGO PANEL ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="order-1 lg:order-1"
      >
        <div className="relative rounded-[2.2rem] overflow-hidden border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.55)] p-4 sm:p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-red-500/10 pointer-events-none" />

          <img
            src="/PrideLogo3.jpg"
            alt="Hartford Pride Center Logo"
            className="relative w-full  rounded-[1.7rem] object-cover shadow-2xl"
          />

          <div className="mt-4 text-center">
            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-red-500/70 via-purple-500/70 to-yellow-400/70 text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white shadow-lg">
              Community • Advocacy • Resources
            </div>
          </div>
        </div>
      </motion.div>

      {/* ───────────────── TEXT SIDE ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="order-2 lg:order-2 text-center lg:text-left"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-xs sm:text-sm uppercase tracking-[0.25em] font-bold text-yellow-200 shadow-xl">
          Hartford, Connecticut Pride Initiative
        </div>

        <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          Hartford Pride
          <span className="block bg-gradient-to-r from-yellow-200 via-white to-red-200 bg-clip-text text-transparent">
            Center
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed mx-auto lg:mx-0">
          Strengthening LGBTQIA+ visibility, safe spaces, outreach, advocacy,
          resources, and community partnerships throughout Hartford and the
          surrounding Capital Region through one unified digital hub.
        </p>

        {/* <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3 text-sm sm:text-base">
          {["Events", "Resources", "Volunteerism", "Community Funders"].map((item) => (
            <div
              key={item}
              className="px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl text-white/90 font-semibold shadow-lg"
            >
              {item}
            </div>
          ))}
        </div> */}

        <Link
          to="/pride"
          className="mt-8 inline-flex justify-center items-center px-8 sm:px-10 py-4 rounded-2xl
          bg-gradient-to-r from-red-600 via-purple-600 to-yellow-500
          text-white font-black text-sm sm:text-base uppercase tracking-[0.15em]
          shadow-[0_15px_40px_rgba(0,0,0,0.45)]
          hover:scale-105 hover:brightness-110 transition duration-300 relative z-30"
        >
          Explore Capital City Pride 2026
        </Link>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-30">
          <Link
            to="/contact"
            className="rounded-2xl px-6 py-4 bg-white text-black font-bold shadow-2xl hover:scale-105 transition"
          >
            Contact Center
          </Link>

          <a
            href="https://karaoverse.com/event/capital-city-pride"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl px-6 py-4 bg-gradient-to-r from-yellow-300 to-amber-500 text-black font-bold shadow-2xl hover:scale-105 transition"
          >
            Upcoming Events
          </a>

          <Link
            to="/funders"
            className="rounded-2xl px-6 py-4 bg-gradient-to-r from-purple-500 to-red-500 text-white font-bold shadow-2xl hover:scale-105 transition"
          >
            Community Funders
          </Link>
        </div>
      </motion.div>

    </div>
  </div>
</header>
      <hr className="rainbow-hr" />

      {/* Main Content */}
<main className="relative max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-4 sm:py-4">

  {/* AMBIENT COLOR BLOOMS */}
  <div className="absolute top-20 left-0 w-56 h-56 bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none" />
  <div className="absolute bottom-20 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

  <section>
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.45)] p-3 sm:p-10 lg:p-14"
    >
      {/* inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/5 via-transparent to-purple-500/5 pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-10 text-center">
        <div className="inline-flex px-5 py-2 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm uppercase tracking-[0.3em] text-yellow-200 font-bold">
          Hartford Pride Community Hub
        </div>

        <h2 className="mt-5 text-4xl sm:text-5xl lg:text-7xl font-black leading-[0.95] text-white">
          Welcome, Friends
          <span className="block bg-gradient-to-r from-yellow-200 via-white to-yellow-400 bg-clip-text text-transparent">
            & Allies
          </span>
        </h2>

        <div className="mt-5 mx-auto h-[3px] w-32 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        <p className="mt-7 max-w-4xl mx-auto text-white/85 text-lg sm:text-xl leading-relaxed font-medium">
          We believe every individual deserves a place where they feel seen,
          protected, celebrated, and connected. Through advocacy, education,
          outreach, and shared resources, Hartford Pride Center exists to
          strengthen LGBTQIA+ visibility and community support throughout the
          Capital Region.
        </p>

        <p className="mt-5 max-w-3xl mx-auto text-yellow-100/90 text-base sm:text-lg leading-relaxed">
          Together we are building a more inclusive future — one where
          authenticity shines, partnerships grow stronger, and every voice
          matters.
        </p>
      </div>

      {/* CTA BUTTON COMMAND CENTER */}
      <div className="relative z-10 mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { label: "About Us", to: "/about" },
          { label: "Resources", to: "/resources" },
          { label: "Donate", href: "https://givebutter.com/lgbtqadvocacy" },
          { label: "Sponsors", to: "/sponsors" },
        ].map((btn, i) =>
          btn.href ? (
            <a
              key={i}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl px-5 py-4 text-center font-black text-black
              bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500
              hover:scale-105 hover:brightness-110 transition duration-300
              shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
            >
              {btn.label}
            </a>
          ) : (
            <Link
              key={i}
              to={btn.to}
              className="rounded-2xl px-5 py-4 text-center font-black text-black
              bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500
              hover:scale-105 hover:brightness-110 transition duration-300
              shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
            >
              {btn.label}
            </Link>
          )
        )}
      </div>

      {/* WHAT YOU CAN DO */}
      <div className="relative z-10 mt-16">
        <div className="text-center">
          <h3 className="text-3xl sm:text-4xl font-black text-yellow-300">
            Explore What You Can Do Here
          </h3>
          <div className="mt-4 mx-auto h-[3px] w-28 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<FaCalendarAlt className="text-3xl text-yellow-300" />}
            title="Find Events"
            desc="Discover upcoming pride celebrations, gatherings, and local community happenings."
            href="https://karaoverse.com/event/capital-city-pride"
          />

          <FeatureCard
            icon={<FaHandHoldingHeart className="text-3xl text-yellow-300" />}
            title="Volunteer"
            desc="Offer your time, your voice, and your skills to help strengthen our mission."
            to="/volunteer"
          />

          <FeatureCard
            icon={<FaUsers className="text-3xl text-yellow-300" />}
            title="Connect"
            desc="Reach our team for partnerships, advocacy questions, sponsorships, or support."
            to="/contact"
          />
        </div>
      </div>

      {/* FEATURED PARTNERSHIP SHOWCASE */}
      <div className="relative z-10 mt-16">
        <div className="text-center mb-5">
          <div className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-700 text-white text-xl sm:text-2xl font-black shadow-2xl">
            Featured Community Collaboration
          </div>
        </div>

        <a
          href="https://karaoverse.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="overflow-hidden rounded-[2rem] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <video
              src="/Video.mov"
              autoPlay
              loop
              muted
              playsInline
              className="w-full object-cover group-hover:scale-[1.02] transition duration-500"
            />
          </div>
        </a>
      </div>

      {/* EMAIL */}
      <div className="relative z-10 mt-14">
        <EmailSubscribe prideId={2} />
      </div>
    </motion.div>
  </section>
</main>
      <hr className="rainbow-hr" />

      {/* Footer */}
   <footer className="relative  overflow-hidden border-t border-pink-200">

  {/* FESTIVAL PRIDE BACKGROUND */}
  <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-yellow-50 to-cyan-100" />
  <div className="absolute -top-16 -left-10 w-60 h-60 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute top-10 right-[30%] w-60 h-60 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />


  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

      {/* ORG */}
      <div>
        <div className="inline-block px-5 py-2 rounded-full bg-white shadow-lg text-pink-500 font-black uppercase tracking-[0.25em] text-xs sm:text-sm">
          Hartford Pride Center 🌈
        </div>

        <h3 className="mt-5 text-3xl sm:text-4xl font-black leading-tight text-gray-900">
          Celebrating Community,
          <span className="block text-pink-500">Connection & Advocacy.</span>
        </h3>

        <p className="mt-4 text-gray-600 font-semibold leading-relaxed">
          Year-round visibility, resources, volunteerism, wellness, advocacy,
          sponsorship, support services, and joyful LGBTQIA+ community building
          across Hartford and beyond.
        </p>

        <div className="mt-6 inline-block px-5 py-3 rounded-2xl bg-white shadow-lg font-black text-pink-500 rotate-[-2deg]">
          🌈 Everyone Is Welcome Here
        </div>
      </div>

      {/* LINKS */}
      <div>
        <h4 className="text-2xl font-black text-gray-900">Explore More</h4>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link to="/about" className="rounded-xl bg-white px-4 py-3 shadow-lg font-black text-pink-500 hover:scale-105 transition text-center">About</Link>
          <Link to="/services" className="rounded-xl bg-white px-4 py-3 shadow-lg font-black text-yellow-500 hover:scale-105 transition text-center">Services</Link>
          <Link to="/events" className="rounded-xl bg-white px-4 py-3 shadow-lg font-black text-cyan-500 hover:scale-105 transition text-center">Events</Link>
          <Link to="/volunteer" className="rounded-xl bg-white px-4 py-3 shadow-lg font-black text-purple-500 hover:scale-105 transition text-center">Volunteer</Link>
          <Link to="/resources" className="rounded-xl bg-white px-4 py-3 shadow-lg font-black text-pink-500 hover:scale-105 transition text-center">Resources</Link>
          <Link to="/contact" className="rounded-xl bg-white px-4 py-3 shadow-lg font-black text-cyan-500 hover:scale-105 transition text-center">Contact</Link>
          <a
            href="https://givebutter.com/lgbtqadvocacy"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-white px-4 py-3 shadow-lg font-black text-yellow-500 hover:scale-105 transition text-center"
          >
            Donate
          </a>
          <Link to="/sponsors" className="rounded-xl bg-white px-4 py-3 shadow-lg font-black text-purple-500 hover:scale-105 transition text-center">Sponsors</Link>
        </div>
      </div>

      {/* CONTACT */}
      <div>
        <h4 className="text-2xl font-black text-gray-900">Stay Connected</h4>

        <p className="mt-5 text-gray-700 font-bold">
          Questions, support requests, sponsorships, partnerships, or volunteer inquiries?
        </p>

        <p className="mt-4 text-gray-700 font-black">
          📧{" "}
          <a
            href="mailto:david@hartfordpridecenter.org"
            className="underline hover:text-pink-500"
          >
            david@hartfordpridecenter.org
          </a>
        </p>

        <p className="mt-3 text-gray-700 font-black">
          📍 Hartford, Connecticut
        </p>

        <div className="mt-6 flex items-center gap-4">
          <a
            href="https://www.instagram.com/hartfordpride/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xl hover:scale-110 transition"
          >
            <FaInstagram className="text-xl" />
          </a>

          <a
            href="https://www.facebook.com/HartfordPrideCenter"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-cyan-400 text-white flex items-center justify-center shadow-xl hover:scale-110 transition"
          >
            <FaFacebook className="text-xl" />
          </a>

          <a
            href="mailto:david@hartfordpridecenter.org"
            className="w-12 h-12 rounded-full bg-yellow-400 text-white flex items-center justify-center shadow-xl hover:scale-110 transition"
          >
            <FaEnvelope className="text-xl" />
          </a>
        </div>
      </div>
    </div>

    {/* BOTTOM */}
    <div className="mt-14 border-t border-pink-200 pt-8 text-center">
      <div className="text-sm text-gray-500 font-bold">
        © {year} Hartford Pride Center — Built for advocacy, inclusion, and community joy.
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, to }) {
  return (
    <Link
      to={to}
      className="block p-4 bg-black/40 border border-white/10 shadow-lg hover:bg-white/10 transition"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/10 border border-yellow-400/20">
          {icon}
        </div>
        <div>
          <p className="font-extrabold text-yellow-200">{title}</p>
          <p className="text-sm text-yellow-100/80 font-semibold">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
