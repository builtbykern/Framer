# Halden Menu Exit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 280 ms reverse menu exit that mirrors Halden's paper-reveal entrance without changing its 490 ms opening motion.

**Architecture:** `Logo_Menu_Roll.tsx` emits `halden:menu-exit` immediately before invoking its Framer actions. `Menu Open=false` resets the reveal state, `Menu_Paper_Reveal.tsx` runs the visual response, and delayed `SET_VARIANT` completes the handoff after 280 ms.

**Tech Stack:** React, TypeScript, Framer Code Components, Framer Agent DSL.

## Global Constraints

- Preserve the 490 ms entrance.
- Exit content over 180 ms with `translateY(24px)` and opacity.
- Retract the paper over 280 ms, then switch to `closed`.
- Preserve reduced motion, static rendering, semantic button ownership, and the contained veil.
- Do not change layout, typography, kerning, CMS, or property controls.
- Do not publish or commit unless the user explicitly asks.

---

### Task 1: Exit Choreography and Delayed Handoff

**Files:**
- Create: `.tmp/halden-menu-exit-regression.cjs`
- Create: `.tmp/halden-apply-menu-exit.cjs`
- Modify: `.tmp/halden-src/Menu_Paper_Reveal.tsx:19-25, 180-276`
- Modify: `.tmp/halden-nav-motion-test.cjs:16-82`
- Modify: `.tmp/halden-launch-blockers-test.cjs:30-80`

**Interfaces:**
- Consumes: `Menu Open` variable `var(--variable-w1Hbz14bi)` and Nav variants `lHV5aHgaZ` / `QZInDjV1k`.
- Produces: immediate `halden:menu-exit` plus `Menu Open=false`, 180 ms content exit, 280 ms paper exit, and delayed `SET_VARIANT(closed)`.

- [x] **Step 1: Write the failing source regression**

Create `.tmp/halden-menu-exit-regression.cjs`:

```js
const assert = require("node:assert/strict")
const fs = require("node:fs")

const source = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Menu_Paper_Reveal.tsx",
    "utf8"
)

assert(source.includes("const ENTER_MS = 490"))
assert(source.includes("const EXIT_MS = 280"))
assert(source.includes("const CONTENT_EXIT_MS = 180"))
assert(source.includes("const CONTENT_EXIT_Y = 24"))
assert(source.includes('translate3d(0, ${CONTENT_EXIT_Y}px, 0)'))
assert(source.includes("const motionMs = open ? ENTER_MS : EXIT_MS"))
assert(!source.includes("createPortal"))

console.log("menu exit regression passed")
```

- [x] **Step 2: Update remote action regressions before implementation**

Change `.tmp/halden-launch-blockers-test.cjs` so `ownsMenuTransition` accepts an expected delay:

```js
const ownsMenuTransition = (node, variant, value, delay) => {
    const actions = activeActions(node)
    return (
        actions.length === 2 &&
        actions.some(
            (action) =>
                action.action === "SET_VARIABLE_VALUE" &&
                action.controls?.value === value
        ) &&
        actions.some(
            (action) =>
                action.action === "SET_VARIANT" &&
                action.controls?.variant === variant &&
                (action.delay || "0s") === delay
        )
    )
}
```

Call it with `"0s"` for open and `"0.28s"` for close.

Update `.tmp/halden-nav-motion-test.cjs` to require:

```js
const EXPECTED_CLOSE_DELAY = "0.28s"

// Inside the close-action validation:
(closeVariantAction?.delay ?? "0s") !== EXPECTED_CLOSE_DELAY

// After validation:
const closeDelay = closeVariantAction.delay ?? "0s"
if (closeDelay !== EXPECTED_CLOSE_DELAY) {
    throw new Error(`Close handoff is ${closeDelay}`)
}
```

Replace the old duration check with:

```js
asymmetricTiming:
    menuFile.content.includes("const ENTER_MS = 490") &&
    menuFile.content.includes("const EXIT_MS = 280") &&
    menuFile.content.includes("const CONTENT_EXIT_MS = 180") &&
    menuFile.content.includes("const CONTENT_EXIT_Y = 24"),
```

- [x] **Step 3: Run regressions and confirm RED**

Run:

```bash
node ".tmp/halden-menu-exit-regression.cjs"
npx @framer/agent@latest exec -s 1 -f ".tmp/halden-nav-motion-test.cjs"
```

Expected: the source test fails because asymmetric constants are absent; the remote motion test fails because close delay is still `0s`.

- [x] **Step 4: Add asymmetric visual timing**

In `.tmp/halden-src/Menu_Paper_Reveal.tsx`, replace `MS` with:

```ts
const ENTER_MS = 490
const EXIT_MS = 280
const CONTENT_EXIT_MS = 180
const CONTENT_EXIT_Y = 24
```

Before `Menu_Paper_Reveal`, add the exit helper:

