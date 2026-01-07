// Volunteers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";

export default function Volunteers() {
const { prideId, role, isAdmin, isStaff } = useAuth();

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

  // ─────────────────────────────────────────────
  // Fetch Volunteers
  // ─────────────────────────────────────────────
  const fetchVolunteers = async () => {
    if (!prideId) {
      console.warn("[Volunteers] No prideId, abort fetch");
      return;
    }

    console.log("[Volunteers] Fetching for prideId:", prideId);

    try {
      const res = await axios.get(
        `${API}/api/pride/${prideId}/volunteers`
      );

      console.log("[Volunteers] Fetch response:", res.data);
      setVolunteers(res.data || []);
    } catch (err) {
      console.error("[Volunteers] Fetch error:", err);
      toast.error("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  console.log("🔥 Volunteers mounted", {
    prideId,
    role,
  });

  if (prideId) fetchVolunteers();
}, [prideId]);


  // ─────────────────────────────────────────────
  // Open Edit
  // ─────────────────────────────────────────────
  const openEdit = (v) => {
    console.log("[Volunteers] Open edit:", v);

    setEditingId(v.id);
    setEditForm({
      name: v.name,
      email: v.email,
      phone: v.phone || "",
      interest: v.interest,
      message: v.message || "",
    });
  };

  // ─────────────────────────────────────────────
  // Save Edit (PATCH)
  // ─────────────────────────────────────────────
  const saveEdit = async () => {
    console.log("[Volunteers] Saving edit:", {
      id: editingId,
      payload: editForm,
    });

    try {
      const res = await axios.patch(
        `${API}/volunteers/${editingId}`,
        {
          ...editForm,
        }
      );

      console.log("[Volunteers] PATCH response:", res.data);

      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === editingId ? res.data.volunteer : v
        )
      );

      toast.success("Volunteer updated");
      setEditingId(null);
    } catch (err) {
      console.error("[Volunteers] PATCH error:", err);
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  // ─────────────────────────────────────────────
  // Delete Volunteer (DELETE)
  // ─────────────────────────────────────────────
  const deleteVolunteer = async (vid) => {
    if (!window.confirm("Delete this volunteer submission?")) return;

    console.log("[Volunteers] Deleting volunteer:", vid);

    try {
      await axios.delete(
        `${API}/volunteers/${vid}`,
  
      );

      console.log("[Volunteers] Delete success:", vid);

      setVolunteers((prev) =>
        prev.filter((v) => v.id !== vid)
      );

      toast.success("Volunteer submission deleted");
    } catch (err) {
      console.error("[Volunteers] DELETE error:", err);
      toast.error(err.response?.data?.error || "Delete failed");
    }
  };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
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
                      setEditForm((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    placeholder={field.toUpperCase()}
                    className="w-full mb-3 p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
                  />
                ))}

                <textarea
                  value={editForm.message}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
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
