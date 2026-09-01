# Copy Field — Kern design plans (2026-07-30)

Source audit: [REPORT-copyfield-kern-improve-ui-2026-07-30.md](./REPORT-copyfield-kern-improve-ui-2026-07-30.md)  
Sandbox: Gold Parsnip `fGqO95KLAs2bClhRoOW1` · Session `3`  
Motion companions: `animation-plans/039`–`043`

| # | Plan | Finding | Status |
| --- | --- | --- | --- |
| 1 | [Dark house](./2026-07-30-copyfield-kern-dark-house.md) | UI 1 | DONE |
| 2 | [Accent grammar](./2026-07-30-copyfield-kern-accent-grammar.md) | UI 2 | DONE |
| 3 | [Toast frosted light](./2026-07-30-copyfield-kern-toast.md) | UI 3 | DONE |

## Recommended order

1. Dark house defaults  
2. Accent grammar  
3. Toast chrome (before or with motion `041`)

## Dependencies

- Motion `039+` assume accent + pill defaults from 1–2  
- Toast motion `041` assumes chrome from plan 3  

**No Auto Demo. No publish without OK.**

## Post-ship (2026-07-30 evening) — DONE

Audit: [REPORT-copyfield-improve-ui-2026-07-30-postship.md](./REPORT-copyfield-improve-ui-2026-07-30-postship.md)

| # | Change | Status |
| --- | --- | --- |
| 1 | Clash Grotesk on Home + instance Font (no Inter) | DONE |
| 2 | Caption → `Reveal a value, then copy it.` | DONE |
| 3 | `/thumbnail` 1600×1200 Kern house | DONE |

Executor: `scripts/framer/copyfield-elevate.mjs` + `CopyField.tsx` push.
