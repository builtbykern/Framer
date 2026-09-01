# Dive Field panel credit — blue Explore more link

- **Status**: DONE — 2026-08-05
Written against: `4aa0cbc`

## Evidence chain

- Surface: Framer editor properties panel for Dive Field — author credit link under the host control
- Problem: “Explore more components” must render as a **blue clickable link** (Matt). User evidence showed raw Markdown: literal `[Explore more components]` and a truncated `(https://…)` URL instead of a link.
- Design evidence:
  - Matt exemplar screenshot (Nova Glow Navigation): muted brand line + blue “Explore more components” (URL not shown as raw text).
  - Published Matt string (exact): `Built by Matthias Ölschlegel 💪\n[Explore more components](https://framer.link/fsd2pgh)` — one `\n`, then a single-line `[label](href)` with a short href (no `@`).
  - Framer docs: control `description` supports Markdown emphasis and links.
  - User preference: brand line is `BuiltByKern` (not `Built by BuiltByKern`).
  - Prior Dive Field attempt with `https://www.framer.com/@builtbykern/` appeared as unbroken Markdown in the panel; treat raw `@` in the href as unsafe for Framer’s description Markdown parser.
- Owner: the **same** leaf `description` chosen in plan `design-plans/2026-08-05-divefield-panel-credit-host.md` (expected: `motion.controls.respectReducedMotion.description`)
- Scope and affected surfaces: that one `description` string; panel presentation only
- Uncertainty: Confirm after push that Framer renders a blue link with the encoded href; if still raw, stop and report — do not invent a new control type

## Design decision

Use Matt’s description shape with BuiltByKern copy and a **safe** href (percent-encoded `@`):

```text
BuiltByKern
[Explore more components](https://www.framer.com/%40builtbykern/)
```

In source (one string, one `\n` before the Markdown link, link on one line — never split `](` across lines):

```ts
description:
  "BuiltByKern\n[Explore more components](https://www.framer.com/%40builtbykern/)",
```

Apply this string only on the credit host leaf from the host plan. Do not put it on `motion` Object once the host plan has restored Motion’s functional description.

## Reuse

- Exemplar string shape: Matt Nova Glow Navigation / Nova Glow Button credit `description`
- Profile target: `https://www.framer.com/@builtbykern/` (encoded as `/%40builtbykern/` inside the Markdown href)
- No new dependency; no `framer.link` required unless user later supplies one

## Changes

1. `code-components/DiveField.tsx` — credit host leaf `description` (see host plan)
   - Change: Set `description` to exactly  
     `"BuiltByKern\n[Explore more components](https://www.framer.com/%40builtbykern/)"`  
     (credit-only; no other help sentences in that description)
   - Preserve: control type, title, defaults, runtime behavior of the host control
   - Verify: Panel shows `BuiltByKern` plus a blue “Explore more components” link; no visible raw `[` `]` or bare URL; click opens creator profile

2. Push
   - Change: session pin Dive Field `7mzOTQA5ZdZVnu6ZH54e` + `node scripts/framer/push-divefield.mjs`
   - Preserve: no Community publish
   - Verify: `typeErrors: []`; reselect component so the panel refreshes

## Scope

- Inherit: Depends on host plan (credit must live on the last leaf, not on Motion Object help)
- Verify: Same Dive Field instance panel
- Exclude: Changing dive WebGL; renaming controls; adding Name/Credits fields; other SKUs

## Validation

- Product: Credit line readable; Explore more is a real hyperlink in the properties panel
- Interface: Compare visually to Matt Nova Glow Navigation credit (muted text + blue link, above Edit Code)
- System: Single credit `description`; Motion group description remains functional help after host plan
- Repository: `node scripts/framer/push-divefield.mjs` → `typeErrors: []`

## Stop conditions

- Stop if after push with encoded href the panel still shows raw Markdown — report to user; do not add dummy controls or HTML
- Stop if host plan not applied and credit is still on `motion.description` while also duplicating on a leaf — leave only one credit host
- Stop if user supplies a `framer.link/…` short URL — substitute that href and keep the same label

## Design documentation

- None unless user asks to standardize this string across Kern Marketplace components
