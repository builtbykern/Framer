# Area Scrub Implementation Plan

> **For agentic workers:** Marketplace mode — **one phase per turn**. Spec: `docs/superpowers/specs/2026-08-07-area-scrub-design.md`. After each phase: push → typecheck → `verify.mjs` if on canvas → stop.

**Goal:** Ship BuiltByKern **Area Scrub** — single-gesture area chart (CSV data → monotone path → draw-on → pointer scrub) in Framer project `iByGdsW6Rb9oE5M2Igua`.

**Architecture:** One file `code-components/AreaScrub.tsx`. Pure SVG + Framer Motion. Parse CSV → normalize → monotone cubic stroke/fill. Viewport draw-on once; pointer scrub with spring X + path Y; optional label. Static = same tree, fully drawn, scrub off.

**Tech Stack:** React, `framer` (`useIsStaticRenderer`, property controls), `framer-motion` (`useInView`, springs). Zero other deps.

## Global Constraints

- Single file, named `function` default export; no `defaultProps`
- Imports: `react`, `react-dom`, `framer`, `framer-motion` only
- Root `position: relative`; never `fixed` / body portal
- `useIsStaticRenderer()` + layout-identical freeze (prefer plain SVG early-return if AST requires)
- No `role="application"`; region/img + `aria-label`
- Positioning: scrub craft for hero/bento — not ChartJS toolkit
- No publish without user OK
- Sandbox: https://framer.com/projects/Tasty-Usage--iByGdsW6Rb9oE5M2Igua-407t8

---

### Task 1 — Phase 1: Structure / layout

**Files:**
- Create: `code-components/AreaScrub.tsx`
- Create: `scripts/framer/push-areascrub.mjs` (push helper)
- Spec: `docs/superpowers/specs/2026-08-07-area-scrub-design.md`

**Interfaces:**
- Produces: `AreaScrub` default export; `parseData(csv: string): number[]`; path builders used by later phases

- [ ] Write `AreaScrub.tsx`: root shell, viewBox SVG, demo CSV → points → monotone cubic stroke + closed fill, optional vertical grid, annotations, typed props, minimal controls (Data + Look), `useIsStaticRenderer` same tree (path fully drawn; no scrub/draw-on yet)
- [ ] Push via `createCodeFile` / `setFileContent`; typecheck
- [ ] Place instance on Home if empty; `verify.mjs`
- [ ] Stop — report Phase 1 done; await Phase 2

### Task 2 — Phase 2: Visual

- [ ] Tune stroke/fill gradient, beacon/crosshair chrome (visible styles, still non-interactive or static-positioned), Lightdash-clean defaults
- [ ] Push + verify; stop

### Task 3 — Phase 3: Logic / interaction

- [ ] `useInView` draw-on once; pointer scrub springs; label toggle; reduced-motion + static freeze
- [ ] Push + verify; stop

### Task 4 — Phase 4: Refine

- [ ] Full controls polish, a11y, edge cases, Home demo, listing prep later
- [ ] Push + verify; stop

## Success

Demo scrub sells in 3–5s; CSV paste works; passes static check; clearly not a multi-chart toolkit.
