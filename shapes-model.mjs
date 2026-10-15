/**
 * Pure domain model for the COLREGS Day Shapes Cockpit Reference Card.
 * Black day-shape silhouettes for recreational sailors (Rules 24–30).
 */

export const LOCALES = Object.freeze([
  "en",
  "de",
  "pl",
  "ru",
  "es",
  "sv",
  "uk",
  "ar",
  "zh",
  "he",
]);

/**
 * SSOT catalogue of main COLREGS day shapes for coastal / recreational use.
 * EN labels here are fallbacks; UI packs localize name + meaning.
 */
export const DAY_SHAPES = Object.freeze([
  {
    id: "ball",
    colregsRule: "30",
    svgKind: "ball",
    nameEn: "At anchor",
    meaningEn: "One black ball — vessel at anchor (Rule 30).",
  },
  {
    id: "cone_down",
    colregsRule: "25",
    svgKind: "cone_down",
    nameEn: "Motorsailing",
    meaningEn: "Cone apex downward — sailing vessel under power (Rule 25).",
  },
  {
    id: "two_cones",
    colregsRule: "26",
    svgKind: "two_cones",
    nameEn: "Fishing",
    meaningEn: "Two cones with apexes together — vessel engaged in fishing (Rule 26).",
  },
  {
    id: "ball_diamond_ball",
    colregsRule: "27",
    svgKind: "ball_diamond_ball",
    nameEn: "Restricted ability to manoeuvre (RAM)",
    meaningEn: "Ball · diamond · ball — restricted in ability to manoeuvre (Rule 27).",
  },
  {
    id: "two_balls",
    colregsRule: "27",
    svgKind: "two_balls",
    nameEn: "Not under command (NUC)",
    meaningEn: "Two black balls in a vertical line — not under command (Rule 27).",
  },
  {
    id: "three_balls",
    colregsRule: "30",
    svgKind: "three_balls",
    nameEn: "Aground",
    meaningEn: "Three black balls in a vertical line — vessel aground (Rule 30).",
  },
  {
    id: "cylinder",
    colregsRule: "28",
    svgKind: "cylinder",
    nameEn: "Constrained by draught",
    meaningEn: "Black cylinder — vessel constrained by her draught (Rule 28).",
  },
  {
    id: "diamond",
    colregsRule: "24",
    svgKind: "diamond",
    nameEn: "Towing (long tow)",
    meaningEn:
      "Black diamond — towing with tow length > 200 m (Rule 24). Minesweeping also displays a diamond.",
  },
  {
    id: "cone_up",
    colregsRule: "26",
    svgKind: "cone_up",
    nameEn: "Fishing gear outboard",
    meaningEn:
      "Cone apex upward — fishing gear extending more than 150 m in that direction (Rule 26).",
  },
]);

export const DEFAULT_CARD_STATE = Object.freeze({
  vesselName: "SY AURORA",
  homeWaters: "Stockholm Archipelago",
});

const SVG_OPEN =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" role="img" aria-hidden="true">';
const SVG_CLOSE = "</svg>";

function conePoints(cx, topY, baseY, halfW, up) {
  if (up) {
    return `${cx},${topY} ${cx - halfW},${baseY} ${cx + halfW},${baseY}`;
  }
  return `${cx},${baseY} ${cx - halfW},${topY} ${cx + halfW},${topY}`;
}

/**
 * Inline SVG markup: black silhouettes on transparent (sheet is white).
 * @param {string} kind
 * @returns {string}
 */
