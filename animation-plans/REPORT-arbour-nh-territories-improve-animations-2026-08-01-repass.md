# Improve Animations — Arbour TerritoryHoverMedia (re-pass)

- **Date:** 2026-08-01
- **Commit:** `4aa0cbc`
- **Focus:** `Arbour_TerritoryHoverMedia.tsx` (`codeFile/nMMl08t`) — live content mirrored in `.tmp/arbour-TerritoryHoverMedia-live.tsx`
- **Personality:** Crisp editorial estate
- **Frequency:** Directory card hover = tens/session (cycle is **user-requested**; do not remove — craft it)

---

## Recon

| Item | Fact |
| --- | --- |
| Stack | React state + CSS transitions (no Motion) |
| Ease in file | `cubic-bezier(0.23, 1, 0.32, 1)` — matches PropertyCard |
| Zoom | `transform 0.22s` on **each** `img` |
| Crossfade | `opacity 0.35s` on each `img` |
| Cycle | `setTimeout(450)` then `setInterval(intervalMs≈900)` |
| A11y | `prefers-reduced-motion` kills transform; cycle gated off when reduced |
| Perf | `will-change: transform, opacity` **always** on `.arbour-thm__img` (L150–151) |

---

## Findings

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Easing & duration + Purpose | `.arbour-thm__img` transition opacity **0.35s**; cycle ~900ms | Crossfade eats ~40% of each beat → mushy continuous blend on a high-frequency hover gallery. UI crossfades should sit **≤220ms**. | Set opacity transition to **`0.2s`** with the same `cubic-bezier(0.23, 1, 0.32, 1)`; keep transform at **0.22s**. |
| 2 | HIGH | Physicality | `transform: scale(...)` on **active img only** (L191–192) | During crossfade, incoming/outgoing images disagree on scale → visible “pop”. PropertyCard zooms the **media plane**. | Apply `transform: scale(zoom)` to **`.arbour-thm`** (or an inner `.arbour-thm__stage` wrapper) while hovering; keep imgs at `scale(1)`. |
| 3 | MEDIUM | Performance | L150–151 `will-change: transform, opacity` | Always-on `will-change` on 8 images (4 cards × 2) promotes layers permanently. | Remove permanent `will-change`; set `willChange: "transform, opacity"` only while `hovering`, else `"auto"`. |

### Missed opportunities

1. **Single cadence:** drop the 450ms first timeout; use one `setInterval(intervalMs)` so beats are even (optional feel-check).
2. **Grid entrance:** 40–60ms stagger opacity/transform when Directory enters viewport (rare; reduced-motion → opacity only).
3. **VIEW pill:** fade `0.7 → 1` opacity on hover (150ms ease-out) so chrome is quieter at rest.

---

## Improve first (motion)

**Anim #1 — Shorten crossfade to 200ms** (biggest feel win on the cycle you already shipped).

---

## Recommended execution order

1. Anim-1 opacity 200ms  
2. Anim-2 scale on stage wrapper  
3. Anim-3 will-change on hover only  
4. Then UI photo height / dossier border (improve-ui) so motion reads on a larger plane  

---

**Stop (improve-animations).** Which findings → `animation-plans/`? (`1` / `1+2` / `all` / `ui+anim`)
