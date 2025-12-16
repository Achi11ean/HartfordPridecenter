import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";

// 🔐 Cloudinary
const CLOUD_NAME = "dcw0wqlse";
const UPLOAD_PRESET = "karaoke";

export default function ManageServices() {
  const { token, prideId } = useAuth();

  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        `${API}/api/pride/${prideId}/services`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices(res.data || []);
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line
  }, [prideId]);

  const startEdit = (service) => {
    setEditingId(service.id);
    setEditForm({ ...service });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // 🖼 Cloudinary Upload
  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const json = await res.json();
      setEditForm((prev) => ({ ...prev, image_url: json.secure_url }));
      toast.success("🖼 Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveEdit = async (id) => {
    try {
      await axios.patch(
        `${API}/api/pride-services/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Service updated");
      setEditingId(null);
      fetchServices();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service permanently?")) return;
    try {
      await axios.delete(
        `${API}/api/pride-services/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info("Service deleted");
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <p className="text-yellow-200">Loading services…</p>;

  if (!services.length)
    return <p className="italic text-yellow-200">No services added yet.</p>;

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-extrabold text-yellow-300 border-b border-yellow-400">
        🛠 Manage Pride Services
      </h2>

      {services.map((s) => (
        <div
          key={s.id}
          className="bg-black/60 border border-yellow-500/30 rounded-xl p-4 shadow-lg"
        >
          {editingId === s.id ? (
            <div className="space-y-3">

              <input
                value={editForm.title || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="w-full px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
              />

              <textarea
                rows={3}
                value={editForm.description || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
              />

              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  value={editForm.contact_name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, contact_name: e.target.value })
                  }
                  placeholder="Contact name"
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
                  placeholder="Contact email"
                  className="px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
                />
              </div>

              <input
                value={editForm.url || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, url: e.target.value })
                }
                placeholder="Optional URL"
                className="w-full px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
              />

              {/* Image URL */}
              <input
                value={editForm.image_url || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, image_url: e.target.value })
                }
                placeholder="Image URL or upload below"
                className="w-full px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
              />

              {/* Upload */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                className="text-yellow-200"
              />

              {editForm.image_url && (
                <img
                  src={editForm.image_url}
                  alt="Preview"
                  className="max-h-40 rounded border border-yellow-400"
                />
              )}

              <div className="flex justify-between items-center mt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!editForm.is_active}
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
                    disabled={uploading}
                    onClick={() => saveEdit(s.id)}
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
                <h3 className="text-lg font-bold text-yellow-300">{s.title}</h3>
                <p className="text-yellow-100 text-sm mt-1">{s.description}</p>

                {s.image_url && (
                  <img
                    src={s.image_url}
                    alt={s.title}
                    className="max-h-40 mt-2 rounded border border-yellow-400"
                  />
                )}

                <p className="text-xs text-yellow-200 mt-2">
                  <strong>Contact:</strong> {s.contact_name} ·{" "}
                  <a href={`mailto:${s.contact_email}`} className="underline">
                    {s.contact_email}
                  </a>
                </p>

                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-blue-300 underline mt-1"
                  >
                    Visit link
                  </a>
                )}

                {!s.is_active && (
                  <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-red-500/20 border border-red-400 text-red-300 rounded">
                    Inactive
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => startEdit(s)}
                  className="px-3 py-1 bg-yellow-400 text-black font-bold rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteService(s.id)}
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
