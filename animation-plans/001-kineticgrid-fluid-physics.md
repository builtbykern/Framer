# 001 — Kinetic Grid fluid physics (executed)

**Status:** DONE (v1.4.0)  
**Commit at plan:** `4aa0cbc`  
**File:** `code-components/KineticGrid.tsx`

## Findings executed

| # | Severity | Fix |
| --- | --- | --- |
| 1 | HIGH | Pointer impulse was absolute-offset every move frame → velocity-led + soft hold + pointer lerp |
| 2 | HIGH | Hard displacement clamp → soft overshoot restoring force |
| 3 | MEDIUM | Single Euler step → 2–3 fixed substeps |
| 4 | MEDIUM | Linear SVG `L` path → midpoint quadratic smoothing |
| 5 | LOW | Defaults retuned (tension 48 / damping 15 / segments 36); entrance bounce 0.18→0.12 |

## Feel-check

Preview Home → sweep pointer across columns: bend should lead with motion, settle without chatter or hard stops. Leave → ring decays smoothly.
