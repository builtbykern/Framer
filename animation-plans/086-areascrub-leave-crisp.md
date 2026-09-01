# 086 — Area Scrub: crisp leave (no sticky half-opacity linger)

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Purpose & physicality (asymmetric dismiss)
- **Estimated scope**: 1 file (`code-components/AreaScrub.tsx`), ~40 lines

## Problem

On pointer leave, chrome stays semi-visible (opacity 0.45 / 0.5) for **420ms** before fading out. Feels sticky, not crisp fintech dismiss. AUDIT: asymmetric timing — system response should snap/short; long half-ghost linger is wrong purpose.

```tsx
/* code-components/AreaScrub.tsx:453–462 — current */
lingerTimer.current = window.setTimeout(() => {
  startTransition(() => setLingerChrome(false))
  lingerTimer.current = null
}, 420)

/* ~639–644 — current leave appearance */
opacity: chromeVisible
  ? scrubbing || canvasPeek ? 1 : 0.45
  : 0
```

## Target

1. **Leave linger ≤ 200ms** (timer), then `lingerChrome = false`.
2. While lingering, opacity **≤ 0.2** (or better: animate straight to **0** with duration **180–200ms** and drop the half-visible plateau entirely).

Preferred (crisper):

```tsx
/* target — no plateau */
const endScrub = () => {
  startTransition(() => setScrubbing(false))
  // keep lingerChrome true only to allow opacity transition to 0 while mounted
  startTransition(() => setLingerChrome(true))
  if (lingerTimer.current != null) window.clearTimeout(lingerTimer.current)
  lingerTimer.current = window.setTimeout(() => {
    startTransition(() => setLingerChrome(false))
    lingerTimer.current = null
  }, 200)
}

const chromeTransition = chromeSnap
  ? { duration: 0 }
  : {
      opacity: {
        duration: scrubbing ? 0.14 : 0.18,
        ease: [0.23, 1, 0.32, 1],
      },
      // transform scale handled in plan 084 if present
    }

// when !scrubbing && !canvasPeek → opacity 0 (even if lingerChrome briefly true for mount)
opacity: scrubbing || canvasPeek ? 1 : 0
```

If mount must stay for exit transition: `chromeVisible = canvasPeek || scrubbing || lingerChrome` but **always animate opacity to 0 when !scrubbing && !canvasPeek**.

Enter stays **0.14s** ease-out. Leave **0.18s** to 0.

## Repo conventions to follow

- `CHROME_EASE = [0.23, 1, 0.32, 1]`
- UI exit budget ≤ 300ms (AUDIT)
- Re-enter clears linger timer (already)

## Steps

1. Change linger timeout **420 → 200**.
2. Remove leave plateau opacities `0.45` / `0.5` — use `0` when not scrubbing/peek.
3. Set leave opacity duration to **0.18**; enter remains **0.14**.
4. Push and feel-check.

## Boundaries

- Do NOT remove chrome mount-for-exit entirely if it causes pop (keep short linger mount)
- Do NOT change scrub spring (083) or label throttle (085)
- Do NOT add idle pulse

## Verification

- **Mechanical**: push clean; verify green
- **Feel check**:
  - Leave: chrome gone in ≤200ms, no long ghost
  - Re-enter during leave: interruptible, chrome returns clean
  - Peek (static): still full opacity mid-scrub still
  - Animations panel 10%: leave is short ease-out to 0
- **Done when**: No 420ms half-opacity linger; leave feels crisp
