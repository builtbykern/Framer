const fs = require("fs")
const pagePath = "/contact"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const INK = "rgb(28, 27, 22)"
const IMAGE =
  "https://framerusercontent.com/images/5Ytxn8avZFwlwp4Ng3t8PDU56Lk.png"
const HERO = "jmmPpci8t"
const COPY = "AATw4pip9"
const MEDIA = "WLSMm5iy1"
const NATIVE = "qxIyvg6PE"
const H1 = "R80e8PwNu"
const META = "TWVNilHRn"
const ENQUIRY = "uONXSHosa"
const T = "qjv2S9Wpa"
const P = "jEM0wBo2v"
const EASE = "tween 0.22,1,0.36,1"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

// 1) Push code component
const code = fs.readFileSync(".tmp/Arbour_BlendDisplay.tsx", "utf8")
let file = await framer.getCodeFile("Arbour_BlendDisplay.tsx")
if (file) {
  await file.setFileContent(code)
} else {
  file = await framer.createCodeFile("Arbour_BlendDisplay.tsx", code)
}
const refreshed =
  (await framer.getCodeFiles()).find((f) => f.id === file.id) || file
let typeErrors = null
try {
  typeErrors = await refreshed.typecheck?.({ strict: true })
} catch (e) {
  typeErrors = String(e)
}
const insertURL = refreshed.exports?.find((e) => e.isDefaultExport)?.insertURL
console.log({ fileId: refreshed.id, insertURL, typeErrors })

if (!insertURL) throw new Error("no insertURL")

// 2) Create Paper wash if missing
const heroSer = await framer.agent.serialize({ id: HERO, depth: 2 }, { pagePath })
let wash = (heroSer.children || []).find((c) => /Paper Wash/i.test(c.name || ""))
if (!wash) {
  wash = await framer.createFrameNode(
    { name: "Paper Wash", width: 480, height: 780 },
    HERO
  )
  console.log("wash", wash?.id)
}
const WASH = wash.id

// 3) Add BlendDisplay if missing
let blend = (heroSer.children || [])
  .concat(
    ...(heroSer.children || []).flatMap((c) => c.children || []),
    ...((await framer.agent.serialize({ id: NATIVE, depth: 2 }, { pagePath }))
      .children || [])
  )
  .find((c) => /BlendDisplay|Blend Display/i.test(c.name || ""))

// search deeper
async function findNamed(id, re) {
  const n = await framer.agent.serialize({ id, depth: 4 }, { pagePath })
  let hit = null
  function walk(x) {
    if (!x || hit) return
    if (re.test(x.name || "")) hit = x
    for (const c of x.children || []) walk(c)
  }
  walk(n)
  return hit
}
blend = await findNamed(HERO, /BlendDisplay|Blend Display|Arbour_BlendDisplay/i)

if (!blend) {
  const inst = await framer.addComponentInstance({
    url: insertURL,
    parentId: NATIVE,
    attributes: {
      name: "Arbour_BlendDisplay",
      width: "100%",
      height: "auto",
    },
  })
  blend = inst
  console.log("blend inst", inst?.id)
}
const BLEND = blend.id

// Order inside Native: meta, blend, hide old h1
await framer.setParent(META, NATIVE, 0)
await framer.setParent(BLEND, NATIVE, 1)
await framer.setAttributes(H1, { visible: false })

// 4) Absolute cinema layout — media full-bleed, wash left, copy overlay wide
const dsl = [
  `SET ${HERO} layout="null" position="relative" width="1fr" height="780px" overflow="clip" fill="${PAPER}"`,
  `SET ${MEDIA} position="absolute" top="0px" right="0px" bottom="0px" left="32%" width="auto" height="auto" overflow="clip" fill="${IMAGE}" zIndex="1"`,
  `SET ${WASH} name="Paper Wash" position="absolute" top="0px" left="0px" bottom="0px" width="42%" height="auto" fill="${PAPER}" zIndex="2"`,
  `SET ${COPY} position="absolute" top="0px" left="0px" right="0px" bottom="0px" width="100%" height="100%" layout="stack" stackDirection="vertical" stackDistribution="end" stackAlignment="start" gap="20px" padding="88px 48px 48px 48px" zIndex="3"`,
  `SET ${NATIVE} layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="18px" width="100%" maxWidth="1100px" overflow="visible"`,
  `SET ${BLEND} name="Arbour_BlendDisplay" width="100%" height="auto" $control__blendMode="difference" $control__color="${INK}" $control__fontSize="96" $control__letterSpacing="-0.03"`,
  `SET ${META} width="auto"`,
  `SET ${ENQUIRY} width="100%" maxWidth="520px"`,
  // Beats
  `SET ${MEDIA} appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.scale="1.04" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.transition="${EASE} 1.05s 0s"`,
  `SET ${META} appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="14" appearEffect.enter.transition="${EASE} 0.55s 0.28s"`,
  `SET ${BLEND} appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="48" appearEffect.enter.transition="${EASE} 0.85s 0.42s"`,
  `SET ${ENQUIRY} appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="18" appearEffect.enter.transition="${EASE} 0.55s 0.65s"`,
  // BP
  `SET ${T}${HERO} height="640px"`,
  `SET ${T}${MEDIA} left="28%"`,
  `SET ${T}${WASH} width="38%"`,
  `SET ${T}${COPY} padding="72px 32px 40px 32px"`,
  `SET ${P}${HERO} height="auto" minHeight="640px"`,
  `SET ${P}${MEDIA} left="0px" top="0px" right="0px" height="300px" bottom="auto"`,
  `SET ${P}${WASH} width="100%" height="100%"`,
  `SET ${P}${COPY} padding="40px 20px 36px 20px"`,
  `SET ${P}${BLEND} $control__fontSize="52" $control__blendMode="difference"`,
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({ msg: r.message, errors: r.errors }, null, 2).slice(0, 2000))

const after = await framer.agent.serialize({ id: HERO, depth: 3 }, { pagePath })
console.log(
  JSON.stringify(
    {
      kids: (after.children || []).map((c) => ({
        id: c.id,
        name: c.name,
        pos: c.attributes?.position,
        left: c.attributes?.left,
        w: c.attributes?.width,
        z: c.attributes?.zIndex,
        vis: c.attributes?.visible,
      })),
      native: (
        await framer.agent.serialize({ id: NATIVE, depth: 2 }, { pagePath })
      ).children?.map((c) => ({
        id: c.id,
        name: c.name,
        vis: c.attributes?.visible,
        blend: c.attributes?.["$control__blendMode"],
      })),
    },
    null,
    2
  )
)
