// PrideCenterNavBar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // ⭐ Added Admin Submissions Page
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Events", path: "/events" },
    { name: "Our Team", path: "/ourteam" },
    { name: "Contact", path: "/contact" },

    // ⭐ NEW ROUTE
    { name: "Admin", path: "/admin-submissions" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-br from-blue-400 via-blue-700 via-purple-700 via-purple-500 to-pink-600 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 mt-1 flex justify-between items-center">
        
        {/* 🌈 Animated Gradient Border Logo */}
        <Link to="/" className="inline-block">
          <div
            className="inline-block rounded-none border border-indigo-900"
            style={{
              background:
                "linear-gradient(270deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
              backgroundSize: "400% 400%",
              animation: "borderFlow 8s ease infinite",
            }}
          >
            <img
              src="./PrideLogo3.jpg"
              alt="Pride Logo"
              className="block rounded-none bg-white p-1 h-12 sm:h-20 md:h-24 w-auto max-w-full"
            />
          </div>

          <style>{`
            @keyframes borderFlow {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
        </Link>

        {/* 🍔 Mobile Menu Button */}
        <button
          className="md:hidden flex items-center gap-2 text-white"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
          <span className="text-xl font-semibold">Menu</span>
        </button>

        {/* 🖥 Desktop Navigation */}
        <ul className="hidden md:flex font-serif space-x-8 text-2xl font-bold text-white">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="hover:underline hover:text-yellow-200 transition"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

      </div>

      {/* 📱 Mobile Menu */}
     {menuOpen && (
  <div className="md:hidden mx-4 mt-3 mb-4 rounded bg-black/70 backdrop-blur-md p-6 shadow-lg border border-white/10">

    <ul className="grid grid-cols-2 gap-3 text-lg font-semibold text-center text-white">

      {navItems.map((item, i) => {
        const isAdmin = item.name === "Admin";

        return (
          <li
            key={item.name}
            className={isAdmin ? "col-span-2" : ""}
          >
            <Link
              to={item.path}
              onClick={toggleMenu}
              className={`
                block w-full py-2 rounded border-2 border-white 
                transition-all shadow-md hover:shadow-xl
                ${
                  isAdmin
                    ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black"  // ⭐ Full-width admin style
                    : [
                        "bg-gradient-to-r from-pink-600 to-red-600",
                        "bg-gradient-to-r from-orange-500 to-red-500",
                        "bg-gradient-to-r from-yellow-400 to-orange-400 text-black",
                        "bg-gradient-to-r from-green-500 to-emerald-600",
                        "bg-gradient-to-r from-blue-500 to-indigo-600",
                        "bg-gradient-to-r from-purple-500 to-fuchsia-600",
                      ][i % 6]
                }
              `}
            >
              {item.name}
            </Link>
          </li>
        );
      })}

      {/* ⭐ Social Icons Full Row */}
      <li className="col-span-2 flex justify-center gap-6 pt-3">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-4xl transition transform hover:scale-125"
        >
          <FaFacebook />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-400 hover:text-pink-300 text-4xl transition transform hover:scale-125"
        >
          <FaInstagram />
        </a>
      </li>

    </ul>
  </div>
)}

    </nav>
  );
};

export default NavBar;
