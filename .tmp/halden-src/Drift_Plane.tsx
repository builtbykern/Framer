// @framerDisableUnlink
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { useReducedMotion } from "framer-motion"
import {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent as ReactKeyboardEvent,
    type PointerEvent as ReactPointerEvent,
    type ReactNode,
} from "react"

interface ResponsiveImage {
    src?: string
    srcSet?: string
    alt?: string
    /** Framer panel / ImageAsset shape */
    url?: string
    thumbnailUrl?: string
}

interface LayoutItem {
    x: number
    y: number
    w: number
    h: number
    layer: 0 | 1 | 2
}

interface DriftPlaneProps {
    /** Connected Work Collection List (Cover + Frame collection link). */
    workList?: ReactNode
    layout: {
        scale: number
        spacing?: number
    }
    motion: {
        ease: number
        driftX: number
        driftY: number
        mouse: number
    }
    depth: {
        far: number
        mid: number
        near: number
    }
    input: {
        desktop: number
        mobile: number
    }
    style?: CSSProperties
}

/**
 * Sparse scatter (~GA home density): 20 cards, whitespace-first.
 * Same-layer cards never touch (min ~120px, including toroidal wrap).
 * Proportion rule: w/h >= 0.45 and w >= 110.
 */
const DEFAULT_LAYOUT: LayoutItem[] = [
    { x: -320, y: -520, w: 220, h: 320, layer: 2 },
    { x: 80, y: -560, w: 150, h: 220, layer: 1 },
    { x: 420, y: -480, w: 240, h: 210, layer: 2 },
    { x: 860, y: -540, w: 160, h: 260, layer: 0 },
    { x: 1200, y: -460, w: 200, h: 300, layer: 1 },
    { x: 1600, y: -500, w: 230, h: 280, layer: 2 },
    { x: -280, y: -80, w: 180, h: 260, layer: 1 },
    { x: 80, y: -40, w: 230, h: 340, layer: 2 },
    { x: 480, y: -120, w: 170, h: 250, layer: 0 },
    { x: 820, y: -60, w: 210, h: 300, layer: 1 },
    { x: 1220, y: -20, w: 240, h: 320, layer: 2 },
    { x: 1640, y: -80, w: 160, h: 240, layer: 0 },
    { x: -260, y: 360, w: 210, h: 290, layer: 2 },
    { x: 140, y: 400, w: 160, h: 240, layer: 1 },
    { x: 480, y: 340, w: 230, h: 310, layer: 2 },
    { x: 900, y: 380, w: 180, h: 270, layer: 0 },
    { x: 1280, y: 420, w: 200, h: 280, layer: 1 },
    { x: 1660, y: 360, w: 220, h: 300, layer: 2 },
    { x: 40, y: 780, w: 190, h: 260, layer: 0 },
    { x: 520, y: 760, w: 240, h: 220, layer: 1 },
]

/** Padding between tile repeats so edge cards don't kiss across the wrap. */
const TILE_GAP = 200

/**
 * High-key editorial still life — soft daylight, matte cream ceramics,
 * warm neutrals. Uploaded via Unsplash → framer.uploadImage.
 */
const FALLBACK_IMAGES: ResponsiveImage[] = [
    {
        src: "https://framerusercontent.com/images/0mEEniKXpoJCR9oFnuMD5DNKWQI.jpg",
        alt: "Cream ceramic vase with soft yellow tulips on a white plinth",
    },
    {
        src: "https://framerusercontent.com/images/sD4iTRDDRknhVCRG1bNGxi0p1Co.jpg",
        alt: "Japandi table still life with ceramic vase and muted cups",
    },
    {
        src: "https://framerusercontent.com/images/TMp9LQosfgaJpkjHzYTIJdeffA.jpg",
        alt: "White anthurium in matte ceramic with circular mirrors",
    },
    {
        src: "https://framerusercontent.com/images/D56eSKetCBZbm8NIoAqttUiLkvc.jpg",
        alt: "Two matte off-white ceramic vases with draped taupe linen",
    },
    {
        src: "https://framerusercontent.com/images/D2CxUhqwLTdy3mMjvlWodzs0EU.jpg",
        alt: "Speckled cream vase with bunny-tail grass on linen",
    },
    {
        src: "https://framerusercontent.com/images/wlRwltuO16szkn9JIuuOsrLnftA.jpg",
        alt: "Dried eucalyptus seed pods on warm grey field",
    },
    {
        src: "https://framerusercontent.com/images/D9fvSPnFyxcimyuUqSQKL8K8BI.jpg",
        alt: "White ceramic vase with white blooms, soft daylight",
    },
    {
        src: "https://framerusercontent.com/images/pQ7TibdgF7k0o0uUqwInuXy9TeE.jpg",
        alt: "White plate with delicate flowers, high-key studio",
    },
    {
        src: "https://framerusercontent.com/images/FCzaSp9Pq83QQpofK8wgp9EbRL0.jpg",
        alt: "White ceramic plate on white table, soft shadow",
    },
    {
        src: "https://framerusercontent.com/images/qFpDKc3wCJx4Uy7hZknXj8WcXD8.jpg",
        alt: "Single white vase on table, airy negative space",
    },
    {
        src: "https://framerusercontent.com/images/tcc84H5uXmVoFWL70QZAtDCnU4M.jpg",
        alt: "Stacked matte white bowls and mug, quiet studio",
    },
    {
        src: "https://framerusercontent.com/images/AgDdVPpeG8NsfEO6PqYsTMUIQTI.jpg",
        alt: "Cream ceramic vessel, soft daylight still life",
    },
    {
        src: "https://framerusercontent.com/images/7eXEQlZekWsTw7N7egek367MyT0.jpg",
        alt: "Speckled cream ceramic cups and canisters, soft studio light",
    },
    {
        src: "https://framerusercontent.com/images/TywdqexxpBoGtR4mRgD5SNiOko.jpg",
        alt: "Round cream ceramic plate with draped white linen, flat lay",
    },
    {
        src: "https://framerusercontent.com/images/eU7PJsJ9GhkcwOnkBqAFoehI0.jpg",
        alt: "Small matte white ceramic vase on pale grey, ample negative space",
    },
    {
        src: "https://framerusercontent.com/images/zuD7gD9BRm2UNo9GvchPd58vWM.jpg",
        alt: "Matte white amphora vase on brown marble pedestal",
    },
    {
        src: "https://framerusercontent.com/images/GHoAk8b00g2u34JVDJJ9wN6uk.jpg",
        alt: "Cream ceramic plate with dried white seed heads and linen",
    },
    {
        src: "https://framerusercontent.com/images/xgZnTpwlKThlUln53xuJKOMAnYs.jpg",
        alt: "Two matte white ceramic vases beside a magazine, soft curtain",
    },
    {
        src: "https://framerusercontent.com/images/WgJSzrx9ufPBbnGEnzIqUSe62k.jpg",
        alt: "Speckled cream and pale blue ceramic vases on draped linen",
    },
    {
        src: "https://framerusercontent.com/images/abx6QpOgkxBdpk67Ox618OCzvU.jpg",
        alt: "Three hand-formed cream ceramic jars on a pale pedestal",
    },
]

