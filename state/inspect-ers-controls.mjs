const f = await framer.getCodeFile("Edge_Refraction_Shader.tsx")
const sc = f.content || ""
let controls = null
try {
    controls = await framer.agent.readComponentControls({
        componentIds: ["codeFile/fSXYT_3:default"],
    })
} catch (e) {
    controls = String(e)
}
console.log(
    JSON.stringify(
        {
            lines: sc.split("\n").length,
            hasSlot: /ControlType\.Slot/.test(sc),
            hasChildrenInControls: /addPropertyControls[\s\S]{0,2000}children\s*:/.test(
                sc
            ),
            hasSvgParent: /createEdgeFilterSvg/.test(sc),
            hasParentCapture: /parentElement/.test(sc),
            rootFixedInComponent: /position:\s*["']fixed["']/.test(sc),
            controls,
        },
        null,
        2
    )
)
