# 050 — Archive Preview no theatre on keyboard index

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Purpose & frequency
- **Estimated scope**: 1 file (`code-components/ArchivePreview.tsx`), ~50 lines

## Problem

Keyboard focus drives the peek via `focusIndex` → `liveIndex`. Arrow/Tab through the list opens (or retargets) the peek and can re-trigger dissolve. Keyboard list navigation must not get showy entrance theatre (AUDIT: never animate 100+/day keyboard paths; Raycast rule).

```ts
/* code-components/ArchivePreview.tsx:543-547 — current */
const liveIndex =
    hovered !== null ? hovered : focusIndex !== null ? focusIndex : null

const peekIndex =
    isStatic || liveIndex === null ? -1 : liveIndex
```

```ts
/* code-components/ArchivePreview.tsx:822-830 — current */
const onRowFocus = (index: number) => {
    if (isStatic) return
    startTransition(() => setFocusIndex(index))
    if (!finePointer) setOpenIndex(index)
    const root = rootRef.current
    if (root) {
        const rb = root.getBoundingClientRect()
        placePeekAt(rb.left + rb.width / 2, rb.top + rb.height / 2, false)
    }
}
```

On fine-pointer desktop, ArrowDown still sets `focusIndex`, which becomes `liveIndex` when `hovered === null`, opening the peek without a hover.

## Target

1. **Fine pointer + keyboard**: focus ring stays (`focusIndex` for a11y outline). Peek / dissolve / Gate theatre must **not** open from keyboard alone. `liveIndex` for peek media = hover-driven only when `finePointer` is true.
2. **Coarse pointer / touch**: keep current behavior — focus/tap can open peek (`!finePointer` already calls `setOpenIndex`).
3. When keyboard moves focus while a hover peek is open: do not restart dissolve (049 also covers this); do not jump peek to center unless product already requires it — prefer leaving peek on last hover position until mouse leave.
4. Reduced-motion / static: unchanged (`peekIndex` already -1 when static).

Exact `liveIndex` shape:

```ts
const liveIndex = finePointer
  ? hovered
  : hovered !== null
    ? hovered
    : focusIndex
```

Or equivalent: when `finePointer`, ignore `focusIndex` for peek opening.

Keep `onRowFocus` setting `focusIndex` for the focus ring span. Keep `placePeekAt` center **only** for `!finePointer` open path (touch), not on every desktop focus.

```ts
const onRowFocus = (index: number) => {
  if (isStatic) return
  startTransition(() => setFocusIndex(index))
  if (!finePointer) {
    setOpenIndex(index)
    const root = rootRef.current
    if (root) {
      const rb = root.getBoundingClientRect()
      placePeekAt(rb.left + rb.width / 2, rb.top + rb.height / 2, false)
    }
  }
}
```

## Repo conventions to follow

- Fine-pointer gate already exists for hover (`matchMedia("(hover: hover) and (pointer: fine)")`) — extend that pattern
- Exemplar: Type Peek plan `046-typepeek-fine-pointer-hover.md` / InertiaGrid `038`
- Focus ring UI at ~L1169–1179 stays
- Push: `node scripts/framer/push-archivepreview.mjs` after session pin `1BEQetqTKUu5Ah95oeVd`

## Steps

1. Change `liveIndex` so fine-pointer peek uses `hovered` only.
2. Narrow `onRowFocus` so `placePeekAt` + `setOpenIndex` run only when `!finePointer`.
3. Confirm Escape / blur still clear focus and touch open state.
4. Confirm plan 049 still works: mouse leave → hover again = dissolve; Arrow keys alone = no peek on desktop.
5. Push + verify.

## Boundaries

- Do NOT remove keyboard activation of links (`Enter` / `Space` on `onRowActivate`).
- Do NOT remove focus ring.
- Do NOT change dissolve peak/ms here (049).
- Do NOT change hairline timing (051).
- No publish.

## Verification

- **Mechanical**: push-archivepreview → `typeErrors: []`; verify → `blocking: false`.
- **Feel check**:
  - Desktop mouse: hover still opens peek + dissolve (per 049).
  - Desktop keyboard only: Tab/Arrows move focus ring; **no** peek open, **no** dissolve.
  - Touch / coarse (DevTools device mode): tap/focus still toggles peek.
  - `prefers-reduced-motion`: no dissolve; peek still follows rules above.
- **Done when**: keyboard index on fine pointer never triggers peek theatre; mouse path unchanged.
