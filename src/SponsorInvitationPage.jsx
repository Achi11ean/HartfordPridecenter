import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateProspect from "./CreateProspect";

const SPONSOR_TIERS = [
  {
    name: "Platinum Sponsor",
    price: "$1,500+",
    perks: [
      "Business card-size ad in brochure",
      "Exclusive sponsorship of a main event",
      "Logo on stage banner",
      "1 booth space included",
      "2 reserved parking spaces",
      "On-stage recognition",
      "Social media spotlight",
      "Press release inclusion",
      "Opportunity to speak during the event",
    ],
    gradient: "from-yellow-300 via-amber-300 to-yellow-500",
  },
  {
    name: "Gold Sponsor",
    price: "$1,000",
    perks: [
      "Logo ad in brochure (½ card size)",
      "Logo on select signage & social media",
      "Stage recognition",
      "Social media spotlight",
      "1 booth space",
      "1 reserved parking space",
    ],
    gradient: "from-amber-300 via-yellow-400 to-amber-500",
  },
  {
    name: "Silver Sponsor",
    price: "$500",
    perks: [
      "Business name listed in brochure",
      "Social media sponsor mention",
    ],
    gradient: "from-slate-200 via-slate-300 to-slate-400",
  },
  {
    name: "Custom Sponsorship",
    price: "Flexible",
    perks: [
      "Custom-built sponsorship package",
      "Align support with your brand values",
      "Ideal for unique or in-kind partnerships",
    ],
    gradient: "from-purple-300 via-indigo-300 to-purple-500",
  },
];

export default function SponsorInvitationPage() {

    const [showConsultation, setShowConsultation] = useState(false);

  return (
    <div className="bg-gradient-to-br from-black via-slate-900 to-slate-800 text-white">

      {/* 🌟 Intro */}
      <section className="max-w-4xl mx-auto text-center py-10 px-4 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-300">
          Sponsorship Opportunities
        </h2>

        <p className="text-lg text-slate-200 leading-relaxed">
          Partner with us to support inclusive, community-driven Pride events.
          Each sponsorship tier offers meaningful visibility and direct impact.
        </p>
      </section>
<footer className="text-center text-slate-400 pb-12 space-y-4">
  <p className="text-sm">
    Interested in sponsoring? Click below to start the conversation.
  </p>

  <button
    onClick={() => setShowConsultation(true)}
    className="
      px-6 py-3 rounded-2xl
      bg-yellow-400 text-black font-extrabold
      hover:bg-yellow-300
      transition
      shadow-lg shadow-yellow-400/30
    "
  >
    📞 Contact Us for a Consultation
  </button>
</footer>

      {/* 🌟 Tiers Grid */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 pb-16">
        {SPONSOR_TIERS.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            viewport={{ once: true }}
            className="
              rounded-3xl
              bg-white/5
              border border-yellow-400/40
              shadow-xl
              overflow-hidden
            "
          >
            {/* Header */}
            <div
              className={`
                text-center py-4 font-extrabold text-lg
                text-black
                bg-gradient-to-br ${tier.gradient}
              `}
            >
              {tier.name}
            </div>

            {/* Price */}
            <p className="text-center text-yellow-300 font-semibold mt-3">
              {tier.price}
            </p>

            {/* Perks */}
            <ul className="mt-4 px-5 pb-6 space-y-2 text-sm text-slate-200">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </section>

      {/* Footer Note */}
<AnimatePresence>
  {showConsultation && (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowConsultation(false)}
    >
      <motion.div
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 30 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="
          max-w-2xl w-full
          bg-slate-900 border border-yellow-400
          rounded-3xl p-6
          text-white
          max-h-[90vh] overflow-y-auto
        "
      >
        <CreateProspect onClose={() => setShowConsultation(false)} />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}
