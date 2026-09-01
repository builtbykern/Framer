async function kids(id) {
  const n = await framer.getNode(id)
  const ch = (await n.getChildren?.()) || []
  return Promise.all(
    ch.map(async (c) => {
      const o = {
        id: c.id,
        name: c.name,
        type: c.__class || c.type,
        w: c.width,
        h: c.height,
        flex: c.flex,
        justifyContent: c.justifyContent,
        stackDistribution: c.stackDistribution,
        padding: c.padding,
        gap: c.gap,
        opacity: c.opacity,
      }
      return o
    })
  )
}

console.log("copy", JSON.stringify(await kids("AATw4pip9"), null, 2))
console.log("native", JSON.stringify(await kids("qxIyvg6PE"), null, 2))

const copy = await framer.getNode("AATw4pip9")
for (const k of Object.keys(copy)) {
  if (/justify|align|distrib|stack|flex|gap|pad|appear|effect/i.test(k)) {
    console.log("copy." + k, JSON.stringify(copy[k]))
  }
}

const media = await framer.getNode("WLSMm5iy1")
console.log("media bg", JSON.stringify({
  image: media.backgroundImage,
  position: media.backgroundImagePosition || media.imagePosition,
  size: media.backgroundImageSize || media.imageSize,
  keys: Object.keys(media).filter((k) => /image|fit|position|object|appear|effect/i.test(k)),
}))
for (const k of Object.keys(media)) {
  if (/image|fit|position|object|appear|effect|background/i.test(k)) {
    try { console.log("media." + k, JSON.stringify(media[k]).slice(0, 200)) } catch {}
  }
}

// text style Display — can we override fontSize on node?
const h1 = await framer.getNode("R80e8PwNu")
console.log("h1 keys sample", Object.keys(h1).filter(k => /font|size|style|color|html|text|letter|line/i.test(k)))
