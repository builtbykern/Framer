# Type Peek sell stage — Kern atmosphere

Written against: `4aa0cbc` (working tree; TypePeek local untracked)

## Evidence chain

- Surface: Type Peek Home Desktop (`augiA20Il` → Desktop) + component root fill in `code-components/TypePeek.tsx`
- Problem: Sell stage is a flat dark plate (`#0A0A0A`); reads as void, not BuiltByKern / Awwwards depth
- Design evidence: TypeDrum house `#060606` (`code-components/TypeDrum.tsx` header); `docs/projects/listings/KERN_THUMBNAIL_STYLE.md`; Engram #104 + exemplar `scripts/framer/copyfield-kern-atmosphere.mjs`
- Owner: `DEFAULT_LOOK.background` in `code-components/TypePeek.tsx`; Home staging in `scripts/framer/typepeek-home.mjs`
- Scope and affected surfaces: TypePeek defaults; Type Peek sandbox Home `/`; `/thumbnail` if/when present (`DHpXX5xCoGaJHmRQfN0m`)
- Uncertainty: Home Desktop node id is discovered at runtime (name `Desktop`); Atmosphere children must be created fresh each restage (prefix ids). Confirm whether a `/thumbnail` page exists before thumb DSL — skip thumb if absent.

## Design decision

Align Type Peek sell defaults and demo stage with the locked Kern atmosphere recipe: house base `#060606`, liquid-gradient + veil + cyan blooms + vignette behind the product, Stage above Atmosphere. Component default background becomes `#060606`; on Home, the Type Peek instance background is transparent so the atmosphere reads through the field.

## Reuse

- Atmosphere recipe + indexed liquid controls: `scripts/framer/copyfield-kern-atmosphere.mjs` (`LIQUID` string, bloom/veil/vignette fills, `ACCENT = "#6FD3FF"`)
- House base: `#060606` (TypeDrum / KERN_THUMBNAIL_STYLE / FillingPoint)
- Staging pattern: `scripts/framer/typepeek-home.mjs` (pin session, resolve Desktop, applyChanges)
- Exemplar: Copy Field Home Atmosphere stack on Gold Parsnip (do not pin that project — copy recipe only)

## Changes

1. `code-components/TypePeek.tsx`
   - Change: set `DEFAULT_LOOK.background` (and Look → Background `defaultValue`) from `#0A0A0A` to `#060606`
   - Preserve: Look → Background still overridable; die-cut / separator / field layout unchanged
   - Verify: canvas instance with defaults shows `#060606` plate when opaque

2. `scripts/framer/typepeek-home.mjs` (or new `scripts/framer/typepeek-kern-atmosphere.mjs` called after home)
   - Change: after clearing Desktop kids / restaging:
     - `SET Desktop fill="#060606"` (not `#0A0A0A`)
     - Insert Atmosphere absolute 100% `zIndex=0`: Liquid (`liquid-gradient` + Copy Field `LIQUID` indexed colors), Veil `rgba(6,6,6,0.7)`, Bloom TR / Bloom BL (cyan radial), Vignette
     - Eyebrow + Type Peek instance + Caption as Stage content with `zIndex=5` (wrapper Frame `Stage` preferred; if flat stack, set each content node `zIndex=5`)
     - Type Peek instance: set Look background transparent (`rgba(0,0,0,0)` / empty) so liquid shows through the component box; keep width/height as today (~960×520)
     - Eyebrow/caption colors: match Copy Field mute band — eyebrow `rgba(180,185,195,0.72)`, caption `rgba(255,255,255,0.5)`
   - Preserve: field-only product, die-cut behavior, pin to Type Peek URL `DHpXX5xCoGaJHmRQfN0m`
   - Verify: serialize Desktop depth≥2 → children include `Atmosphere` then stage content; Atmosphere kids include Liquid, Veil, Bloom TR, Bloom BL, Vignette; liquid colors set via `$control__colors.N` (not JSON array)

3. `/thumbnail` (only if page exists)
   - Change: same Atmosphere recipe at 1600×1200 per KERN_THUMBNAIL_STYLE; Stage `zIndex=5`, fill null; eyebrow `FRAMER MARKETPLACE`
   - Preserve: skip entirely if no thumbnail page
   - Verify: thumb Desktop shows Atmosphere under Stage

## Scope

- Inherit: any new Type Peek insert gets `#060606` default bg
- Verify: Home Preview — atmosphere visible around and through the field; no bloom clipping (`overflow` visible on Desktop if blooms extend past edges — Copy Field learned Atmosphere overflow may need `visible` on parent; prefer Desktop `overflow=clip` only if blooms stay inside)
- Exclude: die-cut motion, separators, listing MP4, publishing, Gold Parsnip project

## Validation

- Product: Type Peek Home feels Kern-depth, not a flat void
- Interface: Home Desktop 1200×900; Preview hover still peeks one word; canvas Active still one die-cut; transparent instance bg does not break die-cut contrast
- System: no second ad-hoc gradient recipe — reuse Copy Field `LIQUID` + bloom fills
- Repository: `node scripts/framer/session.mjs --url "https://framer.com/projects/Straightforward-Engineers--DHpXX5xCoGaJHmRQfN0m-dFXww"` → pin; push TypePeek; run atmosphere/home script; `node scripts/framer/verify.mjs` → `blocking: false`, `typeErrors: []`

## Stop conditions

- Stop if `liquid-gradient` shader unavailable on this project
- Stop if transparent component bg makes peeks unreadable (then keep opaque `#060606` on instance and only atmosphere in Desktop chrome — document the fallback in the PR note)
- Stop if session drifts off `DHpXX5x`

## Design documentation

- After acceptance: add one line under Type Peek project notes (or new `docs/projects/type-peek.md` if created) — “Sell Home/thumb use Kern atmosphere stack (Copy Field recipe); default bg `#060606`.”
