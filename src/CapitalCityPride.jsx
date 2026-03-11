import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SponsorSlider from "./SponsorSlider";
import PublicFundersSection from "./PublicFundersSection";
import VendorSlider from "./VendorSlider";
import AnnualPrideEventDetails from "./AnnualPrideEventDetails";
import PrideItinerary from "./PrideItinerary";

import {
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import SponsorInvitationPage from "./SponsorInvitationPage";

export default function HartfordCityPride() {
  const [showSponsorModal, setShowSponsorModal] = React.useState(false);
  const [prideEvent, setPrideEvent] = useState(null);
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();
const [showIntro, setShowIntro] = useState(true);
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
  const timer = setTimeout(() => {
    setShowIntro(false);
  }, 2000); // 2 seconds

  return () => clearTimeout(timer);
}, []);
  
  const SectionHeader = ({ icon, title, subtitle }) => (
    <div className="text-center mb-4 border-b">
      <h3 className="text-5xl sm:text-6xl font-[Aspire] text-yellow-300 drop-shadow-lg">
        {icon} {title}
      </h3>
      <p className="mt-2 text-yellow-100 font-semibold tracking-wide">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-balck to-slate-700 text-white lg:pt-24 pt-4">
      
      {showIntro && (
  <div
    className="
      fixed inset-0 z-[9999]
      flex items-center justify-center
      bg-black logo-overlay
      transition-opacity duration-1000
      animate-fadeOut 
    "
  >
    <img
      src="/pridelogo22.png"
      alt="Capital City Pride"
      className="w-72 sm:w-96 md:w-[500px] drop-shadow-2xl"
    />
  </div>
)}
      {/* 🌞 HERO SECTION */}
    {/* 🌞 HERO SECTION */}
<section
  className="
    relative text-center py-28
    bg-[url('https://www.vacationer.travel/wp-content/uploads/2023/05/West-Hartford-Pride-1024x768.jpg')]
    bg-cover bg-center
    shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]
  "
>

  {/* dark cinematic overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>

  {/* subtle rainbow glow */}
  <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-500 blur-3xl"></div>

  <div className="relative z-10 max-w-5xl mx-auto px-6">

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
        px-8 py-3
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
          window.location.href = prideEvent
            ? `https://karaoverse.com/events/${prideEvent.slug}`
            : "https://karaoverse.com";
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
        "🌟 June 2026 • Pride Event"
      )}
    </div>

  </div>
</section>


{/* 🌈 OVERVIEW SECTION */}
<section className="relative py-20 bg-gradient-to-b from-black to-slate-900 text-center">

  <div className="max-w-5xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-yellow-300 mb-8">
      Capital City Pride 2026
    </h2>

    {/* Glass card */}
    <div
      ref={scrollRef}
      className="
        backdrop-blur-xl
        bg-white/5
        border border-white/10
        rounded-3xl
        shadow-2xl
        p-8
        text-yellow-100
        text-lg
        leading-relaxed
        max-h-[300px]
        overflow-auto
      "
    >
      The Hartford Pride Center, a program of CLARO, strengthens and sustains
      Connecticut’s LGBTQ+ community through direct services, advocacy,
      and statewide collaboration. We provide housing navigation and
      stabilization support to help individuals secure and maintain safe,
      affirming homes. Our team connects community members to culturally
      responsive physical and mental health care, reduces barriers to services,
      and promotes long-term wellness.
    </div>

  </div>

</section>


{/* 📍 FESTIVAL LOCATION */}
<section className="relative py-10  bg-gradient-to-b from-slate-900 to-black">

  <div className="max-w-4xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-center text-white mb-10">
      Festival Location
    </h2>

    <div
      className="
        relative
        rounded-3xl
        overflow-hidden
        shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]
        border border-white/10
      "
    >
      <iframe
        className="w-full h-[420px]"
        src="https://www.google.com/maps?q=196+Pratt+St,+Hartford,+CT+06103&z=19&output=embed"
        allowFullScreen
        loading="lazy"
      />
    </div>

  </div>

