// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: auto
// @framerIntrinsicWidth: 800
// @framerIntrinsicHeight: 600

/**
 * Kern_KineticLinesGrid
 *
 * Vertical kinetic divider columns with guitar-string pluck physics.
 * One simulation loop, responsive column count, gap, padding, and margins.
 *
 * @version 1.2.0
 */

import { addPropertyControls, ControlType, RenderTarget, useIsOnFramerCanvas } from "framer"
import {
    motion,
    useAnimationFrame,
    useInView,
    useReducedMotion,
} from "framer-motion"
import {
    startTransition,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type PointerEvent as ReactPointerEvent,
} from "react"

// ─── Physics (inlined — single-file Marketplace delivery) ─────────────────

const SEGMENT_MIN = 12
const SEGMENT_MAX = 64
const MAX_COLUMNS = 24

interface PhysicsConfig {
    bendAmount: number
    pluckIntensity: number
    pointerReach: number
    tension: number
    damping: number
    spread: number
    sensitivity: number
    segmentCount: number
}

interface LineSimulationState {
    segmentCount: number
    displacement: Float32Array
    velocity: Float32Array
}

function clampSegmentCount(value: number): number {
    return Math.max(SEGMENT_MIN, Math.min(SEGMENT_MAX, Math.round(value)))
}

function createLineState(segmentCount: number): LineSimulationState {
    const count = clampSegmentCount(segmentCount)
    return {
        segmentCount: count,
        displacement: new Float32Array(count),
        velocity: new Float32Array(count),
    }
}

function applyPluck(
    state: LineSimulationState,
    t: number,
    impulse: number,
    spread: number
): void {
    const n = state.segmentCount
    const center = Math.max(0, Math.min(1, t)) * (n - 1)
    const sigma = Math.max(0.5, spread * n * 0.35)
    for (let i = 0; i < n; i++) {
        const dist = i - center
        const kernel = Math.exp(-(dist * dist) / (2 * sigma * sigma))
        state.velocity[i] += impulse * kernel
    }
}

function stepSimulation(
    state: LineSimulationState,
    config: PhysicsConfig,
    deltaMs: number
): void {
    const dt = Math.min(0.032, deltaMs / 1000)
    const n = state.segmentCount
    const stiffness = config.tension
    const damping = config.damping
    const coupling = stiffness * 0.35
    const cap = config.bendAmount * 0.01

    for (let i = 0; i < n; i++) {
        const left = i > 0 ? state.displacement[i - 1] : 0
        const right = i < n - 1 ? state.displacement[i + 1] : 0
        const neighborPull =
            (left + right - 2 * state.displacement[i]) * coupling
        const spring = -stiffness * state.displacement[i]
        const damp = -damping * state.velocity[i]
        state.velocity[i] += (neighborPull + spring + damp) * dt
    }

    for (let i = 0; i < n; i++) {
        state.displacement[i] += state.velocity[i] * dt
        if (state.displacement[i] > cap) state.displacement[i] = cap
        if (state.displacement[i] < -cap) state.displacement[i] = -cap
    }
}

function buildVerticalPathD(
    state: LineSimulationState,
    padding: number
): string {
    const n = state.segmentCount
    const pad = Math.min(40, Math.max(0, padding))
    const y0 = pad
    const y1 = 100 - pad
    const baseline = 50

    if (n < 2) {
        return `M ${baseline} ${y0} L ${baseline} ${y1}`
    }

    const parts: string[] = []
    for (let i = 0; i < n; i++) {
        const t = i / (n - 1)
        const y = y0 + t * (y1 - y0)
        const x = baseline + state.displacement[i] * 100
        parts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)
    }
    return parts.join(" ")
}

function buildStaticVerticalPath(padding: number): string {
    const pad = Math.min(40, Math.max(0, padding))
    return `M 50 ${pad} L 50 ${100 - pad}`
}

// ─── Layout / config types ─────────────────────────────────────────────────

interface SpacingBox {
    top: number
    right: number
    bottom: number
    left: number
}

interface LayoutConfig {
    columns: number
    columnsTablet: number
    columnsMobile: number
    paddingLeft: number
    paddingRight: number
    minHeight: number
    linePadding: number
    clipBends: boolean
}

