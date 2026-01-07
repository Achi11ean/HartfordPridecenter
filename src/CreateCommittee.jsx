import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_BASE = "https://singspacebackend.onrender.com"; // adjust if needed

export default function CreateCommittee({ onCreated }) {
  const { prideId, token, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    mission_statement: "",
    details: "",
    contact_email: "",
    contact_phone: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!isAdmin) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
        Only Pride admins can create committees.
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!prideId) {
      setError("Missing pride ID. Please re-login.");
      return;
    }

    if (!formData.name || !formData.mission_statement) {
      setError("Name and mission statement are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/pride-committees`,
        {
          pride_id: prideId,
          name: formData.name,
          mission_statement: formData.mission_statement,
          details: formData.details || null,
          contact_email: formData.contact_email || null,
          contact_phone: formData.contact_phone || null,
          is_active: formData.is_active,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Committee created successfully!");
      setFormData({
        name: "",
        mission_statement: "",
        details: "",
        contact_email: "",
        contact_phone: "",
        is_active: true,
      });

      if (onCreated) {
        onCreated(res.data.committee);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Failed to create committee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl bg-black border rounded-lg shadow p-6 space-y-5"
    >
      <h2 className="text-2xl font-bold text-white">
        Create New Committee
      </h2>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1">Committee Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g. Health & Wellness Committee"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">
          Mission Statement *
        </label>
        <textarea
          name="mission_statement"
          value={formData.mission_statement}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 min-h-[100px]"
          placeholder="What is this committee responsible for?"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Details</label>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 min-h-[80px]"
          placeholder="Optional additional context"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Contact Email</label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="committee@pride.org"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Contact Phone</label>
          <input
            type="text"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
        />
        <span className="text-sm">Committee is active</span>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Committee"}
        </button>
      </div>
    </form>
  );
}