import React, { useEffect, useState } from "react";
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

export default function ManageProspects({ onConvert }) {
  const token = localStorage.getItem("prideToken");
  const admin = JSON.parse(localStorage.getItem("prideUser") || "{}");

  const [prospects, setProspects] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchProspects = async () => {
    try {
      const res = await axios.get(
        `${API}/api/sponsor-prospects?pride_id=${admin.pride_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProspects(res.data || []);
    } catch {
      toast.error("Failed to load prospects");
    }
  };

  useEffect(() => {
    fetchProspects();
  }, []);

  const saveEdit = async () => {
    try {
      await axios.patch(
        `${API}/api/sponsor-prospects/${editing.id}`,
        editing,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Prospect updated");
      setEditing(null);
      fetchProspects();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteProspect = async (id) => {
    if (!window.confirm("Delete this prospect?")) return;
    try {
      await axios.delete(
        `${API}/api/sponsor-prospects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Prospect deleted");
      fetchProspects();
    } catch {
      toast.error("Delete failed");
    }
  };

  const convertToSponsor = (p) => {
    localStorage.setItem(
      "pendingSponsorProspect",
      JSON.stringify({
        organization: p.organization,
        contact_name: p.contact_name,
        email: p.contact_email,
        phone: p.contact_phone,
        message: p.notes,
      })
    );

    if (onConvert) onConvert();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-extrabold text-yellow-300">
        🌱 Sponsor Prospects
      </h3>

      {prospects.length === 0 ? (
        <p className="italic text-yellow-200">No prospects yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prospects.map((p) => (
            <div
              key={p.id}
              className="bg-black/60 border border-yellow-500/30 rounded-2xl p-5 shadow-xl"
            >
              <h4 className="text-lg font-bold text-yellow-300">
                {p.organization}
              </h4>

              <p className="text-sm text-yellow-200">
                {p.contact_name || "No contact name"}
              </p>

              {p.contact_email && (
                <p className="text-xs">📧 {p.contact_email}</p>
              )}
              {p.contact_phone && (
                <p className="text-xs">📞 {p.contact_phone}</p>
              )}

              {p.notes && (
                <p className="text-sm italic mt-2 max-h-20 overflow-y-auto">
                  “{p.notes}”
                </p>
              )}

              <p className="text-xs mt-2">
                Status: <span className="text-green-300">{p.status}</span>
              </p>

              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => setEditing({ ...p })}
                  className="px-3 py-1 bg-yellow-400 text-black rounded-lg font-bold"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProspect(p.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg font-bold"
                >
                  Delete
                </button>

                <button
                  onClick={() => convertToSponsor(p)}
                  className="px-3 py-1 bg-green-500 text-black rounded-lg font-bold"
                >
                  ➕ Add Sponsor
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✏️ Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black border border-yellow-500 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold text-yellow-300 mb-3">
              Edit Prospect
            </h3>

            {[
              "organization",
              "contact_name",
              "contact_email",
              "contact_phone",
              "notes",
            ].map((f) => (
              <input
                key={f}
                value={editing[f] || ""}
                onChange={(e) =>
                  setEditing({ ...editing, [f]: e.target.value })
                }
                placeholder={f.replace("_", " ")}
                className="w-full mb-3 p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
              />
            ))}

            <select
              value={editing.status}
              onChange={(e) =>
                setEditing({ ...editing, status: e.target.value })
              }
              className="w-full p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
