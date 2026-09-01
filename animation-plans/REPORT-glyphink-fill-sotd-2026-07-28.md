# Glyph Ink — fill / motion re-audit (SOTD elevation)

Written against: `4aa0cbc` · Effort: **standard** · Scope: fill curve + mask tip + directional growth + stagger  
File: `code-components/Kern_GlyphInk.tsx` → Framer `codeFile/Akt2aXG`

## Recon

| | |
| --- | --- |
| Stack | React + `framer-motion` (`animate` / `useMotionValue` / `useTransform`) inside Framer code component |
| Product | Pointer-origin **per-glyph** ghost→ink cascade (SKU B). Hover is the product. **No Auto Demo.** |
| Mask | Directional elliptical wipe from nearest edge; `INK_COVER = √2 × 100/90`; tip 90→97→100 |
| Enter (cinematic) | `400ms` · `EASE_INK [0.22, 1, 0.36, 1]` (strong ease-out) |
| Leave | `560ms` · `EASE_OUT [0.23, 1, 0.32, 1]` |
| Stagger | `28ms` · cap `320ms` (≈80% of enter — late glyphs start as early ones finish) |
| Prior craft | Findings 1–5 in `REPORT-glyphink-improve-animations-2026-07-28.md` → **DONE** (`029–033`). Do not re-litigate sync hover, no solid snap, seedRef interrupt, no growth-power, full-box cover. |
| Sibling exemplar | Filling Point cinematic: enter `760ms` · `EASE_INK [0.65, 0, 0.35, 1]` · solid tip `88/95/100` · opacity couple · cascade cap ≪ enter |

### References (essence-preserving, not copy)

- Evervault / Codrops radial mask hover — soft focus tip, not a hard shutter ([Codrops](https://tympanus.net/codrops/2023/05/17/recreating-the-gradient-mask-hover-effect-from-evervault/))
- Filling Point solid ink stops + mid-body enter curve (same Kern house)
- Awwwards text-hover inspiration (Fontwerk Neue DIN et al.) — letter-level kinetic, not page wipe

**Essence to keep:** dual-layer ghost+ink · pointer-nearest-edge seed · per-glyph distance cascade · elliptical/directional mask · leave longer than enter · dark sell cyan defaults.

---

## Vetted findings (leverage order)

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Easing & duration | `Kern_GlyphInk.tsx:93–123` | Cinematic enter uses **ease-out** `[0.22,1,0.36,1]` at **400ms**. Progress front-loads; the ink front races the far edge and the mid-glyph never reads as wet paint. Filling Point already learned this (`025`). Hover delight may run longer than UI-300ms, but the **curve shape** is wrong for on-glyph fill morph. | Cinematic enter → mid-body ink curve `[0.65, 0, 0.35, 1]` (house `EASE_INK` from Filling Point) · duration **0.48s**. Leave stays ease-out, slightly longer (~0.62s). Balanced/snappy unchanged. |
| 2 | HIGH | Physicality | `Kern_GlyphInk.tsx:101–111`, `327–360` | Tip **90/97/100** is almost a hard clip. With `COVER ≈ 1.57` the opaque core clears corners, but travel reads as a **shutter**, not ink. SOTD / Evervault-class masks keep a longer soft front. | Tip **82 / 92 / 100** with `rgba(0,0,0,0.45)` mid · keep `INK_COVER = Math.SQRT2 * (100 / INK_CORE_PCT)` so corners still solid at `t=1`. |
| 3 | MEDIUM | Physicality & origin | `Kern_GlyphInk.tsx:340–348` | Directional wipe sets **cross-axis to full cover from frame 1**. First frames are a full-height soft bar, then horizontal advance — droplet→flood is lost. | Cross-axis: `seed.ry * INK_COVER * (0.38 + 0.62 * t)` (and mirror for top/bottom). Primary axis still `* t`. Starts as a soft contact blob, opens into a wipe. |
| 4 | MEDIUM | Cohesion / Purpose | `Kern_GlyphInk.tsx:120–126`, `362–383` | Stagger cap **320ms** on **400ms** enter ≈ 80% of fill. Distant glyphs start as near ones complete → cascade feels like unfinished letters chasing, not one ink weather system. Filling Point capped cascade ≪ enter (`015`/`026`). | Cinematic: `staggerMs: 22`, `staggerCapMs: 200` (≈42% of 480ms). Leave rank multiplier stays `×1.25` on those bases. |
| 5 | MEDIUM | Missed / Cohesion | `Kern_GlyphInk.tsx:527–547` | Ink layer is fully chrominance-visible at tiny mask size → tip can **flash** as a hard cyan speck before the front has body (Filling Point `027`). | Couple ink `opacity` to progress: `opacity = idleFull \|\| static ? 1 : min(1, p / 0.18)` via `useTransform`; leave keeps opacity until mask retreats (`opacity = min(1, max(p, 0.001) / 0.12)` or simply `opacity = p > 0 ? min(1, 0.15 + 0.85*p) : 0` — see plan). |
| 6 | LOW | Performance | mask `useTransform` / paint | Unchanged — accept for SKU (prior #6). | Skip |

### Settled (do not re-open)

- Sync `setActive` / seeds on pointer enter/leave
- No `linear-gradient(#000,#000)` snap at `t=1`
- `seedRef` + interrupt delay `0`
- Full glyph-box axes + `√2` corner cover math
- No Auto Demo · no growth-power double shaping

### Missed opportunities (not planned unless asked)

- Progress-linked tip harden (softer mid-travel, harder last 10%) without size settle-remap — advanced; only if #2 still feels soft at end
- Micro letter lift / tracking — out of essence (keep mask-only)

---

## Recommended plan set

| Plan | Finding | Title |
| --- | --- | --- |
| 034 | #1 | Cinematic ink enter curve + duration |
| 035 | #2 | Softer ink tip, corner-safe cover |
| 036 | #3 | Cross-axis grow with primary (droplet wipe) |
| 037 | #4+#5 | Stagger cap + ink opacity couple |

**Execute order:** 034 → 035 → 036 → 037 (curve first so tip/cross-axis are judged on the right timeline).

**Stop for execute:** say `execute 034–037` (or pick numbers). This skill does not edit `Kern_GlyphInk.tsx` until an execute pass.
