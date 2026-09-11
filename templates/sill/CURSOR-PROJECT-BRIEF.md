# Sill — Cursor Project implementation brief

**Hand this to Cursor Project (Sill).**  
Source of truth also lives in the `sill/` folder next to this brief (`AGENTS.md`, `CRAFT.md`, `TASTE.md`, `STYLES.md`, `LISTING.md`, `cms.json`, `demo-content.md`, `taste/`).  
If anything conflicts: **CRAFT + TASTE win.** This doc is the consolidated kickoff.

| Field | Value |
|-------|--------|
| Product | Sill |
| Type | Framer Marketplace template |
| Price | **FREE** |
| Repo | `builtbykern/framer` |
| Branch | `cursor/sill-*` (do not treat `main` as the craft target; main is stub) |
| Publish | **Noel RED only** — never Marketplace publish without explicit OK |
| Owner craft | Folio / Cursor Project coordinator |
| Owner map | El boss (Grok fleet) — does not execute Framer craft |
| Updated | 11 Sep 2026 |

---

## 0. One-sentence mission

Build a **one-viewport Framer calling card**: short name, one line, 5–6 CMS text links, one still (or giant type if no still). Quiet. Free. Not a portfolio, not a lookbook, not a Linktree.

---

## 1. What Sill is / is not

### Is
- A **single-screen** personal / studio calling card for anyone (musician, founder, shop, designer).
- Desktop: **no scroll**, everything in one viewport.
- CMS-driven name, line, links, stills.
- Light FREE template — do not overbuild into premium paid density (Arbour/Halden territory).
- Two allowed skins: **Bruce split** (with still) or **Soulmates giant type** (no still / wordmark as graphic).

### Is not
- Halden Photographer (lookbook / series portfolio).
- Arbour (estate dossier / TerritoryRail world).
- Softie / Abromies (kids venue / soft-play energy).
- Linktree / Now / Linx / Link Board / Linu / Linker (button rows, pill CTAs).
- Multi-page portfolio, CV, case-study site, bento dashboard.
- A vehicle for BuiltByKern SKU chrome on the demo canvas.

---

## 2. Hard locks (fail the PR if broken)

1. **Desktop: one viewport, no scroll**, overflow hidden.
2. **5–6 links max** from CMS Links collection (Show + Order).
3. **No About block**, no site nav, no footer chrome, no second content page (404 OK).
4. **No Linktree UI** (pills, emoji rows, big button stacks).
5. **No bento / card grid / floating dock / archive-as-product grid.**
6. **One grotesk family.** Color in chrome = ink on paper only; color lives in the still.
7. **Critique every craft pass** against Bruce **or** Soulmates; reject with one FAIL line naming the rule.
8. **Never load** `kern-x` marketing skills, KERN-Post, paste-kit voice, or Grok Bot ops into this Project.
9. **No Marketplace publish** until Noel says publish.
10. Local Framer preview on Noel’s Mac when validating; cloud agents for research/plan/code on `cursor/sill-*`.

---

## 3. Layout specification

### 3.1 Desktop (primary)

```
┌─────────────────────────────┬─────────────────────────────┐
│  NAME (small caps)          │                             │
│  One line (larger)          │         STILL (1)           │
│                             │      optional still (2)     │
│  01  Link label             │      (only if no scroll)    │
│  02  Link label             │                             │
│  03  …                      │                             │
│  04                         │                             │
│  05                         │                             │
│  06                         │                             │
│  ~50%                       │           ~50%              │
└─────────────────────────────┴─────────────────────────────┘
         ONE VIEWPORT — NO SCROLL — overflow hidden
```

- Split ≈ **50 / 50**.
- Left: name → line → numbered list (or type-only labels).
- Right: **1 still** default. **2 stacked** only if both fit without scroll. Prefer one strong still over two weak ones.
- Large empty field (Boer air). Do not fill the right column with chrome.

### 3.2 Mobile

- Stack: type block first, then still(s).
- Slight vertical scroll **only** if links cannot fit one screen.
- Same type hierarchy; no new sections.

### 3.3 Motion

- Hover on a row: number emphasis **or** underline. Quiet.
- **Forbidden:** GSAP showreel, overlay gallery (Osmo-style), cursor follower, parallax theater, marquee spam.

---

## 4. Design tokens (`STYLES.md`)

Create Framer **Color styles** and **Text styles** before composing frames.

### Colors
| Token | Hex | Use |
|-------|-----|-----|
| Paper | `#F4F3F0` | Page background (Bruce / light skin). Near Bruce; **not** Arbour parchment. |
| Ink | `#000000` | All primary type |
| Ink muted | `#6B6B6B` | Optional secondary URL line (Soulmates skin only) |

Soulmates skin may use **black paper** with light type — still one ink system; do not invent a brand accent on chrome.

