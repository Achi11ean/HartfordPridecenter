// Admin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
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
  "Social Media & Marketing",
  "Web Developer",
  "Finance",
  "Community Outreach",
];

export default function Admin() {
  const { token, prideId, isAdmin } = useAuth();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingAdmin, setEditingAdmin] = useState(null);
const [editForm, setEditForm] = useState({
  name: "",
  email: "",
  username: "",
  pin: "",
  roles: ["Admin"],
  image_url: "",
  bio: "", // ✍️ NEW
});

  // ───────────────────────────────
  // Fetch Admins
  // ───────────────────────────────
  const fetchAdmins = async () => {
    if (!prideId) return;

    try {
      const res = await axios.get(
        `${API}/api/pride/${prideId}/admins`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdmins(res.data || []);
    } catch {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchAdmins();
  }, [prideId, isAdmin]);

  // ───────────────────────────────
  // Toggle Active (UNCHANGED)
  // ───────────────────────────────
  const toggleActive = async (admin) => {
    try {
      const res = await axios.patch(
        `${API}/api/pride-admins/${admin.id}`,
        { is_active: !admin.is_active },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? res.data : a))
      );

      toast.success(res.data.is_active ? "Admin activated" : "Admin deactivated");
    } catch {
      toast.error("Failed to update admin");
    }
  };

  // ───────────────────────────────
  // Open Edit Modal
  // ───────────────────────────────
const openEdit = (admin) => {
  const extraRoles = admin.other_roles
    ? admin.other_roles
        .split(",")
        .map(r => r.trim())
        .filter(r => r && r !== "Admin")
    : [];

  setEditingAdmin(admin);
  setEditForm({
    name: admin.name || "",
    email: admin.email || "",
    username: admin.username || "",
    pin: "",
    image_url: admin.image_url || "",
    bio: admin.bio || "", // ✅ load bio
    roles: ["Admin", ...extraRoles],
  });
};

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      data
    );

    setEditForm((prev) => ({
      ...prev,
      image_url: res.data.secure_url,
    }));
  } catch {
    toast.error("Image upload failed");
  }
};

