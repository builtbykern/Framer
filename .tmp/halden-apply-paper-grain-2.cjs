const files = await framer.getCodeFiles()
const grainFile = files.find((f) => f.name === "Paper_Grain.tsx")
const menuFile = files.find((f) => f.name === "Menu_Paper_Reveal.tsx")
if (!grainFile || !menuFile) throw new Error("missing code files")

const grainErrors = await grainFile.typecheck({ strict: true })
const menuErrors = await menuFile.typecheck({ strict: true })
const grainExport = grainFile.exports.find((e) => e.isDefaultExport)
if (!grainExport) throw new Error("no grain export")

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
            instanceResult,
            workResult,
        },
        null,
        2
    )
)
