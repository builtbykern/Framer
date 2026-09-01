/**
 * Add redirects for old /properties-2 paths → /properties.
 * Canvas links already relinked (0× properties-2).
 */
const existing = await framer.getRedirects()
const before = existing.map((r) => ({ id: r.id, from: r.from, to: r.to }))

let added = null
let error = null
try {
  added = await framer.addRedirects([
    { from: "/properties-2", to: "/properties", expandToAllLocales: true },
    { from: "/properties-2/*", to: "/properties/:1", expandToAllLocales: true },
  ])
} catch (e) {
  error = String(e.message || e)
}

const after = (await framer.getRedirects()).map((r) => ({
  id: r.id,
  from: r.from,
  to: r.to,
  expandToAllLocales: r.expandToAllLocales,
}))

console.log(JSON.stringify({ before, added: added?.map?.((r) => ({ id: r.id, from: r.from, to: r.to })) ?? added, error, after }, null, 2))
