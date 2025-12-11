// PrideCenterNavBar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Events", path: "/events" },
    { name: "Our Team", path: "/ourteam" },
    { name: "Contact", path: "/contact" },
    { name: "Admin", path: "/admin-submissions" },
  ];

  return (
<nav
  className="
    fixed top-0 left-0 w-full z-50 
    bg-gradient-to-br from-[#18453B] via-[#0f2d25] to-black
    border-b border-white/40 shadow-lg
  "
>

      <div className="max-w-7xl mx-auto px-4 mt-1 flex justify-between items-center">
        
        {/* 🌞 Golden Animated Border Logo */}
        <Link to="/" className="inline-block">
          <div
            className="inline-block rounded-none border border-yellow-600"
            style={{
              background:
                "linear-gradient(270deg, #fde047, #fbbf24, #f59e0b, #fde047)",
              backgroundSize: "400% 400%",
              animation: "borderFlowGold 8s ease infinite",
            }}
          >
            <img
              src="https://t4.ftcdn.net/jpg/06/96/89/13/360_F_696891328_utj80ZwXsdy8SloC9IBaFGDIcGNBrEze.jpg"
              alt="Pride Logo"
              className="block rounded-none bg-white p-1 h-12 sm:h-20 md:h-24 w-auto max-w-full"
            />
          </div>

          <style>{`
            @keyframes borderFlowGold {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
        </Link>

        {/* 🍔 Mobile Menu Button */}
        <button
          className="md:hidden flex items-center gap-2 text-yellow-200"
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
        <div className="
          md:hidden mx-4 mt-3 mb-4 rounded 
          bg-black/70 backdrop-blur-md 
          p-6 shadow-lg border border-yellow-300/20
        ">
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
                      block w-full py-2 rounded border-2 border-yellow-300 
                      transition-all shadow-md hover:shadow-xl
                      ${
                        isAdmin
                          ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black"
                          : [
                              "bg-gradient-to-r from-yellow-400 to-amber-500 text-black",
                              "bg-gradient-to-r from-yellow-500 to-orange-500 text-black",
                              "bg-gradient-to-r from-amber-500 to-yellow-400 text-black",
                              "bg-gradient-to-r from-yellow-600 to-amber-600 text-black",
                              "bg-gradient-to-r from-orange-400 to-yellow-500 text-black",
                              "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black",
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
                className="text-yellow-300 hover:text-yellow-200 text-4xl transition transform hover:scale-125"
              >
                <FaFacebook />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-200 text-4xl transition transform hover:scale-125"
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
