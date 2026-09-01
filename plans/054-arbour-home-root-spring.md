# 054 — Align Home breakpoint spring with the rest of Arbour

- **Status**: DONE (canvas 2026-08-12; unpublished)
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 3 page-root frames on `/` (Desktop / Tablet / Phone)

## Problem

This is **not** a route transition. It is the Framer **variant / breakpoint** `transition` on the page root. Home is the only page on a different spring, so if that root ever animates (breakpoint, variant), Home will feel unlike the template.

Serialize 2026-08-12:

| Page | Breakpoint | id | `attributes.transition` |
|------|------------|-----|-------------------------|
| `/` | Desktop | `PYd9q93eW` | `spring-physics 500 60 1 0s` |
| `/` | Tablet | `wBAtV56ME` | `spring-physics 500 60 1 0s` |
| `/` | Phone | `mcL3MFzFV` | `spring-physics 500 60 1 0s` |
| `/about` Desktop | `hd9EqB_ax` | `spring-duration 0.4s 0.2 0s` |
| `/contact` Desktop | `eSIn17Npa` | `spring-duration 0.4s 0.2 0s` |
| `/properties` Desktop | `obfRB9jeb` | `spring-duration 0.4s 0.2 0s` |
| `/neighbourhoods` Desktop | `LmDrAnCZU` | `spring-duration 0.4s 0.2 0s` |
| `/notes` Desktop | `T4DtVCP3y` | `spring-duration 0.4s 0.2 0s` |
| `/404` Desktop | `P6DmPd7JZ` | `spring-duration 0.4s 0.2 0s` |
| `/properties/:slug` Desktop | `ym6hx2Otc` | `spring-duration 0.4s 0.2 0s` |
| `/notes/:slug` Desktop | `n1MGlvW2_` | `spring-duration 0.4s 0.2 0s` |

Home `spring-physics 500 60 1` is a stiffer/longer physics spring than the site token `spring-duration 0.4s 0.2 0s`.

## Target

Home D/T/P roots match the rest of Arbour **exactly**:

```
transition="spring-duration 0.4s 0.2 0s"
```

Do not invent a new spring. Do not copy AUDIT.md `{ duration: 0.5, bounce: 0.2 }` here — the **repo token** is already `0.4s 0.2`.

## Repo conventions to follow

- Exemplar: `/contact` Desktop `eSIn17Npa` already has `spring-duration 0.4s 0.2 0s`.
- Session:

```bash
node scripts/framer/session.mjs --id CmRyHJKPrPE6BZhC6d4S --name Arbour
```

- DSL:

```
SET PYd9q93eW transition="spring-duration 0.4s 0.2 0s";
SET wBAtV56ME transition="spring-duration 0.4s 0.2 0s";
SET mcL3MFzFV transition="spring-duration 0.4s 0.2 0s";
```

`pagePath: "/"`.

## Steps

1. Re-bind Arbour (`CmRyHJKPrPE6BZhC6d4S`).
2. Serialize `PYd9q93eW` — confirm current value is still `spring-physics 500 60 1 0s`. If already `spring-duration 0.4s 0.2 0s`, STOP (done).
3. `applyChanges` the three SET lines above with `{ pagePath: "/" }`.
4. Serialize the three ids — `attributes.transition` must equal `spring-duration 0.4s 0.2 0s` (string match).
5. `node scripts/framer/verify.mjs --page /`.

## Boundaries

- Do NOT change `appearEffect` (plan **053**).
- Do NOT add Page Effects (plan **052**).
- Do NOT change `transition` on `/about` or any non-Home page.
- Do NOT change Hero Image `styleTransformEffect` (`U_Lsvi_pr`).
- Do NOT publish unless asked.

## Verification

- **Mechanical**: three Home breakpoint roots dump `spring-duration 0.4s 0.2 0s`; no `spring-physics 500`.
- **Feel check**: resize preview Desktop ↔ Tablet ↔ Phone. Any root animation should match Contact/Notes, not a bouncier Home-only spring. Nav click feel is **052**, not this plan.
- **Done when**: string match on all three ids; verify.mjs not blocking.

## Suggested motion values (AUDIT.md)

- On-screen morph: ease-in-out; Arbour already encoded this as `spring-duration 0.4s 0.2 0s` site-wide — **reuse**, do not replace with a second token.
- Bounce 0.1–0.3 if using Motion springs; here we **keep the existing Framer string**, not a new bounce.
