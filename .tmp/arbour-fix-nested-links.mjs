/* Fix nested <a>: set UnderlineLink decorative=true inside linked frames */
const jobs = [
  {
    pagePath: "/",
    // primary instances (replicas inherit when linked)
    ids: ["CAdGD1vAP", "h0vfeOTBw", "f2fxMg6nz", "LL2hvcJ80"],
  },
  {
    pagePath: "/properties-2",
    ids: ["gAOwaKVbo"],
  },
  {
    pagePath: "/contact",
    ids: ["BMhLvwqld"],
  },
]

const results = []
for (const job of jobs) {
  const dsl = job.ids
    .map((id) => `SET ${id} $control__decorative=true`)
    .join("; ")
  const res = await framer.agent.applyChanges(dsl, { pagePath: job.pagePath })
  results.push({ pagePath: job.pagePath, dsl, res })
}

// Also set breakpoint replicas explicitly (prefixes seen in scan)
const replicaJobs = [
  {
    pagePath: "/",
    ids: [
      "U3TeNUVXvCAdGD1vAP",
      "U3TeNUVXvh0vfeOTBw",
      "U3TeNUVXvf2fxMg6nz",
      "U3TeNUVXvLL2hvcJ80",
      "pmAxXUJ0oCAdGD1vAP",
      "pmAxXUJ0oh0vfeOTBw",
      "pmAxXUJ0of2fxMg6nz",
      "pmAxXUJ0oLL2hvcJ80",
    ],
  },
  {
    pagePath: "/properties-2",
    ids: ["SScKalu3BgAOwaKVbo", "EK6d5SyWLgAOwaKVbo"],
  },
  {
    pagePath: "/contact",
    ids: ["qjv2S9WpaBMhLvwqld", "jEM0wBo2vBMhLvwqld"],
  },
]

for (const job of replicaJobs) {
  const dsl = job.ids
    .map((id) => `SET ${id} $control__decorative=true`)
    .join("; ")
  const res = await framer.agent.applyChanges(dsl, { pagePath: job.pagePath })
  results.push({ pagePath: job.pagePath, replica: true, res })
}

console.log(JSON.stringify(results, null, 2))
