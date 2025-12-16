// PrideCenterNavBar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "./AuthContext";

const NavBar = () => {
  const { isAuthenticated, isAdmin, isStaff, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleAdmin = () => setAdminOpen((prev) => !prev);

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Events", path: "/events" },
  { name: "Staff", path: "/ourteam" },
  { name: "Sponsors", path: "/sponsors" },
  { name: "Contact", path: "/contact" },
];


  return (
    <nav className="
      fixed top-0 left-0 w-full z-50 
      bg-gradient-to-br from-[#18453B] via-[#0f2d25] to-black
      border-b border-white/40 shadow-lg
    ">
      <div className="max-w-7xl mx-auto px-4 mt-1 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="inline-block">
          <div className="inline-block border border-yellow-600">
            <img
              src="https://t4.ftcdn.net/jpg/06/96/89/13/360_F_696891328_utj80ZwXsdy8SloC9IBaFGDIcGNBrEze.jpg"
              alt="Pride Logo"
              className="block bg-white p-1 h-12 sm:h-20 md:h-24"
            />
          </div>
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden flex items-center gap-2 text-yellow-200"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
          <span className="text-xl font-semibold">Menu</span>
        </button>

        {/* DESKTOP NAV */}
        <ul className="hidden md:flex items-center font-serif space-x-4 text-2xl font-bold text-white">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="hover:underline underline hover:text-yellow-200 transition"
              >
                {item.name}
              </Link>
            </li>
          ))}

          {/* ADMIN DROPDOWN */}
     {/* AUTH DROPDOWN */}
<li className="relative">
  <button
    onClick={toggleAdmin}
    className="flex items-center gap-2 hover:text-yellow-200 transition"
  >
    {isAuthenticated
      ? isAdmin
        ? "Admin"
        : "Staff"
      : "Account"}{" "}
    <ChevronDown size={20} />
  </button>

  {adminOpen && (
    <div className="
      absolute right-0 mt-2 w-48
      bg-black/90 border border-yellow-400/40
      rounded-xl shadow-xl backdrop-blur-md
    ">
      {!isAuthenticated && (
        <>
          <Link
            to="/login"
            className="block px-4 py-3 text-yellow-200 hover:bg-yellow-400 hover:text-black rounded-t-xl"
            onClick={() => setAdminOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/pride-admin/signup"
            className="block px-4 py-3 text-yellow-200 hover:bg-yellow-400 hover:text-black rounded-b-xl"
            onClick={() => setAdminOpen(false)}
          >
            Sign Up
          </Link>
        </>
      )}

      {isAuthenticated && isAdmin && (
        <>
          <Link
            to="/admin-dashboard"
            className="block px-4 py-3 text-yellow-200 hover:bg-yellow-400 hover:text-black rounded-t-xl"
            onClick={() => setAdminOpen(false)}
          >
             Dashboard
          </Link>
          <button
            onClick={() => {
              logout();
              setAdminOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-red-300 hover:bg-red-600 hover:text-white rounded-b-xl"
          >
            Logout
          </button>
        </>
      )}

      {isAuthenticated && isStaff && (
        <>
          <Link
            to="/staff-dashboard"
            className="block px-4 py-3 text-yellow-200 hover:bg-yellow-400 hover:text-black rounded-t-xl"
            onClick={() => setAdminOpen(false)}
          >
             Dashboard
          </Link>
          <button
            onClick={() => {
              logout();
              setAdminOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-red-300 hover:bg-red-600 hover:text-white rounded-b-xl"
          >
            Logout
          </button>
        </>
      )}
    </div>
  )}
</li>

        </ul>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="
          md:hidden mx-4 mt-3 mb-4 rounded 
          bg-black/70 backdrop-blur-md 
          p-6 shadow-lg border border-yellow-300/20
        ">
          <ul className="grid grid-cols-2 gap-3 text-lg font-semibold text-center text-white">

            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={toggleMenu}
                  className="block py-2 rounded bg-yellow-500 text-black font-bold"
                >
                  {item.name}
                </Link>
              </li>
            ))}

            {/* ADMIN DROPDOWN (MOBILE) */}
     {/* AUTH DROPDOWN */}
<li className="relative">
  <button
    onClick={toggleAdmin}
    className="flex items-center gap-2 hover:text-yellow-200 transition"
  >
    {isAuthenticated
      ? isAdmin
        ? "Admin"
        : "Staff"
      : "Account"}{" "}
    <ChevronDown size={20} />
  </button>

  {adminOpen && (
    <div className="
      absolute right-0 mt-2 w-48
      bg-black/90 border border-yellow-400/40
      rounded-xl shadow-xl backdrop-blur-md
    ">
      {!isAuthenticated && (
        <>
          <Link
            to="/login"
            className="block px-4 py-3 text-yellow-200 hover:bg-yellow-400 hover:text-black rounded-t-xl"
            onClick={() => setAdminOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block px-4 py-3 text-yellow-200 hover:bg-yellow-400 hover:text-black rounded-b-xl"
            onClick={() => setAdminOpen(false)}
          >
            Sign Up
          </Link>
        </>
      )}

      {isAuthenticated && isAdmin && (
        <>
          <Link
            to="/pride-admin/dashboard"
            className="block px-4 py-3 text-yellow-200 hover:bg-yellow-400 hover:text-black rounded-t-xl"
            onClick={() => setAdminOpen(false)}
          >
             Dashboard
          </Link>
          <button
            onClick={() => {
              logout();
              setAdminOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-red-300 hover:bg-red-600 hover:text-white rounded-b-xl"
          >
            Logout
          </button>
        </>
      )}

      {isAuthenticated && isStaff && (
        <>
          <Link
            to="/pride-staff/dashboard"
            className="block px-4 py-3 text-yellow-200 hover:bg-yellow-400 hover:text-black rounded-t-xl"
            onClick={() => setAdminOpen(false)}
          >
             Dashboard
          </Link>
          <button
            onClick={() => {
              logout();
              setAdminOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-red-300 hover:bg-red-600 hover:text-white rounded-b-xl"
          >
            Logout
          </button>
        </>
      )}
    </div>
  )}
</li>


            {/* SOCIAL */}
            <li className="col-span-2 flex justify-center gap-6 pt-3">
              <FaFacebook className="text-yellow-300 text-4xl" />
              <FaInstagram className="text-yellow-300 text-4xl" />
            </li>

          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
