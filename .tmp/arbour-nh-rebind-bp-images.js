const pagePath = "/neighbourhoods"

// Inspect collectionList on checkerboards
const boards = ["km7dUqZI9", "aJLpuUP0qkm7dUqZI9", "Qonafp_oDkm7dUqZI9"]
const boardInfo = {}
for (const id of boards) {
  const n = await framer.agent.serialize({ id, depth: 2 }, { pagePath })
  const a = n.attributes || {}
  const colKeys = Object.fromEntries(
    Object.entries(a).filter(([k]) => /collection|variable|repeat/i.test(k))
  )
  boardInfo[id] = {
    name: n.name,
    mq: n.$mediaQuery?.name,
    kids: (n.children || []).map((c) => c.id),
    colKeys,
    // dump keys that look relevant
    allInteresting: Object.fromEntries(
      Object.entries(a).filter(
        ([k]) =>
          k.includes("collection") ||
          k.includes("Collection") ||
          k.startsWith("$") ||
          k === "layout"
      )
    ),
  }
}

const HERO = "var(--variable-dM8yn13g7)"
const MAP = "var(--variable-ppzgDk7Mi)"

const medias = ["z2kRrpzAZ", "aJLpuUP0qz2kRrpzAZ", "Qonafp_oDz2kRrpzAZ"]
const cmds = []

// Clear then rebind image controls (quoted) on every BP replica
for (const id of medias) {
  cmds.push(`SET ${id} $control__image="null" $control__imageB="null"`)
}
for (const id of medias) {
  cmds.push(
    `SET ${id} $control__image="${HERO}" $control__imageB="${MAP}" $control__showView="false" $control__interval="900" $control__zoom="1.04"`
  )
}

const res = await framer.agent.applyChanges(cmds.join(";\n"), { pagePath })

const after = {}
for (const id of medias) {
  const n = await framer.agent.serialize({ id, depth: 1 }, { pagePath })
  after[id] = {
    image: n.attributes?.$control__image,
    imageB: n.attributes?.$control__imageB,
  }
}

console.log(JSON.stringify({ boardInfo, message: res?.message, errors: res?.errors, after }, null, 2))
