// @framerDisableUnlink
// BuiltByKern — scroll-linked layered backdrop blur for section chrome.
// Marketplace readiness update: canvas/static veil visibility, editor preview modes, in-view performance pause, fallback controls, reduced-motion calm veil, and SSR hardening.

import {
    addPropertyControls,
    ControlType,
    useIsOnFramerCanvas,
    useIsStaticRenderer,
} from "framer"
import {
    animate,
    useInView,
    useMotionValue,
    useReducedMotion,
    type Transition,
} from "framer-motion"
import {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    type CSSProperties,
} from "react"

type FadeEdge = "top" | "bottom" | "left" | "right"
type MaskShape = "edge" | "u" | "soft"
type ScrollTarget = "window" | "parent"
type EditorPreview = "Always On" | "Follow Scroll" | "Off"
type FallbackMode = "Auto" | "Always" | "Never"

interface BuiltByKern_ScrollBlurProps {
    fadeEdge: FadeEdge
    shape: MaskShape
    scrollTarget: ScrollTarget
    editorPreview: EditorPreview
    fallbackMode: FallbackMode
    fallbackTint: string
    fallbackOpacity: number
    respectReducedMotion: boolean
    blurAmount: number
    layerCount: number
    settleMs: number
    fadeIn: Transition
    fadeOut: Transition
    style?: CSSProperties
}

const DEFAULT_FADE_IN: Transition = {
    type: "spring",
    stiffness: 420,
    damping: 38,
    mass: 0.85,
}

const DEFAULT_FADE_OUT: Transition = {
    type: "spring",
    stiffness: 110,
    damping: 22,
    mass: 1.05,
}

const STRENGTH_VAR = "--kern-blur-str"

/** Avoid SSR layout-effect warnings on Framer publish. */
const useSafeLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect

function isHorizontalEdge(fadeEdge: FadeEdge): boolean {
    return fadeEdge === "left" || fadeEdge === "right"
}

function linearGradientDir(fadeEdge: FadeEdge): string {
    switch (fadeEdge) {
        case "top":
            return "to bottom"
        case "bottom":
            return "to top"
        case "left":
            return "to right"
        case "right":
            return "to left"
        default: {
            const _exhaustive: never = fadeEdge
            return _exhaustive
        }
    }
}

/** Map Framer Transition controls to spring or tween for animate(). */
function resolveTransition(
    fallback: Transition,
    next?: Transition
): Transition {
    const source = next ?? fallback
    const type =
        source && typeof source === "object" && "type" in source
            ? source.type
            : undefined
    const duration =
        source && typeof source === "object" && "duration" in source
            ? source.duration
            : undefined
    const wantsTween =
        type === "tween" ||
        type === "keyframes" ||
        (type !== "spring" && typeof duration === "number")

    if (wantsTween) {
        const ease =
            source && typeof source === "object" && "ease" in source
                ? source.ease
                : undefined
        return {
            type: "tween",
            duration: typeof duration === "number" ? duration : 0.28,
            ease: ease ?? [0.22, 1, 0.36, 1],
        }
    }

    const stiffness =
        source && typeof source === "object" && "stiffness" in source
            ? source.stiffness
            : undefined
    const damping =
        source && typeof source === "object" && "damping" in source
            ? source.damping
            : undefined
    const mass =
        source && typeof source === "object" && "mass" in source
            ? source.mass
            : undefined
    const fallbackStiffness =
        fallback && typeof fallback === "object" && "stiffness" in fallback
            ? fallback.stiffness
            : 420
    const fallbackDamping =
        fallback && typeof fallback === "object" && "damping" in fallback
            ? fallback.damping
            : 38
    const fallbackMass =
        fallback && typeof fallback === "object" && "mass" in fallback
            ? fallback.mass
            : 0.85

    return {
        type: "spring",
        stiffness:
            typeof stiffness === "number"
                ? stiffness
                : (fallbackStiffness ?? 420),
        damping:
            typeof damping === "number" ? damping : (fallbackDamping ?? 38),
        mass: typeof mass === "number" ? mass : (fallbackMass ?? 0.85),
    }
}

