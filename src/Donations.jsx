import React from "react";
import { motion } from "framer-motion";
import { FaHeart, FaHandsHelping, FaRainbow } from "react-icons/fa";

export default function Donations() {
const DONATION_LINK = "https://buy.stripe.com/bJe3cocQX4Ii40G3Socwg00";

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-950 via-purple-950 to-slate-950 text-white">

      {/* Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,.25),transparent_28%),radial-gradient(circle_at_top_right,rgba(249,115,22,.22),transparent_30%),radial-gradient(circle_at_center,rgba(250,204,21,.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,.22),transparent_30%),radial-gradient(circle_at_center_right,rgba(168,85,247,.22),transparent_35%)]" />

      <section className="relative max-w-6xl mx-auto px-6 pt-28 pb-20">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          className="text-center"
        >

          <img
            src="/PrideLogo3.jpg"
            alt="Hartford Pride Center"
            className="mx-auto w-full max-w-3xl rounded-[2rem] border border-white/10 shadow-2xl"
          />

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-[.35em] text-pink-200">
            ❤️ Hartford Pride Center
          </div>

          <h1 className="mt-8 text-5xl sm:text-7xl font-black leading-tight">

            Support Our

            <span className="block bg-gradient-to-r from-red-300 via-yellow-200 via-green-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">

              Community

            </span>

          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg sm:text-xl leading-9 text-white/80">

            Every donation helps create welcoming spaces, expand
            community programs, strengthen advocacy efforts, and
            ensure that LGBTQIA+ individuals and allies always
            have a place where they are celebrated, supported,
            and empowered.

          </p>

          <a
            href={DONATION_LINK}
            className="
              inline-flex
              items-center
              gap-3
              mt-12
              rounded-2xl
              bg-gradient-to-r
              from-pink-500
              via-fuchsia-500
              to-purple-600
              px-10
              py-5
              text-xl
              font-black
              shadow-[0_20px_60px_rgba(236,72,153,.45)]
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-[0_30px_80px_rgba(236,72,153,.6)]
            "
          >
            <FaHeart />
            Donate Now
          </a>

        </motion.div>

        {/* Impact Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-[2rem] border border-pink-400/20 bg-white/5 backdrop-blur-xl p-8"
          >

            <FaRainbow className="text-5xl text-pink-300 mb-5" />

            <h2 className="text-2xl font-black">

              Celebrate Pride

            </h2>

            <p className="mt-4 leading-8 text-white/75">

              Your generosity helps make community events,
              celebrations, educational programs, and gatherings
              possible throughout the year.

            </p>

          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-[2rem] border border-cyan-400/20 bg-white/5 backdrop-blur-xl p-8"
          >

            <FaHandsHelping className="text-5xl text-cyan-300 mb-5" />

            <h2 className="text-2xl font-black">

              Build Community

            </h2>

            <p className="mt-4 leading-8 text-white/75">

              Every contribution supports outreach, volunteer
              initiatives, advocacy, and resources that help
              people feel connected and welcomed.

            </p>

          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-[2rem] border border-yellow-400/20 bg-white/5 backdrop-blur-xl p-8"
          >

            <FaHeart className="text-5xl text-yellow-300 mb-5" />

            <h2 className="text-2xl font-black">

              Create Impact

            </h2>

            <p className="mt-4 leading-8 text-white/75">

              Whether your gift is large or small, every donation
              helps build a future where everyone belongs and has
              the opportunity to thrive.

            </p>

          </motion.div>

        </div>

        {/* Quote */}

        <div className="mt-20 rounded-[2rem] border border-white/10 bg-white/5 p-12 backdrop-blur-xl text-center">

          <p className="text-3xl font-bold leading-relaxed text-white">

            "Together we create a community where everyone is
            welcomed, celebrated, and empowered to be exactly who
            they are."

          </p>

          <div className="mt-10">

            <a
              href={DONATION_LINK}
              className="
                inline-flex
                items-center
                gap-3
                rounded-2xl
                bg-gradient-to-r
                from-pink-500
                via-fuchsia-500
                to-purple-600
                px-8
                py-4
                font-black
                shadow-lg
                transition
                hover:scale-105
              "
            >
              ❤️ Donate Today
            </a>

          </div>

        </div>

      </section>

    </div>
  );
}