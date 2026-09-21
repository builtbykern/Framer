// @framerDisableUnlink
import {
    addPropertyControls,
    ControlType,
    RenderTarget,
    useIsStaticRenderer,
} from "framer"
import { createPortal } from "react-dom"
import { useEffect, useState, type CSSProperties } from "react"
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "framer-motion"

interface SillHomeCursorProps {
    enabled: boolean
    restSize?: number
    hotSize?: number
    ringColor?: string
    labelColor?: string
    stroke: number
    viewLabel?: string
    dragLabel?: string
    rest?: number
    hot?: number
    ring?: string
    label?: string
    vIEW?: string
    dRAG?: string
    style?: CSSProperties
}

type Zone = "drag" | "view" | "rest"

const DEFAULT_FONT: CSSProperties = {
    fontFamily: '"Clash Grotesk", sans-serif',
    fontSize: "15px",
    letterSpacing: "0em",
    lineHeight: "1em",
}

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n))
}

function zoneFrom(target: EventTarget | null): Zone {
    if (!(target instanceof Element)) return "rest"
    if (target.closest("[data-sill-cursor='view']")) return "view"
    if (target.closest("[data-sill-cursor='drag']")) return "drag"
    return "rest"
}

function labelFor(zone: Zone, viewLabel: string, dragLabel: string): string {
    switch (zone) {
        case "view":
            return viewLabel
        case "drag":
            return dragLabel
        case "rest":
            return ""
        default: {
            const exhaustive: never = zone
            return exhaustive
        }
    }
}

