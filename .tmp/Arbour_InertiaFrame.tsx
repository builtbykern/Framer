// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: auto
// @framerIntrinsicWidth: 400
// @framerIntrinsicHeight: 500

import { addPropertyControls, ControlType, useIsOnFramerCanvas } from "framer"
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import * as React from "react"

type AspectRatio = "4:5" | "3:2" | "4:3" | "1:1"
type FitMode = "aspect" | "cover"
type ParallaxMode = "pointer" | "scroll" | "off"

interface ImageValue {
    src?: string
    srcSet?: string
    alt?: string
}

interface ArbourInertiaFrameProps {
    image?: ImageValue
    aspectRatio: AspectRatio
    fitMode: FitMode
    grain: boolean
    grainOpacity: number
    vignette: boolean
    radius: number
    intensity: number
    parallaxMode: ParallaxMode
    scrollParallaxY: number
    scrollParallaxX: number
    bottomBlur: boolean
    blurStrength: number
    bottomScrim: boolean
    scrimColor: string
    textSafeOpacity: number
    scrimHeight: number
    style?: React.CSSProperties
}

function BottomBlurOverlay({ strength, heightPercent }: { strength: number; heightPercent: number }) {
    const layers = [
        { blur: strength * 0.25, from: 40, to: 62 },
        { blur: strength * 0.5, from: 58, to: 78 },
        { blur: strength, from: 74, to: 100 },
    ]

    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: `${heightPercent}%`,
                pointerEvents: "none",
                borderRadius: "inherit",
            }}
        >
            {layers.map((layer, index) => {
                const mask = `linear-gradient(180deg, transparent ${layer.from}%, #000 ${layer.to}%)`
                return (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            inset: 0,
                            backdropFilter: `blur(${layer.blur}px)`,
                            WebkitBackdropFilter: `blur(${layer.blur}px)`,
                            maskImage: mask,
                            WebkitMaskImage: mask,
                        }}
                    />
                )
            })}
        </div>
    )
}

function BottomScrimOverlay({
    color,
    opacity,
    heightPercent,
}: {
    color: string
    opacity: number
    heightPercent: number
}) {
    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: `${heightPercent}%`,
                pointerEvents: "none",
                backgroundColor: color,
                opacity,
                borderRadius: "inherit",
                maskImage:
                    "linear-gradient(0deg, #000 0%, rgba(0,0,0,0.38) 42%, transparent 100%)",
                WebkitMaskImage:
                    "linear-gradient(0deg, #000 0%, rgba(0,0,0,0.38) 42%, transparent 100%)",
            }}
        />
    )
}


const DEFAULT_IMAGE: ImageValue = {
    src: "https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg",
    alt: "Architectural residence exterior",
}

function resolveImage(image: unknown): ImageValue {
    if (!image) return DEFAULT_IMAGE
    if (typeof image === "string" && image.length > 0) return { src: image }
    if (typeof image === "object") {
        const o = image as Record<string, unknown>
        const src =
            (typeof o.src === "string" && o.src) ||
            (typeof o.url === "string" && o.url) ||
            ""
        if (src) {
            return {
                src,
                srcSet: typeof o.srcSet === "string" ? o.srcSet : undefined,
                alt: typeof o.alt === "string" ? o.alt : "",
            }
        }
    }
    return DEFAULT_IMAGE
}

const aspectRatioMap: Record<AspectRatio, number> = {
    "4:5": 4 / 5,
    "3:2": 3 / 2,
    "4:3": 4 / 3,
    "1:1": 1,
}

