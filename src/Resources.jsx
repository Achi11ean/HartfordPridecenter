import React from "react";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaHeart,
  FaHandsHelping,
  FaBook,
  FaGlobeAmericas,
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaLink,
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
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-300">
            Community Resources
          </h1>

          {/* MANUAL DESCRIPTION AREA */}
          <p className="mt-4 text-lg text-yellow-100/90 font-semibold leading-relaxed">
            {/* ✏️ MANUALLY WRITE YOUR PAGE DESCRIPTION HERE */}
            Support, safety, education, advocacy, and mutual aid resources curated
            for community members seeking immediate help, legal information,
            bystander assistance, wellness support, and trusted organizations.
          </p>
        </motion.div>


        {/* FEATURED CUSTOM COMMUNITY RESOURCE */}
      
        {/* STANDARD RESOURCE SECTIONS */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
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
  <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 bg-gradient-to-br from-yellow-900/30 to-black border border-yellow-400/20 shadow-2xl p-8"
        >
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-3">
            {/* ✏️ MANUAL TITLE */}
            The Perseus Project
          </h2>

          <p className="text-yellow-100/85 font-semibold leading-relaxed mb-6">
            {/* ✏️ MANUAL DESCRIPTION */}
            Community-based rapid response, bystander aid, know-your-rights access,
            whistle distribution, and mutual support tools helping individuals
            protect one another, stay informed, and mobilize safely in the face of threats, violence, and injustice.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-sm font-semibold">

            <a href="https://instagram.com/theperseusproject" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 hover:bg-white/10">
              <FaInstagram className="text-yellow-300" />
              IG @theperseusproject
            </a>

            <a href="https://facebook.com/theperseusproject" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 hover:bg-white/10">
              <FaFacebook className="text-yellow-300" />
              Facebook.com/theperseusproject
            </a>

            <a href="https://gofundme.com/u/perseusproject" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 hover:bg-white/10">
              <FaLink className="text-yellow-300" />
              Gofundme.com/u/perseusproject
            </a>

            <a href="mailto:wetakecareofus1@proton.me" className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 hover:bg-white/10">
              <FaEnvelope className="text-yellow-300" />
              wetakecareofus1@proton.me
            </a>

            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10">
              <FaPhoneAlt className="text-yellow-300" />
              Aid & Bystander Hotline: 860-352-0590
            </div>

            <a href="mailto:whistlerequests@proton.me" className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 hover:bg-white/10">
              <FaEnvelope className="text-yellow-300" />
              Request up to 3,000 whistles free
            </a>

            <a href="https://www.ilrc.org" target="_blank" rel="noopener noreferrer" className="sm:col-span-2 flex items-center gap-3 p-4 bg-white/5 border border-white/10 hover:bg-white/10">
              <FaBook className="text-yellow-300" />
              Order free Know Your Rights cards / Red Cards (up to 250 weekly) at ILRC.org
            </a>
          </div>
        </motion.div>


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
            We are continually expanding this library of support and mutual aid.
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