# 023 — Stop serializing step exit+enter with mode="wait"

- **Status**: DONE
- **Commit**: n/a (no git HEAD; SoT `state/QuoteIntake.tsx` Version: 3.9.1)
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 1 file, ~20 lines

## Problem

`AnimatePresence mode="wait"` forces exit to finish before enter. With exit 180ms + enter 340ms (or 240ms after 021), Next/Back feels sticky (~420–520ms dead air).

```tsx
/* state/QuoteIntake.tsx:799-801 — current */
<AnimatePresence mode="wait">
    <motion.div ref={bodyRef} key={step} {...stepAnim} style={{
        display: "flex", flexDirection: "column", gap: secGap, width: "100%",
    }}>
```

```tsx
/* state/QuoteIntake.tsx:529-533 — current stepAnim when motionOk */
initial: { opacity: 0, transform: "translateY(14px)" },
animate: { opacity: 1, transform: "translateY(0px)", transition: ENTER_TRANSITION },
exit: { opacity: 0, transform: "translateY(-8px)", transition: EXIT_TRANSITION },
```

## Target

```tsx
<AnimatePresence mode="sync" initial={false}>
```

And tighten exit so overlap does not double-expose content:

```tsx
const EXIT_TRANSITION = { duration: 0.14, ease: EASE_OUT }
```

Enter distances (keep after 021 duration):

- `initial.transform`: `"translateY(10px)"` (slightly less than 14px — overlapping enters read cleaner)
- `exit.transform`: `"translateY(-6px)"`
- Opacity crossfade only; no layout animation (`layout` prop must stay off).

If double-expose is visible in feel-check, add during transition only:

- `filter: blur(2px)` on exiting node via `exit: { opacity: 0, transform: "translateY(-6px)", filter: "blur(2px)" }` — blur ≤ 2px (AUDIT max soft mask; never > 20px).

Prefer no blur first; add only if sync crossfade looks muddy.

## Repo conventions to follow

- `motionOk && bodyInView` gate on `stepAnim` stays.
- Full transform strings, not `y` shorthand.
- `initial={false}` on Presence avoids first-mount flash on canvas/preview.

## Steps

1. Change `mode="wait"` → `mode="sync"` and add `initial={false}` on `AnimatePresence`.
2. Set `EXIT_TRANSITION.duration` to `0.14`.
3. Optionally reduce enter/exit translate distances as in Target.
4. Feel-check; only then add `filter: blur(2px)` on exit if needed.
5. Push, typecheck, verify.

## Boundaries

- Do NOT remove `AnimatePresence` or `key={step}`.
- Do NOT animate width/height of the step body.
- Do NOT change focus management (`headingRef` focus on step) — keep as-is.
- Do NOT change success screen (outside Presence).
- Depend loosely on 021 (shorter enter) but can ship alone.

## Verification

- **Mechanical**: typecheck 0; verify OK.
- **Feel check**:
  - Spam Next/Back — no long empty gap; overlapping fade is OK if readable.
  - @ 10%: exit and enter tracks overlap in time (not strictly sequential).
  - Reduced motion: still zero movement via `motionOk`.
- **Done when**: Presence is not `wait`; total perceived swap ≤ ~300ms with 021 applied.
