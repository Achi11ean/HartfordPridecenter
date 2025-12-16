import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

    const API_BASE = "https://singspacebackend.onrender.com";
const PRIDE_ID = 1;

// 🔐 Cloudinary (same pattern as before)
const CLOUD_NAME = "dcw0wqlse";
const UPLOAD_PRESET = "karaoke";

// ⭐ Sponsor tiers
const SPONSOR_TIERS = [
    "Customized Tier",
  "Community Supporter",
  "Bronze Sponsor",
  "Silver Sponsor",
  "Gold Sponsor",
  "Platinum Sponsor",
  "In-Kind Sponsor",
];
  const SOCIAL_OPTIONS = [
  { key: "facebook", label: "Facebook", prefix: "https://facebook.com/" },
  { key: "instagram", label: "Instagram", prefix: "https://instagram.com/" },
];

export default function Sponsor() {
const normalizeWebsite = (value) => {
  return value
    .replace(/^https?:\/\//i, "") // strip http:// or https://
    .trim();
};

const formatPhoneNumber = (value) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length === 0) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7)
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

  const [form, setForm] = useState({
    organization: "",
    contact_name: "",
    email: "",
    phone: "",
    tier: "",
    wants_booth: false,
    website: "",
    social_links: "",
    logo_url: "",
    message: "",
  });

const [socialInputs, setSocialInputs] = useState({});


const handleAddSocial = (platform) => {
  setSocialInputs((prev) => ({
    ...prev,
    [platform]: "",
  }));
};

const handleSocialChange = (platform, value) => {
  setSocialInputs((prev) => ({
    ...prev,
    [platform]: value,
  }));
};



  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
