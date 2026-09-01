const ids = [
  "jmmPpci8t",
  "AATw4pip9",
  "qxIyvg6PE",
  "TWVNilHRn",
  "DpN8zutuL",
  "R80e8PwNu",
  "WLSMm5iy1",
  "smzXd5qNf",
  "uONXSHosa",
  "Ri5b6vVlA",
  "zQumCoq6L",
  "e5xcrxKTw",
  "mJdtIzdKI",
  "QX_Yf1Pyd",
]

function dig(obj, path = "", out = []) {
  if (!obj || typeof obj !== "object") return out
  for (const [k, v] of Object.entries(obj)) {
    const p = path ? path + "." + k : k
    if (/appear|effect|transition|variant|gesture|scroll/i.test(k)) {
      out.push([p, typeof v === "object" ? JSON.stringify(v).slice(0, 400) : String(v)])
    }
    if (v && typeof v === "object" && !Array.isArray(v) && path.split(".").length < 3) {
      dig(v, p, out)
    }
  }
  return out
}

const out = {}
for (const id of ids) {
  const n = await framer.getNode(id)
  if (!n) {
    out[id] = null
    continue
  }
  const effects = dig(n)
  // also try known props
  const known = {}
  for (const k of [
    "appearEffect",
    "appearEffects",
    "effects",
    "transition",
    "opacity",
    "visible",
  ]) {
    if (n[k] != null) known[k] = n[k]
  }
  out[id] = {
    name: n.name,
    known,
    dug: effects.slice(0, 20),
  }
}

// BP replicas of key animated nodes
for (const base of ["R80e8PwNu", "TWVNilHRn", "WLSMm5iy1", "AATw4pip9"]) {
  for (const pref of ["qjv2S9Wpa", "jEM0wBo2v"]) {
    const id = pref + base
    const n = await framer.getNode(id)
    if (!n) continue
    out[id] = { name: n.name, appear: n.appearEffect || n.appearEffects || null }
  }
}

console.log(JSON.stringify(out, null, 2))
