// PrideCenterNavBar.jsx
// ✨ Renovated: right-side slide-in drawer with a rainbow reveal animation,
// works beautifully on desktop AND mobile, includes a Donate button → /support
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Menu, X, ChevronDown, Heart, ExternalLink } from "lucide-react";
import { useAuth } from "./AuthContext";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Funders", path: "/funders" },
  { name: "Events", path: "https://karaoverse.com/events", external: true },
  { name: "Pride", path: "/pride" },
  { name: "Contact", path: "/contact" },
];

// Rainbow accents — one per nav item, cycling through the flag 🌈
const RAINBOW = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

const GRADIENT_MAP = {
  "/": "from-pink-500 via-pink-600 to-pink-400",
  "/about": "from-orange-900 via-orange-800 to-black",
  "/services": "from-yellow-900 via-yellow-700 to-black",
  "/events": "from-green-900 via-green-800 to-black",
  "/ourteam": "from-blue-900 via-blue-800 to-black",
  "/sponsors": "from-indigo-900 via-indigo-800 to-black",
  "/contact": "from-violet-900 via-violet-800 to-black",
  "/funders": "from-yellow-900 via-yellow-800 to-black",
  "/pride": "from-fuchsia-900 via-purple-800 to-black",
  "/support": "from-rose-900 via-pink-800 to-black",
};

