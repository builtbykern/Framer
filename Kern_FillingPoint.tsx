import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useReducedMotion, type Transition } from "framer-motion"
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    startTransition,
    useState,
    type CSSProperties,
    type FocusEvent as ReactFocusEvent,
    type KeyboardEvent,
    type PointerEvent as ReactPointerEvent,
    type ReactElement,
} from "react"

interface FillStop {
    color: string
    delay: number
}

interface KernFillingPointProps {
    label: string
    link: string
    newTab: boolean
    baseFill: string
    fills: FillStop[]
    /** @deprecated Prefer fills */
    fillColors?: string[]
    /** @deprecated Prefer fills */
    fillColor?: string
    labelColor: string
    labelContrast: "blend" | "solid"
    interactionEnergy: "quiet" | "balanced" | "expressive"
    surfaceDetail: "clean" | "optical"
    padding: string
    borderRadius: string
    font: CSSProperties
    enterTransition: Transition
    exitTransition: Transition
    style?: CSSProperties
}

interface FillLayer {
    color: string
    delay: number
    x: number
    y: number
    coverSize: number
    filled: boolean
}

type SessionPhase = "idle" | "entering" | "active" | "exiting" | "cancelled"
type LabelContrastMode = "blend" | "solid"
type InteractionEnergyMode = "quiet" | "balanced" | "expressive"
type SurfaceDetailMode = "clean" | "optical"

const MAX_COLORS = 3
const MAX_DELAY_MS = 400
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]
const CLASS_NAME = "kern-filling-point-cta"
const FOCUS_RING =
    "0 0 0 2px rgba(255,255,255,0.95), 0 0 0 5px rgba(111,211,255,0.58), 0 0 28px rgba(111,211,255,0.75)"
const LAYER_OPACITY = [0.84, 0.93, 1]

const DEFAULT_ENTER: Transition = {
    type: "spring",
    stiffness: 340,
    damping: 30,
    mass: 0.85,
}

const DEFAULT_EXIT: Transition = {
    type: "spring",
    stiffness: 420,
    damping: 36,
    mass: 0.75,
}

const DEFAULT_FILLS: FillStop[] = [
    { color: "#FFFFFF", delay: 0 },
    { color: "#6FD3FF", delay: 70 },
    { color: "#00D84A", delay: 140 },
]

function migrateLegacyCoral(value: string): string {
    return value.trim().toLowerCase() === "#ff6b4a" ? "#00D84A" : value
}

function clampDelay(value: unknown, fallback = 0): number {
    const n =
        typeof value === "number" && Number.isFinite(value) ? value : fallback
    return Math.max(0, Math.min(MAX_DELAY_MS, Math.round(n)))
}

function resolveFills(
    fills: FillStop[] | undefined,
    fillColors: string[] | undefined,
    fillColor: string | undefined
): FillStop[] {
    if (Array.isArray(fills) && fills.length > 0) {
        return fills.slice(0, MAX_COLORS).map((item, index) => ({
            color:
                typeof item?.color === "string" && item.color.length > 0
                    ? migrateLegacyCoral(item.color)
                    : (DEFAULT_FILLS[index]?.color ?? "#FFFFFF"),
            delay: clampDelay(item?.delay, index * 70),
        }))
    }

    if (Array.isArray(fillColors) && fillColors.length > 0) {
        return fillColors.slice(0, MAX_COLORS).map((color, index) => ({
            color:
                typeof color === "string"
                    ? migrateLegacyCoral(color)
                    : "#FFFFFF",
            delay: clampDelay(index * 70),
        }))
    }

    if (typeof fillColor === "string" && fillColor.length > 0) {
        return [{ color: migrateLegacyCoral(fillColor), delay: 0 }]
    }

    return DEFAULT_FILLS.map((f) => ({ ...f }))
}

function emptyLayers(stops: FillStop[]): FillLayer[] {
    return stops.map((stop) => ({
        color: stop.color,
        delay: stop.delay,
        x: 0,
        y: 0,
        coverSize: 800,
        filled: false,
    }))
}

function fillsKey(stops: FillStop[]): string {
    return stops.map((s) => `${s.color}:${s.delay}`).join("|")
}

function pointerIsFine(pointerType: string): boolean {
    return pointerType === "mouse" || pointerType === "pen"
}

