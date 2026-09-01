# 085 — Align Reveal Tooltip ease to AUDIT ease-out

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: LOW
- **Category**: Cohesion & tokens / Easing & duration
- **Estimated scope**: 1 file, 1 constant

## Problem

Custom ease is close but not the house AUDIT token:

```ts
/* code-components/RevealTooltip.tsx:115 — current */
const EXPAND_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
```

AUDIT strong ease-out:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
```

## Target

```ts
const EXPAND_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1]
```

Use this single tuple everywhere `EXPAND_EASE` is referenced (shell, smooth expand, label, pixel cells).

## Repo conventions to follow

- improve-animations AUDIT.md ease-out token — copy exactly, do not approximate
- Keep one constant; do not scatter duplicate beziers

## Steps

1. Replace the four numbers in `EXPAND_EASE` with `0.23, 1, 0.32, 1`.
2. Push `push-revealtip.mjs` (session pinned to Reveal Tooltip sandbox).

## Boundaries

- Do NOT change durations here (see plan 083).
- Do NOT rename exports or controls.

## Verification

- **Mechanical**: `typeErrors: []`.
- **Feel check**: hover open still ease-out (fast start); no ease-in sluggishness.
- **Done when**: only one ease tuple and it matches AUDIT `--ease-out`.
