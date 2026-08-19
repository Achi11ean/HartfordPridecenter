import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaHandHoldingHeart,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaImages,
} from "react-icons/fa";

/* ─────────────────────────────────────────────────────────────
   PAST EVENTS — hardcoded retrospectives with photo galleries.

   ADDING AN EVENT:
   1. Copy MissConnecticut.jsx, change the values.
   2. Import it below.
   3. Add it to the EVENTS array.
   That's it — layout, colors, and gallery behavior are handled here.
   ───────────────────────────────────────────────────────────── */

import missConnecticut from "./MissConnecticut";
// import kalosGala from "./KalosGala";
// import prideInThePark from "./PrideInThePark";

const EVENTS = [
  missConnecticut,
  // kalosGala,
  // prideInThePark,
];

const FLAG = ["#E40303", "#FF8C00", "#FFED00", "#008026", "#004DFF", "#750787"];

/* images shown per "page" of the gallery */
const PAGE_SIZE = 10;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

/* ── helpers ─────────────────────────────────────────────── */

function parseDateOnly(s) {
  if (!s) return null;
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/* "2025-09-20" → "September 20, 2025"; anything else passes through */
function formatEventDate(raw) {
  const d = parseDateOnly(raw);
  if (!d) return raw || null;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeImages(images) {
  return (Array.isArray(images) ? images : [])
    .map((img) => (typeof img === "string" ? { src: img, alt: "" } : img))
    .filter((img) => img && img.src);
}

export default function PastEvents() {
  /* newest first; undated events fall to the bottom */
  const ordered = useMemo(
    () =>
      [...EVENTS].sort((a, b) => {
        const da = parseDateOnly(a.date);
        const db = parseDateOnly(b.date);
        if (da && db) return db - da;
        if (da) return -1;
        if (db) return 1;
        return 0;
      }),
    []
  );

  if (ordered.length === 0) return null;

  return (
    <section
      id="past-events"
      className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20 scroll-mt-24"
    >
      {/* styles this component needs on its own */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..900&display=swap');
        .hpc-display { font-family: 'Archivo', system-ui, sans-serif; font-stretch: 87%; }
        .pe-scroller { scrollbar-width: thin; scrollbar-color: #181310 transparent; }
        .pe-scroller::-webkit-scrollbar { height: 8px; }
        .pe-scroller::-webkit-scrollbar-track { background: transparent; }
        .pe-scroller::-webkit-scrollbar-thumb { background: #181310; border-radius: 999px; }
      `}</style>

      <motion.div {...fadeUp}>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#004DFF]">
          Look back
        </p>
        <h2 className="hpc-display mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight">
          Where we've been
        </h2>
        <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-[#4a4038]">
          Nights the community showed up for each other — and what they raised.
        </p>
      </motion.div>

      <div className="mt-10 space-y-12">
        {ordered.map((event, i) => (
          <PastEventPanel key={event.id || event.name} event={event} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ── One past event ──────────────────────────────────────── */
function PastEventPanel({ event, index }) {
  const accent = event.accent || FLAG[index % FLAG.length];
  const light = accent === "#FFED00";
  const ink = light ? "#181310" : "#FFFFFF";
  const dateLabel = formatEventDate(event.date);

  return (
    <motion.article
      {...fadeUp}
      className="overflow-hidden rounded-2xl border-2 border-[#181310] bg-white shadow-[8px_8px_0_#181310]"
    >
      <div className="h-3" style={{ backgroundColor: accent }} aria-hidden="true" />

      <div className="p-6 sm:p-8">
        {/* title + date */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h3 className="hpc-display max-w-2xl text-2xl sm:text-4xl font-black uppercase leading-tight tracking-tight">
            {event.name}
          </h3>

          {dateLabel && (
            <span
              className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-[#181310] px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0_#181310]"
              style={{ backgroundColor: accent, color: ink }}
            >
              <FaCalendarAlt className="text-[10px]" /> {dateLabel}
            </span>
          )}
        </div>

        {/* cause + location */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold text-[#4a4038]">
          {event.cause && (
            <span className="inline-flex items-center gap-2">
              <FaHandHoldingHeart className="text-xs" style={{ color: accent }} />
              {event.cause}
            </span>
          )}
          {event.location && (
            <span className="inline-flex items-center gap-2">
              <FaMapMarkerAlt className="text-xs opacity-60" />
              {event.location}
            </span>
          )}
        </div>

        {event.blurb && (
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-[#4a4038]">
            {event.blurb}
          </p>
        )}

        <EventGallery images={event.images} accent={accent} eventName={event.name} />
      </div>
    </motion.article>
  );
}

/* ── Paged horizontal gallery ────────────────────────────── */
function EventGallery({ images, accent, eventName }) {
  const shots = useMemo(() => normalizeImages(images), [images]);
  const [page, setPage] = useState(0);
  const [lightbox, setLightbox] = useState(null); // index into `shots`
  const scrollerRef = useRef(null);

  const pageCount = Math.ceil(shots.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const visible = shots.slice(start, start + PAGE_SIZE);
  const light = accent === "#FFED00";
  const ink = light ? "#181310" : "#FFFFFF";

  /* snap back to the left edge whenever the page changes */
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: 0, behavior: "smooth" });
  }, [page]);

  /* lightbox keyboard controls + background scroll lock */
  useEffect(() => {
    if (lightbox === null) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => Math.min(shots.length - 1, i + 1));
      if (e.key === "ArrowLeft") setLightbox((i) => Math.max(0, i - 1));
    };

    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, shots.length]);

  if (shots.length === 0) return null;

  return (
    <div className="mt-6">
      {/* gallery toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#9c9089]">
          <FaImages /> {shots.length} {shots.length === 1 ? "photo" : "photos"}
        </span>

        {pageCount > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous 10 photos"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#181310] bg-white shadow-[3px_3px_0_#181310] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#181310] disabled:pointer-events-none disabled:opacity-30"
            >
              <FaChevronLeft className="text-sm" />
            </button>

            <span className="min-w-[5.5rem] text-center text-xs font-black uppercase tracking-widest">
              {page + 1} / {pageCount}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page === pageCount - 1}
              aria-label="Next 10 photos"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#181310] shadow-[3px_3px_0_#181310] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#181310] disabled:pointer-events-none disabled:opacity-30"
              style={{ backgroundColor: accent, color: ink }}
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        )}
      </div>

      {/* scroll strip */}
      <div
        ref={scrollerRef}
        className="pe-scroller mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
      >
        {visible.map((img, i) => {
          const flatIndex = start + i;
          return (
            <button
              key={img.src}
              type="button"
              onClick={() => setLightbox(flatIndex)}
              className="group relative w-64 shrink-0 snap-start overflow-hidden rounded-xl border-2 border-[#181310] bg-[#F3EDE1] shadow-[4px_4px_0_#181310] transition-transform hover:-translate-y-1 sm:w-72"
            >
              <img
                src={img.src}
                alt={img.alt || `${eventName} — photo ${flatIndex + 1}`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <span
                className="absolute left-2 top-2 rounded-full border-2 border-[#181310] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest"
                style={{ backgroundColor: accent, color: ink }}
              >
                {flatIndex + 1}
              </span>
            </button>
          );
        })}
      </div>

      {pageCount > 1 && (
        <p className="mt-1 text-[11px] font-semibold text-[#9c9089]">
          Showing {start + 1}–{Math.min(start + PAGE_SIZE, shots.length)} of {shots.length}. Swipe
          the strip, or use the arrows for the next 10.
        </p>
      )}

      {/* lightbox */}
      {lightbox !== null && shots[lightbox] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181310]/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${eventName} photo viewer`}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white transition-colors hover:bg-white hover:text-[#181310]"
          >
            <FaTimes />
          </button>

          {lightbox > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => Math.max(0, i - 1));
              }}
              aria-label="Previous photo"
              className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white transition-colors hover:bg-white hover:text-[#181310] sm:left-6"
            >
              <FaChevronLeft />
            </button>
          )}

          {lightbox < shots.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => Math.min(shots.length - 1, i + 1));
              }}
              aria-label="Next photo"
              className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white transition-colors hover:bg-white hover:text-[#181310] sm:right-6"
            >
              <FaChevronRight />
            </button>
          )}

          <figure
            className="max-h-full w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={shots[lightbox].src}
              alt={shots[lightbox].alt || `${eventName} — photo ${lightbox + 1}`}
              className="mx-auto max-h-[78vh] w-auto rounded-xl border-2 border-white object-contain"
            />
            <figcaption className="mt-4 text-center text-sm font-semibold text-white/70">
              {shots[lightbox].alt || eventName}
              <span className="ml-2 text-white/40">
                {lightbox + 1} / {shots.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}