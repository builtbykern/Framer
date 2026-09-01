# 063 — Pill Select will-change only while morphing

- **Status**: DONE
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 1 file (`code-components/PillSelect.tsx`)
- **Audit**: #6

## Target

- `morphing` state true during `runOpen` / `runClose`
- `willChange: "transform"` only when morphing (silhouette + list)

## Verification

- Idle closed/open: no permanent will-change layers; morph still compositor-friendly.
