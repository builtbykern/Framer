const fs = require("fs")
const pagePath = "/contact"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const IMAGE =
  "https://framerusercontent.com/images/5Ytxn8avZFwlwp4Ng3t8PDU56Lk.png"
const HERO = "jmmPpci8t"
const COPY = "AATw4pip9"
const MEDIA = "WLSMm5iy1"
const WASH = "smzXd5qNf"
const NATIVE = "qxIyvg6PE"
const H1 = "R80e8PwNu"
const META = "TWVNilHRn"
const WRAP = "DpN8zutuL"
const EASE = "tween 0.22,1,0.36,1"
const T = "qjv2S9Wpa"
const P = "jEM0wBo2v"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

// Push BlendStyle injector
const code = fs.readFileSync(".tmp/Arbour_BlendStyle.tsx", "utf8")
let file = await framer.getCodeFile("Arbour_BlendStyle.tsx")
if (file) await file.setFileContent(code)
else file = await framer.createCodeFile("Arbour_BlendStyle.tsx", code)
const refreshed =
  (await framer.getCodeFiles()).find((f) => f.id === file.id) || file
const typeErrors = await refreshed.typecheck?.({ strict: true })
const insertURL = refreshed.exports?.find((e) => e.isDefaultExport)?.insertURL
console.log({ fileId: refreshed.id, insertURL, typeErrors })
if (!insertURL) throw new Error("no insertURL")

// Ensure wrap exists and holds H1
let wrapNode = await framer.getNode(WRAP)
if (!wrapNode) {
  wrapNode = await framer.createFrameNode(
    { name: "H1 Blend Wrap", width: "1fr", height: "auto" },
    NATIVE
  )
}
const wrapId = wrapNode.id

await framer.setAttributes(wrapId, { name: "H1 Blend Wrap" })
await framer.setParent(META, NATIVE, 0)
await framer.setParent(wrapId, NATIVE, 1)
await framer.setParent(H1, wrapId, 0)

// Remove old BlendDisplay if still around
for (const id of ["VdwurkXEQ"]) {
  try {
    const n = await framer.getNode(id)
    if (n?.remove) await n.remove()
  } catch {}
}

// Add injector once
const hero = await framer.agent.serialize({ id: HERO, depth: 3 }, { pagePath })
function find(n, re) {
  if (!n) return null
  if (re.test(n.name || "")) return n
  for (const c of n.children || []) {
    const h = find(c, re)
    if (h) return h
  }
  return null
}
let inj = find(hero, /BlendStyle|Blend Style/i)
if (!inj) {
  inj = await framer.addComponentInstance({
    url: insertURL,
    parentId: HERO,
    attributes: { name: "Arbour_BlendStyle", width: 1, height: 1 },
  })
  console.log("injector", inj?.id)
}

const dsl = [
  // Keep overlap layout
  `SET ${HERO} position="relative" width="100%" height="780px" overflow="clip" fill="${PAPER}"`,
  `SET ${MEDIA} position="absolute" top="0px" right="0px" bottom="0px" width="65%" fill="${IMAGE}" overflow="clip" zIndex="1"`,
  `SET ${WASH} position="absolute" top="0px" left="0px" bottom="0px" width="42%" fill="${PAPER}" zIndex="2"`,
  `SET ${COPY} position="absolute" top="0px" left="0px" width="100%" height="780px" padding="88px 48px 48px 48px" layout="stack" stackDirection="vertical" stackDistribution="end" stackAlignment="start" gap="20px" zIndex="3"`,
  `SET ${NATIVE} width="100%" maxWidth="1100px" gap="18px" overflow="visible"`,
  // Normal RichText — wide so it masks over media
  `SET ${H1} visible=true width="1fr" maxWidth="980px" textStylePreset="Arbour/Display" textColor="var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"`,
  `SET ${H1} appearEffect.trigger="onMount" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="48" appearEffect.enter.transition="${EASE} 0.85s 0.42s"`,
  // Wrap: transparent, no white fill
  `SET ${wrapId} name="H1 Blend Wrap" fill="transparent" layout="stack" stackDirection="vertical" width="100%" height="auto" overflow="visible"`,
  // Injector
  `SET ${inj.id} name="Arbour_BlendStyle" position="absolute" top="0px" left="0px" width="1px" height="1px" zIndex="5" $control__targetName="H1 Blend Wrap" $control__blendMode="difference"`,
  // BP
  `SET ${T}${HERO} height="640px"`,
  `SET ${T}${MEDIA} width="62%"`,
  `SET ${T}${WASH} width="40%"`,
  `SET ${T}${COPY} padding="72px 32px 40px 32px" height="640px"`,
  `SET ${T}${H1} maxWidth="820px"`,
  `SET ${P}${HERO} height="720px"`,
  `SET ${P}${MEDIA} top="0px" right="0px" width="100%" height="320px"`,
  `SET ${P}${WASH} top="280px" left="0px" width="100%" bottom="0px"`,
  `SET ${P}${COPY} padding="36px 20px 32px 20px" height="720px"`,
  `SET ${P}${H1} maxWidth="100%"`,
].join("; ")

const r = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify({ msg: r.message, errors: r.errors }, null, 2).slice(0, 1800))

const native = await framer.agent.serialize({ id: NATIVE, depth: 2 }, { pagePath })
console.log(
  JSON.stringify(
    {
      kids: (native.children || []).map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        fill: c.attributes?.fill,
        kids: (c.children || []).map((x) => ({
          id: x.id,
          name: x.name,
          vis: x.attributes?.visible,
          maxW: x.attributes?.maxWidth,
          preset: x.attributes?.textStylePreset,
        })),
      })),
    },
    null,
    2
  )
)
