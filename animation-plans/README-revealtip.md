# Reveal Tooltip — plans index (UI + motion)

**Updated:** 2026-08-08 · commit `4aa0cbc` · project `DHpXX5xCoGaJHmRQfN0m`  
**Shipped:** motion 087–092 + Home utility/caption/labels → `OzC4vaD` typeErrors `[]` · verify ready

## Design (Home chrome) — `design-plans/`

| Plan | Finding | Status |
| --- | --- | --- |
| [2026-08-08-revealtip-home-utility-tip-copy.md](../design-plans/2026-08-08-revealtip-home-utility-tip-copy.md) | UI #1 Tip Bottom utility copy | DONE |
| [2026-08-08-revealtip-home-jtbd-caption.md](../design-plans/2026-08-08-revealtip-home-jtbd-caption.md) | UI #2 JTBD caption | DONE |
| [2026-08-08-revealtip-home-mode-labels.md](../design-plans/2026-08-08-revealtip-home-mode-labels.md) | UI #3 Smooth/Pixel labels | DONE |

SoT script: `scripts/framer/revealtip-home.mjs`

## Motion — `animation-plans/`

| # | Plan | Sev | Status | Depends |
| --- | --- | --- | --- | --- |
| 083 | Cap open under 200ms | HIGH | DONE* | — |
| 084 | Trigger press scale | MEDIUM | DONE | — |
| 085 | Ease → AUDIT ease-out | LOW | DONE | — |
| 086 | Pixel scale 0.92 | MEDIUM | DONE* | 083 |
| 087 | Restore pixel scale floor 0.92 | HIGH | DONE | — |
| 088 | Cap pixel content delay | HIGH | DONE | — |
| 089 | Follow via translate3d MotionValues | HIGH | DONE | — |
| 090 | Pixel cells transform string | MEDIUM | DONE | 087 |
| 091 | cellTx → EXPAND_EASE | LOW | DONE | — |
| 092 | Anchored shell scale 0.96 | LOW | DONE | 087–089 |

\*083/086 historically DONE; Codrops regress → fixed by 087/088.

## Audits

- `design-plans/REPORT-revealtip-improve-ui-2026-08-08.md`
- `animation-plans/REPORT-revealtip-improve-animations-2026-08-08.md`
- `template-plans/REPORT-revealtip-template-audit-2026-08-08.md`
