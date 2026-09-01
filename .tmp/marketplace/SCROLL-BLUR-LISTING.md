# Scroll Blur — Marketplace listing pack

**Creator:** BuiltByKern ([@builtbykern](https://www.framer.com/@builtbykern/))  
**Component file:** `BuiltByKern_ScrollBlur.tsx` · display name **Scroll Blur** · listing shorthand **Kern_ScrollBlur** (same pattern as Kern_KineticLine)  
**Project:** [Scroll Blur](https://framer.com/projects/Scroll-Blur--70Gz3ecNjl8yGIatVfz0-dCyWX) · id `70Gz3ecNjl8yGIatVfz0`  
**Thumbnail (1600×1200):** `.tmp/marketplace/scroll-blur-thumbnail-1600x1200.png`  
B&W architecture + title **Scroll Blur**. Source: `scroll-blur-thumbnail-bw-title.png`.

Tone matched to BuiltByKern listings (Corner Scroller, Kinetic Line, FlowingMenu).

**Paste tip:** Framer Description is plain text — no Markdown. Open the `PASTE-*.txt` files and copy from there (or use TextEdit). Do not copy from Markdown code fences in this doc.

| Field | File |
|-------|------|
| Title | `PASTE-title.txt` |
| Summary | `PASTE-summary.txt` |
| About | `PASTE-about.txt` |
| Full description | `PASTE-description.txt` |
| Community post | `PASTE-community.txt` |

---

## Identity audit (2026-07-19)

| Surface | Status |
|---------|--------|
| Live code file name | `BuiltByKern_ScrollBlur.tsx` (`yC_uQFE`) |
| Export / displayName | `Scroll Blur` |
| Live source: Arbour / ProgressiveBlur / Coverage / scrim / Fade In-Out | **none** |
| Project name | Scroll Blur (Marketplace demo project) |
| Thumbnail text | “Scroll Blur” only — no third-party names |
| Public listing copy | BuiltByKern / Kern_ScrollBlur / KERN only |

**Local drafts only (do not ship):** `.tmp/Arbour_*.tsx`, `.tmp/scrollblur-v*.tsx`, `.tmp/BuiltByKern_ScrollBlur.live.tsx` — old R&D with Arbour / scrim / Fade In. Ignore for Marketplace.

---

## Creator Dashboard — paste fields

### Title
```
Scroll Blur · Soft backdrop blur for section chrome
```

### Short summary (listing card / SEO blurb)
```
Soft backdrop blur for section chrome — Edge, U, or ∩ shapes. Always On or Follow Scroll. Safari-safe, no hard cut lines.
```

### Category
`Interactions`  
(alt if portal forces Backgrounds: `Backgrounds`)

### Tags
```
Framer, Component, Scroll, Blur, Backdrop Filter, Chrome, Nav, Sticky, Agency, Studio, Motion, Reduced Motion, Code Component, Safari
```

### Price
Match your store default for FX chrome (Free or Premium).

---

## About this Component

```
Most edge blurs in Framer are either a hard strip or a solid veil. They look fine in a demo, then fight Safari masks or wash the content underneath.

Kern_ScrollBlur is full-frame soft backdrop blur for real section chrome — sticky navs, footer docks, editorial bands. Soft masks fade dense blur at the pinned edge into nearly clear content. No hard mid-line cut. No color overlay. No opacity tricks on the filter layers (those kill CSS masks and turn the effect into a box).

Three shapes from the panel:
→ Edge — classic vertical fade from the pinned side
→ U — cupped: clear center, dense sides
→ ∩ — inverted U: hard center, soft left/right wings

Modes:
→ Always On — pinned chrome, always visible
→ Follow Scroll — shows while scrolling, hides after Settle (idle delay — not a fade)
→ Off — hide on canvas when you need a clean artboard

Strength stays in a Safari-safe peak range (2–10 px). Adaptive layer count (2 at low strength, 4 when you need depth). Off-screen work pauses. prefers-reduced-motion keeps a gentler static blur and disables Follow Scroll.

Drop it fixed over your breakpoint, pin Position top or bottom, pick Shape + Strength, preview Follow Scroll in Preview/publish (canvas shows Always On for that mode so editing stays readable).

Single self-contained .tsx — Framer + Framer Motion only, no helper imports.

Built brutally well by KERN.
```

---

## Full Description

```
Section chrome on studio sites needs depth without killing readability. Flat gradients and opacity fades do not blur what sits behind them. Native backdrop-filter without soft masks either looks like a hard band or a muddy full-frame veil.

Kern_ScrollBlur stacks soft-masked backdrop-filter layers across the full frame. Peak blur sits at the pinned edge; the curve softens toward content so the transition reads as intentional motion design — not a CSS hack.

Controls (all from the panel):

Shape — Edge / U / ∩ (vertical segmented). Edge = vertical fade. U = cupped clear center. ∩ = hard center, soft sides.

Position — Bottom or Top. Where the blur is densest.

Strength — Peak blur in px (2–10). Defaults tuned for subtle editorial chrome.

Mode — Always On / Follow Scroll / Off. Follow Scroll uses visibility (Safari-safe), not opacity on filter layers.

Settle — Idle delay after the last scroll before hide (Follow Scroll only). Not a fade duration.

Production guardrails:
→ No opacity / isolation / clip-path on backdrop-filter parents
→ Peak blur capped for Safari stability
→ Adaptive layer count by Strength
→ useInView: pause scroll listeners + skip layers off-screen
→ Canvas-safe Follow Scroll preview (Always On while editing)
→ prefers-reduced-motion: weaker static blur, no Follow Scroll
→ pointer-events: none — never blocks clicks underneath
→ Zero external dependencies

How to place:
1. Add Scroll Blur to your page.
2. Pin it (fixed) over the breakpoint frame; size to the chrome band you want covered (full width, modest height or full frame — masks handle the falloff).
3. Set Position to Top for nav chrome or Bottom for footer/dock.
4. Tune Shape + Strength. Start around Strength 8.
5. For scroll-reactive chrome: Mode → Follow Scroll, open Preview, scroll. Adjust Settle if hide feels early/late.

Defaults are subtle — editorial out of the box.
```

---

## Property panel cheat sheet (for reviewers / support)

| Control | Options / range | Notes |
|---------|-----------------|-------|
| Shape | Edge · U · ∩ | Vertical segmented |
| Position | Bottom · Top | Dense edge |
| Strength | 2–10 px | Default 8 |
| Mode | Always On · Follow Scroll · Off | Vertical segmented |
| Settle | 200–700 ms | Default 280; Follow Scroll only |

---

## Live preview page (requirements)

Framer expects a **16:9** public preview URL:

1. Publish the Scroll Blur project (or a dedicated `/preview` page).
2. Root: height `100vh`, content centered; **one** Scroll Blur instance visible in the top 16:9.
3. Demo: Always On + Edge + Strength 8 over photo content (matches thumbnail).
4. Paste the published URL into **Preview** on the submission form.

Project editor: https://framer.com/projects/Scroll-Blur--70Gz3ecNjl8yGIatVfz0-dCyWX

---

## Assets checklist

| Asset | File | Spec |
|-------|------|------|
| Thumbnail | `.tmp/marketplace/scroll-blur-thumbnail-1600x1200.png` | **1600×1200** B&W + title “Scroll Blur” |
| Source | `.tmp/marketplace/scroll-blur-thumbnail-bw-title.png` | generated master |
| Alt (no type) | `.tmp/marketplace/scroll-blur-thumbnail-4x3.png` | older text-free draft |
| Live preview | publish project URL | 16:9 focus, single instance |
| Inline gallery (optional) | Edge / U / ∩ screenshots | no third-party names |

---

## Community launch post (profile tone)

```
Shipped Scroll Blur — soft backdrop blur for section chrome, not another hard strip or solid veil.

Kern_ScrollBlur soft-masks full-frame backdrop-filter so dense blur at the pinned edge fades into clear content. Safari-safe (no opacity on filter layers).

Shapes from the panel:
→ Edge — vertical fade
→ U — cupped clear center
→ ∩ — hard center, soft sides

Modes:
→ Always On
→ Follow Scroll (show while scrolling, hide after Settle)
→ Off on canvas when you need a clean artboard

Also in the box:
→ Strength 2–10 px (Safari-safe peak)
→ Adaptive layers + off-screen pause
→ prefers-reduced-motion fallback
→ Framer + Framer Motion only — zero external deps

Drop it fixed over nav or footer chrome. Defaults are subtle — editorial out of the box.

Marketplace: [paste link after publish]
Preview: [paste published URL]

WDUT — Edge under nav, or ∩ over a hero dock?

— BuiltByKern · built brutally well
```

---

## Submit checklist

- [ ] Upload thumbnail `scroll-blur-thumbnail-1600x1200.png`
- [ ] Paste Title + Summary + About + Full Description
- [ ] Tags + category
- [ ] Publish preview page → paste Preview URL
- [ ] Confirm single instance in live preview
- [ ] No third-party names in preview or thumbnail
- [ ] Test Always On + Follow Scroll in Preview before submit
- [ ] Post community launch after approval

**Do not publish the Marketplace listing without your explicit go-ahead.** This pack is copy + assets only.
