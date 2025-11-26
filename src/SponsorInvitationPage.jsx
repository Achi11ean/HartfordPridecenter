// SponsorInvitationPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const SPONSOR_TIERS = [
  {
    name: "Gold Sponsor",
    price: "$2,500+",
    perks: [
      "Top-tier logo placement on all promotional materials",
      "Priority booth location at Pride events",
      "Spotlight social-media thank-you posts",
      "Logo on website homepage with link to business",
      "Stage shout-out at major events",
    ],
    gradient: "from-yellow-300 via-amber-300 to-yellow-500",
  },
  {
    name: "Silver Sponsor",
    price: "$1,000 – $2,499",
    perks: [
      "Business featured higher on website Sponsor page",
      "Thank-you social media shout-out",
      "Event signage recognition",
      "Business included in Pride program guide",
    ],
    gradient: "from-gray-200 via-gray-300 to-gray-500",
  },
  {
    name: "Bronze Sponsor",
    price: "$500 – $999",
    perks: [
      "Logo displayed online on Sponsor page",
      "Included in Pride program listings",
      "Community recognition announcement",
    ],
    gradient: "from-amber-400 via-amber-500 to-amber-600",
  },
  {
    name: "Community Sponsor",
    price: "$100 – $499",
    perks: [
      "(Mo. Plans Available)",
      "Your Business listed on Sponsor page",
      "Thank-you post during Pride week",
    ],
    gradient: "from-yellow-200 via-yellow-300 to-yellow-400",
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
    <div className="min-h-screen bg-gradient-to-br from-black via-amber-900 to-yellow-800 text-yellow-50">

      {/* 🌟 HERO SECTION */}
      <section
        className="relative h-80 md:h-96 bg-cover bg-center flex items-center justify-center border-b-4 border-yellow-400 shadow-2xl"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2400')",
          backgroundPosition: "center 40%",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-4xl md:text-5xl font-extrabold text-center 
                     bg-gradient-to-r from-yellow-300 via-white to-yellow-200 
                     bg-clip-text text-transparent drop-shadow-lg"
        >
          Become a Sponsor
        </motion.h1>
      </section>

      {/* 🌟 INTRO */}
      <section className="max-w-4xl mx-auto text-center py-16 px-2 space-y-6">
        <h2 className="text-3xl font-bold text-yellow-300">Support. Empower. Celebrate.</h2>
        <p className="text-lg leading-relaxed text-yellow-100">
          Your sponsorship strengthens LGBTQIA+ programs, events, and community support in
          Connecticut. Explore our tier options below and choose a partnership level
          that reflects your commitment to equality and belonging.
        </p>
      </section>

      {/* 🌟 TIERS */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-1 pb-20">
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

      {/* 🌟 SPONSOR FORM */}
      <section className="max-w-3xl mx-auto my-16 p-8 bg-white/10 border border-yellow-400 shadow-2xl">

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

      <footer className="text-center text-yellow-200/80 pb-12">
        Empowering community. Celebrating Pride. Thank you for your support.
      </footer>
    </div>
  );
}
