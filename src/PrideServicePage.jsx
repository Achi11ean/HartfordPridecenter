import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;

export default function PrideServicePage() {
  const { slug } = useParams();

  const [service, setService] = useState(null);
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
const [funders, setFunders] = useState([]);
/* ---------------- FETCH FUNDERS ---------------- */
useEffect(() => {
  if (!service?.id) return;

  axios
    .get(`${API}/api/pride-services/${service.id}/funders`)
    .then((res) => setFunders(res.data || []))
    .catch(() => setFunders([]));
}, [service]);

  /* ---------------- FETCH SERVICE ---------------- */
  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    axios
      .get(`${API}/api/pride/${PRIDE_ID}/services/${slug}`)
      .then((res) => {
        setService(res.data);
      })
      .catch(() => {
        setService(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  /* ---------------- FETCH COMMITTEES ---------------- */
  useEffect(() => {
    if (!service?.id) return;

    axios
      .get(`${API}/api/pride-services/${service.id}/committees`)
      .then((res) => setCommittees(res.data || []))
      .catch(() => setCommittees([]));
  }, [service]);

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-white animate-pulse">
        Loading service…
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-bold text-red-300 mb-4">
          Service Not Found
        </h2>
        <Link
          to="/services"
          className="px-6 py-3 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  /* ---------------- PAGE ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 text-white">

      {/* ================= HERO ================= */}
      <section className="relative h-[55vh] w-full overflow-hidden">
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-700" />
        )}

        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="relative z-10 h-full flex items-end pb-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-5xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black drop-shadow-2xl">
              {service.title}
            </h1>
            <p className="mt-6 text-lg md:text-2xl text-white/90 font-semibold max-w-3xl mx-auto">
              Building support, connection, and pride in our community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-5xl mx-auto px-6 py-20 space-y-14">
{/* ================= FUNDER CARDS ================= */}
{funders.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="
      bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20
      border border-emerald-400/40
      rounded-3xl p-6 md:p-8
      shadow-xl backdrop-blur-md
    "
  >
    <h3 className="text-2xl font-black text-emerald-300 mb-6 text-center">
      💚 Funded By
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {funders.map((f) => (
        <motion.div
          key={f.id}
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="
            bg-black/70 border border-white/20 rounded-2xl
            overflow-hidden shadow-lg
            flex flex-col
          "
        >
          {/* LOGO AREA */}
          <div className="
            h-32 bg-gradient-to-br from-white/90 to-white/70
            flex items-center justify-center p-4
          ">
            {f.logo_url ? (
              <img
                src={f.logo_url}
                alt={f.organization_name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-black font-black text-lg text-center px-4">
                {f.organization_name}
              </span>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-4 flex-1 flex flex-col justify-between text-center">
            <p className="font-bold text-white text-lg mb-3">
              {f.organization_name}
            </p>

            {f.website_url && (
              <a
                href={f.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-auto inline-block
                  px-4 py-2 rounded-lg
                  bg-emerald-400 text-black font-bold
                  hover:bg-emerald-300 transition
                "
              >
                🌐 Visit Website
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
)}


        {/* DESCRIPTION */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-black/60 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-md"
        >
            
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-6">
            About This Service
          </h2>
          <p className="text-lg leading-relaxed whitespace-pre-line text-white/90">
            {service.description}
          </p>
        </motion.div>

        {/* CONTACT + COMMITTEE */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >

          {/* CONTACT */}
          <div className="bg-gradient-to-br from-yellow-300 via-amber-300 to-yellow-400 text-black rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-black mb-4">📞 Point of Contact</h3>
            <p className="text-lg font-semibold">{service.contact_name}</p>
            <p className="mt-2 font-medium">{service.contact_email}</p>
          </div>

          {/* COMMITTEES */}
          {committees.length > 0 && (
            <div className="bg-black/70 border border-indigo-400/40 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-black text-indigo-300 mb-4">
                🧩 Managed By {committees.length > 1 ? "Committees" : "Committee"}
              </h3>

              <div className="space-y-4">
                {committees.map((c) => (
                  <div
                    key={c.id}
                    className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-white/20 rounded-xl p-4"
                  >
                    <p className="text-lg font-bold text-white">{c.name}</p>

                    {c.mission_statement && (
                      <p className="text-sm text-white/80 mt-1">
                        {c.mission_statement}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ACTIONS */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {service.service_url && (
            <a
              href={service.service_url}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:brightness-110 transition text-center"
            >
              Visit Official Service Page
            </a>
          )}

          <Link
            to="/contact"
            className="px-6 py-4 rounded-xl font-bold text-lg bg-yellow-400 text-black hover:bg-yellow-300 transition text-center"
          >
            Contact Pride Center
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <div className="text-center pb-24 px-6">
        <p className="text-2xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          “Visibility is power. Community is strength.”
        </p>
        <p className="mt-3 text-white/70 font-semibold">
          Thank you for supporting Pride services.
        </p>
      </div>
    </div>
  );
}