/** Far / mid / near depth in px (pairs with perspective). */
const LAYER_Z = [-48, 0, 56] as const

/** GA: touch release multiplies last frame delta into camera target. */
const TOUCH_THROW = 10
const CAM_EPSILON = 0.04
const MOUSE_EPSILON = 0.0008
const KEY_STEP = 64
const FADE_EASE = "cubic-bezier(0.23, 1, 0.32, 1)"
/** Click vs pan: movement beyond this (px) starts camera drag. */
const CLICK_SLOP = 8
const DEFAULT_EASE = 0.08
const DEFAULT_DRIFT_X = 0.3
const DEFAULT_DRIFT_Y = 0.2
const DEFAULT_MOUSE = 0.08
const DEFAULT_UNIT_SCALE = 0.9
/** Coarse pointer / narrow frame — not exposed in the panel. */
const MOBILE_BREAKPOINT = 1025

const DEFAULT_LAYOUT_CTRL = {
    scale: DEFAULT_UNIT_SCALE,
    spacing: DEFAULT_UNIT_SCALE,
} as const

const DEFAULT_MOTION = {
    ease: DEFAULT_EASE,
    driftX: DEFAULT_DRIFT_X,
    driftY: DEFAULT_DRIFT_Y,
    mouse: DEFAULT_MOUSE,
} as const

const DEFAULT_DEPTH = {
    far: 0.8,
    mid: 1,
    near: 1.2,
} as const

const DEFAULT_INPUT = {
    desktop: 1,
    mobile: 1.5,
} as const

interface LayoutSlot {
    id: number
    layout: LayoutItem
    baseX: number
    baseY: number
    widthPx: number
    heightPx: number
}

interface RuntimeItem extends LayoutSlot {
    image?: ResponsiveImage
    sourceIndex: number
}

interface TileBounds {
    minX: number
    minY: number
    tileW: number
    tileH: number
}

function wrapCoord(value: number, size: number): number {
    if (!Number.isFinite(size) || size <= 0) return value
    const wrapped = ((value % size) + size) % size
    return wrapped - size / 2
}

/** First-view art direction: nudge the plane down without changing tile size. */
function initialFramingY(viewH: number): number {
    if (!Number.isFinite(viewH) || viewH <= 0) return 0
    return Math.min(viewH * 0.1, 96)
}

/** Same screen XY as the live RAF tick at a given camera (freeze uses 0). */
function tileScreenXY(
    item: LayoutSlot,
    opts: {
        camX: number
        camY: number
        mouseX: number
        mouseY: number
        mul: number
        tileW: number
        tileH: number
        viewW: number
        viewH: number
    }
): { x: number; y: number } {
    let x = item.baseX + opts.camX * opts.mul + opts.mouseX
    let y = item.baseY + opts.camY * opts.mul + opts.mouseY
    x = wrapCoord(x, opts.tileW)
    y = wrapCoord(y, opts.tileH)
    x += opts.viewW / 2
    y += opts.viewH / 2 + initialFramingY(opts.viewH)
    return { x, y }
}

function unwrapControlValue(value: unknown): unknown {
    if (value && typeof value === "object" && "value" in value) {
        return (value as { value: unknown }).value
    }
    return value
}

function coerceNumber(value: unknown, fallback: number): number {
    const raw = unwrapControlValue(value)
    const n = typeof raw === "number" ? raw : Number(raw)
    return Number.isFinite(n) ? n : fallback
}

/** Pixel size from Framer `style` — ignore %, vh, vw (canvas zoom / editor chrome). */
function layoutPx(value: unknown): number {
    if (typeof value === "number" && Number.isFinite(value) && value > 8) {
        return value
    }
    if (typeof value === "string") {
        const trimmed = value.trim()
        if (
            trimmed.endsWith("%") ||
            trimmed.includes("vh") ||
            trimmed.includes("vw") ||
            trimmed.includes("dvh")
        ) {
            return 0
        }
        if (trimmed.endsWith("px")) {
            const n = parseFloat(trimmed)
            return Number.isFinite(n) && n > 8 ? n : 0
        }
    }
    return 0
}

/** Layout box without getBoundingClientRect — canvas zoom inflates that. */
function nodeLayoutSize(node: HTMLElement | null): { w: number; h: number } {
    if (!node) return { w: 0, h: 0 }
    return {
        w: Math.max(node.offsetWidth, node.clientWidth, 0),
        h: Math.max(node.offsetHeight, node.clientHeight, 0),
    }
}

function coerceGroup(
    value: unknown
): Record<string, unknown> {
    const raw = unwrapControlValue(value)
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}
    return raw as Record<string, unknown>
}

const INK = "rgb(17, 17, 17)"

function computeTile(layout: LayoutItem[], gap: number): TileBounds {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    for (const item of layout) {
        minX = Math.min(minX, item.x)
        minY = Math.min(minY, item.y)
        maxX = Math.max(maxX, item.x + item.w)
        maxY = Math.max(maxY, item.y + item.h)
    }
    if (!Number.isFinite(minX)) {
        return { minX: 0, minY: 0, tileW: 2000, tileH: 2000 }
    }
    const pad = gap / 2
    return {
        minX: minX - pad,
        minY: minY - pad,
        tileW: maxX - minX + gap,
        tileH: maxY - minY + gap,
    }
}

function occupiedLayouts(count: number): LayoutItem[] {
    if (count <= 0 || count >= DEFAULT_LAYOUT.length) return DEFAULT_LAYOUT
    const full = computeTile(DEFAULT_LAYOUT, TILE_GAP)
    const cx = full.minX + full.tileW / 2
    const cy = full.minY + full.tileH / 2
    return DEFAULT_LAYOUT.map((item, index) => ({
        item,
        index,
        d: Math.hypot(
            item.x + item.w / 2 - cx,
            item.y + item.h / 2 - cy
        ),
    }))
        .sort((a, b) => a.d - b.d || a.index - b.index)
        .slice(0, count)
        .sort((a, b) => a.index - b.index)
        .map((entry) => entry.item)
}

