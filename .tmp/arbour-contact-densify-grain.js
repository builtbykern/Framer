const pagePath = "/contact"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"
const HERO = "jmmPpci8t"
const COPY = "AATw4pip9"
const MEDIA = "WLSMm5iy1"
const H1 = "R80e8PwNu"
const NATIVE = "qxIyvg6PE"
const ENQUIRY = "uONXSHosa"
const NOISE = "zQumCoq6L"
const T = "qjv2S9Wpa"
const P = "jEM0wBo2v"
const IMAGE =
  "https://framerusercontent.com/images/5Ytxn8avZFwlwp4Ng3t8PDU56Lk.png"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

// 1) Densify desktop — full-bleed stage, media heavier, less padding
const dsl1 = [
  // Drop 1200 maxWidth (was creating side air). Full bleed split.
  `SET ${HERO} layout="stack" stackDirection="horizontal" stackDistribution="start" stackAlignment="start" gap="0px" padding="0px" width="1fr" height="780px" fill="${PAPER}" overflow="clip"`,
  // Clear maxWidth via setAttributes after
  `SET ${COPY} layout="stack" stackDirection="vertical" stackDistribution="end" stackAlignment="start" gap="18px" padding="88px 36px 48px 40px" width="0.78fr" height="1fr" zIndex="2"`,
  `SET ${MEDIA} width="1.22fr" height="1fr" overflow="clip" fill="${IMAGE}"`,
  `SET ${NATIVE} gap="16px" width="1fr" overflow="clip"`,
  `SET ${H1} width="1fr" maxWidth="640px"`,
  `SET ${ENQUIRY} padding="8px 0px 0px 0px" gap="12px"`,
  // Soft grain — still Arbour-quiet
  `SET ${NOISE} opacity="0.07" $control__grainStrength="0.08" $control__patternSize="240" $control__blendMode="Soft Light"`,
].join("; ")

const r1 = await framer.agent.applyChanges(dsl1, { pagePath })
console.log("desk", r1.message, r1.errors)

// Clear maxWidth on hero/copy if still set
await framer.setAttributes(HERO, { maxWidth: null })
await framer.setAttributes(COPY, { maxWidth: null })

// 2) BP densify
const dsl2 = [
  `SET ${T}${HERO} stackDirection="horizontal" height="640px" gap="0px" padding="0px" overflow="clip"`,
  `SET ${T}${COPY} padding="72px 28px 40px 28px" width="0.85fr" height="1fr" gap="14px"`,
  `SET ${T}${MEDIA} width="1.15fr" height="1fr" fill="${IMAGE}" overflow="clip"`,
  `SET ${P}${HERO} stackDirection="vertical" height="auto" gap="0px" padding="0px" overflow="clip"`,
  `SET ${P}${MEDIA} width="1fr" height="320px" fill="${IMAGE}" overflow="clip"`,
  `SET ${P}${COPY} padding="40px 20px 36px 20px" width="1fr" height="auto" gap="14px"`,
].join("; ")

const r2 = await framer.agent.applyChanges(dsl2, { pagePath })
console.log("bp", r2.message, r2.errors)

const after = await framer.agent.serialize({ id: HERO, depth: 2 }, { pagePath })
const noise = await framer.agent.serialize({ id: NOISE, depth: 0 }, { pagePath })
console.log(
  JSON.stringify(
    {
      hero: {
        h: after.attributes?.height,
        maxW: after.attributes?.maxWidth,
        w: after.attributes?.width,
      },
      kids: (after.children || []).map((c) => ({
        name: c.name,
        w: c.attributes?.width,
        pad: c.attributes?.padding,
        gap: c.attributes?.gap,
        dist: c.attributes?.stackDistribution,
      })),
      noise: {
        opacity: noise.attributes?.opacity,
        grain: noise.attributes?.["$control__grainStrength"],
      },
    },
    null,
    2
  )
)
