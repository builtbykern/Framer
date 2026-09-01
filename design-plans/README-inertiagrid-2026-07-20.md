# InertiaGrid UI plans (2026-07-20)

Source: `Kern_InertiaGrid` / Framer `PBghPP85VH1cuE7BNtzx` / SoT `state/InertiaGrid.tsx` @ v1.1.0.  
Skill: `improve-ui` — **executed**.  
Motion track: [`plans/README.md`](../plans/README.md) (032–039 DONE).

| Order | Plan | Finding | Status |
| --- | --- | --- | --- |
| 1 | [Remove minHeight 600px](./2026-07-20-inertiagrid-remove-minheight.md) | U3 | DONE |
| 2 | [Canvas placeholder parity](./2026-07-20-inertiagrid-canvas-placeholder-parity.md) | U1 | DONE |
| 3 | [Breakpoint control copy](./2026-07-20-inertiagrid-breakpoint-copy.md) | U2 | DONE |

### Applied order

**U3 → U1 → U2** (shipped together with motion pack in v1.1.0).

### Essence constraints

- Do not change Drift / Repel / Glitch or physics math
- Do not invent new layout breakpoints to match old copy — copy follows runtime
- Canvas remains static (no physics); only placeholder styling parity
- Push via harness; `node scripts/framer/verify.mjs` before “done”
- Do **not** publish Marketplace listing without user approval
