# 066 — Dive Field: cache WebGL uniform locations

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (hot `draw` path + boot)
- **Audit finding**: improve-animations Dive Field 2026-08-03 #2

## Problem

Every visible layer every frame calls `gl.getUniformLocation(eng.textProg, "…")` for ~18 uniforms, plus `setVec3` which looks up by name again. That is main-thread waste on a Marketplace WebGL product already painting multiple textured quads.

Evidence (`code-components/DiveField.tsx`):

```tsx
// ~569–577 — current setVec3 looks up every call
function setVec3(
    gl: WebGLRenderingContext,
    prog: WebGLProgram,
    name: string,
    rgb: [number, number, number]
) {
    const loc = gl.getUniformLocation(prog, name)
    if (loc) gl.uniform3f(loc, rgb[0], rgb[1], rgb[2])
}

// ~984–1048 — current draw (pattern; many lines)
gl.uniform1i(gl.getUniformLocation(eng.textProg, "uTex"), 0)
gl.uniform2f(gl.getUniformLocation(eng.textProg, "uScale"), w, h)
// … uPlanePos, uRot, uAspect, uFov, uCam, uTime, uVel, uFog, uDiss, uAct,
//    uFar, uSeed, uRgbShift, uRgbShiftVel, uWarmth, uWobble, uDepthTint …
setVec3(gl, eng.textProg, "uTextColor", parseHex(lk.textColor))
setVec3(gl, eng.textProg, "uHeadingColor", parseHex(lk.accent || PRODUCT_ACCENT))
```

## Target

1. After `linkProgram` succeeds in `boot`, build a location map once:

```ts
type TextUniforms = {
    uTex: WebGLUniformLocation | null
    uScale: WebGLUniformLocation | null
    uPlanePos: WebGLUniformLocation | null
    uRot: WebGLUniformLocation | null
    uAspect: WebGLUniformLocation | null
    uFov: WebGLUniformLocation | null
    uCam: WebGLUniformLocation | null
    uTime: WebGLUniformLocation | null
    uVel: WebGLUniformLocation | null
    uFog: WebGLUniformLocation | null
    uDiss: WebGLUniformLocation | null
    uAct: WebGLUniformLocation | null
    uFar: WebGLUniformLocation | null
    uSeed: WebGLUniformLocation | null
    uRgbShift: WebGLUniformLocation | null
    uRgbShiftVel: WebGLUniformLocation | null
    uWarmth: WebGLUniformLocation | null
    uWobble: WebGLUniformLocation | null
    uDepthTint: WebGLUniformLocation | null
    uTextColor: WebGLUniformLocation | null
    uHeadingColor: WebGLUniformLocation | null
}

function cacheTextUniforms(
    gl: WebGLRenderingContext,
    prog: WebGLProgram
): TextUniforms {
    const u = (name: string) => gl.getUniformLocation(prog, name)
    return {
        uTex: u("uTex"),
        uScale: u("uScale"),
        uPlanePos: u("uPlanePos"),
        uRot: u("uRot"),
        uAspect: u("uAspect"),
        uFov: u("uFov"),
        uCam: u("uCam"),
        uTime: u("uTime"),
        uVel: u("uVel"),
        uFog: u("uFog"),
        uDiss: u("uDiss"),
        uAct: u("uAct"),
        uFar: u("uFar"),
        uSeed: u("uSeed"),
        uRgbShift: u("uRgbShift"),
        uRgbShiftVel: u("uRgbShiftVel"),
        uWarmth: u("uWarmth"),
        uWobble: u("uWobble"),
        uDepthTint: u("uDepthTint"),
        uTextColor: u("uTextColor"),
        uHeadingColor: u("uHeadingColor"),
    }
}
```

2. Store on `Engine` (extend type ~99–105): `uniforms: TextUniforms`.

3. In `draw`, use cached locs only, e.g.:

```tsx
const U = eng.uniforms
gl.uniform1i(U.uTex, 0)
gl.uniform2f(U.uScale, w, h)
gl.uniform3f(U.uPlanePos, /* same args as today */)
// …
if (U.uTextColor) gl.uniform3f(U.uTextColor, …)
if (U.uHeadingColor) gl.uniform3f(U.uHeadingColor, …)
```

4. Remove hot-path use of name-based `setVec3` for these two colors (keep or delete helper — if unused, delete to avoid dead code).

**No visual change.** Same uniform values, same order of uploads.

## Repo conventions to follow

- Zero new packages; keep raw WebGL.
- Idle rAF / `needsFrame` / `layersDirty` already shipped — do not regress (`kick` / `needsFrame` logic untouched).
- Push: `node scripts/framer/push-divefield.mjs`.

## Steps

1. Add `TextUniforms` + `cacheTextUniforms` near other WebGL helpers (above `DiveField` export).
2. Extend `Engine` with `uniforms: TextUniforms`.
3. In `boot`, after `textProg` links: `const uniforms = cacheTextUniforms(gl, textProg)` and assign on `engine`.
4. Rewrite `draw` uniform uploads to use `eng.uniforms` only — zero `getUniformLocation` inside the layer loop.
5. Delete unused `setVec3` if nothing else calls it.
6. Push + verify.

## Boundaries

- Do NOT change shaders, damping, snap, or look defaults.
- Do NOT change texture upload / rebuild path.
- Do NOT add Three.js or any dependency.
- If uniform names in `TEXT_FRAG` / `TEXT_VERT` differ from this list at stamp time, STOP and align to the shader source.

## Verification

- **Mechanical**: push → `typeErrors: []`; `verify.mjs` → `ok: true`.
- **Feel check**: Preview — wheel through layers; RGB dissolve / fog / accent ghosts must match pre-change look (side-by-side or memory). No flicker, no black frames.
- **Perf check** (optional): Chrome Performance — `getUniformLocation` should not appear per-frame in the profile for this component.
- **Done when**: grep `getUniformLocation` inside `draw` / layer loop returns **no matches**; visuals unchanged.
