# Improve UI — Arbour chrome/listing family (2026-07-17, paired with template-audit)

Read-only. Companion to `template-plans/REPORT-arbour-template-improve-ui-2026-07-17.md`.

## Design language
- Audited surface: Arbour — chrome + listing/content-band families (post Footer Notes/token ship)
- Design sources: live canvas; sibling-typography scan; color styles Ink / Ink Soft / Ink 60 / Olive
- Documented decisions: Hero Copy `72/48/56/48` gap 24 mw 1200; content bands `128`; brand textColor via tokens; Footer Navigate Fraunces cluster aligned
- Governing owners and consumers: Footer Navigate; Home Process/Recognition bands; UnderlineLink Olive CTAs
- Explicit exceptions: Home hero; `/404`; About Beat 1; Chartreuse kickers; CMS media heroes

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Home Process / Recognition (and peers) bake Ink as hard RGB | ≥20 Home nodes with `rgb(28,27,22)` / `rgba(…,0.55\|0.6)` vs Ink / Ink Soft / Ink 60 tokens (same contract as Footer token pass) | Bind Ink `e2f9a9eb-…`, Ink Soft `0bc68d0d-…`, Ink 60 `cf5bf9af-…` | `/` Process + Recognition (+ related) | High |

## Improve first
Finding **1** — only surviving improve-ui finding after chrome/CTA/Footer cleanup; system-level token debt on Home.

Structure/CMS brand issues (Agents `@ashcombevane.co.uk`, Neighbourhoods SEO “Ashcombe & Vane”) live in the template-audit report, not here.
