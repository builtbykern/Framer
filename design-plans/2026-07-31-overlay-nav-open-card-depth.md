# Restore visible Open card-depth (overlay behind + page vacates)

Written against: `4aa0cbc`

**Status: DONE** (executed 2026-07-31) — Open page `top=500px` `height=280px` (tuned from plan 420/360); Open overlay `opacity=0.99` (Framer drops `1` and inherits Closed `0`).

## Evidence chain

- Surface: Framer project **Overlay Nav** / Strong Luxury (`32N5ipHfkUMlPJAI6dc7`), component **Overlay Nav** (`F7FlnigBf`), variants **Closed** (`kDMpFjM_a`) and **Open** (`n2HVu4xxo`); Home instance `sqnDbYVx6` on Desktop `WQLkyLRf1` (`pagePath: "/"`).
- Problem: In Open, the menu reads as a flat full-bleed link list. The agreed “card push” (page compress / inset while header stays up) is not visible.
- Design evidence:
  - Session decision: approach **B** — page compresses (scale/inset); **header stays at top**; do **not** dock header to bottom of viewport.
  - Live serialize Open: Page Card (`UJl7mEBgf` / compound `n2HVu4xxoUJl7mEBgf`) has `left=50px` `top=24px` `width=1100px` `height=752px` `radius=28px` `opacity=0.25`, but Menu Overlay (`YZyip03ga`) is an **opaque** `#1a1a1a` full-size layer **above** the page in sibling order (`Page → Overlay → Header`), so the recessed card never shows.
  - Rendered Open screenshot (audit): no compressed card ring; only centered links + header chrome.
  - Reference Omnicom open motion (without adopting header-to-bottom): main content translates away so the menu layer behind becomes visible in the vacated band.
- Owner: `Overlay Nav` ComponentNode `F7FlnigBf` (canvas smart component). Code `BurgerFlip.tsx` (`codeFile/Qh_sncI:default`) is out of scope for this plan.
- Scope and affected surfaces: Closed/Open variants of `F7FlnigBf`; Home instance inherits variant behavior. No other pages/components.
- Uncertainty: Exact `top`/`height` of the vacated Open Page Card may need ±20px visual tuning after first screenshot; do not change header dock behavior.

## Design decision

Make Open a **spatial reveal**, not an opaque modal on top:

1. **Menu Overlay sits behind Page Card** (and Header stays frontmost).
2. On **Open**, Page Card **moves down and slightly insets/radiuses** so the upper/center band of the overlay (links + close) is uncovered. Header remains pinned at the top of the root variant (no `y` to bottom of viewport).
3. Page Card stays **opaque** at rest Open (not `opacity=0.25`) so the compressed card remains a readable layer below the menu band — depth you can still see.

This restores the SOTD layered read while honoring “header does not dock to bottom.”

## Reuse

- Existing layers only: `UJl7mEBgf` (Page Card), `YZyip03ga` (Menu Overlay), `ESWONFiU3` (Header), link nodes under `B5sTCQVbU`, Close `n7udalYpn`.
- Existing transitions already on Closed root / page / overlay (`tween 0.77,0,0.175,1 1s 0s` and link staggers) — reuse; do not invent a parallel motion system.
- Exemplar intent: Omnicom “content vacates, menu behind” — **without** moving the header to the bottom bar.
- No new code component or shared primitive for this finding.

## Changes

1. `F7FlnigBf` / Closed primary `kDMpFjM_a` — sibling order
   - Change: `MOVE UJl7mEBgf parent="kDMpFjM_a" position="1"` is wrong target order. Required order back→front:
     1. Menu Overlay `YZyip03ga` (back)
     2. Page Card `UJl7mEBgf`
     3. Header `ESWONFiU3` (front)
   - Apply via:
     - `MOVE YZyip03ga parent="kDMpFjM_a" position="0";`
     - `MOVE UJl7mEBgf parent="kDMpFjM_a" position="1";`
     - `MOVE ESWONFiU3 parent="kDMpFjM_a" position="2";`
   - Preserve: Closed visual (overlay `opacity=0`, page full-bleed black, header top).
   - Verify: serialize Closed children order = Overlay, Page Card, Header.

