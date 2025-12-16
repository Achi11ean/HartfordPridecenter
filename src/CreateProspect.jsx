import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = "https://singspacebackend.onrender.com";

const STATUS_OPTIONS = [
  "new",
  "contacted",
  "interested",
  "follow_up",
  "converted",
  "not_interested",
  "closed",
];

export default function CreateProspect() {
  const token = localStorage.getItem("prideToken");
  const admin = JSON.parse(localStorage.getItem("prideUser") || "{}");

  const [loading, setLoading] = useState(false);
const formatPhoneNumber = (value) => {
  if (!value) return "";

  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length < 4) return digits;
  if (digits.length < 7)
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

  const [form, setForm] = useState({
    organization: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    notes: "",
    status: "new",
  });
const handlePhoneChange = (e) => {
  const formatted = formatPhoneNumber(e.target.value);
  setForm((prev) => ({ ...prev, contact_phone: formatted }));
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API}/api/sponsor-prospects`,
        {
          pride_id: admin.pride_id,
          organization: form.organization,
          contact_name: form.contact_name || null,
          contact_email: form.contact_email || null,
          contact_phone: form.contact_phone || null,
          notes: form.notes || null,
          status: form.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Sponsor prospect created 🌱");

      setForm({
        organization: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        notes: "",
        status: "new",
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create prospect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h3 className="text-2xl border-b font-extrabold text-yellow-300 mb-4">
        Sponsor Prospect
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="organization"
          placeholder="Organization Name *"
          value={form.organization}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl capitalize text-center bg-black/40 border border-yellow-500/40 text-yellow-100"
        />

        <input
          name="contact_name"
          placeholder="Contact Name"
          value={form.contact_name}
          onChange={handleChange}
          className="w-full p-3 rounded-xl capitalize text-center bg-black/40 border border-yellow-500/40 text-yellow-100"
        />

        <input
          type="email"
          name="contact_email"
          placeholder="Contact Email (optional)"
          value={form.contact_email}
          onChange={handleChange}
          className="w-full p-3 rounded-xl text-center bg-black/40 border border-yellow-500/40 text-yellow-100"
        />

<input
  type="tel"
  name="contact_phone"
  placeholder="Contact Phone (optional)"
  value={form.contact_phone}
  onChange={handlePhoneChange}
  className="w-full p-3 rounded-xl text-center bg-black/40 border border-yellow-500/40 text-yellow-100"
  inputMode="numeric"
/>


        <textarea
          name="notes"
          placeholder="Notes / Follow-up details"
          value={form.notes}
          onChange={handleChange}
          className="w-full h-28 p-3 rounded-xl text-center bg-black/40 border border-yellow-500/40 text-yellow-100"
        />



        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3 rounded-xl font-extrabold
            bg-gradient-to-r from-yellow-400 to-yellow-600
            text-black shadow-lg
            hover:scale-105 transition
            disabled:opacity-50
          "
        >
          {loading ? "Saving..." : "Add Prospect"}
        </button>
      </form>
    </div>
  );
}
