import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateProspect from "./CreateProspect";

const SPONSOR_TIERS = [
  {
    name: "Platinum ",
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
    gradient: "from-gray-300 via-slate-400 to-gray-300",
  },
  {
    name: "Gold ",
    price: "$1,000",
    perks: [
      "Logo ad in brochure (½ card size)",
      "Logo on select signage & social media",
      "Stage recognition",
      "Social media spotlight",
      "1 booth space",
      "1 reserved parking space",
    ],
    gradient: "from-orange-400 via-yellow-400 to-amber-600",
  },
  {
    name: "Silver ",
    price: "$500",
    perks: [
      "Business name listed in brochure",
      "Social media sponsor mention",
    ],
    gradient: "from-slate-200 via-slate-300 to-slate-400",
  },
  {
    name: "Custom  ",
    price: "Flexible",
    perks: [
      "Custom-built sponsorship package",
      "Align support with your brand values",
      "Ideal for unique or in-kind partnerships",
    ],
    gradient: " from-amber-700 via-amber-600 to-amber-800",
  },
];

export default function SponsorInvitationPage() {

    const [showConsultation, setShowConsultation] = useState(false);

  return (
  <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-800 text-white">

    {/* 🌈 HERO BANNER */}
    <section className="relative mt-24 w-full h-[340px] sm:h-[420px] overflow-hidden">
      <img
        src="https://www.plannedgiving.com/wp-content/uploads/2023/09/sponsorship.jpg"
        alt="Pride sponsorship"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-slate-900" />

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="max-w-4xl text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-yellow-300 drop-shadow">
            Become a Pride Community Sponsor
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 leading-relaxed">
            Join us in uplifting LGBTQ+ voices, creating safe spaces,
            and celebrating Pride through inclusive, community-driven events.
          </p>

          <button
            onClick={() => setShowConsultation(true)}
            className="
              inline-flex items-center gap-2
              px-8 py-4 rounded-2xl
              bg-yellow-400 text-black font-extrabold
              hover:bg-yellow-300
              transition
              shadow-xl shadow-yellow-400/30
            "
          >
            🤝 Start a Sponsorship Conversation
          </button>
        </div>
      </div>
    </section>

    {/* 🌟 INTRO COPY */}
    <section className="max-w-4xl mx-auto text-center py-16 px-4 space-y-6">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-300">
        Sponsorship Opportunities
      </h2>

      <p className="text-lg text-slate-200 leading-relaxed">
        Our sponsorship tiers are designed to create meaningful partnerships.
        Whether you’re a local business or a community organization,
        your support directly fuels Pride programming, outreach,
        and visibility.
      </p>
    </section>

    {/* 🌟 TIERS – STACKED, ELEGANT */}
    <section className="max-w-4xl mx-auto px-4 pb-20 space-y-10">
      {SPONSOR_TIERS.map((tier, i) => (
        <motion.div
          key={tier.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          viewport={{ once: true }}
          className="
            rounded-3xl
            bg-white/5
            border border-yellow-400/40
            shadow-2xl
            overflow-hidden
          "
        >
          {/* Tier Header */}
          <div
            className={`
              text-center py-6 font-extrabold text-xl sm:text-2xl
              text-black
              bg-gradient-to-br ${tier.gradient}
            `}
          >
            {tier.name}
          </div>

          {/* Tier Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <p className="text-center text-yellow-300 font-semibold text-lg">
              {tier.price}
            </p>

            <ul className="space-y-3 text-sm sm:text-base text-slate-200">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex gap-3">
                  <span className="text-yellow-400 mt-0.5">✔</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </section>

    {/* 🌟 FINAL CTA */}
    <footer className="text-center pb-20 px-6 space-y-6">
      <p className="text-slate-300 max-w-2xl mx-auto">
        Interested in partnering with us or creating a custom sponsorship?
        We’d love to collaborate.
      </p>

      <button
        onClick={() => setShowConsultation(true)}
        className="
          px-8 py-4 rounded-2xl
          bg-yellow-400 text-black font-extrabold
          hover:bg-yellow-300
          transition
          shadow-xl shadow-yellow-400/30
        "
      >
        📞 Contact Us for a Consultation
      </button>
    </footer>

    {/* 🌟 CONSULTATION MODAL */}
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
