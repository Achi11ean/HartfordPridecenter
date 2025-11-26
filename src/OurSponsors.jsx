// OurSponsorsBlueTemplate.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SponsorInvitationPage from "./SponsorInvitationPage";
// —— SAMPLE SPONSOR DATA ——
const sponsors = [
  {
    name: "Sunrise Coffee Roasters",
    tier: "Gold Sponsor",
    logo: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800",
    description: `Local coffeehouse supporting inclusive community programs.\n\nThey believe in warm spaces, warm drinks, and warm hearts.`,
    style: "border-yellow-300 bg-yellow-50 hover:shadow-yellow-300/50",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=2400')",
  },
  {
    name: "Unity Financial Group",
    tier: "Silver Sponsor",
    logo: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=800",
    description: `A financial firm committed to equity, access, and supporting LGBTQIA+ empowerment.\n\nProud community partner.`,
    style: "border-yellow-300 bg-yellow-50 hover:shadow-yellow-300/50",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=2400')",
  },
{
  name: "BrightPath Wellness",
  tier: "Community Sponsor",
  logo: "https://media.istockphoto.com/id/1481370371/photo/portrait-of-enthusiastic-hispanic-young-woman-working-on-computer-in-a-modern-bright-office.jpg?s=612x612&w=0&k=20&c=8kNce9Ruc9F2KXvnwf0stWQXCwwQTBCrW8efrqhUIa4=",
  description: `Holistic wellness services with a mission of healing, belonging, and mental health equity.`,
  style: "border-yellow-300 bg-yellow-50 hover:shadow-yellow-300/50",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=2400')",
},
{
  name: "Evergreen Market",
  tier: "Bronze Sponsor",
  logo: "https://images.immediate.co.uk/production/volatile/sites/10/2023/06/2048x1365-Oak-trees-SEO-GettyImages-90590330-b6bfe8b.jpg",
  description: `Neighborhood grocery chain supporting LGBTQ youth initiatives and local arts.`,
  style: "border-yellow-300 bg-yellow-50 hover:shadow-yellow-300/50",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2400')",
},

  {
    name: "Glow Fitness Studio",
    tier: "Gold Sponsor",
    logo: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800",
    description: `Fitness for everybody and every body.\n\nTheir mission: Move, shine, and belong.`,
    style: "border-yellow-300 bg-yellow-50 hover:shadow-yellow-300/50",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1437915015400-137312b61975?q=80&w=2400')",
  },
];

// —— Component ——
export default function OurSponsorsBlueTemplate() {
  const [selectedSponsor, setSelectedSponsor] = useState(null);
const [showInvitation, setShowInvitation] = useState(false);

  return (
    <div className="min-h-screen bg-blue-900 text-blue-50">
      {/* Hero */}
 

{/* ⭐ SPONSOR INVITATION MODAL */}
<AnimatePresence>
  {showInvitation && (
    <motion.div
      key="invitationModal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center"
      onClick={() => setShowInvitation(false)}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto
                   rounded-3xl bg-blue-900 shadow-2xl border border-yellow-300"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowInvitation(false)}
          className="absolute top-4 right-4 text-yellow-200 hover:text-white 
                     text-3xl font-bold"
        >
          ×
        </button>

        {/* Render your sponsor invitation page inside */}
        <div className="p-1 sm:p-4">
          <SponsorInvitationPage />
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* Sponsor grid */}
      <section className="max-w-6xl mx-auto px-4  pb-20">
  <p
  className="
    max-w-4xl mx-auto mb-6  px-2 
    text-center text-2xl font-extrabold tracking-wide
    bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500
    text-black shadow-[0_4px_12px_rgba(0,0,0,0.25)]
    border-b-4 border-black
    rounded-none
  "
>
  We proudly honor and offer benefits/perks to thank the partners who support our mission and give back to the community.
</p>
     <div className="text-center">
  <button
    onClick={() => setShowInvitation(true)}
    className="inline-flex items-center gap-2 py-2 rounded-none border-2 border-yellow-300 
               bg-blue-800/60 px-4 text-black font-mono neon-pulse font-bold  bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-700  hover:bg-blue-700/70 
               hover:shadow-lg transition"
  >
     <span className="bg-white/40 px-4  ">Become a Sponsor!</span> 
  </button>
</div>

        <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((s, i) => (
            <motion.button
              key={s.name}
              onClick={() => setSelectedSponsor(s)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              className={`text-left cursor-pointer rounded-3xl p-6 shadow-lg border-2 transition-all duration-300 ${s.style}`}
            >
              <img
                src={s.logo}
                alt={s.name}
                className="w-24 h-24 rounded-2xl object-cover shadow-md"
              />
              <div className="mt-4">
                <h3 className="text-xl font-bold text-blue-900">
                  {s.name}
                </h3>
                <p className="text-sm font-medium text-blue-700/80">
                  {s.tier}
                </p>
              </div>
              <p className="mt-4 text-blue-900/80 bg-white/70 rounded-xl p-3 max-h-40 overflow-y-auto whitespace-pre-line">
                {s.description}
              </p>
            </motion.button>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-300 bg-blue-800/60 px-6 py-3 font-semibold hover:bg-blue-700/70 hover:shadow-lg transition"
          >
            Become a Sponsor
          </Link>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedSponsor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setSelectedSponsor(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-yellow-200"
              style={{
                backgroundImage: selectedSponsor.backgroundImage,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/85 via-blue-900/75 to-blue-900/90" />
              <div className="relative p-6 sm:p-10 text-blue-50">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <img
                    src={selectedSponsor.logo}
                    alt={selectedSponsor.name}
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white/80 shadow-lg"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl sm:text-3xl font-extrabold">
                      {selectedSponsor.name}
                    </h3>
                    <p className="text-yellow-200 font-medium">
                      {selectedSponsor.tier}
                    </p>
                  </div>
                </div>

                <div className="mt-6 max-h-64 overflow-y-auto rounded-2xl bg-white/90 p-4 text-blue-900 leading-7 whitespace-pre-line">
                  {selectedSponsor.description}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedSponsor(null)}
                    className="rounded-xl px-5 py-2.5 font-semibold bg-white text-blue-900 border border-yellow-200 hover:bg-blue-50"
                  >
                    Close
                  </button>
                  <Link
                    to="/contact"
                    className="rounded-xl px-5 py-2.5 font-semibold bg-yellow-200/90 text-blue-900 hover:bg-yellow-200"
                  >
                    Partner With Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center text-blue-200/80 pb-10">
        <p className="font-semibold tracking-wide">Supporting our mission. Empowering our community.</p>
      </footer>
    </div>
  );
}
