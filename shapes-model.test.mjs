import assert from "node:assert/strict";
import test from "node:test";
import {
  DAY_SHAPES,
  DEFAULT_CARD_STATE,
  LOCALES as MODEL_LOCALES,
  decodeCardHash,
  encodeCardHash,
  fairhelmCoursesUrl,
  fairhelmVhfUrl,
  pagesCanonicalUrl,
  renderShapeSvg,
} from "./shapes-model.mjs";
import { renderQrSvg } from "./qr-svg.mjs";
import { copyFor, LOCALES } from "./ui-copy.mjs";

test("DAY_SHAPES catalogue has at least 9 shapes with required fields", () => {
  assert.ok(DAY_SHAPES.length >= 9);
  const ids = new Set();
  for (const shape of DAY_SHAPES) {
    assert.ok(shape.id && shape.id.length > 0, "shape.id required");
    assert.ok(shape.colregsRule, `colregsRule for ${shape.id}`);
    assert.ok(shape.svgKind, `svgKind for ${shape.id}`);
    assert.ok(shape.nameEn && shape.nameEn.length > 2, `nameEn for ${shape.id}`);
    assert.ok(shape.meaningEn && shape.meaningEn.length > 10, `meaningEn for ${shape.id}`);
    assert.ok(!ids.has(shape.id), `duplicate id ${shape.id}`);
    ids.add(shape.id);
  }
  for (const required of [
    "ball",
    "cone_down",
    "two_cones",
    "ball_diamond_ball",
    "two_balls",
    "three_balls",
    "cylinder",
    "diamond",
    "cone_up",
  ]) {
    assert.ok(ids.has(required), `missing shape ${required}`);
  }
});

test("renderShapeSvg returns non-empty SVG for every catalogue kind", () => {
  for (const shape of DAY_SHAPES) {
    const svg = renderShapeSvg(shape.svgKind);
    assert.ok(svg.startsWith("<svg"), `svg open for ${shape.id}`);
    assert.ok(svg.endsWith("</svg>"), `svg close for ${shape.id}`);
    assert.ok(svg.length > 80, `svg too short for ${shape.id}`);
    assert.ok(svg.includes("fill="), `fill missing for ${shape.id}`);
  }
  const unknown = renderShapeSvg("no_such_kind");
  assert.ok(unknown.startsWith("<svg"));
  assert.ok(unknown.length > 40);
});

test("encodeCardHash and decodeCardHash round-trip vessel, waters, and lang", () => {
  const custom = {
    vesselName: "SY BALTIC WIND",
    homeWaters: "Kiel Bight",
  };
  const hash = encodeCardHash(custom, "de");
  const decoded = decodeCardHash(hash);
  assert.equal(decoded.lang, "de");
  assert.equal(decoded.state.vesselName, "SY BALTIC WIND");
  assert.equal(decoded.state.homeWaters, "Kiel Bight");

  const empty = decodeCardHash("#");
  assert.equal(empty.state.vesselName, DEFAULT_CARD_STATE.vesselName);
  assert.equal(empty.state.homeWaters, DEFAULT_CARD_STATE.homeWaters);
});

test("FairHelm courses/VHF URLs exist for all 10 locales; Pages canonical is fixed", () => {
  assert.equal(MODEL_LOCALES.length, 10);
  assert.equal(LOCALES.length, 10);
  for (const lang of LOCALES) {
    assert.equal(fairhelmCoursesUrl(lang), `https://fairhelm.com/${lang}/courses/`);
    assert.equal(fairhelmVhfUrl(lang), `https://fairhelm.com/${lang}/free-vhf/`);
  }
  assert.equal(pagesCanonicalUrl(), "https://nareyko.github.io/colregs-day-shapes-card/");
  assert.equal(fairhelmCoursesUrl("xx"), "https://fairhelm.com/en/courses/");
});

test("ui-copy provides complete translations for all 10 FairHelm locales", () => {
  const required = [
    "dir",
    "langName",
    "title",
    "kicker",
    "lede",
    "privacyNote",
    "formHeading",
    "vesselNameLabel",
    "vesselNamePlaceholder",
    "homeWatersLabel",
    "homeWatersPlaceholder",
    "printBtn",
    "nightBtn",
    "resetBtn",
    "clearBtn",
    "copyLinkBtn",
    "linkCopied",
    "presetsLabel",
    "sheetHeaderLeft",
    "sheetHeaderRight",
    "idVessel",
    "idWaters",
    "gridTitle",
    "checklistTitle",
    "qrCtaTitle",
    "qrCtaBody",
    "fairhelmCredit",
    "coursesLinkLabel",
    "vhfLinkLabel",
  ];
  const shapeIds = DAY_SHAPES.map((s) => s.id);

  for (const lang of LOCALES) {
    const pack = copyFor(lang);
    for (const key of required) {
      assert.ok(pack[key] != null && String(pack[key]).length > 0, `missing ${key} for ${lang}`);
    }
    assert.ok(Array.isArray(pack.checklistItems), `checklistItems not array for ${lang}`);
    assert.equal(pack.checklistItems.length, 5, `checklistItems length for ${lang}`);
    assert.ok(pack.title.length > 5, `short title for ${lang}`);
    assert.ok(
      pack.qrCtaBody.includes(`fairhelm.com/${lang}/courses/`),
      `QR CTA courses URL mismatch for ${lang}`,
    );
    assert.ok(pack.shapes && typeof pack.shapes === "object", `shapes pack for ${lang}`);
    for (const id of shapeIds) {
      const entry = pack.shapes[id];
      assert.ok(entry, `shape ${id} missing for ${lang}`);
      assert.ok(entry.name && entry.name.length > 1, `shape name ${id} for ${lang}`);
      assert.ok(entry.meaning && entry.meaning.length > 5, `shape meaning ${id} for ${lang}`);
    }
    if (lang === "ar" || lang === "he") {
      assert.equal(pack.dir, "rtl", `RTL expected for ${lang}`);
    } else {
      assert.equal(pack.dir, "ltr", `LTR expected for ${lang}`);
    }
  }
});

test("renderQrSvg produces non-empty SVG for FairHelm courses URL", () => {
  const url = fairhelmCoursesUrl("en");
  const svg = renderQrSvg(url, { label: url });
  assert.ok(svg.startsWith("<svg"));
  assert.ok(svg.length > 200);
  assert.ok(svg.includes('shape-rendering="crispEdges"'));
  assert.ok(svg.endsWith("</svg>"));
});
