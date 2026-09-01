# Aurea Quantum Visual System — Implementation Plan

> **For agentic workers:** Execute task-by-task with `applyChanges` + screenshot + `verify.mjs`. Do not skip visual gates. Do not publish.

**Goal:** Make the whole Aurea template *read* as Quantum Body (cinematic editorial wellness) while remaining an original Modern Ritual House, not a clone.

**Architecture:** Keep the existing IA, CMS, and page shells. Replace the visual language in locked layers: tokens → shared shell → Home remaining sections → Rituals → Journal/article → Contact → responsive/verify. One section family per task. Screenshot Desktop before moving on.

**Tech Stack:** Framer project `32N5ipHfkUMlPJAI6dc7` (Strong Luxury), Cursor + `scripts/framer/{session,exec,verify}.mjs`, DSL `applyChanges`, Unsplash via `queryImages`, existing components only (`Overlay Nav`, `Ritual Step`, `Ingredient Row`, `Form Submit Button`). No new code components.

## Global Constraints

- Rebound Strong Luxury before every exec: `node scripts/framer/session.mjs --url "https://framer.com/projects/Strong-Luxury--32N5ipHfkUMlPJAI6dc7-gX7Pa"` (`projectId=32N5ipHfkUMlPJAI6dc7`).
- Do not edit `aurea-template_4bc8dacb.plan.md`.
- Do not publish. Do not add pages. Do not add Shopify/booking/accounts.
- Do not copy Quantum Body copy, compositions, or assets literally.
- Do not introduce more code components. Keep `HeroStage` hidden. Do not revive kinetic letter-flip as the hero signature.
- Animated code must keep `useIsStaticRenderer()` + freeze-in-place (`docs/projects/STATIC_RENDERER.md`).
- Photography: macro organic (skin, botanicals, water, minerals, light) — never perfume-catalog still-lifes as the primary hero language.
- Type: **Switzer** for display and UI. Kill leftover local `fontName="Newsreader"` overrides on canvas text.
- Color tokens already locked: Ink `#1D1107`, Bone `#EDE4D4`, Sand `#948B7E`, Clay `#6D523C`, Warm Cream `#FCE8C2`, Hairline `rgba(29,17,7,0.18)`. Optional add: Deep Brown `#422F1F`.
- Radius: images/cards `24px`–`28px`. Section padding 128/96/64. Gutters 48/32/20.
- Motion: one-shot in-view fades only. No loops, no custom cursor.
- One H1 per page. Labels real. Contrast AA on cream/espresso.
- Visual gate: Desktop screenshot of the touched section must look Quantum-led before Tablet/Phone.

## Preserve / Improve / Avoid

**Preserve:** 4 visible pages + Journal template; CMS Rituals + Journal; Overlay Nav + Burger Flip; Ritual Step / Ingredient Row / Form Submit Button; Inner Circle forms; original Aurea copy niche (scent, rest, daily return).

**Improve:** Make every page use Quantum’s *grammar*: full-bleed macro, huge grotesque cream/ink type, numbered long copy, rounded media, espresso↔bone alternation, floating object cards.

**Avoid:** Aesop/Le Labo catalog, Newsreader as display, kinetic fashion hero, spa-green, AI-purple, neon, extra pages, Quantum mechanics claims, downloading Quantum assets.

## Current state (2026-08-12)

Already Quantum-led:
- Color + text styles (Switzer)
- Home hero `AXoBqu6TL` (lotus, top headline, essence card, tagline)
- Home manifesto `Za7Y2OADF` (beige numbered doctrine)
- Home type chapter `kc2eH_4Yf` (“There is more to rest than stillness.”)

Still perfume/editorial-catalog:
- Home: Ritual Story, Essence 01, Past Wisdom, Four Principles, Other Rituals, Ingredients, Journal Preview, Inner Circle, Footer
- `/rituals`, `/journal`, `/journal/:Journal`, `/contact`
- Shared components’ local type/radius
- Phone stack-collision warnings from fixed replica heights

