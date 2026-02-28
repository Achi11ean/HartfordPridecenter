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
    <section className="max-w-6xl mx-auto px-2 py-4">
      <div className=" px-1 shadow-2xl">

  {eventHosts.length > 0 && (
  <div className="mb-8 bg-black/50 border border-pink-400/40 rounded-2xl p-5">
<h3 className="text-2xl font-extrabold text-pink-300 mb-3 text-center shadow-[0_6px_10px_-6px_rgba(255,255,255,0.8)]">
      🌈 Pride in Karaoverse

    </h3>

    {eventHosts.map((host) => (
      <div
        key={host.id}
        className="flex flex-col sm:flex-row items-center justify-between gap-4
                  rounded-xl p-1"
      >
        {/* INFO */}
        <div className="text-center sm:text-left">
          <p className="text-lg font-bold text-pink-200">
            {host.event_name || "Pride Event Host"}
          </p>

          <p className="text-sm text-pink-100 opacity-80">
            {host.city}, {host.state}
          </p>

          {host.notes && (
            <p className="mt-2 text-sm font-bold text-pink-100  max-w-xl">
              {host.notes}
            </p>
          )}
          <p className="text-center font-bold shadow-white shadow-md rounded-full p-3 mt-4 border-t text-pink-100 mb-6 max-w-3xl mx-auto text-sm sm:text-base">

  Performer applications & performer profiles are managed directly through Karaoverse.
</p>
 
        </div>

        {/* BUTTON */}
<a
  href={`https://karaoverse.com/event/${host.slug}`}
  target="_blank"
  rel="noopener noreferrer"
  className="
    px-6 py-3 rounded-xl
    bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600
    text-white font-extrabold
    shadow-lg
    hover:scale-105 hover:brightness-110
    transition
  "
>
  🎤 View Page
</a>

      </div>
    ))}
  </div>
)}
        <div className="grid md:grid-cols-2 gap-8 text-yellow-100">
          {/* LEFT */}
          <div className="space-y-4">
          <p className="flex items-center gap-3 text-lg">
  <FaCalendarAlt className="text-yellow-300" />

  {event.date
    ? new Date(event.date + "T00:00:00")
  .toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
    : "Date TBA"}
<br/>
  {event.start_time && (
    <>
      {" "}
      • {formatTime12(event.start_time)}
      {event.end_time && ` – ${formatTime12(event.end_time)}`}
    </>
  )}
</p>


            <p className="flex items-center gap-3 text-lg">
              <FaMapMarkerAlt className="text-yellow-300" />
              {event.address}, {event.city}, {event.state}
            </p>

            {event.notes && (
              <div className="bg-black/50 border border-yellow-400/30 rounded-xl p-4 text-sm whitespace-pre-line">
                {event.notes}
              </div>
            )}

            {event.eventbrite_url && (
              <a
                href={event.eventbrite_url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2 mt-4
                  px-6 py-3 rounded-xl
                  bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600
                  text-black font-bold
                  hover:brightness-110 transition
                "
              >
                <FaTicketAlt /> Get Tickets
              </a>
            )}
          </div>

          {/* RIGHT */}
          <div>
            <h3 className="text-2xl font-bold text-yellow-300 mb-4 text-center">
              🎤 Featured Artists
            </h3>

            {featuredArtists.length === 0 ? (
              <p className="text-center italic text-yellow-200">
                Artist lineup coming soon.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {featuredArtists.map((artist) => (
                  <Link
                    key={artist.id}
                    to={`/artist/${artist.slug}`}
                    className="group flex flex-col items-center text-center hover:scale-105 transition"
                  >
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-300 shadow-[0_0_25px_rgba(255,215,0,0.45)]">
                      <img
                        src={
                          artist.image_url ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL2me_CKyfrr925EXl7hOyjKOmLKFmkz40rA&s"
                        }
                        alt={artist.artist_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <span className="mt-3 font-bold text-sm">
                      {artist.artist_name}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {itineraryHosts.length > 0 && (
  <div className="mb-6">
    <h3 className="text-xl font-bold text-yellow-300 text-center mb-3">
      🎧 Featured Hosts
    </h3>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
      {itineraryHosts.map(host => (
        <Link
          key={host.id}
          to={`/${host.slug}`}
          className="group flex flex-col items-center text-center hover:scale-105 transition"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-400 shadow-lg">
            <img
              src={host.photo_url || "/default-dj.png"}
              alt={host.dj_name}
              className="w-full h-full object-cover"
            />
          </div>

          <span className="mt-2 font-bold text-sm">
            {host.dj_name}
          </span>
        </Link>
      ))}
    </div>
  </div>
)}
          </div>
         

        </div>
       
      </div>
    </section>
  );
}
