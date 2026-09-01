import React from "react";

/* ============================================================================
   1. IMAGE SLOTS — paste your image URLs (or imported assets) here.
   Any slot left as "" renders a labeled dashed placeholder box instead,
   so the layout stays intact while you gather assets.
   ============================================================================ */
const IMAGES = {
  prideLogo: "/PrideLogo3.jpg",          // Hartford Pride Center logo (footer)   ~ 150 x 60
  fundLogo: "/Driscoll2.jpg",           // The Driscoll Fund ribbon/heart logo   ~ 260 x 180

  heroPhoto1: "/photo1.jpeg",         // Portrait — man with backpack          ~ 800 x 1000
  heroPhoto2: "/photo2.jpeg",         // Two men outdoors                      ~ 800 x 1000
  heroPhoto3: "/photo3.jpeg",         // Two people at a table                 ~ 1000 x 800
  heroPhoto4: "/photo4.jpeg",         // Portrait — man, hand at chin          ~ 8００ x 1０００

  remembering: "/photo4.jpeg",        // Thomas Driscoll & partner             ~ 1000 x 1000
};

/* ============================================================================
   2. LINKS — swap these for your routes / anchors / external URLs.
   ============================================================================ */
const LINKS = {
  donate: "/support",
  rsvp: "https://checkout.square.site/merchant/MLQJ7Y1XPR6JD/checkout/7AFIF6HO5DSKNKFBPGOCIX7V?src=webqr",
  foundingPartner: "/contact",
  allBenefits: "#sponsorship-benefits",
  about: "/about",
  programs: "/services",
  getInvolved: "/contact",
  events: "/events",
  pride: "/pride",
  facebook: "https://www.facebook.com/HartfordPrideCenter",
  instagram: "https://www.instagram.com/hartfordpride/",
};

/* ============================================================================
   3. CONTENT
   ============================================================================ */
const HELP_ITEMS = [
  { icon: "pill", line1: "Prescription", line2: "Co-Pays" },
  { icon: "car", line1: "Transportation", line2: "to Appointments" },
  { icon: "labs", line1: "Required", line2: "Lab Work" },
  { icon: "hospital", line1: "Unexpected", line2: "Hospital Costs" },
  { icon: "groceries", line1: "Food &", line2: "Basic Needs" },
  { icon: "heart", line1: "Staying Connected", line2: "to Care" },
];

const TIERS = [
  {
    icon: "trophy",
    name: "Champion",
    price: "$5,000",
    blurb: "Premier visibility, table for 10, press recognition, gala tickets, and more.",
    theme: "champion",
  },
  {
    icon: "star",
    name: "Hero",
    price: "$1,500",
    blurb: "Table for 10, marketing recognition, website & social media visibility, and more.",
    theme: "hero",
  },
  {
    icon: "people",
    name: "Partner",
    price: "$500",
    blurb: "Table for 5, website & social media recognition.",
    theme: "partner",
  },
  {
    icon: "heart",
    name: "Supporter",
    price: "$250",
    blurb: "Two tickets to the event and social media recognition.",
    theme: "supporter",
  },
];

/* ============================================================================
   4. ICONS (inline SVG — no icon library needed)
   ============================================================================ */
