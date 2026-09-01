# 001 — Disable Territory Pair appear replay

- **Status**: TODO
- **Commit**: unavailable
- **Severity**: HIGH
- **Category**: Purpose & frequency
- **Estimated scope**: 1 Framer page node (+ breakpoint replicas if local)

## Problem

Directory cards re-run their entrance every time they re-enter the viewport while scrolling `/neighbourhoods`. That is high-frequency scroll motion and feels sluggish/repetitive.

Current (`t8SpOTSDb` Territory Pair):

```
appearEffect.trigger = onInView
appearEffect.threshold = 0.15
appearEffect.replay = true
appearEffect.enter.opacity = 0
appearEffect.enter.y = 24
appearEffect.enter.transition = "tween 0.22,1,0.36,1 0.7s 0s"
```

Also seen on collection list wrapper / breakpoint copies with `replay=true` (serialize showed ~9 replay nodes including Territory Pair replicas).

## Target

Keep the first-view entrance; never replay:

```
appearEffect.replay = false
```

Preserve trigger `onInView`, threshold `0.15`, enter opacity `0`, y `24`, transition string unchanged (`tween 0.22,1,0.36,1 0.7s 0s`). Marketing duration 0.7s is acceptable for occasional first paint of the directory.

Reduced motion: Framer appearEffect respects OS reduced-motion when available; do not add custom JS.

## Repo conventions to follow

- Canvas motion via `appearEffect` DSL on Arbour pages
- Existing tween curve already used on Notes/Neighbourhoods: `0.22,1,0.36,1` (strong ease-out family)
- Exemplar pattern after fix: first-view only entrances (Notes title `xEORYedqg` uses `onMount` without replay)

## Steps

1. Session Arbour; `pagePath: "/neighbourhoods"`.
2. `SET t8SpOTSDb appearEffect.replay=false` (keep other appearEffect fields).
3. Check replicas: `aJLpuUP0qt8SpOTSDb`, `Qonafp_oDt8SpOTSDb` — set `appearEffect.replay=false` if overridden.
4. If `km7dUqZI9` (Territory Checkerboard) has `appearEffect.replay=true`, set `false` as well (avoid double replay on list).
5. Do not change hover on the pair.

## Boundaries

- Do NOT change Photo Card hover (plan 002).
- Do NOT change cinematic hero appears (plan 003).
- Do NOT add stagger in this plan.
- Do NOT edit code components.

## Verification

- **Mechanical**: `node scripts/framer/verify.mjs --page /neighbourhoods` → ok; serialize `t8SpOTSDb.appearEffect.replay === false`.
- **Feel check**: load `/neighbourhoods`, scroll past directory, scroll back up — cards must **not** fade/slide again. First load may still animate once.
- **Done when**: replay is false on desktop + breakpoints; no visual regression in layout.

## Suggested motion (from opportunities)

N/A — this is a removal/constraint, not new motion.
