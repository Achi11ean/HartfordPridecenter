import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2; // later: route param

export default function OurTeamYellowTemplate() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
const linkifyText = (text) => {
  if (!text) return null;

  const urlRegex =
    /https?:\/\/[^\s]+|(?:www\.)?[a-zA-Z0-9-]+\.(com|net|org|io|co|edu|gov)(\/[^\s]*)?/gi;

  const elements = [];
  let lastIndex = 0;

  for (const match of text.matchAll(urlRegex)) {
    const start = match.index;
    const end = start + match[0].length;

    // Push text before the link
    if (start > lastIndex) {
      elements.push(
        <span key={lastIndex}>
          {text.slice(lastIndex, start)}
        </span>
      );
    }

    const url = match[0];
    const href = url.startsWith("http") ? url : `https://${url}`;

    // Push the link
    elements.push(
      <a
        key={start}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800 break-words"
        onClick={(e) => e.stopPropagation()}
      >
        {url}
      </a>
    );

    lastIndex = end;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    elements.push(
      <span key={lastIndex}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return elements;
};


  // ───────────────────────────────
  // Fetch Admins + Staff
  // ───────────────────────────────
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const [adminsRes, staffRes] = await Promise.all([
          axios.get(`${API}/api/pride/${PRIDE_ID}/admins`),
          axios.get(`${API}/api/pride/${PRIDE_ID}/staff`)
        ]);

const admins = (adminsRes.data || []).map(a => ({
  id: `admin-${a.id}`,
  name: a.name,
  role: a.other_roles
    ? `Administrator • ${a.other_roles}`
    : "Administrator",
  image: a.image_url || "https://cdn-icons-png.flaticon.com/512/847/847969.png",

  // ✅ USE REAL BIO FROM DB
  bio:
    a.bio ||
    "This administrator has not added a public bio yet.",

  style: "border-yellow-400 bg-yellow-50/70 hover:shadow-yellow-400/50",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400')",
}));


        const staff = (staffRes.data || []).map(s => ({
          id: `staff-${s.id}`,
          name: `${s.first_name} ${s.last_name}`,
          role: s.role,
          image:
            s.image_url ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          bio: s.bio || "This team member prefers to keep things mysterious ✨",
          style: "border-yellow-400 bg-yellow-50/70 hover:shadow-yellow-400/50",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=2400')"
        }));

        setTeamMembers([...admins, ...staff]);
      } catch (err) {
        console.error("❌ Failed to load team", err);
      } finally {
        setLoadingTeam(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <div className="
      min-h-screen 
     bg-gradient-to-br
from-black
via-[#0A2540]
to-[#1D4ED8]

      text-white
    ">

      {/* HERO */}
      <div
        className="w-full border-b-4 h-[600px]  bg-cover bg-center relative shadow-2xl"
        style={{
          backgroundImage:
            "url('https://www.bu.edu/files/2023/06/iStock-1356068586-feat-crop-copy.jpg')",
          backgroundPosition: "center 40%",
        }}
      >

      </div>
      <hr className="rainbow-hr" />

<h2
  className="
    pt-4 text-7xl lg:text-8xl
    font-extrabold font-[Aspire] tracking-tight text-center
    relative
    bg-gradient-to-r from-blue-700 via-blue-400 to-blue-900
text-white
    drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]
    border-b-2 border-white/70
    shadow-[inset_0_2px_4px_rgba(255,255,255,0.35)]
  "
>
Our Team 

</h2>
<hr className="rainbow-hr" />

      {/* TEAM */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-20">

        <p className="text-yellow-400 border-2 text-center bg-black/60 max-w-6xl mx-auto mb-10 text-2xl font-bold font-[sans] md:text-5xl leading-relaxed">
          Meet the people who support, organize, and build this Pride community.
        </p>

        {loadingTeam ? (
          <p className="text-center text-yellow-300">Loading team…</p>
        ) : teamMembers.length === 0 ? (
          <p className="text-center text-yellow-200 italic">
            No team members available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map(m => (
              <motion.button
                key={m.id}
                onClick={() => setSelectedMember(m)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                className={`text-left cursor-pointer shadow-yellow-300 shadow-md rounded-3xl p-6 shadow-lg border-2 transition-all duration-300 ${m.style}`}
              >
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-24 h-24 rounded-2xl object-cover shadow-md"
                />

                <div className="mt-4">
                  <h3 className="text-xl border-b font-serif border-[#18453B] font-bold text-[#18453B]">
                    {m.name}
                  </h3>
                  <p className="text-sm font-medium text-[#0F2D25]/80">
                    {m.role}
                  </p>
                </div>

        <p className="mt-4 text-yellow-900/90 bg-white/70 rounded-xl p-3 max-h-40 overflow-y-auto whitespace-pre-line">
  {linkifyText(m.bio)}
</p>

              </motion.button>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-300 bg-yellow-900/60 px-6 py-3 font-semibold hover:bg-yellow-700/70 hover:shadow-lg transition"
          >
            Talk to our team
          </Link>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-yellow-300"
              style={{
                backgroundImage: selectedMember.backgroundImage,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/85 via-yellow-900/75 to-yellow-900/90" />

              <div className="relative p-6 sm:p-10 text-yellow-50">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white/80 shadow-lg"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl sm:text-3xl font-extrabold">
                      {selectedMember.name}
                    </h3>
                    <p className="text-yellow-200 font-medium">
                      {selectedMember.role}
                    </p>
                  </div>
                </div>

          <div className="mt-6 max-h-64 overflow-y-auto rounded-2xl bg-white/90 p-4 text-yellow-900 leading-7 whitespace-pre-line">
  {linkifyText(selectedMember.bio)}
</div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="rounded-xl px-5 py-2.5 font-semibold bg-white text-yellow-900 border border-yellow-300 hover:bg-yellow-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center text-yellow-200/80 pb-10">
        <p className="font-semibold tracking-wide">
          Built with care • Powered by community
        </p>
      </footer>
    </div>
  );
}
