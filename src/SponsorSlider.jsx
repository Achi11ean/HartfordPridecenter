// SponsorSlider.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2; // 🔒 hard-coded (global Pride)

export default function SponsorSlider({ onSelectSponsor }) {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    console.log("[SponsorSlider] Fetching sponsors for PRIDE_ID:", PRIDE_ID);

    const fetchSponsors = async () => {
      try {
        const res = await axios.get(
          `${API}/api/pride/${PRIDE_ID}/sponsors/approved`
        );

        console.log("[SponsorSlider] Sponsors loaded:", res.data);
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
    <div className="relative w-full overflow-hidden">
      <motion.div
        ref={sliderRef}
        className="flex gap-4 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -1000, right: 0 }}
        whileTap={{ scale: 0.98 }}
      >
        {sponsors.map((s) => (
          <motion.button
            key={s.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectSponsor?.(s)}
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

      {/* Swipe hint */}
      <div className="mt-2 text-center text-[11px] text-neutral-400">
        ← swipe to see more →
      </div>
    </div>
  );
}
