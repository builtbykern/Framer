# Improve UI — Arbour Neighbourhoods territories (Awwwards / SOTD bar)

- **Date:** 2026-08-01
- **Commit:** `4aa0cbc`
- **Skills:** `improve-ui` (read-only)
- **Note:** Canvas has **unpublished** image-led cards (`changesCount: 1`). Live still shows legacy 50/50 split (`.tmp/arbour-nh-live-stale-directory.png`). This audit judges the **canvas** composition against the live **Properties** listing exemplar (`.tmp/arbour-props-exemplar-cards.png`).

---

## Design language

- **Audited surface:** `/neighbourhoods` Territory Checkerboard → Territory Card `i56eWdACt` (photo → Paper dossier)
- **Design sources:** `docs/projects/arbour.md`; live `/properties` `Arbour_PropertyCard` (image plane + Chartreuse VIEW overlay + Meta); prior directory Paper/1200 plans; canvas attributes after image-led redesign
- **Documented decisions:** Image-led card; Meta `VIEW →` Chartreuse; Intro 2-line clamp; Highlights/Map off; CTA → `/properties`
- **Governing owners and consumers:** Territory Card template + BP replicas; Properties listing as sibling directory exemplar
- **Explicit exceptions:** None documented that Territory media may be shorter/weaker than PropertyCard media, or that VIEW must sit only in the title row

---

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Territory photo band is too short to carry Arbour’s listing photography language | **Contract:** Properties listing (same product, browse → detail) uses a **dominant image plane** with media-first hierarchy (live stills: tall/wide covers filling the card). Territory cards are the parallel place directory. **Runtime:** Canvas `hX5NduSNi` `height/min/max: 220px` (T/P 200). **Correction:** Set Desktop photograph to **`320px`** height (keep `aspectRatio=1.6` or drop maxHeight clash); Tablet/Phone **`260px`**. | Territory Photograph D/T/P | high |
| 2 | Primary VIEW affordance sits in the dossier title row, not on the media (unlike Properties) | **Contract:** PropertyCard places Chartreuse **VIEW** on the **image** (`( RESIDENCE ) VIEW` overlay, bottom-leading). **Runtime:** Territory `VIEW →` lives on RichText `d9SNjsdke` in Place Title; photograph has no overlay label. **Correction:** Add a Meta `VIEW →` (Chartreuse token `db86917b-…`) overlay frame on `hX5NduSNi` (bottom-left, 16px inset), and set title-row `d9SNjsdke` to **`visible=false`** so there is a single VIEW. | Photo overlay + hide title CTA · D/T/P | high |
| 3 | Directory cards still read as equal “UI cards” vs Properties’ editorial media stack | **Contract:** Property cards separate **media block** from **type block** under the image (title/price/meta), not a bordered Paper slab competing with the photo. **Runtime:** Territory dossier uses Paper fill + hairline border wrapping the whole card including photo (`border` on `i56eWdACt`). **Correction:** Move border to **dossier only** (or bottom hairline under photo); set card `border` to none; keep radius `0`. | `i56eWdACt` border off · dossier bottom/top hairline | medium |

---

## Improve first

**#1 — Raise photograph to 320px (D) / 260px (T/P).** Highest leverage toward SOTD media presence; cheap; unlocks #2 overlay to sit on a serious image plane.

---

**Stop (improve-ui).** Unpublished canvas must be published (or previewed in editor) before live taste matches this audit. Which findings → `design-plans/`? (`1` / `1+2` / `all`)
