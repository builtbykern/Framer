# Solid hairline edge feather (exit ring)

Written against: `4aa0cbc`

## Evidence chain

- Surface: `Kern_FillingPoint` Solid fill on leave
- Problem: Mirrored late opacity fade re-exposes a hard disk perimeter
- Design evidence: SOTD enter↔exit mirror kept; Soft checklist + prior user “círculos marcados”
- Owner: Solid layer `background` in `code-components/Kern_FillingPoint.tsx`
- Scope: Solid path only; opacity mirror unchanged
- Uncertainty: feather must stay invisible at rest (≤~6% of radius)

## Design decision

Keep opacity mirror. Soften Solid perimeter with a hairline radial feather (opaque to ~94%, transparent by 100%) — not Soft wash.

## Changes

1. `code-components/Kern_FillingPoint.tsx` — add `solidBackground()`; Solid layers use it instead of flat `backgroundColor`
2. `docs/projects/filling-point.md` — note hairline feather under Direction

## Validation

- Preview Solid: rest still reads crisp; leave no hard ring flash
- Soft unchanged
- `push-fillingpoint.mjs` + `verify.mjs` green
