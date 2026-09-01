const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`wrong project ${info.name}`)

const files = await framer.getCodeFiles()
if (!files.length) throw new Error("empty getCodeFiles")

const drift = files.find(
    (f) =>
        f.name === "Drift_Plane.tsx" ||
        (f.path && String(f.path).endsWith("Drift_Plane.tsx"))
)
const stills = files.find(
    (f) =>
        f.name === "Series_Stills.tsx" ||
        (f.path && String(f.path).endsWith("Series_Stills.tsx"))
)
if (!drift) throw new Error("Drift_Plane.tsx not found")
if (!stills) throw new Error("Series_Stills.tsx not found")

const driftCode = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
const stillsCode = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Series_Stills.tsx",
    "utf8"
)
if (!driftCode.includes("function fillDriftCover")) {
    throw new Error("missing fillDriftCover")
}
if (!driftCode.includes('overflowX: freezeAll ? "visible"')) {
    throw new Error("missing freeze overflow visible")
}
if (!driftCode.includes("min-height: 320px")) {
    throw new Error("missing 320 cover min")
}
if (!stillsCode.includes("const stacked = inCollection || freeze")) {
    throw new Error("Series Stills freeze stack missing")
}

const driftFile = await drift.setFileContent(driftCode)
const stillsFile = await stills.setFileContent(stillsCode)
const typeErrors = {
    drift: await driftFile.typecheck({ strict: true }),
    stills: await stillsFile.typecheck({ strict: true }),
}

const card = await framer.agent.getNode({ id: "gSGwySyKV" }, { pagePath: "/" })
const metaLine = (card?.children || [])
    .flatMap((child) => [child, ...(child.children || [])])
    .find((n) => n?.name === "Meta Line" || n?.attributes?.name === "Meta Line")

const sets = [
    'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
    'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB" $control__padTop="72";',
    'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
    'MOVE nt9Gs3MMs parent="gSGwySyKV" index="1";',
    'SET nt9Gs3MMs position="relative" top="auto" left="auto" width="100%" height="320px" overflow="clip";',
    'SET gSGwySyKV layout="stack" stackDirection="vertical" stackAlignment="start" stackDistribution="start" gap="8px" height="auto" overflow="visible";',
    'SET YonVwWSco layout="stack" stackDirection="vertical" stackAlignment="start" width="100%" height="auto" overflow="visible" gap="6px";',
    'SET GAokM9PPJ width="100%" height="auto" overflow="visible";',
    'SET XwtyrQVdF width="100%" height="auto";',
    'SET FddpNYFNF width="100%" height="auto" overflow="visible" fontSize="11px" lineHeight="1.4em";',
    'SET cMyCjMOpL width="100%" height="auto" overflow="visible";',
    'SET yGFlVus2I width="100%" height="auto";',
    'SET tpUu5gNAo visible="false";',
]
if (metaLine?.id) {
    sets.push(
        `SET ${metaLine.id} layout="stack" stackDirection="vertical" stackAlignment="start" width="100%" height="auto" overflow="visible";`
    )
}

const applied = await framer.agent.applyChanges(sets.join(" "), {
    pagePath: "/",
})

const cover = await framer.agent.getNode({ id: "nt9Gs3MMs" }, { pagePath: "/" })
const a = cover?.attributes || {}

const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "desktop-stack.jpg"],
    ["BjqrvIntT", "tablet-stack.jpg"],
    ["nyI5jW7lA", "phone-stack.jpg"],
]) {
    try {
        const r = await framer.screenshot(id, { format: "jpeg", scale: 2 })
        fs.writeFileSync(path.join(out, name), r.data)
        shots[name] = r.data.length
    } catch (e) {
        shots[name] = String(e)
    }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            driftId: driftFile.id,
            stillsId: stillsFile.id,
            typeErrors,
            metaLine: metaLine?.id || null,
            cover: {
                position: a.position,
                top: a.top,
                left: a.left,
                width: a.width,
                height: a.height,
            },
            applied,
            shots,
        },
        null,
        2
    )
)
