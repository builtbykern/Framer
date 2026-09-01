# Animation plans index

## Halden Nav in/out (2026-08-19) — SOTD drawer + veil

Session `-s 2` · Nav `Ebz57iEJS` · `Menu_Paper_Reveal.tsx`  
Audit in-chat (findings 1–5). Do not publish. Do not retune Logo Menu Roll timing. Do not tween Nav height.

| # | Plan | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 096 | [Clip dossier + ease-out + RM](./096-halden-nav-clip-ease-rm.md) | HIGH | DONE | — |
| 097 | [Dossier delay / stagger / exit](./097-halden-nav-dossier-stagger.md) | HIGH | DONE | Prefer after 096 |

**Recommended order:** 096 → 097 (executed together).  
**Feel-check:** Preview Play MENU/CLOSE — paper and Info/Contact are one clip from the bar; close eats the dossier.  
**No publish without OK.**

---

## Arbour TerritoryRail (2026-08-11) — desktop strip + motion bake (DONE)

Component: `Arbour_TerritoryRail` · `codeFile/il4DSn9` · dump `.tmp/Arbour_TerritoryRail_live.tsx`  
Audit: [REPORT-territoryrail-audit-2026-08-11.md](../template-plans/REPORT-territoryrail-audit-2026-08-11.md)

### Design plans

| Plan | Status | Notes |
| --- | --- | --- |
| [Stage fills frame](../design-plans/2026-08-11-territoryrail-stage-fill-frame.md) | DONE | Finding #1 — unblock strip visibility |
| [Desktop strip craft](../design-plans/2026-08-11-territoryrail-desktop-strip-craft.md) | DONE | Finding #3 — after stage-fill |
| [Trim controls](../design-plans/2026-08-11-territoryrail-trim-controls.md) | DONE | Finding #2 — after craft bake |

### Animation plans

| # | Plan | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 093 | [Snap title + hero crossfade](./093-territoryrail-snap-crossfade.md) | HIGH | DONE | Can parallel design #1 |
| 094 | [Bake hero spring / drop props](./094-territoryrail-bake-spring.md) | MEDIUM | DONE | Pair with trim-controls |
| 095 | [Strip no saturate filter](./095-territoryrail-strip-no-filter.md) | MEDIUM | DONE | Prefer after strip craft |

**Recommended order:** design **stage-fill → strip craft → trim controls** ‖ motion **093 → 094 → 095** (same push OK).  
**Push:** dump → `setCodeFile` / project harness for `il4DSn9`; then `node scripts/framer/verify.mjs`.  
**No publish without OK.** Mobile Auto thumbs path must not regress.

---

## Kern Area Scrub (2026-08-08) — UI + motion craft (TODO)

Sandbox: Area Scrub `iByGdsW6Rb9oE5M2Igua` · `code-components/AreaScrub.tsx` → `codeFile/xRz37eJ`  
Audits: improve-ui + improve-animations (2026-08-08)

### Design plans

| Plan | Status | Notes |
| --- | --- | --- |
| [Home show label](../design-plans/2026-08-08-areascrub-home-show-label.md) | DONE | Caption “Real numbers” |
| [Home fill 0.24](../design-plans/2026-08-08-areascrub-home-fill-opacity.md) | DONE | Keep component default 0.16 |
| [Well fill aspect](../design-plans/2026-08-08-areascrub-well-fill-aspect.md) | DONE | `preserveAspectRatio="none"` |

### Animation plans

| # | Plan | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 081 | [Scrub chrome on transform](./081-areascrub-scrub-transform.md) | HIGH | DONE | — |
| 082 | [Soft chrome enter/exit](./082-areascrub-chrome-fade.md) | MEDIUM | DONE | Prefer after 081 |
| 083 | [Apple-style scrub spring](./083-areascrub-scrub-spring.md) | HIGH | DONE | — |
| 084 | [Beacon transform scale](./084-areascrub-beacon-transform-scale.md) | MEDIUM | DONE | Nested chrome |
| 085 | [Label text throttle](./085-areascrub-label-throttle.md) | MEDIUM | DONE | Prefer after Home show-label |
| 086 | [Crisp leave](./086-areascrub-leave-crisp.md) | MEDIUM | DONE | Can merge with 084 |

**Recommended order:** design **label → fill → aspect** ‖ motion **083 → 084+086 → 085**  
**Push:** `node scripts/framer/push-areascrub.mjs` (pin Area Scrub first)  
**Home:** `node scripts/framer/areascrub-home.mjs`  
**No Community publish without OK.**

---

