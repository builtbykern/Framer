# 028 — Sync product contract and control copy

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: docs + control descriptions

## Problem

`docs/projects/filling-point.md` and Motion control copy still advertise
`480ms / 600ms / 0·90·180`, which will drift from the retuned cinematic default.

## Target

Document and describe:

- Enter `760ms`, exit `720ms`
- Stagger `0 / 140 / 280ms`
- Cover multiplier `2.4` (implementation detail; optional in buyer-facing copy)
- Motion preset description: cinematic is deliberate ink-spread, not UI hover

## Steps

1. Update `docs/projects/filling-point.md` Motion defaults bullet.
2. Update `motionPreset` / fills descriptions in `Kern_FillingPoint.tsx` if stale.
3. Mark plans 024–027 DONE in `animation-plans/README.md` after implementation;
   note 023 cinematic numbers are superseded by 024–027.

## Boundaries

- Do NOT edit the Cursor plan file outside `animation-plans/` / docs listed.
- Do NOT publish.

## Verification

- Contract and component defaults match.
- **Done when**: a new agent reading only the contract would author the same pacing.
