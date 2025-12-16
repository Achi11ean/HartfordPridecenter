import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";

// 🔐 Cloudinary
const CLOUD_NAME = "dcw0wqlse";
const UPLOAD_PRESET = "karaoke";

const STATUS_OPTIONS = [
  "pending",
  "approved",
  "declined",
  "confirmed",
  "cancelled",
];

export default function ManageVendors() {
  const { token, prideId } = useAuth();

  const [vendors, setVendors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);

  /* ───────────────── Fetch Vendors ───────────────── */
  const fetchVendors = async () => {
    try {
      const res = await axios.get(
        `${API}/api/pride/${prideId}/vendors`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVendors(res.data || []);
    } catch {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
    // eslint-disable-next-line
  }, [prideId]);

  /* ───────────────── Cloudinary Upload ───────────────── */
  const handleImageUpload = async (file) => {
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

      toast.success("📸 Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Image upload failed");
    }
  };

  /* ───────────────── Actions ───────────────── */
  const startEdit = (vendor) => {
    setEditingId(vendor.id);
    setEditForm({ ...vendor });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      await axios.patch(
        `${API}/api/pride-vendors/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Vendor updated");
      setEditingId(null);
      fetchVendors();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm("Delete this vendor permanently?")) return;

    try {
      await axios.delete(
        `${API}/api/pride-vendors/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info("Vendor deleted");
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ───────────────── UI States ───────────────── */
  if (loading) {
    return <p className="text-yellow-200">Loading vendors…</p>;
  }

  if (!vendors.length) {
    return (
      <p className="italic text-yellow-200">
        No vendors added yet.
      </p>
    );
  }

  /* ───────────────── Render ───────────────── */
  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-extrabold text-yellow-300 border-b border-yellow-400 mb-2">
        🛠 Manage Vendors
      </h2>

      {vendors.map((v) => (
        <div
          key={v.id}
          className="bg-black/60 border border-yellow-500/30 rounded-xl p-4 shadow-lg"
        >
          {editingId === v.id ? (
            <div className="space-y-3">

              {/* Company */}
              <input
                value={editForm.company_name || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, company_name: e.target.value })
                }
                className="w-full px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
              />

              <input
                value={editForm.vendor_type || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, vendor_type: e.target.value })
                }
                className="w-full px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
              />

              {/* Contact */}
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  value={editForm.contact_name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, contact_name: e.target.value })
                  }
                  className="px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
                />
                <input
                  type="email"
                  value={editForm.contact_email || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      contact_email: e.target.value,
                    })
                  }
                  className="px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
                />
              </div>

              {/* Website */}
              <input
                value={editForm.website_url || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, website_url: e.target.value })
                }
                placeholder="Website URL"
                className="w-full px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
              />

              {/* 🖼 Vendor Image */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-yellow-200">
                  Vendor Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="w-full text-yellow-100"
                />

                <input
                  value={editForm.image_url || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, image_url: e.target.value })
                  }
                  placeholder="Or paste image URL"
                  className="w-full px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
                />

                {editForm.image_url && (
                  <img
                    src={editForm.image_url}
                    alt="Preview"
                    className="h-32 rounded shadow object-cover"
                  />
                )}
              </div>

              {/* Times */}
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="datetime-local"
                  value={editForm.start_time || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, start_time: e.target.value })
                  }
                  className="px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
                />
                <input
                  type="datetime-local"
                  value={editForm.end_time || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, end_time: e.target.value })
                  }
                  className="px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
                />
              </div>

              {/* Status */}
              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
                className="w-full px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* Actions */}
              <div className="flex justify-between items-center mt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        is_active: e.target.checked,
                      })
                    }
                  />
                  Active
                </label>

                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(v.id)}
                    className="px-4 py-1 bg-green-500 text-black font-bold rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-1 bg-gray-400 text-black font-bold rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-yellow-300">
                  {v.company_name}
                </h3>
                <p className="text-sm text-yellow-100">
                  {v.vendor_type}
                </p>

                {v.image_url && (
                  <img
                    src={v.image_url}
                    alt={v.company_name}
                    className="mt-2 h-20 rounded shadow object-cover"
                  />
                )}

                <p className="text-xs text-yellow-200 mt-2">
                  <strong>Contact:</strong> {v.contact_name} ·{" "}
                  <a
                    href={`mailto:${v.contact_email}`}
                    className="underline"
                  >
                    {v.contact_email}
                  </a>
                </p>

                {v.website_url && (
                  <a
                    href={v.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-blue-300 underline mt-1"
                  >
                    Visit website
                  </a>
                )}

                <div className="mt-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-yellow-400/20 border border-yellow-400 text-yellow-200">
                    {v.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => startEdit(v)}
                  className="px-3 py-1 bg-yellow-400 text-black font-bold rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteVendor(v.id)}
                  className="px-3 py-1 bg-red-500 text-white font-bold rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
