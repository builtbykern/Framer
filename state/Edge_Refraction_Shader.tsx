import {
    addPropertyControls,
    ControlType,
    useIsOnFramerCanvas,
    useIsStaticRenderer,
} from "framer"
import {
    animate,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    type Transition,
} from "framer-motion"
import {
    useEffect,
    useRef,
    type CSSProperties,
} from "react"

type EdgePosition = "both" | "top" | "bottom"
type EditorPreview = "Always On" | "Follow Scroll" | "Off"

interface MotionOptions {
    settleMs: number
    fadeIn: Transition
    fadeOut: Transition
}

interface AdvancedOptions {
    editorPreview: EditorPreview
    respectReducedMotion: boolean
}

interface EdgeRefractionShaderProps {
    edges: EdgePosition
    edgeDepth: number
    curvature: number
    stretch: number
    motion: MotionOptions
    advanced: AdvancedOptions
    style?: CSSProperties
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

const DEFAULT_FADE_IN: Transition = {
    type: "tween",
    duration: 0.16,
    ease: EASE_OUT,
}

const DEFAULT_FADE_OUT: Transition = {
    type: "tween",
    duration: 0.28,
    ease: EASE_OUT,
}

const DEFAULT_MOTION: MotionOptions = {
    settleMs: 400,
    fadeIn: DEFAULT_FADE_IN,
    fadeOut: DEFAULT_FADE_OUT,
}

const DEFAULT_ADVANCED: AdvancedOptions = {
    editorPreview: "Always On",
    respectReducedMotion: true,
}

const SCROLL_HYSTERESIS_PX = 8

type PageWarp = {
    pageRoot: HTMLElement
    svg: SVGSVGElement
    filter: SVGFilterElement
    filterId: string
    edgeMask: SVGFEImageElement
    yMap: SVGFEImageElement
    xMap: SVGFEImageElement
    dispY: SVGFEDisplacementMapElement
    dispX: SVGFEDisplacementMapElement
    prevFilter: string
    prevWebkit: string
    lastW: number
    lastH: number
    lastMaskKey: string
}

function resolveTransition(
    fallback: Transition,
    next?: Transition
): Transition {
    const source = next ?? fallback
    if (!source || typeof source !== "object") return fallback

    const bounce =
        "bounce" in source && typeof source.bounce === "number"
            ? source.bounce
            : undefined
    const durationBased =
        "durationBasedSpring" in source && source.durationBasedSpring === true

    if ((typeof bounce === "number" && bounce > 0) || durationBased) {
        return fallback
    }

    const type = "type" in source ? source.type : undefined
    const duration =
        "duration" in source && typeof source.duration === "number"
            ? source.duration
            : undefined
    const wantsTween =
        type === "tween" ||
        type === "keyframes" ||
        (type !== "spring" && typeof duration === "number")

    if (wantsTween) {
        const ease = "ease" in source ? source.ease : undefined
        const fallbackDuration =
            fallback && typeof fallback === "object" && "duration" in fallback
                ? (fallback as { duration?: number }).duration
                : 0.16
        return {
            type: "tween",
            duration:
                typeof duration === "number"
                    ? Math.max(0.1, Math.min(0.35, duration))
                    : (fallbackDuration ?? 0.16),
            ease: ease ?? EASE_OUT,
            delay: 0,
        }
    }

    return fallback
}

function collectScrollRoots(from: HTMLElement | null): Array<Window | Element> {
    const roots: Array<Window | Element> = []
    if (typeof window !== "undefined") roots.push(window)

    let node: HTMLElement | null = from
    while (node) {
        const style = window.getComputedStyle(node)
        const oy = style.overflowY
        const ox = style.overflowX
        if (
            oy === "auto" ||
            oy === "scroll" ||
            oy === "overlay" ||
            ox === "auto" ||
            ox === "scroll" ||
            ox === "overlay"
        ) {
            roots.push(node)
        }
        node = node.parentElement
    }

    if (typeof document !== "undefined") {
        const se = document.scrollingElement
        if (se && !roots.includes(se)) roots.push(se)
    }
    return roots
}

function readScrollY(root: Window | Element): number {
    if (root === window) {
        return window.scrollY || document.documentElement.scrollTop || 0
    }
    return (root as Element).scrollTop
}

function isBreakpointName(name: string): boolean {
    const n = name.toLowerCase()
    return (
        n === "desktop" ||
        n === "tablet" ||
        n === "phone" ||
        n === "primary" ||
        n === "breakpoint"
    )
}

function resolvePageRoot(start: HTMLElement | null): HTMLElement | null {
    if (typeof document === "undefined" || !start) return null

    let el: HTMLElement | null = start.parentElement
    let best: HTMLElement | null = el
    while (el && el !== document.body && el !== document.documentElement) {
        const name = el.getAttribute("data-framer-name") || ""
        if (isBreakpointName(name)) return el
        if (el.childElementCount >= 2) best = el
        el = el.parentElement
    }

    // Fixed overlays may portal outside the breakpoint — query by name
    const named = document.querySelectorAll<HTMLElement>("[data-framer-name]")
    for (const node of named) {
        const name = node.getAttribute("data-framer-name") || ""
        if (isBreakpointName(name) && node.childElementCount >= 1) {
            return node
        }
    }

    return best
}

function setHref(el: SVGFEImageElement, href: string) {
    el.setAttribute("href", href)
    el.setAttributeNS("http://www.w3.org/1999/xlink", "href", href)
}

function buildYMap(width: number, height: number): string {
    const w = Math.max(1, Math.floor(width))
    const h = Math.max(1, Math.floor(height))
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgb(255,255,255)"/><stop offset="50%" stop-color="rgb(128,128,128)"/><stop offset="100%" stop-color="rgb(0,0,0)"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function buildXMap(width: number, height: number): string {
    const w = Math.max(1, Math.floor(width))
    const h = Math.max(1, Math.floor(height))
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="rgb(40,40,40)"/><stop offset="50%" stop-color="rgb(128,128,128)"/><stop offset="100%" stop-color="rgb(220,220,220)"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function buildViewportEdgeMask(options: {
    width: number
    height: number
    yInRoot: number
    viewH: number
    edgeFrac: number
    edges: EdgePosition
}): string {
    const w = Math.max(1, Math.floor(options.width))
    const h = Math.max(1, Math.floor(options.height))
    const viewH = Math.max(1, options.viewH)
    const band = Math.max(
        40,
        viewH * Math.max(0.12, Math.min(0.42, options.edgeFrac))
    )
    const y0 = Math.max(0, options.yInRoot)
    const y1 = Math.min(h, options.yInRoot + viewH)
    const topOn = options.edges === "both" || options.edges === "top"
    const botOn = options.edges === "both" || options.edges === "bottom"
    const topRect = topOn
        ? `<rect x="0" y="${y0}" width="${w}" height="${band}" fill="white"/>`
        : ""
    const bottomRect = botOn
        ? `<rect x="0" y="${Math.max(y0, y1 - band)}" width="${w}" height="${band}" fill="white"/>`
        : ""
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><rect width="${w}" height="${h}" fill="black"/>${topRect}${bottomRect}</svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function createPageWarp(pageRoot: HTMLElement): PageWarp | null {
    if (typeof document === "undefined") return null
    const ns = "http://www.w3.org/2000/svg"
    const filterId = `ers-${Math.random().toString(36).slice(2, 10)}`

    const svg = document.createElementNS(ns, "svg")
    svg.setAttribute("width", "0")
    svg.setAttribute("height", "0")
    svg.setAttribute("aria-hidden", "true")
    svg.style.position = "absolute"
    svg.style.width = "0"
    svg.style.height = "0"
    svg.style.overflow = "hidden"
    svg.style.pointerEvents = "none"

    const defs = document.createElementNS(ns, "defs")
    const filter = document.createElementNS(ns, "filter")
    filter.setAttribute("id", filterId)
    filter.setAttribute("filterUnits", "userSpaceOnUse")
    filter.setAttribute("primitiveUnits", "userSpaceOnUse")
    filter.setAttribute("x", "-5%")
    filter.setAttribute("y", "-5%")
    filter.setAttribute("width", "110%")
    filter.setAttribute("height", "110%")
    filter.setAttribute("color-interpolation-filters", "sRGB")

    const edgeMask = document.createElementNS(ns, "feImage")
    edgeMask.setAttribute("result", "edgeMask")
    edgeMask.setAttribute("preserveAspectRatio", "none")

    const yMap = document.createElementNS(ns, "feImage")
    yMap.setAttribute("result", "yMap")
    yMap.setAttribute("preserveAspectRatio", "none")

    const xMap = document.createElementNS(ns, "feImage")
    xMap.setAttribute("result", "xMap")
    xMap.setAttribute("preserveAspectRatio", "none")

    const yEdge = document.createElementNS(ns, "feComposite")
    yEdge.setAttribute("in", "yMap")
    yEdge.setAttribute("in2", "edgeMask")
    yEdge.setAttribute("operator", "arithmetic")
    yEdge.setAttribute("k1", "1")
    yEdge.setAttribute("k2", "0")
    yEdge.setAttribute("k3", "0")
    yEdge.setAttribute("k4", "0")
    yEdge.setAttribute("result", "yEdge")

    const xEdge = document.createElementNS(ns, "feComposite")
    xEdge.setAttribute("in", "xMap")
    xEdge.setAttribute("in2", "edgeMask")
    xEdge.setAttribute("operator", "arithmetic")
    xEdge.setAttribute("k1", "1")
    xEdge.setAttribute("k2", "0")
    xEdge.setAttribute("k3", "0")
    xEdge.setAttribute("k4", "0")
    xEdge.setAttribute("result", "xEdge")

    const dispY = document.createElementNS(ns, "feDisplacementMap")
    dispY.setAttribute("in", "SourceGraphic")
    dispY.setAttribute("in2", "yEdge")
    dispY.setAttribute("xChannelSelector", "R")
    dispY.setAttribute("yChannelSelector", "R")
    dispY.setAttribute("scale", "0")
    dispY.setAttribute("result", "warpY")

    const dispX = document.createElementNS(ns, "feDisplacementMap")
    dispX.setAttribute("in", "warpY")
    dispX.setAttribute("in2", "xEdge")
    dispX.setAttribute("xChannelSelector", "R")
    dispX.setAttribute("yChannelSelector", "R")
    dispX.setAttribute("scale", "0")

    filter.appendChild(edgeMask)
    filter.appendChild(yMap)
    filter.appendChild(xMap)
    filter.appendChild(yEdge)
    filter.appendChild(xEdge)
    filter.appendChild(dispY)
    filter.appendChild(dispX)
    defs.appendChild(filter)
    svg.appendChild(defs)
    // SVG must live inside pageRoot so url(#id) resolves on that element
    pageRoot.insertBefore(svg, pageRoot.firstChild)

    const prevFilter = pageRoot.style.filter || ""
    const prevWebkit =
        (pageRoot.style as CSSStyleDeclaration & { WebkitFilter?: string })
            .WebkitFilter || ""
    const url = `url(#${filterId})`
    pageRoot.style.filter = url
    ;(pageRoot.style as CSSStyleDeclaration & { WebkitFilter?: string }).WebkitFilter =
        url

    return {
        pageRoot,
        svg,
        filter,
        filterId,
        edgeMask,
        yMap,
        xMap,
        dispY,
        dispX,
        prevFilter,
        prevWebkit,
        lastW: 0,
        lastH: 0,
        lastMaskKey: "",
    }
}

function destroyPageWarp(warp: PageWarp) {
    warp.pageRoot.style.filter = warp.prevFilter
    ;(warp.pageRoot.style as CSSStyleDeclaration & { WebkitFilter?: string }).WebkitFilter =
        warp.prevWebkit
    warp.svg.remove()
}

function syncPageWarp(
    warp: PageWarp,
    strength: number,
    edges: EdgePosition,
    edgeDepth: number,
    curvature: number,
    stretch: number
) {
    const rect = warp.pageRoot.getBoundingClientRect()
    const contentW = Math.max(rect.width, warp.pageRoot.clientWidth, 1)
    const contentH = Math.max(
        warp.pageRoot.scrollHeight,
        warp.pageRoot.clientHeight,
        rect.height,
        1
    )
    const viewH =
        typeof window !== "undefined"
            ? window.innerHeight || rect.height
            : rect.height
    const yInRoot = Math.max(0, warp.pageRoot.scrollTop || -rect.top)

    if (contentW !== warp.lastW || contentH !== warp.lastH) {
        warp.filter.setAttribute("x", "0")
        warp.filter.setAttribute("y", "0")
        warp.filter.setAttribute("width", String(contentW))
        warp.filter.setAttribute("height", String(contentH))
        for (const node of [warp.edgeMask, warp.yMap, warp.xMap]) {
            node.setAttribute("x", "0")
            node.setAttribute("y", "0")
            node.setAttribute("width", String(contentW))
            node.setAttribute("height", String(contentH))
        }
        setHref(warp.yMap, buildYMap(contentW, contentH))
        setHref(warp.xMap, buildXMap(contentW, contentH))
        warp.lastW = contentW
        warp.lastH = contentH
        warp.lastMaskKey = ""
    }

    const edgeFrac = 0.16 + Math.max(0, edgeDepth) * 0.16
    const maskKey = [
        Math.round(yInRoot),
        Math.round(viewH),
        Math.round(contentW),
        Math.round(contentH),
        edges,
        edgeFrac.toFixed(3),
    ].join(":")

    if (maskKey !== warp.lastMaskKey) {
        setHref(
            warp.edgeMask,
            buildViewportEdgeMask({
                width: contentW,
                height: contentH,
                yInRoot,
                viewH,
                edgeFrac,
                edges,
            })
        )
        warp.lastMaskKey = maskKey
    }

    const s = Math.max(0, Math.min(1, strength))
    const depth = Math.max(0.2, edgeDepth)
    const curve = Math.max(0.35, curvature)
    const str = Math.max(0.25, stretch)
    // Visible but below old override disaster (~8+i*36)
    const yScale = (10 + s * 28) * depth * curve
    const xScale = (3 + s * 10) * depth * str
    warp.dispY.setAttribute("scale", String(yScale))
    warp.dispX.setAttribute("scale", String(xScale))

    const expected = `url(#${warp.filterId})`
    if (warp.pageRoot.style.filter !== expected) {
        warp.pageRoot.style.filter = expected
        ;(
            warp.pageRoot.style as CSSStyleDeclaration & { WebkitFilter?: string }
        ).WebkitFilter = expected
    }
}

/**
 * Edge Refraction — Fixed fullscreen overlay.
 * Scroll Blur–style Mode / settle / hysteresis + SVG feDisplacementMap on page root.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function EdgeRefractionShader(
    props: Partial<EdgeRefractionShaderProps>
) {
    const {
        edges = "both",
        edgeDepth = 1.05,
        curvature = 1.2,
        stretch = 1,
        motion: motionOpts = DEFAULT_MOTION,
        advanced = DEFAULT_ADVANCED,
        style,
    } = props

    const {
        settleMs = DEFAULT_MOTION.settleMs,
        fadeIn = DEFAULT_MOTION.fadeIn,
        fadeOut = DEFAULT_MOTION.fadeOut,
    } = motionOpts ?? DEFAULT_MOTION

    const {
        editorPreview = DEFAULT_ADVANCED.editorPreview,
        respectReducedMotion = DEFAULT_ADVANCED.respectReducedMotion,
    } = advanced ?? DEFAULT_ADVANCED

    const isCanvas = useIsOnFramerCanvas() ?? false
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion() ?? false

    const activePreview: EditorPreview =
        editorPreview === "Always On" ||
        editorPreview === "Follow Scroll" ||
        editorPreview === "Off"
            ? editorPreview
            : "Always On"

    const activeEdges: EdgePosition =
        edges === "top" || edges === "bottom" || edges === "both"
            ? edges
            : "both"

    const respectReduced = respectReducedMotion && prefersReduced
    const isCanvasHidden = isCanvas && activePreview === "Off"

    const keepAlwaysOn =
        activePreview === "Always On" ||
        isStatic ||
        (isCanvas && activePreview === "Follow Scroll")

    const shouldAnimateByScroll =
        activePreview === "Follow Scroll" &&
        !isCanvas &&
        !isStatic &&
        !respectReduced &&
        !isCanvasHidden

    const safeSettle = Math.max(200, Math.min(700, Math.round(settleMs)))
    const safeDepth = Math.max(0, Math.min(1.5, edgeDepth))
    const safeCurve = Math.max(0, Math.min(2, curvature))
    const safeStretch = Math.max(0, Math.min(2.2, stretch))

    const wrapRef = useRef<HTMLDivElement>(null)
    const warpRef = useRef<PageWarp | null>(null)
    const strength = useMotionValue(
        respectReduced ? 0 : keepAlwaysOn ? 0.7 : 0
    )
    const lastScrollAtRef = useRef(0)
    const lastScrollYRef = useRef(0)
    const idleTimerRef = useRef<number | null>(null)
    const scrollRafRef = useRef<number | null>(null)
    const animRef = useRef<{ stop: () => void } | null>(null)
    const targetStrengthRef = useRef<number | null>(strength.get())

    const fadeInRef = useRef(fadeIn)
    const fadeOutRef = useRef(fadeOut)
    fadeInRef.current = fadeIn
    fadeOutRef.current = fadeOut

    const edgesRef = useRef(activeEdges)
    const depthRef = useRef(safeDepth)
    const curveRef = useRef(safeCurve)
    const stretchRef = useRef(safeStretch)
    edgesRef.current = activeEdges
    depthRef.current = safeDepth
    curveRef.current = safeCurve
    stretchRef.current = safeStretch

    const applyNow = (v: number) => {
        const warp = warpRef.current
        if (!warp) return
        syncPageWarp(
            warp,
            v,
            edgesRef.current,
            depthRef.current,
            curveRef.current,
            stretchRef.current
        )
    }

    // Mount SVG filter on page root (Desktop) — not per-sibling (wrong coords)
    useEffect(() => {
        if (typeof window === "undefined" || typeof document === "undefined") {
            return
        }
        if (isCanvasHidden || respectReduced) {
            if (warpRef.current) {
                destroyPageWarp(warpRef.current)
                warpRef.current = null
            }
            return
        }

        const wrap = wrapRef.current
        if (!wrap) return

        let cancelled = false
        let tries = 0

        const mount = () => {
            if (cancelled) return
            const page = resolvePageRoot(wrap)
            if (!page) {
                if (tries++ < 40) window.setTimeout(mount, 40)
                return
            }
            if (warpRef.current) {
                destroyPageWarp(warpRef.current)
                warpRef.current = null
            }
            const warp = createPageWarp(page)
            if (!warp) return
            warpRef.current = warp
            applyNow(strength.get())
        }

        mount()

        return () => {
            cancelled = true
            if (warpRef.current) {
                destroyPageWarp(warpRef.current)
                warpRef.current = null
            }
        }
    }, [activeEdges, isCanvasHidden, respectReduced, strength])

    useMotionValueEvent(strength, "change", (v) => {
        applyNow(v)
    })

    useEffect(() => {
        applyNow(strength.get())
    }, [activeEdges, safeDepth, safeCurve, safeStretch, strength])

    useEffect(() => {
        if (respectReduced) {
            animRef.current?.stop()
            strength.set(0)
            targetStrengthRef.current = 0
            return
        }
        if (keepAlwaysOn) {
            animRef.current?.stop()
            const pinned = isStatic ? 0.65 : 0.7
            strength.set(pinned)
            targetStrengthRef.current = pinned
            return
        }
        if (!shouldAnimateByScroll) {
            animRef.current?.stop()
            strength.set(0)
            targetStrengthRef.current = 0
        }
    }, [keepAlwaysOn, respectReduced, shouldAnimateByScroll, strength, isStatic])

    useEffect(() => {
        if (!shouldAnimateByScroll) return
        if (typeof window === "undefined") return

        const clearIdle = () => {
            if (idleTimerRef.current !== null) {
                window.clearTimeout(idleTimerRef.current)
                idleTimerRef.current = null
            }
        }

        const showWarp = () => {
            if (targetStrengthRef.current !== 1) {
                targetStrengthRef.current = 1
                animRef.current?.stop()
                animRef.current = animate(
                    strength,
                    1,
                    resolveTransition(DEFAULT_FADE_IN, fadeInRef.current)
                )
            }
        }

        const hideWarp = () => {
            if (targetStrengthRef.current === 0) return
            targetStrengthRef.current = 0
            animRef.current?.stop()
            animRef.current = animate(
                strength,
                0,
                resolveTransition(DEFAULT_FADE_OUT, fadeOutRef.current)
            )
        }

        const onActivity = () => {
            lastScrollAtRef.current =
                typeof performance !== "undefined"
                    ? performance.now()
                    : Date.now()
            showWarp()
            if (warpRef.current) warpRef.current.lastMaskKey = ""
            applyNow(strength.get())
            clearIdle()
            idleTimerRef.current = window.setTimeout(() => {
                const now =
                    typeof performance !== "undefined"
                        ? performance.now()
                        : Date.now()
                if (now - lastScrollAtRef.current < safeSettle - 16) return
                hideWarp()
            }, safeSettle)
        }

        const onScroll = (root: Window | Element) => {
            if (scrollRafRef.current !== null) return
            scrollRafRef.current = window.requestAnimationFrame(() => {
                scrollRafRef.current = null
                const y = readScrollY(root)
                const delta = Math.abs(y - lastScrollYRef.current)
                if (delta < SCROLL_HYSTERESIS_PX) return
                lastScrollYRef.current = y
                onActivity()
            })
        }

        const roots = collectScrollRoots(wrapRef.current)
        const opts: AddEventListenerOptions = { passive: true }
        const handlers = roots.map((root) => {
            const fn = () => onScroll(root)
            root.addEventListener("scroll", fn, opts)
            return { root, fn }
        })

        const hasScrollEnd = "onscrollend" in window
        const onScrollEnd = () => {
            lastScrollAtRef.current =
                typeof performance !== "undefined"
                    ? performance.now()
                    : Date.now()
            clearIdle()
            idleTimerRef.current = window.setTimeout(() => {
                const now =
                    typeof performance !== "undefined"
                        ? performance.now()
                        : Date.now()
                if (now - lastScrollAtRef.current < safeSettle - 16) return
                hideWarp()
            }, safeSettle)
        }
        if (hasScrollEnd) {
            for (const root of roots) {
                root.addEventListener("scrollend", onScrollEnd, opts)
            }
        }

        lastScrollYRef.current = readScrollY(window)

        return () => {
            for (const { root, fn } of handlers) {
                root.removeEventListener("scroll", fn, opts)
            }
            if (hasScrollEnd) {
                for (const root of roots) {
                    root.removeEventListener("scrollend", onScrollEnd, opts)
                }
            }
            if (scrollRafRef.current !== null) {
                window.cancelAnimationFrame(scrollRafRef.current)
                scrollRafRef.current = null
            }
            clearIdle()
            animRef.current?.stop()
            targetStrengthRef.current = null
        }
    }, [safeSettle, shouldAnimateByScroll, strength])

    return (
        <div
            ref={wrapRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "visible",
                pointerEvents: "none",
                ...style,
            }}
            aria-hidden={true}
        />
    )
}

EdgeRefractionShader.displayName = "Edge Refraction"

addPropertyControls(EdgeRefractionShader, {
    edges: {
        type: ControlType.Enum,
        title: "Edges",
        options: ["both", "top", "bottom"],
        optionTitles: ["Both", "Top", "Bottom"],
        displaySegmentedControl: true,
        defaultValue: "both",
        description: "Where content warps — top edge, bottom edge, or both.",
    },
    edgeDepth: {
        type: ControlType.Number,
        title: "Depth",
        defaultValue: 1.05,
        min: 0,
        max: 1.5,
        step: 0.01,
        description: "How strong the edge bend is at full strength.",
    },
    curvature: {
        type: ControlType.Number,
        title: "Curvature",
        defaultValue: 1.2,
        min: 0,
        max: 2,
        step: 0.01,
    },
    stretch: {
        type: ControlType.Number,
        title: "Stretch",
        defaultValue: 1,
        min: 0,
        max: 2.2,
        step: 0.01,
    },
    motion: {
        type: ControlType.Object,
        title: "Motion",
        optional: true,
        icon: "effect",
        controls: {
            settleMs: {
                type: ControlType.Number,
                title: "Settle",
                defaultValue: 400,
                min: 200,
                max: 700,
                step: 10,
                unit: "ms",
                description:
                    "Idle time after scroll before warp clears. Higher = stays longer.",
            },
            fadeIn: {
                type: ControlType.Transition,
                title: "Warp In",
                defaultValue: DEFAULT_FADE_IN,
            },
            fadeOut: {
                type: ControlType.Transition,
                title: "Warp Out",
                defaultValue: DEFAULT_FADE_OUT,
            },
        },
    },
    advanced: {
        type: ControlType.Object,
        title: "Advanced",
        optional: true,
        icon: "effect",
        controls: {
            editorPreview: {
                type: ControlType.Enum,
                title: "Mode",
                options: ["Always On", "Follow Scroll", "Off"],
                optionTitles: ["Always On", "Follow Scroll", "Off"],
                displaySegmentedControl: true,
                segmentedControlDirection: "vertical",
                defaultValue: "Always On",
                description:
                    "Always On = warp visible now. Follow Scroll = only while scrolling (Preview). Off = hide on canvas.",
            },
            respectReducedMotion: {
                type: ControlType.Boolean,
                title: "Reduce Motion",
                defaultValue: true,
                enabledTitle: "On",
                disabledTitle: "Off",
            },
        },
    },
})
