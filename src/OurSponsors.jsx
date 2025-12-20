// OurSponsorsYellowTemplate.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sponsor from "./Sponsor.jsx";
import SponsorInvitationPage from "./SponsorInvitationPage.jsx";
const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2; // later: route param
const PASTEL_GRADIENTS = [
  "from-pink-100 via-rose-100 to-amber-100",
  "from-purple-100 via-indigo-100 to-blue-100",
  "from-emerald-100 via-teal-100 to-cyan-100",
  "from-yellow-100 via-amber-100 to-orange-100",
  "from-sky-100 via-blue-100 to-indigo-100",
  "from-fuchsia-100 via-pink-100 to-rose-100",
];
const MAIN_BANNER_IMAGE =
  "https://www.plannedgiving.com/wp-content/uploads/2023/09/sponsorship.jpg"; // 👈 you will add this



export default function OurSponsorsYellowTemplate() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerImages, setBannerImages] = useState([]);
const [bannerIndex, setBannerIndex] = useState(0);

const tierStyle = (tier) => {
  switch (tier) {

    case "Platinum Sponsor":
      return `
        bg-gradient-to-br
        from-slate-200
        via-slate-300
        to-slate-400
        text-black
        border border-slate-500
        shadow-xl
      `;

    case "Gold Sponsor":
      return `
        bg-gradient-to-br
        from-yellow-500
        via-yellow-400
        to-yellow-600
        text-black
        shadow-lg
        border border-yellow-500
      `;

    case "Silver Sponsor":
      return `
        bg-gradient-to-br
        from-gray-300
        via-gray-100
        to-gray-400
        text-black
        border border-gray-400
      `;

    case "Bronze Sponsor":
      return `
        bg-gradient-to-br
        from-amber-700
        via-amber-600
        to-amber-800
        text-white
        border border-amber-700
      `;

    case "Community Supporter":
      return `
        bg-gradient-to-br
        from-green-700
        via-green-600
        to-green-800
        text-white
        border border-green-700
      `;

    case "In-Kind Sponsor":
      return `
        bg-gradient-to-br
        from-pink-700
        via-pink-600
        to-pink-900
        text-white
        border border-pink-700
      `;

    case "Customized Tier":
      return `
        bg-gradient-to-br
        from-purple-300
        via-purple-200
        to-purple-300
        text-white
        border border-purple-700
      `;

    default:
      return "bg-white text-black";
  }
};


useEffect(() => {
  const logos = sponsors
    .map(s => s.logo_url)
    .filter(Boolean);

  setBannerImages([MAIN_BANNER_IMAGE, ...logos]);
}, [sponsors]);

