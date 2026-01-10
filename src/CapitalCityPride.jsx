import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SponsorSlider from "./SponsorSlider";
import PublicFundersSection from "./PublicFundersSection";
import VendorSlider from "./VendorSlider";
import AnnualPrideEventDetails from "./AnnualPrideEventDetails";
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

useEffect(() => {
  axios
    .get("https://singspacebackend.onrender.com/karaokeevents/pride/2/annual")
    .then((res) => setPrideEvent(res.data))
    .catch((err) =>
      console.error("Error loading Annual Pride event:", err)
    );
}, []);
const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="text-center mb-10">
    <h3 className="text-5xl sm:text-6xl font-[Aspire] text-yellow-300 drop-shadow-lg">
      {icon} {title}
    </h3>
    <p className="mt-2 text-yellow-100 font-semibold tracking-wide">
      {subtitle}
    </p>
  </div>
);

const RainbowDivider = () => (
  <div className="my-16 h-1 w-full rounded-full bg-gradient-to-r 
    from-red-500 via-orange-400 via-yellow-300 via-green-400 
    via-blue-400 via-purple-500 to-pink-500
    shadow-[0_0_20px_rgba(255,255,255,0.35)]
  " />
);


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
            Capital <span className="text-yellow-300">City Pride</span>
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
              "🌟 June 2026 •  Pride Event"
            )}
          </div>
        </div>
      </section>               <hr className="rainbow-hr" />


      {/* 🟡 EVENT OVERVIEW */}
      <section className="max-w-4xl mx-auto text-center px-2 py-2">
        <h2 className="text-3xl font-bold text-yellow-300 mb-4">
          The Biggest Pride Event <br/> in Hartford
        </h2>

        <p className="text-yellow-100 leading-relaxed text-lg">
          Every June, thousands come together in Hartford to celebrate love,
          identity, diversity, and resilience. The Hartford City Pride Festival
          features live entertainment, vendors, community resources, a massive
          parade, and a celebration that lights up the city.
        </p>
      </section>

      {/* 🎭 MAIN FEATURES */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-1 gap-8 px-2 py-2">


        <div className="bg-black/60 p-2 rounded-2xl border border-yellow-500/40 shadow-lg">
          <FaMapMarkerAlt className="text-4xl text-yellow-300 mb-3 mx-auto" />
          <h3 className="text-xl font-bold text-yellow-300 mb-">
            Pride Itinerary
          </h3>
          <ul className="text-yellow-100 text-sm space-y-2">
            <li>• Pride on Pratt: 11-5pm | Pop up Drag | Street Artists | Signature cocktails | </li>
            <li>• Pride Fest & Concert 5-9pm | On the river front | Neon Dance Party | Food Trucks | Liquor | Live Entertainment</li>
<li>
  • Official After Party: Hosted By{" "}
  <a
    href="https://www.instagram.com/therobinfierce"
    target="_blank"
    rel="noopener noreferrer"
    className="underline text-pink-400 hover:text-pink-300 transition font-semibold"
  >
    Robin Fierce
  </a>{" "}
  @{" "}
  <a
    href="https://www.google.com/maps/search/?api=1&query=Chez%20Est%2C%20458%20Wethersfield%20Ave%2C%20Hartford%2C%20CT"
    target="_blank"
    rel="noopener noreferrer"
    className="underline text-blue-400 hover:text-blue-300 transition font-semibold"
  >
    Chez Est
  </a>{" "}
  10p – 2am
</li>

          </ul>
          <br/>
          <p className="font-[sans] text-xl">In collaboration with: <br/>Pratt St Merchant association </p>
        </div>

       
      </section>

      <AnnualPrideEventDetails />
{/* 🌈 PRIDE PARTNERS SHOWCASE */}
<section className="relative w-full px-2 py-2 overflow-hidden">

  {/* 🌈 Ambient Pride Glow */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500/20 blur-3xl rounded-full" />
    <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-400/20 blur-3xl rounded-full" />
    <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full" />
  </div>

  <div className="relative max-w-7xl mx-auto">

    {/* 🌈 MAIN HEADER */}
    <div className="text-center mb-16">
      <h2 className="
        text-4xl sm:text-5xl md:text-6xl
        font-extrabold
        bg-gradient-to-r from-pink-400 via-yellow-300 to-purple-400
        bg-clip-text text-transparent
        drop-shadow-lg
        mb-4
      ">
         Pride  <br/> Sponsors, Vendors & Community Partners
      </h2>

      <p className="max-w-3xl mx-auto text-yellow-100 text-lg font-semibold">
        Powered by the incredible businesses, creators, and organizations
        who make Pride celebrations possible.
      </p>
    </div>
<div className="text-center mb-4 bg-black/40 rounded-xl p-4 border-2 border-yellow-400/60 shadow-xl">

  {/* 📸 VOLUNTEER IMAGE */}
  <img
    src="https://main-stream.org/wp-content/uploads/2024/05/call-for-Pride-volunteers-cover-image-770x434-1.jpg"
    alt="Pride event volunteer helping at the festival"
    className="
      w-full max-w-xl mx-auto mb-4
      rounded-xl
      border-2 border-yellow-300
      shadow-lg
      object-cover
    "
  />

  <h2 className="text-3xl font-bold text-yellow-300 mb-3">
    Become a Volunteer
  </h2>

  <p className="text-yellow-100 text-lg mb-6">
    Support Capital City Pride by lending a helping hand!
  </p>

  <button
    onClick={() => navigate("/contact")}
    className="
      inline-block px-8 py-3 rounded-xl
      bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600
      font-bold text-black
      border-2 border-white
      shadow-lg
      hover:scale-105 transition
    "
  >
    Contact Us
  </button>

</div>

    {/* 🏆 SPONSORS */}
    <div className="mb-20">
      <SectionHeader
        icon="🏆"
        title="Sponsors"
        subtitle="Supporting Pride at the highest level"
      />
      <SponsorSlider />
    </div>

    <RainbowDivider />

    {/* 🛍️ VENDORS */}
    <div className="my-20">
      <SectionHeader
        icon="🛍️"
        title="Vendors"
        subtitle="Local businesses bringing the magic"
      />
      <VendorSlider />
    </div>

    <RainbowDivider />

    {/* 💖 FUNDERS */}
    <div className="mt-20">
      <SectionHeader
        icon="💖"
        title="Funders"
        subtitle="Community champions making it happen"
      />
      <PublicFundersSection />
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
<section className="max-w-4xl mx-auto px-6 pb-16">
  <h2 className="text-3xl font-bold text-center text-white mb-4">
    Festival Location
  </h2>
               <hr className="rainbow-hr my-4" />

  <div className="relative w-full pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl border-4 border-pink-400">
    <iframe
      className="absolute top-0 left-0 w-full h-full"
      src="https://www.google.com/maps?q=Pratt+Street,+Hartford,+CT&z=17&output=embed"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
</section>


      {/* ⭐ FOOTER — YELLOW THEME */}
      <section className="bg-gradient-to-br from-yellow-900 via-black to-amber-900 text-yellow-200 py-6 border-t-4 border-yellow-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 divide-y lg:divide-y-0 lg:divide-x lg:divide-yellow-700">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold text-yellow-400 border-b-2 border-yellow-400 inline-block mb-2">
              Hartford Pride Center 🌟
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
              <a href="mailto:david@hartfordpridecenter.org" className="hover:text-yellow-300">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-yellow-500">
          © {new Date().getFullYear()} Hartford Pride Center - Non Profit Organization.
        </div>
      </section>
    </div>
  );
}
