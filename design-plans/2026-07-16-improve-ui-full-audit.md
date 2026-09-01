# Improve UI — full site audit (2026-07-16, post-unification)

Read-only. No product edits.

## Design language
- Audited surface: Arbour — all sitemap routes (marketing, listing, CMS detail, 404)
- Design sources: presets `Arbour/*`; tokens Paper/Ink/Olive/Ink Soft/Parchment; Properties Hero opener; content band **`128px 48px 128px 48px`**
- Documented decisions: Display 84 secondary openers; Home hero untouched; 404 cinematic (no Nav/Footer); About Beat 1 rich opener keeps pad `120/48/48/48` + height `820` + image; CMS media heroes out of opener redesign
- Governing owners: Hero Copy `72px 48px 56px 48px`, gap `24`, mw `1200`; content band `128`; Nav `ynpqYJGOd` + Footer
- Explicit exceptions: Home `Hero Section`; `/404`; About Beat 1 fixed height / asymmetric pad; CMS media hero chrome

## Coherence verified
- Canvas Paper + Nav/Footer on all routes except `/404`
- **0** remaining `120px 48px 120px 48px` content bands (24× at 128)
- Properties Grid → 128; detail Setting/Particulars/Continue/Enquiry/More From → 128
- Secondary Hero Copy pads/gaps align (Properties/Notes/Neighbourhoods/Contact)
- About Beat 1: gap 24 + mw 1200; Contact Opening Body → Ink token

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Contact opener title stack uses gap 20 inside an otherwise standard Hero Copy (gap 24) | `/contact` `Contact Hero` → `Hero Copy` gap **24** / mw **1200**; nested `Native Enquiry Copy` gap **20** / mw **940**. Opener contract = Properties Hero Copy gap **24**. | SET `Native Enquiry Copy` `gap="24px"` (keep mw 940 if title measure is intentional) | `/contact` Contact Hero | High |

## Improve first
Finding **1** — only remaining proven opener-contract violation after the padding unification; small, deterministic fix.

---

Rejected (not findings): Market Context `80/48/16` (dark compact strip ≠ Paper editorial band); Opening Note `32px 0` (local meta, not section band); About Beat 1 pad `120/48/48/48` (documented exception); 404 shell (documented exception).

Executed 2026-07-16: Finding 1 → `Native Enquiry Copy` (`qxIyvg6PE`) gap `20px` → `24px` (mw 940 preserved). Plan: `design-plans/2026-07-16-contact-native-enquiry-gap.md`.
