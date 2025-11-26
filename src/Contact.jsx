import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

export default function ContactPageTemplate() {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [showTerms, setShowTerms] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setStatus("✅ Thank you! Our team will reach out shortly.");
      setPhone("");
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 text-gray-100">
      {/* Banner */}
      <div
        className="w-full h-80 md:h-96  bg-center relative shadow-2xl border-b-4 border-pink-400"
        style={{
          backgroundImage:
            "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvfksv1zCmXIN1zWk8CtRZs3HreW88vugB_w&s')",
          backgroundPosition: "center 45%",
        }}
      >
        <div className="absolute sm:bottom-[-50px] bottom-[-40px] left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md px-2 py-3  flex items-center gap-3 border-2 border-pink-300 shadow-xl">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white  drop-shadow-lg">
            Contact Us
          </h2>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-6xl mx-auto p-8 pt-16 space-y-6">
        <p className="text-xl sm:text-3xl font-extrabold text-center border-b-2 border-pink-400 pb-3">
          💌 We’d love to hear from you!
        </p>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="bg-white/90 p-6  shadow-lg hover:shadow-pink-400/50 transition">
            <FaEnvelope size={36} className="mx-auto text-pink-600 mb-4" />
            <p className="text-lg font-bold text-gray-800">Email Us</p>
            <a
              href="mailto:info@Hartfordpridecenter.org"
              className="text-pink-600 font-medium hover:underline"
            >
              info@Hartfordpridecenter.org
            </a>
          </div>

          <div className="bg-white/90 p-6  shadow-lg hover:shadow-teal-400/50 transition">
            <FaPhoneAlt size={36} className="mx-auto text-teal-600 mb-4" />
            <p className="text-lg font-bold text-gray-800">Call Us</p>
            <a
              href="tel:2038678884"
              className="text-teal-600 font-medium hover:underline"
            >
              (203) 867-8884
            </a>
          </div>

          <div className="bg-white/90 p-6  shadow-lg hover:shadow-purple-400/50 transition">
            <FaMapMarkerAlt size={36} className="mx-auto text-purple-600 mb-4" />
            <p className="text-lg font-bold text-gray-800">Visit Us</p>
            <p className="text-purple-600 font-medium">
              84 Orange Street • Hartford, CT
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 border border-pink-400 p-4 shadow-2xl backdrop-blur-sm"
        >
          <h3 className="text-2xl font-extrabold text-center mb-2 text-pink-300 underline">
            Send Us a Message
          </h3>

          {["Name", "Email"].map((label) => (
            <div key={label} className="mb-4">
              <label className="block mb-1 text-pink-100 font-semibold">
                {label}
              </label>
              <input
                type={label === "Email" ? "email" : "text"}
                name={label.toLowerCase()}
                required
                className="w-full p-3  bg-purple-900/60 text-white border border-pink-400 focus:ring-2 focus:ring-pink-300"
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block mb-1 text-pink-100 font-semibold">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(203) 867-8884"
              className="w-full p-3  bg-purple-900/60 text-white border border-pink-400 focus:ring-2 focus:ring-teal-300"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-pink-100 font-semibold">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              required
              className="w-full p-3  bg-purple-900/60 text-white border border-pink-400 focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* Terms */}
          <div className="mb-4 flex items-center gap-2">
            <input type="checkbox" required className="w-4 h-4 accent-pink-500" />
            <span
              onClick={() => setShowTerms(!showTerms)}
              className="text-sm underline cursor-pointer hover:text-pink-200"
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
                className="mb-4 text-sm text-pink-100 bg-purple-900/60 p-3 "
              >
                <p>
                  By submitting this form, you consent to the Hartford Pride Center
                  contacting you using the information provided. Please do not
                  include sensitive or confidential data.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 rounded-xl font-bold text-lg text-white shadow-lg transition"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </motion.button>

          {status && (
            <p
              className={`mt-4 text-center font-semibold ${
                status.includes("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {status}
            </p>
          )}
        </motion.form>
      </section>
    </div>
  );
}
