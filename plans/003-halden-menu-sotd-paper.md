# 003 — Open MENU as SOTD paper from the wordmark

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Physicality & origin + Cohesion & tokens + Missed opportunities
- **Estimated scope**: New code file `tmp/Menu_Paper_Reveal.tsx` (push as `Menu_Paper_Reveal.tsx`) + Nav `Ebz57iEJS` (one instance on primary, appearEffect on the two panes). Depends on `design-plans/halden-nav-full-bleed.md` running first.
- **Supersedes**: `002-halden-menu-open-drawer.md` (instant variant stays; the 16px whole-sheet fade does not).

## Problem

Plan 002 killed the 790ms height tween (correct — do not bring height animation back). What replaced it is not SOTD:

1. Variant `transition: instant` on `QZInDjV1k` / `x9XW91SaY` / `lHV5aHgaZ` — the 48px bar becomes a `100vh` paper field with **no spatial story**.
2. Menu Sheet `j8mC0qp88` and open replica `lHV5aHgaZj8mC0qp88` share this appearEffect:

```
appearEffect.trigger="onMount"
appearEffect.enter.opacity="0"
appearEffect.enter.y="16"
appearEffect.enter.scale="1"
appearEffect.enter.transition="tween 0.32,0.72,0,1 0.32s 0s"
```

That fades **paper + dossier as one blob** up 16px. Origin is the sheet center, not the wordmark. Hardcoded `16px` (AUDIT wants `%` / clip-path for surfaces that grow from a trigger). Info pane `XM4MY5kEq` and Contact pane `jHiMr8b0s` have **no** appearEffect. Close is equally instant.

Logo Menu Roll (`tmp/Logo_Menu_Roll.tsx`) already does the SOTD letter-roll and freezes to CLOSE when `open=true`. That stays. PageVeil (`tmp/Page_Veil.tsx`) is the **route** wash (`cubic-bezier(0.5, 0, 0.5, 1)` 490ms, 12px blur) — do not reuse it here.

Framer DSL `appearEffect.enter.y` is pixels only. DSL `width` has no `vw`. External agents cannot attach code overrides. Clip-path from the bar therefore needs a **code component**.

## Target

Keep variant morph **instant** (no height/width/padding tween).

**Paper** (code): clip-path expands **down from the 48px bar**. Closed clip hides the paper; open clip is full viewport. CSS transition, not keyframes.

```css
/* closed */
clip-path: inset(0 0 100% 0);
/* open */
clip-path: inset(0);
transition: clip-path 400ms cubic-bezier(0.32, 0.72, 0, 1);
/* breakout of the 1440 page box */
width: 100vw;
margin-left: calc(50% - 50vw);
height: 100vh;
background: rgb(246, 243, 238); /* paper — also accept a Color control defaulting to this */
pointer-events: none;
```

400ms is the drawer band (200–500ms). Curve is AUDIT **ease-drawer**. **Never** `scale(0)`. **Never** animate height.

**Content** (canvas appearEffect on the two panes, not the sheet):

```
SET XM4MY5kEq appearEffect.trigger="onMount" appearEffect.enter.opacity="0" appearEffect.enter.x="0" appearEffect.enter.y="12" appearEffect.enter.scale="1" appearEffect.enter.rotate="0" appearEffect.enter.rotateX="0" appearEffect.enter.rotateY="0" appearEffect.enter.skewX="0" appearEffect.enter.skewY="0" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.24s 0.08s" appearEffect.enter.stagger="0s";
SET jHiMr8b0s appearEffect.trigger="onMount" appearEffect.enter.opacity="0" appearEffect.enter.x="0" appearEffect.enter.y="12" appearEffect.enter.scale="1" appearEffect.enter.rotate="0" appearEffect.enter.rotateX="0" appearEffect.enter.rotateY="0" appearEffect.enter.skewX="0" appearEffect.enter.skewY="0" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.24s 0.13s" appearEffect.enter.stagger="0s";
```

Content curve is AUDIT **ease-out** `cubic-bezier(0.23, 1, 0.32, 1)`. Duration **240ms** (under 300ms UI). Delays **80ms** then **130ms** = **50ms stagger** (band 30–80ms). Stagger must not block clicks.

**Remove** the sheet appearEffect (both primary and open replica):

```
SET j8mC0qp88 appearEffect.enter="null";
SET lHV5aHgaZj8mC0qp88 appearEffect.enter="null";
```

If `enter="null"` is rejected, SET `appearEffect.enter.opacity="1"` `appearEffect.enter.y="0"` `appearEffect.enter.transition="instant"`.

Mailto `OSaBHYPYg` tap `scale(0.97)` / `tween 0.23,1,0.32,1 0.16s 0s` — **keep**.

**Reduced motion** (in the code component): when `useReducedMotion()` or `useIsStaticRenderer()`, `clip-path: inset(0)` immediately if `open`, else hidden; opacity 200ms `cubic-bezier(0.23, 1, 0.32, 1)` allowed; **no** clip travel. Static renderer: **same tree**, freeze at the open or closed clip that matches `open` (Canvas must show the open overlay fully when the open variant is selected).

## Repo conventions to follow

- Push like Logo Menu Roll: `tmp/push-logo-menu-roll.js` pattern — `framer.createCodeFile` / `setFileContent` for `Menu_Paper_Reveal.tsx`, then `typecheck({ strict: true })`. Always `-s 2`.
- Static renderer canon: `docs/projects/STATIC_RENDERER.md` — `useIsStaticRenderer()`, freeze in place, named `function` export, imports only `react` / `framer` / `framer-motion` (or CSS transitions; CSS `clip-path` is preferred here because it is interruptible).
- `Logo_Menu_Roll` `open` control is the exemplar for a boolean the open replica sets `$control__open="true"`.
- PageVeil is **not** the menu exemplar.
- Do not retune Logo Menu Roll `holdLogo` / `holdMenu` / `roll` / `stagger` / `EASE_OUT`.

