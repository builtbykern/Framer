# Step 2 range: readable continuous rail

Written against: unavailable (SoT `state/QuoteIntake.tsx` Version: 3.17.3)

- **Status**: DONE

## Evidence chain

- Surface: Step 2 quantity fields when `step2.quantityControlType === "slider"` (`state/QuoteIntake.tsx` ~616–626; scoped CSS `QI_RANGE_CSS` ~63)
- Problem: Control does not read as a slider — no continuous rail is perceptible; value + min/max ticks remain but the track disappears into the glass card
- Design evidence:
  - User report: “no parece un slider… no tiene ningun rail”
  - Accepted prior decision `design-plans/2026-07-20-quoteintake-theme-range-sliders.md`: Theme track/thumb chrome (hairline track + accent fill + thumb)
  - Runtime: idle track is `color-mix(in srgb, ${colors.border} 85%, ${colors.textPrimary})` at **3px** (`~600`, `~621`, `QI_RANGE_CSS` track height `3px`); Theme default `border` is `rgba(238, 241, 246, 0.12)` — mix stays near field hairlines (`faintRule` ~611) and loses to them
  - Sibling field chrome (stepper / step 4 inputs): `1px solid ${colors.border}` full edge — structural presence the slider rail currently lacks
  - baseline-ui (governing taste for this pass): one accent; no glow; Theme tokens only; no new animation; progress fill gradient already accepted for this control
- Owner: `colors.border` (idle rail), `colors.accent` (filled segment only), `layout.borderRadius` (track/thumb corners), `QI_RANGE_CSS` + inline `backgroundImage` / `--qi-*` vars
- Scope and affected surfaces: Step 2 slider mode only; stepper `input[type=number]` unchanged
- Uncertainty: Exact idle rail height (recommend **6px**) — if canvas still feels thin at 6, bump to 8; do not invent a second accent or glow

## Design decision

Make the **idle track a continuous, full-width rail** with Theme-visible contrast and enough thickness to read as a control body; keep **accent only on the filled segment** and the existing thumb/min-max composition. This restores the slider affordance without changing interaction model or inventing a custom dual-control.

## Reuse

- `colors.border` — idle rail fill (full token, not 85% mix toward text)
- `colors.accent` — filled progress only (existing `--qi-fill` / gradient to `--qi-pct`)
- `colors.textPrimary` / `colors.cardBackground` — thumb (out of scope unless paired finding selected)
- `layout.borderRadius` — track + thumb radius (keep `Math.min(layout.borderRadius, 4)` cap)
- Exemplar: stepper/number field edge `1px solid ${colors.border}` (~630) for “Theme structure is visible” bar; prior plan `2026-07-20-quoteintake-theme-range-sliders.md` for fill/pct pattern

No new primitive. Existing `.qi-range` + CSS vars express the decision.

## Changes

1. `state/QuoteIntake.tsx` — `trackIdle` (~600)
   - Change: set idle rail to solid Theme border presence, e.g. `colors.border` (or `color-mix(in srgb, ${colors.textPrimary} 22%, transparent)` only if solid `border` still fails on canvas — prefer `colors.border` first)
   - Preserve: accent fill to `pct`; single accent; no glow; no layout animation
   - Verify: full-width idle segment visible left and right of thumb on dark glass card

2. `state/QuoteIntake.tsx` — `QI_RANGE_CSS` (~63) + inline `backgroundSize` (~621)
   - Change: runnable-track / moz-track / moz-progress / inline background bar height from `3px` → **`6px`**; retune thumb `margin-top` so 14px thumb stays vertically centered on the thicker rail (≈ `-4px` for 14-on-6)
   - Preserve: hit area ~32px height; `appearance: none`; `--qi-pct` fill model; WebKit + Moz paths
   - Verify: continuous rail reads before/after thumb; fill still meets thumb edge; no UA default track returns

3. Push / canvas
   - Change: `setFileContent` → Workshop `QuoteIntake.tsx`; bump Version patch; recreate stage instance @ 640px; `verify.mjs`
   - Preserve: ≤1000 lines; typecheck 0; no publish
   - Verify: Step 2 slider fields show an obvious horizontal rail at rest and while dragging

## Scope

- Inherit: all Step 2 quantity rows in slider mode
- Verify: Theme retints (`border` / `accent`); mobile band; Moz vs WebKit
- Exclude: stepper mode; custom SVG slider; glow/shadow affordances; animating thumb; changing min/max copy; field `faintRule` separators (leave unless a separate finding is selected)

## Validation

- Product: On Step 2, each quantity control is recognizable as a slider at a glance (continuous rail + thumb), not only as label/value/ticks
- Interface: default quantities; min and max extremes; mid value; accent/border Theme swaps; 640px stage
- System: still Theme-owned `.qi-range`; no parallel slider primitive; accent only on fill
- Repository: `node scripts/framer/session.mjs --id L5ndIczlPnFyngaCyVU3` → push → typecheck 0 → recreate @ 640 → `node scripts/framer/verify.mjs` → `ok: true`, no blocking

## Stop conditions

- Stop if a visible rail requires inventing non-Theme colors or glow
- Stop if line budget would exceed 1000 without compensating cuts
- Stop if product intent shifts to stepper-only (no slider chrome)

## Design documentation

- After acceptance: mark this plan DONE in `design-plans/README-quoteintake-2026-07-20.md`; note rail = `colors.border` @ 6px, fill = `colors.accent` to pct (supersedes “3px hairline” note in the older theme-range plan)