/**
 * Page cursor: rest ring, VIEW on Templates rows, DRAG on strips.
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function SillHomeCursor(props: SillHomeCursorProps) {
    const {
        enabled = true,
        restSize,
        hotSize,
        ringColor,
        labelColor,
        stroke = 1.5,
        viewLabel,
        dragLabel,
        rest: restRemap,
        hot: hotRemap,
        ring: ringRemap,
        label,
        vIEW,
        dRAG,
        style,
    } = props

    const restPx = clamp(Number(restSize ?? restRemap ?? 24), 12, 40)
    const hotPx = clamp(Number(hotSize ?? hotRemap ?? 48), 28, 80)
    const sw = clamp(stroke, 1, 3)
    const ringInk = ringColor ?? ringRemap ?? "rgb(72, 70, 66)"
    const textInk =
        labelColor ??
        (typeof label === "string" && /^(rgb|#)/.test(label)
            ? label
            : "rgb(11, 11, 12)")
    const viewText = viewLabel ?? vIEW ?? "VIEW"
    const dragText = dragLabel ?? dRAG ?? "DRAG"

    const isStatic = useIsStaticRenderer()
    const target = RenderTarget.current()
    const freezeCanvas =
        (isStatic && target !== RenderTarget.preview) ||
        target === RenderTarget.canvas ||
        target === RenderTarget.export ||
        target === RenderTarget.thumbnail
    const reducedMotion = useReducedMotion()
    const [inside, setInside] = useState(false)
    const [fine, setFine] = useState(true)
    const [zone, setZone] = useState<Zone>("rest")
    const [held, setHeld] = useState("")

    const mvX = useMotionValue(0)
    const mvY = useMotionValue(0)
    const springX = useSpring(mvX, {
        stiffness: 820,
        damping: 52,
        mass: 0.55,
    })
    const springY = useSpring(mvY, {
        stiffness: 820,
        damping: 52,
        mass: 0.55,
    })

    useEffect(() => {
        if (typeof window === "undefined") return
        const mq = window.matchMedia("(pointer: fine)")
        const sync = () => setFine(mq.matches)
        sync()
        mq.addEventListener("change", sync)
        return () => mq.removeEventListener("change", sync)
    }, [])

    useEffect(() => {
        if (typeof window === "undefined" || freezeCanvas || !enabled) return

        const move = (e: PointerEvent) => {
            if (e.pointerType === "touch") return
            mvX.set(e.clientX - hotPx / 2)
            mvY.set(e.clientY - hotPx / 2)
            setInside(true)
            setZone(zoneFrom(e.target))
        }
        const leave = () => {
            setInside(false)
            setZone("rest")
        }

        window.addEventListener("pointermove", move, true)
        document.documentElement.addEventListener("mouseleave", leave)
        return () => {
            window.removeEventListener("pointermove", move, true)
            document.documentElement.removeEventListener("mouseleave", leave)
        }
    }, [freezeCanvas, enabled, hotPx, mvX, mvY])

    const live =
        enabled && !freezeCanvas && fine && typeof document !== "undefined"
    const freezeMotion = freezeCanvas || Boolean(reducedMotion)
    const isHot = inside && zone !== "rest"
    const restScale = restPx / hotPx
    const mark = labelFor(zone, viewText, dragText)
    const grow = freezeMotion
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 180, damping: 24, mass: 0.85 }
    const labelFade = freezeMotion
        ? { duration: 0 }
        : {
              type: "tween" as const,
              duration: 0.18,
              delay: isHot ? 0.22 : 0,
              ease: [0.45, 0, 0.2, 1] as [number, number, number, number],
          }

    useEffect(() => {
        if (isHot && mark) setHeld(mark)
    }, [isHot, mark])

    const skin = live ? (
        <style>{`html,body,*{cursor:none!important}`}</style>
    ) : null

    const hotRing = live ? (
        <motion.div
            aria-hidden
            initial={false}
            animate={{
                scale: isHot ? 1 : restScale,
                opacity: inside ? 1 : 0,
            }}
            transition={{
                scale: grow,
                opacity: freezeMotion ? { duration: 0 } : { duration: 0.12 },
            }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: hotPx,
                height: hotPx,
                x: freezeMotion ? mvX : springX,
                y: freezeMotion ? mvY : springY,
                zIndex: 9999,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                border: `${sw}px solid ${ringInk}`,
                boxSizing: "border-box",
                background: "transparent",
                color: textInk,
                textTransform: "uppercase",
                transformOrigin: "50% 50%",
                ...DEFAULT_FONT,
            }}
        >
            <motion.span
                initial={false}
                animate={{ opacity: isHot ? 1 : 0 }}
                transition={labelFade}
            >
                {isHot ? mark : held}
            </motion.span>
        </motion.div>
    ) : null

    return (
        <div
            style={{
                ...style,
                position: "relative",
                width: 1,
                height: 1,
                pointerEvents: "none",
                overflow: "visible",
            }}
        >
            {live
                ? createPortal(
                      <>
                          {skin}
                          {hotRing}
                      </>,
                      document.body
                  )
                : null}
            <style>
                {
                    "a:focus-visible{outline:1px solid rgb(36,35,33);outline-offset:4px}"
                }
            </style>
        </div>
    )
}

SillHomeCursor.displayName = "Sill Cursor"

SillHomeCursor.defaultProps = {
    enabled: true,
    restSize: 24,
    hotSize: 48,
    ringColor: "rgb(72, 70, 66)",
    labelColor: "rgb(11, 11, 12)",
    stroke: 1.5,
    viewLabel: "VIEW",
    dragLabel: "DRAG",
}

addPropertyControls(SillHomeCursor, {
    enabled: {
        type: ControlType.Boolean,
        title: "Enabled",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
        description: "Custom cursor on Preview. Canvas shows a rest ring.",
    },
    restSize: {
        type: ControlType.Number,
        title: "Rest Size",
        defaultValue: 24,
        min: 12,
        max: 40,
        step: 1,
        unit: "px",
        hidden: (p) => !p.enabled,
        description: "Ring at rest, everywhere except VIEW and DRAG zones",
    },
    hotSize: {
        type: ControlType.Number,
        title: "Hot Size",
        defaultValue: 48,
        min: 28,
        max: 80,
        step: 1,
        unit: "px",
        hidden: (p) => !p.enabled,
        description: "Ring on VIEW / DRAG. Grows from Rest Size.",
    },
    stroke: {
        type: ControlType.Number,
        title: "Stroke",
        defaultValue: 1.5,
        min: 1,
        max: 3,
        step: 0.25,
        unit: "px",
        hidden: (p) => !p.enabled,
    },
    ringColor: {
        type: ControlType.Color,
        title: "Ring Color",
        defaultValue: "rgb(72, 70, 66)",
        hidden: (p) => !p.enabled,
    },
    labelColor: {
        type: ControlType.Color,
        title: "Label Color",
        defaultValue: "rgb(11, 11, 12)",
        hidden: (p) => !p.enabled,
    },
    viewLabel: {
        type: ControlType.String,
        title: "View Label",
        defaultValue: "VIEW",
        hidden: (p) => !p.enabled,
        description: "Templates rows. Peek still follows.",
    },
    dragLabel: {
        type: ControlType.String,
        title: "Drag Label",
        defaultValue: "DRAG",
        hidden: (p) => !p.enabled,
        description: "Sites / Stills strips",
    },
})
