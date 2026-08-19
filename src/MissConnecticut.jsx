/* ─────────────────────────────────────────────────────────────
   MISS CONNECTICUT — one past event.

   This file holds DATA ONLY. PastEvents.jsx does all the
   rendering, so every event you add here looks identical.

   To add another event: copy this file, change the values,
   then register it in the EVENTS array in PastEvents.jsx.
   ───────────────────────────────────────────────────────────── */

const missConnecticut = {
  /* unique key — lowercase, no spaces */
  id: "miss-connecticut",

  /* required */
  name: "Miss Connecticut Pride Pageant",

  /* "YYYY-MM-DD" gets formatted automatically.
     Any other string is printed as-is, e.g. "Summer 2025". */
  date: "2025-09-20",

  /* required — what the event supported */
  cause: "Benefiting the Driscoll Fund",

  /* optional */
  location: "Hartford, CT",
  blurb:
    "Replace this with a couple of sentences about the night — who performed, " +
    "who was crowned, what the room felt like, and what the community raised.",

  /* optional — pin a flag color. Omit to auto-rotate. */
  accent: "#750787",

  /* Images live in /public. Strings work too, but objects let you
     add alt text, which screen readers and search engines both use. */
 images: Array.from({ length: 60 }, (_, i) => ({
  src: `/past-events/Pic ${i + 1}.jpeg`,
  alt: `Event photo ${i + 1}`,
})),
};

export default missConnecticut;