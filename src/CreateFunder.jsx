import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "./AuthContext"; // 👈 adjust path if needed

const API = "https://singspacebackend.onrender.com";
const CLOUD_NAME = "dcw0wqlse";
const UPLOAD_PRESET = "karaoke";

export default function CreateFunder({ onCreated }) {
  const { prideId, isAuthenticated, isAdmin, isStaff } = useAuth();

  const [form, setForm] = useState({
    organization_name: "",
    contact_name: "",
    contact_email: "",
    details: "",
    logo_url: "",
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- GUARDS ---------------- */

  if (!isAuthenticated || !prideId) {
    return (
      <div className="text-center text-red-600 font-bold p-6">
        Authentication required to create funders.
      </div>
    );
  }

  if (!isAdmin && !isStaff) {
    return (
      <div className="text-center text-red-600 font-bold p-6">
        You do not have permission to add funders.
      </div>
    );
  }

  /* ---------------- CLOUDINARY UPLOAD ---------------- */

  const handleUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setError(null);

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
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await axios.post(
        `${API}/api/pride/${prideId}/funders`,
        form
      );

      setForm({
        organization_name: "",
        contact_name: "",
        contact_email: "",
        details: "",
        logo_url: "",
      });

      onCreated?.(res.data.funder);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to create funder"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        max-w-3xl mx-auto p-8
        bg-gradient-to-br from-white to-yellow-50
        border-4 border-yellow-400 rounded-3xl
        shadow-2xl space-y-6
      "
    >
      <h2 className="text-3xl font-black text-yellow-700 text-center">
        🏛️ Add a Pride Funder
      </h2>

      {/* ORG NAME */}
      <input
        required
        placeholder="Organization Name *"
        value={form.organization_name}
        onChange={(e) =>
          setForm({ ...form, organization_name: e.target.value })
        }
        className="w-full p-3 rounded-xl border-2 border-yellow-300"
      />

      {/* CONTACT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Contact Name (optional)"
          value={form.contact_name}
          onChange={(e) =>
            setForm({ ...form, contact_name: e.target.value })
          }
          className="p-3 rounded-xl border"
        />

        <input
          placeholder="Contact Email (optional)"
          value={form.contact_email}
          onChange={(e) =>
            setForm({ ...form, contact_email: e.target.value })
          }
          className="p-3 rounded-xl border"
        />
      </div>
<input
  placeholder="Website URL (optional)"
  value={form.website_url || ""}
  onChange={(e) =>
    setForm({ ...form, website_url: e.target.value })
  }
  className="w-full p-3 rounded-xl border"
/>

      {/* DETAILS */}
      <textarea
        rows={4}
        placeholder="Message or description from the organization"
        value={form.details}
        onChange={(e) =>
          setForm({ ...form, details: e.target.value })
        }
        className="w-full p-3 rounded-xl border"
      />

      {/* LOGO */}
      <div className="space-y-3">
        <label className="font-bold text-sm">
          Logo (upload or paste URL)
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files[0])}
          className="w-full"
        />

        <input
          placeholder="Or paste logo URL"
          value={form.logo_url}
          onChange={(e) =>
            setForm({ ...form, logo_url: e.target.value })
          }
          className="w-full p-3 rounded-xl border"
        />

        {uploading && (
          <p className="text-sm text-yellow-600 animate-pulse">
            Uploading image…
          </p>
        )}

        {form.logo_url && (
          <img
            src={form.logo_url}
            alt="Logo preview"
            className="h-28 mx-auto object-contain rounded-lg shadow"
          />
        )}
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-600 font-semibold text-center">
          {error}
        </p>
      )}

      {/* SUBMIT */}
      <button
        disabled={submitting}
        className="
          w-full py-4 rounded-xl font-black text-lg
          bg-yellow-400 hover:bg-yellow-300
          transition disabled:opacity-50
        "
      >
        {submitting ? "Creating…" : "Create Funder"}
      </button>
    </motion.form>
  );
}
