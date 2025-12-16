import React from "react";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaHeart,
  FaHandsHelping,
  FaBook,
  FaGlobeAmericas,
} from "react-icons/fa";

export default function Resources() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2D25] via-black to-[#18453B] text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-300">
            Community Resources
          </h1>
          <p className="mt-4 text-lg text-yellow-100/90 font-semibold">
            Support, safety, education, and connection — curated for the LGBTQIA+ community
            and allies in and around Hartford, CT.
          </p>
        </motion.div>

        {/* Resource Sections */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Crisis & Support */}
          <ResourceCard
            icon={<FaPhoneAlt />}
            title="Crisis & Immediate Support"
            items={[
              {
                label: "988 Suicide & Crisis Lifeline",
                desc: "24/7 confidential support for emotional distress",
                link: "https://988lifeline.org",
              },
              {
                label: "Trevor Project",
                desc: "Crisis intervention for LGBTQ+ youth",
                link: "https://www.thetrevorproject.org",
              },
              {
                label: "Trans Lifeline",
                desc: "Peer support by and for trans people",
                link: "https://translifeline.org",
              },
            ]}
          />

          {/* Local Community */}
          <ResourceCard
            icon={<FaHandsHelping />}
            title="Local Community & Advocacy"
            items={[
              {
                label: "Hartford Pride Center",
                desc: "Local LGBTQ+ support, programming, and events",
                link: "https://hartfordpridecenter.org",
              },
              {
                label: "True Colors",
                desc: "Support for LGBTQ+ youth experiencing homelessness",
                link: "https://ourtruecolors.org",
              },
              {
                label: "PFLAG Hartford",
                desc: "Support for families, allies, and loved ones",
                link: "https://pflag.org",
              },
            ]}
          />

          {/* Health & Wellness */}
          <ResourceCard
            icon={<FaHeart />}
            title="Health & Wellness"
            items={[
              {
                label: "Planned Parenthood",
                desc: "Inclusive sexual and reproductive health care",
                link: "https://www.plannedparenthood.org",
              },
              {
                label: "GLMA Provider Directory",
                desc: "Find LGBTQ-friendly healthcare providers",
                link: "https://www.glma.org",
              },
            ]}
          />

          {/* Education & Legal */}
          <ResourceCard
            icon={<FaBook />}
            title="Education & Legal Resources"
            items={[
              {
                label: "ACLU LGBTQ Rights",
                desc: "Know your rights and legal protections",
                link: "https://www.aclu.org/issues/lgbtq-rights",
              },
              {
                label: "Lambda Legal",
                desc: "Legal help desk and advocacy",
                link: "https://www.lambdalegal.org",
              },
            ]}
          />
        </div>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 text-center max-w-3xl mx-auto bg-white/10 border border-yellow-400/25 shadow-2xl p-8"
        >
          <FaGlobeAmericas className="text-4xl text-yellow-300 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-yellow-300">
            Know a resource we should add?
          </h2>
          <p className="mt-3 text-yellow-100/90 font-semibold">
            We’re always growing. If you know a local organization, hotline, or
            service that supports the community, let us know.
          </p>

          <a
            href="/contact"
            className="inline-block mt-6 px-8 py-3 font-extrabold text-black border border-black shadow-xl
              bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500
              hover:from-yellow-500 hover:via-amber-400 hover:to-yellow-300
              transition-all duration-300"
          >
            Submit a Resource
          </a>
        </motion.div>
      </div>
    </div>
  );
}

/* ───────────────────────────── */
/* Resource Card */
/* ───────────────────────────── */

function ResourceCard({ icon, title, items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-black/40 border border-white/10 shadow-2xl p-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white/10 border border-yellow-400/20 text-yellow-300 text-xl">
          {icon}
        </div>
        <h3 className="text-xl font-extrabold text-yellow-300">{title}</h3>
      </div>

      <ul className="mt-5 space-y-4">
        {items.map((item, i) => (
          <li key={i}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <p className="font-bold text-yellow-200">{item.label}</p>
              <p className="text-sm text-yellow-100/80 font-semibold">
                {item.desc}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
