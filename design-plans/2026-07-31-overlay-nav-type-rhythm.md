# Overlay Nav type rhythm (drop Inter, open link spacing)

Written against: `4aa0cbc`

**Status: DONE** (executed 2026-07-31) — Winning `fontName=Geist`; Main Links `gap=22px`; metrics applied via direct RichText SET (textStylePreset name bind failed; orphan presets `sSYuF7w57` etc. left unused). Close CTA recreated (`da1QYFKHd`) after it was missing from the overlay tree. Open page nudged to `top=520px` `height=260px` after gap increase.

## Evidence chain

- Surface: Framer **Overlay Nav** (`F7FlnigBf`) on Strong Luxury (`32N5ipHfkUMlPJAI6dc7`); variants Closed (`kDMpFjM_a`) / Open (`n2HVu4xxo`); Home instance `sqnDbYVx6`.
- Problem: Open menu and Closed hero read as a generic Inter stack; main links are optically cramped (`gap=8px` at `42px` type), which undercuts the SOTD / Kern read after card-depth (#1) was restored.
- Design evidence:
  - improve-ui finding #2 (user-selected): contract = user design rule to avoid Inter/default stacks + SOTD complaint; runtime serialize 2026-07-31 shows all RichText on `fontName="Inter"`; Main Links `B5sTCQVbU` `gap="8px"`; links `fontSize=42px` `letterSpacing=-0.03em` `lineHeight=1.2em`; Hero `yHc0Yo_8l` Inter `40px`; Logo `VDagMH3R4` Inter `18px` weight 600.
  - DSL supports `fontName` on RichText / text style presets (exemplar: `+TextStylePresetNode` + `fontName="Geist Mono"` in project `core-examples.md`).
- Owner: canvas RichText + Main Links stack inside `F7FlnigBf`. Not `BurgerFlip.tsx`.
- Scope and affected surfaces: Closed primary text styles (shared to Open unless overridden); Main Links gap; optionally Hero + Logo for one family. Sub links / credit stay smaller muted Inter→same family at 12/11px.
- Uncertainty: Exact Framer `fontName` string for Geist Sans — if `Geist` fails, use the first successful non-Inter grotesque from a short allowlist below; do not invent a custom uploaded font file.

## Design decision

Replace the default Inter stack with a single non-Inter grotesque and open the main-link vertical rhythm so Open reads as intentional type, not a template list.

Canonical metrics (Closed primary — Open inherits):

| Role | Nodes | fontName | size | weight | letterSpacing | lineHeight |
| --- | --- | --- | --- | --- | --- | --- |
| Main links | `wSswwqXL9` About, `aRunkhjle` Work, `mVSnNnL_D` Studio, `jl0cQkm_e` Journal, `kjKd7G6yu` Contact | `Geist` (see allowlist) | `42px` | `400` | `-0.04em` | `1.05em` |
| Main Links stack | `B5sTCQVbU` | — | — | — | — | **gap `22px`** (was `8px`) |
| Hero | `yHc0Yo_8l` | same family | `40px` | `400` | `-0.04em` | `1.1em` |
| Logo | `VDagMH3R4` | same family | `18px` | `600` | `-0.03em` | `1.2em` |
| Sub links | `j95dfI_60`, `tiZGHLgMz`, `CXslz0ZZX` (+ dots) | same family | `12px` | `400` | `-0.01em` | `1.2em` |
| Credit | `EFyEqqszS` | same family | `11px` | `400` | `-0.01em` | `1.2em` |
| Close × | `R3nbPXiGi` | same family | `22px` | `300` | `0em` | `1.2em` |

**fontName allowlist (try in order, stop at first clean apply):** `Geist`, `Instrument Sans`, `Synonym`, `DM Sans`. Never `Inter`, `Roboto`, `Arial`, or system UI stacks.

Prefer creating two `TextStylePresetNode`s under the project and binding via `textStylePreset` so the five links stay in sync; if preset binding fails on component-scoped rich text, SET attributes directly on each RichTextNode id above.

## Reuse

- Existing RichText nodes and Main Links frame — no new text layers.
- Optional: `+TextStylePresetNode` pattern from Framer DSL examples (`name` + `fontName` + metrics + `textStylePreset` on nodes).
- Exemplar: Omnicom open — generous link breathing; Kern rule — no Inter.
- Do not change Open page vacate geometry from plan #1 unless links clip (see Stop conditions).

## Changes

1. Session pin (mandatory before edits)
   - Change: `node scripts/framer/session.mjs --url "https://framer.com/projects/Strong-Luxury--32N5ipHfkUMlPJAI6dc7-gX7Pa" --name "Overlay Nav"` then always `exec.mjs -s <returned sessionId>`.
   - Preserve: Do not touch Contact Dock.
   - Verify: `getProjectInfo()` id maps to Strong Luxury / `32N5ipHfkUMlPJAI6dc7`.

2. Main Links gap
   - Change: `SET B5sTCQVbU gap="22px";`
   - Preserve: stack direction vertical, center alignment.
   - Verify: serialize `B5sTCQVbU.attributes.gap === "22px"`.

3. Type family + metrics on primary text
   - Change: Apply chosen `fontName` + table metrics to Main link ids, Hero, Logo, Sub links, Credit, Close × (Closed primary ids listed above).
   - Prefer presets:
     - `+TextStylePresetNode ovnStyleLink name="Overlay Nav / Link" tag="p"; SET ovnStyleLink fontName="<chosen>" fontWeight="400" fontSize="42px" letterSpacing="-0.04em" lineHeight="1.05em" textColor="rgb(255, 255, 255)";`
     - `+TextStylePresetNode ovnStyleHero name="Overlay Nav / Hero" tag="p"; SET … fontSize="40px" lineHeight="1.1em" …`
     - `+TextStylePresetNode ovnStyleLogo name="Overlay Nav / Logo" tag="p"; SET … fontSize="18px" fontWeight="600" letterSpacing="-0.03em" …`
     - Then `SET <richTextId> textStylePreset="Overlay Nav / Link";` (or the renamed preset name Framer returns) for each main link; Hero/Logo accordingly.
   - If `fontName="Geist"` errors, retry allowlist until one applies; record the winning name in the plan Status line when done.
   - Preserve: copy strings (About/Work/…, hero sentence, BuiltByKern); colors; Open opacity/y overrides on links.
   - Verify: serialize shows `fontName` ≠ `Inter` on those nodes; Open screenshot still shows all five links above the page card.

4. Open clip check (only if needed)
   - Change: If after `gap=22px` Journal/Contact collide with page card (`n2HVu4xxoUJl7mEBgf` at `top=500px` `height=280px`), nudge page `top` to `520px` or `height` to `260px` — minimum change to clear type. Do not redo finding #1 architecture.
   - Preserve: overlay behind page; header top; Open overlay `opacity=0.99`.
   - Verify: Open screenshot — five links fully readable, card still visible below.

## Scope

- Inherit: Open variant text (inherits Closed primary styles).
- Verify: Closed hero + logo; Open menu stack; Preview toggle.
- Exclude: Finding #3 (hide burger on Open); BurgerFlip; new code component; publish; cloud rename.

## Validation

- Product: Closed and Open look like one intentional type system; Open links no longer feel like a tight Inter list.
- Interface: Screenshot Closed (`kDMpFjM_a`) and Open (`n2HVu4xxo`); confirm `fontName` via serialize; confirm gap `22px`.
- System: No parallel Inter leftovers on the audited nodes.
- Repository: `node scripts/framer/verify.mjs` (pinned Overlay Nav session) → `ok: true`, no blocking errors.

## Stop conditions

- Stop if no allowlist `fontName` applies via DSL — report which names failed; do not upload a random font file without user OK.
- Stop if fixing clip requires redesigning Open layout beyond a small page-card nudge (escalate).
- Stop if session drifts off `32N5ipHfkUMlPJAI6dc7`.

## Design documentation

- After acceptance: Engram `component/dock-nav-effect` — Overlay Nav display face = `<winning fontName>`; main link gap `22px`. Optional: one line in `framer.project.json` notes.
