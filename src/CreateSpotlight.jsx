import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const API = "https://singspacebackend.onrender.com";

/* 🌤 Cloudinary */
const CLOUD_NAME = "dcw0wqlse";
const UPLOAD_PRESET = "karaoke";

export default function CreateSpotlight() {
  const { prideId, token, isAdmin, isStaff } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    years_of_service: "",
    bio: "",
    image_url: "",
  });

  /* ---------------- AUTH HEADERS ---------------- */
  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  /* ---------------- CLOUDINARY UPLOAD ---------------- */
const handleFileUpload = async (file) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "volunteer_spotlights");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Upload failed");
    }

    setForm((prev) => ({
      ...prev,
      image_url: data.secure_url,
    }));

    toast.success("📸 Image uploaded!");
  } catch (err) {
    console.error(err);
    toast.error("Image upload failed");
  }
};


  /* ---------------- FETCH VOLUNTEER SUBMISSIONS ---------------- */
  useEffect(() => {
    if (!prideId) return;

    axios
      .get(`${API}/api/pride/${prideId}/volunteers`, authHeaders)
      .then((res) => setSubmissions(res.data || []))
      .catch(() => setSubmissions([]));
  }, [prideId]);

  /* ---------------- CREATE FROM SUBMISSION ---------------- */
const createSpotlight = async () => {
  if (!form.name.trim()) {
    toast.error("Name is required");
    return;
  }

  try {
    await axios.post(
      `${API}/api/pride/${prideId}/volunteer-spotlights`,
      {
        ...form,
        years_of_service: form.years_of_service || null,
        source_submission_id: selectedSubmission?.id || null,
      },
      authHeaders
    );

    toast.success("🌟 Volunteer spotlight created!");
    resetForm();
  } catch (err) {
    console.error(err);
    toast.error("Failed to create spotlight");
  }
};



  const resetForm = () => {
    setSelectedSubmission(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      role: "",
      years_of_service: "",
      bio: "",
      image_url: "",
    });
  };

  if (!isAdmin && !isStaff) return null;

  /* ================= UI ================= */
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-indigo-600/20
        border border-white/20 rounded-3xl p-8 shadow-xl
      "
    >
      <h2 className="text-3xl font-black text-pink-300 mb-6">
        🌟 Create Volunteer Spotlight
      </h2>

      {/* ---------- FROM SUBMISSION ---------- */}
      <div className="mb-8">
        <h3 className="font-bold text-white mb-2">
          Create from Volunteer Submission
        </h3>

<select
  value={selectedSubmission?.id || ""}
  onChange={(e) => {
    const submission =
      submissions.find((s) => s.id === Number(e.target.value)) || null;

    setSelectedSubmission(submission);

    if (submission) {
      setForm((prev) => ({
        ...prev,
        name: submission.name || "",
        email: submission.email || "",
        phone: submission.phone || "",
        // DO NOT overwrite spotlight-only fields
        // role, years_of_service, bio, image_url stay as-is
      }));
    }
  }}
  className="w-full p-3 rounded-lg bg-black/60 border border-white/20"
>

          <option value="">Select a volunteer…</option>
          {submissions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.email}
            </option>
          ))}
        </select>
      </div>

      {/* ---------- FORM ---------- */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
  {[
    { label: "Name", key: "name", type: "text" },
    { label: "Email", key: "email", type: "email" },
    { label: "Phone", key: "phone", type: "tel" },
    { label: "Role", key: "role", type: "text" },
    { label: "Years of Service", key: "years_of_service", type: "number" },
  ].map(({ label, key, type }) => (
    <div key={key} className="relative group">
      <input
        type={type}
        value={form[key] || ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="
          peer w-full bg-black/40 text-white
          border border-white/20 rounded-xl
          px-4 pt-6 pb-2
          focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
          outline-none transition
        "
        placeholder=" "
      />
      <label
        className="
          absolute left-4 top-2 text-xs text-white/50
          peer-focus:text-emerald-300 transition
        "
      >
        {label}
      </label>
    </div>
  ))}
</div>

{/* ---------- IMAGE UPLOAD / URL ---------- */}
<div className="mb-6 space-y-3">
  <div className="flex flex-col sm:flex-row gap-3">
    {/* File upload */}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleFileUpload(e.target.files[0])}
      className="
        block w-full text-sm text-white
        file:mr-4 file:py-2 file:px-4
        file:rounded-lg file:border-0
        file:bg-emerald-400 file:text-black
        file:font-bold hover:file:bg-emerald-300
      "
    />

    {/* URL fallback */}
    <input
      placeholder="Or paste image URL"
      value={form.image_url}
      onChange={(e) =>
        setForm({ ...form, image_url: e.target.value })
      }
      className="input flex-1"
    />
  </div>

  {/* Preview */}
  {form.image_url && (
    <div className="mt-3 flex justify-center">
      <img
        src={form.image_url}
        alt="Preview"
        className="h-32 rounded-xl object-cover border border-white/30"
      />
    </div>
  )}
</div>


      <textarea
        placeholder="Volunteer bio"
        rows={4}
        value={form.bio}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
        className="w-full p-4 rounded-xl bg-black/60 border border-white/20 mb-6"
      />

     {/* ---------- ACTION ---------- */}
<div className="flex justify-center">
  <button
    onClick={createSpotlight}
    className="
      px-8 py-3 rounded-xl
      bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400
      text-black font-black
      hover:scale-105 transition
    "
  >
    🌟 Create Volunteer Spotlight
  </button>
</div>

    </motion.div>
  );
}
