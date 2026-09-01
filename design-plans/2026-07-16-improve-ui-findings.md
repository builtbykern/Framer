# Improve UI — post-coherence re-audit (2026-07-16)

Read-only. Plans not written until findings are selected.

## Design language
- Audited surface: Arbour marketing + listing + detail + 404 (Framer project `CmRyHJKPrPE6BZhC6d4S`)
- Design sources: text presets `Arbour/*`, color tokens Paper/Ink/Olive/Ink Soft/Chartreuse; Properties Hero as secondary-page opener contract
- Documented decisions: Display 84; secondary heroes = Paper + Meta + Display + Body/Subhead; Home hero untouched
- Governing owners: presets + tokens above; shared Nav `ynpqYJGOd`, Footer `pXUahiblU`
- Explicit exceptions: Home `Hero Section` layout/type; CMS detail media heroes (`/properties-2/:Properties`, `/notes/:Journal`)

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Contact has two consecutive Display heroes (Contact Hero + Contact Opening) after cinematic→Paper conversion — redundant hierarchy | `/contact` Desktop: `Contact Hero` + `Contact Opening` both use `Arbour/Display` + Paper | Demote Opening title to `Arbour/Heading` (or fold Opening into body under one hero) | `/contact` | High |
| 2 | Neighbourhoods / Notes still carry large freehand type in non-hero sections (e.g. “How We Read A Place” Fraunces 56, manifesto blocks) while heroes are system-bound | Pre-pass audit + section inventory; heroes now presets, body sections not fully swept | Bind section titles → `Arbour/Heading`/`Display`, decks → `Body`/`Subhead`, Meta kickers → Olive token | `/neighbourhoods`, `/notes` (non-hero) | High |
| 3 | `Arbour_ArticleCard` still uses Inter for card titles and assorted rgb defaults (only `rgb(0,0,0)`→Ink patched) | Code file `emg8ovC` title fontFamily Inter; PropertyCard already Fraunces/Space Mono | Align card title stack to Fraunces (Heading-scale) + tokenized ink/olive defaults | `Arbour_ArticleCard.tsx` | Medium |

## Improve first
Finding **1** — Contact dual Display heroes: highest user-visible inconsistency introduced by the coherence pass, smallest correction cost.

---

Select 1 / 2 / 3 (or a combo) to receive self-contained `design-plans/` execution plans.


## Status
Executed 2026-07-16 (404 reverted; UI 1–3 + motion verified/fixed).
