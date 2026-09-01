# 073 — Dive Field: cache uniform locations + color parse

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (boot + `draw`)
- **Audit finding**: improve-animations Dive Field 2026-08-04-restore #2
- **Supersedes craft of**: 066 + template 149 — missing after restore

## Problem

Every visible layer every frame:

1. Calls `gl.getUniformLocation(eng.textProg, "…")` for ~20 uniforms.
2. Calls `setVec3(…, parseHex(lk.textColor))` and `parseHex(accent)` (string parse + location lookup).

Evidence (`code-components/DiveField.tsx` ~920–984):

```tsx
gl.uniform1i(gl.getUniformLocation(eng.textProg, "uTex"), 0)
gl.uniform2f(gl.getUniformLocation(eng.textProg, "uScale"), w, h)
// … repeated getUniformLocation for every uniform …
setVec3(gl, eng.textProg, "uTextColor", parseHex(lk.textColor))
setVec3(gl, eng.textProg, "uHeadingColor", parseHex(lk.accent || PRODUCT_ACCENT))
```

`setVec3` (~lookup by name each call) must be updated or replaced to take a cached `WebGLUniformLocation | null`.

## Target

1. Add `TextUniforms` type + `cacheTextUniforms(gl, prog)` listing every uniform name used in `draw` (including `uTextColor`, `uHeadingColor`).
2. Extend `Engine` with `uniforms: TextUniforms` and `aPos: number` (cache `getAttribLocation` for `aPos` at boot too).
3. In `draw`, use only `eng.uniforms.*` — zero `getUniformLocation` in the hot path.
4. Cache parsed RGB:

```ts
let textColorKey = ""
let textRgbCached: [number, number, number] = [1, 1, 1]
let accentKey = ""
let accentRgbCached: [number, number, number] = [1, 1, 1]
// each draw, before layer loop:
const tc = lk.textColor
if (tc !== textColorKey) {
    textColorKey = tc
    textRgbCached = parseHex(tc)
}
const ac = lk.accent || PRODUCT_ACCENT
if (ac !== accentKey) {
    accentKey = ac
    accentRgbCached = parseHex(ac)
}
```

5. Upload with `gl.uniform3f(U.uTextColor, …)` / `U.uHeadingColor` from caches.

## Repo conventions to follow

- Keep `parseHex` helper; only call when string changes.
- Boot already links program (~1030) — cache immediately after `linkProgram` succeeds.
- Push: `node scripts/framer/push-divefield.mjs`.

## Steps

1. Add `TextUniforms` + `cacheTextUniforms` near other types/helpers.
2. Extend `Engine`; in `boot`, after program link, assign `uniforms` and `aPos`.
3. Rewrite `draw` uploads to use `const U = eng.uniforms`.
4. Add color-key caches in the WebGL effect closure; refresh in `draw`.
5. Push + verify.

## Boundaries

- Do NOT change shader source or blend mode in this plan.
- Do NOT change Look defaults.
- Do NOT add npm deps.
- If uniforms are already cached on `Engine`, STOP and report.

## Verification

- **Mechanical**: push `typeErrors: []`; verify ready; Preview still paints layers.
- **Feel check**: dive feel identical; prop color change still updates glyphs.
- **Done when**: no `getUniformLocation` / `parseHex` inside the per-layer loop.
