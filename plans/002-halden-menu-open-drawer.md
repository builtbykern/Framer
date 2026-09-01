# 002 — Open MENU as a 320ms paper drawer

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Performance + Easing & duration + Cohesion & tokens
- **Estimated scope**: Nav component `Ebz57iEJS` only (variant `transition` + Menu Sheet `appearEffect` + Enquiries `tapEffect`). No code-file edits. Depends on overlay still being Menu Sheet `j8mC0qp88` / open replica `lHV5aHgaZj8mC0qp88`.

## Problem

Opening MENU interpolates the Nav variant from a ~40px bar to a `100vh` sheet using a **790ms** tween that **animates height** (layout + paint). The curve starts slow (ease-in character). Drawers are allowed 200–500ms; UI motion should stay under 300ms; layout properties must not animate.

Current on both `closedOnDark` `QZInDjV1k` and `open` `lHV5aHgaZ`:

```
transition: tween 0.77,0,0.17,1 0.79s 0s
```

That is cubic-bezier(0.77, 0, 0.17, 1) over 0.79s. Closed height is auto ~40px; open `minHeight` is `100vh` and Menu Sheet height is `100vh`. Framer variant `transition` interpolates those size changes.

PageVeil already uses a different long paper curve (`cubic-bezier(0.5, 0, 0.5, 1)` 490ms) for **route** changes. The menu is not a route change; it must not share that 490/790ms language.

`mailto:studio@halden.work` (`OSaBHYPYg`) has no press scale.

## Target

Variant morph: **instant** (no height tween).

Menu Sheet enter (open replica only): opacity + translateY, compositor only:

```
appearEffect.trigger="onMount"
appearEffect.enter.opacity="0"
appearEffect.enter.x="0"
appearEffect.enter.y="16"
appearEffect.enter.scale="1"
appearEffect.enter.rotate="0"
appearEffect.enter.rotateX="0"
appearEffect.enter.rotateY="0"
appearEffect.enter.skewX="0"
appearEffect.enter.skewY="0"
appearEffect.enter.transition="tween 0.32,0.72,0,1 0.32s 0s"
appearEffect.enter.stagger="0s"
```

Curve is AUDIT **ease-drawer** `cubic-bezier(0.32, 0.72, 0, 1)`. Duration **320ms** (drawer band 200–500ms). `y="16"` is 16px down from rest — the sheet reads as coming from the wordmark, not growing from 40px. **Never** `scale(0)`. **Never** animate width/height/padding/top.

Enquiries press:

```
tapEffect.scale="0.97"
tapEffect.transition="tween 0.23,1,0.32,1 0.16s 0s"
```

AUDIT press: `scale(0.97)` + **160ms** + **ease-out** `cubic-bezier(0.23, 1, 0.32, 1)`.

Reduced motion: Framer site `prefers-reduced-motion` should drop the 16px move. Feel-check: opacity may remain; `y` movement must not. If Framer still moves the sheet under reduced motion, SET `appearEffect.enter.y="0"` and keep opacity 200ms `tween 0.23,1,0.32,1 0.2s 0s`.

## Repo conventions to follow

- Halden Cursor-only: `node scripts/framer/exec.mjs -s 2 -f …` then `node scripts/framer/verify.mjs -s 2 --page /`. Never `startConversation`. Do not publish.
- DSL `appearEffect` exemplar (same grammar as `prompt/core-examples.md`):

```
SET WHKr22AAm appearEffect.threshold="0.5" appearEffect.trigger="onMount" appearEffect.enter.opacity="0" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.scale="1" appearEffect.enter.rotate="0" appearEffect.enter.rotateX="0" appearEffect.enter.rotateY="0" appearEffect.enter.skewX="0" appearEffect.enter.skewY="0" appearEffect.enter.transition="spring-duration 0.4s 0.2 0s" appearEffect.enter.stagger="0s";
```

Use **tween** with the drawer bezier, not that spring exemplar’s 0.4s spring.

