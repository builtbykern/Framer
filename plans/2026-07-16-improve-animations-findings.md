# Improve Animations — post-coherence findings (2026-07-16)

Read-only survey. Full `PLAN-TEMPLATE` plans only after selection.

## Recon
- Stack: Framer canvas appear effects + `framer-motion` / CSS in code components
- High-frequency: PropertyCard hover/press; Nav drawer open; link hovers
- Marketing: section appear on scroll; LoadingScreen; Footer appear (prior pass: y=16, 0.4s)
- Personality: editorial real-estate — restrained, not playful

## Findings
| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| 1 | MEDIUM | Cohesion & tokens | Nav drawer link hover (component `ynpqYJGOd`) | Prior audit noted drawer link hover still at `scale 1.1` / large travel vs tablet siblings at `scale 1` + `x 8px` | Cap drawer link hover to `scale 1.02` or `x 8px`, tween ≤160ms, ease-out |
| 2 | MEDIUM | Easing & duration | Footer appear (page instances) | Appear uses ~0.4s — OK for marketing enter, but confirm ease is strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)` not default ease-in | Set enter transition to tween 0.4s with that curve; `replay=false` |
| 3 | LOW | Performance / a11y | `Arbour_PropertyCard` CSS hover `scale(1.04)` | Hover scale present + `prefers-reduced-motion` respected; verify duration ≤220ms and no layout props animated | Confirm CSS only `transform`/`opacity`; duration 160–220ms; reduced-motion → no scale |
| 4 | LOW | Missed opportunity | Secondary Paper heroes (Notes/Neighbourhoods/Contact/404) | After layout change, heroes may lack a shared soft enter (opacity + y) matching Properties Hero | Optional: appear opacity 0→1, y 12→0, 0.4s ease-out, once — only if Properties Hero already has it |

## Missed opportunities
1. Shared appear recipe for all Paper heroes (see #4).
2. ScrollCue idle motion pause when off-screen (if looping).
3. LoadingScreen exit already gated on detail — keep; don’t add VT.

## Next
Reply with finding numbers to generate `plans/NNN-*.md` executables. Do not implement until selected.


## Status
Executed 2026-07-16 (404 reverted; UI 1–3 + motion verified/fixed).