export function renderShapeSvg(kind) {
  const fill = '#0b1726';
  let body = "";

  switch (kind) {
    case "ball":
      body = `<circle cx="40" cy="40" r="18" fill="${fill}"/>`;
      break;
    case "cone_down":
      body = `<polygon points="${conePoints(40, 18, 62, 20, false)}" fill="${fill}"/>`;
      break;
    case "cone_up":
      body = `<polygon points="${conePoints(40, 18, 62, 20, true)}" fill="${fill}"/>`;
      break;
    case "two_cones":
      // Apexes together at mid-height (hourglass / fishing signal).
      body = [
        `<polygon points="${conePoints(40, 14, 40, 18, false)}" fill="${fill}"/>`,
        `<polygon points="${conePoints(40, 40, 66, 18, true)}" fill="${fill}"/>`,
      ].join("");
      break;
    case "diamond":
      body = `<polygon points="40,14 58,40 40,66 22,40" fill="${fill}"/>`;
      break;
    case "cylinder":
      body = [
        `<rect x="26" y="18" width="28" height="44" rx="14" ry="14" fill="${fill}"/>`,
      ].join("");
      break;
    case "two_balls":
      body = [
        `<circle cx="40" cy="26" r="12" fill="${fill}"/>`,
        `<circle cx="40" cy="54" r="12" fill="${fill}"/>`,
      ].join("");
      break;
    case "three_balls":
      body = [
        `<circle cx="40" cy="16" r="9" fill="${fill}"/>`,
        `<circle cx="40" cy="40" r="9" fill="${fill}"/>`,
        `<circle cx="40" cy="64" r="9" fill="${fill}"/>`,
      ].join("");
      break;
    case "ball_diamond_ball":
      body = [
        `<circle cx="40" cy="14" r="8" fill="${fill}"/>`,
        `<polygon points="40,26 52,40 40,54 28,40" fill="${fill}"/>`,
        `<circle cx="40" cy="66" r="8" fill="${fill}"/>`,
      ].join("");
      break;
    default:
      body = `<text x="40" y="44" text-anchor="middle" font-size="10" fill="${fill}">?</text>`;
  }

  return `${SVG_OPEN}${body}${SVG_CLOSE}`;
}

function localeCode(lang) {
  return LOCALES.includes(lang) ? lang : "en";
}

/**
 * FairHelm courses door for a locale.
 * @param {string} lang
 * @returns {string}
 */
export function fairhelmCoursesUrl(lang = "en") {
  return `https://fairhelm.com/${localeCode(lang)}/courses/`;
}

/**
 * FairHelm Free VHF simulator door for a locale.
 * @param {string} lang
 * @returns {string}
 */
export function fairhelmVhfUrl(lang = "en") {
  return `https://fairhelm.com/${localeCode(lang)}/free-vhf/`;
}

/**
 * GitHub Pages canonical URL for this tool.
 * @returns {string}
 */
export function pagesCanonicalUrl() {
  return "https://nareyko.github.io/colregs-day-shapes-card/";
}

/**
 * Serialize card state into a compact URL hash for bookmark / share (no server).
 * @param {Partial<typeof DEFAULT_CARD_STATE>} state
 * @param {string} [lang]
 * @returns {string}
 */
export function encodeCardHash(state, lang = "en") {
  const params = new URLSearchParams();
  if (lang && lang !== "en") params.set("lang", lang);
  if (state.vesselName != null) params.set("v", String(state.vesselName).trim());
  if (state.homeWaters != null) params.set("w", String(state.homeWaters).trim());
  return `#${params.toString()}`;
}

/**
 * Parse a URL hash back into card state.
 * @param {string} hash
 * @returns {{ state: typeof DEFAULT_CARD_STATE, lang: string | null }}
 */
export function decodeCardHash(hash) {
  const raw = String(hash || "").replace(/^#/, "");
  const params = new URLSearchParams(raw);
  const hasAny = params.has("v") || params.has("w");

  if (!hasAny) {
    return {
      state: { ...DEFAULT_CARD_STATE },
      lang: params.get("lang") || null,
    };
  }

  return {
    state: {
      vesselName: params.get("v") ?? "",
      homeWaters: params.get("w") ?? "",
    },
    lang: params.get("lang") || null,
  };
}
