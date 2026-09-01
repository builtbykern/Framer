# 003 — Unify cinematic appear timing

- **Status**: SUPERSEDED by `plans/053-arbour-page-enter-budget.md` (tighter 200–280ms Arbour enter; do not apply the 0.85s cinematic recipe)
- **Commit**: unavailable
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: appearEffect on `/notes`, `/neighbourhoods`, `/contact` cinematic heroes

## Problem

Cinematic entrances use mismatched recipes:

| Location | Current |
| --- | --- |
| `/notes` `ELuMN2aX9` Journal Cinematic | `onMount`, scale 1.04, `tween 0.22,1,0.36,1 1.1s 0s` |
| `/notes` `xEORYedqg` title | `onMount`, y 32, `… 0.85s 0.08s` |
| `/neighbourhoods` `ycUqIc8V3` hero | `onMount`, y 12, `… 0.9s 0s` |
| `/contact` `jmmPpci8t` | `onInView`, replay true, y 28, `spring-duration 0.85s 0.1 0s` |

Same product moment (editorial cinematic open) should share one motion language.

## Target

**Shared cinematic enter** (marketing may exceed 300ms UI cap; cap at **0.85s**):

```
appearEffect.trigger = onMount   // prefer onMount for heroes (once per visit)
appearEffect.replay = false
appearEffect.enter.opacity = 0
appearEffect.enter.y = 20
appearEffect.enter.scale = 1
appearEffect.enter.transition = "tween 0.22,1,0.36,1 0.85s 0s"
```

Child text (title / kicker / deck) may keep short stagger delays **≤0.12s**, same tween curve, duration **≤0.75s**:

```
title:   tween 0.22,1,0.36,1 0.75s 0.06s , y=28, opacity=0
kicker:  tween 0.22,1,0.36,1 0.6s 0s      , y=12, opacity=0
deck:    tween 0.22,1,0.36,1 0.7s 0.12s   , y=16, opacity=0
```

Never `scale(0)`; if scale used on media, max start **1.04** then settle to 1 (Notes cinematic currently 1.04 — either keep 1.04→1 over 0.85s **or** drop to scale 1 + y only for cohesion with Contact). **Prefer opacity + y only** (scale 1) for all three pages.

Contact: change `jmmPpci8t` from spring-duration + replay to the shared tween + `replay=false` + `onMount` (or keep `onInView` if hero is below fold — Contact cinematic is above fold → `onMount`).

## Repo conventions to follow

- Canvas `appearEffect` only
- Curve already site-standard: `0.22,1,0.36,1`
- Exemplar after this plan: all three cinematic bands match

## Steps

1. `/notes`: SET `ELuMN2aX9` appear to shared recipe (scale 1, y 20, 0.85s, onMount, replay false). Align `xEORYedqg` / overlay children delays to title/kicker/deck table if present under `NPRkgYRMH`.
2. `/neighbourhoods`: SET `ycUqIc8V3` to shared recipe; align overlay texts `mGNFNlJAN`, `n9ay7tOtM`, `rWmr0qn1F` if they have appears.
3. `/contact`: SET `jmmPpci8t` to shared recipe (`replay=false`, tween 0.85s, y 20, scale 1, prefer `onMount`).
4. Verify breakpoints do not reintroduce spring-duration 0.85 replay true.

## Boundaries

- Do NOT change InertiaFrame parallax controls.
- Do NOT change directory card appears (plan 001) except if accidentally editing wrong page.
- Do NOT add new code components or easing tokens in CSS (Canvas-only).

## Verification

- **Mechanical**: serialize the three cinematic roots — same transition family `tween 0.22,1,0.36,1`, duration 0.85s, replay false.
- **Feel check**: hard-refresh `/notes`, `/neighbourhoods`, `/contact` — hero entrance should feel like the same product; no second-play on Contact scroll-away-and-back.
- Reduced motion: OS setting — movement should lessen; opacity may remain.
- **Done when**: three pages share the cinematic appear recipe above.

## Suggested motion values (AUDIT)

- Marketing / explanatory: may exceed 300ms; keep ≤0.85s here
- Entering: ease-out → Framer `0.22,1,0.36,1`
- No `scale(0)`; opacity + small y
