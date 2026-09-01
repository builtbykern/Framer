# Improve UI — Arbour Neighbourhoods territories list

- **Date:** 2026-08-01
- **Commit:** `4aa0cbc`
- **Skill:** `improve-ui` (read-only; no Framer edits)
- **Rendered evidence:** `.tmp/arbour-nh-full-d.png` · `.tmp/arbour-nh-territories-d.png` · `.tmp/arbour-nh-territories-m.png` · compare `.tmp/arbour-props-cards.png`
- **Canvas:** `/neighbourhoods` · Territory Card `i56eWdACt` (+ T/P replicas)

---

## Design language

- **Audited surface:** `/neighbourhoods` → Territory Grid Section → Directory Panel → Territory Checkerboard → Territory Card (dossier | photograph)
- **Design sources:** `docs/projects/arbour.md` (listing-only NH; Paper/Ink/Olive/Chartreuse); prior directory plans `design-plans/2026-07-15-arbour-directory-paper-token.md`, `…-directory-measure-1200.md`; live Properties listing CTA pattern; color styles from `state/last-audit.json`
- **Documented decisions:** Directory Panel Paper + 1200 measure; flush dossier|photo pair (`gap: 0`); NH cards CTA → `/properties`; Property cards use Ink / Ink Soft / Chartreuse tokens
- **Governing owners and consumers:** Territory Card template `i56eWdACt` (CMS repeat); dossier `QAa2V2fag`; Place Reading Intro `v61cPV2xF` + Highlights `sJB1mG6E1`; Cartographic Field `Xb7Sjgfsi`; title CTA mark `d9SNjsdke`
- **Explicit exceptions:** None documented for hiding Cartographic Field or Highlights. Listing-only (no NH detail page) is documented; it does not specify suppressing Highlights on the card.

---

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Territory dossier leaves a large empty mid-band between title and intro | **Contract:** Dossier `QAa2V2fag` is a 3-slot vertical stack (`Place Header` → `Cartographic Field` → `Place Reading`) with `stackDistribution: space-between`. **Runtime:** `Xb7Sjgfsi` Cartographic Field `visible: false`; card height fixed `360px`; live desktop/mobile stills show title pinned top, body pinned bottom, dead cream void in the middle. **Correction:** One change — set dossier `stackDistribution` to `start` and `gap` to `16px` so the two visible zones pack without a void (keeps Field hidden until a separate map decision). | `/neighbourhoods` Territory Card dossier `QAa2V2fag` + T/P replicas `aJLpuUP0qQAa2V2fag`, `Qonafp_oDQAa2V2fag` | high |
| 2 | Highlights (place “reading” list) are authored in CMS but suppressed on every card | **Contract:** Same-page METHOD copy frames each territory as a “working knowledge” / readings; CMS `Highlights` (`ZIEwtEwXa`) is filled on all 4 items; Place Reading already contains Meta/Olive-styled Highlights node `sJB1mG6E1`. **Runtime:** `sJB1mG6E1` `visible: false`; Intro `v61cPV2xF` `textTruncation: "4"` → live ellipsis-only blurbs. **Correction:** Set `sJB1mG6E1` (and BP replicas) `visible: true` so Highlights render under Intro. | Territory Card Place Reading · Desktop `sJB1mG6E1` + tablet/phone replicas | high |
| 3 | Listing CTA mark does not match the Properties directory “VIEW” pattern | **Contract:** Properties listing cards present an explicit Meta **VIEW** affordance in accent (live `/properties`). Territory cards are the parallel directory for places and already use Olive on `d9SNjsdke`, but only as **↗**. **Runtime:** Screenshots — Properties “VIEW” vs NH “↗”; whole card still links to `/properties`. **Correction:** Change `d9SNjsdke` text from `↗` to `VIEW →` and bind `textColor` to Chartreuse `var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)` (Properties accent), plus BP replicas. | Title row CTA `d9SNjsdke` (+ replicas) on Territory Card | medium |

---

## Improve first

**#1 — Remove the dossier empty mid-band** (`space-between` → `start` + gap). Highest leverage: pure layout fix, no copy/CMS risk, immediately tightens every territory card on D/T/P; #2/#3 can layer after.

---

**Stop.** Which findings should become plans under `design-plans/`? (Say e.g. `1`, `1+2`, or `all`.)
