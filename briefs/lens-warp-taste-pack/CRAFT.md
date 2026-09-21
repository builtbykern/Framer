# Lens Warp — craft

Free Marketplace **code component**. Quiet optics — glass lens on a still, not a demo playground.

## Product
One image fills the component. A radial **pincushion / barrel** warp (glass lens) distorts the sample. Distortion center **follows the pointer** (optional). Outside the lens influence, edges fill with a solid **background color** (no stretch garbage). Optional **chromatic aberration** and a soft **gloss highlight** on the lens.

## Named move
1. Radial optical warp on a single image (negative strength ≈ pincushion, positive ≈ barrel).
2. Pointer-follow (with optional inertia / viscosity lag).
3. Edge fill = `backgroundColor`.
4. Optional aberration + gloss — keep subtle; FAIL if disco or SoftAsh particles.

## Shader map (demo source → SKU)
| Demo uniform / motion | SKU prop | Notes |
|----------------------|----------|-------|
| `uDistortionStrength` (~-0.65 default) | `distortionStrength` | Neg = pincushion, pos ≈ barrel |
| `uRadius` | `radius` | Lens radius |
| `uZoom` | `zoom` | Magnification in lens |
| `uAberration` | `aberration` | Optional |
| `uGlossIntensity` | `gloss` | Optional |
| `uVerticalScale` | `verticalScale` | Optional |
| `uBgColor` | `backgroundColor` | Edge fill |
| inertiaStrength / viscosity | `inertia`, `viscosity` | Optional pointer lag |
| Follow pointer | `followPointer` | Bool essential |

## OUT of Marketplace SKU (demo scaffolding only)
Scene W/H · columns/rows · cell size · gap · cornerRadius · autoScroll · spring physics panel · images 1–9 grid · Export Scene · DialKit presets / UI chrome.

## Layout
- Component = single media frame (width from parent or `width` prop). Height follows image aspect or fill.
- No DialKit chrome, no preset docks, no multi-cell gallery inside the component.
- Preview frame may place a sibling affiliate CTA under the component (new tab).

## Motion
- Pointer move updates lens center when `followPointer` true.
- Optional inertia/viscosity for lag — keep calm; not bounce-house.
- `prefers-reduced-motion`: freeze lens at center (or last position); no continuous idle animation.
- Touch: follow primary touch; graceful on mobile.

## Demo image
Use a neutral BuiltByKern-safe still (architecture / object / texture) — **not** Creative Stefan default grid photos. See `CONTENT-DEMO.md`.

## Build order
1. Full-bleed image plane + bg fill
2. Warp shader (strength, radius, zoom)
3. Pointer follow + reduced-motion path
4. Aberration + gloss (optional props)
5. Inertia / viscosity (optional)
6. Property controls per PROPS.md (lean panel)
7. Preview affiliate sibling CTA
8. Published-preview clip → VERIFY → stop for Noel

## Do not
- Clone DialKit UI, Creative Stefan branding, or demo photo set
- SoftAshBurnTrail / ash / burn / particles / cursor theater
- Multi-image grid, export scene, layout playground as product
- Fat prop panel (scene layout + 9 slots + springs)
- Invented remix counts in listing
