// components/RequestEvent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

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
const API = "https://singspacebackend.onrender.com";

const [prideName, setPrideName] = useState("");

  const [relatedArtistData, setRelatedArtistData] = useState([]);

const [monthlyMode, setMonthlyMode] = useState("date");   // "date" | "weekday"
const [monthlyWeekdayRules, setMonthlyWeekdayRules] = useState([]);
// Monthly weekday rule text
const monthlyRuleText =
  formData.recurrence_pattern === "monthly" &&
  monthlyMode === "weekday" &&
  monthlyWeekdayRules.length > 0
    ? `Monthly Rules: ${monthlyWeekdayRules.join(", ")}`
    : "";


  // ---------- Wizard state ----------
  const [step, setStep] = useState(1); // 1..6
  const TOTAL_STEPS = 6;
  const [stepError, setStepError] = useState("");

  // ---------- Existing feature states (preserved) ----------
  const [submitted, setSubmitted] = useState(false);
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
  const [additionalDays, setAdditionalDays] = useState([]);
  const [sevenDays, setSevenDays] = useState(false);

  const [showArtists, setShowArtists] = useState(false);

  const EVENTBRITE_RE = /^https?:\/\/(www\.)?eventbrite\.[a-z.]+\/e\/.+/i;
  const [showEventbrite, setShowEventbrite] = useState(false);
  const [eventbriteError, setEventbriteError] = useState("");

  const [showDates, setShowDates] = useState([]);

  const [venueNameError, setVenueNameError] = useState("");

const getPridePrefix = () =>
  prideName ? `${prideName} Presents:` : "";

const hasPridePrefix = (txt = "") => {
  if (!prideName) return false;
  const re = new RegExp(
    `^\\s*${prideName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+presents\\s*:`,
    "i"
  );
  return re.test(txt);
};

const stripPridePrefix = (txt = "") => {
  if (!prideName) return txt;
  const re = new RegExp(
    `^\\s*${prideName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+presents\\s*:\\s*`,
    "i"
  );
  return txt.replace(re, "").trimStart();
};

