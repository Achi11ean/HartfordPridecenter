import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaHandsHelping, FaUsers, FaHeart, FaCalendarAlt } from "react-icons/fa";

// ⭐ EASY TO MAINTAIN INTEREST LIST
const interests = [
  "Karaoverse",
  "Event Support",
  "Community Outreach",
  "Creative Arts",
  "Advocacy & Education",
  "Administrative Support",
  "Fundraising & Sponsorship",
  "Social Media & Marketing",
  "Photography / Videography",
  "Logistics & Setup",
  "Youth Programming",
  "Health & Wellness Support",
];

export default function Volunteer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = "https://singspacebackend.onrender.com";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.post(`${API_BASE}/api/volunteer`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setSubmitted(true);
    } catch (err) {
      console.error("❌ Error submitting volunteer form", err);
      setError("Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 text-white">
      {/* Banner */}
      <section
        className="relative h-80 md:h-96 bg-cover bg-center flex items-center justify-center border-b-4 border-pink-400 shadow-2xl"
        style={{
          backgroundImage:
            "url('https://tcpride.org/wp-content/uploads/2024/02/1-3-1024x1024.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-4xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg"
        >
          Volunteer With Us
        </motion.h1>
      </section>

      {/* Intro */}
      <section className="max-w-5xl mx-auto text-center py-6 px-6 space-y-">
        <h2 className="text-3xl sm:text-4xl border-b-2 font-bold text-pink-300">
           Together, <br/>We Make Change
        </h2>
        <p className="text-lg bg-black/60  text-white border-b-2 leading-relaxed">
          Volunteers are the heartbeat of the{" "}
          <span className="font-semibold text-pink-400">
            Hartford Pride Center
          </span>. Your support creates connection, growth, and joy throughout
          our LGBTQIA+ community.
        </p>
      </section>

      {/* Opportunity Blocks */}
      <section className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {[
          { title: "Community Outreach", icon: <FaUsers size={42} />, desc: "Engage with partners & schools.", color: "from-purple-400 to-indigo-500" },
                    { title: "Advocacy & Education", icon: <FaHandsHelping size={42} />, desc: "Support workshops and resources.", color: "from-blue-400 to-cyan-500" },
    
          { title: "Event Support", icon: <FaCalendarAlt size={42} />, desc: "Help plan and run events.", color: "from-pink-400 to-rose-500" },

          { title: "Creative Arts", icon: <FaHeart size={42} />, desc: "Design, media, and storytelling.", color: "from-teal-400 to-emerald-500" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="rounded-none p-2 text-center shadow-lg bg-white/10 border border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition"
          >
            <div className={`mx-auto mb-2 border-b shadow-white shadow-md w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-white shadow-md`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-pink-200">{item.title}</h3>
            <p className="text-sm text-gray-200">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Form */}
   <section className="max-w-3xl mx-auto my-16 rounded-none shadow-2xl">

  {/* ✨ Wrap HEADER + FORM inside this gradient frame */}
  <div
    className="
      relative p-[3px]
      bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500
      rounded-none shadow-2xl animate-gradient-x
    "
    style={{
      backgroundSize: "300% 300%",
      animation: "gradientShift 6s ease infinite",
    }}
  >
    {/* INNER CONTAINER */}
    <div className="bg-black/60 backdrop-blur-xl rounded-none border-2 border-pink-400">

      {/* HEADER (now inside the frame, stays attached) */}
      <div className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black text-center py-4 font-extrabold text-3xl tracking-widest uppercase shadow-lg rounded-none border-b-4 border-black">
        Volunteer Sign Up Sheet
      </div>

      {/* FORM STARTS HERE */}
      <div className="p-10">
        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* STANDARD FIELDS */}
            {[
              { field: "name", type: "text", placeholder: "Jane Doe" },
              { field: "email", type: "email", placeholder: "jane@example.com" },
              { field: "phone", type: "text", placeholder: "(555) 123-4567 — optional" },
            ].map(({ field, type, placeholder }) => (
              <div key={field} className="space-y-1">
                <label
                  htmlFor={field}
                  className="block bg-yellow-400 text-black font-semibold uppercase px-2 py-1 tracking-wide rounded-none cursor-pointer"
                >
                  {field}
                </label>

                <input
                  id={field}
                  type={type}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={field !== "phone"}
                  placeholder={placeholder}
                  className="
                    w-full p-4 rounded-none text-center
                    bg-purple-900/70 text-white border border-pink-400
                    focus:ring-4 focus:ring-pink-300 focus:border-yellow-300
                    placeholder-white/40 transition-all duration-300
                  "
                />
              </div>
            ))}

            {/* INTEREST DROPDOWN */}
            <div className="space-y-1">
              <label
                htmlFor="interest"
                className="block bg-yellow-400 text-black font-semibold uppercase px-2 py-1 tracking-wide rounded-none cursor-pointer"
              >
                Interest
              </label>

              <select
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                required
                className="
                  w-full p-4 rounded-none text-center
                  bg-purple-900/70 text-white border border-pink-400
                  focus:ring-4 focus:ring-pink-300 focus:border-yellow-300
                "
              >
                <option value="">Select an Interest</option>
                {interests.map((opt) => (
                  <option key={opt} value={opt} className="text-black">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* MESSAGE BOX */}
            <div className="space-y-1">
              <label
                htmlFor="message"
                className="block bg-yellow-400 text-black font-semibold uppercase px-2 py-1 tracking-wide rounded-none cursor-pointer"
              >
                Message (optional)
              </label>

              <textarea
                id="message"
                name="message"
                rows="4"
                maxLength={300}
                placeholder="Tell us how you'd like to help! (300 characters max)"
                value={formData.message}
                onChange={handleChange}
                className="
                  w-full p-4 rounded-none bg-purple-900/70 text-white
                  border border-pink-400 placeholder-white/40
                  focus:ring-4 focus:ring-teal-300 focus:border-yellow-300
                "
              />
            </div>

            {error && (
              <p className="text-red-300 font-semibold text-center">{error}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              type="submit"
              className="
                w-full py-3 rounded-none font-bold text-lg
                bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                shadow-lg transition disabled:opacity-50
              "
            >
              {loading ? "Sending..." : "Submit Interest"}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <h4 className="text-3xl font-bold text-green-300 mb-4">✅ Thank You!</h4>
            <p className="text-lg text-gray-100">
              Your volunteer interest has been received. We'll reach out soon!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  </div>
</section>


      {/* Footer CTA */}
      <div className="text-center pb-16">
        <p className="text-lg text-gray-300 mb-4">
          Ready to get started? Let’s make Hartford shine together. 🌟
        </p>
        <a
          href="mailto:volunteer@Hartfordpridecenter.org"
          className="inline-block px-10 py-3 rounded-full bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition"
        >
          Email Our Team
        </a>
      </div>
    </div>
  );
}