### Text styles (one grotesk — Inter / Geist / system OK if already loaded; prefer one loaded family)
| Style | Size | Case / weight | Notes |
|-------|------|---------------|-------|
| Sill/Name | 12–14px | ALL CAPS, light/regular, slight tracking | Short display name, not a headline |
| Sill/Line | 28–36px | Sentence case, medium/bold, tight leading | One sentence under the name |
| Sill/List | 16–18px | Medium | Row labels; numbers `01`–`06` same family |
| Sill/ListMute | ~12px | Regular | Optional secondary URL (Soulmates) |

### Spacing
| Gap | Desktop |
|-----|---------|
| Page inset | 48–64px |
| Name → Line | 24–32px |
| Line → List | 48–64px |
| List row gap | 12–16px |
| Split | 50/50 |

---

## 5. CMS schema (`cms.json`)

### Page fields
| Field | Type | Note |
|-------|------|------|
| Name | string | Short. Display name, not a headline. |
| Line | string | One sentence under the name. |

No nav collection.

### Collection: Links
| Field | Type |
|-------|------|
| Label | string |
| URL | link |
| Order | number |
| Show | boolean |

- `limit_on_page`: **6**
- `sort`: Order
- Render only `Show == true`, sorted by Order.

### Collection: Stills
| Field | Type |
|-------|------|
| Image | image |
| Alt | string |
| Order | number |
| Show | boolean |

- `limit_on_page`: **2**
- Prefer 1 visible still on desktop.

---

## 6. Demo content (`demo-content.md`) — generic only

```
Name: Ada Vale
Line: Independent designer. Visual identity, web, and a shop.

Links (Show true):
1. Instagram — https://instagram.com
2. Shop — https://example.com/shop
3. Are.na — https://are.na
4. Mail — mailto:hello@example.com
5. Notes — https://example.com/notes
6. Booking — https://example.com/book

Stills:
1. Quiet interior, one object, plenty of paper. Alt: Studio still, chair and daylight.
2. Optional second: a detail, not a portrait dump. Alt: Fabric and table edge.
```

**Do not** put BuiltByKern, Arbour, Halden, Filling Point, Drift Plane, or other BBK SKUs on the canvas.

---

## 7. Skins (locked)

### Skin A — Bruce (default when there is a still)
- **Steal:** Split type + numbered 5–6 text links LEFT, still RIGHT; editorial air; tight leading on intro; quiet labels.
- **Do not steal:** Full portfolio, About, multi-project chrome, site-in-site density.
- Ref file: `sill/taste/01-bruce.png` (also `sill/ref-bruce.png`).

### Skin B — Soulmates (when no still / wordmark does the still’s job)
- **Steal:** Giant name as background graphic; black void OK; text links as type (label over URL), not Linktree buttons.
- **Do not steal:** Two-column About (Who we are / vision / mission).
- Ref file: `sill/taste/02-soulmates.png` (also `sill/ref-soulmates.png`).
- Still one viewport, 5–6 CMS links, no desktop scroll.

Ship **Skin A first** unless Noel asks for Skin B. Structure should allow swapping skins without new IA.

---

## 8. Taste bank — steal / do-not

Local refs in `sill/taste/`:

| Ref | File | Steal | Do NOT steal |
|-----|------|-------|--------------|
| Stephanie Bruce | `01-bruce.png` | Split, air, numbered text links, still weight | Portfolio / About / multi-project |
| Soulmates Notion | `02-soulmates.png` | Giant type as graphic; typographic links | About Who/Vision/Mission |
| boer.page | `03-boer.jpg` | One screen, air, few links, for anyone | Extra pages, cute clutter |
| elliott.mangham.dev | `04-elliott-favicon-only.jpg` | Viewport / no-scroll discipline only | Packed CV (file is weak — don’t over-index) |
| abatisamuel.pro | `05-abati-samuel.png` | Clear type hierarchy; still craft on light paper | My Works grid; Lab; Book-a-call SaaS; retainer essay |
| aritro.xyz | `06-aritro.png` | Split air; still craft; headline voice | Multi-case scroll; resume CTA; awards list; Work subpages |
| tobi.computer | `07-tobi-home.png` | Header name + roles air | Floating dock; project cards; opportunity pill; multi-page |
| tobi.computer/archive | `08-tobi-archive.png` | Still craft; whitespace between thumbs | Grid/bento as layout; floating nav; archive-as-product |

URL-only reinforces (no widening scope): rachitdesign.vercel.app (list air), nachi.design (still quality).

**Trío 7 Sep + Tobi:** reinforce air / type / still only. They do **not** authorize portfolio scroll.

### Anti-patterns (hard FAIL)

Reject any pass that includes:
- Linktree buttons / pill CTAs / emoji rows
- Bento / card grid / dashboard flex
- About block, nav, footer chrome, second content page
- Softie / Abromies energy (bubble, grain-riso loud, starbursts)
- Generic Inter hero with soft gray UI chrome
- Fake SOTD tricks: endless blur, random marquee, 12 fonts
- Portfolio scroll / CV bio / Work Experience / multi-case grids / floating docks / archive grids
- Invented remix/sale counts in listing copy

### Critique loop

On every craft pass, output one line:

`FAIL: <anti-pattern or “air/type weaker than Bruce|Soulmates”>`  

