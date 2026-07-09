import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";
import { FaHandshake, FaStar, FaHeart } from "react-icons/fa";
const SPONSOR_TIERS = [
  "Customized Tier",
  "Community Supporter",
  "Bronze Sponsor",
  "Silver Sponsor",
  "Gold Sponsor",
  "Platinum Sponsor",
];
const ONE_TIME_LINK = "https://buy.stripe.com/7sY8wQedb5iTgfMepGcIE06";

const MONTHLY_LINKS = {
  " Supporter": "https://buy.stripe.com/00w5kw18feiS8gWgFacwg01",
  "Bronze Sponsor": "https://buy.stripe.com/14A3co7wD7Uu9l09cIcwg06",
    "Community Program Sponsor": "https://buy.stripe.com/14A3co7wD7Uu9l09cIcwg06",

  "Sponsor Medication": "https://buy.stripe.com/dRm8wQfhf4eP6Fc6XecIE09",
  "Friend of Hartford Pride Center": "https://buy.stripe.com/dRm14o8SRcLlaVsa9qcIE0a",
  "Platinum Sponsor": "https://buy.stripe.com/aFa8wQ7ON5iT7Jg3L2cIE0b",
  "Customized Tier": "#"
};

export default function SponsorInvitation() {
const handleShare = async () => {
  const shareUrl =
    "https://share.karaoverse.com/og/support";

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Support Karaoverse",
        text:
          "Help empower artists, venues, hosts, Pride organizations, and communities by supporting Karaoverse's mission to build the future of live entertainment!",
        url: shareUrl,
      });
    } catch (err) {
      console.log("Share cancelled");
    }
  } else {
    navigator.clipboard.writeText(shareUrl);

    alert("Share link copied!");
  }
};
  const tierDetails = {
    "Community Supporter": {
      monthly: "$10 / month",
      oneTime: "$100",
      perks: [
        "Name listed on sponsor page",
        "Community appreciation badge",
        "Support local artists & venues"
      ]
    },

    "Bronze Sponsor": {
      monthly: "$20 / month",
      oneTime: "$250",
      perks: [
        "Logo displayed on sponsor page",
        "Sponsor listing on Karaoverse website",
        "Recognition on Quarterly Sponsor announcements"
      ]
    },

    "Silver Sponsor": {
      monthly: "$50 / month",
      oneTime: "$500",
      perks: [
        "Enhanced logo placement",
        "Clickable website link",
        "Promotion at Karaoverse Events (small)"
      ]
    },

    "Gold Sponsor": {
      monthly: "$100 / month",
      oneTime: "$1,000",
      perks: [
        "Featured sponsor placement",
        "Priority visibility on sponsor displays",
        "Promotion at Karaoverse Events (Medium)"
      ]
    },

    "Platinum Sponsor": {
      monthly: "$250 / month",
      oneTime: "$2,500",
      perks: [
        "Premium sponsor placement",
        "Top-level brand exposure and recognition at board of innovation meetings",
        "Promotions at Karaoverse Events (Large) "
      ]
    },

    "Customized Tier": {
      monthly: "Custom",
      oneTime: "Custom",
      perks: [
        "Tailored sponsorship packages",
        "Event partnerships",
        "Custom marketing campaigns"
      ]
    },

  
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white">

      {/* HERO */}

      <section className="text-center pt-24 ">

<section className="relative overflow-hidden border-b pt-24 pb-20">

  {/* Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-950 via-purple-950 to-slate-950" />

  {/* Rainbow Aurora */}
  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,.25),transparent_28%),radial-gradient(circle_at_top_right,rgba(249,115,22,.22),transparent_30%),radial-gradient(circle_at_center,rgba(250,204,21,.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,.22),transparent_30%),radial-gradient(circle_at_center_right,rgba(168,85,247,.22),transparent_35%)]" />

  <div className="relative max-w-7xl mx-auto px-6">

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .7 }}
      className="grid items-center gap-16 lg:grid-cols-[1.1fr_.9fr]"
    >

      {/* LEFT */}
      <div>

        <div className="inline-flex items-center gap-3 rounded-full border border-pink-400/30 bg-white/10 backdrop-blur-xl px-5 py-2 text-xs font-black uppercase tracking-[.35em] text-pink-200">
          🏳️‍🌈 Hartford Pride Center
        </div>

        <h1 className="mt-6 text-5xl sm:text-7xl font-black leading-none">

          <span className="bg-gradient-to-r from-red-300 via-yellow-200 via-green-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Building
          </span>

          <br />

          <span className="text-white">
            Community Together
          </span>

        </h1>

        <p className="mt-8 max-w-2xl text-lg sm:text-2xl leading-relaxed text-white/80">

          A welcoming place where LGBTQIA+ people, families, allies,
          and communities can connect, celebrate, find support,
          discover resources, and create a future where everyone
          belongs exactly as they are.

        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">

          <div className="rounded-3xl border border-pink-400/20 bg-white/5 backdrop-blur-xl p-5">

            <div className="text-4xl mb-3">
              🌈
            </div>

            <h3 className="font-bold text-white">
              Celebrate Pride
            </h3>

            <p className="text-sm text-white/70 mt-2">
              Join events, festivals, community gatherings,
              and moments that bring us together.
            </p>

          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-white/5 backdrop-blur-xl p-5">

            <div className="text-4xl mb-3">
              ❤️
            </div>

            <h3 className="font-bold text-white">
              Find Support
            </h3>

            <p className="text-sm text-white/70 mt-2">
              Access resources, programs,
              advocacy, education, and
              community connections.
            </p>

          </div>

          <div className="rounded-3xl border border-yellow-400/20 bg-white/5 backdrop-blur-xl p-5">

            <div className="text-4xl mb-3">
              ✨
            </div>

            <h3 className="font-bold text-white">
              Be Yourself
            </h3>

            <p className="text-sm text-white/70 mt-2">
              Every identity is celebrated.
              Every story matters.
              Every voice belongs.
            </p>

          </div>

        </div>

        <div className="mt-10 flex flex-wrap gap-3">

          <span className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-200">
            🏳️‍⚧️ Trans Inclusive
          </span>

          <span className="rounded-full bg-orange-500/20 px-4 py-2 text-sm font-semibold text-orange-200">
            🤝 Community Programs
          </span>

          <span className="rounded-full bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-100">
            💛 Advocacy
          </span>

          <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-200">
            🌿 Wellness
          </span>

          <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-200">
            🎉 Events
          </span>

          <span className="rounded-full bg-purple-500/20 px-4 py-2 text-sm font-semibold text-purple-200">
            💜 Everyone Welcome
          </span>

        </div>

      </div>

      {/* RIGHT */}
      <motion.div
        initial={{ opacity: 0, scale: .9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: .25, duration: .8 }}
        className="relative"
      >

        <div className="absolute -inset-12 rounded-full bg-gradient-to-r from-red-500/20 via-yellow-400/20 via-green-400/20 via-cyan-400/20 to-purple-500/20 blur-[120px]" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_35px_90px_rgba(0,0,0,.45)]">

          <img
            src="/PrideLogo3.jpg"
            alt="Hartford Pride Center"
            className="w-full object-cover"
          />

        </div>

      </motion.div>

    </motion.div>

  </div>

