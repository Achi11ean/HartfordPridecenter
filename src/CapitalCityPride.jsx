import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SponsorSlider from "./SponsorSlider";
import PublicFundersSection from "./PublicFundersSection";
import VendorSlider from "./VendorSlider";
import AnnualPrideEventDetails from "./AnnualPrideEventDetails";
import PrideItinerary from "./PrideItinerary";
import { FaPaperPlane } from "react-icons/fa";
import {
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import SponsorInvitationPage from "./SponsorInvitationPage";

export default function HartfordCityPride() {
  const year = new Date().getFullYear();
  const [showSponsorModal, setShowSponsorModal] = React.useState(false);
  const [prideEvent, setPrideEvent] = useState(null);
  const [showMap, setShowMap] = useState(false);
const itineraryRef = React.useRef(null);
const vendorsRef = React.useRef(null);
const talentRef = React.useRef(null);
const sponsorsRef = React.useRef(null);
const handleShare = () => {
  const shareUrl =
    "https://share.karaoverse.com/og/pride";

  if (navigator.share) {
    navigator
      .share({
        title: "Capital City Pride",
        text: "Check out the Capital City Pride Page!",
        url: shareUrl,
      })
      .catch(() => {});
  } else {
    navigator.clipboard.writeText(shareUrl);

    alert("Share link copied to clipboard!");
  }
};
const scrollToSection = (ref) => {
  ref?.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};
  const [hasPublicFunders, setHasPublicFunders] = useState(false);
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();
const [showIntro, setShowIntro] = useState(true);
const [fadeOut, setFadeOut] = useState(false);
const scrollRef = React.useRef(null);
  useEffect(() => {
    axios
      .get("https://singspacebackend.onrender.com/pride/2/annual")
      .then((res) => setPrideEvent(res.data))
      .catch((err) => console.error("Error loading Annual Pride event:", err));
  }, []);

useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;

  const speed = 0.15;
  let animationFrame;
  let paused = false;

  const scroll = () => {
    if (!paused) {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        el.scrollTop = 0;
      } else {
        el.scrollTop += speed;
      }
    }

    animationFrame = requestAnimationFrame(scroll);
  };

  const handleEnter = () => (paused = true);
  const handleLeave = () => (paused = false);

  el.addEventListener("mouseenter", handleEnter);
  el.addEventListener("mouseleave", handleLeave);

  animationFrame = requestAnimationFrame(scroll);

  return () => {
    cancelAnimationFrame(animationFrame);
    el.removeEventListener("mouseenter", handleEnter);
    el.removeEventListener("mouseleave", handleLeave);
  };
}, []);

useEffect(() => {
  axios
    .get("https://singspacebackend.onrender.com/pride/2/annual")
    .then((res) => {
      console.log("🏳️‍🌈 Pride Event API Response:", res.data);
      console.log("📅 Pride Event Date:", res.data?.date);

      setPrideEvent(res.data);
    })
    .catch((err) =>
      console.error("Error loading Annual Pride event:", err)
    );
}, []);
  
  const SectionHeader = ({ icon, title, subtitle }) => (
    <div className="text-center mb-4 ">
      <h3 className="text-5xl sm:text-6xl font-[Aspire] text-yellow-300 drop-shadow-lg">
        {icon} {title}
      </h3>
      <p className="mt-2 text-yellow-100 text-xs font-semibold tracking-wide">
        {subtitle}
      </p>
    </div>
  );

  const RainbowDivider = () => (
    <div
      className="my-16 h-1 w-full rounded-full bg-gradient-to-r 
    from-red-500 via-orange-400 via-yellow-300 via-green-400 
    via-blue-400 via-purple-500 to-pink-500
    shadow-[0_0_20px_rgba(255,255,255,0.35)]
  "
    />
  );
