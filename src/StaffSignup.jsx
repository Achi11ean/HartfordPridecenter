import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = "https://singspacebackend.onrender.com";

export default function StaffSignup() {
  const [prides, setPrides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
const STAFF_ROLES = [
  "Executive Director",
  "Program Director",
  "Operations Manager",
  "Volunteer Coordinator",
  "Community Outreach Coordinator",
  "Events Coordinator",
  "Fundraising Manager",
  "Development Director",
  "Communications Manager",
  "Marketing & Social Media",
  "Education Coordinator",
  "Youth Program Coordinator",
  "Health & Wellness Coordinator",
  "Advocacy & Policy Lead",
  "Grant Writer",
  "Finance Manager",
  "Office Administrator",
  "Board Member",
  "Intern",
  "Volunteer",
  "Support Staff",
];
// ---- Cloudinary Config ----
const CLOUD_NAME = "dcw0wqlse";
const UPLOAD_PRESET = "karaoke";
const [uploadStatus, setUploadStatus] = useState("");
// ────────────────────────────────────────────────
// Cloudinary Manual Upload
// ────────────────────────────────────────────────
const uploadToCloudinary = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  fd.append("folder", "pride_staff");

  setUploadStatus("Uploading image…");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: fd,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      setForm((prev) => ({
        ...prev,
        image_url: data.secure_url,
      }));
      setUploadStatus("✔️ Image uploaded");
    } else {
      throw new Error(data.error?.message || "Upload failed");
    }
  } catch (err) {
    console.error("Cloudinary error:", err);
    setUploadStatus("❌ Image upload failed");
  }
};


  const [form, setForm] = useState({
    pride_id: "",
    first_name: "",
    last_name: "",
    role: "",
    username: "",
    pin: "",
    bio: "",
    image_url: "",
  });

  // ───────────────────────────────
  // Load Pride Centers (auto-select first)
  // ───────────────────────────────
  useEffect(() => {
    fetchPrides();
  }, []);

  const fetchPrides = async () => {
    try {
      const res = await axios.get(`${API}/api/pride/active`);
      const list = res.data || [];
      setPrides(list);

      if (list.length > 0) {
        setForm((prev) => ({
          ...prev,
          pride_id: list[0].id,
        }));
      }
    } catch {
      toast.error("Failed to load Pride Centers");
    }
  };

  const prideName =
    prides.find((p) => p.id === form.pride_id)?.name || "Loading…";

  // ───────────────────────────────
  // Form handlers
  // ───────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/pride-staff`, {
        pride_id: form.pride_id,
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role,
        username: form.username,
        pin: form.pin,
        bio: form.bio || null,
        image_url: form.image_url || null,
      });

      const staff = res.data.staff;

      setSuccessData({
        prideName,
        name: `${staff.first_name} ${staff.last_name}`,
        username: staff.username,
        role: staff.role,
      });

      toast.success("Pride staff account created 🎉");

      setForm({
        pride_id: form.pride_id,
        first_name: "",
        last_name: "",
        role: "",
        username: "",
        pin: "",
        bio: "",
        image_url: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create staff");
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────
  // UI
  // ───────────────────────────────
  return (
    <div className="
      min-h-screen w-full
      bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25]
      flex items-center justify-center
      px-4 
    ">
      <div className="
        w-full max-w-full
        bg-black/60 backdrop-blur-xl
        border border-yellow-500/40
        rounded-3xl shadow-2xl
        p-4
      ">
        <h1 className="text-4xl font-extrabold text-center text-yellow-300 mb-2">
          🏳️‍🌈 Pride Staff Signup
        </h1>

        <p className="text-center text-yellow-200 mb-8">
          Staff account for:
          <span className="block mt-1 text-yellow-400 font-bold">
            {prideName}
          </span>
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          style={{
            pointerEvents: successData ? "none" : "auto",
            opacity: successData ? 0.4 : 1,
          }}
        >
          {/* Locked Pride Center */}
          <input
            type="text"
            value={prideName}
            disabled
            className="
              w-full p-3 rounded-xl
              bg-black/30 border border-yellow-500/30
              text-yellow-300 font-bold cursor-not-allowed
            "
          />

          <input
            autoFocus
            type="text"
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
          />
<select
  name="role"
  value={form.role}
  onChange={handleChange}
  required
  className="
    w-full p-3 rounded-xl
    bg-black/40 border border-yellow-500/40
    text-yellow-100
    focus:outline-none focus:ring-2 focus:ring-yellow-400
  "
>
  <option value="">Select Staff Role</option>

  {STAFF_ROLES.map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ))}
</select>


          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
          />

          <input
            type="password"
            name="pin"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="PIN"
            value={form.pin}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
          />

          <textarea
            name="bio"
            placeholder="Short Bio (optional)"
            value={form.bio}
            onChange={handleChange}
            className="w-full p-3 h-24 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
          />

{/* PROFILE IMAGE */}
<div>
  <label className="block text-yellow-300 font-semibold mb-1">
    Profile Image (optional)
  </label>

  {/* File Upload */}
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files?.[0]) {
        uploadToCloudinary(e.target.files[0]);
      }
    }}
    className="w-full p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
  />

  {/* Manual URL fallback */}
  <input
    type="text"
    name="image_url"
    placeholder="Or paste image URL"
    value={form.image_url}
    onChange={handleChange}
    className="w-full mt-2 p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
  />

  {/* Upload Status */}
  {uploadStatus && (
    <p className="mt-2 text-sm text-yellow-300">{uploadStatus}</p>
  )}

  {/* Preview */}
  {form.image_url && (
    <div className="mt-3 flex justify-center">
      <img
        src={form.image_url}
        alt="Staff Preview"
        className="max-h-40 rounded-xl border-2 border-yellow-400 shadow-lg"
      />
    </div>
  )}
</div>


          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-4 py-3 rounded-xl
              font-extrabold tracking-wide
              bg-gradient-to-r from-yellow-400 to-yellow-600
              text-black shadow-lg
              hover:scale-105 transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Creating Staff..." : "Create Pride Staff"}
          </button>
        </form>
      </div>

      {/* 🎉 Success Modal */}
      {successData && (
        <div className="
          fixed inset-0 z-50
          bg-black/70 backdrop-blur-sm
          flex items-center justify-center
          px-4
        ">
          <div className="
            w-full max-w-md
            bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25]
            border border-yellow-400/50
            rounded-3xl shadow-2xl
            p-8 text-center
            animate-fade-in
          ">
            <h2 className="text-3xl font-extrabold text-yellow-300 mb-2">
              🎉 Staff Created!
            </h2>

            <p className="text-yellow-200 mb-4">
              Pride Center
              <span className="block text-yellow-400 font-bold mt-1">
                {successData.prideName}
              </span>
            </p>

            <div className="bg-black/50 border border-yellow-500/30 rounded-xl p-4 mb-4">
              <p className="text-yellow-200">
                <strong>Name:</strong> {successData.name}
              </p>
              <p className="text-yellow-200">
                <strong>Username:</strong> {successData.username}
              </p>
              <p className="text-yellow-200">
                <strong>Role:</strong> {successData.role}
              </p>
              <p className="mt-2 font-bold text-green-400">
                ✅ Staff account is active
              </p>
            </div>

            <button
              onClick={() => setSuccessData(null)}
              className="
                w-full mt-2 py-3 rounded-xl
                bg-gradient-to-r from-yellow-400 to-yellow-600
                text-black font-extrabold
                shadow-lg hover:scale-105 transition
              "
            >
              Create Another Staff Member
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
