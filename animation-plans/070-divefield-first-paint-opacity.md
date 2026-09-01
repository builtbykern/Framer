# 070 — Dive Field: first WebGL paint opacity settle

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Missed opportunities / Preventing a jarring change
- **Estimated scope**: 1 file — `code-components/DiveField.tsx`
- **Audit**: find-animation-opportunities Dive Field 2026-08-04 #1

## Problem

On live (non-static) mount, the canvas stays empty until WebGL `boot` + first `draw`, then the full typographic stack appears in one frame — a brief blank→dense flash on Preview enter / remount.

Evidence: `boot` (~1117+) then `kick()` → `draw` with no opacity bridge on root/canvas (`DiveField.tsx` return ~1260+ canvas style is opaque immediately).

## Target

Exact values (AUDIT.md ease-out + ≤300ms UI budget):

| State | Value |
| --- | --- |
| Initial (live only) | canvas (or root) `opacity: 0` |
| After first successful `draw` | `opacity: 1` |
| Transition | `opacity 200ms cubic-bezier(0.23, 1, 0.32, 1)` |
| `prefers-reduced-motion: reduce` **and** `respectReducedMotion` | `opacity` only, **120ms** same curve — or set opacity `1` immediately if reduce is already true at first paint |
| Static / Canvas renderer | **No** fade — keep current instant static stack |

Implementation sketch (prefer canvas element so focus ring on root is unaffected):

```tsx
// state
const [revealed, setRevealed] = useState(false)
const reduceMotion = reduced && motion.respectReducedMotion

// canvas style (live):
opacity: isStatic ? 1 : revealed ? 1 : 0,
transition: isStatic
  ? undefined
  : `opacity ${reduceMotion ? 120 : 200}ms cubic-bezier(0.23, 1, 0.32, 1)`,

// after first draw in loop/draw once:
if (!revealedRef.current) {
  revealedRef.current = true
  // schedule setState via queueMicrotask / rAF to avoid setState mid-draw if needed
  setRevealed(true)
}
```

Use a `revealedRef` so only the **first** paint triggers reveal; do not re-fade on every kick.

**Do not** animate `transform` on the full-bleed field.

## Repo conventions to follow

- `useIsStaticRenderer()` already gates static path — fade is live-only
- RM already via `matchMedia` + `respectReducedMotion` — compose, don’t invent a second MQ
- Push: `node scripts/framer/push-divefield.mjs`
- Session: `7mzOTQA5ZdZVnu6ZH54e` / `"Dive Field"`

## Steps

1. Pin session:
   ```bash
   node scripts/framer/session.mjs --id 7mzOTQA5ZdZVnu6ZH54e --name "Dive Field"
   ```
2. Add `revealed` state + `revealedRef`; set true once after first `draw` when `!isStatic`.
3. Apply canvas opacity + transition as above.
4. On engine effect cleanup / remount, reset reveal so remount can fade again.
5. Push → `typeErrors: []`; `node scripts/framer/verify.mjs`.

## Boundaries

- Do NOT change damping, sway, autoScroll, shaders, or Snap (removed)
- Do NOT add framer-motion / packages
- Do NOT fade static Canvas export
- Do NOT block wheel during fade (opacity only; interaction OK at opacity 0–1)
- Do NOT expand into texture rebuild crossfade (plan **071**)
- If a reveal already exists at stamp, STOP and report

## Verification

- **Mechanical**: push + verify green
- **Feel check**: Preview remount / hard refresh — stack eases in ~200ms, no empty flash; spam wheel during fade still works; DevTools emulate `prefers-reduced-motion: reduce` → ≤120ms or instant; Canvas/static still instant
- **Done when**: first live paint never hard-cuts from blank to full density at default motion prefs
