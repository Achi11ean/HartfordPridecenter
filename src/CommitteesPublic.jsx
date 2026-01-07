import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;

export default function CommitteesPublic() {
  const [committees, setCommittees] = useState([]);
  const [activeCommittee, setActiveCommittee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servicesById, setServicesById] = useState({});
const [activeService, setActiveService] = useState(null);


  const [adminsById, setAdminsById] = useState({});
  const [staffById, setStaffById] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
       const [
  committeesRes,
  adminsRes,
  staffRes,
  servicesRes
] = await Promise.all([
  axios.get(`${API_BASE}/api/pride-committees/pride/${PRIDE_ID}`),
  axios.get(`${API_BASE}/api/pride/${PRIDE_ID}/admins`),
  axios.get(`${API_BASE}/api/pride-staff`),
  axios.get(`${API_BASE}/api/pride/${PRIDE_ID}/services`)
]);


        setCommittees(committeesRes.data || []);
const serviceMap = {};
servicesRes.data.forEach(s => {
  serviceMap[s.id] = s;
});
setServicesById(serviceMap);

        const adminMap = {};
        adminsRes.data.forEach(a => (adminMap[a.id] = a));
        setAdminsById(adminMap);

        const staffMap = {};
        staffRes.data
          .filter(s => s.pride_id === PRIDE_ID)
          .forEach(s => (staffMap[s.id] = s));
        setStaffById(staffMap);

      } catch (err) {
        console.error(err);
        setError("Failed to load committees");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return <div className="text-center text-blue-200">Loading committees…</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-2">
      <h1 className="text-4xl font-extrabold text-center text-white mb-12">
        Our Committees
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {committees.map((committee) => (
          <div
            key={committee.id}
            className="bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]
                       border border-white rounded-xl shadow-xl p-6
                       flex flex-col justify-between"
          >
            <div>
              <h2 className="text-6xl border-b font-bold font-[Aspire] text-blue-300 mb-2">
                {committee.name}
              </h2>

              <p className="text-blue-200 italic">
                {committee.mission_statement}
              </p>

              {committee.contact_email && (
                <p className="text-blue-100 text-sm mt-3">
                  📧 {committee.contact_email}
                </p>
              )}
            </div>

            <button
              onClick={() => setActiveCommittee(committee)}
              className="mt-6 px-4 py-2 rounded-lg
                         bg-blue-500 text-white font-bold
                         hover:bg-blue-400 transition"
            >
              View Committee
            </button>
          </div>
        ))}
      </div>

      {/* 🔵 MODAL */}
 {activeCommittee && (
  <CommitteeModal
    committee={activeCommittee}
    adminsById={adminsById}
    staffById={staffById}
    servicesById={servicesById}
    onServiceClick={setActiveService}
    onClose={() => setActiveCommittee(null)}
  />
)}

{activeService && (
  <ServiceModal
    service={activeService}
    onClose={() => setActiveService(null)}
  />
)}

    </div>
  );
}

/* ───────────────────────────────────────────── */

function CommitteeModal({
  committee,
  adminsById,
  staffById,
  servicesById,
  onServiceClick,
  onClose
}) {
  const [members, setMembers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [membersRes, servicesRes] = await Promise.all([
          axios.get(`${API_BASE}/api/pride-committees/${committee.id}/members`),
          axios.get(`${API_BASE}/api/pride-committees/${committee.id}/services`)
        ]);

        setMembers(membersRes.data || []);
        setServices(servicesRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [committee.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-w-2xl w-full mx-4
                      bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]
                      border border-blue-500/40 rounded-2xl shadow-2xl
                      p-8 text-blue-100 max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-300 text-2xl hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-3xl font-extrabold text-blue-300 mb-4">
          {committee.name}
        </h2>

        <p className="italic text-blue-200 mb-4">
          {committee.mission_statement}
        </p>

        {committee.details && (
          <div className="mb-6">
            <h4 className="font-bold text-blue-300 mb-1">About</h4>
            <p>{committee.details}</p>
          </div>
        )}

        {loading ? (
          <p className="italic text-blue-200">Loading details…</p>
        ) : (
          <>
            {members.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-blue-300 mb-2">Members</h4>
                <ul className="space-y-1">
                  {members.map(m => {
                    const name =
                      m.member_type === "admin"
                        ? adminsById[m.member_id]?.name
                        : `${staffById[m.member_id]?.first_name || ""} ${staffById[m.member_id]?.last_name || ""}`;

                    return (
                      <li key={m.id}>
                        {name}
                        {m.role_title && (
                          <span className="text-blue-300 font-semibold">
                            {" "}— {m.role_title}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {services.length > 0 && (
              <div>
                <h4 className="font-bold text-blue-300 mb-2">Services</h4>
                <ul className="list-disc list-inside space-y-1">
             {services.map(s => (
  <li
    key={s.id}
    onClick={() => {
      const fullService = servicesById[s.id];
      if (fullService) {
        onServiceClick(fullService);
      } else {
        console.warn("Service not found:", s.id);
      }
    }}
    className="
      cursor-pointer text-blue-200 hover:text-blue-400
      underline underline-offset-2 transition
    "
  >
    {s.title}
  </li>
))}


                </ul>
              </div>
            )}
          </>
        )}
      </div>


    </div>
    
  );
}
function ServiceModal({ service, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="
        relative z-10 max-w-xl w-full mx-4
        bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]
        border border-blue-500/40 rounded-2xl shadow-2xl
        p-8 text-blue-100
      ">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-300 text-2xl hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-3xl font-extrabold text-blue-300 mb-3">
          {service.title}
        </h2>

        {service.image_url && (
          <img
            src={service.image_url}
            alt={service.title}
            className="w-full rounded-xl mb-4 shadow-lg"
          />
        )}

        <p className="mb-4 text-blue-100 leading-relaxed">
          {service.description}
        </p>

        <div className="space-y-1 text-sm">
          <p>
            <span className="font-semibold text-blue-300">Contact:</span>{" "}
            {service.contact_name}
          </p>
          <p>
            <span className="font-semibold text-blue-300">Email:</span>{" "}
            <a
              href={`mailto:${service.contact_email}`}
              className="underline hover:text-blue-400"
            >
              {service.contact_email}
            </a>
          </p>
        </div>

        {(service.service_url || service.url) && (
          <div className="mt-4 flex gap-4 flex-wrap">
            {service.service_url && (
              <a
                href={service.service_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-400"
              >
                Visit Service
              </a>
            )}
            {service.url && (
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-blue-400 text-blue-200 hover:bg-blue-900/40"
              >
                Learn More
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
