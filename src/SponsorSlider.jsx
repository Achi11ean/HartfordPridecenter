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
      <div className="relative w-full overflow-hidden">
<motion.div
  ref={sliderRef}
  className={`flex gap-4 ${
    isSingleSponsor
      ? "justify-center cursor-default"
      : "cursor-grab active:cursor-grabbing"
  }`}
  drag={isSingleSponsor ? false : "x"}
  dragConstraints={isSingleSponsor ? undefined : { left: -1000, right: 0 }}
  whileTap={isSingleSponsor ? undefined : { scale: 0.98 }}
>

          {sponsors.map((s) => (
            <motion.button
              key={s.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSponsor(s)}
              className="
                min-w-[160px] sm:min-w-[200px]
                bg-white/90
                border border-yellow-300
                rounded-xl
                p-4
                shadow-md
                text-center
                flex flex-col items-center justify-center
              "
            >
              {s.logo_url ? (
                <img
                  src={s.logo_url}
                  alt={s.organization}
                  className="h-16 w-auto object-contain mb-2"
                />
              ) : (
                <div className="h-16 flex items-center text-xs text-neutral-500">
                  No Logo
                </div>
              )}

              <p className="text-sm font-bold text-black leading-tight">
                {s.organization}
              </p>

              <p className="text-[11px] text-neutral-600 mt-1">
                {s.tier}
              </p>
            </motion.button>
          ))}
        </motion.div>

     {!isSingleSponsor && (
  <div className="mt-2 text-center text-[18px] text-black">
    ← swipe to see more →
  </div>
)}

          <div className="text-center mt-4 bg-black/40 rounded-xl p-2 border-2 border-yellow-400/60 shadow-xl">
          <h2 className="text-3xl font-bold text-yellow-300 mb-3">
            Become a Sponsor
          </h2>

          <p className="text-yellow-100 text-lg mb-6">
            Support Hartford City Pride while gaining powerful brand visibility.
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
