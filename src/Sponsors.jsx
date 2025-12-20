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
  "Unpaid - Awaiting Payment",
  "approved",
  "declined",

];

export default function Sponsors() {
    const cleanPayload = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined
    )
  );

  const SOCIAL_OPTIONS = {
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
};

const [socialInputs, setSocialInputs] = useState([]);

  const [selectedSponsor, setSelectedSponsor] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
const statusColors = {
  pending: "bg-yellow-400/20 border-yellow-400 text-yellow-200",
  contacted: "bg-blue-400/20 border-blue-400 text-blue-200",
  approved: "bg-green-400/20 border-green-400 text-green-200",
  declined: "bg-red-400/20 border-red-400 text-red-200",
  "Unpaid - Awaiting Payment":
    "bg-orange-400/20 border-orange-400 text-orange-200",
  paid: "bg-emerald-400/20 border-emerald-400 text-emerald-200",
  confirmed: "bg-purple-400/20 border-purple-400 text-purple-200",
};

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
     additional_notes: "",

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

  // 🔗 Parse social links into inputs
 const parsedSocials = (s.social_links || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean)
  .map((url) => {
    if (url.includes("facebook.com/")) {
      return {
        platform: "facebook",
        username: url
          .split("facebook.com/")[1]
          .replace(/^@/, "")
          .replace(/\/.*$/, ""),
      };
    }
    if (url.includes("instagram.com/")) {
      return {
        platform: "instagram",
        username: url
          .split("instagram.com/")[1]
          .replace(/^@/, "")
          .replace(/\/.*$/, ""),
      };
    }
    return null;
  })
  .filter(Boolean);


  setSocialInputs(parsedSocials);

  setEditForm({
    organization: s.organization || "",
    contact_name: s.contact_name || "",
    email: s.email || "",
    phone: s.phone || "",
    tier: s.tier || "",
    wants_booth:
      s.wants_booth === true ||
      s.wants_booth === 1 ||
      s.wants_booth === "1" ||
      s.wants_booth === "true",
    status: s.status || "pending",
    website: s.website || "",
    social_links: s.social_links || "",
    message: s.message || "",
    logo_url: s.logo_url || "",
      additional_notes: s.additional_notes || "", 
  });
};

