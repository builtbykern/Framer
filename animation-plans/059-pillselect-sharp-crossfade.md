# 059 — Pill Select sharp/goo opacity crossfade

- **Status**: DONE
- **Severity**: HIGH
- **Category**: Performance / Architecture
- **Estimated scope**: 1 file (`code-components/PillSelect.tsx`)
- **Audit**: #2

## Target

- `sharpSilhouetteOpacity = 1 - gooOpacity` on sharp base layer
- Avoid double-painting sharp + goo at full opacity during morph

## Verification

- Open mid-flight: only one silhouette silhouette visible at a time (crossfade).
- Settled open/closed: sharp at 1, goo at 0.