const generateAdminBio = async () => {
  if (!editForm.name) {
    toast.error("Name is required to generate a bio");
    return;
  }

  try {
    const keyPoints = `
Name: ${editForm.name}
Roles: ${editForm.roles.join(", ")}

User-written notes to include:
${editForm.bio || "(none provided)"}
`;

    const res = await axios.post(
      `${API}/api/pride/generate-bio`,
      {
        key_points: keyPoints,
        role_type: "Pride Administrator",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditForm((prev) => ({
      ...prev,
      bio: res.data.bio,
    }));

    toast.success("Bio generated ✨");
  } catch (err) {
    toast.error("Failed to generate bio");
  }
};


  // ───────────────────────────────
  // Save Edit (FULL PATCH ROUTE)
  // ───────────────────────────────
const saveEdit = async () => {
  try {
    const otherRoles = editForm.roles.filter(r => r !== "Admin");

const payload = {
  name: editForm.name,
  email: editForm.email,
  username: editForm.username,
  image_url: editForm.image_url || null,
  bio: editForm.bio || null, // ✍️ NEW
  other_roles: otherRoles.length ? otherRoles.join(", ") : null,
};


    if (editForm.pin.trim()) {
      payload.pin = editForm.pin;
    }

    const res = await axios.patch(
      `${API}/api/pride-admins/${editingAdmin.id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setAdmins(prev =>
      prev.map(a => a.id === editingAdmin.id ? res.data.admin : a)
    );

    toast.success("Admin updated");
    setEditingAdmin(null);
  } catch (err) {
    toast.error(err.response?.data?.error || "Update failed");
  }
};


  // ───────────────────────────────
  // Delete Admin
  // ───────────────────────────────
  const deleteAdmin = async (id) => {
    if (!window.confirm("Delete this admin account?")) return;

    try {
      await axios.delete(
        `${API}/api/pride-admins/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      toast.success("Admin deleted");
    } catch {
      toast.error("Failed to delete admin");
    }
  };

  if (loading) {
    return <div className="text-center text-yellow-300 py-10">Loading admins…</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-yellow-300">
        👑 Admin Accounts
      </h2>

      {admins.map((admin) => (
        <div
          key={admin.id}
          className="bg-black/60 border border-yellow-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row justify-between gap-4"
        >
          <div>
            <p className="text-xl font-bold text-yellow-300">{admin.name}</p>
            <p className="text-sm text-yellow-200">@{admin.username}</p>
            <p className="text-xs text-yellow-400">{admin.email}</p>
            {admin.other_roles && (
  <p className="text-xs text-yellow-300 mt-1">
    Roles: Admin, {admin.other_roles}
  </p>
)}

          </div>

          <div className="flex gap-3">
            <button
              onClick={() => openEdit(admin)}
              className="px-4 py-2 rounded-xl bg-blue-500 text-black font-bold hover:bg-blue-600"
            >
              Edit
            </button>

            <button
              onClick={() => toggleActive(admin)}
              className={`px-4 py-2 rounded-xl font-bold ${
                admin.is_active
                  ? "bg-green-500 text-black"
                  : "bg-orange-400 text-black"
              }`}
            >
              {admin.is_active ? "Active" : "Inactive"}
            </button>

            <button
              onClick={() => deleteAdmin(admin.id)}
              className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* ───────────── Edit Modal ───────────── */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25] p-6 rounded-3xl border border-yellow-400/40 w-full max-w-md">
            <h3 className="text-2xl font-extrabold text-yellow-300 mb-4">
              ✏️ Edit Admin
            </h3>

            {["name", "email", "username", "pin"].map((field) => (
              <input
                key={field}
                type={field === "pin" ? "password" : "text"}
                placeholder={field.toUpperCase()}
                value={editForm[field]}
                onChange={(e) =>
                  setEditForm({ ...editForm, [field]: e.target.value })
                }
                className="w-full mb-3 p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
              />
            ))}
{/* Profile Image */}
<div className="mb-4">
  <label className="block text-yellow-300 font-semibold mb-2">
    Profile Image
  </label>

  {editForm.image_url && (
    <img
      src={editForm.image_url}
      alt="Admin"
      className="w-24 h-24 rounded-full object-cover mb-2 border border-yellow-400"
    />
  )}

  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="block w-full text-sm text-yellow-200
               file:mr-4 file:py-2 file:px-4
               file:rounded-xl file:border-0
               file:bg-yellow-400 file:text-black file:font-bold
               hover:file:bg-yellow-500"
  />
</div>


<div className="mb-4">
  <label className="block text-yellow-300 font-semibold mb-2">
    Additional Roles (Admin is default)
  </label>

  <Select
    isMulti
    isSearchable
    options={ROLE_OPTIONS
      .filter(r => r !== "Admin")
      .map(r => ({ value: r, label: r }))
    }
    value={editForm.roles
      .filter(r => r !== "Admin")
      .map(r => ({ value: r, label: r }))
    }
    onChange={(selected) => {
      const selectedRoles = selected
        ? selected.map(opt => opt.value)
        : [];

      setEditForm(prev => ({
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
      singleValue: (base) => ({
        ...base,
        color: "#FDE68A",
      }),
    }}
  />

  <p className="text-xs text-yellow-400 mt-1">
    Admin role is permanent and cannot be removed
  </p>
</div>
<div className="mb-4">
  <label className="block text-yellow-300 font-semibold mb-2">
    Bio (public)
  </label>

  <textarea
    rows={4}
    placeholder="Tell the community about this admin…"
    value={editForm.bio}
    onChange={(e) =>
      setEditForm({ ...editForm, bio: e.target.value })
    }
    className="
      w-full p-3 rounded-xl
      bg-black/40 border border-yellow-500/40
      text-yellow-100 resize-none
      placeholder-yellow-300/60
    "
  />

  <p className="text-xs text-yellow-400 mt-1">
    Shown on the public “Our Team” page
  </p>
</div>
<div className="flex justify-end mt-2">
  <button
    type="button"
    onClick={generateAdminBio}
    className="
      px-4 py-2 rounded-xl
      bg-purple-500 text-black font-bold
      hover:bg-purple-600 transition
    "
  >
    ✨ Generate Bio
  </button>
</div>


            <div className="flex gap-3 mt-4">
              <button
                onClick={saveEdit}
                className="flex-1 py-3 rounded-xl bg-yellow-400 text-black font-extrabold"
              >
                Save
              </button>

              <button
                onClick={() => setEditingAdmin(null)}
                className="flex-1 py-3 rounded-xl bg-gray-600 text-white font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
