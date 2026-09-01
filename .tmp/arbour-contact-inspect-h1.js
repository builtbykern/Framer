const ids = [
  "R80e8PwNu", "DpN8zutuL", "e5xcrxKTw", "AATw4pip9", "qxIyvg6PE",
  "TWVNilHRn", "smzXd5qNf", "jmmPpci8t",
]

async function dump(id) {
  const n = await framer.getNode(id)
  if (!n) return { id, missing: true }
  const o = {
    id: n.id,
    name: n.name,
    visible: n.visible,
    opacity: n.opacity,
    width: n.width,
    height: n.height,
    left: n.left,
    top: n.top,
    right: n.right,
    bottom: n.bottom,
    zIndex: n.zIndex,
    position: n.position,
    textColor: n.textColor,
    backgroundColor: n.backgroundColor,
    overflow: n.overflow,
  }
  // component controls
  for (const k of Object.keys(n)) {
    if (k.startsWith("controls") || k === "componentIdentifier") {
      o[k] = n[k]
    }
  }
  if (n.controls) o.controls = n.controls
  // try common rich text fields
  for (const k of ["html", "text", "plainText", "content", "appearEffect", "appearEffects", "effects"]) {
    if (n[k] != null) {
      const v = n[k]
      o[k] = typeof v === "string" ? v.slice(0, 400) : JSON.stringify(v).slice(0, 400)
    }
  }
  return o
}

const out = {}
for (const id of ids) {
  out[id] = await dump(id)
  out["T_" + id] = await dump("qjv2S9Wpa" + id)
  out["P_" + id] = await dump("jEM0wBo2v" + id)
}
console.log(JSON.stringify(out, null, 2))
