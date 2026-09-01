const pagePath = "/about"
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"

const proj = await framer.getProjectInfo()
if (proj.name !== "Arbour") throw new Error("wrong " + proj.name)

const T = "xvqDXw58e"
const P = "CYNrpU04t"

const variants = [
  {
    label: "D",
    hero: "QjoW3yYRJ",
    copy: "QzWTnDkey",
    image: "rbeJ3XqVd",
    meta: "aYHA5hByk",
    heroH: "100vh",
    imageH: "70vh",
    copyPad: "40px 48px 56px 48px",
    gap: "0px",
    heroPad: "0px",
  },
  {
    label: "T",
    hero: `${T}QjoW3yYRJ`,
    copy: `${T}QzWTnDkey`,
    image: `${T}rbeJ3XqVd`,
    meta: `${T}aYHA5hByk`,
    heroH: "100vh",
    imageH: "65vh",
    copyPad: "36px 40px 48px 40px",
    gap: "0px",
    heroPad: "0px",
  },
  {
    label: "P",
    hero: `${P}QjoW3yYRJ`,
    copy: `${P}QzWTnDkey`,
    image: `${P}rbeJ3XqVd`,
    meta: `${P}aYHA5hByk`,
    heroH: "auto",
    imageH: "58vh",
    copyPad: "28px 20px 40px 20px",
    gap: "0px",
    heroPad: "0px",
  },
]

for (const v of variants) {
  // Image first (portrait), Paper plaque below
  await framer.setParent(v.image, v.hero, 0)
  await framer.setParent(v.copy, v.hero, 1)

  const dsl = [
    // Hero = full portrait stage, no outer padding (image edge-to-edge)
    `SET ${v.hero} name="Beat 1 — Portrait Stage" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="${v.gap}" padding="${v.heroPad}" overflow="hidden" width="100%" height="${v.heroH}" fill="${PAPER}"`,
    // Dominant image
    `SET ${v.image} name="Opening Image Field" width="100%" height="${v.imageH}" position="relative" overflow="hidden"`,
    // Paper plaque
    `SET ${v.copy} name="Opening Copy" width="100%" height="fit-content" layout="stack" stackDirection="vertical" gap="20px" padding="${v.copyPad}" fill="${PAPER}" position="relative"`,
  ].join("; ")

  const r = await framer.agent.applyChanges(dsl, { pagePath })
  console.log(v.label, r.message, r.errors)

  // Soft entrance: image then copy (modest)
  const fx = [
    `SET ${v.image} appearEffect={"type":"fade","enter":{"opacity":0,"scale":1.03},"exit":{"opacity":0},"transition":{"type":"tween","ease":[0.22,1,0.36,1],"duration":0.9},"threshold":0.2}}`,
    `SET ${v.copy} appearEffect={"type":"fade","enter":{"opacity":0,"y":16},"exit":{"opacity":0},"transition":{"type":"tween","ease":[0.22,1,0.36,1],"duration":0.7,"delay":0.18},"threshold":0.2}}`,
  ].join("; ")
  const r2 = await framer.agent.applyChanges(fx, { pagePath }).catch((e) => ({ message: e.message, errors: e }))
  console.log(v.label, "fx", r2.message, r2.errors)
}

// Verify order + sizes
for (const v of variants) {
  const s = await framer.agent.serialize({ id: v.hero, depth: 2 }, { pagePath })
  console.log(
    "\n",
    v.label,
    s.name,
    "h=",
    s.attributes?.height,
    "pad=",
    s.attributes?.padding,
    "kids=",
    (s.children || []).map((c) => ({
      id: c.id,
      name: c.name,
      h: c.attributes?.height,
      pad: c.attributes?.padding,
    }))
  )
}
