# 051 — Archive Preview hairline underline fast + left origin

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file (`code-components/ArchivePreview.tsx`), ~25 lines

## Problem

Active-row hairline underline uses `openTransition`, which clamps duration to **0.36–0.65s** (Gate plate budget). That runs on every active row (tens/session) — too slow for a state indicator. Origin is `center`, so the line expands from the middle of the title instead of reading with the word.

```tsx
/* code-components/ArchivePreview.tsx:554-564 — openTransition (Gate budget) */
const openTransition: Transition = freezeMotion
    ? { duration: 0 }
    : {
          ...DEFAULT_TRANSITION,
          ...transition,
          duration:
              typeof transition?.duration === "number"
                  ? Math.min(Math.max(transition.duration, 0.36), 0.65)
                  : 0.48,
          ease: EASE_OUT,
      }
```

```tsx
/* code-components/ArchivePreview.tsx:1137-1156 — current hairline */
<motion.span
    aria-hidden
    initial={false}
    animate={{
        scaleX: isOpen ? 1 : 0,
        opacity: isOpen ? 1 : 0,
    }}
    transition={openTransition}
    style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -7,
        height: 1,
        background: hairlineColor,
        transformOrigin: "center",
        // …
    }}
/>
```

## Target

Decouple hairline from Gate `openTransition`.

| Property | Value |
| --- | --- |
| duration | `0.18` (within AUDIT UI &lt; 300ms; tooltip/popover band 125–200ms) |
| ease | `EASE_OUT` = `[0.23, 1, 0.32, 1]` (existing constant) |
| properties | `scaleX` + `opacity` only |
| `transformOrigin` | `"left"` (or `"left center"`) |
| `freezeMotion` | `{ duration: 0 }` |

```ts
const hairlineTransition: Transition = freezeMotion
  ? { duration: 0 }
  : { type: "tween", duration: 0.18, ease: EASE_OUT }
```

Gate plate (`scaleX` / `scaleY` on peek shell) **keeps** `openTransition` + buyer `motion.transition` control when `entrance === "gate"`.

## Repo conventions to follow

- Existing `EASE_OUT` / `crossTransition` pattern at L566–574 — mirror that for hairline
- Property control description already says Open is “Gate timing only” — keep that true in code
- Push: `push-archivepreview.mjs` · session `1BEQetqTKUu5Ah95oeVd`

## Steps

1. Add `hairlineTransition` next to `crossTransition`.
2. Pass `transition={hairlineTransition}` on the title underline `motion.span`.
3. Set `transformOrigin: "left"`.
4. Leave Gate peek `openTransition` and Dissolve paths untouched.
5. Push + verify.

## Boundaries

- Do NOT change Gate duration clamp or `DEFAULT_TRANSITION` (0.52).
- Do NOT add press feedback (optional opportunity — out of scope).
- Do NOT touch dissolve WebGL.
- No publish.

## Verification

- **Mechanical**: push → `typeErrors: []`; verify → `blocking: false`.
- **Feel check**:
  - Hover rows: underline draws in ~180ms from the **left**, not a slow center bloom.
  - Gate mode: peek plate still uses buyer Open transition (0.36–0.65).
  - DevTools 10% speed: underline clearly faster than Gate plate open.
  - `prefers-reduced-motion`: underline snaps (`duration: 0`).
- **Done when**: hairline no longer uses `openTransition`; origin left; Gate Open control still drives plate only.
