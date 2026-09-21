# VERIFY — Sill marketplace board

SKU: Sill · `afql8euIvsevSD6Ou7qq` · 20 Sep 2026 20:18  
Official: [Template best practices](https://www.framer.com/help/articles/template-best-practices/) (updated 7 Aug 2026). Cursor-only. Never publish from this chat.

**Verdict: do not upload.** Paper locked light. Production still dark. No MP4. Remix blank. Noel Preview PASS + RED.

Production: `https://sill.framer.website` dark. `/thumbnail` 200, `noindex`, dark. Staging leftover — do not list. Unpublished: Home, Cover, TextLink.

## Official template checklist

| Gate | Status | Evidence |
|------|--------|----------|
| Originality | PASS | One-column studio shelf; peek + strip drag + rest→hot cursor |
| Design · styles · 404 | PASS | Shared `Sill/` styles. 404 Clash. Name 168 / **120 @810** / 72 |
| Layout · one column | PASS | Column 968. No layout template. Strips clip-x on purpose |
| Text · no lorem | PASS | Ada Vale. Fraktur only on the name |
| Responsive | PASS | 1440 / 810 / 390. Phone column+nav **20px**. Availability + cursor hidden |
| Links · mailto · hover | WARN | Official wants mailto. Lock: Ada Vale demo, Mail → Framer. 9/9 HTTP 200 |
| CMS | PASS | Piece 8/8 Featured SAFE–PIN. Stills 2/2 + alts |
| Code · native first | WARN | 4 files, freeze, typecheck clean. Cursor portal `fixed`. Root 1×1 |
| Effects | WARN | Hero + 404 onMount. Peek + cursor Preview-only |
| Assets | WARN | Peek grapes/lemons/mug (listing discloses). Work Copper is unique vs Stills CMS (item 2 is now bowl-in-light) |
| Tags / headings | WARN | Landmarks: About/Templates/Services/Write/Work are `section`. SSR still emits D+P h1 replicas |
| A11y · title/description | PASS | Title + description. Mute 72 on paper ~8:1 (AAA). 0 empty `<a>`. 0 missing img alt |
| Performance / LCP | PASS | Production HTML 174kb in 271ms. Canvas unpublished: 4 |
| Copyright | PASS | Unsplash commercial via Framer `queryImages` |
| Community listing | **FAIL** | PNG is canvas light 1600×1200 + 2400×1800. Prod `/thumbnail` still dark. No MP4. No remix. Not uploaded |

| Support / submit | **FAIL** | Noel RED |

## Extreme extras (20 Sep)

- 584 nodes Home+404. 0 unnamed. 0 generic `Frame N`.
- TextLink Default/Hover/Pressed live. Cover `htmlTag` div. Nav `/#about`…`/#write` + `elementId` + `scrollMarginTop` 56.
- Live overflow-x at 743px: none. Favicon + apple-touch + canonical + `lang=en`.
- Orphan text styles `Name` / `Title` are Framer `$originalId` clones of Sill/Name and Sill/Title — not deleted.

## Closed this pass

- Cover variants Landscape/Square/Portrait/Cluster: `altText` is `"Still"` (was the string `"null"`).
- Light trial: Ground paper, Cream/Ink/Mute dark, Ember unchanged. TextLink Hover label was leftover `rgb(244,241,233)` (ghost on paper) → Cream token.
- Listing PNGs from canvas `/thumbnail` (light crop): `Sill_thumbnail_1600x1200.png` + `Sill_thumbnail_2400x1800.png`.
- Work Copper `7IrP69q` ≠ Stills studio-still `ubFxtx8Yv7` ≠ bowl-in-light `l9C0cbOx`.
- Production peek: grapes plate opacity 0.93 on Arbour, 0 on leave. VIEW ring present. Evidence `sill/assets/listing/probe-peek.png`.
- Production hero: name sitting → line → year+still by ~180ms (≤700ms). Evidence `probe-hero-0000.png` / `0180.png`.
- MP4: Noel records (not the agent). Shot list in LISTING.md.
- Stills CMS item 2 retargeted so Work Copper is not a duplicate URL.
- Earlier: `Sill/Name` @810 120 · Phone pad 20 · section landmarks.

## Noel gate

- [x] Preview PASS of VIEW grow on Templates
- [x] Work Copper unique vs Stills CMS (item 2 is bowl-in-light)
- [x] Lock light invert, or revert to dark
- [ ] Preview PASS of hero choreography + peek enter/leave
- [x] Listing PNGs from canvas `/thumbnail` (1600×1200 + 2400×1800)
- [ ] Publish current canvas (Home, `/thumbnail`, Cover, bowl-in-light)
- [ ] 3–5s MP4 — Noel records (`sill/assets/listing/Sill_demo_3s.mp4`)
- [ ] Remix URL
- Keep grapes/lemons/mug in listing limitations, or recapture
