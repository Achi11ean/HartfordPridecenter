// Staff.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = "https://singspacebackend.onrender.com";

export default function Staff() {
  const token = localStorage.getItem("prideToken");
  const admin = JSON.parse(localStorage.getItem("prideUser") || "{}");
  const prideId = admin.pride_id;

  const [staff, setStaff] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(
        `${API}/api/pride/${prideId}/staff`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStaff(res.data || []);
    } catch (err) {
      toast.error("Failed to load staff");
    }
  };

  const saveEdit = async () => {
    try {
      await axios.patch(
        `${API}/api/pride-staff/${editing.id}`,
        editing,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Staff updated");
      setEditing(null);
      fetchStaff();
    } catch (err) {
      toast.error("Failed to update staff");
    }
  };

  const deactivateStaff = async (id) => {
    if (!window.confirm("Deactivate this staff member?")) return;

    try {
      await axios.patch(
        `${API}/api/pride-staff/${id}`,
        { is_active: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Staff deactivated");
      fetchStaff();
    } catch (err) {
      toast.error("Failed to deactivate staff");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-yellow-300">
        👥 Pride Staff
      </h2>

      {staff.length === 0 && (
        <p className="italic text-yellow-200">No staff found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staff.map((s) => (
          <div
            key={s.id}
            className="bg-black/60 border border-yellow-500/30 rounded-2xl p-5 shadow-xl"
          >
            <h3 className="text-xl font-bold text-yellow-300">
              {s.first_name} {s.last_name}
            </h3>

            <p className="text-yellow-200">{s.role}</p>

            {s.bio && (
              <p className="text-sm text-yellow-100 italic mt-2">
                “{s.bio}”
              </p>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setEditing({ ...s })}
                className="px-4 py-1 rounded-lg bg-yellow-400 text-black font-bold"
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => deactivateStaff(s.id)}
                className="px-4 py-1 rounded-lg bg-red-600 text-white font-bold"
              >
                🗑️ Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✏️ Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black border border-yellow-500 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">
              Edit Staff
            </h3>

            {[
              ["first_name", "First Name"],
              ["last_name", "Last Name"],
              ["role", "Role"],
              ["username", "Username"],
              ["pin", "PIN"],
            ].map(([field, label]) => (
              <input
                key={field}
                value={editing[field] || ""}
                onChange={(e) =>
                  setEditing({ ...editing, [field]: e.target.value })
                }
                placeholder={label}
                className="w-full mb-3 p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
              />
            ))}

            <textarea
              value={editing.bio || ""}
              onChange={(e) =>
                setEditing({ ...editing, bio: e.target.value })
              }
              placeholder="Bio"
              className="w-full h-28 p-3 rounded-xl bg-black/40 border border-yellow-500/40 text-yellow-100"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
