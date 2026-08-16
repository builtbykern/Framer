# Prompts — modelo + skill (Agent tab)

Un **New Chat** por bloque. Branch `template-build`. **Fast Mode Off.** Nunca Fable 5 ni GPT 5.6 Sol. **`/code` solo en 09B.**

Antes de cada prompt, pega las [constraints](00-constraints.md). Opus: **5** → 4.8 → 4.7. `/seo` `/layout` `/audit` `/style` solo si están en el menú `/`; si no, pega el prompt sin el slash.

Fuente de efectos: [Choosing a model](https://www.framer.com/help/articles/choosing-a-model-in-the-framer-agent/), [GPT 5.6](https://www.framer.com/updates/gpt-5-6), [Opus 5](https://www.framer.com/updates/opus-5), [Reasoning](https://www.framer.com/updates/agent-reasoning-and-fast-mode). Matriz: [00-agent-decision.md](00-agent-decision.md). Datos: [00-source-of-truth.md](00-source-of-truth.md). Look: [00-visual-system.md](00-visual-system.md).

## Efecto de cada modelo

| Modelo | Efecto oficial | En Drift |
|---|---|---|
| **GPT 5.6 Luna** | CMS y find-replace, el más rápido | Schema Work, binds, links del Plane |
| **Sonnet 5** | Default. Layout y edits | Shells, Info, 404, hover, Lummi bind, instructions |
| **GPT 5.6 Terra** | Audits y consistency | SEO, hygiene |
| **Opus 5** | Plan + juicio visual | Home+Nav, split detail, Form, 09B code |
| **GPT 5.5** | Copy-heavy | Fallback de Luna |
| **Fable 5 / Sol** | First draft / poca guía | **Veto** — inventan Index, vídeo, otro home |

**Reasoning:** Light = edit corto. Higher = schema o página nueva. **Fast Mode Off.**

## Esfuerzo

Base GPT 5.5 = 1×. Luna ~0.4× · Sonnet/Terra ~0.6× · Opus 5 ~1.2×. Pack sin 09B ≈ 900–1.600 créditos. Lo caro: 03, 04, 07.

---

## 01 — Sistema + shells

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Reasoning** | Higher |
| **Esfuerzo** | Medio (~90–150) |
| **Skill** | `/layout` (o `/style`) |
| **@** | styles, pages |

```
/layout

Create only the Drift design system and empty page shells. Follow the numbers. Do not invent a sixth color, a fourth font family, or “a nicer accent”.

1. Color styles (exact names and hex — five only):
   - home-bg #050505
   - paper #F6F3EE
   - ink #111111
   - muted #6B6B6B
   - line #D9D4CC
   Never use #FFFFFF or #000000. Never add shadow styles.

2. Text styles (exact names, Framer fonts, sizes). Create all five:

   Mark — Syne ExtraBold. Desktop/Tablet 15px / line 1.0 / tracking 0.06em. Phone 14 / 1.0 / 0.05em. Use later for VALE.

   Display — Syne ExtraBold. Desktop 68px / 0.90 / -0.04em. Tablet 52 / 0.90 / -0.03em. Phone 40 / 0.92 / -0.03em. Project titles only.

   Lead — Inter Regular. Desktop 22 / 1.35 / 0. Tablet 20 / 1.35. Phone 18 / 1.4. Info/Contact/404 leads.

   Body — Inter Regular. All breakpoints 15px / 1.55 / 0.01em.

   Label — IBM Plex Mono Medium. Desktop/Tablet 11 / 1.2 / 0.14em. Phone 10 / 1.2 / 0.12em. Set text transform Uppercase on this style if Framer allows.

3. Defaults: radius 0 everywhere. 1px borders use `line`. No drop shadows. No blur.

4. Breakpoints only: Desktop 1440, Tablet 768, Phone 390.

5. Empty shells, no photos, no long copy:
   - Home `/` — fill home-bg, full viewport
   - Info `/info` — fill paper
   - Contact `/contact` — fill paper
   - 404 — fill paper
   - Work CMS detail `/work/{slug}` — fill paper. If you need a collection to create the page, Title + Slug only, no items yet.

6. Do not insert Drift Plane. Do not add Index, Privacy, Journal.

Report: every style name + font + desktop size, page routes, breakpoints.
```

---

## 02 — CMS Work

| | |
|---|---|
| **Modelo** | GPT 5.6 Luna |
| **Reasoning** | Higher |
| **Esfuerzo** | Bajo (~40–60) |
| **Skill** | `/cms` |
| **@** | Work collection, Work detail |

```
/cms

Create or finish the Work CMS collection. Exactly 7 published items. No stock photos.

Fields (exact names):
- Title (title)
- Slug (slug)
- Cover (image) — for now a solid ink or muted rectangle, NOT Unsplash/Lummi
- Gallery (gallery) — empty or the same solid placeholder repeated 4 times, no stock
- Year (number)
- Credit1Label, Credit1Value, Credit2Label, Credit2Value, Credit3Label, Credit3Value (plain text)
- Description (plain text)
- Tag1, Tag2 (plain text)
- Featured (boolean) — true on all 7

Detail page slug pattern: /work/{slug}

Create these 7 published items (copy verbatim):

1. Title: Salt Light | slug: salt-light | year: 2024
   Credit1Label director / Mira Lang
   Credit2Label producer / Owen Hale
   Credit3Label awards / YDA Nominee
   Tag1 short | Tag2 narrative
   Description: A coastal hour cut as rooms of weather. Still frames from a day that never quite becomes night.
   Featured: true

2. Title: The Waiting Room | slug: the-waiting-room | year: 2023
   director C. Romer / producer Nia Voss / awards —
   Tag1 short | Tag2 narrative
   Description: Two people in a municipal lobby after closing. The work is the fluorescent bank, the chairs, the clock that is wrong.

3. Title: Glass Hours | slug: glass-hours | year: 2025
   director Vale / producer Atelier Norte / awards —
   Tag1 commission | Tag2 narrative
   Description: An architecture brief shot as weather. Interiors of a house that is mostly sky, stills only.

4. Title: Inland Signal | slug: inland-signal | year: 2024
   director Vale / producer Elena Ruiz / awards Festival of the Image, selected
   Tag1 short | Tag2 place
   Description: A week away from the water. Heat, distance, and a road that reads longer than it is.

5. Title: After the Sitting | slug: after-the-sitting | year: 2023
   director Vale / producer — / awards —
   Tag1 people | Tag2 still
   Description: Portraits made after the formal sitting ends. Hands, windows, the clothes people chose when they thought the work was over.

6. Title: Red Room Brief | slug: red-room-brief | year: 2025
   director Vale / producer Vestis Almanac / awards —
   Tag1 commission | Tag2 identity
   Description: A clothing brief as a private afternoon. Fabric against a rented interior, no set beyond the room and the street below.

7. Title: Night Atlas | slug: night-atlas | year: 2022
   director Gabe Caste / producer Lauren Altieri / awards Santa Barbara, 2023
   Tag1 short | Tag2 narrative
   Description: Fog on a closed café and the road that serves it. Still frames from a night that arrives faster than the last cars leaving.

Do not create an 8th item. Do not add video fields. Do not design the detail layout in this chat.

Report: field list, the 7 slugs, published count.
```

**Humano antes de 03:** insertar Drift Plane en el proyecto.

---

## 03 — Home

| | |
|---|---|
| **Modelo** | Opus 5 |
| **Reasoning** | Higher |
| **Esfuerzo** | Alto (~150–240) |
| **Skill** | `/component` |
| **@** | `@Home`, Drift Plane |

```
/component

Build Home `/` only. Home is the Drift Plane. Nothing else except chrome.

1. Insert the existing Drift Plane code component so it fills the viewport (width 100%, height 100vh / 100dvh). Pin it. Do not recreate it in native stacks. Do not wrap it in a marketing hero (no headline, no reel, no grid of projects besides the plane).

2. Create a Nav component and place it on Home:
   - Variant onDark (this page): Mark style for VALE, Label style for Info/Contact, color paper (not #FFF) on home-bg
   - Optional 88px-tall scrim: home-bg 70% to transparent. No other gradient
   - Links: VALE → `/` · Info → `/info` · Contact → `/contact`
   - Position: top, overlay, does not push the plane down. Nav pad 22×28 desktop, 16×20 phone
   - No hamburger on Desktop/Tablet. Phone: same row, wrap if needed, no drawer
   - Component variables: email studio@vale.work, instagram https://www.instagram.com/vale.work

3. Hint, Label style, muted, bottom 24 left 28, pointer-events none:
   “Pan the plane · click a series”

4. One H1 “VALE” visually hidden (sr-only / 1px clip) for semantics. No visible H1 on Home.

5. Put Nav in a layout template so later pages can reuse it (onLight comes in later phases). If layout templates are awkward this chat, at least make Nav a reusable component.

6. Do not fill the Plane array with CMS links yet (phase 09A). Placeholder cards already on the component are OK. Do not add Index, footer, or extra sections.

Report: how Drift Plane is placed, Nav variant names, any leftover extra sections you removed.
```

---

## 04 — Detail split

| | |
|---|---|
| **Modelo** | Opus 5 |
| **Reasoning** | Higher |
| **Esfuerzo** | Alto (~150–240) |
| **Skill** | `/layout` |
| **@** | Work detail |

```
/layout

Design the Work CMS detail page only. Do not change Home. Follow 00-visual-system: paper/ink, radius 0, chips 2px, no shadows, no black sidebar.

Desktop / Tablet:
- Two columns: left ~33% (minmax 280px), right ~67%
- Left is position sticky, top 0, height 100vh, overflow auto, fill paper, padding 96px 36px 40px, gap 28 between blocks
- Right: CMS Gallery as a **vertical stack**, gap **0**. Each image width 100%, height auto — do **not** crop (no object-fit cover on the detail gallery).

Left column, top to bottom:
- Title — Display style, ink (this is the H1)
- Definition list: Label muted + Body ink for Credit1–3. Optional year row: Label “year” + Body Year
- Description — Body, max 36ch
- Two chips: 1px line, radius 2px, pad 5×10, Label, Tag1 Tag2
- Pager: Previous · Next, Label, gap 18

Phone 390:
- Single column, pad 88 20 32. Info first, gallery below. No sticky split.

Nav on this page: onLight variant (ink on paper). If onLight does not exist yet, add it without restyling Home’s onDark.

No video. No lightbox. No black sidebar. No extra “related work” grid.

Report: column widths, sticky, gallery layout (must be stack not masonry), phone behavior.
```

---

## 05 — Bind detail

| | |
|---|---|
| **Modelo** | GPT 5.6 Luna |
| **Reasoning** | Higher |
| **Esfuerzo** | Bajo (~40–60) |
| **Skill** | `/cms` |
| **@** | Work collection, Work detail |

```
/cms

Bind the Work detail page to the Work collection. Do not change layout, type, or colors.

Bind:
- Display title → Title
- Year if you added a year layer → Year (if there is no year layer, add a small Label+value row “year” / Year under the credits, still paper/ink)
- Credit1Label / Credit1Value, Credit2Label / Credit2Value, Credit3Label / Credit3Value
- Description → Description
- Chips → Tag1, Tag2. Hide a chip if its field is empty (conditional visible)
- Gallery stack → Gallery field. Keep vertical stack, gap 0, image width 100%, height auto
- Previous / Next → CMS previous/next of Work, linking to that item’s detail. Labels can be “Previous” and “Next” or the adjacent titles — pick one and use it on all items
- Optional: a quiet “VALE” or back control already in Nav is enough; do not add an Index route

If a credit value is “—”, still show the row.

Open /work/salt-light and /work/after-the-sitting to verify different titles and tags.

Report: each layer → field. Any leftover static dummy text.
```

---

## 06 — Info

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Reasoning** | Light |
| **Esfuerzo** | Bajo (~30–50) |
| **Skill** | ninguna |
| **@** | `@Info`, Work |

```
Build Info `/info` only. Paper background, Nav onLight. Do not change Home or the Work detail.

Copy verbatim:
- Kicker (Label): Info
- Lead (Lead style): Vale is a visual director working in stills. Selected work is published as series — not as a dump of single frames.
- Body (Body style): Available for a small number of commissions each year. The plane on the home is the archive. This page is for when you already know the title.

Below, a Collection List of Work, all 7, sorted by Year descending:
- Each row is the Title (use Body or Mark 15, not Display). Linking to that item’s CMS detail page
- Optional muted Year, Label style, on the same row
- 1px line between rows. No thumbnails, no hover image, no grid of covers
- This is not a page at `/work`. Do not create `/work`.

Keep the page measure 640–720px. Page pad X 36 desktop / 20 phone. Top padding under Nav ~112.

Report: routes you touched, how the list binds.
```

---

## 07 — Contact

| | |
|---|---|
| **Modelo** | Opus 5 |
| **Reasoning** | Higher |
| **Esfuerzo** | Alto (~120–240) |
| **Skill** | `/component` |
| **@** | `@Contact` |

```
/component

Build Contact `/contact` only. Paper, Nav onLight. Native Framer Form — not a code component, not an embed.

Copy:
- Kicker (Label): Contact
- Lead (Lead style): Enquiries: studio@vale.work with mailto:studio@vale.work

Form fields (Label style for labels, Body for inputs, 1px line as border-bottom only, radius 0, no boxes, no fill):
- Name — text, required, autocomplete name
- Email — email, required, autocomplete email
- Inquiry — select: People, Place, Commission, Other (default Other)
- Message — textarea, required
- Submit button text: Send (Label style, no fill pill)

Success state: “Received. Vale will write back from the studio address.”
Error/empty: native validation is enough; do not invent a red theme.

Do not add a map, newsletter, or second form. Do not add Privacy.

Report: that the Form is the native Framer Form, field names, success copy.
```

---

## 08 — 404

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Reasoning** | Light |
| **Esfuerzo** | Bajo (~30) |
| **Skill** | ninguna |
| **@** | 404 |

```
Build the custom 404 page only. Paper, Nav onLight.

Copy verbatim:
- Kicker (Label): Missing
- Lead (Lead style): This series is not on the plane.
- A text link (Label): Return to the plane → `/`
- Optional second link: Info → `/info`

Measure 640–720. Paper. Radius 0. No illustrations.
Do not change other pages.

Report: 404 route, links.
```

---

## 09A — Plane → slugs

| | |
|---|---|
| **Modelo** | GPT 5.6 Luna |
| **Reasoning** | Light |
| **Esfuerzo** | Mínimo (~20–40) |
| **Skill** | `/component` |
| **@** | `@Home`, Drift Plane, Work |

```
/component

Wire the existing Drift Plane on Home to the 7 Work items. Do not rewrite the component code.

Code components cannot read CMS collections through internals. Use the Plane’s property controls (Array of image + title + link, or equivalent).

For each Featured Work item (all 7), one card:
- Image = that item’s Cover (placeholder solids are fine)
- Title = Title
- Link = that item’s CMS detail URL (/work/salt-light, /work/the-waiting-room, /work/glass-hours, /work/inland-signal, /work/after-the-sitting, /work/red-room-brief, /work/night-atlas)

Click (not drag) must navigate to the detail page. No overlay, no lightbox, no modal.

If the component only has a generic Link per card, set those seven links. If it has a single “open” overlay, turn overlay off.

Do not add new cards beyond the 7. Do not change pan physics.

Report: how many cards, each title → href.
```

Si Phone ya es un eje + snap: saltar 09B.

---

## 09B — snap (solo si hace falta)

| | |
|---|---|
| **Modelo** | Opus 5 |
| **Reasoning** | Higher |
| **Esfuerzo** | Alto (~120–200) |
| **Skill** | `/code` |
| **@** | Drift Plane code |

```
/code

Edit the existing Drift Plane code component only. Do not replace it. Do not change the desktop pan physics.

Add a layout mode:
- `plane` (default): current 2D pan + idle drift
- `snap`: one axis (horizontal or vertical — pick the one that already fits the card row), snap to a card, still click-to-open the same links

Expose it as a property control (Enum: plane | snap) and/or follow breakpoints:
- Desktop 1440 and Tablet 768 → plane
- Phone 390 → snap

Respect prefers-reduced-motion: no idle drift in either mode.

Do not add overlay/lightbox. Do not fetch CMS from internals (keep Array + link props). Do not restyle Nav.

Report: the prop name, how Phone switches to snap, files you changed.
```

---

## 10A — Hover

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Reasoning** | Light |
| **Esfuerzo** | Bajo (~30–60) |
| **Skill** | `/component` |
| **@** | Nav, Info, Contact, chips |

```
/component

Add hover and pressed variants only. Do not restyle the template.

- Nav links (onDark and onLight): hover opacity ~0.7 or muted→ink/paper. Pressed slightly lower. Phone: hover off
- Info title rows: hover opacity or underline
- Detail chips: no jump; optional opacity
- Contact Send: hover opacity
- 404 links: same as Nav
- Plane cards: if the code component already has hover scale, leave it. Do not add CSS that fights the component

Interactive elements must look clickable. Do not add new colors outside the five styles.

Report: components/variants you added.
```

---

## 10B — Semántica

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Reasoning** | Higher |
| **Esfuerzo** | Medio (~60–90) |
| **Skill** | `/layout` |
| **@** | todas las páginas |

```
/layout

Semantics and motion only. Do not change art direction.

- Nav wrapper: header. Page content: main. Do not fake extra landmarks
- Home: visually hidden H1 VALE (already asked in 03 — keep one H1)
- Info: H1 or kicker mapped so there is one heading “Info”
- Contact: one heading “Contact”
- 404: one heading “Missing”
- Work detail: the series Title is the H1 (Display)
- Enable Framer prefers-reduced-motion / reduced motion in Site Settings if the control exists
- Body line-height remains 1.55. Do not swap or add fonts. Keep Mark, Display, Lead, Body, Label as defined in phase 01.

Report: tag on each page, H1 text, reduced-motion setting.
```

---

## 11 — SEO

| | |
|---|---|
| **Modelo** | GPT 5.6 Terra |
| **Reasoning** | Higher |
| **Esfuerzo** | Medio (~60–90) |
| **Skill** | `/seo` |
| **@** | Site Settings, páginas, Work |

```
/seo

Site settings and metadata only. Do not redesign.

- Language: en
- Site title: VALE
- Site description: Selected work in stills. Series by Vale, visual director.
- Favicon: a simple ink mark on paper or home-bg. Not the Framer default if you can replace it with a 1-letter V. If you cannot generate an asset, leave a note for the human
- Home title: VALE — Visual director
- Info title: Info — VALE
- Contact title: Contact — VALE
- 404 title: Missing — VALE
- CMS detail title template: {Title} — VALE
- Descriptions unique per page, English, no lorem. Detail: use Description field or a short template from Title
- Open Graph: use Cover when the page is a Work item; Home can use home-bg until Lummi
- Alt text on placeholder covers: “Placeholder for {Title}” until phase 12. Decorative Nav marks: empty alt or alt=""

Do not publish. Do not add Index or Privacy.

Report: lang, each page title, leftover default “My Framer Site”.
```

**Parar.** Recorrer el sitio. Luego Lummi humano.

---

## 12 — Lummi bind

Humano: look y prompts en [00-visual-system.md](00-visual-system.md) §6; checklist en [12-lummi.md](12-lummi.md). Después:

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Reasoning** | Light |
| **Esfuerzo** | Bajo (~30–60) |
| **Skill** | `/cms` |
| **@** | Work items, Drift Plane |

```
/cms

The human has imported Lummi stills into Work/{slug}/. Bind them. Do not change layout. Do not use Unsplash. Do not crop the detail gallery (height auto).

For each Work item: Cover + Gallery 4–6. Then set the Drift Plane array images to the same Covers; keep the seven CMS detail links.

Alts: “Still from {Title}, {one factual noun phrase}.” Not “image1”.

All 7 Featured remain true. Do not add items.

Report: each slug → cover asset name → gallery count → plane card link.
```

---

## 13A — Audit

| | |
|---|---|
| **Modelo** | GPT 5.6 Terra |
| **Reasoning** | Higher |
| **Esfuerzo** | Medio (~60–120) |
| **Skill** | `/audit` |
| **@** | proyecto entero |

```
/audit

Audit then fix only hygiene. Do not change art direction. Do not create pages.

Scan for:
- Broken internal links (only the real 404 page should 404)
- Plane cards that do not open /work/{slug}
- Empty CMS items; more or fewer than 7 published Work
- Default layer names (Frame 1, Rectangle 2) — rename
- Unused styles, unused pages (Index, Privacy, Journal must not exist — delete if you created them earlier)
- More than 3 breakpoints
- Missing reduced-motion
- Images without alt that are not decorative
- Hardcoded colors that should be the five color styles
- Leftover Unsplash or “My Framer Site”
- Creator promo / framer.com/@ links
- Performance: uncompressed giants, blur >10

Fix what you can without visual change. Report what you fixed and what needs a human.

Do not write Template Agent Instructions in this chat. Do not publish.
```

---

## 13B — Instructions

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Reasoning** | Light |
| **Esfuerzo** | Bajo (~30) |
| **Skill** | ninguna |
| **@** | Site Settings / template instructions |

```
Do not edit the canvas look. Write Template Agent Instructions for buyers of Drift (Help: AI-ready template).

Tell future in-canvas Agents:
- Preserve Drift Plane as the only Home content (plus Nav + hint). Do not add a second hero, a work grid on Home, video, lightbox, or overlay viewer
- Preserve the visual system: five colors (home-bg #050505, paper #F6F3EE, ink #111111, muted #6B6B6B, line #D9D4CC); five text styles Mark/Display/Lead/Body/Label (Syne ExtraBold, Inter Regular, IBM Plex Mono Medium). Radius 0 (chips 2px). No shadows, no accent, no pixel fonts, no #FFF/#000
- Preserve the Work detail split (sticky ~33% info / ~67% stacked uncropped gallery) on paper/ink. Home stays home-bg. Do not invert that. Gallery gap 0
- Exactly 3 breakpoints. No Index, Privacy, or Journal unless the buyer explicitly asks
- Stills: cinematic muted photoreal (Lummi OK). No Unsplash, no illustration, no video, no lightbox
- Work CMS: one item = one series. Click from the Plane Array (image, title, link) must keep matching Cover + slug. When the buyer changes Cover, update the Plane card too
- Credit1–3 labels are remappable (photographer: camera/format; designer: studio/role; DP: director/producer/awards)
- Stills only. Prefer native Form, CMS Gallery stack, and Nav variants over code
- Images: Lummi is OK for templates; do not insert Unsplash if the buyer wants a coherent stills set
- Edit Nav variables for email and Instagram

Paste those instructions into the template’s custom Agent instructions field if it exists; otherwise output them in chat for me to paste.

Finally list remaining manual checks: Performance panel, Desktop/Tablet/Phone, form submit, 7 Work slugs from the plane, Info list, 404, Lummi alts.

Do not publish.
```
