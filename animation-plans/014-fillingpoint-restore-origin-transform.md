# 014 — Restore origin fill via circle + transform scale

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Physicality & origin / Performance
- **Estimated scope**: 1 file (`code-components/Kern_FillingPoint.tsx`)

## Problem

Fill uses `clipPath: circle(0%|150% at …)` + spring. Equivalent to appear-from-nothing, paints every frame, spring on clip-path feels broken; exit collapses to corner.

## Target

- Circle layer: `left/top` at locked `originX/Y`, `coverSize`, negative margins, `borderRadius: 50%`, `transformOrigin: 50% 50%`
- Animate only `scale` `0.001` ↔ `1` with shared `fillTransition`
- Deactivate: `filled: false` only — never rewrite origin
- No clip-path

## Steps

1. Restore `coverSize` on layers; measure from `getBoundingClientRect`.
2. Replace clip-path render with circle + scale.
3. Push + feel-check: enter bottom-right, leave, shrink to same point.

## Boundaries

- Do not reintroduce clip-path or motion `x`/`y` for fill positioning

## Verification

- Preview: retract into enter point; `typeErrors: []` on push
