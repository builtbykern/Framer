# 404 recovers with the overlay editorial stack

Written against: `4aa0cbc`

## Evidence chain

- Surface: Halden `/404` (`nizhx6wAX`). Desktop `nACIEuvcP`, Tablet `BV5dxVKN3`, Phone `h0q8NyaAQ`. PageSurface `M8y3zENAg` (T/P replicas `BV5dxVKN3M8y3zENAg`, `h0q8NyaAQM8y3zENAg`). Canvas screenshot of Desktop: paper field + centered HALDEN only.
- Problem: PageSurface has **zero children** on D/T/P. The miss has no heading, no body, no next action. The 100vh paper still runs Work-detail’s stills enter (`opacity 0.7`, `y: -32`, `tween 0.5,0,0.5,1 0.49s 0.1s`) on top of PageVeil. Tablet/Phone roots are `height: 1000px` while Desktop is `height: auto`.
- Design evidence: baseline-ui empty states require one next action. Halden tokens `paper` `38f71e00-788a-47bd-a813-10d6b48f262b`, `ink` `24aaa6c6-0b98-4eac-b695-5f20471f6b92`, `muted` `8028b435-146d-4074-967e-823e6635036f`. Overlay Menu Info `XM4MY5kEq` is the editorial stack (Label kicker + Syne 27 Lead + Inter 16 muted Body, gap 24px). PageVeil `NPy89lI_k` owns the route wash (490ms, `cubic-bezier(0.5, 0, 0.5, 1)`). Nav instance `wZeWup7yP` `$control__variant=closedOnLight`. Home page name `Home`, path `/`. Overlay Body copy already on canvas: “The plane on the home is the archive.”
- Owner: `/404` PageSurface + T/P page roots. Not Nav, not PageVeil, not Logo Menu Roll, not Drift Plane.
- Scope and affected surfaces: `/404` Desktop/Tablet/Phone only.
- Uncertainty: none for emptiness / 1000px roots / PageSurface appear. Copy Lead line uses overlay vocabulary (still / series); if the user rejects that sentence, swap only the Lead string.

## Design decision

Turn `/404` into a single-column recovery still: the same type roles as Menu Info, vertically centered on paper, one link to `/`. Kill the full-viewport PageSurface appear so PageVeil stays the only route wash. Hug T/P artboards like Desktop.

This is Halden restraint (photographer overlay), not a giant decorative “404” and not a second archive.

## Reuse

- Color tokens `paper` / `ink` / `muted`
- Text style preset `Label` (`I9B65psWv`) for kicker + Home link
- Lead metrics from `AkMxCySBQ`: Syne 27px weight 500 letterSpacing `-0.03em` ink
- Body metrics from `E9jOt9qZy`: Inter 16px weight 400 muted
- Stack gap `24px` from `XM4MY5kEq`
- Horizontal inset `40px` from Nav closed padding `16px 40px`
- Vertical inset `96px` / `64px` from open Menu Sheet pad `96px 24px 64px 24px` (top clears the 48px Nav)
- Home link tap from `OSaBHYPYg`: `tapEffect.scale="0.97"` `tapEffect.transition="tween 0.23,1,0.32,1 0.16s 0s"`
- Content appear from `XM4MY5kEq`: `onMount` opacity 0 y 12 `tween 0.23,1,0.32,1 0.24s 0.08s`
- Exemplar: Nav overlay Menu Info `XM4MY5kEq` on component `Ebz57iEJS`

No new token, preset, code file, or CMS list. No Drift Plane.

## Changes