const Icon = ({ name, size = 24, stroke = 1.6 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false",
  };

  switch (name) {
    case "pill":
      return (
        <svg {...common}>
          <rect x="1.6" y="8.4" width="14" height="7.2" rx="3.6" transform="rotate(-30 8.6 12)" />
          <path d="M6.2 8.1 11.4 15" />
          <circle cx="18" cy="17" r="4.4" />
          <path d="M15 20 21 14" />
        </svg>
      );
    case "car":
      return (
        <svg {...common}>
          <path d="M3 16v2.2a.8.8 0 0 0 .8.8h1.9a.8.8 0 0 0 .8-.8V16" />
          <path d="M17.5 16v2.2a.8.8 0 0 0 .8.8h1.9a.8.8 0 0 0 .8-.8V16" />
          <path d="M2.5 16v-3.4a2 2 0 0 1 .5-1.3l2.2-2.6A2 2 0 0 1 6.7 8h9.9a2 2 0 0 1 1.4.6l2.6 2.6a2 2 0 0 1 .6 1.4V16z" />
          <path d="M2.5 16h19" />
          <circle cx="6.6" cy="15.9" r="0.9" />
          <circle cx="17.4" cy="15.9" r="0.9" />
        </svg>
      );
    case "labs":
      return (
        <svg {...common}>
          <path d="M7 2.5v16a2.6 2.6 0 0 0 5.2 0v-16" />
          <path d="M6 2.5h7.2" />
          <path d="M7 10.5h5.2" />
          <path d="M15.4 2.5v16a2.6 2.6 0 0 0 5.2 0v-16" />
          <path d="M14.4 2.5h7.2" />
          <path d="M15.4 10.5h5.2" />
        </svg>
      );
    case "hospital":
      return (
        <svg {...common}>
          <path d="M4 21V6.4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1V21" />
          <path d="M2.5 21h19" />
          <path d="M12 2.4v3.1" />
          <path d="M10.4 3.9h3.2" />
          <path d="M9.4 9.6h5.2M12 7v5.2" />
          <path d="M7.4 15.4h2.2M14.4 15.4h2.2" />
          <path d="M10.3 21v-3.1h3.4V21" />
        </svg>
      );
    case "groceries":
      return (
        <svg {...common}>
          <path d="M5 8.4h14l-1 12.1a1 1 0 0 1-1 .9H7a1 1 0 0 1-1-.9z" />
          <path d="M5 8.4 6.8 5h10.4L19 8.4" />
          <path d="M8.4 5.2 8 2.6M12 5.2V2.4M15.6 5.2 16 2.6" />
          <path d="M9.6 12.2v3.6M14.4 12.2v3.6" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M12 20.6 4.2 13a4.8 4.8 0 0 1 0-6.9 4.9 4.9 0 0 1 6.9 0l.9.9.9-.9a4.9 4.9 0 0 1 6.9 0 4.8 4.8 0 0 1 0 6.9z" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...common}>
          <path d="M7.4 3.4h9.2v5.2a4.6 4.6 0 0 1-9.2 0z" />
          <path d="M7.4 4.8H4.6v1.6a3.2 3.2 0 0 0 3 3.2" />
          <path d="M16.6 4.8h2.8v1.6a3.2 3.2 0 0 1-3 3.2" />
          <path d="M12 13.2v3.4" />
          <path d="M8.6 20.6h6.8l-.7-4H9.3z" />
          <path d="M12 5.6l.6 1.3 1.4.2-1 1 .2 1.4-1.2-.7-1.2.7.2-1.4-1-1 1.4-.2z" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="M12 2.8 15 9l6.8 1-4.9 4.8 1.2 6.8L12 18.4 5.9 21.6 7.1 14.8 2.2 10 9 9z" />
        </svg>
      );
    case "people":
      return (
        <svg {...common}>
          <circle cx="8.6" cy="8.2" r="3.4" />
          <circle cx="16.6" cy="9.4" r="2.6" />
          <path d="M2.6 19.4a6 6 0 0 1 12 0" />
          <path d="M15.4 14.4a5.2 5.2 0 0 1 6 5" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 9.6h18" />
          <path d="M8 3v4M16 3v4" />
          <path d="M7.4 13.4h2M11 13.4h2M14.6 13.4h2M7.4 17h2M11 17h2" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9.2" />
          <path d="M12 6.6V12l3.6 2.2" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21.6s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
          <circle cx="12" cy="10.4" r="2.7" />
        </svg>
      );
    case "facebook":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6a21 21 0 0 0-2.4-.12c-2.4 0-4 1.46-4 4.14V9.9H7.6V13h2.7v8z" />
        </svg>
      );
    case "instagram":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M12 6.9a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2m0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6M18.5 6.7a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0M16.2 3.1H7.8A4.7 4.7 0 0 0 3.1 7.8v8.4a4.7 4.7 0 0 0 4.7 4.7h8.4a4.7 4.7 0 0 0 4.7-4.7V7.8a4.7 4.7 0 0 0-4.7-4.7m2.9 13.1a2.9 2.9 0 0 1-2.9 2.9H7.8a2.9 2.9 0 0 1-2.9-2.9V7.8a2.9 2.9 0 0 1 2.9-2.9h8.4a2.9 2.9 0 0 1 2.9 2.9z" />
        </svg>
      );
 
    default:
      return null;
  }
};