</section>
<div className="flex justify-center mb-3 gap-3 mt-8">

  <Link
    to="/contact"
    className="
      group
      flex-1
      max-w-[180px]

      flex items-center justify-center gap-2

      rounded-2xl

      px-4 py-3

      bg-gradient-to-r
      from-cyan-500
      via-sky-500
      to-blue-600

      border border-cyan-200/30

      shadow-[0_10px_30px_rgba(6,182,212,.35)]

      text-white
      font-black
      tracking-wide

      transition-all
      duration-300

      hover:scale-105
      hover:shadow-[0_20px_45px_rgba(6,182,212,.55)]
    "
  >
    <FaEnvelope className="text-lg group-hover:rotate-6 transition" />
    <span>Contact</span>
  </Link>

  <Link
    to="/donations"
    className="
      group
      flex-1
      max-w-[180px]

      flex items-center justify-center gap-2

      rounded-2xl

      px-4 py-3

      bg-gradient-to-r
      from-pink-500
      via-fuchsia-500
      to-rose-500

      border border-pink-200/30

      shadow-[0_10px_30px_rgba(236,72,153,.35)]

      text-white
      font-black
      tracking-wide

      transition-all
      duration-300

      hover:scale-105
      hover:shadow-[0_20px_45px_rgba(236,72,153,.55)]
    "
  >
    <FaHeart className="text-lg group-hover:scale-125 transition" />
    <span>Donate</span>
  </Link>

