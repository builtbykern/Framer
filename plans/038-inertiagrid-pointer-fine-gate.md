# 038 — Pointer fine-pointer gate for InertiaGrid

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Accessibility / Missed opportunity
- **Estimated scope**: 1 file, ~30–45 lines
- **Depends**: 032
- **Project**: Framer `PBghPP85VH1cuE7BNtzx`, `Kern_InertiaGrid`

## Problem

Physics is wired only to `onMouseMove` / `onMouseLeave`. That avoids some touch hover bugs but is inconsistent with pointer-based UIs and does not explicitly gate on fine pointers. AUDIT.md requires hover motion behind `@media (hover: hover) and (pointer: fine)` (or JS equivalent).

```tsx
/* state/InertiaGrid.tsx.snapshot:466-477 — current */
onMouseMove={
    shouldAnimate
        ? (e) => {
              mouseX.set(e.clientX)
              mouseY.set(e.clientY)
          }
        : undefined
}
onMouseLeave={() => {
    mouseX.set(-9999)
    mouseY.set(-9999)
}}
```

## Target

```ts
const finePointer =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
```

- Subscribe to `matchMedia` changes (add/remove listener) so docked tablets / device flips update.
- Physics listeners only when `physicsOk && finePointer` (naming from 035 if applied; else current `shouldAnimate`).
- Prefer **pointer** events:

```tsx
onPointerMove={physicsOk && finePointer ? (e) => {
  if (e.pointerType === "mouse" || e.pointerType === "pen") {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }
} : undefined}
onPointerLeave={physicsOk && finePointer ? () => {
  mouseX.set(-9999)
  mouseY.set(-9999)
} : undefined}
```

- Remove redundant `onMouseMove` / `onMouseLeave` once pointer handlers cover the same.
- Idle: if no pointermove for **150ms**, set mouse to sentinel (or write rest targets) so tiles settle without requiring leave — optional but recommended with 032 idle stop.

Touch / coarse pointers: no physics (entrance from 034/035 still allowed).

## Repo conventions to follow

- SSR: `typeof window !== "undefined"` before `matchMedia` (file already guards window for resize).
- Exemplar gate: `plans/025-quoteintake-gate-hover-fine-pointer.md`.

## Steps

1. Add `finePointer` state (or ref + force) with matchMedia subscribe.
2. Swap mouse handlers for pointer handlers gated as above.
3. Optionally add 150ms idle timeout clearing position.
4. Ensure canvas path unchanged (no listeners).
5. Push + verify.

## Boundaries

- Do NOT enable physics on touch as a “delight” feature.
- Do NOT remove reduced-motion / canvas guards.
- Do NOT change force math (037 may already be present — leave it).

## Verification

- **Mechanical**: verify.mjs OK.
- **Feel check**: Desktop mouse — physics works. DevTools device mode touch — no tile displacement on drag/tap. Toggle reduced motion still kills physics.
- **Done when**: no ungated mouse-only physics; fine-pointer media query enforced.