## Steps

1. Confirm live strings (expect 002 leftovers):

```js
const dark = await framer.agent.getNode({ id: "QZInDjV1k" }, { pagePath: "/" })
const open = await framer.agent.getNode({ id: "lHV5aHgaZ" }, { pagePath: "/" })
const sheet = await framer.agent.getNode({ id: "j8mC0qp88" }, { pagePath: "/" })
const openSheet = await framer.agent.getNode({ id: "lHV5aHgaZj8mC0qp88" }, { pagePath: "/" })
```

`dark.attributes.transition` and `open.attributes.transition` should already be `"instant"` — leave them. `openSheet.attributes.appearEffect.enter.y` should be `16` — that is what this plan removes.

2. Write `tmp/Menu_Paper_Reveal.tsx`:

- `export default function Menu_Paper_Reveal`
- Props: `open` (boolean), `color` (string, default `rgb(246, 243, 238)`), `style`
- `useIsStaticRenderer()` + `useReducedMotion()`
- Coerce `open` like Logo_Menu_Roll (`true` / `"true"` / `1`)
- Play clip on `open` change with `requestAnimationFrame` so a mount with `open=true` still animates from `inset(0 0 100% 0)` → `inset(0)` in Preview. On Canvas/static, skip the rAF and render the settled clip for the current `open`.
- Outer: `width: 100%`, `height: 100%`, `position: relative`, `overflow: visible`, `pointerEvents: none`, `aria-hidden`
- Inner: `width: 100vw`, `marginLeft: calc(50% - 50vw)`, `height: 100vh`, `background: color`, `clipPath` as Target, `transition` only when not frozen
- `@framerSupportedLayoutWidth any-prefer-fixed` / `@framerSupportedLayoutHeight any-prefer-fixed`
- `addPropertyControls`: `open` Boolean default false; `color` Color default `rgb(246, 243, 238)`
- No rAF loop. No `@keyframes`. No `scale(0)`.

3. Push with `-s 2`. Insert on **primary** Nav (never `+` into a replica):

```
+ComponentInstanceNode MenuPaper parent="QZInDjV1k" index="0" component="<id from createCodeFile export>" position="absolute" left="0px" top="0px" width="100%" height="100%" zIndex="0" pointerEvents="none" $control__open="false" $control__color="rgb(246, 243, 238)";
```

BrandRoll must stay `zIndex="2"`. Sheet `zIndex="1"`. Paper behind content, above the page.

4. Open replica only:

```
SET lHV5aHgaZMenuPaper $control__open="true";
```

(Use the remapped id from step 3. Do not `+` on the replica.)

5. Strip sheet fade; add pane entrance (primary ids):

```
SET j8mC0qp88 appearEffect.enter="null" fill="null";
SET lHV5aHgaZj8mC0qp88 appearEffect.enter="null" fill="null";
```

Sheet fill becomes transparent so the code paper is the only paper (avoids double paint). If `fill="null"` on the sheet makes closed/open flash incorrectly, keep sheet fill and make the code paper the same color — then the clip still provides the motion. Prefer one visible paper.

Then SET the two pane appearEffects from Target.

6. `node scripts/framer/verify.mjs -s 2 --page /` → `{ "ok": true }`.

## Boundaries

- Do NOT edit `tmp/Logo_Menu_Roll.tsx` or `tmp/Page_Veil.tsx` or `tmp/Drift_Plane.tsx`.
- Do NOT restore variant `tween 0.77,0,0.17,1 0.79s`.
- Do NOT animate width/height/padding/top on the Nav roots.
- Do NOT stagger Selected Work rows or form fields (reading/acting).
- Do NOT invent Omnicom “page card vacates” motion (that is a different project’s Overlay Nav).
- If `clip-path` is rejected by Marketplace/typecheck, STOP and report — do not fake SOTD by putting `y="16"` back on the sheet.

## Verification

- **Mechanical**: `node scripts/framer/verify.mjs -s 2 --page /` → `ok: true`. Re-read: variant `transition === "instant"`; sheet appearEffect y is gone; panes have y=12 / 240ms / delays 0.08s and 0.13s; Paper instance `$control__open` is false on closed, true on open.
- **Feel check** (Framer **Preview Play**, not `.framer.app`):
  - Click HALDEN/MENU: paper **unfurls down from the wordmark** to the viewport edges (no 1440 gutters). Dossier type arrives after the field, Contact ~50ms after Info.
  - Close: paper **retracts up** toward the bar (same clip path reversed) because the instance stays mounted and `open` flips to false. If close is still a hard cut, STOP and report — do not add a height tween to fake it.
  - Spam open/close: clip retargets (CSS transition), no keyframe restart from zero.
  - Animations panel 10%: **clip-path** on the paper, **opacity/transform** on the panes, **not** height/padding.
  - `prefers-reduced-motion`: paper does not travel; opacity may remain ~200ms; panes y=0.
  - Canvas open variant still shows the full dossier (static freeze at `inset(0)`).
- **Done when**: closed bar still ~48px; open paper is viewport-wide and born from the bar; 002’s 16px sheet fade is gone; verify green; Logo roll idle unchanged.

## Notes for the executor

- Run **after** `design-plans/halden-nav-full-bleed.md`.
- Always `-s 2`. Do not publish.
- Insert Paper on primary `QZInDjV1k` only.