/** Walk up to the nearest overflow scroll container; else window. */
function findScrollParent(node: HTMLElement): HTMLElement | Window {
    if (typeof window === "undefined") return node

    let el: HTMLElement | null = node.parentElement
    while (el) {
        const { overflow, overflowX, overflowY } = window.getComputedStyle(el)
        const canScrollY =
            overflowY === "auto" ||
            overflowY === "scroll" ||
            overflowY === "overlay"
        const canScrollX =
            overflowX === "auto" ||
            overflowX === "scroll" ||
            overflowX === "overlay"
        const canScroll =
            overflow === "auto" ||
            overflow === "scroll" ||
            overflow === "overlay"
        if (canScrollY || canScrollX || canScroll) {
            return el
        }
        el = el.parentElement
    }
    return window
}

function shouldUseFallback(
    mode: FallbackMode,
    supportsBackdrop: boolean
): boolean {
    switch (mode) {
        case "Always":
            return true
        case "Never":
            return false
        case "Auto":
            return !supportsBackdrop
        default: {
            const _exhaustive: never = mode
            return _exhaustive
        }
    }
}

function buildLayerMask(
    shape: MaskShape,
    fadeEdge: FadeEdge,
    index: number,
    layerCount: number
): string {
    const t = (index + 1) / layerCount
    const band = 100 / layerCount

    if (shape === "u") {
        if (isHorizontalEdge(fadeEdge)) {
            const openAtLeft = fadeEdge === "right"
            const cx = openAtLeft ? "-6%" : "106%"
            const clearStop = Math.max(14, 38 - index * (16 / layerCount))
            const softStop = Math.min(94, clearStop + 16 + t * 12)
            const hardStop = Math.min(100, softStop + 12 + t * 7)
            return `radial-gradient(ellipse ${96 + t * 24}% ${122 + t * 26}% at ${cx} 50%, rgba(255,255,255,0) 0%, rgba(255,255,255,0) ${clearStop}%, rgba(255,255,255,0.5) ${softStop}%, rgba(255,255,255,1) ${hardStop}%)`
        }

        const openAtTop = fadeEdge === "bottom"
        const cy = openAtTop ? "-6%" : "106%"
        const clearStop = Math.max(14, 38 - index * (16 / layerCount))
        const softStop = Math.min(94, clearStop + 16 + t * 12)
        const hardStop = Math.min(100, softStop + 12 + t * 7)
        return `radial-gradient(ellipse ${122 + t * 26}% ${96 + t * 24}% at 50% ${cy}, rgba(255,255,255,0) 0%, rgba(255,255,255,0) ${clearStop}%, rgba(255,255,255,0.5) ${softStop}%, rgba(255,255,255,1) ${hardStop}%)`
    }

    const gradientDir = linearGradientDir(fadeEdge)

    if (shape === "soft") {
        const eased = 1 - Math.pow(1 - t, 1.4)
        const cover = 100 - eased * (100 - band * 0.42)
        const fadeStart = Math.max(0, cover - band * 1.35)
        return `linear-gradient(${gradientDir}, rgba(255,255,255,1) 0%, rgba(255,255,255,0.78) ${fadeStart}%, rgba(255,255,255,0) ${cover}%)`
    }

    // Edge: three-stop band with slight lead-in (not a two-stop hard cut).
    const denseEnd = 100 - (index + 0.28) * band
    const mid = Math.max(0, denseEnd - band * 0.68)
    const lead = Math.max(0, mid - band * 0.22)
    return `linear-gradient(${gradientDir}, rgba(255,255,255,1) 0%, rgba(255,255,255,1) ${lead}%, rgba(255,255,255,0.72) ${mid}%, rgba(255,255,255,0) ${denseEnd}%)`
}

