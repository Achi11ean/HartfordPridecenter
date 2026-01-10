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

const inlineInput =
  "w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 transition";

const inlineTextarea =
  "w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 transition resize-none";



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
  <div className="space-y-12">
    {/* SECTION HEADER */}
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-emerald-400/20 flex items-center justify-center text-emerald-300 text-2xl">
        🌟
      </div>
      <div>
        <h2 className="text-4xl font-black text-emerald-300 tracking-tight">
          Manage Volunteer Spotlights
        </h2>
        <p className="text-white/60 text-sm">
          Highlight, edit, and celebrate your amazing volunteers
        </p>
      </div>
    </div>

    {/* SPOTLIGHT CARDS */}
    {spotlights.map((s) => (
      <motion.div
        key={s.id}
        layout
        whileHover={{ scale: 1.01 }}
        className="
          relative overflow-hidden
          bg-gradient-to-br from-black/70 via-black/60 to-black/80
          border border-white/15 rounded-3xl
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          p-6 space-y-6
        "
      >
        {/* STATUS GLOW */}
        {s.is_active && (
          <div className="absolute inset-0 rounded-3xl ring-1 ring-emerald-400/20 pointer-events-none" />
        )}

        {/* HEADER */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {s.image_url ? (
            <img
              src={s.image_url}
              alt={s.name}
              className="
                h-28 w-28 object-cover rounded-2xl
                border border-white/30 shadow-lg
              "
            />
          ) : (
            <div className="h-28 w-28 rounded-2xl bg-emerald-400/20 flex items-center justify-center text-3xl">
              🌱
            </div>
          )}

          <div className="flex-1 space-y-1">
            <h3 className="text-2xl font-black tracking-tight">
              {s.name}
            </h3>

            {s.role && (
              <p className="text-sm text-white/70">
                {s.role}
              </p>
            )}

            <div className="flex gap-2 pt-1">
              {s.is_active ? (
                <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold">
                  ACTIVE
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
                  INACTIVE
                </span>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => startEdit(s)}
              className="px-4 py-2 rounded-xl bg-yellow-300 text-black font-bold hover:scale-105 transition"
            >
              ✏️ Edit
            </button>

            <button
              onClick={() => toggleActive(s)}
              className="px-4 py-2 rounded-xl bg-indigo-300 text-black font-bold hover:scale-105 transition"
            >
              {s.is_active ? "Deactivate" : "Activate"}
            </button>

            <button
              onClick={() => deleteSpotlight(s.id)}
              className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold hover:scale-105 transition"
            >
              🗑 Delete
            </button>
          </div>
        </div>

        {/* READ VIEW */}
   {/* READ MODE — BIO */}
{editingId !== s.id && s.bio && (
  <div className="relative bg-gradient-to-br from-black/60 to-black/40 border border-white/10 rounded-3xl p-6">
    <div className="absolute top-3 right-4 text-xs text-white/30 tracking-wide">
      Volunteer Bio
    </div>
    <p className="whitespace-pre-line text-white/90 leading-relaxed text-sm md:text-base">
      {s.bio}
    </p>
  </div>
)}

{/* EDIT MODE */}
<AnimatePresence>
  {editingId === s.id && (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="
        bg-black/60 border border-white/15
        rounded-3xl p-6 space-y-6
      "
    >
      {/* FIELDS */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Name */}
        <div className="relative">
          <input
            value={editForm.name || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, name: e.target.value })
            }
            placeholder=" "
            className="
              peer w-full bg-transparent text-white
              border-b border-white/20
              focus:border-emerald-400 outline-none
              pt-5 pb-1 transition
            "
          />
          <label className="absolute left-0 top-1 text-xs text-white/50 peer-focus:text-emerald-300">
            Name
          </label>
        </div>

        {/* Role */}
        <div className="relative">
          <input
            value={editForm.role || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, role: e.target.value })
            }
            placeholder=" "
            className="
              peer w-full bg-transparent text-white
              border-b border-white/20
              focus:border-emerald-400 outline-none
              pt-5 pb-1 transition
            "
          />
          <label className="absolute left-0 top-1 text-xs text-white/50 peer-focus:text-emerald-300">
            Role
          </label>
        </div>

        {/* Years */}
        <div className="relative md:col-span-2 max-w-xs">
          <input
            type="number"
            value={editForm.years_of_service || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                years_of_service: e.target.value,
              })
            }
            placeholder=" "
            className="
              peer w-full bg-transparent text-white
              border-b border-white/20
              focus:border-emerald-400 outline-none
              pt-5 pb-1 transition
            "
          />
          <label className="absolute left-0 top-1 text-xs text-white/50 peer-focus:text-emerald-300">
            Years of Service
          </label>
        </div>
      </div>

      {/* IMAGE ROW */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => openUploadWidget(s.id)}
          className="
            px-5 py-2 rounded-xl bg-emerald-400/90
            text-black font-bold
            hover:bg-emerald-400 hover:scale-[1.03]
            transition
          "
        >
          📸 Upload Photo
        </button>

        <input
          value={editForm.image_url || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, image_url: e.target.value })
          }
          placeholder="Paste image URL"
          className="
            flex-1 bg-black/40 border border-white/20
            rounded-xl px-4 py-2 text-white
            placeholder-white/40 outline-none
            focus:border-emerald-400 transition
          "
        />
      </div>

      {/* IMAGE PREVIEW */}
      {editForm.image_url && (
        <img
          src={editForm.image_url}
          alt="Preview"
          className="
            h-36 w-36 object-cover rounded-2xl
            border border-white/20 shadow-lg
          "
        />
      )}

      {/* BIO */}
      <div>
        <label className="block text-xs text-white/50 mb-1">
          Volunteer Bio
        </label>
        <textarea
          rows={4}
          value={editForm.bio || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, bio: e.target.value })
          }
          className="
            w-full bg-black/40 border border-white/20
            rounded-2xl p-4 text-white
            placeholder-white/40 outline-none
            focus:border-emerald-400 transition
          "
          placeholder="Share something meaningful about this volunteer…"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => saveEdit(s.id)}
          className="
            px-6 py-2 rounded-xl
            bg-emerald-500 text-black font-bold
            hover:scale-105 transition
          "
        >
          💾 Save
        </button>
        <button
          onClick={() => setEditingId(null)}
          className="
            px-6 py-2 rounded-xl
            bg-white/20 text-white
            hover:bg-white/30 transition
          "
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
