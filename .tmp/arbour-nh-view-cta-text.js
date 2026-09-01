const n = await framer.agent.serialize({ id: "d9SNjsdke", depth: 4 }, { pagePath: "/neighbourhoods" })
console.log(JSON.stringify(n, null, 2).slice(0, 4000))

// Also check T/P replicas for same nodes
for (const id of ["aJLpuUP0qd9SNjsdke", "Qonafp_oDd9SNjsdke"]) {
  try {
    const r = await framer.agent.serialize({ id, depth: 2 }, {})
    console.log(id, r?.attributes?.visible, r?.attributes?.textColor)
  } catch (e) {
    console.log(id, "missing", e.message)
  }
}