## Kern Area Scrub (2026-08-07) — Phase 3 motion polish (archive)

| # | Plan | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 081 | [Scrub chrome on transform](./081-areascrub-scrub-transform.md) | HIGH | DONE | — |
| 082 | [Soft chrome enter/exit](./082-areascrub-chrome-fade.md) | MEDIUM | DONE | Prefer after 081 |

---

## Kern Dive Field (2026-08-04) — restore re-audit (TODO)

Sandbox: Dive Field `7mzOTQA5ZdZVnu6ZH54e` · `code-components/DiveField.tsx` → `GGUB84a`  
Audit: [REPORT-divefield-improve-animations-2026-08-04-restore.md](./REPORT-divefield-improve-animations-2026-08-04-restore.md)

User restored specimen code — prior 065–069 craft is absent; evening 152–154 REVERTED. New plans:

| # | Plan | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 072 | [Full reduced-motion](./072-divefield-reduced-motion-full.md) | HIGH | DONE | — |
| 073 | [Cache uniforms + colors](./073-divefield-cache-uniforms-colors.md) | HIGH | DONE | — |
| 074 | [Drag flick](./074-divefield-drag-flick.md) | HIGH | DONE | — |
| 075 | [Keydown focus gate](./075-divefield-keydown-focus-gate.md) | MEDIUM | DONE | — |
| 076 | [Keyboard whole-layer + KEY_BOOST](./076-divefield-keyboard-whole-layer.md) | MEDIUM | DONE | Prefer after 075 |
| 077 | [Visibility pause](./077-divefield-visibility-pause.md) | MEDIUM | DONE | — |
| 078 | [Cache scatter hash](./078-divefield-cache-scatter.md) | MEDIUM | DONE | — |
| 079 | [Gate ambient timeRot/act](./079-divefield-gate-ambient-motion.md) | MEDIUM | DONE | Prefer after 072 |
| 080 | [Pointer leave sway reset](./080-divefield-pointerleave.md) | LOW | DONE | Pairs with 077 |

**Recommended order:** **072** → **073** → **075** → **076** → **074** → **077**+**080** → **078** → **079**  
**Executed 2026-08-04** — onFocus dissolve + premultiplied blend for plane legibility; push `GGUB84a`; tip `852de36e2`.  
**No Snap · no park fog · no Community publish without OK.** Push: `node scripts/framer/push-divefield.mjs`.

---

## Kern Dive Field (2026-08-04) — first-paint / rebuild opportunities

Sandbox: Dive Field `7mzOTQA5ZdZVnu6ZH54e` · `code-components/DiveField.tsx` → `GGUB84a`  
Audit: [REPORT-divefield-improve-and-opportunities-2026-08-04.md](./REPORT-divefield-improve-and-opportunities-2026-08-04.md)

| # | Plan | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 070 | [First WebGL paint opacity](./070-divefield-first-paint-opacity.md) | LOW | DONE | — |
| 071 | [Rebuild opacity bridge](./071-divefield-rebuild-opacity-bridge.md) | LOW | DONE | Prefer after 070; cancel if unfelt |

**Recommended order:** **070** → feel-check → **071** only if Content edit pops.  
**Executed 2026-08-04** — first-paint + rebuild dim on canvas opacity; push `GGUB84a`.  
**No Community publish without OK.** Push: `node scripts/framer/push-divefield.mjs`.

---

## Kern Dive Field (2026-08-03) — improve-animations

Sandbox: Dive Field / Agreeable Direction `7mzOTQA5ZdZVnu6ZH54e` · `code-components/DiveField.tsx` → `codeFile/GGUB84a`  
Audit: [REPORT-divefield-improve-animations-2026-08-03.md](./REPORT-divefield-improve-animations-2026-08-03.md)

| # | Plan | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 065 | [Keydown focus gate](./065-divefield-keydown-focus-gate.md) | HIGH | DONE | — |
| 066 | [Cache uniform locations](./066-divefield-cache-uniform-locations.md) | HIGH | DONE | — |
| 067 | [RM decorative mute](./067-divefield-reduced-motion-decorative.md) | MEDIUM | DONE | — |
| 068 | [Drag flick velocity](./068-divefield-drag-flick.md) | MEDIUM | DONE | — |
| 069 | [Keyboard whole-layer + damp](./069-divefield-keyboard-whole-layer.md) | LOW | DONE | Prefer after 065 |

**Recommended order:** **065** → **066** (parallel OK) → **067** → **068** → **069**. Same push OK for 065+069.  
**Executed 2026-08-03** — pushed `GGUB84a`, `typeErrors: []`, `verify.mjs` ok.  
**No Community publish without OK.** Push: `node scripts/framer/push-divefield.mjs`.

