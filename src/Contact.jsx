import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import emailjs from "@emailjs/browser";

/* ─────────────────────────────────────────────────────────────
   HARTFORD PRIDE CENTER — CONTACT PAGE
   "Community Poster" redesign to match HomePage:
   cream paper, flat pride-flag color blocks, ink outlines,
   hard offset shadows, huge Archivo type, rainbow marquee.
   All fetching, phone formatting, topic routing, terms lock,
   moderation, and EmailJS logic preserved.
   ───────────────────────────────────────────────────────────── */

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;
const SERVICE_ID = "service_ud7473n";
const TEMPLATE_ID = "template_6i8lf6u";
const PUBLIC_KEY = "BDPsT3cNRMnCg-OaU";

const FLAG = ["#E40303", "#FF8C00", "#FFED00", "#008026", "#004DFF", "#750787"];

/* shared input styling — white field, ink outline, focus ring */
const inputBase =
  "w-full min-w-0 rounded-xl border-2 border-[#181310] bg-white text-[#181310] px-4 py-2.5 text-sm sm:text-base placeholder:text-[#9a8f85] outline-none transition-all duration-200 focus:ring-4 focus:ring-[#004DFF]/25";

const labelBase =
  "mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-[#4a4038]";

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
        const [servicesRes, committeesRes, adminsRes, staffRes] =
          await Promise.all([
            axios.get(`${API}/api/pride/${PRIDE_ID}/services`),
            axios.get(`${API}/api/pride-committees/pride/${PRIDE_ID}`),
            axios.get(`${API}/api/pride/${PRIDE_ID}/admins`),
            axios.get(`${API}/api/pride/${PRIDE_ID}/staff`),
          ]);

        setServices(servicesRes.data || []);
        setCommittees((committeesRes.data || []).filter((c) => c.is_active));
        setAdmins((adminsRes.data || []).filter((a) => a.is_active));
        setStaff((staffRes.data || []).filter((s) => s.is_active));

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
          axios.get(`${API}/api/pride-committees/pride/${PRIDE_ID}`),
        ]);

        console.log("🧩 Pride services:", servicesRes.data);
        console.log("🧭 Pride committees:", committeesRes.data);

        setServices(servicesRes.data || []);
        setCommittees((committeesRes.data || []).filter((c) => c.is_active));
      } catch (err) {
        console.error("❌ Failed to fetch Pride data:", err);
      }
    };

    fetchServicesAndCommittees();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API}/api/pride/${PRIDE_ID}/services`);

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

    const service = services.find((s) => s.title === value);
    const committee = committees.find((c) => c.name === value);
    const admin = admins.find((a) => a.id === Number(value));
    const staffMember = staff.find((s) => s.id === Number(value));

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
      const cleanedMessage = prev.message.replace(/^[\s\S]*?\n\n/, "");

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
      // ================= SAVE TO BACKEND =================
      const res = await axios.post(`${API}/api/pride/${PRIDE_ID}/contact`, {
        name: form.name,
        email: form.email,
        phone: phone || null,
        message: form.message,
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

      // ================= BUILD PRETTY TOPIC LABEL =================
      let formattedTopic = selectedTopic || "General Inquiry";

      const service = services.find((s) => s.title === selectedTopic);
      const committee = committees.find((c) => c.name === selectedTopic);
      const admin = admins.find((a) => a.id === Number(selectedTopic));
      const staffMember = staff.find((s) => s.id === Number(selectedTopic));

      if (service) {
        formattedTopic = `${service.title} Services`;
      } else if (committee) {
        formattedTopic = `${committee.name} Committee`;
      } else if (admin) {
        formattedTopic = `Connect with ${admin.name} (Admin)`;
      } else if (staffMember) {
        formattedTopic = `Connect with ${staffMember.first_name} ${staffMember.last_name} (${staffMember.role})`;
      }

      // ================= SEND EMAILJS EMAIL =================
      const templateParams = {
        from_name: form.name,
        from_email: form.email,
        phone: phone || "N/A",
        selected_topic: formattedTopic,
        message: form.message,
      };

      console.log("📨 Sending Pride Contact Email:", templateParams);

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      console.log("✅ EmailJS Sent Successfully");

      // ================= SUCCESS RESET =================
      setStatus("📬 Message sent successfully! We'll be in touch soon.");

      setForm({
        name: "",
        email: "",
        message: "",
      });

      setPhone("");
      setSelectedTopic("");
      setTermsAccepted(false);
    } catch (err) {
      console.error("❌ CONTACT FORM ERROR:", err);
      setStatus("❌ Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-[#181310] overflow-x-hidden hpc-body">
      {/* local styles: display font + marquee animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..900&display=swap');
        .hpc-display { font-family: 'Archivo', system-ui, sans-serif; font-stretch: 87%; }
        .hpc-body { font-family: 'Archivo', system-ui, sans-serif; }
        @keyframes hpc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .hpc-marquee-track { animation: hpc-marquee 26s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hpc-marquee-track { animation: none; }
        }
      `}</style>

      {/* ── FLAG STRIPE TOPBAR ── */}
      <div className="flex h-2.5 mt-16 w-full" aria-hidden="true">
        {FLAG.map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10">
        <div className="grid lg:grid-cols-[1fr,1fr] gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p className="inline-block rounded-full bg-[#181310] text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-2">
              Get in touch
            </p>

            <h1 className="hpc-display mt-6 font-black uppercase leading-[0.92] tracking-tight text-[clamp(2.6rem,9vw,5.5rem)]">
              Contact
              <br />
              <span className="inline-block -rotate-1 rounded-lg px-3 text-white" style={{ backgroundColor: "#004DFF" }}>
                us.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#4a4038] font-medium">
              Questions, partnerships, volunteering, or support — reach our
              committees, staff, and programs. We'll be in touch soon.
            </p>
          </motion.div>

          {/* framed banner */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative rotate-2 rounded-2xl border-2 border-[#181310] bg-white p-3 shadow-[8px_8px_0_#181310]">
              <div
                className="h-52 sm:h-64 w-full rounded-xl bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.squarespace-cdn.com/content/v1/5ac3f2dd3e2d0974e2f2f286/1529702076428-JZK6BYEGGOI8G1CVPMFZ/Pride-2138.jpg?format=1500w')",
                }}
                role="img"
                aria-label="Pride celebration banner"
              />
              <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full" aria-hidden="true">
                {FLAG.map((c) => (
                  <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div
              className="absolute -bottom-4 -right-2 rotate-3 rounded-full border-2 border-[#181310] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_#181310]"
              style={{ backgroundColor: "#008026" }}
            >
              We reply fast
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RAINBOW MARQUEE (signature) ── */}
      <div className="overflow-hidden border-y-2 border-[#181310] bg-[#181310] py-3 sm:py-4">
        <div className="hpc-marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
              {["Ask", "Partner", "Volunteer", "Connect", "Support", "Hello"].map(
                (word, i) => (
                  <span key={word} className="flex items-center gap-8">
                    <span
                      className="hpc-display text-2xl sm:text-3xl font-black uppercase tracking-tight"
                      style={{ color: FLAG[i % FLAG.length] }}
                    >
                      {word}
                    </span>
                    <span className="text-white/60 text-xl">✦</span>
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        {/* info boxes */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {[
            ["🤝", "Volunteer & Community Involvement", "Join projects, events, and local outreach efforts.", "#008026"],
            ["🌈", "Partnerships & Sponsorships", "Connect your business or organization with Pride initiatives.", "#FF8C00"],
            ["💬", "Questions, Services & Support", "Reach committees, staff, admins, and available programs.", "#004DFF"],
          ].map((box, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex flex-col overflow-hidden rounded-2xl border-2 border-[#181310] bg-white shadow-[6px_6px_0_#181310]"
            >
              <div className="h-3" style={{ backgroundColor: box[3] }} aria-hidden="true" />
              <div className="p-6">
                <div className="text-3xl mb-3">{box[0]}</div>
                <div className="hpc-display text-lg font-black uppercase leading-tight tracking-tight">
                  {box[1]}
                </div>
                <div className="mt-2 text-sm font-semibold leading-relaxed text-[#4a4038]">
                  {box[2]}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ================= FORM ================= */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-[#181310] bg-white p-5 sm:p-8 shadow-[8px_8px_0_#181310]"
        >
          {/* top flag stripe inside the card */}
          <div className="mb-6 flex h-2 w-full overflow-hidden rounded-full" aria-hidden="true">
            {FLAG.map((c) => (
              <div key={c} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>

          {/* fields */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* NAME */}
            <div className="col-span-1">
              <label className={labelBase}>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputBase}
              />
            </div>

            {/* EMAIL */}
            <div className="col-span-1">
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

            {/* PHONE */}
            <div className="col-span-2 sm:col-span-1">
              <label className={labelBase}>
                Phone{" "}
                <span className="normal-case tracking-normal text-[#9a8f85]">
                  (optional)
                </span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                className={inputBase}
              />
            </div>

            {/* TOPIC / INTEREST */}
            <div className="col-span-2 sm:col-span-1">
              <label className={labelBase}>Topic / Interest</label>

              <select
                value={selectedTopic}
                onChange={handleTopicSelect}
                className={`${inputBase} py-3`}
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
              <label className={labelBase}>Message</label>
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
                className={`${inputBase} rounded-2xl`}
              />
            </div>
          </div>

          {/* terms card */}
          <div className="mt-5 rounded-2xl border-2 border-[#181310] bg-[#FFFBF2] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-5 w-5 rounded accent-[#750787]"
              />

              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => setShowTerms(!showTerms)}
                  className="text-left text-sm sm:text-base font-black uppercase tracking-wide text-[#181310] underline decoration-[#181310]/40 underline-offset-4 transition hover:text-[#750787]"
                >
                  I agree to the Terms and Conditions
                </button>

                <p className="mt-1 text-xs sm:text-sm font-semibold text-[#6b5f57]">
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
                  className="mt-4 overflow-hidden rounded-xl border-2 border-[#181310] bg-white p-4 text-sm font-medium text-[#4a4038]"
                >
                  <p>
                    You consent to being contacted regarding your inquiry using
                    the information submitted.
                  </p>
                  <p className="mt-3 font-black text-[#E40303]">
                    Hate, harassment, or threats will lock this device
                    immediately and submit IP address for a possible report to
                    authorities.
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
              whileHover={termsAccepted && !localBlocked ? { scale: 1.01 } : {}}
              whileTap={termsAccepted && !localBlocked ? { scale: 0.985 } : {}}
              className={`
                w-full rounded-xl border-2 border-[#181310] py-4 px-5
                text-base sm:text-lg font-black uppercase tracking-wide
                shadow-[4px_4px_0_#181310] transition-all
                ${
                  termsAccepted && !localBlocked
                    ? "bg-blue-500 text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-blue-600 hover:shadow-[2px_2px_0_#181310]"
                    : "cursor-not-allowed bg-[#e7e0d6] text-[#9a8f85] shadow-[4px_4px_0_#c9c1b5]"
                }
              `}
            >
              {isLoading ? "Sending…" : "Send Message 🌈"}
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
              className="mt-4 rounded-xl border-2 border-[#181310] bg-[#FFED00] p-4 text-center font-bold text-[#181310]"
            >
              {status}
            </motion.p>
          )}
        </motion.form>
      </section>

      {/* ── BOTTOM FLAG STRIPE ── */}
      <div className="flex h-2.5 w-full" aria-hidden="true">
        {FLAG.map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  );
}