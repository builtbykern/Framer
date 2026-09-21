# Sill — Framer styles

Path prefix: `Sill/…`. Buyer changes type/color here, not per node.
OK 20 Sep 2026 — paper locked (light). Ember unchanged.

## Color

| Name | Light | Use |
|------|-------|-----|
| `Sill/Cream` | `rgb(11, 11, 12)` | Name, Title, Price, 404 Home |
| `Sill/Ink` | `rgb(36, 35, 33)` | Body, deks, Book this |
| `Sill/Mute` | `rgb(72, 70, 66)` | Rail, Meta, captions, nav, Write Mail + socials, 404 code |
| `Sill/Hairline` | `rgba(11, 11, 12, 0.22)` | Soft rules + still plate edges |
| `Sill/Rule` | `rgba(72, 70, 66, 0.32)` | Nav + list hairlines |
| `Sill/Veil` | `rgba(11, 11, 12, 0.9)` | Overlay (photos) |
| `Sill/Ground` | `rgb(245, 243, 240)` | Page paper |
| `Sill/Ember` | `rgb(212, 146, 72)` | Availability dot only |

## Text

Clash Grotesk except Name (FrakturMeta). No Inter. Fraktur is Name only. `Sill/Display` removed 18 Sep 2026.

| Name | Tag | Size | Line | Tracking | Color |
|------|-----|------|------|----------|-------|
| `Sill/Name` | h1 | 168 | 1.0 | 0.01em | Cream |
| `Sill/Title` | h2 | 48 | 1.05 | −0.02em | Cream |
| `Sill/Price` | p | 20 | 1.2 | −0.012em | Cream |
| `Sill/Body` | p | 20 | 1.2 | 0 | Ink |
| `Sill/Rail` | h2 | 18 | 1.3 | 0 | Mute |
| `Sill/Meta` | p | 15 | 1.3 | 0 | Mute |

Templates row titles: Clash 20 Cream in `ArchivePreview` look merge (not the 23 control default). Year col 0.

## Spacing (Home desktop)

| Token | Value |
|------|-------|
| Column | 968 |
| About padTop | 112 |
| Write padTop | 128 |
| Column padBottom | 160 |
| About measure | 560 |
| Sites/Stills title→dek gap | 14 |
| Nav height / scrollMarginTop | 56 |
