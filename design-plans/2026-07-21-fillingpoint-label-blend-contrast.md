# Label stays legible under pointer fill

- **Status**: DONE

## Outcome

`mix-blend-mode: difference` on label + `isolation: isolate` on root. Pushed `codeFile/APe9aGh`.

## Evidence chain

- Surface: `Kern_FillingPoint` hover-filled state
- Problem: Default `fillColor #FFFFFF` + `labelColor #FFFFFF` makes label illegible when fill covers the CTA
- Design evidence: Direct idle vs hover contradiction; audit U1
- Owner: `code-components/Kern_FillingPoint.tsx`
- Scope and affected surfaces: All instances (demo `/`, `/thumbnail`)
- Uncertainty: none

## Design decision

Apply `mix-blend-mode: difference` on the label span and `isolation: isolate` on the root so the label auto-contrasts against base and fill. Keep a single `labelColor` control (feeds the blend source).

## Reuse

- CSS `mix-blend-mode` / `isolation` — no new primitive
- Exemplar: none in-repo; standard compositing

## Changes

1. `code-components/Kern_FillingPoint.tsx`
   - Change: root `isolation: "isolate"`; label `mixBlendMode: "difference"`
   - Preserve: pointer-origin fill, link/button semantics
   - Verify: white label on black base readable; under white fill becomes dark via difference

## Scope

- Inherit: all Marketplace instances
- Verify: inverse demo variant
- Exclude: magnetic cursor, extra label color control

## Validation

- Product: hover fill keeps label readable
- Interface: fine-pointer hover primary + inverse
- System: no second label stack
- Repository: `node scripts/framer/push-fillingpoint.mjs` + `verify.mjs` → non-blocking

## Stop conditions

- Stop if blend breaks on Safari export tiling (report; do not invent alternate without ask)

## Design documentation

- None required beyond plan Outcome
