// SponsorInvitationPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const SPONSOR_TIERS = [
  {
    name: "Platinum Sponsor 🏳️‍🌈",
    price: "$1,500+",
    perks: [
      "Business card-size ad in brochure",
      "Exclusive sponsorship of a main event (Drag Performance, Band, DJ, etc.)",
      "Logo on stage banner",
      "1 booth space included",
      "2 reserved parking spaces at the park",
      "On-stage recognition during the event",
      "Feature in social media spotlight posts",
      "Inclusion in press releases",
      "Opportunity to make a speech during the event",
    ],
    gradient: "from-yellow-300 via-amber-300 to-yellow-500",
  },
  {
    name: "Gold Sponsor 💖",
    price: "$1,000",
    perks: [
      "Logo ad in brochure (½ the size of a business card)",
      "Logo featured on select signage and social media",
      "Recognition from the stage during the event",
      "Social media spotlight post",
      "1 booth space included",
      "1 reserved parking space at the park",
    ],
    gradient: "from-amber-300 via-yellow-400 to-amber-500",
  },
  {
    name: "Silver Sponsor 💙",
    price: "$500",
    perks: [
      "Business name listed in the brochure",
      "Social media mention as a sponsor",
    ],
    gradient: "from-gray-200 via-gray-300 to-gray-500",
  },
  {
    name: "Custom Sponsorship ✨",
    price: "Variable",
    perks: [
      "Design a sponsorship package tailored to your business",
      "Choose specific event features to support",
      "Perfect for aligning sponsorship with your brand’s mission",
    ],
    gradient: "from-purple-300 via-indigo-300 to-purple-500",
  },
];

