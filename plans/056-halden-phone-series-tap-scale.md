# 056 — Phone Series card tap scale 0.97

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: Canvas Frame Series only (no new code file)
- **Depends**: —
- **Project**: Halden (`k5nCTheGrijbFstHsY31`). Session **1**. Rebind Higher-Beet URL; `getProjectInfo().name === "Halden"`.

## Problem

Phone Home Series (`XQdaxU3Os`, replica `nyI5jW7lAXQdaxU3Os`) is the collection Frame that routes to `/work/:Work`. Tap has no press scale. Frequency is occasional (open a series), so 160ms press is in budget. This is a **canvas** link, not a React `whileTap` target.

Do not put `whileTap` on `Series_Stills` — that would scale prints only and miss taps on the title.

## Target

Framer `tapEffect` on the Series Frame, copied from the 404 Home link exemplar (`tmp/apply-404-recovery.js` HomeLink):

```
tapEffect.opacity="1"
tapEffect.x="0px"
tapEffect.y="0px"
tapEffect.scale="0.97"
tapEffect.skewX="0deg"
tapEffect.skewY="0deg"
tapEffect.rotate="0deg"
tapEffect.transition="tween 0.23,1,0.32,1 0.16s 0s"
```

Exact values (AUDIT.md press band 100–160ms, scale 0.95–0.98, `--ease-out`):

| Prop | Value |
| --- | --- |
| scale | **0.97** |
| opacity / x / y | **1** / **0px** / **0px** |
| duration | **0.16s** |
| ease | **0.23, 1, 0.32, 1** |
| delay | **0s** |

No hoverEffect. No appearEffect on this node. Transform only (scale); do not animate width/height/top/left.

## Repo conventions to follow

- Exemplar: `tmp/apply-404-recovery.js` line 33 — `tapEffect.scale="0.97"` + `tapEffect.transition="tween 0.23,1,0.32,1 0.16s 0s"` on a linked RichText.
- Series already has `link.href="/work/:Work"` and `link.collectionItem="var(--variable-Bte5utJ62)"` (`tmp/halden-buyer-work-list.cjs`). Preserve both.
- PageVeil still owns the route wash — do not change veil timing.

## Steps

1. Session 1, Halden confirmed. `pagePath: "/"`.
2. `applyChanges`:

   ```
   SET XQdaxU3Os tapEffect.opacity="1" tapEffect.x="0px" tapEffect.y="0px" tapEffect.scale="0.97" tapEffect.skewX="0deg" tapEffect.skewY="0deg" tapEffect.rotate="0deg" tapEffect.transition="tween 0.23,1,0.32,1 0.16s 0s";
   ```

3. If phone replica does not inherit, same SET on `nyI5jW7lAXQdaxU3Os`.
4. getNode/serialize Series: `tapEffect.scale` is 0.97; `link.href` still `/work/:Work`; `collectionItem` still `var(--variable-Bte5utJ62)`.
5. `node scripts/framer/verify.mjs -s 1 --page "/"`.

If `tapEffect` lint-fails, STOP and report the error. Do not invent a React wrapper around the Collection List. Do not add `whileTap` inside `tmp/Series_Stills.tsx`.

## Boundaries

- Do NOT SET tapEffect on Work Card `gSGwySyKV` (desktop plane).
- Do NOT SET hoverEffect (phone false hover).
- Do NOT retune Logo Menu Roll, PageVeil, Nav height.
- Do NOT change Series layout/gap/children or CMS binds.
- Do NOT publish.

## Verification

- **Mechanical**: verify.mjs `/` `{ "ok": true }`; link + collectionItem unchanged.
- **Feel check** (Preview Play, Phone ~390, motion on):
  - Press-and-hold a series row: whole card (title + stills) scales to 0.97; release returns with ease-out.
  - Interrupt: press then drag off — must not stick scaled.
  - DevTools 10% playback: ~160ms.
  - `prefers-reduced-motion`: Framer should drop the scale; if it still scales, STOP and report (do not patch PageVeil).
  - Click still reaches `/work/:slug` (Play). Canvas static: no looping press animation.
- **Done when**: tapEffect 0.97 / 160ms on Series; Play still navigates; veil/roll untouched. Not published.
