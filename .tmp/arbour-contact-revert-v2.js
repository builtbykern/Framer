/**
 * Revert Contact hero → early densify version (v2 of the experiment).
 * Horizontal split type | media, soft grain, entrance beats.
 * No Paper wash overlay, no blend/stroke, no Display Punch, no gradient.
 */
const pagePath = "/contact"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const IMAGE =
  "https://framerusercontent.com/images/5Ytxn8avZFwlwp4Ng3t8PDU56Lk.png"
const EASE = "tween 0.22,1,0.36,1"

const HERO = "jmmPpci8t"
const COPY = "AATw4pip9"
const MEDIA = "WLSMm5iy1"
const WASH = "smzXd5qNf"
const NATIVE = "qxIyvg6PE"
const META = "TWVNilHRn"
const H1 = "R80e8PwNu"
const WRAP = "DpN8zutuL"
const ENQUIRY = "uONXSHosa"
const NOISE = "zQumCoq6L"
const BLEND = "e5xcrxKTw"
const STRIP = "Ri5b6vVlA"
const T = "qjv2S9Wpa"
const P = "jEM0wBo2v"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

// Revert H1 to site Display (not Display Punch)
const styles = await framer.getTextStyles()
const display = styles.find((s) => s.path === "/Arbour/Display")
if (!display) throw new Error("missing Display")
for (const id of [H1, T + H1, P + H1]) {
  await framer.setAttributes(id, {
    inlineTextStyle: display,
    maxWidth: "640px",
  })
}

// Order: copy then media (desktop densify)
try {
  await framer.setParent(COPY, HERO, 0)
  await framer.setParent(MEDIA, HERO, 1)
} catch (e) {
  console.log("order", e.message)
}

const dsl = [
  // Hero — horizontal split stage
  `SET ${HERO} layout="stack" stackDirection="horizontal" stackDistribution="start" stackAlignment="stretch" gap="0px" padding="0px" width="1fr" height="780px" fill="${PAPER}" overflow="clip" position="relative"`,

  // Hide cinema overlays from later experiments
  `SET ${WASH} visible=false`,
  `SET ${T}${WASH} visible=false`,
  `SET ${P}${WASH} visible=false`,
  `SET ${BLEND} visible=false`,
  `SET ${T}${BLEND} visible=false`,
  `SET ${P}${BLEND} visible=false`,
  `SET ${STRIP} visible=false`,

  // Copy column — relative in stack (not absolute overlay)
  `SET ${COPY} layout="stack" stackDirection="vertical" stackDistribution="end" stackAlignment="start" gap="18px" padding="88px 36px 48px 40px" width="0.78fr" height="1fr" position="relative" left="null" top="null" right="null" bottom="null" zIndex="2"`,
  `SET ${NATIVE} gap="16px" width="1fr" maxWidth="none" overflow="clip"`,
  `SET ${WRAP} width="1fr"`,
  `SET ${H1} width="1fr" maxWidth="640px"`,
  `SET ${ENQUIRY} padding="8px 0px 0px 0px"`,

  // Media column
  `SET ${MEDIA} name="Hero Entrance Media" position="relative" width="1.22fr" height="1fr" left="null" top="null" right="null" bottom="null" overflow="clip" fill="${IMAGE}" zIndex="1"`,

  // Soft grain
  `SET ${NOISE} opacity="0.07" $control__grainStrength="0.08" $control__patternSize="240"`,

  // Entrance beats (v1) — quiet, staged
  `SET ${HERO} appearEffect="null"`,
  `SET ${COPY} appearEffect="null"`,
  `SET ${MEDIA} appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.scale="1.04" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.transition="${EASE} 1.05s 0s"`,
  `SET ${META} appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="14" appearEffect.enter.x="0" appearEffect.enter.scale="1" appearEffect.enter.transition="${EASE} 0.55s 0.28s"`,
  `SET ${H1} appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="48" appearEffect.enter.x="0" appearEffect.enter.scale="1" appearEffect.enter.transition="${EASE} 0.8s 0.42s"`,
  `SET ${ENQUIRY} appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="18" appearEffect.enter.x="0" appearEffect.enter.scale="1" appearEffect.enter.transition="${EASE} 0.55s 0.62s"`,

  // Tablet
  `SET ${T}${HERO} stackDirection="horizontal" height="640px" gap="0px" padding="0px" overflow="clip"`,
  `SET ${T}${COPY} padding="72px 28px 40px 28px" width="0.85fr" height="1fr" gap="14px" position="relative" left="null" top="null"`,
  `SET ${T}${MEDIA} width="1.15fr" height="1fr" position="relative" left="null" top="null" right="null" bottom="null" fill="${IMAGE}" overflow="clip"`,

  // Phone — vertical, copy then media (clean stack user preferred later; densify had media 320)
  `SET ${P}${HERO} stackDirection="vertical" height="auto" gap="0px" padding="0px" overflow="clip"`,
  `SET ${P}${COPY} padding="40px 20px 36px 20px" width="1fr" height="auto" gap="14px" position="relative"`,
  `SET ${P}${MEDIA} width="1fr" height="320px" position="relative" fill="${IMAGE}" overflow="clip"`,
  `SET ${P}${H1} maxWidth="100%"`,
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({ msg: r.message, errors: r.errors }))

await framer.setAttributes(HERO, { maxWidth: null })
await framer.setAttributes(COPY, { maxWidth: null })

// Phone order: copy then media
try {
  await framer.setParent(P + COPY, P + HERO, 0)
  await framer.setParent(P + MEDIA, P + HERO, 1)
  console.log("phone order ok")
} catch (e) {
  console.log("phone order", e.message)
}

const after = await framer.agent.serialize({ id: HERO, depth: 2 }, { pagePath })
const h1 = await framer.getNode(H1)
console.log(
  JSON.stringify(
    {
      hero: {
        h: after.attributes?.height,
        dir: after.attributes?.stackDirection,
        layout: after.attributes?.layout,
      },
      kids: (after.children || []).map((c) => ({
        name: c.name,
        w: c.attributes?.width,
        h: c.attributes?.height,
        pos: c.attributes?.position,
        visible: c.attributes?.visible,
      })),
      h1Style: h1.inlineTextStyle?.name,
      h1Max: h1.maxWidth,
    },
    null,
    2
  )
)

const res = await framer.publish()
console.log(JSON.stringify({ id: res.deployment?.id, status: res.deployment?.status }))
