import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import emailjs from "@emailjs/browser";

/* ─────────────────────────────────────────────────────────────
   HARTFORD PRIDE CENTER — DRISCOLL FUND APPLICATION
   Retrofit of the Contact page. Same backend + EmailJS endpoints:
   it is still a "contact" submission, reframed as a financial-
   assistance application for people living with HIV.

   HOW IT MAPS TO THE EXISTING ENDPOINT
   ------------------------------------
   The backend only accepts { name, email, phone, message }, so:
     • name    = firstName + " " + lastName (sent together)
     • topic   = locked to "Driscoll Fund Application" (not editable)
     • every field without its own backend column (address, HIV
       status, employment, the two written answers, demographics)
       is formatted and APPENDED into `message`.

   Theme: teddy bears + red ribbon, cream paper, ink outlines,
   hard offset shadows, Archivo display type, falling ribbons.
   Hate-speech lock, device block, moderation, and terms logic
   are all preserved from the original.
   ───────────────────────────────────────────────────────────── */

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;
const SERVICE_ID = "service_ud7473n";
const TEMPLATE_ID = "template_6i8lf6u";
const PUBLIC_KEY = "BDPsT3cNRMnCg-OaU";

/* topic is fixed for this page */
const FIXED_TOPIC = "Driscoll Fund Application";

/* warm palette: red ribbon + teddy brown + gold */
const RED = "#E40303";
const RED_DEEP = "#C1121F";
const TEDDY = "#A9744F";
const GOLD = "#F4B942";
const STRIPE = [RED, GOLD, TEDDY, RED_DEEP];
const MARQUEE = [RED, TEDDY, GOLD, RED_DEEP, "#8B5E3C", RED];

/* falling ribbon config */
const RIBBONS = Array.from({ length: 8 }).map((_, i) => ({
  left: `${(i * 12 + 5) % 95}%`,
  delay: `${(i * 2.5).toFixed(1)}s`,
  duration: `${(16 + (i % 4) * 4).toFixed(1)}s`,
  size: `${18 + (i % 3) * 6}px`,
}));

/* option lists */
const HIV_STATUS = [
  "Living with HIV",
  "HIV-negative",
  "Unknown / Not sure",
  "Prefer not to disclose",
];
const EMPLOYMENT = [
  "Employed full-time",
  "Employed part-time",
  "Unemployed",
  "Unable to work / Disability",
  "Retired",
  "Student",
  "Prefer not to disclose",
];

const handleShare = async () => {
  const shareUrl =
    "https://share.karaoverse.com/og/driscoll-fund";

  if (navigator.share) {
    try {
      await navigator.share({
        title: "🧸 Driscoll Fund",
        text:
          "Apply for financial assistance through the Driscoll Fund. Supporting people living with HIV across Greater Hartford with compassion, dignity, and hope.",
        url: shareUrl,
      });
    } catch (err) {
      console.log("Share cancelled");
    }
  } else {
    await navigator.clipboard.writeText(shareUrl);
    alert("Share link copied!");
  }
};
const AGE_RANGES = [
  "Under 18",
  "18–24",
  "25–34",
  "35–44",
  "45–54",
  "55–64",
  "65+",
  "Prefer not to disclose",
];
const GENDERS = [
  "Woman",
  "Man",
  "Non-binary",
  "Transgender woman",
  "Transgender man",
  "Two-Spirit",
  "Prefer to self-describe",
  "Prefer not to disclose",
];
const RACE_OPTIONS = [
  "Black or African American",
  "Hispanic or Latino/a/e",
  "White",
  "Asian",
  "Native American or Alaska Native",
  "Native Hawaiian or Pacific Islander",
  "Middle Eastern or North African",
  "Multiracial",
  "Prefer not to disclose",
];

