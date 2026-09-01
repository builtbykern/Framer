// @framerDisableUnlink
// BuiltByKern — scroll-linked progressive backdrop blur for section chrome.
// Blur technique: fixed per-layer backdrop-filter + banded masks (ProgressiveBlur).
// Scroll motion: opacity only — never rewrite filter (avoids Safari flicker).

import {
    addPropertyControls,
    ControlType,
    useIsOnFramerCanvas,
    useIsStaticRenderer,
} from "framer"
import {
    animate,
    motion as Motion,
    useInView,
    useMotionValue,
    useReducedMotion,
    type Transition,
} from "framer-motion"
import {
    useEffect,
    useMemo,
    useRef,
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
    editorPreview: "Always On",
    fallbackMode: "Auto",
    fallbackTint: "#8B8678",
    fallbackOpacity: 0.14,
    respectReducedMotion: true,
}

/** AUDIT --ease-out: cubic-bezier(0.23, 1, 0.32, 1) */
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]
const EASE_DISSOLVE: [number, number, number, number] = [0.33, 0, 0.2, 1]

const DEFAULT_FADE_IN: Transition = {
    type: "tween",
    duration: 0.25,
    ease: EASE_OUT,
}

const DEFAULT_FADE_OUT: Transition = {
    type: "tween",
    duration: 0.34,
    ease: EASE_DISSOLVE,
}

const DEFAULT_MOTION: MotionOptions = {
    settleMs: 520,
    fadeIn: DEFAULT_FADE_IN,
    fadeOut: DEFAULT_FADE_OUT,
}

/** ProgressiveBlur-style stack — banded masks + fixed blur per layer. */
const LAYER_COUNT = 5

