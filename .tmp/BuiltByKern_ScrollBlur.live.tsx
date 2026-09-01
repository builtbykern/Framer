// @framerDisableUnlink
// BuiltByKern — scroll-linked layered backdrop blur for section chrome.
// Blur radii stay fixed (rewriting backdrop-filter every frame = Safari flicker).
// Follow Scroll: snap veil visibility + soft scrim opacity only.

import {
    addPropertyControls,
    ControlType,
    useIsOnFramerCanvas,
    useIsStaticRenderer,
} from "framer"
import {
    animate,
    motion,
    useMotionValue,
    useReducedMotion,
    type Transition,
} from "framer-motion"
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react"

type Position = "top" | "bottom"
type MaskShape = "edge" | "u"
type EditorPreview = "Always On" | "Follow Scroll" | "Off"
type FallbackMode = "Auto" | "Always" | "Never"

interface AdvancedOptions {
    editorPreview: EditorPreview
    fallbackMode: FallbackMode
    fallbackTint: string
    fallbackOpacity: number
    respectReducedMotion: boolean
}

interface MotionOptions {
    settleMs: number
    fadeIn: Transition
    fadeOut: Transition
}

interface BuiltByKern_ScrollBlurProps {
    position: Position
    shape: MaskShape
    blurAmount: number
    motion: MotionOptions
    advanced: AdvancedOptions
    style?: CSSProperties
}

