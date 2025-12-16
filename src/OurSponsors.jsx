// OurSponsorsYellowTemplate.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sponsor from "./Sponsor.jsx";
import SponsorInvitationPage from "./SponsorInvitationPage.jsx";
const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 1; // later: route param
const PASTEL_GRADIENTS = [
  "from-pink-100 via-rose-100 to-amber-100",
  "from-purple-100 via-indigo-100 to-blue-100",
  "from-emerald-100 via-teal-100 to-cyan-100",
  "from-yellow-100 via-amber-100 to-orange-100",
  "from-sky-100 via-blue-100 to-indigo-100",
  "from-fuchsia-100 via-pink-100 to-rose-100",
];

export default function OurSponsorsYellowTemplate() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
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
 bg-[#0B1F1A]

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
    bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent
    blur-2xl pointer-events-none
  " />

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

  {/* Donate */}
  <button
    onClick={() => navigate("/donate")}
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
  </button>
</div>

  </div>
</section>

<section className="py-24 ">
  {/* Header */}
  <div className="max-w-6xl mx-auto px-6 mb-6">
    <h1 className="text-4xl font-semibold tracking-tight text-white">
      Sponsors
    </h1>
    <p className="mt-3 max-w-xl font-bold text-sm text-neutral-400">
      Organizations providing direct support for programming, infrastructure,
      and community initiatives.
    </p>
    <div className="mt-6 h-px w-full bg-neutral-800" />
  </div>

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
            className="
              w-full text-left
              border border-neutral-800
              rounded-xl
              p-2
              hover:border-neutral-700
              transition-colors
            "
          >
            <div className="flex gap-6 items-start">
              {/* Logo */}
              <div className="
                w-20 h-20
                flex items-center justify-center
                border border-neutral-800
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
                <h3 className="text-lg font-bold font-serif text-white leading-tight">
                  {s.organization}
                </h3>

                <p className="mt-1 text-sm text-neutral-400">
                  Sponsorship Tier:{" "}
                  <span className="text-neutral-300">
                    {s.tier}
                  </span>
                </p>

                <p className="mt-3 text-sm text-neutral-500">
                  Booth Access:{" "}
                  <span className="text-neutral-300">
                    {s.wants_booth ? "Included" : "Not included"}
                  </span>
                </p>

                {s.website && (
                  <a
                    href={normalizeUrl(s.website)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="
                      inline-block mt-4
                      text-sm font-medium
                      text-white
                      underline underline-offset-4
                      hover:text-neutral-300
                    "
                  >
                    Visit organization website
                  </a>
                )}
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
        className="bg-gradient-to-br from-slate-700 via-black to-slate-500 rounded-3xl p-8 border border-yellow-300 max-w-2xl w-full"
      >
        {selectedSponsor.logo_url && (
          <img
            src={selectedSponsor.logo_url}
            alt={selectedSponsor.organization}
            className="w-28 h-28 object-contain bg-white p-2 rounded-xl mb-4"
          />
        )}

        <h3 className="text-3xl font-extrabold">
          {selectedSponsor.organization}
        </h3>

        <p className="text-yellow-200">{selectedSponsor.tier}</p>
{/* Booth */}
<p
  className={`mt-2 font-semibold ${
    selectedSponsor.wants_booth ? "text-green-400" : "text-red-400"
  }`}
>
  🏕 Booth: {selectedSponsor.wants_booth ? "Has Booth" : "No Booth"}
</p>

{/* Website */}
{selectedSponsor.website && (
  <p className="mt-3">
    🌐{" "}
    <a
      href={normalizeUrl(selectedSponsor.website)}
      target="_blank"
      rel="noreferrer"
      className="underline text-yellow-300 hover:text-white"
    >
      {selectedSponsor.website}
    </a>
  </p>
)}

{/* Social Links */}
{selectedSponsor.social_links && (
  <div className="mt-3">
    <p className="font-semibold text-yellow-200">Social</p>
    <ul className="list-disc list-inside space-y-1">
      {splitLinks(selectedSponsor.social_links).map((link, i) => (
        <li key={i}>
          <a
            href={normalizeUrl(link)}
            target="_blank"
            rel="noreferrer"
            className="underline text-yellow-300 hover:text-white"
          >
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
)}

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
