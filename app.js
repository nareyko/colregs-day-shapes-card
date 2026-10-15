import {
  DAY_SHAPES,
  DEFAULT_CARD_STATE,
  decodeCardHash,
  encodeCardHash,
  fairhelmCoursesUrl,
  fairhelmVhfUrl,
  pagesCanonicalUrl,
  renderShapeSvg,
} from "./shapes-model.mjs";
import { renderQrSvg } from "./qr-svg.mjs";
import { copyFor, LOCALES } from "./ui-copy.mjs";

const STORAGE_KEY = "fairhelm_colregs_day_shapes_card_v1";

const PRESETS = {
  sample: {
    vesselName: "SY AURORA",
    homeWaters: "Stockholm Archipelago",
  },
  blank: {
    vesselName: "",
    homeWaters: "",
  },
};

function detectInitialLang() {
  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get("lang");
  if (queryLang && LOCALES.includes(queryLang)) return queryLang;

  const hashDecoded = decodeCardHash(window.location.hash);
  if (hashDecoded.lang && LOCALES.includes(hashDecoded.lang)) return hashDecoded.lang;

  const navLang = (navigator.language || "en").slice(0, 2).toLowerCase();
  return LOCALES.includes(navLang) ? navLang : "en";
}

function loadInitialState() {
  if (window.location.hash && window.location.hash.length > 2) {
    const { state } = decodeCardHash(window.location.hash);
    return state;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CARD_STATE, ...parsed };
    }
  } catch {
    // Ignore storage errors in private/sandboxed frames
  }
  return { ...DEFAULT_CARD_STATE };
}

let currentLang = detectInitialLang();
let state = loadInitialState();

const el = (id) => document.getElementById(id);

function setText(id, text) {
  const node = el(id);
  if (node) node.textContent = text;
}

