# 048 — Contact Dock sheet/row transform strings

- **Status**: DONE (executed 2026-07-31 with 050/051 — transform strings; push+verify OK)
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 1 file (`code-components/ContactDock.tsx`)
- **Audit**: finding 5
- **Depends on**: 045 exit values (done)
- **Constraint**: Feel-check open/close; if sheet feels broken, STOP and revert this plan only

## Problem

Sheet and `ChannelRow` use FM `y` / `scale` shorthands (main-thread). AUDIT prefers full `transform` strings.

```tsx
// ChannelRow ~286–287 — current
initial={reduced ? false : { opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}

// Sheet ~422–441 — current uses y + scale keys (exit already has spring 520/36/0.8)
```

## Target

**ChannelRow**

```tsx
initial={reduced ? false : { opacity: 0, transform: "translateY(8px)" }}
animate={{ opacity: 1, transform: "translateY(0px)" }}
```

**Sheet** (preserve 045 springs exactly)

```tsx
initial={
    reduced
        ? { opacity: 1, transform: "translateY(0px) scale(1)" }
        : { opacity: 0, transform: "translateY(12px) scale(0.94)" }
}
animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
exit={
    reduced
        ? { opacity: 0, transition: { duration: 0.1 } }
        : {
              opacity: 0,
              transform: "translateY(14px) scale(0.96)",
              transition: {
                  type: "spring",
                  stiffness: 520,
                  damping: 36,
                  mass: 0.8,
              },
          }
}
transition={
    reduced
        ? { duration: 0.12 }
        : { type: "spring", stiffness: 380, damping: 28 }
}
```

Keep `transformOrigin` bottom left/right. Leave `whileTap={{ scale: 0.97 }}` as-is (049).

## Steps

1. Apply Target to ChannelRow + sheet only.
2. Push + verify.
3. Mark DONE.

## Boundaries

- Do NOT change stagger delays (0.04 / 0.08).
- Do NOT touch pulse CSS, ChannelRow hover CSS, orb focus/glow (051).
- Do NOT change toggle/portal.

## Verification

- **Mechanical**: sheet/ChannelRow animate keys use `transform:` not bare `y:`/`scale:` (except whileTap); push `typeErrors: []`.
- **Feel check**: open rises from orb; close snaps; rows stagger; one-click toggle still works.
- **Done when**: no sheet/row `y`/`scale` shorthand keys; open/close reliable.
