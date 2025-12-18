import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ManageSubscribers({ prideId }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState("all");
  const [search, setSearch] = useState("");

  const API = `https://singspacebackend.onrender.com/api/pride/${prideId}`;

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const url = `${API}/subscriptions${search ? `?email=${search}` : ""}`;
      const res = await axios.get(url);
      setSubs(res.data);
    } catch {
      setSubs([]);
    }
    setLoading(false);
  };

  const deleteSub = async (id) => {
    if (!window.confirm("Delete this subscriber permanently?")) return;
    try {
      await axios.delete(`${API}/subscription/${id}`);
      fetchSubscribers();
    } catch {}
  };

  const toggleStatus = async (sub) => {
    try {
      if (sub.is_active) {
        await axios.patch(`${API}/unsubscribe-email`, { email: sub.email });
      } else {
        await axios.post(`${API}/subscribe`, {
          first_name: sub.first_name,
          last_name: sub.last_name,
          email: sub.email,
          subscription_types: sub.subscription_types,
        });
      }
      fetchSubscribers();
    } catch {}
  };

  useEffect(() => {
    fetchSubscribers();
  }, [search]);

  const filtered =
    filterActive === "active"
      ? subs.filter(s => s.is_active)
      : filterActive === "inactive"
      ? subs.filter(s => !s.is_active)
      : subs;

  return (
    <div className="mt-10 max-w-6xl mx-auto text-white">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-extrabold text-yellow-300 mb-6"
      >
        Email Subscribers 📧
      </motion.h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or name..."
          className="p-3 bg-white/10 border border-yellow-400/30 text-yellow-50 placeholder-yellow-200/40 outline-none w-full sm:w-80"
        />

        <select
          className="p-3 bg-black border border-yellow-300 text-yellow-200 cursor-pointer"
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
        >
          <option value="all">All Subscribers</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-yellow-200 font-semibold">Loading subscribers...</p>
      ) : filtered.length === 0 ? (
        <p className="text-yellow-200 font-semibold">No subscribers.</p>
      ) : (
        <div className="overflow-auto rounded border border-white/10">
          <table className="w-full text-sm bg-black/40">
            <thead className="bg-white/10 border-b border-white/10 text-yellow-200 font-bold">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Type(s)</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-3 font-semibold">
                    {s.first_name} {s.last_name}
                  </td>

                  <td className="p-3">{s.email}</td>

                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {s.subscription_types.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 bg-white/10 text-xs rounded border border-yellow-300/30"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-3">
                    {s.is_active ? (
                      <span className="text-green-400 font-bold">Active</span>
                    ) : (
                      <span className="text-red-400 font-bold">Inactive</span>
                    )}
                  </td>

                  <td className="p-3 text-right flex justify-end gap-2">

                    {/* Toggle Status */}
                    <button
                      onClick={() => toggleStatus(s)}
                      className={`px-2 py-1 text-xs font-bold border ${
                        s.is_active
                          ? "bg-red-500 hover:bg-red-600 border-red-700"
                          : "bg-green-500 hover:bg-green-600 border-green-700"
                      }`}
                    >
                      {s.is_active ? "Deactivate" : "Reactivate"}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteSub(s.id)}
                      className="px-2 py-1 text-xs font-bold bg-black border border-red-500 hover:bg-red-900"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
