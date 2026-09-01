const info = await framer.getProjectInfo()
const files = await framer.getCodeFiles()
const shader = await framer.getCodeFile("Edge_Refraction_Shader.tsx")
const c = shader?.content || ""
const desk = await framer.agent.getNode({ id: "WQLkyLRf1" }, { pagePath: "/" })
const overlay = await framer.agent.getNode({ id: "jabCEPhKE" }, { pagePath: "/" })

// Collect home structure via applyChanges? NO — read only. Use getChildren if available.
let children = []
try {
    const node = desk
    const ids = node?.children || node?.childIds || []
    if (Array.isArray(ids) && ids.length) {
        for (const id of ids.slice(0, 30)) {
            const cid = typeof id === "string" ? id : id.id
            const ch = await framer.agent.getNode({ id: cid }, { pagePath: "/" })
            children.push({
                id: ch?.id,
                name: ch?.name,
                type: ch?.type,
                position: ch?.attributes?.position,
                zIndex: ch?.attributes?.zIndex,
                component:
                    ch?.attributes?.componentId || ch?.attributes?.component,
                height: ch?.attributes?.height,
                width: ch?.attributes?.width,
            })
        }
    }
} catch (e) {
    children = [{ err: String(e) }]
}

const signals = {
    hasFeDisplacement: c.includes("feDisplacementMap"),
    hasPageRootFilter: /pageRoot\.style\.filter\s*=/.test(c),
    hasSiblingTargets: c.includes("overlayHost.contains"),
    hasWebGL: /getContext\s*\(\s*['"]webgl/.test(c),
    hasFollowScroll: c.includes("Follow Scroll"),
    hasAlwaysOn: c.includes("Always On"),
    defaultModeAlwaysOn: /editorPreview:\s*"Always On"/.test(c),
    respectReducedDefaultTrue: /respectReducedMotion:\s*true/.test(c),
    appliesFilterToPageRoot: c.includes("createPageWarp(page)") && c.includes("pageRoot.style.filter"),
    resolveHasQueryFallback: c.includes('querySelectorAll'),
    scaleFormula: (c.match(/yScale = \([^)]+\)/) || [])[0] || null,
    noOverrideFile: !files.some((f) => (f.name || "").includes("Override")),
    deskCodeOverride: desk?.attributes?.codeOverride ?? null,
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            projectId: info.id,
            files: files.map((f) => ({
                id: f.id,
                name: f.name,
                exports: (f.exports || []).map((e) => e.name),
            })),
            overlay: {
                id: overlay?.id,
                name: overlay?.name,
                type: overlay?.type,
                position: overlay?.attributes?.position,
                zIndex: overlay?.attributes?.zIndex,
                opacity: overlay?.attributes?.opacity,
                visible: overlay?.attributes?.visible,
                width: overlay?.attributes?.width,
                height: overlay?.attributes?.height,
                top: overlay?.attributes?.top,
                bottom: overlay?.attributes?.bottom,
                left: overlay?.attributes?.left,
                right: overlay?.attributes?.right,
                component:
                    overlay?.attributes?.componentId ||
                    overlay?.attributes?.component,
                advanced: overlay?.attributes?.advanced,
            },
            desk: {
                id: desk?.id,
                name: desk?.name,
                overflow: desk?.attributes?.overflow,
                height: desk?.attributes?.height,
                layout: desk?.attributes?.layout,
                codeOverride: desk?.attributes?.codeOverride ?? null,
                childCount: (desk?.children || desk?.childIds || []).length,
            },
            children,
            signals,
            lines: c.split("\n").length,
        },
        null,
        2
    )
)