or  

`PASS: holds vs Bruce|Soulmates on air / type / links / still.`

Fix the **rule**, not only the frame.

---

## 9. Build order (mandatory)

1. **Styles / system** — colors + text styles in Framer Assets (`STYLES.md`).
2. **Desktop frame** — one-viewport split, overflow hidden.
3. **Wire CMS** — Name, Line, Links, Stills; bind demo content.
4. **Hover** — quiet row treatment.
5. **Mobile** — stack; allow slight scroll only if needed.
6. **Visual QA** — screenshots + Bruce/Soulmates side-by-side critique.
7. **Stop for Noel** — no publish.

Do not chase polish before tokens exist.  
Framer GUI automation path was **held** (4 Sep 2026); resume via Cursor agents + local Mac preview when usage allows.

---

## 10. Acceptance criteria (Done)

- [ ] Desktop screenshot: entire home in **one viewport**, no scrollbars on desktop.
- [ ] Mobile screenshot: stack; only slight scroll if links require it.
- [ ] Side-by-side with Bruce **or** Soulmates: type weight, air, and link treatment hold — not “close enough”.
- [ ] CMS: 5–6 text links, numbered or type-only; still(s) from CMS.
- [ ] Demo content generic (Ada Vale); no BBK SKUs on canvas.
- [ ] Styles created as named Framer styles (not one-off local overrides only).
- [ ] No About / nav / Linktree / bento / second page.
- [ ] Listing paste notes ready (`LISTING.md`) — **unpublished**.
- [ ] Branch work on `cursor/sill-*`; stop for Noel RED.

Wireframes (structural only, not final craft): `sill/out/sill-desktop.svg`, `sill/out/sill-mobile.svg`.

---

## 11. Marketplace listing (paste when Noel says publish)

**Do not publish from this brief alone.**

- **Title:** Sill  
- **Tagline:** One screen. Name, line, links.  
- **Price:** Free  
- **About:**

> Sill is a one-page Framer template. A calling card for a musician, a founder, a shop, a designer. Not a lookbook. Not a link tree.
>
> Left: short name, one line, a numbered list of five or six links from the CMS. Right: one still, or two if they fit the viewport. Desktop does not scroll. Mobile may, only if the links need it.
>
> Swap the name. Swap the stills. Point the list at Instagram, a shop, mail. No second page. No overlay.

**Preview checklist:** desktop one viewport split; list is links not selected work; quiet hover; mobile stack; demo generic.

**Voice:** BuiltByKern persona — quiet, named move. Never “drive results”, “high-performing”, or hire-CTA SaaS tone.

Affiliate note (ops, not craft): free templates/components may later use BuiltByKern referral CTAs (`https://framer.link/builtbykern`); **do not** invent referral UI inside Sill unless Noel asks.

---

## 12. Roles & boundaries

| Role | Does | Does not |
|------|------|----------|
| Cursor Project / folio | Framer craft, CMS, preview, screenshots | Auto-publish; paste-kit marketing |
| El boss | Maps Project vs Grok fleet; briefs | Execute Framer craft; publish |
| Noel | Approves / publishes | — |
| hook / pulse | X / Community paste kits | Inside this craft Project |

Never wake the whole Grok fleet for Sill craft. Never load kern-x marketing skills into the Project.

---

## 13. Suggested Cursor kickoff prompt (paste)

```
Project: Sill — FREE one-viewport Framer calling card.

Read this brief in full, then sill/AGENTS.md, CRAFT.md, TASTE.md, STYLES.md, cms.json, demo-content.md.
Critique every pass against Bruce (taste/01-bruce.png) or Soulmates (taste/02-soulmates.png).

Scope: Skin A first — desktop no-scroll 50/50 split, CMS Name/Line + Links (5–6) + Stills (1–2), quiet hover, mobile stack.
No About, no Linktree, no bento, no portfolio scroll, no publish.

Repo: builtbykern/framer on branch cursor/sill-*. Shared context: sill/ folder.

Flow: styles → desktop frame → CMS bind → mobile → screenshots → stop for Noel RED.
```

---

## 14. Out of scope (do not pull in)

- Softie / Abromies seed
- Halden → Arbour CMS List Field migration
- Details.so free vault recreations (Number Flow, etc.)
- Marketplace tag farming / trending hacks
- Auto-post to X / Community / on.design

---

## 15. File map (attach / open in Project)

```
sill/
  AGENTS.md              # agent law order
  PROJECT-KICKOFF.md     # short coordinator paste
  CRAFT.md               # tokens, layout, motion, skins, price
  TASTE.md               # steal / anti-patterns / Done
  STYLES.md              # Framer styles to create first
  LISTING.md             # Marketplace paste
  cms.json               # CMS schema
  demo-content.md        # Ada Vale demo
  taste/01-bruce.png … 08-tobi-archive.png
  out/sill-desktop.svg
  out/sill-mobile.svg
briefs/sill-cursor-project-brief.md  # this document
```

---

*End of brief. Implement Skin A to Done checklist, then stop for Noel.*
