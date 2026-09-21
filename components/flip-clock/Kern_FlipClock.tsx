import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { useInView, useReducedMotion } from "framer-motion"
import {
    startTransition,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react"

type Trigger = "in-view" | "mount"
type CanvasPreview = "running" | "soon" | "done"
type EaseName = "linear" | "easeOut" | "easeInOut" | "circOut"
type TriggerInput = Trigger | "In View" | "Mount"
type CanvasPreviewInput = CanvasPreview | "Running" | "Soon" | "Done"
type EaseInput = EaseName | "Linear" | "Ease Out" | "Ease In Out" | "Circ Out"

interface ContentProps {
    targetDate: string
    showDays: boolean
    showHours: boolean
    showMinutes: boolean
    showSeconds: boolean
    labels: boolean
    dayLabel: string
    hourLabel: string
    minuteLabel: string
    secondLabel: string
}

interface LookProps {
    font: CSSProperties
    labelFont: CSSProperties
    color: string
    labelColor: string
    flipLine: boolean
    window: boolean
    gap: number
}

interface MotionProps {
    trigger: TriggerInput
    digitDuration: number
    ease: EaseInput
    canvasPreview: CanvasPreviewInput
}

interface KernFlipClockProps {
    content: ContentProps
    look: LookProps
    motion: MotionProps
    onComplete?: () => void
    builtByKern?: boolean
    style?: CSSProperties
}

interface TimeParts {
    days: number
    hours: number
    minutes: number
    seconds: number
    totalMs: number
}

interface UnitBlock {
    key: "days" | "hours" | "minutes" | "seconds"
    value: number
    digits: number
    label: string
}

const PREVIEW_DESCRIPTION =
    "BuiltByKern\n[Explore more components](https://www.framer.com/%40builtbykern/)\n[Made for Framer](https://framer.link/qIg9LiG)"

/** Demo launch target — far enough to look like a waiting page. */
const DEFAULT_TARGET = "2026-12-31T18:00:00.000Z"

const FROZEN: Record<CanvasPreview, TimeParts> = {
    running: {
        days: 12,
        hours: 14,
        minutes: 36,
        seconds: 8,
        totalMs: 1,
    },
    soon: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 12,
        totalMs: 1,
    },
    done: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMs: 0,
    },
}

const DEFAULT_FONT: CSSProperties = {
    fontSize: "64px",
    fontWeight: 600,
    letterSpacing: "-0.04em",
    lineHeight: "1em",
    textAlign: "center",
}

const DEFAULT_LABEL_FONT: CSSProperties = {
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.14em",
    lineHeight: "1em",
    textAlign: "center",
}

const DEFAULT_CONTENT: ContentProps = {
    targetDate: DEFAULT_TARGET,
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    labels: true,
    dayLabel: "DAYS",
    hourLabel: "HRS",
    minuteLabel: "MIN",
    secondLabel: "SEC",
}

const DEFAULT_LOOK: LookProps = {
    font: DEFAULT_FONT,
    labelFont: DEFAULT_LABEL_FONT,
    color: "#F4F4F0",
    labelColor: "#8A8A82",
    flipLine: true,
    window: true,
    gap: 10,
}

const DEFAULT_MOTION: MotionProps = {
    trigger: "in-view",
    digitDuration: 0.45,
    ease: "easeOut",
    canvasPreview: "running",
}

