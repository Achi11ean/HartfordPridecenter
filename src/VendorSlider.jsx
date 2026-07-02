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
const VENDOR_TYPES = [
  "Merchandise",
  "Arts and Crafts",
  "Wellness or Beauty",
  "Travel or Tourism Agency",
  "Food and Beverage",
  "Community Service or Nonprofit",
  "Political or Activism",
  "Clothing or Fashion",
  "Jewelry or Accessories",
  "Home Goods or Decor",
  "Digital Products or Services",
  "Photography or Videography",
  "Music or Entertainment",
  "Performing Arts (Theatre, Dance, Drag)",
  "Health or Fitness",
  "Spiritual or Holistic",
  "Education or Workshops",
  "Technology or IT Services",
  "Business Services (Marketing, Finance, Legal)",
  "Pet Services or Products",
  "Local Small Business",
  "Tattoo or Piercing",
  "Handmade or Custom Goods",
  "Vintage or Thrift",
  "LGBTQIA+ Resources",
  "Event Services (Planning, Rentals, Staffing)",
  "Nonprofit Fundraising or Outreach",
  "Other",
];
export default function VendorSlider() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVendor, setActiveVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
const isLgbtqOwnedVendor = (vendor) =>
  (vendor.description || "").includes("LGBTQIA+ Owned");
const availableTypes = [
  ...new Set(vendors.map(v => v.vendor_type).filter(Boolean))
];
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

const [selectedType, setSelectedType] = useState("all");

const filteredVendors = vendors.filter((v) => {
  const matchesType =
    selectedType === "all" ||
    v.vendor_type === selectedType;

  const search = searchTerm.toLowerCase().trim();

  const matchesSearch =
    !search ||
    v.company_name?.toLowerCase().includes(search) ||
    v.vendor_type?.toLowerCase().includes(search) ||
    v.description?.toLowerCase().includes(search);

  return matchesType && matchesSearch;
});
const isSingleVendor = filteredVendors.length === 1
const row1 = filteredVendors.filter((_, i) => i % 2 === 0);
const row2 = filteredVendors.filter((_, i) => i % 2 === 1);
const VendorRow = ({ items }) => (
  <motion.div
    className="flex gap-4 w-max mb-4"
    drag="x"
    dragConstraints={dragLimits}
    dragElastic={0.05}
    dragMomentum={false}
  >
    {items.map((v) => (
      <motion.button
        key={v.id}
        whileHover={{ scale: 1.04, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveVendor(v)}
        className="
          group
          overflow-hidden
          flex flex-col
          flex-shrink-0
          w-[280px]
          rounded-3xl
          border border-white
          bg-black
          shadow-[0_10px_40px_rgba(0,0,0,0.65)]
        "
      >
        {/* existing card content */}
      </motion.button>
    ))}
  </motion.div>
);
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
<div className="relative w-full">
<div className="mb-4">
  <select
    value={selectedType}
    onChange={(e) => setSelectedType(e.target.value)}
    className="
      w-full sm:w-auto
      px-4 py-2 rounded-xl
      bg-black text-yellow-200
      border border-yellow-400/40
      font-bold
    "
  >
    <option value="all">All Vendor Types</option>
    {availableTypes.map((type) => (
  <option key={type} value={type}>
    {type}
  </option>
))}
  </select>
</div>
<div className="mt-3">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
placeholder="🔍 Search company, category, or keyword..."
    className="
      w-full
      px-4 py-3
      rounded-xl
      bg-black
      text-yellow-100
      placeholder-yellow-300/50
      border border-yellow-400/40
      focus:outline-none
      focus:border-yellow-300
      focus:ring-2
      focus:ring-yellow-400/30
      transition-all
    "
  />
</div>
<div
  className="
    text-left mb-2 mt-4
    text-xs sm:text-sm
    text-yellow-200/80
    flex gap-2
  "
>
  <span className="animate-bounce text-yellow-400">⭐</span>
  <span>
    Cards with a star in the top left are LGBTQIA+ owned 🌈
  </span>
  
</div>
<p className="mt-2  mb-2 text-sm text-yellow-200/80">
  Showing <span className="font-bold text-yellow-300">
    {filteredVendors.length}
  </span>{" "}
  vendor{filteredVendors.length !== 1 ? "s" : ""}
  {selectedType !== "all" && (
    <>
      {" "}in{" "}
      <span className="font-bold text-yellow-300">
        {selectedType}
      </span>
    </>
  )}
</p>
{filteredVendors.length === 0 && (
  <div
    className="
      text-center
      py-8
      text-yellow-200/70
      italic
      border border-yellow-400/20
      rounded-2xl
      bg-black/30
      mb-4
    "
  >
    🔍 No vendors match your search.
  </div>
)}




<div className="space-y-4">{[row1, row2]
  .filter((row) => row.length > 0)
  .map((row, rowIndex) => (
<div
  key={rowIndex}
 className={`
  flex gap-3
  overflow-x-auto
  no-scrollbar
  pb-2
  
  scroll-smooth
  overscroll-x-contain
    ${
      isSingleVendor
        ? "justify-center"
        : ""
    }
  `}
>
      {row.map((v) => (
    <motion.button
  key={v.id}
  onClick={() => setActiveVendor(v)}
  whileHover={{ scale: 1.04, y: -4 }}
  whileTap={{ scale: 0.98 }}  className="
    snap-start
    group
    overflow-hidden
    flex flex-col
    flex-shrink-0
    w-[280px]
    rounded-lg
    border border-white
    bg-black
    shadow-[0_10px_40px_rgba(0,0,0,0.65)]
    transition-all
    duration-500
  "
>
          {/* BACKGROUND IMAGE */}
          <div className="relative h-[180px] overflow-hidden">
            {v.image_url ? (
              <img
                src={v.image_url}
                alt={v.company_name}
                className="
                  w-full h-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-110
                "
              />
            ) : (
              <div
                className="
                  w-full h-full
                  bg-gradient-to-br
                  from-neutral-900
                  via-black
                  to-neutral-800
                "
              />
            )}

            {isLgbtqOwnedVendor(v) && (
              <div
                className="
                  absolute top-3 left-3 z-20
                  h-6 w-6 rounded-full
                  border-2 border-white
                  bg-white
                  flex items-center justify-center
                "
              >
                ⭐️
              </div>
            )}
          </div>

          {/* DARK OVERLAY */}
          <div className="p-2 text-center bg-black">
<h3
  className={`
    text-white
    font-black
    font-serif
    leading-tight
    group-hover:text-yellow-200
    transition-color border-b
    ${
      (v.company_name?.length || 0) > 10
        ? "text-sm sm:text-lg"
        : "text-lg sm:text-xl"
    }
  `}
>
  {v.company_name}
</h3>
            {v.vendor_type && (
              <p className="mt-1 italic  text-xs text-yellow-300">
                {v.vendor_type}
              </p>
            )}
          </div>
        </motion.button>
      ))}
</div>  ))}
</div>
  {!isSingleVendor && (
  <div className="mt-2 text-center text-[18px] text-white">
    ← swipe to see more →
  </div>
)}
{/* 
                <div className="text-center mt-4 shadow-xl">
                  <h2 className="text-3xl font-bold text-yellow-300 mb-1 border-b">
                    Become a Vendor
                  </h2>
        
                  <p className="text-yellow-100 text-sm mb-6">
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

                </div> */}
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
              <h2 className="text-3xl font-black  text-center mb-1">
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
