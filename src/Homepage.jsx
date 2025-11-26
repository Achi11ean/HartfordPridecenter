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
    src="/PrideLogo3.jpg"
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
  At the <span className="font-bold underline text-blue-700">Hartford Pride Center</span>, 
  we believe every person deserves a space where they can feel seen, supported, and celebrated.  
  Our mission is to uplift LGBTQIA+ individuals through advocacy, education, and community connection.  
  From social programs and resource guides to special events and creative workshops — we’re here to empower, 
  inspire, and unite our diverse community.
</p>

<p className="text-gray-700 pb-6 font-semibold text-lg leading-relaxed">
  Together, we’re creating a safer, more inclusive world — one that values authenticity, compassion, and pride.  
  Join us in making Hartford a place where everyone can thrive, be themselves, and shine brightly. 🌈
</p>


        {/* Hartford Pride Event 2026 Info */}
<Link
  to="/hartford-city-pride"
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
        Hartford Pride Center 🌈
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