const ADMIN_GRADIENT =
  "from-red-800 via-yellow-600 via-green-600 via-blue-700 to-purple-800";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const NavBar = () => {
  const { isAuthenticated, isAdmin, isStaff, logout } = useAuth();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false); // desktop dropdown
  const drawerRef = useRef(null);
  const accountRef = useRef(null);

  /* ---------- gradient for the top bar ---------- */
  let navbarGradient = GRADIENT_MAP[location.pathname] || GRADIENT_MAP["/"];
  if (
    location.pathname.includes("admin") ||
    location.pathname.includes("staff")
  ) {
    navbarGradient = ADMIN_GRADIENT;
  }

  /* ---------- close drawer on route change ---------- */
  useEffect(() => {
    setDrawerOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  /* ---------- lock body scroll while drawer is open ---------- */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  /* ---------- Escape key closes everything ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setAccountOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- click outside closes the desktop dropdown ---------- */
  useEffect(() => {
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const dashboardPath = isAdmin ? "/admin-dashboard" : "/staff-dashboard";
  const roleLabel = isAuthenticated ? (isAdmin ? "Admin" : "Staff") : "Account";

  /* ================================================================ */

  return (
    <>
      {/* ---------- keyframes & motion styles ---------- */}
      <style>{`
        @keyframes rainbowSweep {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes drawerItemIn {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes rainbowRibbon {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25%      { transform: scale(1.12); }
          40%      { transform: scale(1); }
        }
        .rainbow-anim {
          background-size: 200% 200%;
          animation: rainbowSweep 6s linear infinite;
        }
        .drawer-item {
          opacity: 0;
          animation: drawerItemIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .rainbow-ribbon {
          transform-origin: top;
          animation: rainbowRibbon 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .donate-heart { animation: heartbeat 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rainbow-anim, .donate-heart { animation: none; }
          .drawer-item { animation-duration: 0.01s; }
          .rainbow-ribbon { animation-duration: 0.01s; }
        }
      `}</style>

      {/* ================= TOP BAR ================= */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 bg-gradient-to-br ${navbarGradient} border-b border-white/30 shadow-lg`}
      >
        {/* thin animated rainbow strip along the bottom edge */}
        <div
          className="absolute bottom-0 left-0 w-full h-[3px] rainbow-anim"
          style={{
            background:
              "linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center gap-4">
          {/* LOGO */}
          <Link to="/" className="inline-block shrink-0">
            <div className="inline-block rounded-lg overflow-hidden ring-1 ring-yellow-500/70 shadow-md">
              <img
                src="/PrideLogo3.jpg"
                alt="Pride Logo"
                className="block bg-white p-1 h-12 sm:h-16 md:h-20"
              />
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <ul className="hidden lg:flex items-center font-serif gap-6 text-xl font-bold text-white">
            {NAV_ITEMS.map((item, i) => {
              const active = !item.external && location.pathname === item.path;
              const linkClasses =
                "relative pb-1 transition-colors duration-200 hover:text-yellow-200 group";
              const underline = (
                <span
                  className={`absolute left-0 -bottom-0.5 h-[3px] rounded-full transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                  style={{ backgroundColor: RAINBOW[i % RAINBOW.length] }}
                />
              );
              return (
                <li key={item.name}>
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClasses}
                    >
                      {item.name}
                      {underline}
                    </a>
                  ) : (
                    <Link to={item.path} className={linkClasses}>
                      {item.name}
                      {underline}
                    </Link>
                  )}
                </li>
              );
            })}

            {/* DESKTOP ACCOUNT DROPDOWN */}
            <li className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((p) => !p)}
                className="flex items-center gap-1.5 hover:text-yellow-200 transition-colors"
                aria-expanded={accountOpen}
                aria-haspopup="true"
              >
                {roleLabel}
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-black/90 border border-yellow-400/40 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-3 text-yellow-200 hover:bg-yellow-400 hover:text-black transition-colors"
                        onClick={() => setAccountOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-3 text-yellow-200 hover:bg-yellow-400 hover:text-black transition-colors"
                        onClick={() => setAccountOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to={dashboardPath}
                        className="block px-4 py-3 text-yellow-200 hover:bg-yellow-400 hover:text-black transition-colors"
                        onClick={() => setAccountOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setAccountOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-red-300 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>
          </ul>

          {/* RIGHT SIDE: Donate + menu button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* DONATE — always visible */}
            <Link
              to="/support"
              className="rainbow-anim flex items-center gap-2 px-4 py-2 sm:px-5 rounded-full font-bold text-white text-sm sm:text-base shadow-lg ring-2 ring-white/40 hover:ring-white/80 hover:scale-105 transition-all duration-200"
              style={{
                background:
                  "linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
              }}
            >
              <Heart size={18} className="donate-heart fill-white" />
              Donate
            </Link>

            {/* HAMBURGER — opens the side drawer (visible below lg) */}
            <button
              className="lg:hidden flex items-center gap-2 text-yellow-200 hover:text-white transition-colors"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
            >
              <Menu size={30} />
              <span className="hidden sm:inline text-lg font-semibold">
                Menu
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ================= OVERLAY ================= */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ================= SIDE DRAWER (slides in from the RIGHT) ================= */}
      <aside
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[70] h-full w-[85vw] max-w-sm bg-neutral-950/95 backdrop-blur-xl shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* rainbow ribbon on the drawer's left edge */}
        {drawerOpen && (
          <div
            className="rainbow-ribbon absolute left-0 top-0 h-full w-1.5"
            style={{
              background:
                "linear-gradient(180deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899)",
            }}
          />
        )}

        {/* drawer header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10">
          <span
            className="rainbow-anim text-2xl font-extrabold font-serif bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
            }}
          >
            Menu
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-full text-yellow-200 hover:bg-white/10 hover:rotate-90 transition-all duration-300"
            aria-label="Close menu"
          >
            <X size={26} />
          </button>
        </div>

        {/* nav links — staggered rainbow entrance */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <ul className="space-y-1.5">
            {NAV_ITEMS.map((item, i) => {
              const color = RAINBOW[i % RAINBOW.length];
              const active = !item.external && location.pathname === item.path;
              const base =
                "drawer-item flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-semibold text-white/90 hover:text-white hover:bg-white/10 hover:translate-x-1 transition-all duration-200";
              const style = drawerOpen
                ? { animationDelay: `${0.08 + i * 0.06}s` }
                : {};
              const dot = (
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 shadow"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}`,
                  }}
                />
              );
              return (
                <li key={item.name}>
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={base}
                      style={style}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {dot}
                      {item.name}
                      <ExternalLink size={15} className="ml-auto opacity-60" />
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className={`${base} ${
                        active ? "bg-white/10 text-white" : ""
                      }`}
                      style={style}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {dot}
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* divider */}
          <div className="my-5 h-px bg-white/10" />

          {/* account section */}
          <div
            className="drawer-item space-y-1.5"
            style={drawerOpen ? { animationDelay: "0.55s" } : {}}
          >
            <p className="px-4 text-xs uppercase tracking-widest text-white/40 font-bold">
              {roleLabel}
            </p>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-xl text-yellow-200 font-semibold hover:bg-yellow-400 hover:text-black transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-3 rounded-xl text-yellow-200 font-semibold hover:bg-yellow-400 hover:text-black transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={dashboardPath}
                  className="block px-4 py-3 rounded-xl text-yellow-200 font-semibold hover:bg-yellow-400 hover:text-black transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setDrawerOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-red-300 font-semibold hover:bg-red-600 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>

        {/* drawer footer: Donate + socials */}
        <div
          className="drawer-item px-6 pb-6 pt-4 border-t border-white/10 space-y-4"
          style={drawerOpen ? { animationDelay: "0.65s" } : {}}
        >
          <Link
            to="/support"
            onClick={() => setDrawerOpen(false)}
            className="rainbow-anim flex items-center justify-center gap-2 w-full py-3 rounded-full font-bold text-white text-lg shadow-lg ring-2 ring-white/30 hover:ring-white/70 hover:scale-[1.02] transition-all duration-200"
            style={{
              background:
                "linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
            }}
          >
            <Heart size={20} className="donate-heart fill-white" />
            Donate
          </Link>

          <div className="flex justify-center gap-8">
            <a href="#" aria-label="Facebook">
              <FaFacebook className="text-yellow-300 text-3xl hover:text-white hover:scale-110 transition-all" />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram className="text-yellow-300 text-3xl hover:text-white hover:scale-110 transition-all" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavBar;