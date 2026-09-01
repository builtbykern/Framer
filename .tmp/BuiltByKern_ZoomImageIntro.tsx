// @framerDisableUnlink
// BuiltByKern — Zoom Image Intro. Cinematic stacked zoom for page reveals.

import {
    addPropertyControls,
    ControlType,
    useIsStaticRenderer,
} from "framer"
import {
    motion,
    useReducedMotion,
    type Transition,
} from "framer-motion"
import {
    startTransition,
    useCallback,
    useEffect,
    useMemo,
    useState,
    type CSSProperties,
} from "react"

interface ResponsiveImage {
    src: string
    srcSet?: string
    alt?: string
}

type PaceCurve = "even" | "accelerate" | "decelerate" | "pulse"

interface BuiltByKern_ZoomImageIntroProps {
    images: ResponsiveImage[]
    delayBetweenImages: number
    transition: Transition
    contentZoom: number
    zoomDirection: "in" | "out"
    /** Sequence velocity curve — durations + gaps vary by beat */
    paceCurve: PaceCurve
    objectFit: "cover" | "contain" | "fill" | "Cover" | "Contain" | "Fill"
    background: string
    autoDismiss: boolean
    holdAfterSequence: number
    onComplete?: () => void
    style?: CSSProperties
    // Framer may pass title-slug aliases depending on control titles
    delay?: number
    hold?: number
    pace?: PaceCurve
}

const DEFAULT_IMAGES: ResponsiveImage[] = [
    {
        src: "https://framerusercontent.com/images/DrTCmwsHZCDZxwLJifEazsVRLw.jpg",
        alt: "Architecture reflection",
    },
    {
        src: "https://framerusercontent.com/images/kR7vJnaR4mr492Eh85QIljAgMo.jpg",
        alt: "Desert dunes",
    },
    {
        src: "https://framerusercontent.com/images/wzfQUEqelANg6KJaCS4x9ND8BcA.jpg",
        alt: "Neon night street",
    },
    {
        src: "https://framerusercontent.com/images/xc6RSzoauENwvYFaIGXV11vYKY.jpg",
        alt: "Museum hallway light",
    },
    {
        src: "https://framerusercontent.com/images/cLb7UGIQF8BWITULuyyRm1ELuK8.jpg",
        alt: "Editorial fashion red gown",
    },
    {
        src: "https://framerusercontent.com/images/OiRvAghWxNaKuhtUe3sw13T2k.jpg",
        alt: "Coastal road sunset",
    },
]

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]
/** GSAP expo.out–like curve for cinematic camera zoom */
const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const SCALE_DURATION = 1.35
/** Gap between beats — wide enough that each zoom reads as one clear beat. */
const DEFAULT_DELAY_BETWEEN = 0.5
/** Keep fade near the zoom beat so lower layers don't flash as a photo-bg. */
const OPACITY_DURATION = 1.0
/** Previous layer leaves as the next starts — solid `background` shows through. */
const HANDOFF_DURATION = 0.24
/** Last frame soft settle before auto-exit (rare delight beat). */
const SETTLE_DURATION = 0.35
const SETTLE_SCALE = 1.02
/** Reduced-motion: gentle opacity only, no scale. */
const REDUCED_MOTION_FADE = 0.2

const DEFAULT_TRANSITION: Transition = {
    type: "tween",
    ease: EASE_EXPO,
    duration: SCALE_DURATION,
}

const AUTO_EXIT_DURATION_CAP = 0.45

const layerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    transformOrigin: "50% 50%",
}

const imgStyleBase: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    display: "block",
    pointerEvents: "none",
    userSelect: "none",
}

function getTransitionDuration(transition: Transition | undefined): number {
    if (!transition) return SCALE_DURATION
    if (typeof transition.duration === "number") return transition.duration
    return SCALE_DURATION
}

function getTransitionDelay(transition: Transition | undefined): number {
    if (!transition || typeof transition.delay !== "number") return 0
    return transition.delay
}

/** Ease only — never spread spring props (stiffness/damping) into tweens. */
function getTweenEase(
    transition: Transition | undefined
): NonNullable<Transition["ease"]> {
    if (transition && "ease" in transition && transition.ease != null) {
        return transition.ease as NonNullable<Transition["ease"]>
    }
    return EASE_EXPO
}

/** 0 → 1 along the image sequence */
function sequenceProgress(index: number, count: number): number {
    if (count <= 1) return 0
    return index / (count - 1)
}

/**
 * Velocity multiplier for a beat on the pace curve.
 * accelerate: slow start → snappy finish (sequence speeds up)
 * decelerate: snappy start → slow land (sequence slows down)
 * pulse: slow ends, fast middle
 */
function paceMultiplier(t: number, curve: PaceCurve): number {
    const clamped = Math.max(0, Math.min(1, t))
    switch (curve) {
        case "even":
            return 1
        case "accelerate":
            // Later beats faster: ~1.38 → 0.62
            return 1.38 - clamped * 0.76
        case "decelerate":
            // Later beats slower: ~0.62 → 1.38
            return 0.62 + clamped * 0.76
        case "pulse": {
            const mid = 1 - Math.abs(clamped - 0.5) * 2 // 0 ends → 1 middle
            return 1.22 - mid * 0.52 // ~1.22 → 0.70 → 1.22
        }
        default: {
            const _exhaustive: never = curve
            return _exhaustive
        }
    }
}

/** Cumulative start delays with curved gaps between beats */
function buildStartDelays(
    count: number,
    baseGap: number,
    transitionDelay: number,
    curve: PaceCurve
): number[] {
    const starts: number[] = []
    let acc = transitionDelay
    for (let i = 0; i < count; i++) {
        starts.push(acc)
        if (i < count - 1) {
            const gapT = sequenceProgress(i, count)
            acc += baseGap * paceMultiplier(gapT, curve)
        }
    }
    return starts
}

/**
 * BuiltByKern_ZoomImageIntro
 *
 * Cinematic stacked zoom sequence for hero intros / page reveals.
 * Control title aliases: Delay Between Images may arrive as `delay`,
 * Hold After Sequence as `hold`, Pace Curve as `pace`.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function BuiltByKern_ZoomImageIntro(props: Partial<BuiltByKern_ZoomImageIntroProps>) {
    const {
        images: imagesProp,
        delayBetweenImages: delayProp,
        delay: delayAlias,
        transition = DEFAULT_TRANSITION,
        contentZoom = 1.5,
        zoomDirection = "out",
        paceCurve: paceCurveProp,
        pace: paceAlias,
        objectFit: objectFitProp = "cover",
        background = "#000000",
        autoDismiss = true,
        holdAfterSequence: holdProp,
        hold: holdAlias,
        onComplete,
        style,
    } = props

    const delayBetweenImages = delayProp ?? delayAlias ?? DEFAULT_DELAY_BETWEEN
    const holdAfterSequence = holdProp ?? holdAlias ?? 0.2
    const paceCurve: PaceCurve = paceCurveProp ?? paceAlias ?? "accelerate"
    const objectFit = String(objectFitProp).toLowerCase() as
        | "cover"
        | "contain"
        | "fill"

    const isStatic = useIsStaticRenderer()
    const prefersReducedMotion = useReducedMotion()

    const images = useMemo(() => {
        const source =
            Array.isArray(imagesProp) && imagesProp.length > 0
                ? imagesProp
                : DEFAULT_IMAGES
        return source.filter((image) => Boolean(image?.src))
    }, [imagesProp])

    const [phase, setPhase] = useState<"enter" | "exit" | "gone">("enter")
    /** Highest layer index that has started — only head-1…head stay mounted. */
    const [head, setHead] = useState(-1)

    const baseScaleDuration = getTransitionDuration(transition)
    const transitionDelay = getTransitionDelay(transition)

    const startDelays = useMemo(
        () =>
            buildStartDelays(
                images.length,
                delayBetweenImages,
                transitionDelay,
                paceCurve
            ),
        [images.length, delayBetweenImages, transitionDelay, paceCurve]
    )

    const sequenceMs = useMemo(() => {
        if (images.length === 0) return 0
        const lastIndex = images.length - 1
        const lastStart = startDelays[lastIndex] ?? transitionDelay
        const lastDuration =
            baseScaleDuration *
                paceMultiplier(
                    sequenceProgress(lastIndex, images.length),
                    paceCurve
                ) +
            SETTLE_DURATION
        return (lastStart + lastDuration + holdAfterSequence) * 1000
    }, [
        images.length,
        startDelays,
        transitionDelay,
        baseScaleDuration,
        paceCurve,
        holdAfterSequence,
    ])

    const finish = useCallback(() => {
        startTransition(() => {
            setPhase((current) => (current === "enter" ? "exit" : current))
        })
    }, [])

    const handleExitComplete = useCallback(() => {
        startTransition(() => setPhase("gone"))
        onComplete?.()
    }, [onComplete])

    useEffect(() => {
        if (isStatic || !autoDismiss) return
        if (typeof window === "undefined") return
        if (phase !== "enter") return

        const delayMs = prefersReducedMotion
            ? Math.max(holdAfterSequence, REDUCED_MOTION_FADE + 0.05) * 1000
            : images.length === 0
              ? 0
              : sequenceMs

        const id = window.setTimeout(() => finish(), delayMs)
        return () => window.clearTimeout(id)
    }, [
        isStatic,
        prefersReducedMotion,
        autoDismiss,
        images.length,
        sequenceMs,
        holdAfterSequence,
        finish,
        phase,
    ])

    // Mount layers on their beat so at most 2 DOM nodes animate at once.
    useEffect(() => {
        if (isStatic || prefersReducedMotion) return
        if (typeof window === "undefined") return

        startTransition(() => setHead(-1))
        const ids: number[] = []
        for (let i = 0; i < images.length; i++) {
            const ms = Math.max(0, (startDelays[i] ?? 0) * 1000)
            ids.push(
                window.setTimeout(() => {
                    startTransition(() =>
                        setHead((current) => Math.max(current, i))
                    )
                }, ms)
            )
        }
        return () => {
            ids.forEach((id) => window.clearTimeout(id))
        }
    }, [images.length, startDelays, isStatic, prefersReducedMotion])

    const rootStyle: CSSProperties = {
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background,
    }

    const imgStyle: CSSProperties = {
        ...imgStyleBase,
        objectFit,
    }

    if (isStatic) {
        // Mid-sequence freeze: stacked scales so the canvas / Marketplace
        // thumbnail reads as a zoom intro, not a flat photo.
        const previewCount = Math.min(3, images.length)
        const previewFrames = images.slice(-previewCount)
        const amount = Math.max(contentZoom, 1.1)
        const full = 1
        const compact = 1 / amount
        const grows = zoomDirection === "out"
        // Progress through the zoom for [oldest … newest] of the stack
        const progressStops =
            previewCount === 1
                ? [1]
                : previewCount === 2
                  ? [0.55, 0.22]
                  : [1, 0.55, 0.22]
        const opacityStops =
            previewCount === 1
                ? [1]
                : previewCount === 2
                  ? [0.55, 1]
                  : [0.35, 0.65, 1]

        return (
            <div
                style={rootStyle}
                role="img"
                aria-label="Zoom image intro preview"
            >
                {previewFrames.map((frame, i) => {
                    const t = progressStops[i] ?? 1
                    const scale = grows
                        ? compact + (full - compact) * t
                        : full + (compact - full) * t
                    return (
                        <div
                            key={`${frame.src}-static-${i}`}
                            style={{
                                ...layerStyle,
                                zIndex: i + 1,
                                opacity: opacityStops[i] ?? 1,
                                transform: `scale(${scale})`,
                            }}
                        >
                            <img
                                src={frame.src}
                                srcSet={frame.srcSet}
                                alt={frame.alt ?? ""}
                                style={imgStyle}
                                draggable={false}
                            />
                        </div>
                    )
                })}
            </div>
        )
    }

    const exitDuration = Math.min(
        getTransitionDuration(transition),
        AUTO_EXIT_DURATION_CAP
    )

    const exitTransition: Transition = {
        type: "tween",
        delay: 0,
        duration: exitDuration,
        ease: EASE_OUT,
    }

    const lastFrame = images[images.length - 1]
    const lastIndex = images.length - 1

    if (phase === "gone") return null

    return (
        <motion.div
            style={rootStyle}
            role="status"
            aria-live="polite"
            aria-busy={phase === "enter"}
            initial={false}
            animate={
                phase === "exit"
                    ? { opacity: 0, transform: "scale(0.98)" }
                    : { opacity: 1, transform: "scale(1)" }
            }
            transition={phase === "exit" ? exitTransition : { duration: 0 }}
            onAnimationComplete={() => {
                if (phase === "exit") handleExitComplete()
            }}
        >
            {prefersReducedMotion ? (
                lastFrame ? (
                    <motion.img
                        src={lastFrame.src}
                        srcSet={lastFrame.srcSet}
                        alt={lastFrame.alt ?? ""}
                        style={imgStyle}
                        draggable={false}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            type: "tween",
                            duration: REDUCED_MOTION_FADE,
                            ease: EASE_OUT,
                        }}
                    />
                ) : null
            ) : (
                images.map((image, index) => {
                    // Active window: previous + current (at most 2 layers)
                    const windowStart = Math.max(0, head - 1)
                    if (head < 0 || index < windowStart || index > head) {
                        return null
                    }

                    const zIndex = index + 1
                    const isLast = index === lastIndex
                    // Absolute beat timing is handled by mount schedule → delay 0
                    const delay = 0
                    const t = sequenceProgress(index, images.length)
                    const pace = paceMultiplier(t, paceCurve)

                    // Frame size on screen (not Ken Burns crop):
                    // out  = grows  (small → full)  — hacia fuera / más grandes
                    // in   = shrinks (full → small) — hacia dentro / más pequeñas
                    const amount = Math.max(contentZoom, 1.1)
                    const full = 1
                    const compact = 1 / amount
                    const grows = zoomDirection === "out"
                    const scaleFrom = grows ? compact : full
                    const scaleTo = grows ? full : compact
                    const settleTo = grows
                        ? full * SETTLE_SCALE
                        : compact / SETTLE_SCALE
                    const transformFrom = `scale(${scaleFrom})`
                    const transformTo = `scale(${scaleTo})`
                    const transformSettle = `scale(${settleTo})`

                    const scaleDuration = baseScaleDuration * pace
                    const scaleEase = getTweenEase(transition)
                    const scaleTotal = isLast
                        ? scaleDuration + SETTLE_DURATION
                        : scaleDuration

                    const gapToNext = !isLast
                        ? (startDelays[index + 1] ?? startDelays[index] ?? 0) -
                          (startDelays[index] ?? 0)
                        : delayBetweenImages

                    // Non-last: fade in with zoom, then hand off so the next
                    // layer (or solid background) is what you see — no stuck photo-bg.
                    const fadeIn = Math.min(OPACITY_DURATION * pace, scaleDuration)
                    const fadeOutStart = Math.max(fadeIn, gapToNext)
                    const opacityDuration = isLast
                        ? fadeIn
                        : fadeOutStart + HANDOFF_DURATION
                    const opacityTimes = isLast
                        ? undefined
                        : [
                              0,
                              fadeIn / opacityDuration,
                              fadeOutStart / opacityDuration,
                              1,
                          ]

                    return (
                        <motion.div
                            key={`${image.src}-${index}`}
                            style={{
                                ...layerStyle,
                                zIndex,
                                willChange: "transform, opacity",
                            }}
                            initial={{
                                opacity: 0,
                                transform: transformFrom,
                            }}
                            animate={{
                                opacity: isLast ? 1 : [0, 1, 1, 0],
                                transform: isLast
                                    ? [
                                          transformFrom,
                                          transformTo,
                                          transformSettle,
                                      ]
                                    : transformTo,
                            }}
                            transition={{
                                opacity: {
                                    type: "tween",
                                    delay,
                                    duration: opacityDuration,
                                    times: opacityTimes,
                                    ease: EASE_EXPO,
                                },
                                transform: {
                                    type: "tween",
                                    delay,
                                    duration: scaleTotal,
                                    times: isLast
                                        ? [
                                              0,
                                              scaleDuration / scaleTotal,
                                              1,
                                          ]
                                        : undefined,
                                    ease: scaleEase,
                                },
                            }}
                        >
                            <img
                                src={image.src}
                                srcSet={image.srcSet}
                                alt={image.alt ?? ""}
                                style={imgStyle}
                                draggable={false}
                            />
                        </motion.div>
                    )
                })
            )}
        </motion.div>
    )
}

