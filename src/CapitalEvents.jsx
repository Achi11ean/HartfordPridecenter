import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaExternalLinkAlt,
  FaCalendarAlt,
} from "react-icons/fa";

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

  const dayToIndex = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
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

    Object.keys(dayToIndex).forEach((day) => {
      const regex = new RegExp(`\\b${day}\\b`, "i");
      if (regex.test(relevant)) found.add(day);
    });

    Object.entries(dayNameMap).forEach(([abbr, full]) => {
      const regex = new RegExp(`\\b${abbr}\\b:?`, "i");
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
            className="text-blue-300 underline hover:text-blue-400 font-semibold"
          >
            {prettyLabel(href)}
          </a>
        );
      }
      return <span key={`text-${i}`}>{part}</span>;
    });
  };

  // ---------- Fetch Events Using NEW ENDPOINT ----------
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://singspacebackend.onrender.com/karaokeevents/hartfordpridecenter"
        );

        let data = await res.json();

        // Preprocess for "Also Occurs"
        const enriched = data.map((ev) => ({
          ...ev,
          alsoOccurs: extractAlsoOccursDays(ev.notes || ""),
        }));

        setEvents(enriched);
      } catch (err) {
        console.error("Failed to load Hartford Pride Center events", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ---------- UI ----------
  if (loading)
    return (
      <div className="text-center text-white py-10">
        Loading Hartford Pride Center Events...
      </div>
    );

  if (events.length === 0)
    return (
      <div className="text-center text-white text-xl py-10">
        ⭐ No Hartford Pride Center events found.
      </div>
    );

  return (
    <div className="w-full max-w-5xl mt-12 mx-auto  grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className="bg-white/10 backdrop-blur-md border border-pink-400 shadow-2xl rounded-none p-6 text-left text-white hover:bg-white/20 transition cursor-pointer"
          >
            {/* Title */}
            <h2 className="text-3xl border-b-2 font-bold text-pink-300 mb-3">
              {ev.venue_name}
            </h2>

            {/* Event Type */}
            {ev.event_type && (
              <p className="text-sm uppercase tracking-widest text-yellow-300 font-bold mb-3">
                {ev.event_type}
              </p>
            )}

            {/* Location */}
            <div className="flex items-center gap-2 text-blue-200 font-medium mb-3">
              <FaMapMarkerAlt />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${ev.venue_name} ${ev.address}, ${ev.city}, ${ev.state}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="underline hover:text-yellow-300"
              >
                {ev.address}, {ev.city}, {ev.state}
              </a>
            </div>

            {/* Main Date */}
            <p className="text-lg font-semibold text-purple-200 mb-3 flex items-center gap-2">
              <FaCalendarAlt />
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
            </p>

            {/* Also occurs */}
            {ev.alsoOccurs?.length > 0 && (
              <p className="text-md font-bold text-yellow-300 mb-3">
                Also Occurs On:{" "}
                <span className="text-white">{ev.alsoOccurs.join(", ")}</span>
              </p>
            )}

            {/* Time */}
            <div className="flex items-center gap-2 text-teal-200 font-medium mb-3">
              <FaClock />
              {formatTime(ev.start_time)} – {formatTime(ev.end_time)}
            </div>

            {/* Notes with overflow */}
            {ev.notes && (
              <div className="max-h-32 overflow-y-auto pr-1 mb-4 text-gray-200 whitespace-pre-line">
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
                className="inline-flex items-center gap-2 text-pink-300 underline hover:text-pink-200"
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