function coverDiameter(
    width: number,
    height: number,
    x: number,
    y: number
): number {
    const dx = Math.max(x, width - x)
    const dy = Math.max(y, height - y)
    const radius = Math.sqrt(dx * dx + dy * dy)
    return Math.max(2, Math.ceil(radius * 2 + 2))
}

function centerClientPointForElement(el: HTMLElement | null): {
    clientX: number
    clientY: number
} {
    if (!el) {
        return { clientX: 0, clientY: 0 }
    }
    const rect = el.getBoundingClientRect()
    return {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
    }
}

function layerTransition(
    base: Transition,
    phase: "enter" | "exit",
    index: number,
    energy: {
        massStep: number
        dampingStep: number
        stiffnessStep: number
    }
): Transition {
    const transition = { ...(base as Record<string, unknown>) }
    const baseDelay =
        typeof transition.delay === "number" ? transition.delay : 0
    transition.delay = baseDelay

    if (transition.type === "spring") {
        const massBase =
            typeof transition.mass === "number"
                ? transition.mass
                : phase === "enter"
                  ? 0.82
                  : 0.74
        const dampingBase =
            typeof transition.damping === "number"
                ? transition.damping
                : phase === "enter"
                  ? 30
                  : 35
        const stiffnessBase =
            typeof transition.stiffness === "number"
                ? transition.stiffness
                : phase === "enter"
                  ? 350
                  : 420
        transition.mass = massBase + index * energy.massStep
        transition.damping = Math.max(
            14,
            dampingBase - index * energy.dampingStep
        )
        transition.stiffness = stiffnessBase + index * energy.stiffnessStep
        transition.velocity =
            phase === "enter" ? 1.1 - index * 0.18 : -0.55 - index * 0.08
    }

    if (
        transition.type === "tween" &&
        typeof transition.duration === "number"
    ) {
        transition.duration =
            phase === "enter"
                ? transition.duration + index * 0.015
                : Math.max(0.08, transition.duration - index * 0.01)
    }
    return transition as Transition
}

function normalizeEnumValue<T extends string>(
    value: unknown,
    allowed: readonly T[],
    fallback: T
): T {
    if (typeof value !== "string") return fallback
    const normalized = value.trim().toLowerCase()
    const hit = allowed.find((item) => item === normalized)
    return hit ?? fallback
}

function estimateTransitionMs(transition: Transition): number {
    const t = transition as Record<string, unknown>
    const delayMs = typeof t.delay === "number" ? t.delay * 1000 : 0
    if (t.type === "tween" && typeof t.duration === "number") {
        return delayMs + t.duration * 1000
    }
    const stiffness = typeof t.stiffness === "number" ? t.stiffness : 360
    const damping = typeof t.damping === "number" ? t.damping : 32
    const mass = typeof t.mass === "number" ? t.mass : 0.8
    const springMs = Math.max(
        220,
        520 + mass * 120 - damping * 2 + 24000 / stiffness
    )
    return delayMs + springMs
}

/**
 * User request: rebuild as a premium pointer-origin layered-fill CTA; fix pointer model, geometry, reversed exits, accessibility naming, focus, coarse-pointer behavior, reduced-motion handling, and add curated controls.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerDisableUnlink
 */
