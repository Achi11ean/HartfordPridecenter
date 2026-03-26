import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";

// 🔐 Cloudinary
const CLOUD_NAME = "dincfzdau";
const UPLOAD_PRESET = "pridecenters";

const VENDOR_TYPES = [
  "Merchandise",
  "Arts and Crafts",
  "Wellness or Beauty",
  "Travel or Tourism Agency",
  "Food and Beverage",
  "Community Service or Nonprofit",
  "Political or Activism",
];
const STATUS_OPTIONS = [
  "pending",
  "approved",
  "confirmed",
  "declined",
  "cancelled",
];

export default function CreateVendor() {
  const { token, prideId } = useAuth();

const [form, setForm] = useState({
  company_name: "",
  vendor_type: "",
  contact_name: "",
  contact_email: "",
  websites: [""],   // 🔥 NEW
  socials: [""],    // 🔥 NEW
  image_url: "",
  start_time: "",
  end_time: "",
  status: "pending",
});

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ───────────────────────────── */
  /* 📤 Cloudinary Upload */
  /* ───────────────────────────── */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data
      );

      setForm((prev) => ({
        ...prev,
        image_url: res.data.secure_url,
      }));

      toast.success("📸 Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Image upload failed");
    }
  };
const updateListItem = (type, index, value) => {
  setForm((prev) => {
    const updated = [...prev[type]];
    updated[index] = value;
    return { ...prev, [type]: updated };
  });
};

const addListItem = (type) => {
  setForm((prev) => ({
    ...prev,
    [type]: [...prev[type], ""],
  }));
};

const removeListItem = (type, index) => {
  setForm((prev) => ({
    ...prev,
    [type]: prev[type].filter((_, i) => i !== index),
  }));
};
  /* ───────────────────────────── */
  /* 🚀 Submit */
  /* ───────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
     await axios.post(
  `${API}/api/pride/${prideId}/vendors`,
  {
    ...form,

    website_url: form.websites
      .filter((w) => w && w.trim())
      .join(","),

    social_links: form.socials
      .filter((s) => s && s.trim())
      .join(","),

    start_time: form.start_time || null,
    end_time: form.end_time || null,
  },
  { headers: { Authorization: `Bearer ${token}` } }
);

      toast.success("🏳️‍🌈 Vendor added successfully!");

    setForm({
  company_name: "",
  vendor_type: "",
  contact_name: "",
  contact_email: "",
  websites: [""],
  socials: [""],
  image_url: "",
  start_time: "",
  end_time: "",
  status: "pending",
});
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add vendor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-full mx-auto">
      <h2 className="text-2xl font-extrabold text-yellow-300 mb-4 border-b border-yellow-400">
        ➕ Add Pride Vendor
      </h2>

    <form
  onSubmit={handleSubmit}
  className="
    space-y-6
    bg-gradient-to-br from-black/80 via-slate-900/90 to-black/80
    border border-yellow-400/20
    rounded-2xl p-5 sm:p-6
    shadow-[0_10px_40px_rgba(0,0,0,0.6)]
    backdrop-blur-xl
  "
>

  {/* HEADER */}
  <div className="text-center">
    <h2 className="text-2xl font-extrabold text-yellow-300">
      🏪 Vendor Setup
    </h2>
    <p className="text-xs text-yellow-100/60">
      Create or update vendor information
    </p>
  </div>

  {/* BASIC INFO */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    <div className="form-group sm:col-span-2">
      <label>Company / Organization</label>
      <input
        name="company_name"
        value={form.company_name}
        onChange={handleChange}
        required
        className="input-pro"
      />
    </div>

    <div className="form-group">
      <label>Vendor Type</label>
      <select
        name="vendor_type"
        value={form.vendor_type}
        onChange={handleChange}
        required
        className="input-pro"
      >
        <option value="">Select type</option>
        {VENDOR_TYPES.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Status</label>
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="input-pro"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>

  </div>

  {/* CONTACT */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="form-group">
      <label>Contact Name</label>
      <input
        name="contact_name"
        value={form.contact_name}
        onChange={handleChange}
        required
        className="input-pro"
      />
    </div>

    <div className="form-group">
      <label>Contact Email</label>
      <input
        type="email"
        name="contact_email"
        value={form.contact_email}
        onChange={handleChange}
        required
        className="input-pro"
      />
    </div>
  </div>

  {/* LINKS */}
  <div className="grid sm:grid-cols-2 gap-4">

    {/* Websites */}
    <div className="space-y-2">
      <label className="label">🌐 Websites</label>

      {(form.websites || []).map((site, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={site}
            onChange={(e) =>
              updateListItem("websites", i, e.target.value)
            }
            className="input-pro"
            placeholder="https://..."
          />

          {form.websites.length > 1 && (
            <button
              type="button"
              onClick={() => removeListItem("websites", i)}
              className="btn-danger-sm"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => addListItem("websites")}
        className="text-xs text-yellow-300 hover:underline"
      >
        ➕ Add
      </button>
    </div>

    {/* Socials */}
    <div className="space-y-2">
      <label className="label">📱 Social Links</label>

      {(form.socials || []).map((social, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={social}
            onChange={(e) =>
              updateListItem("socials", i, e.target.value)
            }
            className="input-pro"
            placeholder="https://..."
          />

          {form.socials.length > 1 && (
            <button
              type="button"
              onClick={() => removeListItem("socials", i)}
              className="btn-danger-sm"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => addListItem("socials")}
        className="text-xs text-yellow-300 hover:underline"
      >
        ➕ Add
      </button>
    </div>

  </div>

  {/* IMAGE */}
  <div className="space-y-3">
    <label className="label">🖼 Vendor Image</label>

    <div className="grid sm:grid-cols-2 gap-4">

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="input-pro"
      />

      <input
        name="image_url"
        value={form.image_url}
        onChange={handleChange}
        placeholder="Paste image URL"
        className="input-pro"
      />

    </div>

    {form.image_url && (
      <div className="flex justify-center">
        <img
          src={form.image_url}
          alt="Preview"
          className="
            max-h-40
            object-contain
            rounded-xl
            border border-yellow-400/30
            bg-black/40 p-2
          "
        />
      </div>
    )}
  </div>

  {/* TIMES */}
  <div className="grid sm:grid-cols-2 gap-4">
    <div className="form-group">
      <label>Start Time</label>
      <input
        type="datetime-local"
        name="start_time"
        value={form.start_time}
        onChange={handleChange}
        className="input-pro"
      />
    </div>

    <div className="form-group">
      <label>End Time</label>
      <input
        type="datetime-local"
        name="end_time"
        value={form.end_time}
        onChange={handleChange}
        className="input-pro"
      />
    </div>
  </div>

  {/* SUBMIT */}
  <button
    type="submit"
    disabled={submitting}
    className="
      w-full py-4 rounded-xl font-extrabold text-lg
      bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600
      text-black
      shadow-lg
      hover:scale-105 hover:shadow-yellow-400/40
      transition-all duration-300
    "
  >
    {submitting ? "Saving…" : "💾 Save Vendor"}
  </button>

</form>
    </div>
  );
}
