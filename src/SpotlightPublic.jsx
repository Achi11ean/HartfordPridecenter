import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;

export default function SpotlightPublic() {
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/api/pride/${PRIDE_ID}/volunteer-spotlights`)
      .then((res) => setSpotlights(res.data || []))
      .catch((err) => console.error("Failed to load spotlights", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      className="
        py-20 px-4
  
        text-blue-100
      "
    >
      {/* HEADER */}
      <div className="text-center max-w-4xl mx-auto mb-14">
        <h2
          className="
            text-5xl md:text-6xl font-extrabold font-[Aspire]
            bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-400
            bg-clip-text text-transparent
            drop-shadow-[0_6px_16px_rgba(59,130,246,0.45)]
          "
        >
          Volunteer Spotlights
        </h2>
        <p className="mt-4 text-blue-200/80 text-lg">
          Honoring the people who give their time, heart, and light to our
          community.
        </p>
      </div>

      {/* GRID */}
      {loading ? (
        <p className="text-center text-blue-300">Loading spotlights…</p>
      ) : spotlights.length === 0 ? (
        <p className="text-center text-blue-200 italic">
          No volunteer spotlights yet.
        </p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {spotlights.map((v) => (
            <motion.button
              key={v.id}
              onClick={() => setActive(v)}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="
                relative text-left rounded-3xl overflow-hidden
                bg-gradient-to-b from-blue-900/60 via-blue-800/50 to-blue-900/70
                border border-blue-400/30
                shadow-[0_20px_60px_rgba(30,64,175,0.35)]
                hover:shadow-[0_30px_90px_rgba(56,189,248,0.45)]
                transition-all
              "
            >
              {/* IMAGE */}
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={
                    v.image_url ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  }
                  alt={v.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <h3 className="text-2xl font-extrabold text-blue-200">
                  {v.name}
                </h3>

                {v.role && (
                  <p className="text-sm text-cyan-300 font-semibold mt-1">
                    {v.role}
                  </p>
                )}

                {v.years_of_service && (
                  <p className="mt-2 text-xs text-blue-300/80">
                    🌟 {v.years_of_service} year
                    {v.years_of_service > 1 ? "s" : ""} of service
                  </p>
                )}

                <p className="mt-4 text-sm text-blue-100/80 line-clamp-4">
                  {v.bio || "A valued member of our community."}
                </p>

                <div className="mt-4 text-cyan-300 text-sm font-bold">
                  View Spotlight →
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="
                relative w-full max-w-3xl rounded-3xl overflow-hidden
                bg-gradient-to-br from-[#0B1F4B] via-[#0E3A8A] to-[#020617]
                border border-blue-400/40
                shadow-[0_40px_120px_rgba(56,189,248,0.5)]
              "
            >
              {/* IMAGE */}
              <div className="h-72 w-full">
                <img
                  src={
                    active.image_url ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  }
                  alt={active.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-8 text-blue-50">
                <h3 className="text-3xl font-extrabold">
                  {active.name}
                </h3>

                {active.role && (
                  <p className="text-cyan-300 font-semibold mt-1">
                    {active.role}
                  </p>
                )}

                {active.years_of_service && (
                  <p className="mt-2 text-blue-300 text-sm">
                    🌟 {active.years_of_service} year
                    {active.years_of_service > 1 ? "s" : ""} of service
                  </p>
                )}

                <div className="mt-6 max-h-64 overflow-y-auto rounded-2xl bg-white/95 p-5 text-slate-900 leading-7 whitespace-pre-line">
                  {active.bio || "This volunteer prefers to stay humble ✨"}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setActive(null)}
                    className="
                      px-6 py-2.5 rounded-xl font-bold
                      bg-gradient-to-r from-cyan-300 to-blue-400
                      text-black hover:brightness-110
                    "
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
