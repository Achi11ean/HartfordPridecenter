import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const API = "https://singspacebackend.onrender.com";

/* 🌤 Cloudinary */
const CLOUD_NAME = "dcw0wqlse";
const UPLOAD_PRESET = "karaoke";

export default function ManageSpotlights() {
  const { prideId, token, isAdmin, isStaff } = useAuth();

  const [spotlights, setSpotlights] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  /* ---------------- LOAD SPOTLIGHTS ---------------- */
  const loadSpotlights = () => {
    if (!prideId) return;

    setLoading(true);
    axios
      .get(`${API}/api/pride/${prideId}/volunteer-spotlights`, authHeaders)
      .then((res) => setSpotlights(res.data || []))
      .catch(() => setSpotlights([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSpotlights();
  }, [prideId]);

  /* ---------------- CLOUDINARY ---------------- */
  const openUploadWidget = (spotlightId) => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        sources: ["local", "url", "camera"],
        multiple: false,
        cropping: true,
        folder: "volunteer_spotlights",
      },
      (error, result) => {
        if (!error && result?.event === "success") {
          setEditForm((prev) => ({
            ...prev,
            image_url: result.info.secure_url,
          }));
          toast.success("📸 Image uploaded!");
        }
      }
    );
  };

  /* ---------------- ACTIONS ---------------- */
  const startEdit = (s) => {
    setEditingId(s.id);
    setEditForm({ ...s });
  };

  const saveEdit = async (id) => {
    try {
      await axios.patch(
        `${API}/api/volunteer-spotlights/${id}`,
        editForm,
        authHeaders
      );
      toast.success("✨ Spotlight updated");
      setEditingId(null);
      loadSpotlights();
    } catch {
      toast.error("Failed to update spotlight");
    }
  };

  const toggleActive = async (s) => {
    try {
      await axios.patch(
        `${API}/api/volunteer-spotlights/${s.id}`,
        { is_active: !s.is_active },
        authHeaders
      );
      loadSpotlights();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const deleteSpotlight = async (id) => {
    if (!window.confirm("Delete this spotlight permanently?")) return;

    try {
      await axios.delete(
        `${API}/api/volunteer-spotlights/${id}`,
        authHeaders
      );
      toast.success("🗑 Spotlight deleted");
      loadSpotlights();
    } catch {
      toast.error("Failed to delete spotlight");
    }
  };

  if (!isAdmin && !isStaff) return null;

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <div className="py-20 text-center text-white animate-pulse">
        Loading volunteer spotlights…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h2 className="text-4xl font-black text-emerald-300">
        🌟 Manage Volunteer Spotlights
      </h2>

      {spotlights.map((s) => (
        <motion.div
          key={s.id}
          layout
          className="
            bg-black/60 border border-white/20 rounded-3xl
            shadow-xl p-6 space-y-4
          "
        >
          {/* HEADER */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {s.image_url && (
              <img
                src={s.image_url}
                alt={s.name}
                className="h-24 w-24 object-cover rounded-xl border border-white/30"
              />
            )}

            <div className="flex-1">
              <h3 className="text-2xl font-black">{s.name}</h3>
              {s.role && (
                <p className="text-sm text-white/70">{s.role}</p>
              )}
              {!s.is_active && (
                <span className="text-sm text-red-400 font-bold">
                  INACTIVE
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => startEdit(s)}
                className="px-4 py-2 bg-yellow-300 text-black font-bold rounded"
              >
                Edit
              </button>

              <button
                onClick={() => toggleActive(s)}
                className="px-4 py-2 bg-indigo-300 text-black font-bold rounded"
              >
                {s.is_active ? "Deactivate" : "Activate"}
              </button>

              <button
                onClick={() => deleteSpotlight(s.id)}
                className="px-4 py-2 bg-red-500 text-white font-bold rounded"
              >
                Delete
              </button>
            </div>
          </div>

          {/* READ VIEW */}
          {editingId !== s.id && s.bio && (
            <div className="bg-black/50 border border-white/10 rounded-xl p-4">
              <p className="whitespace-pre-line text-white/90">
                {s.bio}
              </p>
            </div>
          )}

          {/* EDIT FORM */}
          <AnimatePresence>
            {editingId === s.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <input
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="input"
                  placeholder="Name"
                />

                <input
                  value={editForm.role || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="input"
                  placeholder="Role"
                />

                <input
                  type="number"
                  value={editForm.years_of_service || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      years_of_service: e.target.value,
                    })
                  }
                  className="input"
                  placeholder="Years of Service"
                />

                {/* IMAGE */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => openUploadWidget(s.id)}
                    className="px-4 py-2 bg-emerald-400 text-black font-bold rounded"
                  >
                    Upload Image
                  </button>

                  <input
                    value={editForm.image_url || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        image_url: e.target.value,
                      })
                    }
                    className="input flex-1"
                    placeholder="Or paste image URL"
                  />
                </div>

                {editForm.image_url && (
                  <img
                    src={editForm.image_url}
                    alt="Preview"
                    className="h-32 rounded-xl border border-white/20"
                  />
                )}

                <textarea
                  rows={4}
                  value={editForm.bio || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  className="w-full p-4 rounded-xl bg-black/60 border border-white/20"
                  placeholder="Volunteer bio"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => saveEdit(s.id)}
                    className="px-6 py-2 bg-green-500 text-white font-bold rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-6 py-2 bg-gray-300 font-bold rounded"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
