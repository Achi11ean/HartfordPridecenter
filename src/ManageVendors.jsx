import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";

// 🔐 Cloudinary
const CLOUD_NAME = "dincfzdau";
const UPLOAD_PRESET = "pridecenters";

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
const cycleStatus = async (vendor) => {
  const currentIndex = STATUS_OPTIONS.indexOf(vendor.status);
  const nextIndex = (currentIndex + 1) % STATUS_OPTIONS.length;
  const nextStatus = STATUS_OPTIONS[nextIndex];

  try {
    await axios.patch(
      `${API}/api/pride-vendors/${vendor.id}`,
      { status: nextStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔥 Optimistic UI update (instant feel)
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendor.id ? { ...v, status: nextStatus } : v
      )
    );

    toast.success(`Status → ${nextStatus}`);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update status");
  }
};
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
setEditForm({
  ...vendor,
  websites: vendor.websites?.length
    ? vendor.websites
    : [""],
  socials: vendor.socials?.length
    ? vendor.socials
    : [""],
});  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };
const updateListItem = (type, index, value) => {
  setEditForm((prev) => {
    const updated = [...(prev[type] || [])];
    updated[index] = value;
    return { ...prev, [type]: updated };
  });
};

const addListItem = (type) => {
  setEditForm((prev) => ({
    ...prev,
    [type]: [...(prev[type] || []), ""],
  }));
};

const removeListItem = (type, index) => {
  setEditForm((prev) => ({
    ...prev,
    [type]: (prev[type] || []).filter((_, i) => i !== index),
  }));
};
  const saveEdit = async (id) => {
    try {
     await axios.patch(
  `${API}/api/pride-vendors/${id}`,
  {
    ...editForm,

    website_url: (editForm.websites || [])
      .filter((w) => w && w.trim())
      .join(","),

    social_links: (editForm.socials || [])
      .filter((s) => s && s.trim())
      .join(","),

    start_time: editForm.start_time || null,
    end_time: editForm.end_time || null,
  },
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
 
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

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
     <div className="space-y-2">
  <label className="text-sm font-bold text-yellow-200">
    🌐 Websites
  </label>

  {(editForm.websites || []).map((site, i) => (
    <div key={i} className="flex gap-2">
      <input
        value={site}
        onChange={(e) =>
          updateListItem("websites", i, e.target.value)
        }
        className="flex-1 px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
      />

      {(editForm.websites || []).length > 1 && (
        <button
          type="button"
          onClick={() => removeListItem("websites", i)}
          className="px-3 bg-red-600 text-white rounded"
        >
          ✕
        </button>
      )}
    </div>
  ))}

  <button
    type="button"
    onClick={() => addListItem("websites")}
    className="text-xs text-yellow-300 hover:underline"
  >
    ➕ Add Website
  </button>
</div>
<div className="space-y-2">
  <label className="text-sm font-bold text-yellow-200">
    📱 Social Links
  </label>

  {(editForm.socials || []).map((social, i) => (
    <div key={i} className="flex gap-2">
      <input
        value={social}
        onChange={(e) =>
          updateListItem("socials", i, e.target.value)
        }
        className="flex-1 px-3 py-2 bg-black border border-yellow-400 text-yellow-100 rounded"
      />

      {(editForm.socials || []).length > 1 && (
        <button
          type="button"
          onClick={() => removeListItem("socials", i)}
          className="px-3 bg-red-600 text-white rounded"
        >
          ✕
        </button>
      )}
    </div>
  ))}

  <button
    type="button"
    onClick={() => addListItem("socials")}
    className="text-xs text-yellow-300 hover:underline"
  >
    ➕ Add Social
  </button>
</div>
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
           <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-4 items-start">

  {/* 🖼 IMAGE (CONTAINED, NOT CROPPED) */}
  {v.image_url && (
    <div className="
      w-full md:w-[120px]
      h-[100px]
      bg-black/40
      border border-yellow-400/20
      rounded-xl
      flex items-center justify-center
      p-2
    ">
      <img
        src={v.image_url}
        alt={v.company_name}
        className="
          max-h-full max-w-full
          object-contain
        "
      />
    </div>
  )}

  {/* 📋 MAIN INFO */}
  <div className="space-y-2 min-w-0">

    {/* HEADER */}
    <div>
      <h3 className="
        text-lg sm:text-xl font-extrabold
        text-yellow-300 tracking-wide
        truncate
      ">
        {v.company_name}
      </h3>

      <p className="text-sm text-yellow-100/80">
        {v.vendor_type}
      </p>
    </div>

    {/* CONTACT */}
    <div className="
      text-xs text-yellow-200/90
      bg-black/30 border border-yellow-400/10
      rounded-lg px-3 py-2
    ">
      <strong className="text-yellow-300">Contact:</strong>{" "}
      {v.contact_name}
      {v.contact_email && (
        <>
          {" "}·{" "}
          <a
            href={`mailto:${v.contact_email}`}
            className="underline hover:text-yellow-300"
          >
            {v.contact_email}
          </a>
        </>
      )}
    </div>

    {/* LINKS */}
    <div className="flex flex-wrap gap-2">

      {v.websites?.map((site, i) => (
        <a
          key={i}
          href={site}
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-xs px-3 py-1 rounded-full
            bg-blue-500/20 text-blue-200
            border border-blue-400/30
            hover:bg-blue-500/30
            transition
            whitespace-nowrap
          "
        >
          🌐 Website
        </a>
      ))}

      {v.socials?.map((social, i) => (
        <a
          key={i}
          href={social}
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-xs px-3 py-1 rounded-full
            bg-pink-500/20 text-pink-200
            border border-pink-400/30
            hover:bg-pink-500/30
            transition
            whitespace-nowrap
          "
        >
          📱 Social
        </a>
      ))}

    </div>

    {/* STATUS */}
    <button
      onClick={() => cycleStatus(v)}
      className={`
        w-fit px-4 py-1.5 rounded-full text-xs font-bold border
        transition-all duration-200 hover:scale-105

        ${v.status === "pending" && "bg-yellow-400/20 border-yellow-400 text-yellow-200"}
        ${v.status === "approved" && "bg-green-500/20 border-green-400 text-green-200"}
        ${v.status === "confirmed" && "bg-blue-500/20 border-blue-400 text-blue-200"}
        ${v.status === "declined" && "bg-red-500/20 border-red-400 text-red-200"}
        ${v.status === "cancelled" && "bg-gray-500/20 border-gray-400 text-gray-200"}
      `}
      title="Click to change status"
    >
      {v.status}
    </button>

  </div>

  {/* ⚙️ ACTIONS */}
  <div className="
    flex md:flex-col gap-2
    justify-start md:justify-between
  ">
    <button
      onClick={() => startEdit(v)}
      className="
        px-4 py-2 rounded-lg
        bg-gradient-to-br from-yellow-400 to-yellow-500
        text-black font-bold
        shadow-md
        hover:scale-105 transition
      "
    >
      Edit
    </button>

    <button
      onClick={() => deleteVendor(v.id)}
      className="
        px-4 py-2 rounded-lg
        bg-gradient-to-br from-red-500 to-red-600
        text-white font-bold
        shadow-md
        hover:scale-105 transition
      "
    >
      Delete
    </button>
  </div>

</div>
          )}
          
        </div>
        
      ))}

          </div>
    </div>
  );
}
