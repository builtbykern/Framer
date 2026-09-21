// @framerDisableUnlink
/**
 * Archive Preview — BuiltByKern Marketplace
 * Luxury film index. Hover → peek plate follows the pointer (pickup).
 * Rest = no ambient media. Preview to feel (Canvas freezes).
 */

/** Product accent — champagne / platinum (SKU-specific; not Kern cyan). */
const ACCENT = "rgb(36, 35, 33)"
const HAIRLINE = "rgba(11, 11, 12, 0.22)"
const INK = "rgb(11, 11, 12)"
const MUTED = "rgb(72, 70, 66)"
const RULE = "rgba(72, 70, 66, 0.32)"
import {
    addPropertyControls,
    ControlType,
    RenderTarget,
    useIsStaticRenderer,
} from "framer"
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    type Transition,
} from "framer-motion"
import {
    startTransition,
    useCallback,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type FocusEvent,
    type KeyboardEvent,
    type MouseEvent as ReactMouseEvent,
    type PointerEvent as ReactPointerEvent,
} from "react"

/** Peek stills — not the Sites/Stills covers. Video File still wins when set. */
const STILL_A =
    "https://framerusercontent.com/images/I8RKkFu4rVnKYLrW7UQuZvLcng.jpg"
const STILL_B =
    "https://framerusercontent.com/images/R9RBY6mnquX3cE1xVSJnELvqhw.jpg"
const STILL_C =
    "https://framerusercontent.com/images/582i6YjMO3164MIrWyzueTlzL7E.jpg"
const PEEK_STILLS: ImageValue[] = [
    {
        src: STILL_A,
        alt: "Pear, black grapes and a crackle-glaze bottle on a white cloth.",
    },
    {
        src: STILL_B,
        alt: "White jug, linen and sliced lemons on a dark table.",
    },
    {
        src: STILL_C,
        alt: "Empty mug casting a long shadow on a sunlit rug.",
    },
]
const PEEK_POSTER =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9"><rect fill="#0A0A0A" width="16" height="9"/></svg>'
    )

const EASE_UI: [number, number, number, number] = [0.42, 0, 0.18, 1]

type ImageValue = string | { src: string; alt?: string }

type ArchiveItem = {
    year: string
    title: string
    meta: string
    video: string | undefined
    still: ImageValue | undefined
    link: string | undefined
}

interface ContentCtrl {
    items: ArchiveItem[]
    openInNewTab: boolean
}

interface LookCtrl {
    background: string
    textColor: string
    mutedColor: string
    hairlineColor: string
    accent: string
    ruleColor: string
    titleFont: CSSProperties
    metaFont: CSSProperties
    /** Index outer padding (px) */
    insetY: number
    insetX: number
    /** Per-row vertical padding (px) — main row-height lever */
    rowPadY: number
    /** Column gap year · title · meta (px) */
    colGap: number
    /** Year column width (px) */
    yearWidth: number
    /** Category column width (px) */
    metaWidth: number
}

interface PeekCtrl {
    letterbox: number
    peekWidth: number
    peekHeight: number
    peekOpacity: number
    dimOpacity: number
}

interface MotionCtrl {
    transition: Transition
    followLag: number
    tiltMax: number
}

/** Panel-only — Canvas/Export always rest (no forced open row). */
interface PreviewCtrl {
    canvas: boolean
}

interface ArchivePreviewProps {
    content: ContentCtrl
    look: LookCtrl
    peek: PeekCtrl
    motion: MotionCtrl
    preview: PreviewCtrl
    onPeek?: () => void
    style?: CSSProperties
}

const DEFAULT_ITEMS: ArchiveItem[] = [
    {
        year: "01",
        title: "Arbour",
        meta: "2026",
        video: undefined,
        still: STILL_A,
        link: "https://www.framer.com/marketplace/templates/arbour/",
    },
    {
        year: "02",
        title: "Halden",
        meta: "2024",
        video: undefined,
        still: STILL_B,
        link: "https://www.framer.com/marketplace/templates/halden-photographer/",
    },
    {
        year: "03",
        title: "Archive Preview",
        meta: "2025",
        video: undefined,
        still: STILL_C,
        link: "https://www.framer.com/marketplace/components/archive-preview/",
    },
]

const DEFAULT_TITLE_FONT: CSSProperties = {
    fontFamily: '"Clash Grotesk", sans-serif',
    fontSize: "20px",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    lineHeight: "1.2em",
}

