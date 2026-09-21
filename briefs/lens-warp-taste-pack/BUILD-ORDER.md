# BUILD-ORDER — Lens Warp

Cursor executes in this order. folio = prompts only. No Framer Agent heavy. No publish.

1. **Plane** — Full-bleed single image + `backgroundColor` edge fill (`#F4F3F0` default).
2. **Warp** — Radial shader: `distortionStrength`, `radius`, `zoom` (neg = pincushion, pos ≈ barrel).
3. **Pointer** — `followPointer` updates lens center; `prefers-reduced-motion` → center/static, no continuous follow.
4. **Optional optics** — Low `aberration`, soft `gloss`, optional `verticalScale`.
5. **Optional lag** — `inertia` / `viscosity` calm only (not bounce-house).
6. **Props** — Lean panel per `PROPS.md` order. Do not expose DialKit / 9-slot / export / layout scaffolding.
7. **Demo** — Neutral BBK-safe still (`CONTENT-DEMO.md`). Not Stefan grid set.
8. **Affiliate sibling** — Optional preview CTA → `https://framer.link/builtbykern` new tab.
9. **Proof** — Rest still + published-preview clip (pointer warp). Then ACCEPTANCE → VERIFY. **VERIFY BLOCKED until clip path exists.** STOP for Noel. No Marketplace publish.

## Out of order = FAIL
- Shipping DialKit / scaffold as product
- SoftAsh / particles
- Fat prop panel before warp works
