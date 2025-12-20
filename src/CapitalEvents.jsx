import React, { useEffect, useState } from "react";
import {
  EVENT_TYPE_LABEL_MAP,
  EVENT_TYPE_STYLES,
  parseEventTypes,
} from "./eventTypes";

import {
  FaMapMarkerAlt,
  FaClock,
  FaExternalLinkAlt,
  FaCalendarAlt,
} from "react-icons/fa";
const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 1; // Hartford Pride Center (locked for now)

export default function CapitalEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- URL Parsing ----------
  const EVENTBRITE_RE = /^https?:\/\/(www\.)?eventbrite\.[a-z.]+\/e\/[^\s)]+/i;
  const FULL_URL_RE = /(https?:\/\/[^\s)]+)/gi;
  const NAKED_DOMAIN_RE =
    /(?:^|[\s(])((?:[a-z0-9-]+\.)+(?:com|org|net|io|co|me|events|club|live|xyz|info|biz|us|uk)(?:\/[^\s)]*)?)/gi;

  const prettyLabel = (u) => {
    const url = u.toLowerCase();
    if (url.includes("eventbrite")) return "🎟 Buy Tickets";
    if (url.includes("instagram")) return "Instagram";
    if (url.includes("facebook")) return "Facebook";
    if (url.includes("tiktok")) return "TikTok";
    if (url.includes("youtube")) return "YouTube";
    if (url.includes("x.com") || url.includes("twitter")) return "Twitter";
    if (url.includes("karaoverse")) return "Karaoverse";
    return "More Info";
  };

  const toAbsolute = (u) =>
    u.startsWith("http://") || u.startsWith("https://")
      ? u
      : `https://${u}`;

  // ---------- Format Time ----------
  const formatTime = (timeStr) => {
    if (!timeStr) return "?";
    const [hour, minute] = timeStr.split(":");
    const h = parseInt(hour, 10);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${minute} ${period}`;
  };

  // ---------- Also Occurs On ----------
  const dayNameMap = {
    sun: "Sunday",
    mon: "Monday",
    tue: "Tuesday",
    tues: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    thur: "Thursday",
    thurs: "Thursday",
    fri: "Friday",
    sat: "Saturday",
  };

  const extractAlsoOccursDays = (notes = "") => {
    if (!notes) return [];

    const text = notes.replace(/\s+/g, " ").trim();
    let relevant = text;

    const alsoIndex = text.toLowerCase().indexOf("also occurs on:");
    if (alsoIndex !== -1) {
      relevant = text.slice(alsoIndex);
    }

    const found = new Set();

    Object.values(dayNameMap).forEach((full) => {
      const regex = new RegExp(`\\b${full}\\b`, "i");
      if (regex.test(relevant)) found.add(full);
    });

    return [...found];
  };

  // ---------- Notes Renderer w/ URLs ----------
  const renderNotes = (notes) => {
    if (!notes) return null;

    const withAbsolute =
      notes.replace(NAKED_DOMAIN_RE, (match, p1, offset, str) => {
        const prefix = /\s|\(|^/.test(str[offset - 1] || "") ? "" : " ";
        return `${prefix}https://${p1}`;
      }) || notes;

    const parts = withAbsolute.split(FULL_URL_RE);

    return parts.map((part, i) => {
      if (FULL_URL_RE.test(part)) {
        const href = part;
        return (
          <a
            key={`link-${i}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-300 underline hover:text-yellow-200 font-semibold"
          >
            {prettyLabel(href)}
          </a>
        );
      }
      return <span key={`text-${i}`}>{part}</span>;
    });
  };

  // ---------- Fetch Events ----------
useEffect(() => {
  const load = async () => {
    try {
      const res = await fetch(
        `${API}/karaokeevents/pride/${PRIDE_ID}`
      );

      const data = await res.json();

      const enriched = data.map((ev) => ({
        ...ev,
        alsoOccurs: extractAlsoOccursDays(ev.notes || ""),
      }));

      setEvents(enriched);
    } catch (err) {
      console.error("Failed to load Pride Center events", err);
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);


  // ---------- UI ----------
if (loading)
  return (
    <div className="text-center text-yellow-300 py-10">
      Loading Pride Center Events...
    </div>
  );

if (events.length === 0)
  return (
    <div className="text-center text-yellow-300 text-xl py-10">
      ⭐ No Pride Center events found yet.
    </div>
  );


return (
  <div className="w-full max-w-6xl mt-14 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

    {events.map((ev) => {
      const detectedEventbrite =
        ev.eventbrite_url && EVENTBRITE_RE.test(ev.eventbrite_url)
          ? ev.eventbrite_url
          : null;

      return (
        <div
          key={ev.id}
          onClick={() => {
            if (
              window.confirm(
                "You’re being redirected to the full event page on Karaoverse!\n\nContinue?"
              )
            ) {
              window.location.href = `https://karaoverse.com/events/${ev.slug}`;
            }
          }}
          className="
            group cursor-pointer 
            bg-white/70 backdrop-blur-xl
            text-green-900 
            border border-emerald-700/30 
            shadow-xl rounded-xl p-6 

            hover:border-emerald-600 
            hover:shadow-emerald-300/40
            hover:bg-white 
            transition-all duration-300
          "
        >

          {/* Title */}
          <h2
            className="
              text-2xl md:text-3xl font-extrabold tracking-tight 
              text-emerald-900 pb-2 mb-4 
              border-b border-emerald-600/30
              group-hover:text-emerald-700 transition
            "
          >
            {ev.venue_name}
          </h2>

          {/* Event Type */}
       {/* 🌈 Event Type Badges */}
{parseEventTypes(ev.event_type).length > 0 && (
  <div className="flex flex-wrap gap-2 mb-4">

    {parseEventTypes(ev.event_type).map((t) => {
      const label = EVENT_TYPE_LABEL_MAP[t] || t;
      const style =
        EVENT_TYPE_STYLES[t] ||
        EVENT_TYPE_STYLES.other;

      return (
        <span
          key={t}
          className={`
            inline-flex items-center
            px-3 py-1 text-xs font-bold
            border rounded-full shadow 
            whitespace-nowrap
            ${style}
          `}
        >
          {label}
        </span>
      );
    })}
  </div>
)}

          {/* Address */}
          <div className="flex items-center gap-2 mb-3 text-emerald-900 font-semibold">
            <FaMapMarkerAlt className="text-emerald-800" />

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${ev.venue_name} ${ev.address}, ${ev.city}, ${ev.state}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="underline hover:text-emerald-700 transition"
            >
              {ev.address}, {ev.city}, {ev.state}
            </a>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-emerald-900 font-semibold mb-3">
            <FaCalendarAlt className="text-emerald-800" />

            {ev.date
              ? new Date(ev.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : ev.recurring_day
              ? `${ev.recurring_day} (Recurring)`
              : "Date TBD"}
          </div>

          {/* Also Occurs */}
          {ev.alsoOccurs?.length > 0 && (
            <p className="text-md font-bold text-emerald-800 mb-3">
              Also Occurs On:{" "}
              <span className="font-medium text-emerald-900">
                {ev.alsoOccurs.join(", ")}
              </span>
            </p>
          )}

          {/* Time */}
          <div className="flex items-center gap-2 text-emerald-900 font-semibold mb-3">
            <FaClock className="text-emerald-800" />
            {formatTime(ev.start_time)} – {formatTime(ev.end_time)}
          </div>

          {/* Notes */}
          {ev.notes && (
            <div
              className="
                max-h-32 overflow-y-auto pr-1 mb-4
                text-emerald-900/90 leading-relaxed 
                whitespace-pre-line
              "
            >
              {renderNotes(ev.notes)}
            </div>
          )}

          {/* Eventbrite */}
          {detectedEventbrite && (
            <a
              href={detectedEventbrite}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 
                text-emerald-700 font-bold underline 
                hover:text-emerald-900 transition
              "
            >
              Eventbrite Page <FaExternalLinkAlt />
            </a>
          )}

        </div>
      );
    })}
  </div>
);

}
