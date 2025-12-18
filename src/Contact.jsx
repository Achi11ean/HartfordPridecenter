import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import axios from "axios";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 1; // ← change later to route param if needed

export default function ContactPageTemplate() {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [showTerms, setShowTerms] = useState(false);
const [termsAccepted, setTermsAccepted] = useState(false);
const [localBlocked, setLocalBlocked] = useState(false);
useEffect(() => {
  const blocked = localStorage.getItem("pride_contact_blocked");
  if (blocked === "true") {
    setLocalBlocked(true);
    setStatus(
      "🚫 This device has been locked due to prior hate speech violations. " +
      "Submissions are disabled."
    );
  }
}, []);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handlePhoneChange = (e) => {
    let input = e.target.value.replace(/\D/g, "").substring(0, 10);
    const area = input.substring(0, 3);
    const mid = input.substring(3, 6);
    const last = input.substring(6, 10);

    if (input.length > 6) input = `(${area}) ${mid}-${last}`;
    else if (input.length > 3) input = `(${area}) ${mid}`;
    else if (input.length > 0) input = `(${area}`;

    setPhone(input);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ───────────────────────────────
  // 🚀 Submit to backend
  // ───────────────────────────────
  const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔒 Block immediately if already locked
  if (localBlocked) {
    setStatus(
      "🚫 This device has been locked due to prior hate speech violations. " +
      "Submissions are disabled."
    );
    return;
  }

  // 📜 Require terms acceptance
  if (!termsAccepted) {
    setStatus("❗ You must agree to the Terms and Conditions before submitting.");
    return;
  }

  setIsLoading(true);
  setStatus("");

  try {
    const res = await axios.post(
      `${API}/api/pride/${PRIDE_ID}/contact`,
      {
        name: form.name,
        email: form.email,
        phone: phone || null,
        message: form.message,
      }
    );

    // 🚨 HATE SPEECH FLAG HANDLING
    if (res.data?.contact_status === "flagged") {
      // 🔐 LOCK THIS DEVICE LOCALLY
      localStorage.setItem("pride_contact_blocked", "true");
      setLocalBlocked(true);

      setStatus(
        "🚨 Hate speech was detected in your submission. " +
        "Your IP address has been logged and may be forwarded to local authorities. " +
        "This device has been locked from further submissions."
      );

      return; // ⛔ stop here, do NOT reset form
    }

    // ✅ CLEAN SUBMISSION
    setStatus("✅ Thank you! Our team will reach out shortly.");
    setForm({ name: "", email: "", message: "" });
    setPhone("");

  } catch (err) {
    console.error(err);
    setStatus("❌ Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0F2D25] to-[#18453B] text-white">
      {/* Banner */}

      <div
        className="w-full h-80 md:h-96 bg-center relative shadow-2xl border-b-4 border-[#18453B]"
        style={{
          backgroundImage:
            "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvfksv1zCmXIN1zWk8CtRZs3HreW88vugB_w&s')",
          backgroundPosition: "center 45%",
        }}
      >
        <div className="absolute sm:bottom-[-50px] bottom-[-40px] left-1/2 -translate-x-1/2 bg-[#0F2D25]/40 backdrop-blur-md px-4 py-3 border-2 border-[#18453B] shadow-xl">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-yellow-100 drop-shadow-lg">
            Contact Us
          </h2>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-6xl mx-auto p-8 pt-16 space-y-6">
        
        <p className="text-xl sm:text-3xl font-extrabold text-center border-b-2 border-yellow-300 pb-3">
          💛 We’d love to hear from you!
        </p>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 border border-yellow-300 p-4 shadow-2xl backdrop-blur-sm"
        >
          <h3 className="text-2xl font-extrabold text-center mb-2 text-yellow-300 underline">
            Send Us a Message
          </h3>

          {["name", "email"].map((field) => (
            <div key={field} className="mb-4">
              <label className="block mb-1 text-yellow-200 font-semibold capitalize">
                {field}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                className="w-full p-3 bg-yellow-900/40 text-yellow-50 border border-yellow-300 focus:ring-2 focus:ring-yellow-200"
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block mb-1 text-yellow-200 font-semibold">
              Phone (optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full p-3 bg-yellow-900/40 text-yellow-50 border border-yellow-300"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-yellow-200 font-semibold">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full p-3 bg-yellow-900/40 text-yellow-50 border border-yellow-300"
            />
          </div>

          {/* Terms */}
 {/* Terms */}
<div className="mb-4 flex items-center gap-2">
  <input
    type="checkbox"
    checked={termsAccepted}
    onChange={(e) => setTermsAccepted(e.target.checked)}
    className="w-4 h-4 accent-yellow-500"
  />
  <span
    onClick={() => setShowTerms(!showTerms)}
    className="text-sm underline cursor-pointer hover:text-yellow-200"
  >
    I agree to the Terms and Conditions
  </span>
</div>


          <AnimatePresence>
            {showTerms && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 text-sm text-yellow-100 bg-yellow-900/40 p-3"
              >
                <p>
                  By submitting this form, you consent to being contacted by South
                  Haven LGBTQIA+ Advocacy using the information provided.
                </p>
                <p className="mt-2 font-semibold text-red-300">
                  Hate speech, harassment, or threats will be logged with IP
                  address tracking and may be reported to local authorities.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        <motion.button
  type="submit"
disabled={isLoading || !termsAccepted || localBlocked}
  whileHover={termsAccepted ? { scale: 1.05 } : {}}
  whileTap={termsAccepted ? { scale: 0.95 } : {}}
  className={`
    w-full py-3 rounded-xl font-bold text-lg shadow-lg transition
    ${
      termsAccepted
        ? "bg-gradient-to-r from-yellow-300 via-white to-yellow-300 text-black"
        : "bg-gray-400 text-gray-700 cursor-not-allowed"
    }
  `}
>
  {isLoading ? "Sending..." : "Send Message"}
</motion.button>

      {localBlocked && (
  <div className="mb-4 text-center text-red-300 font-bold border border-red-500 p-3 bg-red-900/40">
    🚫 Submissions from this device are disabled due to prior violations.
  </div>
)}

         {status && (
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`
      mt-4 text-center font-bold p-3 rounded-md
      ${
        status.startsWith("🚨")
          ? "bg-red-900/60 text-red-200 border border-red-400"
          : status.startsWith("❗")
          ? "bg-yellow-900/60 text-yellow-200 border border-yellow-400"
          : "bg-green-900/60 text-green-200 border border-green-400"
      }
    `}
  >
    {status}
  </motion.p>
)}


        </motion.form>
      </section>
    </div>
  );
}
