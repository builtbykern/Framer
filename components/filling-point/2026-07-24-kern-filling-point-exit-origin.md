# Kern Filling Point Exit Origin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `Kern_FillingPoint` fill layers exit by collapsing to the frozen session entry origin (hover/press/focus point) instead of the top-left corner.

**Architecture:** Keep the existing session/cascade model. Fix geometry by centering each radial fill with Framer Motion `x`/`y: "-50%"` (same transform stack as `scale`). Freeze `entryOriginRef` for the whole session and block `emptyLayers(0,0)` resets while `phase === "exiting"`.

**Tech Stack:** React, Framer (`framer` property controls + `useIsStaticRenderer`), Framer Motion (`motion`, `useReducedMotion`).

## Global Constraints

- Phase 1 only: exit-origin geometry + freeze — no API/control/visual redesign changes
- Preserve enter/exit cascade timing, energy presets, press scale, reduced-motion opacity path, a11y naming/focus behavior
- Single Framer code-component file: `components/filling-point/Kern_FillingPoint.tsx`
- Spec source of truth: `components/filling-point/2026-07-24-kern-filling-point-exit-origin-design.md`
- Verification is Framer-preview / manual interaction (no test runner in this repo); do not scaffold a test harness in phase 1
- Branch: `cursor/filling-point-exit-origin-fdff`

## File map

| File | Responsibility |
|---|---|
| `components/filling-point/Kern_FillingPoint.tsx` | Full Framer CTA component; owns session origin, cascade, fill layer geometry |
| `components/filling-point/2026-07-24-kern-filling-point-exit-origin-design.md` | Approved design (status → Approved when impl starts) |
| `components/filling-point/2026-07-24-kern-filling-point-exit-origin.md` | This plan |

---

### Task 1: Add component with Motion-native fill centering

**Files:**
- Create: `Kern_FillingPoint.tsx`
- Modify: `components/filling-point/2026-07-24-kern-filling-point-exit-origin-design.md` (status line only)

**Interfaces:**
- Consumes: User-provided `Kern_FillingPoint` source from the conversation (full component + `addPropertyControls`)
- Produces: `Kern_FillingPoint.tsx` where radial fill layers center via Motion `x`/`y: "-50%"` instead of negative margins

- [ ] **Step 1: Mark spec approved**

In `components/filling-point/2026-07-24-kern-filling-point-exit-origin-design.md`, change:

```markdown
**Status:** Pending user review
```

to:

```markdown
**Status:** Approved
```

- [ ] **Step 2: Create baseline component file**

Create `Kern_FillingPoint.tsx` by copying the full user-provided component source exactly (imports through `addPropertyControls`), with **no** behavior edits yet except the geometry change in Step 3. Do not rename the default export `Kern_FillingPoint`.

- [ ] **Step 3: Replace margin centering with Motion `x`/`y`**

In the radial (non-`useOpacityFill`) `layers.map` branch, change each fill layer’s `style` from:

```tsx
style={{
    position: "absolute",
    left: layer.x,
    top: layer.y,
    width: layer.coverSize,
    height: layer.coverSize,
    marginLeft: -layer.coverSize / 2,
    marginTop: -layer.coverSize / 2,
    borderRadius: "50%",
    backgroundColor: layer.color,
    pointerEvents: "none",
    zIndex: index,
    willChange: "transform, opacity",
    transformOrigin: "50% 50%",
}}
```

to:

```tsx
style={{
    position: "absolute",
    left: layer.x,
    top: layer.y,
    width: layer.coverSize,
    height: layer.coverSize,
    x: "-50%",
    y: "-50%",
    borderRadius: "50%",
    backgroundColor: layer.color,
    pointerEvents: "none",
    zIndex: index,
    willChange: "transform, opacity",
}}
```

Leave `animate` / `transition` / keys unchanged in this task.

- [ ] **Step 4: Sanity-check the file**

Run:

```bash
test -f /workspace/components/filling-point/Kern_FillingPoint.tsx && rg -n 'marginLeft|transformOrigin|x: "-50%"' /workspace/components/filling-point/Kern_FillingPoint.tsx
```

Expected:
- file exists
- `x: "-50%"` and `y: "-50%"` present
- no `marginLeft` / `marginTop` / `transformOrigin` on fill layers

- [ ] **Step 5: Commit**

```bash
git add components/filling-point/Kern_FillingPoint.tsx components/filling-point/2026-07-24-kern-filling-point-exit-origin-design.md
git commit -m "$(cat <<'EOF'
fix: center Kern Filling Point fills with Motion x/y

Replace negative-margin centering so scale enter/exit share the
same transform stack as the session origin point.
EOF
)"
git push -u origin cursor/filling-point-exit-origin-fdff
```

---

### Task 2: Freeze session origin through exit and block `0,0` mid-exit resets

**Files:**
- Modify: `Kern_FillingPoint.tsx` (`useEffect` fills sync, `startCascadeOut`)

**Interfaces:**
- Consumes: `sessionRef.phase`, `entryOriginRef`, `startCascadeOut`, `emptyLayers`, `setLayerState` from Task 1 file
- Produces: Exit cascade that pins every layer to `entryOriginRef` before `filled: false`, and never calls `emptyLayers` while `phase === "exiting"`

