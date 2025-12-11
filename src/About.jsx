import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function About() {
  return (
<div
  className="
    min-h-screen 
    pb-10 
    bg-gradient-to-br 
    from-black 
    via-[#0F2D25] 
    to-[#18453B] 
    text-white
  "
>

      
      {/* Banner */}
      <section className="relative w-full">
        <div
          className="h-[42vh] md:h-[42vh] bg-cover mt-4 sm:mt-28  bg-center"
          style={{
            backgroundImage:
              "url('https://westhartfordpride.org/wp-content/uploads/2022/01/West-Hartford-Pride-2022.jpg')",
            backgroundPosition: "center 25%",
          }}
          aria-label="Community celebration banner"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

        {/* Overlapping Title */}
        <div className="absolute bottom-[-40px] sm:bottom-[-100px] left-1/2 -translate-x-1/2 border-2 border-yellow-400 bg-gradient-to-r from-white/80 to-white/40 backdrop-blur-lg px-6 sm:px-10 py-3 sm:py-5 rounded shadow-xl w-11/12 sm:w-auto">
          <h1 className="text-2xl sm:text-4xl md:text-6xl text-center font-serif italic font-bold text-black drop-shadow-md">
            About Us
            <hr className="border-yellow-400 border-2 w-full mt-2" />
            <span className="text-base sm:text-xl md:text-2xl block sm:inline text-gray-900">
              Empower • Educate • Celebrate
            </span>
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-32">

        {/* Quick Links */}
        <nav aria-label="Primary">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">

            {/* Contact */}
            <Link
              to="/contact"
              className="block text-center px-6 py-3 font-semibold text-black border border-black shadow-lg 
              bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 
              hover:from-amber-500 hover:via-yellow-400 hover:to-yellow-300 
              transition-all duration-300"
            >
              Contact
            </Link>

            {/* Events */}
            <Link
              to="/events"
              className="block text-center px-6 py-3 font-semibold text-black border border-black shadow-lg 
              bg-gradient-to-r from-amber-300 via-yellow-400 to-yellow-500 
              hover:from-yellow-600 hover:via-yellow-400 hover:to-amber-300 
              transition-all duration-300"
            >
              Events
            </Link>

            {/* Volunteer */}
            <Link
              to="/volunteer"
              className="block text-center px-6 py-3 font-semibold text-black border border-black shadow-lg 
              bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 
              hover:from-yellow-600 hover:via-amber-500 hover:to-yellow-400
              transition-all duration-300"
            >
              Volunteer
            </Link>
          </div>
        </nav>

        {/* Sponsor/Donate CTA */}
        <div className="text-center py-3">
          <Link
            to="/OurTeam"
            state={{ openSponsors: true }}
            className="inline-block w-full py-1 text-lg font-semibold text-black border border-black shadow-md 
            bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 
            hover:scale-105 transition-transform"
          >
            Sponsor / Donate 🌟
          </Link>
        </div>

        {/* Headline */}
        <motion.p
          className="mt-2 text-center text-xl sm:text-2xl md:text-3xl font-extrabold 
                     border-y-2 border-yellow-400 py-3 text-yellow-200"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Building a future where every voice is heard, every identity celebrated, and every person empowered.
        </motion.p>

        {/* Mission + Values */}
        <section className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

          {/* Mission */}
          <article className="bg-white/90 text-gray-800 p-6 md:p-8 shadow-xl rounded-xl border-l-4 border-yellow-500">
            <h2 className="text-3xl font-bold mb-3 text-center text-yellow-700">Our Mission</h2>
            <p className="text-base md:text-lg leading-7">
              To create a welcoming and affirming space for all members of the LGBTQIA+ community by fostering connection,
              promoting self-expression, and providing essential resources that empower individuals and strengthen our
              collective voice in Greater Hartford.
            </p>
          </article>

          {/* Values */}
          <article className="bg-white/90 text-gray-800 p-6 md:p-8 shadow-xl rounded-xl border-l-4 border-amber-500">
            <h2 className="text-3xl font-bold mb-3 text-center text-amber-700">Our Values</h2>
            <p className="text-base md:text-lg leading-7">
              We believe in authenticity, inclusivity, and collaboration.  
              Through creativity and compassion, we build bridges across communities and celebrate the beauty of 
              being unapologetically ourselves.  
              Together, we thrive.
            </p>
          </article>

        </section>

        {/* Intro Text */}
        <motion.p
          className="mt-4 text-center text-lg sm:text-xl md:text-2xl text-yellow-100 max-w-5xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
        >
          The <span className="text-yellow-300 font-semibold">South Haven LGBTQIA+ Advocacy</span> is dedicated to uplifting
          and connecting the LGBTQIA+ community through advocacy, art, education, and celebration.
          We provide inclusive programming, support services, and cultural events that amplify queer voices and promote equality.
        </motion.p>

      </main>
    </div>
  );
}
