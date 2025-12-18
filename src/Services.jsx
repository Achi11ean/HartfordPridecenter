import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "https://singspacebackend.onrender.com";

export default function Services({
  prideId = 1,
  contactPath = "/contact",
}) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(
          `${API}/api/pride/${prideId}/services`
        );

        setServices(
          (res.data || []).map((s) => ({
            id: s.id,
            title: s.title,
            desc: s.description,
            details: s.description,
            image: s.image_url,
            contact_name: s.contact_name,
            contact_email: s.contact_email,
            url: s.url,
          }))
        );
      } catch (err) {
        console.error("❌ Failed to load services", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [prideId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#92400E] to-[#FACC15] pb-20">

      {/* ───────────────── Header ───────────────── */}
      <header className="pt-32 px-6 text-center max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif md:text-5xl font-extrabold text-white">
          Programs & Services
        </h1>
<hr className="rainbow-hr" />

        {/* Rainbow Divider */}

        <p className="text-yellow-200/90 max-w-2xl mx-auto text-lg">
          Empowering, supporting, and celebrating the LGBTQIA+ community
          through care, advocacy, and connection.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Link to={contactPath}>
            <button className="w-full py-2 rounded-full font-bold
              bg-white text-yellow-800 border-4 border-yellow-300/40
              hover:scale-105 hover:shadow-lg transition">
              Get Involved
            </button>
          </Link>
          <Link to="/resources">
            <button className="w-full py-2 rounded-full font-bold
              bg-white text-yellow-800 border-4 border-yellow-300/40
              hover:scale-105 hover:shadow-lg transition">
              Resources
            </button>
          </Link>
        </div>
      </header>

      {/* ───────────────── Loading / Empty ───────────────── */}
      {loading && (
        <p className="text-center mt-20 text-yellow-200 animate-pulse">
          Loading services…
        </p>
      )}

      {!loading && services.length === 0 && (
        <p className="text-center mt-20 text-yellow-200 italic">
          No services have been added yet.
        </p>
      )}

      {/* ───────────────── Services Grid ───────────────── */}
      {!loading && services.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mt-16
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {services.map((s) => (
<div className="rainbow-border hover:scale-[1.02] transition-transform duration-300">
  <button
    onClick={() => setSelectedService(s)}
    className="
      group text-left w-full h-full
      rounded-3xl overflow-hidden
      bg-white/90 backdrop-blur-md
      shadow-xl transition-all duration-300
      hover:-translate-y-1 hover:shadow-2xl
    "
  >

              {/* Image */}
              {s.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover
                      transition-transform duration-500
                      group-hover:scale-105"
                  />
                  <div className="absolute inset-0
                    bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="
                  text-xl font-extrabold mb-2
                  bg-gradient-to-r from-[#0F2D25] via-[#18453B] to-black
                  bg-clip-text text-transparent
                ">
                  {s.title}
                </h3>

                <p className="text-black/80 text-sm leading-relaxed">
                  {s.desc}
                </p>

                <div className="mt-4 text-sm font-semibold text-yellow-700">
                  Learn more →
                </div>
              </div>
            </button>
            </div>
          ))}
        </section>
      )}

      {/* ───────────────── Modal ───────────────── */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedService(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative z-10 w-full max-w-2xl
            rounded-3xl overflow-hidden
            bg-yellow-50 shadow-2xl border border-yellow-300/40">

            {selectedService.image && (
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="h-56 w-full object-cover"
              />
            )}

            <div className="p-6">
              <h3 className="text-2xl font-extrabold text-yellow-900">
                {selectedService.title}
              </h3>

              <div className="h-px my-3
                bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />

              <p className="text-gray-800 leading-relaxed">
                {selectedService.details}
              </p>

              <p className="mt-4 text-sm text-gray-700">
                <strong>Contact:</strong>{" "}
                {selectedService.contact_name} ·{" "}
                <a
                  href={`mailto:${selectedService.contact_email}`}
                  className="underline text-yellow-800"
                >
                  {selectedService.contact_email}
                </a>
              </p>

              {selectedService.url && (
                <a
                  href={selectedService.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-5 px-6 py-2 rounded-full
                    bg-yellow-400 text-black font-bold shadow
                    hover:brightness-110 transition"
                >
                  Visit Resource
                </a>
              )}
            </div>

            <div className="border-t bg-yellow-100/70 p-4 text-right">
              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-2 rounded-xl bg-black text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