useEffect(() => {
  const fadeTimer = setTimeout(() => {
    setFadeOut(true);
  }, 3000); // show image for 3s

  const removeTimer = setTimeout(() => {
    setShowIntro(false);
  }, 4000); // remove after fade finishes

  return () => {
    clearTimeout(fadeTimer);
    clearTimeout(removeTimer);
  };
}, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-balck to-slate-700 text-white lg:pt-24 pt-4">
{showIntro && (
  <div
    className={`
      fixed inset-0 z-[9999]
      flex items-center justify-center
      bg-black/95
      transition-opacity duration-1000
      ${fadeOut ? "opacity-0" : "opacity-100"}
    `}
  >
<img
  src="/ccp.jpg"
  alt="Pride Logo"
  className={`
    w-[90%] max-w-2xl
    h-auto
    max-h-[80vh]
    object-contain
    rounded-2xl
    shadow-2xl
    transition-opacity duration-1000
    ${fadeOut ? "opacity-0" : "opacity-100"}
  `}
/>
  </div>
)}
      {/* 🌞 HERO SECTION */}
    {/* 🌞 HERO SECTION */}
<section
  className="
    relative text-center py-24
    bg-[url('https://www.vacationer.travel/wp-content/uploads/2023/05/West-Hartford-Pride-1024x768.jpg')]
    bg-cover bg-center
    shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]
  "
>

  {/* dark cinematic overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/60 to-black/80"></div>

  {/* subtle rainbow glow */}

  <div className="relative z-10 max-w-5xl mx-auto ">

    <h1 className="text-5xl sm:text-7xl font-[Aspire] font-bold tracking-wide text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      Capital City <span className="text-yellow-300">Pride</span>
    </h1>

    <p className="mt-4 text-xl text-yellow-100 font-semibold">
      The Official Pride Celebration of Hartford, Connecticut 
    </p>

    {/* Event Date Badge */}
<div
  className="
    mt-8 inline-flex items-center
    bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500
    text-black
    px-8 py-1
    rounded-full
    font-bold
    text-lg
    shadow-[0_10px_40px_rgba(255,215,0,0.5)]
    border border-white/30
    cursor-pointer
    hover:scale-105 hover:brightness-110
    transition
  "
  onClick={() => {
    if (
      window.confirm(
        "You’re being redirected to the full event page on Karaoverse!\n\nContinue?"
      )
    ) {
      window.location.href =
        "https://karaoverse.com/venue/capital-city-pride";
    }
  }}
>
  {prideEvent ? (
    new Date(prideEvent.date + "T00:00:00").toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    )
  ) : (
    "June 2026"
  )}
</div>
{/* QUICK NAV */}

  </div>
 <div
  className="
    absolute

    bottom-4
    left-1/2

    -translate-x-1/2

    z-20

    flex
    flex-wrap

    items-center
    justify-center

    gap-2

    w-full

    px-3
  "
>
  {[
    {
      label: "Itinerary",
      color:
        "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-300/40",
      onClick: () => {
        const el =
          document.getElementById("pride-itinerary");

        if (!el) return;

        const y =
          el.getBoundingClientRect().top +
          window.pageYOffset -
          120;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      },
    },
    {
      label: "Vendors",
      color:
        "bg-gradient-to-r from-green-400 to-emerald-500 text-black border-green-100/40",
      ref: vendorsRef,
    },
    {
      label: "Talent",
      color:
        "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-100/40",
      ref: talentRef,
    },
    {
      label: "Sponsors",
      color:
        "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-blue-100/40",
      ref: sponsorsRef,
    },
  ].map((item) => (
    <button
      key={item.label}
      onClick={() => {
        if (item.onClick) {
          item.onClick();
        } else {
          scrollToSection(item.ref);
        }
      }}
      className={`
        px-3
        py-1.5

        rounded-full

        ${item.color}

        border

        text-[10px]
        sm:text-xs

        font-black
        font-serif

        tracking-[0.08em]

        shadow-lg

        hover:brightness-110
        hover:scale-105

        transition-all
        duration-300
      `}
    >
      {item.label}
    </button>
  ))}
</div>
</section>

       <hr className="rainbow-hr" />


{/* 🌈 OVERVIEW SECTION */}


 
      {/* 🎭 MAIN FEATURES */}
  <div ref={talentRef}></div>
  
            <AnnualPrideEventDetails />

      {/* 🌈 PRIDE PARTNERS SHOWCASE */}
      {/* 🎤 BECOME A PERFORMER */}

       <hr className="rainbow-hr" />