/* shared input styling — white field, ink outline, focus ring */
const inputBase =
  "w-full min-w-0 rounded-xl border-2 border-[#181310] bg-white text-[#181310] px-4 py-2.5 text-sm sm:text-base placeholder:text-[#9a8f85] outline-none transition-all duration-200 focus:ring-4 focus:ring-[#E40303]/25";

const labelBase =
  "mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-[#4a4038]";

export default function DriscollFund() {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localBlocked, setLocalBlocked] = useState(false);

  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [reimbursementAck, setReimbursementAck] = useState(false);

  const [phone, setPhone] = useState("");
  const [raceSelections, setRaceSelections] = useState([]);
  const [genderSelfDescribe, setGenderSelfDescribe] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    state: "",
    hivStatus: "",
    employment: "",
    fundsUse: "",
    challenges: "",
    age: "",
    gender: "",
  });

  /* read device block on load */
  useEffect(() => {
    const blocked = localStorage.getItem("pride_contact_blocked");
    if (blocked === "true") {
      setLocalBlocked(true);
      setStatus(
        "🚫 This device has been locked due to prior hate speech violations. Submissions are disabled."
      );
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

  const toggleRace = (value) => {
    setRaceSelections((prev) => {
      // "Prefer not to disclose" is exclusive
      if (value === "Prefer not to disclose") return prev.includes(value) ? [] : [value];
      const next = prev.filter((r) => r !== "Prefer not to disclose");
      return next.includes(value)
        ? next.filter((r) => r !== value)
        : [...next, value];
    });
  };

  /* build the appended message body from every non-backend field */
  const buildMessage = () => {
    const genderValue =
      form.gender === "Prefer to self-describe" && genderSelfDescribe.trim()
        ? `Self-described: ${genderSelfDescribe.trim()}`
        : form.gender || "Not provided";

    const race = raceSelections.length
      ? raceSelections.join(", ")
      : "Not provided";

    return [
      "DRISCOLL FUND — FINANCIAL ASSISTANCE APPLICATION",
      "",
      "— Applicant —",
      `Name: ${form.firstName} ${form.lastName}`,
      `Email: ${form.email}`,
      `Phone: ${phone || "N/A"}`,
      `Location: ${form.city}, ${form.state}`,
      "",
      "— Status & Employment —",
      `HIV Status: ${form.hivStatus || "Not provided"}`,
      `Employment Status: ${form.employment || "Not provided"}`,
      "",
      "— Application Questions —",
      "1) If awarded financial assistance, what will you be using the funds for?",
      form.fundsUse || "(no response)",
      "",
      "2) What challenges have you / are you experiencing with managing your HIV status?",
      form.challenges || "(no response)",
      "",
      "— Demographic Data (voluntary) —",
      `Age: ${form.age || "Not provided"}`,
      `Gender: ${genderValue}`,
      `Race / Ethnicity: ${race}`,
      "",
      "— Reimbursement —",
      `Acknowledged reimbursement program: ${reimbursementAck ? "Yes" : "No"}`,
    ].join("\n");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (localBlocked) {
      setStatus(
        "🚫 This device has been locked due to prior hate speech violations. Submissions are disabled."
      );
      return;
    }
    if (!reimbursementAck) {
      setStatus("❗ Please acknowledge that the Driscoll Fund is a reimbursement program.");
      return;
    }
    if (!termsAccepted) {
      setStatus("❗ You must agree to the Terms and Conditions before submitting.");
      return;
    }

    setIsLoading(true);
    setStatus("");

    const fullName = `${form.firstName} ${form.lastName}`.trim();
    const message = buildMessage();

    try {
      // ================= SAVE TO BACKEND (same contact endpoint) =================
      const res = await axios.post(`${API}/api/pride/${PRIDE_ID}/contact`, {
        name: fullName,
        email: form.email,
        phone: phone || null,
        message,
      });

      // ================= MODERATION BLOCK =================
      if (res.data?.contact_status === "flagged") {
        localStorage.setItem("pride_contact_blocked", "true");
        setLocalBlocked(true);
        setStatus(
          "🚨 Hate speech was detected. Your information has been logged and this device has been blocked."
        );
        return;
      }

      // ================= SEND EMAILJS EMAIL =================
      const templateParams = {
        from_name: fullName,
        from_email: form.email,
        phone: phone || "N/A",
        selected_topic: FIXED_TOPIC,
        message,
      };

      console.log("📨 Sending Driscoll Fund Application:", templateParams);
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      console.log("✅ EmailJS Sent Successfully");

      // ================= SUCCESS RESET =================
      setStatus(
        "📬 Application submitted! Our team will review it and reach out with next steps. Thank you for trusting us."
      );
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        state: "",
        hivStatus: "",
        employment: "",
        fundsUse: "",
        challenges: "",
        age: "",
        gender: "",
      });
      setPhone("");
      setRaceSelections([]);
      setGenderSelfDescribe("");
      setReimbursementAck(false);
      setTermsAccepted(false);
    } catch (err) {
      console.error("❌ DRISCOLL FUND FORM ERROR:", err);
      setStatus("❌ Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = termsAccepted && reimbursementAck && !localBlocked;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FFFBF2] text-[#181310] hpc-body">
      {/* local styles: display font + marquee + falling ribbons */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..900&display=swap');
        .hpc-display { font-family: 'Archivo', system-ui, sans-serif; font-stretch: 87%; }
        .hpc-body { font-family: 'Archivo', system-ui, sans-serif; }
        @keyframes hpc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .hpc-marquee-track { animation: hpc-marquee 26s linear infinite; }
        @keyframes hpc-fall {
          0%   { transform: translateY(-12vh) rotate(0deg);   opacity: 0; }
          8%   { opacity: .6; }
          100% { transform: translateY(112vh) rotate(300deg); opacity: 0; }
        }
        .hpc-ribbon {
          position: absolute; top: 0;
          animation-name: hpc-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          opacity: .55; will-change: transform; user-select: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .hpc-marquee-track { animation: none; }
          .hpc-ribbon { display: none; }
        }
      `}</style>

      {/* ── FALLING RED RIBBONS (decorative) ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {RIBBONS.map((r, i) => (
  <img
    key={`ribbon-${i}`}
    src="/Driscoll.png"
    alt=""
    className="hpc-ribbon"
    style={{
      left: r.left,
      animationDelay: r.delay,
      animationDuration: r.duration,
      width: r.size,
    }}
  />
))}
      </div>

      {/* everything else sits above the ribbons */}
      <div className="relative z-10">
        {/* ── STRIPE TOPBAR ── */}
        <div className="mt-16 flex h-2.5 w-full" aria-hidden="true">
          {STRIPE.map((c, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* ── HERO ── */}
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr,1fr] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              <p className="inline-block rounded-full bg-[#181310] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white sm:text-xs">
                ·🧸 The Driscoll Fund ·
              </p>

              <h1 className="hpc-display mt-6 font-black uppercase leading-[0.92] tracking-tight text-[clamp(2.4rem,8vw,5rem)]">
                Apply for
                <br />
                <span
                  className="inline-block -rotate-1 rounded-lg px-3 text-white"
                  style={{ backgroundColor: RED }}
                >
                  support.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-[#4a4038] sm:text-lg">
                Financial assistance for people living with HIV across Greater
                Hartford — because no one should have to choose between care,
                keeping the lights on, or food on the table.
              </p>
            </motion.div>
<div className=" flex justify-center flex-wrap gap-4">
  <motion.button
    type="button"
    onClick={handleShare}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="
      inline-flex items-center gap-2
      rounded-xl justify-center
      border-2 border-[#181310]
      bg-[#181310]
      px-6 py-3
      text-sm sm:text-base
      font-black uppercase tracking-wide
      text-white
      shadow-[4px_4px_0_#181310]
      transition-all
      hover:bg-[#E40303]
      hover:translate-x-[2px]
      hover:translate-y-[2px]
      hover:shadow-[2px_2px_0_#181310]
    "
  >
    ❤️ Share Application
  </motion.button>
</div>
            {/* framed banner (uses /Driscoll2.jpg from your public folder) */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-md lg:max-w-none"
            >
              <div className="relative rotate-2 rounded-2xl border-2 border-[#181310] bg-white p-3 shadow-[8px_8px_0_#181310]">
                <div
                  className="h-52 w-full rounded-xl bg-contain bg-center bg-no-repeat sm:h-64"
                  style={{ backgroundImage: "url('/Driscoll2.jpg')" }}
                  role="img"
                  aria-label="The Driscoll Fund"
                />

                <div
                  className="mt-3 flex h-2 w-full overflow-hidden rounded-full"
                  aria-hidden="true"
                >
                  {STRIPE.map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              <div
                className="absolute -bottom-4 -right-2 rotate-3 rounded-full border-2 border-[#181310] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_#181310]"
                style={{ backgroundColor: TEDDY }}
              >
                Here for you 🧸
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── RIBBON MARQUEE ── */}
        <div className="overflow-hidden border-y-2 border-[#181310] bg-[#f6f6f6] py-3 sm:py-4">
          <div className="hpc-marquee-track flex w-max items-center gap-8 whitespace-nowrap">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
                {["Care", "Dignity", "Support", "Relief", "Community", "Hope"].map(
                  (word, i) => (
                    <span key={word} className="flex items-center gap-8">
                      <span
                        className="hpc-display text-2xl font-black uppercase tracking-tight sm:text-3xl"
                        style={{ color: MARQUEE[i % MARQUEE.length] }}
                      >
                        {word}
                      </span>
<img
  src="/Driscoll.png"
  alt=""
  aria-hidden="true"
  className="h-7 w-7 shrink-0 object-contain opacity-90 select-none"
  draggable={false}
/>                    </span>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          {/* awareness blurb */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="mb-10 overflow-hidden rounded-2xl border-2 border-[#181310] bg-white shadow-[6px_6px_0_#181310]"
          >
            <div className="h-3" style={{ backgroundColor: RED }} aria-hidden="true" />
            <div className="p-6 sm:p-8">
              <div className="hpc-display text-xl font-black uppercase leading-tight tracking-tight sm:text-2xl">
                🎗️ July is HIV Awareness Month
              </div>
              <div className="mt-4 space-y-4 text-sm font-medium leading-relaxed text-[#4a4038] sm:text-base">
                <p>
                  It's a time to recognize the progress we've made, confront the
                  challenges that remain, and recommit ourselves to ensuring that
                  every person living with HIV has access to the care, dignity, and
                  support they deserve. As we approach National HIV Stigma Day on
                  July 21st, we are reminded that stigma is not only measured in
                  words. It is also reflected in the financial barriers that
                  continue to prevent people from accessing life-saving care.
                </p>
                <p>
                  At the Hartford Pride Center, a program of CLARO, Inc., we believe
                  no one should have to choose between paying for medication, keeping
                  the lights on, or putting food on the table. Yet for far too many
                  people living with HIV across Greater Hartford, these impossible
                  decisions remain a daily reality.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ================= APPLICATION FORM ================= */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-[#181310] bg-white p-5 shadow-[8px_8px_0_#181310] sm:p-8"
          >
            {/* top stripe */}
            <div className="mb-6 flex h-2 w-full overflow-hidden rounded-full" aria-hidden="true">
              {STRIPE.map((c, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>

            {/* fixed topic (locked) */}
            <div className="mb-6">
              <label className={labelBase}>Applying for</label>
              <div
                className="flex items-center gap-2 rounded-xl border-2 border-dashed border-[#181310] bg-[#FFFBF2] px-4 py-2.5 text-sm font-black uppercase tracking-wide text-[#181310] sm:text-base"
                aria-readonly="true"
              >
                🧸 {FIXED_TOPIC}
              </div>
            </div>

            {/* ── APPLICANT ── */}
            <SectionHeading color={RED}>Your information</SectionHeading>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-1">
                <label className={labelBase}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className={inputBase}
                />
              </div>
              <div className="col-span-1">
                <label className={labelBase}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className={inputBase}
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={labelBase}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={inputBase}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelBase}>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  className={inputBase}
                />
              </div>

              <div className="col-span-1">
                <label className={labelBase}>City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className={inputBase}
                />
              </div>
              <div className="col-span-1">
                <label className={labelBase}>State</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  placeholder="CT"
                  className={inputBase}
                />
              </div>
            </div>

            {/* ── STATUS & EMPLOYMENT ── */}
            <SectionHeading color={TEDDY} className="mt-8">
              Status &amp; employment
            </SectionHeading>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelBase}>HIV Status</label>
                <select
                  name="hivStatus"
                  value={form.hivStatus}
                  onChange={handleChange}
                  required
                  className={`${inputBase} py-3`}
                >
                  <option value="">Select…</option>
                  {HIV_STATUS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelBase}>Employment Status</label>
                <select
                  name="employment"
                  value={form.employment}
                  onChange={handleChange}
                  required
                  className={`${inputBase} py-3`}
                >
                  <option value="">Select…</option>
                  {EMPLOYMENT.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── QUESTIONS ── */}
            <SectionHeading color={GOLD} className="mt-8">
              Application questions
            </SectionHeading>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className={labelBase}>
                  1) If awarded financial assistance, what will you be using the
                  funds for?
                </label>
                <textarea
                  name="fundsUse"
                  rows="4"
                  value={form.fundsUse}
                  onChange={handleChange}
                  required
                  className={`${inputBase} rounded-2xl`}
                />
              </div>
              <div>
                <label className={labelBase}>
                  2) What challenges have you / are you experiencing with managing
                  your HIV status?
                </label>
                <textarea
                  name="challenges"
                  rows="4"
                  value={form.challenges}
                  onChange={handleChange}
                  required
                  className={`${inputBase} rounded-2xl`}
                />
              </div>
            </div>

            {/* ── DEMOGRAPHICS ── */}
            <SectionHeading color={RED_DEEP} className="mt-8">
              Demographic data
            </SectionHeading>
            <p className="-mt-3 mb-4 text-xs font-semibold text-[#6b5f57]">
              Voluntary — this helps us report on and improve who the fund reaches.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelBase}>Age</label>
                <select
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className={`${inputBase} py-3`}
                >
                  <option value="">Prefer not to say</option>
                  {AGE_RANGES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelBase}>Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={`${inputBase} py-3`}
                >
                  <option value="">Prefer not to say</option>
                  {GENDERS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {form.gender === "Prefer to self-describe" && (
                <div className="col-span-2">
                  <label className={labelBase}>Self-describe</label>
                  <input
                    type="text"
                    value={genderSelfDescribe}
                    onChange={(e) => setGenderSelfDescribe(e.target.value)}
                    className={inputBase}
                  />
                </div>
              )}

              <div className="col-span-2">
                <label className={labelBase}>Race / Ethnicity</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {RACE_OPTIONS.map((o) => (
                    <label
                      key={o}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[#181310] bg-[#FFFBF2] px-3 py-2 text-sm font-semibold text-[#4a4038]"
                    >
                      <input
                        type="checkbox"
                        checked={raceSelections.includes(o)}
                        onChange={() => toggleRace(o)}
                        className="h-4 w-4 rounded accent-[#E40303]"
                      />
                      {o}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── REIMBURSEMENT ── */}
            <SectionHeading color={RED} className="mt-8">
              Reimbursement
            </SectionHeading>
            <div className="rounded-2xl border-2 border-[#181310] bg-[#FFFBF2] p-4 sm:p-5">
              <p className="text-sm font-semibold leading-relaxed text-[#4a4038] sm:text-base">
                The Driscoll Fund is a <strong>reimbursement program</strong>. That
                means assistance is typically issued to reimburse eligible expenses
                you've already paid, or paid directly to a provider, once your
                application is reviewed and approved. If your application moves
                forward, our team will follow up with you directly about any
                receipts, invoices, or medical bills needed to process your
                reimbursement.
              </p>

              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={reimbursementAck}
                  onChange={(e) => setReimbursementAck(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded accent-[#E40303]"
                />
                <span className="text-sm font-semibold text-[#4a4038]">
                  I understand the Driscoll Fund is a reimbursement program and I may
                  be asked to provide documentation for the expenses in this
                  application.
                </span>
              </label>
            </div>

            {/* ── TERMS ── */}
            <div className="mt-6 rounded-2xl border-2 border-[#181310] bg-[#FFFBF2] p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded accent-[#E40303]"
                />
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => setShowTerms(!showTerms)}
                    className="text-left text-sm font-black uppercase tracking-wide text-[#181310] underline decoration-[#181310]/40 underline-offset-4 transition hover:text-[#E40303] sm:text-base"
                  >
                    I agree to the Terms and Conditions
                  </button>
                  <p className="mt-1 text-xs font-semibold text-[#6b5f57] sm:text-sm">
                    Please review how your information is handled before submitting.
                  </p>
                </div>
              </div>

              <AnimatePresence>
                {showTerms && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    className="mt-4 overflow-hidden rounded-xl border-2 border-[#181310] bg-white p-4 text-sm font-medium text-[#4a4038]"
                  >
                    <p>
                      The information you provide — including any health-related
                      details — is used solely to review your Driscoll Fund
                      application and to contact you about it. You consent to being
                      contacted regarding this application using the information
                      submitted.
                    </p>
                    <p className="mt-3 font-black text-[#E40303]">
                      Hate, harassment, or threats will lock this device immediately
                      and submit the IP address for a possible report to authorities.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── SUBMIT ── */}
            <div className="mt-6">
              <motion.button
                type="submit"
                disabled={isLoading || !canSubmit}
                whileHover={canSubmit ? { scale: 1.01 } : {}}
                whileTap={canSubmit ? { scale: 0.985 } : {}}
                className={`
                  w-full rounded-xl border-2 border-[#181310] px-5 py-4
                  text-base font-black uppercase tracking-wide shadow-[4px_4px_0_#181310]
                  transition-all sm:text-lg
                  ${
                    canSubmit
                      ? "bg-[#E40303] text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#C1121F] hover:shadow-[2px_2px_0_#181310]"
                      : "cursor-not-allowed bg-[#e7e0d6] text-[#9a8f85] shadow-[4px_4px_0_#c9c1b5]"
                  }
                `}
              >
                {isLoading ? "Submitting…" : "Submit Application 🎗️"}
              </motion.button>
            </div>

            {/* blocked */}
            {localBlocked && (
              <div className="mt-4 rounded-xl border-2 border-[#E40303] bg-[#E40303]/10 p-4 text-center font-black uppercase tracking-wide text-[#E40303]">
                🚫 Submissions from this device are disabled.
              </div>
            )}

            {/* status */}
            {status && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border-2 border-[#181310] bg-[#F4B942] p-4 text-center font-bold text-[#181310]"
              >
                {status}
              </motion.p>
            )}
          </motion.form>
        </section>

        {/* ── BOTTOM STRIPE ── */}
        <div className="flex h-2.5 w-full" aria-hidden="true">
          {STRIPE.map((c, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* small section heading with a colored ink-outlined chip */
function SectionHeading({ children, color, className = "" }) {
  return (
    <div className={`mb-4 flex items-center gap-3 ${className}`}>
      <span
        className="inline-block h-4 w-4 rounded-full border-2 border-[#181310]"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <h2 className="hpc-display text-lg font-black uppercase leading-none tracking-tight sm:text-xl">
        {children}
      </h2>
    </div>
  );
}