import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaExternalLinkAlt,
  FaMicrophoneAlt,
  FaTicketAlt,
  FaRedoAlt,
  FaUsers,
  FaTimes,
} from "react-icons/fa";
import PastEvents from "./PastEvents";
/* ─────────────────────────────────────────────────────────────
   EVENTS — "Community Poster" style, matched to HomePage.
   GET /karaokeevents/pride/2  →  KaraokeEvent.to_dict()
   ───────────────────────────────────────────────────────────── */

const API_BASE = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2; // Capital City Pride

/* If you have a detail route like /events/:slug, set this to "/events".
   Leave "" and cards open the in-page detail modal instead. */
const EVENT_DETAIL_BASE = "";

const FLAG = ["#E40303", "#FF8C00", "#FFED00", "#008026", "#004DFF", "#750787"];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/* ── date + time helpers ─────────────────────────────────── */

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/* "YYYY-MM-DD" → local Date (built from parts, so no UTC shift) */
function parseDateOnly(s) {
  if (!s) return null;
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/* Date → "YYYY-MM-DD" in LOCAL time (toISOString would shift the day) */
function isoDate(d) {
  if (!d) return undefined;
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/* "HH:MM" → "8:00 PM" */
function formatTime(hhmm) {
  if (!hhmm) return null;
  const m = String(hhmm).match(/^(\d{1,2}):(\d{2})/);
  if (!m) return String(hhmm);
  let h = Number(m[1]);
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m[2]} ${suffix}`;
}

function timeRange(e) {
  const start = formatTime(e.start_time);
  const end = formatTime(e.end_time);
  if (!start) return null;
  return end ? `${start} – ${end}` : start;
}

function titleCase(s) {
  return String(s)
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

/* nth (or last) weekday of a month, on or after `from` */
function nextMonthlyOrdinal(from, weekdayIdx, ordinalWord) {
  const ORDINALS = {
    first: 1,
    "1st": 1,
    second: 2,
    "2nd": 2,
    third: 3,
    "3rd": 3,
    fourth: 4,
    "4th": 4,
  };
  const isLast = ordinalWord === "last";
  const n = ORDINALS[ordinalWord] || 1;

  for (let i = 0; i < 14; i++) {
    const base = new Date(from.getFullYear(), from.getMonth() + i, 1);
    let d;
    if (isLast) {
      d = new Date(base.getFullYear(), base.getMonth() + 1, 0); // last day of month
      d.setDate(d.getDate() - ((d.getDay() - weekdayIdx + 7) % 7));
    } else {
      d = new Date(base);
      d.setDate(1 + ((weekdayIdx - base.getDay() + 7) % 7) + (n - 1) * 7);
      if (d.getMonth() !== base.getMonth()) continue; // e.g. no 5th Thursday
    }
    if (d >= from) return d;
  }
  return null;
}

/* The date this event actually next happens.
   One-offs use `date`; recurring events get their next occurrence computed. */
function nextOccurrence(e) {
  const today = startOfToday();

  // ─────────────────────────────────────────────
  // ONE-TIME EVENT
  // Must have a real explicit date.
  // ─────────────────────────────────────────────
  if (!e.recurring) {
    return parseDateOnly(e.date);
  }

  // ─────────────────────────────────────────────
  // RECURRING EVENT
  // Calculate its NEXT occurrence instead of
  // blindly using an old explicit date.
  // ─────────────────────────────────────────────
  if (!e.recurring_day) return null;

  const weekdayIdx = WEEKDAYS.indexOf(
    String(e.recurring_day).trim().toLowerCase()
  );

  if (weekdayIdx < 0) return null;

  const pattern = String(e.recurrence_pattern || "weekly").toLowerCase();

  // Monthly
  const ordinal = pattern.match(
    /\b(1st|first|2nd|second|3rd|third|4th|fourth|last)\b/
  );

  if (ordinal || /month/.test(pattern)) {
    return nextMonthlyOrdinal(today, weekdayIdx, ordinal ? ordinal[1] : "first");
  }

  // Weekly / bi-weekly
  const d = new Date(today);

  d.setDate(d.getDate() + ((weekdayIdx - d.getDay() + 7) % 7));

  if (/bi-?weekly|every other|fortnight|two weeks|2 weeks/.test(pattern)) {
    const anchor = parseDateOnly(e.recurrence_anchor_date);

    if (anchor) {
      const weeks = Math.round((d - anchor) / (7 * 24 * 60 * 60 * 1000));

      if (Math.abs(weeks % 2) === 1) {
        d.setDate(d.getDate() + 7);
      }
    }
  }

  return d;
}

function recurrenceLabel(e) {
  if (!e.recurring) return null;
  const day = e.recurring_day ? titleCase(e.recurring_day) : null;
  const raw = String(e.recurrence_pattern || "").trim();

  if (!raw) return day ? `Every ${day}` : "Recurring";

  const p = raw.toLowerCase();
  if (/^weekly$/.test(p)) return day ? `Every ${day}` : "Weekly";
  if (/bi-?weekly|every other|fortnight/.test(p)) {
    return day ? `Every other ${day}` : "Every other week";
  }

  const label = titleCase(raw);
  if (day && !p.includes(day.toLowerCase())) return `${label} · ${day}s`;
  return label;
}

const eventTypes = (e) =>
  (Array.isArray(e.event_type) ? e.event_type : [])
    .map((t) => String(t).trim())
    .filter(Boolean);

function fullAddress(e) {
  return [e.address, e.city, e.state].filter(Boolean).join(", ");
}

function mapsUrl(e) {
  const q = [e.venue_name, e.address, e.city, e.state].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function longDate(d) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* ── links buried in free-text notes ─────────────────────────
   Organizers paste raw URLs into `notes`. We pull them out,
   give each one a human label, and render them as real links
   instead of showing a wall of https://...
   ───────────────────────────────────────────────────────────── */

/* fresh regex per call so a stale lastIndex can never bite us */
const urlRe = () => /\b(?:https?:\/\/|www\.)[^\s<>"'()[\]]+/gi;

function normalizeHref(raw) {
  const trimmed = String(raw).replace(/[.,;:!?)\]}'"]+$/, "");
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/* "Tickets" when it's a ticketing host, something recognizable
   when it's a known platform, "More info" otherwise. */
function linkLabel(href) {
  let host = "";
  let path = "";
  try {
    const u = new URL(href);
    host = u.hostname.replace(/^www\./, "").toLowerCase();
    path = u.pathname.toLowerCase();
  } catch {
    return "More info";
  }

  if (
    /eventbrite|ticketmaster|tickettailor|seetickets|showclix|etix|axs\.com|dice\.fm|universe\.com|posh\.vip|prekindle|eventzilla|ticketweb|withfriends/.test(
      host
    ) ||
    /^tickets?\./.test(host) ||
    /\/(tickets?|rsvp|register|checkout)\b/.test(path)
  ) {
    return "Tickets";
  }

  if (/facebook\.com|fb\.me|fb\.com/.test(host)) return "Facebook event";
  if (/instagram\.com/.test(host)) return "Instagram";
  if (/linktr\.ee|beacons\.ai|lnk\.bio|linkin\.bio/.test(host)) return "All links";
  if (/gofundme|donorbox|givebutter|paypal\.me|venmo\.com/.test(host)) return "Donate";
  if (/maps\.app\.goo\.gl|goo\.gl\/maps/.test(host + path)) return "Map";
  if (/karaoverse\.com/.test(host)) return "View on Karaoverse";

  return "More info";
}

/* URL-ish fields the record might also carry */
const LINK_FIELDS = [
  "website",
  "website_url",
  "url",
  "link",
  "info_url",
  "more_info_url",
  "ticket_url",
  "tickets_url",
  "facebook_url",
  "instagram_url",
];

/* Every link worth a button: scraped out of `notes`, plus any URL
   fields on the record. `eventbrite_url` is excluded — it already
   has its own dedicated button. */
function eventLinks(event) {
  if (!event) return [];

  const fromNotes = String(event.notes || "").match(urlRe()) || [];

  const fromFields = LINK_FIELDS.filter(
    (f) =>
      typeof event[f] === "string" && /^(https?:\/\/|www\.)/i.test(event[f].trim())
  ).map((f) => event[f].trim());

  const key = (h) => h.toLowerCase().replace(/\/+$/, "");
  const skip = new Set(event.eventbrite_url ? [key(event.eventbrite_url)] : []);
  const seen = new Set();

  const tagged = [
    ...fromNotes.map((raw) => ({ raw, source: "notes" })),
    ...fromFields.map((raw) => ({ raw, source: "field" })),
  ];

  return tagged.reduce((out, { raw, source }) => {
    const href = normalizeHref(raw);
    const k = key(href);
    if (skip.has(k) || seen.has(k)) return out;
    seen.add(k);
    out.push({ href, label: linkLabel(href), source });
    return out;
  }, []);
}

/* Notes rendered with every bare URL swapped for a labeled link.
   Done in place rather than stripping the URL out, so a sentence like
   "Get tickets at <url> — see you there!" keeps reading properly. */
function LinkedNotes({ text, className = "", accent = "#004DFF", onLinkClick }) {
  if (!text) return null;

  const src = String(text);
  const nodes = [];
  const re = urlRe();
  let last = 0;
  let key = 0;
  let m;

  while ((m = re.exec(src)) !== null) {
    if (m.index > last) nodes.push(src.slice(last, m.index));

    // punctuation the match swallowed belongs to the sentence, not the URL
    const cleaned = m[0].replace(/[.,;:!?)\]}'"]+$/, "");
    const tail = m[0].slice(cleaned.length);
    const href = normalizeHref(cleaned);

    nodes.push(
      <a
        key={`lk${key++}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onLinkClick}
        title={href}
        className="font-black underline decoration-2 underline-offset-2 hover:opacity-70"
        style={{ color: accent }}
      >
        {linkLabel(href)}
      </a>
    );

    if (tail) nodes.push(tail);
    last = re.lastIndex;
  }

  if (last < src.length) nodes.push(src.slice(last));

  return <p className={className}>{nodes}</p>;
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [showPast, setShowPast] = useState(false);

  /* the event currently open in the detail modal: { raw, when, color } */
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setStatus("loading");
        const res = await fetch(`${API_BASE}/karaokeevents/pride/${PRIDE_ID}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
        setStatus("ready");
      } catch (err) {
        if (err.name === "AbortError") return;
        setErrorMsg(err.message || "Something went wrong");
        setStatus("error");
      }
    })();

    return () => controller.abort();
  }, []);

  /* Re-sort by real next occurrence — the API's date-asc-nulls-last
     ordering buries recurring events, which have no `date` at all. */
  const upcoming = useMemo(() => {
    const today = startOfToday();

    return events
      .map((raw) => ({ raw, when: nextOccurrence(raw) }))

      // STRICT:
      // no valid date = don't show
      // old date = don't show
      .filter(
        ({ when }) =>
          when && when >= today && when.getFullYear() === today.getFullYear()
      )

      .sort((a, b) => a.when - b.when);
  }, [events]);

  const nextUp = upcoming[0] || null;

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-[#181310] font-sans overflow-x-hidden">
      {/* local styles: display font + marquee animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..900&display=swap');
        .hpc-display { font-family: 'Archivo', system-ui, sans-serif; font-stretch: 87%; }
        .hpc-body { font-family: 'Archivo', system-ui, sans-serif; }
        @keyframes hpc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .hpc-marquee-track { animation: hpc-marquee 26s linear infinite; }
        .hpc-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (prefers-reduced-motion: reduce) {
          .hpc-marquee-track { animation: none; }
        }
      `}</style>

      {/* ── FLAG STRIPE TOPBAR ── */}
      <div className="flex h-2.5 w-full" aria-hidden="true">
        {FLAG.map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* ── HERO ── */}
      <section className="max-w-6xl mt-16 mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-20">
        <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-10 lg:gap-14 items-center">
          {/* headline side */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p className="inline-block rounded-full bg-[#181310] text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-2">
              Capital City Pride · Hartford, CT
            </p>

            <h1 className="hpc-display mt-6 font-black uppercase leading-[0.92] tracking-tight text-[clamp(2.6rem,9vw,5.5rem)]">
              Pride
              <br />
              <span
                className="inline-block -rotate-1 rounded-lg px-3"
                style={{ backgroundColor: "#FFED00" }}
              >
                events
              </span>
              <br />
              all
              <span
                className="mx-2 inline-block rotate-1 rounded-lg px-3 text-white"
                style={{ backgroundColor: "#008026" }}
              >
                year.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#4a4038] font-medium">
              Drag shows, karaoke nights, support groups, and street-filling
              celebrations — one-offs and the weeklies you can count on.
              Everything here is live from our events board.
            </p>
          </motion.div>

          {/* next-up poster side */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-sm lg:max-w-none"
          >
            <div className="relative rotate-2 rounded-2xl border-2 border-[#181310] bg-white p-3 shadow-[8px_8px_0_#181310]">
              <NextUpPanel
                status={status}
                entry={nextUp}
                onOpen={() => nextUp && setSelected({ ...nextUp, color: "#FFED00" })}
              />
              <div
                className="mt-3 flex h-2 w-full overflow-hidden rounded-full"
                aria-hidden="true"
              >
                {FLAG.map((c) => (
                  <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* sticker badges */}
            <div
              className="absolute -top-4 -left-3 -rotate-6 rounded-full border-2 border-[#181310] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_#181310]"
              style={{ backgroundColor: "#750787" }}
            >
              Next up
            </div>
            <div
              className="absolute -bottom-4 -right-2 rotate-3 rounded-full border-2 border-[#181310] px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0_#181310]"
              style={{ backgroundColor: "#FF8C00" }}
            >
              All ages welcome
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RAINBOW MARQUEE (signature) ── */}
      <div className="overflow-hidden border-y-2 border-[#181310] bg-[#181310] py-3 sm:py-4">
        <div className="hpc-marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
              {["Karaoke", "Drag", "Dancing", "Gathering", "Marching", "Singing"].map(
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

      {/* ── EVENT LIST ── */}
      <section
        id="events"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 scroll-mt-24"
      >
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#750787]">
              On the calendar
            </p>
            <h2 className="hpc-display mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight">
              What's coming up
            </h2>
          </div>

          {status === "ready" && upcoming.length > 0 && (
            <span className="rounded-full border-2 border-[#181310] bg-white px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0_#181310]">
              {upcoming.length} {upcoming.length === 1 ? "event" : "events"}
            </span>
          )}
        </motion.div>

        <div className="mt-8">
          {status === "loading" && <EventSkeletonGrid />}

          {status === "error" && (
            <div className="rounded-2xl border-2 border-[#181310] bg-white p-8 shadow-[6px_6px_0_#181310]">
              <div className="h-3 w-16 rounded-full" style={{ backgroundColor: "#E40303" }} />
              <h3 className="hpc-display mt-4 text-xl font-black uppercase tracking-tight">
                The events board didn't load
              </h3>
              <p className="mt-2 text-sm font-semibold text-[#4a4038]">
                {errorMsg}. Refresh the page to try again, or head straight to
                Karaoverse for the full listing.
              </p>
              <a
                href="https://karaoverse.com/venue/capital-city-pride"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-[#181310] bg-white px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310]"
              >
                Open Karaoverse <FaExternalLinkAlt className="text-xs" />
              </a>
            </div>
          )}

          {status === "ready" && upcoming.length === 0 && (
            <div className="rounded-2xl border-2 border-[#181310] bg-white p-8 text-center shadow-[6px_6px_0_#181310]">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#181310] text-2xl text-white"
                style={{ backgroundColor: "#004DFF" }}
              >
                <FaCalendarAlt />
              </div>
              <h3 className="hpc-display mt-4 text-2xl font-black uppercase tracking-tight">
                Nothing on the board yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-[#4a4038]">
                The next round of events is still being booked. Check our past
                events, or head straight to Karaoverse to find local community
                events in your area.
              </p>
            </div>
          )}

          {status === "ready" && upcoming.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map(({ raw, when }, i) => (
                <EventCard
                  key={raw.id}
                  event={raw}
                  when={when}
                  index={i}
                  onOpen={setSelected}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <PastEvents />

      {/* ── PROUD PARTNER ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
        <motion.div {...fadeUp}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E40303]">
            Proud partner
          </p>
          <h2 className="hpc-display mt-2 text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Built with Karaoverse
          </h2>
        </motion.div>

        <div className="mt-8 grid lg:grid-cols-[1fr,1fr] gap-10 lg:gap-14 items-center">
          <motion.div
            {...fadeUp}
            className="rounded-2xl border-2 border-[#181310] bg-white p-2 shadow-[8px_8px_0_#181310]"
          >
            <video
              src="/Video.mov"
              autoPlay
              loop
              muted
              playsInline
              poster="/Video.mov"
              className="w-full rounded-xl object-cover"
            >
              <img src="/banner.jpeg" alt="Karaoverse" className="w-full rounded-xl" />
            </video>
            <div
              className="mt-2 flex h-2 w-full overflow-hidden rounded-full"
              aria-hidden="true"
            >
              {FLAG.map((c) => (
                <div key={c} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp}>
            <p className="text-base sm:text-lg leading-relaxed font-medium text-[#4a4038]">
              United in creativity, inclusivity, and celebration — our
              partnership with{" "}
              <span className="font-black text-[#008026]">Karaoverse</span>{" "}
              amplifies LGBTQIA+ voices, empowers community talent, and helps
              build unforgettable moments across arts, entertainment, and
              culture.
            </p>

            <p className="mt-5 rounded-2xl border-2 border-[#181310] bg-white p-5 text-sm font-semibold leading-relaxed text-[#4a4038] shadow-[4px_4px_0_#181310]">
              Karaoverse was created and engineered by our on-staff software
              designer <span className="font-black text-[#181310]">Jonathen Whitford</span> of{" "}
              <a
                href="https://jwhitproductions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-[#004DFF] underline underline-offset-4 hover:text-[#750787]"
              >
                JWhit Productions
              </a>
              .
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SAFE SPACES BAND ── */}
      <section className="border-y-2 border-[#181310]" style={{ backgroundColor: "#FFED00" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <motion.div {...fadeUp}>
            <h2 className="hpc-display mx-auto max-w-3xl text-2xl sm:text-4xl font-black uppercase leading-tight tracking-tight">
              Build safe spaces. Be seen. Get connected.
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base sm:text-lg font-semibold leading-relaxed text-[#4a3d00]">
              Karaoverse lets LGBTQIA+ artists, nightlife hosts, safe-space
              venues, and allies create a profile, connect with their community,
              share what they do, and get discovered. Whether you're building a
              place to belong, running events, or raising your artistic voice —
              this platform exists to celebrate you.
            </p>

            <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-base font-semibold leading-relaxed text-[#4a3d00]/80">
              From drag shows to support groups, karaoke hosts to queer
              musicians — it's how people find local safe spaces, live events,
              and real opportunities in our community.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="https://karaoverse.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#181310] bg-[#181310] px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[4px_4px_0_#4a3d00] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#4a3d00]"
              >
                Join Karaoverse <FaArrowRight />
              </a>
              <Link
                to="/volunteer"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#181310] bg-[#181310] px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[4px_4px_0_#4a3d00] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#4a3d00]"
              >
                Volunteer
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#181310] bg-[#181310] px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[4px_4px_0_#4a3d00] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#4a3d00]"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CLOSING ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 text-center">
        <motion.p
          {...fadeUp}
          className="hpc-display mx-auto max-w-2xl text-xl sm:text-2xl font-black uppercase leading-tight tracking-tight text-[#4a4038]"
        >
          Pride never sleeps — and neither does our community.
        </motion.p>
      </section>

      {/* ── BOTTOM FLAG STRIPE ── */}
      <div className="flex h-2.5 w-full" aria-hidden="true">
        {FLAG.map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* ── DETAIL MODAL ── */}
      <EventDetailModal entry={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

/* ── One event, poster-card style ─────────────────────────── */
export function EventCard({ event, when, index, isPast = false, onOpen }) {
  const color = FLAG[index % FLAG.length];
  const light = color === "#FFED00";
  const ink = light ? "#181310" : "#FFFFFF";

  const types = eventTypes(event);
  const repeat = recurrenceLabel(event);
  const times = timeRange(event);
  const address = fullAddress(event);
  const links = eventLinks(event).filter(
    (l) => !(isPast && l.label === "Tickets")
  );
  const artistCount = Array.isArray(event.related_artist_ids)
    ? event.related_artist_ids.length
    : 0;

  const detailTo =
    EVENT_DETAIL_BASE && event.slug ? `${EVENT_DETAIL_BASE}/${event.slug}` : null;

  const open = () => onOpen?.({ raw: event, when, color, isPast });

  /* links inside the card stop propagation, so this only fires on the card body */
  const stop = (e) => e.stopPropagation();

  return (
    <motion.article
      {...fadeUp}
      onClick={onOpen ? open : undefined}
      className={`flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[#181310] bg-white shadow-[6px_6px_0_#181310] transition-transform hover:-translate-y-1 ${
        onOpen ? "cursor-pointer" : ""
      }`}
    >
      <div className="h-3" style={{ backgroundColor: color }} aria-hidden="true" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-4">
          {/* date tile */}
          <div
            className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-[#181310]"
            style={{ backgroundColor: color, color: ink }}
          >
            {when ? (
              <>
                <span className="hpc-display text-[10px] font-black uppercase tracking-widest">
                  {when.toLocaleDateString("en-US", { month: "short" })}
                </span>

                <span className="hpc-display text-2xl font-black leading-none">
                  {when.getDate()}
                </span>

                <span className="hpc-display mt-0.5 text-[9px] font-black tracking-wider opacity-70">
                  {when.getFullYear()}
                </span>
              </>
            ) : (
              <span className="hpc-display text-xs font-black uppercase tracking-widest">
                TBA
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="hpc-display text-lg font-black uppercase leading-tight tracking-tight">
              {onOpen ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    open();
                  }}
                  className="text-left uppercase outline-none hover:underline underline-offset-4 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#181310] focus-visible:ring-offset-2"
                >
                  {event.venue_name}
                </button>
              ) : (
                event.venue_name
              )}
            </h3>
            {(event.city || event.state) && (
              <p
                className="mt-1 text-xs font-black uppercase tracking-wider"
                style={{ color }}
              >
                {[event.city, event.state].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* type + recurrence chips */}
        {(types.length > 0 || repeat) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {types.map((t) => (
              <span
                key={t}
                className="rounded-full border-2 border-[#181310] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider"
                style={{ backgroundColor: color, color: ink }}
              >
                {t}
              </span>
            ))}
            {repeat && (
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#181310] bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
                <FaRedoAlt className="text-[8px]" /> {repeat}
              </span>
            )}
          </div>
        )}

        {/* meta */}
        <div className="mt-4 space-y-1.5 text-sm font-semibold text-[#4a4038]">
          {when && (
            <p className="flex items-center gap-2">
              <FaCalendarAlt className="shrink-0 text-xs opacity-60" />
              <time dateTime={isoDate(when)}>
                {longDate(when)}
                {!event.date && event.recurring && (
                  <span className="ml-1 font-medium text-[#9c9089]">(next)</span>
                )}
              </time>
            </p>
          )}
          {times && (
            <p className="flex items-center gap-2">
              <FaClock className="shrink-0 text-xs opacity-60" />
              {times}
            </p>
          )}
          {address && (
            <p className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-xs opacity-60" />
              <span>{address}</span>
            </p>
          )}
          {artistCount > 0 && (
            <p className="flex items-center gap-2">
              <FaUsers className="shrink-0 text-xs opacity-60" />
              {artistCount} {artistCount === 1 ? "artist" : "artists"} on the bill
            </p>
          )}
        </div>

        <LinkedNotes
          text={event.notes}
          onLinkClick={stop}
          accent={light ? "#181310" : color}
          className="hpc-clamp-3 mt-3 text-sm font-medium leading-relaxed text-[#6b5f57]"
        />

        {/* actions */}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
          {onOpen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide hover:underline underline-offset-4"
              style={{ color: light ? "#181310" : color }}
            >
              View details <FaArrowRight className="text-xs" />
            </button>
          )}

          {event.eventbrite_url && !isPast && (
            <a
              href={event.eventbrite_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stop}
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide hover:underline underline-offset-4"
              style={{ color: light ? "#181310" : color }}
            >
              <FaTicketAlt className="text-xs" /> Tickets
            </a>
          )}

          {links.slice(0, 2).map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stop}
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide hover:underline underline-offset-4"
              style={{ color: light ? "#181310" : color }}
            >
              {label === "Tickets" && <FaTicketAlt className="text-xs" />}
              {label} <FaExternalLinkAlt className="text-[9px]" />
            </a>
          ))}

          {detailTo && (
            <Link
              to={detailTo}
              onClick={stop}
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide hover:underline underline-offset-4"
              style={{ color: light ? "#181310" : color }}
            >
              Full page <FaArrowRight className="text-xs" />
            </Link>
          )}

          {address && (
            <a
              href={mapsUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stop}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#9c9089] hover:text-[#181310]"
            >
              Directions <FaExternalLinkAlt className="text-[9px]" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ── Full detail modal ────────────────────────────────────── */
export function EventDetailModal({ entry, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!entry) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [entry, onClose]);

  const event = entry?.raw;
  const when = entry?.when;
  const color = entry?.color || "#750787";
  const light = color === "#FFED00";
  const ink = light ? "#181310" : "#FFFFFF";

  const types = event ? eventTypes(event) : [];
  const repeat = event ? recurrenceLabel(event) : null;
  const times = event ? timeRange(event) : null;
  const address = event ? fullAddress(event) : "";
  const artistCount =
    event && Array.isArray(event.related_artist_ids)
      ? event.related_artist_ids.length
      : 0;

  const allLinks = eventLinks(event).filter(
    (l) => !(entry?.isPast && l.label === "Tickets")
  );

  /* no eventbrite_url on the record? then a ticket link found in the
     notes becomes the primary (filled) button instead — worth repeating
     even if it also appears inline, since it's the main action */
  const primaryLink =
    !event?.eventbrite_url && allLinks.find((l) => l.label === "Tickets");

  /* the full notes are visible here with their links already inline,
     so only links from dedicated URL fields need their own button */
  const secondaryLinks = allLinks.filter(
    (l) => l !== primaryLink && l.source === "field"
  );

  return (
    <AnimatePresence>
      {entry && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
          {/* backdrop */}
          <motion.button
            type="button"
            aria-label="Close details"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 h-full w-full cursor-default bg-[#181310]/70 backdrop-blur-sm"
          />

          {/* panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-detail-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border-2 border-[#181310] bg-[#FFFBF2] shadow-[8px_8px_0_#181310] sm:rounded-2xl"
          >
            {/* flag stripe */}
            <div className="flex h-2.5 w-full shrink-0" aria-hidden="true">
              {FLAG.map((c) => (
                <div key={c} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>

            {/* close sticker */}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="absolute right-4 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#181310] bg-white text-sm shadow-[3px_3px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#181310] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#181310] focus-visible:ring-offset-2"
            >
              <FaTimes />
            </button>

            <div className="overflow-y-auto p-6 sm:p-8">
              {/* header */}
              <div className="flex items-start gap-4 pr-12">
                <div
                  className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-[#181310] shadow-[4px_4px_0_#181310]"
                  style={{ backgroundColor: color, color: ink }}
                >
                  {when ? (
                    <>
                      <span className="hpc-display text-[11px] font-black uppercase tracking-widest">
                        {when.toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="hpc-display text-3xl font-black leading-none">
                        {when.getDate()}
                      </span>
                      <span className="hpc-display mt-0.5 text-[10px] font-black tracking-wider opacity-70">
                        {when.getFullYear()}
                      </span>
                    </>
                  ) : (
                    <span className="hpc-display text-sm font-black uppercase tracking-widest">
                      TBA
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h2
                    id="event-detail-title"
                    className="hpc-display text-2xl font-black uppercase leading-tight tracking-tight sm:text-3xl"
                  >
                    {event.venue_name}
                  </h2>
                  {(event.city || event.state) && (
                    <p
                      className="mt-1.5 text-xs font-black uppercase tracking-[0.2em]"
                      style={{ color: light ? "#181310" : color }}
                    >
                      {[event.city, event.state].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              </div>

              {/* chips */}
              {(types.length > 0 || repeat) && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {types.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border-2 border-[#181310] px-3 py-1 text-[10px] font-black uppercase tracking-wider"
                      style={{ backgroundColor: color, color: ink }}
                    >
                      {t}
                    </span>
                  ))}
                  {repeat && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#181310] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                      <FaRedoAlt className="text-[8px]" /> {repeat}
                    </span>
                  )}
                </div>
              )}

              {/* facts */}
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <DetailRow icon={<FaCalendarAlt />} label="Date">
                  {when ? (
                    <time dateTime={isoDate(when)}>
                      {longDate(when)}
                      {!event.date && event.recurring && (
                        <span className="ml-1 font-medium text-[#9c9089]">
                          (next occurrence)
                        </span>
                      )}
                    </time>
                  ) : (
                    "To be announced"
                  )}
                </DetailRow>

                {times && (
                  <DetailRow icon={<FaClock />} label="Time">
                    {times}
                  </DetailRow>
                )}

                {address && (
                  <DetailRow icon={<FaMapMarkerAlt />} label="Where">
                    {address}
                  </DetailRow>
                )}

                {artistCount > 0 && (
                  <DetailRow icon={<FaUsers />} label="On the bill">
                    {artistCount} {artistCount === 1 ? "artist" : "artists"}
                  </DetailRow>
                )}

                {event.host && (
                  <DetailRow icon={<FaMicrophoneAlt />} label="Hosted by">
                    {event.host}
                  </DetailRow>
                )}
              </dl>

              {/* full notes — no clamp */}
              {event.notes && (
                <div className="mt-6 rounded-2xl border-2 border-[#181310] bg-white p-5 shadow-[4px_4px_0_#181310]">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#9c9089]">
                    About this event
                  </p>
                  <LinkedNotes
                    text={event.notes}
                    accent={light ? "#181310" : color}
                    className="mt-2 whitespace-pre-line text-sm font-medium leading-relaxed text-[#4a4038]"
                  />
                </div>
              )}

              {/* actions */}
              <div className="mt-7 flex flex-wrap gap-3">
                {event.eventbrite_url && !entry.isPast && (
                  <a
                    href={event.eventbrite_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#181310] bg-[#181310] px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310]"
                  >
                    <FaTicketAlt className="text-xs" /> Get tickets
                  </a>
                )}

                {primaryLink && (
                  <a
                    href={primaryLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#181310] bg-[#181310] px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310]"
                  >
                    <FaTicketAlt className="text-xs" /> Get tickets
                  </a>
                )}

                {secondaryLinks.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#181310] bg-white px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310]"
                  >
                    {label === "Tickets" && <FaTicketAlt className="text-xs" />}
                    {label} <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                ))}

                {address && (
                  <a
                    href={mapsUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#181310] bg-white px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310]"
                  >
                    Directions <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                )}

                {EVENT_DETAIL_BASE && event.slug && (
                  <Link
                    to={`${EVENT_DETAIL_BASE}/${event.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#181310] bg-white px-5 py-3 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0_#181310] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#181310]"
                  >
                    Full page <FaArrowRight className="text-xs" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function DetailRow({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-[#181310] bg-white text-xs"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9c9089]">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-semibold leading-snug text-[#181310]">
          {children}
        </dd>
      </div>
    </div>
  );
}

/* ── Hero "next up" panel ─────────────────────────────────── */
function NextUpPanel({ status, entry, onOpen }) {
  if (status === "loading") {
    return (
      <div className="h-56 w-full animate-pulse rounded-xl border-2 border-dashed border-[#181310]/25 bg-[#000000]" />
    );
  }

  if (!entry) {
    return (
      <img
        src="banner.jpeg"
        alt="Capital City Pride"
        className="h-56 w-full rounded-xl bg-black object-contain"
      />
    );
  }

  const { raw: event, when } = entry;
  const times = timeRange(event);
  const repeat = recurrenceLabel(event);
  const types = eventTypes(event);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex h-56 w-full flex-col justify-center rounded-xl bg-[#181310] p-6 text-left transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFED00] focus-visible:ring-offset-2"
    >
      {when ? (
        <p className="hpc-display text-5xl font-black uppercase leading-none tracking-tight text-[#FFED00]">
          {when.toLocaleDateString("en-US", { month: "short" })} {when.getDate()}
        </p>
      ) : (
        <p className="hpc-display text-3xl font-black uppercase leading-none tracking-tight text-[#FFED00]">
          Date TBA
        </p>
      )}

      <p className="hpc-display mt-3 text-xl font-black uppercase leading-tight tracking-tight text-white">
        {event.venue_name}
      </p>

      <p className="mt-2 text-sm font-semibold text-white/70">
        {[times, event.city].filter(Boolean).join(" · ")}
      </p>

      {(types[0] || repeat) && (
        <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-white/50">
          {[types[0], repeat].filter(Boolean).join(" · ")}
        </p>
      )}

      <span className="mt-4 text-[10px] font-black uppercase tracking-[0.25em] text-[#FFED00]/80">
        Tap for details →
      </span>
    </button>
  );
}

/* ── Loading placeholders ─────────────────────────────────── */
function EventSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border-2 border-[#181310] bg-white shadow-[6px_6px_0_#181310]"
        >
          <div className="h-3" style={{ backgroundColor: FLAG[i % FLAG.length] }} />
          <div className="animate-pulse space-y-3 p-5">
            <div className="flex gap-4">
              <div className="h-16 w-16 shrink-0 rounded-xl bg-[#F0E9DC]" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-3/4 rounded bg-[#F0E9DC]" />
                <div className="h-3 w-1/3 rounded bg-[#F0E9DC]" />
              </div>
            </div>
            <div className="h-3 w-2/3 rounded bg-[#F0E9DC]" />
            <div className="h-3 w-1/2 rounded bg-[#F0E9DC]" />
            <div className="h-3 w-full rounded bg-[#F0E9DC]" />
          </div>
        </div>
      ))}
    </div>
  );
}