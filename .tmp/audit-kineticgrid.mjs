import { writeFileSync, mkdirSync } from "node:fs"

const files = await framer.getCodeFiles()
const f = files[0]
const src = f.content || ""

mkdirSync("/Users/noel/Desktop/Framer/.tmp", { recursive: true })
writeFileSync("/Users/noel/Desktop/Framer/.tmp/KineticGrid.tsx", src)

const analysis = {
  id: f.id,
  name: f.name,
  path: f.path,
  exports: f.exports,
  lines: src.split("\n").length,
  bytes: src.length,
  version: (src.match(/@version\s+([\d.]+)/) || [])[1] || null,
  exportFn: (src.match(/export default function (\w+)/) || [])[1] || null,
  displayName: (src.match(/\.displayName\s*=\s*"([^"]+)"/) || [])[1] || null,
  annotations: {
    unlink: src.includes("@framerDisableUnlink"),
    width: (src.match(/@framerSupportedLayoutWidth:\s*(\S+)/) || [])[1] || null,
    height: (src.match(/@framerSupportedLayoutHeight:\s*(\S+)/) || [])[1] || null,
  },
  guards: {
    useIsOnFramerCanvas: src.includes("useIsOnFramerCanvas"),
    RenderTarget: src.includes("RenderTarget"),
    useReducedMotion: src.includes("useReducedMotion"),
    useInView: src.includes("useInView"),
    useAnimationFrame: src.includes("useAnimationFrame"),
  },
  hygiene: {
    consoleLog: (src.match(/console\.log/g) || []).length,
    tsIgnore: (src.match(/@ts-ignore/g) || []).length,
    any: (src.match(/:\s*any\b|as any\b/g) || []).length,
  },
  a11y: {
    ariaLabelProp: /ariaLabel/.test(src),
    ariaLabelAttr: /aria-label/.test(src),
    role: /role[:=]/.test(src),
    tabIndex: src.includes("tabIndex"),
    onKeyDown: src.includes("onKeyDown"),
    decorative: /aria-hidden|presentation|role:\s*["']none/.test(src),
  },
  controls: {
    hasPC: src.includes("addPropertyControls"),
    objectGroups: (src.match(/type:\s*ControlType\.Object/g) || []).length,
    font: src.includes("ControlType.Font"),
    responsiveHints: /tablet|mobile|breakpoint/i.test(src),
  },
  pointer: {
    onPointerDown: src.includes("onPointerDown"),
    onPointerMove: src.includes("onPointerMove"),
    touchAction: /touchAction|touch-action/.test(src),
  },
}

const pcMatch = src.match(/addPropertyControls\([\s\S]*$/)
analysis.controlKeys = pcMatch
  ? [...pcMatch[0].matchAll(/^\s{4}(\w+):\s*\{/gm)].map((m) => m[1])
  : []

// Page structure
const pages = await framer.getNodesWithType("WebPageNode")
const pageInfo = []
for (const p of pages) {
  const children = typeof p.getChildren === "function" ? await p.getChildren() : []
  pageInfo.push({
    id: p.id,
    path: p.path,
    name: p.name,
    childCount: Array.isArray(children) ? children.length : null,
  })
}

// Instances of the code component on canvas
let instances = []
try {
  const nodes = await framer.getNodesWithType("CodeComponentNode")
  instances = (nodes || []).map((n) => ({
    id: n.id,
    name: n.name,
    componentId: n.componentId || n.componentIdentifier || null,
  }))
} catch (e) {
  instances = [{ error: String(e) }]
}

// Publish
let publish = null
try {
  publish = await framer.getPublishInfo()
} catch (e) {
  publish = { error: String(e) }
}

// Thumbnail / listing pages?
const siteMap = pages.map((p) => ({ id: p.id, path: p.path, name: p.name }))

const report = { analysis, pageInfo, siteMap, instances, publish }
writeFileSync(
  "/Users/noel/Desktop/Framer/.tmp/KineticGrid-audit.json",
  JSON.stringify(report, null, 2),
)
console.log(JSON.stringify(report, null, 2))
