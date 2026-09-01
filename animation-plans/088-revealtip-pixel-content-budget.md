# 088 — Cap pixel content delay inside tooltip budget

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Easing & duration
- **Estimated scope**: 1 file, `PixelPanel` content timing only
- **Supersedes regression of**: `083-revealtip-duration-budget.md` (DONE enter budget; Codrops path added up to 0.45s content wait)

## Problem

Tooltip readable content waits too long. AUDIT.md tooltips: **125–200ms**. Current content layer delay can hit **0.45s** before title/body fade.

```tsx
/* code-components/RevealTooltip.tsx:601-604 — current */
const contentDelay =
    freeze || !animated
        ? 0
        : Math.min(0.45, cells * STAGGER * 0.55 + 0.08)
```

```tsx
/* code-components/RevealTooltip.tsx:729-736 — current */
transition={
    freeze
        ? { duration: 0 }
        : {
              duration: 0.2,
              ease: EXPAND_EASE,
              delay: contentDelay,
          }
}
```

With default 4×4 and `STAGGER = 0.02`, delay ≈ 0.216s plus 0.2s fade → content late for a tip.

## Target

```tsx
const CONTENT_MS = 120
const CONTENT_DELAY_CAP = 0.08 // seconds

const contentDelay =
    freeze || !animated
        ? 0
        : Math.min(CONTENT_DELAY_CAP, cells * STAGGER * 0.35 + 0.02)

// content motion.div transition:
{
    duration: CONTENT_MS / 1000, // 0.12
    ease: EXPAND_EASE,
    delay: contentDelay,
}
```

Cell assemble may still stagger lightly; **title must be readable by ~200ms from open** (shell 125ms + delay ≤80ms + fade 120ms overlapping is OK if perceived ≤200ms — feel-check).

Also reduce default stagger pressure if needed: keep `STAGGER = 0.02` but use `0.35` factor above so max delay hits the cap quickly without 0.45.

## Repo conventions to follow

- AUDIT tooltip budget 125–200ms
- `EXPAND_EASE = [0.23, 1, 0.32, 1]`
- Exemplar timing: `SHELL_MS = 125`, `LABEL_MS = 120` already in file

## Steps

1. In `PixelPanel`, replace `contentDelay` formula with `Math.min(0.08, cells * STAGGER * 0.35 + 0.02)`.
2. Change content transition `duration: 0.2` → `CONTENT_MS / 1000` with `const CONTENT_MS = 120` next to other MS constants (or inline `0.12`).
3. Pin `DHpXX5x` → `node scripts/framer/push-revealtip.mjs` → `typeErrors: []`.

## Boundaries

- Do NOT remove cell stagger entirely.
- Do NOT change SmoothTip timings.
- Do NOT change Force Open / hover logic.
- Do NOT raise delay cap above 0.08.
- If `contentDelay` symbol missing (drift), STOP.

## Verification

- **Mechanical**: push clean; `node scripts/framer/verify.mjs`.
- **Feel check**: Preview Tip Bottom — title/body legible within ~200ms of hover. Animations panel 10%: content delay ≤80ms, duration 120ms.
- **Reduced motion**: `freeze` → delay 0 / duration 0.
- **Done when**: no content enter path uses `delay > 0.08` or `duration > 0.2` on the content layer.

## Key Learnings for executor

1. Re-pin sandbox before every push.