export default function Arbour_InertiaFrame(props: ArbourInertiaFrameProps) {
    const {
        image: imageProp,
        aspectRatio = "4:5",
        fitMode: fitModeProp = "aspect",
        grain = true,
        grainOpacity = 0.05,
        vignette = true,
        radius = 0,
        intensity = 8,
        parallaxMode = "pointer",
        scrollParallaxY = 40,
        scrollParallaxX = 0,
        bottomBlur = false,
        blurStrength = 10,
        bottomScrim = false,
        scrimColor = "rgb(21, 43, 30)",
        textSafeOpacity = 0.65,
        scrimHeight = 52,
        style,
    } = props

    const image = resolveImage(imageProp)
    const fitMode = String(fitModeProp).toLowerCase() === "cover" ? "cover" : "aspect"
    const isCanvas = useIsOnFramerCanvas()
    const prefersReduced = useReducedMotion()

    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const isInView = useInView(rootRef, { margin: "-10% 0px -10% 0px", once: false })

    const targetX = useMotionValue(0)
    const targetY = useMotionValue(0)
    const springX = useSpring(targetX, { stiffness: 110, damping: 22, mass: 0.95 })
    const springY = useSpring(targetY, { stiffness: 110, damping: 22, mass: 0.95 })

    const ratioValue = aspectRatioMap[aspectRatio] ?? 4 / 5
    const clampedIntensity = Math.max(0, intensity)
    const clampedScrollParallaxY = Math.max(0, scrollParallaxY)
    const clampedScrollParallaxX = Math.max(0, scrollParallaxX)
    const clampedBlurStrength = Math.max(4, Math.min(28, blurStrength))
    const clampedScrimHeight = Math.max(30, Math.min(70, scrimHeight))
    const clampedTextSafeOpacity = Math.max(0, Math.min(1, textSafeOpacity))
    const shouldAnimate = !isCanvas && !prefersReduced && isInView
    const usePointerParallax = parallaxMode === "pointer" && shouldAnimate
    const useScrollParallax = parallaxMode === "scroll" && !isCanvas && !prefersReduced

    const { scrollYProgress } = useScroll({
        target: rootRef,
        offset: ["start end", "end start"],
    })
    const scrollX = useTransform(
        scrollYProgress,
        [0, 1],
        [-clampedScrollParallaxX, clampedScrollParallaxX]
    )
    const scrollY = useTransform(
        scrollYProgress,
        [0, 1],
        [-clampedScrollParallaxY, clampedScrollParallaxY]
    )

    const handlePointerMove = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (!usePointerParallax || event.pointerType === "touch") return

            const rect = event.currentTarget.getBoundingClientRect()
            const px = (event.clientX - rect.left) / rect.width
            const py = (event.clientY - rect.top) / rect.height
            const nx = (px - 0.5) * 2
            const ny = (py - 0.5) * 2

            targetX.set(-nx * clampedIntensity)
            targetY.set(-ny * clampedIntensity)
        },
        [clampedIntensity, usePointerParallax, targetX, targetY]
    )

    const handlePointerLeave = React.useCallback(() => {
        targetX.set(0)
        targetY.set(0)
    }, [targetX, targetY])

    const bleed = Math.max(12, clampedIntensity * 2, clampedScrollParallaxY, clampedScrollParallaxX)
    const imageMotionStyle = React.useMemo(() => {
        if (useScrollParallax) {
            return {
                x: scrollX,
                y: scrollY,
                position: "absolute" as const,
                inset: -bleed,
                width: `calc(100% + ${bleed * 2}px)`,
                height: `calc(100% + ${bleed * 2}px)`,
                objectFit: "cover" as const,
                willChange: "transform" as const,
                pointerEvents: "none" as const,
                userSelect: "none" as const,
            }
        }

        return {
            x: usePointerParallax ? springX : 0,
            y: usePointerParallax ? springY : 0,
            position: "absolute" as const,
            inset: -bleed,
            width: `calc(100% + ${bleed * 2}px)`,
            height: `calc(100% + ${bleed * 2}px)`,
            objectFit: "cover" as const,
            willChange: usePointerParallax ? "transform" : "auto",
            pointerEvents: "none" as const,
            userSelect: "none" as const,
        }
    }, [bleed, scrollX, scrollY, springX, springY, usePointerParallax, useScrollParallax])

    const isCover = fitMode === "cover"
    const showAnimatedGrain = grain && (usePointerParallax || useScrollParallax)

    const rootStyle: React.CSSProperties = {
        position: "relative",
        width: "100%",
        height: isCover ? "100%" : "auto",
        minHeight: isCover ? "100%" : undefined,
        aspectRatio: isCover ? undefined : `${ratioValue}`,
        overflow: "hidden",
        borderRadius: radius,
        background: "rgb(21, 43, 30)",
        ...style,
    }

    return (
        <div
            ref={rootRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            style={rootStyle}
        >
            <motion.img
                src={image?.src}
                srcSet={image?.srcSet}
                alt={image?.alt || ""}
                style={imageMotionStyle}
                draggable={false}
            />

            {vignette ? (
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        borderRadius: radius,
                        background: isCover
                            ? "radial-gradient(ellipse at center, transparent 55%, rgba(10, 22, 15, 0.22) 100%)"
                            : "radial-gradient(ellipse at center, transparent 42%, rgba(10, 22, 15, 0.38) 100%)",
                    }}
                />
            ) : null}

            {grain ? (
                <motion.div
                    aria-hidden
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        borderRadius: radius,
                        opacity: grainOpacity,
                        mixBlendMode: "soft-light",
                        backgroundImage:
                            "radial-gradient(circle at 20% 20%, rgba(0,0,0,0.35) 0.6px, transparent 0.8px), radial-gradient(circle at 80% 40%, rgba(255,255,255,0.22) 0.6px, transparent 0.8px), radial-gradient(circle at 40% 80%, rgba(0,0,0,0.3) 0.6px, transparent 0.8px)",
                        backgroundSize: "3px 3px, 4px 4px, 5px 5px",
                        backgroundPosition: "0px 0px, 1px 1px, 2px 2px",
                    }}
                    animate={
                        showAnimatedGrain
                            ? {
                                  backgroundPosition: [
                                      "0px 0px, 1px 1px, 2px 2px",
                                      "1px 2px, 2px 0px, 3px 4px",
                                      "0px 0px, 1px 1px, 2px 2px",
                                  ],
                              }
                            : undefined
                    }
                    transition={
                        showAnimatedGrain
                            ? { duration: 2.2, repeat: Infinity, ease: "linear" }
                            : undefined
                    }
                />
            ) : null}

            {bottomBlur ? (
                <BottomBlurOverlay
                    strength={clampedBlurStrength}
                    heightPercent={clampedScrimHeight}
                />
            ) : null}

            {bottomScrim ? (
                <BottomScrimOverlay
                    color={scrimColor}
                    opacity={clampedTextSafeOpacity}
                    heightPercent={clampedScrimHeight}
                />
            ) : null}
        </div>
    )
}