function buildSlots(
    layouts: LayoutItem[],
    tile: TileBounds,
    sizeScale: number,
    spacingScale = sizeScale
): LayoutSlot[] {
    return layouts.map((layoutItem, index) => ({
        id: index,
        layout: layoutItem,
        baseX: (layoutItem.x - tile.minX) * spacingScale,
        baseY: (layoutItem.y - tile.minY) * spacingScale,
        widthPx: layoutItem.w * sizeScale,
        heightPx: layoutItem.h * sizeScale,
    }))
}

function imageSrc(image: ResponsiveImage | string | null | undefined): string {
    if (typeof image === "string") return image.trim()
    return image?.src || image?.url || ""
}

/** Framer CDN scale-down candidates — same crop, smaller decode when browser picks them. */
function framerSrcSet(src: string): string | undefined {
    if (!src.includes("framerusercontent.com/images/")) return undefined
    const bare = src.split("?")[0]
    return `${bare}?scale-down-to=512 512w, ${bare}?scale-down-to=1024 1024w, ${bare} 1600w`
}

function resolveSrcSet(image: ResponsiveImage): string | undefined {
    if (image.srcSet) return image.srcSet
    const src = imageSrc(image)
    return src ? framerSrcSet(src) : undefined
}

function normalizeImage(image: ResponsiveImage): ResponsiveImage {
    const src = imageSrc(image)
    const alt = image.alt || (image as { altText?: string }).altText || ""
    return {
        ...image,
        src,
        alt,
        srcSet: image.srcSet || (src ? framerSrcSet(src) : undefined),
    }
}

function clamp(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, n))
}

function collectTileNodes(host: HTMLElement): HTMLElement[] {
    const cards = Array.from(
        host.querySelectorAll(
            '[data-framer-name="Work Card"], [data-framer-name="Plane Card"]'
        )
    ).filter((node): node is HTMLElement => node instanceof HTMLElement)

    const tiles: HTMLElement[] = []
    const seen = new Set<HTMLElement>()
    for (const card of cards) {
        const parent = card.parentElement
        const node =
            parent instanceof HTMLAnchorElement ? parent : card
        if (seen.has(node)) continue
        seen.add(node)
        tiles.push(node)
    }
    return tiles
}

function promoteToStage(node: HTMLElement, host: HTMLElement) {
    let el = node.parentElement
    while (el && el !== host) {
        const next = el.parentElement
        const named = el.getAttribute("data-framer-name")
        if (
            !(el instanceof HTMLAnchorElement) &&
            named !== "Work Card" &&
            named !== "Plane Card"
        ) {
            el.style.display = "contents"
        }
        el = next
    }
}

/** Drift tiles: Cover fills the posed card. */
function fillDriftCover(node: HTMLElement) {
    const card = node.querySelector(
        '[data-framer-name="Work Card"], [data-framer-name="Plane Card"]'
    )
    if (card instanceof HTMLElement) {
        card.style.setProperty("position", "relative", "important")
        card.style.setProperty("width", "100%", "important")
        card.style.setProperty("height", "100%", "important")
        card.style.setProperty("overflow", "hidden", "important")
    }
    const cover = node.querySelector('[data-framer-name="Cover"]')
    if (!(cover instanceof HTMLElement)) return
    cover.style.setProperty("position", "absolute", "important")
    cover.style.setProperty("inset", "0px", "important")
    cover.style.setProperty("width", "100%", "important")
    cover.style.setProperty("height", "100%", "important")
    cover.style.setProperty("min-height", "0", "important")
    cover.style.setProperty("max-height", "none", "important")
    cover.style.setProperty("margin", "0", "important")
}

function applyTilePose(
    node: HTMLElement,
    item: LayoutSlot,
    opts: {
        freeze: boolean
        snap: boolean
        tileW: number
        tileH: number
        viewW: number
        viewH: number
    }
) {
    node.style.boxSizing = "border-box"
    node.style.overflow = "hidden"
    node.style.pointerEvents = "auto"
    node.style.cursor = "pointer"
    node.style.width = `${item.widthPx}px`
    node.style.height = `${item.heightPx}px`
    node.style.maxWidth = `${item.widthPx}px`
    node.style.maxHeight = `${item.heightPx}px`
    node.style.zIndex = String(item.layout.layer)
    node.style.margin = "0"
    node.style.flexShrink = "0"
    node.style.display = ""

    if (opts.snap) {
        node.style.position = "relative"
        node.style.left = ""
        node.style.top = ""
        node.style.right = ""
        node.style.bottom = ""
        node.style.transform = "none"
        node.style.visibility = "visible"
        node.style.scrollSnapAlign = "center"
        node.style.flex = "0 0 auto"
        fillDriftCover(node)
        return
    }

    node.style.position = "absolute"
    node.style.right = ""
    node.style.bottom = ""
    node.style.flex = ""
    node.style.scrollSnapAlign = ""
    node.style.left = `${item.baseX}px`
    node.style.top = `${item.baseY}px`
    const z = LAYER_Z[item.layout.layer] ?? 0
    if (opts.freeze) {
        const { x, y } = tileScreenXY(item, {
            camX: 0,
            camY: 0,
            mouseX: 0,
            mouseY: 0,
            mul: 1,
            tileW: opts.tileW,
            tileH: opts.tileH,
            viewW: opts.viewW,
            viewH: opts.viewH,
        })
        node.style.transform = `translate3d(${x - item.baseX}px, ${y - item.baseY}px, ${z}px)`
    } else {
        node.style.transform = "none"
    }
    node.style.visibility = "visible"
    fillDriftCover(node)
}

