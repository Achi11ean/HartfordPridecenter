import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaRainbow, FaHandsHelping, FaGlobeAmericas } from "react-icons/fa";

export default function Donate() {
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 800);
  };

  const tiers = [
    {
      title: "Community Ally",
      amount: "$25",
      icon: <FaHandsHelping className="text-pink-400 text-4xl" />,
      desc: "Helps us provide LGBTQ+ resource materials and support groups for youth and adults.",
    },
    {
      title: "Equality Advocate",
      amount: "$50",
      icon: <FaRainbow className="text-purple-400 text-4xl" />,
      desc: "Funds educational workshops, outreach programs, and public awareness campaigns.",
    },
    {
      title: "Pride Champion",
      amount: "$100",
      icon: <FaGlobeAmericas className="text-teal-400 text-4xl" />,
      desc: "Supports large-scale Pride events and initiatives that amplify queer voices statewide.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 text-white">
      {/* Hero Section */}
      <section
        className="relative h-80 md:h-96 flex items-center justify-center bg-cover bg-center border-b-4 border-pink-400 shadow-2xl"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=2400&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-transparent" />
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-5xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg"
        >
          Support the Center 💖
        </motion.h1>
      </section>

      {/* Mission Statement */}
      <section className="max-w-5xl mx-auto text-center py-14 px-6 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-pink-300">
          Your Gift Empowers Love, Equality & Community
        </h2>
        <p className="text-lg text-gray-200 leading-relaxed">
          Every dollar you give helps the{" "}
          <span className="font-semibold text-pink-400">
            South Haven LGBTQIA+ Advocacy
          </span>{" "}
          continue providing critical programs, safe spaces, and resources for
          the LGBTQIA+ community in Connecticut. Together, we create lasting
          impact — one act of kindness at a time.
        </p>
      </section>

      {/* Donation Tiers */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 mb-16">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6 bg-white/10 border border-white/20 shadow-lg backdrop-blur-sm hover:shadow-pink-400/40 transition"
          >
            <div className="flex justify-center mb-4">{tier.icon}</div>
            <h3 className="text-2xl font-bold text-center text-pink-200 mb-1">
              {tier.title}
            </h3>
            <p className="text-center text-xl font-extrabold text-white mb-3">
              {tier.amount}
            </p>
            <p className="text-sm text-gray-200 text-center">{tier.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Donation Form */}
      <section className="max-w-3xl mx-auto mb-20 bg-white/10 border border-pink-400 rounded-2xl shadow-xl p-8 backdrop-blur-sm">
        <h3 className="text-2xl font-extrabold text-center mb-6 text-pink-300 underline ">
          Make a Donation
        </h3>

        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1 text-pink-100 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full p-3 rounded-xl bg-purple-900/60 text-white border border-pink-400 focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-pink-100 font-semibold">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full p-3 rounded-xl bg-purple-900/60 text-white border border-pink-400 focus:ring-2 focus:ring-teal-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-pink-100 font-semibold">
                Donation Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter your amount (e.g. 25)"
                required
                className="w-full p-3 rounded-xl bg-purple-900/60 text-white border border-pink-400 focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-pink-100 font-semibold">
                Message (optional)
              </label>
              <textarea
                rows="3"
                className="w-full p-3 rounded-xl bg-purple-900/60 text-white border border-pink-400 focus:ring-2 focus:ring-pink-300"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 rounded-xl font-bold text-lg text-white shadow-lg transition"
            >
              Donate Now
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <h4 className="text-3xl font-bold text-green-300 mb-3">
              🌈 Thank You for Your Support!
            </h4>
            <p className="text-lg text-gray-100">
              Your donation helps sustain programs and create a brighter,
              more inclusive future for our community.
            </p>
          </motion.div>
        )}
      </section>

      {/* Footer CTA */}
      <div className="text-center pb-16">
        <p className="text-lg text-gray-300 mb-4">
          Prefer to give another way? You can also donate via Venmo or check.
        </p>
        <a
          href="https://Hartfordpridecenter.org/donate"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-10 py-3 rounded-full bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition"
        >
          Visit Our Official Donation Page
        </a>
      </div>
    </div>
  );
}
