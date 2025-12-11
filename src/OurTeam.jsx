import React, { useState } from "react";
import { GiAcorn } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import OurSponsorsBlueTemplate from "./OurSponsors";

// —— Team Data ——
const teamMembers = [
{
  name: "Monique Madison",
  role: "Drag Performer • Actress • Author",
  image: "/monique.jpg", 
  bio: `Monique Madison started doing drag in 1996. Beginning in Kalamazoo at the young age of 18, Monique has been lucky enough to perform all over the country with house cast positions in Chicago, Indianapolis, and Detroit.

— —

Monique just finished her first film role in "A Holiday I Do" and recently wrapped filming season one of a sitcom called *The Agency*, where she plays leading role Parker — scheduled for release Easter of 2025.

Momo is also the author of *The Serial Showgirls Series,* available on Amazon and at Barnes & Noble.

Monique created The Kunty Kittens in 2016 with the intention of creating that divalicious girl-group sensation that everyone loves, infused with the best drag personalities Michigan has to offer.`,
  style: "border-pink-400 bg-pink-50/70 hover:shadow-pink-400/50",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=1200&q=80')"
},
  {
    name: "Kai Morgan",
    role: "Project Manager",
    image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800",
    bio: `Organizer-in-chief. I coordinate timelines, budgets, and cross-team communication so launches feel calm and predictable.\n\n— —\n\nI’m obsessed with color-coded boards, crisp handoffs, and celebrating wins. Weekend hobbies: trail runs and crossword battles.`,
    style: "border-yellow-400 bg-yellow-50/70 hover:shadow-yellow-400/50",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1563467743682-704cc8ccb9c6?fm=jpg&q=60&w=3000')",
  },
  {
    name: "Jonathen Whitford",
    role: "Social Media Marketing / Web Developer",
    image: "/jonathen.jpeg",
    bio: `My Name is Jonathen Whitford and I'm located in Connecticut serving as the marketing creator and in-house software engineer. I work closely with multiple pride groups in developing technology for the community and marketing to promote it as well as host karaoke, trivia, and DJ. I am also the creator and founder of both Karaoverse.com and JWhitProductions.com.`,
    style: "border-yellow-400 bg-yellow-50/70 hover:shadow-yellow-400/50",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400')",
  },
  {
    name: "Lindsey Merick",
    role: "Administrative Assistant",
    image: "/Lindsey.jpg",
    bio: `My name is Lindsey Merick, and I currently serve as the Administrative Assistant for South Haven LGBTQ+ Advocacy and South Haven Pride Committee. I have been involved in planning South Haven pride since our first event in 2024. Mental-health disparities in the LGBTQ+ community are a major reason why I stay committed to this work. According to the Trevor Project, 41% of LGBTQ+ youth seriously considered suicide in the past year. This alarming statistic does not reflect identity, but the impact of stigma and discrimination.

By doing my part, I hope to be able to show people that they are worthy, valued, and perfect just as they are. Furthermore, as a mother and an aunt, I want to send a message to my children and other young people that love always wins and hate has no place in our world. I am honored to serve in my role, behind the scenes and alongside our team, to build a more inclusive South Haven.`,
    style: "border-yellow-400 bg-yellow-50/70 hover:shadow-yellow-400/50",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=2400')",
  },
  {
    name: "Gail Donnelly",
    role: "Product Designer",
    image: "/Gail.jpg",
    bio: `My name is Gail Donnelly Bader and I am one of the members of the initial board
of directors of South Haven LGBT Q+ Advocacy and also serve as secretary for
the board. I am a retired attorney living in Alton, Illinois most of the year, but my
husband and I spend our summers in South Haven (I was born and raised in Michigan)
and I wanted to be a part of the community and volunteer my time in South Haven. I
have a child who is a member of the LGBTQ+ community, so I am an ally who wants to
help advocate for issues important to the LGBTQ+ community and create safe spaces
for members of that community.`,
    style: "border-yellow-400 bg-yellow-50/70 hover:shadow-yellow-400/50",
    backgroundImage:
      "url('https://media4.giphy.com/media/U3qYN8S0j3bpK/giphy.gif')",
  },
  {
    name: "Malissa Acosta",
    role: "Marketing Lead",
    image: "/Malissa.jpg",
    bio: `Malissa is a dedicated advocate, educator, and community-builder with a strong commitment to supporting LGBTQ+ individuals and other vulnerable populations. With a background in Community & Human Services, she brings a trauma-informed, justice-centered approach to every space she serves. Malissa is heavily involved in school and community programs, particularly those designed to support our most at-risk community members, where she works to create safe, affirming, and empowering environments for youth and families. Through her combined experience in social services, education, and advocacy, she is devoted to amplifying marginalized voices and helping build a more inclusive, compassionate community for all.`,
    style: "border-yellow-400 bg-yellow-50/70 hover:shadow-yellow-400/50",
    backgroundImage:
      "url('https://media2.giphy.com/media/JjIjreqeHtfOoQb0QV/giphy.gif')",
  },
];

