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

const API_BASE = "https://singspacebackend.onrender.com";

// 🔑 TEMP: set pride ID here OR pass as prop later
const PRIDE_ID = 1;

export default function Volunteer() {
  const formatPhone = (value) => {
  if (!value) return "";

  const digits = value.replace(/\D/g, "").slice(0, 10);
  const len = digits.length;

  if (len < 4) return digits;
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

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

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: name === "phone" ? formatPhone(value) : value,
  });
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  // 👇 DEBUG LOG
  console.log("🧪 Submitting volunteer form for pride ID:", PRIDE_ID);

  try {
    await axios.post(
      `${API_BASE}/api/pride/${PRIDE_ID}/volunteers`,
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        interest: formData.interest,
        message: formData.message || null,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    setSubmitted(true);
  } catch (err) {
    console.error("❌ Volunteer submission failed", err);
    setError(
      err.response?.data?.error || "Submission failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
<div className="min-h-screen bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25] text-emerald-100">

      {/* ——————— YOUR UI IS UNCHANGED BELOW ——————— */}

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

      {/* FORM */}
      <section className="max-w-3xl mx-auto my-16">
        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-black/60 p-10 border border-pink-400"
          >
            {["name", "email", "phone"].map((field) => (
              <input
                key={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required={field !== "phone"}
                placeholder={field.toUpperCase()}
                className="w-full p-4 bg-purple-900/70 border border-pink-400 text-white"
              />
            ))}

            <select
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              required
              className="w-full p-4 bg-purple-900/70 border border-pink-400 text-white"
            >
              <option value="">Select an Interest</option>
              {interests.map((opt) => (
                <option key={opt} value={opt} className="text-black">
                  {opt}
                </option>
              ))}
            </select>

            <textarea
              name="message"
              maxLength={300}
              value={formData.message}
              onChange={handleChange}
              placeholder="Optional message (300 characters)"
              className="w-full p-4 bg-purple-900/70 border border-pink-400 text-white"
            />

            {error && <p className="text-red-300 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-indigo-500 font-bold"
            >
              {loading ? "Sending..." : "Submit Interest"}
            </button>
          </motion.form>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-3xl font-bold text-green-300">✅ Thank you!</h3>
            <p className="text-lg mt-2">
              Your volunteer interest has been received.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
