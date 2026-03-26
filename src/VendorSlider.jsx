import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaTimes,
  FaGlobe,
  FaInstagram,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa";

import { SiTiktok } from "react-icons/si";
const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2; // 🔒 hard-coded (global Pride)

export default function VendorSlider() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVendor, setActiveVendor] = useState(null);
const sliderRef = useRef(null);
const containerRef = useRef(null); // 🔥 NEW

const [dragLimits, setDragLimits] = useState({ left: 0, right: 0 }); // 🔥 NEW
const isSingleVendor = vendors.length === 1;

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get(
          `${API}/api/pride/${PRIDE_ID}/vendors`
        );

        // show only active + approved/confirmed vendors
        setVendors(
          (res.data || []).filter(
            (v) =>
              v.is_active &&
              ["approved", "confirmed"].includes(v.status)
          )
        );
      } catch (err) {
        console.error("[VendorSlider] Failed to load vendors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);



  const getWebsites = (v) => {
  if (v.websites?.length) return v.websites;
  if (v.website_url) return v.website_url.split(",").map(s => s.trim());
  return [];
};

const getSocials = (v) => {
  if (v.socials?.length) return v.socials;
  if (v.social_links) return v.social_links.split(",").map(s => s.trim());
  return [];
};
const getPlatform = (url) => {
  const u = url.toLowerCase();

  if (u.includes("instagram")) {
    return {
      icon: <FaInstagram />,
      label: "Instagram",
      color: "text-pink-400",
    };
  }

  if (u.includes("tiktok")) {
    return {
      icon: <SiTiktok />,
      label: "TikTok",
      color: "text-white",
    };
  }

  if (u.includes("facebook")) {
    return {
      icon: <FaFacebook />,
      label: "Facebook",
      color: "text-blue-400",
    };
  }

  if (u.includes("youtube")) {
    return {
      icon: <FaYoutube />,
      label: "YouTube",
      color: "text-red-400",
    };
  }

  return {
    icon: <FaGlobe />,
    label: "Link",
    color: "text-yellow-300",
  };
};



useEffect(() => {
  if (!sliderRef.current || !containerRef.current) return;

  const sliderWidth = sliderRef.current.scrollWidth;
  const containerWidth = containerRef.current.offsetWidth;

  const maxDrag = sliderWidth - containerWidth;

  setDragLimits({
    left: -Math.max(0, maxDrag),
    right: 0,
  });
}, [vendors]);




  if (loading) {
    return (
      <p className="text-center text-sm text-neutral-400">
        Loading vendors…
      </p>
    );
  }

  if (vendors.length === 0) {
    return (
      <p className="text-center text-sm text-neutral-400 italic">
        Vendor list coming soon.
      </p>
    );
  }




  return (
    <>
      {/* ================= SLIDER ================= */}
<div ref={containerRef} className="relative w-full overflow-hidden">
      <motion.div
  ref={sliderRef}
  className={`flex gap-4 ${
    isSingleVendor ? "justify-center cursor-default" : "cursor-grab active:cursor-grabbing"
  }`}
  drag={isSingleVendor ? false : "x"}
dragConstraints={isSingleVendor ? undefined : dragLimits}
dragElastic={0.05}
dragMomentum={false}
whileTap={isSingleVendor ? undefined : { scale: 0.98 }}
>

          {vendors.map((v) => (
            <motion.button
              key={v.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveVendor(v)}
              className="
                min-w-[180px] sm:min-w-[220px]
                bg-white/90
                border border-yellow-300
                rounded-xl
                p-4
                shadow-md
                text-center
                flex flex-col items-center justify-center
              "
            >
              {v.image_url ? (
                <img
                  src={v.image_url}
                  alt={v.company_name}
                  className="h-20 w-auto object-contain mb-2 rounded"
                />
              ) : (
                <div className="h-20 flex items-center text-xs text-neutral-500 px-2">
                  {v.company_name}
                </div>
              )}

              <p className="text-sm font-bold text-black leading-tight">
                {v.company_name}
              </p>

              <p className="text-[11px] text-neutral-600 mt-1 italic">
                {v.vendor_type}
              </p>
            </motion.button>
          ))}
        </motion.div>

  {!isSingleVendor && (
  <div className="mt-2 text-center text-[18px] text-black">
    ← swipe to see more →
  </div>
)}

                <div className="text-center mt-4 bg-black/40 rounded-xl p-2 border-2 border-yellow-400/60 shadow-xl">
                  <h2 className="text-3xl font-bold text-yellow-300 mb-3">
                    Become a Vendor
                  </h2>
        
                  <p className="text-yellow-100 text-lg mb-6">
                    Help us craft a unique, exciting , and inclusive Pride experience!
                  </p>
        
<a
  href="https://docs.google.com/forms/d/1J6jkAaV2LaV6yt-JDkXUTpTq4a7zxId0xz777NQF5Kg/viewform"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 font-bold text-black border-2 border-white shadow-lg hover:scale-105 transition"
>
  Contact us
</a>

                </div>
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
                    className="max-h-40 object-cover rounded-xl bg-white p-2"
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

              {/* TIME (optional) */}
              {(activeVendor.start_time || activeVendor.end_time) && (
                <p className="text-center text-sm text-yellow-100 mb-4">
                  {activeVendor.start_time && "Starts: "}
                  {activeVendor.start_time &&
                    new Date(activeVendor.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  {activeVendor.end_time && " • Ends: "}
                  {activeVendor.end_time &&
                    new Date(activeVendor.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </p>
              )}

              {/* WEBSITE */}
{getWebsites(activeVendor).length > 0 && (
  (() => {
    const websites = getWebsites(activeVendor);
    const count = websites.length;

    const gridCols =
      count === 1
        ? "grid-cols-1 justify-items-center"
        : count === 2
        ? "grid-cols-2 justify-items-center"
        : "grid-cols-3";

    return (
      <div className={`grid ${gridCols} gap-2 mt-4`}>
        {websites.map((site, i) => (
          <a
            key={i}
            href={site}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2
              px-4 py-2
              rounded-xl
              bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600
              text-black font-bold text-sm text-center
              hover:brightness-110 transition
              min-w-[120px]
            "
          >
            <FaGlobe />
            Website {i + 1}
          </a>
        ))}
      </div>
    );
  })()
)}
{(() => {
  const socials = getSocials(activeVendor);
  const count = socials.length;

  const gridCols =
    count === 1
      ? "grid-cols-1 justify-items-center"
      : count === 2
      ? "grid-cols-2 justify-items-center"
      : "grid-cols-3";

  return (
    <div className={`grid ${gridCols} gap-2 mt-3`}>
      {socials.map((social, i) => {
        const platform = getPlatform(social);

        return (
          <a
            key={i}
            href={social}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2
              px-3 py-2
              rounded-lg
              bg-white/10 border border-white/20
              text-xs text-center
              hover:bg-white/20 transition
              min-w-[100px]
            "
          >
            <span className={`${platform.color} text-sm`}>
              {platform.icon}
            </span>
            <span>{platform.label}</span>
          </a>
        );
      })}
    </div>
  );
})()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