function layerBlurPx(
    shape: MaskShape,
    blurAmount: number,
    index: number,
    layerCount: number
): number {
    const t = (index + 1) / layerCount
    if (shape === "soft") {
        return blurAmount * 0.58 * Math.pow(t, 0.72)
    }
    if (shape === "u") {
        return blurAmount * (0.48 + 0.52 * Math.pow(t, 0.9))
    }
    return blurAmount * Math.pow(t, 0.88)
}

/**
 * BuiltByKern_ScrollBlur
 *
 * Layered backdrop-filter veil that ramps with scroll activity and eases off
 * after idle. Drop on nav exits, hero→body seams, or sticky chrome.
 *
 * @framerIntrinsicWidth 1080
 * @framerIntrinsicHeight 180
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function BuiltByKern_ScrollBlur(
    props: Partial<BuiltByKern_ScrollBlurProps>
) {
    const {
        fadeEdge = "bottom",
        shape = "edge",
        scrollTarget = "window",
        editorPreview = "Always On",
        fallbackMode = "Auto",
        fallbackTint = "#8B8678",
        fallbackOpacity = 0.14,
        respectReducedMotion = true,
        blurAmount = 14,
        layerCount = 5,
        settleMs = 220,
        fadeIn = DEFAULT_FADE_IN,
        fadeOut = DEFAULT_FADE_OUT,
        style,
    } = props

    const isCanvas = useIsOnFramerCanvas() ?? false
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion() ?? false
    const supportsBackdrop = useMemo(() => {
        if (typeof window === "undefined") return true
        const css = window.CSS
        if (!css || typeof css.supports !== "function") return false
        return (
            css.supports("backdrop-filter", "blur(1px)") ||
            css.supports("-webkit-backdrop-filter", "blur(1px)")
        )
    }, [])
    const activeEditorPreview: EditorPreview =
        editorPreview === "Always On" ||
        editorPreview === "Follow Scroll" ||
        editorPreview === "Off"
            ? editorPreview
            : "Always On"
    const activeFallbackMode: FallbackMode =
        fallbackMode === "Auto" ||
        fallbackMode === "Always" ||
        fallbackMode === "Never"
            ? fallbackMode
            : "Auto"
    const safeFallbackOpacity = Math.max(0, Math.min(1, fallbackOpacity))
    const respectReduced = respectReducedMotion && prefersReduced
    const isCanvasHidden = isCanvas && activeEditorPreview === "Off"
    const keepAlwaysOn = isStatic || (isCanvas && activeEditorPreview === "Always On")
    const shouldAnimateByScroll = !keepAlwaysOn && !respectReduced
    const shouldRenderFallback = shouldUseFallback(
        activeFallbackMode,
        supportsBackdrop
    )
    const initialStrength = respectReduced ? 0.4 : keepAlwaysOn ? 1 : 0

    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { margin: "200px 0px 200px 0px" })
    const blurStrength = useMotionValue(initialStrength)
    const scrollingRef = useRef(false)
    const idleTimerRef = useRef<number | null>(null)
    const animRef = useRef<{ stop: () => void } | null>(null)

    const fadeInRef = useRef(fadeIn)
    const fadeOutRef = useRef(fadeOut)
    fadeInRef.current = fadeIn
    fadeOutRef.current = fadeOut

    const safeLayerCount = Math.max(2, Math.min(8, Math.round(layerCount)))
    const safeBlur = Math.max(0, Math.min(32, blurAmount))
    const safeSettle = Math.max(60, Math.min(900, Math.round(settleMs)))
    const activeShape: MaskShape =
        shape === "u" || shape === "soft" || shape === "edge" ? shape : "edge"
    const activeEdge: FadeEdge =
        fadeEdge === "top" ||
        fadeEdge === "bottom" ||
        fadeEdge === "left" ||
        fadeEdge === "right"
            ? fadeEdge
            : "bottom"
    const activeScrollTarget: ScrollTarget =
        scrollTarget === "parent" ? "parent" : "window"

    useSafeLayoutEffect(() => {
        const node = containerRef.current
        if (!node) return

        const write = (value: number) => {
            node.style.setProperty(STRENGTH_VAR, String(Math.max(0, value)))
        }

        write(blurStrength.get())
        const unsub = blurStrength.on("change", write)

        if (respectReduced) {
            blurStrength.set(0.4)
        } else if (keepAlwaysOn) {
            blurStrength.set(1)
        } else {
            blurStrength.set(0)
        }

        return unsub
    }, [blurStrength, keepAlwaysOn, respectReduced])

    useEffect(() => {
        if (!shouldAnimateByScroll) return
        if (!isInView) return
        if (typeof window === "undefined") return

        const node = containerRef.current
        if (!node) return

        const clearIdle = () => {
            if (idleTimerRef.current !== null) {
                window.clearTimeout(idleTimerRef.current)
                idleTimerRef.current = null
            }
        }

        const onScroll = () => {
            if (!scrollingRef.current) {
                scrollingRef.current = true
                animRef.current?.stop()
                animRef.current = animate(
                    blurStrength,
                    1,
                    resolveTransition(DEFAULT_FADE_IN, fadeInRef.current)
                )
            }

            clearIdle()
            idleTimerRef.current = window.setTimeout(() => {
                scrollingRef.current = false
                animRef.current?.stop()
                animRef.current = animate(
                    blurStrength,
                    0,
                    resolveTransition(DEFAULT_FADE_OUT, fadeOutRef.current)
                )
            }, safeSettle)
        }

        const target: HTMLElement | Window =
            activeScrollTarget === "parent"
                ? findScrollParent(node)
                : window

        // Bubble phase only — avoids capture-phase fingerprints.
        const opts: AddEventListenerOptions = { passive: true }
        target.addEventListener("scroll", onScroll, opts)

        return () => {
            target.removeEventListener("scroll", onScroll, opts)
            clearIdle()
            animRef.current?.stop()
        }
    }, [activeScrollTarget, blurStrength, isInView, safeSettle, shouldAnimateByScroll])

    const layers = useMemo(() => {
        const nodes: JSX.Element[] = []

        for (let i = 0; i < safeLayerCount; i += 1) {
            const t = (i + 1) / safeLayerCount
            const layerBlur = layerBlurPx(
                activeShape,
                safeBlur,
                i,
                safeLayerCount
            )
            const mask = buildLayerMask(
                activeShape,
                activeEdge,
                i,
                safeLayerCount
            )
            const filter = `blur(calc(${layerBlur}px * var(${STRENGTH_VAR}, 0)))`

            nodes.push(
                <div
                    key={`${activeShape}-${activeEdge}-${i}`}
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        ...(shouldRenderFallback
                            ? {
                                  background: fallbackTint,
                                  opacity: safeFallbackOpacity * (0.35 + 0.65 * t),
                              }
                            : supportsBackdrop
                            ? {
                                  backdropFilter: filter,
                                  WebkitBackdropFilter: filter,
                              }
                            : {}),
                        WebkitMaskImage: mask,
                        maskImage: mask,
                    }}
                />
            )
        }

        return nodes
    }, [
        activeEdge,
        activeShape,
        fallbackTint,
        safeBlur,
        safeFallbackOpacity,
        safeLayerCount,
        shouldRenderFallback,
        supportsBackdrop,
    ])

    const containerStyle: CSSProperties = {
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
    }

    if (isCanvasHidden) {
        return null
    }

    return (
        <div ref={containerRef} style={containerStyle} aria-hidden="true">
            {layers}
        </div>
    )
}

BuiltByKern_ScrollBlur.displayName = "Scroll Blur"

addPropertyControls(BuiltByKern_ScrollBlur, {
    shape: {
        type: ControlType.Enum,
        title: "Shape",
        options: ["edge", "u", "soft"],
        optionTitles: ["Edge", "U", "Soft"],
        displaySegmentedControl: true,
        segmentedControlDirection: "vertical",
        defaultValue: "edge",
        description:
            "Edge = linear band. U = cup along the fade edge. Soft = wider, gentler falloff.",
    },
    fadeEdge: {
        type: ControlType.Enum,
        title: "Edge",
        options: ["bottom", "top", "left", "right"],
        optionTitles: ["Bottom", "Top", "Left", "Right"],
        displaySegmentedControl: true,
        segmentedControlDirection: "vertical",
        defaultValue: "bottom",
        description:
            "Dense side for Edge/Soft. For U, that side is the closed/dense end (open opposite).",
    },
    scrollTarget: {
        type: ControlType.Enum,
        title: "Scroll Target",
        options: ["window", "parent"],
        optionTitles: ["Page", "Parent"],
        displaySegmentedControl: true,
        defaultValue: "window",
        description:
            "Page = window scroll. Parent = nearest overflow scroll ancestor (modals, panels).",
    },
    editorPreview: {
        type: ControlType.Enum,
        title: "Editor Preview",
        options: ["Always On", "Follow Scroll", "Off"],
        optionTitles: ["Always On", "Follow Scroll", "Off"],
        displaySegmentedControl: true,
        defaultValue: "Always On",
        description:
            "Canvas-only behavior. Always On pins veil at full strength, Follow Scroll animates by scroll, Off hides only on canvas.",
    },
    fallbackMode: {
        type: ControlType.Enum,
        title: "Fallback Mode",
        options: ["Auto", "Always", "Never"],
        optionTitles: ["Auto", "Always", "Never"],
        displaySegmentedControl: true,
        defaultValue: "Auto",
        description:
            "Auto uses tint fallback only when backdrop blur is unsupported. Always forces fallback. Never disables fallback.",
    },
    fallbackTint: {
        type: ControlType.Color,
        title: "Fallback Tint",
        defaultValue: "#8B8678",
        hidden: (props) => props.fallbackMode === "Never",
        description: "Tint used by fallback veil layers.",
    },
    fallbackOpacity: {
        type: ControlType.Number,
        title: "Fallback Opacity",
        defaultValue: 0.14,
        min: 0,
        max: 1,
        step: 0.01,
        hidden: (props) => props.fallbackMode === "Never",
        description: "Overall fallback veil intensity.",
    },
    respectReducedMotion: {
        type: ControlType.Boolean,
        title: "Respect Reduced Motion",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
        description:
            "When enabled, reduced-motion users see a calm static veil instead of scroll animation.",
    },
    blurAmount: {
        type: ControlType.Number,
        title: "Blur",
        defaultValue: 14,
        min: 0,
        max: 32,
        step: 1,
        unit: "px",
        description: "Maximum blur strength at full activation.",
    },
    layerCount: {
        type: ControlType.Number,
        title: "Layers",
        defaultValue: 5,
        min: 2,
        max: 8,
        step: 1,
        displayStepper: true,
        description:
            "More layers smooth the falloff but cost more performance. Prefer 4–6.",
    },
    settleMs: {
        type: ControlType.Number,
        title: "Settle",
        defaultValue: 220,
        min: 60,
        max: 900,
        step: 10,
        unit: "ms",
        description: "Idle time after scroll before blur eases out.",
    },
    fadeIn: {
        type: ControlType.Transition,
        title: "Fade In",
        defaultValue: DEFAULT_FADE_IN,
        description: "Transition used when scroll activity starts.",
    },
    fadeOut: {
        type: ControlType.Transition,
        title: "Fade Out",
        defaultValue: DEFAULT_FADE_OUT,
        description: "Transition used when blur settles after scroll idle.",
    },
})
