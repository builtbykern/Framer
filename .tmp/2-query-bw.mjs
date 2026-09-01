// Fetch B&W archival stock via Unsplash (Framer-trusted), mix queries for variety.
const queries = [
  { query: "black and white archival photograph historical", orientation: "portrait", count: 4 },
  { query: "vintage black and white documentary photography", orientation: "landscape", count: 4 },
  { query: "monochrome film photography architecture", orientation: "landscape", count: 3 },
  { query: "black and white portrait archival", orientation: "portrait", count: 3 },
]

const pools = []
for (const q of queries) {
  const res = await framer.agent.queryImages({
    source: "unsplash",
    query: q.query,
    count: q.count,
    orientation: q.orientation,
  })
  pools.push({
    query: q.query,
    ok: !res?.error,
    error: res?.error ?? null,
    count: res?.results?.length ?? 0,
    sample: (res?.results ?? []).slice(0, 2).map((r) => ({
      url: r.url,
      description: r.description ?? r.alt ?? r.altText ?? null,
      width: r.width,
      height: r.height,
    })),
    urls: (res?.results ?? []).map((r) => r.url).filter(Boolean),
  })
}

// Try lummi source (may be unsupported)
let lummi = null
try {
  lummi = await framer.agent.queryImages({
    source: "lummi",
    query: "black and white archival",
    count: 4,
    orientation: "landscape",
  })
} catch (e) {
  lummi = { error: String(e?.message ?? e) }
}

state.bwPools = pools.map((p) => ({ query: p.query, urls: p.urls }))
state.bwLummi = lummi

console.log(
  JSON.stringify(
    {
      pools: pools.map((p) => ({
        query: p.query,
        ok: p.ok,
        error: p.error,
        count: p.count,
        sample: p.sample,
      })),
      lummi: {
        error: lummi?.error ?? null,
        count: lummi?.results?.length ?? 0,
        sample: (lummi?.results ?? []).slice(0, 2),
      },
    },
    null,
    2
  )
)
