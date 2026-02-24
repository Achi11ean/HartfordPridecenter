import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://singspacebackend.onrender.com";

export default function PrideItinerary() {
      const [items, setItems] = useState([]);
  const [activeLocation, setActiveLocation] = useState("");

  const formatTime = (time) => {
    if (!time) return "TBD";
    const [h, m] = time.split(":");
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

useEffect(() => {
  const PRIDE_ID = 2;

  console.log("🚀 Fetching Pride itinerary for ID:", PRIDE_ID);

  axios
    .get(`${API}/eventitinerary/pride/${PRIDE_ID}`)
    .then((res) => {
      console.log("✅ RAW RESPONSE:", res);
      console.log("📦 RESPONSE DATA:", res.data);

      if (!Array.isArray(res.data)) {
        console.error("❌ Response is not an array!");
        return;
      }

      if (res.data.length === 0) {
        console.warn("⚠️ No itinerary items returned!");
      }

      const sorted = res.data.sort((a, b) => a.position - b.position);

      console.log("📊 Sorted Items:", sorted);

      setItems(sorted);

      const locations = [
        ...new Set(sorted.map((i) => i.location || "General")),
      ];

      console.log("📍 Locations found:", locations);

      setActiveLocation(locations[0] || "");
    })
    .catch((err) => {
      console.error("🔥 API ERROR:", err);
      console.error("🔥 ERROR RESPONSE:", err.response);
    });
}, []);

  const locations = [
    ...new Set(items.map((i) => i.location || "General")),
  ];

  const filtered = items.filter(
    (i) => (i.location || "General") === activeLocation
  );

  if (!items.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-[Aspire] text-yellow-300 drop-shadow-lg">
          🌈 Pride Itinerary
        </h2>
        <p className="text-yellow-100 mt-2 font-semibold">
          Explore each area’s events, performances, and activities.
        </p>
      </div>

      {/* LOCATION TABS */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {locations.map((loc) => (
          <button
            key={loc}
            onClick={() => setActiveLocation(loc)}
            className={`px-6 py-2 rounded-xl font-bold transition
              ${
                activeLocation === loc
                  ? "bg-yellow-400 text-black shadow-lg scale-105"
                  : "bg-white/10 border border-yellow-400/40 text-yellow-200 hover:bg-white/20"
              }`}
          >
            📍 {loc}
          </button>
        ))}
      </div>

      {/* ITINERARY GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-black/60 border border-yellow-400/40 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-yellow-300 mb-2">
              #{item.position} — {item.title}
            </h3>

            <p className="text-sm text-yellow-100 mb-3">
              🕒 {formatTime(item.start_time)} – {formatTime(item.end_time)}
            </p>

{item.performers?.length > 0 && (
  <div className="mt-3 flex flex-wrap gap-3">
    {item.performers.map((p) => (
      <a
        key={p.id}
href={`https://karaoverse.com/artist/${p.slug}`}     
   target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/40 px-3 py-2 rounded-xl hover:scale-105 transition"
      >
        <img
          src={p.image_url}
          alt={p.artist_name}
          className="w-8 h-8 rounded-full object-cover border border-white/30"
        />
        <span className="font-semibold text-pink-200">
          {p.artist_name}
        </span>
      </a>
    ))}
  </div>
)}
{item.hosts?.length > 0 && (
  <div className="mt-3 flex flex-wrap gap-3">
    {item.hosts.map((h) => (
      <a
        key={h.id}
        href={`https://karaoverse.com/host/${h.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/40 px-3 py-2 rounded-xl hover:scale-105 transition"
      >
        <span className="text-lg">🎧</span>

        <span className="font-semibold text-blue-200">
          {h.dj_name}
        </span>
      </a>
    ))}
  </div>
)}

            {item.description && (
              <p className="text-sm border-t mt-3 text-yellow-100 italic">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}