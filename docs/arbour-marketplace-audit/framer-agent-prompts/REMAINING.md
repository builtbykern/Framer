# Remaining Framer Agent prompts — after 18:17 UTC re-audit

Live site: https://arbour.framer.website  
Last-Modified: **Sun, 16 Aug 2026 18:17:47 GMT**  
Score: **~8.0 / 10**. Still not Featured.

**Closed since 16:30 (do not re-run):**

- Neighbourhoods filled: 2×2 grid, street copy, honest counts **2 / 2 / 1 / 1**, featured Cheyne / Ladbroke / Frognal / Bibury, CTA → `/properties`.
- Section backgrounds **1440px** on Properties (including charcoal stats) and Neighbourhoods hero. Directory inner measure **72px**.
- Contact journal binding, unique coords, Cheyne=Thames, Bibury=honey-stone, Home rooms `(01)(02)(03)` + VIEW, waiting article body `[04]`.

**Still open.** Five prompts. **Do not create** `/neighbourhoods/{slug}` pages. **Do not create** a Privacy page.

Copy from `---` to `---`. Paste into the **in-canvas Agent tab**. One prompt per turn. **Higher** on all five.

---

## 01 — Kill the last 404 (blocker)

**Skill:** none  
**Model:** GPT 5.5  
**Reasoning:** Higher  
**Effort vs GPT 5.5:** 1×  
**Why this model:** Surgical unlink. Creating `/neighbourhoods/chelsea` is forbidden.

---

On **Home only**. Do **not** create `/neighbourhoods/chelsea`, `/neighbourhoods/notting-hill`, `/neighbourhoods/hampstead`, `/neighbourhoods/the-cotswolds`, or any other new page.

The button **SEE RESIDENCES IN THIS AREA** still points at **`/neighbourhoods/chelsea`**, which **404s**. That is the only broken internal URL on the live site.

1. Change that button so it goes to the **existing** `/neighbourhoods` page. If the overlay already highlights Chelsea, keep that. If Framer cannot deep-link a filter, `/neighbourhoods` is enough.
2. Scan the **whole project** for `href` containing `/neighbourhoods/chelsea`, `/neighbourhoods/notting-hill`, `/neighbourhoods/hampstead`, `/neighbourhoods/the-cotswolds`, or `/neighbourhoods/cotswolds`. Change every match to `/neighbourhoods` or `/properties`. **Zero** remaining hrefs to those paths.
3. Publish. Confirm `/neighbourhoods/chelsea` is no longer linked from Home. Hitting that URL in the address bar may still 404 — that is acceptable. It must not be linked.

Do not edit Neighbourhoods copy. Do not create pages.

---

## 02 — Notes numbers 01–07, Home journal number bound

**Skill:** `/cms`  
**Model:** GPT 5.5  
**Reasoning:** Higher  
**Effort vs GPT 5.5:** 1×  
**Why this model:** CMS field + collection list. Home waiting number is now **empty** (`[ ]`).

---

The seven published Notes must read **`[01]` `[02]` `[03]` `[04]` `[05]` `[06]` `[07]`** in collection order. There must be **no skipped number**.

Live `/notes` shows **`[07 ENTRIES]`** but the list is **`[06]` `[01]` `[02]` `[04]` `[03]` `[07]`** plus a featured **façade** item with **no number**. **`[05]` is missing.** There is no `[08]`.

Also: Home journal still lists **The case for waiting.** The number next to that title is now **`[ ]` empty**, not `[04]` and not `[06]`. The waiting **article** is `[04]`. Bind the Home number to the same CMS number field as `/notes`. It must never render empty brackets.

1. Open the Notes CMS. Check the number / index field on all seven published items.
2. Re-number so published items are **01 through 07** with **no gap**. Unpublished items (including mews) must **not** consume a number in that sequence.
3. Bind **every** Notes collection list — `/notes`, Home journal, Contact journal if it shows numbers — to that **same** field. Preview Home: waiting must show **`[04]`** (or whatever number the waiting item actually has after re-numbering), never `[ ]`.
4. Publish. Confirm `/notes` is 01–07 with no skip, and Home waiting is not empty.

