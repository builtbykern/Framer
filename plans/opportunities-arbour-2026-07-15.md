# Find animation opportunities — Arbour (Framer)

Surface: published Arbour template pages (`/`, `/notes`, `/neighbourhoods`, `/contact`). Stack: Canvas `appearEffect` / `hoverEffect` + `Arbour_InertiaFrame` (Motion). Personality: editorial luxury — prefer restraint.

## Part 1 — Opportunities

| # | Location | Today | Purpose | Frequency | Suggested motion |
| --- | --- | --- | --- | --- | --- |
| 1 | `/neighbourhoods` Territory Pair `t8SpOTSDb` first paint only | Entrance exists but **replays** on every re-entry (fix in plan 001) | Preventing a jarring change (first reveal of directory) | Occasional (first view of section) | After replay=false: keep `opacity 0→1`, `y 24→0`, `tween 0.22,1,0.36,1 0.7s 0s`, `onInView`, **replay false**. Optional stagger **40–60ms** between pairs via collection/appear stagger only if Framer supports without blocking scroll. |
| 2 | `/neighbourhoods` Photo Card `XzTsEtIxm` | Hover scale 1.03 over **0.45s** (too slow) | Feedback | Tens/day | `scale 1.03`, `tween 0.23,1,0.32,1 0.18s 0s` (transform only); `@media (hover:hover)` is Framer-native. Reduced-motion: drop scale, allow opacity if any. |
| 3 | Cinematic heroes Notes / Neighbourhoods / Contact | Mismatched enter recipes (1.1s tween vs spring 0.85s + replay) | Explanation / preventing jarring hero paint | Rare per visit | Unify: `onMount`, `replay false`, `opacity 0`, `y 20`, `scale 1`, `tween 0.22,1,0.36,1 0.85s 0s` (plan 003). |
| 4 | `/notes` SoftOrb under archived grid | Infinite breathe/rotate if ever shown | — | — | **No new motion** — delete (UI plan). Opportunity is absence. |

Cap: 4 rows. No further suggestions passed the gate.

## Part 2 — Rejected

- **Nav / page transitions** — core navigation, very high frequency. **Rejected: Frequency 100+/day. Never animate.**
- **InertiaFrame continuous parallax** — already present; amplifying it. **Rejected: Function — decoration on content the user is reading; current subtle parallax is enough.**
- **Hover scale on every ArticleCard in `/notes` grid** — tens+/day while browsing. **Rejected: Frequency — only near-imperceptible or none; do not add showy hover.**
- **ScrollCue infinite bob** — already implemented with reduced-motion; boosting bounce. **Rejected: Purpose — already feedback; more motion = noise.**
- **Directory map SVG animate** — user replacing with Lummi stills. **Rejected: Function — static illustration should not wiggle.**

## Part 3 — Verdict

Arbour already has enough motion: cinematic opens, light directory enter, inertia photos, scroll cue. The win is **subtraction and alignment** (no replay, shorter hover, one cinematic recipe), not new spectacle. Highest leverage additive moment after fixes: **optional 40–60ms directory stagger** — only with replay off.

Handoff: plans in `plans/001–003`; execute via Framer agent when approved.