</div>
      </section>


      {/* TIERS GRID */}

      <section className="max-w-7xl mx-auto px-2  pb-20">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {SPONSOR_TIERS.map((tier) => {

            const details = tierDetails[tier];

            return (

              <motion.div
                key={tier}
                whileHover={{ y:-8 }}
                className="
                  bg-gradient-to-br from-purple-900 via-black to-indigo-900
                  border border-white
                  rounded-3xl
                  p-8
                  shadow-[0_0_30px_rgba(168,85,247,0.4)]
                  flex flex-col
                "
              >

                {/* TIER NAME */}

                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FaStar className="text-yellow-400"/>
                  {tier}
                </h3>


                {/* PRICING */}

                <div className="mb-6">

                  <p className="text-white/70 text-sm">
                    Monthly Support
                  </p>

                  <p className="text-2xl font-bold text-cyan-300">
                    {details.monthly}
                  </p>

                  <p className="text-white/70 text-sm mt-2">
                    One-Time Support
                  </p>

                  <p className="text-xl font-semibold text-purple-300">
                    {details.oneTime}
                  </p>

                </div>


                {/* PERKS */}

  <ul className="space-y-2 text-sm text-white/80 flex-grow mb-6">

  {details.perks.map((perk,i)=>(
    <li key={i}>
      • {perk}
    </li>
  ))}

</ul>


{/* SPONSOR BUTTONS */}

<div className="flex flex-col gap-3">

  {/* MONTHLY */}

{/* MONTHLY */}

<a
  href={tier === "Customized Tier" ? "#" : MONTHLY_LINKS[tier]}
  target={tier === "Customized Tier" ? undefined : "_blank"}
  rel="noopener noreferrer"

  onClick={(e) => {
    if (tier === "Customized Tier") {
      e.preventDefault();

      alert(
`Custom Sponsorship Plan

Recurring sponsorship links for custom tiers are created individually.

A custom payment link will be sent upon approval.

Please request a custom recurring sponsorship link through the Karaoverse contact page.`
      );
    }
  }}

  className="
    text-center
    px-4 py-2 rounded-xl
    bg-gradient-to-r from-cyan-400 to-blue-500
    text-black font-bold
    hover:scale-105 transition
  "
>
  Monthly Sponsor
</a>
  {/* ONE TIME */}

  <a
    href={ONE_TIME_LINK}
    target="_blank"
    rel="noopener noreferrer"

    className="
      text-center
      px-4 py-2 rounded-xl
      border border-purple-400
      text-purple-200 font-semibold
      hover:bg-purple-600/30 transition
    "
  >
    One-Time Support
  </a>

</div>



              </motion.div>

            );

          })}

        </div>

      </section>

<section
  className="
    relative mt-4
    z-10
    bg-gradient-to-br
    from-orange-600
    to-black
    text-gray-300
    py-4
    border-t-2
    border-pink-600
  "
