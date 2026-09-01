// Collect unique Unsplash B&W URLs already trusted from prior queryImages
const pools = state.bwPools ?? []
const unsplashUrls = []
const seen = new Set()
for (const p of pools) {
  for (const u of p.urls ?? []) {
    if (!u || seen.has(u)) continue
    seen.add(u)
    unsplashUrls.push(u)
  }
}

// Extra archival-leaning Unsplash queries for better file/archive feel
const extraQueries = [
  { query: "historical black and white photograph archive", orientation: "landscape", count: 4, width: 2400 },
  { query: "old black and white street scene film grain", orientation: "landscape", count: 3, width: 2400 },
  { query: "black and white factory industrial archival", orientation: "portrait", count: 3, width: 1600 },
]

for (const q of extraQueries) {
  const res = await framer.agent.queryImages({
    source: "unsplash",
    query: q.query,
    count: q.count,
    orientation: q.orientation,
    width: q.width,
  })
  for (const r of res?.results ?? []) {
    if (!r?.url || seen.has(r.url)) continue
    seen.add(r.url)
    unsplashUrls.push(r.url)
  }
}

state.bwUnsplashAll = unsplashUrls
console.log(JSON.stringify({ unsplashCount: unsplashUrls.length, urls: unsplashUrls }, null, 2))
