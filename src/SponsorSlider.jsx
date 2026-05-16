import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaGlobe } from "react-icons/fa";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2; // 🔒 hard-coded (global Pride)

export default function SponsorSlider() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSponsor, setActiveSponsor] = useState(null);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
const [dragLimit, setDragLimit] = useState(0);
const isSingleSponsor = sponsors.length === 1;

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await axios.get(
          `${API}/api/pride/${PRIDE_ID}/sponsors/approved`
        );
        setSponsors(res.data || []);
      } catch (err) {
        console.error("[SponsorSlider] Failed to load sponsors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);
useEffect(() => {
  const calculateDrag = () => {
    if (!sliderRef.current || !containerRef.current) return;

    const totalWidth = sliderRef.current.scrollWidth;
    const visibleWidth = containerRef.current.offsetWidth;

    const maxDrag = totalWidth - visibleWidth;

    setDragLimit(maxDrag > 0 ? maxDrag : 0);
  };

  calculateDrag();
  window.addEventListener("resize", calculateDrag);

  return () => window.removeEventListener("resize", calculateDrag);
}, [sponsors]);
  if (loading) {
    return (
      <p className="text-center text-sm text-neutral-400">
        Loading sponsors…
      </p>
    );
  }

  if (sponsors.length === 0) {
    return (
      <p className="text-center text-sm text-neutral-400 italic">
        No sponsors announced yet.
      </p>
    );
  }

  return (
    <>
      {/* ================= SLIDER ================= */}
<div
  ref={containerRef}
  className="
    relative
    w-full
    overflow-hidden
    px-2 sm:px-4
  "
>
<motion.div
  ref={sliderRef}
  className={`
    flex
    w-max
    gap-5
    py-4

    ${
      isSingleSponsor
        ? "justify-center cursor-default"
        : "cursor-grab active:cursor-grabbing"
    }
  `}
    drag={isSingleSponsor ? false : "x"}
    dragConstraints={
      isSingleSponsor
        ? undefined
        : {
            left: -Math.max(dragLimit, 0),
            right: 0,
          }
    }
    dragElastic={0.06}
    whileTap={
      isSingleSponsor
        ? undefined
        : { cursor: "grabbing" }
    }
  >

    {sponsors.map((s) => (
      <motion.button
        key={s.id}
        whileHover={{
          scale: 1.04,
          y: -4,
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveSponsor(s)}
        className="
          group
          relative
          overflow-hidden

          flex-shrink-0

          w-[320px]
          sm:w-[320px]

          h-[200px]
          sm:h-[220px]

          rounded-3xl

          shadow-[0_10px_40px_rgba(0,0,0,0.65)]

          transition-all
          duration-500
        "
      >

    {/* BACKGROUND IMAGE */}
    {s.logo_url ? (
      <img
        src={s.logo_url}
        alt={s.organization}
        className="
          absolute inset-0
          w-full h-full
          object-cover

          transition-transform
          duration-700

          group-hover:scale-110
        "
      />
    ) : (
      <div
        className="
          absolute inset-0
          bg-gradient-to-br
          from-neutral-900
          via-black
          to-neutral-800
        "
      />
    )}

    {/* DARK OVERLAY */}
    <div
      className="
        absolute inset-0

        bg-gradient-to-t
        from-black
        via-black/40
        to-black/10
      "
    />

    {/* GLOW */}
    <div
      className="
        absolute inset-0
        opacity-0
        group-hover:opacity-100

        transition duration-700

        bg-gradient-to-br
        from-yellow-400/10
        via-transparent
        to-fuchsia-500/20
      "
    />

    {/* SPONSOR TIER */}
    <div
      className="
        absolute top-3 right-3
        z-20

        px-3 py-1

        rounded-full

        backdrop-blur-xl

        bg-black/60

        border border-white/20

        text-white
        text-[10px]
        sm:text-xs
        font-black
        uppercase
        tracking-[0.2em]

        shadow-lg
      "
    >
      {s.tier}
    </div>

    {/* TITLE */}
    <div
      className="
        absolute bottom-0 left-0 right-0
        z-20

        p-4 sm:p-5

        flex items-end justify-end
      "
    >
      <h3
        className="
          text-right

          text-white
          font-black

          text-lg
          sm:text-2xl

          leading-tight

          drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]

          max-w-[85%]

          group-hover:text-yellow-200

          transition-all
          duration-300
        "
      >
        {s.organization}
      </h3>
    </div>

  </motion.button>
))}        </motion.div>

     {!isSingleSponsor && (
  <div className="mt-2 text-center text-[18px] text-white">
    ← swipe to see more →
  </div>
)}

          <div className="text-center mt-4 p-2  shadow-xl">
          <h2 className="text-3xl font-bold text-yellow-300 border-b mb-1">
            Become a Sponsor
          </h2>

          <p className="text-yellow-100 text-sm mb-2">
            Support South Haven Pride while gaining powerful brand visibility.
          </p>

<button
  onClick={() => navigate("/sponsorinvitation")}
  className="
    inline-block px-8 py-3 rounded-xl
    bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600
    font-bold text-black
    border-2 border-white
    shadow-lg
    hover:scale-105 transition
  "
>
  Sponsorship Options
</button>

        </div>

      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {activeSponsor && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="
                relative max-w-2xl w-full
                bg-gradient-to-br from-black via-amber-900 to-yellow-900
                border-4 border-yellow-400
                rounded-3xl shadow-2xl
                text-yellow-100
                p-6
              "
            >
              {/* CLOSE */}
              <button
                onClick={() => setActiveSponsor(null)}
                className="absolute top-3 right-3 text-yellow-300 hover:text-white transition"
              >
                <FaTimes size={22} />
              </button>

              {/* LOGO */}
              <div className="flex justify-center mb-6">
                {activeSponsor.logo_url ? (
                  <img
                    src={activeSponsor.logo_url}
                    alt={activeSponsor.organization}
                    className="max-h-32 object-contain rounded-xl bg-white p-4"
                  />
                ) : (
                  <div className="px-6 py-4 bg-white text-black font-black rounded-xl">
                    {activeSponsor.organization}
                  </div>
                )}
              </div>

              {/* NAME */}
              <h2 className="text-3xl font-black text-center mb-1">
                {activeSponsor.organization}
              </h2>

              {/* TIER */}
              <p className="text-center text-lg font-bold text-yellow-300 mb-4">
                {activeSponsor.tier} Sponsor
              </p>

              {/* MESSAGE / NOTES */}
              {(activeSponsor.message ||
                activeSponsor.additional_notes) && (
                <div className="bg-black/50 border border-yellow-400/40 rounded-xl p-4 mb-5">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {activeSponsor.message ||
                      activeSponsor.additional_notes}
                  </p>
                </div>
              )}

              {/* LINKS */}
              <div className="flex flex-wrap justify-center gap-3">
                {activeSponsor.website && (
                  <a
                    href={activeSponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center gap-2
                      px-4 py-2 rounded-xl
                      bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600
                      text-black font-bold
                      hover:brightness-110 transition
                    "
                  >
                    <FaGlobe /> Visit Website
                  </a>
                )}

                {activeSponsor.social_links &&
                  activeSponsor.social_links
                    .split(",")
                    .map((link, i) => (
                      <a
                        key={i}
                        href={link.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          px-4 py-2 rounded-xl
                          border border-yellow-400
                          text-yellow-200
                          hover:bg-yellow-400/20 transition
                        "
                      >
                        Social Link
                      </a>
                    ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
