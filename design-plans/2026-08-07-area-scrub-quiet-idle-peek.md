# Quiet idle — peek only on static canvas

Written against: `4aa0cbc`

## Evidence chain

- Surface: `code-components/AreaScrub.tsx` (Area Scrub Phase 2) · Home Stage instance `ngOPajbGj` · evidence PNG `design-plans/_evidence/2026-08-07-area-scrub-phase2-stage.png`
- Problem: Scrub crosshair + beacon render by default in live Preview, so idle reads as a stuck mock, not quiet Kern craft.
- Design evidence: `docs/superpowers/specs/2026-08-07-area-scrub-design.md` — Interaction **Idle**: “Quiet path; no idlePulse beacon (v1)”; Static table: “scrub UI hidden”; Lightdash referent shows scrub only under pointer.
- Owner: `AreaScrub` · props `showPeek`, `peekAt`, and `useIsStaticRenderer()` gate
- Scope and affected surfaces: All Area Scrub instances in project `iByGdsW6Rb9oE5M2Igua` (`codeFile/xRz37eJ`)
- Uncertainty: none — spec is explicit; canvas Assets still need a useful still (MetricSeal-style mid-state on static only)

## Design decision

Gate peek chrome so live idle is quiet: **no** crosshair/beacon unless actively scrubbing (phase 3) or an explicit buyer toggle. On **static renderer only**, allow peek so Canvas/Export Assets can show a mid-scrub still. Default `showPeek` to `false` for live; when `isStatic && showPeek`, render peek (buyer can enable Peek on canvas for Assets). Simpler deterministic rule that matches spec:

```text
showChrome = showPeek && isStatic
```

Live Preview with Peek on in the panel still stays quiet until phase 3 wires pointer scrub (panel Peek becomes “canvas still” only). Rename control title/description to “Canvas peek” so buyers are not confused.

Why: Removes the #1 visual “demo widget” signal before any motion work.

## Reuse

- Existing HTML peek overlay block in `AreaScrub.tsx` (crosshair + beacon) — keep markup, change visibility gate only
- Exemplar pattern: MetricSeal canvas mid-wipe still via `useIsStaticRenderer` (seal progress), not live idle animation
- Spec: `docs/superpowers/specs/2026-08-07-area-scrub-design.md`

No new primitive.

## Changes

1. `code-components/AreaScrub.tsx`
   - Change:
     - Destructure default: `showPeek = false`
     - Replace `void isStatic` with gate: compute `const showChrome = Boolean(showPeek && isStatic)`
     - In `peek` `useMemo`, require `showChrome` (or pass `showChrome` instead of `showPeek`) and keep `pts.length >= 2`
     - Render overlay only when `peek` non-null (unchanged)
     - `addPropertyControls`: `showPeek.defaultValue: false`; title `"Canvas Peek"`; description `"Mid-scrub still on Canvas/Export only (live idle stays quiet)"`
     - Keep `peekAt` / chrome color controls `hidden: (p) => !p.showPeek`
   - Preserve: path, fill, grid, data parse, HTML overlay structure, same layout tree for static/live
   - Verify: Preview idle = no crosshair/beacon; Canvas with Peek on = chrome at `peekAt`; Peek off = never chrome

2. Push + place
   - Change: `node scripts/framer/push-areascrub.mjs` then typecheck clean; if Home instance had Peek baked on, SET control off or rely on new default on fresh insert
   - Preserve: Stage frame layout
   - Verify: `node scripts/framer/verify.mjs` ok; optional screenshot Stage

## Scope

- Inherit: all Area Scrub instances after push
- Verify: Home `ngOPajbGj`
- Exclude: pointer scrub / draw-on (phase 3); glow; label; Home card chrome

## Validation

- Product: Live idle chart is quiet; Canvas can still show mid-scrub for Assets when Peek is on
- Interface: Preview idle; Canvas Peek on/off; Export/static path
- System: No second scrub chrome system; reuses existing overlay
- Repository: `node scripts/framer/push-areascrub.mjs` → `typeErrors: []`; `node scripts/framer/verify.mjs` → `ok: true`

## Stop conditions

- Stop if Framer panel cannot distinguish Canvas Peek from future live scrub toggle — then split into `canvasPeek` boolean instead of overloading `showPeek` (do not invent phase-3 scrub here).

## Design documentation

- After acceptance: note in spec Static/Idle row that Canvas Peek is static-only; optional one-line in `docs/superpowers/specs/2026-08-07-area-scrub-design.md` under Static table
