import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Services({
  contactPath = "/contact",
  services = [],
  theme = {
    pageBg: "bg-gradient-to-b from-indigo-900 via-purple-900 to-teal-900",
    cardBg: "bg-white/90",
    cardHoverBg: "hover:bg-white",
    primaryTextGrad: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
    accentTextGrad: "bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-400",
    border: "border-white/20",
    headingText: "text-white",
    bodyText: "text-gray-800",
  },
}) {
  const [selectedService, setSelectedService] = useState(null);

  // 🌟 Default Pride Center Services
  const defaultServices = services.length
    ? services
    : [
        {
          title: "Community Programs",
          desc: "Engaging activities that bring the LGBTQIA+ community together.",
          details:
            "From youth and senior meetups to art showcases, open mics, and drag story hours — our programs celebrate diversity, inclusion, and joy in every form.",
          image:
            "https://www.cdph.ca.gov/Programs/CID/DOA/PublishingImages/Pages/Celebrate-Pride/CelebratePrideCropped.jpg",
        },
        {
          title: "Advocacy & Education",
          desc: "Empowering voices and creating awareness across Connecticut.",
          details:
            "We provide training, workshops, and educational initiatives to promote equality, inclusivity, and understanding in schools, workplaces, and local communities.",
          image:
            "https://media.licdn.com/dms/image/v2/C5612AQH9PUIENeYaKQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1588869753497?e=2147483647&v=beta&t=xB10s2-5w_JhfwG47_hiQ2d1RBWTzYdHwQQoE5lO758",
        },
        {
          title: "Health & Wellness",
          desc: "Supporting mind, body, and spirit with care and compassion.",
          details:
            "Our health programs offer resources on mental wellness, sexual health, HIV testing, and access to affirming care providers — because your wellbeing matters.",
          image:
            "https://www.inspirahealthnetwork.org/sites/default/files/2021-06/iStock-1221852877.jpg",
        },
        {
          title: "Arts & Culture",
          desc: "Celebrating creativity and expression within our community.",
          details:
            "We host film screenings, gallery nights, drag performances, and pride festivals that highlight queer art and storytelling from diverse voices.",
          image:
            "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-560w,f_auto,q_auto:best/rockcms/2025-08/250812-queer-art-censorship-se-143p-0f7861.jpg",
        },
        {
          title: "Support Services",
          desc: "Here for you — no matter where you are on your journey.",
          details:
            "Our trained staff and volunteers offer peer support, coming-out resources, legal guidance, and safe connections for individuals and families in need.",
          image:
            "https://m.media-amazon.com/images/I/61fAp0SH+qL._UF1000,1000_QL80_.jpg",
        },
        {
          title: "Volunteer & Outreach",
          desc: "Join our mission to make a difference locally and beyond.",
          details:
            "Whether helping with events, mentorship, or advocacy, our volunteers are the heartbeat of the Hartford Pride Center — making every day a little brighter for all.",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIL-vhEVIFazkfJP97ZK7sT104xnLrmKVgJFo-SQPytI214UpryLt9PfJvhZC5EGRNTLU&usqp=CAU",
        },
      ];

  // 🌈 Reusable Contact Button
  const ContactButton = () => (
    <div className="flex justify-center my-10">
      <Link to={contactPath}>
        <button
          className={`px-10 py-2 rounded-full font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 ${theme.accentTextGrad} border-4 border-pink-300/40 hover:border-pink-300`}
        >
          Get Involved 💜
        </button>
      </Link>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.pageBg} pb-16`}>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold border-b-4 border-pink-400 inline-block ${theme.headingText}`}
          >
            Our Programs & Services
          </h1>
          <p className="mt-4 text-white/90 max-w-2xl mx-auto text-lg">
            Explore how we empower and support the LGBTQIA+ community through
            connection, advocacy, and creativity.
          </p>
        </div>
      </div>

      <ContactButton />

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {defaultServices.map((s, i) => (
            <button
              key={i}
              onClick={() => setSelectedService(s)}
              className={`text-left rounded-2xl overflow-hidden shadow-xl border ${theme.border} transition transform hover:-translate-y-1 hover:shadow-2xl ${theme.cardBg} ${theme.cardHoverBg}`}
            >
              {s.image && (
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-44 object-cover"
                />
              )}
              <div className="p-5">
                <h3
                  className={`text-xl font-bold mb-2 text-transparent bg-clip-text ${theme.primaryTextGrad}`}
                >
                  {s.title}
                </h3>
                <p className={`${theme.bodyText}`}>{s.desc}</p>
              </div>
            </button>
          ))}
        </section>
      </div>

      {/* Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedService(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <div className="relative z-10 flex min-h-full items-center justify-center p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl border border-white/10 bg-white/90 backdrop-blur-md animate-[fadeInUp_.3s_ease]">
              {/* Header */}
              <div className="relative">
                {selectedService.image && (
                  <img
                    src={selectedService.image}
                    alt={selectedService.title}
                    className="h-56 w-full object-cover"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white transition"
                  aria-label="Close"
                  title="Close"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <h3 className="text-2xl font-extrabold tracking-tight text-gray-900">
                  {selectedService.title}
                </h3>
                <div className="mt-3 h-px bg-gradient-to-r from-transparent via-pink-400/30 to-transparent" />
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {selectedService.details}
                </p>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between border-t bg-white/80 px-6 py-4 backdrop-blur">
                <div className="w-full sm:w-auto">
                  <ContactButton />
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="w-full sm:w-auto rounded-xl bg-gray-900 px-5 py-2.5 font-semibold text-white shadow hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Keyframes */}
          <style>
            {`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translate3d(0, 15px, 0); }
                to   { opacity: 1; transform: translate3d(0, 0, 0); }
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
}