/** First-paint scatter on canvas when the CMS bind has not run yet. */
function freezeScatterCss(
    sizeScale: number,
    spacingScale: number
): string {
    const tile = computeTile(DEFAULT_LAYOUT, TILE_GAP)
    const tileW = tile.tileW * spacingScale
    const tileH = tile.tileH * spacingScale
    const slots = buildSlots(
        DEFAULT_LAYOUT,
        tile,
        sizeScale,
        spacingScale
    )
    return slots
        .map((slot, index) => {
            const wrappedX = wrapCoord(slot.baseX, tileW)
            const wrappedY = wrapCoord(slot.baseY, tileH)
            const z = LAYER_Z[slot.layout.layer] ?? 0
            return `[data-driftplane-root] [data-driftplane-cms] a:nth-child(${index + 1}) {
    position: absolute !important;
    left: calc(50% + ${wrappedX}px) !important;
    top: calc(50% + ${wrappedY}px + min(10%, 96px)) !important;
    width: ${slot.widthPx}px !important;
    height: ${slot.heightPx}px !important;
    transform: translateZ(${z}px) !important;
    visibility: visible !important;
    overflow: hidden !important;
    margin: 0 !important;
}`
        })
        .join("\n")
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 */
export default function DriftPlane(props: DriftPlaneProps) {
    const {
        workList,
        layout = DEFAULT_LAYOUT_CTRL,
        motion: motionCtrl = DEFAULT_MOTION,
        depth = DEFAULT_DEPTH,
        input = DEFAULT_INPUT,
        style,
    } = props
    const hintedW = layoutPx(style?.width)
    const hintedH = layoutPx(style?.height)
    const cmsSource = workList
    const cmsHostRef = useRef<HTMLDivElement>(null)
    const layoutGroup = coerceGroup(layout)
    const motionGroup = coerceGroup(motionCtrl)
    const depthGroup = coerceGroup(depth)
    const inputGroup = coerceGroup(input)
    const unitScale = clamp(
        coerceNumber(layoutGroup.scale, DEFAULT_UNIT_SCALE),
        0.3,
        1.4
    )
    const spacingScale = clamp(
        coerceNumber(layoutGroup.spacing, unitScale),
        0.3,
        1.4
    )
    const ease = coerceNumber(motionGroup.ease, DEFAULT_EASE)
    const driftX = coerceNumber(motionGroup.driftX, DEFAULT_DRIFT_X)
    const driftY = coerceNumber(motionGroup.driftY, DEFAULT_DRIFT_Y)
    const mouseStrength = coerceNumber(motionGroup.mouse, DEFAULT_MOUSE)
    const layerFar = coerceNumber(depthGroup.far, DEFAULT_DEPTH.far)
    const layerMid = coerceNumber(depthGroup.mid, DEFAULT_DEPTH.mid)
    const layerNear = coerceNumber(depthGroup.near, DEFAULT_DEPTH.near)
    const sensitivityDesktop = coerceNumber(
        inputGroup.desktop,
        DEFAULT_INPUT.desktop
    )
    const sensitivityMobile = coerceNumber(
        inputGroup.mobile,
        DEFAULT_INPUT.mobile
    )

    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion()
    /** Canvas/export: freeze all motion. Reduced-motion: keep pan, kill drift/mouse. */
    const freezeAll = isStatic
    const allowDrift = !freezeAll && !prefersReduced
    const allowMouseParallax = !freezeAll && !prefersReduced
    const liveEase = prefersReduced ? clamp(ease * 1.6, 0.12, 0.45) : ease

    const rootRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<(HTMLElement | null)[]>([])

    const cam = useRef({ x: 0, y: 0 })
    const camTarget = useRef({ x: 0, y: 0 })
    /** Raw pointer position (0–1); lerped into mouseSmooth like GA. */
    const mouseTarget = useRef({ x: 0.5, y: 0.5 })
    const mouseSmooth = useRef({ x: 0.5, y: 0.5 })
    /** Last drag frame delta (camera units) — used for touch throw ×10. */
    const lastDelta = useRef({ x: 0, y: 0 })
    const lastPointer = useRef({ x: 0, y: 0, t: 0 })
    const dragging = useRef(false)
    /** Preview/live crawl from the first frame. Canvas skips RAF via freezeAll. */
    const idleEngaged = useRef(true)
    const dragExceededSlop = useRef(false)
    const pointerOrigin = useRef({ x: 0, y: 0 })
    const capturedPointer = useRef<number | null>(null)
    const sizeRef = useRef({ w: 1200, h: 800 })
    /** Cached root rect for mouse parallax — updated on resize, not every mousemove. */
    const rootRectRef = useRef({ left: 0, top: 0, width: 1200, height: 800 })
    const rafRef = useRef(0)
    const rafActive = useRef(false)
    const pageVisible = useRef(true)
    const onScreen = useRef(true)
    const lastWritten = useRef({
        camX: Number.NaN,
        camY: Number.NaN,
        mouseX: Number.NaN,
        mouseY: Number.NaN,
    })
    const hotMotion = useRef(false)
    const willChangeHot = useRef(false)
    const [isGrabbing, setIsGrabbing] = useState(false)
    const [frameW, setFrameW] = useState(() => (hintedW > 8 ? hintedW : 1200))
    const [frameH, setFrameH] = useState(() => (hintedH > 8 ? hintedH : 800))
    const endPanRef = useRef<
        (event?: PointerEvent | ReactPointerEvent<HTMLDivElement>) => void
    >(() => {})

    const snapAxis = useMemo(() => {
        const xs = DEFAULT_LAYOUT.map((item) => item.x)
        const ys = DEFAULT_LAYOUT.map((item) => item.y)
        const spreadX = Math.max(...xs) - Math.min(...xs)
        const spreadY = Math.max(...ys) - Math.min(...ys)
        return spreadX >= spreadY ? "x" : "y"
    }, [])
    const useSnapMode = false
    const multipliers = useMemo(
        () => [layerFar, layerMid, layerNear] as const,
        [layerFar, layerMid, layerNear]
    )
    const tile = useMemo(() => computeTile(DEFAULT_LAYOUT, TILE_GAP), [])

    const layoutSlots = useMemo(
        (): LayoutSlot[] =>
            buildSlots(DEFAULT_LAYOUT, tile, unitScale, spacingScale),
        [tile, unitScale, spacingScale]
    )

    const liveWorldRef = useRef({
        slots: layoutSlots,
        tileW: tile.tileW * spacingScale,
        tileH: tile.tileH * spacingScale,
    })

    const fallbackItems = useMemo((): RuntimeItem[] => {
        if (cmsSource) return []
        const images = FALLBACK_IMAGES.map(normalizeImage).filter(
            (image) => image.src
        )
        if (images.length === 0) return []
        return layoutSlots.map((slot, index) => ({
            ...slot,
            image: images[index % images.length],
            sourceIndex: index % images.length,
        }))
    }, [cmsSource, layoutSlots])

    const tilePx = useMemo(
        () => ({
            w: tile.tileW * spacingScale,
            h: tile.tileH * spacingScale,
        }),
        [tile.tileH, tile.tileW, spacingScale]
    )

    useLayoutEffect(() => {
        if (cmsSource) return
        liveWorldRef.current = {
            slots: layoutSlots,
            tileW: tilePx.w,
            tileH: tilePx.h,
        }
    }, [cmsSource, layoutSlots, tilePx.h, tilePx.w])

    const isCoarseOrNarrow = () => {
        const narrow = sizeRef.current.w < MOBILE_BREAKPOINT
        if (typeof window === "undefined") return narrow
        return narrow || window.matchMedia("(pointer: coarse)").matches
    }

    const sensNow = () =>
        isCoarseOrNarrow() ? sensitivityMobile : sensitivityDesktop

    useLayoutEffect(() => {
        if (!cmsSource) return
        const host = cmsHostRef.current
        if (!host) return

        const bind = () => {
            const root = rootRef.current
            const box = nodeLayoutSize(root)
            const hostRootW = Math.max(box.w, frameW)
            const hostRootH = Math.max(box.h, frameH)
            for (const empty of host.querySelectorAll(
                '[data-framer-name="Empty"]'
            )) {
                if (empty instanceof HTMLElement) empty.style.display = "none"
            }
            const tiles = collectTileNodes(host)
            for (const node of tiles) promoteToStage(node, host)
            const occupied = occupiedLayouts(tiles.length)
            const occupiedTile = computeTile(occupied, TILE_GAP)
            const occupiedSlots = buildSlots(
                occupied,
                occupiedTile,
                unitScale,
                spacingScale
            )
            const occupiedTilePx = {
                w: occupiedTile.tileW * spacingScale,
                h: occupiedTile.tileH * spacingScale,
            }
            liveWorldRef.current = {
                slots: occupiedSlots,
                tileW: occupiedTilePx.w,
                tileH: occupiedTilePx.h,
            }
            itemRefs.current = occupiedSlots.map((slot, index) => {
                const node = tiles[index]
                if (!node) return null
                applyTilePose(node, slot, {
                    freeze: freezeAll,
                    snap: useSnapMode,
                    tileW: occupiedTilePx.w,
                    tileH: occupiedTilePx.h,
                    viewW: hostRootW,
                    viewH: hostRootH,
                })
                return node
            })
            for (let i = occupiedSlots.length; i < tiles.length; i++) {
                tiles[i].style.display = "none"
            }
            lastWritten.current.camX = Number.NaN
        }

        bind()
        const observer = new MutationObserver(bind)
        observer.observe(host, { childList: true, subtree: true })
        return () => observer.disconnect()
    }, [
        cmsSource,
        freezeAll,
        unitScale,
        spacingScale,
        useSnapMode,
        frameW,
        frameH,
    ])

    useLayoutEffect(() => {
        const root = rootRef.current
        if (!root) return
        const apply = () => {
            const box = nodeLayoutSize(root)
            const parent = nodeLayoutSize(root.parentElement)
            const nextW = box.w > 8 ? box.w : parent.w
            const nextH = box.h
            if (!Number.isFinite(nextW) || nextW <= 8) return
                setFrameW(nextW)
            if (Number.isFinite(nextH) && nextH > 8) setFrameH(nextH)
        }
        apply()
        if (typeof ResizeObserver === "undefined") return
        const observer = new ResizeObserver(apply)
        observer.observe(root)
        return () => observer.disconnect()
    }, [])

    // Live RAF — GA camera model: only target moves; current lerps (no friction inertia).
    // Pauses when tab hidden or root off-screen; camera state preserved.
    useEffect(() => {
        if (useSnapMode) return
        if (freezeAll) return
        if (typeof window === "undefined") return

        const root = rootRef.current
        if (!root) return

        const syncSize = () => {
            const box = nodeLayoutSize(root)
            const rect = root.getBoundingClientRect()
            sizeRef.current = {
                w: box.w || 1200,
                h: box.h || 800,
            }
            rootRectRef.current = {
                left: rect.left,
                top: rect.top,
                width: box.w || 1200,
                height: box.h || 800,
            }
        }
        syncSize()

        const setItemsWillChange = (value: "transform" | "auto") => {
            for (let i = 0; i < itemRefs.current.length; i++) {
                const node = itemRefs.current[i]
                if (node) node.style.willChange = value
            }
        }

        const stopRaf = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            rafRef.current = 0
            rafActive.current = false
            if (willChangeHot.current) {
                willChangeHot.current = false
                setItemsWillChange("auto")
            }
        }

        const tick = () => {
            if (!pageVisible.current || !onScreen.current) {
                rafActive.current = false
                rafRef.current = 0
                return
            }

            const { w: vw, h: vh } = sizeRef.current
            const easeAmt = clamp(liveEase, 0.01, 0.5)

            if (allowDrift && idleEngaged.current && !dragging.current) {
                camTarget.current.x += driftX
                camTarget.current.y += driftY
            }

            cam.current.x += (camTarget.current.x - cam.current.x) * easeAmt
            cam.current.y += (camTarget.current.y - cam.current.y) * easeAmt

            if (allowMouseParallax) {
                mouseSmooth.current.x +=
                    (mouseTarget.current.x - mouseSmooth.current.x) * easeAmt
                mouseSmooth.current.y +=
                    (mouseTarget.current.y - mouseSmooth.current.y) * easeAmt
            }

            const camDelta = Math.hypot(
                cam.current.x - lastWritten.current.camX,
                cam.current.y - lastWritten.current.camY
            )
            const mouseDelta = Math.hypot(
                mouseSmooth.current.x - lastWritten.current.mouseX,
                mouseSmooth.current.y - lastWritten.current.mouseY
            )
            const settling =
                Math.hypot(
                    camTarget.current.x - cam.current.x,
                    camTarget.current.y - cam.current.y
                ) > CAM_EPSILON
            const idleNow = allowDrift && idleEngaged.current
            const mustWrite =
                !Number.isFinite(lastWritten.current.camX) ||
                camDelta > CAM_EPSILON ||
                (allowMouseParallax && mouseDelta > MOUSE_EPSILON) ||
                dragging.current ||
                settling ||
                idleNow

            const nextHot = dragging.current || settling
            if (nextHot !== willChangeHot.current) {
                willChangeHot.current = nextHot
                setItemsWillChange(nextHot ? "transform" : "auto")
            }
            hotMotion.current = nextHot

            if (mustWrite) {
                lastWritten.current = {
                    camX: cam.current.x,
                    camY: cam.current.y,
                    mouseX: mouseSmooth.current.x,
                    mouseY: mouseSmooth.current.y,
                }

                const world = liveWorldRef.current
                for (let i = 0; i < world.slots.length; i++) {
                    const item = world.slots[i]
                    const node = itemRefs.current[i]
                    if (!item || !node) continue

                    const m = multipliers[item.layout.layer] ?? 1
                    const mouseX = allowMouseParallax
                        ? (mouseSmooth.current.x - 0.5) * mouseStrength * m * vw
                        : 0
                    const mouseY = allowMouseParallax
                        ? (mouseSmooth.current.y - 0.5) * mouseStrength * m * vh
                        : 0

                    const posed = tileScreenXY(item, {
                        camX: cam.current.x,
                        camY: cam.current.y,
                        mouseX,
                        mouseY,
                        mul: m,
                        tileW: world.tileW,
                        tileH: world.tileH,
                        viewW: vw,
                        viewH: vh,
                    })
                    const x = posed.x
                    const y = posed.y

                    const z = LAYER_Z[item.layout.layer] ?? 0
                        node.style.visibility = "visible"
                        node.style.transform = `translate3d(${x - item.baseX}px, ${y - item.baseY}px, ${z}px)`
                }
            }

            rafRef.current = requestAnimationFrame(tick)
        }

        const startRaf = () => {
            if (rafActive.current) return
            if (!pageVisible.current || !onScreen.current) return
            rafActive.current = true
            rafRef.current = requestAnimationFrame(tick)
        }

        const ro =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(syncSize)
                : null
        if (ro) ro.observe(root)

        const onVisibility = () => {
            pageVisible.current = document.visibilityState !== "hidden"
            if (pageVisible.current) startRaf()
            else stopRaf()
        }
        pageVisible.current = document.visibilityState !== "hidden"
        document.addEventListener("visibilitychange", onVisibility)

        const onWheel = (event: WheelEvent) => {
            event.preventDefault()
            idleEngaged.current = true
            const sens = sensNow()
            camTarget.current.x += -event.deltaX * sens
            camTarget.current.y += -event.deltaY * sens
            hotMotion.current = true
            startRaf()
        }

        const onMouseMove = (event: MouseEvent) => {
            if (!allowMouseParallax) return
            const rect = rootRectRef.current
            if (rect.width <= 0 || rect.height <= 0) return
            mouseTarget.current.x = (event.clientX - rect.left) / rect.width
            mouseTarget.current.y = (event.clientY - rect.top) / rect.height
        }

        root.addEventListener("wheel", onWheel, { passive: false })
        window.addEventListener("mousemove", onMouseMove)

        startRaf()

        return () => {
            stopRaf()
            root.removeEventListener("wheel", onWheel)
            window.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("visibilitychange", onVisibility)
            ro?.disconnect()
        }
    }, [
        allowDrift,
        allowMouseParallax,
        driftX,
        driftY,
        freezeAll,
        layoutSlots,
        liveEase,
        mouseStrength,
        multipliers,
        sensitivityDesktop,
        sensitivityMobile,
        tilePx.h,
        tilePx.w,
        useSnapMode,
    ])

    const endPan = (
        event?: PointerEvent | ReactPointerEvent<HTMLDivElement>
    ) => {
        if (useSnapMode || !dragging.current) return
        dragging.current = false
        setIsGrabbing(false)
        const didDrag = dragExceededSlop.current
        if (capturedPointer.current !== null) {
            try {
                if (
                    event &&
                    event.currentTarget instanceof HTMLElement
                ) {
                    event.currentTarget.releasePointerCapture(event.pointerId)
                } else {
                    rootRef.current?.releasePointerCapture(
                        capturedPointer.current
                    )
                }
            } catch {
                // already released
            }
            capturedPointer.current = null
        }
        if (didDrag && isCoarseOrNarrow()) {
            camTarget.current.x += lastDelta.current.x * TOUCH_THROW
            camTarget.current.y += lastDelta.current.y * TOUCH_THROW
        }
        lastDelta.current = { x: 0, y: 0 }
        hotMotion.current = true
        dragExceededSlop.current = false
    }
    endPanRef.current = endPan

    useEffect(() => {
        if (freezeAll || useSnapMode || typeof window === "undefined") return
        const up = (event: PointerEvent) => endPanRef.current(event)
        window.addEventListener("pointerup", up)
        window.addEventListener("pointercancel", up)
        return () => {
            window.removeEventListener("pointerup", up)
            window.removeEventListener("pointercancel", up)
        }
    }, [freezeAll, useSnapMode])

    const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (freezeAll || useSnapMode) return
        if (event.button !== 0) return
        idleEngaged.current = true
        dragging.current = true
        dragExceededSlop.current = false
        capturedPointer.current = null
        if (typeof window !== "undefined") {
            window.getSelection()?.removeAllRanges()
        }
        hotMotion.current = true
        setIsGrabbing(true)
        lastDelta.current = { x: 0, y: 0 }
        pointerOrigin.current = { x: event.clientX, y: event.clientY }
        lastPointer.current = {
            x: event.clientX,
            y: event.clientY,
            t: performance.now(),
        }
    }

    const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (freezeAll || useSnapMode || !dragging.current) return
        const ox = event.clientX - pointerOrigin.current.x
        const oy = event.clientY - pointerOrigin.current.y
        if (!dragExceededSlop.current) {
            if (Math.hypot(ox, oy) <= CLICK_SLOP) return
            dragExceededSlop.current = true
            try {
                event.currentTarget.setPointerCapture(event.pointerId)
                capturedPointer.current = event.pointerId
            } catch {
                capturedPointer.current = null
            }
        }
        const dx = event.clientX - lastPointer.current.x
        const dy = event.clientY - lastPointer.current.y
        const sens = sensNow()
        const moveX = dx * sens
        const moveY = dy * sens
        camTarget.current.x += moveX
        camTarget.current.y += moveY
        lastDelta.current = { x: moveX, y: moveY }
        lastPointer.current = {
            x: event.clientX,
            y: event.clientY,
            t: performance.now(),
        }
    }

    const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (freezeAll || useSnapMode) return
        let dx = 0
        let dy = 0
        switch (event.key) {
            case "ArrowLeft":
                dx = KEY_STEP
                break
            case "ArrowRight":
                dx = -KEY_STEP
                break
            case "ArrowUp":
                dy = KEY_STEP
                break
            case "ArrowDown":
                dy = -KEY_STEP
                break
            default:
                return
        }
        event.preventDefault()
        idleEngaged.current = true
        const sens = sensNow()
        camTarget.current.x += dx * sens
        camTarget.current.y += dy * sens
        hotMotion.current = true
    }

    const rootStyle: CSSProperties = {
        position: "relative",
        overflow: "hidden",
        background: "transparent",
        touchAction: useSnapMode
            ? snapAxis === "x"
                ? "pan-x"
                : "pan-y"
            : "none",
        cursor:
            freezeAll || useSnapMode
                ? "default"
                : isGrabbing
                  ? "grabbing"
                  : "grab",
        userSelect: "none",
        WebkitUserSelect: "none",
        // Safari / legacy: kill callout + drag ghost while panning.
        WebkitTouchCallout: "none",
        // @ts-expect-error vendor drag kill
        WebkitUserDrag: "none",
        outline: "none",
        boxSizing: "border-box",
        ...style,
        width: "100%",
        height: "100%",
        minHeight: 0,
    }

    return (
        <div
            ref={rootRef}
            data-driftplane-root=""
            data-driftplane-mode="drift"
            style={rootStyle}
            tabIndex={freezeAll || useSnapMode ? -1 : 0}
            role="region"
            aria-label="Pannable image gallery. Drag, scroll, or use arrow keys to explore. Linked cards open in the Tab order."
            onPointerDown={useSnapMode ? undefined : onPointerDown}
            onPointerMove={useSnapMode ? undefined : onPointerMove}
            onPointerUp={useSnapMode ? undefined : endPan}
            onPointerCancel={useSnapMode ? undefined : endPan}
            onDragStart={(event) => {
                event.preventDefault()
            }}
            onKeyDown={useSnapMode ? undefined : onKeyDown}
        >
            <style>{`
                [data-driftplane-root],
                [data-driftplane-root] * {
                    -webkit-user-select: none !important;
                    user-select: none !important;
                    -webkit-touch-callout: none !important;
                }
                [data-driftplane-root] img {
                    -webkit-user-drag: none !important;
                    user-drag: none !important;
                }
                [data-driftplane-root]::selection,
                [data-driftplane-root] *::selection {
                    background: transparent !important;
                    color: inherit !important;
                }
                [data-driftplane-cms],
                [data-driftplane-cms] [data-framer-name="Work"],
                [data-driftplane-cms] [data-framer-name="Work Cards"],
                [data-driftplane-cms] [data-framer-name="Work List"],
                [data-driftplane-cms] [data-framer-name="Plane CMS"] {
                    display: contents !important;
                }
                [data-driftplane-cms] [data-framer-name="Title"],
                [data-driftplane-cms] [data-framer-name="Type"],
                [data-driftplane-cms] [data-framer-name="Year"],
                [data-driftplane-cms] [data-framer-name="Empty"],
                [data-driftplane-cms] [data-framer-name="Empty State"],
                [data-driftplane-cms] [data-framer-name="Slug"],
                [data-driftplane-cms] [data-framer-name="Work Link"],
                [data-driftplane-cms] [data-framer-name="Series Meta"],
                [data-driftplane-cms] [data-framer-name="Meta Line"],
                [data-driftplane-cms] [data-framer-name="Still Grid"] {
                    display: none !important;
                }
                [data-driftplane-cms] [data-framer-name="Work Card"],
                [data-driftplane-cms] [data-framer-name="Plane Card"] {
                    cursor: pointer;
                    pointer-events: auto;
                    transition: filter 180ms cubic-bezier(0.5, 0, 0.5, 1);
                }
                @media (hover: hover) {
                    [data-driftplane-cms] a:hover [data-framer-name="Work Card"],
                    [data-driftplane-cms] a:hover [data-framer-name="Plane Card"] {
                        filter: brightness(0.86);
                    }
                }
                [data-driftplane-cms] a:active [data-framer-name="Work Card"],
                [data-driftplane-cms] a:active [data-framer-name="Plane Card"] {
                    filter: brightness(0.72);
                }
                [data-driftplane-cms] [data-framer-name="Work Card"] [data-framer-name="Cover"],
                [data-driftplane-cms] [data-framer-name="Plane Card"] [data-framer-name="Cover"] {
                    position: absolute !important;
                    inset: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    min-height: 0 !important;
                    max-height: none !important;
                    flex: none !important;
                    order: 0 !important;
                    margin: 0 !important;
                    transform-origin: 50% 50%;
                }
                [data-driftplane-cms] a {
                    touch-action: none;
                    -webkit-user-drag: none;
                    user-drag: none;
                }
                [data-driftplane-cms] a:focus {
                    outline: none;
                }
                [data-driftplane-cms] a:focus-visible {
                    outline: 2px solid ${INK};
                    outline-offset: 4px;
                }
                ${
                    freezeAll
                        ? freezeScatterCss(unitScale, spacingScale)
                        : ""
                }
            `}</style>
            <div
                ref={stageRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    perspective: useSnapMode ? "none" : "500px",
                    transformStyle: useSnapMode ? "flat" : "preserve-3d",
                    overflow: useSnapMode ? "auto" : "hidden",
                    transformOrigin: "50% 50%",
                    display: useSnapMode ? "flex" : "block",
                    flexDirection: snapAxis === "x" ? "row" : "column",
                    gap: useSnapMode ? 16 : 0,
                    padding: useSnapMode ? 16 : 0,
                    scrollSnapType: useSnapMode
                        ? `${snapAxis} mandatory`
                        : undefined,
                    WebkitOverflowScrolling: useSnapMode ? "touch" : undefined,
                    touchAction: useSnapMode
                        ? snapAxis === "x"
                            ? "pan-x"
                            : "pan-y"
                        : undefined,
                }}
            >
                {cmsSource ? (
                    <div ref={cmsHostRef} data-driftplane-cms="">
                        {cmsSource}
                    </div>
                ) : null}
                {fallbackItems.map((item, index) => {
                    const aspect = item.layout.w / item.layout.h
                    const hasImage = Boolean(item.image?.src)
                    const eagerImage =
                        hasImage && (freezeAll || item.sourceIndex === 0)
                    const srcSet = item.image
                        ? item.image.srcSet || resolveSrcSet(item.image)
                        : undefined
                    const rest = tileScreenXY(item, {
                        camX: 0,
                        camY: 0,
                        mouseX: 0,
                        mouseY: 0,
                        mul: 1,
                        tileW: tilePx.w,
                        tileH: tilePx.h,
                        viewW: frameW,
                        viewH: frameH,
                    })
                    const z = LAYER_Z[item.layout.layer] ?? 0
                    return (
                        <div
                            key={item.id}
                            ref={(node) => {
                                itemRefs.current[index] = node
                            }}
                            style={{
                                position: useSnapMode ? "relative" : "absolute",
                                left: useSnapMode ? undefined : item.baseX,
                                top: useSnapMode ? undefined : item.baseY,
                                width: item.widthPx,
                                zIndex: item.layout.layer,
                                transform:
                                    freezeAll && !useSnapMode
                                        ? `translate3d(${rest.x - item.baseX}px, ${rest.y - item.baseY}px, ${z}px)`
                                        : undefined,
                                willChange: "auto",
                                visibility: "visible",
                                pointerEvents: "none",
                                scrollSnapAlign: useSnapMode
                                    ? "center"
                                    : undefined,
                                flex: useSnapMode ? "0 0 auto" : undefined,
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    overflow: "hidden",
                                    aspectRatio: String(aspect),
                                    background: "transparent",
                                    transformOrigin: "50% 50%",
                                }}
                            >
                                {hasImage ? (
                                    <img
                                        src={item.image?.src}
                                        srcSet={srcSet}
                                        sizes="(max-width: 1025px) 42vw, 240px"
                                        alt={item.image?.alt ?? ""}
                                        width={item.layout.w}
                                        height={item.layout.h}
                                        draggable={false}
                                        loading={eagerImage ? "eager" : "lazy"}
                                        decoding="async"
                                        ref={(el) => {
                                            if (
                                                el &&
                                                el.complete &&
                                                el.naturalWidth > 0
                                            ) {
                                                el.style.opacity = "1"
                                            }
                                        }}
                                        onLoad={(event) => {
                                            event.currentTarget.style.opacity =
                                                "1"
                                        }}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                            opacity: 0,
                                            transition: `opacity 0.2s ${FADE_EASE}`,
                                            pointerEvents: "none",
                                            userSelect: "none",
                                            WebkitUserSelect: "none",
                                            // @ts-expect-error vendor drag kill
                                            WebkitUserDrag: "none",
                                        }}
                                    />
                                ) : (
                                    <div
                                        aria-hidden="true"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "block",
                                            pointerEvents: "none",
                                            background: "transparent",
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

DriftPlane.displayName = "Drift Plane"
DriftPlane.defaultProps = {
    layout: DEFAULT_LAYOUT_CTRL,
    motion: DEFAULT_MOTION,
    depth: DEFAULT_DEPTH,
    input: DEFAULT_INPUT,
}

addPropertyControls(DriftPlane, {
    workList: {
        type: ControlType.Slot,
        title: "Work List",
        maxCount: 1,
        description:
            "Connect the page-scope Work list (Cover + detail link). Keep it off the Home breakpoint — Featured items feed the plane.",
    },
    layout: {
        type: ControlType.Object,
        title: "Layout",
        icon: "object",
        description: "Overall size of the card scatter.",
        controls: {
            scale: {
                type: ControlType.Number,
                title: "Scale",
                description: "Larger = bigger cards, less whitespace.",
                defaultValue: DEFAULT_UNIT_SCALE,
                min: 0.3,
                max: 1.4,
                step: 0.02,
            },
            spacing: {
                type: ControlType.Number,
                title: "Spacing",
                description:
                    "Position density without changing card size. Lower = closer.",
                defaultValue: DEFAULT_UNIT_SCALE,
                min: 0.3,
                max: 1.4,
                step: 0.02,
            },
        },
        defaultValue: { ...DEFAULT_LAYOUT_CTRL },
    },
    motion: {
        type: ControlType.Object,
        title: "Motion",
        icon: "effect",
        description: "How the plane moves and settles.",
        controls: {
            ease: {
                type: ControlType.Number,
                title: "Ease",
                description: "Lower = smoother lag after drag or scroll.",
                defaultValue: DEFAULT_EASE,
                min: 0.02,
                max: 0.4,
                step: 0.01,
            },
            driftX: {
                type: ControlType.Number,
                title: "Drift X",
                description: "Idle float left/right while resting.",
                defaultValue: DEFAULT_DRIFT_X,
                min: 0,
                max: 2,
                step: 0.05,
            },
            driftY: {
                type: ControlType.Number,
                title: "Drift Y",
                description: "Idle float up/down while resting.",
                defaultValue: DEFAULT_DRIFT_Y,
                min: 0,
                max: 2,
                step: 0.05,
            },
            mouse: {
                type: ControlType.Number,
                title: "Mouse",
                description: "Cursor parallax strength (0 = off).",
                defaultValue: DEFAULT_MOUSE,
                min: 0,
                max: 0.4,
                step: 0.01,
            },
        },
        defaultValue: { ...DEFAULT_MOTION },
    },
    depth: {
        type: ControlType.Object,
        title: "Depth",
        icon: "effect",
        description: "Parallax speed per layer — near moves more.",
        controls: {
            far: {
                type: ControlType.Number,
                title: "Far",
                description: "Background layer multiplier.",
                defaultValue: DEFAULT_DEPTH.far,
                min: 0.2,
                max: 2,
                step: 0.05,
            },
            mid: {
                type: ControlType.Number,
                title: "Mid",
                description: "Middle layer multiplier.",
                defaultValue: DEFAULT_DEPTH.mid,
                min: 0.2,
                max: 2,
                step: 0.05,
            },
            near: {
                type: ControlType.Number,
                title: "Near",
                description: "Foreground layer multiplier.",
                defaultValue: DEFAULT_DEPTH.near,
                min: 0.2,
                max: 2,
                step: 0.05,
            },
        },
        defaultValue: { ...DEFAULT_DEPTH },
    },
    input: {
        type: ControlType.Object,
        title: "Input",
        icon: "interaction",
        description: "Drag and scroll sensitivity.",
        controls: {
            desktop: {
                type: ControlType.Number,
                title: "Desktop",
                description: "Mouse / trackpad feel.",
                defaultValue: DEFAULT_INPUT.desktop,
                min: 0.2,
                max: 3,
                step: 0.1,
            },
            mobile: {
                type: ControlType.Number,
                title: "Mobile",
                description: "Touch feel (also used on coarse pointers).",
                defaultValue: DEFAULT_INPUT.mobile,
                min: 0.2,
                max: 4,
                step: 0.1,
            },
        },
        defaultValue: { ...DEFAULT_INPUT },
    },
})
