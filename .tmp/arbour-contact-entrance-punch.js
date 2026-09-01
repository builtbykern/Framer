/**
 * Contact hero entrance — staged punch, Arbour-quiet.
 * opacity + transform only; short y travel (no 48px jump); media leads.
 * D/T/P — same choreography, phone slightly tighter.
 */
const pagePath = "/contact"
const T = "qjv2S9Wpa"
const P = "jEM0wBo2v"

// ease-out editorial (proven in v1 beats)
const EASE = "tween 0.16,1,0.3,1"

const MEDIA = "WLSMm5iy1"
const META = "TWVNilHRn"
const H1 = "R80e8PwNu"
const WRAP = "DpN8zutuL"
const ENQUIRY = "uONXSHosa"
const COPY = "AATw4pip9"
const HERO = "jmmPpci8t"
const NATIVE = "qxIyvg6PE"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

function beat(id, { opacity = 0, y = 0, scale = 1, dur, delay }) {
  return `SET ${id} appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="${opacity}" appearEffect.enter.x="0" appearEffect.enter.y="${y}" appearEffect.enter.scale="${scale}" appearEffect.enter.rotate="0" appearEffect.enter.rotateX="0" appearEffect.enter.rotateY="0" appearEffect.enter.skewX="0" appearEffect.enter.skewY="0" appearEffect.enter.transition="${EASE} ${dur} ${delay}" appearEffect.enter.stagger="0s"`
}

const dsl = [
  // Parents stay still — children carry the stage
  `SET ${HERO} appearEffect="null"`,
  `SET ${COPY} appearEffect="null"`,
  `SET ${NATIVE} appearEffect="null"`,
  `SET ${WRAP} appearEffect="null"`,
  `SET ${T}${HERO} appearEffect="null"`,
  `SET ${T}${COPY} appearEffect="null"`,
  `SET ${P}${HERO} appearEffect="null"`,
  `SET ${P}${COPY} appearEffect="null"`,

  // Desktop — media leads, type follows in tight cascade
  beat(MEDIA, { opacity: 0, scale: 1.05, y: 0, dur: "1.05s", delay: "0s" }),
  beat(META, { opacity: 0, y: 10, scale: 1, dur: "0.55s", delay: "0.22s" }),
  beat(H1, { opacity: 0, y: 18, scale: 1, dur: "0.75s", delay: "0.34s" }),
  beat(ENQUIRY, { opacity: 0, y: 12, scale: 1, dur: "0.55s", delay: "0.52s" }),

  // Tablet — same beats
  beat(T + MEDIA, { opacity: 0, scale: 1.05, y: 0, dur: "1s", delay: "0s" }),
  beat(T + META, { opacity: 0, y: 10, scale: 1, dur: "0.55s", delay: "0.2s" }),
  beat(T + H1, { opacity: 0, y: 16, scale: 1, dur: "0.7s", delay: "0.32s" }),
  beat(T + ENQUIRY, { opacity: 0, y: 10, scale: 1, dur: "0.55s", delay: "0.48s" }),

  // Phone — quieter travel, same order (media is below copy visually; still fade media then type cascade)
  beat(P + MEDIA, { opacity: 0, scale: 1.03, y: 0, dur: "0.9s", delay: "0s" }),
  beat(P + META, { opacity: 0, y: 8, scale: 1, dur: "0.5s", delay: "0.18s" }),
  beat(P + H1, { opacity: 0, y: 14, scale: 1, dur: "0.65s", delay: "0.28s" }),
  beat(P + ENQUIRY, { opacity: 0, y: 10, scale: 1, dur: "0.5s", delay: "0.42s" }),
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({ msg: r.message, errors: r.errors }))

const after = await framer.agent.serialize({ id: HERO, depth: 3 }, { pagePath })
function dig(n, out = []) {
  if (!n) return out
  const a = n.attributes?.appearEffect
  if (a) {
    out.push({
      name: n.name || n.id,
      op: a.enter?.opacity,
      y: a.enter?.y,
      scale: a.enter?.scale,
      t: a.enter?.transition,
    })
  }
  for (const c of n.children || []) dig(c, out)
  return out
}
console.log(JSON.stringify(dig(after), null, 2))

const res = await framer.publish()
console.log(JSON.stringify({ id: res.deployment?.id, status: res.deployment?.status }))