function clampNumber(value: unknown, fallback: number): number {
    return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function resolveTrigger(trigger: string): Trigger {
    switch (trigger) {
        case "in-view":
        case "In View":
            return "in-view"
        case "mount":
        case "Mount":
            return "mount"
        default:
            return "in-view"
    }
}

function resolveCanvasPreview(value: string): CanvasPreview {
    switch (value) {
        case "running":
        case "Running":
            return "running"
        case "soon":
        case "Soon":
            return "soon"
        case "done":
        case "Done":
            return "done"
        default:
            return "running"
    }
}

function resolveEase(ease: string): EaseName {
    switch (ease) {
        case "linear":
        case "Linear":
            return "linear"
        case "easeOut":
        case "Ease Out":
            return "easeOut"
        case "easeInOut":
        case "Ease In Out":
            return "easeInOut"
        case "circOut":
        case "Circ Out":
            return "circOut"
        default:
            return "easeOut"
    }
}

function easeCss(ease: EaseName): string {
    switch (ease) {
        case "linear":
            return "linear"
        case "easeOut":
            return "cubic-bezier(0.22, 1, 0.36, 1)"
        case "easeInOut":
            return "cubic-bezier(0.65, 0, 0.35, 1)"
        case "circOut":
            return "cubic-bezier(0, 0.55, 0.45, 1)"
        default: {
            const _never: never = ease
            return "cubic-bezier(0.22, 1, 0.36, 1)"
        }
    }
}

function parseTarget(value: string): number | null {
    if (!value) return null
    const ms = Date.parse(value)
    return Number.isFinite(ms) ? ms : null
}

function splitRemaining(ms: number): TimeParts {
    const totalMs = Math.max(0, ms)
    const total = Math.floor(totalMs / 1000)
    const days = Math.floor(total / 86400)
    const hours = Math.floor((total % 86400) / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const seconds = total % 60
    return { days, hours, minutes, seconds, totalMs }
}

function padDigits(value: number, count: number): string {
    const safe = Math.max(0, Math.floor(value))
    return String(safe).padStart(count, "0")
}

/**
 * Flip Clock
 *
 * Waiting-page countdown. Alarm-clock split-flap digits (CSS 3D).
 *
 * @framerIntrinsicWidth 520
 * @framerIntrinsicHeight 120
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function Kern_FlipClock(props: KernFlipClockProps) {
    const {
        content = DEFAULT_CONTENT,
        look = DEFAULT_LOOK,
        motion = DEFAULT_MOTION,
        onComplete,
        style,
    } = props

    const targetDate = content.targetDate || DEFAULT_TARGET
    const showDays = content.showDays !== false
    const showHours = content.showHours !== false
    const showMinutes = content.showMinutes !== false
    const showSeconds = content.showSeconds !== false
    const labels = content.labels !== false
    const dayLabel = content.dayLabel || "DAYS"
    const hourLabel = content.hourLabel || "HRS"
    const minuteLabel = content.minuteLabel || "MIN"
    const secondLabel = content.secondLabel || "SEC"

    const font = look.font ?? DEFAULT_FONT
    const labelFont = look.labelFont ?? DEFAULT_LABEL_FONT
    const color = look.color || "#F4F4F0"
    const labelColor = look.labelColor || "#8A8A82"
    const flipLine = look.flipLine !== false
    const showWindow = look.window !== false
    const gap = Math.max(0, clampNumber(look.gap, 10))

    const trigger = resolveTrigger(motion.trigger ?? "in-view")
    const digitDuration = Math.max(
        0,
        clampNumber(motion.digitDuration, DEFAULT_MOTION.digitDuration)
    )
    const ease = resolveEase(motion.ease ?? "easeOut")
    const canvasPreview = resolveCanvasPreview(
        motion.canvasPreview ?? "running"
    )

    const isStatic = useIsStaticRenderer()
    const prefersReducedMotion = useReducedMotion()
    const reducedMotion = Boolean(prefersReducedMotion)
    const rootRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(rootRef, { once: false, amount: 0.2 })
    const completedRef = useRef(false)

    let shouldTick = false
    switch (trigger) {
        case "mount":
            shouldTick = true
            break
        case "in-view":
            shouldTick = isInView
            break
        default: {
            const _never: never = trigger
            shouldTick = true
        }
    }

    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        if (isStatic || !shouldTick) return
        if (typeof window === "undefined") return

        const id = window.setInterval(() => {
            startTransition(() => setNow(Date.now()))
        }, 250)

        return () => {
            window.clearInterval(id)
        }
    }, [isStatic, shouldTick])

    const liveParts = useMemo(() => {
        const targetMs = parseTarget(targetDate)
        if (targetMs == null) return FROZEN.running
        return splitRemaining(targetMs - now)
    }, [now, targetDate])

    const parts = isStatic ? FROZEN[canvasPreview] : liveParts

    useEffect(() => {
        if (isStatic || reducedMotion) return
        if (parts.totalMs > 0) {
            completedRef.current = false
            return
        }
        if (completedRef.current) return
        completedRef.current = true
        onComplete?.()
    }, [isStatic, onComplete, parts.totalMs, reducedMotion])

    const units = useMemo(() => {
        const list: UnitBlock[] = []
        if (showDays) {
            list.push({
                key: "days",
                value: parts.days,
                digits: Math.max(2, String(parts.days).length),
                label: dayLabel,
            })
        }
        if (showHours) {
            list.push({
                key: "hours",
                value: parts.hours,
                digits: 2,
                label: hourLabel,
            })
        }
        if (showMinutes) {
            list.push({
                key: "minutes",
                value: parts.minutes,
                digits: 2,
                label: minuteLabel,
            })
        }
        if (showSeconds) {
            list.push({
                key: "seconds",
                value: parts.seconds,
                digits: 2,
                label: secondLabel,
            })
        }
        return list
    }, [
        dayLabel,
        hourLabel,
        minuteLabel,
        parts.days,
        parts.hours,
        parts.minutes,
        parts.seconds,
        secondLabel,
        showDays,
        showHours,
        showMinutes,
        showSeconds,
    ])

    const isFixedWidth = style?.width === "100%"
    const isFixedHeight = style?.height === "100%"
    const freezeFlip = isStatic || reducedMotion || digitDuration === 0

    return (
        <div
            ref={rootRef}
            role="timer"
            aria-live="polite"
            aria-label={units
                .map((unit) => `${padDigits(unit.value, unit.digits)} ${unit.label}`)
                .join(", ")}
            style={{
                ...style,
                position: "relative",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "center",
                gap,
                width: isFixedWidth ? "100%" : "max-content",
                height: isFixedHeight ? "100%" : "auto",
                minWidth: "max-content",
                color,
                ...font,
            }}
        >
            {units.map((unit, index) => (
                <div
                    key={unit.key}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap,
                    }}
                >
                    {index > 0 ? (
                        <Colon color={color} fontSize={font.fontSize} />
                    ) : null}
                    <Unit
                        value={unit.value}
                        digits={unit.digits}
                        label={unit.label}
                        showLabel={labels}
                        color={color}
                        labelColor={labelColor}
                        labelFont={labelFont}
                        flipLine={flipLine}
                        showWindow={showWindow}
                        digitDuration={digitDuration}
                        ease={ease}
                        freezeFlip={freezeFlip}
                    />
                </div>
            ))}
        </div>
    )
}

function Colon(props: { color: string; fontSize?: string | number }) {
    return (
        <div
            aria-hidden="true"
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "1.15em",
                paddingTop: "0.08em",
                gap: "0.18em",
                opacity: 0.45,
                color: props.color,
                fontSize: props.fontSize,
            }}
        >
            <span
                style={{
                    width: "0.12em",
                    height: "0.12em",
                    borderRadius: "50%",
                    background: "currentColor",
                }}
            />
            <span
                style={{
                    width: "0.12em",
                    height: "0.12em",
                    borderRadius: "50%",
                    background: "currentColor",
                }}
            />
        </div>
    )
}

function Unit(props: {
    value: number
    digits: number
    label: string
    showLabel: boolean
    color: string
    labelColor: string
    labelFont: CSSProperties
    flipLine: boolean
    showWindow: boolean
    digitDuration: number
    ease: EaseName
    freezeFlip: boolean
}) {
    const text = padDigits(props.value, props.digits)

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.45em",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "0.08em",
                }}
            >
                {text.split("").map((digit, index) => (
                    <FlipDigit
                        key={`${props.digits}-${index}`}
                        digit={digit}
                        color={props.color}
                        flipLine={props.flipLine}
                        showWindow={props.showWindow}
                        digitDuration={props.digitDuration}
                        ease={props.ease}
                        freezeFlip={props.freezeFlip}
                    />
                ))}
            </div>
            {props.showLabel ? (
                <span
                    style={{
                        ...props.labelFont,
                        color: props.labelColor,
                        textTransform: "uppercase",
                        width: "max-content",
                    }}
                >
                    {props.label}
                </span>
            ) : null}
        </div>
    )
}

const DIGIT_FACE_BG = "rgba(14, 14, 14, 0.97)"

function DigitGlyph(props: { value: string; color: string }) {
    return (
        <span
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "1.15em",
                fontVariantNumeric: "tabular-nums",
                color: props.color,
                lineHeight: 1,
            }}
        >
            {props.value}
        </span>
    )
}

function HalfPanel(props: {
    value: string
    color: string
    half: "top" | "bottom"
    zIndex: number
}) {
    const isTop = props.half === "top"
    return (
        <span
            aria-hidden="true"
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: isTop ? 0 : "50%",
                height: "50%",
                overflow: "hidden",
                zIndex: props.zIndex,
                background: DIGIT_FACE_BG,
            }}
        >
            <span
                style={{
                    display: "block",
                    height: "200%",
                    marginTop: isTop ? 0 : "-100%",
                }}
            >
                <DigitGlyph value={props.value} color={props.color} />
            </span>
        </span>
    )
}

/**
 * Mechanical split-flap: static halves + hinged card (front=old, back=new)
 * rotating on X through −180°.
 */
function FlipDigit(props: {
    digit: string
    color: string
    flipLine: boolean
    showWindow: boolean
    digitDuration: number
    ease: EaseName
    freezeFlip: boolean
}) {
    const { digit, color, flipLine, showWindow, digitDuration, ease, freezeFlip } =
        props
    const settledRef = useRef(digit)
    const [current, setCurrent] = useState(digit)
    const [previous, setPrevious] = useState(digit)
    const [flipping, setFlipping] = useState(false)
    const [fold, setFold] = useState(0)

    useEffect(() => {
        if (digit === settledRef.current) return

        if (freezeFlip) {
            settledRef.current = digit
            setCurrent(digit)
            setPrevious(digit)
            setFlipping(false)
            setFold(0)
            return
        }

        const from = settledRef.current
        settledRef.current = digit
        setPrevious(from)
        setCurrent(digit)
        setFlipping(true)
        setFold(0)

        let frameA = 0
        let frameB = 0
        let timeout = 0
        if (typeof window !== "undefined") {
            frameA = window.requestAnimationFrame(() => {
                frameB = window.requestAnimationFrame(() => {
                    setFold(-180)
                })
            })
            timeout = window.setTimeout(() => {
                setPrevious(digit)
                setFlipping(false)
                setFold(0)
            }, digitDuration * 1000)
        }

        return () => {
            if (typeof window !== "undefined") {
                window.cancelAnimationFrame(frameA)
                window.cancelAnimationFrame(frameB)
                window.clearTimeout(timeout)
            }
        }
    }, [digit, digitDuration, freezeFlip])

                const topValue = current
    const bottomValue = flipping ? previous : current
    const radius = showWindow ? "0.1em" : 0

    return (
        <span
            style={{
                display: "inline-block",
                position: "relative",
                width: "0.72em",
                height: "1.15em",
                borderRadius: radius,
                background: showWindow ? DIGIT_FACE_BG : "transparent",
                boxShadow: showWindow
                    ? `inset 0 0 0 1px color-mix(in srgb, ${color} 22%, transparent)`
                    : undefined,
                perspective: "900px",
                perspectiveOrigin: "50% 50%",
                lineHeight: 1,
                // Keep 3D; clip only the static halves, not this wrapper.
                overflow: "visible",
            }}
        >
            <span
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: radius,
                    transformStyle: "preserve-3d",
                    // Soft mask so flaps don’t bleed past the window.
                    clipPath: showWindow
                        ? "inset(0 round 0.1em)"
                        : undefined,
                }}
            >
                <HalfPanel
                    value={topValue}
                    color={color}
                    half="top"
                    zIndex={1}
                />
                <HalfPanel
                    value={bottomValue}
                    color={color}
                    half="bottom"
                    zIndex={1}
                />

                {flipping ? (
                    <span
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 4,
                            transformStyle: "preserve-3d",
                            transform: `rotateX(${fold}deg)`,
                            transition: `transform ${digitDuration}s ${easeCss(ease)}`,
                            willChange: "transform",
                            transformOrigin: "50% 50%",
                        }}
                    >
                        {/* Front = outgoing digit */}
                        <span
                            style={{
                                position: "absolute",
                                inset: 0,
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                background: DIGIT_FACE_BG,
                                borderRadius: radius,
                                overflow: "hidden",
                                boxShadow:
                                    "inset 0 -0.35em 0.55em rgba(0,0,0,0.35)",
                            }}
                        >
                            <DigitGlyph value={previous} color={color} />
                        </span>
                        {/* Back = incoming digit (pre-rotated so it reads upright at −180°) */}
                        <span
                            style={{
                                position: "absolute",
                                inset: 0,
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                transform: "rotateX(180deg)",
                                background: DIGIT_FACE_BG,
                                borderRadius: radius,
                                overflow: "hidden",
                                boxShadow:
                                    "inset 0 0.35em 0.55em rgba(0,0,0,0.35)",
                            }}
                        >
                            <DigitGlyph value={current} color={color} />
                        </span>
                    </span>
                ) : null}

                {flipLine ? (
                    <span
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            left: "6%",
                            right: "6%",
                            top: "50%",
                            height: 1,
                            background: color,
                            opacity: 0.34,
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            zIndex: 6,
                            boxShadow: "0 1px 0 rgba(0,0,0,0.45)",
                        }}
                    />
                ) : null}

                {showWindow ? (
                    <span
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            borderRadius: radius,
                            background:
                                "linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, transparent 28%, transparent 72%, rgba(0,0,0,0.32) 100%)",
                            zIndex: 5,
                        }}
                    />
                ) : null}
            </span>
        </span>
    )
}

