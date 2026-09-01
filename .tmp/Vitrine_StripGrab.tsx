import {
    addPropertyControls,
    ControlType,
    RenderTarget,
    useIsStaticRenderer,
} from "framer"
import { animate } from "framer-motion"
import {
    forwardRef,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ComponentType,
    type CSSProperties,
    type MouseEvent,
    type PointerEvent,
} from "react"

const DRAG_THRESHOLD = 6
const DEFAULT_DURATION = 2
const DEFAULT_DECAY = 0.14
const LIVE_DURATION = 0.28
const LIVE_DECAY_CAP = 0.08

type EaseName = "power2" | "power3" | "power4"
type ChaseKind = "live" | "coast"

const CONTROL_KEYS = [
    "duration",
    "decay",
    "ease",
    "infinite",
    "loop",
    "$control__duration",
    "$control__decay",
    "$control__ease",
    "$control__infinite",
    "$control__loop",
] as const

function prefersReducedMotion() {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function isHorizontalStrip(node: HTMLElement) {
    const dir = getComputedStyle(node).flexDirection
    return dir === "row" || dir === "row-reverse"
}

function stills(node: HTMLElement): HTMLElement[] {
    let parent = node
    for (let depth = 0; depth < 5; depth++) {
        const kids = Array.from(parent.children).filter(
            (child): child is HTMLElement => child instanceof HTMLElement
        )
        if (kids.length > 1) return kids
        if (kids.length === 1) {
            parent = kids[0]
            continue
        }
        break
    }
    return Array.from(node.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement
    )
}

function stillsRight(node: HTMLElement) {
    const items = stills(node)
    if (items.length === 0) return node.scrollWidth
    let right = 0
    for (const item of items) {
        right = Math.max(right, item.offsetLeft + item.offsetWidth)
    }
    const parent = items[0].parentElement
    if (parent && parent !== node) right += parent.offsetLeft
    return right
}

function paddingLeft(node: HTMLElement) {
    const n = Number.parseFloat(getComputedStyle(node).paddingLeft)
    return Number.isFinite(n) ? n : 0
}

function maxX(node: HTMLElement) {
    return Math.min(0, node.clientWidth - stillsRight(node) - paddingLeft(node))
}

function easeOutPower(power: number) {
    return (t: number) => {
        const u = 1 - Math.min(1, Math.max(0, t))
        return 1 - u ** power
    }
}

function easeFrom(name: unknown) {
    const key: EaseName =
        name === "power2" || name === "power4" || name === "power3"
            ? name
            : "power3"
    switch (key) {
        case "power2":
            return easeOutPower(2)
        case "power3":
            return easeOutPower(3)
        case "power4":
            return easeOutPower(4)
        default: {
            const _exhaustive: never = key
            void _exhaustive
            return easeOutPower(3)
        }
    }
}

function readNum(
    props: Record<string, unknown>,
    key: "duration" | "decay",
    fallback: number
) {
    const raw = props[`$control__${key}`] ?? props[key]
    const n = typeof raw === "number" ? raw : Number(raw)
    return Number.isFinite(n) ? n : fallback
}

function readEase(props: Record<string, unknown>): EaseName {
    const raw = String(props.$control__ease ?? props.ease ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
    if (raw === "power2" || raw === "soft" || raw === "2") return "power2"
    if (raw === "power4" || raw === "heavy" || raw === "4") return "power4"
    if (raw === "power3" || raw === "medium" || raw === "3") return "power3"
    return "power3"
}

function clampX(node: HTMLElement, next: number) {
    const limit = maxX(node)
    return Math.max(limit, Math.min(0, next))
}

function writeItem(node: HTMLElement, x: number) {
    node.style.transform = x === 0 ? "none" : `translate3d(${x}px, 0, 0)`
    node.style.willChange = "transform"
}

function omitControls(props: Record<string, unknown>) {
    const rest = { ...props }
    for (const key of CONTROL_KEYS) delete rest[key]
    return rest
}

type StripMotion = {
    duration: number
    decay: number
    ease: EaseName
}

function motionFromProps(props: Record<string, unknown>): StripMotion {
    return {
        duration: Math.max(
            0.4,
            Math.min(8, readNum(props, "duration", DEFAULT_DURATION))
        ),
        decay: Math.max(
            0,
            Math.min(0.8, readNum(props, "decay", DEFAULT_DECAY))
        ),
        ease: readEase(props),
    }
}

let publishedStrip: StripMotion | null = null
const stripListeners = new Set<() => void>()

function publishStrip(next: StripMotion | null) {
    publishedStrip = next
    stripListeners.forEach((fn) => fn())
}

function useStripMotion(fallback: StripMotion): StripMotion {
    const [, setTick] = useState(0)
    useLayoutEffect(() => {
        const sync = () => setTick((n) => n + 1)
        stripListeners.add(sync)
        return () => {
            stripListeners.delete(sync)
        }
    }, [])
    return publishedStrip ?? fallback
}

export function withStripGrab(
    Component: ComponentType<Record<string, unknown>>
): ComponentType<Record<string, unknown>> {
    return forwardRef(function StripGrabOverride(
        props: Record<string, unknown>,
        ref
    ) {
        const isStatic = useIsStaticRenderer()
        const fallback = motionFromProps(props)
        const { duration, decay, ease: easeName } = useStripMotion(fallback)
        const motionRef = useRef({
            duration,
            decay,
            ease: easeFrom(easeName),
        })
        motionRef.current = {
            duration,
            decay,
            ease: easeFrom(easeName),
        }
        const nodeRef = useRef<HTMLElement | null>(null)
        const targetRef = useRef(0)
        const itemXRef = useRef<number[]>([])
        const playbackRef = useRef<Array<{ stop: () => void } | null>>([])
        const dragRef = useRef({
            active: false,
            startPointer: 0,
            startTarget: 0,
            moved: false,
            pointerId: -1,
        })
        const suppressClickRef = useRef(false)

        const setRefs = useCallback(
            (node: HTMLElement | null) => {
                nodeRef.current = node
                if (typeof ref === "function") ref(node)
                else if (ref)
                    (ref as { current: HTMLElement | null }).current = node
            },
            [ref]
        )

        const stopAll = useCallback(() => {
            for (const play of playbackRef.current) play?.stop()
            playbackRef.current = []
        }, [])

        const paint = useCallback((to: number) => {
            const node = nodeRef.current
            if (!node) return
            const items = stills(node)
            if (itemXRef.current.length !== items.length) {
                itemXRef.current = items.map((_, i) => itemXRef.current[i] ?? 0)
            }
            for (let i = 0; i < items.length; i++) {
                itemXRef.current[i] = to
                writeItem(items[i], to)
            }
        }, [])

        const chase = useCallback(
            (next: number, kind: ChaseKind = "coast") => {
                const node = nodeRef.current
                if (!node || isStatic) return
                const to = clampX(node, next)
                targetRef.current = to
                const items = stills(node)
                if (itemXRef.current.length !== items.length) {
                    itemXRef.current = items.map(
                        (_, i) => itemXRef.current[i] ?? 0
                    )
                }
                const motion = motionRef.current
                let duration = motion.duration
                let decay = motion.decay
                switch (kind) {
                    case "live":
                        duration = LIVE_DURATION
                        decay = Math.min(LIVE_DECAY_CAP, motion.decay)
                        break
                    case "coast":
                        duration = motion.duration
                        decay = motion.decay
                        break
                    default: {
                        const _exhaustive: never = kind
                        void _exhaustive
                        duration = motion.duration
                        decay = motion.decay
                    }
                }
                if (prefersReducedMotion()) {
                    stopAll()
                    paint(to)
                    return
                }
                while (playbackRef.current.length < items.length) {
                    playbackRef.current.push(null)
                }
                for (let i = 0; i < items.length; i++) {
                    const from = itemXRef.current[i] ?? 0
                    if (Math.abs(to - from) < 0.1) continue
                    playbackRef.current[i]?.stop()
                    const index = i
                    playbackRef.current[index] = animate(from, to, {
                        duration: duration + index * decay,
                        ease: motion.ease,
                        onUpdate(value) {
                            const el = nodeRef.current
                            if (!el) return
                            const row = stills(el)
                            const item = row[index]
                            if (!item) return
                            itemXRef.current[index] = value
                            writeItem(item, value)
                        },
                        onComplete() {
                            playbackRef.current[index] = null
                        },
                    })
                }
            },
            [isStatic, paint, stopAll]
        )

        useEffect(() => {
            return () => {
                stopAll()
                const node = nodeRef.current
                if (!node) return
                for (const item of stills(node)) {
                    item.style.transform = "none"
                    item.style.willChange = ""
                }
            }
        }, [stopAll])

        const moveDrag = useCallback(
            (clientX: number) => {
                const drag = dragRef.current
                if (!drag.active) return false
                const node = nodeRef.current
                if (!node) return false
                const dx = clientX - drag.startPointer
                if (!drag.moved && Math.abs(dx) < DRAG_THRESHOLD) return false
                drag.moved = true
                chase(drag.startTarget + dx, "live")
                return true
            },
            [chase]
        )

        const endDrag = useCallback((pointerId: number) => {
            const drag = dragRef.current
            if (!drag.active) return
            if (drag.pointerId !== -1 && drag.pointerId !== pointerId) return
            const node = nodeRef.current
            if (node && drag.pointerId !== -1) {
                try {
                    node.releasePointerCapture(drag.pointerId)
                } catch {
                    // already released
                }
            }
            if (drag.moved) suppressClickRef.current = true
            drag.active = false
            drag.moved = false
            drag.pointerId = -1
        }, [])

        const onPointerDown = useCallback(
            (event: PointerEvent<HTMLElement>) => {
                if (isStatic) return
                if (event.button !== 0) return
                const node = nodeRef.current
                if (!node || !isHorizontalStrip(node) || maxX(node) >= 0) return
                dragRef.current = {
                    active: true,
                    startPointer: event.clientX,
                    startTarget: targetRef.current,
                    moved: false,
                    pointerId: event.pointerId,
                }
                node.setPointerCapture(event.pointerId)
            },
            [isStatic]
        )

        const onPointerMove = useCallback(
            (event: PointerEvent<HTMLElement>) => {
                if (!moveDrag(event.clientX)) return
                event.preventDefault()
            },
            [moveDrag]
        )

        const onPointerUp = useCallback(
            (event: PointerEvent<HTMLElement>) => {
                endDrag(event.pointerId)
            },
            [endDrag]
        )

        const onClickCapture = useCallback((event: MouseEvent<HTMLElement>) => {
            if (!suppressClickRef.current) return
            event.preventDefault()
            event.stopPropagation()
            suppressClickRef.current = false
        }, [])

        useEffect(() => {
            const node = nodeRef.current
            if (!node || isStatic) return
            if (!isHorizontalStrip(node)) return
            node.style.overflow = "visible"
            node.style.transform = "none"
            node.style.touchAction = "none"

            const onWheel = (event: WheelEvent) => {
                const el = nodeRef.current
                if (!el || dragRef.current.active) return
                if (maxX(el) >= 0) return
                const dx = event.deltaX
                const dy = event.deltaY
                if (dx === 0 && dy === 0) return
                const delta = Math.abs(dx) >= Math.abs(dy) ? dx : dy
                event.preventDefault()
                chase(targetRef.current - delta)
            }

            const onDragStart = (event: DragEvent) => {
                event.preventDefault()
            }

            const onWindowMove = (event: globalThis.PointerEvent) => {
                if (!dragRef.current.active) return
                if (
                    dragRef.current.pointerId !== -1 &&
                    event.pointerId !== dragRef.current.pointerId
                ) {
                    return
                }
                if (moveDrag(event.clientX)) event.preventDefault()
            }

            const onWindowUp = (event: globalThis.PointerEvent) => {
                endDrag(event.pointerId)
            }

            window.addEventListener("wheel", onWheel, { passive: false })
            window.addEventListener("pointermove", onWindowMove, {
                passive: false,
            })
            window.addEventListener("pointerup", onWindowUp)
            window.addEventListener("pointercancel", onWindowUp)
            node.addEventListener("dragstart", onDragStart)
            return () => {
                window.removeEventListener("wheel", onWheel)
                window.removeEventListener("pointermove", onWindowMove)
                window.removeEventListener("pointerup", onWindowUp)
                window.removeEventListener("pointercancel", onWindowUp)
                node.removeEventListener("dragstart", onDragStart)
            }
        }, [isStatic, chase, moveDrag, endDrag])

        const rest = omitControls(props)
        const style = {
            ...((rest.style as object) || {}),
            userSelect: "none" as const,
            WebkitUserDrag: "none",
        }

        return (
            <Component
                {...rest}
                ref={setRefs}
                style={style}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClickCapture={onClickCapture}
            />
        )
    })
}

const DESIGN_WIDTH = 1440

export function withPieceScale(
    Component: ComponentType<Record<string, unknown>>
): ComponentType<Record<string, unknown>> {
    return forwardRef(function PieceScaleOverride(
        props: Record<string, unknown>,
        ref
    ) {
        const isStatic = useIsStaticRenderer()
        const nodeRef = useRef<HTMLElement | null>(null)
        const designRef = useRef<{ w: number; h: number } | null>(null)

        const setRefs = useCallback(
            (node: HTMLElement | null) => {
                nodeRef.current = node
                if (typeof ref === "function") ref(node)
                else if (ref)
                    (ref as { current: HTMLElement | null }).current = node
            },
            [ref]
        )

        const apply = useCallback(() => {
            const node = nodeRef.current
            if (!node || isStatic) return
            if (typeof window === "undefined") return
            const card = node.firstElementChild
            const clear = () => {
                node.style.width = ""
                node.style.height = ""
                if (card instanceof HTMLElement) {
                    card.style.transform = ""
                    card.style.transformOrigin = ""
                }
            }
            const vw = window.innerWidth
            if (vw <= DESIGN_WIDTH) {
                clear()
                designRef.current = null
                return
            }
            if (!designRef.current) {
                clear()
                const w = node.offsetWidth
                const h = node.offsetHeight
                if (w < 8 || h < 8) return
                designRef.current = { w, h }
            }
            const s = vw / DESIGN_WIDTH
            const { w, h } = designRef.current
            node.style.width = `${w * s}px`
            node.style.height = `${h * s}px`
            if (card instanceof HTMLElement) {
                card.style.transformOrigin = "0 0"
                card.style.transform = `scale(${s})`
            }
        }, [isStatic])

        useLayoutEffect(() => {
            apply()
            if (isStatic || typeof window === "undefined") return
            window.addEventListener("resize", apply)
            return () => {
                window.removeEventListener("resize", apply)
                const node = nodeRef.current
                if (!node) return
                node.style.width = ""
                node.style.height = ""
                const card = node.firstElementChild
                if (card instanceof HTMLElement) {
                    card.style.transform = ""
                    card.style.transformOrigin = ""
                }
            }
        }, [apply, isStatic])

        return <Component {...props} ref={setRefs} />
    })
}

interface StripGrabProps {
    duration?: number
    decay?: number
    ease?: EaseName | string
    style?: CSSProperties
}

/**
 * Canvas host for the Piece List pan. Select this layer — not the Collection
 * List — to edit Duration, Decay, and Ease. Empty on the published site.
 *
 * @framerIntrinsicWidth 168
 * @framerIntrinsicHeight 36
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function StripGrab(props: StripGrabProps) {
    const onCanvas = RenderTarget.current() === RenderTarget.canvas
    const motion = motionFromProps(props as Record<string, unknown>)

    useLayoutEffect(() => {
        publishStrip(motion)
        return () => {
            publishStrip(null)
        }
    }, [motion.duration, motion.decay, motion.ease])

    return (
        <div
            aria-hidden
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                pointerEvents: onCanvas ? "auto" : "none",
                overflow: "hidden",
                ...props.style,
            }}
        >
            {onCanvas ? (
                <div
                    style={{
                        boxSizing: "border-box",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        gap: 2,
                        padding: "0 10px",
                        border: "1px solid rgba(247, 246, 242, 0.22)",
                        backgroundColor: "rgba(10, 10, 10, 0.72)",
                        fontFamily: "Geist Mono, ui-monospace, monospace",
                        color: "rgb(247, 246, 242)",
                    }}
                >
                    <span
                        style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.16em",
                            lineHeight: 1,
                        }}
                    >
                        STRIP GRAB
                    </span>
                    <span
                        style={{
                            fontSize: 8,
                            fontWeight: 500,
                            letterSpacing: "0.08em",
                            lineHeight: 1,
                            opacity: 0.55,
                        }}
                    >
                        Pan · this layer
                    </span>
                </div>
            ) : null}
        </div>
    )
}

StripGrab.displayName = "StripGrab"

StripGrab.defaultProps = {
    duration: DEFAULT_DURATION,
    decay: DEFAULT_DECAY,
    ease: "power2",
}

addPropertyControls(StripGrab, {
    duration: {
        type: ControlType.Number,
        title: "Duration",
        min: 0.4,
        max: 8,
        step: 0.1,
        unit: "s",
        displayStepper: true,
        defaultValue: DEFAULT_DURATION,
        description:
            "Select **this** layer — not the Collection List. The list needs the `withStripGrab` override.\n\nSeconds for a still to catch up after you let go or scroll. Longer = more viscous.",
    },
    decay: {
        type: ControlType.Number,
        title: "Decay",
        min: 0,
        max: 0.8,
        step: 0.05,
        unit: "s",
        displayStepper: true,
        defaultValue: DEFAULT_DECAY,
        description:
            "Extra seconds of lag per still. `0` keeps gaps locked. Higher opens and closes gaps as the rail moves.",
    },
    ease: {
        type: ControlType.Enum,
        title: "Ease",
        options: ["power2", "power3", "power4"],
        optionTitles: ["Soft", "Medium", "Heavy"],
        defaultValue: "power2",
        displaySegmentedControl: true,
        segmentedControlDirection: "vertical",
        description:
            "Catch-up curve after you let go. Soft settles sooner; Heavy trails longer.",
    },
})
