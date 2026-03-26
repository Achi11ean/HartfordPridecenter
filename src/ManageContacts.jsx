import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const API = "https://singspacebackend.onrender.com";

const STATUS_OPTIONS = [
  "new",
  "contacted",
  "in_progress",
  "resolved",
  "closed",
  "flagged",
];

export default function ManageContacts() {
  const { token, prideId } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // ───────────────────────────────
  // Fetch contacts
  // ───────────────────────────────
  const fetchContacts = async () => {
    try {
      const res = await axios.get(
        `${API}/api/pride/${prideId}/contacts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContacts(res.data || []);
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line
  }, [prideId]);

  // ───────────────────────────────
  // Edit handlers
  // ───────────────────────────────
  const startEdit = (contact) => {
    setEditingId(contact.id);
    setEditForm({ ...contact });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      await axios.patch(
        `${API}/api/pride/contact/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Contact updated");
      setEditingId(null);
      fetchContacts();
    } catch {
      toast.error("Failed to update contact");
    }
  };

  // ───────────────────────────────
  // Status-only update
  // ───────────────────────────────
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${API}/api/pride/contacts/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchContacts();
    } catch {
      toast.error("Failed to update status");
    }
  };
console.log("AUTH prideId:", prideId);

  // ───────────────────────────────
  // Delete
  // ───────────────────────────────
  const deleteContact = async (id) => {
    if (!window.confirm("Delete this contact permanently?")) return;

    try {
      await axios.delete(
        `${API}/api/pride/contact/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Contact deleted");
      fetchContacts();
    } catch {
      toast.error("Failed to delete contact");
    }
  };

  if (loading) {
    return <p className="text-yellow-200 italic">Loading contacts…</p>;
  }

  return (
  <div className="w-full space-y-4">

    {contacts.length === 0 && (
      <p className="text-yellow-200 italic text-center">
        No contact submissions yet.
      </p>
    )}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

    {contacts.map((c) => (
      <div
        key={c.id}
        className="
          bg-gradient-to-br from-black/70 via-slate-900/80 to-black/70
          border border-yellow-400/20
          rounded-2xl p-5
          shadow-[0_10px_40px_rgba(0,0,0,0.6)]
          backdrop-blur-xl
          transition-all duration-300
          hover:shadow-yellow-400/10
        "
      >

        {editingId === c.id ? (
          <>
            {/* 🔥 EDIT GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">

              <input
                className="input-pro"
                value={editForm.name || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Name"
              />

              <input
                className="input-pro"
                value={editForm.email || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="Email"
              />

              <input
                className="input-pro"
                value={editForm.phone || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                placeholder="Phone"
              />

              <select
                className="input-pro"
                value={editForm.status || "new"}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>

              {/* MESSAGE FULL WIDTH */}
              <textarea
                className="input-pro sm:col-span-2 min-h-[120px]"
                value={editForm.message || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, message: e.target.value })
                }
                placeholder="Message"
              />

            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => saveEdit(c.id)}
                className="
                  px-4 py-2 rounded-xl font-bold
                  bg-gradient-to-r from-yellow-400 to-yellow-500
                  text-black
                  hover:scale-105 transition
                "
              >
                Save
              </button>

              <button
                onClick={cancelEdit}
                className="
                  px-4 py-2 rounded-xl
                  bg-black/60 border border-yellow-500/30
                  text-yellow-200
                "
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* 🔥 HEADER ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">

              {/* LEFT */}
              <div className="space-y-1">
                <p className="font-extrabold text-yellow-300 text-lg">
                  {c.name}
                </p>

                <p className="text-sm text-yellow-100/80">
                  {c.email}
                </p>

                {c.phone && (
                  <p className="text-sm text-yellow-100/60">
                    {c.phone}
                  </p>
                )}
              </div>

              {/* RIGHT (STATUS) */}
              <div className="flex justify-start sm:justify-end">
                <select
                  value={c.status}
                  onChange={(e) =>
                    updateStatus(c.id, e.target.value)
                  }
                  className="input-pro max-w-[180px]"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* 🔥 MESSAGE (SCROLLABLE) */}
            <div
              className="
                mt-3
                bg-black/40 border border-yellow-400/10
                rounded-xl p-3
                text-sm text-yellow-100
                max-h-[120px] overflow-y-auto
                whitespace-pre-wrap
              "
            >
              {c.message}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => startEdit(c)}
                className="
                  px-4 py-2 rounded-xl
                  bg-gradient-to-r from-yellow-300 to-yellow-400
                  text-black font-bold text-sm
                  hover:scale-105 transition
                "
              >
                Edit
              </button>

              <button
                onClick={() => deleteContact(c.id)}
                className="
                  px-4 py-2 rounded-xl
                  bg-red-500/80 text-white text-sm
                  hover:scale-105 transition
                "
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    ))}
    </div>
  </div>
);
}
