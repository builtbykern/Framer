const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const t = await framer.agent.getNode({ id: "BjqrvIntT" }, { pagePath: "/" })
const p = await framer.agent.getNode({ id: "nyI5jW7lA" }, { pagePath: "/" })
const tp = await framer.agent.getNode({ id: "BjqrvIntTRV7bjlgdh" }, { pagePath: "/" })
const pp = await framer.agent.getNode({ id: "nyI5jW7lARV7bjlgdh" }, { pagePath: "/" })
const files = await framer.getCodeFiles()
const drift = await files.find((f) => f.id === "Og5966a").content

const shots = await framer.agent.readProject(
    [
        { type: "screenshot", id: "BjqrvIntT" },
        { type: "screenshot", id: "nyI5jW7lA" },
    ],
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            tabletH: t?.attributes?.height,
            phoneH: p?.attributes?.height,
            tabletPlaneH: tp?.attributes?.height,
            phonePlaneH: pp?.attributes?.height,
            coverHidden: drift.includes('[data-framer-name="Cover"],') &&
                drift.includes('[data-framer-name="Slug"]'),
            stillsNoClip: drift.includes("max-height: none !important"),
            wider: drift.includes("/ 2.9)"),
            tablet: shots.results?.[0]?.image_url,
            phone: shots.results?.[1]?.image_url,
        },
        null,
        2
    )
)
