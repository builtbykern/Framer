// @framerDisableUnlink
// @framerSupportedLayoutWidth: any
// @framerSupportedLayoutHeight: any
// @framerIntrinsicWidth: 640
// @framerIntrinsicHeight: 320

import {
    addPropertyControls,
    ControlType,
    useIsOnFramerCanvas,
    useIsStaticRenderer,
} from "framer"
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"

interface ImageValue {
    src: string
    srcSet?: string
    alt?: string
}

interface Props {
    image: ImageValue | string
    imageB: ImageValue | string
    imageC: ImageValue | string
    intervalMs: number
    /** Framer panel alias when title is "Cycle Ms" */
    cycleMs?: number
    zoom: number
    hoverZoom?: number
    showView: boolean
    showVIEW?: boolean
    viewLabel: string
    vIEWLabel?: string
    accent: string
    style?: CSSProperties
}

function resolveSrc(value: ImageValue | string | undefined | null): string {
    if (!value) return ""
    if (typeof value === "string") return value
    return value.src || ""
}

function resolveAlt(value: ImageValue | string | undefined | null, fallback: string): string {
    if (!value || typeof value === "string") return fallback
    return value.alt || fallback
}

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)"
const META = '"Space Mono", ui-monospace, monospace'

/**
 * Territory directory media: image-led plane with hover zoom + gallery cycle.
 * On pointer leave, index resets to the original (primary) image.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function Arbour_TerritoryHoverMedia(props: Partial<Props>) {
    const intervalMs = Number(props.intervalMs ?? props.cycleMs ?? 900)
    const zoom = Number(props.zoom ?? props.hoverZoom ?? 1.04)
    const showView = props.showView ?? props.showVIEW ?? true
    const viewLabel = props.viewLabel ?? props.vIEWLabel ?? "VIEW →"
    const accent =
        typeof props.accent === "string" && props.accent ? props.accent : "#DBE64C"
    const { image, imageB, imageC, style } = props

    const isStatic = useIsStaticRenderer()
    const onCanvas = useIsOnFramerCanvas()
    const reduceMotion = usePrefersReducedMotion()

    const sources = useMemo(() => {
        const list = [resolveSrc(image), resolveSrc(imageB), resolveSrc(imageC)].filter(Boolean)
        return list.length ? list : [resolveSrc(image)].filter(Boolean)
    }, [image, imageB, imageC])

    const alt = resolveAlt(image, "Territory")
    const [index, setIndex] = useState(0)
    const [hovering, setHovering] = useState(false)
    const timerRef = useRef<number | null>(null)

    const canCycle =
        !isStatic && !onCanvas && !reduceMotion && sources.length > 1 && hovering

    useEffect(() => {
        if (!canCycle) {
            if (timerRef.current != null) {
                window.clearInterval(timerRef.current)
                timerRef.current = null
            }
            return
        }
        const ms = Math.max(400, Math.min(4000, intervalMs || 900))
        // Advance once shortly after enter, then keep cycling.
        const first = window.setTimeout(() => {
            setIndex((i) => (i + 1) % sources.length)
        }, Math.min(450, ms))
        timerRef.current = window.setInterval(() => {
            setIndex((i) => (i + 1) % sources.length)
        }, ms)
        return () => {
            window.clearTimeout(first)
            if (timerRef.current != null) {
                window.clearInterval(timerRef.current)
                timerRef.current = null
            }
        }
    }, [canCycle, intervalMs, sources.length])

    function onEnter() {
        if (isStatic || reduceMotion) return
        setHovering(true)
    }

    function onLeave() {
        setHovering(false)
        setIndex(0)
        if (timerRef.current != null) {
            window.clearInterval(timerRef.current)
            timerRef.current = null
        }
    }

    const activeSrc = sources[Math.min(index, Math.max(0, sources.length - 1))] || ""
    const scale = hovering && !isStatic && !reduceMotion ? zoom : 1

    return (
        <div
            className="arbour-thm"
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                backgroundColor: "rgb(28, 27, 22)",
                ...style,
            }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
        >
            <style>{`
                .arbour-thm__img {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transform-origin: center center;
                    will-change: transform, opacity;
                    transition:
                        transform 0.22s ${EASE},
                        opacity 0.35s ${EASE};
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                }
                .arbour-thm__view {
                    position: absolute;
                    left: 16px;
                    bottom: 16px;
                    z-index: 2;
                    margin: 0;
                    padding: 8px 12px;
                    border: 0;
                    border-radius: 0;
                    background: rgba(28, 27, 22, 0.72);
                    color: ${accent};
                    font-family: ${META};
                    font-size: 11px;
                    letter-spacing: 0.06em;
                    line-height: 1;
                    text-transform: uppercase;
                    pointer-events: none;
                }
                @media (prefers-reduced-motion: reduce) {
                    .arbour-thm__img {
                        transition: none !important;
                        transform: none !important;
                    }
                }
            `}</style>
            {sources.map((src, i) => (
                <img
                    key={src + i}
                    className="arbour-thm__img"
                    src={src}
                    alt={i === 0 ? alt : ""}
                    decoding="async"
                    draggable={false}
                    style={{
                        opacity: i === index ? 1 : 0,
                        transform: `scale(${i === index ? scale : 1})`,
                        zIndex: i === index ? 1 : 0,
                    }}
                />
            ))}
            {!activeSrc ? (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgb(28,27,22)",
                    }}
                />
            ) : null}
            {showView ? <p className="arbour-thm__view">{viewLabel}</p> : null}
        </div>
    )
}

function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false)
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        const update = () => setReduced(Boolean(mq.matches))
        update()
        mq.addEventListener?.("change", update)
        return () => mq.removeEventListener?.("change", update)
    }, [])
    return reduced
}

Arbour_TerritoryHoverMedia.defaultProps = {
    intervalMs: 900,
    zoom: 1.04,
    showView: true,
    viewLabel: "VIEW →",
    accent: "#DBE64C",
    image: {
        src: "https://framerusercontent.com/images/LbYhvKzwEJNib5o77SBnb59y0.jpg",
        alt: "Territory",
    },
    imageB: { src: "", alt: "" },
    imageC: { src: "", alt: "" },
}

addPropertyControls(Arbour_TerritoryHoverMedia, {
    image: {
        type: ControlType.ResponsiveImage,
        title: "Image",
    },
    imageB: {
        type: ControlType.ResponsiveImage,
        title: "Image B",
    },
    imageC: {
        type: ControlType.ResponsiveImage,
        title: "Image C",
    },
    intervalMs: {
        type: ControlType.Number,
        title: "Interval",
        min: 400,
        max: 4000,
        step: 50,
        defaultValue: 900,
    },
    zoom: {
        type: ControlType.Number,
        title: "Zoom",
        min: 1,
        max: 1.12,
        step: 0.01,
        defaultValue: 1.04,
    },
    showView: {
        type: ControlType.Boolean,
        title: "Show View",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    viewLabel: {
        type: ControlType.String,
        title: "View Label",
        defaultValue: "VIEW →",
    },
    accent: {
        type: ControlType.Color,
        title: "Accent",
        defaultValue: "#DBE64C",
    },
})