interface ResponsiveConfig {
    breakpointTablet: number
    breakpointMobile: number
}

interface StrokeConfig {
    color: string
    width: number
    opacity: number
}

interface InteractionConfig {
    enabled: boolean
    touchCapture: boolean
    neighborBleed: number
    performanceMode: boolean
}

interface BackgroundConfig {
    mode: "solid" | "transparent" | "gradient"
    solidColor: string
    gradientStart: string
    gradientEnd: string
    gradientAngle: number
}

interface EntranceConfig {
    enabled: boolean
    staggerDelay: number
}

interface Props {
    layout?: LayoutConfig
    responsive?: ResponsiveConfig
    stroke?: StrokeConfig
    physics?: PhysicsConfig
    interaction?: InteractionConfig
    background?: BackgroundConfig
    entrance?: EntranceConfig
    ariaLabel: string
    style?: CSSProperties
}

const DEFAULT_PHYSICS: PhysicsConfig = {
    bendAmount: 8,
    pluckIntensity: 0.35,
    pointerReach: 1,
    tension: 60,
    damping: 22,
    spread: 0.12,
    sensitivity: 1,
    segmentCount: 32,
}

const DEFAULT_LAYOUT: LayoutConfig = {
    columns: 6,
    columnsTablet: 4,
    columnsMobile: 3,
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: 480,
    linePadding: 0,
    clipBends: false,
}

const DEFAULT_RESPONSIVE: ResponsiveConfig = {
    breakpointTablet: 810,
    breakpointMobile: 390,
}

const DEFAULT_STROKE: StrokeConfig = {
    color: "#999999",
    width: 1.5,
    opacity: 1,
}

const DEFAULT_INTERACTION: InteractionConfig = {
    enabled: true,
    touchCapture: true,
    neighborBleed: 0.35,
    performanceMode: false,
}

const DEFAULT_BACKGROUND: BackgroundConfig = {
    mode: "transparent",
    solidColor: "#0E0E0E",
    gradientStart: "#121212",
    gradientEnd: "#1A1A1A",
    gradientAngle: 135,
}

const DEFAULT_ENTRANCE: EntranceConfig = {
    enabled: true,
    staggerDelay: 0.04,
}

const DEFAULT_ARIA_LABEL =
    "Interactive kinetic line grid. Press Enter or Space to pluck the center line."

const ENTRANCE_SPRING = {
    type: "spring" as const,
    duration: 0.5,
    bounce: 0.18,
}

/** Locks component to parent width; re-applied after `...style`. */
const FULL_BLEED_WIDTH: Pick<
    CSSProperties,
    "width" | "maxWidth" | "minWidth" | "alignSelf" | "display"
> = {
    width: "100%",
    maxWidth: "none",
    minWidth: 0,
    alignSelf: "stretch",
    display: "block",
}

function resolvePhysics(
    custom: Partial<PhysicsConfig> | undefined
): PhysicsConfig {
    return {
        bendAmount: custom?.bendAmount ?? DEFAULT_PHYSICS.bendAmount,
        pluckIntensity:
            custom?.pluckIntensity ?? DEFAULT_PHYSICS.pluckIntensity,
        pointerReach: custom?.pointerReach ?? DEFAULT_PHYSICS.pointerReach,
        tension: custom?.tension ?? DEFAULT_PHYSICS.tension,
        damping: custom?.damping ?? DEFAULT_PHYSICS.damping,
        spread: custom?.spread ?? DEFAULT_PHYSICS.spread,
        sensitivity: custom?.sensitivity ?? DEFAULT_PHYSICS.sensitivity,
        segmentCount: clampSegmentCount(
            custom?.segmentCount ?? DEFAULT_PHYSICS.segmentCount
        ),
    }
}

function resolveLayout(
    partial: Partial<LayoutConfig> | undefined
): LayoutConfig {
    const base = partial ?? {}
    return {
        columns: base.columns ?? 6,
        columnsTablet: base.columnsTablet ?? 4,
        columnsMobile: base.columnsMobile ?? 3,
        paddingLeft: base.paddingLeft ?? 0,
        paddingRight: base.paddingRight ?? 0,
        minHeight: base.minHeight ?? 480,
        linePadding: base.linePadding ?? 0,
        clipBends: base.clipBends ?? false,
    }
}

