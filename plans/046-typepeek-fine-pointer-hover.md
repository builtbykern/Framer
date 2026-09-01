# 046 — Type Peek fine-pointer gate for hover peek + ticker pause

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file (`code-components/TypePeek.tsx`), ~40–60 lines

## Problem

Peek open and ticker pause bind to `onPointerEnter` / `onPointerLeave` for all pointers. On touch, false hover can leave a word open and a lane paused.

```tsx
/* code-components/TypePeek.tsx:752–753, 969–986 — current */
onPointerEnter: interactive ? onEnter : undefined,
onPointerLeave: interactive ? onLeave : undefined,
// …
onEnter={() => {
    startTransition(() => {
        setHoverIndex(i)
        if (ticker.pauseOnHover) {
            setPausedRow(rowIndex)
        }
    })
    props.onPeek?.()
}}
```

AUDIT §6: gate hover motion with `(hover: hover) and (pointer: fine)`.

## Target

- Detect fine pointer once (SSR-safe):

```ts
function useFinePointer(): boolean {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    const apply = () => setFine(mq.matches)
    apply()
    mq.addEventListener?.("change", apply)
    return () => mq.removeEventListener?.("change", apply)
  }, [])
  return fine
}
```

- Hover open + pause-on-hover: only when `interactive && finePointer`.
- Touch / coarse: 
  - Words remain focusable (keyboard) where `keyboardInteractive`.
  - Optional: first tap opens peek (`onClick` / `onPointerUp` toggle) — **preferred minimal**: keyboard + explicit click on linked words only; non-linked words open on click/tap toggle when `!finePointer`.
- Minimal acceptable: **no hover open on coarse**; tap/click toggles `hoverIndex` for that word; leave on second tap or outside (blur). If outside-detect is heavy, toggle on repeated click of same word is enough.

## Repo conventions to follow

- Exemplar: `plans/025-quoteintake-gate-hover-fine-pointer.md` / `038-inertiagrid-pointer-fine-gate.md`.
- Keep `startTransition` around hover state updates.

## Steps

1. Add `useFinePointer` (local to file; no new deps).
2. Pass `finePointer` into `PeekWordEl` or gate handlers in `renderTickerGroup`.
3. Wire `onPointerEnter`/`Leave` only if `finePointer`; else use click/tap toggle for open when `interactive`.
4. Only call `setPausedRow` when `ticker.pauseOnHover && finePointer` (or when toggle-open on coarse — pause that row while open).
5. `push-typepeek.mjs` + `verify.mjs`.

## Boundaries

- Do NOT remove keyboard open/focus paths.
- Do NOT break duplicate-copy `aria-hidden` / `tabIndex={-1}` rules.
- Do NOT add touch-action hacks that block scrolling the page.

## Verification

- **Mechanical**: typeErrors []; verify exit 0.
- **Feel check**:
  - Desktop mouse: hover opens weave + pauses lane.
  - DevTools device mode / force touch: no sticky hover; tap toggles peek.
  - Keyboard Tab + Enter/Space still opens where `keyboardInteractive`.
- **Done when**: hover path gated by fine pointer; coarse has no sticky pause without intentional tap.
