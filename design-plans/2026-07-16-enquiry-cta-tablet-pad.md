# Align Property Enquiry CTA Tablet padding to sibling content bands

Written against: Framer project `CmRyHJKPrPE6BZhC6d4S` (Arbour); git HEAD unavailable

## Evidence chain

- Surface: `/properties-2/:Properties` → Tablet → `Enquiry CTA`
- Problem: Tablet Enquiry CTA padding is `88px 40px 88px 40px` while sibling content bands on the same breakpoint use `96px 40px 96px 40px`
- Design evidence: Tablet `The Setting` `IQmBTrFpbuZ8oOXu4y`, `Property Particulars` `IQmBTrFpbvlElPVCV7`, `Continue Your Search` `IQmBTrFpbOA3sHhDMv` all `padding="96px 40px 96px 40px"`; Desktop Enquiry `Wy9_asNQu` already matches peers at `128px 48px 128px 48px`
- Owner: Tablet Enquiry CTA `IQmBTrFpbWy9_asNQu`
- Scope and affected surfaces: Property detail Tablet only
- Uncertainty: none

## Design decision

SET Enquiry CTA Tablet padding to `96px 40px 96px 40px` so all Property detail content bands share the same Tablet inset.

## Reuse

- Padding owner: Tablet Setting / Particulars / Continue `96px 40px 96px 40px`
- Exemplar: `IQmBTrFpbuZ8oOXu4y` (The Setting Tablet)

## Changes

1. `/properties-2/:Properties` (pagePath) → Tablet Enquiry CTA `IQmBTrFpbWy9_asNQu`
   - Change: `padding="96px 40px 96px 40px"`
   - Preserve: `gap="24px"`, `maxWidth="1200px"`, Desktop `Wy9_asNQu`, Phone `MrTKJzwELWy9_asNQu` padding
   - Verify: serialize padding exactly `96px 40px 96px 40px`

## Scope

- Inherit: none
- Verify: Property detail Tablet content-band stack
- Exclude: Journal detail; Phone Enquiry gap (separate plan); publish

## Validation

- Product: Enquiry CTA Tablet vertical inset matches Setting / Particulars / Continue
- Interface: Framer Tablet breakpoint on `/properties-2/:Properties`
- System: no new spacing token
- Repository: `serialize` `IQmBTrFpbWy9_asNQu` with `pagePath: "/properties-2/:Properties"` → padding `96px 40px 96px 40px`

## Stop conditions

- Stop if node missing or padding already matches exemplar
- Stop if edit mutates Desktop Enquiry padding away from `128px 48px 128px 48px`

## Design documentation

- none

## Status

Executed 2026-07-16 via Framer `applyChanges`: `IQmBTrFpbWy9_asNQu` padding → `96px 40px 96px 40px`. Unpublished.
