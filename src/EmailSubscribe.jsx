import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   EMAIL SUBSCRIBE — "Community Poster" restyle
   Flat white panels, 2px black borders, offset shadows,
   flag-color accents, dark text on light backgrounds.
   All subscribe/unsubscribe logic is unchanged.
   ───────────────────────────────────────────────────────────── */

const FLAG = ["#E40303", "#FF8C00", "#FFED00", "#008026", "#004DFF", "#750787"];

const inputClass =
  "w-full rounded-xl border-2 border-[#181310] bg-white p-3 font-semibold text-[#181310] placeholder-[#9a8d84] outline-none focus:ring-4 focus:ring-[#FFED00]";

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

  // unsubscribe
  const [unsubscribeEmail, setUnsubscribeEmail] = useState("");
  const [unsubscribeStatus, setUnsubscribeStatus] = useState("");
  const [showUnsub, setShowUnsub] = useState(false);
  const [unsubLoading, setUnsubLoading] = useState(false);

  const SUBSCRIPTION_OPTIONS = ["sponsors", "vendors", "general", "programs"];

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

    console.log(
      "📨 SUBMITTING TO:",
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
        setUnsubLoading(false);
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
    <div className="mx-auto max-w-3xl text-[#181310]">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="hpc-display text-2xl sm:text-3xl font-black uppercase tracking-tight">
          Join our email list ✉️
        </h2>

        {/* flag stripe underline */}
        <div
          className="mx-auto mt-3 flex h-1.5 w-28 overflow-hidden rounded-full"
          aria-hidden="true"
        >
          {FLAG.map((c) => (
            <div key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>

        <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base font-semibold leading-relaxed text-[#4a4038]">
          Get the latest on Hartford Pride events, news, and ways to get
          involved — vendors, sponsors, funders &amp; more. No spam, just love. 🌈
        </p>
      </motion.div>

      {/* TOGGLES */}
      <div className="mt-6 flex flex-row flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl border-2 border-[#181310] px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#181310] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310] transition-all"
          style={{ backgroundColor: "#FFED00" }}
        >
          {showForm ? "Hide form" : "Subscribe"}
        </button>

        <span className="text-sm font-bold text-[#6b5f57]">or</span>

        <button
          type="button"
          onClick={() => setShowUnsub(!showUnsub)}
          className="rounded-xl border-2 border-[#181310] bg-white px-5 py-3 text-sm font-black uppercase tracking-wide text-[#E40303] shadow-[4px_4px_0_#181310] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310] transition-all"
        >
          {showUnsub ? "Hide" : "Unsubscribe"}
        </button>
      </div>

      {/* SUBSCRIBE FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            key="subscribe-form"
            onSubmit={submit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="mt-8 rounded-2xl border-2 border-[#181310] bg-[#FFFBF2] p-5 sm:p-8 text-left shadow-[6px_6px_0_#181310]"
          >
            {/* first + last name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-black uppercase tracking-wider text-[#6b5f57]">
                  First name
                </span>
                <input
                  required
                  placeholder="First name"
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-black uppercase tracking-wider text-[#6b5f57]">
                  Last name
                </span>
                <input
                  required
                  placeholder="Last name"
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({ ...form, last_name: e.target.value })
                  }
                  className={inputClass}
                />
              </label>
            </div>

            {/* email */}
            <label className="mt-4 block">
              <span className="mb-1 block text-xs font-black uppercase tracking-wider text-[#6b5f57]">
                Email address
              </span>
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value.toLowerCase() })
                }
                className={inputClass}
              />
            </label>

            {/* subscription pills */}
            <div className="mt-6">
              <span className="block text-xs font-black uppercase tracking-wider text-[#6b5f57]">
                I&apos;m interested in
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUBSCRIPTION_OPTIONS.map((opt, i) => {
                  const active = form.subscription_types.includes(opt);
                  const color = FLAG[i % FLAG.length];
                  return (
                    <label
                      key={opt}
                      className={`cursor-pointer select-none rounded-full border-2 border-[#181310] px-4 py-2 text-sm font-black uppercase tracking-wide transition-all ${
                        active
                          ? "text-white shadow-[3px_3px_0_#181310]"
                          : "bg-white text-[#181310] hover:bg-[#f3ece1]"
                      }`}
                      style={active ? { backgroundColor: color } : undefined}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => handleCheckbox(opt)}
                        className="sr-only"
                      />
                      {active ? "✓ " : ""}
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* submit */}
            <button
              disabled={loading}
              className="mt-8 w-full rounded-xl border-2 border-[#181310] py-3.5 font-black uppercase tracking-wide shadow-[4px_4px_0_#181310] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310] transition-all disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#181310]"
              style={{ backgroundColor: "#FFED00" }}
            >
              {loading ? "Joining..." : "Sign me up"}
            </button>

            {/* messages */}
            <AnimatePresence>
              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="mt-4 rounded-xl border-2 border-[#181310] px-4 py-3 text-center font-black text-white"
                  style={{ backgroundColor: "#008026" }}
                >
                  🎉 You are now subscribed!
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="mt-4 rounded-xl border-2 border-[#181310] px-4 py-3 text-center font-black text-white"
                  style={{ backgroundColor: "#E40303" }}
                >
                  Something went wrong — please try again.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>

      {/* UNSUBSCRIBE */}
      <AnimatePresence>
        {showUnsub && (
          <motion.form
            key="unsubscribe-form"
            onSubmit={unsubscribe}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="mt-8 rounded-2xl border-2 border-[#181310] bg-white p-5 sm:p-6 text-left shadow-[6px_6px_0_#181310]"
          >
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase tracking-wider text-[#6b5f57]">
                Email to unsubscribe
              </span>
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={unsubscribeEmail}
                onChange={(e) => setUnsubscribeEmail(e.target.value)}
                className={inputClass}
              />
            </label>

            <button
              disabled={unsubLoading}
              className="mt-5 w-full rounded-xl border-2 border-[#181310] bg-white py-3.5 font-black uppercase tracking-wide text-[#E40303] shadow-[4px_4px_0_#181310] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310] transition-all disabled:opacity-60"
            >
              {unsubLoading ? "Processing..." : "Unsubscribe"}
            </button>

            {unsubscribeStatus === "success" && (
              <p
                className="mt-4 rounded-xl border-2 border-[#181310] px-4 py-3 text-center font-black text-white"
                style={{ backgroundColor: "#008026" }}
              >
                You are unsubscribed.
              </p>
            )}

            {unsubscribeStatus === "not_found" && (
              <p className="mt-4 rounded-xl border-2 border-[#181310] bg-[#FFED00] px-4 py-3 text-center font-black">
                No subscription found for that email.
              </p>
            )}

            {unsubscribeStatus === "error" && (
              <p
                className="mt-4 rounded-xl border-2 border-[#181310] px-4 py-3 text-center font-black text-white"
                style={{ backgroundColor: "#E40303" }}
              >
                Something went wrong.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}