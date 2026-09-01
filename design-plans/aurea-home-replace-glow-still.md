# Replace House Note glow with Essence still

Written against: `4aa0cbc`

## Evidence chain

- Surface: Strong Luxury / Aurea Home `/` · Mind Over Matter `pe8mR6Cmm` (chrome HOUSE NOTE 01—03) · frame `QmJHdoWPn` (layer name Abstract Energy Study)
- Problem: The left column is a magenta–gold radial glow, not Aurea photography or Aurea color tokens. It reads as a Quantum leftover and as a glow used as the section’s primary visual.
- Design evidence: User-selected Home polish keeps palette and photos. Aurea color tokens (`Aurea/Ink`, `Aurea/Bone`, `Aurea/Clay`, …) do not include `#A12646` / `#F6B600`. Rendered `note-d` shows the glow orb. Runtime fill on `QmJHdoWPn` / `J5oev3dzjQmJHdoWPn` / `IwdhW0PKTQmJHdoWPn`: `radial-gradient(50% 50% at 50% 50%, #191114 0%, #A12646 48%, #F6B600 100%)`. Frame has no children.
- Owner: `QmJHdoWPn` fill
- Scope and affected surfaces: Home `/` that frame on Desktop, Tablet, Phone
- Uncertainty: none for the fill swap. Do not change frame size, radius, or padding.

## Design decision

Replace the glow fill with the Essence still already on Home (`kDCXLMEGm` → `https://framerusercontent.com/images/FV98BmRS2oZ5MiTUz6xH5vbbjtM.jpg`). Reuse an existing Aurea photo; do not upload a new image; do not invent a new token.

## Reuse

- Image URL already on Home Essence `kDCXLMEGm` (zip 2 still `o0k2u`)
- Frame `QmJHdoWPn` keeps its layout (400×520 Desktop, pad 28px) — only `fill` changes
- Exemplar: Essence 01 Image `kDCXLMEGm` — photography in a rounded dark/light editorial slot, not a gradient

If a new primitive is required: none. Do not create a color token for magenta.

## Changes

1. Home `/` · House Note left visual `QmJHdoWPn`
   - Change: `applyChanges` `pagePath: "/"`:
     ```
     SET QmJHdoWPn fill="https://framerusercontent.com/images/FV98BmRS2oZ5MiTUz6xH5vbbjtM.jpg";
     SET J5oev3dzjQmJHdoWPn fill="https://framerusercontent.com/images/FV98BmRS2oZ5MiTUz6xH5vbbjtM.jpg";
     SET IwdhW0PKTQmJHdoWPn fill="https://framerusercontent.com/images/FV98BmRS2oZ5MiTUz6xH5vbbjtM.jpg";
     ```
     Rebound Strong Luxury; `node scripts/framer/exec.mjs -s 2`.
   - Preserve: width/height/padding/radius of `QmJHdoWPn`; section copy and “Read the journal” button `QKP7LrMKS`; Essence section still uses the same URL; no new upload.
   - Verify: `getNode` fill on the three ids equals that URL (no `radial-gradient`, no `#A12646`). Screenshot `pe8mR6Cmm`, `J5oev3dzjpe8mR6Cmm`, `IwdhW0PKTpe8mR6Cmm` — still life, not magenta orb.

## Scope

- Inherit: Home Tablet / Phone replicas of `QmJHdoWPn`
- Verify: Essence `kDCXLMEGm` unchanged; Manifesto image unchanged
- Exclude: type/spacing in this section; JOIN THE CIRCLE; Phone nav; Four Principles 04; publish; new Lummi files

## Validation

- Product: House Note reads as the same house (oil/cloth/resin still), not a glow graphic.
- Interface: Home D/T/P. Image crop inside 400×520 (Desktop) may differ from Essence 4:5 — acceptable; do not retouch.
- System: One photo URL, two slots (Essence + this frame). No third asset.
- Repository: rebound Strong Luxury then `node scripts/framer/verify.mjs -s 2` → `{ "ok": true }`. Do not publish.

## Stop conditions

- Stop if `kDCXLMEGm` fill URL has changed — copy whatever URL is live on Essence, do not use a new file.
- Stop if `QmJHdoWPn` gained children that must stay above a glow.
- Stop if session is not `32N5ipHfkUMlPJAI6dc7`.

## Design documentation

- After acceptance: none.

## Executor constraints (baseline-ui)

- Do not keep or restyle the radial gradient.
- No new glow, blur, or animation.
- Do not change letter-spacing.
- Fill swap only.
