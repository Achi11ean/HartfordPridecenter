import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;

export default function ContactPageTemplate() {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [localBlocked, setLocalBlocked] = useState(false);

  // read block on load
  useEffect(() => {
    const blocked = localStorage.getItem("pride_contact_blocked");
    if (blocked === "true") {
      setLocalBlocked(true);
      setStatus(
        "🚫 This device has been locked due to prior hate speech violations. Submissions are disabled."
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

  // submit logic + hate lock
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (localBlocked) {
      setStatus(
        "🚫 This device has been locked due to prior hate speech violations. Submissions are disabled."
      );
      return;
    }

    if (!termsAccepted) {
      setStatus("❗ You must agree to the Terms and Conditions before submitting.");
      return;
    }

    setIsLoading(true);
    setStatus("");

    try {
      const res = await axios.post(`${API}/api/pride/${PRIDE_ID}/contact`, {
        name: form.name,
        email: form.email,
        phone: phone || null,
        message: form.message,
      });

      if (res.data?.contact_status === "flagged") {
        localStorage.setItem("pride_contact_blocked", "true");
        setLocalBlocked(true);

        setStatus(
          "🚨 Hate speech was detected. Your information has been logged and this device has been blocked."
        );

        return;
      }

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
<div
  className="
    min-h-screen
    bg-[conic-gradient(at_top_left,_#2e1065,_#4c1d95,_#6d28d9,_#4c1d95,_#2e1065)]
    text-white bg-fixed relative
  "
>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* --- PAGE CONTENT WRAPPER --- */}
      <div className="relative z-10">

        {/* Banner */}
{/* Banner */}
<div
  className="
    w-full h-80 md:h-96
    bg-center bg-contain bg-no-repeat
    relative shadow-2xl
    border-b-4 border-slate-700
    mt-24 sm:mt-28  /* 👈 ADD THIS LINE */
  "
  style={{
    backgroundImage: "url('/PrideLogo3.jpg')",
  }}
>
  <div
    className="
      absolute inset-0
      bg-gradient-to-r
      from-red-600/10 via-yellow-300/10 to-blue-600/10
    "
  />


</div>
      <hr className="rainbow-hr" />

<h2
  className="
    pt-4 text-7xl lg:text-8xl
    font-extrabold font-[Aspire] tracking-tight text-center
    relative
    bg-gradient-to-r from-violet-700 via-violet-400 to-violet-900
text-white
    drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]
    border-b-2 border-white/70
    shadow-[inset_0_2px_4px_rgba(255,255,255,0.35)]
  "
>
Contact Us  

</h2>
      <hr className="rainbow-hr" />

        {/* Content Section */}
        <section className="max-w-6xl mx-auto p-8 pt-24 space-y-6">

          {/* Header */}
          <p
            className="
              text-2xl sm:text-3xl font-extrabold text-center pb-3
              bg-gradient-to-r from-yellow-200 via-white to-yellow-200
              bg-clip-text text-transparent
            "
          >
            💛 We’d love to hear from you!
          </p>

          {/* ================= FORM ================= */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              bg-black/70
              border border-slate-700
              rounded-xl p-6 shadow-xl backdrop-blur-sm
            "
          >

            {/* NAME + EMAIL */}
            {["name", "email"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block mb-1 font-semibold text-slate-200">
                  {field.toUpperCase()}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                  className="
                    w-full p-3 rounded-none
                    bg-white border border-slate-600
                    text-black placeholder-slate-400
                    focus:ring-2 focus:ring-indigo-400
                  "
                />
              </div>
            ))}

            {/* PHONE */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-slate-200">
                PHONE (optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                className="
                  w-full p-3 rounded-lg
                  bg-white border border-slate-600
                  text-black placeholder-slate-400
                  focus:ring-2 focus:ring-indigo-400
                "
              />
            </div>

            {/* MESSAGE */}
            <div className="mb-6">
              <label className="block mb-1 font-semibold text-slate-200">
                MESSAGE
              </label>
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required
                className="
                  w-full p-3 rounded-lg
                  bg-white  border border-slate-600
                  text-black placeholder-slate-400
                  focus:ring-2 focus:ring-indigo-400
                "
              />
            </div>

            {/* TERMS */}
            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 accent-yellow-400"
              />
              <span
                onClick={() => setShowTerms(!showTerms)}
                className="text-sm underline cursor-pointer"
              >
                I agree to the Terms and Conditions
              </span>
            </div>

            {/* Expandable Terms */}
          <AnimatePresence>
              {showTerms && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 text-sm text-yellow-200 bg-slate-800 p-3 rounded-md"
                >
                  <p>
                    You consent to being contacted  regarding your inquiry using the information submitted.
                  </p>
                  <p className="mt-2 font-semibold text-red-300">
                    Hate, harassment, or threats will lock this device immediately and submit IP address for a possible report to authorities.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SUBMIT */}
            <motion.button
              type="submit"
              disabled={isLoading || !termsAccepted || localBlocked}
              whileHover={termsAccepted ? { scale: 1.02 } : {}}
              whileTap={termsAccepted ? { scale: 0.97 } : {}}
              className={`
                w-full py-3 rounded-lg font-bold text-black text-lg shadow-md
                ${
                  termsAccepted && !localBlocked
                    ? "bg-gradient-to-r from-red-400 via-yellow-300 to-blue-400"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }
              `}
            >
              {isLoading ? "Sending…" : "Send Message 🌈"}
            </motion.button>

            {/* DEVICE LOCKED MESSAGE */}
            {localBlocked && (
              <div className="mt-4 text-center text-red-300 font-bold bg-red-900/40 border border-red-500 p-3">
                🚫 Submissions from this device are disabled.
              </div>
            )}

            {/* STATUS */}
            {status && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center font-bold p-3 rounded-md bg-black/40"
              >
                {status}
              </motion.p>
            )}
          </motion.form>
        </section>
      </div>
    </div>
  );
}
