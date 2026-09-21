# Sill — craft

FREE Framer Marketplace template. One-screen calling card. **Not live** — no remix URL inventing, no Marketplace publish without Noel RED.

Conflict rule: this file + `TASTE.md` beat the brief and older `templates/sill/` notes.

---

## Intent

Who · one line · where to go next. Air over density. The list is the buyer’s destinations — never case studies.

## Locked layout

### Desktop (Skin A — Bruce)

| Rule | Spec |
|---|---|
| Pages | One Home. No About. No overlay nav. 404 OK |
| Viewport | Left column **no scroll.** Right **Showcase** may scroll (stills stack). Page chrome stays one Home. |
| Split | Asymmetric OK — type left · Kinetic Line · showcase right |
| Left | Name → Line → Wave Dot Link rows (no `01`–`06`) |
| Right | **Showcase:** CMS Stills stacked with air; overflow scroll; 1–6 plates. Never overlap. |
| Air | Boer emptiness is a feature. Large empty field. Never fill the right with chrome |

### Mobile

- **Paused** (Noel): finish desktop main first. Phone/tablet later.
- When resumed: stack type → Wave Dot links → one still; same craft, not collapsed afterthought.

### Motion

- Hover: **one** quiet expensive micro-move — number weight **or** underline draw. Feel **150–250ms**. No bounce / scale junk.
- Forbidden: GSAP showreel, overlay gallery, cursor follower, parallax, marquee spam, endless blur

### Corrections (Noel — apply on top; scope unchanged)

- **BAR:** FREE price, **SOTD craft**. Marketplace-default = FAIL.
- **Type:** optical sizing; tight leading on Line; flawless tracking on Name; `01`–`06` aligned; link rhythm (not equal gray soup).
- **Still:** placeholders OK while composition is locked (Noel). Swap images later. Until then: plate rhythm / zigzag / air beat photo polish. One strong plate scale beats two weak. Never overlap.
- **Mobile:** same craft, not a collapsed afterthought.
- Critique every pass vs `taste/01-bruce.png` **or** `taste/02-soulmates.png`. Reject “good enough for free.”

---

## Skins

| Skin | When | Steal | Do not steal |
|---|---|---|---|
| **A — Bruce** (ship first) | There is a still | Split type+list left / still right; editorial air | Portfolio, About, multi-project chrome |
| **B — Soulmates** | No still / wordmark as graphic | Giant name as graphic; typographic links; black void OK | Two-column About (Who / Vision / Mission) |

Structure must allow swapping skins without new IA.

---

## Tokens

See `STYLES.md` for Framer style names. Summary:

| Token | Hex | Use |
|---|---|---|
| Paper | `#F4F3F0` | Page background (Bruce / light). Not Arbour parchment |
| Ink | `#000000` | Primary type |
| Ink muted | `#6B6B6B` | Optional secondary URL (Soulmates only) |

One grotesk family. Color lives in the still, not the chrome.

### Spacing (desktop)

| Gap | Value |
|---|---|
| Page inset | 48–64px |
| Name → Line | 24–32px |
| Line → List | 48–64px |
| List row gap | 12–16px |
| Split | 50/50 |

### Radius / stroke / shadow

- Radius 0 · no page stroke · no shadow · no badges/chips on chrome

---

## Breakpoints

Exactly three: Desktop 1440 · Tablet 768 · Phone 390. No fourth.

---

## CMS

Page fields: **Name**, **Line** (no nav collection).

Collections: **Links** (max 6 on page), **Stills** (max 2). Schema: `cms.json`. Demo: `demo-content.md` (Ada Vale — no BBK SKU names on canvas).

---

## What not to copy

| Source | Take | Leave |
|---|---|---|
| Bruce | Split, air, numbered text links, still weight | Portfolio / About / multi-project |
| Soulmates | Giant type as graphic; type links | About Who/Vision/Mission |
| boer.page | One screen, air, few links | Extra pages, cute clutter |
| elliott.mangham.dev | No-scroll discipline only | Fees, awards, CV packing |
| Abati / Aritro / Tobi | Type hierarchy, still craft, header air | Works grids, docks, archive-as-product |

---

## Build checklist

- [ ] Named Color + Text styles (not one-off overrides only)
- [ ] Desktop Home: 50/50, no scrollbar at 1440
- [ ] Links CMS 5–6; Stills 1–2; Name/Line bound
- [ ] Quiet hover; no GSAP / overlay / About
- [ ] Mobile stack; slight scroll only if needed
- [ ] Screenshots + Bruce/Soulmates critique
- [ ] Stop for Noel — unpublished
