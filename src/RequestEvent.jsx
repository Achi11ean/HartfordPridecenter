// components/RequestEvent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

import {
  EVENT_TYPES as EVENT_TYPE_OPTIONS,
  parseEventTypes,
} from "./eventTypes";
const libraries = ["places"];
const STEP_TITLES = {
  1: "📍 Where is it happening?",
  2: "🕒 When does it happen?",
  3: "🎭 What type of event?",
  4: "✨ Enhance your event",
  5: "📝 Tell the story",
  6: "🚀 Final Review",
};
const STATE_MAP = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",

  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",

  "North Carolina": "NC",
  "North Dakota": "ND",

  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",

  "Rhode Island": "RI",

  "South Carolina": "SC",
  "South Dakota": "SD",

  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",

  "West Virginia": "WV",

  Wisconsin: "WI",
  Wyoming: "WY",
};
const RequestEvent = ({ initialVenue = {} }) => {
  // ---------- Core form state ----------
  const [formData, setFormData] = useState({
    venue_name: initialVenue?.venue_name || "",
    address: initialVenue?.address || "",
    city: initialVenue?.city || "",
    state: initialVenue?.state || "",
    event_type: [],
    start_time: "",
    end_time: "",
    description: "",
    day_of_week: "",
    date: "",
    recurrence_pattern: "one-time",
    recurrence_anchor_date: "",
    eventbrite_url: "",
  });
const parseGoogleVenueName = (description = "") => {
  return description.split(",")[0]; // ✅ everything before first comma
};
const cleanAddress = (fullAddress = "") => {
  return fullAddress.split(",")[0]; // ✅ street only
};
const normalizeState = (state) => {
  if (!state) return "";

  const cleaned = state.trim();

  return STATE_MAP[cleaned] || cleaned;
};
const prettyValue = (val = "") =>
  val
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());


  const [relatedArtistData, setRelatedArtistData] = useState([]);
const [googleResults, setGoogleResults] = useState([]);
const googleCache = React.useRef({});
const latestSearchRef = React.useRef("");
const [monthlyMode, setMonthlyMode] = useState("date");   // "date" | "weekday"
const [monthlyWeekdayRules, setMonthlyWeekdayRules] = useState([]);
// Monthly weekday rule text
const monthlyRuleText =
  formData.recurrence_pattern === "monthly" &&
  monthlyMode === "weekday" &&
  monthlyWeekdayRules.length > 0
    ? `Monthly Rules: ${monthlyWeekdayRules.join(", ")}`
    : "";