</section>
      {/* 🎭 MAIN FEATURES */}
      <div className=" ">
        <PrideItinerary />
      </div>
            <AnnualPrideEventDetails />

      {/* 🌈 PRIDE PARTNERS SHOWCASE */}
      {/* 🎤 BECOME A PERFORMER */}


      {/* 🌈 PRIDE PARTNER INTRO */}
<section className="relative w-full py-20  overflow-hidden">



  <div className="relative max-w-5xl mx-auto">

    {/* Header */}
    <div className="text-center px-1 mb-10">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-yellow-300 drop-shadow-lg">
        🌈 Why Become a Pride Partner
      </h2>

      <p className="mt-4 text-lg text-yellow-100 max-w-3xl mx-auto leading-relaxed">
        Capital City Pride is designed to elevate queer artists across disciplines —
        visual, literary, performance, drag, and music — while reflecting the
        professionalism, creativity, and cultural leadership of Hartford’s diverse
        LGBTQIA+ community.
      </p>
    </div>

    {/* Card */}
    <div className="
      rounded-none
      p-8 sm:p-10
      border border-white/10
      bg-gradient-to-b from-white via-white to-white/60
      backdrop-blur-xl
      shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]
      text-center
    ">

      <p className="text-black text-lg leading-relaxed max-w-3xl mx-auto mb-8">
        As a <span className="text-blue-800 font-bold">Pride Partner</span>,
        your organization plays a meaningful role in bringing this vision to life.
        Rather than traditional sponsorship or tabling, Pride Partners are
        intentionally integrated into the experience of the event — enriching the
        atmosphere while connecting authentically with the community.
      </p>

      {/* Partner Benefits */}
      <div className="grid md:grid-cols-3 gap-6 text-left">

        <div className="bg-gradient-to-br from-red-500 via-red-700 to-orange-400 rounded-xl p-5 border border-white/10">
          <h4 className="text-lg font-bold text-white mb-2">
            🌟 Celebrate Pride
          </h4>
          <p className="text-yellow-100 font-semibold text-sm leading-relaxed">
            Stand alongside Hartford’s LGBTQ+ community to celebrate artistic
            expression and cultural pride while contributing to storytelling
            throughout the day via our media partners.
          </p>
        </div>


        <div className="bg-gradient-to-br from-green-500 via-green-700 to-green-400 rounded-xl p-5 border border-white/10">
          <h4 className="text-lg font-bold text-white mb-2">
            🎉 Enhance the Experience
          </h4>
          <p className="text-yellow-100 text-sm font-semibold leading-relaxed">
            Help elevate the atmosphere of Pride through thoughtful presence,
            engagement, and creative social activities that add to the festival
            experience.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 via-cyan-700 to-blue-400 rounded-xl p-5 border border-white/10">
          <h4 className="text-lg font-bold text-white mb-2">
            🤝 Show Your Commitment
          </h4>
          <p className="text-yellow-100 font-semibold text-sm leading-relaxed">
    As a Pride Partner, your organization will play a meaningful role in helping bring this vision to
life. Rather than traditional sponsorship or tabling, Pride Partners are intentionally integrated
into the experience of the event, helping to enrich the atmosphere while connecting
authentically with the community.
          </p>
        </div>

      </div>

    </div>

  </div>

