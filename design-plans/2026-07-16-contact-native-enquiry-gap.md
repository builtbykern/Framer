# Align Contact Native Enquiry Copy gap to opener contract

Written against: unavailable (Framer project `CmRyHJKPrPE6BZhC6d4S`, not a git HEAD)

## Evidence chain

- Surface: `/contact` → `Contact Hero` (`jmmPpci8t`) → `Hero Copy` → nested `Native Enquiry Copy`
- Problem: Title stack gap is `20px` while sibling opener stacks use `24px`
- Design evidence: Properties Hero Copy gap `24px` (secondary-page opener contract); Contact `Hero Copy` already gap `24` / mw `1200`
- Owner: Contact `Native Enquiry Copy` frame (nested under Hero Copy)
- Scope and affected surfaces: `/contact` Desktop Contact Hero only
- Uncertainty: none for gap; keep `maxWidth: 940px` (title measure; not part of finding)

## Design decision

SET `Native Enquiry Copy` `gap` to `24px` so the Contact opener title stack matches the Properties Hero Copy gap contract. Do not change padding, maxWidth, presets, or tokens.

## Reuse

- Gap owner: Properties Hero Copy `gap: 24px`
- Exemplar: `/properties-2` Properties Hero → Hero Copy

## Changes

1. `/contact` → Contact Hero → Hero Copy → `Native Enquiry Copy`
   - Change: `gap="24px"` (from `20px`)
   - Preserve: `maxWidth: 940px`, typography presets, tokens, Hero Copy pad `72/48/56/48`, outer Hero Copy gap `24`
   - Verify: serialize shows `gap: 24px` on Native Enquiry Copy; Hero Copy still `24` / mw `1200`

## Scope

- Inherit: none (local frame)
- Verify: `/contact` Desktop Contact Hero hierarchy
- Exclude: Contact Opening, Opening Note, Market Context, About Beat 1, Home, `/404`, publish

## Validation

- Product: Contact opener title (kicker → display) spacing matches other secondary openers
- Interface: `/contact` Desktop; confirm gap only on Native Enquiry Copy
- System: no new spacing token; reuse 24px opener gap
- Repository: Framer serialize `/contact` Contact Hero depth 3 → Native Enquiry Copy `gap === "24px"`

## Stop conditions

- Stop if Native Enquiry Copy is missing, renamed, or already at `24px`
- Stop if gap is locked by a component prop that cannot be set via `setAttributes` / `applyChanges`

## Design documentation

- After acceptance: none required (conformance to existing opener gap contract)

## Status

Executed 2026-07-16 via Framer session 1: `qxIyvg6PE` gap → `24px` (verified serialize). Unpublished.
