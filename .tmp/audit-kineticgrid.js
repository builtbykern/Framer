const fs = require("fs")
const path = "/Users/noel/Desktop/Framer/.tmp"
fs.mkdirSync(path, { recursive: true })

const files = await framer.getCodeFiles()
const f = files[0]
const src = f.content || ""
fs.writeFileSync(`${path}/KineticGrid.tsx`, src)

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

// Static / canvas idle pattern evidence
analysis.canvasPatterns = {
  isOnCanvasAssign: /isOnFramerCanvas|useIsOnFramerCanvas\(/.test(src),
  earlyReturnCanvas: /if\s*\(.*[Cc]anvas.*\)\s*return/.test(src),
  renderTargetCanvas: /RenderTarget\.(canvas|thumbnail|export)/.test(src),
  animationFrameGated: /useAnimationFrame\(/.test(src),
}

const pages = await framer.getNodesWithType("WebPageNode")
const siteMap = []
for (const p of pages) {
  siteMap.push({ id: p.id, path: p.path, name: p.name })
}

let instances = []
try {
  const nodes = await framer.getNodesWithType("CodeComponentNode")
  instances = (nodes || []).map((n) => ({
    id: n.id,
    name: n.name,
    keys: Object.keys(n).slice(0, 20),
  }))
} catch (e) {
  instances = [{ error: String(e) }]
}

let publish = null
try {
  publish = await framer.getPublishInfo()
} catch (e) {
  publish = { error: String(e) }
}

// lint/typecheck signals if available
let lint = null
let typecheck = null
try {
  lint = await f.lint()
} catch (e) {
  lint = { error: String(e) }
}
try {
  typecheck = await f.typecheck()
} catch (e) {
  typecheck = { error: String(e) }
}

const report = { analysis, siteMap, instances, publish, lint, typecheck }
fs.writeFileSync(`${path}/KineticGrid-audit.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
