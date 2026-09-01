# Improve UI — CMS detail (2026-07-16)

Read-only. No product edits.

## Design language
- Audited surface: Arbour CMS detail — `/properties-2/:Properties` (`OhRUQROL4`) and `/notes/:Journal` (`YPPO8pJ92`), Desktop / Tablet / Phone
- Design sources: content band owner Desktop `128px 48px 128px 48px`; Property detail Tablet peers Setting / Particulars / Continue `96px 40px 96px 40px`; Enquiry CTA Desktop/Tablet gap `24px`
- Documented decisions: CMS media hero chrome out of Paper opener redesign; marketing content bands at 128; secondary Hero Copy responsive owners (verified still aligned post prior fix)
- Governing owners and consumers: Property detail content bands (`The Setting`, `Property Particulars`, `Continue Your Search`, `Enquiry CTA`); Journal `More From Journal` at Desktop 128
- Explicit exceptions: Home hero; `/404`; About Beat 1; CMS media/header chrome (`lODMk6Egu` `120/48/112`, gallery, chapter strips `80/48/80`)

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Property Enquiry CTA Tablet padding is 88 while sibling content bands on the same breakpoint use 96 | Tablet: Setting / Particulars / Continue = `96px 40px 96px 40px`; Enquiry CTA `IQmBTrFpbWy9_asNQu` = `88px 40px 88px 40px`. Desktop Enquiry already matches peers at `128`. | SET Enquiry CTA Tablet `padding="96px 40px 96px 40px"` | `/properties-2/:Properties` Tablet | High |
| 2 | Property Enquiry CTA Phone gap drops to 20 while Desktop/Tablet Enquiry keep 24 | Enquiry CTA: Desktop/Tablet gap **24**; Phone `MrTKJzwELWy9_asNQu` gap **20** (pad already matches peers `64/16/64/16`). | SET Enquiry CTA Phone `gap="24px"` | `/properties-2/:Properties` Phone | High |

## Improve first
Finding **1** — clearest sibling content-band contradiction on the Property detail Tablet stack; Desktop already correct.

---

Rejected: Property header `120/48/112` and gallery/chapter `80` strips (CMS media/chapter chrome ≠ Paper content bands); Journal body wrap `56/48/120` (article measure); More From progressive gaps 40→32→28; secondary openers (already aligned after prior plans).

## Plans (selected: both)

1. `design-plans/2026-07-16-enquiry-cta-tablet-pad.md`
2. `design-plans/2026-07-16-enquiry-cta-phone-gap.md`