export default function SponsorInvitationPage() {
  const [formData, setFormData] = useState({
    organization: "",
    contactName: "",
    email: "",
    phone: "",
    tier: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
const [activeTab, setActiveTab] = useState("tiers"); // "tiers" | "form"

  /* ——— PHONE FORMATTER ——— */
  function formatPhone(value) {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;

    let formatted = "";
    if (match[1]) formatted = `(${match[1]}`;
    if (match[1].length === 3) formatted += `) `;
    if (match[2]) formatted += match[2];
    if (match[2].length === 3) formatted += `-`;
    if (match[3]) formatted += match[3];
    return formatted.slice(0, 14);
  }

  const API_BASE = "https://singspacebackend.onrender.com";

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData({ ...formData, phone: formatPhone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_BASE}/sponsors`, formData);
    setSubmitted(true);
  };

  return (
    <div className=" bg-gradient-to-br from-black via-amber-900 to-yellow-800 text-yellow-50">

      {/* 🌟 HERO SECTION */}

      {/* 🌟 INTRO */}
      <section className="max-w-4xl mx-auto text-center py-6 px-2 space-y-6">
        <h2 className="text-3xl font-bold text-yellow-300">Support. Empower. Celebrate.</h2>
        <p className="text-lg leading-relaxed text-yellow-100">
          Your sponsorship strengthens LGBTQIA+ programs, events, and community support in
          Connecticut. Explore our tier options below and choose a partnership level
          that reflects your commitment to equality and belonging.
        </p>
      </section>
{/* 🌈 TABS */}
<div className="w-full max-w-3xl mx-auto flex justify-center mt-6 mb-10">
  <div className="flex bg-yellow-900/40 border border-yellow-400 rounded-xl overflow-hidden">

    <button
      onClick={() => setActiveTab("tiers")}
      className={`
        px-6 py-3 font-bold text-sm sm:text-base transition
        ${activeTab === "tiers"
          ? "bg-yellow-300 text-black"
          : "text-yellow-200 hover:bg-yellow-800/50"
        }
      `}
    >
      Sponsor Tiers
    </button>

    <button
      onClick={() => setActiveTab("form")}
      className={`
        px-6 py-3 font-bold text-sm sm:text-base transition
        ${activeTab === "form"
          ? "bg-yellow-300 text-black"
          : "text-yellow-200 hover:bg-yellow-800/50"
        }
      `}
    >
      Sponsor Form
    </button>

  </div>
</div>
{activeTab === "tiers" && (
  <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-1 pb-12">

    {/* 🌟 TIERS */}

    {SPONSOR_TIERS.map((tier, i) => (
      <motion.div
        key={tier.name}
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-white/10 border border-yellow-300 shadow-xl space-y-1"
      >
        <div
          className={`w-full py-3 text-center text-yellow-900 font-extrabold text-lg rounded-t-3xl 
                      bg-gradient-to-br ${tier.gradient}`}
        >
          {tier.name}
        </div>

        <p className="text-center text-yellow-300 font-semibold">{tier.price}</p>

        <ul className="text-sm space-y-2 bg-yellow-900/20 p-4 rounded-xl">
          {tier.perks.map((perk) => (
            <li key={perk} className="text-yellow-50">• {perk}</li>
          ))}
        </ul>

      </motion.div>
    ))}
  </section>
)}

      {/* 🌟 SPONSOR FORM */}
{activeTab === "form" && (
  <section className="max-w-3xl mx-auto my p-4 bg-white/10 border border-yellow-400 shadow-2xl">

    <div className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 
                    text-yellow-900 text-center py-4 font-extrabold text-2xl 
                    border-b-4 border-yellow-700 shadow-lg">
      Sponsor Inquiry Form
    </div>

    {!submitted ? (
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-8 space-y-6"
      >
        {/* Input fields */}
        {[
          { field: "organization", label: "Organization", placeholder: "Business / Organization Name" },
          { field: "contactName", label: "Contact Name", placeholder: "Your Name" },
          { field: "email", label: "Email", placeholder: "email@example.com" },
          { field: "phone", label: "Phone", placeholder: "(555) 123-4567" },
        ].map(({ field, label, placeholder }) => (
          <div key={field}>
            <label className="block font-semibold text-yellow-200 mb-1">
              {label}
            </label>

            <input
              name={field}
              required={field !== "phone"}
              placeholder={placeholder}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-3 rounded-none text-center 
                         bg-yellow-950/40 border border-yellow-400 
                         text-yellow-50 focus:ring-2 focus:ring-yellow-300"
            />
          </div>
        ))}

        {/* Tier Dropdown */}
        <div>
          <label className="block font-semibold text-yellow-200 mb-1">
            Sponsor Tier
          </label>
          <select
            name="tier"
            required
            value={formData.tier}
            onChange={handleChange}
            className="w-full p-3 rounded-none text-center 
                       bg-yellow-950/40 border border-yellow-400 
                       text-yellow-50 focus:ring-2 focus:ring-yellow-300"
          >
            <option value="">Select a Tier</option>
            {SPONSOR_TIERS.map((t) => (
              <option key={t.name} value={t.name} className="text-black">
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block font-semibold text-yellow-200 mb-1">
            Message (optional)
          </label>
          <textarea
            name="message"
            rows="4"
            placeholder="Tell us about your goals or questions."
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 rounded-none 
                       bg-yellow-950/40 border border-yellow-400 
                       text-yellow-50 focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-none bg-gradient-to-r 
                     from-yellow-300 via-white to-yellow-300 
                     text-yellow-900 font-extrabold text-lg 
                     shadow-xl hover:scale-105 transition"
        >
          Submit Inquiry
        </button>
      </motion.form>
    ) : (
      <div className="text-center py-8">
        <h3 className="text-3xl font-bold text-yellow-300 mb-3">Thank You! 💛</h3>
        <p className="text-yellow-100">
          Your sponsorship inquiry has been received. Our team will contact you soon!
        </p>
      </div>
    )}
  </section>
)}

      <footer className="text-center text-yellow-200/80 pb-12">
        Empowering community. Celebrating Pride. Thank you for your support.
      </footer>
    </div>
  );
}
