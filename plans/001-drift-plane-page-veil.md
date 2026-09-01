# 001 — Route Drift Plane stills through PageVeil

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Missed opportunities + Cohesion & tokens
- **Estimated scope**: 2 files (`tmp/Page_Veil.tsx`, `tmp/Drift_Plane.tsx`) + 2 existing push scripts. No new canvas nodes.

## Problem

Clicking a still on Home Drift Plane (`RV7bjlgdh`, remote `Og5966a`) hard-cuts to `/work/:Work`. PageVeil (`D6GDbcv`) already runs the Gregor paper wash on **native `<a>` clicks** (Nav → Info/Contact). The plane never fires that path.

Desktop/tablet pan mode owns navigation on **pointerup**, then `window.location.assign`. PageVeil’s capture listener only sees `click` on `a[href]`, which the plane swallows:

```226:235:tmp/Drift_Plane.tsx
function openCardLink(href: string, newTab: boolean) {
    if (typeof window === "undefined" || !href) return
    const external = /^https?:\/\//i.test(href)
    // External URLs: always new tab — Framer Preview iframes often block same-frame assign.
    if (newTab || external) {
        window.open(href, "_blank", "noopener,noreferrer")
        return
    }
    window.location.assign(href)
}
```

```1311:1325:tmp/Drift_Plane.tsx
        if (canOpen && href) {
            const openHref = href
            const newTab = event.metaKey || event.ctrlKey
            // Pointer path owns mouse navigation; suppress the follow-up <a> click.
            suppressLinkClick.current = true
            if (clickExitEnabled && hitEl) {
                void playClickExit(hitEl).then(() => {
                    openCardLink(openHref, newTab)
                    resetAllExitShells()
                })
                return
            }
            openCardLink(openHref, newTab)
```

Home instance motion has **`clickExit: false`** (Desktop `RV7bjlgdh` and Tablet/Phone replicas). So the pointer path assigns **immediately**. The follow-up `<a>` click is `preventDefault`’d:

```1643:1653:tmp/Drift_Plane.tsx
                                    onClick={(event) => {
                                        // Pan / pointer-open already handled — don't double-navigate.
                                        if (
                                            suppressLinkClick.current ||
                                            performance.now() <
                                                linkQuietUntil.current
                                        ) {
                                            event.preventDefault()
                                            suppressLinkClick.current = false
                                            return
                                        }
```

PageVeil never starts `coverThenGo`:

```198:209:tmp/Page_Veil.tsx
        const onClick = (event: MouseEvent) => {
            if (navigatingRef.current) return
            if (isModifiedClick(event)) return
            const target = event.target
            if (!(target instanceof Element)) return
            const anchor = target.closest("a[href]")
            if (!(anchor instanceof HTMLAnchorElement)) return
            const href = internalHref(anchor)
            if (!href) return
            event.preventDefault()
            coverThenGo(href)
        }
```

If someone later turns **Click Exit** on, it is worse: `playClickExit` waits ~504–634ms (`CLICK_EXIT_SCALE_DUR = 1.8 * 0.28`, sibling delay up to `0.13s`) scaling the focused card to **`scale(0.4)`** then still `location.assign`s with no wash. That stacks a second exit on a page transition and uses a near-`scale(0)` invert. Do not use Click Exit as the page story.

Phone snap mode skips pointer handlers (`onPointerDown` returns when `useSnapMode`), so native `<a>` clicks can already hit PageVeil. Desktop plane is the hole.

## Target

One page-transition story, same as Nav → Info:

- Paper wash `rgb(246, 243, 238)`
- Backdrop blur **12px** (cap 20)
- Duration **490ms**
- Curve **`cubic-bezier(0.5, 0, 0.5, 1)`** (already `EASE` in PageVeil — Gregor `--cubic-2`; do not swap to `--ease-out`)
- Hold **100ms** on the incoming page before dissolve
- Nav stays above (veil z-index 20, Nav 30)
- Reduced motion: skip wash, `location.assign` immediately (already in `coverThenGo`)
- Same-origin stills (paths like `/work/salt-light`) go through PageVeil
- `target=_blank` / `http(s):` external / modifier-click: keep `window.open`, no veil
- Do **not** `await playClickExit` before same-origin navigation. The veil covers the plane; a scale-to-0.4 group exit is a second, slower story. Leave `playClickExit` in the file for the Click Exit control, but **do not call it** on the same-origin open path (pointerup or keyboard `<a>` click). External new-tab may still run Click Exit if the control is on (this page stays).

Same-origin open must become:

1. Dispatch cancelable `CustomEvent` `"halden:veil-navigate"` on `window` with `detail: { href }` (`href` absolute or path; PageVeil resolves with `new URL(href, location.href)`).
2. PageVeil listener: `preventDefault()`, then existing `coverThenGo(resolvedHref)`.
3. If the event is **not** canceled (veil not mounted), `openCardLink` falls back to `window.location.assign(href)` so Marketplace/demo without PageVeil still works.

Do not add a second overlay. Do not change blur/duration/paper on canvas instances (`NTEyuOtv3` and replicas already set).

## Repo conventions to follow

- Halden Framer session **always `-s 2`**. Rebind if needed:
  `node scripts/framer/session.mjs --url "https://framer.com/projects/Higher-Beet--k5nCTheGrijbFstHsY31-cYfgu" --name "Halden"`
