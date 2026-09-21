# Alarm Clock — Cursor Project implementation brief

**Hand this to Cursor Project (Framer craft).**  
Source of truth = this folder. If anything conflicts: **CRAFT + TASTE + PROPS win.**

| Field | Value |
|-------|--------|
| Product | Alarm Clock (working title; rename OK) |
| Type | Framer Marketplace **code component** |
| Price | **FREE** |
| Skin v1 | **Alarm** (despertador-objeto) — LOCKED |
| Repo | `builtbykern/framer` |
| Branch | `cursor/alarm-clock-*` (main is stub) |
| Publish | **Noel RED only** |
| Owner map | El boss |
| Owner craft | Cursor + Framer skills / Mac local |
| Updated | 12 Sep 2026 |

---

## 0. One-sentence mission

Build a Free Framer code component: a **desk-alarm object** whose face counts down to a target datetime for waiting lists and launches — Awwwards craft, affiliate preview CTA, no publish until Noel.

---

## 1. Why this product

- Waiting-list / launch pages need a countdown that is not Marketplace-default flip-clock soup.
- Free component → installs as bait; money = Dub/Framer affiliate when new users hit `?via=builtbykern` and buy Framer.
- Thumbnail must tell a story in <1s: “alarm / wake / launch.”
- Orbs / Number Flow parked; this is the first free craft priority (Noel 12 Sep 2026).

---

## 2. What to build (v1)

### In scope
1. Framer **Code Component** named Alarm Clock (or final Marketplace name Noel picks).
2. Countdown logic per `PROPS.md`.
3. Alarm object skin per `CRAFT.md` + `TASTE.md`.
4. Light + dark themes.
5. Reduced-motion + canvas preview freeze.
6. Marketplace **preview** page/frame: component + affiliate button new-tab to `https://framer.link/qIg9LiG`.
7. Short screen recording 3–6s of seconds ticking.

### Out of scope
- Waitlist Hero template (email + hero site)
- Eclipse dial / Board LED / Cubic skins
- Marketplace Submit / Community / X kits
- Audio ringing (unless explicitly added later)
- Server time sync, multi-event calendar
- Details.so / Cubic Time / Atlas clones

---

## 3. How to build (hard)

1. **Config first** if new Project chat: shared context = this whole folder; env; no implement until config ack.
2. Open Framer on Noel’s Mac (BuiltByKern signed in).
3. Create styles from `STYLES.md`.
4. Implement Code Component with Framer skills / local agent — primary deliverable is **in Framer**, not a detached Vite app.
5. Optional backup: export/source on `cursor/alarm-clock-*` in `builtbykern/framer`.
6. QA: canvas rest pose, live preview, mobile width, reduced-motion, CTA new tab.
7. Critique vs taste refs (`FAIL`/`PASS` line).
8. **Stop for Noel RED.** Do not publish.

---

## 4. Visual law (compressed)

- Object silhouette readable at thumb size.
- Digits: Biatec weight (`taste/03`); object-ness: board-prop idea (`taste/02`) without LED skin.
- Material restraint: Made in May air (`taste/04`).
- Digit-as-object craft: NY split (`taste/01`) without brutalist page.
- Inspiration URLs: Cubic Time (material time), Eclipse Atlas (event hierarchy) — steal columns only.

---

## 5. Affiliate (Till)

| Item | Value |
|------|--------|
| Primary URL | https://framer.link/qIg9LiG |
| Alt | https://framer.link/builtbykern |
| Destination | framer.com/?via=builtbykern |
| Placement | Marketplace preview (button OK) |
| Hard rule | **Open in new tab** or tracking fails |
| Note | Free components don’t pay on install; affiliate = new Framer subscribers |

---

## 6. Done checklist

- [ ] Code component in Framer project
- [ ] Props match `PROPS.md`
- [ ] Alarm skin only; object reads in thumb
- [ ] Light + dark OK
- [ ] Reduced-motion snap
- [ ] Canvas freeze / rest pose
- [ ] Preview CTA → qIg9LiG new tab
- [ ] Tick clip 3–6s exported
- [ ] Critique PASS line written
- [ ] Stop — Noel decides publish + final name

---

## 7. Later (do not do now)

**Waitlist Hero template:** one-viewport site using Alarm Clock + email capture + CMS launch date. Separate brief. Not Sill.

**v1.1 skins:** Eclipse dial · Board · Cubic (Framer-safe).
