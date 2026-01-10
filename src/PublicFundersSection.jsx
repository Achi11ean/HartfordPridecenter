import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaGlobe } from "react-icons/fa";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;

export default function PublicFundersSection() {
  const [funders, setFunders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFunder, setActiveFunder] = useState(null);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API}/api/pride/${PRIDE_ID}/funders`)
      .then((res) =>
        setFunders((res.data || []).filter((f) => f.is_active))
      )
      .catch(() => setFunders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 text-center text-yellow-200 animate-pulse">
        Loading community funders…
      </section>
    );
  }

  return (
    <>
      <section className="max-w-full mx-auto  py-16">
        {/* SECTION HEADER */}


        {/* FUNDERS GRID */}
        {funders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
          >
            {funders.map((f) => (
              <motion.button
                key={f.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFunder(f)}
                className="
                  bg-black/70 border border-yellow-400/30
                  rounded-3xl overflow-hidden
                  shadow-xl flex flex-col
                  text-center
                "
              >
                {/* LOGO */}
                <div className="h-36 bg-gradient-to-br from-white/90 to-white/70 flex items-center justify-center p-5">
                  {f.logo_url ? (
                    <img
                      src={f.logo_url}
                      alt={f.organization_name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-black font-black text-center px-4">
                      {f.organization_name}
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-black mb-2 text-yellow-300">
                    {f.organization_name}
                  </h3>

                  {f.details && (
                    <p className="text-sm text-yellow-100 mb-4 line-clamp-4">
                      {f.details}
                    </p>
                  )}

                  <span className="mt-auto text-xs text-white font-semibold">
                    Click for details →
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-yellow-200 italic">
            No community funders are currently listed.
          </p>
        )}
               <div className="mt-2 text-center text-[18px] text-black">
          ← swipe to see more →
        </div>
      </section>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {activeFunder && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="
                relative max-w-2xl w-full
                bg-gradient-to-br from-black via-amber-900 to-yellow-900
                border-4 border-yellow-400
                rounded-3xl shadow-2xl
                text-yellow-100
                p-6
              "
            >
              {/* CLOSE */}
              <button
                onClick={() => setActiveFunder(null)}
                className="absolute top-3 right-3 text-yellow-300 hover:text-white transition"
              >
                <FaTimes size={22} />
              </button>

              {/* LOGO */}
              <div className="flex justify-center mb-6">
                {activeFunder.logo_url ? (
                  <img
                    src={activeFunder.logo_url}
                    alt={activeFunder.organization_name}
                    className="max-h-32 object-contain rounded-xl bg-white p-4"
                  />
                ) : (
                  <div className="px-6 py-4 bg-white text-black font-black rounded-xl">
                    {activeFunder.organization_name}
                  </div>
                )}
              </div>

              {/* NAME */}
              <h2 className="text-3xl font-black text-center mb-4">
                {activeFunder.organization_name}
              </h2>

              {/* DETAILS */}
              {activeFunder.details && (
                <div className="bg-black/50 border border-yellow-400/40 rounded-xl p-4 mb-5">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {activeFunder.details}
                  </p>
                </div>
              )}

              {/* WEBSITE */}
              {activeFunder.website_url && (
                <div className="flex justify-center">
                  <a
                    href={activeFunder.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center gap-2
                      px-4 py-2 rounded-xl
                      bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600
                      text-black font-bold
                      hover:brightness-110 transition
                    "
                  >
                    <FaGlobe /> Visit Website
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
