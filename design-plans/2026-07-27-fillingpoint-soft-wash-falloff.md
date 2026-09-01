# Soft wash: longer feathered falloff

Written against: 4aa0cbc

## Evidence chain

- Surface: `Kern_FillingPoint` Soft fill (`fillStyle === "soft"`)
- Problem: Soft reads as a stepped bloom / “blur jump” while scaling, not a feathered wash
- Design evidence: Fill Style control — Soft = “feathered legacy wash”
  (`code-components/Kern_FillingPoint.tsx` property controls)
- Owner: `washBackground()` in `code-components/Kern_FillingPoint.tsx`
- Scope and affected surfaces: Soft layers only; Solid unchanged
- Uncertainty: none for the gradient recipe; feel-check Soft cascade in Preview

## Design decision

Replace the two-stop Soft radial (`opaque to 48%, transparent by 72%`) with a
longer multi-stop falloff so the wash fades continuously. Do not use
`filter: blur()` (expensive; wrong tool). Keep Solid as flat `backgroundColor`.

## Reuse

- Existing `washBackground(color)` helper and `fillStyle === "soft"` branch
- Exemplar: same Soft path at layer `background` assignment

## Changes

1. `code-components/Kern_FillingPoint.tsx` — `washBackground`
   - Change: multi-stop radial:
     `${color} 0%, ${color} 14%, color-mix(in srgb, ${color} 70%, transparent) 36%, color-mix(in srgb, ${color} 35%, transparent) 58%, color-mix(in srgb, ${color} 12%, transparent) 74%, transparent 88%`
   - Preserve: Solid path, motion, origin lock, cascade
   - Verify: Soft hover shows continuous wash; no hard bloom ring mid-scale

2. Fill Style Soft description (same file)
   - Change: note Soft is a long feathered wash (not a blur filter)
   - Preserve: Solid crisp-edge copy

## Scope

- Inherit: Soft instances and Soft property-control default media
- Verify: Solid cinematic demo still crisp; Soft cascade blends without banded rings
- Exclude: enter duration retune, publish, Solid paint media

## Validation

- Product: Soft mode feels smooth; Solid unchanged
- Interface: Preview Soft + Cinematic hover in/out; Soft cascade three colors
- System: no `filter: blur`; no second Soft code path
- Repository: `node scripts/framer/push-fillingpoint.mjs` → `typeErrors: []`;
  `node scripts/framer/verify.mjs` → no blocking errors

## Stop conditions

- Stop if Soft coverage leaves idle base corners on typical CTA sizes after the
  longer feather (raise Soft-only cover only if proven).

## Design documentation

- After acceptance: note Soft wash recipe in `docs/projects/filling-point.md`
  under Fill Style (optional one-liner).
