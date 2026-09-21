# Alarm Clock craft

Free Framer **code component**. Waiting-list / launch countdown. Alarm skin locked.

## One-sentence mission
Build a desktop-alarm **object** whose face counts down to a target datetime — Free, Framer-native, Awwwards craft, affiliate-ready preview.

## What it is / is not

### Is
- Code component for Framer Marketplace (FREE)
- Countdown to absolute datetime (timezone-aware)
- Named object: Alarm (despertador)
- Props for units, labels, colors, end state, size
- Preview CTA for BuiltByKern affiliate sign-ups

### Is not
- Full waitlist landing template (later product)
- Sill / Halden / Arbour / Softie
- Number Flow (animate a value) or Thinking Orbs (ambient)
- WebGL Cubic Time clone
- Email form / CMS site chrome

## Object anatomy (Alarm skin)

```
┌─────────────────────────────┐
│  [optional bells / handle]  │
│  ┌───────────────────────┐  │
│  │  DD   HH   MM   SS    │  │  ← face (primary)
│  │  days hrs  min  sec   │  │  ← quiet labels
│  └───────────────────────┘  │
│         [feet / base]       │
└─────────────────────────────┘
```

- Body: simple geometric case (rounded rect / soft trapezoid). One accent optional.
- Face: inset or glass plane; digits dominate ≥60% of face area.
- Separators: colon dots or thin gutters — intentional, not default `|`.
- Scale: component has a single `size` or width prop; scales as one object (not reflow into a random dashboard).

## Tokens (defaults — overridable via props)

| Token | Default | Notes |
|-------|---------|--------|
| Paper (body) | `#F4F3F0` | Off-white; Biatec monochrome variant via `theme` |
| Ink | `#0A0A0A` | Digits + labels |
| Ink mute | `#6B6B6B` | Unit labels |
| Accent | `#C45C26` or Noel-set | Optional bell / foot / colon; one accent max |
| Face | `#FFFFFF` or paper−2% | Slight lift from body |
| Radius | 12–20px body | Not pill; not sharp Brutalist cube |
| Type digits | One grotesk or tabular nums | Prefer `font-variant-numeric: tabular-nums` |
| Type labels | Same family, 10–12px, tracking wide, uppercase optional |

Dark theme prop: invert paper/ink (Biatec steal) — still one accent max.

## Layout rules
- Units in a **row** by default: Days · Hours · Minutes · Seconds.
- Each unit = digit stack + label under (Biatec).
- If `showDays=false`, collapse gap; do not leave empty columns.
- Min touch target for preview CTA is separate from the clock object.
- Responsive: below ~320px width, allow 2×2 unit grid **only if** object still reads; prefer scale-down of one row.

## Motion (lead craft bar until Noel RED)
- Digit change is the **only** performance; body stays still.
- Second tick: primary change every 1s (**v1 no tenths**).
- **Fade:** opacity + tiny Y crossfade (`AnimatePresence` sync), ≤220ms, ease `[0.22, 1, 0.36, 1]`.
- **Flip:** two-phase split flap in a fixed box (top folds → bottom folds), ≤240ms total — ink glyph only, no opaque cards / Marketplace soup. Hinge hairline only while flipping.
- Canvas static + `prefers-reduced-motion` → force `none`.
- Optional micro idle on body: off by default; off under reduced-motion.
- End state: when `now >= target` → `endLabel` / zeros / hide; optional one-shot visual “ring” later — **no audio** in v1.

## Reduced motion
`prefers-reduced-motion: reduce` → snap to current digits; no flip; no idle; end state instant.

## Canvas-safe
When Framer canvas is not “playing”, show a designed rest pose (e.g. fixed demo remaining time from props `previewRemaining` or frozen target) — not `00:00:00` empty fail.

## Affiliate (preview only)
- Button or text link in the **Marketplace preview** composition (sibling to component, or optional slot).
- URL: `https://framer.link/qIg9LiG` (alt `https://framer.link/builtbykern`)
- `target="_blank"` + `rel="noopener"` **required**
- Does not cover digits; does not pause countdown

## Tech constraints
- Framer Code Component (React)
- Prefer **zero** external deps; Framer Motion OK if already BBK pattern
- No network calls required for countdown (local time + target)
- Timezone: use explicit IANA string prop; document fallback to local
- SSR/canvas: no `window` crash — guard timers

## Do not copy
- Cubic Time: WebGL cubes / Dotorg scene
- Atlas: editorial chrome, totality marketing site
- NY countdown: full page brutalism
- Biatec: cloud photo + email form as component guts
- Board: LED matrix skin in v1

## Price / scope
FREE. Affiliate money = new Framer sign-ups via `?via=builtbykern` (Till).  
Components do not earn remix referral. Keep light; do not overbuild into paid template density.

## Out of scope (this pass)
Waitlist Hero template · Eclipse/Board/Cubic skins · Marketplace submit · Community/X paste kits · audio alarm · server sync · multiple targets · timezone map UI