const togglePridePrefix = () => {
  if (!prideName) return;

  setFormData((prev) => {
    const desc = prev.description || "";

    if (hasPridePrefix(desc)) {
      return {
        ...prev,
        description: stripPridePrefix(desc),
      };
    }

    const next = `${getPridePrefix()} ${desc}`.trim();
    return {
      ...prev,
      description: next.slice(0, 800),
    };
  });
};

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
useEffect(() => {
  async function fetchPride() {
    try {
      const res = await axios.get(`${API}/api/pride/1`);
      setPrideName(res.data?.name || "");
    } catch (err) {
      console.error("Failed to load Pride Center");
    }
  }

  fetchPride();
}, []);

  // ---------- Misc helpers ----------
  const eventTypeOptions = [
    { value: "karaoke", label: "🎤 Karaoke" },
    { value: "open_mic", label: "🎶 Open Mic" },
    { value: "drag", label: "👠 Drag Show" },
    { value: "live_music", label: "🎸 Live Music" },
    { value: "trivia", label: "🧠 Trivia" },
    { value: "theatre", label: "🎭 Theatre Production" },
    { value: "audition", label: "🎬 Auditions" },
      { value: "paint_sip", label: "🎨🍷 Paint & Sip" },

    { value: "lgbtqia_plus", label: "🌈 LGBTQIA+" },
    { value: "poetry_slam", label: "📝 Poetry Slam" },
    { value: "comedy", label: "🤡 Comedy Shows" },
    { value: "fireworks", label: "🎆 Fireworks" },
    { value: "halloween", label: "🎃 Halloween" },
    { value: "dancing", label: "💃 Dancing" },
    { value: "art", label: "🎨 Art" },
    { value: "fair", label: "🎪 Fair" },
    { value: "concert", label: "🎟️ Concert" },
    { value: "new_years_eve", label: "🎊 New Year’s Eve" },
    { value: "new_years_day", label: "🥂 New Year’s Day" },
    { value: "st_patricks_day", label: "☘️ St. Patrick’s Day" },
    { value: "thanksgiving", label: "🦃 Thanksgiving" },
    { value: "christmas", label: "🎄 Christmas" },
    { value: "other", label: "🌀 Other" },
  ];

  const options = filteredBands.map((band) => ({
    value: band.id,
    label: band.artist_name,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "venue_name" && value.trim()) setVenueNameError("");
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
      ...formData,
      event_type: Array.isArray(formData.event_type)
        ? formData.event_type.join(",")
        : formData.event_type,
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
        "https://singspacebackend.onrender.com/event-submissions",
        payload
      );
      setSubmitted(true);

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
  return "Select a day of the week.";
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

  // ---------- Submitted state ----------
  if (submitted) {
    return (
      <p className="text-green-600 font-semibold text-center">
        ✅ Your event request has been submitted!
      </p>
    );
  }

  // ---------- Progress ----------
  const progressWidth = `${(step / TOTAL_STEPS) * 100}%`;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-2 bg-white/90  shadow-xl max-w-5xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto border border-purple-300"
    >
      {/* Header */}
      <div className="text-center bg-gradient-to-br from-yellow-200 via-orange-100 to-yellow-200  border-black border-b-2 mb-2">
        <h2 className="text-2xl bg-black sm:text-3xl font-extrabold neon-pulse tracking-tight uppercase">
          Got an Event?
        </h2>
        <p className="text-black/80 font-bold text-sm sm:text-base">
          Submit your event and reach thousands instantly. One-time, weekly, bi-weekly, or monthly!
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 border-2  border-purple-700 rounded-full h-4">
        <div
          className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-500"
          style={{ width: progressWidth }}
        />
      </div>

      {/* Step content */}
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
          {/* 1️⃣ Venue Details */}
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold  bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 text-white font-serif text-center drop-shadow-lg mb-4">
  Venue Information
</h2>

         <CreatableSelect
  className="text-black text-center font-bold"
  classNamePrefix="react-select"
  options={uniqueVenues.map((venue) => ({
    value: venue,
    label: venue,
  }))}
  placeholder="Add or Search Venue Name"
  value={
    formData.venue_name
      ? { value: formData.venue_name, label: formData.venue_name }
      : null
  }
  onChange={(selected) => {
    const selectedVenue = selected?.value || "";
    const details = venueDetailsMap[selectedVenue];
    setFormData((prev) => ({
      ...prev,
      venue_name: selectedVenue,
      address: details?.address || "",
      city: details?.city || "",
      state: details?.state || "",
    }));
    if (selectedVenue.trim()) setVenueNameError("");
  }}
  isClearable
  formatCreateLabel={(inputValue) => `➕ Use "${inputValue}" as new venue`}
  
  /** 🔥 FIX FOR SPACE NOT WORKING 🔥 */
  onKeyDown={(e) => {
    if (e.key === " ") {
      e.stopPropagation(); // prevent react-select from hijacking the space
    }
  }}
/>

              {venueNameError && (
                <p className="text-red-500 text-sm">{venueNameError}</p>
              )}

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="231 Karaoke Avenue"
                required
                className="w-full p-3 border font-bold border-purple-300 rounded bg-white shadow-sm focus:ring-2 text-black placeholder:text-black/50 text-center focus:ring-purple-400"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CreatableSelect
                  className="text-black text-center font-bold"
                  classNamePrefix="react-select"
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
                  placeholder="Add or Select a City..."
                  isClearable
                  formatCreateLabel={(val) => `➕ Add "${val}"`}
                />
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-purple-300 font-bold rounded bg-white shadow-sm focus:ring-2 text-black placeholder:text-black/40 text-center focus:ring-purple-400"
                >
                  <option value=""> Select State</option>
                  {[
                    "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO",
                    "MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
                  ].map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* 2️⃣ Event Timing */}
          {step === 2 && (
            <div className="space-y-3">
                            <h2 className="text-3xl sm:text-4xl font-extrabold  bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 text-white font-serif text-center drop-shadow-lg mb-4">
  Time & Date
</h2>
              <select
                name="recurrence_pattern"
                value={formData.recurrence_pattern}
                onChange={handleChange}
                required
                className="w-full p-3 border text-black text-center border-purple-300 rounded bg-white shadow-sm focus:ring-2 focus:ring-purple-400"
              >
                <option value="one-time">🎉 One-Time Event</option>
                <option value="weekly">🔁 Weekly Event</option>
                <option value="bi-weekly">📆 Bi-Weekly Event</option>
                <option value="monthly">🗓️ Monthly Event</option>
              </select>
{/* MONTHLY MODE UI */}
{formData.recurrence_pattern === "monthly" && (
  <div className="p-3 mt-3 border border-purple-300 rounded bg-purple-50 space-y-3">

    {/* Mode Selector */}
    <label className="font-semibold text-center block text-black">
      Monthly Repeat Options
    </label>

    <select
      value={monthlyMode}
      onChange={(e) => {
        setMonthlyMode(e.target.value);
setMonthlyWeekdayRules([]);
      }}
      className="w-full p-2 bg-white border rounded text-black text-center"
    >
      <option value="date">📅 Monthly on this date</option>
      <option value="weekday">🗓️ Monthly by weekday (1st Fri, Last Sun…)</option>
    </select>

    {/* Always show anchor date */}
    <div className="text-center">
      <label className="font-semibold text-mg text-center text-black">
        When is the next event?:
      </label>
      <input
        type="date"
        name="recurrence_anchor_date"
        value={formData.recurrence_anchor_date}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded bg-white text-black text-center"
      />

    </div>

    {/* Weekday rule appears only if monthlyMode === "weekday" */}
{monthlyMode === "weekday" && formData.recurrence_anchor_date && (
      <div className="text-center">
        <label className="font-semibold text-sm text-black">
          Select Monthly Weekday Rule:
        </label>

     <Select
  isMulti
  options={["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    .flatMap((day) =>
      ["1st","2nd","3rd","4th","Last"].map((prefix) => ({
        value: `${prefix} ${day}`,
        label: `${prefix} ${day}`,
      }))
    )
  }
  value={monthlyWeekdayRules.map((r) => ({ value: r, label: r }))}
  onChange={(selected) => {
    setMonthlyWeekdayRules(selected.map((opt) => opt.value));
  }}
  placeholder="Select one or more weekday rules..."
  className="text-black"
  classNamePrefix="react-select"
/>


        <p className="text-xs text-gray-600 italic text-center">
          This tells the system patterns like “1st Friday”.
        </p>
      </div>
    )}
  </div>
)}

{["weekly", "bi-weekly"].includes(formData.recurrence_pattern) && (

                <select
                  name="day_of_week"
                  value={formData.day_of_week}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-purple-300 rounded bg-white shadow-sm focus:ring-2 text-black text-center focus:ring-purple-400"
                >
                  <option value="">📅 -- Select Day of Week --</option>
                  {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
                    .map((d) => <option key={d}>{d}</option>)}
                </select>
              )}

              <div className="flex gap-4">
                {formData.recurrence_pattern === "one-time" && (
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border text-black border-purple-300 rounded bg-white shadow-sm focus:ring-2 text-black text-center focus:ring-purple-400"
                  />
                )}

                {["bi-weekly",].includes(formData.recurrence_pattern) && (
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="recurrence_anchor_date"
                      className="text-black font-semibold mb-1 text-sm"
                    >
                      Next Event Date:
                    </label>
                    <input
                      type="date"
                      id="recurrence_anchor_date"
                      name="recurrence_anchor_date"
                      value={formData.recurrence_anchor_date}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-purple-300 rounded bg-gray-200 shadow-sm focus:ring-2 text-black text-center focus:ring-purple-400"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 bg-white py-2 px-2 text-center uppercase gap-4 w-full">
                <div className="flex flex-col">
                  <label className="text-black font-semibold mb-1 text-sm">
                    Start Time:
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    required
                    className="p-3 border text-black bg-gray-200 text-center border-purple-300 rounded shadow-sm focus:ring-2 focus:ring-purple-400 [&::-webkit-calendar-picker-indicator]:invert-0"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-black font-semibold mb-1 text-sm">
                    End Time:
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    required
                    className="p-3 border text-black bg-gray-200 text-center border-purple-300 rounded shadow-sm focus:ring-2 focus:ring-purple-400 [&::-webkit-calendar-picker-indicator]:invert-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3️⃣ Event Type (+ theatre show dates) */}
          {step === 3 && (
            <div className="space-y-3">
                                          <h2 className="text-3xl sm:text-4xl font-extrabold  bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 text-white font-serif text-center drop-shadow-lg mb-4">
  Event Type(s)
</h2>

              <Select
                isMulti
                name="event_type"
                options={eventTypeOptions}
                value={eventTypeOptions.filter((opt) =>
                  formData.event_type.includes(opt.value)
                )}
                onChange={(selectedOptions) => {
                  setFormData((prev) => ({
                    ...prev,
                    event_type: selectedOptions.map((opt) => opt.value),
                  }));
                }}
                className="text-md font-bold text-black z-20 text-center"
                classNamePrefix="react-select"
                placeholder="Select one or more event types..."
              />

              {formData.event_type.includes("theatre") && (
                <div className="my-2 p-4 border-2 border-purple-400 rounded bg-white shadow space-y-3">
                  <h3 className="text-lg font-bold text-purple-700 text-center">
                    🎭 Additional Show Dates
                  </h3>

                  {showDates.map((date, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-3 items-center">
                      <input
                        type="date"
                        value={date.date}
                        onChange={(e) => {
                          const updated = [...showDates];
                          updated[idx].date = e.target.value;
                          setShowDates(updated);
                        }}
                        className="w-full sm:w-1/2 p-2 border rounded bg-white text-black"
                      />
                      <input
                        type="time"
                        value={date.time}
                        onChange={(e) => {
                          const updated = [...showDates];
                          updated[idx].time = e.target.value;
                          setShowDates(updated);
                        }}
                        className="w-full sm:w-1/2 p-2 border rounded bg-white text-black"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowDates(showDates.filter((_, i) => i !== idx))
                        }
                        className="px-2 py-1 bg-red-400 text-white rounded"
                      >
                        ❌
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setShowDates([...showDates, { date: "", time: "" }])}
                    className="w-full bg-gradient-to-tr from-purple-300 to-pink-400 text-white font-semibold py-2 rounded shadow"
                  >
                    ➕ Add Show Date
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 4️⃣ Extras: Artists, Days, Eventbrite */}
          {step === 4 && (
            <div className="space-y-4">
                                                        <h2 className="text-3xl sm:text-4xl font-extrabold  bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 text-white font-serif text-center drop-shadow-lg mb-4">
 Additional Information  
</h2>
<p className="text-center"> Add an Artist, Include more dates if it's weekly (not monthly or bi-weekly) or add an eventbrite link for ticket purchase! <br/>(click next to skip)</p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setShowArtists(!showArtists)}
                  className="bg-gradient-to-tr from-pink-300 to-purple-500 text-white font-semibold border-2 border-purple-700 w-full rounded shadow hover:brightness-110 transition-all duration-200"
                >
                  + Artist
                </button>
{/* Show +Days ONLY for one-time or weekly events */}
{!["monthly", "bi-weekly"].includes(formData.recurrence_pattern) && (
  <button
    type="button"
    onClick={() => setShowAdditionalDays(!showAdditionalDays)}
    className="bg-gradient-to-tr from-yellow-300 to-yellow-500 text-black border-black border-2 w-full rounded shadow hover:brightness-110 transition-all duration-200"
  >
    + Days
  </button>
)}

                <button
                  type="button"
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
                  className={`w-full text-sm rounded border-2 font-bold shadow transition-all duration-200
                    ${showEventbrite
                      ? "bg-green-500 text-white border-green-700"
                      : "bg-gradient-to-tr from-amber-300 to-yellow-500 text-black border-black"}`}
                  title="Add an Eventbrite ticket link (optional)"
                >
                  {showEventbrite ? "Hide" : "EventBrite"}
                </button>
              </div>

              {showArtists && (
                <div className="bg-white rounded shadow p-4 border border-purple-300 space-y-2">
                  <label className="block font-semibold text-purple-700">🎸 Related Artists</label>
   
                  <Select
                    isMulti
                    options={options}
                    value={options.filter((opt) => selectedBandIds.includes(opt.value))}
                    onChange={(selected) => {
                      setSelectedBandIds(selected.map((opt) => opt.value));
                    }}
                    placeholder="Select artists…"
                    className="text-sm text-black"
                    classNamePrefix="react-select"
                  />
                </div>
              )}

              {showAdditionalDays && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setSevenDays((prev) => !prev)}
                    className={`w-full px-4 py-1 rounded border-2 font-bold shadow transition-all duration-200 text-center ${
                      sevenDays
                        ? "bg-green-400 text-white border-green-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                  >
                    {sevenDays ? "Remove 7 Days a Week" : "Add 7 Days a Week"}
                  </button>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 gap-3">
                    {[
                      "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
                    ].map((day) => {
                      const existing = additionalDays.find((d) => d.day === day);
                      const pastelColors = {
                        Monday: "bg-red-200 text-red-800",
                        Tuesday: "bg-orange-200 text-orange-800",
                        Wednesday: "bg-yellow-200 text-yellow-900",
                        Thursday: "bg-green-200 text-green-800",
                        Friday: "bg-blue-200 text-blue-800",
                        Saturday: "bg-purple-200 text-purple-800",
                        Sunday: "bg-pink-200 text-pink-800",
                      };
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setAdditionalDays((prev) => {
                              if (existing) {
                                return prev.filter((d) => d.day !== day);
                              } else {
                                return [...prev, { day, start: "", end: "" }];
                              }
                            });
                          }}
                          className={`relative w-full px-2 rounded font-semibold transition-all duration-200 flex items-center justify-center gap-1
                            ${pastelColors[day]} ${existing ? "border-4 border-black shadow-lg" : "border-2 border-white"}`}
                        >
                          <span>{day}</span>
                          {existing && (
                            <span className="absolute top-1 right-2 text-black text-sm">✅</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {additionalDays.map((item, idx) => (
                    <div
                      key={item.day}
                      className="flex flex-col sm:flex-row gap-3 items-center mt-2 bg-white/80 p-2 rounded shadow"
                    >
                      <div className="font-bold w-24 text-center">{item.day}</div>
                      <input
                        type="time"
                        value={item.start}
                        onChange={(e) => {
                          const updated = [...additionalDays];
                          updated[idx].start = e.target.value;
                          setAdditionalDays(updated);
                        }}
                        className="w-full sm:w-1/3 p-2 border rounded text-white bg-black/80 text-center"
                        required
                      />
                      <span className="hidden sm:block">→</span>
                      <input
                        type="time"
                        value={item.end}
                        onChange={(e) => {
                          const updated = [...additionalDays];
                          updated[idx].end = e.target.value;
                          setAdditionalDays(updated);
                        }}
                        className="w-full sm:w-1/3 p-2 border rounded text-white bg-black/80 text-center"
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              {showEventbrite && (
                <div className="mt-1 p-3 rounded bg-white border-2 border-green-300 shadow">
                  <label className="block text-sm font-semibold text-green-800 mb-1 text-center">
                    Eventbrite URL
                  </label>
                  <input
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
                    className={`w-full p-3 rounded border text-black text-center shadow-sm focus:ring-2 focus:ring-green-400 ${
                      eventbriteError ? "border-red-500" : "border-green-400"
                    }`}
                  />
                  {eventbriteError ? (
                    <p className="text-red-600 text-sm mt-1 text-center">
                      {eventbriteError}
                    </p>
                  ) : (
                    <p className="text-gray-600 text-xs mt-1 text-center">
                      Must be an Eventbrite event link (begins with <code>https://www.eventbrite...</code>).
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 5️⃣ Description & Branding */}
          {step === 5 && (
            <div className="space-y-3 relative">
                                                                      <h2 className="text-3xl sm:text-4xl font-extrabold  bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 text-white font-serif text-center drop-shadow-lg mb-4">
Description 
</h2>
{prideName && (
  <button
    type="button"
    onClick={togglePridePrefix}
    className="
      mt-2 px-4 py-2 rounded
      bg-gradient-to-r from-pink-500 to-purple-600
      text-white font-bold shadow
      hover:brightness-110
    "
  >
    {hasPridePrefix(formData.description)
      ? `Remove ${prideName} Presents`
      : `${prideName} Presents`}
  </button>
)}

<textarea
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
  placeholder="📝 Add Event details..."
  className="w-full p-3 border mt-4 text-black text-left border-purple-300 rounded bg-white shadow-sm focus:ring-2 focus:ring-purple-400"
/>


              <div className="text-sm text-right text-gray-700 mt-1">
                {formData.description.trim().split(/\s+/).filter(Boolean).length} words —{" "}
                {Array.from(formData.description).length}/800 characters
              </div>
            </div>
          )}

          {/* 6️⃣ Review & Submit */}
       {step === 6 && (
  <div className="space-y-5">
    <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-center drop-shadow-lg">
      🎉 Review Your Event
    </h3>

    <div className="bg-gradient-to-br from-white/90 via-purple-50 to-pink-50 p-5 rounded-2xl shadow-xl border-2 border-purple-200">
      <div className="grid sm:grid-cols-2 gap-4 text-gray-800 text-sm">

        {/* LEFT SIDE */}
        <div className="space-y-1">
          <p><strong className="text-purple-700">📍 Venue:</strong> {formData.venue_name}</p>
          <p><strong className="text-purple-700">🏠 Address:</strong> {formData.address}</p>
          <p><strong className="text-purple-700">🌆 City/State:</strong> {formData.city}, {formData.state}</p>

          <p><strong className="text-purple-700">🔁 Recurrence:</strong> {formData.recurrence_pattern}</p>

          {/* WEEKLY / BI-WEEKLY */}
          {["weekly", "bi-weekly"].includes(formData.recurrence_pattern) && (
            <p><strong className="text-purple-700">📅 Day of Week:</strong> {formData.day_of_week}</p>
          )}

          {/* MONTHLY DISPLAY */}
          {formData.recurrence_pattern === "monthly" && (
            <>
              <p>
                <strong className="text-purple-700">📅 Monthly Mode:</strong>{" "}
                {monthlyMode === "date"
                  ? "Monthly on this date"
                  : "Monthly by Weekday"}
              </p>

              <p>
                <strong className="text-purple-700">📆 Next Event Date:</strong>{" "}
                {formData.recurrence_anchor_date || "-"}
              </p>

              {/* Display weekday rules ONLY if mode = weekday */}
              {monthlyMode === "weekday" && monthlyWeekdayRules.length > 0 && (
                <p>
                  <strong className="text-purple-700">🗓️ Monthly Rules:</strong>{" "}
                  {monthlyWeekdayRules.join(", ")}
                </p>
              )}
            </>
          )}

          {/* ONE-TIME DATE */}
          {formData.recurrence_pattern === "one-time" && (
            <p><strong className="text-purple-700">🎈 Date:</strong> {formData.date || "-"}</p>
          )}

          <p>
            <strong className="text-purple-700">🕒 Time:</strong>{" "}
            {formData.start_time
              ? new Date(`1970-01-01T${formData.start_time}`).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "-"}{" "}
            -{" "}
            {formData.end_time
              ? new Date(`1970-01-01T${formData.end_time}`).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "-"}
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-1">
          <p><strong className="text-purple-700">🎭 Type(s):</strong> {formData.event_type.join(", ") || "-"}</p>

          {/* Theatre Show Dates */}
          {showDates.length > 0 && (
            <div>
              <strong className="text-purple-700">🎟️ Additional Show Dates:</strong>
              <ul className="list-disc ml-6 mt-1">
                {showDates.map((d, i) => (
                  <li key={i}>{formatShowDate(d.date, d.time)}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Days */}
          {showAdditionalDays && additionalDays.length > 0 && (
            <div>
              <strong className="text-purple-700">🗓️ Also Occurs On:</strong>{" "}
              {additionalDays.map((d) => `${d.day} ${d.start}-${d.end}`).join(" | ")}
            </div>
          )}

          {/* 7 Days */}
          {sevenDays && (
            <p><strong className="text-purple-700">📆 Frequency:</strong> 7 Days a Week</p>
          )}

          {/* Eventbrite */}
          {showEventbrite && formData.eventbrite_url && (
            <p>
              <strong className="text-purple-700">🎫 Eventbrite:</strong>{" "}
              <a
                href={formData.eventbrite_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {formData.eventbrite_url}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* DESCRIPTION + ARTISTS */}
      <div className="mt-4 border-t-2 border-purple-200 pt-3">
        <p className="whitespace-pre-line text-gray-800 leading-relaxed">
          <strong className="text-purple-700">📝 Description:</strong>{" "}
          {formData.description || "-"}
        </p>

      {relatedArtistData.length > 0 && (
  <div className="mt-3">
    <strong className="text-purple-700">🎤 Related Artists:</strong>
    
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
      {relatedArtistData.map((artist) => (
        <div
          key={artist.id}
          className="flex flex-col items-center p-2 rounded-lg  border-purple-200"
        >
          <img
            src={artist.image_url}
            alt={artist.artist_name}
            className="w-16 h-16 object-cover rounded-full border border-purple-300 shadow"
          />
          <p className="mt-1 text-sm  font-semibold text-purple-700">{artist.artist_name}</p>
        </div>
      ))}
    </div>
  </div>
)}

      </div>
    </div>

    <p className="text-center text-gray-600 text-sm italic">
      💡 Double-check your details before hitting <span className="text-purple-600 font-bold">Submit</span> below!
    </p>
  </div>
)}

        </motion.div>
      </AnimatePresence>

      {/* Step error */}
      {stepError && (
        <div className="text-red-600 text-sm font-semibold text-center">
          {stepError}
        </div>
      )}

      {/* Footer controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 1}
          className={`px-4 py-2 rounded border ${
            step === 1
              ? "opacity-40 cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
          }`}
        >
          ← Back
        </button>

        {step < TOTAL_STEPS && (
          <button
            type="button"
            onClick={nextStep}
            className="px-4 py-2 rounded bg-purple-600 text-white font-semibold shadow hover:brightness-110"
          >
            Next →
          </button>
        )}

        {step === TOTAL_STEPS && (
          <button
            type="submit"
            className="px-6 py-2 rounded bg-gradient-to-br from-blue-400 via-purple-600 to-pink-500 text-white font-bold shadow hover:from-yellow-500 hover:to-pink-500"
          >
            🚀 Submit Event Request
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-center font-medium mt-2">{error}</p>
      )}
    </form>
  );
};

export default RequestEvent;
