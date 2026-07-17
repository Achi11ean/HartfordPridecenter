/* ==================================================================
   prideTheme — one source of truth.

   The hero and the donations section had already drifted apart by two
   hex values (#0d0a1a vs #0b0817) that look identical in isolation and
   show a seam where the sections meet. Tokens live here now so that
   can't happen again: edit once, both sections follow.
   ================================================================== */

export const INK = "#0b0817";
export const SURFACE = "rgba(255, 255, 255, 0.035)"; // cards, chips — lets the comets through
export const SURFACE_SOLID = "#171128"; // sheets, logo frame — must be opaque
export const LINE = "rgba(255, 255, 255, 0.09)";
export const TEXT = "#f5f2fa";
export const MUTED = "rgba(238, 233, 248, 0.62)";

export const FONT_BODY = "'Inter', system-ui, -apple-system, sans-serif";
export const FONT_DISPLAY = "'Bricolage Grotesque', 'Inter', sans-serif";

/* The pride spectrum. The fund hues, the hero aurora, the identity
   dots, and the comet trails are all drawn from this one array. */
export const SPECTRUM = [
  "#FF6B6B",
  "#FFA94D",
  "#FFD43B",
  "#69DB7C",
  "#74C0FC",
  "#B197FC",
];

export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/* Config typos are the one bug class that costs real donations, so
   every URL is validated at render instead of trusted. Catches the
   string "null", stray whitespace, and anything non-https. */
export const safeLink = (value) => {
  if (typeof value !== "string") return null;
  const url = value.trim();
  return /^https:\/\/\S+$/i.test(url) ? url : null;
};