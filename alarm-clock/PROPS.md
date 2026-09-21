# Alarm Clock — property contract (v1)

All props appear in the Framer properties panel as **grouped objects** with descriptions.  
Types are TypeScript-ish; map to Framer `addPropertyControls`.

## Required behavior
Countdown from `now` (browser local or `timeZone`) to `targetDate`.  
If target invalid → show end state / fallback digits, never crash.

## Groups

### `content`
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `targetDate` | string (ISO) | `"2026-12-31T23:59:59"` | Naive → uses timeZone; Z/offset stays absolute |
| `timeZone` | string | `""` | IANA e.g. `Europe/Madrid`; empty = local |
| `showDays` / `showHours` / `showMinutes` / `showSeconds` | boolean | `true` | At least one forced on |
| `padZeros` | boolean | `true` | `01` vs `1` |
| `labels` | boolean | `true` | Unit labels under digits |
| `labelDays` … `labelSeconds` | string | Days/Hours/… | Hidden when labels off |

### `look`
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `paper` | color | `#F4F3F0` | Body; dark paper auto-tunes glass/shadow (no theme enum) |
| `ink` | color | `#0A0A0A` | Digits; labels = ink @ 50% |
| `accent` | color | `#C45C26` | Handle / feet / end rule only |
| `size` | number | `320` | Width px, clamp 160–720 |
| `showBody` | boolean | `true` | Object vs face-only |

### `motion`
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `digitMotion` | `fade` \| `flip` \| `none` | `fade` | Forced `none` on canvas static + reduced-motion |

### `end`
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `endMode` | `zeros` \| `label` \| `hide` | `label` | When countdown finished |
| `endLabel` | string | `"We're live"` | If endMode=label |

### `preview` (panel + canvas rest)
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `remaining` | string | `"02:17:45:08"` | `DD:HH:MM:SS` canvas/export rest pose |
| `exploreMore` | link | `https://www.framer.com/@builtbykern/` | **Panel only** — Explore more components |
| `madeForFramer` | link | `https://framer.link/qIg9LiG` | **Panel only** — referral; new tab |

### Events
| Prop | Notes |
|------|-------|
| `onComplete` | Once when crossing target (live only) |

## Removed
- ~~`theme`~~ — buyer sets `look.paper` + `look.ink`
- ~~`previewFreeze`~~ — static renderer freezes automatically
- ~~`affiliateCTA` on the object~~ — referral lives in **Preview → Made for Framer** (panel), not on the clock face

## Panel order
1. Content  
2. Look  
3. Motion  
4. End  
5. Preview (Explore more + Made for Framer)  
6. On Complete  

## Accessibility
- Root: `role="timer"` + `aria-live="off"`
- Respect `prefers-reduced-motion`
