# Animation plans — Halden

| # | Title | Severity | Status |
| --- | --- | --- | --- |
| 001 | Route Drift Plane stills through PageVeil | HIGH | DONE |
| 002 | Open MENU as a 320ms paper drawer | HIGH | DONE (superseded by 003 — keep instant variant; drop the 16px sheet fade) |
| 003 | Open MENU as SOTD paper from the wordmark | HIGH | DONE |
| 055 | Series Stills reduced-motion keeps opacity fade | MEDIUM | DONE |
| 056 | Phone Series card tap scale 0.97 | MEDIUM | DONE |

## Execution order

1. `design-plans/halden-nav-full-bleed.md` — unlock 1440 `maxWidth` on Nav roots.
2. `003-halden-menu-sotd-paper.md` — clip-path paper + pane stagger. Depends on (1) so the paper breakout is not fighting a 1440 cap.

### Phone Home Work List (2026-08-19) — no deps between these; canvas first, then code, then tap

1. `design-plans/halden-phone-series-meta-label.md` — Meta Line → Label + muted.
2. `design-plans/halden-phone-stills-index-plex.md` — indexFont → IBM Plex Mono.
3. `design-plans/halden-phone-stills-stack-gap.md` — Home Stack gap 28.
4. `055-halden-series-stills-reduced-motion-fade.md` — push Series_Stills.
5. `056-halden-phone-series-tap-scale.md` — Series `tapEffect` 0.97 / 160ms.

## Notes

- Phone Work List plans: session **1**. Rebind Higher-Beet URL; confirm `getProjectInfo().name === "Halden"`. Older 001–003 notes said `-s 2` (pre-relay).
- Do not publish unless the user asks.
- PageVeil stays the **route** wash (490ms). Menu open is clip-path from the bar (400ms ease-drawer), not PageVeil blur.
- Logo Menu Roll idle HALDEN⇄MENU is locked; 003 must not retune it.
- 002’s instant variant morph is still correct (do not tween height). 002’s whole-sheet `y=16` fade is the thing 003 removes.