1. `/404` PageSurface `M8y3zENAg` (insert on primary only; T/P inherit)

   - Change: `SET M8y3zENAg` `layout="stack"` `stackDirection="vertical"` `stackDistribution="center"` `stackAlignment="start"` `padding="96px 40px 64px 40px"` `appearEffect.enter="null"` (fallback: opacity 1, y 0, transition instant). Keep `width="100%"` `height="100vh"` `fill="var(--token-38f71e00-788a-47bd-a813-10d6b48f262b)"`.
   - Insert Recover `FrameNode` parent `M8y3zENAg`: `layout="stack"` `stackDirection="vertical"` `stackDistribution="start"` `stackAlignment="start"` `gap="24px"` `width="100%"` `height="auto"` + the Menu Info appear string above.
   - Insert four children of Recover, in order:
     1. RichText **Kicker** — `textStylePreset="Label"` `text="404"` `tag="p"` `width="1fr"` `height="auto"`
     2. RichText **Lead** — copy `AkMxCySBQ`: Syne 27px 500 `-0.03em` ink `text="This still is not in the series."` `tag="h1"` `width="1fr"` `height="auto"` `textWrapBalance="true"`. Do **not** use Display 68px ExtraBold (fights the HALDEN wordmark).
     3. RichText **Body** — copy `E9jOt9qZy`: Inter 16px 400 muted `text="The plane on the home is the archive."` `tag="p"` `width="1fr"` `height="auto"`
     4. RichText **Home** — `textStylePreset="Label"` `text="Home"` `link.href="/"` + mailto tap (`scale 0.97` / `tween 0.23,1,0.32,1 0.16s 0s`) `width="1fr"` `height="auto"` `cursor="pointer"`
   - Preserve: PageVeil `NPy89lI_k` (do not retune blur/duration/z). Nav `wZeWup7yP` `closedOnLight`, `width 100%`, `left 0`, `right 0`, `zIndex 30`. Paper fill. Instant Nav variant morph.
   - Verify: serialize `M8y3zENAg` has those four text nodes; `appearEffect.enter` is null. Recover has the 240ms ease-out appear. Screenshot Desktop shows kicker / lead / body / Home under HALDEN, not a blank paper.

2. `/404` Tablet `BV5dxVKN3` + Phone `h0q8NyaAQ`

   - Change: `SET BV5dxVKN3 height="auto"`; `SET h0q8NyaAQ height="auto"`. Confirm PageSurface replicas still `height="100vh"` and inherit Recover.
   - Preserve: widths 768 / 390. Do not add Nav Phone/Tablet variants.
   - Verify: T/P roots `height: auto`. Phone PageSurface still fills the viewport; content not clipped by a 1000px artboard.

## Scope

- Inherit: T/P replicas of PageSurface / Recover.
- Verify: `/404` Desktop 1440, Tablet 768, Phone 390. Open MENU from 404 still shows the dossier. Home and `/work/:Work` PageSurface appears untouched.
- Exclude: Nav component internals, Logo Menu Roll, PageVeil timing, Drift Plane, CMS Work list, form, mailto, socials, Display preset, Home fill, publish.

## Validation

- Product: a missed URL shows why the path is empty and one control returns to the Home archive.
- Interface: Desktop / Tablet / Phone; closed Nav; MENU open overlay unchanged; Home link goes to `/`; reduced-motion stills via PageVeil’s existing gate (do not add clip-path here).
- System: type roles match Menu Info; no second Display wordmark; no full-screen y-32 paper tween on 404.
- Repository: `node scripts/framer/verify.mjs -s 2 --page /404` → `{ "ok": true }`. Closed 404 Nav instance still ~48px tall.

## Stop conditions

- Stop if inserting into PageSurface inflates the closed Nav bar above ~56px (same trap as padding on the primary Menu Sheet).
- Stop if Framer rejects `appearEffect.enter="null"` — use opacity 1 / y 0 / instant instead of deleting the effect key.
- Do not add Drift Plane, a giant 404 numeral, WebGL, gradients, or a Selected Work list.
- Do not tween Nav or PageSurface height/width/padding.
- Do not publish.

## Design documentation

- After acceptance: none unless the user asks for `docs/projects/halden.md`. Record that `/404` is a paper recovery still using the overlay editorial stack, not an Arbour cinematic exception.
