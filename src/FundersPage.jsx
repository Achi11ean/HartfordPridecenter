import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   HARTFORD PRIDE CENTER — COMMUNITY FUNDERS PAGE
   "Community Poster" redesign to match HomePage:
   cream paper, flat pride-flag color blocks, ink outlines,
   hard offset shadows, huge Archivo type, rainbow marquee.
   Fetch/filter/loading logic preserved.
   ───────────────────────────────────────────────────────────── */

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;
const FLAG = ["#E40303", "#FF8C00", "#FFED00", "#008026", "#004DFF", "#750787"];

export default function FundersPage() {
  const [funders, setFunders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH FUNDERS ---------------- */
  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API}/api/pride/${PRIDE_ID}/funders`)
      .then((res) => {
        // only show active funders
        setFunders((res.data || []).filter((f) => f.is_active));
      })
      .catch(() => setFunders([]))
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF2] text-[#181310]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..900&display=swap');
        `}</style>
        <p
          className="animate-pulse text-xl font-black uppercase tracking-wide"
          style={{ fontFamily: "'Archivo', system-ui, sans-serif", fontStretch: "87%" }}
        >
          Loading funders…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-[#181310] overflow-x-hidden hpc-body">
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
      <div className="flex h-2.5 mt-20 w-full" aria-hidden="true">
        {FLAG.map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* ================= HERO ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p className="inline-block rounded-full bg-[#181310] text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-2">
              With gratitude
            </p>

            <h1 className="hpc-display mt-6 font-black uppercase leading-[0.92] tracking-tight text-[clamp(2.4rem,8vw,5rem)]">
              Our community
              <br />
              <span className="inline-block -rotate-1 rounded-lg px-3 text-white" style={{ backgroundColor: "#008026" }}>
                funders.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#4a4038] font-medium">
              Thank you to the organizations whose generosity helps power Pride
              services, visibility, and community impact.
            </p>
          </motion.div>

          {/* framed banner */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative rotate-2 rounded-2xl border-2 border-[#181310] bg-white p-3 shadow-[8px_8px_0_#181310]">
              <div
                className="h-52 sm:h-64 w-full rounded-xl bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac')",
                }}
                role="img"
                aria-label="Community Pride support"
              />
              <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full" aria-hidden="true">
                {FLAG.map((c) => (
                  <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div
              className="absolute -bottom-4 -right-2 rotate-3 rounded-full border-2 border-[#181310] px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0_#181310]"
              style={{ backgroundColor: "#FFED00" }}
            >
              Thank You
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RAINBOW MARQUEE (signature) ── */}
      <div className="overflow-hidden border-y-2 border-[#181310] bg-[#181310] py-3 sm:py-4">
        <div className="hpc-marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
              {["Generous", "Visible", "Impact", "Grateful", "Together", "Proud"].map(
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

      {/* ================= CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        {funders.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#750787]">
                Standing with Pride
              </p>
              <h2 className="hpc-display mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight">
                Who powers us
              </h2>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {funders.map((f, i) => {
                const hue = FLAG[i % FLAG.length];
                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: (i % 4) * 0.05 }}
                    className="flex flex-col overflow-hidden rounded-2xl border-2 border-[#181310] bg-white shadow-[6px_6px_0_#181310] transition-transform hover:-translate-y-1"
                  >
                    {/* flag-color top bar */}
                    <div className="h-3" style={{ backgroundColor: hue }} aria-hidden="true" />

                    {/* LOGO AREA */}
                    <div className="flex h-32 items-center justify-center border-b-2 border-[#181310] bg-[#FFFBF2] p-5">
                      {f.logo_url ? (
                        <img
                          src={f.logo_url}
                          alt={f.organization_name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="hpc-display text-center text-base font-black uppercase leading-tight tracking-tight">
                          {f.organization_name}
                        </span>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-1 flex-col p-5 text-center">
                      <h3 className="hpc-display text-lg font-black uppercase leading-tight tracking-tight">
                        {f.organization_name}
                      </h3>

                      {f.details && (
                        <p className="mt-2 mb-4 max-h-[150px] overflow-y-auto text-sm font-semibold leading-relaxed text-[#4a4038]">
                          {f.details}
                        </p>
                      )}

                      {f.website_url && (
                        <a
                          href={f.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#181310] px-4 py-2.5 text-sm font-black uppercase tracking-wide shadow-[3px_3px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#181310]"
                          style={{ backgroundColor: hue, color: "#ffffff" }}
                        >
                          🌐 Visit Website
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto inline-block rounded-2xl border-2 border-[#181310] bg-white px-8 py-10 shadow-[6px_6px_0_#181310]">
              <p className="hpc-display text-2xl font-black uppercase tracking-tight">
                No funders listed yet
              </p>
              <p className="mt-2 text-sm font-semibold text-[#4a4038]">
                Check back soon.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ================= CTA ================= */}
      <section className="border-y-2 border-[#181310]" style={{ backgroundColor: "#FFED00" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <h2 className="hpc-display mx-auto max-w-3xl text-2xl sm:text-4xl font-black uppercase leading-tight tracking-tight">
              “Support creates visibility. Visibility creates change.”
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg font-semibold leading-relaxed text-[#4a3d00]">
              We are grateful for every organization that stands with Pride.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#181310] bg-white px-8 py-4 text-base font-black uppercase tracking-wide shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310]"
              >
                Become a Community Funder
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BOTTOM FLAG STRIPE ── */}
      <div className="flex h-2.5 w-full" aria-hidden="true">
        {FLAG.map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  );
}