useEffect(() => {
  const stored = localStorage.getItem("pendingSponsorProspect");
  if (!stored) return;

  try {
    const prospect = JSON.parse(stored);

    setForm((prev) => ({
      ...prev,
      organization: prospect.organization || "",
      contact_name: prospect.contact_name || "",
      email: prospect.email || "",
      phone: prospect.phone || "",
      message: prospect.message || "",
    }));

    // 🔥 Important: clear it so it only autofills once
    localStorage.removeItem("pendingSponsorProspect");
  } catch (err) {
    console.error("Failed to parse pending sponsor prospect", err);
  }
}, []);

  // ───────────────────────────────
  // Form Change
  // ───────────────────────────────
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (name === "phone") {
    setForm((prev) => ({
      ...prev,
      phone: formatPhoneNumber(value),
    }));
    return;
  }

  if (name === "website") {
    setForm((prev) => ({
      ...prev,
      website: normalizeWebsite(value),
    }));
    return;
  }

  setForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};


  // ───────────────────────────────
  // Logo Upload (Cloudinary)
  // ───────────────────────────────
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data
      );

      setForm((prev) => ({
        ...prev,
        logo_url: res.data.secure_url,
      }));
    } catch (err) {
      console.error("❌ Logo upload failed", err);
      setError("Logo upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ───────────────────────────────
  // Submit
  // ───────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
const socialLinksJoined = Object.entries(socialInputs)
  .map(([platform, value]) => {
    if (!value.trim()) return null;
    const prefix = SOCIAL_OPTIONS.find(o => o.key === platform)?.prefix;
    return `${prefix}${value.trim()}`;
  })
  .filter(Boolean)
  .join(",");

await axios.post(
  `${API_BASE}/api/pride/${PRIDE_ID}/sponsors`,
  {
    organization: form.organization,
    contact_name: form.contact_name,
    email: form.email,
    phone: form.phone || null,
    tier: form.tier,
    wants_booth: form.wants_booth,
website: form.website
  ? `https://${form.website}`
  : null,
    social_links: socialLinksJoined || null,
    logo_url: form.logo_url || null,
    status: "pending",
    message: form.message || null,
  },
  { headers: { "Content-Type": "application/json" } }
);


      setSubmitted(true);
    } catch (err) {
      console.error("❌ Sponsor inquiry failed", err);
      setError(err.response?.data?.error || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  if (!submitted) return;

  const timer = setTimeout(() => {
    setSubmitted(false);

    // optional: reset form after thank-you disappears
    setForm({
      organization: "",
      contact_name: "",
      email: "",
      phone: "",
      tier: "",
      wants_booth: false,
      website: "",
      social_links: "",
      logo_url: "",
      message: "",
    });

    setSocialInputs({});
  }, 3000);

  return () => clearTimeout(timer);
}, [submitted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-400 to-slate-900 text-white">

      {/* Banner */}
      <section className="relative h-32 flex items-center justify-center border-b-4 border-yellow-400">
        <div className="absolute inset-0 bg-black/50" />
        <h1 className="relative text-4xl font-extrabold text-yellow-300">
          Become a Sponsor
        </h1>
      </section>

      {/* Form */}
      <section className="max-w-full mx-auto ">
        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 bg-black/60 p-10 border border-yellow-400"
          >
            {/* Core Fields */}
            {[
              { name: "organization", label: "Organization Name" },
              { name: "contact_name", label: "Contact Name" },
              { name: "email", label: "Email", type: "email" },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="block mb-1 font-bold text-yellow-300">
                  {label}
                </label>
                <input
                  type={type || "text"}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={["organization", "contact_name", "email"].includes(name)}
                  className="w-full p-4 bg-white border border-yellow-400 text-black"
                />
              </div>
            ))}
             <input
  type="text"
  name="phone"
  value={form.phone}
  onChange={handleChange}
  maxLength={14}
  placeholder="(123) 456-7890"
  inputMode="numeric"
  className="w-full p-4 bg-white border border-yellow-400 text-black"
/>
<div>
  <label className="block mb-1 font-bold text-yellow-300">
    Website (optional)
  </label>

  <div className="flex items-center">
    <span className="
      px-3 py-4
      bg-black/70 text-yellow-300
      border border-yellow-400 border-r-0
      rounded-l-md
      text-sm font-mono
    ">
      https://
    </span>

    <input
      type="text"
      name="website"
      value={form.website}
      onChange={handleChange}
      placeholder="example.com"
      className="
        w-full p-4
        bg-white text-black
        border border-yellow-400
        rounded-r-md
        focus:outline-none
      "
    />
  </div>
</div>

{/* ───────── Social Media ───────── */}
<div>
  <label className="block mb-2 font-bold text-yellow-300">
    Social Media (optional)
  </label>

  {/* Active social inputs */}
  <div className="space-y-3">
    {SOCIAL_OPTIONS.map(
      (opt) =>
        socialInputs.hasOwnProperty(opt.key) && (
          <div key={opt.key}>
            <label className="block text-sm text-yellow-200 mb-1">
              {opt.label}
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-black/60 px-2 py-1 rounded border border-yellow-400/40">
                {opt.prefix}
              </span>

              <input
                type="text"
                placeholder="username or page"
                value={socialInputs[opt.key]}
                onChange={(e) =>
                  handleSocialChange(opt.key, e.target.value)
                }
                className="flex-1 p-3 rounded-xl bg-purple-900/70 border border-yellow-400 text-white"
              />
            </div>
          </div>
        )
    )}
  </div>

  {/* Add buttons */}
  <div className="mt-3 flex gap-2">
    {SOCIAL_OPTIONS.map(
      (opt) =>
        !socialInputs.hasOwnProperty(opt.key) && (
          <button
            key={opt.key}
            type="button"
            onClick={() => handleAddSocial(opt.key)}
            className="
              px-3 py-1 rounded-lg text-sm font-bold
              bg-black/60 border border-yellow-400/40
              text-yellow-300 hover:bg-yellow-400 hover:text-black
              transition
            "
          >
            Add {opt.label}
          </button>
        )
    )}
  </div>
</div>

            {/* Logo Upload */}
        {/* Logo Upload / URL */}
<div>
  <label className="block mb-2 font-bold text-yellow-300">
    Sponsor Logo (optional)
  </label>

  {/* Upload */}
  <input
    type="file"
    accept="image/*"
    onChange={handleLogoUpload}
    className="block w-full text-yellow-200 mb-2"
  />

  {uploading && (
    <p className="text-sm text-yellow-300 mt-1">
      Uploading logo…
    </p>
  )}

  {/* OR paste URL */}
  <input
    type="text"
    placeholder="Or paste logo image URL"
    value={form.logo_url}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        logo_url: e.target.value,
      }))
    }
    className="
      w-full p-4 mt-3
      bg-white text-black
      border border-yellow-400
      rounded-md
      focus:outline-none
    "
  />

  {form.logo_url && (
    <img
      src={form.logo_url}
      alt="Sponsor Logo Preview"
      className="
        mt-4 w-32 h-32 object-contain
        rounded-xl border border-yellow-400
        bg-gradient-to-br from-slate-600 via-white/60 to-slate-600  p-2
      "
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  )}
</div>

            {/* Tier */}
            <div>
              <label className="block mb-1 font-bold text-yellow-300">
                Sponsorship Tier
              </label>
              <select
                name="tier"
                value={form.tier}
                onChange={handleChange}
                required
                className="w-full p-4 bg-purple-900/70 border border-yellow-400 text-white"
              >
                <option value="">Select a Tier</option>
                {SPONSOR_TIERS.map((t) => (
                  <option key={t} value={t} className="text-black">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Booth */}
            <label className="flex items-center gap-3 text-yellow-200 font-semibold">
              <input
                type="checkbox"
                name="wants_booth"
                checked={form.wants_booth}
                onChange={handleChange}
              />
              Request a booth at the event
            </label>

            {/* Message */}
            <div>
              <label className="block mb-1 font-bold text-yellow-300">
                Message (optional)
              </label>
              <textarea
                name="message"
                rows={4}
                maxLength={500}
                value={form.message}
                onChange={handleChange}
                className="w-full p-4 bg-purple-900/70 border border-yellow-400 text-white"
              />
            </div>

            {error && (
              <p className="text-red-300 text-center font-semibold">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold"
            >
              {loading ? "Submitting..." : "Submit Sponsorship Inquiry"}
            </button>
          </motion.form>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-3xl font-bold text-green-300 mb-2">
              ✅ Thank You!
            </h3>
            <p className="text-lg">
              Your sponsorship inquiry has been received.
              <br />
              We’ll be in touch soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
