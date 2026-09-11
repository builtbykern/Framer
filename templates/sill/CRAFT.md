# Sill — craft

FREE Framer Marketplace template. One-screen calling card for anyone (musician, founder, shop, designer). **Not live yet** — this folder is the craft pack only. No remix URL. Do not publish until the canvas exists and passes QA.

Not Halden (photographer lookbook). Not Arbour (estate). Not Drift Plane / Filling Point (components). Not a Linktree / bento grid.

---

## Intent

A single viewport that answers: who, one line, where to go next. Air over density. The list is the buyer’s destinations — never a case-study index.

---

## Locked layout

| Rule | Spec |
|---|---|
| Pages | **One** page only. No About, no second route, no overlay nav |
| Desktop / Tablet | **No scroll.** Everything fits the viewport |
| Phone | Slight vertical scroll **only** if the 5–6 links do not fit |
| Split | **Left:** short name + one line + numbered CMS link list. **Right:** 1 still, or 2 stacked if both fit the viewport |
| List | Buyer links (Instagram, shop, mail, …). Never “Selected Work” / projects |
| Motion | Minimal hover only. No GSAP show. No image overlay chrome |

Reference **structure / air** only:

- stephaniebruce.co — split (type + list left, stills right); monochrome white/ink palette
- boer.page (2022) — one screen, type, few links, empty space
- elliott.mangham.dev — **viewport / no-scroll idea only**. Do not copy fees, awards, or brand rows

---

## Tokens

### Color (3 styles)

| Style | Hex | Use |
|---|---|---|
| `paper` | `#FFFFFF` | Page background |
| `ink` | `#111111` | Name, line, list, active mark |
| `mute` | `#8A8A8A` | Optional secondary label only if needed |

No accent swatch. No cream canvas. No dark-mode toggle. Color lives inside the stills, not the chrome.

### Type (2 styles, one family)

Family: a clean geometric sans available in Framer (e.g. **Geist** or **Satoshi**). One family only — no serif pairing, no mono chrome.

| Style | Weight | Desktop | Tablet | Phone | Tracking | Line | Use |
|---|---|---|---|---|---|---|---|
| `Name` | Medium / Semibold | 13–14px | 13px | 12–13px | 0.08–0.12em | 1.0 | Short display name, all caps or title case — keep short |
| `Lead` | Regular / Medium | 28–36px | 24–28px | 20–22px | -0.02em | 1.15–1.25 | The one-line bio (wraps 2–4 lines max) |
| `List` | Regular / Medium | 16–18px | 16px | 15–16px | 0 | 1.35 | Numbered link labels |
| `Index` | Regular | 14–16px | 14px | 14px | 0 | 1.0 | List numbers `1`–`6` (or a 6–8px ink square for the active/hover item) |

Do not invent a fifth text style. Do not set Inter as the brand face if Geist/Satoshi (or equivalent) is available.

### Space

| Token | Desktop 1440 | Tablet 768 | Phone 390 |
|---|---|---|---|
| Side inset | 40–56px | 32–40px | 20–24px |
| Column gap | 48–72px | 32–40px | stack: 28–36px |
| List item gap | 12–16px | 12–14px | 10–12px |
| Still gap (if 2) | 12–16px | 12px | 12px |

Whitespace is a feature. Prefer empty right margin / bottom air over filling the frame.

### Radius / stroke / shadow

- Radius: **0** on stills and chrome
- Stroke: none on the page; optional 1px ink square as list “active” mark
- Shadow: **none**
- Badge / sticker / floating chip: **none**

---

## Breakpoints

Exactly three. Do not add a fourth.

| Breakpoint | Width | Behavior |
|---|---|---|
| Desktop | 1440 (min ~1200) | Split columns. No scroll. 1 or 2 stills |
| Tablet | 768 | Same split, tighter type/insets. No scroll |
| Phone | 390 | Stack: name + lead + list, then still(s). Slight scroll only if links overflow |

---

## CMS schema

Two collections. Full field list: [`cms.json`](cms.json). Demo rows: [`demo-content.md`](demo-content.md).

### `Links`

Buyer destinations. **5–6 published** items in the demo. Ordered list on the left.

| Field | Type | Notes |
|---|---|---|
| Title | Title | Link label as shown (`Instagram`, `Shop`, …) |
| Slug | Slug | Optional; no detail page |
| URL | Link / URL | External or `mailto:` |
| Order | Number | 1…n — drives the visible number |
| Published | Boolean | Unpublished items do not render |

No “category”, no “case study”, no image on Links.

### `Stills`

Right column media. Demo ships **2** items; layout shows 1 if the second does not fit, or both stacked when they do.

| Field | Type | Notes |
|---|---|---|
| Title | Title | Internal / alt base |
| Slug | Slug | Optional; no detail page |
| Image | Image | Required |
| Caption | Plain text | Optional; prefer empty in UI — caption is for CMS/alt |
| Order | Number | Top = 1 |
| Published | Boolean | |

No lightbox page. No click-through to a project. Still may link out only if the buyer wires a URL later — default is static image.

---

## Interaction

- List item hover: opacity or underline, or swap number → ink square. One treatment only.
- Pressed: slightly stronger than hover.
- No page transitions, no load choreography, no parallax, no cursor follower.
- `prefers-reduced-motion`: no animated hover beyond opacity/color.

---

## Mobile rules

1. Order: **Name → Lead → Links → Still(s)**.
2. Stills full width of the content inset; keep aspect honest (no forced square crop unless the asset is square).
3. If six links + two tall stills exceed the phone viewport, **allow scroll**. Do not shrink type below the Phone sizes above to force a no-scroll phone.
4. Tap targets ≥ 44px tall including gap.

---

## What not to copy

| Source | Take | Leave |
|---|---|---|
| stephaniebruce.co | Split, air, white/ink, stacked stills | “SELECTED WORK”, project names, About nav, second page |
| boer.page | One screen, few links, empty field | Asterisk brand mark, constellation graphic, emoji, Made-with badge as content |
| elliott.mangham.dev | No-scroll calling-card density | Fee tables, awards, client logos, multi-section CV |
| Marketplace Linktree / bento templates | — | Cards, icon grids, social icon rows, multi-page hubs |
| Halden / Arbour / Drift | — | Lookbook plane, estate CMS, Drift Plane component |

Do not mention BuiltByKern SKU names (Arbour, Halden, Drift Plane, Filling Point, Sill) inside demo copy.

---

## Demo content (summary)

Persona: **Nova Hart** — independent maker. One line about craft and place. Six links. Two stills with quiet captions for CMS only.

Full pasteable rows: [`demo-content.md`](demo-content.md).

---

## Build checklist (canvas, later)

- [ ] Single Home page; delete any extra routes
- [ ] Desktop & Tablet: no scrollbar at 1440 / 768 with demo content
- [ ] Phone: stack + optional slight scroll
- [ ] Links CMS list bound; Order sorts ascending
- [ ] Stills CMS; show top 1–2 by Order
- [ ] No About link, no overlay, no GSAP
- [ ] British or neutral English; no lorem
- [ ] Remix link only after human publish — never invent one in this pack
