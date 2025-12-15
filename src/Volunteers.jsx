// Volunteers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";
const CODEWORD = "HPC2025"; // 🔑 required by backend

export default function Volunteers() {
  const { token, prideId, isAdmin } = useAuth();

  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  // ───────────────────────────────
  // Fetch Volunteers
  // ───────────────────────────────
  const fetchVolunteers = async () => {
    if (!prideId) return;

    try {
      const res = await axios.get(
        `${API}/api/pride/${prideId}/volunteers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVolunteers(res.data || []);
    } catch {
      toast.error("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchVolunteers();
  }, [prideId, isAdmin]);

  // ───────────────────────────────
  // Open Edit
  // ───────────────────────────────
  const openEdit = (v) => {
    setEditingId(v.id);
    setEditForm({
      name: v.name,
      email: v.email,
      phone: v.phone || "",
      interest: v.interest,
      message: v.message || "",
    });
  };

  // ───────────────────────────────
  // Save Edit
  // ───────────────────────────────
  const saveEdit = async () => {
    try {
      const res = await axios.patch(
        `${API}/volunteers/${editingId}`,
        {
          ...editForm,
          codeword: CODEWORD,
        }
      );

      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === editingId ? res.data.volunteer : v
        )
      );

      toast.success("Volunteer updated");
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    }
  };


  // ───────────────────────────────
// Delete Volunteer
// ───────────────────────────────
const deleteVolunteer = async (vid) => {
  if (!window.confirm("Delete this volunteer submission?")) return;

  try {
    await axios.delete(
      `${API}/volunteers/${vid}`,
      {
        data: { codeword: CODEWORD }, // 🔑 backend requires this
      }
    );

    setVolunteers((prev) =>
      prev.filter((v) => v.id !== vid)
    );

    toast.success("Volunteer submission deleted");
  } catch (err) {
    toast.error(err.response?.data?.error || "Delete failed");
  }
};


  if (loading) {
    return (
      <div className="text-center text-yellow-300 py-10">
        Loading volunteer submissions…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-yellow-300">
        🤝 Volunteer Submissions
      </h2>

      {volunteers.length === 0 ? (
        <p className="text-yellow-200 italic">
          No volunteer submissions yet.
        </p>
      ) : (
        volunteers.map((v) => (
          <div
            key={v.id}
            className="bg-black/60 border border-yellow-500/30 rounded-2xl p-5 shadow-xl"
          >
            {editingId === v.id ? (
              <>
                {["name", "email", "phone", "interest"].map((field) => (
                  <input
                    key={field}
                    value={editForm[field]}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        [field]: e.target.value,
                      })
                    }
                    placeholder={field.toUpperCase()}
                    className="w-full mb-3 p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
                  />
                ))}

                <textarea
                  value={editForm.message}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      message: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Message"
                  className="w-full mb-3 p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
                />

                <div className="flex gap-3">
                  <button
                    onClick={saveEdit}
                    className="flex-1 py-2 rounded-xl bg-yellow-400 text-black font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-2 rounded-xl bg-gray-600 text-white font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-yellow-300">
                  {v.name}
                </p>
                <p className="text-sm text-yellow-200">{v.email}</p>
                {v.phone && (
                  <p className="text-sm text-yellow-400">{v.phone}</p>
                )}
                <p className="mt-2 text-yellow-200">
                  <strong>Interest:</strong> {v.interest}
                </p>
                {v.message && (
                  <p className="mt-2 text-sm italic text-yellow-300">
                    “{v.message}”
                  </p>
                )}
<div className="flex gap-3 mt-4">
  <button
    onClick={() => openEdit(v)}
    className="px-4 py-2 rounded-xl bg-blue-500 text-black font-bold hover:bg-blue-600"
  >
    Edit
  </button>

  <button
    onClick={() => deleteVolunteer(v.id)}
    className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700"
  >
    Delete
  </button>
</div>

              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