const filteredSponsors = sponsors.filter((s) => {
  const q = searchTerm.toLowerCase();

  const matchesSearch =
    (s.organization || "").toLowerCase().includes(q) ||
    (s.contact_name || "").toLowerCase().includes(q) ||
    (s.email || "").toLowerCase().includes(q) ||
    (s.tier || "").toLowerCase().includes(q) ||
    (s.status || "").toLowerCase().includes(q);

  const matchesStatus =
    statusFilter === "all" ||
    (s.status || "") === statusFilter;

  return matchesSearch && matchesStatus;
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
const social_links = socialInputs
  .filter((s) => s.username)
  .map(
    (s) => `${SOCIAL_OPTIONS[s.platform]}${s.username}`
  )
  .join(",");

const payload = {
  ...editForm,
  social_links,
    additional_notes: editForm.additional_notes?.trim() || null, // ⭐ NEW

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
<div className="flex flex-col sm:flex-row gap-3">
  <input
    type="text"
    placeholder="🔍 Search sponsors by name, email, tier, or status…"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="
      w-full sm:w-1/2
      p-3 rounded-xl
      bg-black/40 border border-yellow-500/40
      text-yellow-100
      placeholder-yellow-300/60
      focus:outline-none focus:border-yellow-400
    "
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="
      w-full sm:w-1/4
      p-3 rounded-xl
      bg-black/40 border border-yellow-500/40
      text-yellow-100
    "
  >
    <option value="all">All Statuses</option>
    {STATUS_OPTIONS.map((opt) => (
      <option key={opt} value={opt} className="text-black">
        {opt.toUpperCase()}
      </option>
    ))}
  </select>
</div>


    {sponsors.length === 0 ? (
      <p className="text-yellow-200 italic">
        No sponsor inquiries yet.
      </p>
    ) : (
      <div className="grid  sm:grid-cols-2 gap-6">
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
{/* Social Media */}
  <label className="font-bold text-yellow-300">
    Social Media
  </label>
<div className="space-y-2">


  {socialInputs.map((item, idx) => (
    <div key={idx} className="flex gap-2">
      <select
        value={item.platform}
        disabled
        className="p-2 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
      >
        <option value={item.platform}>
          {item.platform.toUpperCase()}
        </option>
      </select>

      <div className="flex-1 flex items-center gap-1">
        <span className="text-xs text-yellow-300">
          {SOCIAL_OPTIONS[item.platform]}
        </span>
        <input
          value={item.username}
          onChange={(e) => {
            const updated = [...socialInputs];
            updated[idx].username = e.target.value;
            setSocialInputs(updated);
          }}
          placeholder="username"
          className="flex-1 p-2 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
        />
      </div>

      <button
        onClick={() =>
          setSocialInputs(
            socialInputs.filter((_, i) => i !== idx)
          )
        }
        className="px-3 rounded-xl bg-red-600 text-white font-bold"
      >
        ✕
      </button>
    </div>
  ))}

  {/* Add Social Media */}
  {Object.keys(SOCIAL_OPTIONS)
    .filter(
      (p) => !socialInputs.some((s) => s.platform === p)
    )
    .map((platform) => (
      <button
        key={platform}
        onClick={() =>
          setSocialInputs([
            ...socialInputs,
            { platform, username: "" },
          ])
        }
        className="text-sm ml-2 underline text-yellow-300 hover:text-yellow-200"
      >
         &nbsp; Add {platform.toUpperCase()}
      </button>
    ))}
</div>

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
{/* Additional Notes */}
<textarea
  value={editForm.additional_notes || ""}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      additional_notes: e.target.value,
    })
  }
  placeholder="Additional Notes"
  rows={3}
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
            /* ===== VIEW MODE ===== */
<div className="space-y-3 text-sm text-yellow-200">

  {/* Logo */}
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

  {/* Organization */}
  <h3 className="text-xl font-serif font-bold text-yellow-300 text-center border-b border-yellow-400 pb-1">
    {s.organization}
  </h3>

  {/* Contact */}
  <div className="text-center space-y-1">
    <p>{s.contact_name}</p>
    <p className="text-yellow-300">{s.email}</p>
    {s.phone && <p>{s.phone}</p>}
  </div>

  {/* Status */}
  <div className="flex justify-center">
    <span
      className={`
        px-3 py-1 text-xs font-bold rounded-full
        uppercase tracking-wide border
        ${
          statusColors[s.status] ||
          "bg-yellow-400/20 border-yellow-400 text-yellow-200"
        }
      `}
    >
      {s.status || "pending"}
    </span>
  </div>

  {/* Info Grid */}
  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mt-2">
    <p><strong>Tier:</strong> {s.tier || "—"}</p>
    <p>
      <strong>Booth:</strong>{" "}
      {s.wants_booth ? "Yes" : "No"}
    </p>
  </div>


  {/* Message */}
  {s.message && (
    <div className="mt-2 p-3 bg-black/40 rounded-xl text-xs leading-relaxed max-h-32 overflow-auto">
      {s.message}
    </div>
  )}
{s.additional_notes && (
  <div className="mt-2 p-2 bg-black/40 rounded-xl text-xs leading-relaxed max-h-20 overflow-auto">
    <strong>Notes:</strong> {s.additional_notes}
  </div>
)}

  {/* Actions */}
  <div className="flex gap-3 pt-3">
    <button
      onClick={(e) => {
        e.stopPropagation();
        openEdit(s);
      }}
      className="flex-1 rounded-xl bg-blue-500 text-white font-bold py-2"
    >
      Edit
    </button>

    <button
      onClick={(e) => {
        e.stopPropagation();
        deleteSponsor(s.id);
      }}
      className="flex-1 rounded-xl bg-red-600 text-white font-bold py-2"
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
{selectedSponsor.additional_notes && (
  <div className="mt-4 p-3 bg-black/40 rounded-xl text-yellow-200">
    <strong>Additional Notes:</strong>
    <br />
    {selectedSponsor.additional_notes}
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