const DEFAULT_META_FONT: CSSProperties = {
    fontFamily: '"Clash Grotesk", sans-serif',
    fontSize: "15px",
    fontWeight: 400,
    letterSpacing: "0em",
    lineHeight: "1em",
}


/** Same family as Sill/TextLink; durations differ per surface. */
const DEFAULT_TRANSITION: Transition = {
    type: "tween",
    duration: 0.22,
    ease: EASE_UI,
}

const DEFAULT_CONTENT: ContentCtrl = {
    items: DEFAULT_ITEMS,
    openInNewTab: true,
}

const DEFAULT_LOOK: LookCtrl = {
    background: "transparent",
    textColor: INK,
    mutedColor: MUTED,
    hairlineColor: HAIRLINE,
    accent: ACCENT,
    ruleColor: RULE,
    titleFont: DEFAULT_TITLE_FONT,
    metaFont: DEFAULT_META_FONT,
    insetY: 0,
    insetX: 0,
    rowPadY: 28,
    colGap: 24,
    yearWidth: 0,
    metaWidth: 148,
}

const DEFAULT_PEEK: PeekCtrl = {
    letterbox: 5,
    peekWidth: 44,
    peekHeight: 56,
    peekOpacity: 0.92,
    dimOpacity: 0.26,
}

const DEFAULT_MOTION: MotionCtrl = {
    transition: DEFAULT_TRANSITION,
    followLag: 0.2,
    tiltMax: 0,
}

const DEFAULT_PREVIEW: PreviewCtrl = {
    canvas: true,
}

const BUILTBYKERN_BRAND =
    "BuiltByKern\n[Explore more components](https://www.framer.com/%40builtbykern/)"

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n))
}

function mediaUrl(value: unknown): string | undefined {
    if (typeof value === "string" && value.length > 0) return value
    if (value && typeof value === "object" && "src" in value) {
        const src = (value as { src?: unknown }).src
        if (typeof src === "string" && src.length > 0) return src
    }
    return undefined
}

function mediaAlt(value: unknown, fallback: string): string {
    if (value && typeof value === "object" && "alt" in value) {
        const alt = (value as { alt?: unknown }).alt
        if (typeof alt === "string" && alt.length > 0) return alt
    }
    return fallback
}