addPropertyControls(BuiltByKern_ZoomImageIntro, {
    images: {
        title: "Images",
        type: ControlType.Array,
        maxCount: 12,
        // Seed the panel so Marketplace buyers don't see an empty Images list
        // while the canvas still plays the built-in sequence.
        defaultValue: DEFAULT_IMAGES,
        description:
            "Leave empty to use the built-in demo set. Add your own frames to replace it.",
        control: {
            type: ControlType.ResponsiveImage,
        },
    },
    delayBetweenImages: {
        title: "Delay Between Images",
        type: ControlType.Number,
        defaultValue: DEFAULT_DELAY_BETWEEN,
        min: 0,
        max: 1.2,
        step: 0.01,
        unit: "s",
    },
    transition: {
        title: "Transition",
        type: ControlType.Transition,
        defaultValue: DEFAULT_TRANSITION,
    },
    contentZoom: {
        title: "Zoom Amount",
        type: ControlType.Number,
        defaultValue: 1.5,
        min: 1.1,
        max: 2.5,
        step: 0.05,
    },
    zoomDirection: {
        title: "Zoom Direction",
        type: ControlType.Enum,
        options: ["out", "in"],
        optionTitles: ["Out (larger)", "In (smaller)"],
        defaultValue: "out",
        displaySegmentedControl: true,
    },
    paceCurve: {
        title: "Pace Curve",
        type: ControlType.Enum,
        options: ["even", "accelerate", "decelerate", "pulse"],
        optionTitles: ["Even", "Accelerate", "Decelerate", "Pulse"],
        defaultValue: "accelerate",
    },
    objectFit: {
        title: "Object Fit",
        type: ControlType.Enum,
        options: ["cover", "contain", "fill"],
        optionTitles: ["cover", "contain", "fill"],
        defaultValue: "cover",
        displaySegmentedControl: true,
    },
    background: {
        title: "Background",
        type: ControlType.Color,
        defaultValue: "#000000",
    },
    autoDismiss: {
        title: "Auto Dismiss",
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    holdAfterSequence: {
        title: "Hold After Sequence",
        type: ControlType.Number,
        defaultValue: 0.2,
        min: 0,
        max: 2,
        step: 0.05,
        unit: "s",
        hidden: (props) => !props.autoDismiss,
    },
    onComplete: {
        title: "On Complete",
        type: ControlType.EventHandler,
    },
})

BuiltByKern_ZoomImageIntro.displayName = "Zoom Image Intro"