// —— Component ——
export default function OurTeamYellowTemplate() {
  const location = useLocation();
  const openSponsors = location.state?.openSponsors === true;

  const [activeTab, setActiveTab] = useState(openSponsors ? "sponsors" : "team");
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-amber-900 to-yellow-800 text-yellow-50">

      {/* HERO */}
      <div
        className="w-full border-b-4 h-80 md:h-96 bg-cover bg-center relative shadow-2xl"
        style={{
          backgroundImage:
            "url('https://rare-gallery.com/uploads/posts/349940-4k-wallpaper.jpg')",
          backgroundPosition: "center 70%",
        }}
      >
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-full border-2 border-yellow-300/80 bg-yellow-900/60 backdrop-blur px-6 py-3 shadow-xl">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              {activeTab === "team" ? "Our Team" : "Sponsors"}
            </h1>
          </div>
        </div>
      </div>

      {/* ⭐ TABS */}
      <div className="flex justify-center mt-16 mb-10">
        <div className="flex bg-yellow-900/40 backdrop-blur-md p-1 rounded-full border border-yellow-300 shadow-xl">

          {/* Team Tab */}
          <button
            onClick={() => setActiveTab("team")}
            className={`
              px-6 py-2 rounded-full font-bold text-lg transition-all
              ${
                activeTab === "team"
                  ? "bg-yellow-300 text-yellow-900 shadow-lg"
                  : "text-yellow-200 hover:bg-yellow-700/40"
              }
            `}
          >
            Team
          </button>

          {/* Sponsors Tab */}
          <button
            onClick={() => setActiveTab("sponsors")}
            className={`
              px-6 py-2 rounded-full font-bold text-lg transition-all
              ${
                activeTab === "sponsors"
                  ? "bg-yellow-300 text-yellow-900 shadow-lg"
                  : "text-yellow-200 hover:bg-yellow-700/40"
              }
            `}
          >
            Sponsors
          </button>

        </div>
      </div>

      {/* ⭐ TAB CONTENT */}
      <AnimatePresence mode="wait">
        {activeTab === "team" ? (
          <motion.div
            key="team"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* — TEAM SECTION — */}
            <section className="max-w-6xl mx-auto px-4 pt-4 pb-20">
              <p className="text-yellow-200/90 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
                Meet the people who plan, design, build, and launch your ideas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((m) => (
                  <motion.button
                    key={m.name}
                    onClick={() => setSelectedMember(m)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.99 }}
                    className={`text-left cursor-pointer rounded-3xl p-6 shadow-lg border-2 transition-all duration-300 ${m.style}`}
                  >
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-24 h-24 rounded-2xl object-cover shadow-md"
                    />
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-yellow-900">
                        {m.name}
                      </h3>
                      <p className="text-sm font-medium text-yellow-800/80">
                        {m.role}
                      </p>
                    </div>
                    <p className="mt-4 text-yellow-900/90 bg-white/70 rounded-xl p-3 max-h-40 overflow-y-auto whitespace-pre-line">
                      {m.bio.replaceAll("— —", "—")}
                    </p>
                  </motion.button>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-300 bg-yellow-900/60 px-6 py-3 font-semibold hover:bg-yellow-700/70 hover:shadow-lg transition"
                >
                  Talk to our team
                </Link>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="sponsors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <OurSponsorsBlueTemplate />
          </motion.div>
        )}
      </AnimatePresence>

      {/* — MODAL — */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-yellow-300"
              style={{
                backgroundImage: selectedMember.backgroundImage || undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/85 via-yellow-900/75 to-yellow-900/90" />

              <div className="relative p-6 sm:p-10 text-yellow-50">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white/80 shadow-lg"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl sm:text-3xl font-extrabold">
                      {selectedMember.name}
                    </h3>
                    <p className="text-yellow-200 font-medium">
                      {selectedMember.role}
                    </p>
                  </div>
                </div>

                <div className="mt-6 max-h-64 overflow-y-auto rounded-2xl bg-white/90 p-4 text-yellow-900 leading-7 whitespace-pre-line">
                  {selectedMember.bio}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="rounded-xl px-5 py-2.5 font-semibold bg-white text-yellow-900 border border-yellow-300 hover:bg-yellow-50"
                  >
                    Close
                  </button>
                  <Link
                    to="/contact"
                    className="rounded-xl px-5 py-2.5 font-semibold bg-yellow-300/90 text-yellow-900 hover:bg-yellow-300"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center text-yellow-200/80 pb-10">
        <p className="font-semibold tracking-wide">
          Built with care • Ready for any industry
        </p>
      </footer>
    </div>
  );
}
