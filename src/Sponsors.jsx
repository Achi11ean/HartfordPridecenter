import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://singspacebackend.onrender.com";
const CLOUD_NAME = "dcw0wqlse";
const UPLOAD_PRESET = "karaoke";

const STATUS_OPTIONS = [
  "pending",
  "contacted",
  "approved",
  "declined",
  "Unpaid - Awaiting Payment",
  "paid",
  "confirmed",
];

export default function Sponsors() {
    const cleanPayload = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined
    )
  );
  const [selectedSponsor, setSelectedSponsor] = useState(null);
const [searchTerm, setSearchTerm] = useState("");

  const { token, prideId, isAdmin } = useAuth();
const normalizeImageUrl = (value) => {
  if (!value) return "";
  return value.startsWith("http") ? value : `https://${value}`;
};
const handleLogoUrlChange = (e) => {
  const value = e.target.value;

  setEditForm((prev) => ({
    ...prev,
    logo_url: normalizeImageUrl(value),
  }));
};

  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    organization: "",
    contact_name: "",
    email: "",
    phone: "",
    tier: "",
    wants_booth: false,
    status: "pending",
    website: "",
    social_links: "",
    message: "",
     logo_url: "",
  });

  // ───────────────────────────────
  // Fetch Sponsors
  // ───────────────────────────────
  const fetchSponsors = async () => {
    if (!prideId) return;

    try {
      const res = await axios.get(
        `${API}/api/pride/${prideId}/sponsors`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSponsors(res.data || []);
    } catch {
      toast.error("Failed to load sponsor inquiries");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (prideId && token) {
    fetchSponsors();
  }
}, [prideId, token]);

  // ───────────────────────────────
  // Open Edit
  // ───────────────────────────────
const openEdit = (s) => {
  setEditingId(s.id);
  setEditForm({
    organization: s.organization,
    contact_name: s.contact_name,
    email: s.email,
    phone: s.phone || "",
    tier: s.tier,
    wants_booth: !!s.wants_booth,
    status: s.status || "pending",
    website: s.website || "",
    social_links: s.social_links || "",
    message: s.message || "",
    logo_url: s.logo_url || "",
  });
};

const filteredSponsors = sponsors.filter((s) => {
  const q = searchTerm.toLowerCase();

  return (
    s.organization?.toLowerCase().includes(q) ||
    s.contact_name?.toLowerCase().includes(q) ||
    s.email?.toLowerCase().includes(q) ||
    s.tier?.toLowerCase().includes(q) ||
    s.status?.toLowerCase().includes(q)
  );
});



const handleLogoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const toastId = toast.loading("Uploading logo…");

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

    toast.update(toastId, {
      render: "Logo uploaded",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
  } catch (err) {
    toast.update(toastId, {
      render: "Logo upload failed",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};

  // ───────────────────────────────
  // Save Edit
  // ───────────────────────────────
const saveEdit = async () => {
  try {
const payload = {
  ...editForm,
};

    const res = await axios.patch(
      `${API}/api/sponsors/${editingId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

setSponsors((prev) =>
  prev.map((s) =>
    s.id === editingId ? res.data.sponsor : s
  )
);

console.log("PATCH response:", res.data);


    toast.success("Sponsor updated");
    setEditingId(null);
  } catch (err) {
    toast.error(err.response?.data?.error || "Update failed");
  }
};

const DELETE_PIN = "HPC2025";

  // ───────────────────────────────
  // Delete
  // ───────────────────────────────
const deleteSponsor = async (id) => {
  const pin = window.prompt(
    "Enter delete PIN to confirm removal of this sponsor:"
  );

  if (!pin) {
    toast.info("Delete cancelled");
    return;
  }

  if (pin !== DELETE_PIN) {
    toast.error("Incorrect PIN. Delete denied.");
    return;
  }

  if (!window.confirm("This action is permanent. Delete this sponsor inquiry?")) {
    return;
  }

  try {
    await axios.delete(
      `${API}/api/sponsors/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSponsors((prev) => prev.filter((s) => s.id !== id));
    toast.success("Sponsor inquiry deleted");
  } catch {
    toast.error("Failed to delete sponsor inquiry");
  }
};


  if (loading) {
    return (
      <div className="text-center text-yellow-300 py-10">
        Loading sponsor inquiries…
      </div>
    );
  }

return (
  <div className="min-h-screen space-y-6">
    <h2 className="text-3xl font-extrabold text-yellow-300">
      💼 Sponsor Inquiries
    </h2>
<input
  type="text"
  placeholder="🔍 Search sponsors by name, email, tier, or status…"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="
    w-full md:w-1/2
    p-3 rounded-xl
    bg-black/40 border border-yellow-500/40
    text-yellow-100
    placeholder-yellow-300/60
    focus:outline-none focus:border-yellow-400
  "
/>

    {sponsors.length === 0 ? (
      <p className="text-yellow-200 italic">
        No sponsor inquiries yet.
      </p>
    ) : (
      <div className="grid  grid-cols-2 gap-6">
{filteredSponsors.map((s) => (
<div
  key={s.id}
  onClick={() => {
    if (editingId !== s.id) {
      setSelectedSponsor(s);
    }
  }}
  className="
    cursor-pointer
    bg-gradient-to-br from-slate-600 via-black to-slate-600
    border-2 border-yellow-500
    rounded-2xl p-6 shadow-xl
    flex flex-col justify-between
    hover:border-yellow-300 hover:shadow-yellow-500/30
    transition
  "
>

            {/* ===== EDIT MODE ===== */}
            {editingId === s.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "organization",
                    "contact_name",
                    "email",
                    "phone",
                    "tier",
                    "website",
                    "social_links",
                  ].map((field) => (
                    <input
                      key={field}
                      value={editForm[field] || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          [field]: e.target.value,
                        })
                      }
                      placeholder={field.replace("_", " ").toUpperCase()}
                      className="
                        p-3 rounded-xl bg-black/40
                        border border-yellow-500/40
                        text-yellow-100
                      "
                    />
                  ))}
                </div>

                {/* Booth */}
                <label className="flex items-center gap-3 text-yellow-200">
                  <input
                    type="checkbox"
                    checked={editForm.wants_booth}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        wants_booth: e.target.checked,
                      })
                    }
                  />
                  Booth Requested
                </label>

                {/* Logo Upload / URL */}
                <div>
                  <label className="block mb-2 font-bold text-yellow-300">
                    Sponsor Logo
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-yellow-200 mb-2"
                  />

                  <input
                    type="text"
                    value={editForm.logo_url || ""}
                    onChange={handleLogoUrlChange}
                    placeholder="Or paste logo image URL"
                    className="
                      w-full p-3 rounded-xl
                      bg-black/40 border border-yellow-500/40
                      text-yellow-100
                    "
                  />

                  {editForm.logo_url && (
                    <img
                      src={editForm.logo_url}
                      alt="Sponsor Logo Preview"
                      className="
                        mt-3 w-28 h-28 object-contain mx-auto
                        bg-white p-2 rounded-xl
                        border border-yellow-400
                      "
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                </div>

                {/* Message */}
                <textarea
                  value={editForm.message || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, message: e.target.value })
                  }
                  placeholder="Message"
                  rows={4}
                  className="
                    w-full p-3 rounded-xl
                    bg-black/40 border border-yellow-500/40
                    text-yellow-100
                  "
                />

                {/* Status */}
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="
                    w-full p-3 rounded-xl
                    bg-black/40 border border-yellow-500/40
                    text-yellow-100
                  "
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="text-black">
                      {opt.toUpperCase()}
                    </option>
                  ))}
                </select>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={saveEdit}
                    className="flex-1 py-2 rounded-xl bg-yellow-400 text-black font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-2 rounded-xl bg-gray-600 text-white font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ===== VIEW MODE ===== */
              <div className="space-y-3">
                {s.logo_url && (
                  <img
                    src={s.logo_url}
                    alt={`${s.organization} logo`}
                    className="
                      w-24 h-24 mx-auto object-contain
                      bg-gradient-to-br from-slate-700 via-white to-slate-800 p-2 rounded-xl
                      border border-yellow-400
                      shadow-md shadow-yellow-400
                    "
                  />
                )}

                <h3 className="text-xl font-serif border-b border-yellow-400 font-bold text-yellow-300 text-center">
                  {s.organization}
                </h3>

                <p className="text-sm text-yellow-200 text-center">
                  {s.contact_name} • {s.email}
                </p>

              

                {/* Message box */}
             

                <div className="flex gap-3 pt-3">
<button
  onClick={(e) => {
    e.stopPropagation();
    openEdit(s);
  }}
  className="flex-1  rounded-xl bg-blue-500 text-white font-bold"
>
  Edit
</button>

<button
  onClick={(e) => {
    e.stopPropagation();
    deleteSponsor(s.id);
  }}
  className="flex-1  rounded-xl bg-red-600 text-white font-bold"
>
  Delete
</button>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
    <AnimatePresence>
  {selectedSponsor && (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedSponsor(null)}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="
          max-w-2xl w-full
          bg-slate-900 border border-yellow-400
          rounded-2xl p-6
          text-white overflow-y-auto max-h-[90vh]
        "
      >
        <h2 className="text-2xl font-extrabold text-yellow-300 mb-2">
          {selectedSponsor.organization}
        </h2>

        <p className="text-yellow-200 mb-4">
          {selectedSponsor.contact_name} • {selectedSponsor.email}
        </p>

        {selectedSponsor.logo_url && (
          <img
            src={selectedSponsor.logo_url}
            alt="Logo"
            className="w-32 h-32 object-contain mx-auto mb-4 bg-gradient-to-br from-slate-600 via-white to-slate-600 p-2 rounded-xl"
          />
        )}

        <div className="space-y-2 text-sm text-yellow-200">
          <p><strong>Tier:</strong> {selectedSponsor.tier}</p>
          <p><strong>Status:</strong> {selectedSponsor.status}</p>
          <p><strong>Phone:</strong> {selectedSponsor.phone || "—"}</p>
          <p><strong>Booth:</strong> {selectedSponsor.wants_booth ? "Yes" : "No"}</p>

          {selectedSponsor.website && (
            <a
              href={selectedSponsor.website}
              target="_blank"
              rel="noreferrer"
              className="underline text-yellow-300 block"
            >
              Visit Website
            </a>
          )}
        </div>

        {selectedSponsor.message && (
          <div className="mt-4 p-3 bg-black/40 rounded-xl text-yellow-200">
            {selectedSponsor.message}
          </div>
        )}

        <button
          onClick={() => setSelectedSponsor(null)}
          className="mt-6 w-full py-2 rounded-xl bg-yellow-400 text-black font-bold"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

  </div>
);

}
