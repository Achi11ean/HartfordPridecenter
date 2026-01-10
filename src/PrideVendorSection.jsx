import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaGlobe } from "react-icons/fa";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;

export default function PrideVendorsSection() {
  const [vendors, setVendors] = useState([]);
  const [activeVendor, setActiveVendor] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/api/pride/${PRIDE_ID}/vendors`)
      .then((res) =>
        setVendors(
          (res.data || []).filter(
            (v) => v.is_active && v.status !== "declined"
          )
        )
      )
      .catch((err) =>
        console.error("Error loading Pride vendors:", err)
      );
  }, []);

  if (vendors.length === 0) {
    return (
      <p className="text-center text-yellow-200 italic">
        Vendor list coming soon.
      </p>
    );
  }

  return (
    <>
      {/* ================= GRID ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-7 gap-6">
        {vendors.map((v) => (
          <motion.button
            key={v.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveVendor(v)}
            className="
              bg-black/60 border border-yellow-400/40
              rounded-2xl p-5 shadow-xl
              text-left
            "
          >
            {v.image_url ? (
              <img
                src={v.image_url}
                alt={v.company_name}
                className="h-40 w-full object-cover rounded-xl mb-3"
              />
            ) : (
              <div className="h-40 rounded-xl bg-gradient-to-br from-yellow-400/30 to-amber-600/30 flex items-center justify-center mb-3">
                <span className="text-xl font-black text-yellow-200 text-center px-4">
                  {v.company_name}
                </span>
              </div>
            )}

            <h3 className="text-xl font-bold text-yellow-300">
              {v.company_name}
            </h3>

            <p className="text-sm italic text-yellow-100">
              {v.vendor_type}
            </p>
          </motion.button>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {activeVendor && (
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
                relative max-w-xl w-full
                bg-gradient-to-br from-black via-amber-900 to-yellow-900
                border-4 border-yellow-400
                rounded-3xl shadow-2xl
                text-yellow-100
                p-6
              "
            >
              {/* CLOSE */}
              <button
                onClick={() => setActiveVendor(null)}
                className="absolute top-3 right-3 text-yellow-300 hover:text-white transition"
              >
                <FaTimes size={22} />
              </button>

              {/* IMAGE */}
              <div className="flex justify-center mb-6">
                {activeVendor.image_url ? (
                  <img
                    src={activeVendor.image_url}
                    alt={activeVendor.company_name}
                    className="max-h-48 object-cover rounded-xl border border-yellow-400/40"
                  />
                ) : (
                  <div className="px-6 py-4 bg-white text-black font-black rounded-xl">
                    {activeVendor.company_name}
                  </div>
                )}
              </div>

              {/* NAME */}
              <h2 className="text-3xl font-black text-center mb-1">
                {activeVendor.company_name}
              </h2>

              {/* TYPE */}
              <p className="text-center text-lg font-semibold text-yellow-300 mb-4">
                {activeVendor.vendor_type}
              </p>

              {/* WEBSITE */}
              {activeVendor.website_url && (
                <div className="flex justify-center">
                  <a
                    href={activeVendor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center gap-2
                      px-5 py-2 rounded-xl
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