export default function Kern_FillingPoint(
    props: KernFillingPointProps
): ReactElement {
    const {
        label = "Get started",
        link = "",
        newTab = false,
        baseFill = "#060606",
        fills: fillsProp,
        fillColors,
        fillColor,
        labelColor = "#FFFFFF",
        labelContrast = "blend",
        interactionEnergy = "balanced",
        surfaceDetail = "optical",
        padding = "14px 28px",
        borderRadius = "999px",
        font = {},
        enterTransition = DEFAULT_ENTER,
        exitTransition = DEFAULT_EXIT,
        style,
    } = props

    const fills = resolveFills(fillsProp, fillColors, fillColor)
    const isStatic = useIsStaticRenderer()
    const prefersReducedMotion = useReducedMotion()
    const reducedMotion = Boolean(prefersReducedMotion)

    const rootRef = useRef<HTMLElement | null>(null)
    const setRootRef = useCallback((node: HTMLElement | null) => {
        rootRef.current = node
    }, [])
    const pointerRef = useRef({ x: 0, y: 0, coverSize: 800 })
    const entryOriginRef = useRef({ x: 0, y: 0, coverSize: 800 })
    const sessionRef = useRef<{
        id: number
        phase: SessionPhase
        origin: { x: number; y: number; coverSize: number }
    }>({
        id: 0,
        phase: "idle",
        origin: { x: 0, y: 0, coverSize: 800 },
    })
    const timersRef = useRef<number[]>([])

    const [layers, setLayers] = useState<FillLayer[]>(() => emptyLayers(fills))
    const [pressed, setPressed] = useState(false)

    const visibleLabel = (label || "").trim() || "Get started"
    const accessibleName = visibleLabel
    const hasLink = typeof link === "string" && link.length > 0
    const hasExplicitWidth = style?.width !== undefined
    const useOpacityFill = reducedMotion
    const key = fillsKey(fills)
    const resolvedLabelContrast = normalizeEnumValue<LabelContrastMode>(
        labelContrast,
        ["blend", "solid"],
        "blend"
    )
    const resolvedEnergy = normalizeEnumValue<InteractionEnergyMode>(
        interactionEnergy,
        ["quiet", "balanced", "expressive"],
        "balanced"
    )
    const resolvedSurfaceDetail = normalizeEnumValue<SurfaceDetailMode>(
        surfaceDetail,
        ["clean", "optical"],
        "optical"
    )
    const supportsDifferenceBlend = useMemo(() => {
        if (typeof window === "undefined") return true
        const canCheck =
            typeof window.CSS !== "undefined" &&
            typeof window.CSS.supports === "function"
        if (!canCheck) return true
        return window.CSS.supports("mix-blend-mode", "difference")
    }, [])
    const useBlendLabel =
        resolvedLabelContrast === "blend" && supportsDifferenceBlend
    const usesDefaultFillCadence =
        !fillsProp?.length &&
        !fillColors?.length &&
        (!fillColor || fillColor.length === 0)

    const energy = useMemo(() => {
        if (resolvedEnergy === "quiet") {
            return {
                pressScale: 0.985,
                pressDown: 0.085,
                pressUp: 0.14,
                exitStepMs: 55,
                massStep: 0.04,
                dampingStep: 0.7,
                stiffnessStep: 14,
                layerScaleBoost: 0.03,
                defaultCadenceScale: 1.4,
            }
        }
        if (resolvedEnergy === "expressive") {
            return {
                pressScale: 0.958,
                pressDown: 0.11,
                pressUp: 0.18,
                exitStepMs: 85,
                massStep: 0.08,
                dampingStep: 1.1,
                stiffnessStep: 22,
                layerScaleBoost: 0.065,
                defaultCadenceScale: 1.75,
            }
        }
        return {
            pressScale: 0.972,
            pressDown: 0.095,
            pressUp: 0.16,
            exitStepMs: 70,
            massStep: 0.06,
            dampingStep: 0.9,
            stiffnessStep: 18,
            layerScaleBoost: 0.05,
            defaultCadenceScale: 1.57,
        }
    }, [resolvedEnergy])

    const resolvedEnter = enterTransition ?? DEFAULT_ENTER
    const resolvedExit = exitTransition ?? DEFAULT_EXIT

    useEffect(() => {
        if (
            sessionRef.current.phase === "entering" ||
            sessionRef.current.phase === "active" ||
            sessionRef.current.phase === "exiting"
        )
            return
        startTransition(() => {
            setLayers(emptyLayers(fills))
        })
    }, [key, fills])

    useEffect(() => {
        return () => {
            if (typeof window === "undefined") return
            timersRef.current.forEach((id) => window.clearTimeout(id))
            timersRef.current = []
        }
    }, [])

    const clearTimers = useCallback(() => {
        if (typeof window === "undefined") return
        timersRef.current.forEach((id) => window.clearTimeout(id))
        timersRef.current = []
    }, [])

    const startSession = useCallback(
        (
            phase: SessionPhase,
            origin?: {
                x: number
                y: number
                coverSize: number
            }
        ): number => {
            const nextId = sessionRef.current.id + 1
            sessionRef.current = {
                id: nextId,
                phase,
                origin: origin ?? sessionRef.current.origin,
            }
            if (origin) {
                entryOriginRef.current = origin
            }
            return nextId
        },
        []
    )

    const resetLayers = useCallback(
        (point?: { x: number; y: number; coverSize?: number }) => {
            const fallback = entryOriginRef.current
            const x = point?.x ?? fallback.x
            const y = point?.y ?? fallback.y
            const coverSize = point?.coverSize ?? fallback.coverSize
            startTransition(() => {
                setLayers(
                    fills.map((stop) => ({
                        color: stop.color,
                        delay: stop.delay,
                        x,
                        y,
                        coverSize,
                        filled: false,
                    }))
                )
            })
        },
        [fills]
    )

    const localPoint = useCallback((clientX: number, clientY: number) => {
        const el = rootRef.current
        if (!el) return { x: 0, y: 0, coverSize: 800, width: 0, height: 0 }
        const rect = el.getBoundingClientRect()
        const x = clientX - rect.left
        const y = clientY - rect.top
        return {
            x,
            y,
            coverSize: coverDiameter(rect.width, rect.height, x, y),
            width: rect.width,
            height: rect.height,
        }
    }, [])

    const syncPointer = useCallback(
        (clientX: number, clientY: number) => {
            const p = localPoint(clientX, clientY)
            pointerRef.current = { x: p.x, y: p.y, coverSize: p.coverSize }
        },
        [localPoint]
    )

    const schedule = useCallback(
        (delayMs: number, run: () => void, seq: number) => {
            if (delayMs <= 0) {
                if (sessionRef.current.id !== seq) return
                run()
                return
            }
            if (typeof window === "undefined") return
            const id = window.setTimeout(() => {
                timersRef.current = timersRef.current.filter(
                    (timerId) => timerId !== id
                )
                if (sessionRef.current.id !== seq) return
                run()
            }, delayMs)
            timersRef.current.push(id)
        },
        []
    )

    const setLayerState = useCallback(
        (
            index: number,
            point: { x: number; y: number },
            coverSize: number,
            filled: boolean
        ) => {
            startTransition(() => {
                setLayers((prev) => {
                    const next = [...prev]
                    const base = next[index]
                    if (!base) return prev
                    next[index] = {
                        ...base,
                        x: point.x,
                        y: point.y,
                        coverSize,
                        filled,
                    }
                    return next
                })
            })
        },
        []
    )

    const startCascadeIn = useCallback(
        (clientX: number, clientY: number) => {
            if (isStatic) return
            clearTimers()
            syncPointer(clientX, clientY)
            const p = pointerRef.current
            const seq = startSession("entering", p)

            if (reducedMotion) {
                startTransition(() => {
                    setLayers(
                        fills.map((stop) => ({
                            color: stop.color,
                            delay: stop.delay,
                            x: entryOriginRef.current.x,
                            y: entryOriginRef.current.y,
                            coverSize: entryOriginRef.current.coverSize,
                            filled: true,
                        }))
                    )
                })
                sessionRef.current.phase = "active"
                return
            }

            startTransition(() => {
                setLayers((prev) =>
                    fills.map((stop, index) => ({
                        color: stop.color,
                        delay: stop.delay,
                        x: entryOriginRef.current.x,
                        y: entryOriginRef.current.y,
                        coverSize: entryOriginRef.current.coverSize,
                        filled: prev[index]?.filled ?? false,
                    }))
                )
            })

            let longestEnter = 0
            fills.forEach((stop, index) => {
                const layerDelay =
                    index === 0
                        ? 0
                        : Math.round(
                              stop.delay *
                                  (usesDefaultFillCadence
                                      ? energy.defaultCadenceScale
                                      : 1)
                          )
                const transitionEstimate = estimateTransitionMs(
                    layerTransition(resolvedEnter, "enter", index, energy)
                )
                longestEnter = Math.max(
                    longestEnter,
                    layerDelay + transitionEstimate
                )
                schedule(
                    layerDelay,
                    () => {
                        if (
                            sessionRef.current.id !== seq ||
                            (sessionRef.current.phase !== "entering" &&
                                sessionRef.current.phase !== "active")
                        )
                            return
                        const origin = entryOriginRef.current
                        setLayerState(
                            index,
                            { x: origin.x, y: origin.y },
                            origin.coverSize,
                            true
                        )
                    },
                    seq
                )
            })
            schedule(
                longestEnter,
                () => {
                    if (sessionRef.current.id !== seq) return
                    sessionRef.current.phase = "active"
                },
                seq
            )
        },
        [
            clearTimers,
            energy,
            fills,
            isStatic,
            reducedMotion,
            resolvedEnter,
            schedule,
            setLayerState,
            startSession,
            syncPointer,
            usesDefaultFillCadence,
        ]
    )

    const startCascadeOut = useCallback(() => {
        if (
            sessionRef.current.phase !== "entering" &&
            sessionRef.current.phase !== "active"
        )
            return
        const seq = startSession("exiting")
        clearTimers()
        const exitPoint = entryOriginRef.current

        if (reducedMotion) {
            resetLayers({
                x: exitPoint.x,
                y: exitPoint.y,
                coverSize: exitPoint.coverSize,
            })
            sessionRef.current.phase = "idle"
            return
        }

        // Keep geometry pinned to the frozen entry origin for the whole exit.
        startTransition(() => {
            setLayers((prev) =>
                prev.map((layer) => ({
                    ...layer,
                    x: exitPoint.x,
                    y: exitPoint.y,
                    coverSize: exitPoint.coverSize,
                }))
            )
        })

        const reverseIndexes = fills.map((_, idx) => idx).reverse()
        let longestExit = 0
        reverseIndexes.forEach((layerIndex, stepIndex) => {
            const delay = stepIndex * energy.exitStepMs
            const transitionEstimate = estimateTransitionMs(
                layerTransition(resolvedExit, "exit", layerIndex, energy)
            )
            longestExit = Math.max(longestExit, delay + transitionEstimate)
            schedule(
                delay,
                () => {
                    if (sessionRef.current.id !== seq) return
                    setLayerState(
                        layerIndex,
                        {
                            x: exitPoint.x,
                            y: exitPoint.y,
                        },
                        exitPoint.coverSize,
                        false
                    )
                },
                seq
            )
        })
        schedule(
            longestExit,
            () => {
                if (sessionRef.current.id !== seq) return
                sessionRef.current.phase = "idle"
            },
            seq
        )
    }, [
        clearTimers,
        energy,
        fills,
        reducedMotion,
        resetLayers,
        resolvedExit,
        schedule,
        setLayerState,
        startSession,
    ])

    const onPointerEnter = useCallback(
        (event: ReactPointerEvent) => {
            if (!pointerIsFine(event.pointerType)) return
            startCascadeIn(event.clientX, event.clientY)
        },
        [startCascadeIn]
    )

    const onPointerMove = useCallback(
        (event: ReactPointerEvent) => {
            if (!pointerIsFine(event.pointerType)) return
            if (
                sessionRef.current.phase === "entering" ||
                sessionRef.current.phase === "active"
            ) {
                syncPointer(event.clientX, event.clientY)
            }
        },
        [syncPointer]
    )

    const onPointerLeave = useCallback(
        (event: ReactPointerEvent) => {
            startTransition(() => {
                setPressed(false)
            })
            if (!pointerIsFine(event.pointerType)) return
            startCascadeOut()
        },
        [startCascadeOut]
    )

    const onPointerDown = useCallback(
        (event: ReactPointerEvent) => {
            startTransition(() => {
                setPressed(true)
            })
            if (isStatic) return
            if (!pointerIsFine(event.pointerType)) {
                startCascadeIn(event.clientX, event.clientY)
            }
        },
        [isStatic, startCascadeIn]
    )

    const onPointerUp = useCallback(
        (event: ReactPointerEvent) => {
            startTransition(() => {
                setPressed(false)
            })
            if (!pointerIsFine(event.pointerType)) {
                startCascadeOut()
            }
        },
        [startCascadeOut]
    )

    const onPointerCancel = useCallback(() => {
        startTransition(() => {
            setPressed(false)
        })
        clearTimers()
        startSession("cancelled")
        resetLayers()
    }, [clearTimers, resetLayers, startSession])

    const onKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key !== "Enter" && event.key !== " ") return
            if (event.key === " " || !hasLink) {
                event.preventDefault()
            }
            if (event.repeat) return
            startTransition(() => {
                setPressed(true)
            })
            const center = centerClientPointForElement(rootRef.current)
            startCascadeIn(center.clientX, center.clientY)
        },
        [hasLink, startCascadeIn]
    )

    const onKeyUp = useCallback(
        (event: KeyboardEvent) => {
            if (event.key !== "Enter" && event.key !== " ") return
            startTransition(() => {
                setPressed(false)
            })
            startCascadeOut()
        },
        [startCascadeOut]
    )

    const onFocus = useCallback(
        (event: ReactFocusEvent<HTMLElement>) => {
            if (event.currentTarget.matches(":focus-visible")) {
                const center = centerClientPointForElement(rootRef.current)
                startCascadeIn(center.clientX, center.clientY)
            }
        },
        [startCascadeIn]
    )

    const onBlur = useCallback(() => {
        startTransition(() => {
            setPressed(false)
        })
        startCascadeOut()
    }, [startCascadeOut])

    const rootStyle: CSSProperties = {
        ...style,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        margin: 0,
        padding,
        overflow: "hidden",
        cursor: "pointer",
        userSelect: "none",
        textDecoration: "none",
        border: "none",
        appearance: "none",
        WebkitAppearance: "none",
        backgroundColor: baseFill,
        borderRadius,
        clipPath: `inset(0 round ${borderRadius})`,
        WebkitClipPath: `inset(0 round ${borderRadius})`,
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        color: labelColor,
        isolation: "isolate",
        width: style?.width ?? "auto",
        height: style?.height ?? "auto",
        minWidth: hasExplicitWidth ? undefined : "max-content",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        boxShadow:
            resolvedSurfaceDetail === "optical"
                ? "inset 0 0 0 1px rgba(255,255,255,0.2)"
                : "inset 0 0 0 1px rgba(255,255,255,0.14)",
    }

    const labelStyle: CSSProperties = {
        position: "relative",
        zIndex: MAX_COLORS + 3,
        pointerEvents: "none",
        whiteSpace: "nowrap",
        color: useBlendLabel ? "#FFFFFF" : labelColor,
        mixBlendMode: useBlendLabel ? "difference" : "normal",
        ...font,
    }

    const pressTransition: Transition = {
        duration: pressed ? energy.pressDown : energy.pressUp,
        ease: EASE_OUT,
    }

    const sharedMotion = {
        ref: setRootRef,
        onPointerEnter,
        onPointerLeave,
        onPointerMove,
        onPointerDown,
        onPointerUp,
        onPointerCancel,
        onKeyDown,
        onKeyUp,
        onFocus,
        onBlur,
        style: rootStyle,
        "aria-label": accessibleName,
        className: CLASS_NAME,
        initial: false,
        animate: { scale: isStatic ? 1 : pressed ? energy.pressScale : 1 },
        transition: pressTransition,
    }

    const fillLayerNodes = (() => {
        if (isStatic) {
            return null
        }

        if (useOpacityFill) {
            return layers.map((layer, index) => (
                <motion.div
                    key={`opacity-${layer.color}-${index}`}
                    aria-hidden
                    initial={false}
                    animate={{
                        opacity: layer.filled ? 0.26 + index * 0.14 : 0,
                    }}
                    transition={{
                        duration: reducedMotion
                            ? 0
                            : layer.filled
                              ? 0.16
                              : 0.12,
                        ease: EASE_OUT,
                    }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius,
                        backgroundColor: layer.color,
                        pointerEvents: "none",
                        zIndex: index,
                    }}
                />
            ))
        }

        return layers.map((layer, index) => (
            <motion.div
                key={`origin-${layer.color}-${index}`}
                aria-hidden
                initial={false}
                animate={{
                    scale: layer.filled
                        ? 1 +
                          (MAX_COLORS - 1 - index) *
                              (energy.layerScaleBoost * 0.35)
                        : 0,
                    opacity: layer.filled ? (LAYER_OPACITY[index] ?? 0.84) : 0,
                }}
                transition={layerTransition(
                    layer.filled ? resolvedEnter : resolvedExit,
                    layer.filled ? "enter" : "exit",
                    index,
                    energy
                )}
                style={{
                    position: "absolute",
                    left: layer.x,
                    top: layer.y,
                    width: layer.coverSize,
                    height: layer.coverSize,
                    x: "-50%",
                    y: "-50%",
                    borderRadius: "50%",
                    backgroundColor: layer.color,
                    pointerEvents: "none",
                    zIndex: index,
                    willChange: "transform, opacity",
                }}
            />
        ))
    })()

    const children = (
        <>
            <style>{`
                .${CLASS_NAME}:focus-visible {
                    outline: 2px solid rgba(255,255,255,0.95);
                    outline-offset: 2px;
                    box-shadow: ${FOCUS_RING};
                }
            `}</style>
            <div
                aria-hidden
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius,
                    overflow: "hidden",
                    clipPath: `inset(0 round ${borderRadius})`,
                    WebkitClipPath: `inset(0 round ${borderRadius})`,
                    WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                {fillLayerNodes}
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        inset: 0.5,
                        borderRadius,
                        pointerEvents: "none",
                        zIndex: MAX_COLORS + 1,
                        boxShadow:
                            resolvedSurfaceDetail === "optical"
                                ? "inset 0 0 0 1px rgba(255,255,255,0.24)"
                                : "inset 0 0 0 1px rgba(255,255,255,0.16)",
                    }}
                />
            </div>
            <span style={labelStyle}>{visibleLabel}</span>
        </>
    )

    if (hasLink) {
        return (
            <motion.a
                {...sharedMotion}
                href={link}
                target={newTab ? "_blank" : undefined}
                rel={newTab ? "noopener noreferrer" : undefined}
            >
                {children}
            </motion.a>
        )
    }

    return (
        <motion.button {...sharedMotion} type="button">
            {children}
        </motion.button>
    )
}