Kern_FlipClock.displayName = "Flip Clock"

Kern_FlipClock.defaultProps = {
    content: DEFAULT_CONTENT,
    look: DEFAULT_LOOK,
    motion: DEFAULT_MOTION,
}

addPropertyControls(Kern_FlipClock, {
    content: {
        type: ControlType.Object,
        title: "Content",
        icon: "object",
        controls: {
            targetDate: {
                type: ControlType.Date,
                title: "Target",
                displayTime: true,
                defaultValue: DEFAULT_TARGET,
                description: "Launch / unlock moment. Counts down to this.",
            },
            showDays: {
                type: ControlType.Boolean,
                title: "Days",
                defaultValue: true,
                enabledTitle: "Show",
                disabledTitle: "Hide",
            },
            showHours: {
                type: ControlType.Boolean,
                title: "Hours",
                defaultValue: true,
                enabledTitle: "Show",
                disabledTitle: "Hide",
            },
            showMinutes: {
                type: ControlType.Boolean,
                title: "Minutes",
                defaultValue: true,
                enabledTitle: "Show",
                disabledTitle: "Hide",
            },
            showSeconds: {
                type: ControlType.Boolean,
                title: "Seconds",
                defaultValue: true,
                enabledTitle: "Show",
                disabledTitle: "Hide",
            },
            labels: {
                type: ControlType.Boolean,
                title: "Labels",
                defaultValue: true,
                enabledTitle: "On",
                disabledTitle: "Off",
                description: "DAYS / HRS / MIN / SEC under each unit.",
            },
            dayLabel: {
                type: ControlType.String,
                title: "Day Label",
                defaultValue: "DAYS",
                hidden: (props) => props.labels === false,
            },
            hourLabel: {
                type: ControlType.String,
                title: "Hour Label",
                defaultValue: "HRS",
                hidden: (props) => props.labels === false,
            },
            minuteLabel: {
                type: ControlType.String,
                title: "Minute Label",
                defaultValue: "MIN",
                hidden: (props) => props.labels === false,
            },
            secondLabel: {
                type: ControlType.String,
                title: "Second Label",
                defaultValue: "SEC",
                hidden: (props) => props.labels === false,
            },
        },
        defaultValue: DEFAULT_CONTENT,
    },
    look: {
        type: ControlType.Object,
        title: "Look",
        icon: "color",
        controls: {
            font: {
                type: ControlType.Font,
                title: "Digits",
                controls: "extended",
                defaultFontType: "sans-serif",
                defaultValue: {
                    fontSize: "64px",
                    variant: "Semibold",
                    letterSpacing: "-0.04em",
                    lineHeight: "1em",
                    textAlign: "center",
                },
            },
            labelFont: {
                type: ControlType.Font,
                title: "Labels",
                controls: "extended",
                defaultFontType: "sans-serif",
                defaultValue: {
                    fontSize: "11px",
                    variant: "Medium",
                    letterSpacing: "0.14em",
                    lineHeight: "1em",
                    textAlign: "center",
                },
            },
            color: {
                type: ControlType.Color,
                title: "Digit Color",
                defaultValue: "#F4F4F0",
            },
            labelColor: {
                type: ControlType.Color,
                title: "Label Color",
                defaultValue: "#8A8A82",
            },
            flipLine: {
                type: ControlType.Boolean,
                title: "Flip Line",
                defaultValue: true,
                enabledTitle: "On",
                disabledTitle: "Off",
                description: "Equator across each digit window.",
            },
            window: {
                type: ControlType.Boolean,
                title: "Window",
                defaultValue: true,
                enabledTitle: "On",
                disabledTitle: "Off",
                description: "Soft aperture around each digit.",
            },
            gap: {
                type: ControlType.Number,
                title: "Gap",
                defaultValue: 10,
                min: 0,
                max: 48,
                step: 1,
                unit: "px",
                description: "Space between units and colons.",
            },
        },
        defaultValue: DEFAULT_LOOK,
    },
    motion: {
        type: ControlType.Object,
        title: "Motion",
        icon: "effect",
        controls: {
            trigger: {
                type: ControlType.Enum,
                title: "Trigger",
                options: ["in-view", "mount"],
                optionTitles: ["In View", "Mount"],
                defaultValue: "in-view",
                displaySegmentedControl: true,
                description: "When the live countdown ticks.",
            },
            digitDuration: {
                type: ControlType.Number,
                title: "Flip",
                defaultValue: 0.45,
                min: 0,
                max: 1.5,
                step: 0.05,
                unit: "s",
                description: "How long each digit rolls when it changes.",
            },
            ease: {
                type: ControlType.Enum,
                title: "Ease",
                options: ["linear", "easeOut", "easeInOut", "circOut"],
                optionTitles: ["Linear", "Ease Out", "Ease In Out", "Circ Out"],
                defaultValue: "easeOut",
            },
            canvasPreview: {
                type: ControlType.Enum,
                title: "Canvas Preview",
                options: ["running", "soon", "done"],
                optionTitles: ["Running", "Soon", "Done"],
                defaultValue: "running",
                displaySegmentedControl: true,
                description:
                    "Frozen waiting-page frame on the canvas and in exports.",
            },
        },
        defaultValue: DEFAULT_MOTION,
    },
    onComplete: {
        type: ControlType.EventHandler,
        title: "On Complete",
        description: `Fires once when the countdown hits zero.\n\n${PREVIEW_DESCRIPTION}`,
    },
    builtByKern: {
        type: ControlType.Boolean,
        title: "BuiltByKern",
        defaultValue: true,
        hidden: true,
        description: PREVIEW_DESCRIPTION,
    },
})