- [ ] **Step 1: Guard fills-sync effect during exit**

Find the `useEffect` that resets layers when `key` / `fills` change. Update the early-return so exiting sessions are also skipped:

```tsx
useEffect(() => {
    if (
        sessionRef.current.phase === "entering" ||
        sessionRef.current.phase === "active" ||
        sessionRef.current.phase === "exiting"
    )
        return
    startTransition(() => {
        setLayers(emptyLayers(fills))
    })
}, [key, fills])
```

- [ ] **Step 2: Pin all layer geometry to frozen origin at exit start**

At the top of `startCascadeOut`, after computing `exitPoint` and before scheduling reverse indexes (and after the reduced-motion early return block), ensure non-reduced-motion exit first aligns geometry, then staggers `filled: false`.

Replace the reverse-index scheduling body so it:

1. Immediately aligns every layer to `exitPoint` while preserving current `filled` values.
2. Then schedules reverse `filled: false` using the same delays as today.

Exact target shape inside `startCascadeOut` after the reduced-motion early return:

```tsx
const exitPoint = entryOriginRef.current

// Keep geometry pinned to the frozen entry origin for the whole exit.
startTransition(() => {
    setLayers((prev) =>
        prev.map((layer) => ({
            ...layer,
            x: exitPoint.x,
            y: exitPoint.y,
            coverSize: exitPoint.coverSize,
        }))
    )
})

const reverseIndexes = fills.map((_, idx) => idx).reverse()
let longestExit = 0
reverseIndexes.forEach((layerIndex, stepIndex) => {
    const delay = stepIndex * energy.exitStepMs
    const transitionEstimate = estimateTransitionMs(
        layerTransition(resolvedExit, "exit", layerIndex, energy)
    )
    longestExit = Math.max(longestExit, delay + transitionEstimate)
    schedule(
        delay,
        () => {
            if (sessionRef.current.id !== seq) return
            setLayerState(
                layerIndex,
                { x: exitPoint.x, y: exitPoint.y },
                exitPoint.coverSize,
                false
            )
        },
        seq
    )
})
schedule(
    longestExit,
    () => {
        if (sessionRef.current.id !== seq) return
        sessionRef.current.phase = "idle"
    },
    seq
)
```

Important: `const exitPoint = entryOriginRef.current` must be read **after** `startSession("exiting")` / `clearTimers()` as in the current function order — do not reintroduce a second conflicting `exitPoint` declaration. If `exitPoint` is already declared earlier in the function (for reduced motion), reuse that single declaration and only insert the `startTransition` pin block before `reverseIndexes`.

- [ ] **Step 3: Verify exit still ignores live pointer**

Confirm `onPointerMove` only writes `pointerRef` and never mutates `entryOriginRef` or layer `x`/`y` during `entering` / `active`. No code change required if already true; if any write to layer origin from move exists, remove it.

Run:

```bash
rg -n 'entryOriginRef|pointerRef|onPointerMove|phase === "exiting"' /workspace/components/filling-point/Kern_FillingPoint.tsx
```

Expected:
- `onPointerMove` → `syncPointer` only
- `startCascadeOut` uses `entryOriginRef.current`
- fills sync effect includes `phase === "exiting"` guard

- [ ] **Step 4: Manual acceptance checklist (Framer preview)**

After pasting/updating the component in Framer, verify:

1. Hover near bottom-right → leave: fills collapse to bottom-right, not top-left
2. Hover near top-left → leave: collapses to that entry point
3. Keyboard focus-visible / Enter-Space: enter+exit from center
4. Coarse pointer press/release: exit toward press origin
5. Rapid enter/leave: no stuck fills, no visible jump to `(0,0)`
6. Reduced motion: opacity fill still toggles; no broken layout

- [ ] **Step 5: Commit and update PR**

```bash
git add components/filling-point/Kern_FillingPoint.tsx
git commit -m "$(cat <<'EOF'
fix: freeze fill exit origin for Kern Filling Point

Pin layer geometry to the session entry point for the full exit
cascade and skip emptyLayers resets while exiting.
EOF
)"
git push -u origin cursor/filling-point-exit-origin-fdff
```

Then update the existing PR body to mark implementation complete and list the acceptance checklist results.

---

## Spec coverage self-review

| Spec requirement | Task |
|---|---|
| Motion `x`/`y: "-50%"` centering | Task 1 |
| Remove margin / transformOrigin centering | Task 1 |
| Freeze `entryOriginRef` for session exit | Task 2 |
| Exit does not follow live pointer | Task 2 Step 3 |
| No `emptyLayers` during `exiting` | Task 2 Step 1 |
| Keep reverse staggered exit / transitions | Task 2 (preserves schedule) |
| No API/control changes | Both tasks |
| Reduced motion preserved | Task 2 (early return unchanged) |
| Acceptance criteria 1–7 | Task 2 Step 4 |

## Placeholder scan

No TBD/TODO steps. Exact snippets and commands included.

## Type consistency

- `exitPoint` shape remains `{ x: number; y: number; coverSize: number }` matching `entryOriginRef`
- `setLayerState(index, {x,y}, coverSize, filled)` signature unchanged
- `SessionPhase` continues to include `"exiting"`
