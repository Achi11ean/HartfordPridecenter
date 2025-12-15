// Admin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";

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
    setEditingAdmin(admin);
    setEditForm({
      name: admin.name,
      email: admin.email,
      username: admin.username,
      pin: "",
    });
  };

  // ───────────────────────────────
  // Save Edit (FULL PATCH ROUTE)
  // ───────────────────────────────
const saveEdit = async () => {
  try {
    const payload = {
      name: editForm.name,
      email: editForm.email,
      username: editForm.username,
    };

    // ✅ only include pin if user typed one
    if (editForm.pin.trim()) {
      payload.pin = editForm.pin;
    }

    const res = await axios.patch(
      `${API}/api/pride-admins/${editingAdmin.id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setAdmins((prev) =>
      prev.map((a) =>
        a.id === editingAdmin.id ? res.data.admin : a
      )
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