/* ============================================================================
   5. HELPERS
   ============================================================================ */

/** Renders an image, or a labeled dashed placeholder if the URL is empty. */
function Img({ src, alt, label, className = "", ratio }) {
  const style = ratio ? { aspectRatio: ratio } : undefined;
  if (src) {
    return <img src={src} alt={alt} className={className} style={style} loading="lazy" />;
  }
  return (
    <div className={"df-ph " + className} style={style} role="img" aria-label={label || alt}>
      <span>{label || alt}</span>
    </div>
  );
}

/** Decorative flowing ribbon — purely ornamental. */
const RIBBON_PATHS = Array.from({ length: 15 }, (_, i) => {
  const o = i * 11;
  return `M-60 ${300 + o * 0.35} C 90 ${120 + o} 230 ${350 - o * 0.5} 370 ${175 + o} S 570 ${70 + o} 700 ${150 + o * 1.15}`;
});

function Ribbon({ className = "", flip = false }) {
  return (
    <svg
      className={"df-ribbon " + className}
      viewBox="0 0 640 420"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {RIBBON_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#C8102E"
          strokeWidth={i % 3 === 0 ? 1.4 : 0.9}
          strokeOpacity={0.16 + (i % 5) * 0.07}
        />
      ))}
    </svg>
  );
}

/* ============================================================================
   6. PAGE
   ============================================================================ */
export default function DriscollFunds() {
  return (
    <div className="df">
      <style>{CSS}</style>

      <main>
        {/* ------------------------------------------------------------ HERO */}
        <section className="mt-10 df-hero">
          <Ribbon className="df-ribbon--hero" />
          <div className="df-container df-hero__grid">
            <div className="df-hero__copy">
              <div className="df-lockup">
                <Img
                  src={IMAGES.fundLogo}
                  alt="The Driscoll Fund"
                  label="Fund logo"
                  className="df-lockup__mark"
                />
                <p className="df-lockup__text">
                  Financial assistance
                  <br />
                  for people living with HIV
                </p>
              </div>

              <h1 className="df-hero__title">
                The Driscoll Fund
                <span>Launch Celebration</span>
              </h1>

              <p className="df-hero__lede">
                Connecticut&rsquo;s only privately funded, unrestricted HIV assistance fund.
              </p>
              <p className="df-hero__memorial">Named in memory of Thomas Driscoll.</p>

              <div className="df-actions">
                <a href={LINKS.foundingPartner} className="df-btn df-btn--solid">
                  Become a Founding Partner
                </a>
                <a href={LINKS.donate} className="df-btn df-btn--ghost">
                  Donate
                </a>
                <a href={LINKS.rsvp} className="df-btn df-btn--ghost">
                  RSVP
                </a>
              </div>
            </div>

            <div className="df-collage" aria-hidden={false}>
              <figure className="df-collage__item df-collage__item--a">
                <Img src={IMAGES.heroPhoto1} alt="A community member" label="Photo 1" ratio="4 / 5" />
              </figure>
              <figure className="df-collage__item df-collage__item--b">
                <Img src={IMAGES.heroPhoto2} alt="Thomas Driscoll with his partner" label="Photo 2" ratio="4 / 5" />
              </figure>
              <figure className="df-collage__item df-collage__item--c">
                <Img src={IMAGES.heroPhoto3} alt="Two people talking" label="Photo 3" ratio="5 / 4" />
              </figure>
              <figure className="df-collage__item df-collage__item--d">
                <Img src={IMAGES.heroPhoto4} alt="A community member" label="Photo 4" ratio="4 / 5" />
              </figure>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- EVENT OVERVIEW */}
<section className="df-overview" id="event">
  <Ribbon className="df-ribbon--overview" />

  <div className="df-container df-overview__grid">
    <div>
      <p className="df-eyebrow">
        An Evening of Community, Remembrance &amp; Hope
      </p>

      <h2 className="df-h2">Event Overview</h2>

      <p className="df-body">
        Join us as we come together to celebrate the launch of The Driscoll
        Fund&mdash;a lifeline for individuals living with HIV in Greater
        Hartford.
      </p>

      <p className="df-body">
        The evening will include cocktails, dinner, a special presentation
        honoring Thomas Driscoll&rsquo;s legacy, a fundraising appeal, live
        performances, and a VIP afterparty.
      </p>

      {/* Ticket CTA */}
      <div className="mt-7">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em]">
          Tickets Now Available · $25–$50
        </p>

