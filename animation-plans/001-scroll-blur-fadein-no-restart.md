# 001 — Stop restarting fade-in on every scroll tick

- **Status**: DONE
- **Commit**: none (repo has no commits; stamp against local `.tmp/BuiltByKern_ScrollBlur.tsx` + Framer code file `yC_uQFE`)
- **Severity**: HIGH
- **Category**: Interruptibility
- **Estimated scope**: 1 file (`.tmp/BuiltByKern_ScrollBlur.tsx` → push to Framer `yC_uQFE`), ~15 lines

## Problem

While strength is climbing toward `1`, every window `scroll` event calls `easeTo(1, …)`, which **stops** the in-flight tween and starts a new one from the current value. Trackpad/wheel fire many events per gesture, so the ramp stutters instead of one continuous ease-out.

```tsx
/* .tmp/BuiltByKern_ScrollBlur.tsx:372-387 — current */
const easeTo = (target: number, transition: Transition) => {
    animRef.current?.stop()
    animRef.current = animate(blurStrength, target, transition)
}

const onScroll = () => {
    lastScrollAtRef.current =
        typeof performance !== "undefined" ? performance.now() : Date.now()

    // Activity window: rise to full strength; ignore micro restarts near 1.
    if (blurStrength.get() < 0.97) {
        easeTo(
            1,
            resolveTransition(DEFAULT_FADE_IN, fadeInRef.current)
        )
    }
    // …
}
```

The `< 0.97` guard only skips restarts when nearly done — not while rising from `0` → `0.9`.

## Target

- Keep a `targetStrengthRef` (or equivalent) that records the **intended** animate target (`0` | `IDLE_STRENGTH_FLOOR` | `1`).
- On scroll: if `targetStrengthRef.current === 1`, **do not** call `easeTo` again — only refresh idle timers / `lastScrollAt`.
- Call `easeTo(1, …)` only when the current target is not already `1` (e.g. after idle floor/dissolve, or first scroll of a session).
- Idle dissolve paths must set `targetStrengthRef` to `IDLE_STRENGTH_FLOOR` then `0` when they call `easeTo`.
- Near-1 skip (`< 0.97`) can remain as an extra guard or be replaced by the target-ref logic; do not rely on it alone.

```tsx
/* target pattern */
const targetStrengthRef = useRef<number | null>(null)

const easeTo = (target: number, transition: Transition) => {
    targetStrengthRef.current = target
    animRef.current?.stop()
    animRef.current = animate(blurStrength, target, transition)
}

// onScroll rise:
if (targetStrengthRef.current !== 1) {
    easeTo(1, resolveTransition(DEFAULT_FADE_IN, fadeInRef.current))
}
```

## Repo conventions to follow

- Single Framer code file: edit `.tmp/BuiltByKern_ScrollBlur.tsx`, then `setFileContent` on code file `yC_uQFE`, `typecheck({ strict: true })`, `node scripts/framer/verify.mjs`.
- Idle hysteresis (`IDLE_STRENGTH_FLOOR`, `FLOOR_HOLD_MS`, `lastScrollAtRef`) must stay — this plan only fixes fade-in restart spam.
- Exemplar of interrupt-safe retarget elsewhere in file: idle path already uses `easeTo` intentionally when **changing** target (floor → 0); mirror that discipline for scroll rise.

## Steps

1. In `BuiltByKern_ScrollBlur`, add `const targetStrengthRef = useRef<number | null>(null)` next to `animRef`.
2. Inside `easeTo`, set `targetStrengthRef.current = target` before `animate(...)`.
3. Replace the `if (blurStrength.get() < 0.97) { easeTo(1, …) }` block with `if (targetStrengthRef.current !== 1) { easeTo(1, …) }`.
4. On effect cleanup, set `targetStrengthRef.current = null` after `animRef.current?.stop()`.
5. Sync initial state in the layout effect that sets strength for reduced-motion / Always On / Follow Scroll: set `targetStrengthRef` to `0.4`, `1`, or `0` respectively when calling `blurStrength.set(...)`.
6. Push to Framer, typecheck, verify.

## Boundaries

- Do NOT change `DEFAULT_FADE_IN` / `DEFAULT_FADE_OUT` durations or easings (plan 002).
- Do NOT change layer count, masks, blur cap, or CSS var write path (plan 003).
- Do NOT add dependencies.
- Do NOT remove idle floor / hold hysteresis.
- If the scroll handler no longer matches this excerpt (drift), STOP and report.

## Verification

- **Mechanical**: After push, Framer `typecheck({ strict: true })` clean; `node scripts/framer/verify.mjs` exit 0.
- **Feel check** (Preview, Follow Scroll, real trackpad):
  - Continuous scroll: veil rises in **one** smooth ramp — no pulsing/stutter mid-rise.
  - Spam scroll while rising: strength keeps climbing toward 1; does not visibly restart from a lower value.
  - After idle dissolve to 0, next scroll starts a fresh rise (target was cleared/changed).
  - DevTools Animations at 10%: confirm a single tween to 1 per scroll session, not one per wheel tick.
  - `prefers-reduced-motion`: calm veil still; no scroll-driven tween.
- **Done when**: Wheel spam during rise does not call `animate(..., 1)` repeatedly (only once until idle path changes target).
