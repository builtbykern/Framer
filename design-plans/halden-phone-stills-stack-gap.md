# Home Series Stills Stack gap matches detail owner (28)

Written against: `4aa0cbc`

## Evidence chain

- Surface: Halden Home Series Stills `yGFlVus2I` / Phone `nyI5jW7lAyGFlVus2I`. `$control__layout="Stack"`, `$control__gap="16"`.
- Problem: Home phone uses the Stack lookbook language but with gap 16. Work detail Stack owner `afUswAq7g` is `$control__gap="28"`. Prints sit tighter on Home than on the series page.
- Design evidence: Engram 737 / `design-plans/halden-series-stills-print-offset.md`: detail instance gap 28; column gap 28. `tmp/Series_Stills.tsx` `gap` defaultValue `28`. Phone Work List series-to-series gap (80px on `nyI5jW7lAW3DqHmdcb`) is a different owner — do not change it.
- Owner: `$control__gap` on Home Series Stills instance.
- Scope and affected surfaces: Home Series Stills Stack only.
- Uncertainty: none. Layout must stay Stack (user chose Stack on phone; do not restore Grid).

## Design decision

Set Home Series Stills gap to 28 so Stack prints share the detail lookbook spacing. Do not change STACK_PRINTS widths or Work List padding.

## Reuse

- Gap `28` from Work detail `afUswAq7g` and component default
- Exemplar: `afUswAq7g` `$control__gap="28"` on `/work/:Work`

No new spacing token.

## Changes

1. Home `pagePath: "/"`

   - Change:

     ```
     SET yGFlVus2I $control__gap="28";
     ```

     If phone replica still reads 16:

     ```
     SET nyI5jW7lAyGFlVus2I $control__gap="28";
     ```

   - Preserve: `$control__layout="Stack"` (serialized title may be `"Stack"`); `$control__index="true"`; `$control__images` Gallery bind; `$control__indexColor` muted; STACK_PRINTS in `tmp/Series_Stills.tsx`; Work List `padding="128px 20px 88px 20px"` and `gap="80px"`; Series inner `gap="20px"` between Meta and Still Grid.
   - Verify: getNode Home/phone `$control__gap` is `"28"`. Detail `afUswAq7g` still `"28"` (untouched).

## Scope

- Inherit: Home T/P replicas of Series Stills.
- Verify: Phone — space between stills in one series matches detail lookbook, not the 80px between series.
- Exclude: Work List list-gap 80; Series Meta gap 10; detail instance (already 28); Grid; Cover; Drift Plane; publish.

## Validation

- Product: Home Stack stills use the same 28px print gap as `/work/:Work`.
- Interface: Phone; a series with 2+ gallery stills if canvas resolves the array; one-still series still has 28 vs following meta of the next item (80).
- System: One Stack gap owner (28).
- Repository: Session **1**, Halden. `node scripts/framer/verify.mjs -s 1 --page "/"` → `{ "ok": true }`. Do not publish.

## Stop conditions

- Stop if SET changes `$control__layout` off Stack.
- Stop if Gallery bind is cleared.
- Do not publish.

## Design documentation

- After acceptance: none unless asked.
