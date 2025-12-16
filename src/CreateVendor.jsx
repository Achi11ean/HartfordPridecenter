import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";

// 🔐 Cloudinary
const CLOUD_NAME = "dcw0wqlse";
const UPLOAD_PRESET = "karaoke";

const VENDOR_TYPES = [
  "Food",
  "Retail",
  "Non-Profit",
  "Sponsor",
  "Performer",
  "Info Booth",
  "Other",
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
    website_url: "",
    image_url: "", // 🖼 NEW
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
        website_url: "",
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
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-extrabold text-yellow-300 mb-4 border-b border-yellow-400">
        ➕ Add Pride Vendor
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-black/60 border border-yellow-500/30 rounded-xl p-6 shadow-lg"
      >
        {/* Company Name */}
        <input
          name="company_name"
          value={form.company_name}
          onChange={handleChange}
          placeholder="Company / Organization Name"
          required
          className="w-full px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
        />

        {/* Vendor Type */}
        <select
          name="vendor_type"
          value={form.vendor_type}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
        >
          <option value="">Select vendor type</option>
          {VENDOR_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Contact Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            name="contact_name"
            value={form.contact_name}
            onChange={handleChange}
            placeholder="Contact Name"
            required
            className="px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
          />

          <input
            type="email"
            name="contact_email"
            value={form.contact_email}
            onChange={handleChange}
            placeholder="Contact Email"
            required
            className="px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
          />
        </div>

        {/* Website */}
        <input
          name="website_url"
          value={form.website_url}
          onChange={handleChange}
          placeholder="Website URL (optional)"
          className="w-full px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
        />

        {/* 🖼 Vendor Image */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-yellow-200">
            Vendor Image (optional)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-yellow-100"
          />

          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="Or paste image URL"
            className="w-full px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
          />

          {form.image_url && (
            <img
              src={form.image_url}
              alt="Preview"
              className="mt-2 h-32 rounded shadow object-cover"
            />
          )}
        </div>

        {/* Event Times */}
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="datetime-local"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
          />

          <input
            type="datetime-local"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
          />
        </div>

        {/* Status */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 font-bold rounded
            bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600
            text-black hover:brightness-110 transition"
        >
          {submitting ? "Saving…" : "Save Vendor"}
        </button>
      </form>
    </div>
  );
}