- Push PageVeil: `tmp/push-page-veil.cjs` → remote `D6GDbcv` (`Page_Veil.tsx`).
- Push Drift Plane: `tmp/push-drift-plane.cjs` → remote `Og5966a`.
- Cursor-only. Do **not** publish. Do **not** `startConversation`.
- Static renderer: freeze in-place, same tree (`docs/projects/STATIC_RENDERER.md`). No listeners / no veil animation when `useIsStaticRenderer()`.
- Framer remaps control titles: PageVeil props are `paper` / `blur` (not `paperColor` / `blurAmount`).
- Exemplar for the wash (do not restyle): `tmp/Page_Veil.tsx` `coverThenGo` (lines 134–157) and overlay layers (backdrop-filter + paper opacity, not whole-layer opacity).
- House UI ease `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` is for **UI** under 300ms. This is a **page** transition; keep PageVeil’s `cubic-bezier(0.5, 0, 0.5, 1)` / 490ms.

## Steps

1. **`tmp/Page_Veil.tsx`** — next to the `click` listener in the live `useEffect` (the one that already calls `coverThenGo`), add:

```ts
const onVeilNavigate = (event: Event) => {
    const custom = event as CustomEvent<{ href?: string }>
    const raw = custom.detail?.href
    if (!raw) return
    let resolved: string
    try {
        resolved = new URL(raw, window.location.href).href
    } catch {
        return
    }
    const next = new URL(resolved)
    if (next.origin !== window.location.origin) return
    event.preventDefault()
    coverThenGo(resolved)
}
window.addEventListener("halden:veil-navigate", onVeilNavigate)
```

Remove the listener in that effect’s cleanup. Event name is exactly `halden:veil-navigate`. `coverThenGo` already no-ops if `navigatingRef.current` is true (no double-assign).

2. **`tmp/Page_Veil.tsx`** — do not change `EASE`, default duration `490`, default blur `12`, paper `#F6F3EE`, z-index `20`, portal, or static freeze.

3. **`tmp/Drift_Plane.tsx` — `openCardLink`** — after the `newTab || external` early return, before `location.assign`:

```ts
if (typeof window !== "undefined") {
    const veilEvent = new CustomEvent("halden:veil-navigate", {
        detail: { href },
        cancelable: true,
    })
    window.dispatchEvent(veilEvent)
    if (veilEvent.defaultPrevented) return
}
window.location.assign(href)
```

Keep the external / new-tab `window.open` branch unchanged.

4. **`tmp/Drift_Plane.tsx` — pointer `endDrag` (desktop plane)** — when `canOpen && href` and **not** `newTab`:
   - Set `suppressLinkClick.current = true` as today.
   - Call `openCardLink(openHref, false)` **without** `await playClickExit`.
   - `resetHitEl(hitEl)` immediately (or after dispatch); do not leave a half-scaled card under the wash.
   - If `newTab` is true, keep today’s Click Exit-then-open behavior if `clickExitEnabled` (this page stays).

5. **`tmp/Drift_Plane.tsx` — `<a onClick>`** — when `clickExitEnabled` and the click is **not** suppressed:
   - If modifier / `target=_blank` / `http(s):` external: keep `preventDefault` + `playClickExit` then `openCardLink` (new tab).
   - If same-origin work path: `preventDefault` only if you must stop native navigation; call `openCardLink(item.link, false)` **without** waiting on `playClickExit`. Native navigation must not race: either preventDefault + `openCardLink` (veil event) **or** let the native click bubble to PageVeil’s capture listener — **not both**. Preferred: `preventDefault` + `openCardLink` so pointer and keyboard share one function.

6. Push both remotes (`tmp/push-page-veil.cjs`, `tmp/push-drift-plane.cjs`). Typecheck must be empty. Do not insert new PageVeil instances (already on `/` `NTEyuOtv3` + T/P replicas).

7. Verify:

```
node scripts/framer/verify.mjs -s 2 --page /
```

Expect `ok: true`. Do not publish.

## Boundaries

- Do NOT change Drift Plane pan/rAF physics, snap mode, CMS Slot scrape, or `clickExit` **control default** (leave the boolean in the panel).
- Do NOT turn Home `clickExit` on to “fake” a page transition.
- Do NOT change Series Stills, Logo_Menu_Roll, Nav z-index, or PageVeil canvas controls (paper/blur/delay/duration).
- Do NOT add GSAP or a second overlay.
- Do NOT use `scale(0)` or keep `scale(0.4)` on the same-origin path.
- Do NOT swap PageVeil to `cubic-bezier(0.23, 1, 0.32, 1)` in this plan.
- If `openCardLink` / PageVeil listeners differ from this commit, STOP and report.

## Verification

- **Mechanical**: both `typecheck({ strict: true })` empty; `node scripts/framer/verify.mjs -s 2 --page /` → `ok: true`.
- **Feel check** (Framer Preview **Play**, not stale `higher-beet-425294.framer.app` until publish):
  - Pan the plane, release without exceeding 8px slop, on a CMS still → paper wash + blur 12, ~490ms, then Work detail dissolves (100ms hold then 490ms). Nav wordmark stays sharp.
  - DevTools Animations at 10%: wash opacity and backdrop-filter move together; no card scale-to-0.4 before the wash.
  - Click Nav → Info: same wash (must not double-cover or skip).
  - Modifier-click a still: new tab, no wash on this page.
  - `prefers-reduced-motion`: assign with no blur/wash; plane does not scale-exit.
  - Phone snap (≤390): still → work still washes (native `<a>` or shared `openCardLink`).
- **Done when**: desktop plane still → `/work/salt-light` uses the same veil as Info, with no extra click-exit wait, and pan-to-scroll still does not accidentally navigate (`CLICK_SLOP` 8 / `LINK_COOLDOWN_MS` 900 unchanged).
