const ids = {
  h1: "R80e8PwNu",
  wrap: "DpN8zutuL",
  copy: "AATw4pip9",
  native: "qxIyvg6PE",
  meta: "TWVNilHRn",
  media: "WLSMm5iy1",
  wash: "smzXd5qNf",
  hero: "jmmPpci8t",
  noise: "zQumCoq6L",
}

function pick(n) {
  if (!n) return null
  const o = {
    id: n.id,
    name: n.name,
    w: n.width,
    h: n.height,
    maxW: n.maxWidth,
    left: n.left,
    top: n.top,
    right: n.right,
    bottom: n.bottom,
    pos: n.position,
    opacity: n.opacity,
    z: n.zIndex,
    font: n.font,
    fontSize: n.fontSize,
    letterSpacing: n.letterSpacing,
    lineHeight: n.lineHeight,
    textAlign: n.textAlign,
    padding: n.padding,
    gap: n.gap,
    layout: n.layout,
    stackDirection: n.stackDirection,
    justifyContent: n.justifyContent,
    alignItems: n.alignItems,
  }
  return o
}

const out = {}
for (const [k, id] of Object.entries(ids)) {
  const n = await framer.getNode(id)
  out[k] = pick(n)
  // dump more keys for h1/media
  if (k === "h1" || k === "media" || k === "copy" || k === "native") {
    const extras = {}
    for (const key of Object.keys(n || {})) {
      if (/font|size|line|letter|appear|effect|align|padding|gap|image|background|fit|object|overflow|max/i.test(key)) {
        try {
          extras[key] = JSON.parse(JSON.stringify(n[key]))
        } catch {
          extras[key] = String(n[key]).slice(0, 120)
        }
      }
    }
    out[k + "_x"] = extras
  }
}

// text
const h1 = await framer.getNode(ids.h1)
if (h1?.getText) out.h1Text = await h1.getText()

// color styles / text styles?
console.log(JSON.stringify(out, null, 2))
