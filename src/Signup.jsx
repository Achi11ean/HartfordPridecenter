import React, { useState } from "react";
import AdminSignup from "./AdminSignup";
import StaffSignup from "./StaffSignup";

export default function Signup() {
  const [mode, setMode] = useState("admin"); // admin | staff

  return (
    <div className="
      min-h-screen flex items-center justify-center
      bg-gradient-to-br from-[#18453B] via-black to-[#0f2d25]
      px-4 py-16
    ">
      <div className="
        w-full max-w-full mt-16
        bg-black/60 backdrop-blur-xl
        border border-yellow-500/40
        rounded-3xl shadow-2xl
        p-8
      ">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center text-yellow-300 mb-6">
          🏳️‍🌈 Pride Signup
        </h1>

        {/* Toggle */}
        <div className="flex mb-8 rounded-xl overflow-hidden border border-yellow-500/40">
          <button
            type="button"
            onClick={() => setMode("admin")}
            className={`
              w-1/2 py-3 font-bold transition
              ${
                mode === "admin"
                  ? "bg-yellow-400 text-black"
                  : "bg-black/40 text-yellow-200 hover:bg-black/60"
              }
            `}
          >
            ADMIN SIGNUP
          </button>

          <button
            type="button"
            onClick={() => setMode("staff")}
            className={`
              w-1/2 py-3 font-bold transition
              ${
                mode === "staff"
                  ? "bg-yellow-400 text-black"
                  : "bg-black/40 text-yellow-200 hover:bg-black/60"
              }
            `}
          >
            STAFF SIGNUP
          </button>
        </div>

        {/* Content */}
        <div className="relative">
          {mode === "admin" ? <AdminSignup /> : <StaffSignup />}
        </div>
      </div>
    </div>
  );
}