useEffect(() => {
  if (bannerImages.length === 0) return;

  const interval = setInterval(() => {
    setBannerIndex(i => (i + 1) % bannerImages.length);
  }, 4000);

  return () => clearInterval(interval);
}, [bannerImages]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [showInvitation, setShowInvitation] = useState(false);
  const [invitationMode, setInvitationMode] = useState("form");

  const navigate = useNavigate();
const normalizeUrl = (url) =>
  url?.startsWith("http") ? url : `https://${url}`;

const splitLinks = (text) => {
  if (!text) return [];
  return text
    .split(/[\s,]+/)
    .map((l) => l.trim())
    .filter(Boolean);
};

  // ───────────────────────────────
  // Fetch APPROVED sponsors
  // ───────────────────────────────
useEffect(() => {
  const fetchSponsors = async () => {
    try {
      const res = await axios.get(
        `${API}/api/pride/${PRIDE_ID}/sponsors/approved`
      );
      setSponsors(res.data || []);
    } catch (err) {
      console.error("Failed to load sponsors", err);
    } finally {
      setLoading(false);
    }
  };

  fetchSponsors();
}, []);

  return (
<div className="
  min-h-screen 
bg-gradient-to-br from-indigo-950 via-black to-indigo-800

  text-white
">

      {/* ⭐ SPONSOR INVITATION MODAL */}
      <AnimatePresence>
        {showInvitation && (
          <motion.div
            key="invitationModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setShowInvitation(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto 
                         rounded-3xl bg-yellow-900 shadow-2xl border border-yellow-300"
            >
              <button
                onClick={() => setShowInvitation(false)}
                className="absolute top-4 right-4 text-yellow-200 hover:text-white 
                           text-3xl font-bold"
              >
                ×
              </button>

   <div className="p-1 sm:p-4 relative">

  {/* Extra Close Button INSIDE the modal */}
  <button
    onClick={() => setShowInvitation(false)}
    className="absolute top-2 right-2 text-yellow-200 text-3xl font-bold hover:text-white z-50"
  >
    ×
  </button>
{invitationMode === "form" ? (
  <Sponsor prideId={PRIDE_ID} />
) : (
  <SponsorInvitationPage />
)}
</div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⭐ Sponsor Intro Header */}
     <section className="relative max-w-full pt-32 mx-auto px-4 ">
  {/* Glow Accent */}
  <div className="
    absolute inset-x-0 -top-10 h-24
    bg-gradient-to-br  from-transparent via-yellow-400/30 to-transparent
    blur-2xl pointer-events-none 
  " />
{/* ⭐ Rotating Sponsor Banner */}
{bannerImages.length > 0 && (
  <div className="relative w-full mb-6 shadow-md shadow-white h-[280px] sm:h-[360px] overflow-hidden">
    <AnimatePresence mode="wait">
      <motion.div
        key={bannerIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <img
          src={bannerImages[bannerIndex]}
          alt="Sponsor banner"
          className="
            max-h-full  max-w-full
            object-contain
            drop-shadow-2xl
          "
        />
      </motion.div>
    </AnimatePresence>

    {/* Indigo overlay */}
    <div
      className="
        absolute inset-0
        bg-gradient-to-br
        from-slate-700/70
        via-slate-400/10
        to-slate-900/80
        pointer-events-none
      "
    />
  </div>
)}

  {/* Header Content */}
  <div className="relative max-w-5xl mx-auto text-center">
    {/* Title */}
    <h2
      className="
        text-4xl sm:text-5xl font-extrabold tracking-tight
        bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500
        bg-clip-text text-transparent
        drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]
      "
    >
      Our Sponsors & Community Partners
    </h2>

    {/* Divider */}
<hr className="rainbow-hr" />

    {/* Description */}
  <p className="mt-6 text-lg text-yellow-100/80 leading-relaxed">
    We proudly recognize the partners who support our mission and help create
    safe, inclusive spaces for our community.
  </p>

    {/* CTA Buttons */}
   {/* CTA Buttons */}
<div
  className="
    mt-4
    grid grid-cols-3
    gap-3 sm:gap-4
    max-w-xl mx-auto
  "
>
  {/* Join Sponsors */}
  <button
    onClick={() => {
      setInvitationMode("form");
      setShowInvitation(true);
    }}
    className="
      group
      flex flex-col items-center justify-center
      py-3 sm:py-3
      rounded-none
      bg-white
      border-2 border-yellow-400
      shadow-md
      transition-all duration-300
      hover:-translate-y-0.5
      hover:shadow-yellow-400/40
    "
  >
    <span className="text-sm sm:text-base font-semibold text-slate-900">
      Join
    </span>
    <span className="text-[11px] sm:text-xs text-slate-500">
      Sponsors
    </span>
  </button>

  {/* View Tiers */}
  <button
    onClick={() => {
      setInvitationMode("invite");
      setShowInvitation(true);
    }}
    className="
      group
      flex flex-col items-center justify-center
      py-3 sm:py-4
      rounded-none
      bg-white
      border-2 border-slate-200
      shadow-md
      transition-all duration-300
      hover:-translate-y-0.5
      hover:border-yellow-400
      hover:shadow-yellow-400/30
    "
  >
    <span className="text-sm sm:text-base font-semibold text-slate-900">
      View
    </span>
    <span className="text-[11px] sm:text-xs text-slate-500">
      Tiers
    </span>
  </button>

<a
  href="https://givebutter.com/lgbtqadvocacy"
  target="_blank"
  rel="noopener noreferrer"
  className="
    group
    flex flex-col items-center justify-center
    py-3 sm:py-4
    rounded-none
    bg-white
    border-2 border-slate-200
    shadow-md
    transition-all duration-300
    hover:-translate-y-0.5
    hover:border-yellow-400
    hover:shadow-yellow-400/30
  "
>
  <span className="text-sm sm:text-base font-semibold text-slate-900">
    Donate
  </span>
  <span className="text-[11px] sm:text-xs text-slate-500">
    Support
  </span>
</a>

</div>

  </div>
</section>

<section className="py-24 ">
  {/* Header */}


  {/* States */}
  {loading ? (
    <p className="text-center text-neutral-500 text-sm">
      Loading sponsors…
    </p>
  ) : sponsors.length === 0 ? (
    <p className="text-center text-neutral-500 text-sm italic">
      No sponsors have been announced.
    </p>
  ) : (
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sponsors.map((s) => (
<button
  key={s.id}
  onClick={() => setSelectedSponsor(s)}
  className={`
    relative w-full text-left rounded-xl p-3
    transition-all duration-300 hover:scale-[1.02]
    border-4
    ${
      selectedSponsor?.id === s.id
        ? "scale-[1.03] border-yellow-500 shadow-2xl"
        : "border-black/40"
    }
    ${tierStyle(s.tier)}
  `}
>


            <div className="flex gap-6 items-start">
              {/* Logo */}
              <div className="
                w-20 h-20
                flex items-center justify-center
                
                rounded-lg
                shrink-0
              ">
                {s.logo_url ? (
                  <img
                    src={s.logo_url}
                    alt={s.organization}
                    className="max-w-full max-h-full object-contain p-2"
                  />
                ) : (
                  <span className="text-xs text-neutral-500">
                    No logo
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold font-serif text-black leading-tight">
                  {s.organization}
                </h3>

                <p className="mt-1 text-sm font-bold text-black">
                  Sponsors Tier:{" "} <br/>
                  <span className="text-red-800 font-semibold font-serif">
                    {s.tier}
                  </span>
                </p>

               


              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )}
</section>



      {/* ⭐ Modal */}
 <AnimatePresence>
  {selectedSponsor && (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={() => setSelectedSponsor(null)}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
       className={`
  max-w-2xl w-full rounded-3xl p-[2px]
  border-4
  ${
    selectedSponsor.tier === "Gold Sponsor"
      ? "bg-[linear-gradient(135deg,#d4af37,#f7e27e,#b8860b)] text-black border-yellow-500"
    : selectedSponsor.tier === "Silver Sponsor"
      ? "bg-[linear-gradient(135deg,#ececec,#fbfbfb,#b4b4b4)] text-black border-gray-300"
    : selectedSponsor.tier === "Bronze Sponsor"
      ? "bg-[linear-gradient(135deg,#cd7f32,#e3a36b,#8b5a2b)] border-orange-500"
    : selectedSponsor.tier === "Platinum Sponsor"
      ? "rainbow-border"
    : "bg-gradient-to-br from-slate-700 via-white to-slate-500 border text-black  border-yellow-300"
  }
`}

      >
        <div
          className={`
            rounded-3xl p-8
            ${selectedSponsor.tier === "Platinum Sponsor"
              ? "bg-white/95 text-black"
              : "bg-transparent"
            }
          `}
        >

          {selectedSponsor.logo_url && (
            <img
              src={selectedSponsor.logo_url}
              alt={selectedSponsor.organization}
              className="w-28 h-28 object-contain bg-slate-500 border-black border-2 p-2 rounded-xl mb-4 mx-auto"
            />
          )}

          <h3 className=" font-extrabold font-[Aspire] text-6xl text-center">
            {selectedSponsor.organization}
          </h3>

          <p className="text-xl mt-1 text-center font-bold text-black">
            {selectedSponsor.tier}
          </p>

          {/* Booth */}
          <p
            className={`mt-4 text-center font-semibold ${
              selectedSponsor.wants_booth
                ? "text-green-900"
                : "text-red-900"
            }`}
          >
            🏕 Booth:{" "}
            {selectedSponsor.wants_booth ? "Yes" : "No"}
          </p>
{selectedSponsor.message && (
  <div className="
    mt-6 p-4 rounded-xl
    bg-black/60 text-white text-sm
    leading-relaxed
    max-h-56 overflow-y-auto
    border border-white/20
    shadow-inner
  ">
    <h4 className="text-lg font-bold mb-2 text-yellow-300">
      Sponsor Message
    </h4>
    {selectedSponsor.message}
  </div>
)}

          {/* Website */}
{selectedSponsor.website && (
  <p className="mt-4 text-center">
    🌐{" "}
    <a
      href={normalizeUrl(selectedSponsor.website)}
      target="_blank"
      rel="noreferrer"
      className="underline text-blue-800 hover:text-white font-semibold tracking-wide"
    >
      Visit Website →
    </a>
  </p>
)}

          {/* Social Links */}
          {selectedSponsor.social_links && (
            <div className="mt-6 text-center">
              <p className="font-semibold text-yellow-200 mb-1">
                Social Links
              </p>
              <ul className="space-y-1 text-sm">
                {splitLinks(selectedSponsor.social_links).map((link, i) => (
                  <li key={i}>
                    <a
                      href={normalizeUrl(link)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-blue-800 hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


      <footer className="text-center text-yellow-200/80 pb-10">
        <p className="font-semibold tracking-wide">
          Supporting our mission. Empowering our community.
        </p>
      </footer>
    </div>
  );
}
