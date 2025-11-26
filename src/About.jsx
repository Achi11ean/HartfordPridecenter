import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen mt-24 sm:mt-36 pb-10 bg-gradient-to-br from-teal-800 via-indigo-900 to-purple-900 text-gray-100">
      {/* Banner */}
      <section className="relative w-full">
        <div
          className="h-[42vh] md:h-[42vh]  bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://westhartfordpride.org/wp-content/uploads/2022/01/West-Hartford-Pride-2022.jpg')",
            backgroundPosition: "center 25%",
          }}
          aria-label="Community celebration banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Overlapping Title */}
        <div className="absolute bottom-[-40px] sm:bottom-[-100px] left-1/2 -translate-x-1/2 border-2 border-pink-400 bg-gradient-to-r from-white/80 to-white/40 backdrop-blur-lg px-6 sm:px-10 py-3 sm:py-5 rounded shadow-xl w-11/12 sm:w-auto">
          <h1 className="text-2xl sm:text-4xl md:text-6xl text-center font-serif italic font-bold text-black drop-shadow-md">
            About Us
            <hr className="border-pink-400 border-2 w-full mt-2" />
            <span className="text-base sm:text-xl md:text-2xl  block sm:inline text-gray-800">
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
            <Link
              to="/contact"
              className="block text-center px-6 py-3 font-semibold text-white border border-white shadow-lg bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:from-purple-600 hover:via-fuchsia-500 hover:to-pink-500 transition-all duration-300 focus-visible:ring-4 focus-visible:ring-pink-300"
            >
              Contact
            </Link>
            <Link
              to="/events"
              className="block text-center px-6 py-3 font-semibold text-white border border-white shadow-lg bg-gradient-to-r from-teal-500 via-green-500 to-lime-500 hover:from-lime-500 hover:via-green-500 hover:to-teal-500 transition-all duration-300 focus-visible:ring-4 focus-visible:ring-teal-300"
            >
              Events
            </Link>
            <Link
              to="/volunteer"
              className="block text-center px-6 py-3 font-semibold text-white shadow-lg border border-white bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-300 focus-visible:ring-4 focus-visible:ring-indigo-300"
            >
              Volunteer
            </Link>
            
          </div>
        </nav>
<div className="text-center py-3 ">
<Link
  to="/OurTeam"
  state={{ openSponsors: true }}
  className="inline-block w-full py-1 text-lg font-semibold text-white  border border-white  shadow-md bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:scale-105 transition-transform"
>
  Sponsor / Donate 🌈
</Link>

        </div>
        {/* Headline */}
        <motion.p
          className="mt-2 text-center text-xl sm:text-2xl md:text-3xl font-extrabold border-y-2 border-pink-400 py-3"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Building a future where every voice is heard, every identity celebrated, and every person empowered.
        </motion.p>
        <section className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <article className="bg-white/90 text-gray-800 p-6 md:p-8 shadow-xl rounded-xl border-l-4 border-pink-500">
            <h2 className="text-3xl font-bold mb-3 text-center text-pink-600">Our Mission</h2>
            <p className="text-base md:text-lg leading-7">
              To create a welcoming and affirming space for all members of the LGBTQIA+ community by fostering connection, promoting self-expression,
              and providing essential resources that empower individuals and strengthen our collective voice in Greater Hartford.
            </p>
          </article>

          <article className="bg-white/90 text-gray-800 p-6 md:p-8 shadow-xl rounded-xl border-l-4 border-teal-500">
            <h2 className="text-3xl font-bold mb-3 text-center text-teal-600">Our Values</h2>
            <p className="text-base md:text-lg leading-7">
              We believe in authenticity, inclusivity, and collaboration.  
              Through creativity and compassion, we build bridges across communities and celebrate the beauty of being unapologetically ourselves.  
              Together, we thrive.
            </p>
          </article>
        </section>

        {/* Intro */}
        <motion.p
          className="mt-2 text-center text-lg sm:text-xl md:text-2xl text-gray-200 max-w-5xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
        >
          The <span className="text-pink-300 font-semibold">South Haven LGBTQIA+ Advocacy</span> is dedicated to uplifting
          and connecting the LGBTQIA+ community through advocacy, art, education, and celebration.  
          We provide inclusive programming, support services, and cultural events that amplify queer voices and promote equality.
        </motion.p>

        {/* Info Grid */}

        {/* Closing CTA */}
        
      </main>
    </div>
  );
}
