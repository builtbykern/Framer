const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`wrong project ${info.name}`)

const files = await framer.getCodeFiles()
if (!files.length) throw new Error("empty getCodeFiles")

const already = files.find(
    (f) =>
        f.name === "Drift_Plane.tsx" ||
        (f.path && String(f.path).endsWith("Drift_Plane.tsx"))
)
if (!already) {
    throw new Error(
        "Drift_Plane.tsx not found: " + files.map((f) => f.name).join(", ")
    )
}

const code = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx",
    "utf8"
)
if (!code.includes("flex: 0 0 auto")) {
    throw new Error("local file missing flex auto cover")
}
if (!code.includes("line-clamp: unset")) {
    throw new Error("local file missing type unclamp")
}
if (!code.includes("[data-collection-in=\"0\"] [data-framer-name=\"Cover\"]")) {
    throw new Error("local file missing Cover enter")
}
if (!code.includes("playIntro = !freezeAll && !prefersReduced")) {
    throw new Error("Preview intro still gated on Appear Off")
}
if (!code.includes("APPEAR_STAGGER = 0.055")) {
    throw new Error("appear stagger not tightened")
}
if (code.includes("scale: 1.4")) {
    throw new Error("stage still zooms 1.4")
}
if (code.includes("POWER4_INOUT")) {
    throw new Error("power4 in-out still present")
}
if (code.includes("flex: 0 0 320px")) {
    throw new Error("320px slab cover still present")
}
if (code.includes("[data-framer-name=\"Series Meta\"],\n[data-driftplane-mode=\"collection\"] [data-framer-name=\"Meta Line\"] {\n    display: contents")) {
    throw new Error("Series Meta still display contents")
}
if (!code.includes("[data-framer-name=\"Series Meta\"] {\n    display: flex")) {
    throw new Error("Series Meta not flex")
}
if (code.includes("grid-template-rows: subgrid")) {
    throw new Error("subgrid still present")
}

const file = await already.setFileContent(code)
const typeErrors = await file.typecheck({ strict: true })

const applied = await framer.agent.applyChanges(
    [
        'SET RV7bjlgdh $control__view="drift" $control__workList.0="H9TnltXVB";',
        'SET BjqrvIntTRV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'SET nyI5jW7lARV7bjlgdh $control__view="collection" $control__workList.0="H9TnltXVB";',
        'MOVE nt9Gs3MMs parent="gSGwySyKV" index="1";',
        'MOVE XwtyrQVdF parent="YonVwWSco" index="0";',
        'SET YonVwWSco width="100%" gap="6px";',
        'SET gSGwySyKV gap="8px";',
        'SET GAokM9PPJ overflow="visible";',
        'SET FddpNYFNF fontSize="11px" lineHeight="1.4em" overflow="visible";',
        'SET tpUu5gNAo visible="false";',
    ].join(" "),
    { pagePath: "/" }
)

const out = "/Users/noel/Desktop/Framer/.tmp/halden-shots"
fs.mkdirSync(out, { recursive: true })
const shots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "desktop-meta.jpg"],
    ["BjqrvIntT", "tablet-meta.jpg"],
    ["nyI5jW7lA", "phone-meta.jpg"],
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
            id: file.id,
            typeErrors,
            applied,
            shots,
        },
        null,
        2
    )
)
