# Improve UI — Tiny Card image proportion (2026-07-28)

Read-only audit. No product source edited.

## Design language
- Audited surface: Home `/` → Desktop/Tablet/Phone → `TinyCard` flying plane (`code-components/TinyCard.tsx`)
- Design sources: GA ImagesGrid layout port (`DEFAULT_LAYOUT`); product scope = photographic cards only (no GA chrome); user constraint 2026-07-28: images must not read as excessively thin
- Documented decisions: 35-slot scatter; layers 0/1/2 size tiers; `unitScale` default 0.72; `object-fit: cover`
- Governing owners and consumers: `DEFAULT_LAYOUT` + `unitScale` own card geometry; `FALLBACK_IMAGES` / Images control supply photography
- Explicit exceptions: None documented

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Needle-thin cards crop landscape photos into unreadable strips | Layout slots with AR `w/h` as low as **0.107** (index 27: `w:47,h:440` → **34×317px** at scale 0.72); also AR ≤0.26 at indices 2,17,18,19,23,26,33 — all reach the plane via `DEFAULT_LAYOUT` → `widthPx`/`aspectRatio` → `objectFit: cover` | Enforce one proportion rule on `DEFAULT_LAYOUT`: every slot must satisfy **`w/h ≥ 0.45`** and **`w ≥ 110`** (design units). Fix violators by raising `w` (keep `h` and `x,y,layer`) until both floors pass | `code-components/TinyCard.tsx` `DEFAULT_LAYOUT` only | high |
| 2 | Far-layer “depth” is encoded as extreme thinness, colliding with photo legibility | Layer 0 cluster is almost all of the AR≤0.34 set (indices 2,14,17,19,23,27,30,33); layer near (2) uses healthy 260-wide cards | After applying finding 1 floors, keep depth via existing `layerMultipliers` + `LAYER_Z`, not via sub-110 widths | Same file; no new depth system | high |

## Improve first
**Finding #1** — one numeric criterion (`minAR 0.45`, `minW 110`) removes the unreadable strips without inventing a new layout language.

---

Reply with `1`, `1 2`, or `plan 1` to write `design-plans/NNN-*.md`. improve-ui will not implement until a plan is selected and an executor runs it.
