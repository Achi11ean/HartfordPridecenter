import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaRainbow } from "react-icons/fa";
import CapitalEvents from "./CapitalEvents";

export default function Events() {
  return (
    <div className="
      min-h-screen 
      bg-gradient-to-br 
      from-green-700
      via-[#b7eadc] 
      to-emerald-700
      text-green-900
        pt-2  ">

      {/* 🌈 Banner Image */}
{/* 🌈 Banner Video */}
{/* 🌟 Proud Partner Section */}
<section className="w-full text-center mt-20 sm:mt-28 mb-10 px-6">

  {/* Video / Logo */}
  <div className="relative inline-block">
    <hr className="rainbow-hr" />

    <video
      src="/Video2.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="
        w-[100%]
        max-w-[420px]
        sm:max-w-[600px]
        drop-shadow-2xl 
        border-b-4 border-t border-l border-r border-green-700/60
        rounded-none
      "
    >
      <img
        src="/karaoversebanner.jpeg"
        alt="Karaoverse Logo Fallback"
      />
    </video>
    <hr className="rainbow-hr" />

  </div>

  {/* Text */}
  <div className="mt-8 max-w-3xl mx-auto">

    <h2
      className="
        text-3xl sm:text-5xl font-extrabold
        bg-gradient-to-r from-white via-white to-white
        bg-clip-text text-transparent drop-shadow-lg
        uppercase tracking-wide
      "
    >
      Proud Partner 
    </h2>

    <p
      className="
        mt-5 text-lg sm:text-xl md:text-2xl border-b text-green-900 font-semibold
        leading-relaxed drop-shadow-md
      "
    >
      United in creativity, inclusivity, and celebration — our partnership with 
      <span className="font-bold text-green-700"> Karaoverse </span> 
      amplifies LGBTQIA+ voices, empowers community talent, and helps build 
      unforgettable moments across arts, entertainment, and culture.
    </p>

  </div>

</section>




      {/* ───────────────── Event List ───────────────── */}
      <div className="mt-16 px-4 pb-32 max-w-6xl mx-auto">
        <CapitalEvents />
      </div>
{/* 🌈 Safe Spaces + Artist + Host Invitation */}
<section className="w-full px-6 mt-10 mb-20 text-center">

  <h2
    className="
      text-3xl sm:text-5xl font-extrabold
      bg-gradient-to-r from-emerald-600 via-green-700 to-emerald-600
      bg-clip-text text-transparent drop-shadow-lg
      tracking-wide
    "
  >
    Build Safe Spaces. Be Seen. Get Connected. 🌈
  </h2>

  <p
    className="
      max-w-4xl mx-auto mt-6 
      text-lg sm:text-xl md:text-2xl 
      text-green-900 font-semibold leading-relaxed
    "
  >
    Karaoverse empowers LGBTQIA+ artists, nightlife hosts, safe-space venues, and 
    allies to create profiles, connect with their community, share their talents, 
    and be discovered.  
    Whether you're building a place to belong, leading events, or raising your 
    artistic voice — this platform exists to celebrate and elevate you.
  </p>

  <p
    className="
      max-w-4xl mx-auto mt-4 
      text-base sm:text-lg md:text-xl 
      text-green-800 font-medium leading-relaxed
    "
  >
    From drag shows to support groups — from karaoke hosts to queer musicians — 
    Karaoverse is helping people find local safe spaces, live LGBTQIA⁺ events, 
    and meaningful opportunities within our community.
  </p>

  {/* CTA Button */}
  <div className="mt-8">
    <a
      href="https://karaoverse.com"
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-block px-10 py-4 text-lg font-extrabold
        bg-gradient-to-r from-green-600 via-emerald-500 to-green-600
        text-white rounded-full shadow-xl
        hover:scale-105 hover:shadow-2xl transition
      "
    >
      Visit Karaoverse & Join the Movement →
    </a>
  </div>

  {/* Credit */}
  <p
    className="
      mt-6 text-sm sm:text-base text-green-700 opacity-80 font-medium
    "
  >
    Karaoverse was created and engineered by our on-staff software designer
    <span className="font-bold"> Jonathen Whitford </span> of{" "}
    <a
      href="https://jwhitproductions.com"
      className="underline hover:text-green-800 font-semibold"
      target="_blank"
      rel="noopener noreferrer"
    >
      JWhit Productions
    </a>
    .
  </p>

</section>

      {/* ───────────────── Footer Decoration ───────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="pb-20 flex flex-col items-center space-y-3"
      >
        <FaRainbow className="text-5xl text-emerald-500 animate-pulse" />

        <p className="text-sm text-green-700 font-medium italic">
          “Pride never sleeps — and neither does our community.”
        </p>
      </motion.div>
    </div>
  );
}
