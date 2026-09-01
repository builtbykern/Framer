# 085 — Area Scrub: throttle scrub label text updates

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file (`code-components/AreaScrub.tsx`), ~30 lines

## Problem

When Label is on, every `xScrub` spring frame calls `setLabelText`, forcing React re-renders at scrub frequency (will be worse after Home enables Label).

```tsx
/* code-components/AreaScrub.tsx ~397–404 — current */
useEffect(() => {
  setLabelText(formatAt(xScrub.get()))
  const unsub = xScrub.on("change", (t) => {
    if (!showLabel) return
    setLabelText(formatAt(t))
  })
  return unsub
}, [xScrub, formatAt, showLabel])
```

## Target

Update React label state at most ~30–48ms, and only when the **display string** changes:

```tsx
/* target pattern */
useEffect(() => {
  if (!showLabel) return
  let raf = 0
  let last = 0
  const paint = (t: number) => {
    const next = formatAt(t)
    setLabelText((prev) => (prev === next ? prev : next))
  }
  paint(xScrub.get())
  const unsub = xScrub.on("change", (t) => {
    const now = performance.now()
    if (now - last < 32) {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        last = performance.now()
        paint(t)
      })
      return
    }
    last = now
    paint(t)
  })
  return () => {
    unsub()
    cancelAnimationFrame(raf)
  }
}, [xScrub, formatAt, showLabel])
```

- Guard `typeof performance !== "undefined"` / fallback `Date.now()` if needed for SSR
- Keep `aria-valuetext={labelText}` as-is (updates with throttled text)

## Repo conventions to follow

- `startTransition` already used for scrub boolean state — optional wrap `setLabelText` in `startTransition` for extra deferral
- No new dependencies
- Push `push-areascrub.mjs`

## Steps

1. Replace the label `useEffect` with throttled + string-equality pattern above.
2. Push; confirm no type errors.
3. Feel-check with Label on (Home after design plan show-label, or temp control).

## Boundaries

- Do NOT remove label; Do NOT use `role="application"`
- Do NOT change `formatAt` / `valueOnCubic`
- Prefer after design plan Home show-label if testing on Preview

## Verification

- **Mechanical**: push clean; verify green
- **Feel check**:
  - Label on + fast scrub: text updates smoothly without UI hitch
  - React Profiler (optional): far fewer commits than spring frames
  - Reduced-motion: still updates (direct X)
- **Done when**: Label string updates ≤ ~30fps equivalent; scrub spring still 60fps on transform