function syncInputsFromState() {
  el("in-vessel").value = state.vesselName;
  el("in-waters").value = state.homeWaters;
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

function readStateFromInputs() {
  state = {
    vesselName: el("in-vessel").value,
    homeWaters: el("in-waters").value,
  };
  persistState();
}

function renderShapesGrid() {
  const copy = copyFor(currentLang);
  const grid = el("shapes-grid");
  if (!grid) return;

  grid.innerHTML = "";
  for (const shape of DAY_SHAPES) {
    const localized = copy.shapes?.[shape.id] || {
      name: shape.nameEn,
      meaning: shape.meaningEn,
    };
    const cell = document.createElement("div");
    cell.className = "shape-cell";
    cell.innerHTML = `
      <div class="shape-svg">${renderShapeSvg(shape.svgKind)}</div>
      <div class="shape-rule mono">Rule ${shape.colregsRule}</div>
      <div class="shape-name">${localized.name}</div>
      <div class="shape-meaning">${localized.meaning}</div>
    `;
    grid.appendChild(cell);
  }
}

function renderLocaleCopy() {
  const copy = copyFor(currentLang);
  document.documentElement.lang = currentLang;
  document.documentElement.dir = copy.dir;

  const canonical = el("canonical-link");
  if (canonical) canonical.href = pagesCanonicalUrl();

  setText("ui-kicker", copy.kicker);
  setText("ui-title", copy.title);
  setText("ui-lede", copy.lede);
  setText("ui-privacy", copy.privacyNote);
  setText("ui-form-heading", copy.formHeading);
  setText("ui-presets-label", `${copy.presetsLabel}:`);

  setText("lbl-vessel", copy.vesselNameLabel);
  el("in-vessel").placeholder = copy.vesselNamePlaceholder;
  setText("lbl-waters", copy.homeWatersLabel);
  el("in-waters").placeholder = copy.homeWatersPlaceholder;

  setText("btn-print", copy.printBtn);
  setText("btn-print-bottom", copy.printBtn);
  setText("btn-night", copy.nightBtn);
  setText("btn-sample", copy.resetBtn);
  setText("btn-blank", copy.clearBtn);
  setText("btn-copy-link", copy.copyLinkBtn);

  setText("sheet-header-left", copy.sheetHeaderLeft);
  setText("sheet-header-right", copy.sheetHeaderRight);
  setText("lbl-id-vessel", copy.idVessel);
  setText("lbl-id-waters", copy.idWaters);
  setText("out-grid-title", copy.gridTitle);
  setText("out-checklist-title", copy.checklistTitle);
  setText("out-qr-title", copy.qrCtaTitle);
  setText("out-qr-body", copy.qrCtaBody);
  setText("out-fairhelm-credit", copy.fairhelmCredit);

  const checklist = el("out-checklist");
  if (checklist) {
    checklist.innerHTML = "";
    for (const item of copy.checklistItems) {
      const li = document.createElement("li");
      li.textContent = item;
      checklist.appendChild(li);
    }
  }

  const coursesUrl = fairhelmCoursesUrl(currentLang);
  const vhfUrl = fairhelmVhfUrl(currentLang);

  const creditCourses = el("credit-courses");
  if (creditCourses) {
    creditCourses.href = coursesUrl;
    creditCourses.textContent = `${copy.coursesLinkLabel} ↗`;
  }
  const creditVhf = el("credit-vhf");
  if (creditVhf) {
    creditVhf.href = vhfUrl;
    creditVhf.textContent = `${copy.vhfLinkLabel} ↗`;
  }

  const sheetCourses = el("sheet-courses-link");
  if (sheetCourses) {
    sheetCourses.href = coursesUrl;
    sheetCourses.textContent = coursesUrl.replace(/^https?:\/\//, "");
  }
  const sheetVhf = el("sheet-vhf-link");
  if (sheetVhf) {
    sheetVhf.href = vhfUrl;
    sheetVhf.textContent = vhfUrl.replace(/^https?:\/\//, "");
  }

  const qrContainer = el("qr-container");
  if (qrContainer) {
    qrContainer.innerHTML = renderQrSvg(coursesUrl, {
      label: `QR Code: ${coursesUrl}`,
    });
  }

  renderShapesGrid();
}

function renderSheetValues() {
  const vesselDisplay = state.vesselName.trim().toUpperCase() || "_______________";
  const watersDisplay = state.homeWaters.trim() || "_______________";

  setText("out-vessel-name", vesselDisplay);
  setText("out-waters", watersDisplay);
  setText("out-waters-badge", watersDisplay === "_______________" ? "—" : watersDisplay.toUpperCase());
}

function applyPreset(key) {
  state = { ...PRESETS[key] };
  syncInputsFromState();
  persistState();
  renderSheetValues();
}

function init() {
  const langSelect = el("lang-select");
  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener("change", () => {
      currentLang = langSelect.value;
      renderLocaleCopy();
      renderSheetValues();
    });
  }

  syncInputsFromState();
  renderLocaleCopy();
  renderSheetValues();

  const form = el("card-form");
  form.addEventListener("input", () => {
    readStateFromInputs();
    renderSheetValues();
  });

  el("btn-sample").addEventListener("click", () => applyPreset("sample"));
  el("btn-blank").addEventListener("click", () => applyPreset("blank"));

  const triggerPrint = () => window.print();
  el("btn-print").addEventListener("click", triggerPrint);
  el("btn-print-bottom").addEventListener("click", triggerPrint);

  const nightBtn = el("btn-night");
  nightBtn.addEventListener("click", () => {
    const active = document.body.classList.toggle("night-mode");
    nightBtn.setAttribute("aria-pressed", active ? "true" : "false");
  });

  el("btn-copy-link").addEventListener("click", async () => {
    const hash = encodeCardHash(state, currentLang);
    const shareUrl = `${window.location.origin}${window.location.pathname}${hash}`;
    window.history.replaceState(null, "", hash);
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Fallback: URL bar is already updated with hash
    }
    const status = el("copy-status");
    if (status) {
      status.textContent = copyFor(currentLang).linkCopied;
      status.hidden = false;
      setTimeout(() => {
        status.hidden = true;
      }, 3000);
    }
  });
}

init();