const DEFAULT_ADVANCED: AdvancedOptions = {
    editorPreview: "Follow Scroll",
    fallbackMode: "Auto",
    fallbackTint: "#8B8678",
    fallbackOpacity: 0.08,
    respectReducedMotion: true,
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

/** Scrim-only dissolve — never used to rewrite blur. */
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

const LAYER_COUNT = 3

/** Ignore tiny scroll jitter that would yo-yo the veil. */
const SCROLL_HYSTERESIS_PX = 8

function linearGradientDir(position: Position): string {
    switch (position) {
        case "top":
            return "to bottom"
        case "bottom":
            return "to top"
        default: {
            const _exhaustive: never = position
            return _exhaustive
        }
    }
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
                ? fallback.duration
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

/** Softer falloffs — less hard rim, more ambient haze. */
function buildLayerMask(
    shape: MaskShape,
    position: Position,
    index: number,
    layerCount: number
): string {
    const t = (index + 1) / layerCount
    const inv = 1 - index / Math.max(1, layerCount - 1)

    if (shape === "u") {
        const openAtTop = position === "bottom"
        const cy = openAtTop ? "-8%" : "108%"
        const ew = 130 + t * 40
        const eh = 155 + t * 35
        const clearStop = Math.round(20 + inv * 28)
        const midStop = Math.min(78, clearStop + 22 + inv * 6)
        const hardStop = Math.min(96, midStop + 12 + t * 5)
        return `radial-gradient(ellipse ${ew}% ${eh}% at 50% ${cy}, rgba(255,255,255,0) 0%, rgba(255,255,255,0) ${clearStop}%, rgba(255,255,255,0.35) ${midStop}%, rgba(255,255,255,1) ${hardStop}%)`
    }

    const gradientDir = linearGradientDir(position)
    const reach = (layerCount - index) / layerCount
    const hold = 4 + index * 6
    const fadeEnd = Math.round(42 + reach * 26)
    const mid = Math.round(hold + (fadeEnd - hold) * 0.4)
    return `linear-gradient(${gradientDir}, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) ${hold}%, rgba(255,255,255,0.35) ${mid}%, rgba(255,255,255,0) ${fadeEnd}%)`
}

function layerBlurPx(
    shape: MaskShape,
    blurAmount: number,
    index: number,
    layerCount: number
): number {
    const t = (index + 1) / layerCount
    if (shape === "u") {
        return blurAmount * (0.22 + 0.78 * Math.pow(t, 0.95))
    }
    return blurAmount * Math.pow(t, 1.2)
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

/**
 * BuiltByKern_ScrollBlur
 *
 * Layered backdrop blur for section chrome.
 * Always On = pinned veil. Follow Scroll = show while scrolling (Preview).
 *
 * @framerIntrinsicWidth 1080
 * @framerIntrinsicHeight 300
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function BuiltByKern_ScrollBlur(
    props: Partial<BuiltByKern_ScrollBlurProps>
) {
    const {
        position = "bottom",
        shape = "edge",
        blurAmount = 10,
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
        fallbackMode = DEFAULT_ADVANCED.fallbackMode,
        fallbackTint = DEFAULT_ADVANCED.fallbackTint,
        fallbackOpacity = DEFAULT_ADVANCED.fallbackOpacity,
        respectReducedMotion = DEFAULT_ADVANCED.respectReducedMotion,
    } = advanced ?? DEFAULT_ADVANCED

    const isCanvas = useIsOnFramerCanvas() ?? false
    const isStatic = useIsStaticRenderer()
    const prefersReduced = useReducedMotion() ?? false
    const supportsBackdrop = useMemo(() => {
        if (typeof window === "undefined") return true
        const css = window.CSS
        if (!css || typeof css.supports !== "function") return true
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
            : "Follow Scroll"
    const activeFallbackMode: FallbackMode =
        fallbackMode === "Auto" ||
        fallbackMode === "Always" ||
        fallbackMode === "Never"
            ? fallbackMode
            : "Auto"

    const safeFallbackOpacity = Math.max(0, Math.min(0.35, fallbackOpacity))
    const respectReduced = respectReducedMotion && prefersReduced
    const isCanvasHidden = isCanvas && activeEditorPreview === "Off"

    // Always On = pinned. Canvas Follow Scroll shows full veil so designers see it;
    // live Follow Scroll only runs off-canvas (Preview / site).
    const keepAlwaysOn =
        activeEditorPreview === "Always On" ||
        isStatic ||
        (isCanvas && activeEditorPreview === "Follow Scroll")

    const shouldAnimateByScroll =
        activeEditorPreview === "Follow Scroll" &&
        !isCanvas &&
        !isStatic &&
        !respectReduced &&
        !isCanvasHidden

    const shouldRenderFallback = shouldUseFallback(
        activeFallbackMode,
        supportsBackdrop
    )

    // Scrim paints solid tint only (safe to animate opacity). Peak = Scrim Strength.
    const scrimPeak = safeFallbackOpacity

    const initialActive = respectReduced || keepAlwaysOn
    const initialScrim = respectReduced
        ? scrimPeak * 0.55
        : keepAlwaysOn
          ? scrimPeak
          : 0

    const containerRef = useRef<HTMLDivElement>(null)
    const [veilVisible, setVeilVisible] = useState(initialActive)
    const scrimOpacity = useMotionValue(initialScrim)
    const lastScrollAtRef = useRef(0)
    const lastScrollYRef = useRef(0)
    const idleTimerRef = useRef<number | null>(null)
    const scrollRafRef = useRef<number | null>(null)
    const animRef = useRef<{ stop: () => void } | null>(null)
    const targetScrimRef = useRef<number | null>(initialScrim)
    const veilVisibleRef = useRef(initialActive)
    const scrimPeakRef = useRef(scrimPeak)
    scrimPeakRef.current = scrimPeak

    const fadeInRef = useRef(fadeIn)
    const fadeOutRef = useRef(fadeOut)
    fadeInRef.current = fadeIn
    fadeOutRef.current = fadeOut

    const safeBlur = Math.max(0, Math.min(16, blurAmount))
    const safeSettle = Math.max(200, Math.min(700, Math.round(settleMs)))
    const activeShape: MaskShape = shape === "u" ? "u" : "edge"
    const activePosition: Position = position === "top" ? "top" : "bottom"

    useEffect(() => {
        if (respectReduced) {
            animRef.current?.stop()
            setVeilVisible(true)
            veilVisibleRef.current = true
            const soft = scrimPeak * 0.55
            scrimOpacity.set(soft)
            targetScrimRef.current = soft
            return
        }
        if (keepAlwaysOn) {
            animRef.current?.stop()
            setVeilVisible(true)
            veilVisibleRef.current = true
            scrimOpacity.set(scrimPeak)
            targetScrimRef.current = scrimPeak
            return
        }
        if (!shouldAnimateByScroll) {
            animRef.current?.stop()
            setVeilVisible(false)
            veilVisibleRef.current = false
            scrimOpacity.set(0)
            targetScrimRef.current = 0
        }
    }, [
        keepAlwaysOn,
        respectReduced,
        shouldAnimateByScroll,
        scrimOpacity,
        scrimPeak,
    ])

    useEffect(() => {
        if (!shouldAnimateByScroll) return
        if (typeof window === "undefined") return

        const clearIdle = () => {
            if (idleTimerRef.current !== null) {
                window.clearTimeout(idleTimerRef.current)
                idleTimerRef.current = null
            }
        }

        const showVeil = () => {
            const peak = scrimPeakRef.current
            if (!veilVisibleRef.current) {
                veilVisibleRef.current = true
                setVeilVisible(true)
            }
            if (targetScrimRef.current !== peak) {
                targetScrimRef.current = peak
                animRef.current?.stop()
                animRef.current = animate(
                    scrimOpacity,
                    peak,
                    resolveTransition(DEFAULT_FADE_IN, fadeInRef.current)
                )
            }
        }

        const hideVeil = () => {
            if (targetScrimRef.current === 0) return
            targetScrimRef.current = 0
            animRef.current?.stop()
            animRef.current = animate(scrimOpacity, 0, {
                ...resolveTransition(DEFAULT_FADE_OUT, fadeOutRef.current),
                onComplete: () => {
                    veilVisibleRef.current = false
                    setVeilVisible(false)
                },
            })
        }

        const onActivity = () => {
            lastScrollAtRef.current =
                typeof performance !== "undefined"
                    ? performance.now()
                    : Date.now()

            showVeil()
            clearIdle()
            idleTimerRef.current = window.setTimeout(() => {
                const now =
                    typeof performance !== "undefined"
                        ? performance.now()
                        : Date.now()
                if (now - lastScrollAtRef.current < safeSettle - 16) return
                hideVeil()
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

        const roots = collectScrollRoots(containerRef.current)
        const opts: AddEventListenerOptions = { passive: true }
        const handlers = roots.map((root) => {
            const fn = () => onScroll(root)
            root.addEventListener("scroll", fn, opts)
            return { root, fn }
        })

        // scrollend only refreshes idle — never restarts enter (that caused flicker).
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
                hideVeil()
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
            targetScrimRef.current = null
        }
    }, [safeSettle, shouldAnimateByScroll, scrimOpacity])

    const layers = useMemo(() => {
        const nodes: JSX.Element[] = []

        for (let i = 0; i < LAYER_COUNT; i += 1) {
            const t = (i + 1) / LAYER_COUNT
            const layerBlur = layerBlurPx(
                activeShape,
                safeBlur,
                i,
                LAYER_COUNT
            )
            const mask = buildLayerMask(
                activeShape,
                activePosition,
                i,
                LAYER_COUNT
            )
            const useBackdrop = !shouldRenderFallback && supportsBackdrop
            // Fixed filter string — never rewritten during scroll.
            const filter =
                useBackdrop && layerBlur > 0.001
                    ? `blur(${layerBlur.toFixed(2)}px)`
                    : undefined

            nodes.push(
                <div
                    key={`${activeShape}-${activePosition}-${i}`}
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        visibility: veilVisible ? "visible" : "hidden",
                        ...(useBackdrop && filter
                            ? {
                                  backdropFilter: filter,
                                  WebkitBackdropFilter: filter,
                              }
                            : {
                                  background: fallbackTint,
                                  opacity:
                                      safeFallbackOpacity * (0.3 + 0.5 * t),
                              }),
                        WebkitMaskImage: mask,
                        maskImage: mask,
                    }}
                />
            )
        }

        return nodes
    }, [
        activePosition,
        activeShape,
        fallbackTint,
        safeBlur,
        safeFallbackOpacity,
        shouldRenderFallback,
        supportsBackdrop,
        veilVisible,
    ])

    const scrimMask = useMemo(
        () => buildLayerMask(activeShape, activePosition, 1, LAYER_COUNT),
        [activePosition, activeShape]
    )

    const containerStyle: CSSProperties = {
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        visibility: isCanvasHidden ? "hidden" : "visible",
    }

    return (
        <div ref={containerRef} style={containerStyle} aria-hidden="true">
            {layers}
            {/* Soft dissolve only — never put opacity on backdrop-filter ancestors. */}
            {!shouldRenderFallback && supportsBackdrop ? (
                <motion.div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: scrimOpacity,
                        background: fallbackTint,
                        WebkitMaskImage: scrimMask,
                        maskImage: scrimMask,
                        pointerEvents: "none",
                    }}
                />
            ) : null}
        </div>
    )
}

