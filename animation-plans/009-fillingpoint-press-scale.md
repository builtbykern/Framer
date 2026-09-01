# 009 — FillingPoint press scale feedback

- **Status**: DONE

## Outcome

Press scale 0.97 with 160ms/100ms ease-out on `motion.a` / `motion.button`.
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Physicality & origin
- **Estimated scope**: 1 file (`code-components/Kern_FillingPoint.tsx`)

## Problem

CTA has no `:active` / pointer-down scale. Press feels dead vs SOTD micro-interaction bar.

Current: no pressed state; root is static `<a>`/`<button>`.

## Target

While pointer is down: root `transform: scale(0.97)`.
- Down transition: `160ms` `cubic-bezier(0.23, 1, 0.32, 1)`
- Up transition: `100ms` same curve
- Animate transform only (GPU)
- Gate with fine pointer optional; press OK on touch

## Repo conventions

- AUDIT.md press feedback `0.97` / `160ms` ease-out
- Push: `node scripts/framer/push-fillingpoint.mjs`

## Steps

1. Add `pressed` state; `onPointerDown` set true; `onPointerUp`/`onPointerCancel`/`onPointerLeave` set false (leave also clears press).
2. Wrap root with `motion.a` / `motion.button` OR animate style transform via motion component.
3. `animate={{ scale: pressed ? 0.97 : 1 }}` with transition durations above.
4. Push + verify.

## Boundaries

- Do NOT add magnetic pull
- Do NOT animate width/height
- Do NOT remove focus-visible ring

## Verification

- Feel: press compresses slightly, snaps back
- `verify.mjs` non-blocking
- Reduced-motion: still allow press scale (feedback) OR opacity-only — keep press scale (≤160ms feedback)
