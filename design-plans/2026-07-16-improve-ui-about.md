# Improve UI — About (2026-07-16)

Read-only. No product edits.

## Design language
- Audited surface: Arbour `/about` (`OdFhPn9yz`) — Beats, Chapters, Enquiry CTA across Desktop / Tablet / Phone
- Design sources: content band Desktop `128px 48px 128px 48px`; Tablet content peers Manifesto / Principals / Offices `96px 40px 96px 40px`; Enquiry CTA Desktop/Tablet gap `24px`; Beat 1 Opening Copy gap `24px` (prior About alignment to Properties Hero)
- Documented decisions: Beat 1 rich opener exception — pad `120/48/48/48`, height `820`, image kept; Home hero / `/404` / CMS media heroes out of scope
- Governing owners and consumers: Beat 3 Manifesto, Chapters, Enquiry CTA; Beat 1 Opening Copy gap owner `24px`
- Explicit exceptions: Beat 1 section pad/height/image (and cinematic Beat 2 overlay chrome)

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | About Enquiry CTA Tablet padding is 88 while sibling content bands use 96 | Tablet Manifesto / Principals / Offices = `96px 40px 96px 40px`; Enquiry `xvqDXw58eOIVgjc19d` = `88px 40px 88px 40px`. Desktop Enquiry already `128`. | SET Enquiry CTA Tablet `padding="96px 40px 96px 40px"` | `/about` Tablet | High |
| 2 | About Enquiry CTA Phone gap is 20 while Desktop/Tablet keep 24 | Enquiry: Desktop/Tablet gap **24**; Phone `CYNrpU04tOIVgjc19d` gap **20** (pad already `64/16/64/16`). | SET Enquiry CTA Phone `gap="24px"` | `/about` Phone | High |
| 3 | Beat 1 Opening Copy gap drifts on Tablet/Phone after Desktop was locked to 24 | Opening Copy: Desktop `QzWTnDkey` gap **24**; Tablet `xvqDXw58eQzWTnDkey` gap **32**; Phone `CYNrpU04tQzWTnDkey` gap **28**. Prior contract: Opening Copy gap **24**. | SET Tablet + Phone Opening Copy `gap="24px"` | `/about` Beat 1 Tablet/Phone | High |

## Improve first
Finding **1** — same Enquiry Tablet pad drift already corrected on Property detail; About still off against its own Tablet content-band peers.

---

Rejected: Beat 1 section pad/height (documented exception); Beat 2 overlay pads (cinematic chrome); chapter maxWidth `1440` (consistent among About bands); progressive chapter gaps.
