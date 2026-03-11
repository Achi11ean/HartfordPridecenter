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

const sorted = res.data.sort((a, b) => {
  if (!a.start_time) return 1;
  if (!b.start_time) return -1;
  return a.start_time.localeCompare(b.start_time);
});
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
  <section className="max-w-full mx-auto ">
    {/* WRAP CARD (matches the other section) */}
    <div
      className="
        relative overflow-hidden rounded-none py-6
        border border-white/10
        bg-gradient-to-b from-black/60 via-black/40 to-black/60
        backdrop-blur-xl
        shadow-[0_25px_70px_-40px_rgba(0,0,0,0.9)]
      "
    >
      {/* subtle glow accents */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-yellow-400/15 blur-3xl" />

      <div className="relative p-4 sm:p-6">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent" />
            <h2 className="text-3xl sm:text-5xl font-[Aspire] text-yellow-300 drop-shadow-lg">
              🌈 Pride Itinerary
            </h2>
            <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent" />
          </div>
          {/* <p className="text-yellow-100/80 font-semibold">
            Come explore the vendors, performers and food!
          </p> */}
        </div>

        {/* LOCATION TABS */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
          {locations.map((loc) => {
            const active = activeLocation === loc;
            return (
              <button
                key={loc}
                onClick={() => setActiveLocation(loc)}
                className={`
                  group inline-flex items-center gap-2
                  px-5 sm:px-6 py-2.5 rounded-2xl font-extrabold
                  border transition
                  focus:outline-none focus:ring-2
                  ${
                    active
                      ? "bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black border-white/10 shadow-[0_18px_40px_-26px_rgba(250,204,21,0.85)] scale-[1.02] focus:ring-yellow-200/70"
                      : "bg-white/5 text-yellow-100/80 border-white/10 hover:bg-white/10 hover:text-yellow-100 focus:ring-yellow-200/30"
                  }
                `}
              >
                <span className={`${active ? "" : "opacity-90"} transition`}>
                  📍
                </span>
                <span className="tracking-tight">{loc}</span>
              </button>
            );
          })}
        </div>

        {/* ITINERARY GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="
                rounded-2xl p-2 sm:p-6
                border border-white/10
                bg-white/5
                hover:bg-white/10
                transition
                shadow-[0_18px_60px_-40px_rgba(0,0,0,0.85)]
              "
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl sm:text-2xl font-extrabold text-yellow-200 leading-tight">
                  {item.title}
                </h3>

                {/* optional: tiny badge vibe */}
                <span className="shrink-0 rounded-full px-3 py-1 text-xs font-extrabold bg-black/30 border border-white/10 text-yellow-100/80">
                  Itinerary
                </span>
              </div>

              <p className="mt-2 text-sm sm:text-[15px] text-yellow-100/80 font-semibold">
                🕒 {formatTime(item.start_time)} – {formatTime(item.end_time)}
              </p>

              {/* PERFORMERS */}
              {item.performers?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {item.performers.map((p) => (
                    <a
                      key={p.id}
                      href={`https://karaoverse.com/artist/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        group inline-flex items-center gap-2
                        rounded-2xl px-3.5 py-2
                        border border-white/10
                        bg-gradient-to-r from-pink-500/15 to-purple-500/15
                        hover:from-pink-500/25 hover:to-purple-500/25
                        hover:scale-[1.03]
                        transition
                        shadow-[0_16px_40px_-30px_rgba(236,72,153,0.65)]
                        focus:outline-none focus:ring-2 focus:ring-pink-300/40
                      "
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                        <img
                          src={p.image_url}
                          alt={p.artist_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          loading="lazy"
                        />
                      </div>
                      <span className="font-extrabold text-pink-100 text-sm">
                        {p.artist_name}
                      </span>
                      <span aria-hidden className="text-pink-100/70 text-xs">
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              )}

              {/* HOSTS */}
              {item.hosts?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {item.hosts.map((h) => (
                    <a
                      key={h.id}
                      href={`https://karaoverse.com/host/${h.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        group inline-flex items-center gap-2
                        rounded-2xl px-3.5 py-2
                        border border-white/10
                        bg-gradient-to-r from-blue-500/15 to-indigo-500/15
                        hover:from-blue-500/25 hover:to-indigo-500/25
                        hover:scale-[1.03]
                        transition
                        shadow-[0_16px_40px_-30px_rgba(59,130,246,0.55)]
                        focus:outline-none focus:ring-2 focus:ring-blue-300/35
                      "
                    >
                      <span className="text-base">🎧</span>
                      <span className="font-extrabold text-blue-100 text-sm">
                        {h.dj_name}
                      </span>
                      <span aria-hidden className="text-blue-100/70 text-xs">
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              )}

              {/* DESCRIPTION */}
              {item.description && (
                <p className="mt-4 pt-4 border-t border-white/10 text-sm sm:text-[15px] text-yellow-100/80 italic leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* optional: empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-yellow-100/70 italic">
            No itinerary items for this location yet.
          </div>
        )}
      </div>
    </div>
  </section>
);
}