const info = await framer.getProjectInfo()
const files = await framer.getCodeFiles()
const shader = await framer.getCodeFile("Edge_Refraction_Shader.tsx")
const desk = await framer.agent.getNode({ id: "WQLkyLRf1" }, { pagePath: "/" })
const overlay = await framer.agent.getNode({ id: "jabCEPhKE" }, { pagePath: "/" })

let parentOfOverlay = null
try {
    if (overlay?.parentId) {
        parentOfOverlay = await framer.agent.getNode(
            { id: overlay.parentId },
            { pagePath: "/" }
        )
    }
} catch (e) {
    parentOfOverlay = { err: String(e) }
}

const content = shader?.content || ""
console.log(
    JSON.stringify(
        {
            project: info.name,
            files: files.map((f) => f.name),
            deskOverride: desk?.attributes?.codeOverride ?? null,
            deskName: desk?.name,
            deskOverflow: desk?.attributes?.overflow,
            overlay: {
                id: overlay?.id,
                name: overlay?.name,
                type: overlay?.type,
                parentId: overlay?.parentId,
                position: overlay?.attributes?.position,
                zIndex: overlay?.attributes?.zIndex,
                opacity: overlay?.attributes?.opacity,
                visible: overlay?.attributes?.visible,
                component:
                    overlay?.attributes?.componentId ||
                    overlay?.attributes?.component,
            },
            parentOfOverlay: parentOfOverlay && {
                id: parentOfOverlay.id,
                name: parentOfOverlay.name,
                type: parentOfOverlay.type,
                position: parentOfOverlay.attributes?.position,
            },
            liveHasSiblingTargets: content.includes("overlayHost.contains"),
            liveHasPageRootFilter: /pageRoot\.style\.filter/.test(content),
            liveHasFe: content.includes("feDisplacementMap"),
            liveHasFollow: content.includes("Follow Scroll"),
            liveHasWebGL: /getContext\s*\(\s*['"]webgl/.test(content),
            lines: content.split("\n").length,
        },
        null,
        2
    )
)
