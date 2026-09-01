# 019 — Cascade delays (readable stagger)

- **Status**: SUPERSEDED by 023
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Purpose & frequency
- **Estimated scope**: 1 file

## Problem

The intermediate `0/55/110` values still compress the product's defining
cascade and do not produce a readable reverse hover-out.

## Target

- See plan 023: `0 / 90 / 180`, cap `280ms`, reverse visual exit order.

## Verification

Historical only. Do not restore the 120ms cap.
