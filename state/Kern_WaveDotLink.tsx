// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: auto
// @framerIntrinsicWidth: 220
// @framerIntrinsicHeight: 48
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
} from "framer-motion"
import {
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    startTransition,
    type MouseEvent,
    type KeyboardEvent,
} from "react"

interface KernWaveDotLinkProps {
    label: string
    destination: string
    triggerMode: "Hover" | "Click"
    ariaLabel: string
    textColor: string
    activeColor: string
    markerShape: "Dot" | "Dash" | "Square" | "None"
    dotColor: string
    dotSize: number
    baselineGap: number
    jumpAmplitude: number
    duration: number
    perLetterStagger: number
    springFeel: number
    waveWidth: number
    maxRotation: number
    scaleBoost: number
    trailIntensity: number
    overshoot: number
    typography: {
        fontSize?: number | string
        lineHeight?: number | string
        letterSpacing?: number | string
        fontFamily?: string
        fontWeight?: number
        fontStyle?: "normal" | "italic"
        textAlign?: "left" | "right" | "center"
    }
    content?: {
        label?: string
        destination?: string
        ariaLabel?: string
        triggerMode?: "Hover" | "Click"
    }
    typographyGroup?: {
        typography?: {
            fontSize?: number | string
            lineHeight?: number | string
            letterSpacing?: number | string
            fontFamily?: string
            fontWeight?: number
            fontStyle?: "normal" | "italic"
            textAlign?: "left" | "right" | "center"
        }
        fontSizeTablet?: number
        fontSizeMobile?: number
        textColor?: string
        activeColor?: string
    }
    marker?: {
        markerShape?: "Dot" | "Dash" | "Square" | "None"
        dotColor?: string
        dotSize?: number
        baselineGap?: number
    }
    motion?: {
        duration?: number
        jumpAmplitude?: number
        waveWidth?: number
        perLetterStagger?: number
    }
    characterMotion?: {
        springFeel?: number
        maxRotation?: number
        scaleBoost?: number
        trailIntensity?: number
        overshoot?: number
    }
    appearance?: {
        blendMode?:
            | "Normal"
            | "Multiply"
            | "Screen"
            | "Overlay"
            | "Difference"
            | "Exclusion"
            | "Darken"
            | "Lighten"
    }
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}

function parseFontSizePx(
    value: number | string | undefined,
    fallback: number
): number {
    if (typeof value === "number" && Number.isFinite(value)) return value
    if (typeof value === "string") {
        const parsed = Number.parseFloat(value)
        if (Number.isFinite(parsed)) return parsed
    }
    return fallback
}

function buildClampFontSize(
    desktop: number,
    tablet: number,
    mobile: number
): string {
    const minSize = Math.min(mobile, tablet, desktop)
    const maxSize = Math.max(mobile, tablet, desktop)
    return `clamp(${minSize}px, calc(${tablet}px + (100vw - 480px) * 0.05), ${maxSize}px)`
}

/** Progress spring — high damping keeps wave timing close to the old ease curve. */
const SPRING_PROGRESS = {
    stiffness: 210,
    damping: 28,
    mass: 0.9,
} as const

