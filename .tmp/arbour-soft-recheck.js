/** Soft-issue recheck after polish */
const mailto = new Set()
const http = new Set()
const texts = []

function walk(n) {
  if (!n || typeof n !== "object") return
  const href = n.attributes?.link?.href
  const cl = n.attributes?.["$control__link"]
  if (typeof href === "string") {
    if (href.startsWith("mailto:")) mailto.add(href)
    if (/^https?:\/\//i.test(href)) http.add(href)
  }
  if (typeof cl === "string") {
    if (cl.startsWith("mailto:")) mailto.add(cl)
    if (/^https?:\/\//i.test(cl)) http.add(cl)
  }
  const t = n.attributes?.text
  if (typeof t === "string" && /arbour\.(london|estate)|enquiries@/i.test(t)) texts.push(t)
  for (const c of n.children || []) walk(c)
  for (const b of n.$breakpoints || []) walk(b)
  for (const v of n.$variants || n.variants || []) walk(v)
}

for (const p of await framer.getNodesWithType("WebPageNode")) {
  walk(await framer.agent.serialize({ id: p.id, depth: 22 }, {}))
}
for (const id of ["ynpqYJGOd", "pXUahiblU"]) {
  try {
    walk(await framer.agent.serialize({ id, depth: 18 }, {}))
  } catch {}
}

const soft = []
if (mailto.size !== 1 || ![...mailto][0]?.includes("arbour.london")) {
  soft.push({ type: "mailto", values: [...mailto] })
}
const placeholders = [...http].filter((h) =>
  ["https://instagram.com", "https://linkedin.com", "https://x.com"].includes(h)
)
if (placeholders.length) soft.push({ type: "placeholder-social", values: placeholders })
if (texts.some((t) => /estate/i.test(t))) soft.push({ type: "estate-text", values: texts })

console.log(
  JSON.stringify(
    {
      mailto: [...mailto],
      http: [...http],
      contactTexts: [...new Set(texts)],
      softIssues: soft,
      ok: soft.length === 0,
    },
    null,
    2
  )
)
