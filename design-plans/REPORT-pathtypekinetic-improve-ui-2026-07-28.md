# improve-ui — PathTypeKinetic sell surface (Story Stage)

Written against: `4aa0cbc` · Effort: standard · Scope: `/` + `/thumbnail` only  
Rendered evidence: `state/ptk-home-bg2.jpg`, `state/ptk-thumb2.jpg`

## Design language

- Audited surface: Story Stage Marketplace sell pages — Home `/` Desktop + `/thumbnail` Desktop 1600×1200 hosting `PathTypeKinetic`
- Design sources: `docs/projects/listings/KERN_THUMBNAIL_STYLE.md`; `template-plans/065-fillingpoint-deluxe-sell-surface.md`; Filling Point product SoT pattern (`docs/projects/filling-point.md`)
- Documented decisions: Kern `#060606` ground; house liquid-gradient + cyan blooms on `/thumbnail`; sell = one native instance + one muted caption; caption = product truth not feature spam; accent `#6FD3FF` (or product accent)
- Governing owners and consumers: Atmosphere frames on `/` + `/thumbnail`; Hero stack `VnOxZSQ9v` + caption `yqy_z5pEw`; thumb Stage caption `IPL_9420B` (IDs may drift — re-serialize before execute)
- Explicit exceptions: None documented for PathTypeKinetic (project still named Story Stage; component is transitional)

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Home + thumb captions are implementation jargon, not product truth | Contract: `KERN_THUMBNAIL_STYLE.md` caption examples = concrete product line, “No feature bylines”; `065` = restrained caption. Runtime screenshots: home “Letters ride the path — Path mode, canvas-safe idle”; thumb “Wave path mid-hold · canvas-safe freeze” (`state/ptk-home-bg2.jpg`, `state/ptk-thumb2.jpg`). | Replace both captions with one product-truth line (e.g. “Letters settle as the pointer approaches”) once SKU B ships; until then mute or remove meta copy. | `/` caption + `/thumbnail` caption | high |
| 2 | Thumbnail headline can read as collapsed wordspacing / unreadable sell glyph | Contract: thumb product must be optically readable native instance (`KERN_THUMBNAIL_STYLE`). Runtime: `state/ptk-thumb2.jpg` renders as continuous run “Typethatholdsthebeat” (no visible word spaces) while home shot shows spaced words. | Re-serialize thumb instance; ensure `ControlType`/SVG textPath preserves spaces at freeze offset; shorten sell string if path geometry eats spaces; feel-check Desktop 1600×1200. | `/thumbnail` PathTypeKinetic instance only | medium |
| 3 | Project/page identity still says Story Stage while product is kinetic type | Contract: sell surface must communicate one SKU (`065` / listing handoff). Runtime: Framer project name **Story Stage**; thumbnail page display name `"/thumbnail"`. | Rename project + page display to the chosen B SKU name; keep path `/thumbnail`. | Project metadata + WebPageNode name | high |

## Improve first

**Finding 1** — Meta captions teach buyers nothing and violate the locked Kern listing caption contract; fixing them is cheap and immediately upgrades perceived SKU quality even before B lands.

---

**Stop.** Which findings become `design-plans/` plans? (e.g. `1`, `1+3`, or defer until SKU B name is locked)
