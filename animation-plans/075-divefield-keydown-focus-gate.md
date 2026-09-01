# 075 — Dive Field: gate keyboard to focused region

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Purpose & frequency / Accessibility
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (~3 lines)
- **Audit finding**: improve-animations Dive Field 2026-08-04-restore #4
- **Supersedes craft of**: 065 — missing after restore

## Problem

Dive Field listens on **`window` `keydown`** and advances the camera for Arrow/Page/Space even when the region is **not focused**. Page scroll and other controls fight the field whenever it is mounted.

Evidence (`code-components/DiveField.tsx` ~774–800, ~1081):

```tsx
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
    }
    // …
}
window.addEventListener("keydown", onKey)
```

Root already has `tabIndex={0}` and `role="region"` (~1151–1153).

## Target

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
    // … existing branches (plan 076 may retune step sizes) …
}
```

Keep `window.addEventListener("keydown", onKey)`. Do **not** move the listener to `root` only unless Preview focus is verified broken.

## Repo conventions to follow

- Extend the existing INPUT early-return — focus check **above** it.
- Push: `node scripts/framer/push-divefield.mjs`.

## Steps

1. At start of `onKey`, add focus gate using `root`.
2. Leave Arrow/Page step sizes alone here (**076** retunes them).
3. Push + verify.

## Boundaries

- Do NOT change wheel / pointer.
- Do NOT remove `tabIndex={0}`.
- If focus gate already exists, STOP and report.

## Verification

- **Mechanical**: push + verify green.
- **Feel check**: click outside Dive Field → arrows scroll page, not camera. Tab/click into region → arrows dive. INPUT focus still ignored.
- **Done when**: unfocused Dive Field never `preventDefault`s Arrow/Page/Space.
