/**
 * Probe: can we bind Neighbourhoods collectionId on a new/cloned detail page?
 * READ + experimental create — will remove if bind fails.
 */
const NH = "U0QLvHg7O"
const JOURNAL_DETAIL = "YPPO8pJ92"
const PROP_DETAIL = "OhRUQROL4"

const methods = []
const propPage = await framer.getNode(PROP_DETAIL)
for (const k of Object.keys(propPage)) methods.push(k)
const proto = Object.getOwnPropertyNames(Object.getPrototypeOf(propPage) || {})
methods.push(...proto)

let cloneResult = null
let createResult = null
let setResult = null

// Try setAttributes on a throwaway create
const created = await framer.createWebPage("/neighbourhoods-detail-probe")
createResult = {
  id: created.id,
  path: created.path,
  collectionId: created.collectionId,
}

try {
  await created.setAttributes({ collectionId: NH })
  const again = await framer.getNode(created.id)
  setResult = { collectionId: again.collectionId, path: again.path }
} catch (e) {
  setResult = { error: String(e.message || e) }
}

// Also try DSL
let dslResult = null
try {
  dslResult = await framer.agent.applyChanges(
    `SET ${created.id} collectionId="${NH}";`,
    { pagePath: created.path || "/neighbourhoods-detail-probe" }
  )
  const after = await framer.getNode(created.id)
  dslResult = { ...dslResult, collectionId: after.collectionId }
} catch (e) {
  dslResult = { error: String(e.message || e) }
}

// Cleanup probe page if unbound
const final = await framer.getNode(created.id)
let removed = false
if (!final.collectionId) {
  try {
    await final.remove()
    removed = true
  } catch (e) {
    // try draft or delete via DSL
    try {
      await framer.agent.applyChanges(`DEL ${created.id};`, { pagePath: "/" })
      removed = "DEL"
    } catch (e2) {
      removed = String(e2.message || e2)
    }
  }
}

console.log(
  JSON.stringify(
    {
      pageMethods: [...new Set(methods)].filter((m) => /collection|setAttr|path|clone|remove/i.test(m)),
      createResult,
      setResult,
      dslResult,
      removed,
      finalCollectionId: final?.collectionId,
    },
    null,
    2
  )
)
