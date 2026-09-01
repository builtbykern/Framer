# Report — Section Island Home improve-ui (2026-08-07)

## Design language
- Audited surface: Section Island Framer project `DHpXX5xCoGaJHmRQfN0m` · page `/` · Desktop `WQLkyLRf1` (Hero → Overview/Work/Process/Contact → Island Dock)
- Design sources: `scripts/framer/pillselect-home.mjs` (Morph Dropdown Home exemplar); `design-plans/epic-marketplace-atmosphere.md`; `docs/projects/listings/KERN_THUMBNAIL_STYLE.md` (house `#060606` + liquid + blooms); `docs/projects/listings/Kern_MorphDropdown.md` / `Kern_ContactDock.md` (demo presentation grammar); Framer project `prompt/design-rules.md` (hierarchy, spacing, accent commitment)
- Documented decisions: Kern Marketplace demo house = `#060606` + dark `liquid-gradient` + grain + accent blooms + vignette; Stage = eyebrow → product figure → product-truth caption; scroll sections with accent kickers; captions must not be feature/phase bylines
- Governing owners and consumers: Home Desktop chrome only (Atmosphere / Stage / sections / Island Dock). Not `code-components/SectionIsland.tsx`
- Explicit exceptions: None documented

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Home reads as empty dark canvas, not Kern product theater | Contract: Morph Home (`pillselect-home.mjs`) + `epic-marketplace-atmosphere.md` + `KERN_THUMBNAIL_STYLE.md` require `#060606` + `liquid-gradient` Atmosphere under Stage. Runtime: Desktop `fill="#0A0A0A"`; `shaderCount=0`; children = Hero/sections/dock only (`serialize` `/`). | Rebuild full-bleed Atmosphere (Liquid + Veil + blooms + Vignette) on `#060606`; keep content stack above `zIndex≥10`. Accent blooms `#6FD3FF` (Kern house / Contact Dock). | `/` Desktop chrome only | high |
| 2 | Caption is build-phase jargon, not product truth | Contract: Kern listing/demo captions = concrete product line, no mechanic/phase bylines (`REPORT-copyfield-improve-ui`; Morph caption “Pick an option to scroll · Link or Section”). Runtime: Caption `F2urrBq1w` text = `Tap the dock · Phase 1 shell`. | Replace with one product line, e.g. `Know where you are. Jump anywhere.` Keep muted ink. | Hero Caption only | high |
| 3 | Island Dock chrome is oversized / unorganized vs thin fixed strip | Contract: Contact Dock / Morph presentation keep the product figure in a deliberate well or thin fixed strip; dock frame should not dominate the page stack. Runtime: Island Dock `CWWYbXpNS` `height="849px"` (expected ~`120px` fixed bottom strip). | Reset Island Dock to `position=fixed` `bottom=0` `left=0` `width=100%` `height=120px` `zIndex=50` `fill=null`; instance fills the strip. | Island Dock + Section Island instance | high |

## Improve first
**Finding 1** — Without Kern atmosphere the rest of the presentation (caption, sections, dock) still reads as a scaffold. Atmosphere + house fill is the single highest-leverage change that matches Morph / Contact Dock demos; Findings 2–3 are cheap follow-ons in the same Home pass.
