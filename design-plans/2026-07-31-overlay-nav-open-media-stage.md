# Elevate Open Menu Overlay to a media stage

Written against: `4aa0cbc`

**Status: DONE** (executed 2026-07-31) — Media Plate `UUkDeLyMH` + Scrim `D_plh6cTW` under links; stage image Unsplash night skyline → `https://framerusercontent.com/images/LmOPtjezyzHFoxv2Ln2aquvnKSY.jpg`; overlay fill `#000000`; Open scrim `rgba(0,0,0,0.55)`.

## Evidence chain

- Surface: Framer **Overlay Nav** (`F7FlnigBf`) on Strong Luxury / Overlay Nav (`32N5ipHfkUMlPJAI6dc7`); variants Closed (`kDMpFjM_a`) / Open (`n2HVu4xxo`); Home instance `sqnDbYVx6` on Desktop `WQLkyLRf1` (`pagePath: "/"`).
- Problem: After approach-B card vacate, Open still reads as white type on a dead flat charcoal field. The “revealed” stage behind the page is not a visual attractor.
- Design evidence:
  - Executed plan `design-plans/2026-07-31-overlay-nav-open-card-depth.md` (DONE): Open is a **spatial reveal** — Menu Overlay sits behind Page Card; page vacates so the **menu layer becomes the visible stage** (Omnicom “content vacates, menu behind,” header stays top). That stage is currently still a solid fill.
  - Live serialize (2026-07-31): Menu Overlay `YZyip03ga` `fill="#1a1a1a"`; children only `Main Links` / `Sub Links` / `Credit` — **no** Image, Video, Shader, or gradient plate. Root Open `fill="#141414"`; Page Card `fill="#000000"`. Open overlay `opacity="0.99"`.
  - Rendered Open screenshot: centered Geist links + X + lower black rounded card; background band is uniform dark gray with zero pictorial/atmospheric content.
  - User improve-ui request (2026-07-31): raise visual level; background must **not** be the flat field already seen; needs something **muy visual** that grabs attention. Binding frontend rule for this work: do not rely on flat, single-color backgrounds; prefer a real visual anchor (imagery / place / atmosphere) over decorative-only washes.
- Owner: Menu Overlay frame `YZyip03ga` (and Open replica `n2HVu4xxoYZyip03ga`) inside ComponentNode `F7FlnigBf`. Not `BurgerFlip.tsx`.
- Scope and affected surfaces: Closed/Open of `F7FlnigBf` only (overlay media is always in the tree; Closed keeps overlay `opacity=0` so media is hidden until Open). Home instance inherits.
- Uncertainty: **Exact media URL/file is not in the project.** Executor must not invent brand photography. Stop until the user supplies an image or video URL (or explicitly approves one temporary editorial placeholder URL in writing). Scrim opacity may need ±0.1 after first Open screenshot for link contrast.

## Design decision

Treat Open Menu Overlay as a **media stage**, not a solid ink plate:

1. Insert a full-bleed **media plate** (Image preferred; Video only if user supplies MP4) as the **first child** of `YZyip03ga`, behind Main Links / Sub Links / Credit.
2. Cover it with a full-bleed **dark scrim** Frame so white Geist links, logo, and X stay readable.
3. Keep approach B: overlay behind page, page vacates, header top. Do not return to opaque-modal-on-top. Do not replace this with a purple/indigo AI gradient cliché or a cream/serif wash.

Closed stays visually unchanged at rest (overlay still `opacity=0`). The attention hit lands when the menu opens and the vacated band reveals the media stage.

## Reuse

- Existing layers: `YZyip03ga` Menu Overlay, `B5sTCQVbU` Main Links, `TxTQsPi7C` Sub Links, `EFyEqqszS` Credit, Page Card `UJl7mEBgf`, Header `ESWONFiU3`.
- Existing Open opacity `0.99` on overlay (Framer drops exact `1` when Closed is `0`) — keep.
- Existing type metrics from `design-plans/2026-07-31-overlay-nav-type-rhythm.md` (Geist, gap `22px`) — preserve; do not retune type in this plan.
- Exemplar structure: `design-plans/epic-marketplace-atmosphere.md` (full-bleed atmosphere **under** chrome) — reuse the **stacking** pattern only; this plan uses **Image/Video + scrim**, not `liquid-gradient`, so the stage is a real visual anchor.
- No new code component.

## Changes

