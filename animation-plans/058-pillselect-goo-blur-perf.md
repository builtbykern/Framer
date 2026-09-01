# 058 — Pill Select goo / CSS blur perf

- **Status**: DONE
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`code-components/PillSelect.tsx`)
- **Audit**: improve-animations + fixing-motion-performance #1

## Target

- SVG goo `stdDeviation="9"` (was 11); color matrix `18 -8`
- CSS soft blur only in goo crossfade window; peak `BLUR_PEAK = 2` (was 2.4 stacked all trip)

## Verification

- Preview: liquid neck still readable; less mush / GPU load mid-open.
