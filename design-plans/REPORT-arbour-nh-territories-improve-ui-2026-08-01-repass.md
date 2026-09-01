# Improve UI — Arbour NH territories (post–hover-cycle re-pass)

- **Date:** 2026-08-01
- **Commit:** `4aa0cbc`
- **Live:** https://arbour.framer.website/neighbourhoods · publish `148c08d24`
- **Evidence:** `.tmp/arbour-nh-sotd-repass-d.png` · `.tmp/arbour-nh-sotd-repass-m.png`
- **Owner:** Territory Card `i56eWdACt` + `Arbour_TerritoryHoverMedia` `nMMl08t` / `z2kRrpzAZ`

---

## Design language

- **Audited surface:** `/neighbourhoods` Directory → Territory Card (photo media + Paper dossier)
- **Design sources:** `docs/projects/arbour.md`; live Properties `Arbour_PropertyCard` media plane; prior SOTD plans (`…-image-led`, `…-hover-cycle`)
- **Documented decisions:** Image-led; Hero↔Map hover cycle; VIEW on media; Intro clamp 2; Highlights/Map layers off in dossier; Chartreuse accent
- **Governing owners:** Card template + HoverMedia; sibling Properties listing
- **Explicit exceptions:** None that photo may stay at 320px, that dossier must keep a full hairline box, or that Intro must stay at 2-line mid-sentence ellipsis

---

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Photo band still reads short vs Properties’ media-first listings | **Contract:** Properties listing uses a tall dominant image plane (live exemplar). Territory is the parallel place directory. **Runtime:** Photograph `hX5NduSNi` still `height/min/max: 320px` (T/P 260); stills show ~half card as type slab. **Correction:** Set Desktop photo **`380px`**; Tablet/Phone **`300px`**. | `hX5NduSNi` + T/P replicas | high |
| 2 | Paper dossier keeps a full hairline box under a full-bleed photo → “card-on-card” | **Contract:** Property type block sits under media **without** a second boxed frame around the text stack; directory Paper panel already provides the cream field. **Runtime:** Dossier `QAa2V2fag` `border: 1px solid rgba(28,27,22,0.10)` on live stills. **Correction:** Set dossier `border` to **none** (keep Paper fill + 24px padding). | Dossier D/T/P | high |
| 3 | Intro clamps at 2 lines mid-sentence on every card | **Contract:** Same-page METHOD copy frames territories as “working knowledge”; Body Intro is the only visible reading. **Runtime:** `v61cPV2xF` `textTruncation: "2"` → live ellipsis mid-thought (Chelsea/Notting/Hampstead/Cotswolds). **Correction:** Set Intro `textTruncation="3"`. | Intro RichText D/T/P | medium |

---

## Improve first

**#1 — Raise photo to 380px (D) / 300px (T/P).** Biggest remaining gap to Properties media weight; cheap; makes hover cycle feel cinematic rather than thumbnail-carousel.

---

**Stop (improve-ui).** Which findings → plans? (`1` / `1+2` / `all`)
