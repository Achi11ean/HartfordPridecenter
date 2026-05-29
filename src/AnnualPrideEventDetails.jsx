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
  <section className="max-w-full mx-auto  ">
    <div
      className="
        relative overflow-hidden rounded-none
        border border-white/10
        bg-gradient-to-b from-black/60 via-white/40 to-white/60
        backdrop-blur-xl
        shadow-[0_25px_70px_-40px_rgba(0,0,0,0.9)]
      "
    >

      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-yellow-400/15 blur-3xl" />

      <div className="relative ">
        {/* 🌈 PRIDE HOSTS */}
{eventHosts.length > 0 && (
  <div className="">


    <div className="space-y-6">
      {eventHosts.map((host) => (
        <div
          key={host.id}
          className="
            relative overflow-hidden

            rounded-none

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
         

              {host.notes && (
                <div
                  className="
                    mt-1

                    rounded-2xl

                    border border-white/10

                    bg-black/30

                    p-2

                    shadow-inner
                  "
                >
                  <p
                    className="
                      text-sm
                      sm:text-lg

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
           
          </div>
        </div>
      ))}
    </div>
  </div>
)}

<div
  className="
    p-1 sm:p-7
    border border-white/10
    bg-gradient-to-b from-black/50 via-black/35 to-black/50
    backdrop-blur-xl
    shadow-[0_25px_70px_-40px_rgba(0,0,0,0.9)]
  "
>

<div className="text-center mb-8">
  <div
    className="
      inline-block

      px-5 py-2

      rounded-full

      bg-yellow-300

      text-black

      font-black

      uppercase

      tracking-[0.25em]

      text-xs

      shadow-lg
    "
  >
    Festival Talent
  </div>

  <h2
    className="
      mt-4

      text-3xl
      sm:text-5xl

      font-[Aspire]

      text-yellow-300
    "
  >
    Meet The Featured Lineup
  </h2>

  <p
    className="
      mt-3

      text-sm
      sm:text-base

      text-yellow-100/75

      font-semibold

      max-w-2xl

      mx-auto
    "
  >
    Explore performers, hosts, and personalities bringing the celebration to life.
  </p>
</div>

<div>
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xl sm:text-2xl font-extrabold text-pink-300">
      🎤 Featured Artists
    </h3>

    {featuredArtists.length > 0 && (
      <span className="text-xs uppercase tracking-[0.2em] text-yellow-200/60 font-black">
        ← Scroll →
      </span>
    )}
  </div>

  {featuredArtists.length === 0 ? (
    <p className="text-center italic text-yellow-200/80">
      Artist lineup coming soon.
    </p>
  ) : (
    <div
      className="
        flex gap-5

        overflow-x-auto
        overflow-y-hidden

        pb-4

        snap-x snap-mandatory

        scrollbar-thin
        scrollbar-thumb-yellow-300/40
        scrollbar-track-transparent
      "
    >
      {featuredArtists.map((artist) => (
        <a
          key={artist.id}
          href={`https://karaoverse.com/artist/${artist.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            group

            shrink-0
            snap-start

            w-[120px]
            sm:w-[140px]

            flex flex-col items-center
            text-center

            hover:scale-[1.04]

            transition-all
            duration-300
          "
        >
          <div
            className="
              w-24 h-24
              sm:w-28 sm:h-28

              rounded-full
              overflow-hidden

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
              className="
                w-full h-full
                object-cover

                group-hover:scale-110

                transition
                duration-500
              "
            />
          </div>

          <span
            className="
              mt-3

              font-extrabold

              text-sm

              text-yellow-100

              leading-tight
            "
          >
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

    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl sm:text-2xl font-extrabold text-cyan-300">
        🎧 Featured Hosts
      </h3>

      <span className="text-xs uppercase tracking-[0.2em] text-cyan-200/60 font-black">
        ← Scroll →
      </span>
    </div>

    <div
      className="
        flex gap-5

        overflow-x-auto
        overflow-y-hidden

        pb-4

        snap-x snap-mandatory

        scrollbar-thin
        scrollbar-thumb-cyan-400/40
        scrollbar-track-transparent
      "
    >
      {itineraryHosts.map((host) => (
        <a
          key={host.id}
          href={`https://karaoverse.com/${host.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            group

            shrink-0
            snap-start

            w-[120px]
            sm:w-[140px]

            flex flex-col items-center
            text-center

            hover:scale-[1.04]

            transition-all
            duration-300
          "
        >
          <div
            className="
              w-24 h-24

              rounded-full
              overflow-hidden

              border-4 border-pink-400/90

              shadow-[0_0_26px_rgba(236,72,153,0.35)]

              group-hover:shadow-[0_0_36px_rgba(236,72,153,0.55)]

              transition
            "
          >
            <img
              src={host.photo_url || "/default-dj.png"}
              alt={host.dj_name}
              className="
                w-full h-full
                object-cover

                group-hover:scale-110

                transition
                duration-500
              "
            />
          </div>

          <span
            className="
              mt-3

              font-extrabold

              text-sm

              text-yellow-100

              leading-tight
            "
          >
            {host.dj_name}
          </span>
        </a>
      ))}
    </div>
  </div>
)}
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
