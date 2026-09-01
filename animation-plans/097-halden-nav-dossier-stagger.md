# 097 — Dossier enter delay, child stagger, exit

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH / MEDIUM
- **Category**: Physicality, Cohesion (findings 3, 4) + exit pair for finding 1
- **Estimated scope**: Nav canvas appearEffect only (`Ebz57iEJS`)

## Problem

Menu Info `XM4MY5kEq` / open replica `lHV5aHgaZXM4MY5kEq`:

```
appearEffect.enter.transition = "tween 0.23,1,0.32,1 0.24s 0.08s"
appearEffect.enter.stagger = "0s"
appearEffect.enter.y = 12
```

Menu Contact `jHiMr8b0s` / `lHV5aHgaZjHiMr8b0s`: delay `0.13s`, same otherwise. No `appearEffect.exit`. Children (Portrait, Lead, Body, Contact Kicker, Enquiries, form) have no own appear. Copy starts at 80–130ms while paper is 490ms.

## Target

Set on **primary** Info/Contact (replicas inherit unless overridden). Open replica if it already has its own appearEffect, SET both.

Enter (after paper wrap from 096):

- Info: `appearEffect.trigger="onMount"` `appearEffect.enter.opacity="0"` `appearEffect.enter.y="8"` `appearEffect.enter.scale="1"` `appearEffect.enter.transition="tween 0.23,1,0.32,1 0.24s 0.2s"` `appearEffect.enter.stagger="0.05s"`
- Contact: same except delay **0.25s** (50ms after Info’s 0.2s start, in 30–80ms stagger band)
- Exit both: `appearEffect.exit.opacity="0"` `appearEffect.exit.y="8"` `appearEffect.exit.transition="tween 0.23,1,0.32,1 0.2s 0s"` `appearEffect.exit.stagger="0s"`

If 096 clips the sheet, enter delay **0.2s** still lets type land on paper; stagger 50ms on Info/Contact stacks their **children**. Selected Work `OBacYlZQ_` stays `visible=false`.

Direct visible children without appearEffect should inherit parent stagger. If stagger on parent does nothing because the parent is the animated unit, SET the same enter (opacity 0, y 8, 240ms, delay 0, stagger 0) on visible children:

Info: `yCzYR_txY` Info Still, `AkMxCySBQ` Lead, `E9jOt9qZy` Body (Caption lives in still — do not double). Skip `OBacYlZQ_`.

Contact: `AY4KnbG3w` Kicker, `Hc2be91vS` Enquiries Label, `OSaBHYPYg` Enquiries, `dm4NXzJx7` Contact Rule, `mrwQrr1B9` Contact Form. Stagger **0.05s** on Contact parent; if children need own effects, delay 0 and parent stagger.

Use ids from primary; Framer copies to open replica.

## Repo conventions to follow

- Tween string: `tween 0.23,1,0.32,1 0.24s 0.2s` (ease-out token already used on Enquiries tap `0.16s`).
- `{ pagePath: "/" }`, session `-s 2`, Halden only.
- `appearEffect.enter="null"` is valid to clear (used on Menu Sheet). Do not clear Sheet.

## Steps

1. Confirm `getProjectInfo().name === "Halden"`.
2. applyChanges SET Info + Contact enter/exit/stagger as Target. SET open replicas if they still show old 0.08s/0.13s delays.
3. If children do not stagger, SET child appearEffect enter opacity 0 y 8 tween 240ms delay 0 stagger 0, and keep parent stagger 0.05s.
4. Verify Preview: Info still → lead → body cascade ~50ms; Contact starts ~50ms after Info; no Selected Work flash.

## Boundaries

- Do NOT change Logo Menu Roll, Nav height, PageVeil, overlay Lead font in this plan.
- Do NOT publish.

## Verification

- **Mechanical**: `getNode` Info enter delay `0.2s`, Contact `0.25s`, stagger `0.05s`, exit present. `verify.mjs -s 2 --page "/"`.
- **Feel check**: 10% playback — type does not appear over uncovered stills. Close: clip from 096 eats copy; if clip missing, exit 200ms ease-out.
- **Done when**: delays match Target; Selected Work stays hidden.