const getLocalWeekday = (dateString) => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);

  // Create LOCAL date (not UTC)
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString("en-US", {
    weekday: "long",
  });
};
useEffect(() => {
  if (
    ["weekly", "bi-weekly"].includes(formData.recurrence_pattern) &&
    formData.recurrence_anchor_date
  ) {
    const weekday = getLocalWeekday(formData.recurrence_anchor_date);

    setFormData((prev) => ({
      ...prev,
      day_of_week: weekday,
    }));
  }
}, [formData.recurrence_anchor_date, formData.recurrence_pattern]);
  // ---------- Wizard state ----------
  const [step, setStep] = useState(1); // 1..6
  const TOTAL_STEPS = 6;
  const [stepError, setStepError] = useState("");

  // ---------- Existing feature states (preserved) ----------
  const [error, setError] = useState(null);

  const [uniqueVenues, setUniqueVenues] = useState([]);
  const [venueDetailsMap, setVenueDetailsMap] = useState({});
  const [cityOptions, setCityOptions] = useState([]);

  const [bands, setBands] = useState([]);
  const [selectedBandIds, setSelectedBandIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredBands = bands.filter((b) =>
    b.artist_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [showAdditionalDays, setShowAdditionalDays] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [additionalDays, setAdditionalDays] = useState([]);
  const [sevenDays, setSevenDays] = useState(false);
const containerRef = React.useRef(null);
const [eventTypeSearch, setEventTypeSearch] = useState("");
  const [showArtists, setShowArtists] = useState(false);
  const EVENTBRITE_RE = /^https?:\/\/(www\.)?eventbrite\.[a-z.]+\/e\/.+/i;
  const [showEventbrite, setShowEventbrite] = useState(false);
  const [eventbriteError, setEventbriteError] = useState("");

  const [showDates, setShowDates] = useState([]);
const escapeRegex = (str) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const [venueNameError, setVenueNameError] = useState("");



useEffect(() => {
  if (
    ["weekly", "bi-weekly"].includes(formData.recurrence_pattern) &&
    formData.recurrence_anchor_date
  ) {
    const weekday = getLocalWeekday(formData.recurrence_anchor_date);

    if (weekday !== formData.day_of_week) {
      setFormData((prev) => ({
        ...prev,
        day_of_week: weekday,
      }));
    }
  }
}, [formData.recurrence_anchor_date, formData.recurrence_pattern]);

  const SKY_PREFIX = "Sky Casper Presents:";
  const hasSkyPrefix = (txt = "") =>
    /^\s*sky\s*casper\s*presents\s*:/i.test(txt);
  const stripSkyPrefix = (txt = "") =>
    txt.replace(/^\s*sky\s*casper\s*presents\s*:\s*/i, "").trimStart();
  const toggleSkyCasperPrefix = () => {
    setFormData((prev) => {
      const desc = prev.description || "";
      if (hasSkyPrefix(desc)) {
        const stripped = stripSkyPrefix(desc);
        return { ...prev, description: stripped };
      }
      const next = `${SKY_PREFIX} ${desc}`.trim();
const trimmed = next.slice(0, 800);
      return { ...prev, description: trimmed };
    });
  };
const artistOptions = bands.map((b) => ({
  value: b.id,
  label: b.artist_name,
}));

  // ---------- Load data ----------
  useEffect(() => {
    axios
      .get("https://singspacebackend.onrender.com/hireband/public")
      .then((res) => setBands(res.data))
      .catch(() => console.error("Failed to load bands"));

    axios
      .get("https://singspacebackend.onrender.com/karaokeevents/public-all")
      .then((res) => {
        const venueMap = {};
        const cities = new Set();

        res.data.forEach((event) => {
          if (event.venue_name && !venueMap[event.venue_name]) {
            venueMap[event.venue_name] = {
              address: event.address,
              city: event.city,
              state: event.state,
            };
          }
          if (event.city) cities.add(event.city);
        });

        setVenueDetailsMap(venueMap);
        setUniqueVenues(Object.keys(venueMap).sort());
        setCityOptions(
          [...cities].sort().map((city) => ({ value: city, label: city }))
        );
      })
      .catch(() => console.error("Failed to load venues"));
  }, []);

  // ---------- Misc helpers ----------
const eventTypeOptions = EVENT_TYPE_OPTIONS;
const filteredEventTypes = eventTypeOptions.filter((opt) =>
  opt.label.toLowerCase().includes(eventTypeSearch.toLowerCase())
);
const [usingGoogle, setUsingGoogle] = useState(false);
const handleChange = (e) => {
  const { name, value } = e.target;

  // 🔥 SPECIAL LOGIC FOR ADDRESS
  if (name === "address") {
    const parsed = parseFullAddress(value);

    if (parsed.city || parsed.state) {
      setFormData((prev) => ({
        ...prev,
        address: parsed.address || value,
city: prev.city || parsed.city,
state: prev.state || parsed.state,
      }));
      return;
    }
  }

  // normal behavior
  setFormData((prev) => ({ ...prev, [name]: value }));

  if (name === "venue_name" && value.trim()) {
    setVenueNameError("");
  }
};

  const formatShowDate = (date, time) => {
    if (!date || !time) return "";
    const dt = new Date(`${date}T${time}`);
    return (
      dt.toLocaleDateString("en-US", {
        weekday: "short",
        month: "numeric",
        day: "numeric",
      }) +
      " @ " +
      dt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  // ---------- Build server payload (preserving your formatting) ----------
  const buildPayload = () => {
    const daysText = additionalDays.length
      ? `Also Occurs on: ${additionalDays
          .map((d) => {
            const fmt = (t) => {
              if (!t) return "";
              const [hour, minute] = t.split(":");
              const dt = new Date();
              dt.setHours(hour, minute);
              return dt.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              });
            };
            return `${d.day} ${fmt(d.start)} - ${fmt(d.end)}`;
          })
          .join(" | ")}`
      : "";

    const sevenDaysText = sevenDays ? "7 Days a Week" : "";

    const showDatesText = showDates.length
      ? `Additional Show Dates:\n${showDates
          .map((d) => ` • ${formatShowDate(d.date, d.time)}`)
          .join("\n")}`
      : "";

    return {
            pride_id: 2,

      ...formData,
    event_type: formData.event_type.join(","),

      recurrence_pattern: formData.recurrence_pattern,
    description: [
  formData.description || "",
  daysText,
  sevenDaysText,
  showDatesText,
  monthlyRuleText, // <-- ADD THIS
]
  .filter(Boolean)
  .join("\n\n"),

      related_artist_ids: selectedBandIds,
      eventbrite_url:
        showEventbrite && formData.eventbrite_url
          ? formData.eventbrite_url.trim()
          : null,
    };
  };

  // ---------- Submission ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStepError("");

    // final validations (Eventbrite format if visible)
    if (showEventbrite && formData.eventbrite_url) {
      if (!EVENTBRITE_RE.test(formData.eventbrite_url)) {
        setEventbriteError(
          "URL must start with Eventbrite (e.g. https://www.eventbrite.com/e/...)"
        );
        return;
      }
    }
    setEventbriteError("");

    try {
      const payload = buildPayload();
           await axios.post(
        "https://singspacebackend.onrender.com/event-submissions/pride",
        payload
      );
setShowSuccessModal(true);
      // reset
      setFormData({
        venue_name: "",
        address: "",
        city: "",
        state: "",
        event_type: [],
        start_time: "",
        end_time: "",
        description: "",
        day_of_week: "",
        date: "",
        recurrence_pattern: "one-time",
        recurrence_anchor_date: "",
        eventbrite_url: "",
      });
      setSelectedBandIds([]);
      setAdditionalDays([]);
      setShowDates([]);
      setSevenDays(false);
      setShowEventbrite(false);
      setError(null);
      setStep(1);
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
      setError("Failed to submit. Please try again later.");
    }
  };

  // ---------- Step navigation with per-step validations ----------
  const validateStep = (s) => {
    // minimal per-step checks; expand as needed
    if (s === 1) {
      if (!formData.venue_name.trim()) {
        setVenueNameError("Venue name is required.");
        return "Please add a venue.";
      }
      if (!formData.address.trim()) return "Address is required.";
      if (!formData.city.trim()) return "City is required.";
      if (!formData.state.trim()) return "State is required.";
    }
    if (s === 2) {
      if (!formData.recurrence_pattern) return "Select a recurrence pattern.";
// WEEKLY OR BI-WEEKLY must choose a day of week
if (
  ["weekly", "bi-weekly"].includes(formData.recurrence_pattern) &&
  !formData.day_of_week
) {
  return "Select the next event date.";
}
// MONTHLY (weekday mode): must choose 1+ weekday rules
if (
  formData.recurrence_pattern === "monthly" &&
  monthlyMode === "weekday" &&
  monthlyWeekdayRules.length === 0
) {
  return "Select at least one monthly weekday rule.";
}

      if (
        formData.recurrence_pattern === "one-time" &&
        !formData.date
      )
        return "Select a date.";
      if (
        ["bi-weekly", "monthly"].includes(formData.recurrence_pattern) &&
        !formData.recurrence_anchor_date
      )
        return "Select the next event date.";
      if (!formData.start_time || !formData.end_time)
        return "Add start and end times.";
    }
    if (s === 3) {
      if (!formData.event_type.length) return "Pick at least one event type.";
    }
    if (s === 4) {
      if (showEventbrite && formData.eventbrite_url) {
        if (!EVENTBRITE_RE.test(formData.eventbrite_url)) {
          setEventbriteError(
            "URL must start with Eventbrite (e.g. https://www.eventbrite.com/e/...)"
          );
          return "Fix the Eventbrite URL or hide it.";
        }
        setEventbriteError("");
      }
    }
    // steps 5/6 have no hard requirements beyond previous
    return "";
  };

  const nextStep = () => {
    const err = validateStep(step);
    if (err) {
      setStepError(err);
      return;
    }
    setStepError("");
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const prevStep = () => {
    setStepError("");
    setStep((s) => Math.max(1, s - 1));
  };

  // ---------- Animations ----------
  const variants = {
    initial: { opacity: 0, x: 15 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -15 },
  };


  useEffect(() => {
  if (selectedBandIds.length === 0) {
    setRelatedArtistData([]);
    return;
  }

  async function fetchArtists() {
    try {
      const responses = await Promise.all(
        selectedBandIds.map((id) =>
          axios.get(`https://singspacebackend.onrender.com/artists/${id}`)
        )
      );
      setRelatedArtistData(responses.map((r) => r.data));
    } catch (error) {
      console.error("Error fetching related artist data:", error);
    }
  }

  fetchArtists();
}, [selectedBandIds]);

const [venueSearch, setVenueSearch] = useState("");
const safeSearch = escapeRegex(venueSearch);
const [showSuggestions, setShowSuggestions] = useState(false);
const hasSearch = venueSearch.trim().length > 0;
useEffect(() => {
  if (showSuccessModal) {
    const timer = setTimeout(() => {
      setShowSuccessModal(false);
    }, 2500);

    return () => clearTimeout(timer);
  }
}, [showSuccessModal]);

const filteredVenues = hasSearch
  ? uniqueVenues
      .filter((v) =>
        v.toLowerCase().includes(venueSearch.toLowerCase())
      )
      .slice(0, 10)
  : uniqueVenues.slice(0, 10); // show top venues instead
useEffect(() => {
  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
useEffect(() => {
  if (!venueSearch.trim()) {
    setGoogleResults([]);
  }
}, [venueSearch]);
useEffect(() => {
  if (!venueSearch || venueSearch.length < 3 || !showSuggestions) return;

  const search = venueSearch.toLowerCase().trim();
  latestSearchRef.current = search;

  const timeout = setTimeout(async () => {
    if (googleCache.current[search]) {
      setGoogleResults(googleCache.current[search]);
      return;
    }

    try {
      const res = await axios.get(
        "https://singspacebackend.onrender.com/google-places",
        {
          params: { input: venueSearch },
        }
      );

const results = (res.data.predictions || []).slice(0, 5);
      googleCache.current[search] = results;

      // ✅ ONLY update if still latest search
      if (latestSearchRef.current === search) {
        setGoogleResults(results);
      }

    } catch (err) {
      console.error("Google Places error:", err);
    }
  }, 400);

  return () => clearTimeout(timeout);
}, [venueSearch, showSuggestions]);

useEffect(() => {
  if (formData.venue_name) {
    setVenueSearch(formData.venue_name);
  }
}, [formData.venue_name]);
  // ---------- Submitted state ----------
 
  // ---------- Progress ----------
  const progressWidth = `${(step / TOTAL_STEPS) * 100}%`;

const parseFullAddress = (input) => {
  if (!input) return {};

  const parts = input.split(",").map(p => p.trim());

  // GOOGLE FORMAT (5 parts)
  if (parts.length >= 4) {
    return {
      address: parts[1] || "",
      city: parts[2] || "",
      state: parts[3]?.match(/\b[A-Z]{2}\b/)?.[0] || ""
    };
  }

  // FALLBACK (manual paste like "123 Main St, Cromwell, CT 06416")
  if (parts.length >= 3) {
    const stateMatch = parts[2].match(/\b[A-Z]{2}\b/);

    return {
      address: parts[0],
      city: parts[1],
      state: stateMatch ? stateMatch[0] : ""
    };
  }

  return {};
};

const combinedResults = React.useMemo(() => [
  ...filteredVenues.map(v => ({
    type: "db",
    name: v
  })),
  ...googleResults
    .filter(g => {
      const googleName = parseGoogleVenueName(g.description).toLowerCase();
      return !uniqueVenues.some(
        v => v.toLowerCase() === googleName
      );
    })
    .map(g => ({
      type: "google",
      name: g.description,
      place_id: g.place_id,
      address: g.address,
      city: g.city,
      state: g.state
    }))
], [filteredVenues, googleResults, uniqueVenues]);











/* ═══════════════════════════════════════════════════════════════════
   BLOCK A — paste ABOVE your component (file level)
   ═══════════════════════════════════════════════════════════════════ */

const SF_CSS = `
.sf {
  /* ── palette: one accent ramp + one glint. That's the whole budget. ── */
  --sf-ink:        #0B0913;
  --sf-surface:    #14101F;
  --sf-raised:     rgba(255,255,255,0.035);
  --sf-raised-hi:  rgba(255,255,255,0.065);
  --sf-hairline:   rgba(255,255,255,0.09);
  --sf-hairline-hi:rgba(255,255,255,0.16);
  --sf-violet:     #A78BFA;
  --sf-rose:       #F472B6;
  --sf-glint:      #FDE68A;   /* stage light. sparkles only. nothing else. */
  --sf-text: rgba(255, 255, 255, 1);

--sf-text-2: rgba(255, 255, 255, 1);
  --sf-text-3:    rgba(255, 255, 255, 1);
  --sf-danger:     #FB7185;
  --sf-ok:         #34D399;

  /* Swap this one line for a display face if you want more character.
     e.g. --sf-display: 'Clash Display', 'Instrument Sans', system-ui; */
  --sf-display: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --sf-body:    ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;

  font-family: var(--sf-body);
  color: var(--sf-text);
  color-scheme: dark;               /* native date/time/select pickers go dark */
  -webkit-font-smoothing: antialiased;
}

/* ── type scale ─────────────────────────────────────────────── */
.sf-display {
  font-family: var(--sf-display);
  font-size: clamp(1.35rem, 4.2vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.sf-eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--sf-text-3);
}
.sf-label {
  display: block;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 7px;
}
.sf-hint  { font-size: 12px; line-height: 1.45; color: var(--sf-text-3); }
.sf-error { font-size: 12px; font-weight: 600; color: var(--sf-danger); margin-top: 6px; }

/* ── the one field style, used everywhere ───────────────────── */
.sf-field {
  width: 100%;
  min-height: 46px;                 /* comfortable thumb target */
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--sf-raised);
  border: 1px solid var(--sf-hairline);
  color: var(--sf-text);
  font-size: 15px;
  font-family: inherit;
  line-height: 1.35;
  outline: none;
  transition: border-color .18s ease, background .18s ease, box-shadow .18s ease;
  appearance: none;
}
.sf-field::placeholder { color: var(--sf-text-3); }
.sf-field:hover { border-color: var(--sf-hairline-hi); }
.sf-field:focus {
  background: var(--sf-raised-hi);
  border-color: rgba(167,139,250,0.65);
  box-shadow: 0 0 0 3px rgba(167,139,250,0.16);
}
.sf-field[aria-invalid="true"] {
  border-color: rgba(251,113,133,0.6);
  box-shadow: 0 0 0 3px rgba(251,113,133,0.13);
}
select.sf-field {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1.5L6 6.5L11 1.5' stroke='rgba(245,243,255,0.45)' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 38px;
  cursor: pointer;
}
select.sf-field option { background: var(--sf-surface); color: var(--sf-text); }
textarea.sf-field { min-height: 148px; resize: vertical; line-height: 1.6; }
input[type="date"].sf-field, input[type="time"].sf-field { cursor: pointer; }
input[type="date"].sf-field::-webkit-calendar-picker-indicator,
input[type="time"].sf-field::-webkit-calendar-picker-indicator {
  opacity: .5; cursor: pointer; transition: opacity .15s;
}
input[type="date"].sf-field::-webkit-calendar-picker-indicator:hover,
input[type="time"].sf-field::-webkit-calendar-picker-indicator:hover { opacity: 1; }

/* ── panel: a nested group of fields ────────────────────────── */
.sf-panel {
  border: 1px solid var(--sf-hairline);
  border-radius: 14px;
  background: rgba(255,255,255,0.02);
  padding: 14px;
}

/* ── chips: event types, days, artists ──────────────────────── */
.sf-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid var(--sf-hairline);
  background: var(--sf-raised);
  color: var(--sf-text-2);
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: transform .16s cubic-bezier(.2,.8,.3,1), border-color .16s, color .16s, background .16s;
}
.sf-chip:hover { border-color: var(--sf-hairline-hi); color: var(--sf-text); }
.sf-chip:active { transform: scale(.96); }
.sf-chip[data-on="true"] {
  background: linear-gradient(135deg, rgba(167,139,250,0.22), rgba(244,114,182,0.18));
  border-color: rgba(167,139,250,0.55);
  color: var(--sf-text);
  box-shadow: 0 0 0 1px rgba(167,139,250,0.18), 0 4px 18px -6px rgba(167,139,250,0.5);
}
.sf-chip[data-on="true"]::before {
  content: "";
  width: 5px; height: 5px; border-radius: 999px;
  background: var(--sf-violet);
  box-shadow: 0 0 7px var(--sf-violet);
  flex: none;
}

/* ── buttons ────────────────────────────────────────────────── */
.sf-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  height: 44px; padding: 0 18px;
  border-radius: 12px;
  font-family: inherit; font-size: 14px; font-weight: 650; letter-spacing: .01em;
  cursor: pointer; border: 1px solid transparent;
  transition: transform .16s cubic-bezier(.2,.8,.3,1), background .16s, border-color .16s, opacity .16s;
  white-space: nowrap;
}
.sf-btn:active:not(:disabled) { transform: scale(.97); }
.sf-btn:disabled { opacity: .32; cursor: not-allowed; }

.sf-btn--ghost { background: var(--sf-raised); border-color: var(--sf-hairline); color: var(--sf-text-2); }
.sf-btn--ghost:hover:not(:disabled) { background: var(--sf-raised-hi); color: var(--sf-text); border-color: var(--sf-hairline-hi); }

.sf-btn--primary {
  position: relative;
  overflow: hidden;

  background: linear-gradient(
    135deg,
    #FFF3B0 0%,
    #F7D774 20%,
    #E3B341 50%,
    #C8921E 80%,
    #8A5A00 100%
  );

  color: #1A1205;
  box-shadow:
    0 10px 28px -10px rgba(227, 179, 65, 0.7),
    inset 0 1px 0 rgba(255,255,255,0.35);

  transition: all 0.25s ease;
}

.sf-btn--primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 16px 36px -12px rgba(227, 179, 65, 0.9),
    inset 0 1px 0 rgba(255,255,255,0.45);
}
.sf-btn--primary:hover:not(:disabled) { filter: brightness(1.08); }

/* signature: a slow glint crosses the submit button */
.sf-btn--submit::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(100deg, transparent 35%, rgba(255,255,255,.55) 50%, transparent 65%);
  transform: translateX(-120%);
  animation: sf-sweep 3.6s ease-in-out 1.2s infinite;
}

.sf-btn--quiet {
  background: transparent; border-color: var(--sf-hairline); color: var(--sf-text-2);
  height: 38px; padding: 0 13px; font-size: 13px;
}
.sf-btn--quiet:hover:not(:disabled) { color: var(--sf-text); border-color: var(--sf-hairline-hi); }

.sf :focus-visible {
  outline: 2px solid var(--sf-violet);
  outline-offset: 2px;
  border-radius: 10px;
}

/* ── toggle row (step 4 add-ons) ────────────────────────────── */
.sf-toggle {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  width: 100%; padding: 13px 14px;
  border-radius: 12px;
  border: 1px solid var(--sf-hairline);
  background: var(--sf-raised);
  color: var(--sf-text-2);
  font-family: inherit; font-size: 14px; font-weight: 600;
  cursor: pointer; text-align: left;
  transition: border-color .16s, background .16s, color .16s;
}
.sf-toggle:hover { border-color: var(--sf-hairline-hi); color: var(--sf-text); }
.sf-toggle[data-on="true"] { border-color: rgba(167,139,250,0.5); background: rgba(167,139,250,0.09); color: var(--sf-text); }
.sf-toggle-mark {
  flex: none; width: 22px; height: 22px; border-radius: 7px;
  border: 1px solid var(--sf-hairline-hi);
  display: grid; place-items: center;
  font-size: 12px; line-height: 1; color: var(--sf-text-3);
  transition: all .16s;
}
.sf-toggle[data-on="true"] .sf-toggle-mark {
  background: linear-gradient(135deg, var(--sf-violet), var(--sf-rose));
  border-color: transparent; color: #12091C;
}

/* ── progress rail — the signature element ──────────────────── */
.sf-rail { display: flex; gap: 4px; }
.sf-seg {
  position: relative; flex: 1; height: 3px; border-radius: 999px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
  transition: background .4s ease;
}
.sf-seg[data-state="done"] { background: linear-gradient(90deg, var(--sf-violet), var(--sf-rose)); }
.sf-seg[data-state="active"] { background: rgba(167,139,250,0.28); }
.sf-seg[data-state="active"]::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, var(--sf-glint), transparent);
  transform: translateX(-100%);
  animation: sf-sweep 1.9s ease-in-out infinite;
}
@keyframes sf-sweep { to { transform: translateX(220%); } }

/* ── sparkles ───────────────────────────────────────────────── */
.sf-star {
  position: absolute;
  background: var(--sf-glint);
  clip-path: polygon(50% 0%, 59% 41%, 100% 50%, 59% 59%, 50% 100%, 41% 59%, 0% 50%, 41% 41%);
  pointer-events: none;
  opacity: 0;
}
.sf-star--ambient { animation: sf-twinkle var(--dur) ease-in-out var(--delay) infinite; }
@keyframes sf-twinkle {
  0%, 100% { opacity: 0; transform: scale(.2) rotate(0deg); }
  45%      { opacity: .95; transform: scale(1) rotate(75deg); }
  70%      { opacity: 0; transform: scale(.3) rotate(120deg); }
}
.sf-star--burst {
  animation: sf-burst 900ms cubic-bezier(.2,.7,.3,1) var(--delay) 1 both;
  filter: drop-shadow(0 0 4px rgba(253,230,138,.8));
}
@keyframes sf-burst {
  0%   { opacity: 0; transform: translate(0,0) scale(0) rotate(0deg); }
  25%  { opacity: 1; transform: translate(calc(var(--x)*.4), calc(var(--y)*.4)) scale(1) rotate(45deg); }
  100% { opacity: 0; transform: translate(var(--x), var(--y)) scale(.2) rotate(160deg); }
}

/* ── scrollbars inside chip wells ───────────────────────────── */
.sf-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.16) transparent; }
.sf-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
.sf-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.16); border-radius: 999px; }
.sf-scroll::-webkit-scrollbar-track { background: transparent; }

/* ── review list ────────────────────────────────────────────── */
.sf-row {
  display: grid; grid-template-columns: 104px 1fr; gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(255,255,255,0.055);
  font-size: 13.5px;
}
.sf-row:last-child { border-bottom: 0; }
.sf-row dt {
  font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  color: var(--sf-text-3); padding-top: 3px;
}
.sf-row dd { margin: 0; color: var(--sf-text); line-height: 1.5; word-break: break-word; }

/* ── react-select, themed to match ──────────────────────────── */
.sf-select__control {
  min-height: 46px !important;
  border-radius: 12px !important;
  background: var(--sf-raised) !important;
  border: 1px solid var(--sf-hairline) !important;
  box-shadow: none !important;
  transition: border-color .18s, background .18s, box-shadow .18s !important;
}
.sf-select__control:hover { border-color: var(--sf-hairline-hi) !important; }
.sf-select__control--is-focused {
  background: var(--sf-raised-hi) !important;
  border-color: rgba(167,139,250,0.65) !important;
  box-shadow: 0 0 0 3px rgba(167,139,250,0.16) !important;
}
.sf-select__value-container { padding: 2px 10px !important; }
.sf-select__placeholder { color: var(--sf-text-3) !important; font-size: 15px; }
.sf-select__single-value { color: var(--sf-text) !important; font-size: 15px; }
.sf-select__input-container, .sf-select__input { color: var(--sf-text) !important; font-size: 15px; }
.sf-select__indicator-separator { background: var(--sf-hairline) !important; }
.sf-select__dropdown-indicator, .sf-select__clear-indicator { color: var(--sf-text-3) !important; padding: 6px !important; }
.sf-select__dropdown-indicator:hover, .sf-select__clear-indicator:hover { color: var(--sf-text) !important; }
.sf-select__menu {
  background: #191428 !important;
  border: 1px solid var(--sf-hairline-hi) !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  box-shadow: 0 18px 44px -12px rgba(0,0,0,.8) !important;
  z-index: 60 !important;
}
.sf-select__menu-list { padding: 5px !important; }
.sf-select__option {
  border-radius: 9px !important;
  color: var(--sf-text-2) !important;
  font-size: 14px !important;
  padding: 9px 11px !important;
  cursor: pointer !important;
  background: transparent !important;
}
.sf-select__option--is-focused { background: rgba(167,139,250,0.16) !important; color: var(--sf-text) !important; }
.sf-select__option--is-selected { background: rgba(167,139,250,0.3) !important; color: #fff !important; }
.sf-select__multi-value {
  background: rgba(167,139,250,0.2) !important;
  border: 1px solid rgba(167,139,250,0.35) !important;
  border-radius: 999px !important;
  overflow: hidden;
}
.sf-select__multi-value__label { color: var(--sf-text) !important; font-size: 12px !important; font-weight: 600; padding: 3px 4px 3px 9px !important; }
.sf-select__multi-value__remove { color: var(--sf-text-2) !important; padding-right: 7px !important; }
.sf-select__multi-value__remove:hover { background: rgba(251,113,133,0.28) !important; color: #fff !important; }

/* ── quality floor ──────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .sf *, .sf *::before, .sf *::after {
    animation: none !important;
    transition-duration: .01ms !important;
  }
  .sf-star { display: none; }
}
`;

/* Ambient sparkles — fixed positions so they don't reshuffle on render */
const SF_AMBIENT = [
  { top: "22%", left: "7%",  s: 6,  delay: "0s",   dur: "3.6s" },
  { top: "62%", left: "15%", s: 4,  delay: "1.1s", dur: "4.2s" },
  { top: "16%", left: "27%", s: 5,  delay: "2.3s", dur: "3.9s" },
  { top: "74%", left: "38%", s: 3,  delay: ".6s",  dur: "4.6s" },
  { top: "30%", left: "52%", s: 4,  delay: "3.1s", dur: "3.4s" },
  { top: "68%", left: "63%", s: 6,  delay: "1.7s", dur: "4.1s" },
  { top: "20%", left: "76%", s: 4,  delay: "2.7s", dur: "3.7s" },
  { top: "58%", left: "88%", s: 5,  delay: ".3s",  dur: "4.4s" },
  { top: "36%", left: "94%", s: 3,  delay: "3.5s", dur: "3.2s" },
];

/* Burst that fires off the rail each time a step is cleared */
const SF_BURST = [
  { x: "-20px", y: "-15px", s: 6, delay: "0ms" },
  { x: "16px",  y: "-19px", s: 5, delay: "70ms" },
  { x: "23px",  y: "11px",  s: 4, delay: "130ms" },
  { x: "-15px", y: "16px",  s: 5, delay: "40ms" },
  { x: "2px",   y: "-24px", s: 3, delay: "170ms" },
];

/* Review-panel row. Defined at file level so it never remounts. */
const SfRow = ({ label, children }) => (
  <div className="sf-row">
    <dt>{label}</dt>
    <dd>{children}</dd>
  </div>
);


/* ═══════════════════════════════════════════════════════════════════
   BLOCK B — paste INSIDE your component, just above `return (`
   Only one new piece of state: the enhance button needs a busy flag.
   ═══════════════════════════════════════════════════════════════════ */

const [enhancing, setEnhancing] = useState(false);


/* ═══════════════════════════════════════════════════════════════════
   BLOCK C — replace your entire `return ( ... )` with this
   ═══════════════════════════════════════════════════════════════════ */

  return (
    <form
      onSubmit={handleSubmit}
      className="sf relative mx-auto  w-full max-w-xl sm:max-w-2xl overflow-visible rounded-[22px] border border-white/10 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.85)]"
      style={{
        background:
          "linear-gradient(180deg, #16111F 0%, #0B0913 26%, #0B0913 100%)",
      }}
    >
      <style>{SF_CSS}</style>

      {/* ── Header: the marquee. Sparkles live here and nowhere else. ── */}
      <div className="relative overflow-hidden rounded-t-[21px] border-b border-white/10 px-5 pb-5 pt-6 sm:px-7">
        {/* stage glow */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[130%] -translate-x-1/2 opacity-[0.55]"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 100%, rgba(167,139,250,0.5) 0%, rgba(244,114,182,0.18) 45%, transparent 75%)",
          }}
        />
        {SF_AMBIENT.map((st, i) => (
          <span
            key={i}
            className="sf-star sf-star--ambient"
            style={{
              top: st.top,
              left: st.left,
              width: st.s,
              height: st.s,
              "--delay": st.delay,
              "--dur": st.dur,
            }}
          />
        ))}

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="sf-eyebrow mb-1.5">Community listing</p>
            <h2 className="sf-display">Share an event</h2>
  
          </div>
          <span className="mt-1 flex-none rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold tabular-nums text-[color:var(--sf-text-2)]">
            {step}/{TOTAL_STEPS}
          </span>
        </div>
      </div>

      {/* ── Progress rail + step title ── */}
      <div className="relative px-5 pt-4 sm:px-7">
        <div className="sf-rail relative">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className="sf-seg"
              data-state={
                i + 1 < step ? "done" : i + 1 === step ? "active" : "todo"
              }
            />
          ))}

          {/* the burst — keyed on step so it replays on every advance */}
          <div
            key={step}
            className="pointer-events-none absolute top-1/2 h-0 w-0"
            style={{ left: `${((step - 0.5) / TOTAL_STEPS) * 100}%` }}
          >
            {SF_BURST.map((b, i) => (
              <span
                key={i}
                className="sf-star sf-star--burst"
                style={{
                  width: b.s,
                  height: b.s,
                  "--x": b.x,
                  "--y": b.y,
                  "--delay": b.delay,
                }}
              />
            ))}
          </div>
        </div>

        <h3 className="mt-3.5 font-[var(--sf-display)] text-[17px]  font-bold tracking-tight">
          {STEP_TITLES[step]}
        </h3>
      </div>

      {/* ── Step content ── */}
      <div className="px-5 py-5 sm:px-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* ─────────────── 1 · Venue ─────────────── */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="relative" ref={containerRef}>
                  <label className="sf-label" htmlFor="sf-venue">
                    Venue name
                  </label>
                  <input
                    id="sf-venue"
                    type="text"
                    value={venueSearch}
                    onChange={(e) => {
                      const val = e.target.value;

                      setVenueSearch(val);
                      setFormData((prev) => ({ ...prev, venue_name: val }));
                      setShowSuggestions(true);

                      // 🔥 AUTO PARSE LIVE
                      const parsed = parseFullAddress(val);

                      if (parsed.city || parsed.state) {
                        setFormData((prev) => ({
                          ...prev,
                          address: parsed.address || prev.address,
                          city: prev.city || parsed.city,
                          state: prev.state || parsed.state,
                        }));
                      }
                    }}
                    placeholder="Start typing — we'll find it"
                    autoComplete="off"
                    aria-invalid={venueNameError ? "true" : "false"}
                    className="sf-field"
                  />

                  {/* Suggestions */}
                  {showSuggestions && combinedResults.length > 0 && (
                    <div className="sf-scroll absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-white/15 bg-[#191428] p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85)]">
                      {combinedResults.map((item) => {
                        const isGoogle = item.type === "google";
                        const venue = item.name;
                        const details = venueDetailsMap[venue];

                        return (
                          <div
                            key={isGoogle ? item.place_id : venue}
                            onClick={() => {
                              if (isGoogle) {
                                const cleanName = parseGoogleVenueName(venue);
                                const streetOnly = cleanAddress(item.address);

                                setFormData((prev) => ({
                                  ...prev,
                                  venue_name: cleanName,
                                  address: streetOnly,
                                  city: item.city || "",
                                  state: normalizeState(item.state),
                                }));

                                setVenueSearch(cleanName);
                                setUsingGoogle(true);
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  venue_name: venue,
                                  address: details?.address || "",
                                  city: details?.city || "",
                                  state: normalizeState(details?.state),
                                }));

                                setVenueSearch(venue);
                                setUsingGoogle(false);
                              }

                              setShowSuggestions(false);
                            }}
                            className="group flex cursor-pointer items-start gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-violet-400/15"
                          >
                            <span
                              className={`mt-1.5 h-1.5 w-1.5 flex-none rounded-full ${
                                isGoogle ? "bg-sky-400" : "bg-violet-400"
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[14px] font-semibold text-[color:var(--sf-text)]">
                                {hasSearch &&
                                venue.toLowerCase() ===
                                  venueSearch.toLowerCase() ? (
                                  <span className="rounded bg-[color:var(--sf-glint)]/25 px-1 text-[color:var(--sf-glint)]">
                                    {venue}
                                  </span>
                                ) : (
                                  venue
                                )}
                              </div>
                              {(isGoogle
                                ? item.city || item.state
                                : details?.city || details?.state) && (
                                <div className="mt-0.5 truncate text-[12px] text-[color:var(--sf-text-3)]">
                                  {isGoogle
                                    ? `${item.city || ""}${
                                        item.city && item.state ? ", " : ""
                                      }${item.state || ""}`
                                    : `${details?.city || ""}${
                                        details?.city && details?.state
                                          ? ", "
                                          : ""
                                      }${details?.state || ""}`}
                                </div>
                              )}
                            </div>
                            <span className="mt-0.5 flex-none text-[9px] font-bold uppercase tracking-wider text-[color:var(--sf-text-3)]">
                              {isGoogle ? "Maps" : "Saved"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {venueNameError && <p className="sf-error">{venueNameError}</p>}

                  {venueSearch &&
                    !uniqueVenues.some(
                      (v) => v.toLowerCase() === venueSearch.toLowerCase()
                    ) && (
                      <p className="sf-hint mt-2">
                        No match yet —{" "}
                        <span className="font-semibold text-[color:var(--sf-violet)]">
                          “{venueSearch}”
                        </span>{" "}
                        will be added as a new venue.
                      </p>
                    )}
                </div>

                <div>
                  <label className="sf-label" htmlFor="sf-address">
                    Street address
                  </label>
                  <input
                    id="sf-address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St"
                    onBlur={(e) => {
                      const parsed = parseFullAddress(e.target.value);

                      if (parsed.city || parsed.state) {
                        setFormData((prev) => ({
                          ...prev,
                          address: parsed.address || prev.address,
                          city: prev.city || parsed.city,
                          state: prev.state || parsed.state,
                        }));
                      }
                    }}
                    className="sf-field"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
                  <div>
                    <label className="sf-label">City</label>
                    <CreatableSelect
                      classNamePrefix="sf-select"
                      options={cityOptions}
                      value={
                        formData.city
                          ? { value: formData.city, label: formData.city }
                          : null
                      }
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: selected?.value || "",
                        }))
                      }
                      placeholder="Search or add"
                      isClearable
                      formatCreateLabel={(val) => `Add “${val}”`}
                    />
                  </div>
                  <div>
                    <label className="sf-label" htmlFor="sf-state">
                      State
                    </label>
                    <select
                      id="sf-state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="sf-field"
                    >
                      <option value="">—</option>
                      {[
                        "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO",
                        "MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
                      ].map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────────── 2 · Timing ─────────────── */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="sf-label" htmlFor="sf-recurrence">
                    How often does it run?
                  </label>
                  <select
                    id="sf-recurrence"
                    name="recurrence_pattern"
                    value={formData.recurrence_pattern}
                    onChange={handleChange}
                    required
                    className="sf-field"
                  >
                    <option value="one-time">Once</option>
                    <option value="weekly">Every week</option>
                    <option value="bi-weekly">Every other week</option>
                    <option value="monthly">Every month</option>
                  </select>
                </div>

                {/* ONE-TIME */}
                {formData.recurrence_pattern === "one-time" && (
                  <div>
                    <label className="sf-label" htmlFor="sf-date">
                      Event date
                    </label>
                    <input
                      id="sf-date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="sf-field"
                    />
                  </div>
                )}

                {/* WEEKLY / BI-WEEKLY */}
                {["weekly", "bi-weekly"].includes(
                  formData.recurrence_pattern
                ) && (
                  <div>
                    <label className="sf-label" htmlFor="sf-anchor-w">
                      Next event date
                    </label>
                    <input
                      id="sf-anchor-w"
                      type="date"
                      name="recurrence_anchor_date"
                      value={formData.recurrence_anchor_date}
                      onChange={handleChange}
                      required
                      className="sf-field"
                    />
                    <div className="mt-2 flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/[0.07] px-3 py-2">
                      <span className="h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--sf-violet)] shadow-[0_0_8px_var(--sf-violet)]" />
                      <p className="text-[12.5px] text-[color:var(--sf-text-2)]">
                        {formData.day_of_week ? (
                          <>
                            Repeats{" "}
                            {formData.recurrence_pattern === "weekly"
                              ? "every"
                              : "every other"}{" "}
                            <span className="font-bold text-[color:var(--sf-text)]">
                              {formData.day_of_week}
                            </span>
                          </>
                        ) : (
                          "Pick a date and we'll set the repeat day."
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* MONTHLY */}
                {formData.recurrence_pattern === "monthly" && (
                  <div className="sf-panel space-y-4">
                    <div>
                      <label className="sf-label" htmlFor="sf-monthly-mode">
                        Monthly rule
                      </label>
                      <select
                        id="sf-monthly-mode"
                        value={monthlyMode}
                        onChange={(e) => {
                          setMonthlyMode(e.target.value);
                          setMonthlyWeekdayRules([]);
                        }}
                        className="sf-field"
                      >
                        <option value="date">Same date each month</option>
                        <option value="weekday">
                          By weekday (1st Fri, last Sun…)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="sf-label" htmlFor="sf-anchor-m">
                        Next event date
                      </label>
                      <input
                        id="sf-anchor-m"
                        type="date"
                        name="recurrence_anchor_date"
                        value={formData.recurrence_anchor_date}
                        onChange={handleChange}
                        required
                        className="sf-field"
                      />
                    </div>

                    {monthlyMode === "weekday" &&
                      formData.recurrence_anchor_date && (
                        <div>
                          <label className="sf-label">Which weekdays</label>
                          <Select
                            isMulti
                            options={[
                              "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
                            ].flatMap((day) =>
                              ["1st", "2nd", "3rd", "4th", "Last"].map(
                                (prefix) => ({
                                  value: `${prefix} ${day}`,
                                  label: `${prefix} ${day}`,
                                })
                              )
                            )}
                            value={monthlyWeekdayRules.map((r) => ({
                              value: r,
                              label: r,
                            }))}
                            onChange={(selected) => {
                              setMonthlyWeekdayRules(
                                selected.map((opt) => opt.value)
                              );
                            }}
                            placeholder="e.g. 1st Friday"
                            classNamePrefix="sf-select"
                          />
                          <p className="sf-hint mt-2">
                            Pick one or more. Add “1st Friday” and the event
                            lands on the first Friday of every month.
                          </p>
                        </div>
                      )}
                  </div>
                )}

                {/* TIMES */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="sf-label" htmlFor="sf-start">
                      Starts
                    </label>
                    <input
                      id="sf-start"
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      required
                      className="sf-field"
                    />
                  </div>
                  <div>
                    <label className="sf-label" htmlFor="sf-end">
                      Ends
                    </label>
                    <input
                      id="sf-end"
                      type="time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                      required
                      className="sf-field"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─────────────── 3 · Event type ─────────────── */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search event types"
                    value={eventTypeSearch}
                    onChange={(e) => setEventTypeSearch(e.target.value)}
                    className="sf-field"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="sf-eyebrow">
                    {filteredEventTypes.length} available
                  </p>
                  <p className="text-[11px] font-bold text-[color:var(--sf-violet)]">
                    {formData.event_type.length} selected
                  </p>
                </div>

                <div className="sf-scroll max-h-[46vh] overflow-y-auto rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                  <div className="flex flex-wrap gap-2">
                    {filteredEventTypes.map((opt) => {
                      const isSelected = formData.event_type.includes(opt.value);

                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={isSelected}
                          data-on={isSelected}
                          onClick={() => {
                            setFormData((prev) => {
                              const exists = prev.event_type.includes(opt.value);

                              return {
                                ...prev,
                                event_type: exists
                                  ? prev.event_type.filter(
                                      (v) => v !== opt.value
                                    )
                                  : [...prev.event_type, opt.value],
                              };
                            });
                          }}
                          className="sf-chip"
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {formData.event_type.some((type) =>
                  ["theatre","audition","pride","live_music","fair","open_mic","trivia"].includes(type)
                ) && (
                  <div className="sf-panel space-y-3">
                    <div>
                      <p className="sf-label mb-1">Extra show dates</p>
                      <p className="sf-hint">
                        Running the same show on other nights? List them here.
                      </p>
                    </div>

                 {showDates.map((date, idx) => (
  <div
    key={idx}
    className="
      rounded-2xl border border-white/10
      bg-white/[0.02]
      p-3
    "
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Date */}
      <input
        type="date"
        value={date.date}
        onChange={(e) => {
          const updated = [...showDates];
          updated[idx].date = e.target.value;
          setShowDates(updated);
        }}
        className="sf-field w-full sm:flex-1"
      />

      {/* Time + Delete */}
      <div className="flex items-center gap-2 sm:w-auto">
        <input
          type="time"
          value={date.time}
          onChange={(e) => {
            const updated = [...showDates];
            updated[idx].time = e.target.value;
            setShowDates(updated);
          }}
          className="sf-field flex-1 sm:w-[120px]"
        />

        <button
          type="button"
          aria-label="Remove this date"
          onClick={() =>
            setShowDates(showDates.filter((_, i) => i !== idx))
          }
          className="
            flex h-[46px] w-[46px] shrink-0
            items-center justify-center
            rounded-xl
            border border-rose-400/20
            bg-rose-500/5
            text-rose-300
            transition-all
            hover:bg-rose-500/15
            hover:border-rose-400/40
            hover:scale-105
          "
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
))}

<button
  type="button"
  onClick={() =>
    setShowDates([...showDates, { date: "", time: "" }])
  }
  className="sf-btn sf-btn--quiet w-full"
>
  + Add Another Date
</button>    </div>
                )}
              </div>
            )}

            {/* ─────────────── 4 · Add-ons ─────────────── */}
            {step === 4 && (
              <div className="space-y-3">
                <p className="sf-hint -mt-1">
                  All optional. Continue to skip.
                </p>

                {/* ARTISTS */}
                <button
                  type="button"
                  data-on={showArtists}
                  onClick={() => setShowArtists(!showArtists)}
                  className="sf-toggle"
                >
                  <span className="flex flex-col gap-0.5">
                    <span>Artists on the bill</span>
                    <span className="text-[11px] font-normal text-[color:var(--sf-text-3)]">
                      {selectedBandIds.length
                        ? `${selectedBandIds.length} added`
                        : "Tag who's performing"}
                    </span>
                  </span>
                  <span className="sf-toggle-mark">{showArtists ? "−" : "+"}</span>
                </button>

                {showArtists && (
                  <div className="sf-panel space-y-3">
                    <input
                      type="text"
                      placeholder="Search artists"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="sf-field"
                    />

                    <div className="sf-scroll grid max-h-[38vh] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
                      {filteredBands.map((artist) => {
                        const isSelected = selectedBandIds.includes(artist.id);

                        return (
                          <button
                            key={artist.id}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => {
                              setSelectedBandIds((prev) =>
                                prev.includes(artist.id)
                                  ? prev.filter((id) => id !== artist.id)
                                  : [...prev, artist.id]
                              );
                            }}
                            className={`group flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all duration-200 active:scale-95 ${
                              isSelected
                                ? "border-violet-400/55 bg-violet-400/10"
                                : "border-white/[0.07] hover:border-white/20"
                            }`}
                          >
                            <span className="relative">
                              <img
                                src={artist.image_url}
                                alt=""
                                className={`h-12 w-12 rounded-full object-cover transition-all ${
                                  isSelected
                                    ? "ring-2 ring-[color:var(--sf-violet)] ring-offset-2 ring-offset-[#0B0913]"
                                    : "opacity-70 group-hover:opacity-100"
                                }`}
                              />
                              {isSelected && (
                                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[color:var(--sf-violet)] text-[9px] font-bold text-[#12091C]">
                                  ✓
                                </span>
                              )}
                            </span>
                            <span
                              className={`line-clamp-2 text-center text-[10.5px] font-semibold leading-tight ${
                                isSelected
                                  ? "text-[color:var(--sf-text)]"
                                  : "text-[color:var(--sf-text-3)]"
                              }`}
                            >
                              {artist.artist_name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedBandIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {bands
                      .filter((b) => selectedBandIds.includes(b.id))
                      .map((artist) => (
                        <span
                          key={artist.id}
                          className="rounded-full border border-violet-400/30 bg-violet-400/15 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--sf-text)]"
                        >
                          {artist.artist_name}
                        </span>
                      ))}
                  </div>
                )}

                {/* EXTRA DAYS — one-time & weekly only */}
                {!["monthly", "bi-weekly"].includes(
                  formData.recurrence_pattern
                ) && (
                  <>
                    <button
                      type="button"
                      data-on={showAdditionalDays}
                      onClick={() => setShowAdditionalDays(!showAdditionalDays)}
                      className="sf-toggle"
                    >
                      <span className="flex flex-col gap-0.5">
                        <span>More days</span>
                        <span className="text-[11px] font-normal text-[color:var(--sf-text-3)]">
                          {additionalDays.length
                            ? `${additionalDays.length} added`
                            : "Also runs Mondays and Tuesdays?"}
                        </span>
                      </span>
                      <span className="sf-toggle-mark">
                        {showAdditionalDays ? "−" : "+"}
                      </span>
                    </button>

                    {showAdditionalDays && (
                      <div className="sf-panel space-y-3">
                        <button
                          type="button"
                          data-on={sevenDays}
                          onClick={() => setSevenDays((prev) => !prev)}
                          className="sf-chip w-full justify-center"
                        >
                          {sevenDays ? "Runs 7 days a week" : "Runs 7 days a week?"}
                        </button>

                        <div className="flex flex-wrap gap-1.5">
                          {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(
                            (day) => {
                              const existing = additionalDays.find(
                                (d) => d.day === day
                              );
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  aria-pressed={!!existing}
                                  data-on={!!existing}
                                  onClick={() => {
                                    setAdditionalDays((prev) => {
                                      if (existing) {
                                        return prev.filter((d) => d.day !== day);
                                      } else {
                                        return [
                                          ...prev,
                                          { day, start: "", end: "" },
                                        ];
                                      }
                                    });
                                  }}
                                  className="sf-chip flex-1 justify-center px-2"
                                >
                                  <span className="sm:hidden">{day.slice(0, 3)}</span>
                                  <span className="hidden sm:inline">{day.slice(0, 3)}</span>
                                </button>
                              );
                            }
                          )}
                        </div>

                        {additionalDays.map((item, idx) => (
                          <div
                            key={item.day}
                            className="flex items-center gap-2 border-t border-white/[0.06] pt-3"
                          >
                            <span className="w-9 flex-none text-[11px] font-bold uppercase tracking-wider text-[color:var(--sf-text-2)]">
                              {item.day.slice(0, 3)}
                            </span>
                            <input
                              type="time"
                              value={item.start}
                              onChange={(e) => {
                                const updated = [...additionalDays];
                                updated[idx].start = e.target.value;
                                setAdditionalDays(updated);
                              }}
                              className="sf-field flex-1"
                              required
                            />
                            <span className="flex-none text-[color:var(--sf-text-3)]">–</span>
                            <input
                              type="time"
                              value={item.end}
                              onChange={(e) => {
                                const updated = [...additionalDays];
                                updated[idx].end = e.target.value;
                                setAdditionalDays(updated);
                              }}
                              className="sf-field flex-1"
                              required
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* EVENTBRITE */}
                <button
                  type="button"
                  data-on={showEventbrite}
                  onClick={() => {
                    setShowEventbrite((v) => {
                      const next = !v;
                      if (!next) {
                        setFormData((p) => ({ ...p, eventbrite_url: "" }));
                        setEventbriteError("");
                      }
                      return next;
                    });
                  }}
                  className="sf-toggle"
                >
                  <span className="flex flex-col gap-0.5">
                    <span>Ticket link</span>
                    <span className="text-[11px] font-normal text-[color:var(--sf-text-3)]">
                      Send people straight to Eventbrite
                    </span>
                  </span>
                  <span className="sf-toggle-mark">
                    {showEventbrite ? "−" : "+"}
                  </span>
                </button>

                {showEventbrite && (
                  <div className="sf-panel">
                    <label className="sf-label" htmlFor="sf-eb">
                      Eventbrite URL
                    </label>
                    <input
                      id="sf-eb"
                      type="url"
                      name="eventbrite_url"
                      value={formData.eventbrite_url}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        setFormData((prev) => ({ ...prev, eventbrite_url: val }));
                        if (val && !EVENTBRITE_RE.test(val)) {
                          setEventbriteError(
                            "URL must start with Eventbrite (e.g. https://www.eventbrite.com/e/...)"
                          );
                        } else {
                          setEventbriteError("");
                        }
                      }}
                      placeholder="https://www.eventbrite.com/e/..."
                      pattern="https?://(www\.)?eventbrite\.[a-z.]+/e/.*"
                      aria-invalid={eventbriteError ? "true" : "false"}
                      className="sf-field"
                    />
                    {eventbriteError ? (
                      <p className="sf-error">{eventbriteError}</p>
                    ) : (
                      <p className="sf-hint mt-2">
                        Paste the full event link, not the organizer page.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ─────────────── 5 · Description ─────────────── */}
            {step === 5 && (
              <div className="space-y-3">
                <div>
                  <label className="sf-label" htmlFor="sf-desc">
                    What should people know?
                  </label>
                  <textarea
                    id="sf-desc"
                    name="description"
                    value={formData.description}
                    onChange={(e) => {
                      const input = e.target.value;
                      const trimmed = input.slice(0, 800);
                      setFormData((prev) => ({ ...prev, description: trimmed }));
                    }}
                    onKeyDown={(e) => {
                      // STOP react-select or hotkeys from blocking space bar
                      e.stopPropagation();
                    }}
                    placeholder="Cover charge, sign-up time, what the vibe is, who should come…"
                    className="sf-field"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={enhancing}
                    onClick={async () => {
                      if (
                        !formData.description.trim() &&
                        !formData.venue_name.trim() &&
                        !formData.event_type.length
                      )
                        return;
                      try {
                        setEnhancing(true);
                        const selectedEventTypeLabels = formData.event_type.map(
                          (type) => {
                            const found = EVENT_TYPE_OPTIONS.find(
                              (opt) => opt.value === type
                            );
                            return found?.label || prettyValue(type);
                          }
                        );

                        const res = await axios.post(
                          "https://singspacebackend.onrender.com/api/enhance-event-description",
                          {
                            description: formData.description,
                            venue_name: formData.venue_name,
                            event_types: selectedEventTypeLabels,
                          }
                        );

                        if (res.data?.enhanced_description) {
                          setFormData((prev) => ({
                            ...prev,
                            description: res.data.enhanced_description.slice(
                              0,
                              800
                            ),
                          }));
                        }
                      } catch (err) {
                        console.error("Enhancement failed:", err);
                        alert("Could not enhance description. Please try again.");
                      } finally {
                        setEnhancing(false);
                      }
                    }}
                    className="sf-btn sf-btn--quiet"
                  >
                    <span
                      className={`text-[color:var(--sf-glint)] ${
                        enhancing ? "animate-pulse" : ""
                      }`}
                    >
                      ✦
                    </span>
                    {enhancing ? "Polishing…" : "Polish it for me"}
                  </button>

                  <span className="text-[11px] tabular-nums text-[color:var(--sf-text-3)]">
                    {
                      formData.description.trim().split(/\s+/).filter(Boolean)
                        .length
                    }{" "}
                    words ·{" "}
                    <span
                      className={
                        Array.from(formData.description).length > 760
                          ? "font-bold text-[color:var(--sf-danger)]"
                          : ""
                      }
                    >
                      {Array.from(formData.description).length}/800
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* ─────────────── 6 · Review ─────────────── */}
            {step === 6 && (
              <div className="space-y-4">
                <p className="sf-hint -mt-1">
                  Last look. Anything wrong, step back and fix it.
                </p>

                <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] px-4">
                  <dl>
                    <SfRow label="Venue">
                      {formData.venue_name || "—"}
                    </SfRow>
                    <SfRow label="Where">
                      {formData.address || "—"}
                      {(formData.city || formData.state) && (
                        <span className="block text-[color:var(--sf-text-2)]">
                          {formData.city}
                          {formData.city && formData.state ? ", " : ""}
                          {formData.state}
                        </span>
                      )}
                    </SfRow>

                    <SfRow label="Repeats">
                      <span className="capitalize">
                        {formData.recurrence_pattern}
                      </span>

                      {["weekly", "bi-weekly"].includes(
                        formData.recurrence_pattern
                      ) &&
                        formData.day_of_week && (
                          <span className="block text-[color:var(--sf-text-2)]">
                            {formData.day_of_week}s · next on{" "}
                            {formData.recurrence_anchor_date || "—"}
                          </span>
                        )}

                      {formData.recurrence_pattern === "monthly" && (
                        <span className="block text-[color:var(--sf-text-2)]">
                          {monthlyMode === "date"
                            ? "Same date each month"
                            : "By weekday"}{" "}
                          · next on {formData.recurrence_anchor_date || "—"}
                          {monthlyMode === "weekday" &&
                            monthlyWeekdayRules.length > 0 && (
                              <span className="block">
                                {monthlyWeekdayRules.join(", ")}
                              </span>
                            )}
                        </span>
                      )}

                      {formData.recurrence_pattern === "one-time" && (
                        <span className="block text-[color:var(--sf-text-2)]">
                          {formData.date || "—"}
                        </span>
                      )}

                      {sevenDays && (
                        <span className="block text-[color:var(--sf-text-2)]">
                          7 days a week
                        </span>
                      )}
                    </SfRow>

                    <SfRow label="Time">
                      {formData.start_time
                        ? new Date(
                            `1970-01-01T${formData.start_time}`
                          ).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "-"}{" "}
                      –{" "}
                      {formData.end_time
                        ? new Date(
                            `1970-01-01T${formData.end_time}`
                          ).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "-"}
                    </SfRow>

                    <SfRow label="Type">
                      {formData.event_type.length ? (
                        <span className="flex flex-wrap gap-1.5">
                          {formData.event_type.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-violet-400/30 bg-violet-400/15 px-2 py-0.5 text-[11px] font-semibold"
                            >
                              {prettyValue(t)}
                            </span>
                          ))}
                        </span>
                      ) : (
                        "—"
                      )}
                    </SfRow>

                    {showDates.length > 0 && (
                      <SfRow label="Also on">
                        {showDates.map((d, i) => (
                          <span key={i} className="block">
                            {formatShowDate(d.date, d.time)}
                          </span>
                        ))}
                      </SfRow>
                    )}

                    {showAdditionalDays && additionalDays.length > 0 && (
                      <SfRow label="Extra days">
                        {additionalDays.map((d) => (
                          <span key={d.day} className="block">
                            {d.day} · {d.start}–{d.end}
                          </span>
                        ))}
                      </SfRow>
                    )}

                    {showEventbrite && formData.eventbrite_url && (
                      <SfRow label="Tickets">
                        <a
                          href={formData.eventbrite_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-[color:var(--sf-violet)] underline underline-offset-2 hover:text-[color:var(--sf-rose)]"
                        >
                          {formData.eventbrite_url}
                        </a>
                      </SfRow>
                    )}

                    <SfRow label="Details">
                      <span className="whitespace-pre-line">
                        {formData.description || "—"}
                      </span>
                    </SfRow>

                    {relatedArtistData.length > 0 && (
                      <SfRow label="Artists">
                        <span className="flex flex-wrap gap-2 pt-0.5">
                          {relatedArtistData.map((artist) => (
                            <span
                              key={artist.id}
                              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] py-0.5 pl-0.5 pr-2.5"
                            >
                              <img
                                src={artist.image_url}
                                alt=""
                                className="h-5 w-5 rounded-full object-cover"
                              />
                              <span className="text-[11px] font-semibold">
                                {artist.artist_name}
                              </span>
                            </span>
                          ))}
                        </span>
                      </SfRow>
                    )}
                  </dl>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer: sticks to the bottom of the viewport on long steps ── */}
      <div className="sticky bottom-0 z-20 rounded-b-[21px] border-t border-white/10 bg-[#0B0913]/85 px-5 py-3.5 backdrop-blur-xl sm:px-7">
        {(stepError || error) && (
          <p className="sf-error mb-2.5 text-center">{stepError || error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="sf-btn sf-btn--ghost"
          >
            Back
          </button>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={nextStep}
              className="sf-btn sf-btn--primary flex-1"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="sf-btn sf-btn--primary sf-btn--submit flex-1"
            >
              Submit event
            </button>
          )}
        </div>
      </div>

      {/* ── Success ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="sf relative w-full max-w-sm overflow-hidden rounded-[20px] border border-white/10 bg-[#14101F] p-7 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
            {SF_AMBIENT.slice(0, 6).map((st, i) => (
              <span
                key={i}
                className="sf-star sf-star--ambient"
                style={{
                  top: st.top,
                  left: st.left,
                  width: st.s,
                  height: st.s,
                  "--delay": st.delay,
                  "--dur": st.dur,
                }}
              />
            ))}

            <div className="relative">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
                <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
                  <path
                    d="M2 7.5L7.5 13L18 2"
                    stroke="#34D399"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 className="sf-display mt-4">Event submitted</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--sf-text-2)]">
                It's in the queue. A moderator will approve it and it'll show up
                on the board.
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="sf-btn sf-btn--primary mt-6 w-full"
              >
                Submit another event
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default RequestEvent;
