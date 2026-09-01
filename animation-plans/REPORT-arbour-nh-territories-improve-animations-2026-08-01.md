# Improve Animations — Arbour Neighbourhoods Territory Cards

- **Date:** 2026-08-01
- **Commit:** `4aa0cbc`
- **Effort:** standard (surface focus: `/neighbourhoods` directory cards)
- **Stack:** Framer canvas hoverEffect on `Territory Photograph`; exemplar motion in `Arbour_PropertyCard.tsx` (CSS transform + reduced-motion)

---

## Recon

| Item | Fact |
| --- | --- |
| Personality | Crisp editorial estate (not playful) |
| Frequency | Directory card hover = tens+/session on `/neighbourhoods` |
| Canvas motion | `hX5NduSNi.hoverEffect`: **opacity 0.9**, scale 1, tween `cubic-bezier(0.23,1,0.32,1)` **180ms** |
| Exemplar | PropertyCard: image `scale(1.04)` on hover, `0.22s` `--ease-out` equivalent, `@media (hover:hover) and (pointer:fine)`, `prefers-reduced-motion: reduce` → no transform; active `scale(0.98)` |
| Tokens | No shared Framer motion tokens; PropertyCard hard-codes `cubic-bezier(0.23, 1, 0.32, 1)` |

---

## Findings

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Purpose & frequency + Physicality | `hX5NduSNi` (+ T/P replicas) `hoverEffect` | List-card hover **dims photography** (`opacity: 0.9`) on a high-frequency directory. Emil: decorative hover on list items → remove/reduce. Arbour exemplar zooms media via **transform**, never dims it. | Clear opacity change. Set hoverEffect to `opacity: 1`, `scale: 1.04`, transition `tween 0.23,1,0.32,1 0.22s 0s` (match PropertyCard 220ms ease-out). |
| 2 | MEDIUM | Accessibility | Same hoverEffect | Canvas `hoverEffect` has **no** `prefers-reduced-motion` branch and no fine-pointer gate (PropertyCard CSS does both). Ungated opacity/scale fires on touch false-hovers. | After #1: either remove hoverEffect entirely on coarse pointers (if Framer can’t gate, **delete hoverEffect** and accept static photo), or document that true parity requires a small code-card. Prefer **delete** if gating impossible. |
| 3 | LOW | Cohesion | Territory Card vs PropertyCard | Press feedback: PropertyCard `active scale(0.98)` / 160ms; Territory Card has none. | Optional: card-level press via code component later — **do not** fake with layout animation on canvas. |

### Missed opportunities (additive)

1. **Grid entrance:** 40–60ms stagger on Territory Cards when Directory enters viewport (scroll-triggered opacity/transform only) — rare enough for delight; keep &lt;300ms; respect reduced-motion (opacity only).
2. **Overlay VIEW fade** (if improve-ui #2 ships): Meta VIEW opacity 0→1 on hover 150ms ease-out — only with fine pointer.

---

## Improve first (motion)

**Anim #1 — Replace photo opacity dim with PropertyCard-matched `scale(1.04)` zoom (220ms, ease-out curve `0.23,1,0.32,1`), opacity locked at 1.**

---

## Recommended plan order (when selected)

1. Anim-1 photo hover transform (pairs with UI photo height)
2. Anim-2 reduce-motion / delete if ungatable
3. UI overlay VIEW (improve-ui) then optional VIEW fade

---

**Stop (improve-animations).** No source edits. Which motion findings → `animation-plans/`? (`1` / `1+2` / `all`)
