import {
    forwardRef,
    useCallback,
    useLayoutEffect,
    useRef,
    type ComponentType,
    type CSSProperties,
} from "react"
import { RenderTarget, useIsStaticRenderer } from "framer"
import { motion, useReducedMotion } from "framer-motion"

type AnyProps = Record<string, unknown> & {
    style?: CSSProperties
}

const COAST = {
    power: 0.7,
    timeConstant: 480,
    bounceStiffness: 180,
    bounceDamping: 20,
    restDelta: 0.5,
}

function hugList(el: HTMLElement, depth: number) {
    if (depth > 1) return
    if (depth === 0) {
        el.style.setProperty("width", "max-content", "important")
        el.style.setProperty("min-width", "max-content", "important")
        el.style.setProperty("max-width", "none", "important")
        el.style.setProperty("display", "flex", "important")
        el.style.setProperty("flex-direction", "row", "important")
        el.style.setProperty("flex-wrap", "nowrap", "important")
        el.style.setProperty("overflow", "visible", "important")
        el.style.setProperty("overflow-x", "visible", "important")
    }
    if (depth === 1) {
        el.style.setProperty("flex-shrink", "0", "important")
    }
    for (const child of Array.from(el.children)) {
        if (child instanceof HTMLElement) hugList(child, depth + 1)
    }
}

function killNativeDrag(root: HTMLElement) {
    const nodes = root.querySelectorAll("img, a, picture, video")
    for (const node of Array.from(nodes)) {
        node.setAttribute("draggable", "false")
        if (node instanceof HTMLElement) {
            node.style.setProperty("-webkit-user-drag", "none")
        }
    }
}

/**
 * Pan-x the Sites/Stills strip. Inertia on throw, light rubber at the ends.
 * Canvas / Export / thumbnail freeze. Preview stays live.
 * Reduced motion: pan without coast.
 */
export function withDragStrip(
    Component: ComponentType<AnyProps>
): ComponentType<AnyProps> {
    return forwardRef<HTMLElement, AnyProps>(function DragStrip(props, ref) {
        const isStatic = useIsStaticRenderer()
        const target = RenderTarget.current()
        const freeze =
            (isStatic && target !== RenderTarget.preview) ||
            target === RenderTarget.canvas ||
            target === RenderTarget.export ||
            target === RenderTarget.thumbnail
        const reducedMotion = useReducedMotion()
        const clipRef = useRef<HTMLDivElement | null>(null)
        const trackRef = useRef<HTMLDivElement | null>(null)

        const setClip = useCallback(
            (node: HTMLDivElement | null) => {
                clipRef.current = node
                if (node) node.dataset.sillCursor = "drag"
                if (typeof ref === "function") ref(node)
                else if (ref)
                    (ref as { current: HTMLElement | null }).current = node
            },
            [ref]
        )

        useLayoutEffect(() => {
            const track = trackRef.current
            if (!track) return

            const prep = () => {
                const inner = track.firstElementChild
                if (inner instanceof HTMLElement) hugList(inner, 0)
                killNativeDrag(track)
            }

            prep()
            const raf = requestAnimationFrame(prep)
            const ro = new ResizeObserver(prep)
            ro.observe(track)
            if (track.firstElementChild instanceof HTMLElement) {
                ro.observe(track.firstElementChild)
            }
            const mo = new MutationObserver(prep)
            mo.observe(track, { childList: true, subtree: true })
            return () => {
                cancelAnimationFrame(raf)
                ro.disconnect()
                mo.disconnect()
            }
        }, [])

        const elastic = freeze || reducedMotion ? 0 : 0.16

        return (
            <div
                ref={setClip}
                style={{
                    ...props.style,
                    overflow: "hidden",
                    overflowX: "hidden",
                    overflowY: "hidden",
                    width: "100%",
                    maxWidth: "100%",
                    position: "relative",
                    touchAction: "pan-y",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                }}
            >
                <motion.div
                    ref={trackRef}
                    drag={freeze ? false : "x"}
                    dragPropagation
                    dragConstraints={clipRef}
                    dragElastic={elastic}
                    dragMomentum={!freeze && !reducedMotion}
                    dragTransition={COAST}
                    style={{
                        display: "flex",
                        width: "max-content",
                        maxWidth: "none",
                        touchAction: "pan-y",
                        cursor: freeze ? undefined : "grab",
                    }}
                    whileTap={freeze ? undefined : { cursor: "grabbing" }}
                >
                    <Component
                        {...props}
                        style={{
                            ...props.style,
                            overflow: "visible",
                            overflowX: "visible",
                            overflowY: "visible",
                            width: "max-content",
                            maxWidth: "none",
                            userSelect: "none",
                        }}
                    />
                </motion.div>
            </div>
        )
    })
}
