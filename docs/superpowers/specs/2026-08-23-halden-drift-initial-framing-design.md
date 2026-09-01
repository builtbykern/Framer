# Halden Drift — initial framing

## Goal

Balance Drift's first view vertically so the lower third has more image presence without reducing its editorial whitespace.

## Design

- Shift the complete Drift plane downward by `min(frameHeight * 0.1, 96px)`.
- Apply the same framing offset to CMS and fallback items.
- Keep the offset identical in Framer Canvas/static rendering and live Preview.
- Preserve existing image scale, spacing, depth, tile dimensions, wrapping, drag, and idle motion.
- Do not expose a new property control; this is Halden-specific art direction.

## Implementation boundary

Add the offset while building slot coordinates, so every item moves by the same amount and relative geometry remains unchanged. The periodic tile size must not include the offset.

## Verification

- A regression test must fail before implementation and then confirm the responsive offset formula and all slot-building paths.
- Existing adaptive-tile and responsive-layout tests must remain green.
- Compare Home at Desktop and Phone widths in Framer without publishing.
