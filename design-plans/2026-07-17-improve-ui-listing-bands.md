# Improve UI — listing & secondary-band audit (2026-07-17)

**Executed 2026-07-17** via Framer session `3` (findings 1–3 → color tokens). Not published.

Canvas session `3` · project `CmRyHJKPrPE6BZhC6d4S`.

## Design language
- Audited surface: Arbour — secondary marketing openers + listing/content-band family (`/properties-2`, `/notes`, `/neighbourhoods`, `/contact` Journal + Opening, peer `/about` Enquiry CTA)
- Design sources: Framer canvas serialize (live); `docs/projects/arbour.md`; accepted owners from `design-plans/2026-07-16-improve-ui-full-audit.md`, `design-plans/2026-07-16-improve-ui-cta-underline.md`, `template-plans/REPORT-arbour-postfix-reaudit.md`; color styles Ink / Ink Soft / Olive / Racing Deep
- Documented decisions: Secondary Hero Copy Desktop `72px 48px 56px 48px`, gap `24`, maxWidth `1200`; Paper content bands `128px 48px 128px 48px`; text CTAs with proven `→` + href → `Arbour_UnderlineLink` + Olive; brand text colors bind color-style tokens (not hard RGB); Chartreuse kickers kept as editorial accent
- Governing owners and consumers: Hero Copy openers (Properties `L9uNRqah7`, Notes `NPRkgYRMH`, Neighbourhoods `I1ekolXeW`, Contact `AATw4pip9`); content bands (Properties Grid / Market Editorial / Enquiry CTA / Contact Opening / Journal Manifesto); Enquiry CTA composition (Properties `cFtWJlabj`, About `OIVgjc19d`); color styles Ink `e2f9a9eb-668a-4021-80d9-b04413b5f392`, Ink Soft `0bc68d0d-4c0b-4126-8cce-9425cb153f4e`, Racing Deep `9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04`, Olive `a16d0333-6bd5-4d60-aa00-fac26447145d`
- Explicit exceptions: Home hero; `/404` cinematic (no Nav/Footer); About Beat 1 rich opener `120px 48px 48px 48px` + height `820`; CMS media heroes; Chartreuse editorial kickers; Nav/Footer Ink chrome (not UnderlineLink)

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Enquiry CTA action label still bakes Racing Deep as hard RGB | Contract: brand fills/text use color-style tokens (same owner class as executed Olive/Ink hard-RGB → token plans). Runtime: `/properties-2` Enquiry CTA `cFtWJlabj` → `z4s1V3Jha` “ARRANGE A VIEWING” Meta `textColor: rgb(21, 43, 30)` (= Racing Deep light); replicas `SScKalu3Bz4s1V3Jha`, `EK6d5SyWLz4s1V3Jha`. Peer `/about` Enquiry `OIVgjc19d` → `tgyIYRpq7` same RGB; replicas `xvqDXw58etgyIYRpq7`, `CYNrpU04ttgyIYRpq7`. Sibling kicker/heading on both bands already use Olive/Ink tokens. | SET those Meta nodes `textColor="var(--token-9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04)"` (Racing Deep). Do not invent href / UnderlineLink (no link on node; prior CTA audit rejected enquiry labels without proven `→`+href). | Properties + About Enquiry CTA (Desktop/Tablet/Phone) | High |
| 2 | Contact Journal heading uses hard Ink RGB beside tokenized Meta | Contract: Ink color style owns near-black editorial headings (exemplar Market Editorial Heading `QLFQUOYXM` → Ink token). Runtime: `/contact` Journal `R3nS8tMqV` → Heading `cVLdkLcS3` “Perspectives on place & property.” `Arbour/Heading` + `textColor: rgb(28, 27, 22)`; replicas `qjv2S9WpacVLdkLcS3`, `jEM0wBo2vcVLdkLcS3`. Sibling Meta `xvtcI6cj9` already Olive token. | SET `cVLdkLcS3` (+ replicas) `textColor="var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"`. | `/contact` Journal band | High |
| 3 | Market Editorial supporting type uses hard Ink Soft rgba | Contract: Ink Soft owns muted body/meta on Paper (Continue Copy `VhuRERf8g` binds Ink Soft token). Runtime: `/properties-2` Market Editorial `APChY780b` → deck `fWEtnTZY0` freehand Inter 18px `textColor: rgba(28, 27, 22, 0.55)` (= Ink Soft light); location line `zvGdeCucM` same rgba. Sibling Heading already Ink token; market kicker already Olive token. | SET `fWEtnTZY0` and `zvGdeCucM` `textColor="var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)"`. Keep freehand metrics (do not invent Body/Meta preset without resolved-size proof). | `/properties-2` Market Editorial | High |

## Improve first
Finding **1** — same broken token binding on the shared Enquiry CTA action label across Properties and About (six breakpoint nodes), next to kickers that already use Olive tokens.

---

Rejected (not findings): Secondary Hero Copy pads/gaps (aligned `72/48/56/48` + gap `24`); Notes Hero Copy missing `maxWidth` (parent Notes Hero already `1200` — no proven layout delta); About Beat 1 `120…` (documented exception); Chartreuse card-pill RGB (Chartreuse kickers kept); Property Card legacy frames (`visible: false`); dual Display on Contact (none); UnderlineLink conversion for “ARRANGE A VIEWING” (no href / no `→`); ArticleCard Inter/Fraunces hard fonts (Inter/Fraunces documented in project typography — no preset-binding contract for code cards).
