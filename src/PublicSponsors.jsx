import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Sponsor from "./Sponsor";
import SponsorInvitationPage from "./SponsorInvitationPage";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 1; // TODO: make dynamic later

export default function PublicSponsors() {
  const [tab, setTab] = useState("sponsors"); // sponsors | tiers | join
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(false);

  // ───────────────────────────────
  // Fetch APPROVED Sponsors ONLY
  // ───────────────────────────────
  const fetchApprovedSponsors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}/api/pride/${PRIDE_ID}/sponsors/approved`
      );
      setSponsors(res.data || []);
    } catch (err) {
      console.error("Failed to load approved sponsors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "sponsors") {
      fetchApprovedSponsors();
    }
  }, [tab]);

  const tabButton = (key, label) => (
    <button
      onClick={() => setTab(key)}
      className={`
        px-6 py-3 rounded-xl font-bold transition
        ${
          tab === key
            ? "bg-yellow-400 text-black shadow-lg"
            : "bg-black/50 text-yellow-200 border border-yellow-500/30"
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div
      className="
        min-h-screen w-full
        bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25]
        text-yellow-100
     py-24
      "
    >
      <div className="max-w-7xl mx-auto">

        {/* ───────────── Header ───────────── */}
        <div className="text-center mb-12">
          <h1 className="text-5xl mt-12 font-extrabold text-yellow-300 mb-3">
            🌈 Sponsors
          </h1>
          <p className="text-yellow-200 max-w-3xl mx-auto">
            Our Pride events and programs are made possible through the
            generosity of community partners and sponsors.
          </p>
        </div>

        {/* ───────────── Tabs ───────────── */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabButton("sponsors", "Sponsors")}
          {tabButton("tiers", "Tiers")}
          {tabButton("join", "Join")}
        </div>

        {/* ───────────── Content ───────────── */}
        <div className="bg-black/60 border border-yellow-500/30 rounded-none  shadow-2xl">

          {/* ───── Proud Sponsors ───── */}
          {tab === "sponsors" && (
            <>
              {loading ? (
                <p className="text-center text-yellow-200">
                  Loading sponsors…
                </p>
              ) : sponsors.length === 0 ? (
                <p className="text-center text-yellow-200 italic">
                  No approved sponsors yet — check back soon!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sponsors.map((s) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="
                        bg-black/50 border border-pink-400/40
                        rounded-2xl p-6 shadow-xl
                        hover:scale-[1.02] transition
                      "
                    >
                      <h3 className="text-2xl font-bold text-pink-300 mb-1">
                        {s.organization}
                      </h3>

                      <span
                        className="
                          inline-block mb-3 px-3 py-1 rounded-full
                          bg-gradient-to-r from-pink-500 to-purple-500
                          text-black text-xs font-bold
                        "
                      >
                        {s.tier}
                      </span>

                      {s.wants_booth && (
                        <p className="text-sm text-green-400 font-semibold mb-2">
                          🏕 Booth Participant
                        </p>
                      )}

                      {s.message && (
                        <p className="text-sm italic text-yellow-200 mb-3">
                          “{s.message}”
                        </p>
                      )}

                      {s.website && (
                        <a
                          href={s.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-blue-400 underline mb-1"
                        >
                          🌐 Website
                        </a>
                      )}

                      {s.social_links && (
                        <p className="text-xs text-yellow-300 break-words">
                          🔗 {s.social_links}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ───── Sponsorship Tiers (read-only reuse) ───── */}
          {tab === "tiers" && (
            <div className="max-w-full">
              {/* IMPORTANT:
                  SponsorInvitationPage ALREADY defines tiers.
                  This view simply renders it without the submit CTA logic.
               */}
              <SponsorInvitationPage mode="tiers-only" />
            </div>
          )}

          {/* ───── Become a Sponsor ───── */}
          {tab === "join" && (
            <div className="max-w-full ">
              <Sponsor prideId={PRIDE_ID} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
