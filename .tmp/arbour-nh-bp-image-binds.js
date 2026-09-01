const pagePath = "/neighbourhoods"

// Primary + BP replicas for media instance and photo frame
const mediaIds = [
  ["D", "z2kRrpzAZ"],
  ["T", "aJLpuUP0qz2kRrpzAZ"],
  ["P", "Qonafp_oDz2kRrpzAZ"],
]
const photoIds = [
  ["D", "hX5NduSNi"],
  ["T", "aJLpuUP0qhX5NduSNi"],
  ["P", "Qonafp_oDhX5NduSNi"],
]

const controlKeys = [
  "$control__image",
  "$control__imageB",
  "$control__imageC",
  "$control__interval",
  "$control__zoom",
  "$control__showView",
  "$control__viewLabel",
  "$control__accent",
  "$control__cueBG",
]

const medias = {}
for (const [bp, id] of mediaIds) {
  try {
    const n = await framer.agent.serialize({ id, depth: 1 }, { pagePath })
    const a = n.attributes || {}
    const controls = {}
    for (const k of controlKeys) controls[k] = a[k] ?? null
    // Also capture any $control__* present
    const allControls = {}
    for (const [k, v] of Object.entries(a)) {
      if (k.startsWith("$control__")) allControls[k] = v
    }
    medias[bp] = {
      id,
      exists: true,
      type: n.type,
      name: n.name,
      w: a.width,
      h: a.height,
      position: a.position,
      controls: allControls,
    }
  } catch (e) {
    medias[bp] = { id, exists: false, error: String(e.message || e) }
  }
}

const photos = {}
for (const [bp, id] of photoIds) {
  try {
    const n = await framer.agent.serialize({ id, depth: 2 }, { pagePath })
    const a = n.attributes || {}
    photos[bp] = {
      id,
      h: a.height,
      minH: a.minHeight,
      maxH: a.maxHeight,
      kids: (n.children || []).map((c) => ({
        id: c.id,
        type: c.type,
        name: c.name,
        controls: Object.fromEntries(
          Object.entries(c.attributes || {}).filter(([k]) => k.startsWith("$control__"))
        ),
      })),
    }
  } catch (e) {
    photos[bp] = { id, error: String(e.message || e) }
  }
}

// Compare D vs T/P image binds
function diff(base, other, label) {
  const missing = []
  const mismatched = []
  const b = base?.controls || {}
  const o = other?.controls || {}
  for (const k of ["$control__image", "$control__imageB", "$control__imageC"]) {
    if (b[k] && !o[k]) missing.push(k)
    else if (b[k] && o[k] && b[k] !== o[k]) mismatched.push({ k, base: b[k], other: o[k] })
  }
  return { label, missing, mismatched, otherExists: !!other?.exists }
}

const diffs = [
  diff(medias.D, medias.T, "D→T"),
  diff(medias.D, medias.P, "D→P"),
]

console.log(JSON.stringify({ medias, photos, diffs }, null, 2))