>                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 divide-y divide-gray-700 lg:divide-y-0 lg:divide-x lg:divide-gray-700">
                  {/* Company Info */}
                  <div className="pr-0 lg:pr-6">
                    <h3 className="text-xl font-bold text-yellow-400 border-b-2 border-pink-400 text-center mb-2">
                      {" "}
                      - Karaoverse -<br /> The Entertainment Empire ©
                    </h3>
                    <p className="text-sm">
                      Connecting singers, DJs, venues, and artists across the United
                      States. Say NoMo to FoMo with Karaoverse!
                    </p>
                  </div>
      
                  {/* Quick Links */}
                <div className="pt-4 sm:pt-0 lg:px-6">
        <h4 className="text-lg font-semibold text-white mb-4">
          Explore Karaoverse
        </h4>
      
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
      
          {/* 🎯 EXPLORE */}
          <div>
            <h5 className="text-yellow-400 font-bold mb-2">Explore</h5>
            <ul className="space-y-1">
              <li><Link to="/artists" className="hover:text-yellow-400">Artists</Link></li>
              <li><Link to="/hosts" className="hover:text-yellow-400">Hosts</Link></li>
              <li><Link to="/venues" className="hover:text-yellow-400">Venues</Link></li>
              <li><Link to="/events" className="hover:text-yellow-400">Events</Link></li>
            </ul>
          </div>
      
          {/* 🎤 FOR CREATORS */}
          <div>
            <h5 className="text-yellow-400 font-bold mb-2">Creators</h5>
            <ul className="space-y-1">
              <li><Link to="/artist-tips" className="hover:text-yellow-400">Artist Guide</Link></li>
              <li><Link to="/host-tips" className="hover:text-yellow-400">DJ Guide</Link></li>
              <li><Link to="/venue-tips" className="hover:text-yellow-400">Venue Guide</Link></li>
              <li><Link to="/school-of-karaoke" className="hover:text-yellow-400">School of Karaoke</Link></li>
            </ul>
          </div>
      
          {/* 💰 OPPORTUNITIES */}
          <div>
            <h5 className="text-yellow-400 font-bold mb-2">Connect</h5>
            <ul className="space-y-1">
              <li><Link to="/job-postings" className="hover:text-yellow-400">Jobs</Link></li>
              <li><Link to="/From-drags-2-riches" className="hover:text-yellow-400">Marketplace</Link></li>
              <li><Link to="/bandmixer" className="hover:text-yellow-400">Band Mixer</Link></li>
      
            </ul>
          </div>
      
          {/* 🧠 PLATFORM */}
          <div>
            <h5 className="text-yellow-400 font-bold mb-2">Platform</h5>
            <ul className="space-y-1">
              <li><Link to="/about" className="hover:text-yellow-400">About</Link></li>
                              <li><Link to="/newsletters" className="hover:text-yellow-400">Newsletters</Link></li>
      
              <li><Link to="/partners" className="hover:text-yellow-400">Partners</Link></li>
              <li><Link to="/pridefestivals" className="hover:text-yellow-400">Pride Festivals</Link></li>
                      <li><Link to="/volunteer" className="hover:text-yellow-400">Volunteers</Link></li>
      
              <li><Link to="/updates" className="hover:text-yellow-400">Updates</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400">Contact</Link></li>
              <li><Link to="/donations" className="hover:text-yellow-400">Donations</Link></li>
                              <li><Link to="/feedback" className="hover:text-yellow-400">Feedback</Link></li>
      
            </ul>
          </div>
      
        </div>
      
        {/* 🎮 BONUS ROW */}
        <div className="mt-6 border-t border-white/10 pt-4 flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/supersinger" className="hover:text-yellow-400">
            🎤 Singers
          </Link>
          <Link to="/supergamers" className="hover:text-yellow-400">
            🎮 Gamers
          </Link>
          <Link to="/karao-match" className="hover:text-yellow-400">
            🌟 KaraoMatch
          </Link>
        </div>
      </div>
      
                  {/* Contact Info */}
                  <div className="pt-6 sm:pt-0 lg:pl-6">
                    <h4 className="text-lg font-semibold text-white mb-3">
                      Get in Touch
                    </h4>
                    <p className="text-sm">📍 United States</p>
                    <p className="text-sm">
                      📧{" "}
                      <a
                        href="mailto:karaoverse@gmail.com"
                        className="hover:text-pink-400 underline"
                      >
                        karaoverse@gmail.com
                      </a>
                    </p>
                    <div className="flex text-center items-center justify-center  space-x-4 mt-6 border-t-2 pt-2 border-pink-400">
                      <a
                        href="https://www.instagram.com/thekaraoverse/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-pink-400"
                      >
                        <FaInstagram className="text-2xl" />
                      </a>
                      <a
                        href="https://www.facebook.com/groups/549718571500039"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-pink-400"
                      >
                        <FaFacebook className="text-2xl" />
                      </a>
                      <a
                        href="mailto:karaoverse@gmail.com"
                        className="hover:text-pink-400"
                      >
                        <FaEnvelope className="text-2xl" />
                      </a>
                      <button
        onClick={handleShare}
        title="Share Hosts"
        className="
          hover:text-pink-400
          hover:scale-110
          transition
        "
      >
        <FaPaperPlane className="text-2xl" />
      </button>
                    </div>
                  </div>
                </div>
      
                {/* Bottom Bar */}
                <div className="mt-8 text-center neon-pulse text-xs text-gray-500">
                  <Link to="/privacy" className="hover:text-pink-400">
                    Privacy Policy
                  </Link>
                </div>
              </section>
    

    </div>
  );

}