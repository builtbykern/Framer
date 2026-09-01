# Improve UI — cross-page coherence (2026-07-16)

Read-only. No product edits.

## Design language
- Audited surface: Arbour site — marketing, listing, CMS detail, 404 (`CmRyHJKPrPE6BZhC6d4S`)
- Design sources: presets `Arbour/*`; tokens Paper / Ink / Olive / Ink Soft / Parchment; secondary-page opener = Properties Hero (`Hero Copy` `72px 48px 56px 48px`, gap `24px`)
- Documented decisions: Display 84 on secondary openers; Home hero untouched; 404 restored to cinematic (no shared chrome); CMS detail media heroes out of opener redesign
- Governing owners: Properties Hero (openers); Home section band `128px 48px` (editorial rhythm on Home/About/Contact); Enquiry/listing band `120px 48px` on Properties/Notes/Neighbourhoods
- Explicit exceptions: Home `Hero Section`; About Beat 1 rich opener (`120px 48px 48px 48px`, h `820px`, mw `1440px` + image); `/404` cinematic shell; CMS detail media heroes

## Coherence snapshot (what already matches)
- Canvas fill: Paper token on all pages except `/404` (image) — intentional
- Nav + Footer: present on all audited routes except `/404`
- Secondary openers (Properties / Notes / Neighbourhoods / Contact Hero): Paper, `Hero Copy` pad `72/48/56/48`, gap `24`, mw `1200`, Meta+Display + token colors
- Horizontal gutter on content bands: **48px** L/R consistently
- Enquiry CTA (About + Properties): identical `120px 48px 120px 48px` + Parchment

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Two competing vertical content-band paddings for the same role (editorial / journal / process / CTA-adjacent blocks) | Home + About chapters + Contact Opening/Journal use **`128px 48px 128px 48px`** (10 bands). Properties Market/Process/Enquiry + Notes Manifesto + Neighbourhoods Grid/How We Read use **`120px 48px 120px 48px`** (7 bands). Same product task, contradictory rhythm. | Unify listing/editorial secondary bands to one owner: adopt Home/About **`128px 48px 128px 48px`** on the 7 bands currently at 120 (or the reverse if listing rhythm is preferred — pick Home/About as owner). | `/properties-2`, `/notes`, `/neighbourhoods` (named bands above) | High |
| 2 | Contact Opening Body nodes omit explicit `textColor` token while sibling Meta/Heading/Subhead bind Ink/Olive/Ink Soft | `/contact` `Contact Opening`: three `Arbour/Body` nodes with empty `textColor`; nearby Meta/Heading use tokens. Body preset defaults to Ink, but other Opening text binds tokens explicitly — inconsistent owner use on the same section. | Set those Body nodes to `textColor` = `Arbour/Ink` or Ink Soft token (match deck emphasis). | `/contact` Contact Opening | Medium |
| 3 | About Beat 1 opener metrics diverge from Properties Hero contract beyond the documented “rich + image” exception (gap/copyGap/maxWidth/height) | Properties/Notes/Hoods/Contact Hero Copy: gap **24**, mw **1200**, h **auto**. About Beat 1: section pad **120/48/48/48**, gap **48**, Opening Copy gap **40**, mw **1440**, h **820**. Type/tokens already align (Meta+Display). | Keep image; align only spacing owners to Properties Hero where it doesn’t kill the image layout: Opening Copy **gap 24**, section **maxWidth 1200** (or keep 1440 if image needs it — default: gap 24 + copy maxWidth 1104→1200 rhythm). Do not force height auto if image field requires 820. | `/about` Beat 1 | Medium |

## Improve first
Finding **1** — the 120 vs 128 content-band split is the largest cross-page layout inconsistency left after the hero pass; one padding token for “section band” would make every marketing page feel like one system.

---

## Status
Executed 2026-07-16 via Framer: (1) bands → `128px 48px`, (2) Contact Body → Ink token, (3) About Beat 1 copy gap 24 + mw 1200.