</section>
     <section className="relative w-full  py-12 overflow-hidden">


  {/* MAIN CONTENT CONTAINER */}
  <div className="relative max-w-full mx-auto space-y-10">

    {/* 🎤 PERFORMERS */}
    <div className="rounded-none p-8 border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl text-center">

      <img
        src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
        alt="Performer on stage"
        className="w-full max-w-3xl mx-auto rounded-2xl mb-6 border border-white/10 shadow-xl"
      />

      <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-300 mb-3">
        🎤 Are you a Performer?
      </h2>

      <p className="text-yellow-100/90 text-lg max-w-2xl mx-auto mb-6">
        Drag performers, DJs, artists, dancers, and LGBTQIA+ entertainers —
        apply through Karaoverse and showcase your talent at
        <span className="text-yellow-300 font-bold"> Capital City Pride.</span>
      </p>

      <a
        href="https://karaoverse.com/job-postings"
        target="_blank"
        rel="noopener noreferrer"
        className="
        inline-flex items-center gap-2
        px-8 py-3 rounded-2xl
        bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600
        text-white font-extrabold
        shadow-xl
        hover:scale-105 hover:brightness-110
        transition
        "
      >
        Apply on Karaoverse ↗
      </a>

    </div>


    {/* 💛 VOLUNTEERS */}
    <div className="rounded-none p-8 border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl text-center">

      <img
        src="https://main-stream.org/wp-content/uploads/2024/05/call-for-Pride-volunteers-cover-image-770x434-1.jpg"
        alt="Volunteer helping at Pride"
        className="w-full max-w-3xl mx-auto rounded-2xl mb-6 border border-white/10 shadow-xl"
      />

      <h2 className="text-3xl font-extrabold text-yellow-300 mb-3">
        💛 Become a Volunteer
      </h2>

      <p className="text-yellow-100/90 text-lg max-w-2xl mx-auto mb-6">
        Join our volunteer team and help bring Pride to life.
        From stage assistance to community outreach,
        your support helps create an unforgettable celebration.
      </p>

      <button
        onClick={() => navigate("/contact")}
        className="
        px-8 py-3 rounded-2xl
        bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500
        text-black font-extrabold
        shadow-xl
        hover:scale-105 hover:brightness-110
        transition
        "
      >
        Contact Us
      </button>

    </div>


    {/* 🏆 SPONSORS */}
    <div className="rounded-none p-8 border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl text-center">

      <SectionHeader
        icon="🏆"
        title="Sponsors"
        subtitle="Supporting Pride at the highest level"
      />

      <div className="flex justify-center mt-8">
        <SponsorSlider />
      </div>

    </div>


    {/* 🛍️ VENDORS */}
    <div className="rounded-none p-8 border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl text-center">

      <SectionHeader
        icon="🛍️"
        title="Vendors"
        subtitle="Local businesses bringing the magic"
      />

      <div className="flex justify-center mt-8">
        <VendorSlider />
      </div>

    </div>


    {/* 💖 FUNDERS */}
    <div className="rounded-none p-8 border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl text-center">

      <SectionHeader
        icon="💖"
        title="Funders"
        subtitle="Community champions making it happen"
      />

      <div className="flex justify-center mt-8">
        <PublicFundersSection />
      </div>

    </div>

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
      <section className="bg-gradient-to-br from-yellow-900 via-black to-amber-900 text-yellow-200 py-6 border-t-4 border-yellow-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 divide-y lg:divide-y-0 lg:divide-x lg:divide-yellow-700">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold text-yellow-400 border-b-2 border-yellow-400 inline-block mb-2">
              Hartford Pride Center 🌟
            </h3>
            <p className="text-sm font-bold">
              Celebrating identity, community, and love in the heart of
              Connecticut.
            </p>
          </div>

          <div className="text-center lg:text-left lg:px-6">
            <h4 className="text-lg font-semibold text-yellow-100 mb-3">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>
                <Link to="/events" className="hover:text-yellow-300">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="hover:text-yellow-300">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-yellow-300">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center lg:text-left lg:pl-6">
            <h4 className="text-lg font-semibold text-yellow-100 mb-3">
              Connect
            </h4>
            <div className="flex items-center justify-center lg:justify-start gap-4 text-2xl">
              <a
                href="https://www.instagram.com/hartfordpride/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-300"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/SouthHavenLGBTQAdvocacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-300"
              >
                <FaFacebook />
              </a>
              <a
                href="mailto:david@hartfordpridecenter.org"
                className="hover:text-yellow-300"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-yellow-500">
          © {new Date().getFullYear()} Hartford Pride Center - Non Profit
          Organization.
        </div>
      </section>
    </div>
  );
}
