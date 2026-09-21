import {
    addPropertyControls,
    ControlType,
    RenderTarget,
    useIsStaticRenderer,
} from "framer"
import { useReducedMotion } from "framer-motion"
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react"

interface ContentProps {
    count: number
}

interface LookProps {
    field: string
    colors: string[]
    opacity: number
    blur: number
}

interface LayoutProps {
    sizeMin: number
    sizeMax: number
}

interface MotionProps {
    speed: number
    drift: number
    pause: boolean
}

interface PreviewProps {
    exploreMore: string
    madeForFramer: string
}

interface KernThinkingOrbsProps {
    content: ContentProps
    look: LookProps
    layout: LayoutProps
    motion: MotionProps
    preview: PreviewProps
    style?: CSSProperties
}

interface RestSlot {
    x: number
    y: number
    size: number
    phase: number
}

interface OrbPose {
    x: number
    y: number
    size: number
    color: string
    phase: number
    periodX: number
    periodY: number
    periodS: number
}

const STUDIO_URL = "https://www.framer.com/@builtbykern/"
const AFFILIATE_URL = "https://framer.link/qIg9LiG"
const PREVIEW_DESCRIPTION =
    "BuiltByKern\n[Explore more components](https://www.framer.com/%40builtbykern/)\n[Made for Framer](https://framer.link/qIg9LiG)"

const MAX_ORBS = 8
const CTA_CLASS = "kern-thinking-orbs-cta"

const DEFAULT_COLORS = ["#B06A3C", "#4F6A52", "#3A4C6B"]
const DEFAULT_FIELD = "#E8E2D6"

const REST: readonly RestSlot[] = [
    { x: 0.47, y: 0.5, size: 1, phase: 0.12 },
    { x: 0.545, y: 0.425, size: 0.66, phase: 1.7 },
    { x: 0.515, y: 0.565, size: 0.52, phase: 2.9 },
    { x: 0.38, y: 0.4, size: 0.34, phase: 4.1 },
    { x: 0.63, y: 0.54, size: 0.3, phase: 0.8 },
    { x: 0.41, y: 0.62, size: 0.26, phase: 3.4 },
    { x: 0.6, y: 0.36, size: 0.22, phase: 5.2 },
    { x: 0.35, y: 0.54, size: 0.2, phase: 1.1 },
]

const PERIOD_X = [13.7, 17.1, 21.4, 15.2, 19.8, 12.6, 16.4, 22]
const PERIOD_Y = [16.3, 13.9, 19.2, 18.1, 14.6, 21, 15.5, 17.8]
const PERIOD_S = [9.4, 11.2, 13.6, 10.1, 12.8, 8.7, 14.2, 11.9]

const DEFAULT_CONTENT: ContentProps = { count: 3 }
const DEFAULT_LOOK: LookProps = {
    field: DEFAULT_FIELD,
    colors: DEFAULT_COLORS,
    opacity: 0.92,
    blur: 16,
}
const DEFAULT_LAYOUT: LayoutProps = { sizeMin: 120, sizeMax: 240 }
const DEFAULT_MOTION: MotionProps = { speed: 0.55, drift: 28, pause: false }
const DEFAULT_PREVIEW: PreviewProps = {
    exploreMore: STUDIO_URL,
    madeForFramer: AFFILIATE_URL,
}

function clamp(value: unknown, min: number, max: number, fallback: number): number {
    const n = typeof value === "number" && Number.isFinite(value) ? value : fallback
    return Math.min(max, Math.max(min, n))
}

function clampCount(value: unknown): number {
    return Math.round(clamp(value, 1, MAX_ORBS, 3))
}

function resolveColors(value: unknown): string[] {
    if (!Array.isArray(value) || value.length === 0) return DEFAULT_COLORS.slice()
    const next = value.filter((item): item is string => typeof item === "string" && item.length > 0)
    return next.length > 0 ? next.slice(0, 4) : DEFAULT_COLORS.slice()
}

function resolveLink(value: unknown, fallback: string): string {
    if (typeof value === "string" && value.length > 0) return value
    if (value && typeof value === "object") {
        const rec = value as Record<string, unknown>
        if (typeof rec.url === "string" && rec.url.length > 0) return rec.url
        if (typeof rec.href === "string" && rec.href.length > 0) return rec.href
    }
    return fallback
}

