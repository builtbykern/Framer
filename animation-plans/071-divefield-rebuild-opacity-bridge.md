# 071 — Dive Field: soft opacity bridge on texture rebuild (optional)

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Missed opportunities / Preventing a jarring change
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (`rebuildLayers`)
- **Audit**: find-animation-opportunities Dive Field 2026-08-04 #2
- **Depends on**: prefer after **070** (shared opacity channel); skip entirely if Preview edit-pop is not felt

## Problem

When Content layers / font change, `rebuildLayers` deletes textures and rebuilds async (`DiveField.tsx` ~699–748). The next draws can pop from empty/partial stack to new glyphs — jarring for designers editing in Framer (occasional, not end-user scroll).

## Target

Only if **070**’s canvas opacity pattern exists (or implement a dedicated `contentFade` opacity on the same canvas):

1. When `rebuildLayers` **starts** (after `texKey` miss, before deleting textures): set canvas opacity toward **0.35** (not 0 — keep spatial continuity) with  
   `transition: opacity 150ms cubic-bezier(0.23, 1, 0.32, 1)`.
2. When rebuild **finishes** (`finally` / after layers pushed): restore opacity **1** with  
   `opacity 200ms cubic-bezier(0.23, 1, 0.32, 1)`.
3. Reduced motion (`reduced && respectReducedMotion`): skip dimming — keep opacity `1` through rebuild (or 80ms max).
4. **Never** block `kick` / wheel / `needsFrame` during rebuild.
5. Do **not** use CSS `filter: blur` on the full-bleed canvas.

If feel-check shows no pop in Framer Content edits, mark plan **CANCELLED** with a one-line note — do not force the fade.

## Repo conventions to follow

- Reuse canvas opacity from **070** if present (compose: `revealed ? rebuildOpacity : 0` carefully — first paint must still work)
- Push: `node scripts/framer/push-divefield.mjs`

## Steps

1. Pin Dive Field session.
2. Feel-check first: change a layer string in Preview — if pop is mild, CANCEL and stop.
3. If pop is clear: wire rebuild start/end opacity as Target; ensure **070** reveal ref does not reset.
4. Push + verify.

## Boundaries

- Do NOT hold old WebGL textures in a second FBO unless already in codebase (out of scope)
- Do NOT reintroduce Snap / permanent idle rAF
- Do NOT publish without OK
- Do NOT add dependencies
- If **070** not shipped and this plan runs alone, implement rebuild fade without breaking first-paint (opacity floor 0.35 only during rebuild, initial mount still needs 070 or instant show)

## Verification

- **Mechanical**: verify green if code changed; or CANCELLED with note if skipped
- **Feel check**: Content body edit → brief dim then settle, no multi-second blank; scroll during rebuild still works; RM: no dimming dance
- **Done when**: either cancelled with justification, or rebuild pop is bridged ≤200ms ease-out