---

## Kern Pill Select (2026-08-01) — liquid morph continuum

Sandbox: Pill Select `PFjqWOivVzNyrdIJwOlR` · `code-components/PillSelect.tsx` → `codeFile/om6bp0W`

### Re-pass A+B+C (2026-08-02) — perf + liquid symmetry

| # | Plan | Severity | Status | Depends |
|---|------|----------|--------|---------|
| 058 | [Goo / CSS blur perf](./058-pillselect-goo-blur-perf.md) | HIGH | DONE | 055 |
| 059 | [Sharp/goo opacity crossfade](./059-pillselect-sharp-crossfade.md) | HIGH | DONE | 058 |
| 060 | [Open timing 0.72 + goo fade](./060-pillselect-open-timing.md) | MEDIUM | DONE | 058 |
| 061 | [Open grow emerge](./061-pillselect-open-grow.md) | MEDIUM | DONE | 060 |
| 062 | [Close content fade](./062-pillselect-close-content-fade.md) | MEDIUM | DONE | 056 |
| 063 | [will-change only while morphing](./063-pillselect-willchange-morph.md) | LOW | DONE | 059 |
| 064 | [Anti-flicker + more morph](./064-pillselect-antiflicker-more-morph.md) | HIGH | DONE | 058–063 |

**Recommended order (complete):** **058–059** → **060–061** → **062** + **063** → **064** (same push).

### Continuum baseline
Audit: improve-animations findings #1–#6 (snappy + freezeado) · plan continuum  
Re-audit polish: neck keyframes + close ease-out + press/stagger

| # | Plan | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 052 | [Open continuum (no hold / motion goo)](./052-pillselect-open-continuum.md) | HIGH | DONE | — |
| 053 | [Items opacity soft ramp](./053-pillselect-items-fade.md) | MEDIUM | DONE | 052 |
| 054 | [Blur cap ≤2px detach window](./054-pillselect-blur-cap.md) | LOW | DONE | 052 |
| 055 | [Neck keyframes + late goo](./055-pillselect-neck-keyframes.md) | HIGH | DONE | 052 |
| 056 | [Close ease-out 0.36s](./056-pillselect-close-ease-out.md) | HIGH | DONE | 055 |
| 057 | [Chevron + press + row stagger](./057-pillselect-press-stagger.md) | MEDIUM | DONE | 055 |

**Recommended order (complete):** **052–054** → **055** → **056** + **057** (same push).  
**No Auto Demo** (locked). **No publish without OK.**

---

## Kern Contact Dock (2026-07-31) — Marketplace v1 craft

Sandbox: Overly Interaction `2GOZzqC76RSbm2V0FOXP` · `code-components/ContactDock.tsx` → `codeFile/UkECoRS`  
Audit: [REPORT-contactdock-improve-animations-2026-07-31.md](./REPORT-contactdock-improve-animations-2026-07-31.md) (re-audit after user restore)  
UI companion: `design-plans/2026-07-31-contactdock-drop-inter-fallback.md` (DONE)

| # | Plan | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 044 | [Pulse via CSS transform](./044-contactdock-pulse-css.md) | HIGH | DONE | — |
| 045 | [Asymmetric close + exit to orb](./045-contactdock-asymmetric-close.md) | MEDIUM | DONE | — |
| 046 | [Channel fine-pointer hover](./046-contactdock-fine-pointer-hover.md) | MEDIUM | DONE | Shared `DOCK_CSS` w/ 044/047 |
| 047 | [Orb :focus-visible](./047-contactdock-focus-visible.md) | MEDIUM | DONE | Shared `DOCK_CSS` w/ 044/046 |
| 048 | [Sheet/row transform strings](./048-contactdock-transform-strings.md) | LOW | DONE | After 045 |
| 049 | [whileTap 0.97](./049-contactdock-press-scale.md) | LOW | DONE | — |
| 050 | [Chat ↔ × crossfade](./050-contactdock-icon-crossfade.md) | LOW | DONE | — |
| 051 | [Orb fine-pointer glow hover](./051-contactdock-orb-hover-glow.md) | LOW | DONE | After 046/047 CSS |

**Restore note:** User restored pre-craft Framer build — open UX must not break. Craft 044–051 re-executed on restored base (2026-07-31 pm).  
**Recommended order (complete):** **049** → **044** → **045** → **046**+**047** → **048** → **050** → **051**.  
**No Auto Demo** (locked). **No publish without OK.**

