# Halden Menu Exit Motion

## Goal

Give the Nav menu a clear reverse exit that matches its paper-reveal entrance while closing faster.

## Motion

- Keep the existing 490 ms entrance unchanged.
- On close, the semantic button emits `halden:menu-exit` and sets `Menu Open=false` immediately.
- Fade the menu content while moving it down 24 px over 180 ms.
- Retract the paper clip upward over 280 ms.
- Switch the Nav to `closed` after 280 ms so the exit completes before the open variant is removed.
- Use the existing Halden easing family; animate only transform, opacity, blur, and clip-path.

## Accessibility

- Preserve the semantic button and its single ownership of all menu actions.
- Keep both state and variant actions on the semantic button; the internal exit event starts the visual handoff.
- Reduced motion removes translation and blur, retaining brief opacity feedback.
- Keep the close action responsive for pointer and keyboard activation.

## Constraints

- No layout, typography, kerning, CMS, or property-control changes.
- No menu veil portal outside the Nav variant.
- No publishing.

## Verification

- Confirm the close action starts state exit immediately and changes variant after 280 ms.
- Test open → close, repeated close, keyboard activation, and reduced motion in Preview.
- Strict-typecheck both Nav code components and verify closed/open Canvas rendering.
