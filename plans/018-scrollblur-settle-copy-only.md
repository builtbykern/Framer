# 018 — Settle control copy (if 016 not run)

- **Status**: SKIP (016 landed)
- **Commit**: unavailable (no HEAD); stamp date 2026-07-19
- **Severity**: LOW
- **Category**: Cohesion
- **Estimated scope**: 1 file, 1 line

## Problem

Settle is an idle timeout, but the panel copy can be read as fade duration. Finding 4 from the 2026-07-19 audit.

```tsx
/* .tmp/BuiltByKern_ScrollBlur.tsx:335 — current */
description: "Idle time after scroll before the blur hides.",
```

## Target

If plan **016** is executed, this plan is **SKIP / DONE** (016 already sets the description).

Otherwise only:

```tsx
description:
    "Idle delay after the last scroll before hide (not a fade).",
```

## Repo conventions to follow

- Property `description` strings are short Marketplace panel help text.

## Steps

1. Check whether 016 already updated the string — if yes, mark this DONE and stop.
2. Else replace the `settleMs.description` string exactly as above; push; typecheck; verify.

## Boundaries

- Do NOT change defaultValue here unless also executing 016.
- Do NOT add fade/Transition controls.

## Verification

- **Done when**: panel help text includes “not a fade”, or this plan is marked SKIP because 016 landed.
