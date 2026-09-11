# Sill Skin A — Framer code component

Pasteable code component for Helpful Clicks. Craft bar: **Bruce**. Paper `#F4F3F0`, ink `#000`, exact 50/50, one grotesk.

**Noel RED only — do not publish.**

## Mac (primary)

Standalone folder: [`kit/`](kit/) (download from PR or clone).

## Mac — from `~/Desktop/Framer`

```bash
cd ~/Desktop/Framer
git fetch origin && git checkout cursor/sill-skin-a-code-component-7555 && git pull
zsh templates/sill/install-desktop-shortcut.sh   # once
# then double-click Desktop “Paste Sill Skin A”
# or:
zsh templates/sill/paste-on-mac.sh
```


## Paste into Framer (manual)

1. Open Helpful Clicks. Do not publish.
2. Assets → Code → New Component.
3. Paste the full contents of [`Kern_SillSkinA.tsx`](Kern_SillSkinA.tsx). Save.
4. Drop **Kern Sill Skin A** full viewport (fill / 1440×900). Do not nest in a skinny stack.
5. Still = [`assets/still-chair.png`](assets/still-chair.png) (cover, no radius).

## Bind props

| Control | Source | Demo |
|---|---|---|
| Name | Page field / CMS Name | ADA VALE |
| Line | Page field / CMS Line | Independent designer. Visual identity, web, and a shop. |
| Links | Array max 6 — Label + URL | Instagram, Shop, Are.na, Mail, Notes, Booking |
| Still | Image | Chair still (cover, no radius) |
| Alt | String | Studio still, chair and daylight |

Code components cannot read CMS collections directly — paste link rows into the Links array (or bind each control from page fields). See Context `docs/sill-framer-cms-bind.md`.

## DO NOT (matches FAIL shot `media/sill/desktop-framer-fail.png`)

Do **not** rebuild Skin A by hand in Framer stacks/frames. Paste this component only. Reject any canvas that shows:

1. **Skinny left rail** (~30/70) — must stay exact **50/50**
2. **Floating / inset photo card** with cream letterboxing under or around the still
3. **Middle-dot / bullet links** (`· Instagram`) — links are **`01`–`06` + label only**, tight ~12px stack, bottom-anchored
4. **Vertical divider / column rule** between type and still
5. **Lifestyle room collage** as still — quiet single-object chair still only
6. **Linktree air** (huge gaps between rows) or mid-column floating lists
7. About / nav / footer / SELECTED WORK chrome (Bruce portfolio — do not clone)

If the canvas matches the FAIL shot → delete it and re-paste `Kern_SillSkinA.tsx`.

## Screenshots → stop

Capture and drop into Context:

- `media/sill/desktop.png`
- `media/sill/mobile.png`
- `media/sill/critique-vs-bruce.png`

Critique must name **Bruce** hold or fail (air / type / links / still). Soulmates only if no still. **PASS only if Bruce holds.** Then **STOP for Noel RED.** No publish.

## Hard locks (encoded in CSS)

Exact 50/50 · full-bleed cover still · `01`–`06` text links + spacer bottom-anchor · name small caps · heavy tight line · paper/ink · no divider · max 6 links · desktop `minHeight: 100vh/100dvh` + `overflow: hidden`.
