// @framerDisableUnlink
// BuiltByKern — scroll-linked layered backdrop blur for section chrome.

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

/** Fast ease-out enter — scroll chrome must feel immediate (≤300ms UI budget). */
const DEFAULT_FADE_IN: Transition = {
    type: "tween",
    duration: 0.25,
    ease: EASE_OUT,
}

/**
 * Single continuous dissolve 1→0.
 * Softer than enter: longer + ease that eases into clear (no mid-floor hitch).
 */
const EASE_DISSOLVE: [number, number, number, number] = [0.33, 0, 0.2, 1]

const DEFAULT_FADE_OUT: Transition = {
    type: "tween",
    duration: 0.48,
    ease: EASE_DISSOLVE,
}

const DEFAULT_MOTION: MotionOptions = {
    settleMs: 520,
    fadeIn: DEFAULT_FADE_IN,
    fadeOut: DEFAULT_FADE_OUT,
}

/** Progressive stack — 3 layers keeps Edge/U readable with less backdrop shimmer. */
const LAYER_COUNT = 3

/** Avoid SSR layout-effect warnings on Framer publish. */
const useSafeLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect

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

    // Overshoot / duration-based springs feel binary on a 0–1 veil.
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

    // High-stiffness springs on a 0–1 veil feel binary/snappy.
    if (rawStiffness > 200) {
        return fallback
    }

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

function buildLayerMask(
    shape: MaskShape,
    position: Position,
    index: number,
    layerCount: number
): string {
    const t = (index + 1) / layerCount
    const inv = 1 - index / Math.max(1, layerCount - 1)

    if (shape === "u") {
        // Cupped veil: clear mouth opposite the dense rim.
        // Ellipse must INTERSECT the frame (old -38%/58% sat outside → solid slab).
        const openAtTop = position === "bottom"
        const cy = openAtTop ? "-6%" : "106%"
        // Tall + wide ellipse → visible side walls + rim on short frames.
        const ew = 125 + t * 45
        const eh = 150 + t * 40
        // Soft layers: large clear mouth. Hard layers: thick rim / walls.
        const clearStop = Math.round(16 + inv * 30)
        const midStop = Math.min(82, clearStop + 18 + inv * 8)
        const hardStop = Math.min(98, midStop + 14 + t * 6)
        return `radial-gradient(ellipse ${ew}% ${eh}% at 50% ${cy}, rgba(255,255,255,0) 0%, rgba(255,255,255,0) ${clearStop}%, rgba(255,255,255,0.45) ${midStop}%, rgba(255,255,255,1) ${hardStop}%)`
    }

    // Edge: dense at Position, stepped force — soft layer must NOT wash the frame.
    const gradientDir = linearGradientDir(position)
    const reach = (layerCount - index) / layerCount
    const hold = 6 + index * 8
    const fadeEnd = Math.round(34 + reach * 28) // soft ~62%, mid ~53%, hard ~43%
    const mid = Math.round(hold + (fadeEnd - hold) * 0.42)
    return `linear-gradient(${gradientDir}, rgba(255,255,255,1) 0%, rgba(255,255,255,1) ${hold}%, rgba(255,255,255,0.45) ${mid}%, rgba(255,255,255,0) ${fadeEnd}%)`
}

function layerBlurPx(
    shape: MaskShape,
    blurAmount: number,
    index: number,
    layerCount: number
): number {
    const t = (index + 1) / layerCount
    if (shape === "u") {
        // Soft walls, hard rim — remarcable cup depth.
        return blurAmount * (0.28 + 0.72 * Math.pow(t, 0.9))
    }
    // Edge: steep stack so rim force reads vs far haze.
    return blurAmount * Math.pow(t, 1.35)
}