---

## Kern Copy Field (2026-07-30) — BuiltByKern Marketplace pre-build

Sandbox: Gold Parsnip `fGqO95KLAs2bClhRoOW1` · target `code-components/CopyField.tsx`  
Audit: [REPORT-copyfield-kern-improve-animations-2026-07-30.md](./REPORT-copyfield-kern-improve-animations-2026-07-30.md)  
UI companions: `design-plans/README-copyfield-2026-07-30.md`

| # | Plan | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 039 | [Digit reveal stagger](./039-copyfield-digit-reveal-stagger.md) | HIGH | DONE | UI dark house + accent |
| 040 | [Icon morph + success stroke](./040-copyfield-icon-morph-success.md) | HIGH | DONE | 039 + accent grammar |
| 041 | [Toast enter / exit](./041-copyfield-toast-enter-exit.md) | MEDIUM | DONE | 040 + UI toast chrome |
| 042 | [RM + static + fine-pointer gates](./042-copyfield-a11y-static-gates.md) | MEDIUM | DONE | 039–041 |
| 043 | [Action press scale 0.97](./043-copyfield-press-scale.md) | LOW | DONE | 040 |

**Recommended order:** UI 1→2 → 039 → 040 → UI 3 → 041 → 042 → 043.  
**No Auto Demo** (locked). **No publish without OK.**

### Post-ship (2026-07-30 evening) — DONE

Audit: [REPORT-copyfield-improve-animations-2026-07-30-postship.md](./REPORT-copyfield-improve-animations-2026-07-30-postship.md)

| Finding | Fix | Status |
| --- | --- | --- |
| 1 Remount digits | Dual-layer interruptible crossfade | DONE in `CopyField.tsx` |
| 2 Dead outer span | Removed | DONE |
| 3 Stroke opacity on success | Opacity only while `copying` | DONE |

UI companions: Clash on Home+`/thumbnail`, product caption, `/thumbnail` page — `scripts/framer/copyfield-elevate.mjs`

---

## Kern Glyph Ink (2026-07-28) — SOTD fill elevation

Source: `code-components/Kern_GlyphInk.tsx` → Framer `codeFile/Akt2aXG`.  
Audit: [REPORT-glyphink-fill-sotd-2026-07-28.md](./REPORT-glyphink-fill-sotd-2026-07-28.md)

| # | Plan | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 034 | [Cinematic ink enter curve + 480ms](./034-glyphink-ink-enter-curve.md) | HIGH | DONE | — |
| 035 | [Softer tip 82/92 + corner-safe cover](./035-glyphink-softer-ink-tip.md) | HIGH | DONE | After 034 (feel) |
| 036 | [Cross-axis droplet → wipe](./036-glyphink-cross-axis-droplet.md) | MEDIUM | DONE | After 035 |
| 037 | [Stagger cap 200ms + ink opacity](./037-glyphink-stagger-opacity.md) | MEDIUM | DONE | After 034 |
| 038 | [Live seed + tip harden + ghost dim](./038-glyphink-live-seed.md) | HIGH | DONE | After 034–037 |

**Recommended order:** 034 → 035 → 036 → 037 → 038 — **executed 2026-07-28**.  
**No Auto Demo** (locked).

**Essence locked:** pointer-origin · dual ghost/ink · per-glyph cascade · no Auto Demo · √2 corner cover.

### Prior craft (DONE)

| # | Plan | Severity | Status |
| --- | --- | --- | --- |
| 029–033 | [Motion craft findings 1–5](./029-033-glyphink-motion-craft.md) | HIGH→MED | DONE |

Audit: [REPORT-glyphink-improve-animations-2026-07-28.md](./REPORT-glyphink-improve-animations-2026-07-28.md)

---

## Kern Filling Point (2026-07-21) — SOTD craft

Source: `code-components/Kern_FillingPoint.tsx` → Framer `codeFile/APe9aGh`.  
UI companions: `design-plans/2026-07-21-fillingpoint-*.md`.

