import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaEnvelope, FaCalendarAlt, FaHandHoldingHeart, FaUsers } from "react-icons/fa";
import "./App.css"
import EmailSubscribe from "./EmailSubscribe";

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B0A0A] via-black to-[#7A1C1C] text-white">
      {/* Top Hero */}
      <header className="relative pt-28 pb-14 sm:pt-32 sm:pb-20 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg?cs=srgb&dl=pexels-pixabay-207142.jpg&fm=jpg')",
          }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3B0A0A]/50 via-black/60 to-[#7A1C1C]/60
" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Logo + Tag */}
          <div className="flex flex-col items-center text-center gap-6">
            <motion.img
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              src="/PrideLogo3.jpg"
              alt="Hartford Pride Center Logo"
              className="w-full max-w-md sm:max-w-lg shadow-2xl border border-yellow-400/40"
            />

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Hartford Pride Center
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-yellow-100/90 font-semibold">
                Supporting & promoting LGBTQIA+ safe spaces, resources, and community connection
                in and around Hartford, CT.
              </p>

              {/* CTAs */}
  <nav aria-label="Primary">
          <div className="grid mt-12 grid-cols-3 gap-3 sm:gap-4">

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
              className="block text-center px-2 py-3 font-semibold text-black border border-black shadow-lg 
              bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 
              hover:from-yellow-600 hover:via-amber-500 hover:to-yellow-400
              transition-all duration-300"
            >
              Volunteer
            </Link>
                      <Link
            to="/sponsors"
            state={{ openSponsors: true }}
           className="block text-center px-6 py-3 font-semibold text-black border border-black shadow-lg 
              bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 
              hover:from-yellow-600 hover:via-amber-500 hover:to-yellow-400
              transition-all duration-300"
            >
            Sponsor
          </Link>
                                <Link
            to="/resources"
            state={{ openSponsors: true }}
           className="block text-center px- py-3 font-semibold text-black border border-black shadow-lg 
              bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 
              hover:from-yellow-600 hover:via-amber-500 hover:to-yellow-400
              transition-all duration-300"
            >
            Resources
          </Link>
                                <Link
            to="https://givebutter.com/lgbtqadvocacy"
            state={{ openSponsors: true }}
           className="block text-center px-6 py-3 font-semibold text-black border border-black shadow-lg 
              bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 
              hover:from-yellow-600 hover:via-amber-500 hover:to-yellow-400
              transition-all duration-300"
            >
            Donate
          </Link>
          </div>
        </nav>

              {/* Sponsor / Donate */}

            </motion.div>
          </div>
          
        </div>
        
      </header>
<hr className="rainbow-hr" />


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        {/* Mission + Impact Cards */}
<section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md border border-yellow-400/25 shadow-2xl p-7"
          >
            <h2 className="text-3xl font-extrabold text-yellow-300">Welcome 👋</h2>
            <div className="mt-3 h-[2px] w-full bg-gradient-to-r from-yellow-400/70 to-transparent" />

            <p className="mt-5 text-yellow-50/90 text-lg leading-relaxed font-semibold">
              We believe every person deserves a space where they feel seen, supported, and celebrated.
              Our mission is to uplift LGBTQIA+ individuals through advocacy, education, and community connection.
            </p>

            <p className="mt-4 text-yellow-50/90 text-lg leading-relaxed font-semibold">
              Together, we’re building a more inclusive world — where authenticity shines and every voice matters. 🌈
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">

                      <Link
                to="/about"
                className="px-6 py-3 font-bold border border-white/20 shadow-lg
                  bg-black/40 hover:bg-black/60 text-yellow-200
                  transition-all duration-300 text-center"
              >
                About Us
              </Link>
              <Link
                to="/resources"
                className="px-6 py-3 font-bold text-black border border-black shadow-lg
                  bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500
                  hover:from-amber-500 hover:via-yellow-400 hover:to-yellow-300
                  transition-all duration-300 text-center"
              >
                Explore Resources
              </Link>
      
            </div>
          </motion.div>

          {/* Impact / Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="bg-black/40 border border-white/10 shadow-2xl p-7"
          >
            <h3 className="text-2xl font-extrabold text-yellow-300">What you can do here</h3>
            <div className="mt-3 h-[2px] w-full bg-gradient-to-r from-yellow-400/70 to-transparent" />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FeatureCard
                icon={<FaCalendarAlt className="text-2xl text-yellow-300" />}
                title="Find Events"
                desc="See what’s happening next, updated regularly."
                to="/events"
              />
              <FeatureCard
                icon={<FaHandHoldingHeart className="text-2xl text-yellow-300" />}
                title="Volunteer"
                desc="Support the community with your time & talent."
                to="/volunteer"
              />
              <FeatureCard
                icon={<FaUsers className="text-2xl text-yellow-300" />}
                title="Connect"
                desc="Reach out for support, questions, or partnership."
                to="/contact"
              />
            </div>

            {/* Featured Link */}
            <div className="mt-7 p-5 bg-white/10 border border-yellow-400/20 shadow-xl">
              <p className="text-yellow-100 font-bold text-lg">
                Featured:
              </p>
              <Link
                to="/pride"
                className="mt-3 inline-block w-full text-center px-6 py-3 font-extrabold text-white border border-white/20 shadow-lg
                  bg-gradient-to-r from-[#0F2D25] via-[#18453B] to-[#0F2D25]
                  hover:brightness-110 transition-all duration-300"
              >
                Hartford Pride Event 2026
              </Link>
            </div>
          </motion.div>
        </section>
        <EmailSubscribe prideId={2} />

      </main>
<hr className="rainbow-hr" />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Org */}
            <div>
              <h3 className="text-xl font-extrabold text-yellow-300">
                Hartford Pride Center 🌈
              </h3>
              <p className="mt-2 text-yellow-100/80 font-semibold">
                Empowering the LGBTQ+ community through support, creativity, and compassion.
              </p>
              <p className="mt-3 text-sm text-yellow-100/70 font-semibold">
                📍 Hartford, Connecticut
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-lg font-bold text-yellow-200">Quick Links</h4>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-sm font-semibold text-yellow-100/80">
                <li><Link className="hover:text-yellow-300" to="/about">About</Link></li>
                <li><Link className="hover:text-yellow-300" to="/services">Services</Link></li>
                <li><Link className="hover:text-yellow-300" to="/events">Events</Link></li>
                <li><Link className="hover:text-yellow-300" to="/volunteer">Volunteer</Link></li>
                <li><Link className="hover:text-yellow-300" to="/resources">Resources</Link></li>
                <li><Link className="hover:text-yellow-300" to="/contact">Contact</Link></li>
                <li><Link className="hover:text-yellow-300" to="/donate">Donate</Link></li>
                <li>
  <a
    href="https://givebutter.com/lgbtqadvocacy"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-yellow-300"
  >
    Donate
  </a>
</li>
<li>
  <Link
    to="/sponsors"
    className="hover:text-yellow-300"
  >
    Sponsors
  </Link>
</li>


                <li><Link className="hover:text-yellow-300" to="/privacy">Privacy</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold text-yellow-200">Get in Touch</h4>
              <p className="mt-3 text-sm font-semibold">
                📧{" "}
                <a
                  href="mailto:info@hartfordpridecenter.org"
                  className="underline hover:text-yellow-300"
                >
                  info@hartfordpridecenter.org
                </a>
              </p>

              <div className="mt-6 flex items-center gap-4 border-t border-yellow-400/30 pt-4">
                <a
                  href="https://www.instagram.com/hartfordpride/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-300"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-2xl" />
                </a>
                <a
                  href="https://www.facebook.com/HartfordPrideCenter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-300"
                  aria-label="Facebook"
                >
                  <FaFacebook className="text-2xl" />
                </a>
                <a
                  href="mailto:info@hartfordpridecenter.org"
                  className="hover:text-yellow-300"
                  aria-label="Email"
                >
                  <FaEnvelope className="text-2xl" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center text-xs text-white/50 font-semibold">
            © {year} Hartford Pride Center — All Rights Reserved.{" "}
            <Link to="/privacy" className="hover:text-yellow-300 underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, to }) {
  return (
    <Link
      to={to}
      className="block p-4 bg-black/40 border border-white/10 shadow-lg hover:bg-white/10 transition"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/10 border border-yellow-400/20">{icon}</div>
        <div>
          <p className="font-extrabold text-yellow-200">{title}</p>
          <p className="text-sm text-yellow-100/80 font-semibold">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
