const fs = require("fs")
const path = require("path")

const dir = "/Users/noel/Desktop/Framer/.tmp/halden-src"
const menuSrc = fs.readFileSync(path.join(dir, "Menu_Paper_Reveal.push.tsx"), "utf8")
const grainSrc = fs.readFileSync(path.join(dir, "Paper_Grain.tsx"), "utf8")

if (!menuSrc.includes("data-halden-paper-grain")) {
    throw new Error("menu source missing grain")
}
if (!grainSrc.includes("mixBlendMode")) {
    throw new Error("grain source missing blend")
}

const files = await framer.getCodeFiles()
const menuFile = files.find((f) => f.name === "Menu_Paper_Reveal.tsx")
if (!menuFile) throw new Error("Menu_Paper_Reveal.tsx missing")

const updatedMenu = await menuFile.setFileContent(menuSrc)
const menuErrors = await updatedMenu.typecheck({ strict: true })

let grainFile = files.find((f) => f.name === "Paper_Grain.tsx")
if (!grainFile) {
    grainFile = await framer.createCodeFile("Paper_Grain.tsx", grainSrc)
} else {
    grainFile = await grainFile.setFileContent(grainSrc)
}
const grainErrors = await grainFile.typecheck({ strict: true })

const grainExport = grainFile.exports.find((e) => e.isDefaultExport)
if (!grainExport) throw new Error("Paper_Grain has no default export")

const tokenResult = await framer.agent.applyChanges(
    `SET 38f71e00-788a-47bd-a813-10d6b48f262b light="rgb(247, 241, 232)";`
)

const instanceResult = await framer.agent.applyChanges(
    `SET YZqtWqBlB $control__paper="var(--token-38f71e00-788a-47bd-a813-10d6b48f262b)";
SET lHV5aHgaZYZqtWqBlB $control__paper="var(--token-38f71e00-788a-47bd-a813-10d6b48f262b)";`
)

const workResult = await framer.agent.applyChanges(
    `+ComponentInstanceNode paperGrainWork component="${grainExport.componentId}" parent="rT9WGdFVR" name="Paper Grain" position="absolute" top="0" left="0" width="100%" height="100%" pointerEvents="none" zIndex="2";
SET paperGrainWork $control__amount="0.05";`,
    { pagePath: "/work/:Work" }
)

console.log(
    JSON.stringify(
        {
            menuErrors,
            grainErrors,
            grainComponent: grainExport.componentId,
            tokenResult,
            instanceResult,
            workResult,
        },
        null,
        2
    )
)
