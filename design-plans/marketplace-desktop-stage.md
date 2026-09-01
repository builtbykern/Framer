# Marketplace Desktop stage — Wave Dot Link

Written against: unavailable  
Executed: 2026-07-19 · session `3` · project renamed live as `WaveDotLink`

## Design language
- Audited surface: `/` Desktop breakpoint (`WQLkyLRf1`) chrome around WaveDotLink
- Design sources: existing color styles (`Background`, `Text`, `Text Muted`); Marketplace listing convention (one hero composition)
- Documented decisions: product name as brand signal; component remains the interactive hero; no edit to `WaveDotLink.tsx`
- Governing owners: Desktop stage frames + RichText chrome
- Explicit exceptions: None documented

## Findings (pre-change)
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Two competing WaveDotLink instances on Desktop | Serialize: `Demo` + `Wave Link Preview` | One composition only | Desktop | High |
| 2 | Stage too short / nested padding for Marketplace screenshot | Desktop ~390px height, Demo padding 80 inside Desktop 80 | Desktop 1200×900, single Stage, padding 140×96 | Desktop | High |
| 3 | No product framing — component alone reads as unfinished canvas | No title/eyebrow/caption | Eyebrow + Clash Display title + one caption | Desktop chrome | High |

## Improve first
Finding 1+3 together: one Marketplace stage with product name above the live component.

## Changes applied (chrome only)
1. Desktop `WQLkyLRf1` → 1200×900 white stage, centered, overflow visible
2. `aD0V2O9xQ` renamed Stage — gap 48, no nested padding
3. Eyebrow `FRAMER MARKETPLACE` · Title `Wave Dot Link` (Clash Display 56) · Caption one sentence (Inter 15 / #6B6B6B)
4. Instance `D86aoiS2J` kept as hero (component code untouched)
5. Verify: green

## Scope
- Inherit: Desktop only
- Exclude: `WaveDotLink.tsx`, Phone/Tablet (not requested), publish