<section
  className="
    relative w-full
    bg-gradient-to-br from-[#ff4fd8] via-[#110012] to-[#5321d9]
    py-6 sm:py-4
    overflow-hidden
    shadow-[inset_0_0_120px_rgba(0,0,0,0.45)]
  "
>
  <div className="absolute -top-20 left-10 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl" />
  <div className="absolute top-24 right-10 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl" />
  <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />

  <div className="relative max-w-7xl mx-auto px-1 sm:px-6 space-y-12">

    {/* 🏆 SPONSORS */}
    <div ref={sponsorsRef}></div>
    <div className="rounded-[2.5rem]  p-1 py-2 sm:p-10 border border-white bg-black/30 backdrop-blur-2xl shadow-[0_25px_100px_-30px_rgba(0,0,0,0.85)] text-center">
      <SectionHeader
        icon="🏆"
        title="Proud Sponsors"
        subtitle="Businesses and organizations powering Pride"
      />

      <div className="w-40 h-1 rounded-full bg-gradient-to-r from-transparent via-yellow-300 to-transparent mx-auto mt-4 mb-2" />

      <div className="flex justify-center">
        <SponsorSlider />
      </div>
    </div>

    {/* 💛 VOLUNTEERS */}
    {/* <div className="rounded-[2.5rem] p-6 sm:p-10 border border-white bg-black/30 backdrop-blur-2xl shadow-[0_25px_100px_-30px_rgba(0,0,0,0.85)]">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <img
          src="https://main-stream.org/wp-content/uploads/2024/05/call-for-Pride-volunteers-cover-image-770x434-1.jpg"
          alt="Volunteer helping at Pride"
          className="w-full rounded-3xl border border-white/10 shadow-xl"
        />

        <div className="text-center md:text-left">
          <h2 className="text-4xl sm:text-5xl font-[Aspire] text-yellow-300 mb-4">
            💛 Become a Volunteer
          </h2>

          <p className="text-yellow-100/85 text-lg leading-relaxed mb-6">
            Help bring Hartford Pride to life. From event support and guest guidance
            to stage operations and outreach, every helping hand creates a stronger celebration.
          </p>

          <button
            onClick={() => navigate("/contact")}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black font-extrabold shadow-xl hover:scale-105 transition"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div> */}
    {/* <div className="rounded-[2.5rem] p-2 sm:p-10 border border-white bg-black/30 backdrop-blur-2xl shadow-[0_25px_100px_-30px_rgba(0,0,0,0.85)]">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left order-2 md:order-1">
          <h2 className="text-4xl border-b sm:text-5xl font-[Aspire] text-purple-300 mb-1">
            Perform with Pride!
          </h2>

          <p className="text-yellow-100/85 text-md leading-relaxed mb-6">
            Drag artists, DJs, musicians, dancers, and LGBTQIA+ entertainers —
            showcase your talent through Karaoverse and become part of South Haven Pride.
          </p>

          <a
            href="https://karaoverse.com/job-postings"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-1 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 text-white font-extrabold shadow-xl hover:scale-105 transition"
          >
            Apply ↗
          </a>
        </div>

        <img
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
          alt="Performer on stage"
          className="w-full rounded-3xl border  shadow-pink-400 shadow-xl order-1 md:order-2"
        />
      </div>
    </div> */}
    {/* 🛍️ VENDORS */}
    <div ref={vendorsRef}></div>
    <div className="rounded-[2.5rem] p-6 sm:p-10 border border-white bg-black/30 backdrop-blur-2xl shadow-[0_25px_100px_-30px_rgba(0,0,0,0.85)] text-center">
      <SectionHeader
        icon="🛍️"
        title="Featured Vendors"
        subtitle="Local businesses bringing food, goods, and colorful experiences"
      />

      <div className="w-40 h-1 rounded-full bg-gradient-to-r from-transparent via-pink-300 to-transparent mx-auto mt-4 mb-2" />

      <div className="flex justify-center">
        <VendorSlider />
      </div>
    </div>

    {/* 🎤 PERFORMERS */}


    {hasPublicFunders && (
  <div className="rounded-[2.5rem] p-6 sm:p-10 border border-white/10 bg-black/30 backdrop-blur-2xl shadow-[0_25px_100px_-30px_rgba(0,0,0,0.85)] text-center">
    <SectionHeader
      icon="💖"
      title="Community Funders"
      subtitle="Champions whose generosity helps make this possible"
    />

    <div className="w-40 h-1 rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent mx-auto mt-4 mb-8" />

    <div className="flex justify-center">
      <PublicFundersSection onHasFunders={setHasPublicFunders} />
    </div>
  </div>
)}

  </div>
</section>
      {/* 🛍️ VENDOR / SPONSOR / VOLUNTEER */}
      {/* ⭐ Sponsor Modal */}
      {showSponsorModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white text-black max-w-3xl w-full max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl border-4 border-yellow-500">
            <button
              onClick={() => setShowSponsorModal(false)}
              className="absolute top-2 right-2 z-50 px-4 py-1 bg-yellow-500 text-black font-bold border-2 border-white shadow hover:bg-yellow-600 transition rounded-md"
            >
              ✖ Close
            </button>

            <div>
              <SponsorInvitationPage />
            </div>
          </div>
        </div>
      )}
      {/* 📍 MAP */}
   
      {/* ⭐ FOOTER — YELLOW THEME */}
  <footer className="relative overflow-hidden border-t border-pink-200">

  {/* PRIDE BACKGROUND */}
  <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-yellow-50 to-cyan-100" />

  <div className="absolute -top-20 -left-10 w-72 h-72 bg-pink-400/30 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute top-12 right-[30%] w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />

  {/* RAINBOW GLOW */}
  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(255,0,128,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,200,255,0.18),transparent_30%)]" />

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">

    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

      {/* ORG */}
      <div>

        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-xl text-pink-500 font-black uppercase tracking-[0.25em] text-xs sm:text-sm">
          🌈 Capital City Pride
        </div>
{/* LOCATION CARD */}
<div className="mt-6">
  <div
    className="
      overflow-hidden
      rounded-[2rem]
      bg-white
      shadow-[0_25px_70px_-25px_rgba(0,0,0,0.35)]
      border border-pink-100
    "
  >

    {/* MAP */}
