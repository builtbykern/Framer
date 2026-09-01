# Post-Framer-agent audit (2026-07-17)

Read-only canvas check after internal-agent execution of approved fixes 1–3. Session `3`. **Not published** (`publish preview` shows 5 pending updates: Home, Contact, Neighbourhoods, Nav, Footer).

## Verdict

| Fix | Status | Evidence |
| --- | --- | --- |
| 1 Neighbourhoods Directory olive/copy | **Done** | `Territory Map Art` / `Map Stage` (`VIeGty7T6`) now parented under **Photo Card** (`XzTsEtIxm`), not Info Card. Info Card (`OGGeEjtus`) is text-only (Title Row + body). Map Stage `opacity=0.55`, absolute 132×132 inside photo half. |
| 2 Home Tablet nav vs hero | **Done** | Tablet Nav `U3TeNUVXvxiqH0OxcR` rect `y=0 h=76`; Hero `U3TeNUVXvQWUEMYFj7` `y=0 h=736`. `bisects=false`, nav sits on top edge (not mid-hero). |
| 3 Contact Phone email | **Done** | Phone replica `jEM0wBo2vjFTgrH9Eq` still renders `ENQUIRIES@ARBOUR.ESTATE` inside `Direct Enquiry`; `visible` not false. |

## Nav / Footer (guard)

Agent marked Nav + Footer updated, but fills remain light chrome (Nav Paper ~`rgb(252,250,244)` / Paper token; Footer Parchment `425191b0…`). **No Ink-surface redesign** — good.

## Residual notes
- Map Stage opacity `0.55` is a softening; copy no longer shares the Info Card stack with the mark.
- Phone Home nav rect looks sentinel (`y≈-99`) — out of this fix scope; Tablet was the target.
- Canvas ahead of live; publish when you want these three pages live.

## Improve first (if iterating)
None of the three approved fixes remain open. Optional visual QA on Neighbourhoods Phone/Tablet replicas of Photo Card map placement.