<a
  href={LINKS.rsvp}
  target="_blank"
  rel="noopener noreferrer"
  className=" mt-2 df-ticket-btn"
>
  Buy Tickets Now
  <span aria-hidden="true">→</span>
</a>
  
      </div>
    </div>

    <div className="df-details">
      <div className="df-details__row">
        <span className="df-details__icon">
          <Icon name="calendar" size={26} />
        </span>
        <p>Friday, September 18, 2026</p>
      </div>

      <div className="df-details__row">
        <span className="df-details__icon">
          <Icon name="clock" size={26} />
        </span>
        <p>6:00 PM</p>
      </div>

      <div className="df-details__row">
        <span className="df-details__icon">
          <Icon name="pin" size={26} />
        </span>
        <p>
          Giuseppe&rsquo;s Place
          <br />
          124 Court Street
          <br />
          Middletown, CT 06457
        </p>
      </div>
    </div>
  </div>
</section>

        {/* ------------------------------------------------ HOW THE FUND HELPS */}
        <section className="df-helps">
          <div className="df-container">
            <h2 className="df-rulehead">
              <span>How the Fund Helps</span>
            </h2>
            <ul className="df-helps__grid">
              {HELP_ITEMS.map((item) => (
                <li key={item.line1 + item.line2} className="df-help">
                  <span className="df-help__icon">
                    <Icon name={item.icon} size={38} stroke={1.4} />
                  </span>
                  <p>
                    {item.line1}
                    <br />
                    {item.line2}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------ REMEMBERING */}
        <section className="df-remember">
          <Ribbon className="df-ribbon--remember" flip />
          <div className="df-container df-remember__grid">
            <figure className="df-remember__photo">
              <Img
                src={IMAGES.remembering}
                alt="Thomas Driscoll with his partner"
                label="Thomas Driscoll photo"
                ratio="1 / 1"
              />
            </figure>
            <div>
              <p className="df-eyebrow df-eyebrow--bold">Honoring a Legacy. Building a Lifeline.</p>
              <h2 className="df-h2">Remembering Thomas Driscoll</h2>
              <p className="df-body">
                Thomas Driscoll was a beloved teacher, veteran, partner, and community member whose life was cut short
                by complications from AIDS.
              </p>
              <p className="df-body">
                The Driscoll Fund carries forward his spirit of compassion and commitment by ensuring financial
                hardship never stands in the way of life-saving care.
              </p>
              <p className="df-body">
                100% of donations go directly to urgent needs like medication, transportation, housing stability, and
                basic human necessities.
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- SPONSORSHIPS */}
        <section className="df-sponsor" id="sponsorship-benefits">
          <div className="df-container">
            <p className="df-eyebrow df-eyebrow--center">Partner With Purpose</p>
            <h2 className="df-h2 df-h2--center">Sponsorship Opportunities</h2>
            <p className="df-sponsor__sub">
              Your support fuels hope, dignity, and health for our neighbors living with HIV.
            </p>

            <ul className="df-tiers">
              {TIERS.map((tier) => (
                <li key={tier.name} className={"df-tier df-tier--" + tier.theme}>
                  <span className="df-tier__icon">
                    <Icon name={tier.icon} size={34} stroke={1.4} />
                  </span>
                  <h3 className="df-tier__name">{tier.name}</h3>
                  <p className="df-tier__price">{tier.price}</p>
                  <p className="df-tier__blurb">{tier.blurb}</p>
                  <a href={LINKS.foundingPartner} className="df-tier__btn">
                    View details
                  </a>
                </li>
              ))}
            </ul>

            {/* <div className="df-sponsor__all">
              <a href={LINKS.allBenefits} className="df-btn df-btn--outline">
                View all sponsorship benefits
              </a>
            </div> */}
          </div>
        </section>

        {/* ----------------------------------------------------- IMPACT BAND */}
        <section className="df-impact">
          <div className="df-container df-impact__inner">
            <span className="df-impact__mark">
              <Icon name="heart" size={44} stroke={1.3} />
            </span>
            <div className="df-impact__copy">
              <h2>Every Gift Makes an Impact</h2>
              <p>
                Join us in creating a future where everyone living with HIV has the support they need to not just
                survive, but thrive.
              </p>
            </div>
            <div className="df-impact__actions">
              <a href={LINKS.foundingPartner} className="df-btn df-btn--white">
                Become a Partner
              </a>
              <a href={LINKS.donate} className="df-btn df-btn--white">
                Donate
              </a>
              <a href={LINKS.rsvp} className="df-btn df-btn--white">
                RSVP
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------- FOOTER */}
      <footer className="df-footer">
        <Ribbon className="df-ribbon--footer" />
        <div className="df-container df-footer__grid">
          <div>
            <Img
              src={IMAGES.prideLogo}
              alt="Hartford Pride Center"
              label="Logo"
              className="df-logo-img"
            />
            <p className="df-footer__tag">
              Advancing equity and opportunity
              <br />
              for LGBTQ+ people across Connecticut.
            </p>
          </div>

          <div>
            <h3 className="df-footer__head">Contact</h3>
            <address className="df-footer__body">
              30 Arbor Street, Suite 107
              <br />
              Hartford, CT 06106
              <br />
              <br />
              <a href="tel:+18607242423">(860) 724-2423</a>
              <br />
              <a href="mailto:info@hartfordpridecenter.org">info@hartfordpridecenter.org</a>
            </address>
          </div>

          <div>
            <h3 className="df-footer__head">Explore</h3>
            <ul className="df-footer__links">
              <li>
                <a href={LINKS.about}>About Us</a>
              </li>
              <li>
                <a href={LINKS.programs}>Programs &amp; Services</a>
              </li>
              <li>
                <a href={LINKS.getInvolved}>Get Involved</a>
              </li>
              <li>
                <a href={LINKS.events}>Events</a>
              </li>
              <li>
                <a href={LINKS.pride}>Pride</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="df-footer__head">Follow Us</h3>
            <div className="df-social">
              <a href={LINKS.facebook} aria-label="Facebook">
                <Icon name="facebook" size={18} />
              </a>
              <a href={LINKS.instagram} aria-label="Instagram">
                <Icon name="instagram" size={18} />
              </a>
      
            </div>
            <p className="df-footer__copy">
              &copy; {new Date().getFullYear()} Hartford Pride Center
              <br />
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================================
   7. STYLES — scoped under .df so nothing leaks into the rest of the site.
   ============================================================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

