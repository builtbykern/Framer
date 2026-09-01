# Series Stills as offset prints on Work detail

Written against: `4aa0cbc`

## Evidence chain

- Surface: Halden Work detail `/work/:Work` (`fpoP3kuA4`), Gallery Field `MI_ZHE7kH`, instance **Series Stills** `afUswAq7g` (Phone replica `Tf2mbU7BvafUswAq7g`). User-selected node; live path in the picker is `/work/:slug`.
- Problem: In Stack, every still is `width: 100%`, `objectPosition: center`, same left edge. Four Gallery stills read as one repeated full-bleed plate under Cover, not as a series of prints.
- Design evidence:
  - Cover `f6xqQ9saT`: `width 100%`, `height fit-image`, `overflow clip`, fill `var(--variable-KF94WDLfr)` — the only full-width plate in column `yn0nMGJJL` (Desktop `67%`, Phone `100%`, gap `28px`).
  - Instance `afUswAq7g`: `$control__layout = Stack`, `$control__gap = 28`, `$control__images` from `var(--variable-WTTAaEd5y)` → `arrayToArray` → `image` = `var(--variable-ZkP9UsFFL)`.
  - Home instance `yGFlVus2I` is **Grid** gap `8` — different layout; must stay a 2×2 contact sheet.
  - Tokens: paper `rgb(246, 243, 238)`, ink `rgb(17, 17, 17)`, muted `rgb(107, 107, 107)`, line `rgb(217, 212, 204)`. Text style **Label**: IBM Plex Mono 11px, `letter-spacing 0.14em`, uppercase, muted.
  - User instruction for this node: distinct dimensions and alignments; originality. Do not crop photographs to invented aspect ratios.
- Owner: `tmp/Series_Stills.tsx` (remote code file `jeA2cvO`), Stack branch only.
- Scope and affected surfaces: Work detail Stack instances D/T/P. Home Grid instance must keep current geometry.
- Uncertainty: none for the four-step cycle (Gallery is 4 stills on all 7 Work items). Extra rows cycle the same four prints.

## Design decision

Treat Stack as a **print pile on the paper column**, not a second Cover. Cycle four print recipes (width + `alignSelf`) so each still sits on a different edge and scale. Keep intrinsic image height (`object-fit: contain`, `height: auto`). Cover remains the only 100% plate. Grid mode is unchanged.

## Reuse

- Gap `28` (already instance + column + meta stack `rT9WGdFVR`).
- Index: existing `indexFont` / `indexColor` (Label metrics: 11px, `0.14em`, muted). Do not change `letter-spacing`.
- `fontVariantNumeric: "tabular-nums"` on the index (data numerals).
- CMS bind unchanged (`arrayToArray` on `{ image }`).
- Static renderer: existing `useIsStaticRenderer()` + `useReducedMotion()` freeze in place — same tree.
- Exemplar for “one full plate then other sizes”: Cover `f6xqQ9saT` in `yn0nMGJJL`. Do not clone Drift Plane scatter positions.

No new color/type token. No new code component.

## Changes

1. `tmp/Series_Stills.tsx` — Stack branch only (`layout !== "grid"`).

   - Change: After resolving `stills`, map `index % 4` to this table (exact values):

     | index % 4 | width | alignSelf |
     |-----------|-------|-----------|
     | 0 | `82%` | `flex-start` |
     | 1 | `68%` | `flex-end` |
     | 2 | `91%` | `flex-start` |
     | 3 | `58%` | `flex-end` |

     Apply `width` + `alignSelf` on the **figure** (not on the section). Keep `img` `width: 100%` of the figure, `height: auto`, `objectFit: "contain"`. Figcaption `textAlign: "left"` when `flex-start`, `"right"` when `flex-end`. Add `fontVariantNumeric: "tabular-nums"` on the caption. Do not add `aspectRatio` in Stack. Do not change Grid (`1 / 1`, `objectFit: cover`, gap from props).

   - Preserve: CMS `images` Array-of-Object control; gap prop default `28`; Index on/off; freeze-in-place motion (`duration: 0` when static/reduced); `position: relative` on the section; named `function` export; imports only `react` / `framer` / `framer-motion`.

   - Verify: Detail Stack stills are four different widths, alternating left/right. Cover still full width. Home Grid still 2×2 squares.

2. Canvas (after push of the same file to `jeA2cvO`).

   - Change: none required on `afUswAq7g` if it stays Stack / gap 28. Replicas Tablet `LSqc1L2WHafUswAq7g` and Phone `Tf2mbU7BvafUswAq7g` inherit the code. Do not set Home `yGFlVus2I` to Stack.

   - Preserve: `$control__images` Gallery bind on detail and Home.

   - Verify: `node scripts/framer/verify.mjs -s 2 --page /work/:Work` and `--page /`. Session always `-s 2`.

## Scope

- Inherit: all Stack instances of Series Stills (today: Work detail D/T/P).
- Verify: Home Grid `yGFlVus2I` (and T/P replicas) still square 2×2.
- Exclude: Drift Plane, Cover fill, sticky meta `rT9WGdFVR`, new layout enum, inner horizontal scroller, random aspect crops, Tailwind (Framer code component — no Tailwind).

## Validation

- Product: Open any Work detail (e.g. `/work/salt-light` after publish, or canvas `/work/:Work`). Scroll past Cover: stills 01–04 sit as offset prints; none match Cover’s 100% width.
- Interface: 4 stills (current CMS); 0 stills (empty section); Desktop 67% column vs Phone 100% column; Index on/off; Grid instance on Home unchanged.
- System: No second gap token; Label tracking `0.14em` untouched; no new motion (baseline-ui: do not animate large images further).
- Repository: `node scripts/framer/session.mjs` then `node scripts/framer/exec.mjs -s 2 -f tmp/push-series-stills.cjs` (or equivalent `setFileContent` on `Series_Stills.tsx`) → typecheck empty. `node scripts/framer/verify.mjs -s 2 --page /work/:Work` → `ok: true`, `blocking: false`. Do not publish.

## Stop conditions

- Stop if detail instance is no longer Stack or Gallery bind is missing.
- Stop if changing Stack would force Home off Grid.
- Stop if a step requires cropping stills to a fixed aspect ratio.

## Design documentation

- After acceptance: one line in `docs/projects/halden.md` if that file is created — Stack Series Stills = offset prints; Grid = contact sheet. Until then, none.