addPropertyControls(Kern_FillingPoint, {
    label: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "Get started",
    },
    link: {
        type: ControlType.Link,
        title: "Link",
        defaultValue: "",
    },
    newTab: {
        type: ControlType.Boolean,
        title: "New Tab",
        defaultValue: false,
        hidden: (props) => !props.link,
    },
    baseFill: {
        type: ControlType.Color,
        title: "Base",
        defaultValue: "#060606",
    },
    fills: {
        type: ControlType.Array,
        title: "Fills",
        maxCount: MAX_COLORS,
        control: {
            type: ControlType.Object,
            controls: {
                color: {
                    type: ControlType.Color,
                    title: "Color",
                    defaultValue: "#FFFFFF",
                },
                delay: {
                    type: ControlType.Number,
                    title: "Delay",
                    defaultValue: 0,
                    min: 0,
                    max: MAX_DELAY_MS,
                    step: 10,
                    unit: "ms",
                },
            },
        },
        defaultValue: DEFAULT_FILLS,
    },
    labelColor: {
        type: ControlType.Color,
        title: "Label",
        defaultValue: "#FFFFFF",
    },
    labelContrast: {
        type: ControlType.Enum,
        title: "Contrast",
        options: ["blend", "solid"],
        optionTitles: ["Blend", "Solid"],
        defaultValue: "blend",
    },
    surfaceDetail: {
        type: ControlType.Enum,
        title: "Surface",
        options: ["clean", "optical"],
        optionTitles: ["Clean", "Optical"],
        defaultValue: "optical",
    },
    padding: {
        type: ControlType.Padding,
        title: "Padding",
        defaultValue: "14px 28px",
    },
    borderRadius: {
        type: ControlType.BorderRadius,
        title: "Radius",
        defaultValue: "999px",
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        displayTextAlignment: false,
        defaultValue: {
            fontSize: "16px",
            variant: "Semibold",
            letterSpacing: "-0.01em",
            lineHeight: "1.2em",
        },
    },
    interactionEnergy: {
        type: ControlType.Enum,
        title: "Energy",
        options: ["quiet", "balanced", "expressive"],
        optionTitles: ["Quiet", "Balanced", "Expressive"],
        defaultValue: "balanced",
    },
    enterTransition: {
        type: ControlType.Transition,
        title: "Enter",
        defaultValue: DEFAULT_ENTER,
    },
    exitTransition: {
        type: ControlType.Transition,
        title: "Exit",
        defaultValue: DEFAULT_EXIT,
    },
})
