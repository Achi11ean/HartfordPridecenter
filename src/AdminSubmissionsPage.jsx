// AdminSubmissionsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AdminSubmissionsPage() {
  const API_BASE = "https://singspacebackend.onrender.com";

  const [pin, setPin] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const [volunteers, setVolunteers] = useState([]);
  const [sponsors, setSponsors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data AFTER PIN is validated
  const fetchAll = async () => {
    if (!pin) return;
    setLoading(true);
    setError("");

    try {
      const volRes = await axios.get(`${API_BASE}/volunteers`, {
        params: { codeword: pin },
      });

      const sponRes = await axios.get(`${API_BASE}/sponsors`, {
        params: { codeword: pin },
      });

      setVolunteers(volRes.data.volunteers || []);
      setSponsors(sponRes.data.sponsors || []);
      setAuthorized(true);
    } catch (err) {
      console.error(err);
      setError("Invalid PIN — access denied.");
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  // Delete entry (Volunteer or Sponsor)
  const deleteEntry = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await axios.delete(`${API_BASE}/${type}/${id}`, {
        data: { codeword: pin },
      });

      if (type === "volunteers") {
        setVolunteers((prev) => prev.filter((v) => v.id !== id));
      } else {
        setSponsors((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed — wrong PIN or server error.");
    }
  };

  // PATCH update entry
  const updateEntry = async (type, id, field, value) => {
    try {
      await axios.patch(`${API_BASE}/${type}/${id}`, {
        codeword: pin,
        [field]: value,
      });

      // Update UI
      if (type === "volunteers") {
        setVolunteers((prev) =>
          prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
        );
      } else {
        setSponsors((prev) =>
          prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
        );
      }
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  // LOGIN SCREEN
  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-950 text-yellow-200 p-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/40 p-8 rounded-xl border border-yellow-300 shadow-2xl max-w-sm w-full"
        >
          <h1 className="text-3xl font-bold text-center mb-6">Admin Access</h1>

          <label className="block mb-2 font-semibold">Admin PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-3 text-center bg-blue-950/50 text-yellow-200 border border-yellow-300 rounded-lg"
            placeholder="Enter PIN to continue"
          />

          <button
            onClick={fetchAll}
            className="w-full mt-4 py-3 bg-gradient-to-r from-yellow-300 to-yellow-500 text-blue-900 font-bold rounded-lg shadow-lg hover:scale-[1.03] transition"
          >
            Unlock Admin Page
          </button>

          {error && <p className="text-red-400 text-center mt-3">{error}</p>}
        </motion.div>
      </div>
    );
  }

  // MAIN ADMIN PAGE
  return (
    <div className="min-h-screen bg-blue-950 text-yellow-100 p-6 space-y-10">
      <h1 className="text-4xl font-extrabold text-center mb-4">
        Admin Panel — Volunteer & Sponsor Submissions
      </h1>

      {/* VOLUNTEERS */}
      <section className="bg-blue-900/40 p-6 rounded-xl border border-yellow-300 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-yellow-300">Volunteer Submissions</h2>

        {volunteers.length === 0 && (
          <p className="opacity-70">No volunteer submissions yet.</p>
        )}

        {volunteers.map((v) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-950/50 p-4 mb-4 rounded-lg border border-blue-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {["name", "email", "phone", "interest", "message"].map((field) => (
                <div key={field}>
                  <label className="text-sm opacity-70">{field.toUpperCase()}</label>
                  <input
                    className="w-full p-2 rounded bg-blue-900 text-yellow-100 border border-blue-700"
                    value={v[field] || ""}
                    onChange={(e) =>
                      updateEntry("volunteers", v.id, field, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => deleteEntry("volunteers", v.id)}
              className="mt-4 w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded shadow-lg"
            >
              Delete
            </button>
          </motion.div>
        ))}
      </section>

      {/* SPONSORS */}
      <section className="bg-blue-900/40 p-6 rounded-xl border border-yellow-300 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-yellow-300">Sponsor Inquiries</h2>

        {sponsors.length === 0 && <p className="opacity-70">No sponsor entries yet.</p>}

        {sponsors.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-950/50 p-4 mb-4 rounded-lg border border-blue-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "organization",
                "contact_name",
                "email",
                "phone",
                "tier",
                "message",
              ].map((field) => (
                <div key={field}>
                  <label className="text-sm opacity-70">{field.toUpperCase()}</label>
                  <input
                    className="w-full p-2 rounded bg-blue-900 text-yellow-100 border border-blue-700"
                    value={s[field] || ""}
                    onChange={(e) =>
                      updateEntry("sponsors", s.id, field, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => deleteEntry("sponsors", s.id)}
              className="mt-4 w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded shadow-lg"
            >
              Delete
            </button>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
