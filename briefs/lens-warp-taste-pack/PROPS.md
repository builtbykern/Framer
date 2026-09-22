# Lens Warp — property contract (Marketplace Free v1)

Lean panel. Map to Framer `addPropertyControls`.  
Internal shader names may keep `u*` aliases — **panel labels** use the names below.

## Essential

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `image` | image | (demo still) | Required |
| `distortionStrength` | number | `-0.65` | Neg = pincushion, pos ≈ barrel; typical range ~-1.5…1.5 |
| `radius` | number | `0.45` | Normalized or px — document in control; clamp sane |
| `zoom` | number | `1.0` | Lens magnification |
| `aberration` | number | `0.015` | Keep low; 0 = off |
| `followPointer` | boolean | `true` | If false, lens stays centered (or `lensX`/`lensY` if you add fixed center later) |
| `backgroundColor` | color | `#F4F3F0` | Edge fill outside warped sample |

## Optional (only if panel stays thin)

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `gloss` | number | `0.25` | Soft highlight; 0 = off |
| `verticalScale` | number | `1.0` | Anisotropic scale |
| `inertia` | number | `0.15` | Pointer lag strength |
| `viscosity` | number | `0.2` | Lag damping |
| `width` | number | `800` | Optional; prefer parent fill |

## OUT (do not expose)
sceneW/H · columns · rows · cellSize · gap · cornerRadius · autoScroll · spring panel · image1…image9 · exportScene · DialKit presets

## Property control order
1. image  
2. distortionStrength, radius, zoom, aberration  
3. followPointer  
4. backgroundColor  
5. gloss, verticalScale (optional group)  
6. inertia, viscosity (optional group)  

## Accessibility
- `prefers-reduced-motion` → treat as `followPointer` false + no inertia animation.
- Decorative effect: do not rely on warp for meaning.

## Affiliate (preview helper, not core optics)
Prefer sibling button in preview. If in-comp: `affiliateCTA` bool default false; url `https://framer.link/builtbykern`; **new tab**.
