# improve-ui — Copy Field (post-ship)

Written against: `4aa0cbc` · Effort: standard · Scope: Gold Parsnip `/` + `CopyField.tsx`  
Rendered: serialize Home Desktop `WQLkyLRf1` (2026-07-30) · no user screenshot

## Design language

- Audited surface: Copy Field Marketplace sell — Home `/` (Stage + instance `H9GFUspXD`) and component presentation in `code-components/CopyField.tsx`
- Design sources: `docs/projects/listings/KERN_THUMBNAIL_STYLE.md`; `design-plans/2026-07-30-copyfield-kern-*.md` (DONE); Filling Point Geist / no-Inter plan; peer Metric Seal caption = product truth
- Documented decisions: Ground `#060606`; accent `#6FD3FF`; pill `#F4F4F5`; frosted toast; no Auto Demo; no publish without OK; prior UI 1–3 executed
- Governing owners and consumers: `CopyField.tsx` / `codeFile/hLbnA6C`; Home nodes `sMV8Qb6Xq` (eyebrow), `H9GFUspXD` (instance), `J4Nu3liFG` (caption)
- Explicit exceptions: None documented

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Sell typography resolves to Inter | Contract: Kern sell avoids Inter (Filling Point Geist plan; user frontend hard rules). Runtime: instance `$control__font` = `Inter-SemiBold`; eyebrow + caption `fontName: "Inter"` (`serialize` Home). Project `<project-fonts>[]` — Geist default never loads. | Load Geist (or Clash) into the project; set instance Font + eyebrow/caption to that family; keep `FONT_CONTROL_DEFAULT` without relying on unresolved Geist fallback. | Home RichText + instance Font | high |
| 2 | Caption is feature jargon, not product truth | Contract: Kern listing captions = concrete product line, no feature bylines (`KERN_THUMBNAIL_STYLE.md`; Metric Seal UI finding 3). Runtime: caption text `Reveal · copy · Kern feedback` (`J4Nu3liFG`). | One product-truth line (e.g. `Reveal a value, then copy it.`) — no mechanic list. | Home caption only | high |
| 3 | No `/thumbnail` Kern house page | Contract: Marketplace thumbs use dedicated `/thumbnail` 1600×1200 on `#060606` + liquid recipe (`KERN_THUMBNAIL_STYLE.md`). Runtime: site-map only `{"augiA20Il":"/"}` — no thumbnail route. | Add `/thumbnail` Desktop 1600×1200, dark house, full-bleed or centered Copy Field mid-cycle still, eyebrow `FRAMER MARKETPLACE`, muted product caption. | New page `/thumbnail` | high |

## Improve first

**Finding 1** — Digits and chrome reading as Inter undercuts Kern identity on the only live sell surface; caption/thumbnail polish still look generic until type is fixed.

---

**Stop.** Which findings become `design-plans/` plans? (e.g. `1`, `1+2`, `1+2+3`)

### Explicitly not findings (settled / out of scope)

- Dark house `#060606`, accent `#6FD3FF`, frosted toast — prior UI plans DONE
- Toast hardcoding `Geist` string while Font control owns digits — no binding contract that toast must share Font
- A11y focus ring — user did not request a11y in this audit