<button
  onClick={() =>
    window.open(
      "https://www.google.com/maps/search/?api=1&query=Pratt+Street+Hartford+CT",
      "_blank"
    )
  }
  className="
    relative
    w-full
    h-[180px]
    overflow-hidden
    group
  "
>
      <iframe
        className="
          absolute inset-0
          w-full h-full
          pointer-events-none
          scale-110
          group-hover:scale-125
          transition-all
          duration-700
        "
src="https://maps.google.com/maps?q=100%20Pratt%20Street%20Hartford%20CT&t=&z=17&ie=UTF8&iwloc=&output=embed"        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div
        className="
          absolute bottom-3 left-3
          px-3 py-2
          rounded-full
          bg-white/95
          backdrop-blur
          font-black
          text-pink-500
          shadow-lg
        "
      >
        📍 View Location
      </div>
    </button>

    {/* ADDRESS */}
    <a
      href="https://www.google.com/maps/search/?api=1&query=Pratt+Street+Hartford+CT"
      target="_blank"
      rel="noopener noreferrer"
      className="
        block
        p-5
        hover:bg-pink-50/50
        transition-all
      "
    >
      <div className="flex gap-4">

        <div
          className="
            w-12 h-12
            rounded-2xl
            bg-pink-100
            flex items-center justify-center
            text-xl
          "
        >
          📍
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-pink-500 font-black">
            Event Location
          </div>

          <h5 className="text-lg font-black text-gray-900 mt-1">
            Pratt Street
          </h5>

          <p className="text-gray-600 font-semibold">
            Downtown Hartford, Connecticut
          </p>

          <div className="mt-2 text-sm font-black text-cyan-500">
            Open In Google Maps ↗
          </div>
        </div>

      </div>
    </a>

  </div>
