// OurSponsorsYellowTemplate.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sponsor from "./Sponsor.jsx";
import SponsorInvitationPage from "./SponsorInvitationPage.jsx";
const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 1; // later: route param

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
     <section className="relative max-w-full pt-40 mx-auto px-4 pb-8">
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
    <div className="mt-6 mb-6 flex justify-center">
      <div className="h-1 w-32 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 rounded-full shadow-lg" />
    </div>

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

<section className="">
<h1 className="text-4xl font-serif text-yellow-400 font- border-b mb-6">Active Sponsors</h1>
  {/* ⭐ Sponsor Grid */}
  {loading ? (
    <p className="text-center text-slate-500 mt-10 text-sm tracking-wide">
      Loading sponsors…
    </p>
  ) : sponsors.length === 0 ? (
    <p className="text-center text-slate-500 italic mt-10 text-sm">
      No sponsors have been announced yet.
    </p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {sponsors.map((s) => (
        <motion.button
          key={s.id}
          onClick={() => setSelectedSponsor(s)}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          className="
            group w-full text-left
            rounded-none p-6 shadow-yellow-400 shadow-md
            bg-white
            border-2  border-yellow-400
            hover:border-slate-300
            transition-all duration-300
          "
        >
          {/* Logo */}
          {s.logo_url && (
            <div className="flex justify-center">
              <div className="
                w-24 h-24
                flex items-center justify-center
                bg-slate-50
                rounded-xl
                 border-black border shadow-green-700 shadow-md
              ">
                <img
                  src={s.logo_url}
                  alt={s.organization}
                  className="max-w-full max-h-full object-contain p-2"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="mt-5 text-center">
            <h3 className="text-lg underline font-semibold text-slate-900 leading-tight">
              {s.organization}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {s.tier}
            </p>

            {/* Divider */}
            <div className="my-4 h-px bg-slate-200" />

            {/* Booth */}
            <p
              className={`text-md font-medium ${
                s.wants_booth
                  ? "text-emerald-700"
                  : "text-slate-500"
              }`}
            >
              Booth: {s.wants_booth ? "Included" : "Not Included"}
            </p>

            {/* Website */}
            {s.website && (
              <p className="mt-3 text-sm">
                <a
                  href={normalizeUrl(s.website)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="
                    inline-flex items-center gap-1
                    font-medium text-blue-700
                    hover:text-slate-900
                    underline underline-offset-4
                  "
                >
                  Visit website
                </a>
              </p>
            )}
          </div>
        </motion.button>
      ))}
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