1. Session pin (mandatory)
   - Change: `node scripts/framer/session.mjs --url "https://framer.com/projects/Strong-Luxury--32N5ipHfkUMlPJAI6dc7-gX7Pa" --name "Overlay Nav"` then `exec.mjs -s <sessionId>`.
   - Preserve: Do not edit Contact Dock (`2GOZzqC76RSbm2V0FOXP`).
   - Verify: project id `32N5ipHfkUMlPJAI6dc7`.

2. Media asset gate
   - Change: Obtain user-supplied image (or video) URL / uploaded Framer asset id **before** any canvas insert. If none, **stop** (see Stop conditions).
   - Preserve: No placeholder invent unless user explicitly approved a concrete URL in the same thread.
   - Verify: Asset loads in Framer (image visible when tested on a throwaway frame if needed).

3. `YZyip03ga` — media plate (Closed primary; Open inherits)
   - Change: Add absolute full-bleed child **behind** link stacks:
     - Prefer `+FrameNode ovnMediaPlate` with `position="absolute"` `left="0"` `top="0"` `width="1200px"` `height="800px"` (or `1fr`/`1fr` if parent fills), `overflow="hidden"`, then set background image to the approved asset (`backgroundImage` / image fill per DSL available in session — use `npx @framer/agent@latest docs` for the exact image attribute if unsure; do not guess).
     - Or native Image node if that is the project’s established image insert path.
     - `object-fit` / image sizing: **cover**, centered.
     - `MOVE` so media is index `0` under Menu Overlay; Main Links remain above.
   - Preserve: Overlay size `1200×800`; Closed overlay `opacity=0`; Open `opacity=0.99`.
   - Verify: serialize Menu Overlay children order starts with media plate; Open screenshot shows pictorial field in the vacated upper/mid band.

4. `YZyip03ga` — scrim
   - Change: Add `+FrameNode ovnMediaScrim` absolute full-bleed **above media, below links**:
     - `fill="rgba(0,0,0,0.55)"` as first try (tune `0.45`–`0.65` after screenshot).
     - `pointerEvents` none if available; otherwise leave non-interactive (no onTap).
   - Preserve: White link color; do not recolor type in this plan.
   - Verify: Open screenshot — links still clearly legible; media still readable as atmosphere (not crushed to pure black).

5. Menu Overlay solid fill
   - Change: Set `YZyip03ga` `fill` to `"#000000"` or transparent only as **fallback under** media (so Closed opacity ramp / edges never flash empty). Do **not** leave `#1a1a1a` as the visible Open stage.
   - Preserve: sibling order Overlay → Page Card → Header.
   - Verify: Open no longer reads as flat `#1a1a1a` void behind type.

6. Z-order / interactions
   - Change: Confirm Header + Burger Hit / Close Flip still frontmost; Burger Hit `SET_VARIANT` Open↔Closed unchanged.
   - Preserve: Page Card Open geometry (`top≈520px` `height≈260px` `radius=28` `left=40` `width=1120`) from prior plans.
   - Verify: Preview toggle; X still closes; media does not block header hit area.

## Scope

- Inherit: Home `sqnDbYVx6` Open/Closed.
- Verify: Closed still looks like current full-bleed page (overlay hidden); Open shows media stage + links + docked card + top header.
- Exclude: Page Card hero imagery (separate finding); BurgerFlip code; type/gap retune; publish; Contact Dock; shader-only atmosphere unless user later rejects photography and explicitly chooses shader.

## Validation

- Product: Open menu → vacated band shows a strong photographic/film stage that draws the eye; links readable; close via X; header stays top.
- Interface: Screenshot Closed + Open; Preview toggle; extreme — very bright media still passes scrim readability; very dark media still shows some detail.
- System: One media plate + one scrim under existing link stacks; no parallel modal overlay; no new code file.
- Repository: `node scripts/framer/verify.mjs` (pinned Overlay Nav session) → `ok: true`, no blocking errors.

## Stop conditions

- Stop if no user-approved media URL/asset is available.
- Stop if session is not `32N5ipHfkUMlPJAI6dc7`.
- Stop if making media readable requires moving Header to bottom or putting overlay above the page (contradicts approach B).
- Stop if contrast forces inventing a new type color system — escalate; only tune scrim opacity in this plan.
- Stop if user wanted Page Card Closed hero imagery instead of / only — that is finding #2; do not silently expand.

## Design documentation

- After acceptance and validation: record that **Open Menu Overlay = media stage + dark scrim under links** (solid `#1a1a1a` retired as the visible stage). Destination: Engram topic `component/overlay-nav-close` or `component/dock-nav-effect`, and a one-line Status update on this plan file.
