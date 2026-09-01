# 077 — Dive Field: pause rAF when document hidden

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (visibility listener)
- **Audit finding**: improve-animations Dive Field 2026-08-04-restore #6
- **Pairs with**: **080** (same push OK)
- **Note**: evening 153 was REVERTED as a batch; re-specify visibility only here

## Problem

`IntersectionObserver` pauses when off-screen, but a **visible tab that is backgrounded** (`document.hidden`) can keep intersecting and burn rAF / GPU while the user is elsewhere.

Evidence (`code-components/DiveField.tsx` ~1084–1091):

```tsx
const io = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? true
    if (inView) kick()
    else if (raf !== 0) {
        cancelAnimationFrame(raf)
        raf = 0
    }
})
io.observe(root)
```

No `visibilitychange` listener.

## Target

```tsx
const onVisibility = () => {
    if (document.hidden) {
        if (raf !== 0) {
            cancelAnimationFrame(raf)
            raf = 0
        }
    } else if (inView) {
        kick()
    }
}
document.addEventListener("visibilitychange", onVisibility)
// cleanup: document.removeEventListener("visibilitychange", onVisibility)
```

Optional (clearer): treat hidden as not runnable inside `needsFrame`:

```tsx
if (document.hidden) return false
```

at the top of `needsFrame` — plus the listener so an in-flight rAF is cancelled immediately.

## Repo conventions to follow

- Mirror IO cancel/kick pattern already in file.
- Push: `node scripts/framer/push-divefield.mjs`.

## Steps

1. Add `visibilitychange` listener + cleanup in the WebGL effect.
2. Optionally guard `needsFrame` with `document.hidden`.
3. Push + verify.

## Boundaries

- Do NOT change IO logic beyond composing with visibility.
- Do NOT change autoScroll defaults.
- Do NOT add pointerleave here (**080**).
- If visibility pause already exists, STOP and report.

## Verification

- **Mechanical**: push + verify green.
- **Feel check**: start diving → switch tab → CPU/GPU quiet; return → dive resumes / kick paints. Foreground behave as today.
- **Done when**: `document.hidden` cancels rAF; visible + inView kicks again.
