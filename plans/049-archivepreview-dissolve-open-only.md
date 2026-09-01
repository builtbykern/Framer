# 049 — Archive Preview dissolve only on closed→open

- **Status**: SUPERSEDED — dissolve between hovers restored (user 2026-08-09); keep soft peak + jump-free overlay
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Purpose & frequency
- **Estimated scope**: 1 file (`code-components/ArchivePreview.tsx`), ~40 lines

## Problem

Chromatic dissolve restarts on **every** `peekIndex` change (row hover / focus). List navigation is tens of times per session — a ~720ms WebGL assemble is too heavy for that frequency. Dissolve should only bridge **closed → open**; row→row already has `crossTransition` (0.16s).

```ts
/* code-components/ArchivePreview.tsx:625-697 — current */
// Subtle chromatic dissolve overlay — sharp video always underneath (no end jump)
useEffect(() => {
    // …
    if (!useDissolve || !open || peekIndex < 0) {
        stop()
        return stop
    }
    setDissolveLive(true)
    // … rAF tick with DISSOLVE_MS …
}, [open, peekIndex, useDissolve, accent, peekOpacity])
```

```ts
/* code-components/ArchivePreview.tsx:189-194 — current */
const DISSOLVE_MS = 720
const DISSOLVE_PEAK = 0.34
```

## Target

1. Run dissolve **only** when transitioning from `open === false` → `open === true` (or first open in a session). Changing `peekIndex` while already open must **not** start a new dissolve — keep sharp video + `crossTransition` only.
2. Optional soft budget (if first-open still feels long): `DISSOLVE_MS = 560` (keep `DISSOLVE_PEAK = 0.34`). Prefer 560; do not raise peak.
3. Keep jump-free stack: sharp `<video>` under fading canvas overlay; clear GL on settle.
4. `freezeMotion` / `!useDissolve`: no dissolve (already true).

Exact gate pattern (executor may use refs — do not invent React state for this unless needed):

```ts
const wasOpenRef = useRef(false)

useEffect(() => {
  const opening = open && !wasOpenRef.current
  wasOpenRef.current = open
  if (!open) {
    // stop / clear as today
    return
  }
  if (!useDissolve || peekIndex < 0 || !opening) {
    // already open + row change: do not setDissolveLive(true)
    return
  }
  // … existing dissolve rAF for this open only …
}, [open, peekIndex, useDissolve, accent, peekOpacity])
```

When `peekIndex` changes mid-open: if a dissolve was running, **cancel** it and clear canvas (row swap should not leave a half-finished overlay). Prefer: if `!opening` and `dissolveLive`, call the same `stop()` / clear path.

Deps may still include `peekIndex` for cancel-on-swap, but **start** only when `opening`.

## Repo conventions to follow

- Single-file Framer component; static freeze in-place — `docs/projects/STATIC_RENDERER.md`
- Ease already matches AUDIT: `EASE_OUT = [0.23, 1, 0.32, 1]`; dissolve uses `easeOutCubic` in the shader tick — keep
- Overlay fade (`overlay = 1 - eased`) + sharp underlay — do not revert to `sharpMedia = !dissolveLive`
- Push: pin Archive Preview session then `node scripts/framer/push-archivepreview.mjs`
- Session: `node scripts/framer/session.mjs` → project `1BEQetqTKUu5Ah95oeVd`

## Steps

1. In `ArchivePreview.tsx`, add `wasOpenRef` (or reuse `prevOpenRef` already at ~L576) so the dissolve effect can detect closed→open.
2. Change dissolve `useEffect` so `setDissolveLive(true)` + rAF only run when `opening` is true.
3. On row change while open: cancel any in-flight dissolve (`stop` + clear GL), leave sharp video visible.
4. Set `DISSOLVE_MS = 560` (keep peak 0.34).
5. Do not change Gate entrance, springs, or property controls API.
6. Push + verify.

## Boundaries

- Do NOT implement plan 050 (keyboard) or 051 (hairline) in this plan.
- Do NOT reintroduce Morph or raise `DISSOLVE_PEAK`.
- Do NOT add npm deps.
- Do NOT publish.

## Verification

- **Mechanical**: `node scripts/framer/session.mjs` (Archive Preview) → `node scripts/framer/push-archivepreview.mjs` → `typeErrors: []` → `node scripts/framer/verify.mjs` → `blocking: false`.
- **Feel check** (▶️ Preview):
  - Hover row from rest: soft dissolve once, then sharp video — no end jump.
  - Move across 4–5 rows quickly: **no** dissolve restart; only short video crossfade.
  - Leave list (peek closes), hover again: dissolve plays again.
  - `prefers-reduced-motion`: no dissolve (`useDissolve` false).
- **Done when**: dissolve fires only on closed→open; row swaps stay at crossfade length; verify clean.
