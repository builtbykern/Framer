# Sill Skin A — CMS bind (after Kern paste)

Demo: **ADA VALE** only. Do not publish.

## 1. Import CSVs (optional source of truth)
From `docs/sill/cms/` or `templates/sill/cms/`:
- `Page.csv` → page fields Name / Line
- `Links.csv` → collection Links (Label, URL, Order, Show)
- `Stills.csv` → collection Stills (+ attach still-chair.png)

Or paste rows into component props (code components cannot bind collections directly).

## 2. Wire Kern_SillSkinA props
| Prop | Source |
|---|---|
| Name | Page.Name |
| Line | Page.Line |
| Links | Map Links collection → `{label, url}` max 6, Order asc, Show |
| Still | Stills.Image (cover) |
| Alt | Stills.Alt |

## 3. Hover
Already in component (number weight + underline). No pills.

## 4. Mobile
Component stacks type then still. Capture `mobile.png`.

## 5. Screenshots → Context `media/sill/`
`desktop.png` · `mobile.png` · `critique-vs-bruce.png` → stop for Noel RED.
