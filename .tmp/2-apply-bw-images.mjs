const pagePath = "/"

// Lummi B&W (must uploadImage — queryImages only supports unsplash)
const lummiSources = [
  {
    name: "lummi-urban-solitude",
    altText: "Black and white urban solitude",
    image:
      "https://assets.lummi.ai/assets/QmbvWqaAMzAG83Gezrn27c64kQqPtvVCBXLBqtvZHi7Yrd?auto=format&w=2000",
  },
  {
    name: "lummi-minimal-architecture",
    altText: "Black and white minimalist architecture",
    image:
      "https://assets.lummi.ai/assets/QmNviZ1wihkVgRVNXEKfnVXTTZPTaJyQwKQNgspEc38D5U?auto=format&w=2000",
  },
  {
    name: "lummi-city-street",
    altText: "Black and white city street scene",
    image:
      "https://assets.lummi.ai/assets/QmXrLAiBVQscmvLzWxo9pkpoDREGNTLqfRpyPnPixKoybt?auto=format&w=2000",
  },
  {
    name: "lummi-bw-elegance",
    altText: "Black and white elegance archival portrait",
    image:
      "https://assets.lummi.ai/assets/QmWbWea5tP7NTXJKzS4RRay96SMsZCtiFjDYw2w1q7Bt7m?auto=format&w=2000",
  },
  {
    name: "lummi-bw-portrait",
    altText: "Striking black and white portrait",
    image:
      "https://assets.lummi.ai/assets/QmXiaQ9h9fNHxmGEwP11BLiyZLsA9fjd1atLH6s1gMH9DR?auto=format&w=2000",
  },
]

const lummiUploaded = []
for (const src of lummiSources) {
  try {
    const asset = await framer.uploadImage({
      image: src.image,
      name: src.name,
      altText: src.altText,
    })
    lummiUploaded.push({ name: src.name, url: asset.url, ok: true })
  } catch (e) {
    lummiUploaded.push({
      name: src.name,
      ok: false,
      error: String(e?.message ?? e),
    })
  }
}

// Unsplash — already trusted via queryImages in this session
const unsplash = (state.bwUnsplashAll ?? []).filter(Boolean)

// Prefer documentary / archival feel for hero + mid; mix sources across grid
const pick = (i) => unsplash[i] ?? unsplash[0]

const lummiOk = lummiUploaded.filter((x) => x.ok).map((x) => x.url)

const assignment = {
  // Hero — Unsplash documentary
  IqkAsAQ8x: pick(4), // ticket seller
  // Gallery 3×2
  dGGpJGXKt: lummiOk[0] ?? pick(0),
  DOrgq4XwV: pick(5), // piano
  jxJCbtg87: lummiOk[1] ?? pick(1),
  cwuWibJKh: pick(9), // architecture
  Bgck_SHmU: lummiOk[2] ?? pick(2),
  UhPyvszvO: pick(1), // building
  // Mid — architecture landscape
  YLwGf0zVk: pick(10) ?? pick(8),
  // Closing pair
  jbQyaF5qX: lummiOk[3] ?? pick(11),
  y48hWlHKu: lummiOk[4] ?? pick(6),
}

const dsl = Object.entries(assignment)
  .map(([id, url]) => `SET ${id} fill="${url}"`)
  .join("; ")

const result = await framer.agent.applyChanges(dsl, { pagePath })

state.bwAssignment = assignment
state.bwLummiUploaded = lummiUploaded

console.log(
  JSON.stringify(
    {
      lummiUploaded,
      apply: result,
      assignment: Object.fromEntries(
        Object.entries(assignment).map(([k, v]) => [
          k,
          String(v).slice(0, 90),
        ])
      ),
    },
    null,
    2
  )
)
