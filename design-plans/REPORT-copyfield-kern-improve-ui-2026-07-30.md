# improve-ui — BuiltByKern Copy Field

Written against: `4aa0cbc` · Effort: standard · Scope: Marketplace SKU  
Governing SoT: `docs/projects/listings/KERN_THUMBNAIL_STYLE.md` · peers Drift Plane / Metric Seal / Filling Point

## Design language

- Audited surface: BuiltByKern Marketplace **Copy Field** — reveal-masked value + copy feedback, demo `/` + `/thumbnail`
- Design sources: Kern house ground `#060606`, accent `#6FD3FF`, caption = product truth; peer sell packs
- Documented decisions: Cursor-only; Marketplace incremental phases; no Auto Demo; no publish without OK; Kern dark house for `/` + `/thumbnail`
- Governing owners: `code-components/CopyField.tsx` + elevate DSL for demo pages; listing under `docs/projects/listings/`
- Explicit exceptions: none

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Light pastel stage fights Kern house | Contract: demo `/` and `/thumbnail` share `#060606` + dark atmosphere (`KERN_THUMBNAIL_STYLE.md`). | Author sell on Kern dark ground; pill as elevated surface `#F4F4F5` readable on `#060606`; caption muted `rgba(180,185,195,0.5)`. | Demo `/` + `/thumbnail` + default component colors | high |
| 2 | Multi-pastel icon colors are not Kern accent grammar | Contract: house accent `#6FD3FF` (or one SKU-owned accent); success must read on dark. | Idle action = product accent wash + ink icon; success = solid accent with dark check — single accent grammar. | Component default colors + controls | high |
| 3 | Dark toast under light pill fails on Kern dark | Contract: feedback must stay legible on `#060606` house. | Feedback = frosted light chip (or inline dark chip beside button) with buyer-editable copy `"Copied to clipboard."` | Feedback presentation | medium |

## Improve first

**Finding 1** — Without dark-house stage + pill contrast, accent/feedback choices still look like a generic light UI, not a Kern SKU.

---

**Stop.** Which findings become `design-plans/` plans? (e.g. `1`, `1+2`, `1+2+3`)
