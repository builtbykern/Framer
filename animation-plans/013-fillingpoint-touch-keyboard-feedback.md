# 013 — FillingPoint touch press fill + keyboard press

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH (touch) / MEDIUM (keyboard)
- **Category**: Feedback / State indication
- **Estimated scope**: `code-components/Kern_FillingPoint.tsx`

## Outcome

1. **Coarse / touch** (`!canHover`): `pointerdown` → full-bleed fill opacity 120ms in; `pointerup`/`cancel`/`leave` → 100ms out. No spring origin (product visible on mobile).
2. **Keyboard**: Enter/Space sets `pressed` (scale 0.97); keyup/blur clears. Works with or without link.
3. Opacity fill path shared with `prefers-reduced-motion` (`useOpacityFill`).

Pushed to Framer `codeFile/APe9aGh`. verify non-blocking.
