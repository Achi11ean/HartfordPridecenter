import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
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
  <section className="max-w-full mt-2 mx-auto ">
    {/* WRAP CARD (matches the other section) */}
    <div
      className="
        relative overflow-hidden rounded-none
        border border-white/10
        bg-gradient-to-br from-purple-800/60 via-red-800/70 to-pink-500/60
        backdrop-blur-xl
        shadow-[0_25px_70px_-40px_rgba(0,0,0,0.9)]
      "
    >
      {/* subtle glow accents */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-yellow-400/15 blur-3xl" />

      <div className="relative p-3 sm:p-6">
        {/* HEADER */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-3 mb-2">
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
        <div className="flex flex-wrap justify-start gap-3 sm:gap-4 mb-2">
          {locations.map((loc) => {
            const active = activeLocation === loc;
            return (
              <button
                key={loc}
                onClick={() => setActiveLocation(loc)}
                className={`
                  group inline-flex items-center gap-2
                  px-2 sm:px-6 py-1 rounded-2xl font-extrabold
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
    {/* ITINERARY SWIPER */}
{filtered.length > 0 ? (
  <Swiper
    modules={[Pagination, Autoplay]}
    spaceBetween={18}
    slidesPerView={1}
    centeredSlides={true}
    grabCursor={true}
    loop={filtered.length > 1}
    autoplay={{
      delay: 5000,
      disableOnInteraction: false,
    }}
    pagination={{ clickable: true }}
    breakpoints={{
      768: {
        slidesPerView: 1.15,
      },
      1100: {
        slidesPerView: 1.25,
      },
    }}
    className="pb-10"
  >
    {filtered.map((item) => (
      <SwiperSlide key={item.id}>
        <div
          className="
            rounded-2xl p-2 sm:p-6
            border border-white/10
            bg-black/40
            hover:bg-white/10
            transition
            shadow-[0_18px_60px_-40px_rgba(0,0,0,0.85)]
            min-h-[320px]
          "
        >
          <div className="flex items-start ">
    <h3
  className={`
    border-b
    font-extrabold
    text-yellow-200
    leading-tight

    ${
      item.title?.length > 15
        ? "text-lg sm:text-xl"
        : "text-xl sm:text-2xl"
    }
  `}
>
  {item.title}
</h3>
        
          </div>

          <p className="mt-2 text-sm sm:text-[15px] text-yellow-100/80 font-semibold">
            🕒 {formatTime(item.start_time)} – {formatTime(item.end_time)}
          </p>

      {item.performers?.length > 0 && (
  <div className="mt-5 flex flex-wrap gap-4">
    {item.performers.map((p) => (
      <a
        key={p.id}
        href={`https://karaoverse.com/artist/${p.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="
          group

          relative overflow-hidden

          flex items-center gap-3

          rounded-[1.4rem]

          pl-2 pr-5 py-2.5

          border border-pink-300/20

          bg-gradient-to-br
          from-pink-500/20
          via-fuchsia-500/10
          to-purple-600/20

          backdrop-blur-xl

          shadow-[0_10px_35px_-15px_rgba(236,72,153,0.6)]

          hover:shadow-[0_18px_50px_-15px_rgba(236,72,153,0.9)]

          hover:scale-[1.05]

          transition-all duration-300
        "
      >

        {/* GLOW */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-pink-400/10 via-fuchsia-400/5 to-purple-400/10" />

        {/* IMAGE */}
        <div
          className="
            relative

            w-12 h-12

            rounded-full

            overflow-hidden

            border-2 border-pink-200/70

            shadow-[0_0_25px_rgba(236,72,153,0.45)]

            shrink-0
          "
        >
          <img
            src={p.image_url}
            alt={p.artist_name}
            className="
              w-full h-full object-cover

              group-hover:scale-110

              transition duration-500
            "
          />
        </div>

        {/* TEXT */}
        <div className="relative">
          <div
            className="
              text-[10px]

              uppercase
              tracking-[0.25em]

              text-pink-200/60

              font-black
            "
          >
            Featured Artist
          </div>

          <div
            className="
              text-sm
              sm:text-base

              font-black

              text-white

              leading-tight
            "
          >
            {p.artist_name}
          </div>
        </div>
      </a>
    ))}
  </div>
)}

{item.hosts?.length > 0 && (
  <div className="mt-4 flex flex-wrap gap-4">
    {item.hosts.map((h) => (
      <a
        key={h.id}
        href={`https://karaoverse.com/host/${h.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="
          group

          relative overflow-hidden

          flex items-center gap-3

          rounded-[1.4rem]

          px-4 py-3

          border border-cyan-300/20

          bg-gradient-to-br
          from-cyan-500/20
          via-blue-500/10
          to-indigo-600/20

          backdrop-blur-xl

          shadow-[0_10px_35px_-15px_rgba(59,130,246,0.6)]

          hover:shadow-[0_18px_50px_-15px_rgba(59,130,246,0.9)]

          hover:scale-[1.05]

          transition-all duration-300
        "
      >

        {/* GLOW */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-cyan-400/10 via-blue-400/5 to-indigo-400/10" />

        {/* ICON */}
        <div
          className="
            relative

            w-12 h-12

            rounded-full

            bg-gradient-to-br
            from-cyan-400
            to-blue-600

            flex items-center justify-center

            text-white text-xl

            shadow-[0_0_25px_rgba(59,130,246,0.55)]

            shrink-0
          "
        >
          🎧
        </div>

        {/* TEXT */}
        <div className="relative">
          <div
            className="
              text-[10px]

              uppercase
              tracking-[0.25em]

              text-cyan-100/60

              font-black
            "
          >
            Event Host
          </div>

          <div
            className="
              text-sm
              sm:text-base

              font-black

              text-white

              leading-tight
            "
          >
            {h.dj_name}
          </div>
        </div>
      </a>
    ))}
  </div>
)}

          {item.description && (
            <p className="mt-4 pt-4 border-t border-white/10 text-sm sm:text-[15px] text-yellow-100/80 italic leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
) : (
  <div className="text-center py-10 text-yellow-100/70 italic">
    No itinerary items for this location yet.
  </div>
)}

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