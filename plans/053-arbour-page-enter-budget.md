# 053 — Unify Arbour first-paint page enters (200–280ms)

- **Status**: DONE (canvas 2026-08-12; unpublished)
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Purpose & frequency / cohesion (page enter)
- **Estimated scope**: Canvas `appearEffect` on first-paint heroes only (Desktop primaries; fix T/P replicas if they still dump the old transition)

## Problem

Every Nav click **replays** a long page-enter. That is list-navigation frequency, not a rare cinematic.

Current Desktop appears (serialize 2026-08-12, `tmp/motion-harness-2026-08-12.json`):

| Page | Node | id | Current |
|------|------|-----|---------|
| `/` | Hero | `iq0rlFlTE` | `onInView` y=32 `spring-duration 0.75s 0.12 0.06s` |
| `/contact` | Enquiry Kicker | `TWVNilHRn` | `onMount` y=10 `tween 0.16,1,0.3,1 0.55s 0.22s` |
| `/contact` | Enquiry Display | `R80e8PwNu` | `onMount` y=18 `tween 0.16,1,0.3,1 0.75s 0.34s` |
| `/contact` | Direct Enquiry | `uONXSHosa` | `onMount` y=12 `tween 0.16,1,0.3,1 0.55s 0.52s` |
| `/contact` | Hero Entrance Media | `WLSMm5iy1` | `onMount` y=0 `tween 0.16,1,0.3,1 1.05s 0s` |
| `/neighbourhoods` | Neighbourhoods Hero | `ycUqIc8V3` | `onMount` y=20 `tween 0.22,1,0.36,1 0.85s 0s` |
| `/neighbourhoods` | Hero Kicker | `mGNFNlJAN` | `onMount` y=12 `tween 0.22,1,0.36,1 0.6s 0s` |
| `/neighbourhoods` | Hero Title | `n9ay7tOtM` | `onMount` y=28 `tween 0.22,1,0.36,1 0.75s 0.06s` |
| `/neighbourhoods` | Hero Bottom | `KgtJlnIFG` | `onMount` y=16 `tween 0.22,1,0.36,1 0.7s 0.12s` |
| `/neighbourhoods` | Hero Subhead | `rWmr0qn1F` | `onMount` y=16 `tween 0.22,1,0.36,1 0.7s 0.12s` |
| `/notes` | Journal Kicker | `Y2Bx8WkiS` | `onMount` y=12 `tween 0.22,1,0.36,1 0.6s 0s` |
| `/notes` | Display Title | `xEORYedqg` | `onMount` y=28 `tween 0.22,1,0.36,1 0.75s 0.06s` |
| `/notes` | Journal Deck Row | `q0U1vQI7K` | `onMount` y=16 `tween 0.22,1,0.36,1 0.7s 0.12s` |
| `/properties` | Hero Kicker | `H0pCvPI36` | `onInView` **replay true** y=16 `spring-duration 0.7s 0.1 0s` |
| `/properties` | Hero Meta Count | `cR5cTWroe` | `onInView` **replay true** y=0 `spring-duration 0.7s 0.1 0.15s` |
| `/about` | Beat 2 — Cinematic Image | `SbkA8xJAz` | `onMount` y=20 `tween 0.22,1,0.36,1 0.85s 0s` (fires on load even if below fold) |
| `/404` | Error Heading | `ZodqIH8_r` | `onMount` y=24 `tween 0.22,0.61,0.36,1 0.7s 0.1s` |
| `/properties/:slug` | Hero Media | `TanN7b8Lp` | `onMount` y=0 `tween 0.23,1,0.32,1 0.45s 0s` |
| `/properties/:slug` | Chapter Intro | `ubrig7P0R` | `onMount` y=16 `tween 0.23,1,0.32,1 0.4s 0.08s` |
| `/notes/:slug` | Article Hero | `TYvLnLN5L` | `onInView` **replay true** y=24 `spring-duration 0.8s 0.08 0.05s` |
| `/notes/:slug` | Journal Hero Image | `rZDvGuaZD` | `onInView` **replay true** y=20 `spring-duration 0.8s 0.08 0.05s` |

`plans/003-unify-cinematic-appear.md` asked for **0.85s** cinematic — **SUPERSEDED**. Do not apply 003.

## Target

One Arbour enter token (AUDIT.md ease-out + UI ≤300ms + stagger 30–80ms):

**Layer A — kicker / meta (first)**

```
appearEffect.trigger="onMount"
appearEffect.replay="false"
appearEffect.threshold="0"
appearEffect.enter.opacity="0"
appearEffect.enter.x="0"
appearEffect.enter.y="12"
appearEffect.enter.scale="1"
appearEffect.enter.rotate="0"
appearEffect.enter.transition="tween 0.23,1,0.32,1 0.2s 0s"
appearEffect.enter.stagger="0s"
```

**Layer B — title / display / chapter (60ms later)**

Same as A except `y="16"` and `transition="tween 0.23,1,0.32,1 0.24s 0.06s"`

**Layer C — deck / subhead / enquiry (80ms later)**

Same as A except `y="16"` and `transition="tween 0.23,1,0.32,1 0.24s 0.08s"`

