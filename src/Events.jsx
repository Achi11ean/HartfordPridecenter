import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaRainbow } from "react-icons/fa";
import CapitalEvents from "./CapitalEvents";

export default function Events() {
  return (
    <div className="min-h-screen pt-32 bg-gradient-to-br from-black via-amber-900 to-yellow-800 text-white flex flex-col items-center justify-center px-6 text-center">

      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        {/* Icon */}
        <FaCalendarAlt className="text-yellow-400 text-6xl mx-auto mb-3 drop-shadow-md" />

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
          Upcoming Events
        </h1>
      </motion.div>

      {/* Events List */}
      <CapitalEvents />

      {/* Footer Sparkle / Decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 flex flex-col items-center space-y-2"
      >
        <FaRainbow className="text-4xl text-yellow-300 animate-pulse" />

        <p className="text-sm text-yellow-200 italic">
          "Pride never sleeps — and neither does our community!"
        </p>
      </motion.div>

    </div>
  );
}
