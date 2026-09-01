# improve-ui — Metric Seal sell + component presentation

Written against: `4aa0cbc` · Effort: standard · Scope: Metric Seal `/` + `/thumbnail` + `MetricSeal.tsx` presentation  
Rendered evidence: none (user judgment: *“todavía es muy mejorable”*); source-traced only

## Design language

- Audited surface: Metric Seal Marketplace sell — Home `/` (Atmosphere + Metrics + Caption) and `/thumbnail`; ink presentation owned by `MetricSeal.tsx`
- Design sources: `scripts/framer/metricseal-elevate.mjs` (accent `#8B9BFF`, counters-only); Engram #43 / essence contract (Ink Seal, no full-number ghost, tip bloom during wipe); `docs/projects/listings/KERN_THUMBNAIL_STYLE.md` (caption = product truth, no feature bylines); peer Glyph Ink tip constants in `Kern_GlyphInk.tsx`
- Documented decisions: Ground `#060606`; product accent indigo `#8B9BFF` (≠ Glyph `#6FD3FF`); wipe soft→hard tip; bloom = lagged tip halo only; never Auto Demo; no publish without OK
- Governing owners and consumers: Elevate DSL nodes (`scu-atm`, `scu-metrics`, `scu-caption`, thumb Liquid/Bloom/instance); component file `Q3t5G1j` / `code-components/MetricSeal.tsx`
- Explicit exceptions: None documented

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Sealed rest state still double-paints ink (bloom + solid) | Contract: bloom is tip halo during wipe, not a lasting double exposure (Engram #43; essence: no muddy full-number under ink). Runtime: bloom `opacity: BLOOM_OPACITY` (0.32) constant (`MetricSeal.tsx` ~71, ~448–476) while solid densifies to 1 — after seal both layers show the same `finalLabel`. | Drive bloom opacity → 0 as progress approaches 1 (e.g. fade from p≥0.85); sealed rest = single solid ink layer only. | `MetricSeal.tsx` bloom layer | high |
| 2 | Default wipe paints `from` (demo `0+` / `0%` / `$0.0M`) for ~72% of the ink front | Contract: product seals the metric figure, not a zero placeholder (component purpose + sell of “Ink seals the metric”). Runtime: `liveLabel = startLabel` until `COUNT_START` 0.72 (`~289–303`, elevate defaults `from=0`). Soft tip therefore reveals zeros, then digit-swaps. | Until `COUNT_START`, paint `finalLabel` in masked layers (measure already locks width); run from→to only in the late window when `from !== to`. If `from === 0`, skip painting zero — hold destination until late count. | `MetricSeal.tsx` label path + home instances keep `from` for non-zero demos only | high |
| 3 | Captions are implementation jargon, not product truth | Contract: Kern listing captions = concrete product line, no feature bylines (`KERN_THUMBNAIL_STYLE.md`). Runtime: home “Soft tip hardens as ink seals · digits wake late”; thumb “Ink seals the metric · soft tip → hard seal” (`metricseal-elevate.mjs` ~57, ~65). | One product-truth line on both surfaces (e.g. “Ink seals the figure on enter”) — no tip/digit mechanics. | `/` caption + `/thumbnail` caption | high |

## Improve first

**Finding 1** — After the wipe finishes the SKU still looks muddy; extinguishing bloom is the highest-leverage visual fix and unlocks a crisp sealed state before retuning count or copy.

---

**Stop.** Which findings become `design-plans/` plans? (e.g. `1`, `1+2`, `1+2+3`)
