import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";

// 🔐 Cloudinary config
const CLOUD_NAME = "dcw0wqlse";
const UPLOAD_PRESET = "karaoke";

export default function CreateServices() {
  const { token, prideId } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    contact_name: "",
    contact_email: "",
    url: "",
    image_url: "",
    service_url: "",
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🖼 Cloudinary Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const json = await res.json();
      setForm((prev) => ({ ...prev, image_url: json.secure_url }));
      toast.success("🖼 Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        `${API}/api/pride/${prideId}/services`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("🏳️‍🌈 Service added successfully!");

      setForm({
        title: "",
        description: "",
        contact_name: "",
        contact_email: "",
        url: "",
        image_url: "",
        service_url: "",

      });
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-extrabold text-yellow-300 mb-4 border-b border-yellow-400">
        ➕ Add Pride Service
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-black/60 border border-yellow-500/30 rounded-xl p-6 shadow-lg"
      >
        {/* Title */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Service Title"
          required
          className="w-full px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Service description"
          rows={4}
          required
          className="w-full px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
        />

        {/* Contact Name */}
        <input
          name="contact_name"
          value={form.contact_name}
          onChange={handleChange}
          placeholder="Point of Contact Name"
          required
          className="w-full px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
        />

        {/* Contact Email */}
        <input
          type="email"
          name="contact_email"
          value={form.contact_email}
          onChange={handleChange}
          placeholder="Contact Email"
          required
          className="w-full px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
        />
<input
  name="service_url"
  value={form.service_url}
  onChange={handleChange}
  placeholder="Resource URL "
  className="w-full px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
/>

        {/* Optional URL */}
        <input
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="Optional URL (website, intake form, etc.)"
          className="w-full px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
        />

        {/* 🖼 Image URL */}
        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="Optional Image URL (or upload below)"
          className="w-full px-4 py-2 rounded bg-black text-yellow-100 border border-yellow-400/40"
        />

        {/* Cloudinary Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-yellow-200 font-semibold">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-yellow-100"
          />
        </div>

        {/* 🖼 Preview */}
        {form.image_url && (
          <div className="mt-3">
            <p className="text-xs text-yellow-300 mb-1">Image Preview</p>
            <img
              src={form.image_url}
              alt="Service preview"
              className="max-h-48 rounded border border-yellow-400 shadow"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full py-3 font-bold rounded 
                     bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 
                     text-black hover:brightness-110 transition"
        >
          {submitting
            ? "Saving..."
            : uploading
            ? "Uploading Image..."
            : "Save Service"}
        </button>
      </form>
    </div>
  );
}
