// OurSponsorsYellowTemplate.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sponsor from "./Sponsor.jsx";
const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 1; // later: route param

export default function OurSponsorsYellowTemplate() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [showInvitation, setShowInvitation] = useState(false);
  
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
  bg-gradient-to-br 
  from-black 
  via-[#0F2D25] 
  to-[#18453B] 
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
              <Sponsor prideId={PRIDE_ID} />
</div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⭐ Sponsor Intro Header */}
     <section className="relative max-w-full pt-40 mx-auto px-4 pb-24">
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
    <p
      className="
        max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed
        text-yellow-100/90
        bg-black/30 backdrop-blur-sm
        px-6 py-4 rounded-2xl
        border border-yellow-400/30
        shadow-xl
      "
    >
      We proudly honor and offer meaningful benefits to the partners who support
      our mission, uplift our community, and help create safe, inclusive spaces
      for everyone.
    </p>

    {/* CTA Buttons */}
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
      <button
        onClick={() => setShowInvitation(true)}
        className="
          inline-flex items-center justify-center
          px-8 py-3 text-lg font-extrabold tracking-wide
          text-black
          rounded-full
          border-2 border-yellow-300
          bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-600
          hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]
          transition-all duration-300
          neon-pulse
        "
      >
        Become a Sponsor
      </button>

      <button
        onClick={() => navigate("/donate")}
        className="
          inline-flex items-center justify-center
          px-8 py-3 text-lg font-bold tracking-wide
          text-yellow-900
          rounded-full
          border-2 border-yellow-300
          bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-500
          hover:shadow-[0_0_24px_rgba(255,215,0,0.5)]
          transition-all duration-300
        "
      >
        Donate
      </button>
    </div>
  </div>
</section>

<section>

         {/* ⭐ Sponsor Grid */}
{loading ? (
  <p className="text-center text-yellow-300 mt-10">
    Loading sponsors…
  </p>
) : sponsors.length === 0 ? (
  <p className="text-center text-yellow-200 italic mt-10">
    No sponsors have been announced yet.
  </p>
) : (
  <div className="grid grid-cols-1 mt-8 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {sponsors.map((s) => (
      <motion.button
        key={s.id}
        onClick={() => setSelectedSponsor(s)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.99 }}
        className="
          text-left cursor-pointer rounded-3xl p-6
          shadow-lg border-2 transition-all duration-300
          border-yellow-400 bg-yellow-50 hover:shadow-yellow-400/50
        "
      >
        {s.logo_url && (
          <img
            src={s.logo_url}
            alt={s.organization}
            className="w-24 h-24 rounded-2xl object-contain bg-white p-2 shadow-md"
          />
        )}

        <div className="mt-4">
          <h3 className="text-xl font-bold text-yellow-900">
            {s.organization}
          </h3>
          <p className="text-sm font-medium text-yellow-800/80">
            {s.tier}
          </p>
          {/* Booth */}
<p
  className={`mt-1 text-sm font-semibold ${
    s.wants_booth ? "text-green-700" : "text-red-600"
  }`}
>
  🏕 {s.wants_booth ? "Sponsor Booth: Yes" : "No Booth"}
</p>

{/* Website */}
{s.website && (
  <p className="mt-2 text-sm">
    🌐{" "}
    <a
      href={normalizeUrl(s.website)}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="underline text-yellow-700 hover:text-yellow-900"
    >
      Website
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
