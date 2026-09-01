# Improve UI — re-audit after pad/token pass (2026-07-16)

Read-only. Plans only if selected.

## Design language
- Audited surface: Arbour site (marketing, listing, CMS detail, 404)
- Design sources: `Arbour/*` presets; Paper/Ink/Olive/Ink Soft/Parchment tokens; Properties Hero opener; content band **`128px 48px 128px 48px`** (Home/About owner, now applied to listing/marketing)
- Documented decisions: Display 84 secondary openers; Home hero intact; 404 cinematic; CMS media heroes out of opener redesign; About Beat 1 keeps pad `120/48/48/48` + height `820` with image
- Governing owners: Properties Hero Copy `72/48/56/48` gap 24 mw 1200; content band 128; Nav `ynpqYJGOd` + Footer
- Explicit exceptions: Home `Hero Section`; `/404`; CMS detail media heroes; About Beat 1 fixed height + asymmetric top pad

## Verified fixed (prior findings)
- Marketing/listing content bands at 128 (18 instances); no remaining `120px 48px 120px 48px` on those pages
- Contact Opening Body → Ink token
- About Beat 1: mw 1200, Opening Copy gap 24

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | CMS detail pages still use the old `120px 48px` content band on sections that already match listing names now at 128 | `/properties-2/:Properties` `Continue Your Search` + `Enquiry CTA`; `/notes/:Journal` `More From Journal` — pad **`120px 48px 120px 48px`**. Same role as listing Enquiry/Continue now at **128**. | SET those three sections to `128px 48px 128px 48px` | Detail: Properties + Journal | High |
| 2 | About Beat 1 outer stack gap still 48 while Opening Copy gap is 24 | Beat 1: `gap: 48px`; Opening Copy: `gap: 24px` (Properties Hero Copy standard). Internal contradiction in the same opener. | SET Beat 1 section `gap` to `24px` (keep height 820 + image) | `/about` Beat 1 | High |
| 3 | Properties Grid vertical padding still off the unified band | `/properties-2` `Properties Grid` pad **`88px 48px 120px 48px`** while sibling Market Editorial / Enquiry / Continue are **`128px 48px 128px 48px`**. | SET Properties Grid padding to `128px 48px 128px 48px` | `/properties-2` | Medium |

## Improve first
Finding **1** — finishes the 120→128 unification on the remaining live surfaces (detail pages) that users hit after listing.

---

## Status
Executed 2026-07-16: (1) detail bands → 128 (incl. Setting/Particulars), (2) About Beat 1 gap 24, (3) Properties Grid → 128.