.df {
  --red: #C8102E;
  --red-dark: #A20D25;
  --gold: #B8912B;
  --gray: #7A7A7A;
  --maroon: #6E1B24;
  --ink: #141414;
  --body: #4C4C4C;
  --line: #E4E4E4;
  --tint: #F1F1F1;

  --serif: 'Playfair Display', 'Iowan Old Style', Georgia, serif;
  --sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;

  font-family: var(--sans);
  color: var(--body);
  background: #fff;
  -webkit-font-smoothing: antialiased;
}

/* Resets use :where() so they carry zero specificity and never outrank
   the component classes below. */
.df *, .df *::before, .df *::after { box-sizing: border-box; }
.df :where(p, h1, h2, h3, ul, figure, address) { margin: 0; }
.df :where(ul) { list-style: none; padding: 0; }
.df :where(img) { display: block; width: 100%; height: auto; object-fit: cover; }
.df :where(a) { color: inherit; text-decoration: none; }
.df a:focus-visible, .df button:focus-visible {
  outline: 2px solid var(--red);
  outline-offset: 3px;
  border-radius: 2px;
}

.df-container {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px;
}

/* --- image placeholder --- */
.df-ph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 60px;
  padding: 12px;
  text-align: center;
  background: repeating-linear-gradient(45deg, #fafafa, #fafafa 10px, #f2f2f2 10px, #f2f2f2 20px);
  border: 1px dashed #c9c9c9;
  border-radius: 4px;
  color: #9a9a9a;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* --- decorative ribbon --- */
.df-ribbon {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}

/* --- buttons --- */
.df-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 13px 26px;
  border-radius: 4px;
  border: 1px solid transparent;
  font-family: var(--sans);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  line-height: 1;
  cursor: pointer;
  transition: background-color .18s ease, color .18s ease, border-color .18s ease;
}
.df-btn--solid { background: var(--red); color: #fff; }
.df-btn--solid:hover { background: var(--red-dark); }
.df-btn--ghost { background: #fff; color: var(--red); border-color: var(--red); }
.df-btn--ghost:hover { background: var(--red); color: #fff; }
.df-btn--outline { background: #fff; color: var(--red); border-color: var(--red); padding: 12px 22px; font-size: 11.5px; }
.df-btn--outline:hover { background: var(--red); color: #fff; }
.df-btn--white { background: #fff; color: var(--red); }
.df-btn--white:hover { background: #ffe9ec; }

/* --- shared type --- */
.df-h2 {
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(30px, 4.2vw, 40px);
  line-height: 1.15;
  color: var(--ink);
  margin-bottom: 22px;
}
.df-h2--center { text-align: center; }
.df-eyebrow {
  color: var(--red);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.df-eyebrow--bold { font-weight: 700; letter-spacing: 0.1em; }
.df-eyebrow--center { text-align: center; }
.df-body {
  font-size: 14.5px;
  line-height: 1.75;
  margin-bottom: 16px;
  max-width: 56ch;
}
.df-body:last-child { margin-bottom: 0; }

.df-ticket-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 999px;
  background: var(--red);
  color: #fff !important;
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(200, 16, 46, 0.2);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.df-ticket-btn:hover {
  background: var(--red-dark);
  color: #fff !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(200, 16, 46, 0.28);
}
/* -------------------------------------------------------------------- HERO */
.df-hero {
  position: relative;
  overflow: hidden;
  padding: 62px 0 70px;
  background: linear-gradient(180deg, #FBFAFA 0%, #FFFFFF 70%);
}
.df-ribbon--hero { top: 0; right: -6%; width: 72%; height: 100%; }
.df-hero__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 1fr);
  gap: 48px;
  align-items: center;
}
.df-lockup { display: flex; align-items: center; gap: 16px; margin-bottom: 26px; }
.df-lockup__mark { width: 150px; height: auto; max-height: 108px; object-fit: contain; }
.df-lockup__mark.df-ph { height: 92px; }
.df-lockup__text {
  padding-left: 16px;
  border-left: 2px solid var(--ink);
  font-size: 13.5px;
  line-height: 1.5;
  color: #2B2B2B;
}
.df-hero__title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(40px, 6.2vw, 62px);
  line-height: 1.07;
  color: var(--ink);
  letter-spacing: -0.01em;
}
.df-hero__title span { display: block; color: var(--red); }
.df-hero__lede {
  margin: 22px 0 8px;
  font-size: 16.5px;
  line-height: 1.55;
  color: #2B2B2B;
  max-width: 30ch;
}
.df-hero__memorial { font-size: 14.5px; font-style: italic; color: #5A5A5A; }
.df-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }

/* collage */
.df-collage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}
.df-collage__item {
  border: 6px solid #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 26px rgba(0,0,0,.16);
  background: #fff;
}
.df-collage__item .df-ph { border: 0; border-radius: 0; }
.df-collage__item img { filter: grayscale(1) contrast(1.03); }
.df-collage__item--a { transform: translateY(44px) rotate(-1.2deg); }
.df-collage__item--b { transform: translateY(-16px) rotate(1.4deg); }
.df-collage__item--c { transform: translateY(20px) rotate(1deg); }
.df-collage__item--d { transform: translateY(-6px) rotate(-1deg); }

/* ---------------------------------------------------------- EVENT OVERVIEW */
.df-overview {
  position: relative;
  overflow: hidden;
  background: var(--tint);
  padding: 60px 0 64px;
}
.df-ribbon--overview { top: -10%; right: -14%; width: 46%; height: 130%; }
.df-overview__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr);
  gap: 56px;
  align-items: start;
}
.df-details {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 26px rgba(0,0,0,.07);
  padding: 6px 30px;
}
.df-details__row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 0;
  border-bottom: 1px solid var(--line);
}
.df-details__row:last-child { border-bottom: 0; }
.df-details__icon { color: var(--red); flex: none; display: flex; }
.df-details__row p { font-size: 14.5px; line-height: 1.6; color: #2B2B2B; }

/* -------------------------------------------------------- HOW THE FUND HELPS */
.df-helps { padding: 58px 0 62px; }
.df-rulehead {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  margin-bottom: 30px;
}
.df-rulehead span {
  font-family: var(--serif);
  font-size: clamp(20px, 2.6vw, 25px);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink);
  text-align: center;
}
.df-rulehead::before, .df-rulehead::after {
  content: "";
  height: 1px;
  width: clamp(24px, 12vw, 130px);
  background: var(--red);
  flex: none;
}
.df-helps__grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;
}
.df-help {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  min-height: 148px;
  padding: 22px 12px 20px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #fff;
  text-align: center;
  transition: box-shadow .2s ease, transform .2s ease;
}
.df-help:hover { box-shadow: 0 8px 20px rgba(0,0,0,.07); transform: translateY(-2px); }
.df-help__icon { color: var(--red); display: flex; }
.df-help p { font-size: 13px; font-weight: 600; line-height: 1.4; color: #2B2B2B; }

/* -------------------------------------------------------------- REMEMBERING */
.df-remember { position: relative; overflow: hidden; padding: 34px 0 62px; }
.df-ribbon--remember { top: 0; left: -18%; width: 48%; height: 100%; }
.df-remember__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, .82fr) minmax(0, 1.18fr);
  gap: 46px;
  align-items: center;
}
.df-remember__photo {
  border: 7px solid #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0,0,0,.17);
}
.df-remember__photo img { filter: grayscale(1) contrast(1.03); }
.df-remember__photo .df-ph { border: 0; border-radius: 0; }

