# 038 — Live seed + tip harden + ghost dim

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Physicality / Missed opportunity
- **Estimated scope**: 1 file
- **Note**: Executed directly on user request (elevate further, no Auto Demo).

## What shipped

1. **Live seed** — `onPointerMove` + rAF updates `seeds` only; cascade `order` frozen from enter.
2. **Mask refresh** — `seedVersion` MotionValue bumps so `useTransform` re-paints when seed moves at constant progress.
3. **Tip harden** — core/mid lerp `72→82` / `86→92` with `t`; cover from HARD core.
4. **Ghost dim** — ghost opacity `1 - 0.18 * progress`.
5. **No Auto Demo** — still hover-only.

## Verification

- Push `Akt2aXG` `typeErrors: []`; `verify.mjs` ready.
- Feel: drag pointer across headline mid-hover — ink origins follow; no cascade restart hitch.
