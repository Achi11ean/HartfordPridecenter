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
        <p className="text-yellow-200 italic">
          No contact submissions yet.
        </p>
      )}

      {contacts.map((c) => (
        <div
          key={c.id}
          className="bg-black/60 border border-yellow-500/30 rounded-2xl p-5 shadow-xl space-y-3"
        >
          {editingId === c.id ? (
            <>
              <input
                className="w-full p-2 rounded bg-black/70 border border-yellow-500/30"
                value={editForm.name || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Name"
              />

              <input
                className="w-full p-2 rounded bg-black/70 border border-yellow-500/30"
                value={editForm.email || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="Email"
              />

              <input
                className="w-full p-2 rounded bg-black/70 border border-yellow-500/30"
                value={editForm.phone || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                placeholder="Phone"
              />

              <textarea
                className="w-full p-2 rounded bg-black/70 border border-yellow-500/30 min-h-[100px]"
                value={editForm.message || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, message: e.target.value })
                }
                placeholder="Message"
              />

              <select
                className="w-full p-2 rounded bg-black/70 border border-yellow-500/30"
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

              <div className="flex gap-3">
                <button
                  onClick={() => saveEdit(c.id)}
                  className="px-4 py-2 rounded bg-yellow-400 text-black font-bold"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded bg-black/60 border border-yellow-500/30"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-bold text-yellow-300">
                    {c.name}
                  </p>
                  <p className="text-sm">{c.email}</p>
                  {c.phone && (
                    <p className="text-sm">{c.phone}</p>
                  )}
                </div>

                <select
                  value={c.status}
                  onChange={(e) =>
                    updateStatus(c.id, e.target.value)
                  }
                  className="bg-black/70 border border-yellow-500/30 rounded px-2 py-1 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-sm whitespace-pre-wrap border-l-2 border-yellow-500/40 pl-3">
                {c.message}
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => startEdit(c)}
                  className="px-3 py-1 rounded bg-yellow-300 text-black text-sm font-bold"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteContact(c.id)}
                  className="px-3 py-1 rounded bg-red-600/80 text-white text-sm"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
