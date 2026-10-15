# COLREGS Day Shapes Cockpit Card (A4 Lamination)

Open-source, zero-dependency, 100% client-side generator for an **A4 COLREGS day-shapes reference card**: the main black day signals recreational sailors meet under way and at anchor — ready to print, laminate, and mount by the chart table or companionway.

- **GitHub Pages:** [**nareyko.github.io/colregs-day-shapes-card/**](https://nareyko.github.io/colregs-day-shapes-card/)
- **FairHelm Courses:** [**fairhelm.com/en/courses/**](https://fairhelm.com/en/courses/)
- **Free VHF & DSC Simulator:** [**fairhelm.com/en/free-vhf/**](https://fairhelm.com/en/free-vhf/)

**FairHelm embed:** [**fairhelm.com/en/free-vhf/day-shapes/**](https://fairhelm.com/en/free-vhf/day-shapes/) (vendor sync from this repo).

---

## FairHelm Open-Source Seamanship Suite

Sister tools:

- [**mayday-card**](https://github.com/nareyko/mayday-card) — ITU / GMDSS MAYDAY · PAN-PAN · DSC distress cockpit card
- [**anchor-scope-card**](https://github.com/nareyko/anchor-scope-card) — anchor scope / rode length / swing circle card
- [**sea-lights**](https://github.com/nareyko/sea-lights) — interactive OpenSeaMap / Shom light sectors chart

**Phase B:** FairHelm site embed of this card is planned later; this repo ships as a standalone GitHub Pages app first.

---

## What It Shows

A 3×3 visual grid of the main COLREGS day shapes (Rules 24–30) used by coastal and recreational crews:

| Shape | Meaning (short) | Rule |
|-------|-----------------|------|
| Ball | At anchor | 30 |
| Cone apex down | Sailing vessel under power (motorsailing) | 25 |
| Two cones apexes together | Fishing | 26 |
| Ball · diamond · ball | Restricted in ability to manoeuvre (RAM) | 27 |
| Two balls | Not under command (NUC) | 27 |
| Three balls | Aground | 30 |
| Cylinder | Constrained by draught | 28 |
| Diamond | Towing with tow > 200 m (also used in minesweeping) | 24 |
| Cone apex up | Fishing gear extending > 150 m that way | 26 |

Optional vessel name and home waters print on the sheet (same pattern as mayday / anchor cards). Ten locales: en, de, pl, ru, es, sv, uk, ar, zh, he.

Privacy: pure ES modules (`shapes-model.mjs`, `qr-svg.mjs`, `ui-copy.mjs`). No vessel data leaves the browser. Shareable state uses a URL hash + optional `localStorage` key `fairhelm_colregs_day_shapes_card_v1`.

---

## Running Locally & Tests

No build step or npm dependencies required:

```bash
# Unit tests (Node.js 20+ built-in test runner)
npm test
# or: node --test shapes-model.test.mjs

# Serve locally with any static HTTP server
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## License

MIT © [FairHelm](https://fairhelm.com)
