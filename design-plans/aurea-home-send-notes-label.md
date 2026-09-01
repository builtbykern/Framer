# Relabel House Notes submit to SEND NOTES

Written against: `4aa0cbc`

## Evidence chain

- Surface: Strong Luxury / Aurea Home `/` · House Notes section `w2LburVEQ` (layer name Inner Circle) · Newsletter Form `b9BMyEirn` · submit instance `I66EFTSOv`
- Problem: Rendered submit reads **JOIN THE CIRCLE**. Banned chrome.
- Design evidence: `docs/projects/aurea-copy.md` — “Notes CTA: HOUSE NOTES / SEND NOTES (never Inner Circle).” Screenshot of `w2LburVEQ` shows the brown button with JOIN THE CIRCLE. Runtime: instance `$control__label="JOIN THE CIRCLE"` on Desktop `I66EFTSOv`, Tablet `J5oev3dzjI66EFTSOv`, Phone `IwdhW0PKTI66EFTSOv`.
- Owner: Form Submit Button instance `I66EFTSOv` (component used as `Join Inner Circle`) · control `$control__label`
- Scope and affected surfaces: Home `/` only, all three breakpoints of that instance
- Uncertainty: Success / Pending / Error variant labels on the component (`ItoxvMpsu`, `tAO4Ict3b`, `Tc5QmNo66`) are not this Idle label. Do not edit those unless they also render JOIN THE CIRCLE after the Idle change.

## Design decision

Set the Idle submit label to **SEND NOTES** on Desktop, Tablet, and Phone so the visible CTA matches the copy bible. Do not unhide the leftover text link `RDEWhV4vR` (already SEND NOTES, `visible="false"`). Do not restyle the button.

## Reuse

- Copy string: `SEND NOTES` from `docs/projects/aurea-copy.md` Notes CTA
- Control: existing `$control__label` on the Form Submit Button instance
- Exemplar: hidden RichText `RDEWhV4vR` already holds SEND NOTES — same words, different node; do not show that link
- Text style `Aurea/Button` (`SS2V9Hzrn`): do not bind in this plan unless the instance already uses it

If a new primitive is required: none.

## Changes

1. Home `/` · Newsletter Form `b9BMyEirn`
   - Change: `applyChanges` with `pagePath: "/"`:
     ```
     SET I66EFTSOv $control__label="SEND NOTES";
     SET J5oev3dzjI66EFTSOv $control__label="SEND NOTES";
     SET IwdhW0PKTI66EFTSOv $control__label="SEND NOTES";
     ```
     Rebound Strong Luxury URL; `node scripts/framer/exec.mjs -s 2`.
   - Preserve: button size `width="100%"` `height="56px"`; `$control__variant="Idle"`; form wiring; House Notes copy (`VqRoMkqk6`, `ehm77P66a`, `X3xz675nd`); dark fill `#0C1611`; photos; type.
   - Verify: `getNode` on the three instance ids shows `$control__label="SEND NOTES"`. Screenshot `w2LburVEQ`, `J5oev3dzjw2LburVEQ`, `IwdhW0PKTw2LburVEQ` — button reads SEND NOTES, never JOIN THE CIRCLE / Inner Circle.

## Scope

- Inherit: Home Tablet / Phone replicas of `I66EFTSOv`
- Verify: Contact form submit (component `brtsLYslT` / `Form Submit Button`) if it shares the component — only change the three Home instance ids above; if Contact Idle label is JOIN THE CIRCLE, stop and report (out of this plan)
- Exclude: hiding/showing `RDEWhV4vR`; renaming the instance or section; Four Principles 04; Phone nav; glow `QmJHdoWPn`; publish

## Validation

- Product: Visitor can submit House Notes seeing SEND NOTES.
- Interface: Home D/T/P. Idle state. Do not need to submit the form.
- System: Same instance control, no new button component.
- Repository: rebound Strong Luxury then `node scripts/framer/verify.mjs -s 2` → `{ "ok": true }`. Do not publish.

## Stop conditions

- Stop if `$control__label` is not a valid control on `I66EFTSOv` (read `framer.agent.readComponentControls` for `brtsLYslT` first in that case — still only change the Home instances).
- Stop if Success/Pending/Error states still render JOIN THE CIRCLE after Idle is fixed — report those variant ids; do not invent new copy.
- Stop if session is not project `32N5ipHfkUMlPJAI6dc7`.

## Design documentation

- After acceptance: none. Bible already specifies SEND NOTES.

## Executor constraints (baseline-ui)

- No new animation, gradient, or glow.
- Do not change letter-spacing or button height.
- Do not rebuild the form.
