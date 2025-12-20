import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

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
            service_url: s.service_url,

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


  const [carouselIndex, setCarouselIndex] = useState(0);



// Hardcoded banner image to always include
const staticBanner = "https://www.garlandcounty.org/ImageRepository/Document?documentId=260";

// Build final array:
const carouselImages = [
  staticBanner,
  ...services.map((s) => s.image).filter(Boolean),
];

useEffect(() => {
  if (!carouselImages.length) return;

  const id = setInterval(() => {
    setCarouselIndex((i) => (i + 1) % carouselImages.length);
  }, 5500);

  return () => clearInterval(id);
}, [carouselImages.length]);



return (
  <div
    className="
      min-h-screen w-full overflow-x-hidden
      bg-gradient-to-b
      from-[#FFF9D6] via-[#FFE87C] to-[#FACC15]
      text-[#5A4400]
    "
  >

  {/* ========================= HERO: IMAGE CAROUSEL ========================= */}
{/* ========================= HERO: IMAGE CAROUSEL ========================= */}
<section
  className="
    relative w-full h-[60vh]
    overflow-hidden shadow-2xl
    mt-14
  "
>
  {/* Wrapper */}
  <div
    className="absolute inset-0 flex transition-transform duration-[1200ms] ease-in-out"
    style={{
      width: `${carouselImages.length * 100}%`,
      transform: `translateX(-${carouselIndex * (100 / carouselImages.length)}%)`,
    }}
  >
    {carouselImages.map((src, index) => (
      <div
        key={index}
        className="w-full h-full flex-shrink-0"
        style={{ width: `${100 / carouselImages.length}%` }}
      >
        <img
          src={src}
          alt="slide"
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>


  {/* DARK OVERLAY FOR LEGIBILITY */}
  <div className="absolute inset-0 bg-black/40" />


  {/* GRADIENT BLEND (top lighter / bottom slightly darker) */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />



  {/* TEXT */}
  <div
    className="
      absolute bottom-12 w-full text-center px-6
      flex flex-col items-center justify-center
      text-white z-10
    "
  >
    <h1
      className="
        text-4xl sm:text-6xl md:text-7xl font-black
        drop-shadow-2xl
      "
    >
      Community Programs & Services
    </h1>

    <p
      className="
        max-w-3xl font-semibold mt-6
        text-base sm:text-xl md:text-2xl
        drop-shadow-xl
      "
    >
      Grow your voice, find support, build community —
      powered through the Karaoverse platform.
    </p>
  </div>
</section>


    {/* ========================= INTRO TEXT ========================= */}



    {/* ========================= SERVICE GRID ========================= */}
    {!loading && services.length > 0 && (
      <section
        className="
          max-w-7xl mx-auto px-6 mt-8
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14
        "
      >

       
  
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedService(s)}
            className="
              group w-full text-left overflow-hidden rounded-3xl
              bg-gradient-to-br from-white to-yellow-50
              border-[6px] border-yellow-400 shadow-[0_8px_25px_rgba(0,0,0,0.25)]
              hover:shadow-[0_20px_35px_rgba(0,0,0,0.35)]
              hover:scale-[1.03] transition-all duration-500
            "
          >

            {/* IMAGE */}
            {s.image && (
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="
                    w-full h-full object-cover
                    group-hover:scale-110
                    transition-transform duration-[1600ms]
                  "
                />
                <div
                  className="
                    absolute inset-0 bg-gradient-to-t
                    from-black/60 to-transparent
                  "
                />
              </div>
            )}

            {/* TEXT */}
            <div className="p-7">
              <h3
                className="
                  text-3xl font-black tracking-tight
                  bg-gradient-to-r from-yellow-800 to-yellow-600
                  bg-clip-text text-transparent
                  drop-shadow
                "
              >
                {s.title}
              </h3>

              <p
                className="
                  mt-4 text-[#5A4400]/90 font-medium leading-relaxed
                  min-h-[65px]
                "
              >
                {s.desc}
              </p>

              <p
                className="
                  mt-6 pr-2 text-right font-extrabold uppercase text-sm
                  bg-gradient-to-r from-black to-yellow-700
                  bg-clip-text text-transparent tracking-widest
                "
              >
                Learn more →
              </p>
            </div>
          </button>
        ))}
      </section>
    )}


    {/* ========================= NO DATA ========================= */}
    {!loading && services.length === 0 && (
      <p
        className="
          text-center text-2xl mt-40 font-bold
          text-black/60 italic
        "
      >
        ⭐️ No programs published yet — come back soon!
      </p>
    )}

    {/* ========================= LOADING ========================= */}
    {loading && (
      <div className="text-center mt-32 animate-pulse text-xl text-black/70">
        Loading programs…
      </div>
    )}


    {/* ========================= FOOTER QUOTE ========================= */}
    <div className="mt-32 pb-28 text-center px-6">
      <p
        className="
          text-xl md:text-2xl font-black
          bg-gradient-to-r from-black to-yellow-900
          bg-clip-text text-transparent
        "
      >
        “Community isn’t a concept — it’s a lifeline.”
      </p>

      <p
        className="
          mt-3 text-md md:text-lg font-semibold
          text-[#503B00]/80
        "
      >
        Every profile. Every voice. Every story adds strength.
      </p>
    </div>
  </div>
);

}
