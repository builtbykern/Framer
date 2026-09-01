# Nav paper is viewport-wide

Written against: `4aa0cbc`

## Evidence chain

- Surface: Halden Nav `Ebz57iEJS`, instances on every page. Home `Yptm4PAEu` (`position: fixed`, `left: 0`, `right: 0`, `width: 100%`, `zIndex: 30`). Open variant `lHV5aHgaZ`. User: the navbar is not full width.
- Problem: The Nav **component roots** are a 1440px-wide box with `maxWidth: 1440px`. The Home page `WQLkyLRf1` is also `width: 1440px`. Preview/publish wider than 1440 shows the 1440 site centered; the fixed Nav (and the open paper sheet) stay 1440px, so MENU leaves side gutters.
- Design evidence (session `-s 2`, 2026-08-18):
  - `QZInDjV1k` (closedOnDark): `width: 1440px`, `maxWidth: 1440px`, no fill, `overflow: clip`.
  - `x9XW91SaY` (closedOnLight): `width: 1440px`, `maxWidth: 1440px`, paper fill.
  - `lHV5aHgaZ` (open): `width: 1440px`, `maxWidth: 1440px`, `minHeight: 100vh`, paper fill `rgb(246, 243, 238)`.
  - Menu Sheet `j8mC0qp88` / open replica: `width: 100%` of that 1440 root.
  - Instance rect on Desktop: `1440×48`. Tablet replica `BjqrvIntTYptm4PAEu`: `768×48`. Phone `nyI5jW7lAYptm4PAEu`: `390×48`.
  - DSL `width` does **not** accept `vw` (height accepts `vh`). Code overrides are not available to external agents.
- Owner: Nav component roots + page instances (not Logo Menu Roll, not PageVeil).
- Scope and affected surfaces: Home / Info / Contact / Work / 404 Nav instances, all breakpoints.
- Uncertainty: if an ancestor `transform` (page `transition: spring-physics 500 60 1 0s` on `WQLkyLRf1`) makes `position: fixed` contain to the 1440 page, `width: 100%` alone is not enough — plan 003’s paper uses a `100vw` + `calc(50% - 50vw)` breakout. Do not change the page to `width: 100%` in this plan (that would reflow Drift Plane).

## Design decision

Unlock the Nav roots so they fill whatever width the instance actually is. Keep HALDEN/CLOSE centered. Do not add a paper fill to `closedOnDark` (Home stays a dark plane with a wordmark, not a paper strip).

## Reuse

- Instance pinning already correct: `position: fixed`, `left: 0px`, `right: 0px`, `width: 100%`, `zIndex: 30` on `Yptm4PAEu`, `D95vytGIg`, `BWBNA6TJw`, `I4Ai7zBLv`, `wZeWup7yP` + T/P replicas.
- Open paper fill `rgb(246, 243, 238)` / token `38f71e00-788a-47bd-a813-10d6b48f262b`.
- Exemplar: Phone instance already reads full-bleed at 390px — same pinning, no 1440 cap at that breakpoint.
- Viewport breakout for the **open paper** lives in `plans/003-halden-menu-sotd-paper.md` (code component). This plan only removes the 1440 lock.

No new color/type token.

## Changes

1. Nav variant roots `QZInDjV1k`, `x9XW91SaY`, `lHV5aHgaZ` (`pagePath: "/"`)

   - Change: `width="100%"` `maxWidth="null"` on all three. Keep `minHeight="100vh"` on open only. Keep closedOnDark `height="auto"`. Keep closedOnLight `height="56px"` if still set, or `auto` if it hugs.
   - Preserve: padding `16px 40px` on closed; BrandRoll centered; Logo Menu Roll; open sheet pad `96px 24px 64px 24px` on **open replica only**; dossier two-pane wrap.
   - Verify: serialize all three roots — `width` is `100%`, `maxWidth` is absent/null. Home instance rect width equals the preview width (not stuck at 1440 if the preview is wider).

2. Nav instances (only if a replica overrode width)

   - Change: confirm `width="100%"` `left="0px"` `right="0px"` `position="fixed"` on Home `Yptm4PAEu`, Info `D95vytGIg`, Contact `BWBNA6TJw`, Work `I4Ai7zBLv`, 404 `wZeWup7yP`, and Home T/P `BjqrvIntTYptm4PAEu` / `nyI5jW7lAYptm4PAEu`. SET only the ones that drifted.
   - Preserve: `height="auto"` (do not set `10vh`). `zIndex="30"`.
   - Verify: Phone still 390-wide; Desktop instance matches page width.

## Scope

- Inherit: every Nav instance.
- Verify: Home / Work / Info closed + open at Desktop and Phone.
- Exclude: page `WQLkyLRf1` width (stays 1440 unless a later plan says otherwise); Logo Menu Roll; PageVeil; dossier copy; variant `transition` (plan 003).

## Validation

- Product: MENU paper and the fixed bar reach the left and right edges of the preview, not a 1440 island.
- Interface: Desktop ≥1440, Tablet 768, Phone 390; open and closed.
- System: still one Nav component; no parallel header.
- Repository: `node scripts/framer/verify.mjs -s 2 --page /` → `{ "ok": true }`.

## Stop conditions

- Stop if Framer rejects `maxWidth="null"` or `width="100%"` on a variant ground — report the error; do not set a magic pixel width.
- Stop if closed Home bar exceeds ~56px after unlocking width (hidden sheet contributing layout).
- Do not SET `width="100vw"` via DSL (not in the width grammar). Viewport escape is plan 003.

## Design documentation

- After acceptance: Nav chrome is instance-wide; open paper viewport-bleed is 003. No `docs/projects/halden.md` unless the user asks.