function parseHex(color: string): { r: number; g: number; b: number } | null {
    const raw = color.trim()
    const hex = raw.startsWith("#") ? raw.slice(1) : raw
    if (hex.length === 3) {
        const r = Number.parseInt(hex[0] + hex[0], 16)
        const g = Number.parseInt(hex[1] + hex[1], 16)
        const b = Number.parseInt(hex[2] + hex[2], 16)
        if ([r, g, b].some((n) => Number.isNaN(n))) return null
        return { r, g, b }
    }
    if (hex.length === 6) {
        const r = Number.parseInt(hex.slice(0, 2), 16)
        const g = Number.parseInt(hex.slice(2, 4), 16)
        const b = Number.parseInt(hex.slice(4, 6), 16)
        if ([r, g, b].some((n) => Number.isNaN(n))) return null
        return { r, g, b }
    }
    const rgb = raw.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i)
    if (!rgb) return null
    return {
        r: Number(rgb[1]),
        g: Number(rgb[2]),
        b: Number(rgb[3]),
    }
}

function luminance(color: string): number {
    const rgb = parseHex(color)
    if (!rgb) return 0.8
    const toLin = (c: number) => {
        const n = c / 255
        return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * toLin(rgb.r) + 0.7152 * toLin(rgb.g) + 0.0722 * toLin(rgb.b)
}

function mixHex(color: string, toward: string, amount: number): string {
    const a = parseHex(color)
    const b = parseHex(toward)
    if (!a || !b) return color
    const t = Math.min(1, Math.max(0, amount))
    const ch = (x: number, y: number) => Math.round(x + (y - x) * t)
    const hex = (n: number) => n.toString(16).padStart(2, "0")
    return `#${hex(ch(a.r, b.r))}${hex(ch(a.g, b.g))}${hex(ch(a.b, b.b))}`
}

function linger(t: number): number {
    const s = Math.sin(t)
    return s * s * s
}

function buildOrbs(
    count: number,
    colors: string[],
    sizeMin: number,
    sizeMax: number,
    box: number
): OrbPose[] {
    const fit = Math.min(box * 0.62, sizeMax)
    const maxSize = Math.max(48, fit)
    const minSize = Math.min(Math.max(32, sizeMin), maxSize)
    const orbs: OrbPose[] = []
    for (let i = 0; i < count; i++) {
        const slot = REST[i] ?? { x: 0.5, y: 0.5, size: 1, phase: 0 }
        const color = colors[i % colors.length] ?? "#9A6B4A"
        orbs.push({
            x: slot.x,
            y: slot.y,
            size: minSize + (maxSize - minSize) * slot.size,
            color,
            phase: slot.phase,
            periodX: PERIOD_X[i] ?? 16,
            periodY: PERIOD_Y[i] ?? 18,
            periodS: PERIOD_S[i] ?? 11,
        })
    }
    return orbs
}

function isPreviewTarget(): boolean {
    try {
        return RenderTarget.current() === RenderTarget.preview
    } catch {
        return false
    }
}

/**
 * Thinking Orbs
 * Ambient idle orbs. Canvas and export freeze on the rest pose.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 720
 * @framerIntrinsicHeight 480
 */
export default function Kern_ThinkingOrbs(props: KernThinkingOrbsProps) {
    const content = props.content ?? DEFAULT_CONTENT
    const look = props.look ?? DEFAULT_LOOK
    const layout = props.layout ?? DEFAULT_LAYOUT
    const motion = props.motion ?? DEFAULT_MOTION
    const preview = props.preview ?? DEFAULT_PREVIEW
    const style = props.style

    const count = clampCount(content.count)
    const field = typeof look.field === "string" && look.field ? look.field : DEFAULT_FIELD
    const colors = resolveColors(look.colors)
    const opacity = clamp(look.opacity, 0.2, 1, 0.92)
    const blur = clamp(look.blur, 4, 64, 16)
    const sizeMin = clamp(layout.sizeMin, 40, 480, 120)
    const sizeMax = clamp(layout.sizeMax, 80, 720, 240)
    const speed = clamp(motion.speed, 0.1, 2, 0.55)
    const drift = clamp(motion.drift, 0, 80, 28)
    const pause = motion.pause === true
    const affiliate = resolveLink(preview.madeForFramer, AFFILIATE_URL)

    const isStatic = useIsStaticRenderer()
    const reducedMotion = useReducedMotion()
    const freeze = isStatic || reducedMotion === true || pause
    const showCta = !isStatic && isPreviewTarget()

    const rootRef = useRef<HTMLDivElement>(null)
    const orbRefs = useRef<(HTMLDivElement | null)[]>([])
    const [box, setBox] = useState(720)

    useEffect(() => {
        const node = rootRef.current
        if (!node || typeof ResizeObserver === "undefined") return
        const apply = (width: number, height: number) => {
            const next = Math.max(1, Math.min(width, height))
            setBox((prev) => (Math.abs(prev - next) < 1 ? prev : next))
        }
        apply(node.clientWidth, node.clientHeight)
        const ro = new ResizeObserver((entries) => {
            const entry = entries[0]
            if (!entry) return
            apply(entry.contentRect.width, entry.contentRect.height)
        })
        ro.observe(node)
        return () => ro.disconnect()
    }, [])

    const orbs = useMemo(
        () => buildOrbs(count, colors, sizeMin, sizeMax, box),
        [box, colors, count, sizeMax, sizeMin]
    )

    const paper = luminance(field) > 0.45
    const blend: "multiply" | "screen" = paper ? "multiply" : "screen"
    const ctaColor = paper ? "rgba(46, 42, 36, 0.42)" : "rgba(232, 226, 214, 0.42)"
    const ctaHover = paper ? "rgba(46, 42, 36, 0.82)" : "rgba(232, 226, 214, 0.88)"

    useEffect(() => {
        if (freeze) {
            for (const el of orbRefs.current) {
                if (el) el.style.transform = "translate3d(0,0,0) scale(1)"
            }
            return
        }
        if (typeof window === "undefined") return

        let frame = 0
        const start = performance.now()
        const tick = (now: number) => {
            const t = ((now - start) / 1000) * speed
            for (let i = 0; i < orbs.length; i++) {
                const el = orbRefs.current[i]
                const orb = orbs[i]
                if (!el || !orb) continue
                const dx = linger((t * Math.PI * 2) / orb.periodX + orb.phase) * drift
                const dy =
                    linger((t * Math.PI * 2) / orb.periodY + orb.phase * 1.37) * drift * 0.72
                const scale = 1 + linger((t * Math.PI * 2) / orb.periodS + orb.phase) * 0.045
                el.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`
            }
            frame = window.requestAnimationFrame(tick)
        }
        frame = window.requestAnimationFrame(tick)
        return () => window.cancelAnimationFrame(frame)
    }, [drift, freeze, orbs, speed])

    return (
        <div
            ref={rootRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background: field,
                isolation: "isolate",
                ...style,
            }}
        >
            <div
                aria-hidden
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                }}
            >
                {orbs.map((orb, index) => {
                    const highlight = mixHex(orb.color, paper ? "#FFF8EE" : "#F4F0E6", 0.32)
                    const core = mixHex(orb.color, paper ? "#1C1814" : "#0C0C0B", 0.08)
                    const coreBlur = Math.max(4, Math.round(blur * 0.38))
                    return (
                        <div
                            key={index}
                            ref={(node) => {
                                orbRefs.current[index] = node
                            }}
                            style={{
                                position: "absolute",
                                left: `${orb.x * 100}%`,
                                top: `${orb.y * 100}%`,
                                width: orb.size,
                                height: orb.size,
                                marginLeft: -orb.size / 2,
                                marginTop: -orb.size / 2,
                                transform: "translate3d(0,0,0) scale(1)",
                                transformOrigin: "center",
                                willChange: freeze ? "auto" : "transform",
                                pointerEvents: "none",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    inset: "-8%",
                                    borderRadius: "50%",
                                    background: `radial-gradient(circle at 38% 34%, ${orb.color} 0%, transparent 70%)`,
                                    filter: `blur(${blur}px)`,
                                    opacity: opacity * 0.38,
                                    mixBlendMode: blend,
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    inset: "14%",
                                    borderRadius: "50%",
                                    background: `radial-gradient(circle at 36% 32%, ${highlight} 0%, ${core} 42%, ${orb.color} 58%, transparent 72%)`,
                                    filter: `blur(${coreBlur}px)`,
                                    opacity,
                                    mixBlendMode: blend,
                                }}
                            />
                        </div>
                    )
                })}
            </div>
            {showCta ? (
                <>
                    <style>{`
                        .${CTA_CLASS} { color: ${ctaColor}; }
                        .${CTA_CLASS}:hover { color: ${ctaHover}; }
                        .${CTA_CLASS}:focus-visible {
                            color: ${ctaHover};
                            outline: 1px solid currentColor;
                            outline-offset: 4px;
                        }
                    `}</style>
                    <a
                        className={CTA_CLASS}
                        href={affiliate}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            position: "absolute",
                            right: 22,
                            bottom: 20,
                            zIndex: 2,
                            margin: 0,
                            padding: 0,
                            border: "none",
                            background: "none",
                            textDecoration: "none",
                            fontFamily:
                                'Geist, "Inter", system-ui, sans-serif',
                            fontSize: 11,
                            fontWeight: 500,
                            letterSpacing: "0.14em",
                            lineHeight: "1em",
                            textTransform: "uppercase",
                        }}
                    >
                        Made for Framer
                    </a>
                </>
            ) : null}
        </div>
    )
}

Kern_ThinkingOrbs.displayName = "Thinking Orbs"

Kern_ThinkingOrbs.defaultProps = {
    content: DEFAULT_CONTENT,
    look: DEFAULT_LOOK,
    layout: DEFAULT_LAYOUT,
    motion: DEFAULT_MOTION,
    preview: DEFAULT_PREVIEW,
}

addPropertyControls(Kern_ThinkingOrbs, {
    content: {
        type: ControlType.Object,
        title: "Content",
        icon: "object",
        controls: {
            count: {
                type: ControlType.Number,
                title: "Count",
                defaultValue: 3,
                min: 1,
                max: MAX_ORBS,
                step: 1,
                displayStepper: true,
                description: "How many orbs. 1–8.",
            },
        },
        defaultValue: DEFAULT_CONTENT,
    },
    look: {
        type: ControlType.Object,
        title: "Look",
        icon: "color",
        controls: {
            field: {
                type: ControlType.Color,
                title: "Field",
                defaultValue: DEFAULT_FIELD,
                description: "Ground color. Light fields multiply; dark fields screen.",
            },
            colors: {
                type: ControlType.Array,
                title: "Inks",
                control: {
                    type: ControlType.Color,
                    title: "Ink",
                },
                defaultValue: DEFAULT_COLORS,
                maxCount: 4,
                description: "Two to four inks. Cycles if Count is higher.",
            },
            opacity: {
                type: ControlType.Number,
                title: "Opacity",
                defaultValue: 0.92,
                min: 0.2,
                max: 1,
                step: 0.02,
                description: "Ink strength.",
            },
            blur: {
                type: ControlType.Number,
                title: "Blur",
                defaultValue: 16,
                min: 4,
                max: 64,
                step: 1,
                unit: "px",
                description: "Bloom. Keep it modest so the form still reads.",
            },
        },
        defaultValue: DEFAULT_LOOK,
    },
    layout: {
        type: ControlType.Object,
        title: "Layout",
        icon: "object",
        controls: {
            sizeMin: {
                type: ControlType.Number,
                title: "Size Min",
                defaultValue: 120,
                min: 40,
                max: 480,
                step: 4,
                unit: "px",
                description: "Smallest orb. Clamped to the frame.",
            },
            sizeMax: {
                type: ControlType.Number,
                title: "Size Max",
                defaultValue: 240,
                min: 80,
                max: 720,
                step: 4,
                unit: "px",
                description: "Largest orb. Clamped to the frame.",
            },
        },
        defaultValue: DEFAULT_LAYOUT,
    },
    motion: {
        type: ControlType.Object,
        title: "Motion",
        icon: "effect",
        controls: {
            speed: {
                type: ControlType.Number,
                title: "Speed",
                defaultValue: 0.55,
                min: 0.1,
                max: 2,
                step: 0.05,
                description: "Idle tempo. Lower is slower.",
            },
            drift: {
                type: ControlType.Number,
                title: "Drift",
                defaultValue: 28,
                min: 0,
                max: 80,
                step: 1,
                unit: "px",
                description: "How far each orb wanders from rest.",
            },
            pause: {
                type: ControlType.Boolean,
                title: "Pause",
                defaultValue: false,
                enabledTitle: "Still",
                disabledTitle: "Idle",
                description: "Hold the rest pose. Reduced motion does this automatically.",
            },
        },
        defaultValue: DEFAULT_MOTION,
    },
    preview: {
        type: ControlType.Object,
        title: "Preview",
        icon: "object",
        description: PREVIEW_DESCRIPTION,
        controls: {
            exploreMore: {
                type: ControlType.Link,
                title: "Explore more",
                defaultValue: STUDIO_URL,
                description:
                    "BuiltByKern\n[Explore more components](https://www.framer.com/%40builtbykern/)",
            },
            madeForFramer: {
                type: ControlType.Link,
                title: "Made for Framer",
                defaultValue: AFFILIATE_URL,
                description:
                    "[Made for Framer](https://framer.link/qIg9LiG) opens in a new tab. Sign-up attribution only. Does not pause the orbs.",
            },
        },
        defaultValue: DEFAULT_PREVIEW,
    },
})