- PageVeil (`tmp/Page_Veil.tsx`) is the route-wash exemplar — **do not copy** its 490ms `(0.5, 0, 0.5, 1)` onto the menu.
- Logo Menu Roll idle HALDEN⇄MENU is **by design**. Freeze when `open=true` already exists. Do not retune hold/stagger.

## Steps

1. Confirm live transition strings:

```js
const dark = await framer.agent.getNode({ id: "QZInDjV1k" }, { pagePath: "/" })
const light = await framer.agent.getNode({ id: "x9XW91SaY" }, { pagePath: "/" })
const open = await framer.agent.getNode({ id: "lHV5aHgaZ" }, { pagePath: "/" })
```

Expect `attributes.transition` ≈ `tween 0.77,0,0.17,1 0.79s 0s` on dark/open. If already `instant`, skip step 2 and only add appear/tap.

2. Instant variant morph (all three variants, same string):

```
SET QZInDjV1k transition="instant";
SET x9XW91SaY transition="instant";
SET lHV5aHgaZ transition="instant";
```

`pagePath: "/"`. Do not SET compound replica descendant ids for this.

3. Appear on the **open** Menu Sheet only (`lHV5aHgaZj8mC0qp88`), not primary `j8mC0qp88` (closed/hidden). Apply the Target `appearEffect.*` block in one `SET`. Keep `height="100vh"` `position="relative"` `padding="96px 24px 64px 24px"` — do not tween those.

4. Press on Enquiries `OSaBHYPYg` (primary id; inherits):

```
SET OSaBHYPYg tapEffect.scale="0.97" tapEffect.transition="tween 0.23,1,0.32,1 0.16s 0s";
```

If UI plan  `design-plans/halden-menu-dossier-two-pane.md` already ran, this node still exists (moved into the Contact pane). If the id changed, SET the node whose `link.href` is `mailto:studio@halden.work`.

5. `node scripts/framer/verify.mjs -s 2 --page /` → `{ "ok": true }`.

## Boundaries

- Do NOT edit `tmp/Logo_Menu_Roll.tsx`, `tmp/Page_Veil.tsx`, `tmp/Drift_Plane.tsx`.
- Do NOT change dossier copy, form fields, or two-pane layout (UI plan owns that).
- Do NOT set `height="100vh"` on variant ground `lHV5aHgaZ` (Framer rejects vh on that node).
- Do NOT set Home instance `Yptm4PAEu` back to `10vh`.
- Do NOT add springs, blur, or stagger on the sheet.
- If `appearEffect` on a `100vh` relative sheet is rejected, STOP and report — do not fake the motion by putting `transition` back on the variant.

## Verification

- **Mechanical**: `node scripts/framer/verify.mjs -s 2 --page /` → `ok: true`. Re-read `QZInDjV1k.attributes.transition === "instant"` and `lHV5aHgaZj8mC0qp88` appearEffect y=16, duration 0.32s, bezier 0.32,0.72,0,1.
- **Feel check** (Framer **Preview Play**, not `.framer.app`):
  - Click HALDEN/MENU: paper is full viewport **immediately** (no 40px→100vh grow). Content eases in 320ms (opacity + 16px).
  - Spam open/close: no restart from a collapsed bar; interruptible (CSS transition, not keyframes).
  - Animations panel at 10%: confirm **opacity** and **transform**, not height/padding.
  - `prefers-reduced-motion`: no 16px travel; opacity may remain (~200ms).
  - Press `studio@halden.work`: scale 0.97 over 160ms, then release.
- **Done when**: closed bar still ~40px; open sheet still 100vh; variant transition is instant; sheet appear is 320ms ease-drawer; mailto has press scale; verify green.

## Notes for the executor

- Run **after** `design-plans/halden-menu-dossier-two-pane.md` so appearEffect is on the final sheet, not a stub that then gets rebuilt.
- Always `-s 2`. Omitting `-s` flips the session to Arbour.
- Do not publish.