/* ------------------------------------------------------------- SPONSORSHIPS */
.df-sponsor { background: var(--tint); padding: 52px 0 58px; }
.df-sponsor .df-h2 { margin-bottom: 10px; }
.df-sponsor__sub {
  text-align: center;
  font-size: 14px;
  color: #4C4C4C;
  margin-bottom: 32px;
}
.df-tiers {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}
.df-tier {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 26px 22px 24px;
  background: #fff;
  border: 1px solid #E8E8E8;
  border-radius: 6px;
  text-align: center;
}
.df-tier--champion { --tone: var(--red); }
.df-tier--hero     { --tone: var(--gold); }
.df-tier--partner  { --tone: var(--gray); }
.df-tier--supporter{ --tone: var(--maroon); }
.df-tier__icon { color: var(--tone); display: flex; }
.df-tier__name {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 19px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--tone);
}
.df-tier__price {
  font-family: var(--serif);
  font-size: 29px;
  font-weight: 500;
  color: var(--tone);
  line-height: 1;
}
.df-tier__blurb {
  font-size: 12.5px;
  line-height: 1.55;
  color: #5A5A5A;
  margin-bottom: 6px;
  flex: 1 1 auto;
}
.df-tier__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 200px;
  padding: 10px 14px;
  border-radius: 3px;
  background: var(--tone);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: filter .18s ease;
}
.df-tier__btn:hover { filter: brightness(.88); }
.df-sponsor__all { display: flex; justify-content: center; margin-top: 26px; }

