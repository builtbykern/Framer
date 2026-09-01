# Menu overlay is the Info + Contact dossier

Written against: `4aa0cbc`

## Evidence chain

- Surface: Halden Nav component `Ebz57iEJS`, variant `open` (`lHV5aHgaZ`). Menu Sheet `j8mC0qp88` (open replica `lHV5aHgaZj8mC0qp88`). Dossier `O9K_hJDIm`.
- Problem: MENU opens a 100vh paper sheet that only shows two sentences and `studio@halden.work`. The photographer dossier still lives on unlinked `/info` and `/contact`. User: overlay design is bad; too little info; too little contact.
- Design evidence (canvas, session `-s 2`, 2026-08-18):
  - Dossier children: Lead `AkMxCySBQ`, Body `E9jOt9qZy`, Enquiries `OSaBHYPYg` (`mailto:studio@halden.work`). Layout: vertical, `maxWidth 640px`, `gap 24px`, sheet pad `96px 24px 64px 24px`.
  - Info Column `ciSM1KfJk` (`/info`): Kicker “Info”, Lead `hDqTKEjAn` (Syne 27px / 500 / `-0.03em` / `1.28em` / ink / `textWrapBalance`), Body `X5NiczfU7` (Inter 16px / `1.65em` / muted), Selected Work `VnjNbfWNo` + Work List `ZeCe9dgU_` (`collection: Work`, sort Year `KKPJSa2Nk` desc, row `NpnTGAqQz`).
  - Contact Column `u1HS_S4AD` (`/contact`): Kicker “Contact”, Enquiries `wUuVWXBRo`, form `r8UDU5F6u` (`htmlTag=form`, gap 32) — Name / Email / Inquiry / Message / Send `IHmBAg24y`.
  - Tokens: paper `var(--token-38f71e00-788a-47bd-a813-10d6b48f262b)` `rgb(246,243,238)`; ink `var(--token-24aaa6c6-0b98-4eac-b695-5f20471f6b92)`; muted `var(--token-8028b435-146d-4074-967e-823e6635036f)`; line `var(--token-282fdcc4-6cdb-45c0-b253-cdfc6872052b)`. Label preset `I9B65psWv`. Link preset **Info Link**.
- Owner: Nav `Ebz57iEJS` Menu Sheet / Dossier (not the `/info` or `/contact` page trees).
- Scope and affected surfaces: every page that instances Nav (Home / Info / Contact / Work / 404, D/T/P). `/info` and `/contact` stay in the project, still unlinked from Nav.
- Uncertainty: Inquiry `<select>` options — copy live from `bCW0hGQGC` on `/contact` before recreating. Collection List inside a ComponentNode is supported (`collection="Work"`). No social URLs exist; do not invent them.

## Design decision

Rebuild the open overlay as the **existing Info + Contact layout**, not a third thinner copy. Desktop: two panes that fill the 100vh sheet. Narrow instance (Phone): the same two panes wrap into one column (`stackWrapEnabled`, pane `minWidth 280px`). Do not add Nav breakpoint variants. Do not write new photographer copy.

## Reuse

- Lead / Body type from Info (`hDqTKEjAn`, `X5NiczfU7`) — already on `AkMxCySBQ` / `E9jOt9qZy`.
- Label preset for kickers and field labels.
- Info Link for mailto + Work titles.
- Contact Form field metrics: label gap `8px`, input pad `8px 0px 10px 0px`, Inter 15px / ink, `borderColor` line token, Message height `112px` textarea.
- Submit component `IHmBAg24y` (`$control__label="Send"`, success `qOQGOMc_X`, pending `BKB6slTXy`).
- Work CMS: Title `lmTMqy_0B`, Year `KKPJSa2Nk`, Type `ZMWV4jFbG`, path `Bte5utJ62`.
- Exemplar: Info Column `ciSM1KfJk` + Contact Form `r8UDU5F6u`.

No new color/type token. No new code component.

## Changes

1. Nav primary Dossier `O9K_hJDIm` (do **not** `+` into replica `lHV5aHgaZ…`)
   - Change: `stackDirection="horizontal"` `stackWrapEnabled="true"` `stackDistribution="start"` `stackAlignment="start"` `gap="48px"` `width="100%"` `maxWidth="null"` `height="auto"`.
   - Preserve: parent Menu Sheet `100vh`, pad `96px 24px 64px 24px` on **open replica only**, paper fill, BrandRoll absolute CLOSE.
   - Verify: Dossier spans the sheet; at ~390px width the second pane wraps below.

