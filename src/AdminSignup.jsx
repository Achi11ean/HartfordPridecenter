import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";

const API = "https://singspacebackend.onrender.com";
const CLOUD_NAME = "dcw0wqlse";
const UPLOAD_PRESET = "karaoke";

const ROLE_OPTIONS = [
  "Admin",
  "Director",
  "Coordinator",
  "Event Lead",
  "Volunteer Manager",
  "Marketing",
  "Finance",
  "Community Outreach",
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
  "Grant Writer",
  "Finance Manager",
  "Office Administrator",
  "Board Member",
  "Intern",
  "Volunteer",
  "Support Staff",
];

export default function AdminSignup() {
  const [prides, setPrides] = useState([]);
  const [loading, setLoading] = useState(false);
const [successData, setSuccessData] = useState(null);

const [form, setForm] = useState({
  pride_id: "",
  name: "",
  email: "",
  username: "",
  pin: "",
  roles: ["Admin"],
  image_url: "",
  bio: "", // ✍️ NEW
});

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    setForm((prev) => ({
      ...prev,
      image_url: res.data.secure_url,
    }));
  } catch (err) {
    toast.error("Image upload failed");
  }
};
const generateBio = async () => {
  if (!form.name || form.roles.length === 0) {
    toast.error("Add a name and role first");
    return;
  }

  try {
    const keyPoints = `
Name: ${form.name}
Roles: ${form.roles.join(", ")}

User-written notes to include:
${form.bio || "(none provided)"}
`;

    const res = await axios.post(
      `${API}/api/pride/generate-bio`,
      {
        key_points: keyPoints,
        role_type: "Pride Administrator",
      }
    );

    setForm(prev => ({
      ...prev,
      bio: res.data.bio,
    }));

    toast.success("Bio generated ✨");
  } catch {
    toast.error("Failed to generate bio");
  }
};


const toggleRole = (role) => {
  if (role === "Admin") return; // 🔒 cannot remove

  setForm((prev) => ({
    ...prev,
    roles: prev.roles.includes(role)
      ? prev.roles.filter((r) => r !== role)
      : [...prev.roles, role],
  }));
};

const roleOptions = ROLE_OPTIONS.map((role) => ({
  value: role,
  label: role,
}));

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
        // ✅ Auto-lock to first Pride Center
        setForm((prev) => ({
          ...prev,
          pride_id: list[0].id,
        }));
      }
    } catch (err) {
      toast.error("Failed to load Pride Centers");
    }
  };

  // ───────────────────────────────
  // Form Handlers
  // ───────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const prideName =
    prides.find((p) => p.id === form.pride_id)?.name || "Loading…";

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
   const res = await axios.post(
  `${API}/api/pride/${form.pride_id}/admins`,
  {
    name: form.name,
    email: form.email,
    username: form.username,
    pin: form.pin,
    image_url: form.image_url || null,
    bio: form.bio || null, // ✍️ NEW
    other_roles: form.roles.filter(r => r !== "Admin").join(", "),
  }
);


    const admin = res.data?.admin;

    setSuccessData({
      prideName,
      name: admin?.name,
      username: admin?.username,
      isActive: admin?.is_active,
    });

    toast.success("Pride admin created successfully 🎉");

   setForm({
  pride_id: form.pride_id,
  name: "",
  email: "",
  username: "",
  pin: "",
  roles: ["Admin"],
  image_url: "",
  bio: "", // ✨ reset
});

  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to create Pride admin");
  } finally {
    setLoading(false);
  }
};



  // ───────────────────────────────
  // UI
  // ───────────────────────────────
  return (
    <div className="
       w-full
      bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25]
      flex items-center justify-center
    min-h-screen pb-32
    ">
      <div className="
        w-full max-w-full
        bg-black/60 backdrop-blur-xl
        border border-yellow-500/40
        rounded-none shadow-2xl
        p-2
      ">
        <h1 className="text-4xl font-extrabold text-center text-yellow-300 mb-2">
          🏳️‍🌈 Pride Admin Signup
        </h1>

        <p className="text-center text-yellow-200 mb-8">
          Admin account for:
          <span className="block mt-1 text-yellow-400 font-bold">
            {prideName}
          </span>
        </p>

<form
  onSubmit={handleSubmit}
  className="space-y-4 "
  style={{ pointerEvents: successData ? "none" : "auto", opacity: successData ? 0.4 : 1 }}
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
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
          />

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
<div>
  <label className="block text-yellow-300 mb-1 font-semibold">
    Profile Image (optional)
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="w-full text-yellow-200"
  />

  {form.image_url && (
    <img
      src={form.image_url}
      alt="Preview"
      className="mt-3 w-24 h-24 object-cover rounded-xl border border-yellow-400"
    />
  )}
</div>

<div className="mb-4">
  <p className="text-yellow-300 font-semibold mb-2">
    Roles
  </p>

 <Select
  isMulti
  isSearchable
  options={roleOptions.filter(r => r.value !== "Admin")}
  value={form.roles
    .filter(r => r !== "Admin")
    .map(r => ({ value: r, label: r }))
  }
  onChange={(selected) => {
    const selectedRoles = selected
      ? selected.map(opt => opt.value)
      : [];

    setForm(prev => ({
      ...prev,
      roles: ["Admin", ...selectedRoles],
    }));
  }}
  placeholder="Search & select additional roles…"
  className="react-select-container"
  classNamePrefix="react-select"
  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "rgba(0,0,0,0.4)",
      borderColor: "#EAB308",
      borderRadius: "0.75rem",
      minHeight: "48px",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#0f2d25",
      border: "1px solid #EAB308",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#EAB308" : "transparent",
      color: state.isFocused ? "#000" : "#FDE68A",
      cursor: "pointer",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#EAB308",
      borderRadius: "9999px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#000",
      fontWeight: "bold",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#000",
      ":hover": {
        backgroundColor: "#F59E0B",
        color: "#000",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#FDE68A",
    }),
    input: (base) => ({
      ...base,
      color: "#FDE68A",
    }),
  }}
/>

  <p className="text-xs text-yellow-400 mt-1">
    Admin role is permanent and cannot be removed
  </p>
</div>

<div>
  <label className="block text-yellow-300 mb-1 font-semibold">
    Bio (optional)
  </label>

  <textarea
    name="bio"
    rows={4}
    placeholder="Tell the community a little about this admin…"
    value={form.bio}
    onChange={handleChange}
    className="
      w-full p-3 rounded-xl
      bg-black/40 border border-yellow-500/40
      text-yellow-100 resize-none
      placeholder-yellow-300/60
    "
  />
<div className="flex justify-end">
  <button
    type="button"
    onClick={generateBio}
    className="
      mt-2 px-4 py-2 rounded-xl
      bg-purple-500 text-black font-bold
      hover:bg-purple-600 transition
    "
  >
    ✨ Generate Bio
  </button>
</div>

  <p className="text-xs text-yellow-400 mt-1">
    This will appear on the public “Our Team” page
  </p>
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
            {loading ? "Creating Admin..." : "Create Pride Admin"}
          </button>
        </form>

      </div>
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
        🎉 Admin Created!
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
        <p className={`mt-2 font-bold ${
          successData.isActive
            ? "text-green-400"
            : "text-orange-400"
        }`}>
          {successData.isActive
            ? "✅ Admin is active immediately"
            : "⏳ Admin pending activation"}
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
        Create Another Admin
      </button>
    </div>
  </div>
)}

    </div>
  );
}
