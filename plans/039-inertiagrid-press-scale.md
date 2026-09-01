# 039 — Press scale feedback on InertiaGrid tiles

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: LOW
- **Category**: Physicality / Feedback opportunity
- **Estimated scope**: 1 file, ~15 lines
- **Depends**: 033 (composite transform on **media**; press lives on **button** wrapper)
- **Project**: Framer `PBghPP85VH1cuE7BNtzx`, `Kern_InertiaGrid`

## Problem

Tiles render as `<motion.button>` / `<button>` with `cursor: pointer` but no press feedback. Enter/Space only `preventDefault` — no navigation added by this plan. Subtle press scale is allowed at exploration frequency (tens/day) if kept near-imperceptible.

```tsx
/* state/InertiaGrid.tsx.snapshot:728-747 — current */
<motion.button
    ref={itemRef}
    style={{
        ...buttonStyle,
        willChange: isAnimating ? "transform" : "auto",
    }}
    onKeyDown={handleKeyDown}
    initial={entranceAnimation.initial}
    whileInView={entranceAnimation.animate}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ /* spring entrance */ }}
    aria-label={item.alt}
>
```

No `whileTap` / `:active` scale.

## Target

On the **button wrapper only** (not on the media that carries physics `transform`):

```tsx
whileTap={{ scale: 0.97 }}
```

Press transition must not fight entrance spring forever — scope tap transition:

```tsx
transition={{
    // existing entrance spring fields for whileInView…
    type: "spring",
    stiffness: 80,
    damping: 22,
    mass: 1.2,
    delay: staggerDelay,
    duration: entrance.duration,
}}
```

Framer Motion applies `whileTap` with its own transition if provided as:

```tsx
whileTap={{ scale: 0.97 }}
// and ensure tap uses:
// transition for tap: prefer per-gesture via
```

Preferred explicit form:

```tsx
whileTap={{ scale: 0.97 }}
transition={{
    layout: false,
    // default for whileTap when using array form — use:
}}
```

Simplest reliable pattern for this codebase:

```tsx
<motion.button
  whileTap={physicsOk || entranceOk ? { scale: 0.97 } : undefined}
  transition={{
    scale: { duration: 0.16, ease: [0.23, 1, 0.32, 1] },
    // keep opacity / other entrance props on spring — if conflict,
    // split: entrance transition on opacity/y via variants; tap only scale on button
  }}
/>
```

If combining spring entrance + tap scale on the same node fights, use **variants** for entrance and leave `whileTap` scale with:

```ts
transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
```

only on tap by using:

```tsx
whileTap={{ scale: 0.97, transition: { duration: 0.16, ease: [0.23, 1, 0.32, 1] } }}
```

Values (AUDIT.md): scale **0.97**, duration **160ms**, ease-out **`cubic-bezier(0.23, 1, 0.32, 1)`** → Motion array `[0.23, 1, 0.32, 1]`.

Under `prefers-reduced-motion`: skip `whileTap` scale (opacity entrance from 035 remains).

Do **not** add `onClick` navigation, links, or URL controls.

## Repo conventions to follow

- AUDIT.md press feedback: `scale(0.97)`, `160ms`, ease-out.
- Physics transform stays on child media (033); button scale is separate — avoids composing press into inertia transform.

## Steps

1. Confirm 033: physics `transform` on img/placeholder, not on button.
2. Add `whileTap` with exact values; gate off when reduced motion.
3. Resolve transition conflict so entrance still runs once.
4. Static canvas buttons: no whileTap required (canvas tree is non-motion).
5. Push + verify.

## Boundaries

- Do NOT add click-through / link props.
- Do NOT apply whileTap scale on the media node that carries inertia transform.
- Do NOT use scale ≤ 0.95.
- Do NOT change keyboard handler beyond existing preventDefault unless required for a11y (out of scope).

## Verification

- **Mechanical**: verify.mjs OK.
- **Feel check**: Pointer down on tile → subtle 0.97 press; release restores. Hover physics still works. Reduced motion: no press scale.
- **Done when**: whileTap 0.97 / 160ms ease-out on button; no new navigation API.