/**
 * Kern_WaveDotLink — Framer Marketplace Component
 * Version: 1.1.0
 * Wave marker link with letter-aware motion.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Kern_WaveDotLink(props: KernWaveDotLinkProps) {
    const contentGroup = props.content ?? {}
    const typographyGroup = props.typographyGroup ?? {}
    const markerGroup = props.marker ?? {}
    const motionGroup = props.motion ?? {}
    const characterMotionGroup = props.characterMotion ?? {}
    const appearanceGroup = props.appearance ?? {}

    // --- content ---
    const label = contentGroup.label ?? props.label ?? "Largest Flows"
    const destination = contentGroup.destination ?? props.destination ?? "/"
    const triggerMode = contentGroup.triggerMode ?? props.triggerMode ?? "Click"
    const ariaLabel = contentGroup.ariaLabel ?? props.ariaLabel ?? ""
    const safeLabel = label.trim().length > 0 ? label : "Link"

    const typography = typographyGroup.typography ?? props.typography ?? {}
    const fontSizeTablet = Number.isFinite(typographyGroup.fontSizeTablet)
        ? clamp(typographyGroup.fontSizeTablet as number, 10, 120)
        : 26
    const fontSizeMobile = Number.isFinite(typographyGroup.fontSizeMobile)
        ? clamp(typographyGroup.fontSizeMobile as number, 10, 96)
        : 22
    const desktopFontSize = parseFontSizePx(typography.fontSize, 30)
    const responsiveFontSize = buildClampFontSize(
        desktopFontSize,
        fontSizeTablet,
        fontSizeMobile
    )
    const textColor = typographyGroup.textColor ?? props.textColor ?? "#000000"
    const activeColor =
        typographyGroup.activeColor ?? props.activeColor ?? "#CCCCCC"

    const markerShape = markerGroup.markerShape ?? props.markerShape ?? "Dot"
    const markerVisible = markerShape !== "None"
    const dotColor = markerGroup.dotColor ?? props.dotColor ?? "#000000"
    // Marker size tracks type size (em). Legacy absolute px (e.g. 6) is converted.
    const rawDotSize = Number.isFinite(markerGroup.dotSize)
        ? (markerGroup.dotSize as number)
        : Number.isFinite(props.dotSize)
          ? (props.dotSize as number)
          : 0.28
    const markerSizeEm =
        rawDotSize > 1.5
            ? clamp(rawDotSize / desktopFontSize, 0.08, 0.55)
            : clamp(rawDotSize, 0.08, 0.55)
    const rawBaselineGap = Number.isFinite(markerGroup.baselineGap)
        ? (markerGroup.baselineGap as number)
        : Number.isFinite(props.baselineGap)
          ? (props.baselineGap as number)
          : 0.47
    const baselineGapEm =
        rawBaselineGap > 2
            ? clamp(rawBaselineGap / desktopFontSize, 0, 1.4)
            : clamp(rawBaselineGap, 0, 1.4)
    // Pixel estimates for headroom / kinematics before first measure.
    const dotSize = markerVisible
        ? Math.max(3, desktopFontSize * markerSizeEm)
        : 0
    const baselineGap = markerVisible ? desktopFontSize * baselineGapEm : 0
    const markerWidthEm =
        !markerVisible
            ? 0
            : markerShape === "Dash"
              ? markerSizeEm * 2.8
              : markerSizeEm
    const markerHeightEm =
        !markerVisible
            ? 0
            : markerShape === "Dash"
              ? Math.max(0.06, markerSizeEm * 0.4)
              : markerSizeEm
    const markerWidth = markerVisible
        ? Math.max(3, desktopFontSize * markerWidthEm)
        : 0
    const markerHeight = markerVisible
        ? Math.max(2, desktopFontSize * markerHeightEm)
        : 0
    // --- motion params ---
    const duration = Number.isFinite(motionGroup.duration)
        ? (motionGroup.duration as number)
        : Number.isFinite(props.duration)
          ? (props.duration as number)
          : 1.05
    const remappedDuration = duration
    const jumpAmplitude = Number.isFinite(motionGroup.jumpAmplitude)
        ? (motionGroup.jumpAmplitude as number)
        : Number.isFinite(props.jumpAmplitude)
          ? (props.jumpAmplitude as number)
          : 12
    const waveWidth = Number.isFinite(motionGroup.waveWidth)
        ? (motionGroup.waveWidth as number)
        : Number.isFinite(props.waveWidth)
          ? (props.waveWidth as number)
          : 28
    const perLetterStagger = Number.isFinite(motionGroup.perLetterStagger)
        ? (motionGroup.perLetterStagger as number)
        : Number.isFinite(props.perLetterStagger)
          ? (props.perLetterStagger as number)
          : 0.22

    const springFeel = Number.isFinite(characterMotionGroup.springFeel)
        ? (characterMotionGroup.springFeel as number)
        : Number.isFinite(props.springFeel)
          ? (props.springFeel as number)
          : 0.6
    const maxRotation = Number.isFinite(characterMotionGroup.maxRotation)
        ? (characterMotionGroup.maxRotation as number)
        : Number.isFinite(props.maxRotation)
          ? (props.maxRotation as number)
          : 4.2
    const scaleBoost = Number.isFinite(characterMotionGroup.scaleBoost)
        ? (characterMotionGroup.scaleBoost as number)
        : Number.isFinite(props.scaleBoost)
          ? (props.scaleBoost as number)
          : 0.045
    const trailIntensity = Number.isFinite(characterMotionGroup.trailIntensity)
        ? (characterMotionGroup.trailIntensity as number)
        : Number.isFinite(props.trailIntensity)
          ? (props.trailIntensity as number)
          : 0.35
    const overshoot = Number.isFinite(characterMotionGroup.overshoot)
        ? (characterMotionGroup.overshoot as number)
        : Number.isFinite(props.overshoot)
          ? (props.overshoot as number)
          : 0.28
    const blendModeMap: Record<
        NonNullable<NonNullable<KernWaveDotLinkProps["appearance"]>["blendMode"]>,
        | "normal"
        | "multiply"
        | "screen"
        | "overlay"
        | "difference"
        | "exclusion"
        | "darken"
        | "lighten"
    > = {
        Normal: "normal",
        Multiply: "multiply",
        Screen: "screen",
        Overlay: "overlay",
        Difference: "difference",
        Exclusion: "exclusion",
        Darken: "darken",
        Lighten: "lighten",
    }
    const blendMode =
        blendModeMap[appearanceGroup.blendMode ?? "Normal"] ?? "normal"

    const rootRef = useRef<HTMLAnchorElement | null>(null)
    const stageRef = useRef<HTMLSpanElement | null>(null)
    const rowRef = useRef<HTMLSpanElement | null>(null)
    const dotRef = useRef<HTMLSpanElement | null>(null)
    const letterRefs = useRef<Array<HTMLSpanElement | null>>([])
    const animationRef = useRef<{ stop: () => void } | null>(null)
    const resetTimerRef = useRef<number | null>(null)
    const frameRef = useRef({
        centers: [] as number[],
        markerRestY: 0,
        markerTravelY: 0,
        startX: markerWidth / 2,
        endX: markerWidth / 2,
        markerW: markerWidth,
        markerH: markerHeight,
        prevProgress: 0,
        prevTs: 0,
        velocity: 0,
    })
    const [isRunning, setIsRunning] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isPressed, setIsPressed] = useState(false)
    const [isTouch, setIsTouch] = useState(false)
    const isCanvas = useIsOnFramerCanvas()
    const isStatic = useIsStaticRenderer()
    const prefersReducedMotion = useReducedMotion() ?? false
    const motionProgress = useMotionValue(0)
    const isInView = useInView(rootRef, { amount: 0.2, margin: "0px" })
    const focusToken = useId().replace(/[:]/g, "")
    const focusClass = `wave-dot-link-${focusToken}`
    const navigationPendingRef = useRef(false)

    const characters = useMemo(() => Array.from(safeLabel), [safeLabel])
    const animationEnabled =
        !isCanvas &&
        !isStatic &&
        isInView &&
        !prefersReducedMotion &&
        !isTouch
    const headroomTop = useMemo(() => {
        const rotationLift =
            Math.sin((Math.min(18, maxRotation) * Math.PI) / 180) *
            dotSize *
            0.8
        const scaleLift = Math.max(0, scaleBoost) * 28
        const overshootLift = jumpAmplitude * Math.max(0, overshoot) * 0.45
        const base =
            jumpAmplitude + rotationLift + scaleLift + overshootLift + 8
        return Math.max(10, Math.ceil(base))
    }, [dotSize, jumpAmplitude, maxRotation, overshoot, scaleBoost])
    const underBaselineClearance = useMemo(() => {
        if (!markerVisible) return 0
        return Math.min(
            Math.max(1, baselineGap * 0.22),
            Math.max(2, dotSize * 0.58)
        )
    }, [baselineGap, dotSize, markerVisible])
    const headroomBottom = useMemo(() => {
        if (!markerVisible) return 6
        return Math.max(6, Math.ceil(markerHeight + underBaselineClearance + 4))
    }, [markerHeight, markerVisible, underBaselineClearance])

    const navigateToDestination = useCallback(() => {
        if (!destination || typeof window === "undefined") return
        window.location.assign(destination)
    }, [destination])

    const shouldInterceptClick = useCallback(
        (event: MouseEvent<HTMLAnchorElement>) => {
            return (
                event.button === 0 &&
                !event.metaKey &&
                !event.ctrlKey &&
                !event.shiftKey &&
                !event.altKey
            )
        },
        []
    )

    const clearResetTimer = useCallback(() => {
        if (resetTimerRef.current !== null && typeof window !== "undefined") {
            window.clearTimeout(resetTimerRef.current)
            resetTimerRef.current = null
        }
    }, [])

    const resetKinematics = useCallback(() => {
        frameRef.current.velocity = 0
        frameRef.current.prevProgress = 0
        frameRef.current.prevTs = 0
    }, [])

    const stopAnimation = useCallback(() => {
        if (animationRef.current) {
            animationRef.current.stop()
            animationRef.current = null
        }
        startTransition(() => setIsRunning(false))
    }, [])

    const colorWithAlpha = useCallback((color: string, alpha: number) => {
        const normalizedAlpha = Math.max(0, Math.min(1, alpha))
        if (color.startsWith("#")) {
            let hex = color.slice(1)
            if (hex.length === 3)
                hex = hex
                    .split("")
                    .map((c) => c + c)
                    .join("")
            if (hex.length === 6) {
                const r = parseInt(hex.slice(0, 2), 16)
                const g = parseInt(hex.slice(2, 4), 16)
                const b = parseInt(hex.slice(4, 6), 16)
                return `rgba(${r}, ${g}, ${b}, ${normalizedAlpha})`
            }
        }
        return `rgba(0, 0, 0, ${normalizedAlpha})`
    }, [])

    const renderFrame = useCallback(
        (progress: number, velocityInput?: number) => {
            const metrics = frameRef.current
            const centers = metrics.centers
            const path = Math.max(1, metrics.endX - metrics.startX)
            const smoothProgress = progress * progress * (3 - 2 * progress)
            const travelX = metrics.startX + path * smoothProgress
            const velocity = velocityInput ?? metrics.velocity
            const nearZero = progress <= 0.0005
            const direction = velocity >= 0 ? 1 : -1
            const stableVelocity = nearZero ? 0 : velocity
            const normalizedVelocity = Math.min(
                0.8,
                Math.abs(stableVelocity) * remappedDuration * 0.28
            )
            const smoothStep = (value: number) => {
                const clamped = Math.max(0, Math.min(1, value))
                return clamped * clamped * (3 - 2 * clamped)
            }

            const squashX = nearZero ? 1 : 1 + normalizedVelocity * 0.05
            const squashY = nearZero ? 1 : 1 - normalizedVelocity * 0.04
            const glow = 0.08 + normalizedVelocity * trailIntensity * 0.12
            const shadowSize = 4 + normalizedVelocity * 8 * trailIntensity
            const dotX = travelX
            const descentBlend = smoothStep(progress / 0.16)
            const markerY =
                metrics.markerRestY +
                (metrics.markerTravelY - metrics.markerRestY) * descentBlend

            const dotNode = dotRef.current
            if (dotNode && markerVisible) {
                const liveW = metrics.markerW || markerWidth
                const liveH = metrics.markerH || markerHeight
                dotNode.style.transform = `translate(${dotX - liveW / 2}px, ${markerY - liveH / 2}px) scale(${squashX}, ${squashY})`
                dotNode.style.boxShadow = nearZero
                    ? "none"
                    : `0 0 ${shadowSize}px ${colorWithAlpha(dotColor, glow)}`
                dotNode.style.opacity = "1"
            }

            const sigma = Math.max(8, waveWidth)
            const entrySettle = smoothStep(progress / 0.05)
            const exitSettle = 1 - smoothStep((progress - 0.94) / 0.06)
            const envelope = Math.max(0, Math.min(1, entrySettle * exitSettle))
            const trailDistance =
                sigma * (0.75 + trailIntensity * 0.95 + perLetterStagger * 0.6)
            const damping = Math.max(0.24, 1.05 - springFeel * 0.45)
            const freq = 2.05 + springFeel * 1.75 + perLetterStagger * 0.6

            for (let i = 0; i < centers.length; i++) {
                const letter = letterRefs.current[i]
                if (!letter) continue
                const center = centers[i]
                const distance = (center - dotX) / sigma
                const primary = Math.exp(-(distance * distance))

                const trailCenter = dotX - direction * trailDistance
                const trailDistanceNorm =
                    (center - trailCenter) / (sigma * 1.15)
                const trailing =
                    Math.exp(-(trailDistanceNorm * trailDistanceNorm)) *
                    trailIntensity

                const combined = Math.min(
                    1.6,
                    (primary + trailing * 0.55) * envelope
                )
                const liftBase = -jumpAmplitude * combined
                const oscillation =
                    Math.sin((distance + 0.5) * Math.PI * freq) *
                    Math.exp(-Math.abs(distance) / damping) *
                    overshoot *
                    envelope
                const lift = liftBase + oscillation * jumpAmplitude * 0.2
                const tilt =
                    maxRotation *
                    (primary * 0.8 + trailing * 0.25) *
                    envelope *
                    (direction > 0 ? 1 : -1)
                const scale =
                    1 +
                    scaleBoost * (primary * 0.55 + trailing * 0.2) * envelope

                letter.style.transform = `translate3d(0, ${lift}px, 0) rotate(${tilt}deg) scale(${scale})`
            }
        },
        [
            markerVisible,
            markerWidth,
            markerHeight,
            remappedDuration,
            trailIntensity,
            waveWidth,
            springFeel,
            jumpAmplitude,
            overshoot,
            maxRotation,
            scaleBoost,
            perLetterStagger,
            colorWithAlpha,
            dotColor,
        ]
    )

    const runTo = useCallback(
        (to: number, timeScale = 1, onComplete?: () => void) => {
            stopAnimation()
            const from = motionProgress.get()
            if (from === to) {
                if (onComplete) onComplete()
                return
            }
            startTransition(() => setIsRunning(true))
            const travel = Math.max(0.2, Math.abs(to - from))
            const scale = Math.max(0.35, remappedDuration * timeScale * travel)
            // Softer spring for longer Duration; damping stays high → almost no overshoot.
            const stiffness = clamp(
                SPRING_PROGRESS.stiffness / scale,
                70,
                320
            )
            const damping = clamp(
                SPRING_PROGRESS.damping + (scale - 1) * 8,
                22,
                42
            )
            const controls = animate(motionProgress, to, {
                type: "spring",
                stiffness,
                damping,
                mass: SPRING_PROGRESS.mass,
                restDelta: 0.001,
                onComplete: () => {
                    if (to === 0) {
                        resetKinematics()
                        renderFrame(0, 0)
                    }
                    startTransition(() => setIsRunning(false))
                    if (onComplete) onComplete()
                },
            })
            animationRef.current = controls
        },
        [
            motionProgress,
            remappedDuration,
            resetKinematics,
            renderFrame,
            stopAnimation,
        ]
    )

    useEffect(() => {
        if (typeof window === "undefined") return
        const coarse = window.matchMedia("(pointer: coarse)")
        const updateInputs = () => {
            startTransition(() => {
                setIsTouch(coarse.matches)
            })
        }
        updateInputs()
        coarse.addEventListener("change", updateInputs)
        return () => {
            coarse.removeEventListener("change", updateInputs)
        }
    }, [])

    useEffect(() => {
        const unsubscribe = motionProgress.on("change", (latest) => {
            const now =
                typeof performance !== "undefined"
                    ? performance.now()
                    : Date.now()
            const prevTs = frameRef.current.prevTs || now
            const dt = Math.max(8, now - prevTs)
            const rawVelocity =
                (latest - frameRef.current.prevProgress) / (dt / 1000)
            frameRef.current.velocity =
                frameRef.current.velocity * 0.76 + rawVelocity * 0.24
            frameRef.current.prevProgress = latest
            frameRef.current.prevTs = now
            renderFrame(latest, frameRef.current.velocity)
        })
        return () => unsubscribe()
    }, [motionProgress, renderFrame])

    useEffect(() => {
        const stageNode = stageRef.current
        const rowNode = rowRef.current
        if (!stageNode || !rowNode) return
        const measure = () => {
            const children = Array.from(
                rowNode.querySelectorAll("[data-wave-letter='true']")
            ) as HTMLElement[]
            const stageRect = stageNode.getBoundingClientRect()
            const glyphRects = children.map((child) =>
                child.getBoundingClientRect()
            )
            const markerRect = markerVisible
                ? dotRef.current?.getBoundingClientRect()
                : undefined
            const pathMarkerWidth = markerVisible
                ? markerRect?.width || markerWidth
                : 0
            const pathMarkerHeight = markerVisible
                ? markerRect?.height || markerHeight
                : 0
            const liveBaselineGap = markerVisible
                ? Math.max(0, desktopFontSize * baselineGapEm)
                : 0
            const direction =
                typeof window !== "undefined"
                    ? window.getComputedStyle(rowNode).direction
                    : "ltr"
            const isRTL = direction === "rtl"
            const nextCenters = glyphRects.map(
                (rect) => rect.left - stageRect.left + rect.width / 2
            )
            const firstRect = glyphRects[0]
            const lastRect = glyphRects[glyphRects.length - 1]
            const firstLeft = firstRect
                ? firstRect.left - stageRect.left
                : pathMarkerWidth + liveBaselineGap
            const firstRight = firstRect
                ? firstRect.right - stageRect.left
                : firstLeft + pathMarkerWidth
            const lastLeft = lastRect
                ? lastRect.left - stageRect.left
                : firstLeft
            const lastRight = lastRect
                ? lastRect.right - stageRect.left
                : firstLeft + pathMarkerWidth
            const glyphTop =
                glyphRects.length > 0
                    ? Math.min(
                          ...glyphRects.map((rect) => rect.top - stageRect.top)
                      )
                    : 0
            const glyphBottom =
                glyphRects.length > 0
                    ? Math.max(
                          ...glyphRects.map(
                              (rect) => rect.bottom - stageRect.top
                          )
                      )
                    : pathMarkerHeight
            const glyphCenterY = (glyphTop + glyphBottom) / 2
            const markerTravelY = glyphBottom + underBaselineClearance
            const markerRestY = glyphCenterY
            const leadOut = Math.max(
                pathMarkerWidth * 0.55,
                waveWidth * 0.25,
                4
            )
            const startX = markerVisible
                ? isRTL
                    ? firstRight + liveBaselineGap + pathMarkerWidth / 2
                    : Math.max(
                          pathMarkerWidth / 2,
                          firstLeft - liveBaselineGap - pathMarkerWidth / 2
                      )
                : isRTL
                  ? firstRight
                  : firstLeft
            const endX = markerVisible
                ? isRTL
                    ? Math.max(
                          pathMarkerWidth / 2,
                          lastLeft -
                              pathMarkerWidth / 2 -
                              Math.max(2, liveBaselineGap * 0.15) -
                              leadOut
                      )
                    : lastRight +
                      pathMarkerWidth / 2 +
                      Math.max(2, liveBaselineGap * 0.15) +
                      leadOut
                : isRTL
                  ? lastLeft - leadOut
                  : lastRight + leadOut
            frameRef.current.centers = nextCenters
            frameRef.current.markerRestY = markerRestY
            frameRef.current.markerTravelY = markerTravelY
            frameRef.current.startX = startX
            frameRef.current.endX = endX
            frameRef.current.markerW = pathMarkerWidth
            frameRef.current.markerH = pathMarkerHeight
            // Canvas / export: same rest pose as the live site (no fake mid-wave).
            if (isCanvas || isStatic) {
                motionProgress.set(0)
                resetKinematics()
                renderFrame(0, 0)
                return
            }
            if (motionProgress.get() <= 0.0005) {
                resetKinematics()
                renderFrame(0, 0)
            } else {
                renderFrame(motionProgress.get(), frameRef.current.velocity)
            }
        }
        measure()
        if (typeof document !== "undefined" && "fonts" in document) {
            const fontSet = (document as Document & { fonts?: FontFaceSet })
                .fonts
            fontSet?.ready.then(() => {
                measure()
            })
        }
        if (typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver(measure)
            observer.observe(stageNode)
            observer.observe(rowNode)
            if (dotRef.current) observer.observe(dotRef.current)
            return () => observer.disconnect()
        }
        return
    }, [
        characters,
        responsiveFontSize,
        typography.letterSpacing,
        typography.lineHeight,
        markerVisible,
        desktopFontSize,
        baselineGapEm,
        markerWidth,
        markerHeight,
        waveWidth,
        underBaselineClearance,
        motionProgress,
        isCanvas,
        isStatic,
        resetKinematics,
        renderFrame,
    ])

    const handleHoverStart = useCallback(() => {
        startTransition(() => setIsHovered(true))
        if (triggerMode !== "Hover" || !animationEnabled) return
        runTo(1, 1.08)
    }, [animationEnabled, runTo, triggerMode])

    const handleHoverEnd = useCallback(() => {
        startTransition(() => setIsHovered(false))
        if (triggerMode !== "Hover") return
        if (!animationEnabled) {
            motionProgress.set(0)
            resetKinematics()
            renderFrame(0, 0)
            return
        }
        runTo(0, 1)
    }, [
        animationEnabled,
        motionProgress,
        renderFrame,
        resetKinematics,
        runTo,
        triggerMode,
    ])

    const activate = useCallback(() => {
        if (!destination) return

        if (prefersReducedMotion) {
            startTransition(() => setIsPressed(true))
            clearResetTimer()
            if (typeof window !== "undefined") {
                resetTimerRef.current = window.setTimeout(() => {
                    resetTimerRef.current = null
                    startTransition(() => setIsPressed(false))
                    navigateToDestination()
                }, 120)
            }
            return
        }

        if (isTouch || !animationEnabled) {
            startTransition(() => setIsPressed(true))
            clearResetTimer()
            if (typeof window !== "undefined") {
                resetTimerRef.current = window.setTimeout(() => {
                    resetTimerRef.current = null
                    startTransition(() => setIsPressed(false))
                    navigateToDestination()
                }, 120)
            }
            return
        }

        if (isRunning) {
            if (navigationPendingRef.current) {
                navigationPendingRef.current = false
                clearResetTimer()
                runTo(0, 1.05)
                return
            }
            runTo(1, 1)
            return
        }

        if (resetTimerRef.current !== null) return
        navigationPendingRef.current = true
        runTo(1, 1, () => {
            if (!navigationPendingRef.current) return
            if (typeof window !== "undefined") {
                resetTimerRef.current = window.setTimeout(() => {
                    resetTimerRef.current = null
                    navigationPendingRef.current = false
                    navigateToDestination()
                }, 120)
            }
        })
    }, [
        animationEnabled,
        clearResetTimer,
        destination,
        isRunning,
        isTouch,
        navigateToDestination,
        prefersReducedMotion,
        runTo,
    ])

    const handleClick = useCallback(
        (event: MouseEvent<HTMLAnchorElement>) => {
            if (triggerMode !== "Click") return
            if (!shouldInterceptClick(event)) return
            event.preventDefault()
            activate()
        },
        [activate, shouldInterceptClick, triggerMode]
    )

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLAnchorElement>) => {
            if (event.key !== " ") return
            if (triggerMode !== "Click") return
            event.preventDefault()
            activate()
        },
        [activate, triggerMode]
    )

    const currentColor = useMemo(() => {
        if (isPressed) return activeColor
        if (isHovered || isRunning) return activeColor
        return textColor
    }, [activeColor, isPressed, isHovered, isRunning, textColor])

    const accessibleName = ariaLabel.trim()
    return (
        <a
            ref={rootRef}
            className={focusClass}
            href={destination || "#"}
            {...(accessibleName ? { "aria-label": accessibleName } : {})}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            style={{
                position: "relative",
                display: "inline-block",
                width: "max-content",
                minWidth: "max-content",
                textDecoration: "none",
                color: currentColor,
                outline: "none",
                borderRadius: 4,
                WebkitTapHighlightColor: "transparent",
                transform: isPressed ? "translateY(-1px)" : "none",
                overflow: "visible",
                overflowX: "hidden",
                mixBlendMode: blendMode,
                transition:
                    isTouch || prefersReducedMotion
                        ? "transform 120ms ease, color 180ms ease"
                        : "color 280ms ease",
            }}
        >
            <style>{`
                .${focusClass}:focus { outline: none; }
                .${focusClass}:focus-visible {
                    outline: 2px solid rgba(0,0,0,0.4);
                    outline-offset: 4px;
                }
            `}</style>
            <span
                style={{
                    position: "relative",
                    display: "inline-block",
                    width: "max-content",
                    minWidth: "max-content",
                    overflow: "visible",
                    paddingTop: headroomTop,
                    paddingBottom: headroomBottom,
                }}
            >
                <span
                    ref={stageRef}
                    style={{
                        position: "relative",
                        display: "inline-block",
                        width: "max-content",
                        minWidth: "max-content",
                        overflow: "visible",
                        fontSize: responsiveFontSize,
                    }}
                >
                    <span
                        ref={rowRef}
                        style={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "baseline",
                            whiteSpace: "pre",
                            overflow: "visible",
                            color: "inherit",
                            fontFamily:
                                typography.fontFamily || "Outfit, sans-serif",
                            fontSize: "1em",
                            fontWeight: typography.fontWeight,
                            fontStyle: typography.fontStyle,
                            letterSpacing: typography.letterSpacing,
                            lineHeight: typography.lineHeight,
                            textAlign: typography.textAlign,
                            minWidth: "max-content",
                            paddingLeft: markerVisible
                                ? `calc(${markerWidthEm}em + ${baselineGapEm}em + 2px)`
                                : 0,
                            mixBlendMode: blendMode,
                        }}
                    >
                        {characters.map((char, index) => {
                            return (
                                <span
                                    key={`${char}-${index}`}
                                    ref={(el) => {
                                        letterRefs.current[index] = el
                                    }}
                                    data-wave-letter="true"
                                    style={{
                                        display: "inline-block",
                                        overflow: "visible",
                                        transform:
                                            "translate3d(0, 0px, 0) rotate(0deg) scale(1)",
                                        willChange: animationEnabled
                                            ? "transform"
                                            : "auto",
                                        backfaceVisibility: "hidden",
                                        perspective: 1000,
                                        transition:
                                            !animationEnabled &&
                                            (isTouch || prefersReducedMotion)
                                                ? "transform 120ms ease"
                                                : "none",
                                    }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </span>
                            )
                        })}
                    </span>
                    {markerVisible ? (
                        <span
                            ref={dotRef}
                            aria-hidden
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: `${markerWidthEm}em`,
                                height: `${markerHeightEm}em`,
                                borderRadius:
                                    markerShape === "Dot"
                                        ? "50%"
                                        : markerShape === "Square"
                                          ? 0
                                          : `${Math.max(0.04, markerHeightEm * 0.5)}em`,
                                background: dotColor,
                                transform: "translate(0px, 0px) scale(1,1)",
                                opacity: 1,
                                mixBlendMode: blendMode,
                                willChange: animationEnabled
                                    ? "transform, box-shadow"
                                    : "auto",
                                pointerEvents: "none",
                                transition: !animationEnabled
                                    ? "transform 120ms ease"
                                    : "none",
                            }}
                        />
                    ) : null}
                </span>
            </span>
        </a>
    )
}

addPropertyControls(Kern_WaveDotLink, {
    // --- content controls ---
    content: {
        type: ControlType.Object,
        title: "Content",
        icon: "object",
        description: "Set link text, destination, accessibility label, and interaction trigger.",
        controls: {
            label: {
                type: ControlType.String,
                title: "Label",
                defaultValue: "Largest Flows",
                description: "Visible link text rendered on the canvas and site.",
            },
            destination: {
                type: ControlType.Link,
                title: "Destination",
                defaultValue: "/",
                description: "URL or page this link opens when activated.",
            },
            ariaLabel: {
                type: ControlType.String,
                title: "Aria Label",
                defaultValue: "",
                description:
                    "Override accessible name. Leave empty to use the visible label.",
            },
            triggerMode: {
                type: ControlType.Enum,
                title: "Trigger",
                options: ["Hover", "Click"],
                optionTitles: ["Hover", "Click"],
                defaultValue: "Click",
                displaySegmentedControl: true,
                description:
                    "Hover is best for rare hero links; Click is recommended for navigation.",
            },
        },
        defaultValue: {
            label: "Largest Flows",
            destination: "/",
            ariaLabel: "",
            triggerMode: "Click",
        },
    },
    typographyGroup: {
        type: ControlType.Object,
        title: "Typography",
        icon: "object",
        description: "Adjust text font styling and interactive text colors.",
        controls: {
            typography: {
                type: ControlType.Font,
                title: "Font",
                controls: "extended",
                defaultFontType: "sans-serif",
                defaultValue: {
                    fontSize: 30,
                    variant: "Semibold",
                    lineHeight: "1em",
                    letterSpacing: "-0.01em",
                    textAlign: "left",
                },
                description: "Font style used for every character in the link label.",
            },
            fontSizeTablet: {
                type: ControlType.Number,
                title: "Size Tablet",
                defaultValue: 26,
                min: 10,
                max: 120,
                step: 1,
                unit: "px",
                displayStepper: true,
                description: "Font size around tablet widths (~810px).",
            },
            fontSizeMobile: {
                type: ControlType.Number,
                title: "Size Mobile",
                defaultValue: 22,
                min: 10,
                max: 96,
                step: 1,
                unit: "px",
                displayStepper: true,
                description: "Font size around mobile widths (~390px).",
            },
            textColor: {
                type: ControlType.Color,
                title: "Text Color",
                defaultValue: "#000000",
                description: "Default color of the link text at rest.",
            },
            activeColor: {
                type: ControlType.Color,
                title: "Active Color",
                defaultValue: "#CCCCCC",
                description: "Text color while hovered, animating, or pressed.",
            },
        },
        defaultValue: {
            fontSizeTablet: 26,
            fontSizeMobile: 22,
            textColor: "#000000",
            activeColor: "#CCCCCC",
        },
    },
    marker: {
        type: ControlType.Object,
        title: "Marker",
        icon: "object",
        description: "Customize the moving marker shape, color, size, and spacing.",
        controls: {
            markerShape: {
                type: ControlType.Enum,
                title: "Shape",
                options: ["Dot", "Dash", "Square", "None"],
                optionTitles: ["Dot", "Dash", "Square", "Off"],
                defaultValue: "Dot",
                description:
                    "Marker style. Off keeps the text wave with no marker.",
            },
            dotColor: {
                type: ControlType.Color,
                title: "Color",
                defaultValue: "#000000",
                description: "Color of the marker and its glow.",
                hidden: (props) => props.markerShape === "None",
            },
            dotSize: {
                type: ControlType.Number,
                title: "Size",
                min: 0.08,
                max: 0.55,
                step: 0.01,
                unit: "em",
                defaultValue: 0.28,
                description:
                    "Marker size relative to type (~0.28 ≈ balanced with letter height). Scales with font size.",
                hidden: (props) => props.markerShape === "None",
            },
            baselineGap: {
                type: ControlType.Number,
                title: "Gap",
                min: 0,
                max: 1.4,
                step: 0.01,
                unit: "em",
                defaultValue: 0.47,
                description:
                    "Space before the first letter, relative to type size.",
                hidden: (props) => props.markerShape === "None",
            },
        },
        defaultValue: {
            markerShape: "Dot",
            dotColor: "#000000",
            dotSize: 0.28,
            baselineGap: 0.47,
        },
    },
    motion: {
        type: ControlType.Object,
        title: "Motion",
        icon: "object",
        description: "Control overall timing and broad wave travel behavior.",
        controls: {
            duration: {
                type: ControlType.Number,
                title: "Duration",
                min: 0.2,
                max: 4,
                step: 0.05,
                defaultValue: 1.05,
                description: "Total marker travel time for a full forward pass.",
            },
            jumpAmplitude: {
                type: ControlType.Number,
                title: "Jump",
                min: 0,
                max: 40,
                step: 1,
                defaultValue: 12,
                description: "Maximum vertical lift applied to nearby letters.",
            },
            waveWidth: {
                type: ControlType.Number,
                title: "Wave Width",
                min: 8,
                max: 72,
                step: 1,
                defaultValue: 28,
                description: "How wide the marker’s influence spreads across characters.",
            },
            perLetterStagger: {
                type: ControlType.Number,
                title: "Letter Stagger",
                min: 0,
                max: 1,
                step: 0.01,
                defaultValue: 0.22,
                description: "Offsets trailing wave response for a more flowing sequence.",
            },
        },
        defaultValue: {
            duration: 1.05,
            jumpAmplitude: 12,
            waveWidth: 28,
            perLetterStagger: 0.22,
        },
    },
    // --- character motion controls ---
    characterMotion: {
        type: ControlType.Object,
        title: "Character Motion",
        icon: "object",
        description: "Fine-tune character dynamics while the marker passes.",
        controls: {
            springFeel: {
                type: ControlType.Number,
                title: "Spring Feel",
                min: 0,
                max: 1,
                step: 0.01,
                defaultValue: 0.6,
                description:
                    "Per-letter wave bounce. Progress travel uses a separate damped spring.",
            },
            maxRotation: {
                type: ControlType.Number,
                title: "Rotation",
                min: 0,
                max: 18,
                step: 0.1,
                unit: "deg",
                defaultValue: 4.2,
                description: "Maximum per-letter tilt during wave motion.",
            },
            scaleBoost: {
                type: ControlType.Number,
                title: "Scale",
                min: 0,
                max: 0.2,
                step: 0.005,
                defaultValue: 0.045,
                description: "How much characters scale up near peak influence.",
            },
            trailIntensity: {
                type: ControlType.Number,
                title: "Trail",
                min: 0,
                max: 1,
                step: 0.01,
                defaultValue: 0.35,
                description: "Strength of the delayed trailing response behind the marker.",
            },
            overshoot: {
                type: ControlType.Number,
                title: "Overshoot",
                min: 0,
                max: 1,
                step: 0.01,
                defaultValue: 0.28,
                description: "Adds subtle secondary motion for a more organic finish.",
            },
        },
        defaultValue: {
            springFeel: 0.6,
            maxRotation: 4.2,
            scaleBoost: 0.045,
            trailIntensity: 0.35,
            overshoot: 0.28,
        },
    },
    appearance: {
        type: ControlType.Object,
        title: "Appearance",
        icon: "object",
        description: "Set final compositing behavior for the full link artwork.",
        controls: {
            blendMode: {
                type: ControlType.Enum,
                title: "Blend Mode",
                options: [
                    "Normal",
                    "Multiply",
                    "Screen",
                    "Overlay",
                    "Difference",
                    "Exclusion",
                    "Darken",
                    "Lighten",
                ],
                optionTitles: [
                    "Normal",
                    "Multiply",
                    "Screen",
                    "Overlay",
                    "Difference",
                    "Exclusion",
                    "Darken",
                    "Lighten",
                ],
                defaultValue: "Normal",
                description: "How the link layers blend with background content.",
            },
        },
        defaultValue: {
            blendMode: "Normal",
        },
    },
})

Kern_WaveDotLink.displayName = "Kern Wave Dot Link"

