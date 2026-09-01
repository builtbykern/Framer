# Halden Launch Blockers Implementation Plan

> **For agentic workers:** Execute inline with focused verification after each task.

**Goal:** Make the Halden Nav fully keyboard-operable and add one semantic Home H1 without visual changes or publishing.

**Architecture:** `Logo_Menu_Roll.tsx` will expose the existing Framer `onTap` interaction as an EventHandler and invoke it from the native button. Variant actions move from the focusable `BrandRoll` wrappers to the two code-component instances. Home receives one page-scope, visually hidden native H1.

**Tech Stack:** Framer Agent DSL, React, TypeScript, Framer Property Controls.

## Global Constraints

- Do not publish.
- Preserve Nav visuals, kerning, motion, reduced-motion behavior, and 490ms transition.
- Keep exactly one keyboard focus target for the Nav trigger.
- Do not modify Drift, CMS bindings, Work layout, or the existing split plan.

---

### Task 1: Keyboard-operable Nav trigger

**Files:**
- Modify: `.tmp/halden-src/Logo_Menu_Roll.tsx`
- Create: `.tmp/halden-fix-launch-blockers.cjs`
- Modify: `.tmp/halden-nav-final-audit.cjs`

**Interfaces:**
- `LogoMenuRollProps.onTap?: () => void`
- `ControlType.EventHandler` property named `onTap`
- Closed code instance `VBfODp8Ml` targets open variant `lHV5aHgaZ`
- Open code instance `lHV5aHgaZVBfODp8Ml` targets closed variant `QZInDjV1k`

- [x] Add a failing remote audit asserting that wrappers have no active `onTap`, code instances own the expected actions, and the source invokes `onTap` from the native button.
- [x] Run the audit and confirm it fails before the implementation.
- [x] Add `onTap?: () => void`, destructure it, call it from `<button onClick={onTap}>`, and expose it through `ControlType.EventHandler`.
- [x] Push the code file, move both variant actions to the code-component instances, and clear wrapper actions.
- [x] Strict-typecheck and rerun the focused audit.
- [ ] Verify with the live accessibility tree that only the named button is focusable and `Enter`/`Space` open and close the menu.

### Task 2: Semantic Home heading

**Files:**
- Modify: `.tmp/halden-fix-launch-blockers.cjs`
- Modify: `.tmp/halden-preflight-remote.cjs`

**Interfaces:**
- One direct child of Home named `SEO H1`
- Native rich text: `Halden — Photography and commissioned stills`
- Semantic tag: `h1`
- Visually hidden off-canvas; no breakpoint duplication

- [x] Add a failing audit asserting exactly one page-scope Home H1.
- [x] Add the native H1 through Framer Agent DSL with 1px dimensions, clipped overflow, and off-canvas positioning.
- [x] Verify Home screenshots at Desktop, Tablet, and Phone are pixel-stable in composition.
- [ ] Verify one Home H1 in rendered HTML and no horizontal overflow.

### Task 3: Final pre-release gate

- [x] Run strict typecheck for all six code files.
- [x] Run Nav, remote-integrity, responsive, reduced-motion, 404, CMS, route, robots, and sitemap checks.
- [x] Generate release preview and require zero errors/warnings.
- [x] Do not confirm the production publish.