</div>

        <h3 className="mt-6 text-3xl sm:text-5xl font-black leading-tight text-gray-900">
          Building LGBTQIA+
          <span className="block text-pink-500">
            Visibility, Joy & Community.
          </span>
        </h3>

        <p className="mt-5 text-gray-700 font-semibold leading-relaxed text-[15px]">
          The Hartford Pride Center exists to uplift, support, empower,
          and connect LGBTQIA+ individuals through advocacy,
          wellness resources, volunteerism, partnerships,
          events, education, and year-round community engagement.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">

          <div className="px-5 py-3 rounded-2xl bg-white shadow-lg font-black text-pink-500 rotate-[-2deg]">
            🏳️‍🌈 Everyone Is Welcome
          </div>

          <div className="px-5 py-3 rounded-2xl bg-white shadow-lg font-black text-cyan-500 rotate-[2deg]">
            ✨ Community Powered
          </div>

        </div>
      </div>

      {/* LINKS */}
      <div>

        <h4 className="text-2xl font-black text-gray-900">
          Explore Hartford Pride
        </h4>

        <div className="mt-6 grid grid-cols-2 gap-3">

          <Link
            to="/about"
            className="rounded-2xl bg-white px-4 py-3 shadow-xl font-black text-pink-500 hover:scale-105 transition text-center"
          >
            About
          </Link>

          <Link
            to="/services"
            className="rounded-2xl bg-white px-4 py-3 shadow-xl font-black text-yellow-500 hover:scale-105 transition text-center"
          >
            Services
          </Link>

          <Link
            to="/events"
            className="rounded-2xl bg-white px-4 py-3 shadow-xl font-black text-cyan-500 hover:scale-105 transition text-center"
          >
            Events
          </Link>

          <Link
            to="/volunteer"
            className="rounded-2xl bg-white px-4 py-3 shadow-xl font-black text-purple-500 hover:scale-105 transition text-center"
          >
            Volunteer
          </Link>

          <Link
            to="/resources"
            className="rounded-2xl bg-white px-4 py-3 shadow-xl font-black text-pink-500 hover:scale-105 transition text-center"
          >
            Resources
          </Link>

          <Link
            to="/contact"
            className="rounded-2xl bg-white px-4 py-3 shadow-xl font-black text-cyan-500 hover:scale-105 transition text-center"
          >
            Contact
          </Link>

          <a
            href="https://givebutter.com/lgbtqadvocacy"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-white px-4 py-3 shadow-xl font-black text-yellow-500 hover:scale-105 transition text-center"
          >
            Donate
          </a>

          <Link
            to="/sponsors"
            className="rounded-2xl bg-white px-4 py-3 shadow-xl font-black text-purple-500 hover:scale-105 transition text-center"
          >
            Sponsors
          </Link>

        </div>
      </div>

      {/* CONTACT */}
      <div>

        <h4 className="text-2xl font-black text-gray-900">
          Stay Connected
        </h4>

        <p className="mt-5 text-gray-700 font-bold leading-relaxed">
          Looking to volunteer, sponsor, collaborate,
          seek support, or get involved in Hartford Pride?
          Reach out and connect with our community.
        </p>

        <div className="mt-6 space-y-3">

          <p className="text-gray-700 font-black">
            📧{" "}
            <a
              href="mailto:david@hartfordpridecenter.org"
              className="underline hover:text-pink-500 transition"
            >
              david@hartfordpridecenter.org
            </a>
          </p>


        </div>

        <div className="mt-7 flex items-center gap-4">

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
<button
  onClick={handleShare}
  className="
    inline-flex items-center gap-2

    rounded-full

    bg-gradient-to-br
    from-green-600
    via-emerald-500
    to-green-900

    px-5 py-1

    border border-white

    text-white
    font-black
    text-sm
    lg:text-base

    hover:scale-105
    transition-all
  "
>
  <FaPaperPlane />
  Share
</button>
        </div>

      </div>

    </div>

    {/* BOTTOM */}
    <div className="mt-16 pt-8 border-t border-pink-200 text-center">

      <p className="text-sm text-gray-600 font-bold">
        © {year} Hartford Pride Center — Celebrating inclusion,
        advocacy, creativity, and LGBTQIA+ community connection.
      </p>

      <p className="mt-2 text-xs text-gray-500 font-semibold">
        Built with pride for Hartford and beyond.
      </p>

    </div>

  </div>
</footer>
    </div>
  );
}