2. Left pane (new Frame under `O9K_hJDIm`, e.g. `MenuInfo`)
   - Change: vertical stack, `width="1fr"` `minWidth="280px"` `height="auto"` `gap="24px"`. Children, in order:
     1. Kicker Label text `Info` (preset Label, ink/muted as Info kicker `DK27Cpv9y`).
     2. MOVE Lead `AkMxCySBQ` here. Keep current type. Copy stays: `Halden works in stills. Selected work is published as series — not as a dump of single frames.`
     3. MOVE Body `E9jOt9qZy` here. Copy: `Available for a small number of commissions each year. The plane on the home is the archive.` (do **not** add “This page is for when you already know the title.” — that sentence is page-index copy.)
     4. Selected Work block cloned from `VnjNbfWNo` / `ZeCe9dgU_` / `NpnTGAqQz`:
        - Label `Selected work` (IBM Plex Mono 11px, uppercase tracking as Label).
        - Collection List `collection="Work"` `repeatedDescendantId=<new row>` sort `KKPJSa2Nk` desc.
        - Row: horizontal, pad `18px 0`, gap `8px`, `borderBottom 1px solid rgba(17,17,17,0.16)`.
        - Title: `text="var(--variable-lmTMqy_0B)"` `link.href="/work/:Work"` `link.collectionItem="var(--variable-Bte5utJ62)"` (not `/work/:slug`) Syne 18px / 500 / `-0.02em` / Info Link.
        - Type: `optionToDisplayName` on `var(--variable-ZMWV4jFbG)` Label metrics.
        - Year: `numberToString` on `var(--variable-KKPJSa2Nk)` Label metrics.
        - Skip empty Tags frame `V81buFATH`.
   - Preserve: Home Drift Plane remains the visual archive; this list is the titled index in the menu.
   - Verify: seven Work titles; each title opens the matching detail through PageVeil (same-origin `<a>`).

3. Right pane (new Frame `MenuContact`)
   - Change: vertical stack, `width="1fr"` `minWidth="280px"` `gap="24px"`. Children:
     1. Kicker Label text `Contact`.
     2. MOVE Enquiries `OSaBHYPYg` here. Keep `mailto:studio@halden.work`, Label + Info Link. Optional prefix copy `Enquiries` as its own Label above the mail if the single line feels thin; do not drop the mailto.
     3. Recreate Contact Form (do **not** MOVE `r8UDU5F6u` off `/contact` — leave the page intact). Same fields, names, types, gaps, hairline, Message textarea `112px`. `htmlTag="form"`. `formSubmitButtonId` = new Send instance.
     4. Send: `+ComponentInstanceNode` `component="IHmBAg24y"` `$control__label="Send"` `$control__variant="Default"` `formButtonSuccessVariant="qOQGOMc_X"` `formButtonPendingVariant="BKB6slTXy"` `position="relative"` `width="auto"`. **Do not** copy Contact page `left="-100px"` (that instance is parked off-canvas).
   - First command of this step: `getNode` `bCW0hGQGC` on `{ pagePath: "/contact" }` and copy `formSelectOptions` 1:1 onto the new Inquiry select.
   - Preserve: `/contact` page form unchanged.
   - Verify: Preview Play — fill Name/Email/Message, Send; mailto opens mail client; PageVeil does **not** intercept `mailto:` (non-http).

4. Closed variants
   - Change: none to Dossier children (hidden with the sheet).
   - Preserve: `closedOnDark` hug ~40px; `closedOnLight` ~56px. Do **not** put `100vh` or 96px padding on primary hidden sheet (`j8mC0qp88` visible false). Open replica `lHV5aHgaZj8mC0qp88` keeps `height="100vh"` `padding="96px 24px 64px 24px"`.
   - Verify: closed Home bar is still a thin wordmark, not a 200px block.

## Scope

- Inherit: all Nav instances (`Yptm4PAEu`, `D95vytGIg`, `BWBNA6TJw`, `I4Ai7zBLv`, `wZeWup7yP` + T/P replicas).
- Verify: Home open on Desktop and Phone; Info/Contact/Work/404 still open the same overlay.
- Exclude: Logo Menu Roll idle (`tmp/Logo_Menu_Roll.tsx`); PageVeil; Drift Plane; deleting `/info` or `/contact`; social links; Nav variant motion (see `plans/002-halden-menu-open-drawer.md`).

## Validation

- Product: MENU already shows who Halden is, the series list, email, and the enquiry form. No second hop to `/info` or `/contact`.
- Interface: Desktop two panes; Phone wrapped column; 7 Work rows; form labels Name/Email/Inquiry/Message; empty form still has mailto as the visible action.
- System: tokens and Label/Info Link only; Work path `/work/:Work`.
- Repository: `node scripts/framer/verify.mjs -s 2 --page /` → `{ "ok": true }`. Then feel-check **Preview Play** (not stale `.framer.app`).

## Stop conditions

- Stop if Collection List `collection="Work"` is rejected inside the Nav component — report; do not fake titles as static text.
- Stop if DUPE from `/contact` into the component works; then skip recreate, but still re-parent into `MenuContact` and fix Send `left="-100px"`.
- Stop if closed Nav height exceeds ~56px after adding the list/form (hidden sheet is contributing layout) — pad/height must stay on the **open** replica only.

## Design documentation

- After acceptance: overlay is the dossier; `/info` and `/contact` remain unlinked fallbacks. No `docs/projects/halden.md` unless the user asks.