/* --------------------------------------------------------------- IMPACT BAND */
.df-impact { background: var(--red); color: #fff; padding: 26px 0; }
.df-impact__inner {
  display: flex;
  align-items: center;
  gap: 26px;
  flex-wrap: wrap;
}
.df-impact__mark { flex: none; display: flex; opacity: .95; }
.df-impact__copy { flex: 1 1 320px; }
.df-impact__copy h2 {
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(22px, 3vw, 27px);
  margin-bottom: 5px;
}
.df-impact__copy p { font-size: 13.5px; line-height: 1.55; max-width: 46ch; opacity: .95; }
.df-impact__actions { display: flex; flex-wrap: wrap; gap: 12px; margin-left: auto; }
.df-impact__actions .df-btn { padding: 12px 22px; font-size: 11.5px; }

/* -------------------------------------------------------------------- FOOTER */
.df-footer { position: relative; overflow: hidden; padding: 44px 0 34px; background: #fff; }
.df-ribbon--footer { bottom: -40%; right: -10%; width: 44%; height: 160%; }
.df-footer__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr;
  gap: 34px;
}
.df-footer__tag { margin-top: 14px; font-size: 12.5px; line-height: 1.65; color: #5A5A5A; }
.df-footer__head {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #8A8A8A;
  margin-bottom: 14px;
}
.df-footer__body, .df-footer__links {
  font-size: 13px;
  line-height: 1.75;
  color: #3D3D3D;
  font-style: normal;
}
.df-footer__body a:hover, .df-footer__links a:hover { color: var(--red); }
.df-social { display: flex; gap: 10px; margin-bottom: 18px; }
.df-social a {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--ink);
  color: #fff;
  transition: background-color .18s ease;
}
.df-social a:hover { background: var(--red); }
.df-footer__copy { font-size: 11.5px; line-height: 1.7; color: #7A7A7A; }

/* ==================================================================
   RESPONSIVE
   ================================================================== */
@media (max-width: 960px) {
  .df-hero { padding: 44px 0 54px; }
  .df-hero__grid { grid-template-columns: 1fr; gap: 40px; }
  .df-hero__lede { max-width: 46ch; }

  .df-overview__grid { grid-template-columns: 1fr; gap: 32px; }
  .df-details { padding: 4px 24px; }

  .df-helps__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }

  .df-remember__grid { grid-template-columns: 1fr; gap: 30px; }
  .df-remember__photo { max-width: 460px; }

  .df-tiers { grid-template-columns: repeat(2, minmax(0, 1fr)); }

  .df-impact__inner { gap: 20px; }
  .df-impact__actions { margin-left: 0; width: 100%; }
  .df-impact__actions .df-btn { flex: 1 1 150px; }

  .df-footer__grid { grid-template-columns: 1fr 1fr; gap: 30px; }
}

@media (max-width: 620px) {
  .df-container { padding: 0 18px; }

  .df-lockup { flex-direction: column; align-items: flex-start; gap: 14px; }
  .df-lockup__mark { width: 130px; }
  .df-lockup__text { padding-left: 14px; }

  .df-actions .df-btn { flex: 1 1 100%; }

  .df-collage { gap: 12px; }
  .df-collage__item--a, .df-collage__item--b,
  .df-collage__item--c, .df-collage__item--d { transform: none; }
  .df-collage__item { border-width: 4px; }

  .df-helps { padding: 44px 0; }
  .df-helps__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .df-rulehead { gap: 12px; }

  .df-tiers { grid-template-columns: 1fr; }
  .df-tier { padding: 24px 20px; }

  .df-impact { padding: 30px 0; }
  .df-impact__inner { flex-direction: column; align-items: flex-start; }
  .df-impact__actions .df-btn { flex: 1 1 100%; }

  .df-footer__grid { grid-template-columns: 1fr; gap: 28px; }
}

@media (prefers-reduced-motion: reduce) {
  .df *, .df *::before, .df *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
  .df-help:hover { transform: none; }
}
`;