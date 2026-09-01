const fs = require("fs")
const path = require("path")
const dir = "/Users/noel/Desktop/Framer/.tmp/col-shots"

await framer.agent.readComponentControls({ componentIds: ["PzdF7MhGJ"] })

const polish = await framer.agent.applyChanges(
    `
SET Fyj0MwAfG $control__description="var(--variable-nVT6VC7MK)" $control__slug="var(--variable-v1_jAZuNB)";
SET iWh5R5Mzq textStylePreset="Title";
SET yhVuy25KbQ6fE1RPzM padding="16px 0px 32px 16px" gap="16px";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

const info = await framer.getProjectInfo()
const pages = await framer.agent.getNodesOfTypes({ types: ["WebPageNode"] })
const inst = await framer.agent.serializeNodes({
    ids: ["Fyj0MwAfG"],
    depth: 0,
})

for (const [id, name] of [
    ["uSuSQYtM4", "info-desktop.jpg"],
    ["cEK2oDAzz", "contact-desktop.jpg"],
    ["hh6O1ngaE", "404-desktop.jpg"],
    ["yhVuy25Kb", "home-phone-2.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(path.join(dir, name), r.data)
}

console.log(
    JSON.stringify(
        {
            polish,
            project: { id: info.id, name: info.name, url: info.url },
            pages: pages.map((p) => ({
                id: p.id,
                name: p.name,
                path: p.attributes?.path,
            })),
            instControls: inst[0]?.attributes,
        },
        null,
        2
    )
)
