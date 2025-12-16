import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaRainbow } from "react-icons/fa";
import CapitalEvents from "./CapitalEvents";

export default function Events() {
  return (
    <div className="
      min-h-screen pt-32
      bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25]
      text-yellow-100
      flex flex-col items-center justify-center
      px-6 text-center
    ">

      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-10"
      >
        {/* Icon */}
        <FaCalendarAlt className="text-yellow-300 text-6xl mx-auto mb-4 drop-shadow-lg" />

        {/* Title */}
        <h1 className="
          text-4xl sm:text-5xl font-extrabold
          bg-gradient-to-r from-yellow-300 via-yellow-300 to-yellow-400
          bg-clip-text text-transparent
          drop-shadow-lg
        ">
          Upcoming Events
        </h1>
      </motion.div>

      {/* Events List */}
      <CapitalEvents />

      {/* Footer Decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 flex flex-col items-center space-y-3"
      >
        <FaRainbow className="text-4xl text-green-400 animate-pulse" />

        <p className="text-sm text-yellow-200 italic">
          “Pride never sleeps — and neither does our community.”
        </p>
      </motion.div>

    </div>
  );
}
