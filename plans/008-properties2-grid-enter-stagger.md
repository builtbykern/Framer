# 008 — Optional Properties Grid enter stagger

- **Status**: DONE
- **Commit**: unavailable
- **Severity**: LOW
- **Category**: Missed opportunity / Cohesion
- **Estimated scope**: canvas nodes on `/properties-2` (6 link wrappers or 6 PropertyCard instances) OR code-only if executor prefers component `delay`

## Problem

On first visit to `/properties-2`, the six residence cards appear fully formed with no entrance bridge. Occasional frequency (page load) makes a short stagger eligible. Must stay decorative and never block clicks.

Grid structure (desktop):

| Slot | Collection list | Link wrapper | PropertyCard |
| --- | --- | --- | --- |
| 0 | `D1P7aRrFn` | `lIX6py1V0` | `WVombBjcj` |
| 1 | `pRqXyIBTy` | `RDH5AtXpi` | `LY7Xl0038` |
| 2 | `UhyYcOvrq` | `A75jx2rot` | `wfrBfUhOA` |
| 3 | `OxIL_2pDw` | `WDIyslCI4` | `ZnSLoFoz2` |
| 4 | `yD_sJK28R` | `JkbmjatIk` | `ymLH5EXzH` |
| 5 | `H_OmXeJng` | `KuTSRdGCu` | `FLn5Uk9as` |

Tablet prefix `SScKalu3B`, phone prefix `EK6d5SyWL`.

## Target

**Preferred (canvas appearEffect on each link wrapper)** — matches site pattern used on Footer `wssGwbNHc`:

For index `i` in `0..5`, on desktop link id `L`:

```
appearEffect.trigger = "onInView"
appearEffect.threshold = "0.15"
appearEffect.replay = "false"
appearEffect.enter.opacity = "0"
appearEffect.enter.y = "12"
appearEffect.enter.x = "0"
appearEffect.enter.scale = "1"
appearEffect.enter.transition = "tween 0.23,1,0.32,1 0.28s <delay>"
```

Delay per card: `i * 0.04` seconds → `0s`, `0.04s`, `0.08s`, `0.12s`, `0.16s`, `0.20s`.

Framer transition string form (match project DSL):

```
tween 0.23,1,0.32,1 0.28s 0.04s
```

(duration **0.28s**, delay **0.04s × i**, ease-out cubic).

Do **not** set `replay=true` (avoids re-trigger jank on scroll).

Apply the same appearEffect on tablet/phone replica link ids (`SScKalu3B` + id / `EK6d5SyWL` + id) only if those replicas do not already inherit; if SET on desktop propagates, do not double-apply.

**Alternative (code-only)** — only if canvas appearEffect cannot target ComponentInstance children cleanly: add optional `enterDelay` number control to `Arbour_PropertyCard` and stagger via `transition={{ delay: enterDelay }}` on a one-shot `initial`/`animate` opacity+y. Prefer canvas approach first.

## Repo conventions to follow

- Site already uses `appearEffect` with `tween 0.22,1,0.36,1` / spring-duration recipes; this plan standardizes on **tween `0.23,1,0.32,1` 0.28s** + stagger **40ms**
- Exemplar: Footer node `wssGwbNHc` on `/properties-2` already has onInView appear (but `replay: true` and 0.7s spring — **do not copy replay or 0.7s**; only reuse the onInView mechanism)
- Stagger 30–80ms band from AUDIT — pick **40ms**

## Steps

1. Confirm link wrapper ids still match the table (serialize `D1P7aRrFn` children). If renamed, STOP and report.
2. `pagePath: "/properties-2"`.
3. For each desktop link id, `SET <id> appearEffect.trigger="onInView" appearEffect.threshold="0.15" appearEffect.replay="false" appearEffect.enter.opacity="0" appearEffect.enter.y="12" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.28s <i*0.04>s"`.
4. Check tablet/phone replicas; set only if appearEffect missing.
5. `node scripts/framer/verify.mjs --page /properties-2`.
6. Do not publish unless asked.

## Boundaries

- Do NOT change PropertyCard hover/press (006/007) or typography design-plan.
- Do NOT set `replay=true`.
- Do NOT use duration >0.3s per card or stagger >80ms.
- Do NOT animate width/height/filter blur on enter.
- Do NOT stagger filter bar or hero.

## Verification

- **Mechanical**: each link wrapper has `replay=false`, enter y=12, transition duration 0.28s, delays 0–0.20s; verify.mjs ok.
- **Feel check**:
  - Hard refresh `/properties-2`: cards rise in a soft cascade (~40ms steps), finished quickly.
  - Scroll away and back: should **not** replay the cascade.
  - Click a card mid-entrance: navigation still works (stagger must not use pointer-events blocking).
  - Reduced motion: if Framer collapses appearEffect under OS setting, accept; do not add custom JS overrides.
- **Done when**: one-shot enter stagger visible on desktop; no replay; total cascade character < ~0.5s wall time after first card starts.

## Suggested motion values (AUDIT)

- Stagger: 30–80ms → **40ms**
- Enter: opacity 0 + slight y (12px), ease-out, UI ≤300ms → **280ms**
- `cubic-bezier(0.23, 1, 0.32, 1)`