```ts
function applyMenuExit(
    host: HTMLElement,
    reduceMotion: boolean
): () => void {
    const sheet = findNamed(host, /menu sheet/i, "down")
    if (!sheet) return () => {}

    const previousOpacity = sheet.style.opacity
    const previousTransform = sheet.style.transform
    const previousTransition = sheet.style.transition

    sheet.style.transition = reduceMotion
        ? `opacity 120ms ${EASE_OUT}`
        : [
              `opacity ${CONTENT_EXIT_MS}ms ${EASE_OUT}`,
              `transform ${CONTENT_EXIT_MS}ms ${EASE_OUT}`,
          ].join(", ")
    sheet.style.opacity = "0"
    sheet.style.transform = reduceMotion
        ? "none"
        : `translate3d(0, ${CONTENT_EXIT_Y}px, 0)`

    return () => {
        sheet.style.opacity = previousOpacity
        sheet.style.transform = previousTransform
        sheet.style.transition = previousTransition
    }
}
```

Add `MENU_EXIT_EVENT = "halden:menu-exit"` to both Nav code files. In `Logo_Menu_Roll.tsx`, replace the direct handler with:

```ts
const handleClick = () => {
    if (!isStatic && open && typeof window !== "undefined") {
        window.dispatchEvent(new Event(MENU_EXIT_EVENT))
    }
    onTap?.()
}
```

Bind it with `onClick={handleClick}`. In `Menu_Paper_Reveal.tsx`, listen for the same event and set `closing=true` plus `shown=false`.

Inside the reveal component, select the asymmetric transition:

```ts
const motionMs = closing ? EXIT_MS : ENTER_MS
```

Use `motionMs` for `clipTransition`, both backdrop-filter transitions, and `washTransition`.

Inside the existing host `useLayoutEffect`, apply content exit only while closing:

```ts
const restoreMenuExit =
    !isStatic && closing
        ? applyMenuExit(host, Boolean(reduceMotion))
        : () => {}
```

Call `restoreMenuExit()` in the effect cleanup after restoring the host styles. Update the component comment to state `490 ms open / 280 ms close`.

- [x] **Step 5: Create and run the focused remote apply script**

Create `.tmp/halden-apply-menu-exit.cjs`:

```js
const fs = require("node:fs")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const typeErrors = []
for (const filename of ["Menu_Paper_Reveal.tsx", "Logo_Menu_Roll.tsx"]) {
    const file = await framer.getCodeFile(filename)
    if (!file) throw new Error(`${filename} not found`)
    const source = fs.readFileSync(
        `/Users/noel/Desktop/Framer/.tmp/halden-src/${filename}`,
        "utf8"
    )
    const updated = await file.setFileContent(source)
    typeErrors.push(...(await updated.typecheck({ strict: true })))
}
if (typeErrors.length > 0) throw new Error(JSON.stringify(typeErrors))

const applied = await framer.agent.applyChanges(`
SET lHV5aHgaZVBfODp8Ml onTap.0.action="SET_VARIABLE_VALUE" onTap.0.controls.variable="var(--variable-w1Hbz14bi)" onTap.0.controls.value="false";
SET lHV5aHgaZVBfODp8Ml onTap.1.action="SET_VARIANT" onTap.1.controls.variant="QZInDjV1k" onTap.1.delay="0.28s";
`)

console.log(JSON.stringify({ typeErrors, applied }, null, 2))
```

Run:

```bash
npx @framer/agent@latest exec -s 1 -f ".tmp/halden-apply-menu-exit.cjs"
```

Expected: zero type errors; only the close variant action changes.

- [x] **Step 6: Verify GREEN**

Run:

```bash
node ".tmp/halden-menu-exit-regression.cjs"
npx @framer/agent@latest exec -s 1 -f ".tmp/halden-launch-blockers-test.cjs"
npx @framer/agent@latest exec -s 1 -f ".tmp/halden-nav-motion-test.cjs"
```

Expected: all checks pass; wrappers remain action-free; both buttons reset `Menu Open`; open delay is `0s`; close delay is `0.28s`.

---

### Task 2: Visual and Interaction Verification

**Files:**
- Verify only: `Menu_Paper_Reveal.tsx`, `Logo_Menu_Roll.tsx`, Nav component `Ebz57iEJS`.

**Interfaces:**
- Consumes: the completed Task 1 timing and action ownership.
- Produces: evidence that the exit is visually coherent and leaves Home interactive.

- [x] **Step 1: Strict-typecheck both Nav code files**

Run a focused Framer Agent script that calls `typecheck({ strict: true })` for `Menu_Paper_Reveal.tsx` and `Logo_Menu_Roll.tsx`.

Expected: zero errors.

- [x] **Step 2: Render both Nav variants and all Home breakpoints**

Use `framer.screenshot` for:

```text
QZInDjV1k
lHV5aHgaZ
WQLkyLRf1
BjqrvIntT
nyI5jW7lA
```

Expected: closed remains transparent; open keeps the existing paper/menu composition; Home remains visible at all breakpoints.

- [ ] **Step 3: Test runtime behavior in Framer Preview**

Verify:

```text
pointer: open → close → Home visible and interactive
keyboard: Tab → Enter/Space → close completes
rapid close: no persistent paper or scroll lock
reduced motion: no translation or blur; opacity feedback remains
```

Expected: content exits first, paper retracts upward, and the Nav becomes `closed` at 280 ms.

- [x] **Step 4: Confirm no publish occurred**

Check project release state only; do not call `framer.publish()`.
