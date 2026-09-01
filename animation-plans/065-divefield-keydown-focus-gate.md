# 065 — Dive Field: gate keyboard to focused region

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Purpose & frequency / Accessibility
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (~5 lines)
- **Audit finding**: improve-animations Dive Field 2026-08-03 #1

## Problem

Dive Field listens on **`window` `keydown`** and advances the camera for Arrow/Page/Space even when the region is **not focused**. Page arrow-scroll and other focused controls fight the WebGL field whenever the component is mounted.

Evidence (`code-components/DiveField.tsx`):

```tsx
// ~824–854 — current (excerpt)
const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null
    if (
        t &&
        (t.tagName === "INPUT" ||
            t.tagName === "TEXTAREA" ||
            t.isContentEditable)
    ) {
        return
    }
    if (e.code === "ArrowDown" || e.code === "PageDown") {
        e.preventDefault()
        target += 0.5
        armSnap(1)
    }
    // … ArrowUp / PageUp / Space …
}

// ~1145 — current
window.addEventListener("keydown", onKey)
```

Root already has `tabIndex={0}` and `role="region"` (`~1215–1219`) — focus is supported; the handler ignores it.

## Target

Only handle keys when the Dive Field root (or a descendant) owns focus:

```tsx
const onKey = (e: KeyboardEvent) => {
    const active = document.activeElement
    if (active !== root && !root.contains(active)) return
    const t = e.target as HTMLElement | null
    if (
        t &&
        (t.tagName === "INPUT" ||
            t.tagName === "TEXTAREA" ||
            t.isContentEditable)
    ) {
        return
    }
    // … existing Arrow / Page / Space branches unchanged in this plan …
}
```

Keep `window.addEventListener("keydown", onKey)` (capture not required). Do **not** move the listener to `root` only unless you also verify Framer focus + `tabIndex` still receive keys in Preview — window + focus gate is the intended fix.

## Repo conventions to follow

- Keyboard products gate on focus before `preventDefault` (region owns keys only when focused).
- Exemplar pattern in this file: INPUT/TEXTAREA early-return already present — extend with focus check **above** that.
- Push via `node scripts/framer/push-divefield.mjs` after local edit; session `7mzOTQA5ZdZVnu6ZH54e`.

## Steps

1. In `code-components/DiveField.tsx`, at the start of `onKey` (before the INPUT guard), add:
   `if (document.activeElement !== root && !root.contains(document.activeElement)) return`
2. Leave Arrow/Page step sizes alone in this plan (plan **069** retunes whole-layer steps).
3. Push code file; run `node scripts/framer/verify.mjs`.

## Boundaries

- Do NOT change wheel / pointer handlers.
- Do NOT remove `tabIndex` or focus-visible CSS.
- Do NOT change snap / damping / autoScroll defaults.
- Do NOT add dependencies.
- If `onKey` is no longer on `window` at this commit, STOP and report.

## Verification

- **Mechanical**: `node scripts/framer/push-divefield.mjs` → `typeErrors: []`. `node scripts/framer/verify.mjs` → `ok: true`.
- **Feel check**:
  1. Click outside Dive Field (blur). Press ArrowDown — **page** may scroll; Dive Field **must not** advance.
  2. Tab (or click) into Dive Field until focus-visible ring shows. ArrowDown — field advances; `preventDefault` stops page scroll.
  3. Focus an unrelated input on the page (if any) — keys must not move Dive Field.
- **Done when**: unfocused keys never call `armSnap` / change `target`; focused keys behave as before this plan (step size may still be ±0.5 until 069).