function backgroundStyle(bg: BackgroundConfig): string | undefined {
    if (bg.mode === "transparent") return undefined
    if (bg.mode === "solid") return bg.solidColor
    return `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientStart}, ${bg.gradientEnd})`
}

interface ColumnMetrics {
    columnCount: number
    slotWidth: number
    contentLeft: number
    contentTop: number
    contentWidth: number
    contentHeight: number
}

function computeColumnMetrics(
    containerNode: HTMLDivElement | null,
    columnCount: number,
    layout: LayoutConfig
): ColumnMetrics {
    if (!containerNode) {
        return {
            columnCount,
            slotWidth: 0,
            contentLeft: 0,
            contentTop: 0,
            contentWidth: 100,
            contentHeight: 100,
        }
    }

    const rect = containerNode.getBoundingClientRect()
    const fullWidth = Math.max(1, rect.width)
    const contentWidth = Math.max(
        1,
        fullWidth - layout.paddingLeft - layout.paddingRight
    )
    const contentHeight = Math.max(1, rect.height)

    return {
        columnCount,
        slotWidth: contentWidth / Math.max(1, columnCount - 1),
        contentLeft: layout.paddingLeft,
        contentTop: 0,
        contentWidth,
        contentHeight,
    }
}

function columnIndexFromX(x: number, metrics: ColumnMetrics): number {
    const { columnCount, contentLeft, contentWidth } = metrics
    if (columnCount <= 1) return 0

    const relativeX = x - contentLeft
    if (relativeX <= 0) return 0
    if (relativeX >= contentWidth) return columnCount - 1

    // Find closest column based on even distribution
    const spacing = contentWidth / (columnCount - 1)
    const index = Math.round(relativeX / spacing)
    
    return Math.max(0, Math.min(columnCount - 1, index))
}

function columnCenterX(index: number, metrics: ColumnMetrics): number {
    const { columnCount, contentWidth, contentLeft } = metrics
    
    if (columnCount === 1) {
        return contentLeft + contentWidth / 2
    }
    
    // Distribute evenly from left to right edge
    const spacing = contentWidth / (columnCount - 1)
    return contentLeft + index * spacing
}



// ─── Component ─────────────────────────────────────────────────────────────

