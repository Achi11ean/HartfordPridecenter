import React from "react";
import { Link } from "react-router-dom";
import PhotoSlider from "./PhotoSlider";
import "./App.css";
import Privacy from "./Privacy";
import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="relative text-center min-h-screen">

      <div
        className="
          relative 
          bg-white 
          bg-[url('https://i.fbcd.co/products/resized/resized-750-500/c1fbf67cf920869f26202d1f6be789e49254f27a1e99798bd357efd98f0de0bd.jpg')]
          bg-cover bg-center bg-no-repeat
          pb-20 mt-14 sm:mt-20
        "
      >
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Photo Slider Section */}
        <div className="relative z-10">
          <div className="bg-black/40 border-b-2 sm:py-8 text-center border-yellow-400">
            <img
              src="https://t4.ftcdn.net/jpg/06/96/89/13/360_F_696891328_utj80ZwXsdy8SloC9IBaFGDIcGNBrEze.jpg"
              alt="South Haven LGBTQIA+ Advocacy Logo"
              className="mx-auto w-full sm:w-full md:w-96 mt-6 shadow-md shadow-yellow-500 transition-transform duration-700 ease-in-out"
            />
          </div>

          {/* Overlapping Title */}
          <div className="
              absolute lg:bottom-[-60px] bottom-[-80px]
              animate-rainbow-wave 
              text-sm sm:text-xl
              border-2 border-yellow-400 
              left-1/2 transform -translate-x-1/2
              bg-gradient-to-r from-yellow-300/80 to-yellow-500/40
              font-bold backdrop-blur-md 
              px-2 sm:px-10 py-1 rounded-none shadow-xl 
              w-11/12 sm:w-auto
            "
          >
            <h3 className="capitalize">
              Supporting & promoting LGBTQIA+ Safe Spaces & resources in & around Hartford, CT.
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="pt-2">

          {/* Navigation Buttons */}
          <div className="mt-20 grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 px-4 text-center">

            {/* Reusable Yellow Button Class */}
            {[
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
              { to: "/services", label: "Services" }
            ].map((btn, i) => (
<Link
  key={i}
  to={btn.to}
  className="
    text-white w-full 
    border-2 border-white 
    px-1 py-2 rounded-none
    text-base sm:text-lg font-semibold shadow-md
    drop-shadow-[0_0_10px_rgba(24,69,59,0.8)]
    transition-all duration-500 transform hover:scale-105
    bg-[length:200%_200%]
    bg-[linear-gradient(90deg,#0F2D25,#18453B,#0F2D25)]
    hover:bg-[right_center]
    bg-[left_center]
  "
>

                {btn.label}
              </Link>
            ))}

          </div>

<div className="
  bg-white/80 backdrop-blur-lg shadow-2xl p-2 
  border-[#18453B] border-4 
  mx-auto my-4 w-11/12 md:w-3/4 lg:w-1/2 
  text-center space-y-6 rounded-none
">

  <h2 className="
    text-3xl sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl 
    font-serif 
    text-[#18453B] font-bold leading-snug px-4
  ">
    Welcome!
  </h2>

            <hr className="border-t-4  border-[#18453B] w-full" />

            <p className="text-gray-800 font-semibold text-lg leading-relaxed">
              At the <span className="font-bold underline     text-[#18453B] ">South Haven LGBTQIA+ Advocacy</span>,  
              we believe every person deserves a space where they feel seen, supported, and celebrated.  
              Our mission is to uplift LGBTQIA+ individuals through advocacy, education, and community connection.
            </p>

            <p className="text-gray-800 pb-6 font-semibold text-lg leading-relaxed">
              Together, we’re building a more inclusive world — where authenticity shines and every voice matters. 🌈
            </p>

<Link
  to="/South-haven-advocacy"
  className="
    text-white w-full 
    border-2 border-white 
    px-1 py-2 rounded-none
    text-base sm:text-lg font-semibold shadow-md
    bg-[length:200%_200%]
    bg-[linear-gradient(90deg,#0F2D25,#18453B,#0F2D25)]
    hover:bg-[right_center]
    bg-[left_center]
  "
>

              South Haven Pride Event 2026
            </Link>

          </div>

        </div>
      </div>

      {/* Footer */}
<section className="
  bg-gradient-to-br 
  from-black 
  via-[#0F2D25] 
  to-[#18453B] 
  text-white 
  py-6 
  border-t-4 border-[#18453B]
">
  <div className="
    max-w-7xl mx-auto px-6 
    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
    gap-6 
    divide-y divide-[#18453B] 
    lg:divide-y-0 lg:divide-x lg:divide-[#0F2D25]
  ">

    {/* Organization Info */}
    <div className="pr-0 lg:pr-6 text-center lg:text-left">
      <h3 className="
        text-2xl font-bold 
        text-white 
        border-b-2 border-white 
        inline-block mb-2
      ">
        South Haven LGBTQIA+ Advocacy 🌈
      </h3>
            <p className="text-sm leading-relaxed font-bold text-white">
              Empowering the LGBTQ+ community through support, creativity, and compassion.
            </p>
          </div>

          {/* Quick Links */}
          <div className="pt-4 sm:pt-0 lg:px-6 text-center lg:text-left">
            <h4 className="text-lg font-semibold text-yellow-200 mb-3">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {[
                ["About", "/about"],
                ["Services", "/services"],
                ["Events", "/events"],
                ["Volunteer", "/volunteer"],
                ["Resources", "/resources"],
                ["Contact", "/contact"],
                ["Donate", "/donate"],
                ["Hartford City Pride", "/hartford-city-pride"],
                ["Privacy Policy", "/privacy"]
              ].map(([label, link], i) => (
                <li key={i}>
                  <Link to={link} className="hover:text-yellow-300">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="pt-6 sm:pt-0 lg:pl-6 text-center lg:text-left">
            <h4 className="text-lg font-semibold text-yellow-200 mb-3">Get in Touch</h4>
            <p className="text-sm">📍 Hartford, Connecticut</p>

            <p className="text-sm mt-1">
              📧{" "}
              <a href="mailto:info@hartfordpridecenter.org" className="hover:text-yellow-300 underline">
                info@hartfordpridecenter.org
              </a>
            </p>

            <div className="flex justify-center lg:justify-start items-center space-x-4 mt-6 border-t-2 border-yellow-400 pt-3">
              <a href="https://www.instagram.com/hartfordpride/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="https://www.facebook.com/HartfordPrideCenter" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="mailto:info@hartfordpridecenter.org" className="hover:text-yellow-300">
                <FaEnvelope className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Hartford Pride Center — All Rights Reserved.</p>
          <Link to="/privacy" className="hover:text-yellow-300">Privacy Policy</Link>
        </div>
      </section>
    </div>
  );
}
