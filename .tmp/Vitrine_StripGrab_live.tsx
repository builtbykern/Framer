import { useIsStaticRenderer } from "framer"
import {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    useState,
    type ComponentType,
    type MouseEvent,
    type PointerEvent,
} from "react"

const DRAG_THRESHOLD = 6
const FRICTION = 0.92
const STOP_VELOCITY = 0.45
const MAX_VELOCITY = 80

function isPanable(node: HTMLElement) {
    return node.scrollWidth > node.clientWidth + 8
}

function prefersReducedMotion() {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function clampScroll(node: HTMLElement, next: number) {
    const max = Math.max(0, node.scrollWidth - node.clientWidth)
    node.scrollLeft = Math.max(0, Math.min(max, next))
}

export function withStripGrab(
    Component: ComponentType<Record<string, unknown>>
): ComponentType<Record<string, unknown>> {
    return forwardRef(function StripGrabOverride(props: Record<string, unknown>, ref) {
        const isStatic = useIsStaticRenderer()
        const nodeRef = useRef<HTMLElement | null>(null)
        const dragRef = useRef({
            active: false,
            startX: 0,
            lastX: 0,
            lastT: 0,
            velocity: 0,
            startScroll: 0,
            moved: false,
            pointerId: -1,
        })
        const suppressClickRef = useRef(false)
        const coastRafRef = useRef(0)
        const [dragging, setDragging] = useState(false)
        const [panable, setPanable] = useState(false)

        const setRefs = useCallback(
            (node: HTMLElement | null) => {
                nodeRef.current = node
                if (typeof ref === "function") ref(node)
                else if (ref) (ref as { current: HTMLElement | null }).current = node
            },
            [ref]
        )

        const stopCoast = useCallback(() => {
            if (coastRafRef.current) {
                cancelAnimationFrame(coastRafRef.current)
                coastRafRef.current = 0
            }
        }, [])

        const startCoast = useCallback(
            (initial: number) => {
                const node = nodeRef.current
                if (!node || isStatic || prefersReducedMotion()) return
                stopCoast()
                let velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, initial))
                const tick = () => {
                    const el = nodeRef.current
                    if (!el) {
                        coastRafRef.current = 0
                        return
                    }
                    velocity *= FRICTION
                    if (Math.abs(velocity) < STOP_VELOCITY) {
                        coastRafRef.current = 0
                        return
                    }
                    clampScroll(el, el.scrollLeft + velocity)
                    const max = Math.max(0, el.scrollWidth - el.clientWidth)
                    if (el.scrollLeft <= 0 || el.scrollLeft >= max) {
                        coastRafRef.current = 0
                        return
                    }
                    coastRafRef.current = requestAnimationFrame(tick)
                }
                coastRafRef.current = requestAnimationFrame(tick)
            },
            [isStatic, stopCoast]
        )

        useEffect(() => {
            const node = nodeRef.current
            if (!node || isStatic) return
            const measure = () => setPanable(isPanable(node))
            measure()
            const observer = new ResizeObserver(measure)
            observer.observe(node)
            return () => observer.disconnect()
        }, [isStatic])

        useEffect(() => stopCoast, [stopCoast])

        const canGrab = !isStatic && panable

        const onPointerDown = useCallback(
            (event: PointerEvent<HTMLElement>) => {
                if (!canGrab) return
                if (event.pointerType === "touch") return
                if (event.button !== 0) return
                const node = nodeRef.current
                if (!node) return
                stopCoast()
                const now = performance.now()
                dragRef.current = {
                    active: true,
                    startX: event.clientX,
                    lastX: event.clientX,
                    lastT: now,
                    velocity: 0,
                    startScroll: node.scrollLeft,
                    moved: false,
                    pointerId: event.pointerId,
                }
                node.setPointerCapture(event.pointerId)
            },
            [canGrab, stopCoast]
        )

        const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
            const drag = dragRef.current
            if (!drag.active) return
            const node = nodeRef.current
            if (!node) return
            const dx = event.clientX - drag.startX
            if (!drag.moved && Math.abs(dx) < DRAG_THRESHOLD) return
            drag.moved = true
            event.preventDefault()
            const now = performance.now()
            const frameDx = event.clientX - drag.lastX
            const dt = Math.max(8, now - drag.lastT)
            drag.velocity = (-frameDx / dt) * 16.67
            drag.lastX = event.clientX
            drag.lastT = now
            clampScroll(node, drag.startScroll - dx)
            setDragging(true)
        }, [])

        const endDrag = useCallback(
            (event: PointerEvent<HTMLElement>) => {
                const drag = dragRef.current
                if (!drag.active) return
                const node = nodeRef.current
                if (node && drag.pointerId === event.pointerId) {
                    try {
                        node.releasePointerCapture(event.pointerId)
                    } catch {
                        // already released
                    }
                }
                if (drag.moved) {
                    suppressClickRef.current = true
                    startCoast(drag.velocity)
                }
                drag.active = false
                drag.moved = false
                drag.pointerId = -1
                drag.velocity = 0
                setDragging(false)
            },
            [startCoast]
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
            const onWheel = (event: WheelEvent) => {
                if (!isPanable(node)) return
                const dx = event.deltaX
                const dy = event.deltaY
                if (dx === 0 && dy === 0) return
                if (Math.abs(dx) >= Math.abs(dy)) return
                event.preventDefault()
                stopCoast()
                clampScroll(node, node.scrollLeft + dy)
            }
            const onDragStart = (event: DragEvent) => {
                event.preventDefault()
            }
            node.addEventListener("wheel", onWheel, { passive: false })
            node.addEventListener("dragstart", onDragStart)
            return () => {
                node.removeEventListener("wheel", onWheel)
                node.removeEventListener("dragstart", onDragStart)
            }
        }, [isStatic, stopCoast])

        const style = {
            ...((props.style as object) || {}),
            userSelect: dragging ? "none" : undefined,
            touchAction: canGrab ? "pan-x" : undefined,
            overscrollBehaviorX: canGrab ? "contain" : undefined,
            WebkitUserDrag: "none",
        }

        return (
            <Component
                {...props}
                ref={setRefs}
                style={style}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onClickCapture={onClickCapture}
            />
        )
    })
}
