import React from "react";
import { Link } from "react-router-dom";
import PhotoSlider from "./PhotoSlider";
import "./App.css"; // Ensure this import is present for animations
import Privacy from "./Privacy";
import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";

export default function HomePage() {
  return (
<div className="relative text-center min-h-screen">


  <div
    className="
      relative 
      bg-white 
      bg-[url('https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg?cs=srgb&dl=pexels-pixabay-207142.jpg&fm=jpg')]
      bg-cover bg-center bg-no-repeat
      pb-20 mt-14 sm:mt-20
    "
  >
<div className="absolute inset-0  bg-black/40"></div>



      {/* Photo Slider Section */}
    <div className="relative z-10">
         <div className=" bg-black/40 border-b-2 sm:py-8 text-center">
  <img
    src="data:image/png;base64,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"
    alt="Hartford Pride Center Logo"
    className="mx-auto w-full sm:w-full md:w-96  shadow-md shadow-red-500  transition-transform duration-700 ease-in-out"
  />
</div>
        {/* Overlapping Title */}
        <div className="absolute lg:bottom-[-30px] bottom-[-80px] animate-rainbow-wave text-sm sm:text-xl  border-2 border-blue-400 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-400/80 to-purple-500/40 font-bold backdrop-blur-md px-2 sm:px-10 py-1 rounded-none shadow-xl w-11/12 sm:w-auto">

<h3 className="capitalize ">Supporting & promoting LGBTQIA+ Safe Spaces & resources in & Around Hartford, CT.</h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-2">
        {/* Navigation Buttons */}
<div className="mt-20 sm:mt-20 grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 px-4 text-center">

  {/* About */}
  <Link
    to="/about"
    className="
      text-white w-full text-center border-2 border-white px-1 py-2 rounded-none
      text-base sm:text-lg font-semibold shadow-md drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]
      transition-all duration-500 transform hover:scale-105
      bg-[length:200%_200%]
      bg-[linear-gradient(90deg,#3b82f6,#2563eb,#1d4ed8)]
      hover:bg-[right_center]
      bg-[left_center]
    "
  >
    About Us
  </Link>

  {/* Contact */}
  <Link
    to="/contact"
    className="
      text-white w-full text-center border-2 border-white px-1 py-2 rounded-none
      text-base sm:text-lg font-semibold shadow-md drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]
      transition-all duration-500 transform hover:scale-105
      bg-[length:200%_200%]
      bg-[linear-gradient(90deg,#3b82f6,#2563eb,#1d4ed8)]
      hover:bg-[right_center]
      bg-[left_center]
    "
  >
    Contact
  </Link>

  {/* Services */}
  <Link
    to="/services"
    className="
      text-white w-full text-center border-2 border-white px-1 py-2 rounded-none
      text-base sm:text-lg font-semibold shadow-md drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]
      transition-all duration-500 transform hover:scale-105
      bg-[length:200%_200%]
      bg-[linear-gradient(90deg,#3b82f6,#2563eb,#1d4ed8)]
      hover:bg-[right_center]
      bg-[left_center]
    "
  >
    Services
  </Link>

</div>



        {/* Info / Bio Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-none shadow-2xl p-2 border-white border-4 mx-auto my-4 w-11/12 md:w-3/4 lg:w-1/2 text-center space-y-6">
          <h2 className="text-3xl sm:text-xl fade-in md:text-3xl lg:text-4xl xl:text-5xl font-serif text-blue-700 font-bold leading-snug sm:leading-normal px-4 sm:px-6">
             Welcome! 
          </h2>

          <hr className="border-t-4 border-blue-400 w-full " />

        <p className="text-gray-700 font-semibold text-lg leading-relaxed">
  At the <span className="font-bold underline text-blue-700">South Haven LGBTQIA+ Advocacy</span>, 
  we believe every person deserves a space where they can feel seen, supported, and celebrated.  
  Our mission is to uplift LGBTQIA+ individuals through advocacy, education, and community connection.  
  From social programs and resource guides to special events and creative workshops — we’re here to empower, 
  inspire, and unite our diverse community.
</p>

<p className="text-gray-700 pb-6 font-semibold text-lg leading-relaxed">
  Together, we’re creating a safer, more inclusive world — one that values authenticity, compassion, and pride.  
  Join us in making Hartford a place where everyone can thrive, be themselves, and shine brightly. 🌈
</p>


<Link
  to="/South-haven-advocacy"
  className="
    text-white w-full text-center border-2 border-white px-1 py-2 rounded-none
    text-base sm:text-lg font-semibold shadow-md drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]
    transition-all duration-500 transform hover:scale-105
    bg-[length:200%_200%]
    bg-[linear-gradient(90deg,#ec4899,#a855f7,#6366f1)]
    hover:bg-[right_center]
    bg-[left_center]
  "
>
  Hartford Pride Event 2026
</Link>

        </div>
     
      </div>

</div>
         <section className="bg-gradient-to-br from-purple-900 via-black to-pink-900 text-gray-200 py-6 border-t-4 border-pink-400">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 divide-y divide-white lg:divide-y-0 lg:divide-x lg:divide-gray-700">
    
    {/* 🌟 Organization Info */}
    <div className="pr-0 lg:pr-6 text-center lg:text-left">
      <h3 className="text-2xl font-bold text-pink-400 border-b-2 border-pink-400 inline-block mb-2">
       South Haven LGBTQIA+ Advocacy 🌈
      </h3>
      <p className="text-sm leading-relaxed font-bold text-white">
        Empowering the LGBTQ+ community through connection, creativity, and compassion.  
        We provide safe spaces, advocacy, and programs that celebrate authenticity and love.
      </p>
    </div>

    {/* ⚡ Quick Links */}
    <div className="pt-4 sm:pt-0 lg:px-6 text-center lg:text-left">
      <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
      <ul className="grid grid-cols-2 gap-2 text-sm">
        <li><Link to="/about" className="hover:text-pink-400">About</Link></li>
        <li><Link to="/services" className="hover:text-pink-400">Services</Link></li>
        <li><Link to="/events" className="hover:text-pink-400">Events</Link></li>
        <li><Link to="/volunteer" className="hover:text-pink-400">Volunteer</Link></li>
        <li><Link to="/resources" className="hover:text-pink-400">Services</Link></li>
        <li><Link to="/contact" className="hover:text-pink-400">Contact</Link></li>
        <li><Link to="/donate" className="hover:text-pink-400">Donate</Link></li>
                <li><Link to="/hartford-city-pride" className="hover:text-pink-400">Hartford City Pride</Link></li>

        <li><Link to="/privacy" className="hover:text-pink-400">Privacy Policy</Link></li>

      </ul>
    </div>

    {/* 💌 Contact Info */}
    <div className="pt-6 sm:pt-0 lg:pl-6 text-center lg:text-left">
      <h4 className="text-lg font-semibold text-white mb-3">Get in Touch</h4>
      <p className="text-sm">📍 Hartford, Connecticut</p>
      <p className="text-sm mt-1">
        📧{" "}
        <a
          href="mailto:info@hartfordpridecenter.org"
          className="hover:text-pink-400 underline"
        >
          info@hartfordpridecenter.org
        </a>
      </p>

      {/* Social Links */}
      <div className="flex justify-center lg:justify-start items-center space-x-4 mt-6 border-t-2 border-pink-400 pt-3">
        <a
          href="https://www.instagram.com/hartfordpride/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-400"
        >
          <FaInstagram className="text-2xl" />
        </a>
        <a
          href="https://www.facebook.com/HartfordPrideCenter"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-400"
        >
          <FaFacebook className="text-2xl" />
        </a>
        <a
          href="mailto:info@hartfordpridecenter.org"
          className="hover:text-pink-400"
        >
          <FaEnvelope className="text-2xl" />
        </a>
      </div>
    </div>
  </div>

  {/* 🌟 Bottom Bar */}
  <div className="mt-8 text-center text-xs text-gray-500">
    <p>
      © {new Date().getFullYear()} Hartford Pride Center — All Rights Reserved.
    </p>
    <Link to="/privacy" className="hover:text-pink-400">
      Privacy Policy
    </Link>
  </div>
</section>
    </div>
  );
}