function linearGradientDir(position: Position): string {
    switch (position) {
        case "top":
            // Dense at top edge → gradient builds toward top (same as ProgressiveBlur "top")
            return "to top"
        case "bottom":
            return "to bottom"
        default: {
            const _exhaustive: never = position
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
                : 0.25
        return {
            type: "tween",
            duration:
                typeof duration === "number"
                    ? Math.max(duration, 0.12)
                    : (fallbackDuration ?? 0.25),
            ease: ease ?? EASE_OUT,
            delay: 0,
        }
    }

    const stiffness =
        "stiffness" in source && typeof source.stiffness === "number"
            ? source.stiffness
            : undefined
    const damping =
        "damping" in source && typeof source.damping === "number"
            ? source.damping
            : undefined
    const mass =
        "mass" in source && typeof source.mass === "number"
            ? source.mass
            : undefined

    const rawStiffness = typeof stiffness === "number" ? stiffness : 160
    if (rawStiffness > 200) return fallback

    return {
        type: "spring",
        stiffness: Math.min(rawStiffness, 180),
        damping: typeof damping === "number" ? Math.max(damping, 24) : 28,
        mass: typeof mass === "number" ? Math.max(mass, 1) : 1,
        delay: 0,
    }
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

/**
 * ProgressiveBlur exponential curve — remarcable force ramp along the band.
 * At progress=1 → blurAmount px.
 */
function layerBlurPx(blurAmount: number, index: number, layerCount: number): number {
    const progress = (index + 1) / layerCount
    return Math.pow(2, progress * 4) * 0.0625 * blurAmount
}

/** Edge: ProgressiveBlur banded linear mask (strip per layer). */
function buildEdgeMask(
    position: Position,
    index: number,
    layerCount: number
): string {
    const i = index + 1
    const increment = 100 / layerCount
    const p1 = Math.round((increment * i - increment) * 10) / 10
    const p2 = Math.round(increment * i * 10) / 10
    const p3 = Math.round((increment * i + increment) * 10) / 10
    const p4 = Math.round((increment * i + increment * 2) * 10) / 10

    let gradient = `transparent ${p1}%, black ${p2}%`
    if (p3 <= 100) gradient += `, black ${p3}%`
    if (p4 <= 100) gradient += `, transparent ${p4}%`

    return `linear-gradient(${linearGradientDir(position)}, ${gradient})`
}

/**
 * U: cupped veil — clear mouth opposite the dense rim.
 * Ellipse intersects the frame; each layer tightens the rim (fixed blur).
 */
function buildUMask(
    position: Position,
    index: number,
    layerCount: number
): string {
    const t = (index + 1) / layerCount
    const inv = 1 - index / Math.max(1, layerCount - 1)
    const openAtTop = position === "bottom"
    const cy = openAtTop ? "-6%" : "106%"
    const ew = 125 + t * 45
    const eh = 150 + t * 40
    const clearStop = Math.round(16 + inv * 30)
    const midStop = Math.min(82, clearStop + 18 + inv * 8)
    const hardStop = Math.min(98, midStop + 14 + t * 6)
    return `radial-gradient(ellipse ${ew}% ${eh}% at 50% ${cy}, rgba(255,255,255,0) 0%, rgba(255,255,255,0) ${clearStop}%, rgba(255,255,255,0.45) ${midStop}%, rgba(255,255,255,1) ${hardStop}%)`
}

/**
 * BuiltByKern_ScrollBlur
 *
 * Progressive backdrop-filter veil that fades in with scroll activity and
 * dissolves after idle. Drop on nav exits, hero→body seams, or sticky chrome.
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
        blurAmount = 16,
        motion = DEFAULT_MOTION,
        advanced = DEFAULT_ADVANCED,
        style,
    } = props

    const {
        settleMs = DEFAULT_MOTION.settleMs,
        fadeIn = DEFAULT_MOTION.fadeIn,
        fadeOut = DEFAULT_MOTION.fadeOut,
    } = motion ?? DEFAULT_MOTION

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
    const keepAlwaysOn =
        isStatic || (isCanvas && activeEditorPreview === "Always On")
    const shouldAnimateByScroll = !keepAlwaysOn && !respectReduced
    const shouldRenderFallback = shouldUseFallback(
        activeFallbackMode,
        supportsBackdrop
    )
    const initialOpacity = respectReduced ? 0.4 : keepAlwaysOn ? 1 : 0

    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { margin: "200px 0px 200px 0px" })
    // Opacity-only veil strength — filters stay static (no flicker).
    const veilOpacity = useMotionValue(initialOpacity)
    const lastScrollAtRef = useRef(0)
    const idleTimerRef = useRef<number | null>(null)
    const scrollRafRef = useRef<number | null>(null)
    const animRef = useRef<{ stop: () => void } | null>(null)
    const targetOpacityRef = useRef<number | null>(null)

    const fadeInRef = useRef(fadeIn)
    const fadeOutRef = useRef(fadeOut)
    fadeInRef.current = fadeIn
    fadeOutRef.current = fadeOut

    const safeBlur = Math.max(0, Math.min(20, blurAmount))
    const safeSettle = Math.max(120, Math.min(900, Math.round(settleMs)))
    const activeShape: MaskShape = shape === "u" ? "u" : "edge"
    const activePosition: Position = position === "top" ? "top" : "bottom"

    // Sync canvas / reduced-motion pinned states.
    useEffect(() => {
        animRef.current?.stop()
        if (respectReduced) {
            veilOpacity.set(0.4)
            targetOpacityRef.current = 0.4
        } else if (keepAlwaysOn) {
            veilOpacity.set(1)
            targetOpacityRef.current = 1
        } else if (!shouldAnimateByScroll) {
            veilOpacity.set(0)
            targetOpacityRef.current = 0
        } else {
            // Follow Scroll: start clear until first activity.
            veilOpacity.set(0)
            targetOpacityRef.current = 0
        }
    }, [keepAlwaysOn, respectReduced, shouldAnimateByScroll, veilOpacity])

    useEffect(() => {
        if (!shouldAnimateByScroll) return
        if (!isInView) return
        if (typeof window === "undefined") return

        const clearIdle = () => {
            if (idleTimerRef.current !== null) {
                window.clearTimeout(idleTimerRef.current)
                idleTimerRef.current = null
            }
        }

        const easeTo = (target: number, transition: Transition) => {
            targetOpacityRef.current = target
            animRef.current?.stop()
            animRef.current = animate(veilOpacity, target, transition)
        }

        const onActivity = () => {
            lastScrollAtRef.current =
                typeof performance !== "undefined"
                    ? performance.now()
                    : Date.now()

            if (targetOpacityRef.current !== 1) {
                easeTo(
                    1,
                    resolveTransition(DEFAULT_FADE_IN, fadeInRef.current)
                )
            }

            clearIdle()
            idleTimerRef.current = window.setTimeout(() => {
                const now =
                    typeof performance !== "undefined"
                        ? performance.now()
                        : Date.now()
                if (now - lastScrollAtRef.current < safeSettle - 16) return
                if (targetOpacityRef.current !== 0) {
                    easeTo(
                        0,
                        resolveTransition(DEFAULT_FADE_OUT, fadeOutRef.current)
                    )
                }
            }, safeSettle)
        }

        const onScroll = () => {
            if (scrollRafRef.current !== null) return
            scrollRafRef.current = window.requestAnimationFrame(() => {
                scrollRafRef.current = null
                onActivity()
            })
        }

        const opts: AddEventListenerOptions = { passive: true }
        window.addEventListener("scroll", onScroll, opts)
        const hasScrollEnd = "onscrollend" in window
        if (hasScrollEnd) {
            window.addEventListener("scrollend", onActivity, opts)
        }

        return () => {
            window.removeEventListener("scroll", onScroll, opts)
            if (hasScrollEnd) {
                window.removeEventListener("scrollend", onActivity, opts)
            }
            if (scrollRafRef.current !== null) {
                window.cancelAnimationFrame(scrollRafRef.current)
                scrollRafRef.current = null
            }
            clearIdle()
            animRef.current?.stop()
            targetOpacityRef.current = null
        }
    }, [isInView, safeSettle, shouldAnimateByScroll, veilOpacity])

    const layers = useMemo(() => {
        const nodes: JSX.Element[] = []
        const count = LAYER_COUNT

        for (let i = 0; i < count; i += 1) {
            const blurPx = layerBlurPx(safeBlur, i, count)
            const mask =
                activeShape === "u"
                    ? buildUMask(activePosition, i, count)
                    : buildEdgeMask(activePosition, i, count)
            const useBackdrop = !shouldRenderFallback && supportsBackdrop
            const t = (i + 1) / count

            const layerStyle: CSSProperties = {
                position: "absolute",
                inset: 0,
                WebkitMaskImage: mask,
                maskImage: mask,
                ...(useBackdrop
                    ? {
                          backdropFilter: `blur(${blurPx.toFixed(2)}px)`,
                          WebkitBackdropFilter: `blur(${blurPx.toFixed(2)}px)`,
                      }
                    : {
                          background: fallbackTint,
                          opacity: safeFallbackOpacity * (0.25 + 0.75 * t),
                      }),
            }

            nodes.push(
                <div
                    key={`${activeShape}-${activePosition}-${i}`}
                    aria-hidden="true"
                    style={layerStyle}
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
    ])

    const containerStyle: CSSProperties = {
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        visibility: isCanvasHidden ? "hidden" : "visible",
    }

    const canvasHintStyle: CSSProperties = {
        position: "absolute",
        inset: 0,
        background: "transparent",
        boxShadow: "inset 0 0 0 1px rgba(91, 88, 78, 0.28)",
        pointerEvents: "none",
    }

    return (
        <div ref={containerRef} style={containerStyle} aria-hidden="true">
            <Motion.div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: veilOpacity,
                }}
            >
                {layers}
            </Motion.div>
            {isCanvas && !isCanvasHidden ? (
                <div style={canvasHintStyle} />
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
            "Edge = progressive banded falloff. U = cupped veil — clear mouth opposite the rim.",
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
        defaultValue: 16,
        min: 0,
        max: 20,
        step: 1,
        unit: "px",
        description:
            "Peak blur on the densest band (capped at 20px for Safari).",
    },
    motion: {
        type: ControlType.Object,
        title: "Motion",
        optional: false,
        icon: "effect",
        controls: {
            settleMs: {
                type: ControlType.Number,
                title: "Settle",
                defaultValue: DEFAULT_MOTION.settleMs,
                min: 120,
                max: 900,
                step: 10,
                unit: "ms",
                description:
                    "Idle time after scroll before the blur eases out. Higher = less flicker.",
            },
            fadeIn: {
                type: ControlType.Transition,
                title: "Fade In",
                defaultValue: DEFAULT_FADE_IN,
                description: "Ease when scroll activity starts (prefer soft tween).",
            },
            fadeOut: {
                type: ControlType.Transition,
                title: "Fade Out",
                defaultValue: DEFAULT_FADE_OUT,
                description: "Ease when blur dissolves after idle.",
            },
        },
    },
    advanced: {
        type: ControlType.Object,
        title: "Advanced",
        optional: false,
        icon: "object",
        controls: {
            editorPreview: {
                type: ControlType.Enum,
                title: "Editor Preview",
                options: ["Always On", "Follow Scroll", "Off"],
                optionTitles: ["Always On", "Follow Scroll", "Off"],
                defaultValue: "Always On",
                description:
                    "Canvas-only. Always On pins full strength; Follow Scroll animates; Off hides on canvas.",
            },
            fallbackMode: {
                type: ControlType.Enum,
                title: "Fallback",
                options: ["Auto", "Always", "Never"],
                optionTitles: ["Auto", "Always", "Never"],
                defaultValue: "Auto",
                description:
                    "Auto tints when backdrop blur is unsupported. Always forces tint. Never disables.",
            },
            fallbackTint: {
                type: ControlType.Color,
                title: "Fallback Tint",
                defaultValue: DEFAULT_ADVANCED.fallbackTint,
            },
            fallbackOpacity: {
                type: ControlType.Number,
                title: "Fallback Opacity",
                defaultValue: DEFAULT_ADVANCED.fallbackOpacity,
                min: 0,
                max: 1,
                step: 0.01,
            },
            respectReducedMotion: {
                type: ControlType.Boolean,
                title: "Reduced Motion",
                defaultValue: true,
                enabledTitle: "On",
                disabledTitle: "Off",
                description:
                    "When on, reduced-motion users get a calm static veil instead of scroll animation.",
            },
        },
    },
})
