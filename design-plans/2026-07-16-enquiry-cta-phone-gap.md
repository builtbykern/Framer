# Align Property Enquiry CTA Phone gap to 24px

Written against: Framer project `CmRyHJKPrPE6BZhC6d4S` (Arbour); git HEAD unavailable

## Evidence chain

- Surface: `/properties-2/:Properties` → Phone → `Enquiry CTA`
- Problem: Phone Enquiry CTA gap is `20px` while Desktop and Tablet Enquiry CTA keep `24px`
- Design evidence: Desktop `Wy9_asNQu` gap `24px`; Tablet `IQmBTrFpbWy9_asNQu` gap `24px`; Phone `MrTKJzwELWy9_asNQu` gap `20px` (pad already `64px 16px 64px 16px` matching Phone peers)
- Owner: Phone Enquiry CTA `MrTKJzwELWy9_asNQu`
- Scope and affected surfaces: Property detail Phone only
- Uncertainty: none

## Design decision

SET Enquiry CTA Phone `gap` to `24px` so the section stack gap matches Desktop/Tablet Enquiry CTA.

## Reuse

- Gap: `24px` (Enquiry CTA Desktop/Tablet owner)
- Exemplar: Desktop `Wy9_asNQu`

## Changes

1. `/properties-2/:Properties` (pagePath) → Phone Enquiry CTA `MrTKJzwELWy9_asNQu`
   - Change: `gap="24px"`
   - Preserve: `padding="64px 16px 64px 16px"`, `maxWidth="1200px"`, Desktop/Tablet Enquiry attributes
   - Verify: serialize gap `24px`

## Scope

- Inherit: none
- Verify: Property detail Phone Enquiry CTA
- Exclude: Tablet Enquiry padding (separate plan); Journal; publish

## Validation

- Product: Enquiry CTA stack gap consistent across breakpoints
- Interface: Framer Phone breakpoint on `/properties-2/:Properties`
- System: no new spacing token
- Repository: `serialize` `MrTKJzwELWy9_asNQu` with `pagePath: "/properties-2/:Properties"` → `gap === "24px"`

## Stop conditions

- Stop if node missing or gap already `24px`
- Stop if edit mutates Desktop/Tablet Enquiry gap

## Design documentation

- none

## Status

Executed 2026-07-16 via Framer `applyChanges`: `MrTKJzwELWy9_asNQu` gap → `24px`. Unpublished.
