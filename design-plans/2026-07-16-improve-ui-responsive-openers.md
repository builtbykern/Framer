# Improve UI — secondary openers (responsive) 2026-07-16

Read-only. No product edits.

## Design language
- Audited surface: Arbour — secondary marketing openers (`/properties-2`, `/notes`, `/neighbourhoods`, `/contact`) including Desktop / Tablet / Phone Hero Copy breakpoints
- Design sources: Properties Hero Copy contract (Desktop `72px 48px 56px 48px`, gap `24px`, mw `1200`); sibling tablet/phone Hero Copy overrides on Neighbourhoods + Contact as live exemplars
- Documented decisions: Display 84 secondary openers; Home hero untouched; `/404` cinematic; About Beat 1 rich opener exception (`120/48/48/48`, h `820`, image)
- Governing owners and consumers: Desktop Hero Copy pad/gap; Tablet Hero Copy pad `72px 40px 56px 40px` (Properties / Neighbourhoods / Contact); Phone Hero Copy pad `64px 24px 48px 24px` + gap `24` (Notes / Neighbourhoods / Contact pattern)
- Explicit exceptions: Home `Hero Section`; `/404`; About Beat 1 fixed height / asymmetric pad; CMS media heroes

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Phone Hero Copy gap is 20 on Notes and Properties while sibling openers keep 24 | Desktop Hero Copy gap **24** everywhere. Phone: Notes `INUKgvAnaNPRkgYRMH` gap **20**; Properties `EK6d5SyWLL9uNRqah7` gap **20**; Neighbourhoods `Qonafp_oDI1ekolXeW` + Contact `jEM0wBo2vAATw4pip9` gap **24**. | SET both phone Hero Copy nodes `gap="24px"` | `/notes`, `/properties-2` Phone | High |
| 2 | Properties Phone Hero Copy padding diverges from the Notes/Neighbourhoods/Contact phone opener | Phone Hero Copy: Notes/Hoods/Contact `64px 24px 48px 24px`; Properties `EK6d5SyWLL9uNRqah7` `64px 16px 40px 16px`. Same opener role. | SET Properties phone Hero Copy `padding="64px 24px 48px 24px"` | `/properties-2` Phone | High |
| 3 | Notes Tablet Hero Copy still uses Desktop horizontal pad while siblings use 40px | Tablet Hero Copy: Properties/Hoods/Contact `72px 40px 56px 40px`; Notes `LptqEiXVpNPRkgYRMH` still `72px 48px 56px 48px`. | SET Notes tablet Hero Copy `padding="72px 40px 56px 40px"` | `/notes` Tablet | High |

## Improve first
Finding **1** — gap contract is already binding on Desktop and on Phone for two sibling openers; Notes + Properties phone are the only remaining gap drift after the Contact desktop fix.

---

Rejected: content-band `120` (0 remaining); Contact Native Enquiry gap (already `24`); Collection Discovery / grid inner pads (not Hero Copy owners); About Beat 1 pad (documented exception); Market Context `80/48/16` (dark strip ≠ Paper opener).

## Plans (selected: all)

1. `design-plans/2026-07-16-phone-hero-copy-gap.md`
2. `design-plans/2026-07-16-properties-phone-hero-pad.md`
3. `design-plans/2026-07-16-notes-tablet-hero-pad.md`
