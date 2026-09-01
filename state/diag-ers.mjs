const pagePath = "/"
const desktopId = "WQLkyLRf1"
const overlayId = "jabCEPhKE"

const desktop = await framer.agent.getNode({ id: desktopId }, { pagePath })
const overlay = await framer.agent.getNode({ id: overlayId }, { pagePath }).catch((e) => String(e))

let children = []
try {
    const ser = await framer.agent.serialize({ nodeId: desktopId, pagePath })
    children = (ser?.children || ser?.nodes || []).slice?.(0, 40) || ser
} catch (e) {
    children = { serializeError: String(e) }
}

let rect = null
try {
    rect = await framer.agent.getRect({ id: overlayId }, { pagePath })
} catch (e) {
    rect = String(e)
}

const code = await framer.getCodeFile("Edge_Refraction_Shader.tsx")
const sc = code?.content || ""

console.log(
    JSON.stringify(
        {
            desktop: desktop && {
                id: desktop.id,
                name: desktop.name,
                type: desktop.type || desktop.__class,
                children: (desktop.children || []).map((c) => ({
                    id: c.id,
                    name: c.name,
                    type: c.type || c.__class,
                    componentIdentifier: c.componentIdentifier,
                    visible: c.visible,
                    opacity: c.opacity,
                    position: c.position,
                    width: c.width,
                    height: c.height,
                    top: c.top,
                    left: c.left,
                    right: c.right,
                    bottom: c.bottom,
                    zIndex: c.zIndex,
                })),
            },
            overlay,
            rect,
            code: {
                lines: sc.split("\n").length,
                hasParentFilter: sc.includes("createEdgeFilterSvg"),
                hasSlot: /ControlType\.Slot/.test(sc),
                hasChildren: /children\?:/.test(sc),
                rootRelative: /position:\s*["']relative["']/.test(sc),
            },
            serializeSample: children,
        },
        null,
        2
    )
)
