import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

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

useEffect(() => {
  axios
    .get("https://singspacebackend.onrender.com/karaokeevents/pride/1")
    .then((res) => {
      const events = res.data || [];

      if (!events.length) return;

      // Prefer the next upcoming event with a date
      const upcoming = events.find(e => e.date);

      setPrideEvent(upcoming || events[0]);
    })
    .catch((err) =>
      console.error("Error loading Pride Center events:", err)
    );
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-amber-900 to-yellow-900 text-white pt-24">

      {/* 🌞 HERO SECTION */}
      <section
        className="
          relative text-center py-20 
          bg-[url('https://www.vacationer.travel/wp-content/uploads/2023/05/West-Hartford-Pride-1024x768.jpg')]
          bg-cover bg-center
          shadow-2xl
        "
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <div className="relative z-10 px-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold drop-shadow-lg">
            Hartford <span className="text-yellow-300">City Pride</span>
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-yellow-200 font-semibold">
            The Official Pride Celebration of Hartford, Connecticut
          </p>

          {/* 🌞 CLICKABLE DATE BANNER */}
          <div
            className="
              mt-6 inline-block 
              bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600
              px-6 py-3 
              rounded-none font-bold shadow-xl border-2 border-white
              cursor-pointer hover:opacity-90 transition
              text-black
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
              <>
                🌟{" "}
                {new Date(prideEvent.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                • {prideEvent.city}, {prideEvent.state}
              </>
            ) : (
              "🌟 June 2025 • Downtown Hartford"
            )}
          </div>
        </div>
      </section>

      {/* 🟡 EVENT OVERVIEW */}
      <section className="max-w-4xl mx-auto text-center px-6 py-10">
        <h2 className="text-3xl font-bold text-yellow-300 mb-4">
          The Biggest Pride Event in Hartford
        </h2>

        <p className="text-yellow-100 leading-relaxed text-lg">
          Every June, thousands come together in Hartford to celebrate love,
          identity, diversity, and resilience. The Hartford City Pride Festival
          features live entertainment, vendors, community resources, a massive
          parade, and a celebration that lights up the city.
        </p>
      </section>

      {/* 🎭 MAIN FEATURES */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 py-10">
        <div className="bg-black/60 p-6 rounded-2xl border border-yellow-400/40 shadow-lg">
          <FaCalendarAlt className="text-4xl text-yellow-300 mb-3 mx-auto" />
          <h3 className="text-xl font-bold text-yellow-300 mb-2">
            Festival Highlights
          </h3>
          <ul className="text-yellow-100 text-sm space-y-2">
            <li>• Live performances & drag showcases</li>
            <li>• DJ stages & dance areas</li>
            <li>• 100+ vendors</li>
            <li>• Pride Family Zone</li>
            <li>• Local community orgs & outreach</li>
          </ul>
        </div>

        <div className="bg-black/60 p-6 rounded-2xl border border-yellow-500/40 shadow-lg">
          <FaMapMarkerAlt className="text-4xl text-yellow-300 mb-3 mx-auto" />
          <h3 className="text-xl font-bold text-yellow-300 mb-2">
            Pride Parade
          </h3>
          <ul className="text-yellow-100 text-sm space-y-2">
            <li>• Downtown Hartford route</li>
            <li>• Floats, performers & community groups</li>
            <li>• Accessible viewing zones</li>
            <li>• Parade lineup announced in May</li>
          </ul>
        </div>

        <div className="bg-black/60 p-6 rounded-2xl border border-yellow-300/40 shadow-lg">
          <FaCalendarAlt className="text-4xl text-yellow-300 mb-3 mx-auto" />
          <h3 className="text-xl font-bold text-yellow-300 mb-2">
            Special Events
          </h3>
          <ul className="text-yellow-100 text-sm space-y-2">
            <li>• Pride Kickoff Party</li>
            <li>• Youth Pride Celebration</li>
            <li>• Trans Pride Night</li>
            <li>• Pride After Dark Club Events</li>
          </ul>
        </div>
      </section>

      {/* 🛍️ VENDOR / SPONSOR / VOLUNTEER */}
      <section className="max-w-5xl mx-auto px-6 py-10 space-y-16">

        {/* 🟡 Vendor */}
        <div className="text-center bg-black/40 rounded-xl p-6 border-2 border-yellow-400/60 shadow-xl">
          <h2 className="text-3xl font-bold text-yellow-300 mb-3">
            Become a Vendor
          </h2>

          <p className="text-yellow-100 text-lg mb-6">
            Sell products, food, art, or showcase your organization at one of
            the most attended Pride events in Connecticut.
          </p>

          <Link
            to="/contact"
            className="inline-block px-8 py-3 rounded-none bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600 font-bold text-black border-2 border-white shadow-lg hover:scale-105 transition"
          >
            Apply to Be a Vendor
          </Link>
        </div>

        {/* 🟡 Sponsor */}
        <div className="text-center bg-black/40 rounded-xl p-6 border-2 border-yellow-400/60 shadow-xl">
          <h2 className="text-3xl font-bold text-yellow-300 mb-3">
            Become a Sponsor
          </h2>

          <p className="text-yellow-100 text-lg mb-6">
            Support Hartford City Pride while gaining powerful brand visibility.
            Sponsorship levels include logo placements, stage mentions, parade
            features, and VIP options.
          </p>

          <button
            onClick={() => setShowSponsorModal(true)}
            className="inline-block px-8 py-3 rounded-none bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 font-bold text-black border-2 border-white shadow-lg hover:scale-105 transition"
          >
            View Sponsorship Options
          </button>
        </div>

        {/* 🟡 Volunteer */}
        <div className="text-center bg-black/40 rounded-xl p-6 border-2 border-yellow-400/60 shadow-xl">
          <h2 className="text-3xl font-bold text-yellow-300 mb-3">
            Become a Volunteer
          </h2>

          <p className="text-yellow-100 text-lg mb-6">
            Help us create a safe, joyful, and inclusive Pride experience!
          </p>

          <Link
            to="/volunteer"
            className="inline-block px-8 py-3 rounded-none bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 font-bold text-black border-2 border-white shadow-lg hover:scale-105 transition"
          >
            Sign Up to Volunteer
          </Link>
        </div>
      </section>

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
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-center text-yellow-300 mb-4">
          Festival Location
        </h2>

        <div className="relative w-full pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-500/40">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18..."
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* ⭐ FOOTER — YELLOW THEME */}
      <section className="bg-gradient-to-br from-yellow-900 via-black to-amber-900 text-yellow-200 py-6 border-t-4 border-yellow-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 divide-y lg:divide-y-0 lg:divide-x lg:divide-yellow-700">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold text-yellow-400 border-b-2 border-yellow-400 inline-block mb-2">
              South Haven LGBTQIA+ Advocacy 🌟
            </h3>
            <p className="text-sm font-bold">
              Celebrating identity, community, and love
              in the heart of Connecticut.
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
              <a href="mailto:info@hartfordpridecenter.org" className="hover:text-yellow-300">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-yellow-500">
          © {new Date().getFullYear()} Hartford Pride Center — All Rights Reserved.
        </div>
      </section>
    </div>
  );
}
