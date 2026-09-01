# 050 — Contact Dock chat ↔ × icon crossfade

- **Status**: DONE (executed 2026-07-31 with 048/051 — icon crossfade 0.14s; push+verify OK)
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 1 file (`code-components/ContactDock.tsx`)
- **Audit**: missed opportunity 1
- **Constraint**: Crossfade only — do not change `onClick={toggle}`

## Problem

Orb icon hard-swaps Chat ↔ Close:

```tsx
// ContactDock.tsx ~623–627 — current
{open ? (
    <CloseIcon color="#fff" size={Math.round(orbSize * 0.36)} />
) : (
    <ChatIcon color="#fff" size={Math.round(orbSize * 0.38)} />
)}
```

## Target

Add module constant (near other constants):

```ts
const EASE_OUT = [0.23, 1, 0.32, 1] as const
```

Replace ternary with nested `AnimatePresence` inside the orb button (button already `display: grid; placeItems: center`):

```tsx
<AnimatePresence mode="popLayout" initial={false}>
    <motion.span
        key={open ? "close" : "chat"}
        initial={
            reduced
                ? false
                : { opacity: 0, transform: "scale(0.92)" }
        }
        animate={{ opacity: 1, transform: "scale(1)" }}
        exit={
            reduced
                ? { opacity: 0, transition: { duration: 0.08 } }
                : {
                      opacity: 0,
                      transform: "scale(0.92)",
                      transition: {
                          duration: 0.14,
                          ease: EASE_OUT,
                      },
                  }
        }
        transition={
            reduced
                ? { duration: 0.08 }
                : { duration: 0.14, ease: EASE_OUT }
        }
        style={{
            display: "grid",
            placeItems: "center",
            gridArea: "1 / 1",
        }}
    >
        {open ? (
            <CloseIcon
                color="#fff"
                size={Math.round(orbSize * 0.36)}
            />
        ) : (
            <ChatIcon
                color="#fff"
                size={Math.round(orbSize * 0.38)}
            />
        )}
    </motion.span>
</AnimatePresence>
```

Never `scale(0)`. Duration **0.14s**, ease AUDIT strong ease-out `[0.23, 1, 0.32, 1]`.

Ensure orb button `style` uses `display: "grid"` (already) so `gridArea: "1 / 1"` stacks for crossfade. If stacking fails, wrap icons in a `span` with `position: "relative"` and make icon span `position: "absolute"` inset 0 grid — prefer gridArea first.

## Steps

1. Add `EASE_OUT`; replace icon ternary as Target.
2. Push + verify.
3. Mark DONE.

## Boundaries

- Do NOT morph SVG paths.
- Do NOT add rotation.
- Do NOT call `focus()` on open.
- Do NOT change sheet AnimatePresence / toggle.

## Verification

- **Mechanical**: `rg 'key=\\{open' code-components/ContactDock.tsx` → icon span; push `typeErrors: []`.
- **Feel check**: open/close — icons dissolve ~140ms, no hard cut; click still toggles sheet.
- **Done when**: no hard cut between chat and ×.