export default function Kern_KineticLinesGrid(props: Partial<Props>) {
    const {
        layout: layoutInput,
        responsive = DEFAULT_RESPONSIVE,
        stroke = DEFAULT_STROKE,
        physics: physicsInput,
        interaction = DEFAULT_INTERACTION,
        background = DEFAULT_BACKGROUND,
        entrance = DEFAULT_ENTRANCE,
        ariaLabel = DEFAULT_ARIA_LABEL,
        style,
    } = props

    const layout = useMemo(() => resolveLayout(layoutInput), [layoutInput])

    const resolvedPhysics = useMemo(
        () => {
            const base = resolvePhysics(physicsInput)
            // Apply performance mode overrides
            if (interaction.performanceMode) {
                return {
                    ...base,
                    segmentCount: Math.min(base.segmentCount, 16),
                }
            }
            return base
        },
        [physicsInput, interaction.performanceMode]
    )

    const containerRef = useRef<HTMLDivElement>(null)
    const pathRefs = useRef<(SVGPathElement | null)[]>([])
    const simulationsRef = useRef<LineSimulationState[]>([])
    const metricsRef = useRef<ColumnMetrics | null>(null)
    const pointerActiveRef = useRef(false)
    const lastFrameRef = useRef(0)

    const [windowWidth, setWindowWidth] = useState(1440)

    const isCanvas = useIsOnFramerCanvas()
    const isThumbnail = RenderTarget.current() === RenderTarget.thumbnail
    const prefersReduced = useReducedMotion()
    const isInView = useInView(containerRef, { once: false, amount: 0.15 })
    const entranceSeenRef = useRef(false)
    const [entranceReady, setEntranceReady] = useState(false)

    const { activeColumns } = useMemo(() => {
        const isMobile = windowWidth <= responsive.breakpointMobile
        const isTablet = !isMobile && windowWidth <= responsive.breakpointTablet

        return {
            activeColumns: Math.min(
                MAX_COLUMNS,
                Math.max(
                    1,
                    isMobile
                        ? layout.columnsMobile
                        : isTablet
                          ? layout.columnsTablet
                          : layout.columns
                )
            ),
        }
    }, [windowWidth, layout, responsive])

    const columnIndices = useMemo(
        () => Array.from({ length: activeColumns }, (_, i) => i),
        [activeColumns]
    )

    const rootBackground = backgroundStyle(background)
    const shouldSimulate =
        interaction.enabled && !isCanvas && !isThumbnail && !prefersReduced && isInView

    const canEntrance =
        entrance.enabled && !isCanvas && !isThumbnail && !prefersReduced

    const motionScale = 1

    useEffect(() => {
        if (!canEntrance || entranceSeenRef.current || !isInView) return
        entranceSeenRef.current = true
        startTransition(() => setEntranceReady(true))
    }, [canEntrance, isInView])

    useEffect(() => {
        if (isInView) return
        lastFrameRef.current = 0
        pointerActiveRef.current = false
    }, [isInView])

    const syncSimulations = useCallback(() => {
        const count = activeColumns
        const seg = resolvedPhysics.segmentCount
        const current = simulationsRef.current

        if (current.length === count) {
            for (const sim of current) {
                if (sim.segmentCount !== seg) {
                    simulationsRef.current = columnIndices.map(() =>
                        createLineState(seg)
                    )
                    return
                }
            }
            return
        }

        simulationsRef.current = columnIndices.map(() => createLineState(seg))
    }, [activeColumns, columnIndices, resolvedPhysics.segmentCount])

    const updatePaths = useCallback(() => {
        const sims = simulationsRef.current
        const paths = pathRefs.current
        const pad = layout.linePadding
        const useStatic = isCanvas || isThumbnail || !shouldSimulate

        for (let i = 0; i < sims.length; i++) {
            const path = paths[i]
            if (!path) continue
            path.setAttribute(
                "d",
                useStatic
                    ? buildStaticVerticalPath(pad)
                    : buildVerticalPathD(sims[i], pad)
            )
        }
    }, [isCanvas, isThumbnail, layout.linePadding, shouldSimulate])

    useLayoutEffect(() => {
        syncSimulations()
    }, [syncSimulations])

    useEffect(() => {
        if (typeof window === "undefined") return

        const onResize = () => {
            startTransition(() => {
                setWindowWidth(globalThis.innerWidth)
            })
        }

        onResize()
        globalThis.addEventListener("resize", onResize)
        return () => globalThis.removeEventListener("resize", onResize)
    }, [])

    useEffect(() => {
        const node = containerRef.current
        if (!node || typeof ResizeObserver === "undefined") return

        const observer = new ResizeObserver(() => {
            startTransition(() => {
                metricsRef.current = computeColumnMetrics(
                    containerRef.current,
                    activeColumns,
                    layout
                )
            })
        })

        observer.observe(node)
        metricsRef.current = computeColumnMetrics(
            node,
            activeColumns,
            layout
        )
        return () => observer.disconnect()
    }, [activeColumns, layout])

    useLayoutEffect(() => {
        updatePaths()
    }, [updatePaths, activeColumns])

    useAnimationFrame((time) => {
        if (!shouldSimulate) return

        // Check if any simulation has significant motion
        const sims = simulationsRef.current
        let hasMotion = pointerActiveRef.current
        
        if (!hasMotion) {
            const threshold = 0.001
            for (const sim of sims) {
                for (let i = 0; i < sim.segmentCount; i++) {
                    if (Math.abs(sim.displacement[i]) > threshold || Math.abs(sim.velocity[i]) > threshold) {
                        hasMotion = true
                        break
                    }
                }
                if (hasMotion) break
            }
        }

        // Skip simulation if nothing is moving
        if (!hasMotion && lastFrameRef.current !== 0) return

        const delta =
            lastFrameRef.current === 0 ? 16 : time - lastFrameRef.current
        lastFrameRef.current = time

        for (const sim of sims) {
            stepSimulation(sim, resolvedPhysics, delta)
        }

        updatePaths()
    })



    const applyPointerPluck = useCallback(
        (clientX: number, clientY: number) => {
            const node = containerRef.current
            const metrics = metricsRef.current
            if (!node || !metrics || !interaction.enabled) return

            const rect = node.getBoundingClientRect()
            const localX = clientX - rect.left

            const col = columnIndexFromX(localX, metrics)
            const t =
                (clientY - rect.top - metrics.contentTop) /
                Math.max(1, metrics.contentHeight)
            const clampedT = Math.max(0, Math.min(1, t))

            const centerX = columnCenterX(col, metrics)
            const localRelativeX = localX - metrics.contentLeft
            const columnWidth = metrics.columnCount > 1 ? metrics.contentWidth / (metrics.columnCount - 1) : metrics.contentWidth
            const offsetNorm =
                (localRelativeX - (centerX - metrics.contentLeft)) / Math.max(1, columnWidth / 2)
            const depth =
                offsetNorm *
                resolvedPhysics.sensitivity *
                resolvedPhysics.pluckIntensity *
                resolvedPhysics.pointerReach *
                2 *
                motionScale

            const impulse = depth * resolvedPhysics.bendAmount * 0.08
            const spread = resolvedPhysics.spread

            const sims = simulationsRef.current
            if (col >= 0 && col < sims.length) {
                applyPluck(sims[col], clampedT, impulse, spread)
                pointerActiveRef.current = true
            }

            const bleed = interaction.performanceMode ? 0 : interaction.neighborBleed * motionScale
            if (bleed > 0) {
                if (col > 0) {
                    applyPluck(sims[col - 1], clampedT, impulse * bleed, spread)
                }
                if (col < sims.length - 1) {
                    applyPluck(sims[col + 1], clampedT, impulse * bleed, spread)
                }
            }
        },
        [interaction, resolvedPhysics, motionScale]
    )

    const handlePointerMove = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            if (!shouldSimulate) return
            applyPointerPluck(event.clientX, event.clientY)
        },
        [applyPointerPluck, shouldSimulate]
    )

    const handlePointerLeave = useCallback(() => {
        pointerActiveRef.current = false
    }, [])

    const handlePointerDown = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            if (!interaction.touchCapture || !shouldSimulate) return
            try {
                event.currentTarget.setPointerCapture(event.pointerId)
            } catch {
                // capture may fail on some browsers — safe to ignore
            }
            applyPointerPluck(event.clientX, event.clientY)
        },
        [applyPointerPluck, interaction.touchCapture, shouldSimulate]
    )

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (!shouldSimulate || !interaction.enabled) return
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                // Deterministic center pluck at mid-height (pointer gets full XY targeting)
                const centerCol = Math.floor(activeColumns / 2)
                const midT = 0.5
                const impulse =
                    resolvedPhysics.pluckIntensity *
                    resolvedPhysics.bendAmount *
                    0.08 *
                    motionScale
                const sims = simulationsRef.current
                if (centerCol >= 0 && centerCol < sims.length) {
                    applyPluck(sims[centerCol], midT, impulse, resolvedPhysics.spread)
                    pointerActiveRef.current = true
                }
            }
        },
        [shouldSimulate, interaction.enabled, activeColumns, resolvedPhysics, motionScale]
    )

    const showFocusRing = interaction.enabled && !isCanvas
    const focusRingColor = stroke.color || "#999999"

    return (
        <motion.div
            data-kern-kinetic-grid
            role="group"
            aria-label={ariaLabel}
            tabIndex={showFocusRing ? 0 : undefined}
            onKeyDown={handleKeyDown}
            style={{
                width: "100%",
                height: "100%",
                minWidth: 0,
                maxWidth: "none",
                alignSelf: "stretch",
                boxSizing: "border-box",
                padding: 0,
                minHeight: `clamp(320px, 40vh, ${layout.minHeight}px)`,
                background: rootBackground,
                overflowX: "hidden",
                overflowY: layout.clipBends ? "hidden" : "visible",
                position: "relative",
                outline: "none",
                ...style,
            }}
        >
            {showFocusRing ? (
                <style>{`
                    [data-kern-kinetic-grid]:focus-visible {
                        outline: 2px solid ${focusRingColor};
                        outline-offset: 4px;
                    }
                `}</style>
            ) : null}
            <motion.div
                ref={containerRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerDown={handlePointerDown}
                style={{
                    width: "100%",
                    height: "100%",
                    paddingRight: layout.paddingRight,
                    paddingLeft: layout.paddingLeft,
                    margin: 0,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    boxSizing: "border-box",
                    touchAction:
                        interaction.enabled && interaction.touchCapture
                            ? "none"
                            : "auto",
                    position: "relative",
                }}
            >
                {columnIndices.map((index) => (
                    <motion.div
                        key={`kinetic-col-${index}`}
                        initial={
                            canEntrance
                                ? { opacity: 0, y: 8, scale: 0.97 }
                                : false
                        }
                        animate={
                            !canEntrance
                                ? false
                                : entranceReady
                                  ? { opacity: 1, y: 0, scale: 1 }
                                  : { opacity: 0, y: 8, scale: 0.97 }
                        }
                        transition={{
                            delay:
                                canEntrance && entranceReady
                                    ? index * entrance.staggerDelay
                                    : 0,
                            ...ENTRANCE_SPRING,
                        }}
                        style={{
                            position: "relative",
                            width: 0,
                            height: "100%",
                            flex: "0 0 auto",
                            overflow: "visible",
                            padding: 0,
                            margin: 0,
                            pointerEvents: "none",
                        }}
                    >
                        <svg
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            aria-hidden
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: 100,
                                height: "100%",
                                transform: "translateX(-50%)",
                                overflow: "visible",
                                display: "block",
                            }}
                        >
                            <path
                                ref={(el) => {
                                    pathRefs.current[index] = el
                                }}
                                d={
                                    isCanvas || isThumbnail
                                        ? buildStaticVerticalPath(layout.linePadding)
                                        : buildVerticalPathD(
                                              simulationsRef.current[index] || createLineState(resolvedPhysics.segmentCount),
                                              layout.linePadding
                                          )
                                }
                                fill="none"
                                stroke={stroke.color}
                                strokeWidth={stroke.width}
                                strokeOpacity={stroke.opacity}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}

// ─── Property controls ─────────────────────────────────────────────────────

addPropertyControls(Kern_KineticLinesGrid, {
    layout: {
        type: ControlType.Object,
        title: "Layout",
        buttonTitle: "Grid Layout",
        icon: "object",
        controls: {
            columns: {
                type: ControlType.Number,
                title: "Columns",
                description: "Number of vertical lines displayed on desktop screens",
                defaultValue: 6,
                min: 1,
                max: MAX_COLUMNS,
                step: 1,
                displayStepper: true,
            },
            paddingLeft: {
                type: ControlType.Number,
                title: "Inset Left",
                description: "Moves the first line inside the component. Use parent frame padding for page-level spacing.",
                defaultValue: 0,
                min: 0,
                max: 200,
                step: 4,
                unit: "px",
            },
            paddingRight: {
                type: ControlType.Number,
                title: "Inset Right",
                description: "Moves the last line inside the component. Use parent frame padding for page-level spacing.",
                defaultValue: 0,
                min: 0,
                max: 200,
                step: 4,
                unit: "px",
            },
            columnsTablet: {
                type: ControlType.Number,
                title: "Columns (Tablet)",
                description: "Number of vertical lines displayed on tablet screens",
                defaultValue: 4,
                min: 1,
                max: 16,
                step: 1,
                displayStepper: true,
            },
            columnsMobile: {
                type: ControlType.Number,
                title: "Columns (Mobile)",
                description: "Number of vertical lines displayed on mobile screens",
                defaultValue: 3,
                min: 1,
                max: 8,
                step: 1,
                displayStepper: true,
            },
            minHeight: {
                type: ControlType.Number,
                title: "Min Height",
                description: "Minimum height of the component in pixels",
                defaultValue: 480,
                min: 120,
                max: 1200,
                step: 20,
                unit: "px",
            },
            linePadding: {
                type: ControlType.Number,
                title: "Line Padding",
                description: "Vertical padding at the top and bottom of each line",
                defaultValue: 0,
                min: 0,
                max: 40,
                step: 1,
                unit: "%",
            },
            clipBends: {
                type: ControlType.Boolean,
                title: "Clip Bends",
                description: "When off, lines can extend vertically beyond the component boundaries. When on, all motion is clipped inside.",
                defaultValue: false,
            },
        },
        defaultValue: {
            columns: 6,
            columnsTablet: 4,
            columnsMobile: 3,
            paddingLeft: 0,
            paddingRight: 0,
            minHeight: 480,
            linePadding: 0,
            clipBends: false,
        },
    },
    responsive: {
        type: ControlType.Object,
        title: "Responsive",
        buttonTitle: "Breakpoints",
        icon: "object",
        controls: {
            breakpointTablet: {
                type: ControlType.Number,
                title: "Tablet Max",
                description: "Maximum screen width for tablet layout in pixels",
                defaultValue: DEFAULT_RESPONSIVE.breakpointTablet,
                min: 480,
                max: 1200,
                step: 10,
                unit: "px",
            },
            breakpointMobile: {
                type: ControlType.Number,
                title: "Mobile Max",
                description: "Maximum screen width for mobile layout in pixels",
                defaultValue: DEFAULT_RESPONSIVE.breakpointMobile,
                min: 320,
                max: 600,
                step: 10,
                unit: "px",
            },
        },
        defaultValue: DEFAULT_RESPONSIVE,
    },
    stroke: {
        type: ControlType.Object,
        title: "Stroke",
        buttonTitle: "Line Style",
        icon: "effect",
        controls: {
            color: {
                type: ControlType.Color,
                title: "Color",
                description: "Color of the vertical lines",
                defaultValue: "#999999",
            },
            width: {
                type: ControlType.Number,
                title: "Width",
                description: "Thickness of the vertical lines in pixels",
                defaultValue: DEFAULT_STROKE.width,
                min: 0.5,
                max: 8,
                step: 0.5,
                unit: "px",
            },
            opacity: {
                type: ControlType.Number,
                title: "Opacity",
                description: "Transparency of the vertical lines (0 = invisible, 1 = solid)",
                defaultValue: DEFAULT_STROKE.opacity,
                min: 0,
                max: 1,
                step: 0.05,
            },
        },
        defaultValue: DEFAULT_STROKE,
    },
    physics: {
        type: ControlType.Object,
        title: "Physics",
        buttonTitle: "Physics",
        icon: "interaction",
        controls: {
            bendAmount: {
                type: ControlType.Number,
                title: "Bend Amount",
                description: "Maximum distance lines can bend from their resting position",
                defaultValue: DEFAULT_PHYSICS.bendAmount,
                min: 1,
                max: 20,
                step: 0.5,
            },
            pluckIntensity: {
                type: ControlType.Number,
                title: "Pluck Intensity",
                description: "Strength of the initial pluck when interacting with lines",
                defaultValue: DEFAULT_PHYSICS.pluckIntensity,
                min: 0.1,
                max: 2,
                step: 0.05,
            },
            pointerReach: {
                type: ControlType.Number,
                title: "Pointer Reach",
                description: "How far from the line center the pointer can trigger a pluck",
                defaultValue: DEFAULT_PHYSICS.pointerReach,
                min: 0.25,
                max: 2,
                step: 0.05,
            },
            tension: {
                type: ControlType.Number,
                title: "Tension",
                description: "Spring stiffness that pulls lines back to their resting position",
                defaultValue: DEFAULT_PHYSICS.tension,
                min: 40,
                max: 320,
                step: 5,
            },
            damping: {
                type: ControlType.Number,
                title: "Damping",
                description: "Friction that slows down line motion over time",
                defaultValue: DEFAULT_PHYSICS.damping,
                min: 4,
                max: 40,
                step: 1,
            },
            spread: {
                type: ControlType.Number,
                title: "Spread",
                description: "How much the pluck effect spreads vertically along the line",
                defaultValue: DEFAULT_PHYSICS.spread,
                min: 0.02,
                max: 0.25,
                step: 0.01,
            },
            sensitivity: {
                type: ControlType.Number,
                title: "Sensitivity",
                description: "Overall responsiveness to pointer movement",
                defaultValue: DEFAULT_PHYSICS.sensitivity,
                min: 0.25,
                max: 2,
                step: 0.05,
            },
            segmentCount: {
                type: ControlType.Number,
                title: "Segments",
                description: "Number of points along each line (higher = smoother curves)",
                defaultValue: DEFAULT_PHYSICS.segmentCount,
                min: SEGMENT_MIN,
                max: SEGMENT_MAX,
                step: 4,
            },
        },
        defaultValue: DEFAULT_PHYSICS,
    },
    interaction: {
        type: ControlType.Object,
        title: "Interaction",
        buttonTitle: "Interaction",
        icon: "interaction",
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Enabled",
                description: "Allows users to interact with and pluck the lines",
                defaultValue: DEFAULT_INTERACTION.enabled,
            },
            touchCapture: {
                type: ControlType.Boolean,
                title: "Touch Capture",
                description: "Captures touch input for smoother mobile interaction",
                defaultValue: DEFAULT_INTERACTION.touchCapture,
            },
            neighborBleed: {
                type: ControlType.Number,
                title: "Neighbor Bleed",
                description: "How much pluck effect spreads to adjacent lines (0 = none, 1 = full)",
                defaultValue: DEFAULT_INTERACTION.neighborBleed,
                min: 0,
                max: 1,
                step: 0.05,
                hidden: (p: { performanceMode: boolean }) => p.performanceMode,
            },
            performanceMode: {
                type: ControlType.Boolean,
                title: "Performance Mode",
                description: "Reduces segment count to 16 and disables neighbor bleed for better performance on lower-end devices",
                defaultValue: DEFAULT_INTERACTION.performanceMode,
            },
        },
        defaultValue: DEFAULT_INTERACTION,
    },
    background: {
        type: ControlType.Object,
        title: "Background",
        buttonTitle: "Background",
        icon: "color",
        controls: {
            mode: {
                type: ControlType.Enum,
                title: "Mode",
                description: "Background style for the component",
                options: ["solid", "transparent", "gradient"],
                optionTitles: ["Solid", "Transparent", "Gradient"],
                defaultValue: DEFAULT_BACKGROUND.mode,
                displaySegmentedControl: true,
            },
            solidColor: {
                type: ControlType.Color,
                title: "Solid",
                description: "Background color when mode is set to Solid",
                defaultValue: DEFAULT_BACKGROUND.solidColor,
                hidden: (p: { mode: string }) => p.mode !== "solid",
            },
            gradientStart: {
                type: ControlType.Color,
                title: "Gradient Start",
                description: "Starting color of the gradient background",
                defaultValue: DEFAULT_BACKGROUND.gradientStart,
                hidden: (p: { mode: string }) => p.mode !== "gradient",
            },
            gradientEnd: {
                type: ControlType.Color,
                title: "Gradient End",
                description: "Ending color of the gradient background",
                defaultValue: DEFAULT_BACKGROUND.gradientEnd,
                hidden: (p: { mode: string }) => p.mode !== "gradient",
            },
            gradientAngle: {
                type: ControlType.Number,
                title: "Gradient Angle",
                description: "Direction of the gradient in degrees (0 = up, 90 = right)",
                defaultValue: DEFAULT_BACKGROUND.gradientAngle,
                min: 0,
                max: 360,
                step: 15,
                unit: "deg",
                hidden: (p: { mode: string }) => p.mode !== "gradient",
            },
        },
        defaultValue: DEFAULT_BACKGROUND,
    },
    entrance: {
        type: ControlType.Object,
        title: "Entrance",
        optional: true,
        buttonTitle: "Entrance",
        icon: "effect",
        controls: {
            enabled: {
                type: ControlType.Boolean,
                title: "Stagger Fade",
                description: "Lines fade in one by one when the component enters the viewport",
                defaultValue: DEFAULT_ENTRANCE.enabled,
            },
            staggerDelay: {
                type: ControlType.Number,
                title: "Stagger Delay",
                description: "Time delay between each line's entrance animation",
                defaultValue: DEFAULT_ENTRANCE.staggerDelay,
                min: 0,
                max: 0.2,
                step: 0.01,
                unit: "s",
            },
        },
        defaultValue: DEFAULT_ENTRANCE,
    },
    ariaLabel: {
        type: ControlType.String,
        title: "ARIA Label",
        description:
            "Screen-reader name. Default mentions Enter/Space center pluck; pointer still targets any column.",
        defaultValue: DEFAULT_ARIA_LABEL,
        displayTextArea: false,
    },
})

Kern_KineticLinesGrid.displayName = "Kinetic Grid"
