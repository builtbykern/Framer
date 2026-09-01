# 004 — Align default easings to AUDIT ease-out

- **Status**: DONE
- **Commit**: none (repo has no commits; stamp against local `.tmp/BuiltByKern_ScrollBlur.tsx` + Framer code file `yC_uQFE`)
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file, ~10 lines (no-op if plan 002 already landed)

## Problem

Near-duplicate easings that almost match AUDIT `--ease-out`:

```tsx
/* .tmp/BuiltByKern_ScrollBlur.tsx:62-72 — current */
ease: [0.22, 1, 0.36, 1],  // fade in
ease: [0.33, 0, 0.2, 1],   // fade out — closer to ease-in-out, weaker exit snap
```

AUDIT token:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
```

## Target

Single shared constant used by all default tweens:

```tsx
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]
```

Apply to `DEFAULT_FADE_IN`, `DEFAULT_FADE_OUT`, and (if present) `DEFAULT_FADE_OUT_FINAL` from plan 002.

If plan 002 is already done and already uses `[0.23, 1, 0.32, 1]`, mark this plan **DONE** with no code change.

## Repo conventions to follow

- Framer single-file component: one named constant at module scope (no separate tokens.css — Marketplace constraint).
- Keep `resolveTransition` behavior; designer-supplied Transition ease still wins when valid.

## Steps

1. If `EASE_OUT` / `[0.23, 1, 0.32, 1]` already on all defaults → status DONE, stop.
2. Else introduce `EASE_OUT` and replace both default ease arrays.
3. Push only if code changed; typecheck + verify.

## Boundaries

- Do NOT change durations in this plan unless 002 was skipped and you are bundling — prefer executing 002 for durations.
- Do NOT change spring sanitize rules.

## Verification

- **Mechanical**: grep file for ease arrays — only `[0.23, 1, 0.32, 1]` (or `EASE_OUT`) in defaults; no `[0.22, 1, 0.36, 1]` / `[0.33, 0, 0.2, 1]` left on defaults.
- **Feel check**: enter still ease-out (fast start); exit not sluggish at the start (old fade-out ease felt more ease-in-out).
- **Done when**: defaults share AUDIT ease-out values.
