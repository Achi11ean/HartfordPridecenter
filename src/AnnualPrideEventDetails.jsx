import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";

const API = "https://singspacebackend.onrender.com";
const PRIDE_ID = 2;

export default function AnnualPrideEventDetails() {
  const [event, setEvent] = useState(null);
  const [artists, setArtists] = useState([]);
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
  <section className="max-w-full mx-auto  py-6">
    <div
      className="
        relative overflow-hidden rounded-none
        border border-white/10
        bg-gradient-to-b from-white/60 via-white/40 to-white/60
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
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-pink-300/70 to-transparent" />
              <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight bg-white lg:px-12 px-2 rounded-full text-pink-600 font-serif drop-shadow">
                🌈 Pride in Karaoverse
              </h3>
              <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-pink-300/70 to-transparent" />
            </div>

            <div className="space-y-4">
              {eventHosts.map((host) => (
                <div
                  key={host.id}
                  className="
                    rounded-2xl p-2 sm:p-5
                    border border-white/10
                    bg-black/60
                    transition
                  "
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                    {/* INFO */}
                    <div className="text-center sm:text-left">
                      <p className="text-xl border-b sm:text-xl font-extrabold text-pink-100">
                        {host.event_name || "Pride Event Host"}
                      </p>

                      <p className="text-sm text-pink-100/70 mt-1">
                        {host.city}, {host.state}
                      </p>

                      {host.notes && (
                        <p className="mt-3  text-md sm:text-[15px] font-semibold text-pink-50/90 max-w-xl">
                          {host.notes}
                        </p>
                      )}

           
                    </div>

                    {/* BUTTON */}
                    <a
                      href={`https://karaoverse.com/event/${host.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex items-center justify-center gap-2
                        px-6 py-3 rounded-2xl
                        bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600
                        text-white font-extrabold
                        shadow-[0_18px_40px_-20px_rgba(236,72,153,0.8)]
                        hover:brightness-110 hover:scale-[1.03]
                        active:scale-[0.99]
                        transition
                        focus:outline-none focus:ring-2 focus:ring-pink-300/60
                      "
                    >
                      🎤 View Page
                      <span aria-hidden className="opacity-90">↗</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-8 text-yellow-100">
          {/* LEFT */}
          <div className="space-y-4">
            <div
              className="
                rounded-2xl p-4
                border border-white/10
                bg-black/40
              "
            >
              <p className="flex items-start gap-3 text-base sm:text-lg">
                <FaCalendarAlt className="text-yellow-300 mt-1" />
                <span className="leading-relaxed">
                  <span className="font-bold text-yellow-100">
                    {event.date
                      ? new Date(event.date + "T00:00:00").toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "Date TBA"}
                  </span>

                  {event.start_time && (
                    <span className="block text-yellow-100/80 font-semibold">
                      • {formatTime12(event.start_time)}
                      {event.end_time && ` – ${formatTime12(event.end_time)}`}
                    </span>
                  )}
                </span>
              </p>

              <p className="flex items-start gap-3 text-base sm:text-lg mt-3">
                <FaMapMarkerAlt className="text-yellow-300 mt-1" />
                <span className="leading-relaxed">
                  <span className="font-bold text-yellow-100">
                    {event.address}
                  </span>
                  <span className="block text-yellow-100/80 font-semibold">
                    {event.city}, {event.state}
                  </span>
                </span>
              </p>

              {event.notes && (
                <div className="mt-4 bg-black/40 border border-yellow-400/20 rounded-2xl p-4 text-sm sm:text-[15px] whitespace-pre-line leading-relaxed">
                  {event.notes}
                </div>
              )}

              {event.eventbrite_url && (
                <a
                  href={event.eventbrite_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center justify-center gap-2 mt-5
                    px-6 py-3 rounded-2xl
                    bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500
                    text-black font-extrabold
                    shadow-[0_18px_40px_-24px_rgba(250,204,21,0.85)]
                    hover:brightness-110 hover:scale-[1.03]
                    active:scale-[0.99]
                    transition
                    focus:outline-none focus:ring-2 focus:ring-yellow-200/70
                  "
                >
                  <FaTicketAlt /> Get Tickets
                  <span aria-hidden className="opacity-80">↗</span>
                </a>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div
              className="
                rounded-2xl p-4
                border border-white/10
                bg-black/40
              "
            >
              <h3 className="text-2xl font-extrabold text-yellow-300 mb-4 text-center">
                🎤 Featured Artists
              </h3>

              {featuredArtists.length === 0 ? (
                <p className="text-center italic text-yellow-200/80">
                  Artist lineup coming soon.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {featuredArtists.map((artist) => (
                    <a
                      key={artist.id}
                      href={`https://karaoverse.com/artist/${artist.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        group flex flex-col items-center text-center
                        hover:scale-[1.04] transition
                        focus:outline-none
                      "
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
                          loading="lazy"
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

            {itineraryHosts.length > 0 && (
              <div
                className="
                  rounded-2xl p-4
                  border border-white/10
                  bg-white/5
                "
              >
                <h3 className="text-xl font-extrabold text-yellow-300 text-center mb-4">
                  🎧 Featured Hosts
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {itineraryHosts.map((host) => (
                    <a
                      key={host.id}
                      href={`https://karaoverse.com/${host.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        group flex flex-col items-center text-center
                        hover:scale-[1.04] transition
                      "
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
                          loading="lazy"
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
    </div>
  </section>
);
}
