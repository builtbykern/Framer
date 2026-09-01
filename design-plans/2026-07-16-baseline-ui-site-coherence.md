# Baseline UI + site coherence (Arbour) — 2026-07-16

Read-only. `/baseline-ui` applied for conversation constraints.

## Scope note

Arbour is a **Framer canvas** site (no local Tailwind/React app). Stack rules from baseline-ui (`Tailwind`, `cn`, `Base UI`/`Radix`, `h-dvh`, `text-balance`) **do not govern** canvas layers.

Applied subset across **all routes** (Home, Properties, Notes, Neighbourhoods, About, Contact, 404, Property detail, Journal detail):

| Baseline rule | Result |
| --- | --- |
| No purple / multicolor gradients | Pass — none found |
| No glow as primary affordance | Pass — none found |
| No gradients unless requested | Existing Racing Deep cinematic overlays on Home / Neighbourhoods / Contact (brand chrome, not AI purple-slop). Not flagged for removal. |
| Interaction feedback ≤ 200ms | Pass in attribute scan (no >200ms hover/transition attrs found) |
| One accent | Olive/Racing system intact; no competing accent found |

## Coherence gaps still open (spacing owners)

Same contracts already used on Properties / openers; leftover breakpoint drift:

| # | Surface | Problem | Contract | Runtime | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | `/about` Enquiry CTA Tablet | pad 88 vs peers 96 | Tablet bands `96/40/96/40` | `xvqDXw58eOIVgjc19d` `88/40/88/40` | pad → `96px 40px 96px 40px` |
| 2 | `/about` Enquiry CTA Phone | gap 20 | Enquiry gap `24` | `CYNrpU04tOIVgjc19d` gap `20` | gap → `24px` |
| 3 | `/about` Opening Copy T/P | gap 32 / 28 | Opening Copy gap `24` | Tablet `32`, Phone `28` | both → `24px` |
| 4 | `/contact` Native Enquiry T/P | gap 16 / 14 | Native Enquiry Desktop `24` | Tablet `qjv2S9WpaqxIyvg6PE` `16`; Phone `jEM0wBo2vqxIyvg6PE` `14` | both → `24px` |

## Already coherent (verified)

- Secondary Hero Copy Desktop/Tablet/Phone pads + gaps (Notes/Properties/Hoods/Contact Hero Copy)
- Property detail Enquiry CTA Tablet/Phone (fixed prior)
- Contact Desktop Native Enquiry gap `24`
- No purple/glow site-wide

## Improve first

**Batch 1–4 in one Framer pass** — all are the same class of breakpoint gap/pad drift against owners already proven on sibling pages.

## Status

Executed 2026-07-16 via Framer `applyChanges` (one pass):
1. About Enquiry Tablet pad → `96/40/96/40`
2. About Enquiry Phone gap → `24`
3. About Opening Copy T/P gap → `24`
4. Contact Native Enquiry T/P gap → `24`

Verified serialize. Unpublished.
