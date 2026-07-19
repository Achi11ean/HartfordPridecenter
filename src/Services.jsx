import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   HARTFORD PRIDE CENTER — SERVICES PAGE
   "Community Poster" redesign to match HomePage:
   cream paper, flat pride-flag color blocks, ink outlines,
   hard offset shadows, huge Archivo type, rainbow marquee.
   All data-fetching, carousel, routing, and modal logic
   preserved.
   ───────────────────────────────────────────────────────────── */

const API = "https://singspacebackend.onrender.com";
const FLAG = ["#E40303", "#FF8C00", "#FFED00", "#008026", "#004DFF", "#750787"];

/* ink or white text for a given flag color */
const readableText = (hex) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#181310" : "#ffffff";
};

export default function Services({ prideId = 2, contactPath = "/contact" }) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API}/api/pride/${prideId}/services`);

        setServices(
          (res.data || []).map((s) => ({
            id: s.id,
            slug: s.slug, // ✅ REQUIRED
            title: s.title,
            desc: s.description,
            details: s.description,
            image: s.image_url,
            contact_name: s.contact_name,
            contact_email: s.contact_email,
            url: s.url,
            service_url: s.service_url,
          }))
        );
      } catch (err) {
        console.error("❌ Failed to load services", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [prideId]);

  // Hardcoded banner image to always include
  const staticBanner =
    "https://www.garlandcounty.org/ImageRepository/Document?documentId=260";

  // Build final array:
  const carouselImages = [
    staticBanner,
    ...services.map((s) => s.image).filter(Boolean),
  ];

  useEffect(() => {
    if (!carouselImages.length) return;

    const id = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % carouselImages.length);
    }, 5500);

    return () => clearInterval(id);
  }, [carouselImages.length]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FFFBF2] text-[#181310] hpc-body">
      {/* local styles: display font + marquee animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..900&display=swap');
        .hpc-display { font-family: 'Archivo', system-ui, sans-serif; font-stretch: 87%; }
        .hpc-body { font-family: 'Archivo', system-ui, sans-serif; }
        @keyframes hpc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .hpc-marquee-track { animation: hpc-marquee 26s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hpc-marquee-track { animation: none; }
        }
      `}</style>

      {/* ── FLAG STRIPE TOPBAR ── */}
      <div className="flex h-2.5 mt-10 w-full" aria-hidden="true">
        {FLAG.map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* ========================= HERO ========================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="text-center"
        >
          <p className="inline-block rounded-full bg-[#181310] text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-2">
            Powered by Karaoverse
          </p>

          <h1 className="hpc-display mx-auto mt-6 max-w-4xl font-black uppercase leading-[0.92] tracking-tight text-[clamp(2.2rem,7vw,4.5rem)]">
            Community programs
            <br />
            <span className="inline-block -rotate-1 rounded-lg px-3" style={{ backgroundColor: "#FFED00" }}>
              & services
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#4a4038] font-medium">
            Grow your voice, find support, build community — programming and
            services across Hartford and the Capital Region.
          </p>
        </motion.div>

        {/* ---- FRAMED CAROUSEL ---- */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
          className="mt-10 rounded-2xl border-2 border-[#181310] bg-white p-3 shadow-[8px_8px_0_#181310]"
        >
          <div className="relative h-[42vh] min-h-[260px] w-full overflow-hidden rounded-xl">
            <div
              className="absolute inset-0 flex transition-transform duration-[1200ms] ease-in-out"
              style={{
                width: `${carouselImages.length * 100}%`,
                transform: `translateX(-${carouselIndex * (100 / carouselImages.length)}%)`,
              }}
            >
              {carouselImages.map((src, index) => (
                <div
                  key={index}
                  className="h-full flex-shrink-0"
                  style={{ width: `${100 / carouselImages.length}%` }}
                >
                  <img src={src} alt="slide" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* flag stripe + dots */}
          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="flex h-2 flex-1 overflow-hidden rounded-full" aria-hidden="true">
              {FLAG.map((c) => (
                <div key={c} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
            {carouselImages.length > 1 && (
              <div className="flex shrink-0 items-center gap-1.5">
                {carouselImages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setCarouselIndex(i)}
                    className="h-3 w-3 rounded-full border-2 border-[#181310] transition-colors"
                    style={{
                      backgroundColor: i === carouselIndex ? "#181310" : "transparent",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ── RAINBOW MARQUEE (signature) ── */}
      <div className="overflow-hidden border-y-2 border-[#181310] bg-[#181310] py-3 sm:py-4">
        <div className="hpc-marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
              {["Support", "Programs", "Wellness", "Advocacy", "Connection", "Care"].map(
                (word, i) => (
                  <span key={word} className="flex items-center gap-8">
                    <span
                      className="hpc-display text-2xl sm:text-3xl font-black uppercase tracking-tight"
                      style={{ color: FLAG[i % FLAG.length] }}
                    >
                      {word}
                    </span>
                    <span className="text-white/60 text-xl">✦</span>
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ========================= SERVICE GRID ========================= */}
      {!loading && services.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#750787]">
              Explore
            </p>
            <h2 className="hpc-display mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight">
              Our programs
            </h2>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const hue = FLAG[i % FLAG.length];
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: (i % 3) * 0.05 }}
                >
                  <Link
                    to={`/services/${s.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[#181310] bg-white shadow-[6px_6px_0_#181310] transition-transform hover:-translate-y-1"
                  >
                    {/* flag-color top bar */}
                    <div className="h-3" style={{ backgroundColor: hue }} aria-hidden="true" />

                    {/* IMAGE */}
                    <div className="relative h-52 w-full overflow-hidden border-b-2 border-[#181310]">
                      <img
                        src={s.image}
                        alt={s.title}
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                      />
                    </div>

                    {/* TEXT */}
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="hpc-display text-xl font-black uppercase leading-tight tracking-tight">
                        {s.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm font-semibold leading-relaxed text-[#4a4038] line-clamp-2">
                        {s.desc}
                      </p>
                      <span
                        className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide"
                        style={{ color: hue }}
                      >
                        Explore →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================= NO DATA ========================= */}
      {!loading && services.length === 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="mx-auto inline-block rounded-2xl border-2 border-[#181310] bg-white px-8 py-10 shadow-[6px_6px_0_#181310]">
            <p className="hpc-display text-2xl font-black uppercase tracking-tight">
              ⭐️ No programs published yet
            </p>
            <p className="mt-2 text-sm font-semibold text-[#4a4038]">
              Come back soon!
            </p>
          </div>
        </div>
      )}

      {/* ========================= LOADING ========================= */}
      {loading && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
          <p className="hpc-display animate-pulse text-xl font-black uppercase tracking-wide text-[#4a4038]">
            Loading programs…
          </p>
        </div>
      )}

      {/* ========================= FOOTER QUOTE ========================= */}
      <section className="border-y-2 border-[#181310]" style={{ backgroundColor: "#FFED00" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <h2 className="hpc-display mx-auto max-w-3xl text-2xl sm:text-4xl font-black uppercase leading-tight tracking-tight">
              “Community isn't a concept — it's a lifeline.”
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg font-semibold leading-relaxed text-[#4a3d00]">
              Every profile. Every voice. Every story adds strength.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── BOTTOM FLAG STRIPE ── */}
      <div className="flex h-2.5 w-full" aria-hidden="true">
        {FLAG.map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* ========================= MODAL ========================= */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          style={{ background: "rgba(24, 19, 16, .55)" }}
          onClick={() => setSelectedService(null)}
        >
          <div
            className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border-2 border-[#181310] bg-white shadow-[8px_8px_0_#181310]"
            style={{ borderTopWidth: 8, borderTopColor: FLAG[0] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              aria-label="Close"
              className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#181310] bg-white text-lg font-black text-[#181310] transition-colors hover:bg-[#181310] hover:text-white"
              onClick={() => setSelectedService(null)}
            >
              ✕
            </button>

            {/* IMAGE */}
            {selectedService.image && (
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="h-64 w-full border-b-2 border-[#181310] object-cover"
              />
            )}

            <div className="p-6 sm:p-8">
              <h2 className="hpc-display text-3xl font-black uppercase tracking-tight">
                {selectedService.title}
              </h2>

              <p className="mt-5 whitespace-pre-line text-base leading-relaxed font-medium text-[#4a4038]">
                {selectedService.details}
              </p>

              {/* CONTACT INFO */}
              <div className="mt-6 space-y-1 text-sm font-semibold text-[#4a4038]">
                <p>
                  <strong>Contact Name:</strong> {selectedService.contact_name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedService.contact_email}
                </p>
              </div>

              {/* BUTTON LINKS */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {selectedService.service_url && (
                  <a
                    href={selectedService.service_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border-2 border-[#181310] bg-blue-500 px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-blue-600 hover:shadow-[2px_2px_0_#181310]"
                  >
                    Visit Service Page
                  </a>
                )}

                <Link
                  to={contactPath}
                  className="inline-flex items-center justify-center rounded-xl border-2 border-[#181310] bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-[#181310] shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}