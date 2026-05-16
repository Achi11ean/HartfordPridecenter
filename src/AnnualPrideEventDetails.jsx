import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
import PrideItinerary from "./PrideItinerary";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;

export default function AnnualPrideEventDetails() {
  const [event, setEvent] = useState(null);
  const [artists, setArtists] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const [loading, setLoading] = useState(true);
  const [itineraryArtists, setItineraryArtists] = useState([]);
  const [itineraryHosts, setItineraryHosts] = useState([]);
  const [eventHosts, setEventHosts] = useState([]);
const formatTime12 = (time) => {
  if (!time) return null;

  // Handles "HH:mm" or "HH:mm:ss"
  const [hour, minute] = time.split(":");
  const date = new Date();
  date.setHours(hour, minute);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};


  useEffect(() => {
    console.log("🌈 [AnnualPrideEventDetails] Fetching Annual Pride Event");
    console.log("➡️ Pride ID:", PRIDE_ID);

    async function load() {
      try {
        setLoading(true);

const eventUrl = `${API}/pride/${PRIDE_ID}/annual`;
        console.log("📡 Fetching:", eventUrl);
const hostsUrl = `${API}/api/pride/${PRIDE_ID}/event-hosts`;

const [eventRes, artistsRes, hostsRes] = await Promise.all([
  axios.get(eventUrl),
  axios.get(`${API}/hireband/public`),
  axios.get(hostsUrl),
]);

console.log("🎤 Pride Event Hosts:", hostsRes.data);

setEventHosts(hostsRes.data?.event_hosts || []);

        const annualEvent = eventRes.data;
        console.log("🎉 Annual Pride Event:", annualEvent);

        if (!annualEvent) {
          console.warn("⚠️ No Annual Pride Festival found");
          setEvent(null);
          setArtists([]);
          return;
        }

        setEvent(annualEvent);

        const relatedIds = Array.isArray(annualEvent.related_artist_ids)
          ? annualEvent.related_artist_ids.map(Number)
          : [];

        console.log("🎤 Related artist IDs:", relatedIds);

        if (relatedIds.length > 0) {
          const matchedArtists = (artistsRes.data || []).filter((a) =>
            relatedIds.includes(Number(a.id))
          );

          console.log("✅ Matched artists:", matchedArtists);
          setArtists(matchedArtists);
        } else {
          setArtists([]);
        }
      } catch (err) {
        console.error(
          "❌ Error loading Annual Pride Event",
          err?.response?.data || err
        );
        setEvent(null);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
  async function loadItinerary() {
    try {
      const res = await axios.get(
        `${API}/eventitinerary/pride/${PRIDE_ID}`
      );

      const performerMap = new Map();
      const hostMap = new Map();

      res.data.forEach(item => {
        (item.performers || []).forEach(p => {
          performerMap.set(p.id, p);
        });

        (item.hosts || []).forEach(h => {
          hostMap.set(h.id, h);
        });
      });

      setItineraryArtists([...performerMap.values()]);
      setItineraryHosts([...hostMap.values()]);

    } catch (err) {
      console.error("Failed loading Pride itinerary", err);
    }
  }

  loadItinerary();
}, []);
  /* ---------------- RENDER STATES ---------------- */
const featuredArtists =
  itineraryArtists.length > 0 ? itineraryArtists : artists;


  
  if (loading) {
    return (
      <div className="text-center py-16 text-yellow-200 animate-pulse">
        Loading Pride Festival details…
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-16 text-yellow-200 italic">
        🌈 Annual Pride Festival details coming soon.
      </div>
    );
  }

return (
  <section className="max-w-full mx-auto  pb-6">
    <div
      className="
        relative overflow-hidden rounded-none
        border border-white/10
        bg-gradient-to-b from-black/60 via-white/40 to-white/60
        backdrop-blur-xl
        shadow-[0_25px_70px_-40px_rgba(0,0,0,0.9)]
      "
    >
      {/* subtle glow accents */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-yellow-400/15 blur-3xl" />

      <div className="relative p-1 pt-4 sm:p-6">
        {/* 🌈 PRIDE HOSTS */}
{eventHosts.length > 0 && (
  <div className="mb-8">


    <div className="space-y-5">
      {eventHosts.map((host) => (
        <div
          key={host.id}
          className="
            relative overflow-hidden

            rounded-[2rem]

            border border-white/10

            bg-gradient-to-br
            from-pink-500/10
            via-black/80
            to-purple-500/10

            backdrop-blur-2xl

            shadow-[0_25px_80px_-35px_rgba(0,0,0,0.95)]

            p-2 sm:p-7
          "
        >

          {/* GLOWS */}
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-pink-500/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-cyan-400/10 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

            {/* LEFT CONTENT */}
            <div className="flex-1">

              {/* EVENT NAME */}


              {/* DATE */}
{/* MINI MAP PREVIEW */}
<section className="relative py-4">
  <div className="flex justify-center">

    {/* SMALL CENTERED MAP PREVIEW */}
    <button
      onClick={() => setShowMap(true)}
      className="
        relative

        w-[120px]
        h-[120px]

        sm:w-[150px]
        sm:h-[150px]

        rounded-[2rem]

        overflow-hidden

        border border-white/10

        shadow-[0_20px_60px_-25px_rgba(0,0,0,0.95)]

        hover:scale-105

        transition-all

        group
      "
    >

      {/* MAP */}
      <iframe
        className="
          absolute inset-0

          w-full h-full

          scale-[1.15]

          pointer-events-none

          opacity-90

          group-hover:scale-[1.2]

          transition-all
          duration-500
        "
        src="https://www.google.com/maps?q=Stanley+Johnston+Park,+South+Haven,+MI&z=14&output=embed"
        loading="lazy"
      />

      {/* OVERLAY */}
      <div
        className="
          absolute inset-0

          bg-gradient-to-b
          from-black/10
          via-transparent
          to-black/40
        "
      />

      {/* ICON */}
      <div
        className="
          absolute bottom-2 right-2

          w-8 h-8

          rounded-full

          bg-black/70

          backdrop-blur-md

          border border-white/10

          flex items-center justify-center

          text-white text-sm

          shadow-lg
        "
      >
        📍
      </div>
    </button>

    {/* MODAL */}
    {showMap && (
      <div
        className="
          fixed inset-0 z-[9999]

          bg-black/80

          backdrop-blur-md

          flex items-center justify-center

          p-4

          animate-in fade-in duration-300
        "
        onClick={() => setShowMap(false)}
      >

        {/* MODAL CARD */}
        <div
          className="
            relative

            w-full max-w-5xl

            rounded-[2rem]

            overflow-hidden

            border border-white/10

            bg-black

            shadow-[0_40px_120px_-20px_rgba(0,0,0,0.95)]

            animate-in zoom-in-95 duration-300
          "
          onClick={(e) => e.stopPropagation()}
        >

          {/* CLOSE */}
          <button
            onClick={() => setShowMap(false)}
            className="
              absolute top-4 right-4 z-20

              w-11 h-11

              rounded-full

              bg-black/70

              text-white text-lg

              border border-white/10

              hover:scale-110

              transition-all
            "
          >
            ✕
          </button>

          <iframe
            className="w-full h-[75vh]"
            src="https://www.google.com/maps?q=Stanley+Johnston+Park,+South+Haven,+MI&z=17&output=embed"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    )}

  </div>
</section>
              {/* ADDRESS */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${event.address}, ${event.city}, ${event.state}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-4

                  flex items-start gap-4

                  rounded-2xl

                  bg-white/5

                  border border-white/10

                  p-4

                  group

                  hover:bg-white/10

                  transition-all
                "
              >
                <div
                  className="
                    w-11 h-11
                    rounded-full

                    bg-pink-400/15

                    flex items-center justify-center

                    shrink-0
                  "
                >
                  <FaMapMarkerAlt className="text-pink-300 text-lg" />
                </div>

                <div className="leading-relaxed">
                  <span
                    className="
                      block

                      font-extrabold

                      text-white

                      text-lg sm:text-xl

                      group-hover:text-pink-300

                      transition-colors
                    "
                  >
                    {event.address}
                  </span>

                  <span
                    className="
                      block

                      text-cyan-100/80

                      font-bold

                      mt-1
                    "
                  >
                    {event.city}, {event.state}
                  </span>

                  <span
                    className="
                      inline-block

                      mt-2

                      text-xs
                      uppercase
                      tracking-[0.25em]

                      text-pink-300/70

                      group-hover:text-pink-200

                      transition-colors
                    "
                  >
                      Open In Maps ↗
                  </span>
                </div>
              </a>
      {event.eventbrite_url && (
        <div className="pt-2 text-center">
          <a
            href={event.eventbrite_url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center gap-2
              px-8 py-3 rounded-2xl
              bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500
              text-black font-extrabold
              shadow-[0_18px_40px_-24px_rgba(250,204,21,0.85)]
              hover:brightness-110 hover:scale-[1.03]
              active:scale-[0.99]
              transition
            "
          >
            <FaTicketAlt /> Get Tickets ↗
          </a>
        </div>
      )}
              {/* HOST NOTES */}
              {host.notes && (
                <div
                  className="
                    mt-5

                    rounded-2xl

                    border border-white/10

                    bg-black/30

                    p-5

                    shadow-inner
                  "
                >
                  <p
                    className="
                      text-sm
                      sm:text-[15px]

                      leading-relaxed

                      text-pink-50/90

                      whitespace-pre-wrap
                    "
                  >
                    {host.notes}
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT BUTTON */}
            <div className="shrink-0 flex flex-col items-center gap-3">
              <a
                href={`https://karaoverse.com/venue/${host.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2

                  px-7 py-1

                  rounded-2xl
border 
                  bg-gradient-to-br
                  from-blue-500
                  via-indigo-500
                  to-purple-600

                  text-white
                  font-extrabold

                  shadow-[0_18px_40px_-20px_rgba(59,130,246,0.8)]

                  hover:brightness-110
                  hover:scale-[1.04]

                  active:scale-[0.99]

                  transition-all
                "
              >
                🎤 Karaoverse ↗
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-8 text-yellow-100">
          {/* LEFT */}
      

          {/* RIGHT */}
        <div
  className="
    rounded-3xl p-5 sm:p-7
    border border-white/10
    bg-gradient-to-b from-black/50 via-black/35 to-black/50
    backdrop-blur-xl
    shadow-[0_25px_70px_-40px_rgba(0,0,0,0.9)]
  "
>
  
  {/* SHARED HEADER */}
  <div className="text-center mb-8">
    <div className="inline-block px-5 py-2 rounded-full bg-yellow-300 text-black font-black uppercase tracking-[0.25em] text-xs shadow-lg">
      Festival Talent
    </div>

    <h2 className="mt-4 text-3xl sm:text-5xl font-[Aspire] text-yellow-300">
      Meet The Featured Lineup
    </h2>

    <p className="mt-3 text-yellow-100/75 font-semibold">
      Explore performers, hosts, and personalities bringing the celebration to life.
    </p>
  </div>

  {/* ARTISTS */}
  <div>
    <h3 className="text-2xl font-extrabold text-pink-300 mb-5 text-center">
      🎤 Featured Artists
    </h3>

    {featuredArtists.length === 0 ? (
      <p className="text-center italic text-yellow-200/80">
        Artist lineup coming soon.
      </p>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {featuredArtists.map((artist) => (
          <a
            key={artist.id}
            href={`https://karaoverse.com/artist/${artist.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-center hover:scale-[1.04] transition"
          >
            <div
              className="
                w-28 h-28 rounded-full overflow-hidden
                border-4 border-yellow-300/90
                shadow-[0_0_28px_rgba(255,215,0,0.35)]
                group-hover:shadow-[0_0_38px_rgba(255,215,0,0.55)]
                transition
              "
            >
              <img
                src={
                  artist.image_url ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL2me_CKyfrr925EXl7hOyjKOmLKFmkz40rA&s"
                }
                alt={artist.artist_name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            <span className="mt-3 font-extrabold text-sm text-yellow-100">
              {artist.artist_name}
            </span>
          </a>
        ))}
      </div>
    )}
  </div>

  {/* HOSTS */}
  {itineraryHosts.length > 0 && (
    <div className="mt-10 pt-8 border-t border-white/10">
      <h3 className="text-2xl font-extrabold text-cyan-300 mb-5 text-center">
        🎧 Featured Hosts
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {itineraryHosts.map((host) => (
          <a
            key={host.id}
            href={`https://karaoverse.com/${host.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-center hover:scale-[1.04] transition"
          >
            <div
              className="
                w-24 h-24 rounded-full overflow-hidden
                border-4 border-pink-400/90
                shadow-[0_0_26px_rgba(236,72,153,0.35)]
                group-hover:shadow-[0_0_36px_rgba(236,72,153,0.55)]
                transition
              "
            >
              <img
                src={host.photo_url || "/default-dj.png"}
                alt={host.dj_name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            <span className="mt-2 font-extrabold text-sm text-yellow-100">
              {host.dj_name}
            </span>
          </a>
        ))}
      </div>
    </div>
  )}
</div>
        </div>
      </div>
<div
  id="pride-itinerary"
  className="py-2 pt-4"
>
  <PrideItinerary />
</div>

    </div>
    
  </section>
);
}
