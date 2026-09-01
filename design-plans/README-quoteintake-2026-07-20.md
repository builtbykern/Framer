# QuoteIntake UI plans (2026-07-20)

Source: `improve-ui` on `Kern_QuoteIntake` / `state/QuoteIntake.tsx`.

## Step 2 sliders (v3.17.4) — DONE

| Plan | Finding | Status |
| --- | --- | --- |
| [Readable continuous rail](./2026-07-20-quoteintake-slider-readable-rail.md) | Track too thin/low-contrast — no rail affordance | DONE |
| [Theme range track/thumb](./2026-07-20-quoteintake-theme-range-sliders.md) | Native UA slider vs Theme field chrome | DONE |

## Buttons (v3.15.0) — DONE

| Plan | Finding | Status |
| --- | --- | --- |
| [CTA fill = textPrimary](./2026-07-20-quoteintake-cta-fill-textprimary.md) | Hardcoded `#EEF1F6` fill | DONE |
| [CTA height = btnH](./2026-07-20-quoteintake-cta-height-btnh.md) | `Math.max(52, btnH)` floor | DONE |
| [Back secondary fill](./2026-07-20-quoteintake-back-secondary-fill.md) | Literal transparent | DONE |

## Compact layout (v3.13) — DONE

| Plan | Finding | Status | Order |
| --- | --- | --- | --- |
| [Compact density = Band BP](./2026-07-20-quoteintake-compact-density-band-bp.md) | Stack mid-band still “desktop” dense | DONE | 1 |
| [Remove cardPad floors](./2026-07-20-quoteintake-remove-cardpad-floors.md) | 36/40 override tiers | DONE | 2 |
| [Wire title size controls](./2026-07-20-quoteintake-wire-title-size-controls.md) | Title tablet/mobile unused | DONE | 3 |

## Earlier (v3.10) — DONE

| Plan | Finding | Status | Order |
| --- | --- | --- | --- |
| [Drop option indices](./2026-07-20-quoteintake-drop-option-indices.md) | Dual `01` language | DONE | — |
| [buttonFont owns CTA size](./2026-07-20-quoteintake-buttonfont-owns-cta-size.md) | Hardcoded 13/12px | DONE | — |
| [Remove Range eyebrow](./2026-07-20-quoteintake-remove-range-eyebrow.md) | Stack-only Range | DONE | — |

Constraints: single file SoT → `Workshop/QuoteIntake.tsx`; ≤1000 lines; typecheck 0; `verify.mjs`; no publish without approval.
