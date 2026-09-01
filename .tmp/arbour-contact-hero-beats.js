/**
 * Contact hero — 2–3 beat entrance (not the NH strip horror).
 * Layout: horizontal split — type | full-height media.
 * Beat 1: media fade (+ slight scale)
 * Beat 2: meta
 * Beat 3: display reveal
 * Then enquiry row.
 */
const pagePath = "/contact"
const IMAGE =
  "https://framerusercontent.com/images/5Ytxn8avZFwlwp4Ng3t8PDU56Lk.png"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const HAIRLINE = "rgba(28,27,22,0.12)"

const HERO = "jmmPpci8t"
const COPY = "AATw4pip9"
const META = "TWVNilHRn"
const H1 = "R80e8PwNu"
const ENQUIRY = "uONXSHosa"
const STRIP = "Ri5b6vVlA"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

// Inspect current kids
const hero0 = await framer.agent.serialize({ id: HERO, depth: 2 }, { pagePath })
let media = (hero0.children || []).find((c) =>
  /Hero Media|Entrance Media/i.test(c.name || "")
)
let mediaId = media?.id

if (!mediaId) {
  const frame = await framer.createFrameNode(
    {
      name: "Hero Entrance Media",
      width: "1fr",
      height: "1fr",
      overflow: "hidden",
    },
    HERO
  )
  mediaId = frame?.id
  console.log("created media", mediaId)
}

if (!mediaId) throw new Error("no media")

// Put copy first, media second
await framer.setParent(COPY, HERO, 0)
await framer.setParent(mediaId, HERO, 1)

// Hide the unused meta strip inside copy (was dangling)
const dslLayout = [
  // Hero stage — split
  `SET ${HERO} layout="stack" stackDirection="horizontal" stackDistribution="start" stackAlignment="stretch" gap="0px" padding="0px" width="1fr" height="820px" maxWidth="none" fill="${PAPER}" overflow="clip"`,
  // Disable muddy parent appear — beats live on children
  `SET ${HERO} appearEffect="null"`,
  // Copy column
  `SET ${COPY} layout="stack" stackDirection="vertical" stackDistribution="end" stackAlignment="start" gap="28px" padding="120px 48px 64px 56px" width="1.05fr" height="1fr" maxWidth="none" zIndex="2"`,
  `SET ${COPY} appearEffect="null"`,
  // Media column — full height of stage
  `SET ${mediaId} name="Hero Entrance Media" position="relative" width="0.95fr" height="1fr" overflow="clip" fill="${IMAGE}" borderWidth="0px"`,
  // Hide strip that fought the composition
  `SET ${STRIP} visible=false`,
].join("; ")

const r1 = await framer.agent.applyChanges(dslLayout, { pagePath })
console.log("layout", r1.message, r1.errors)

// Mask wrapper for H1 if needed — overflow clip parent of H1
const h1Parent = "qxIyvg6PE" // Native Enquiry Copy
const dslMask = [
  `SET ${h1Parent} layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="20px" overflow="clip" width="1fr"`,
].join("; ")
await framer.agent.applyChanges(dslMask, { pagePath })

// Beat appearEffects (DSL dotted form — proven in repo)
const EASE = "tween 0.22,1,0.36,1"
const dslBeats = [
  // Beat 1 — media fade
  `SET ${mediaId} appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.scale="1.04" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.transition="${EASE} 1.05s 0s"`,
  // Beat 2 — meta
  `SET ${META} appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="14" appearEffect.enter.x="0" appearEffect.enter.scale="1" appearEffect.enter.transition="${EASE} 0.55s 0.28s"`,
  // Beat 3 — display (mask-ish via larger y travel inside overflow parent)
  `SET ${H1} appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="48" appearEffect.enter.x="0" appearEffect.enter.scale="1" appearEffect.enter.transition="${EASE} 0.8s 0.42s"`,
  // Tail — enquiry
  `SET ${ENQUIRY} appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="18" appearEffect.enter.x="0" appearEffect.enter.scale="1" appearEffect.enter.transition="${EASE} 0.55s 0.62s"`,
].join("; ")

const r2 = await framer.agent.applyChanges(dslBeats, { pagePath })
console.log("beats", r2.message, r2.errors)

// Breakpoints: stack vertical on phone — media on top (fade first visually), then copy
const dslBp = [
  `SET aJLpuUP0q${HERO} stackDirection="horizontal" height="680px" gap="0px"`,
  `SET aJLpuUP0q${COPY} padding="96px 32px 48px 32px" width="1fr"`,
  `SET aJLpuUP0q${mediaId} width="1fr" height="1fr"`,
  `SET Qonafp_oD${HERO} stackDirection="vertical" height="auto" gap="0px"`,
  // Phone: media first for fade, then copy — reorder via setParent on replicas if possible
  `SET Qonafp_oD${mediaId} width="1fr" height="280px"`,
  `SET Qonafp_oD${COPY} padding="56px 20px 48px 20px" width="1fr" height="auto"`,
].join("; ")

const r3 = await framer.agent.applyChanges(dslBp, { pagePath })
console.log("bp", r3.message, r3.errors)

// Phone order: media then copy
try {
  await framer.setParent(`Qonafp_oD${mediaId}`, `Qonafp_oD${HERO}`, 0)
  await framer.setParent(`Qonafp_oD${COPY}`, `Qonafp_oD${HERO}`, 1)
  console.log("phone order ok")
} catch (e) {
  console.log("phone order", e.message)
}

const after = await framer.agent.serialize({ id: HERO, depth: 2 }, { pagePath })
console.log(
  JSON.stringify(
    {
      h: after.attributes?.height,
      dir: after.attributes?.stackDirection,
      kids: (after.children || []).map((c) => ({
        id: c.id,
        name: c.name,
        w: c.attributes?.width,
        h: c.attributes?.height,
        fill: c.attributes?.fill ? "yes" : undefined,
        appear: c.attributes?.appearEffect?.enter,
      })),
    },
    null,
    2
  )
)
