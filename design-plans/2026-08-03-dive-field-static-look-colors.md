# Dive Field static canvas uses Look colors (not R/G encoding)

Written against: `4aa0cbc`

## Evidence chain

- Surface: Dive Field on Framer Canvas and Export (`useIsStaticRenderer() === true`) in sandbox project `7mzOTQA5ZdZVnu6ZH54e` (Dive Field / Agreeable Direction). Home Desktop instance of `DiveField`.
- Problem: On the Framer canvas the specimen type renders bright red (body) and green (heading) instead of the Look panel colors (defaults white / cyan on near-black). Preview (WebGL) looks correct; Canvas/Export do not.
- Design evidence:
  - Look defaults in `code-components/DiveField.tsx`: `textColor: "#FFFFFF"`, `headingColor: "#6FD3FF"`, `bgColor: "#060606"` (Kern house).
  - Channel encoding for the live text shader only: `rasterizeSection` paints heading `#00ff00` (G) and body `#ff0000` (R) (~L597–L602). The WebGL fragment shader remaps R→`textColor`, G→`headingColor`.
  - Static path (~L1178–L1198) calls `rasterizeSection` then `ctx.drawImage(bmp, …)` with only `look.bgColor` under the bitmap — no remap. Dependency array omits `look.textColor` / `look.headingColor`.
  - framer-code-components: static preview should show a useful visual state, not an internal encoding artifact.
- Owner: `code-components/DiveField.tsx` — static `useEffect` under `DiveField`; optionally a shared helper next to `rasterizeSection` if extraction keeps the file clear.
- Scope and affected surfaces: Framer Canvas + Export/thumbnail static renders of Dive Field only. Live Preview WebGL path must keep R/G encoding for the shader.
- Uncertainty: none for color remap. Optional light grain/vignette on static is out of scope for this plan (would be a separate craft pass).

## Design decision

When `useIsStaticRenderer()` is true, never present the R/G channel-encoded bitmap as the on-canvas image. Produce a display raster that uses `look.textColor` for body and `look.headingColor` for headings on `look.bgColor`, so Canvas/Export match the Look contract and Preview’s remapped result.

Keep `rasterizeSection`’s R/G encoding for the WebGL texture pipeline unchanged.

## Reuse

- Look colors already on props: `look.textColor`, `look.headingColor`, `look.bgColor` (and their defaults in `DEFAULT_LOOK`).
- Exemplar pattern: same file’s live shader remap conceptually (`TEXT_FRAG` maps R/G to those uniforms) — static path should express the same mapping in 2D.
- No new shared token primitive. Do not introduce a second encoding scheme for WebGL.

## Changes

1. `code-components/DiveField.tsx`
   - Change: Add a display-oriented raster path for static/export only, e.g. `rasterizeSectionDisplay(section, content, { textColor, headingColor })` that mirrors `rasterizeSection` layout but fills heading with `headingColor` and body with `textColor` (transparent or black plate is fine; final frame still fills with `look.bgColor`). Alternatively, after encoding, composite via pixel remap (R→textColor, G→headingColor) onto a display canvas — same visual outcome; prefer re-draw with final colors for sharpness and less code complexity than a pixel loop.
   - Change: Static `useEffect` must call that display raster (not the raw encoding canvas), draw it centered as today, and depend on `look.textColor`, `look.headingColor`, and `look.bgColor` (and content/fonts as now).
   - Preserve: Live WebGL boot/`rebuildLayers` must still use R/G `rasterizeSection` for `createTextureFromCanvas`. Wheel/drag/shaders/HUD-less UI unchanged. Property controls unchanged.
   - Verify: On Framer Canvas, first section reads white (or Look text) body and cyan (or Look heading) title on `#060606` (or Look bg) — no saturated red/green encoding visible. Preview still dives with RGB dissolve as before.

2. Push + verify (executor harness)
   - Change: `node scripts/framer/session.mjs --id 7mzOTQA5ZdZVnu6ZH54e --name "Dive Field"` then `node scripts/framer/push-divefield.mjs` then `node scripts/framer/verify.mjs`.
   - Preserve: Existing Home instance; remount only if needed.
   - Verify: typecheck clean; verify ready; Canvas screenshot/manual check shows Look colors.

## Scope

- Inherit: All Dive Field instances (Canvas, Export, thumbnail) that use `useIsStaticRenderer`.
- Verify: Preview WebGL still uses encoded textures; reduced-motion and scroll behavior untouched.
- Exclude: Adding HUD back; changing specimen copy; tunnel/grain static approximation; renaming the component; Marketplace listing assets.

## Validation

- Product: Designer places Dive Field on canvas and sees brand Look typography, not red/green encoding.
- Interface: Canvas at default Look; change Look colors in panel and confirm static redraw; open Preview and confirm dive still works.
- System: Single owner file; no parallel “preview colors” props; encoding remains WebGL-only.
- Repository: `node scripts/framer/push-divefield.mjs` → `typeErrors: []`; `node scripts/framer/verify.mjs` → `ok: true`, no blocking errors.

## Stop conditions

- Stop if Framer static renderer no longer hits this `useEffect` (API change) — re-locate static entry before inventing a new preview.
- Stop if a future change removes channel encoding from WebGL; then unify on one rasterizer instead of dual paths.
- Do not widen into motion/shader redesign.

## Design documentation

- After acceptance and validation: none required in `DESIGN.md` (none governs this SKU). Optional one-liner in listing docs later if a listing pack is written: “Canvas shows Look colors; WebGL uses internal R/G text encoding.”
