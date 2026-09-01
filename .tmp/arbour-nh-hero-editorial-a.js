const pagePath = "/neighbourhoods"
const IMAGE =
  "https://framerusercontent.com/images/8IGPbFclzfRApOAIssLZgmHsnw.png"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)"
const INK_SOFT = "var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)"
const OLIVE = "var(--token-a16d0333-6bd5-4d60-aa00-fac26447145d)"
const HAIRLINE = "rgba(28,27,22,0.12)"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong project " + proj.name)

const HERO = "ycUqIc8V3"
const COPY = "I1ekolXeW"
const H1 = "n9ay7tOtM"
const CUE = "s2TF2hOZe"

// 1) Reshape hero like About Paper Opener
const dsl1 = [
  `SET ${HERO} layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="24px" overflow="clip" padding="120px 48px 48px 48px" width="1fr" height="820px" maxWidth="1200px" fill="${PAPER}"`,
  `SET ${COPY} layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="24px" padding="0px" width="1fr" height="auto" maxWidth="1200px" zIndex="1"`,
  `SET ${H1} width="1fr" maxWidth="1080px"`,
].join("; ")

const r1 = await framer.agent.applyChanges(dsl1, { pagePath })
console.log("reshape", r1.message || r1)

// 2) Create image field if missing
const hero = await framer.agent.serialize({ id: HERO, depth: 2 }, { pagePath })
const existing = (hero.children || []).find((c) =>
  /Hero Image Field|Opening Image/i.test(c.name || "")
)

let mediaId = existing?.id
if (!mediaId) {
  const frame = await framer.createFrameNode(
    {
      name: "Hero Image Field",
      width: "1fr",
      height: 380,
      overflow: "hidden",
    },
    HERO
  )
  mediaId = frame?.id
  console.log("created media", mediaId)
  if (mediaId) {
    await framer.setParent(mediaId, HERO, 1)
  }
}

if (!mediaId) throw new Error("no media id")

const dsl2 = [
  `SET ${mediaId} name="Hero Image Field" position="relative" width="1fr" height="380px" maxWidth="1200px" overflow="clip" fill="${IMAGE}" borderWidth="1px" borderColor="${HAIRLINE}" borderStyle="solid"`,
  // Scroll cue: light-paper contrast (was Paper-on-Paper)
  `SET ${CUE} $control__coords="${INK_SOFT}" $control__label1="${INK}" $control__accent="${OLIVE}"`,
].join("; ")

const r2 = await framer.agent.applyChanges(dsl2, { pagePath })
console.log("media+cue", r2.message || r2)

// 3) Breakpoints
const dsl3 = [
  `SET aJLpuUP0q${HERO} padding="100px 32px 40px 32px" height="720px" gap="20px"`,
  `SET aJLpuUP0q${COPY} padding="0px" gap="20px"`,
  `SET aJLpuUP0q${mediaId} height="300px"`,
  `SET Qonafp_oD${HERO} padding="88px 20px 32px 20px" height="auto" gap="16px"`,
  `SET Qonafp_oD${COPY} padding="0px" gap="16px"`,
  `SET Qonafp_oD${mediaId} height="240px"`,
].join("; ")

const r3 = await framer.agent.applyChanges(dsl3, { pagePath })
console.log("bp", r3.message || r3, r3.errors || null)

const after = await framer.agent.serialize({ id: HERO, depth: 2 }, { pagePath })
console.log(
  JSON.stringify(
    {
      attrs: {
        h: after.attributes?.height,
        pad: after.attributes?.padding,
        gap: after.attributes?.gap,
      },
      kids: (after.children || []).map((c) => ({
        id: c.id,
        name: c.name,
        h: c.attributes?.height,
        fill: c.attributes?.fill,
        pad: c.attributes?.padding,
      })),
    },
    null,
    2
  )
)
