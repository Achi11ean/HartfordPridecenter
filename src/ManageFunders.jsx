import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext"; // 👈 adjust path if needed

const API = "https://singspacebackend.onrender.com";

export default function ManageFunders() {
  const { prideId, isAuthenticated, isAdmin, isStaff } = useAuth();

  const [funders, setFunders] = useState([]);
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
const CLOUD_NAME = "dcw0wqlse";
const UPLOAD_PRESET = "karaoke";
const [uploading, setUploading] = useState(false);

const uploadLogo = async (file) => {
  if (!file) return;

  setUploading(true);

  try {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      data
    );

    setEditForm((prev) => ({
      ...prev,
      logo_url: res.data.secure_url,
    }));
  } catch (err) {
    alert("Logo upload failed");
  } finally {
    setUploading(false);
  }
};

  /* ---------------- GUARDS ---------------- */

  if (!isAuthenticated || !prideId) {
    return (
      <div className="text-center py-20 text-red-600 font-bold">
        Authentication required to manage funders.
      </div>
    );
  }

  if (!isAdmin && !isStaff) {
    return (
      <div className="text-center py-20 text-red-600 font-bold">
        You do not have permission to manage funders.
      </div>
    );
  }

  /* ---------------- LOAD DATA ---------------- */

  const loadFunders = async () => {
    const res = await axios.get(
      `${API}/api/pride/${prideId}/funders`
    );
    setFunders(res.data || []);
  };

  const loadServices = async () => {
    const res = await axios.get(
      `${API}/api/pride/${prideId}/services`
    );
    setServices(res.data || []);
  };

  useEffect(() => {
    if (!prideId) return;

    setLoading(true);
    Promise.all([loadFunders(), loadServices()]).finally(() =>
      setLoading(false)
    );
  }, [prideId]);

  /* ---------------- ACTIONS ---------------- */

  const startEdit = (f) => {
    setEditingId(f.id);
    setEditForm({
      organization_name: f.organization_name,
      contact_name: f.contact_name || "",
      contact_email: f.contact_email || "",
      details: f.details || "",
      logo_url: f.logo_url || "",
      is_active: f.is_active,
          website_url: f.website_url || "",   // ✅ ADD THIS

    });
  };

  const saveEdit = async (id) => {
    await axios.patch(`${API}/api/pride-funders/${id}`, editForm);
    setEditingId(null);
    loadFunders();
  };

  const deactivate = async (id) => {
    if (!window.confirm("Deactivate this funder?")) return;
    await axios.post(`${API}/api/pride-funders/${id}/deactivate`);
    loadFunders();
  };

  const deleteFunder = async (id) => {
    if (!window.confirm("DELETE this funder permanently?")) return;
    await axios.delete(`${API}/api/pride-funders/${id}`);
    loadFunders();
  };

  const addService = async (funderId, serviceId) => {
    if (!serviceId) return;

    await axios.post(
      `${API}/api/pride-funders/${funderId}/services`,
      { service_id: serviceId }
    );
    loadFunders();
  };

  const removeService = async (funderId, serviceId) => {
    await axios.delete(
      `${API}/api/pride-funders/${funderId}/services/${serviceId}`
    );
    loadFunders();
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="text-center py-20 animate-pulse text-lg">
        Loading funders…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h2 className="text-4xl font-black text-yellow-400">
        🏛️ Manage Pride Funders
      </h2>

      {funders.map((f) => (
        <motion.div
          key={f.id}
          layout
          className="
            bg-black/60 rounded-3xl border-4 border-yellow-400
            shadow-xl p-6 space-y-4
          "
        >
          {/* HEADER */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {f.logo_url && (
              <img
                src={f.logo_url}
                alt={f.organization_name}
                className="h-20 object-contain"
              />
            )}

            <div className="flex-1">
              <h3 className="text-2xl font-black">
                {f.organization_name}
              </h3>
              {!f.is_active && (
                <span className="text-sm text-red-600 font-bold">
                  INACTIVE
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => startEdit(f)}
                className="px-4 py-2 bg-yellow-300 font-bold rounded"
              >
                Edit
              </button>

              {f.is_active && (
                <button
                  onClick={() => deactivate(f.id)}
                  className="px-4 py-2 bg-orange-300 font-bold rounded"
                >
                  Deactivate
                </button>
              )}

              <button
                onClick={() => deleteFunder(f.id)}
                className="px-4 py-2 bg-red-500 text-white font-bold rounded"
              >
                Delete
              </button>
            </div>
          </div>
{/* FUNDER DETAILS (READ-ONLY VIEW) */}
{editingId !== f.id && f.details && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="
      bg-black/50 border border-white/20 rounded-2xl
      p-4 text-white/90
    "
  >
    <h4 className="font-black text-yellow-300 mb-2">
      📝 Message from this Funder
    </h4>

    <p className="whitespace-pre-line leading-relaxed">
      {f.details}
    </p>
  </motion.div>
)}
{f.website_url && (
  <a
    href={f.website_url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-blue-300 underline font-semibold"
  >
    🌐 Visit Website
  </a>
)}

          {/* EDIT FORM */}
          <AnimatePresence>
            {editingId === f.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <input
                  value={editForm.organization_name}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      organization_name: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />

                <textarea
                  value={editForm.details}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      details: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full p-2 border rounded"
                />

              <div className="space-y-2">
  <label className="font-bold text-sm text-yellow-300">
    Logo (upload or paste URL)
  </label>

  {/* Upload */}
  <input
    type="file"
    accept="image/*"
    onChange={(e) => uploadLogo(e.target.files[0])}
    className="w-full text-sm"
  />

  {/* Manual URL */}
  <input
    value={editForm.logo_url || ""}
    onChange={(e) =>
      setEditForm({
        ...editForm,
        logo_url: e.target.value,
      })
    }
    placeholder="Or paste logo URL"
    className="w-full p-2 border rounded"
  />

  {uploading && (
    <p className="text-sm text-yellow-300 animate-pulse">
      Uploading logo…
    </p>
  )}

  {editForm.logo_url && (
    <img
      src={editForm.logo_url}
      alt="Logo preview"
      className="h-20 mx-auto object-contain rounded shadow"
    />
  )}
</div>

<input
  value={editForm.website_url || ""}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      website_url: e.target.value,
    })
  }
  placeholder="Website URL (optional)"
  className="w-full p-2 border rounded"
/>

                <div className="flex gap-3">
                  <button
                    onClick={() => saveEdit(f.id)}
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

          {/* SERVICES */}
          <div className="pt-4 border-t">
            <h4 className="font-black text-lg mb-2">
              Funded Services
            </h4>

            <ul className="space-y-1">
              {(f.services || []).map((s) => (
                <li
                  key={s.id}
                  className="flex justify-between items-center"
                >
                  <span>{s.title}</span>
                  <button
                    onClick={() =>
                      removeService(f.id, s.id)
                    }
                    className="text-red-600 font-bold"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <select
              onChange={(e) =>
                addService(f.id, e.target.value)
              }
              defaultValue=""
              className="mt-3 w-full p-2 border rounded"
            >
              <option value="" disabled>
                ➕ Link a service…
              </option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