Do not create or delete Notes. Do not change titles or body copy except the number field.

---

## 03 — lang, favicon, alts

**Skill:** none  
**Model:** Sonnet 5  
**Reasoning:** Higher  
**Effort vs GPT 5.5:** 0.6×  
**Why this model:** Site Settings + alt text. Cheap.

---

Three Site Settings / CMS image jobs. Do not redesign.

1. Set the root `<html lang>` to **`en`**. It is still empty (`lang=""`).
2. Replace the default Framer favicon (`default-favicon-light.v1.png`) with a 32×32 (and 180×180 apple) mark on cream `#F9F8F3`. Use an existing Arbour asset if one exists. Do not invent a new logo system.
3. Notes CMS images that still use generic alt **Property hero photograph** must get a specific alt. At minimum fix: **A long afternoon in Frognal**, **The value of a quiet street (Ladbroke)**, **When a house is already a home (Royal Avenue)**, **What Colville Mews still teaches**. Do not use the same alt on two different photos.

Publish. Confirm `document.documentElement.lang === "en"` and the favicon URL no longer contains `default-favicon`.

---

## 04 — Hover and pressed on primary CTAs

**Skill:** none  
**Model:** GPT 5.5  
**Reasoning:** Higher  
**Effort vs GPT 5.5:** 1×  
**Why this model:** Variant / interaction pass. Hover is still a no-op on live CTAs.

---

Desktop hover and pressed are still missing on primary text links. Do not restyle the rest of the template.

1. **EXPLORE THE COLLECTION** (Home hero), **VIEW ALL RESIDENCES**, **VIEW ALL NOTES** — hover: 1px underline, or opacity **0.55**, 150–200ms. Pressed: opacity **0.4** or 1px downward shift. Keyboard focus: 1px outline, offset 2px, `#1A1A1A` on cream / `#F9F8F3` on dark.
2. Apply the **same** hover to property cards and note cards that are links.
3. **Phone** in the overlay: keep it **not** a link. No hover, no cursor pointer.
4. Do not add color fills, shadows, or scale on these links.

Publish. Confirm `getComputedStyle` underline or opacity changes on hover for EXPLORE.

---

## 05 — Landmark, hero scrim, leftover demo line

**Skill:** none  
**Model:** Sonnet 5  
**Reasoning:** Higher  
**Effort vs GPT 5.5:** 0.6×  
**Why this model:** Landmark + contrast + leftover string. Cheap.

---

Three leftover quality items. Do not create pages.

1. Wrap the top bar on Home, Properties, Neighbourhoods, Notes, Contact, and 404 in a semantic **`header`**. `document.querySelectorAll("header").length` must be **≥ 1** on those URLs. It is currently **0**.
2. Home and Properties heroes: add a **bottom scrim** (black **40–55%** → transparent, ~40% of hero height) so the white serif title meets **WCAG 4.5:1** against the photo. Do not wash the whole image.
3. Search the project for the leftover sentence **DEMO TEMPLATE — REPLACE THIS NOTE WITH YOUR PRIVACY POLICY BEFORE PUBLISHING.** It is still **visible on Contact**, next to the journal subscribe stack. Delete that text wherever it appears. **Do not** create `/privacy`.

Publish.

---

## Optional (human, not Agent)

After 01–05: Framer **Performance** panel plus PageSpeed / Lighthouse on `https://arbour.framer.website`. Agent cannot see Lighthouse. Target Performance **≥ 90** and no layout shift on the Home hero.

Optional later: Neighbourhoods **VIEW RESIDENCES IN THIS AREA** could preselect the Properties AREA filter. Not required to close the 404.

## Do not run

- Fast Mode, `/code`, Fable 5, GPT 5.6 Sol.
- Creating `/neighbourhoods/chelsea` or any other new page.
- Creating `/privacy`.
- Changing Fraunces, Space Mono, cream `#F9F8F3`, or ~72px page padding.
- Re-filling Neighbourhoods or re-doing full-bleed section backgrounds — those are done.
