# Alarm Clock styles (create in Framer Assets first)

Create Color + Text styles **before** composing the preview frame.

## Colors
- `Alarm/Paper` — `#F4F3F0`
- `Alarm/Ink` — `#0A0A0A`
- `Alarm/InkMute` — `#6B6B6B`
- `Alarm/Face` — `#FFFFFF`
- `Alarm/Accent` — `#C45C26` (one accent; changeable)
- `Alarm/PaperDark` — `#0A0A0A` (dark theme body)
- `Alarm/InkDark` — `#F4F3F0` (dark theme digits)

## Text styles
1. `Alarm/Digit` — 48–96px (scales with size prop), tabular nums, medium/bold, Ink, tight tracking
2. `Alarm/DigitSm` — for narrow widths / 2×2 grid
3. `Alarm/Label` — 10–12px, uppercase optional, wide tracking, InkMute
4. `Alarm/End` — 18–28px, medium, Ink (endLabel)
5. `Alarm/CTA` — 13–14px, medium, for preview affiliate button label only

## Spacing (document; apply in component + preview)
- Face inset: 12–20px
- Unit column gap: 12–24px
- Digit → label: 6–10px
- Body padding: 16–24px
- Preview: clock centered; CTA 24–32px below object; page margin ≥48px

## Preview composition (Marketplace)
- Paper background `Alarm/Paper` or dark
- Alarm Clock component centered
- Button “Get Framer” / “Made for Framer” → `https://framer.link/qIg9LiG` · open in **new tab**
- Optional one-line caption under CTA (muted) — not required

Create these styles first. Then build the code component against tokens.