| # | Plan | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 009 | [Press scale 0.97](./009-fillingpoint-press-scale.md) | HIGH | DONE | After label/font UI |
| 010 | [Reduced-motion opacity fill](./010-fillingpoint-reduced-motion-opacity.md) | MEDIUM | DONE | After 009 |
| 011 | [Fine-pointer hover gate](./011-fillingpoint-fine-pointer-hover-gate.md) | MEDIUM | DONE | After 010 |
| 012 | [Spring 420/36 + click ripple](./012-fillingpoint-spring-and-click-ripple.md) | LOW/MED | DONE | After 011 |
| 013 | [Touch press fill + keyboard press](./013-fillingpoint-touch-keyboard-feedback.md) | HIGH | DONE | After 012 |
| 014 | [Restore origin circle + scale](./014-fillingpoint-restore-origin-transform.md) | HIGH | DONE | Restore motion |
| 015 | [Cascade delay cap 120ms](./015-fillingpoint-cascade-delay-cap.md) | MEDIUM | DONE | With 014 |
| 016 | [Remove ripple; rect pointer](./016-fillingpoint-remove-ripple-fix-pointer.md) | MEDIUM | DONE | With 014 |
| 017 | [Scale floor 0.18 + opacity](./017-fillingpoint-scale-opacity-floor.md) | HIGH | DONE | Motion craft |
| 018 | [Fill duration 240ms](./018-fillingpoint-fill-duration-240.md) | MEDIUM | SUPERSEDED | By 023 |
| 019 | [Cascade delays 0/55/110](./019-fillingpoint-cascade-delay-retune.md) | MEDIUM | SUPERSEDED | By 023 |
| 020 | [Press fill OUT 80ms](./020-fillingpoint-press-fill-out-snap.md) | MEDIUM | DONE | With 017 |
| 021 | [Transform scale string](./021-fillingpoint-transform-string.md) | LOW | DONE | With 017 |
| 022 | [Solid origin paint](./022-fillingpoint-solid-origin-paint.md) | HIGH | DONE | Deluxe contract |
| 023 | [Cinematic reverse cascade](./023-fillingpoint-cinematic-reverse-cascade.md) | HIGH | DONE | After 022 |
| 024 | [Cover multiplier 2.4](./024-fillingpoint-cover-multiplier.md) | HIGH | DONE | Feel retune |
| 025 | [Ink enter 760ms + ease-in-out](./025-fillingpoint-ink-enter-curve.md) | HIGH | DONE | With 024 |
| 026 | [Cascade stagger 0/140/280](./026-fillingpoint-cascade-stagger-retune.md) | MEDIUM | DONE | With 025 |
| 027 | [Enter opacity 200ms](./027-fillingpoint-enter-opacity-couple.md) | MEDIUM | DONE | With 025 |
| 028 | [Contract + control copy sync](./028-fillingpoint-contract-docs-sync.md) | LOW | DONE | After 024–027 |

**Recommended order:** 024 → 025 → 026 → 027 → 028. These supersede the
`480/600 / 0·90·180` numbers in 023 for perceived fill readability.

---

## Zoom Image Intro (2026-07-19)

Source: `code-components/ZoomImageIntro.tsx` → Framer `aNCXc66`.  
Full audit: [REPORT-zoom-image-intro-2026-07-19.md](./REPORT-zoom-image-intro-2026-07-19.md)

| # | Plan | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 005 | [Gap-only pace (no shorter late zooms)](./005-zoom-intro-gap-only-pace.md) | HIGH | DONE | — |
| 006 | [Freeze settled layers (no mid-zoom jump)](./006-zoom-intro-freeze-buried-layers.md) | HIGH | DONE | After 005 |
| 007 | [Opacity-only exit + hold 0.45](./007-zoom-intro-opacity-exit-hold.md) | MEDIUM | DONE | Independent |
| 008 | [Fade-in ease-out 0.24s](./008-zoom-intro-fadein-ease-out.md) | MEDIUM | DONE | Independent |

**Recommended order:** 005 → 006 → 007 → 008.  
UI companion: `design-plans/2026-07-19-zoom-image-intro-objectfit-titles.md`.

**Execute:** say `execute 005–008` (or pick numbers). Skills forbid editing source until an execute pass.

### Out of scope (opportunities, not planned)

- Click/tap to skip intro
- Blur crossfade between layers
- Springs / Ken Burns pan

---

## Scroll Blur (2026-07-18) — DONE

| # | Plan | Severity | Status |
| --- | --- | --- | --- |
| 001 | [Stop restarting fade-in on every scroll tick](./001-scroll-blur-fadein-no-restart.md) | HIGH | DONE |
| 002 | [Bring fade-in/out under UI duration budget](./002-scroll-blur-duration-budget.md) | MEDIUM | DONE |
| 003 | [Cap blur + write filters without CSS var](./003-scroll-blur-strength-write-path.md) | MEDIUM | DONE |
| 004 | [Align default easings to AUDIT ease-out](./004-scroll-blur-ease-token-align.md) | LOW | DONE |

Repo `plans/` holds Arbour site motion. Component motion plans live here.
