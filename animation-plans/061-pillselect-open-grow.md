# 061 — Pill Select open grow (liquid emerge)

- **Status**: DONE
- **Severity**: MEDIUM
- **Category**: Motion grammar / Symmetry
- **Estimated scope**: 1 file (`code-components/PillSelect.tsx`)
- **Audit**: #4

## Target

- First ~45% of open: `blobScaleY` 0.55→1, `blobScaleX` 0.82→1 (ease-out quad)
- Symmetry with close squash under goo

## Verification

- Open emerges from pill (grow) then settles to full menu; interruptible mid-open.
