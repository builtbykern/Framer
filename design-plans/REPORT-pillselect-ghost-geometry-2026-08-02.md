# Improve UI — Pill Select ghost/shell geometry (2026-08-02)

## Design language
- Audited surface: Pill Select open menu — hover ghost vs menu shell (`code-components/PillSelect.tsx` → live `/`)
- Design sources: `docs/superpowers/specs/2026-08-01-pill-select-design.md` (menu radius ~24, highlight inset ~6, trigger ~278×52 pill); `docs/projects/pill-select.md`
- Documented decisions: Two-blob silhouette + sharp content; highlight springs between rows; inset ~6px sides
- Governing owners and consumers: craft constants in `PillSelect.tsx` (`MENU_RADIUS`, `HIGHLIGHT_*`, `MENU_PAD_Y`, trigger/option padding)
- Explicit exceptions: None documented

## Findings
| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Ghost geometry is not nested with the menu shell: radius and air do not follow inset, and trigger/option text pads disagree | Spec: menu radius ~24, highlight inset ~6. Runtime CDP open: highlight `borderRadius: 14px`, `insetL/R: 6`, list `padTop: 10`; trigger `padL: 20` / `padR: 18`, option `padL: 24`. Nested rule for concentric corners: inner radius = outer − inset → **18**, not 14. Uneven vertical air (10) vs side inset (6). Screenshot: highlight corners do not track menu curvature | Introduce one `SHELL_INSET = 6`. Set `HIGHLIGHT_INSET = MENU_PAD_Y = SHELL_INSET`, `HIGHLIGHT_RADIUS = MENU_RADIUS - SHELL_INSET` (18). Set trigger + option horizontal padding both to `TEXT_PAD_X = 20` (symmetric). Keep colors/motion unchanged | `PillSelect.tsx` craft constants + trigger/option padding only | High |

## Improve first
**#1** — single geometry contract fixes ghost-vs-border mismatch, uneven padding, and trigger/option text alignment together.

Report + plan ready for executor (`design-plans/`). Say `todo` / `ejecuta` to implement via `framer-component`.
