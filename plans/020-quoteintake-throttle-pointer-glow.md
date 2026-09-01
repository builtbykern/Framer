# 020 — Throttle pointer glow; stop backdrop-filter thrash

- **Status**: DONE
- **Commit**: n/a (no git HEAD; SoT `state/QuoteIntake.tsx` Version: 3.9.1)
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file, ~40 lines

## Problem

Every `mousemove` on the card root calls `setPtr`, which rewrites an inline `radial-gradient` while `backdropFilter: blur(28px)` is active. That forces continuous React re-renders and expensive paint under the cursor.

```tsx
/* state/QuoteIntake.tsx:444-449 — current */
const onPtr = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!motionOk || isMob || !rootRef.current) return
    const r = rootRef.current.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return
    startTransition(() => setPtr({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }))
}, [motionOk, isMob])
```

```tsx
/* state/QuoteIntake.tsx:741-753 — current (excerpt) */
<div ref={rootRef} … onMouseMove={onPtr}
    style={{
        …
        background: `radial-gradient(ellipse 90% 80% at ${ptr.x * 100}% ${ptr.y * 100}%, color-mix(in srgb, ${colors.accent} 16%, transparent), rgba(3, 5, 10, 0.55) 58%)`,
        backdropFilter: "blur(28px) saturate(1.08)",
        WebkitBackdropFilter: "blur(28px) saturate(1.08)",
        …
    }}>
```

## Target

Pick **one** of these end states (prefer A):

**A — rAF throttle + CSS variables (preferred)**  
- Store glow position on the root via `el.style.setProperty("--glow-x", …)` / `--glow-y` inside a single `requestAnimationFrame` loop (coalesce multiple moves to one paint).
- Background uses `var(--glow-x)` / `var(--glow-y)` so React does **not** re-render on pointer move.
- Remove `ptr` React state (or keep only initial defaults for SSR/canvas).
- Keep `backdropFilter` static (no change to blur amount while moving).

**B — Freeze glow**  
- Set glow once on mount (or first enter) at `{ x: 0.28, y: 0.22 }`; remove `onMouseMove` entirely when motion is for atmosphere only.

```css
/* target background (A) */
background: radial-gradient(
  ellipse 90% 80% at var(--glow-x, 28%) var(--glow-y, 22%),
  color-mix(in srgb, <accent> 16%, transparent),
  rgba(3, 5, 10, 0.55) 58%
);
```

Values: `--glow-x` / `--glow-y` as percentages strings e.g. `"42%"`.  
rAF: at most **one** style write per frame.  
Still gate: no tracking when `!motionOk` or `isMob` (unchanged).

## Repo conventions to follow

- SSR: guard `window` only if adding listeners; existing `typeof ResizeObserver` pattern nearby.
- `startTransition` for React state updates elsewhere — do **not** use React state for per-frame glow if choosing A.
- Exemplar of canvas/reduced kill: `motionOk = !isOnCanvas && !reduced` at L405.

## Steps

1. Implement A (or B if A blows the ≤1000 line budget — file is ~974 lines; keep net growth ≤ ~25 lines).
2. Remove `ptr` / `setPtr` React state if unused after A.
3. Ensure initial CSS vars match prior default `0.28` / `0.22` → `28%` / `22%`.
4. Keep `backdropFilter` / `WebkitBackdropFilter` strings identical unless B also drops blur (do **not** drop blur in this plan).
5. Push to Framer, typecheck 0, verify.

## Boundaries

- Do NOT change card border, padding, noise overlay, or layout breakpoints.
- Do NOT animate `backdrop-filter` itself.
- Do NOT add GSAP / new deps — `framer-motion` + React only.
- Do NOT touch step / estimate motion (plans 019, 021, 023).
- If root style structure drifted, STOP and report.

## Verification

- **Mechanical**: typecheck 0; verify.mjs non-blocking; line count still ≤ 1000.
- **Feel check**:
  - Desktop: move pointer across card — glow may follow, but Performance panel should not show React commit storms every event (prefer quiet main thread; one style update/frame).
  - Mobile / reduced-motion / canvas: glow stays at default; no tracking.
  - Visual: blur glass still present; no flicker.
- **Done when**: pointer tracking does not `setState` every mousemove; backdrop-filter is not rewritten each move.
