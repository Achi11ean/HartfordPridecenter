import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import AddMember from "./AddMember";
import CommitteeServices from "./CommitteeServices";
const API_BASE = "https://singspacebackend.onrender.com";

export default function ManageCommittee() {
  const { prideId, token, isAdmin } = useAuth();

  const [committees, setCommittees] = useState([]);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!prideId) return;

    const fetchCommittees = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE}/api/pride-committees/pride/${prideId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCommittees(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load committees");
      } finally {
        setLoading(false);
      }
    };

    fetchCommittees();
  }, [prideId, token]);

  if (!isAdmin) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
        Only Pride admins can manage committees.
      </div>
    );
  }

  if (loading) {
    return <div className="text-yellow-200">Loading committees…</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-yellow-300">
        🛠 Manage Committees
      </h2>

      {/* Committee Selector */}
      <div className="bg-black/50 border border-yellow-500/30 rounded p-4">
        <label className="block text-sm font-semibold mb-2 text-yellow-200">
          Select a Committee
        </label>
        <select
          value={selectedCommittee?.id || ""}
          onChange={(e) => {
            const committee = committees.find(
              (c) => c.id === Number(e.target.value)
            );
            setSelectedCommittee(committee || null);
          }}
          className="w-full p-2 rounded bg-black text-yellow-200 border border-yellow-500/40"
        >
          <option value="">-- Choose Committee --</option>
          {committees.map((committee) => (
            <option key={committee.id} value={committee.id}>
              {committee.name}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Committee Info */}
      {selectedCommittee && (
        <div className="space-y-6">
          <div className="bg-black/40 border border-yellow-500/30 p-4 rounded">
            <h3 className="text-xl font-bold text-yellow-300">
              {selectedCommittee.name}
            </h3>
            <p className="text-yellow-200 mt-2 italic">
              {selectedCommittee.mission_statement}
            </p>
            {selectedCommittee.details && (
              <p className="text-yellow-100 mt-2">
                {selectedCommittee.details}
              </p>
            )}
          </div>

          {/* Add Member Component */}
          <AddMember
            committeeId={selectedCommittee.id}
            onMemberAdded={() => {
              // Optional future refresh hook
            }}
          />
          <CommitteeServices committeeId={selectedCommittee.id} />
        </div>
      )}
    </div>
  );
}
