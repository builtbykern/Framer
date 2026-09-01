## Design language
- Audited surface: Arbour `/contact` (Contact Hero → Opening → Pause → Journal)
- Design sources: `docs/projects/arbour.md` (Layout content width; Contact hero H1 rule); taste report `template-plans/REPORT-arbour-audit-ui-taste-contact-2026-08-12.md`
- Documented decisions: Desktop content columns `width`/`maxWidth` **90%**; shells full-bleed `100%` with **no** horizontal pad when wrapping a 90% child; T/P inset via pad X 40/16; Phone hero padTop 136; no mid-word H1 clip at media edge
- Governing owners and consumers: Contact Hero `jmmPpci8t` · Hero Copy `AATw4pip9` · Hero Entrance Media `WLSMm5iy1` · exemplar Opening Stack `f6WUp6SN5` (90%/90%); sibling `/properties` Properties Hero `mGwrwOsDS` (90%/90%)
- Explicit exceptions: Journal card media scrim gradients (M5); Beat 2 overlay gap D=48 (user lock, About — out of scope)

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Contact Hero Desktop copy edge ~21px while Opening/Journal sit on ~73px spine (90%) | Contract: `arbour.md` Desktop content 90%. Runtime: Hero shell `padX 0` + Hero Copy `~54%` / `maxWidth 90%` left-aligned in full-bleed stack; live first-ink med ~21 vs Opening ~73 (`tmp/taste-shots/prod/contact-D.png`). Media `width 90%` as sibling of copy is not a centered 90% row. | Wrap Hero Copy + Hero Entrance Media in Desktop-only inner stack `width`/`maxWidth` **90%** (exemplar `f6WUp6SN5`); set media to `1fr` (not 90% of viewport); keep T/P unchanged | `/contact` Desktop Contact Hero only | High |

## Improve first
Finding 1 — single taste FAIL on `/contact`; T/P already pass; About Phone gutters already fixed on canvas.