## File / node map

| Area | Where |
|------|--------|
| Tokens | ColorStyleTokenNode `79da499d…` Ink, `4b92f2c2…` Bone, `23f8df48…` Sand, `8ddd7f7f…` Clay, `7c1d8519…` Warm Cream |
| Type | TextStylePresetNode `R4p0eKqJM` Hero … `RxJd0R3zs` Caption |
| Home Desktop | `WQLkyLRf1` |
| Rituals Desktop | `Ekf4qoLi9` |
| Journal Desktop | `nLochsTIp` |
| Contact Desktop | `uoZt5x7QH` |
| Scripts | `tmp/aurea-quantum-*.mjs` |
| Verify | `node scripts/framer/verify.mjs --page <path> --node <id>` |

---

### Task 1: Lock the system (tokens, leftover Newsreader, radius, photo rules)

**Files:**
- Modify: Framer styles + any RichTextNode with local `fontName="Newsreader"`
- Test: screenshot Home hero + manifesto; grep serialize for Newsreader

- [ ] **Step 1:** Rebound session to Strong Luxury.
- [ ] **Step 2:** Scan Home/Rituals/Journal/Contact for `fontName="Newsreader"` and SET those nodes to inherit `Aurea/*` presets (Switzer).
- [ ] **Step 3:** Add `Aurea/Deep Brown` `#422F1F` if a third dark surface is needed; do not invent extra hues.
- [ ] **Step 4:** Confirm Overlay Nav text styles are Switzer (`sSYuF7w57`, `fSkqxBl1R`, `QekogWM_U`).
- [ ] **Step 5:** Screenshot Home hero. Pass = lotus full-bleed, cream grotesque title at top, rounded essence card, tagline at bottom, no kinetic letters.

---

### Task 2: Home — remaining sections (one family at a time)

Work top to bottom. Do not restyle all Home sections in one `applyChanges`.

**Order:**
1. `wzb2WV9bv` Ritual Story → dark espresso, cream grotesque, rounded body/botanical photo (Quantum about block).
2. `ZJ0pt1wzY` Essence 01 → object card language (rounded media + 01 index), not perfume still-life hero.
3. `Va8p5eH32` Past Wisdom / Modern Practice → keep Antara dual thesis, restyle as Quantum diptych (two rounded images, huge type, not spa brochure).
4. `H6NDV3SH8` Four Principles → North Stars grammar: large 01–04, quiet doctrine, no accordion-feature look.
5. `gnjgqENs1` Other Rituals → CMS cards with rounded macro images, numbered moments.
6. `dS7p8NOPJ` Ingredients → keep Ingredient Row; restyle surface to espresso/cream, radius 24.
7. `HuRcBoVre` Journal Preview → ORDR archive *craft* on Quantum surfaces (not magazine cards).
8. `RaBtZkl9M` Inner Circle + `uc_ZoQdWr` Footer → cream-on-espresso, Switzer, hairline, no giant serif logo lockup if it still reads fashion.

- [ ] **Step 1:** Serialize the target section (`depth: 2`) and screenshot before.
- [ ] **Step 2:** `queryImages` for that section only (macro botanical / skin / water). Never reuse Quantum Body files.
- [ ] **Step 3:** `applyChanges` for fill, type preset, radius, padding. Keep CMS bindings intact.
- [ ] **Step 4:** Desktop screenshot. Pass = same grammar as hero/manifesto. Fail = still-life catalog or Newsreader display.
- [ ] **Step 5:** Only then Tablet/Phone padding 96/64 and gutters 32/20.

---

### Task 3: Shared components

**Nodes:** Overlay Nav `F7FlnigBf`, Ritual Step `k7H7w5bHa`, Ingredient Row `GcWc6vc3k`, Form Submit Button `brtsLYslT`.

