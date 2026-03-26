import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;

export default function ContactPageTemplate() {
  const [status, setStatus] = useState("");
  const [committees, setCommittees] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [admins, setAdmins] = useState([]);
const [staff, setStaff] = useState([]);

  const [localBlocked, setLocalBlocked] = useState(false);
const [services, setServices] = useState([]);
const [selectedTopic, setSelectedTopic] = useState("");
useEffect(() => {
  const fetchAllContactTargets = async () => {
    try {
      const [
        servicesRes,
        committeesRes,
        adminsRes,
        staffRes
      ] = await Promise.all([
        axios.get(`${API}/api/pride/${PRIDE_ID}/services`),
        axios.get(`${API}/api/pride-committees/pride/${PRIDE_ID}`),
        axios.get(`${API}/api/pride/${PRIDE_ID}/admins`),
        axios.get(`${API}/api/pride/${PRIDE_ID}/staff`)
      ]);

      setServices(servicesRes.data || []);
      setCommittees((committeesRes.data || []).filter(c => c.is_active));
      setAdmins((adminsRes.data || []).filter(a => a.is_active));
      setStaff((staffRes.data || []).filter(s => s.is_active));

      console.log("📦 Contact targets loaded");
    } catch (err) {
      console.error("❌ Failed to fetch Pride contact targets:", err);
    }
  };

  fetchAllContactTargets();
}, []);

useEffect(() => {
  const fetchServicesAndCommittees = async () => {
    try {
      const [servicesRes, committeesRes] = await Promise.all([
        axios.get(`${API}/api/pride/${PRIDE_ID}/services`),
        axios.get(`${API}/api/pride-committees/pride/${PRIDE_ID}`)
      ]);

      console.log("🧩 Pride services:", servicesRes.data);
      console.log("🧭 Pride committees:", committeesRes.data);

      setServices(servicesRes.data || []);
      setCommittees(
        (committeesRes.data || []).filter(c => c.is_active)
      );
    } catch (err) {
      console.error("❌ Failed to fetch Pride data:", err);
    }
  };

  fetchServicesAndCommittees();
}, []);

useEffect(() => {
  const fetchServices = async () => {
  try {
    const res = await axios.get(
      `${API}/api/pride/${PRIDE_ID}/services`
    );

    console.log("🧩 Pride services response:", res.data);

    setServices(res.data || []);
  } catch (err) {
    console.error("❌ Failed to fetch Pride services:", err);
  }
};


  fetchServices();
}, []);


const handleTopicSelect = (e) => {
  const value = e.target.value;
  setSelectedTopic(value);

  if (!value) return;

  const service = services.find(s => s.title === value);
  const committee = committees.find(c => c.name === value);
  const admin = admins.find(a => a.id === Number(value));
  const staffMember = staff.find(s => s.id === Number(value));

  let finalTopic = value;

  if (service) {
    finalTopic = `${service.title} Services`;
  } else if (committee) {
    finalTopic = `${committee.name} Committee`;
  } else if (admin) {
    finalTopic = `I would like to connect with ${admin.name} (Admin)`;
  } else if (staffMember) {
    finalTopic = `I would like to connect with ${staffMember.first_name} ${staffMember.last_name} (${staffMember.role})`;
  }

  const prefix = `${finalTopic}\n\n`;

  setForm((prev) => {
    const cleanedMessage = prev.message.replace(
      /^[\s\S]*?\n\n/,
      ""
    );

    return {
      ...prev,
      message: prefix + cleanedMessage,
    };
  });
};



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
      setSelectedTopic(""); // 👈 ADD THIS


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
    w-full h-40 md:h-96
    bg-center bg-cover bg-no-repeat
    relative shadow-2xl
    border-b-4 border-slate-700
    lg:mt-24 mt-14
  "
  style={{
    backgroundImage: "url('https://images.squarespace-cdn.com/content/v1/5ac3f2dd3e2d0974e2f2f286/1529702076428-JZK6BYEGGOI8G1CVPMFZ/Pride-2138.jpg?format=1500w')",
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
    pt-2 text-7xl lg:text-8xl
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
        <section className="max-w-6xl mx-auto p-2 pt-4 ">

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
    relative overflow-hidden
    bg-gradient-to-br from-slate-950/95 via-black/90 to-slate-900/95
    border border-white/10
    rounded-[28px]
    p-2 sm:p-6 md:p-8
    shadow-[0_20px_80px_rgba(0,0,0,0.55)]
    backdrop-blur-xl
  "
>
  {/* ambient glow */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-pink-500/10 blur-3xl" />
    <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
    <div className="absolute bottom-10 left-0 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl" />
  </div>

  <div className="relative z-10">
    {/* header */}
    <div className="mb-6 text-center">

      <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
        Let’s Connect
      </h2>

      <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-white/65">
        Reach out for support, partnerships, volunteering, committees, services, or to connect with a team member.
      </p>
    </div>

    {/* fields */}
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {/* NAME */}
      <div className="col-span-1">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="
            w-full min-w-0
            rounded-2xl border border-white/10
            bg-white text-black
            px-4 py-2
            text-sm sm:text-base
            placeholder:text-slate-400
            shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]
            outline-none
            transition-all duration-300
            focus:border-fuchsia-400/60
            focus:ring-4 focus:ring-fuchsia-500/20
          "
        />
      </div>

      {/* EMAIL */}
      <div className="col-span-1">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="
            w-full min-w-0
            rounded-2xl border border-white/10
            bg-white text-black
            px-4 py-2
            text-sm sm:text-base
            placeholder:text-slate-400
            shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]
            outline-none
            transition-all duration-300
            focus:border-indigo-400/60
            focus:ring-4 focus:ring-indigo-500/20
          "
        />
      </div>

      {/* PHONE */}
      <div className="col-span-2 sm:col-span-1">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
          Phone <span className="normal-case tracking-normal text-white/40">(optional)</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          className="
            w-full min-w-0
            rounded-2xl border border-white/10
            bg-white text-black
            px-4 py-2
            text-sm sm:text-base
            placeholder:text-slate-400
            shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]
            outline-none
            transition-all duration-300
            focus:border-cyan-400/60
            focus:ring-4 focus:ring-cyan-500/20
          "
        />
      </div>

      {/* TOPIC / INTEREST */}
      <div className="col-span-2 sm:col-span-1">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
          Topic / Interest
        </label>

        <select
          value={selectedTopic}
          onChange={handleTopicSelect}
          className="
            w-full min-w-0
            rounded-2xl border border-white/10
            bg-white text-black
            px-4 py-3.5
            text-sm sm:text-base
            shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]
            outline-none
            transition-all duration-300
            focus:border-yellow-400/60
            focus:ring-4 focus:ring-yellow-500/20
          "
        >
          <option value="">Select a topic…</option>

          <optgroup label="General">
            <option value="I want to volunteer">I want to volunteer</option>
            <option value="I want to Partner">I want to Partner</option>
          </optgroup>

          {services.length > 0 && (
            <optgroup label="Pride Services">
              {services.map((service) => (
                <option key={service.id} value={service.title}>
                  {service.title}
                </option>
              ))}
            </optgroup>
          )}

          {committees.length > 0 && (
            <optgroup label="Pride Committees">
              {committees.map((committee) => (
                <option key={committee.id} value={committee.name}>
                  {committee.name}
                </option>
              ))}
            </optgroup>
          )}

          {admins.length > 0 && (
            <optgroup label="Pride Admins">
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name}
                </option>
              ))}
            </optgroup>
          )}

          {staff.length > 0 && (
            <optgroup label="Pride Staff">
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.first_name} {member.last_name} — {member.role}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* MESSAGE */}
      <div className="col-span-2">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
          Message
        </label>
        <textarea
          name="message"
          rows="5"
          value={form.message}
          onChange={handleChange}
          required
          className="
            w-full min-w-0
            rounded-3xl border border-white/10
            bg-white text-black
            px-4 py-4
            text-sm sm:text-base
            placeholder:text-slate-400
            shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]
            outline-none
            transition-all duration-300
            focus:border-pink-400/60
            focus:ring-4 focus:ring-pink-500/20
          "
        />
      </div>
    </div>

    {/* terms card */}
    <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-1 h-5 w-5 rounded accent-yellow-400"
        />

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setShowTerms(!showTerms)}
            className="text-left text-sm sm:text-base font-semibold text-white underline decoration-white/40 underline-offset-4 transition hover:text-yellow-300"
          >
            I agree to the Terms and Conditions
          </button>

          <p className="mt-1 text-xs sm:text-sm text-white/50">
            Please review the contact and conduct policy before submitting.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showTerms && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            className="
              mt-4 overflow-hidden rounded-2xl
              border border-yellow-400/20
              bg-gradient-to-br from-yellow-500/10 via-slate-900/90 to-red-500/10
              p-4 text-sm text-yellow-100
            "
          >
            <p>
              You consent to being contacted regarding your inquiry using the information submitted.
            </p>
            <p className="mt-3 font-semibold text-red-300">
              Hate, harassment, or threats will lock this device immediately and submit IP address for a possible report to authorities.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* submit */}
    <div className="mt-6">
      <motion.button
        type="submit"
        disabled={isLoading || !termsAccepted || localBlocked}
        whileHover={termsAccepted && !localBlocked ? { scale: 1.015 } : {}}
        whileTap={termsAccepted && !localBlocked ? { scale: 0.985 } : {}}
        className={`
          group relative w-full overflow-hidden
          rounded-2xl py-4 px-5
          text-base sm:text-lg font-extrabold
          shadow-[0_15px_40px_rgba(0,0,0,0.35)]
          transition-all duration-300
          ${
            termsAccepted && !localBlocked
              ? "bg-gradient-to-r from-red-400 via-yellow-300 to-blue-400 text-black"
              : "cursor-not-allowed bg-slate-700 text-slate-300"
          }
        `}
      >
        <span className="relative z-10">
          {isLoading ? "Sending…" : "Send Message 🌈"}
        </span>

        {termsAccepted && !localBlocked && (
          <span className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.35)_50%,transparent_80%)] bg-[length:220%_100%] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-[shimmer_1.6s_linear_infinite]" />
        )}
      </motion.button>
    </div>

    {/* blocked */}
    {localBlocked && (
      <div className="mt-4 rounded-2xl border border-red-500/40 bg-red-900/30 p-4 text-center font-bold text-red-200">
        🚫 Submissions from this device are disabled.
      </div>
    )}

    {/* status */}
    {status && (
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          mt-4 rounded-2xl border border-white/10
          bg-white/[0.06] p-4 text-center
          font-bold text-white
        "
      >
        {status}
      </motion.p>
    )}
  </div>
</motion.form>
        </section>
      </div>
    </div>
  );
}