/**
 * BuiltByKern_ScrollBlur
 *
 * Layered backdrop-filter veil that ramps with scroll activity and eases off
 * after idle. Drop on nav exits, hero→body seams, or sticky chrome.
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
    const lastScrollAtRef = useRef(0)
    const idleTimerRef = useRef<number | null>(null)
    const animRef = useRef<{ stop: () => void } | null>(null)
    const targetStrengthRef = useRef<number | null>(null)

    const fadeInRef = useRef(fadeIn)
    const fadeOutRef = useRef(fadeOut)
    fadeInRef.current = fadeIn
    fadeOutRef.current = fadeOut

    const safeLayerCount = LAYER_COUNT
    const safeBlur = Math.max(0, Math.min(20, blurAmount))
    const safeSettle = Math.max(120, Math.min(900, Math.round(settleMs)))
    const activeShape: MaskShape = shape === "u" ? "u" : "edge"
    const activePosition: Position = position === "top" ? "top" : "bottom"

    useSafeLayoutEffect(() => {
        const node = containerRef.current
        if (!node) return

        const write = (value: number) => {
            const s = Math.max(0, value)
            const layers = node.querySelectorAll<HTMLElement>("[data-kern-blur]")
            layers.forEach((el) => {
                const base = Number(el.dataset.kernBlur)
                if (!Number.isFinite(base)) return
                const px = Math.max(0, base * s)
                const filter = px > 0.001 ? `blur(${px}px)` : "none"
                el.style.backdropFilter = filter
                el.style.setProperty("-webkit-backdrop-filter", filter)
            })
        }

        write(blurStrength.get())
        const unsub = blurStrength.on("change", write)

        if (respectReduced) {
            blurStrength.set(0.4)
            targetStrengthRef.current = 0.4
        } else if (keepAlwaysOn) {
            blurStrength.set(1)
            targetStrengthRef.current = 1
        } else {
            blurStrength.set(0)
            targetStrengthRef.current = 0
        }

        return unsub
    }, [
        blurStrength,
        keepAlwaysOn,
        respectReduced,
        safeBlur,
        activeShape,
        activePosition,
        shouldRenderFallback,
        supportsBackdrop,
    ])

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
            targetStrengthRef.current = target
            animRef.current?.stop()
            animRef.current = animate(blurStrength, target, transition)
        }

        const onScroll = () => {
            lastScrollAtRef.current =
                typeof performance !== "undefined" ? performance.now() : Date.now()

            // One continuous rise — do not restart while already targeting 1.
            if (targetStrengthRef.current !== 1) {
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
                // Abort if scroll resumed after this timer was scheduled.
                if (now - lastScrollAtRef.current < safeSettle - 16) return

                // One continuous dissolve — no floor/stage-2 hitch.
                if (targetStrengthRef.current !== 0) {
                    easeTo(
                        0,
                        resolveTransition(DEFAULT_FADE_OUT, fadeOutRef.current)
                    )
                }
            }, safeSettle)
        }

        // Bubble phase only — avoids capture-phase fingerprints.
        const opts: AddEventListenerOptions = { passive: true }
        window.addEventListener("scroll", onScroll, opts)

        return () => {
            window.removeEventListener("scroll", onScroll, opts)
            clearIdle()
            animRef.current?.stop()
            targetStrengthRef.current = null
        }
    }, [blurStrength, isInView, safeSettle, shouldAnimateByScroll])

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
                activePosition,
                i,
                safeLayerCount
            )
            const useBackdrop = !shouldRenderFallback && supportsBackdrop

            nodes.push(
                <div
                    key={`${activeShape}-${activePosition}-${i}`}
                    aria-hidden="true"
                    {...(useBackdrop
                        ? { "data-kern-blur": String(layerBlur) }
                        : {})}
                    style={{
                        position: "absolute",
                        inset: 0,
                        ...(shouldRenderFallback
                            ? {
                                  background: fallbackTint,
                                  opacity:
                                      safeFallbackOpacity * (0.35 + 0.65 * t),
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
        activePosition,
        activeShape,
        fallbackTint,
        safeBlur,
        safeFallbackOpacity,
        safeLayerCount,
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
        // Keep layout selectable on canvas when Editor Preview is Off.
        visibility: isCanvasHidden ? "hidden" : "visible",
    }

    // Hairline only — full-bleed tint flattened Shape / force reading on canvas.
    const canvasHintStyle: CSSProperties = {
        position: "absolute",
        inset: 0,
        background: "transparent",
        boxShadow: "inset 0 0 0 1px rgba(91, 88, 78, 0.28)",
        pointerEvents: "none",
    }

    return (
        <div ref={containerRef} style={containerStyle} aria-hidden="true">
            {layers}
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
            "Edge = straight falloff from the dense side. U = cupped veil — clear mouth opposite the rim.",
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
            "Maximum blur at full strength (capped at 20px for Safari performance).",
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
                defaultValue: 520,
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
        optional: true,
        icon: "effect",
        controls: {
            editorPreview: {
                type: ControlType.Enum,
                title: "Editor Preview",
                options: ["Always On", "Follow Scroll", "Off"],
                optionTitles: ["Always On", "Follow Scroll", "Off"],
                displaySegmentedControl: true,
                segmentedControlDirection: "vertical",
                defaultValue: "Always On",
                description:
                    "Canvas-only. Always On pins full strength; Follow Scroll animates; Off hides on canvas.",
            },
            fallbackMode: {
                type: ControlType.Enum,
                title: "Fallback",
                options: ["Auto", "Always", "Never"],
                optionTitles: ["Auto", "Always", "Never"],
                displaySegmentedControl: true,
                segmentedControlDirection: "vertical",
                defaultValue: "Auto",
                description:
                    "Auto tints when backdrop blur is unsupported. Always forces tint. Never disables.",
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