addPropertyControls(Arbour_InertiaFrame, {
    image: {
        type: ControlType.ResponsiveImage,
        title: "Image",
    },
    aspectRatio: {
        type: ControlType.Enum,
        title: "Aspect",
        defaultValue: "4:5",
        options: ["4:5", "3:2", "4:3", "1:1"],
        optionTitles: ["4:5", "3:2", "4:3", "1:1"],
        hidden: (props) => props.fitMode === "cover",
    },
    fitMode: {
        type: ControlType.Enum,
        title: "Fit",
        defaultValue: "aspect",
        options: ["aspect", "cover"],
        optionTitles: ["Aspect", "Cover"],
    },
    grain: {
        type: ControlType.Boolean,
        title: "Grain",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    grainOpacity: {
        type: ControlType.Number,
        title: "Grain Opacity",
        defaultValue: 0.05,
        min: 0,
        max: 0.2,
        step: 0.01,
        hidden: (props) => !props.grain,
    },
    vignette: {
        type: ControlType.Boolean,
        title: "Vignette",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    radius: {
        type: ControlType.Number,
        title: "Radius",
        defaultValue: 0,
        min: 0,
        max: 120,
        unit: "px",
        step: 1,
    },
    intensity: {
        type: ControlType.Number,
        title: "Intensity",
        defaultValue: 8,
        min: 0,
        max: 24,
        unit: "px",
        step: 1,
        hidden: (props) => props.parallaxMode !== "pointer",
    },
    parallaxMode: {
        type: ControlType.Enum,
        title: "Parallax",
        defaultValue: "pointer",
        options: ["pointer", "scroll", "off"],
        optionTitles: ["Pointer", "Scroll", "Off"],
    },
    scrollParallaxY: {
        type: ControlType.Number,
        title: "Scroll Y",
        defaultValue: 40,
        min: 0,
        max: 120,
        step: 1,
        unit: "px",
        hidden: (props) => props.parallaxMode !== "scroll",
        description: "Vertical image travel while scrolling.",
    },
    scrollParallaxX: {
        type: ControlType.Number,
        title: "Scroll X",
        defaultValue: 0,
        min: 0,
        max: 80,
        step: 1,
        unit: "px",
        hidden: (props) => props.parallaxMode !== "scroll",
    },
    bottomBlur: {
        type: ControlType.Boolean,
        title: "Bottom Blur",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
        description: "Progressive blur at bottom edge for type legibility.",
    },
    blurStrength: {
        type: ControlType.Number,
        title: "Blur Strength",
        defaultValue: 10,
        min: 4,
        max: 24,
        step: 1,
        unit: "px",
        hidden: (props) => !props.bottomBlur,
    },
    bottomScrim: {
        type: ControlType.Boolean,
        title: "Bottom Scrim",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
        description: "Forest gradient behind bottom copy.",
    },
    scrimColor: {
        type: ControlType.Color,
        title: "Scrim Color",
        defaultValue: "rgb(21, 43, 30)",
        hidden: (props) => !props.bottomScrim,
    },
    textSafeOpacity: {
        type: ControlType.Number,
        title: "Text Safe Zone",
        defaultValue: 0.65,
        min: 0.2,
        max: 0.9,
        step: 0.02,
        hidden: (props) => !props.bottomScrim,
        description: "Bottom scrim strength for headline legibility.",
    },
    scrimHeight: {
        type: ControlType.Number,
        title: "Scrim Height",
        defaultValue: 52,
        min: 30,
        max: 70,
        step: 1,
        unit: "%",
        hidden: (props) => !props.bottomBlur && !props.bottomScrim,
        description: "How far blur and scrim extend from the bottom.",
    },
})
