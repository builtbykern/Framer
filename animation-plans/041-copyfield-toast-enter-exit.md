# 041 — Copy Field toast enter / exit

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Purpose & frequency / Physicality & origin
- **Estimated scope**: 1 file (`code-components/CopyField.tsx`)
- **Depends on**: design toast chrome (`2026-07-30-copyfield-kern-toast.md`); success phase from 040

## Problem

A toast that pops from `scale(0)` or teleports is a jarring occasional feedback moment. Copy success is rare/occasional — standard animation is correct, but must follow AUDIT physicality.

## Target

Toast visibility tied to `status === "success"` (or `showToast`).

**Enter**

- `opacity: 0 → 1`
- `transform: translateY(8px) scale(0.96) → translateY(0) scale(1)` (single transform string)
- Duration **160ms**
- Ease: `cubic-bezier(0.23, 1, 0.32, 1)` (`EASE_OUT`)

**Exit**

- Reverse to `opacity: 0` + `translateY(8px) scale(0.96)`
- Duration **140ms**, same ease

**Hold**

- Visible **1600ms** after enter completes, then exit; on exit complete → reset to masked (039 reverse) + eye icon (040)

Use `AnimatePresence` **or** Motion presence with interruptible transitions — **not** CSS keyframes. If user copies again during hold, reset the 1600ms timer (retarget).

```ts
const TOAST_ENTER = { duration: 0.16, ease: [0.23, 1, 0.32, 1] as const }
const TOAST_EXIT = { duration: 0.14, ease: [0.23, 1, 0.32, 1] as const }
const TOAST_HOLD_MS = 1600
```

## Repo conventions to follow

- AUDIT: never `scale(0)`; tooltips/small popovers 125–200ms; occasional OK to animate
- Toast chrome from design plan (frosted light)
- Exemplar timing: Filling Point opacity couples under 200ms

## Steps

1. Position toast centered below pill (`position: absolute`, `top: calc(100% + 12px)`, `left: 50%`, `translateX(-50%)` via transform on wrapper carefully — enter animation owns translateY; use flex column parent instead if cleaner: pill + toast in column so toast doesn’t need left 50%).
2. Prefer **column layout**: root column, pill, toast in flow — enter only animates toast opacity + translateY/scale (no competing centering transform).
3. Wire hold timer with cleanup on unmount / re-entry.
4. On exit complete, call reset → masked.

## Boundaries

- Do NOT `scale(0)`.
- Do NOT use `@keyframes`.
- Do NOT change toast colors here (design plan).
- Do NOT block pill clicks while toast is visible.

## Verification

- **Feel check**: toast rises 8px with slight scale; no pop-from-nothing; second copy during hold refreshes timer without flicker restart from zero.
- Reduced-motion handled in 042 — here implement full motion path.
- **Done when**: enter 160 / hold 1600 / exit 140 / then reset.
