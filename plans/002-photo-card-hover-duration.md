# 002 — Cap Photo Card hover duration

- **Status**: TODO
- **Commit**: unavailable
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 node (+ breakpoint replicas)

## Problem

Directory photo hover uses a 0.45s spring — above the UI hover budget (≤300ms; press/hover feedback typically 100–200ms). Feels laggy on a surface users skim repeatedly.

Current (`XzTsEtIxm` Photo Card):

```
hoverEffect.scale = 1.03
hoverEffect.transition = "spring-duration 0.45s 0.2 0s"
```

## Target

Subtle, fast hover — transform only:

```
hoverEffect.scale = 1.03
hoverEffect.transition = "tween 0.23,1,0.32,1 0.18s 0s"
```

(Equivalent intent: ~180ms strong ease-out. If DSL requires spring-duration, use `spring-duration 0.18s 0.1 0s` — must stay ≤0.2s.)

Gate: Framer hover is pointer-driven; no extra CSS needed. Do not raise scale above 1.03.

Reduced motion: if Framer disables hover motion under reduced-motion, accept; do not invent a code override.

## Repo conventions to follow

- Hover via Canvas `hoverEffect` on frames
- Prefer short tweens with `0.22,1,0.36,1` / `0.23,1,0.32,1` family already on the site
- Exemplar: keep scale 1.03 (already subtle)

## Steps

1. `pagePath: "/neighbourhoods"`.
2. `SET XzTsEtIxm hoverEffect.scale="1.03" hoverEffect.transition="tween 0.23,1,0.32,1 0.18s 0s"`.
3. Mirror on `aJLpuUP0qXzTsEtIxm` / `Qonafp_oDXzTsEtIxm` if they override hover.
4. Leave Territory Pair hover alone unless it also exceeds 0.3s (pair currently scale 1 — no change).

## Boundaries

- Do NOT change appearEffect (plan 001).
- Do NOT animate width/height/padding.
- Do NOT add SoftOrb or new components.

## Verification

- **Mechanical**: serialize hover transition duration ≤0.2s; verify.mjs `/neighbourhoods` ok.
- **Feel check**: hover photo — scale settles quickly; spam hover in/out should feel snappy, not rubbery 450ms.
- DevTools Animations at 10%: confirm ~180ms.
- **Done when**: hover ≤200ms and scale remains 1.03.

## Suggested motion values (AUDIT)

- Duration: 100–160ms press / ~150–200ms small hover UI
- Ease-out curve family: `cubic-bezier(0.23, 1, 0.32, 1)` → Framer tween `0.23,1,0.32,1`
