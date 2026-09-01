const pagePath = "/contact"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const IMAGE =
  "https://framerusercontent.com/images/5Ytxn8avZFwlwp4Ng3t8PDU56Lk.png"
const HERO = "jmmPpci8t"
const COPY = "AATw4pip9"
const MEDIA = "WLSMm5iy1"
const WASH = "smzXd5qNf"
const H1 = "R80e8PwNu"
const WRAP = "DpN8zutuL"
const INJ = "e5xcrxKTw"
const T = "qjv2S9Wpa"
const P = "jEM0wBo2v"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

// —— Desktop: better blend + clearer overlap ——
// exclusion reads softer than difference on dusk photo + Paper
const dslDesk = [
  `SET ${HERO} position="relative" width="100%" height="780px" overflow="clip" fill="${PAPER}"`,
  `SET ${MEDIA} position="absolute" top="0px" right="0px" bottom="0px" width="70%" fill="${IMAGE}" overflow="clip" zIndex="1"`,
  `SET ${WASH} position="absolute" top="0px" left="0px" bottom="0px" width="36%" fill="${PAPER}" zIndex="2" visible=true`,
  `SET ${COPY} position="absolute" top="0px" left="0px" width="100%" height="780px" padding="88px 48px 48px 48px" layout="stack" stackDirection="vertical" stackDistribution="end" stackAlignment="start" gap="20px" zIndex="3"`,
  `SET ${WRAP} name="H1 Blend Wrap" fill="transparent" width="100%" height="auto"`,
  `SET ${H1} visible=true width="100%" maxWidth="1040px" textStylePreset="Arbour/Display" textColor="var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"`,
  `SET ${INJ} $control__targetName="H1 Blend Wrap" $control__blendMode="exclusion"`,
].join("; ")

const r1 = await framer.agent.applyChanges(dslDesk, { pagePath })
console.log("desk", r1.message, r1.errors)

// —— Tablet: keep soft overlap ——
const dslT = [
  `SET ${T}${HERO} position="relative" height="640px" overflow="clip"`,
  `SET ${T}${MEDIA} position="absolute" top="0px" right="0px" bottom="0px" width="64%" zIndex="1"`,
  `SET ${T}${WASH} position="absolute" top="0px" left="0px" bottom="0px" width="38%" visible=true zIndex="2"`,
  `SET ${T}${COPY} position="absolute" top="0px" left="0px" width="100%" height="640px" padding="72px 32px 40px 32px" zIndex="3"`,
  `SET ${T}${H1} maxWidth="860px"`,
  `SET ${T}${INJ} $control__blendMode="exclusion"`,
].join("; ")
const r2 = await framer.agent.applyChanges(dslT, { pagePath })
console.log("tablet", r2.message, r2.errors)

// —— Phone: restore clean stack from before (type → media), no cinema overlay ——
const dslP = [
  `SET ${P}${HERO} layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="0px" padding="0px" position="relative" width="100%" height="auto" overflow="clip" fill="${PAPER}"`,
  // Copy back to normal flow
  `SET ${P}${COPY} position="relative" width="1fr" height="auto" padding="56px 20px 40px 20px" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="16px" zIndex="1"`,
  // Media as simple band under copy
  `SET ${P}${MEDIA} position="relative" width="1fr" height="280px" overflow="clip" fill="${IMAGE}" zIndex="1"`,
  // Hide wash on phone — not needed
  `SET ${P}${WASH} visible=false height="0px"`,
  `SET ${P}${H1} maxWidth="100%" width="100%"`,
  // No muddy blend on solid Paper
  `SET ${P}${INJ} $control__blendMode="normal" visible=false`,
  `SET ${P}${WRAP} fill="transparent"`,
].join("; ")
const r3 = await framer.agent.applyChanges(dslP, { pagePath })
console.log("phone", r3.message, r3.errors)

// Reorder phone: copy then media (liked prior reading) — try setParent
try {
  await framer.setParent(P + COPY, P + HERO, 0)
  await framer.setParent(P + MEDIA, P + HERO, 1)
  console.log("phone order: copy → media")
} catch (e) {
  console.log("phone order", e.message)
}

const phone = await framer.agent.serialize(
  { id: P + HERO, depth: 1 },
  { pagePath }
)
const desk = await framer.agent.serialize({ id: HERO, depth: 1 }, { pagePath })
console.log(
  JSON.stringify(
    {
      deskKids: (desk.children || []).map((c) => ({
        name: c.name,
        w: c.attributes?.width,
        vis: c.attributes?.visible,
      })),
      phone: {
        h: phone.attributes?.height,
        dir: phone.attributes?.stackDirection,
        kids: (phone.children || []).map((c) => ({
          name: c.name,
          pos: c.attributes?.position,
          h: c.attributes?.height,
          vis: c.attributes?.visible,
        })),
      },
    },
    null,
    2
  )
)
