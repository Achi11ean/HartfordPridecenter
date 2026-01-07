import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_BASE = "https://singspacebackend.onrender.com";

export default function CommitteeServices({ committeeId }) {
  const { prideId, token, isAdmin } = useAuth();

  const [allServices, setAllServices] = useState([]);
  const [committeeServices, setCommitteeServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all services for this Pride
  useEffect(() => {
    if (!prideId) return;

    const fetchServices = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/pride/${prideId}/services`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllServices(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load services");
      }
    };

    fetchServices();
  }, [prideId, token]);

  // Fetch services already attached to this committee
  useEffect(() => {
    if (!committeeId) return;

    const fetchCommitteeServices = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/pride-committees/${committeeId}/services`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCommitteeServices(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load committee services");
      }
    };

    fetchCommitteeServices();
  }, [committeeId, token]);

  if (!isAdmin) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
        Only Pride admins can manage committee services.
      </div>
    );
  }

  const handleAddService = async () => {
    if (!selectedServiceId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${API_BASE}/api/pride-committees/${committeeId}/services`,
        { service_id: Number(selectedServiceId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommitteeServices((prev) => [...prev, res.data.service]);
      setSelectedServiceId("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveService = async (serviceId) => {
    const link = committeeServices.find((s) => s.id === serviceId);
    if (!link) return;

    try {
      await axios.delete(
        `${API_BASE}/api/pride-committees/services/${link.link_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommitteeServices((prev) => prev.filter((s) => s.id !== serviceId));
    } catch (err) {
      console.error(err);
      setError("Failed to remove service");
    }
  };

  const availableServices = allServices.filter(
    (s) => !committeeServices.some((cs) => cs.id === s.id)
  );

  return (
    <div className="bg-black/50 border border-yellow-500/30 rounded p-4 space-y-4">
      <h4 className="text-lg font-bold text-yellow-300">🧩 Committee Services</h4>

      {error && (
        <div className="p-2 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add Service */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="flex-1 p-2 rounded bg-black text-yellow-200 border border-yellow-500/40"
        >
          <option value="">-- Select Service --</option>
          {availableServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddService}
          disabled={loading || !selectedServiceId}
          className="px-4 py-2 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-300 disabled:opacity-50"
        >
          Add Service
        </button>
      </div>

      {/* Existing Services */}
      {committeeServices.length > 0 ? (
        <ul className="space-y-2">
          {committeeServices.map((service) => (
            <li
              key={service.id}
              className="flex justify-between items-center bg-black/40 border border-yellow-500/30 rounded px-3 py-2"
            >
              <span className="text-yellow-200">{service.title}</span>
              <button
                onClick={() => handleRemoveService(service.id)}
                className="text-red-400 hover:text-red-300 font-bold"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-yellow-200 italic">No services added yet.</p>
      )}
    </div>
  );
}
