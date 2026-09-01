# 096 — Clip dossier with paper, ease-out, reduced-motion fade

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Physicality, Easing, Accessibility (findings 1, 2, 5)
- **Estimated scope**: 1 code file (`tmp/Menu_Paper_Reveal.tsx` → Framer `Menu_Paper_Reveal.tsx`) + Nav canvas wrap

## Problem

Halden Nav open/close (`Ebz57iEJS`). Menu Paper Reveal clips only its own fill. Menu Sheet sits `zIndex: 1` above paper `zIndex: 0`. Close sets Menu Open false immediately then `SET_VARIANT cycle` after `0.5s`. Dossier stays fully visible while the wash reverses, then teleports.

Paper/veil uses ease-in-out on a drawer:

```15:18:tmp/Menu_Paper_Reveal.tsx
const EASE_VEIL = "cubic-bezier(0.5, 0, 0.5, 1)"
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"
const PAPER = "rgb(246, 243, 238)"
const MS = 490
```

```97:103:tmp/Menu_Paper_Reveal.tsx
        clipTransition = `clip-path ${MS}ms ${EASE_VEIL}`
        blurTransition = [
            `backdrop-filter ${MS}ms ${EASE_VEIL}`,
            `-webkit-backdrop-filter ${MS}ms ${EASE_VEIL}`,
        ].join(", ")
        washTransition = `opacity ${MS}ms ${EASE_VEIL}`
```

`useReducedMotion` already drops clip/blur; canvas dossier still sits until 0.5s then pops.

## Target

- Keep `MS = 490`. Keep symmetric in/out. Swap drawer curve to **`cubic-bezier(0.23, 1, 0.32, 1)`** (`EASE_OUT`). Do **not** change `Page_Veil.tsx` (`cubic-bezier(0.5, 0, 0.5, 1)` stays for page turns).
- Wrap paper instance `YZqtWqBlB` + Menu Sheet `j8mC0qp88` in a Frame `Dossier Clip` (absolute, 100% × 100% closed / `100vh` on open replica `lHV5aHgaZ`). BrandRoll stays **outside** the wrap (z 2).
- `Menu_Paper_Reveal` applies the same `clip-path` + transition to **`parentElement`** when parent is named `Dossier Clip` (or `data-halden-dossier-clip` via a known parent name check). Paper fill stays inside the component.
- Reduced motion: no clip animation; parent `opacity` `1 ↔ 0` in **200ms** `cubic-bezier(0.23, 1, 0.32, 1)`. BrandRoll not faded.
- Do not tween Nav height. Do not retune Logo Menu Roll hold/roll/stagger. Variant cycle delay stays `0.5s`. `useIsStaticRenderer()` freeze in-place (no clip/opacity tween).

```ts
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"
const MS = 490
// clip + wash + blur all use EASE_OUT at MS
// parent.style.clipPath = washOn ? "inset(0)" : "inset(0 0 100% 0)"
```

## Repo conventions to follow

- Push with `tmp/push-menu-paper-reveal.js` pattern: `require("fs")` + `setFileContent` (dynamic `import("node:fs")` fails in the agent VM). Exemplar: `tmp/push-logo-menu-roll.cjs`.
- Session **`-s 2`**, project Halden `k5nCTheGrijbFstHsY31`. Rebind if `getProjectInfo().name !== "Halden"`.
- applyChanges `{ pagePath: "/" }` for Nav internals (same as `tmp/apply-menu-close-symmetric.js`).
- Reparent: `MOVE <id> parent="<DossierClipId>" index="N"`.

## Steps

1. Edit `tmp/Menu_Paper_Reveal.tsx`: `EASE_VEIL` usages → `EASE_OUT`. Add `useRef` + `useLayoutEffect` (or `useEffect`) to copy `clipPath` / `transition` onto `parentElement` when `parent.attributes` name is Dossier Clip — in runtime, check `parent.getAttribute("data-framer-name") === "Dossier Clip"` or parent first child relationship. Always clip parent if `parent.dataset` or name includes `Dossier`. Safer: prop `clipParent` boolean default **true**; closed instances also wrap after MOVE so true is fine.
2. Reduced motion branch: parent `opacity` 0 when `!open`, 1 when `open`; `transition: opacity 200ms cubic-bezier(0.23, 1, 0.32, 1)`; do not animate `clip-path`.
3. Static: no transitions; parent clip/opacity snap to `open`.
4. Push code file. Typecheck empty.
5. Canvas: `+FrameNode` Dossier Clip parent=`QZInDjV1k` position absolute width 100% height 100% zIndex 1 overflow visible. `MOVE YZqtWqBlB` index 0, `MOVE j8mC0qp88` index 1. Open replica height `100vh`. Paper stays absolute 100% 100%. Menu Sheet zIndex 1 inside wrap.
6. `node scripts/framer/verify.mjs -s 2 --page "/"`. Feel-check Preview Play: open — paper and Info/Contact reveal as one clip from the bar; close — dossier is eaten by the reverse clip, no 500ms hang.

## Boundaries

- Do NOT edit `Page_Veil.tsx`, `Logo_Menu_Roll.tsx` timing, Nav variant `transition` (keep `instant`), BrandRoll tap delay `0.5s`.
- Do NOT publish.
- Do NOT put a PageVeil instance inside Nav.

## Verification

- **Mechanical**: Framer typecheck on `Menu_Paper_Reveal.tsx` errors `[]`. `verify.mjs -s 2 --page "/"` ok.
- **Feel check**: Preview Play, toggle MENU/CLOSE twice fast (interruptible CSS). Slow motion 10%: clip starts immediately (ease-out, not slow start). Toggle OS reduced motion: opacity 200ms, no clip slide.
- **Done when**: dossier never sits fully opaque over a closed/closing wash; HALDEN/CLOSE remains tappable on the bar.