function isVideoUrl(src: string): boolean {
    return /\.(mp4|webm|mov)(\?|#|$)/i.test(src) || /\/video-files\//i.test(src)
}

function clipOpen(letterboxPct: number): string {
    return `inset(${letterboxPct}% 0% ${letterboxPct}% 0%)`
}


/**
 * Archive Preview
 *
 * @framerIntrinsicWidth 720
 * @framerIntrinsicHeight 420
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function ArchivePreview(props: ArchivePreviewProps) {
    const content = {
        ...DEFAULT_CONTENT,
        ...props.content,
    }
    const look = {
        ...DEFAULT_LOOK,
        ...props.look,
        titleFont: {
            ...DEFAULT_TITLE_FONT,
            ...props.look?.titleFont,
            fontFamily: '"Clash Grotesk", sans-serif',
            fontSize: "20px",
            letterSpacing: "-0.01em",
            lineHeight: "1.2em",
        },
        metaFont: {
            ...DEFAULT_META_FONT,
            ...props.look?.metaFont,
            fontFamily: '"Clash Grotesk", sans-serif',
            fontSize: "15px",
            letterSpacing: "0em",
            lineHeight: "1em",
        },
        rowPadY: 28,
    }
    const peek = { ...DEFAULT_PEEK, ...props.peek, peekHeight: 56 }
    const showPeekPlate = true
    const motionCtrl = {
        ...DEFAULT_MOTION,
        ...props.motion,
        tiltMax: 0,
        transition: {
            ...DEFAULT_TRANSITION,
            ...props.motion?.transition,
            type: "tween",
            ease: EASE_UI,
        },
    }
    const { onPeek, style } = props

    const { items, openInNewTab } = content
    const {
        background,
        textColor,
        mutedColor,
        hairlineColor,
        accent,
        ruleColor,
        titleFont,
        metaFont,
        insetY,
        insetX,
        rowPadY,
        colGap,
        yearWidth,
        metaWidth,
    } = look

    const showYear = yearWidth > 0
    const showMeta = metaWidth > 0
    const indexCols = [
        showYear ? `${yearWidth}px` : null,
        "minmax(0, 1fr)",
        showMeta ? `${metaWidth}px` : null,
    ]
        .filter(Boolean)
        .join(" ")
    const {
        letterbox,
        peekWidth,
        peekHeight,
        peekOpacity,
        dimOpacity,
    } = peek
    const { transition, followLag, tiltMax } = motionCtrl

    const isStatic = useIsStaticRenderer()
    const target = RenderTarget.current()
    const freezeCanvas =
        (isStatic && target !== RenderTarget.preview) ||
        target === RenderTarget.canvas ||
        target === RenderTarget.export ||
        target === RenderTarget.thumbnail
    const reducedMotion = useReducedMotion()
    const freezeMotion = freezeCanvas || !!reducedMotion

    const rows = items.length > 0 ? items : DEFAULT_ITEMS
    const rootRef = useRef<HTMLDivElement>(null)
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
    const lastPtr = useRef({ x: 0, y: 0, t: 0 })
    const peekSizeRef = useRef({ w: 320, h: 220 })

    const [hovered, setHovered] = useState<number | null>(null)
    const [focusIndex, setFocusIndex] = useState<number | null>(null)
    const [finePointer, setFinePointer] = useState(true)
    /** Film gate wide — false = hairline slit, true = letterbox. */
    const [gateWide, setGateWide] = useState(false)
    const [armed, setArmed] = useState<Record<number, true>>({})

    const mvX = useMotionValue(0)
    const mvY = useMotionValue(0)
    const mvRX = useMotionValue(0)
    const mvRY = useMotionValue(0)

    // Lag: lower stiffness when followLag high
    const lag = clamp(followLag, 0.15, 1)
    const stiffness = freezeMotion ? 500 : Math.round(400 - lag * 230)
    const damping = freezeMotion ? 40 : Math.round(31 - lag * 7)
    const peekMass = 0.55

    const springX = useSpring(mvX, { stiffness, damping, mass: peekMass })
    const springY = useSpring(mvY, { stiffness, damping, mass: peekMass })
    const springRX = useSpring(mvRX, {
        stiffness: Math.round(stiffness * 0.85),
        damping: damping + 4,
        mass: 0.45,
    })
    const springRY = useSpring(mvRY, {
        stiffness: Math.round(stiffness * 0.85),
        damping: damping + 4,
        mass: 0.45,
    })

    useEffect(() => {
        if (typeof window === "undefined") return
        const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
        const sync = () => startTransition(() => setFinePointer(mq.matches))
        sync()
        mq.addEventListener("change", sync)
        return () => mq.removeEventListener("change", sync)
    }, [])

    // Fine pointer: peek from hover only — keyboard keeps focus ring, no theatre
    const liveIndex = finePointer
        ? hovered
        : hovered !== null
          ? hovered
          : focusIndex

    const peekIndex =
        freezeCanvas || liveIndex === null ? -1 : liveIndex

    const open = peekIndex >= 0
    const boxPct = Math.max(0, Math.min(letterbox, 18))
    const maxTilt = clamp(tiltMax, 0, 24)
    const motionDuration =
        freezeMotion
            ? 0
            : typeof transition?.duration === "number"
              ? transition.duration
              : 0.22
    const openTransition: Transition = freezeMotion
        ? { duration: 0 }
        : {
              type: "tween",
              duration: motionDuration,
              ease: transition?.ease != null ? transition.ease : EASE_UI,
          }

    const peekVisibilityTransition: Transition = freezeMotion
        ? { duration: 0 }
        : open
          ? { type: "tween", duration: 0.12, ease: EASE_UI }
          : { type: "tween", duration: 0.16, ease: EASE_UI }

    const crossTransition: Transition = freezeMotion
        ? { duration: 0 }
        : {
              type: "tween",
              duration: motionDuration,
              ease: EASE_UI,
          }

    // Reduced motion: hairline fades instead of drawing (less, not nothing).
    const hairlineDraws = !freezeCanvas && !reducedMotion
    const hairlineTransition: Transition = freezeCanvas
        ? { duration: 0 }
        : {
              type: "tween",
              duration: hairlineDraws ? motionDuration : 0.12,
              ease: EASE_UI,
          }

    const prevOpenRef = useRef(false)
    const prevPeekRef = useRef(-1)
    const rowCrossfade =
        open && prevOpenRef.current && prevPeekRef.current !== peekIndex

    useEffect(() => {
        prevOpenRef.current = open
        prevPeekRef.current = peekIndex
    }, [open, peekIndex])

    // Peek plate tracks open immediately — no slit hold on tens/day hover
    useEffect(() => {
        startTransition(() => setGateWide(open))
    }, [open])

    // Center peek for Canvas / reduced-motion still
    useEffect(() => {
        const root = rootRef.current
        if (!root) return
        const rb = root.getBoundingClientRect()
        const w = (peekWidth / 100) * rb.width
        const h = (peekHeight / 100) * rb.height
        peekSizeRef.current = { w, h }
        if (freezeCanvas || reducedMotion) {
            mvX.set((rb.width - w) / 2)
            mvY.set((rb.height - h) / 2)
            mvRX.set(0)
            mvRY.set(0)
        }
    }, [
        freezeCanvas,
        reducedMotion,
        peekWidth,
        peekHeight,
        mvX,
        mvY,
        mvRX,
        mvRY,
        open,
    ])

    useEffect(() => {
        if (freezeCanvas) return
        if (open && peekIndex >= 0) {
            setArmed((prev) =>
                prev[peekIndex] ? prev : { ...prev, [peekIndex]: true }
            )
        }
        videoRefs.current.forEach((el, i) => {
            if (!el) return
            if (open && i === peekIndex) {
                const p = el.play()
                if (p && typeof p.catch === "function") p.catch(() => {})
            } else {
                el.pause()
            }
        })
    }, [peekIndex, open, freezeCanvas, rows.length])

    const setOpenIndex = useCallback(
        (index: number | null) => {
            setHovered(index)
            if (index !== null && onPeek) onPeek()
            if (index === null) {
                mvRX.set(0)
                mvRY.set(0)
            }
        },
        [onPeek, mvRX, mvRY]
    )

    const placePeekAt = useCallback(
        (clientX: number, clientY: number, withTilt: boolean) => {
            const root = rootRef.current
            if (!root) return
            const rb = root.getBoundingClientRect()
            const w = (peekWidth / 100) * rb.width
            const h = (peekHeight / 100) * rb.height
            peekSizeRef.current = { w, h }

            const localX = clientX - rb.left
            const localY = clientY - rb.top

            const now =
                typeof performance !== "undefined" ? performance.now() : Date.now()
            const prev = lastPtr.current
            const dt = Math.max(12, now - (prev.t || now))
            const vx = (localX - prev.x) / dt
            const vy = (localY - prev.y) / dt
            lastPtr.current = { x: localX, y: localY, t: now }

            const targetX = clamp(
                localX - w / 2,
                -w * 0.72,
                rb.width - w * 0.28
            )
            const targetY = clamp(
                localY - h / 2,
                -h * 0.72,
                rb.height - h * 0.28
            )

            mvX.set(targetX)
            mvY.set(targetY)

            if (withTilt && !freezeMotion) {
                const speed = Math.hypot(vx, vy)
                const boost = 1 + clamp(speed * 18, 0, 1.4)
                mvRY.set(clamp(vx * 55 * boost, -maxTilt, maxTilt))
                mvRX.set(clamp(-vy * 55 * boost, -maxTilt * 0.85, maxTilt * 0.85))
            }
        },
        [
            peekWidth,
            peekHeight,
            mvX,
            mvY,
            mvRX,
            mvRY,
            freezeMotion,
            maxTilt,
        ]
    )

    const onRootPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (freezeCanvas || !finePointer || !open) return
        placePeekAt(e.clientX, e.clientY, true)
    }

    const onRowEnter = (index: number, e: ReactMouseEvent) => {
        if (freezeCanvas || !finePointer) return
        setOpenIndex(index)
        placePeekAt(e.clientX, e.clientY, false)
        lastPtr.current = {
            x: e.clientX - (rootRef.current?.getBoundingClientRect().left ?? 0),
            y: e.clientY - (rootRef.current?.getBoundingClientRect().top ?? 0),
            t: typeof performance !== "undefined" ? performance.now() : Date.now(),
        }
    }

    const onListLeave = () => {
        if (freezeCanvas || !finePointer) return
        setOpenIndex(null)
    }

    const onRowActivate = (index: number, item: ArchiveItem) => {
        if (freezeCanvas) return
        if (!finePointer) {
            setOpenIndex(hovered === index ? null : index)
            return
        }
        if (item.link && typeof window !== "undefined") {
            if (openInNewTab)
                window.open(item.link, "_blank", "noopener,noreferrer")
            else window.location.assign(item.link)
        }
    }

    const onRowKeyDown = (
        e: KeyboardEvent<HTMLLIElement>,
        index: number,
        item: ArchiveItem
    ) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onRowActivate(index, item)
        }
        if (e.key === "Escape") {
            setOpenIndex(null)
            setFocusIndex(null)
            ;(e.currentTarget as HTMLElement).blur()
        }
        if (e.key === "ArrowDown") {
            e.preventDefault()
            const next = Math.min(index + 1, rows.length - 1)
            const el = e.currentTarget.parentElement?.children[
                next
            ] as HTMLElement | null
            el?.focus()
        }
        if (e.key === "ArrowUp") {
            e.preventDefault()
            const prev = Math.max(index - 1, 0)
            const el = e.currentTarget.parentElement?.children[
                prev
            ] as HTMLElement | null
            el?.focus()
        }
    }

    const onRowFocus = (index: number) => {
        if (freezeCanvas) return
        startTransition(() => setFocusIndex(index))
        // Touch / coarse only — fine pointer keyboard keeps focus ring, no peek theatre
        if (!finePointer) {
            setOpenIndex(index)
            const root = rootRef.current
            if (root) {
                const rb = root.getBoundingClientRect()
                placePeekAt(
                    rb.left + rb.width / 2,
                    rb.top + rb.height / 2,
                    false
                )
            }
        }
    }

    const onRowBlur = (e: FocusEvent<HTMLLIElement>) => {
        const next = e.relatedTarget as Node | null
        if (next && e.currentTarget.parentElement?.contains(next)) return
        startTransition(() => setFocusIndex(null))
        if (!finePointer) setOpenIndex(null)
    }

    const peekStills = PEEK_STILLS
    // Settle onto the sill — scale in, not a cinema slit.
    const gateClosed = { scaleX: 0.94, scaleY: 0.94 }
    const gateCloseTransition: Transition = freezeMotion
        ? { duration: 0 }
        : { type: "tween", duration: 0.16, ease: EASE_UI }
    const gateScaleTransition = gateWide
        ? openTransition
        : gateCloseTransition
    const gateBlur = "blur(0px)"

    return (
        <div
            ref={rootRef}
            style={{
                ...style,
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: showPeekPlate ? 280 : 0,
                background,
                color: textColor,
                overflow: "visible",
                perspective: 1100,
                fontFamily:
                    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
            }}
            onMouseLeave={onListLeave}
            onPointerMove={onRootPointerMove}
        >
            {/* Type list: hairline only. Film-gate peek is a second grammar. */}
            {showPeekPlate ? (
            <motion.div
                aria-hidden
                initial={false}
                animate={
                    !open
                        ? {
                              opacity: 0,
                              scaleX: gateClosed.scaleX,
                              scaleY: gateClosed.scaleY,
                              clipPath: "inset(0% 0% 0% 0%)",
                              filter: "blur(0px)",
                          }
                        : gateWide
                          ? {
                                opacity: 1,
                                scaleX: 1,
                                scaleY: 1,
                                clipPath: clipOpen(boxPct),
                                filter: "blur(0px)",
                            }
                          : {
                                opacity: 1,
                                scaleX: gateClosed.scaleX,
                                scaleY: gateClosed.scaleY,
                                clipPath: clipOpen(boxPct),
                                filter: gateBlur,
                            }
                }
                transition={{
                    opacity: peekVisibilityTransition,
                    scaleX: gateScaleTransition,
                    scaleY: gateScaleTransition,
                    filter: gateScaleTransition,
                    clipPath: freezeMotion
                        ? { duration: 0 }
                        : {
                              type: "tween",
                              duration: motionDuration,
                              ease: EASE_UI,
                          },
                }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${peekWidth}%`,
                    height: `${peekHeight}%`,
                    x: freezeMotion ? mvX : springX,
                    y: freezeMotion ? mvY : springY,
                    rotateX: freezeMotion ? 0 : springRX,
                    rotateY: freezeMotion ? 0 : springRY,
                    transformPerspective: 1100,
                    transformOrigin: "50% 50%",
                    zIndex: open ? 6 : 1,
                    pointerEvents: "none",
                    overflow: "hidden",
                    background: "#0A0A0A",
                    borderRadius: 0,
                    boxShadow: open
                        ? "0 0 0 1px rgba(72, 70, 66, 0.28), 0 28px 80px rgba(11,11,12,0.18)"
                        : "0 0 0 1px rgba(72, 70, 66, 0.18)",
                    willChange: freezeMotion
                        ? undefined
                        : "transform, opacity, filter",
                }}
            >
                {/* Sharp video — always on when open (base layer, no end jump) */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        overflow: "hidden",
                        opacity: open ? 1 : 0,
                    }}
                >
                    {rows.map((item, index) => {
                        const videoSrc = mediaUrl(item.video)
                        const peekStill =
                            peekStills[index % peekStills.length]
                        const stillSrc =
                            mediaUrl(item.still) || mediaUrl(peekStill)
                        const src = videoSrc || stillSrc
                        const stillAlt = mediaAlt(item.still, mediaAlt(peekStill, ""))
                        const asVideo = !!videoSrc && isVideoUrl(videoSrc)
                        const visible = open && index === peekIndex
                        const showSrc =
                            armed[index] || (open && index === peekIndex)
                                ? src
                                : undefined
                        const mediaStyle: CSSProperties = {
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }
                        return asVideo ? (
                            <motion.video
                                key={`v-${src}-${index}`}
                                ref={(el) => {
                                    videoRefs.current[index] = el
                                }}
                                src={showSrc}
                                poster={PEEK_POSTER}
                                muted
                                playsInline
                                loop
                                preload="none"
                                tabIndex={-1}
                                initial={false}
                                animate={{
                                    opacity: visible ? peekOpacity : 0,
                                }}
                                transition={
                                    rowCrossfade
                                        ? crossTransition
                                        : { duration: 0 }
                                }
                                style={mediaStyle}
                            />
                        ) : (
                            <motion.img
                                key={`s-${src}-${index}`}
                                src={showSrc}
                                alt={stillAlt}
                                initial={false}
                                animate={{
                                    opacity: visible ? peekOpacity : 0,
                                }}
                                transition={
                                    rowCrossfade
                                        ? crossTransition
                                        : { duration: 0 }
                                }
                                style={mediaStyle}
                            />
                        )
                    })}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(165deg, rgba(245,243,240,0.06) 0%, rgba(11,11,12,0.12) 40%, rgba(11,11,12,0.4) 100%)",
                            pointerEvents: "none",
                        }}
                    />
                </div>

            </motion.div>
            ) : null}

            <div
                style={{
                    position: "relative",
                    zIndex: 3,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    padding: `${insetY}px ${insetX}px`,
                    boxSizing: "border-box",
                }}
            >
                {!freezeCanvas ? (
                    <style>{`
                        [data-ap-row]:focus {
                            outline: none;
                        }
                        [data-ap-row]:focus-visible {
                            outline: 2px solid ${accent};
                            outline-offset: 4px;
                            border-radius: 2px;
                        }
                    `}</style>
                ) : null}
                {rows.length === 0 ? (
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            color: mutedColor,
                            ...metaFont,
                        }}
                    >
                        Add archive items
                    </div>
                ) : (
                    <ul
                        style={{
                            listStyle: "none",
                            margin: 0,
                            padding: 0,
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                            justifyContent: showPeekPlate ? "center" : "flex-start",
                            gap: 0,
                        }}
                        role="listbox"
                        aria-label="Templates"
                    >
                        {rows.map((item, index) => {
                            const isOpen = index === peekIndex
                            const isHot = isOpen || hovered === index
                            return (
                                <motion.li
                                    key={`${item.year}-${item.title}-${index}`}
                                    data-ap-row=""
                                    data-sill-cursor="view"
                                    role="option"
                                    aria-selected={isOpen}
                                    tabIndex={0}
                                    initial={false}
                                    animate={{ opacity: 1 }}
                                    whileTap={
                                        freezeCanvas ? undefined : { scale: 0.98 }
                                    }
                                    transition={
                                        freezeMotion
                                            ? { duration: 0 }
                                            : {
                                                  type: "tween",
                                                  duration: 0.2,
                                                  ease: EASE_UI,
                                              }
                                    }
                                    onMouseEnter={(e) =>
                                        onRowEnter(index, e)
                                    }
                                    onFocus={() => onRowFocus(index)}
                                    onBlur={onRowBlur}
                                    onClick={(e: ReactMouseEvent) => {
                                        e.preventDefault()
                                        onRowActivate(index, item)
                                    }}
                                    onKeyDown={(e) =>
                                        onRowKeyDown(e, index, item)
                                    }
                                    style={{
                                        position: "relative",
                                        display: "grid",
                                        gridTemplateColumns: indexCols,
                                        gap: colGap,
                                        alignItems: "baseline",
                                        padding: `${rowPadY}px 0`,
                                        borderBottom: `1px solid ${ruleColor}`,
                                        color: isOpen
                                            ? textColor
                                            : mutedColor,
                                        cursor:
                                            item.link || !finePointer
                                                ? "pointer"
                                                : "default",
                                    }}
                                >
                                    {showYear ? (
                                    <span
                                        style={{
                                            ...metaFont,
                                            fontVariantNumeric: "tabular-nums",
                                            letterSpacing: "-0.015em",
                                            textTransform: "none",
                                            color: isHot ? accent : mutedColor,
                                        }}
                                    >
                                        {item.year}
                                    </span>
                                    ) : null}
                                    <span
                                        style={{
                                            position: "relative",
                                            ...titleFont,
                                            width: "max-content",
                                            maxWidth: "100%",
                                            color: textColor,
                                        }}
                                    >
                                        {item.title}
                                        <motion.span
                                            aria-hidden
                                            initial={false}
                                            animate={
                                                hairlineDraws
                                                    ? { scaleX: isOpen ? 1 : 0, opacity: 1 }
                                                    : { scaleX: 1, opacity: isOpen ? 1 : 0 }
                                            }
                                            transition={hairlineTransition}
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                bottom: -7,
                                                height: 1,
                                                background: hairlineColor,
                                                transformOrigin: "left",
                                            }}
                                        />
                                    </span>
                                    {showMeta ? (
                                        <span
                                            style={{
                                                ...metaFont,
                                                textTransform: "none",
                                                textAlign: "right",
                                                color: mutedColor,
                                            }}
                                        >
                                            {item.meta}
                                        </span>
                                    ) : null}
                                </motion.li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </div>
    )
}

ArchivePreview.displayName = "Archive Preview"

addPropertyControls(ArchivePreview, {
    content: {
        type: ControlType.Object,
        title: "Content",
        optional: false,
        icon: "object",
        description: "Index rows and link behavior",
        defaultValue: DEFAULT_CONTENT,
        controls: {
            items: {
                type: ControlType.Array,
                title: "Items",
                maxCount: 24,
                defaultValue: DEFAULT_ITEMS,
                description: "Year · title · category · still · video · optional link",
                control: {
                    type: ControlType.Object,
                    controls: {
                        year: {
                            type: ControlType.String,
                            title: "Year",
                            defaultValue: "2024",
                        },
                        title: {
                            type: ControlType.String,
                            title: "Title",
                            defaultValue: "Untitled",
                        },
                        meta: {
                            type: ControlType.String,
                            title: "Category",
                            defaultValue: "Film",
                        },
                        video: {
                            type: ControlType.File,
                            title: "Video",
                            allowedFileTypes: ["mp4", "webm", "mov"],
                            description:
                                "Muted loop for hover peek. Empty = studio still.",
                        },
                        still: {
                            type: ControlType.ResponsiveImage,
                            title: "Still",
                            description: "Peek plate until a video is set",
                        },
                        link: {
                            type: ControlType.Link,
                            title: "Link",
                            description: "Optional · click row opens",
                        },
                    },
                },
            },
            openInNewTab: {
                type: ControlType.Boolean,
                title: "New Tab",
                defaultValue: true,
                description: "Open row links in a new tab",
            },
        },
    },
    look: {
        type: ControlType.Object,
        title: "Look",
        optional: false,
        icon: "color",
        description: "Colors and type · transparent bg for Kern page atmosphere",
        defaultValue: DEFAULT_LOOK,
        controls: {
            background: {
                type: ControlType.Color,
                title: "Background",
                defaultValue: "transparent",
                description: "Prefer transparent · page atmosphere shows through",
            },
            textColor: {
                type: ControlType.Color,
                title: "Text",
                defaultValue: INK,
                description: "Active row title",
            },
            mutedColor: {
                type: ControlType.Color,
                title: "Muted",
                defaultValue: MUTED,
                description: "Year, category, idle rows",
            },
            accent: {
                type: ControlType.Color,
                title: "Accent",
                defaultValue: ACCENT,
                description: "BuiltByKern SKU — champagne hairline / focus",
            },
            hairlineColor: {
                type: ControlType.Color,
                title: "Hairline",
                defaultValue: HAIRLINE,
                description: "Mask edge accent on open",
            },
            ruleColor: {
                type: ControlType.Color,
                title: "Rules",
                defaultValue: RULE,
                description: "Index dividers",
            },
            insetY: {
                type: ControlType.Number,
                title: "Inset Y",
                defaultValue: 40,
                min: 0,
                max: 160,
                step: 1,
                unit: "px",
                displayStepper: true,
                description: "Top / bottom padding of the index",
            },
            insetX: {
                type: ControlType.Number,
                title: "Inset X",
                defaultValue: 44,
                min: 0,
                max: 160,
                step: 1,
                unit: "px",
                displayStepper: true,
                description: "Left / right padding of the index",
            },
            rowPadY: {
                type: ControlType.Number,
                title: "Row Pad",
                defaultValue: 28,
                min: 8,
                max: 96,
                step: 1,
                unit: "px",
                displayStepper: true,
                description: "Vertical padding per row — raise for taller rows",
            },
            colGap: {
                type: ControlType.Number,
                title: "Col Gap",
                defaultValue: 24,
                min: 8,
                max: 64,
                step: 1,
                unit: "px",
                displayStepper: true,
                description: "Space between Year · Title · Category",
            },
            yearWidth: {
                type: ControlType.Number,
                title: "Year Col",
                defaultValue: 0,
                min: 0,
                max: 140,
                step: 1,
                unit: "px",
                displayStepper: true,
                description: "0 hides the index. Names sit; peek picks them up.",
            },
            metaWidth: {
                type: ControlType.Number,
                title: "Meta Col",
                defaultValue: 148,
                min: 96,
                max: 240,
                step: 1,
                unit: "px",
                displayStepper: true,
                description: "Category column width",
            },
            titleFont: {
                type: ControlType.Font,
                title: "Title",
                controls: "extended",
                defaultFontType: "sans-serif",
                defaultValue: {
                    fontSize: "23px",
                    variant: "Regular",
                    letterSpacing: "-0.01em",
                    lineHeight: "1.2em",
                },
            },
            metaFont: {
                type: ControlType.Font,
                title: "Meta",
                controls: "extended",
                defaultFontType: "sans-serif",
                defaultValue: {
                    fontSize: "15px",
                    variant: "Regular",
                    letterSpacing: "0em",
                    lineHeight: "1em",
                },
                description: "Year + category columns",
            },
        },
    },
    peek: {
        type: ControlType.Object,
        title: "Peek",
        optional: false,
        icon: "object",
        description: "Mask geometry and video plate sizing",
        defaultValue: DEFAULT_PEEK,
        controls: {
            letterbox: {
                type: ControlType.Number,
                title: "Letterbox",
                defaultValue: 5,
                min: 0,
                max: 18,
                unit: "%",
                description: "Top/bottom crop when open",
            },
            peekWidth: {
                type: ControlType.Number,
                title: "Plate W",
                defaultValue: 44,
                min: 24,
                max: 70,
                unit: "%",
                description: "Peek plate width vs component",
            },
            peekHeight: {
                type: ControlType.Number,
                title: "Plate H",
                defaultValue: 56,
                min: 20,
                max: 70,
                unit: "%",
                description: "Peek plate height vs component",
            },
            peekOpacity: {
                type: ControlType.Number,
                title: "Opacity",
                defaultValue: 0.92,
                min: 0.2,
                max: 1,
                step: 0.01,
                description: "Video plate opacity when open",
            },
            dimOpacity: {
                type: ControlType.Number,
                title: "Dim Rows",
                defaultValue: 0.26,
                min: 0.1,
                max: 0.7,
                step: 0.01,
                description: "Idle row opacity while one is active",
            },
        },
    },
    motion: {
        type: ControlType.Object,
        title: "Motion",
        optional: false,
        icon: "interaction",
        description: "Gate open timing · plate follow · tilt",
        defaultValue: DEFAULT_MOTION,
        controls: {
            transition: {
                type: ControlType.Transition,
                title: "Open",
                defaultValue: DEFAULT_TRANSITION,
                description: "Film slit open timing (rest + between hovers)",
            },
            followLag: {
                type: ControlType.Number,
                title: "Follow Lag",
                defaultValue: 0.55,
                min: 0.15,
                max: 1,
                step: 0.01,
                description: "Higher = peek plate trails the pointer",
            },
            tiltMax: {
                type: ControlType.Number,
                title: "Tilt Max",
                defaultValue: 11,
                min: 0,
                max: 24,
                unit: "°",
                description: "Max rotate from cursor velocity",
            },
        },
    },
    onPeek: {
        type: ControlType.EventHandler,
        title: "On Peek",
        description: "Fires when a row opens the peek",
    },
    preview: {
        type: ControlType.Object,
        title: "Preview",
        optional: false,
        icon: "interaction",
        description: BUILTBYKERN_BRAND,
        defaultValue: DEFAULT_PREVIEW,
        controls: {
            canvas: {
                type: ControlType.Boolean,
                title: "Canvas",
                defaultValue: true,
                description:
                    "Always rest on Canvas / Export · feel the peek in Preview ▶️",
            },
        },
    },
})

