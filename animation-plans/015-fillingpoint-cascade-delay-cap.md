# 015 — Cap cascade delay at 120ms

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file

## Problem

`MAX_DELAY_MS = 400` plus spring exceeds ~300ms UI budget for hover cascade.

## Target

- `MAX_DELAY_MS = 120`
- Default fills delays: `0 / 60 / 100`
- Property control Delay max `120`, description updated

## Steps

1. Update constant, defaults, control max/description.
2. Push.

## Boundaries

- Do not change fillTransition defaults

## Verification

- Panel Delay slider tops at 120ms; cascade feels snappier
