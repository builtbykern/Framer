# Neighbourhood Feature → sección Arbour (sin collage)

Written against: `4aa0cbc`  
Status: DONE (executed 2026-08-11)

## Evidence chain

- Surface: `/properties` → Continue Your Search → Discovery Routes (`y2QfKgGCp`) → instance `yupGO6JVW` of smart component `HA6ZLKBrB` (Arbour Neighbourhood Feature)
- Problem: El Feature es un freeform collage (Main full-bleed + Detail absolute + Copy Paper flotante). Compite con el sibling **All Properties** (stack Meta/Subhead/Body) y contradice el card pattern documentado de Arbour.
- Design evidence:
  - `docs/projects/arbour.md` — Territory Cards (`i56eWdACt`): image-led + Dossier Paper + hairline; Meta `VIEW →`
  - Live Territory Card serialize: Photograph (`1fr` × `36vh`) → Dossier (Paper token `d5b3c09d…`, pad `24px`, gap `16px`, hairline)
  - Live All Properties (`tNgM4ROVr`): stack Meta Ink Soft / Subhead Ink / Body Ink Soft
  - Live Feature Desktop: media freeform; Copy `position` absolute overlay; Phone Description `visible=false`
- Owner: canvas smart component `HA6ZLKBrB` (not a code file)
- Scope and affected surfaces: `HA6ZLKBrB` Desktop `AJACjRktH` / Tablet `r_MNi8Z5D` / Phone `xJ6o4_ghF`; instance `yupGO6JVW` (+ BP replicas if any)
- Uncertainty: none — user rejected collage; functions are Label, Title, Description, Link (+ optional second image)

## Design decision

Rehacer el Feature como **sección/card Arbour simple**: stack vertical Photograph → Dossier. Una imagen principal (Detail Image opcional como segundo frame debajo o oculto, no inset collage). Copy relativo debajo, no overlay. Tipografía y tokens alineados a Territory + All Properties. CTA Meta `VIEW →` Olive ligado al Link variable.

No collage. No placa flotante. No Chartreuse en label.

## Reuse

- Paper fill: `var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)`
- Ink: `var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)`
- Ink Soft: `var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)`
- Olive: `var(--token-a16d0333-6bd5-4d60-aa00-fac26447145d)`
- Hairline: `1px solid rgba(28, 27, 22, 0.10)`
- Presets: `Arbour/Meta`, `Arbour/Subhead`, `Arbour/Body`
- Exemplar: Territory Card `i56eWdACt` (Photograph + Dossier)
- Sibling type: All Properties `tNgM4ROVr`

## Changes

1. `HA6ZLKBrB` variant roots (D/T/P)
   - Change: `layout="stack"` vertical, `gap="0"`, `height="auto"`, `overflow="clip"`, fill Paper (or transparent — prefer Paper so dossier edge matches Territory). Variant width stays artboard px (728 / 488 / 350); instance stays fluid.
   - Preserve: variables Main Image, Detail Image, Label, Title, Description, Link; component name; root `link` → Link variable + `cursor=pointer`.
   - Verify: serialize shows Media then Dossier as relative stack children; no absolute Copy.

2. Media stage (reuse frame `Q5aK5PgZt` or Main as stage)
   - Change: relative, `width="1fr"`, `height="36vh"` Desktop / `32vh` Tablet / `28vh` Phone, `overflow="clip"`. Main Image fills stage (`100%`/`100%` or absolute pins). **No Detail inset overlay.**
   - Detail Image: either `visible="false"` (keep variable for CMS later) OR second relative photo under Main inside media stack at ~40% height — prefer **hide** for simplest Arbour section unless product needs two images.
   - Preserve: Main Image fill binding `var(--variable-Jvk8q3wcQ)`.
   - Verify: one clear photograph band; no floating portrait frame.

3. Dossier (`JnN0hwiLj`, rename stays Neighbourhood Copy or Neighbourhood Dossier)
   - Change: `position="relative"`, `width="1fr"`, `height="auto"`, fill Paper token, hairline border, `radius="0"`, padding `24px` (T `20`, P `18`), gap `16px` (P `14`). Children relative stack: Label Meta Ink Soft → Title Subhead Ink → Description Body Ink Soft → Meta `VIEW →` Olive (`iFA3oykCs` visible true).
   - Preserve: text variable bindings.
   - Verify: Phone Description visible again; no absolute left/bottom pins.

4. Instance `/properties` `yupGO6JVW`
   - Change: `width="1fr"`, `height="auto"` so dossier can breathe in Discovery Routes grid (do not lock to `1fr` if it forces crush against All Properties — prefer auto height like content-led Territory cards).
   - Preserve: placement beside All Properties.
   - Verify: grid gap 24px; Feature reads as sibling text+image card, not widget collage.

5. Motion (bundled — current appear is collage-tuned and out of budget for this surface)
   - Change: remove or simplify appear on Main/Detail. If keep one entrance on the whole variant or media only: `onInView`, `replay=false`, enter `opacity 0` + `y 16` (not 24), **no scale**, transition ≤ `0.45s` with strong ease-out `tween 0.23,1,0.32,1` (or match Territory Pair curve but shorter). No separate Detail slide.
   - Preserve: reduced-motion via Framer appear defaults.
   - Verify: scroll past Discovery Routes does not replay; no scale on large photo.

## Scope

- Inherit: all instances of `HA6ZLKBrB` (Discovery Routes primary)
- Verify: `/properties` Desktop/Tablet/Phone; visual next to All Properties
- Exclude: Territory Card itself; Stats Ledger; code-component rebuild; Chartreuse accent work; publishing

## Validation

- Product: user sees neighbourhood teaser with label/title/body and can follow Link
- Interface: D/T/P; long title/description; missing Detail image still OK
- System: matches Territory Photograph+Dossier + All Properties type tokens; no parallel collage pattern
- Repository: `node scripts/framer/verify.mjs` → ignore known `/properties/:slug` CodeError `OhRUQROL4` if Feature itself clean; serialize check Media+Dossier relative

## Stop conditions

- Stop if product owner requires two-image collage as brand signature (then escalate — contradicts this decision).
- Stop if Detail Image must remain visible and no stack layout can host it without overlay — then add second relative media row, still no absolute copy.

## Design documentation

- After acceptance: update `docs/projects/arbour.md` under `/properties` with one line: Neighbourhood Feature (`HA6ZLKBrB`) = Territory-style Photograph + Dossier (not collage).