2. `F7FlnigBf` / Open replica `n2HVu4xxo` — Page Card geometry
   - Change: On compound `n2HVu4xxoUJl7mEBgf`, replace current weak inset + `opacity=0.25` with a vacate that clears the menu stack:
     - `left="40px"`
     - `width="1120px"`
     - `top="420px"` (page occupies roughly the lower half; tune ±20px if links clip)
     - `height="360px"`
     - `radius="28px"`
     - `opacity="1"` (visible compressed card under the menu band)
   - Preserve: Page Card fill `#000000`; Hero text inside; Closed full-bleed `left/top=0` `width/height=1200×800` `radius=0` `opacity=1`.
   - Verify: Open screenshot shows (a) menu links + close fully visible in the upper/mid band, (b) rounded black page card still visible in the lower portion, (c) header logo + burger still at the **top** of the 1200×800 frame (not at bottom).

3. `F7FlnigBf` / Open — Menu Overlay
   - Change: Ensure `n2HVu4xxoYZyip03ga` has `opacity="1"` and remains full-size `1200×800` behind the page. Keep link opacity/y Open overrides already set on `n2HVu4xxowSswwqXL9` … `kjKd7G6yu`, sublinks, credit.
   - Preserve: Closed overlay `opacity=0`; staggered link transitions.
   - Verify: With overlay behind, Open links are not covered by the page card after step 2.

4. Header (both variants)
   - Change: **None** to `y` / bottom docking. Keep `ESWONFiU3` at `top="0px"` `height="72px"`.
   - Preserve: Burger Hit `SET_VARIANT` → Open; Close `SET_VARIANT` → Closed.
   - Verify: Header top edge stays at top in both variant screenshots.

5. Session / harness (executor)
   - Change: Before any `applyChanges`, pin session explicitly:
     - `node scripts/framer/session.mjs --url "https://framer.com/projects/Strong-Luxury--32N5ipHfkUMlPJAI6dc7-gX7Pa" --name "Overlay Nav"`
     - Always `exec.mjs -s <sessionId from that switch>` (do not rely on bare `session.mjs`; it can retarget Contact Dock).
   - Preserve: Do not edit Contact Dock (`2GOZzqC76RSbm2V0FOXP`).
   - Verify: `getProjectInfo()` name/id matches Strong Luxury / `32N5ipHfkUMlPJAI6dc7` (cloud display name may still read “Strong Luxury”).

## Scope

- Inherit: Home instance `sqnDbYVx6` (variant switching).
- Verify: Closed still looks like full-bleed hero; Open interactions burger↔close still work in Preview.
- Exclude: Finding #2 (type/gap), Finding #3 (hide burger on Open), BurgerFlip code, publish, renaming cloud project, Contact Dock cleanup.

## Validation

- Product: Open menu via burger; see layered reveal (menu band + lower page card); close via ×; header never jumps to bottom.
- Interface:
  - Screenshot Closed (`kDMpFjM_a`) and Open (`n2HVu4xxo`).
  - Preview toggle both variants.
  - Confirm link labels remain readable (not clipped by page card).
- System: No new code file; only canvas variant overrides + MOVE order.
- Repository: `node scripts/framer/verify.mjs` (after pinned Overlay Nav session) → `ok: true`, no blocking errors.

## Stop conditions

- Stop if Open cannot uncover the link stack without moving the **Header** to the bottom (do not reintroduce header dock).
- Stop if session is not `32N5ipHfkUMlPJAI6dc7` / Overlay Nav sandbox.
- Stop if fixing clip requires redesigning copy or type (that is finding #2).
- Stop if product asks to keep opaque overlay-on-top — that contradicts this plan; escalate instead of mixing both models.

## Design documentation

- After acceptance and validation: record in project notes / next session memory that **Open = overlay behind + page vacates downward; header stays top** (approach B refined). Destination: Engram topic `component/dock-nav-effect` and optional one-liner in `framer.project.json` notes — only after user accepts the executed result.