**Layer M — hero media (opacity only, no travel)**

Same as A except `y="0"` and `transition="tween 0.23,1,0.32,1 0.24s 0s"`

Never `scale(0)`. Never delay ≥ 0.12s. Never duration > **0.28s** on these nodes.

**Beat 2** (`SbkA8xJAz`): not a first-screen hero. Use **onInView**, `replay=false`, Layer B values (`y=16`, `0.24s 0s` delay 0 — single layer).

## Repo conventions to follow

- DSL exemplar (same tween family already on Footer):  
  `SET <id> appearEffect.trigger="onMount" appearEffect.replay="false" appearEffect.enter.opacity="0" appearEffect.enter.y="16" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.24s 0.06s";`
- Session:

```bash
node scripts/framer/session.mjs --id CmRyHJKPrPE6BZhC6d4S --name Arbour
```

- CMS `applyChanges` paths: `/properties/:Properties` and `/notes/:Journal` (not `:slug`).
- Primary Desktop IDs above; after SET, serialize Tablet/Phone replicas (`qjv2S9Wpa…` / `jEM0wBo2v…` style prefixes). If replica still has the old `1.05s` / `0.52s` string, SET the replica id too.

## Steps

1. Re-bind Arbour. Confirm project id `CmRyHJKPrPE6BZhC6d4S`.
2. `/contact` (`pagePath: "/contact"`):
   - `TWVNilHRn` → Layer A
   - `R80e8PwNu` → Layer B
   - `uONXSHosa` → Layer C
   - `WLSMm5iy1` → Layer M
3. `/neighbourhoods`:
   - `mGNFNlJAN` → Layer A
   - `n9ay7tOtM` → Layer B
   - `KgtJlnIFG` and `rWmr0qn1F` → Layer C
   - `ycUqIc8V3` → Layer M (hero frame; y=0 opacity)
4. `/notes`:
   - `Y2Bx8WkiS` → Layer A
   - `xEORYedqg` → Layer B
   - `q0U1vQI7K` → Layer C
5. `/` (`pagePath: "/"`): `iq0rlFlTE` Hero → Layer B (`onMount`, not onInView).
6. `/properties`: `H0pCvPI36` → Layer A; `cR5cTWroe` → Layer A but `y="0"` and delay `0.06s` (`tween 0.23,1,0.32,1 0.2s 0.06s`), **replay false**.
7. `/about`: `SbkA8xJAz` → onInView, replay false, Layer B with delay 0 (`0.24s 0s`).
8. `/404`: `ZodqIH8_r` → Layer B delay 0.
9. `/properties/:Properties`: `TanN7b8Lp` → Layer M; `ubrig7P0R` → Layer B.
10. `/notes/:Journal`: `TYvLnLN5L` → Layer B, **replay false**; `rZDvGuaZD` → Layer M, **replay false**.
11. Serialize each listed id; assert `transition` contains `0.2s` or `0.24s` and does **not** contain `1.05s`, `0.85s`, `0.75s`, `0.52s`, `0.34s`.
12. `node scripts/framer/verify.mjs --page /contact` then `--page /` — no blocking errors.

## Boundaries

- Do NOT change Footer appears (`… 0.4s` onInView).
- Do NOT change below-fold: Home Territories/Portfolio/Process/Journal; Contact `f6WUp6SN5` / `puCbB_BBh` / `liyenGbOL`; Neighbourhoods `km7dUqZI9`; Notes `oaOdfjsxS` / `Fe5WKPsRA`; About Beat 3+; notes slug `lNUCFBhko` / `cIncylbTv`.
- Do NOT change hover (`scale 1.04`, Discovery `y -4px`).
- Do NOT change Home Hero Image `styleTransformEffect` ±100px (`U_Lsvi_pr`).
- Do NOT apply plan 003’s 0.85s recipe.
- Do NOT add Page Effects here (plan **052**).
- Do NOT publish unless asked.

## Verification

- **Mechanical**: dump `appearEffect.enter.transition` for every id in the table — duration ≤ 0.28s, delay ≤ 0.08s, `replay` false, `scale` 1.
- **Feel check**:
  - Hard-refresh `/contact`: kicker then title then enquiry in **< 350ms** total; media does not linger 1s.
  - Click Nav Home → Neighbourhoods → Notes → Properties. Enters should feel like **the same product**, not three different tempos.
  - Scroll away and back on `/properties` hero: kicker must **not** replay (`replay false`).
  - Animations panel 10%: opacity + translateY ≤ 16px; no scale.
  - `prefers-reduced-motion`: movement drops; opacity may remain (Framer canvas limitation — do not add a code gate).
- **Done when**: all listed nodes match the layer table; below-fold appears untouched.

## Suggested motion values (AUDIT.md)

- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` → Framer `tween 0.23,1,0.32,1`
- UI animations **under 300ms** → **0.20s / 0.24s**
- Stagger **30–80ms** → **0.06s / 0.08s**
- Entering: ease-out; never ease-in (`0.42,0,0.58,1` on Manifesto Headline is out of scope — do not “fix” it here)
- No `scale(0)`; start scale **1**