- [ ] **Step 1:** Overlay Nav: Switzer labels, cream on espresso, no Geist leftovers.
- [ ] **Step 2:** Ritual Step variants Desktop/Tablet/Phone: numbered 01–03, rounded media, grotesque titles.
- [ ] **Step 3:** Ingredient Row: hairline + caption, not luxury-goods tiles.
- [ ] **Step 4:** Form button: 56px height, radius consistent with cards, Idle/Pending/Success/Error unchanged logically.
- [ ] **Step 5:** Screenshot one instance of each on Home.

---

### Task 4: Rituals page

**Root:** `Ekf4qoLi9`. Keep CMS offsets 0/1/2. Do not add Ritual detail pages.

- [ ] **Step 1:** Header `dlvlz_ytg` → huge grotesque “Rituals for every threshold.” on Bone, not serif editorial.
- [ ] **Step 2:** Each chapter: rounded ritual image, 01/02/03, Moment as label, Title as H2 grotesque, long description. Alternate Bone / Ink / Sand like Quantum chapter rhythm.
- [ ] **Step 3:** Replace perfume-bottle fills with distinct macro moments (morning light / midday plant / night mineral) via `queryImages`.
- [ ] **Step 4:** Desktop screenshot of full page. Then Tablet 2-col where it fits, Phone stack, no clipped CMS lists.
- [ ] **Step 5:** `verify.mjs --page /rituals --node Ekf4qoLi9`

---

### Task 5: Journal index + article template

**Roots:** `nLochsTIp`, article desktop `mrbD3w2Nx`. Keep CMS fields and `/journal/:Journal`.

- [ ] **Step 1:** Index header → Quantum beige manifesto grammar (huge grotesque H1, short intro).
- [ ] **Step 2:** Featured + archive cards: rounded covers, category label, grotesque title, no Newsreader. Keep links `/journal/:slug`.
- [ ] **Step 3:** Article template: editorial hero with rounded cover, metadata row, Body presets `Aurea/H2` + `Aurea/Body Large`, Inner Circle CTA.
- [ ] **Step 4:** Screenshot index Desktop + one article desktop.
- [ ] **Step 5:** `verify.mjs --page /journal --node nLochsTIp`

---

### Task 6: Contact

**Root:** `uoZt5x7QH`.

- [ ] **Step 1:** Contact Hero `bncE8DOYF` → espresso + huge cream grotesque claim (Quantum “Get in Touch” energy, Aurea copy).
- [ ] **Step 2:** Form section: Bone surface, real labels, hairline inputs, submit component. Stockists stay static demo.
- [ ] **Step 3:** Inner Circle + Footer match Home shell from Task 2/3.
- [ ] **Step 4:** Screenshot Desktop/Phone.
- [ ] **Step 5:** `verify.mjs --page /contact --node uoZt5x7QH`

---

### Task 7: Responsive, collisions, final verify

- [ ] **Step 1:** Fix Phone replica stack collisions (negative spacing on `JqKw0hNwi` and other phone roots) by using `height="auto"` on page roots and section stacks, not guessed px containment.
- [ ] **Step 2:** Tablet keeps 2 columns where Quantum would; Phone stacks and keeps content.
- [ ] **Step 3:** `verify.mjs --strict` then `audit.mjs --mode all`.
- [ ] **Step 4:** Confirm unique metadata still present; one H1 per page; no HeroStage visible.
- [ ] **Step 5:** Stop. Thumbnail/demo/publish remain out of scope until explicit approval.

## Definition of done

A stranger who knows Quantum Body should say “this is in that family” within 3 seconds of Home, Rituals, and Journal — without seeing Quantum’s logo, copy, or assets. Aurea must still be a ritual-house template, not a meditation-app clone.

## Execution

Do not start Task 2 until Task 1 screenshot passes. Do not start a new page until the previous page Desktop screenshot passes.
