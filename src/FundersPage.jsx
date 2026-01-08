import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;

export default function FundersPage() {
  const [funders, setFunders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH FUNDERS ---------------- */
  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API}/api/pride/${PRIDE_ID}/funders`)
      .then((res) => {
        // only show active funders
        setFunders((res.data || []).filter((f) => f.is_active));
      })
      .catch(() => setFunders([]))
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-white animate-pulse">
        Loading funders…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-teal-950 text-white">

      {/* ================= HERO ================= */}
 <section className="relative border-b border-yellow-600 h-[55vh] w-full overflow-hidden">
  {/* BACKGROUND IMAGE */}
  <img
    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
    alt="Community Pride Support"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* COLOR WASH */}
  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/70 via-teal-600/70 to-cyan-600/70" />

  {/* DARK OVERLAY */}

  {/* BOTTOM FADE */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />

  {/* CONTENT */}
  <div className="relative z-10 h-full flex items-end pb-16 px-6">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="max-w-5xl mx-auto text-center"
    >
      <h1 className="text-5xl md:text-7xl font-black drop-shadow-2xl">
        Our Community Funders
      </h1>

      <p className="mt-6 text-lg md:text-2xl text-white/90 font-semibold max-w-3xl mx-auto">
        Thank you to the organizations whose generosity helps power
        Pride services, visibility, and community impact.
      </p>
    </motion.div>
  </div>
</section>


      {/* ================= CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-14">

        {/* FUNDERS GRID */}
        {funders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {funders.map((f) => (
              <motion.div
                key={f.id}
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="
                  bg-black/70 border border-white/20 rounded-3xl
                  overflow-hidden shadow-xl
                  flex flex-col
                "
              >
                {/* LOGO AREA */}
                <div className="
                  h-36 bg-gradient-to-br from-white/90 to-white/70
                  flex items-center justify-center p-5
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
                <div className="p-5 flex-1 flex flex-col text-center">
                  <h3 className="text-lg font-black mb-2">
                    {f.organization_name}
                  </h3>

                  {f.details && (
                    <p className="text-sm text-white/80 mb-4  overflow-y-auto max-h-[150px]">
                      {f.details}
                    </p>
                  )}

                  {f.website_url && (
                    <a
                      href={f.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        mt-auto inline-block
                        px-4 py-2 rounded-xl
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
          </motion.div>
        ) : (
          <div className="text-center text-white/70 text-xl">
            No funders are currently listed.
          </div>
        )}

        {/* CTA */}
        <div className="text-center pt-10">
          <Link
            to="/contact"
            className="
              inline-block px-8 py-4 rounded-xl
              bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400
              text-black font-black text-lg
              hover:brightness-110 transition
            "
          >
            Become a Community Funder
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <div className="text-center pb-24 px-6">
        <p className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
          “Support creates visibility. Visibility creates change.”
        </p>
        <p className="mt-3 text-white/70 font-semibold">
          We are grateful for every organization that stands with Pride.
        </p>
      </div>
    </div>
  );
}
