import React, { useState } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";

const API = "https://singspacebackend.onrender.com";

// 🔥 HARD-CODE EMAILJS VALUES
const SERVICE_ID = "service_ud7473n";
const TEMPLATE_ID = "template_8kscp7c";
const PUBLIC_KEY = "BDPsT3cNRMnCg-OaU";

export default function CreateNewsletters({ prideId = 1 }) {

  // ---------------- STATE ----------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subscriberTypes, setSubscriberTypes] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [reviewMode, setReviewMode] = useState(false);
function formatPhone(value) {
  // remove anything not numeric
  const numbers = value.replace(/\D/g, "").slice(0, 10);

  const len = numbers.length;
  if (len < 4) return numbers;
  if (len < 7) return `(${numbers.slice(0,3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0,3)}) ${numbers.slice(3,6)}-${numbers.slice(6)}`;
}

  const SUBSCRIPTION_OPTIONS = [
    "sponsors",
    "vendors",
    "general",
    "programs"
  ];

  // ---------------- ENHANCE ----------------
  const enhanceNewsletter = async () => {
    if (!description.trim()) return alert("Enter text first!");

    try {
      const res = await axios.post(
        `${API}/api/generate-newsletter-enhancement`,
        { text: description }
      );

      setDescription(res.data.enhanced_text);
    } catch {
      alert("Enhancement failed.");
    }
  };

  // ---------------- FILE UPLOAD ----------------
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "karaoke");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dcw0wqlse/image/upload",
        { method: "POST", body: data }
      );

      const json = await res.json();
      if (json.secure_url) setImageUrl(json.secure_url);

    } catch {
      alert("Image upload failed");
    }
  };

  // ---------------- CHECKBOX ----------------
  const toggleType = (type) => {
    setSubscriberTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

// ---------------- SEND EMAIL ----------------
const sendEmailsFrontend = async () => {

  console.log("📩 STARTING EMAIL SEND");
  console.log("Subscriber Types:", subscriberTypes);

  const { data: subs } = await axios.get(
    `${API}/api/pride/${prideId}/subscriptions/by-types`,
    { params: { types: subscriberTypes.join(",") } }
  );

  console.log("Subscribers fetched:", subs);

  if (!subs || subs.length === 0) {
    console.warn("⚠️ No subscribers returned. STOP.");
    return;
  }

  const tasks = subs.map((sub, i) => {
    const name = `${sub.first_name || ""} ${sub.last_name || ""}`.trim();

    const payload = {
      to_name: name || "Subscriber",
      to_email: sub.email,
      newsletter_title: title,
      newsletter_description: description,
      image_url: imageUrl || " ",
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
    };

    console.log(`📨 EMAIL #${i + 1} PAYLOAD:`, payload);

    return emailjs
      .send(SERVICE_ID, TEMPLATE_ID, payload, PUBLIC_KEY)
      .then((res) => {
        console.log(`✔️ EMAIL SUCCESS (#${i + 1})`, res);
      })
      .catch((err) => {
        console.error(`❌ EMAIL FAIL (#${i + 1})`, err);
        throw err; // important so Promise.all catches error
      });
  });

  console.log("⏳ Waiting for all email tasks...");
  await Promise.all(tasks);
  console.log("🎉 All emails completed without throwing.");
};


  // ---------------- SUBMIT ----------------
const submitNewsletter = async () => {
  console.log("⏳ submitNewsletter() fired");
  console.log("Title:", title);
  console.log("Description length:", description.length);
  console.log("ImageUrl:", imageUrl);
  console.log("Subscriber types:", subscriberTypes);

  if (!title || !description || subscriberTypes.length === 0) {
    console.error("❌ Missing required fields");
    alert("Missing required fields");
    return;
  }

  setLoading(true);
  setStatus("");

  try {
    console.log("📩 Sending emails now...");
    await sendEmailsFrontend();

    console.log("📦 Saving to DB now...");
    await axios.post(
      `${API}/api/pride/${prideId}/newsletter/create`,
      {
        title,
        description,
        subscriber_types: subscriberTypes,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        image_url: imageUrl,
      }
    );

    console.log("✔️ DB saved");
    setStatus("success");
  } catch (err) {
    console.error("🔥 SEND NEWSLETTER FRONTEND ERROR:", err);
    setStatus("error");
  }

  setLoading(false);
};

  // ---------------- REVIEW VIEW ----------------
  if (reviewMode) {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 py-6">

      {/* HEADER */}
      <div className="text-center space-y-1">
        <h2 className="text-4xl font-extrabold text-yellow-300 tracking-wide">
          📄 Review Newsletter
        </h2>
        <p className="text-yellow-200 text-sm opacity-75">
          Preview how your recipients will see this email.
        </p>
      </div>

      {/* EMAIL PREVIEW WRAPPER */}
      <div className="rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-yellow-500/30 bg-gradient-to-b from-black/80 to-black/60">

        {/* HEADER TITLE BAR */}
        <div className="w-full bg-black/90 py-8 px-6 text-center border-b border-yellow-500/20">
          <h3 className="text-4xl font-extrabold text-yellow-300 uppercase tracking-wide drop-shadow-lg">
            {title || "Untitled Newsletter"}
          </h3>
        </div>

        {/* EMAIL CONTENT */}
        <div className="px-8 py-10 text-yellow-100 space-y-8">

          {/* IMAGE PREVIEW */}
          {imageUrl && (
            <div className="flex justify-center">
              <img
                src={imageUrl}
                alt="Newsletter banner"
                className="rounded-xl shadow-2xl w-full max-w-3xl border border-yellow-500/20"
              />
            </div>
          )}

          {/* BODY */}
          <div className="whitespace-pre-line text-lg leading-8 tracking-wide opacity-90">
            {description}
          </div>

          {/* CONTACT DETAILS BLOCK */}
          {(contactName || contactEmail || contactPhone) && (
            <div className="bg-white/5 p-6 rounded-xl border border-yellow-500/10 space-y-2 text-base">
              <h4 className="text-yellow-300 font-bold uppercase text-sm tracking-wide">
                Contact Information Included:
              </h4>

              {contactName && (
                <p>
                  <span className="text-yellow-200 opacity-80">Name:</span>{" "}
                  {contactName}
                </p>
              )}

              {contactEmail && (
                <p>
                  <span className="text-yellow-200 opacity-80">Email:</span>{" "}
                  {contactEmail}
                </p>
              )}

              {contactPhone && (
                <p>
                  <span className="text-yellow-200 opacity-80">Phone:</span>{" "}
                  {contactPhone}
                </p>
              )}
            </div>
          )}

          {/* AUDIENCE */}
          <div className="text-sm text-yellow-100 opacity-60 pt-4">
            <strong className="text-yellow-300">Audience Groups:</strong>{" "}
            {subscriberTypes.length > 0
              ? subscriberTypes.join(", ")
              : "No selection"}
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-black/40 py-10 text-center border-t border-yellow-500/20 text-yellow-800/50 text-xs tracking-wide">
          Preview Mode — This is a visual rendering of the outgoing email.
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-6 justify-between w-full">

        {/* EDIT */}
        <button
          onClick={() => setReviewMode(false)}
          className="w-1/2 py-4 rounded-xl border border-yellow-400 text-yellow-300 bg-black/60
                     font-bold hover:bg-black/80 transition shadow-lg"
        >
          ⬅️ Back to Editing
        </button>

        {/* SEND */}
        <button
          onClick={submitNewsletter}
          disabled={loading}
          className="w-1/2 py-4 rounded-xl bg-yellow-300 text-black font-extrabold tracking-widest
                     shadow-[0_0_20px_rgba(255,255,0,0.2)]
                     hover:brightness-110 transition"
        >
          {loading ? "Sending…" : "Send Newsletter →"}
        </button>
      </div>

      {/* STATUS MESSAGES */}
      {status === "success" && (
        <p className="text-green-400 font-bold text-center text-lg drop-shadow-lg">
          🎉 Newsletter sent & saved successfully!
        </p>
      )}

      {status === "error" && (
        <p className="text-red-400 font-bold text-center text-lg drop-shadow-lg">
          ❌ Sending failed — check template configuration.
        </p>
      )}

    </div>
  );
}

  // ---------------- CREATE FORM ----------------
  return (
  <div className="w-full max-w-5xl mx-auto space-y-10">

    {/* HEADER */}
    <div className="text-center space-y-2">
      <h2 className="text-4xl font-extrabold text-yellow-300 tracking-wide">
        ✉️ Create Newsletter
      </h2>
      <p className="text-yellow-200 opacity-80">
        Design your announcement, choose your audience, and send instantly.
      </p>
    </div>

    {/* FORM CARD */}
    <div className="bg-black/50 border border-yellow-500/20 rounded-2xl shadow-2xl p-10 space-y-12">

      {/* --- SECTION: RECIPIENT TYPES --- */}
      <section className="space-y-4">
        <h3 className="text-2xl font-bold text-yellow-300">Audience</h3>

        <p className="text-sm text-yellow-200 opacity-75">
          Select which subscription groups will receive this newsletter.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3">
          {SUBSCRIPTION_OPTIONS.map((t) => (
            <label
              key={t}
              className="flex items-center gap-2 cursor-pointer text-lg"
            >
              <input
                type="checkbox"
                checked={subscriberTypes.includes(t)}
                onChange={() => toggleType(t)}
                className="accent-yellow-400 w-5 h-5"
              />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>
      </section>

      <hr className="border-yellow-500/20" />

      {/* --- SECTION: IMAGE UPLOAD --- */}
      <section className="space-y-4">
        <h3 className="text-2xl font-bold text-yellow-300">
          Banner Image (Optional)
        </h3>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full text-yellow-100"
            />

            <input
              type="text"
              placeholder="Or paste an image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-yellow-500/20 outline-none"
            />
          </div>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="banner"
              className="w-56 h-32 object-cover rounded-lg shadow-xl border border-yellow-500/30"
            />
          )}
        </div>
      </section>

      <hr className="border-yellow-500/20" />

      {/* --- SECTION: TITLE + DESCRIPTION --- */}
      <section className="grid md:grid-cols-1 gap-10">

        {/* LEFT SIDE */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-yellow-300">
            Newsletter Title
          </h3>
          <input
            className="w-full p-3 rounded-lg bg-white/10 border border-yellow-500/20 outline-none text-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. December Community Updates"
          />
        </div>

        {/* RIGHT SIDE */}
              </section>

      {/* FULL WIDTH DESCRIPTION */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-yellow-300">
          Message Content
        </h3>

        <button
          onClick={enhanceNewsletter}
          className="px-6 py-2 bg-yellow-300 text-black font-bold rounded-lg shadow-md hover:brightness-110 transition w-full"
        >
          ✨ Enhance Message
        </button>

        <textarea
          rows={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your message here..."
          className="w-full p-4 rounded-lg bg-white/10 border border-yellow-500/20 outline-none text-lg"
        />
      </div>

      <hr className="border-yellow-500/20" />

      {/* --- CONTACT INFO ROW --- */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <label className="block text-yellow-300 font-bold text-lg">
            Contact Name
          </label>
          <input
            placeholder="Optional"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-yellow-500/20 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-yellow-300 font-bold text-lg">
            Contact Phone
          </label>
          <input
            placeholder="Optional"
            value={contactPhone}
            onChange={(e) => setContactPhone(formatPhone(e.target.value))}
            className="w-full p-3 rounded-lg bg-white/10 border border-yellow-500/20 outline-none"
            maxLength={14}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-yellow-300 font-bold text-lg">
            Contact Email
          </label>
          <input
            placeholder="Optional"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-yellow-500/20 outline-none"
          />
        </div>
      </section>
    </div>

    {/* REVIEW BUTTON */}
    <button
      onClick={() => setReviewMode(true)}
      className="w-full py-4 bg-yellow-300 text-black font-extrabold rounded-xl shadow-2xl hover:brightness-110 transition text-lg"
    >
      Continue to Review →
    </button>
  </div>
);

}
