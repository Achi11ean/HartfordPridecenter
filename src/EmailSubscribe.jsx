import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function EmailSubscribe({ prideId = 2 }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    subscription_types: [],
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // NEW — unsubscribe
  const [unsubscribeEmail, setUnsubscribeEmail] = useState("");
  const [unsubscribeStatus, setUnsubscribeStatus] = useState("");
  const [showUnsub, setShowUnsub] = useState(false);
  const [unsubLoading, setUnsubLoading] = useState(false);

  const SUBSCRIPTION_OPTIONS = [
    "sponsors",
    "vendors",
    "general",
    "programs",
  ];

  const handleCheckbox = (type) => {
    setForm((prev) => {
      if (prev.subscription_types.includes(type)) {
        return {
          ...prev,
          subscription_types: prev.subscription_types.filter((t) => t !== type),
        };
      }
      return {
        ...prev,
        subscription_types: [...prev.subscription_types, type],
      };
    });
  };

   const submit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    console.log("📨 SUBMITTING TO:", 
      `https://singspacebackend.onrender.com/api/pride/${prideId}/subscribe`
    );

    console.log("📦 FORM DATA:", form);

    try {
      const res = await axios.post(
        `https://singspacebackend.onrender.com/api/pride/${prideId}/subscribe`,
        form
      );

      console.log("📨 RESPONSE:", res.status, res.data);

      if (res.status === 201 || res.status === 200) {
        console.log("🎉 SUCCESS — subscriber created!");
        setStatus("success");
        setForm({
          first_name: "",
          last_name: "",
          email: "",
          subscription_types: [],
        });
      }
    } catch (err) {
      console.error("❌ ERROR SUBSCRIBING:", err);
      setStatus("error");
    }

    setLoading(false);
  };
  // 🔥 NEW: Unsubscribe logic
  const unsubscribe = async (e) => {
    e.preventDefault();
    setUnsubLoading(true);
    setUnsubscribeStatus("");

    try {
      // 1️⃣ Lookup subscription by email
      const lookup = await axios.get(
        `https://singspacebackend.onrender.com/api/pride/${prideId}/subscriptions?email=${unsubscribeEmail.toLowerCase()}`
      );

const results = lookup.data;
if (!results.length) {
  setUnsubscribeStatus("not_found");
  return;
}

const sub_id = results[0].id;



      // 2️⃣ Patch to deactivate subscription
      await axios.patch(
        `https://singspacebackend.onrender.com/api/pride/${prideId}/unsubscribe/${sub_id}`
      );

      setUnsubscribeStatus("success");
      setUnsubscribeEmail("");
    } catch (err) {
      setUnsubscribeStatus("error");
    }

    setUnsubLoading(false);
  };

  return (
    <div className="mt-16 max-w-3xl mx-auto text-center">

      {/* HEADER */}
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-extrabold text-yellow-300"
      >
        Join Our Email List ✉️
      </motion.h2>

      <p className="mt-2 text-yellow-100/80 font-semibold text-lg">
        Stay updated on events, resources, pride programs & opportunities.
      </p>

      {/* Subscribe Toggle */}
 <div className="mt-8 flex flex-col sm:flex-row items-center gap-6">

  {/* Subscribe */}
  <button
    onClick={() => setShowForm(!showForm)}
    className="px-8 py-3 font-bold text-black rounded-xl
      bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500
      shadow-lg shadow-amber-500/30
      hover:from-amber-500 hover:via-yellow-400 hover:to-yellow-300
      hover:shadow-amber-500/50
      transition-all duration-300"
  >
    {showForm ? "Hide Form" : "Subscribe"}
  </button>

  {/* Divider text */}
  <span className="text-yellow-100/70 font-semibold text-sm sm:text-base">
    or
  </span>

  {/* Unsubscribe */}
  <button
    onClick={() => setShowUnsub(!showUnsub)}
    className="px-7 py-3 font-semibold rounded-xl
      text-red-900
      bg-gradient-to-r from-red-200 via-red-300 to-red-400
      shadow-md shadow-red-500/20
      hover:from-red-400 hover:via-red-300 hover:to-red-200
      hover:shadow-red-500/40
      transition-all duration-300"
  >
    {showUnsub ? "Hide" : "Unsubscribe"}
  </button>

</div>

      {/* Subscribe Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            key="subscribe-form"
            onSubmit={submit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="mt-10 bg-black/40 border border-yellow-400/30 p-8 shadow-2xl"
          >
            {/* first + last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                required
                placeholder="First Name"
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
                className="p-3 bg-white/10 border border-yellow-400/30 text-yellow-50 placeholder-yellow-200/40 outline-none"
              />

              <input
                required
                placeholder="Last Name"
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
                className="p-3 bg-white/10 border border-yellow-400/30 text-yellow-50 placeholder-yellow-200/40 outline-none"
              />
            </div>

            {/* email */}
            <input
              required
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value.toLowerCase() })
              }
              className="mt-5 p-3 w-full bg-white/10 border border-yellow-400/30 text-yellow-50 placeholder-yellow-200/40 outline-none"
            />

            {/* checkboxes */}
            <div className="mt-6 text-left grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-2">
              {SUBSCRIPTION_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 text-yellow-200 font-semibold text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.subscription_types.includes(opt)}
                    onChange={() => handleCheckbox(opt)}
                    className="accent-yellow-400"
                  />
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </label>
              ))}
            </div>

            {/* submit */}
            <button
              disabled={loading}
              className="mt-8 w-full py-3 font-bold text-black border border-black shadow-lg
                bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 
                hover:from-amber-500 hover:via-yellow-400 hover:to-yellow-300
                transition-all duration-300"
            >
              {loading ? "Joining..." : "Submit"}
            </button>

            {/* messages */}
            <AnimatePresence>
              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="mt-5 text-green-400 font-bold"
                >
                  🎉 You are now subscribed!
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="mt-5 text-red-400 font-bold"
                >
                  ❌ Something went wrong — please try again.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>

      {/* NEW — UNSUBSCRIBE SECTION */}
      <div className="mt-14">


        <AnimatePresence>
          {showUnsub && (
            <motion.form
              onSubmit={unsubscribe}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="mt-6 bg-black/40 border border-red-500/40 shadow-xl p-6"
            >
              <input
                required
                type="email"
                placeholder="Enter your email"
                value={unsubscribeEmail}
                onChange={(e) => setUnsubscribeEmail(e.target.value)}
                className="w-full p-3 bg-white/10 border border-red-500/40 text-yellow-50 outline-none"
              />

              <button
                disabled={unsubLoading}
                className="mt-5 w-full py-3 font-bold text-black border border-black shadow-lg
                bg-gradient-to-r from-red-400 via-red-500 to-red-600 
                hover:from-red-600 hover:via-red-500 hover:to-red-400 
                transition-all duration-300"
              >
                {unsubLoading ? "Processing..." : "Unsubscribe"}
              </button>

              {unsubscribeStatus === "success" && (
                <p className="mt-4 text-green-400 font-bold">
                  You are unsubscribed.
                </p>
              )}

              {unsubscribeStatus === "not_found" && (
                <p className="mt-4 text-yellow-400 font-bold">
                  No subscription found for that email.
                </p>
              )}

              {unsubscribeStatus === "error" && (
                <p className="mt-4 text-red-400 font-bold">
                  Something went wrong.
                </p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