BuiltByKern_ScrollBlur.displayName = "Scroll Blur"

addPropertyControls(BuiltByKern_ScrollBlur, {
    shape: {
        type: ControlType.Enum,
        title: "Shape",
        options: ["edge", "u"],
        optionTitles: ["Edge", "U"],
        displaySegmentedControl: true,
        defaultValue: "edge",
        description:
            "Edge = soft falloff from the dense side. U = cupped veil — clear mouth opposite the rim.",
    },
    position: {
        type: ControlType.Enum,
        title: "Position",
        options: ["bottom", "top"],
        optionTitles: ["Bottom", "Top"],
        displaySegmentedControl: true,
        defaultValue: "bottom",
        description:
            "Where the blur is densest. Top pins haze to the top edge; Bottom pins it to the bottom.",
    },
    blurAmount: {
        type: ControlType.Number,
        title: "Blur",
        defaultValue: 10,
        min: 0,
        max: 16,
        step: 1,
        unit: "px",
        description:
            "Peak blur (fixed per layer). Keep ≤12 for a subtle, stable look.",
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
                    "Idle time after scroll before the veil clears. Higher = stays longer.",
            },
            fadeIn: {
                type: ControlType.Transition,
                title: "Scrim In",
                defaultValue: DEFAULT_FADE_IN,
                description:
                    "Soft tint enter only (blur snaps on — avoids Safari flicker).",
            },
            fadeOut: {
                type: ControlType.Transition,
                title: "Scrim Out",
                defaultValue: DEFAULT_FADE_OUT,
                description:
                    "Soft tint exit; blur hides when the tint finishes.",
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
                options: ["Follow Scroll", "Always On", "Off"],
                optionTitles: ["Follow Scroll", "Always On", "Off"],
                displaySegmentedControl: true,
                segmentedControlDirection: "vertical",
                defaultValue: "Follow Scroll",
                description:
                    "Follow Scroll = show while scrolling (test in Preview). Always On = pinned veil, no scroll. Off = hide on canvas.",
            },
            fallbackMode: {
                type: ControlType.Enum,
                title: "Fallback",
                options: ["Auto", "Always", "Never"],
                optionTitles: ["Auto", "Always", "Never"],
                displaySegmentedControl: true,
                segmentedControlDirection: "vertical",
                defaultValue: "Auto",
            },
            fallbackTint: {
                type: ControlType.Color,
                title: "Scrim Tint",
                defaultValue: "#8B8678",
                hidden: (props) => props.fallbackMode === "Never",
            },
            fallbackOpacity: {
                type: ControlType.Number,
                title: "Scrim Strength",
                defaultValue: 0.08,
                min: 0,
                max: 0.35,
                step: 0.01,
                hidden: (props) => props.fallbackMode === "Never",
                description: "Tint softness while the veil is active.",
            },
            respectReducedMotion: {
                type: ControlType.Boolean,
                title: "Reduced Motion",
                defaultValue: true,
                enabledTitle: "On",
                disabledTitle: "Off",
            },
        },
    },
})
