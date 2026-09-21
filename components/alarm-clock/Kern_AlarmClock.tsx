import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
    startTransition,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react"

type EndMode = "zeros" | "label" | "hide"
type DigitMotion = "fade" | "flip" | "none"

type EndModeInput = EndMode | "Zeros" | "Label" | "Hide"
type DigitMotionInput = DigitMotion | "Fade" | "Flip" | "None"

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
    label: string
}

interface ContentProps {
    targetDate: string
    timeZone: string
    showDays: boolean
    showHours: boolean
    showMinutes: boolean
    showSeconds: boolean
    padZeros: boolean
    labels: boolean
    labelDays: string
    labelHours: string
    labelMinutes: string
    labelSeconds: string
}

interface LookProps {
    accent: string
    paper: string
    ink: string
    size: number
    showBody: boolean
}

interface MotionProps {
    digitMotion: DigitMotionInput
}

interface EndProps {
    endMode: EndModeInput
    endLabel: string
}

interface PreviewProps {
    remaining: string
    exploreMore: string
    madeForFramer: string
}

interface KernAlarmClockProps {
    content: ContentProps
    look: LookProps
    motion: MotionProps
    end: EndProps
    preview: PreviewProps
    onComplete?: () => void
    style?: CSSProperties
}

const DEFAULT_TARGET = "2026-12-31T23:59:59"
const DEFAULT_PREVIEW_REMAINING = "02:17:45:08"
const STUDIO_URL = "https://www.framer.com/@builtbykern/"
const AFFILIATE_URL = "https://framer.link/qIg9LiG"
const PREVIEW_DESCRIPTION =
    "BuiltByKern\n[Explore more components](https://www.framer.com/%40builtbykern/)\n[Made for Framer](https://framer.link/qIg9LiG)"

/** Second-tick is frequent — keep motion short and calm. */
const MOTION_MS = 220
const MOTION_EASE = [0.22, 1, 0.36, 1] as const
const MOTION_SEC = MOTION_MS / 1000
/** Flip is two half-folds; total still under the 280ms hard cap. */
const FLIP_TOTAL_MS = 240
const FLIP_HALF_MS = FLIP_TOTAL_MS / 2
const FLIP_HALF_SEC = FLIP_HALF_MS / 1000
const FLIP_TOTAL_SEC = FLIP_TOTAL_MS / 1000

const DEFAULT_CONTENT: ContentProps = {
    targetDate: DEFAULT_TARGET,
    timeZone: "",
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    padZeros: true,
    labels: true,
    labelDays: "Days",
    labelHours: "Hours",
    labelMinutes: "Minutes",
    labelSeconds: "Seconds",
}

const DEFAULT_LOOK: LookProps = {
    accent: "#C45C26",
    paper: "#F4F3F0",
    ink: "#0A0A0A",
    size: 320,
    showBody: true,
}

const DEFAULT_MOTION: MotionProps = {
    digitMotion: "fade",
}

const DEFAULT_END: EndProps = {
    endMode: "label",
    endLabel: "We're live",
}

const DEFAULT_PREVIEW: PreviewProps = {
    remaining: DEFAULT_PREVIEW_REMAINING,
    exploreMore: STUDIO_URL,
    madeForFramer: AFFILIATE_URL,
}

const defaultProps: Partial<KernAlarmClockProps> = {
    content: DEFAULT_CONTENT,
    look: DEFAULT_LOOK,
    motion: DEFAULT_MOTION,
    end: DEFAULT_END,
    preview: DEFAULT_PREVIEW,
}

function resolveEndMode(value: string): EndMode {
    switch (value) {
        case "zeros":
        case "Zeros":
            return "zeros"
        case "hide":
        case "Hide":
            return "hide"
        case "label":
        case "Label":
            return "label"
        default:
            return "label"
    }
}

function resolveDigitMotion(value: string): DigitMotion {
    switch (value) {
        case "flip":
        case "Flip":
            return "flip"
        case "none":
        case "None":
            return "none"
        case "fade":
        case "Fade":
            return "fade"
        default:
            return "fade"
    }
}

function normalizeColor(value: string): string {
    const raw = (value || "").trim().toLowerCase().replace(/\s+/g, "")
    const rgb = raw.match(/^rgb\((\d+),(\d+),(\d+)\)$/)
    if (rgb) {
        const hex = [rgb[1], rgb[2], rgb[3]]
            .map((n) => Number(n).toString(16).padStart(2, "0"))
            .join("")
        return `#${hex}`
    }
    return raw
}

function channelRgb(color: string): [number, number, number] | null {
    const c = normalizeColor(color)
    const hex = c.match(/^#([0-9a-f]{6})$/i)
    if (hex) {
        const n = parseInt(hex[1], 16)
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    }
    const rgba = c.match(/^rgba?\((\d+),(\d+),(\d+)/)
    if (rgba) return [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])]
    return null
}

/** Relative luminance 0–1. Dark paper → glass lip / shadow set for dark sites. */
function relativeLuminance(color: string): number | null {
    const rgb = channelRgb(color)
    if (!rgb) return null
    const [r, g, b] = rgb.map((v) => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function isDarkPaper(paper: string): boolean {
    const L = relativeLuminance(paper)
    return L != null && L < 0.28
}

function isLightInk(ink: string): boolean {
    const L = relativeLuminance(ink)
    return L != null && L > 0.55
}

function muteInk(ink: string): string {
    const rgb = channelRgb(ink)
    if (!rgb) return "rgba(107,107,107,0.85)"
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.5)`
}

function clampSize(size: number): number {
    if (!Number.isFinite(size)) return 320
    return Math.min(720, Math.max(160, size))
}

function hasExplicitOffset(value: string): boolean {
    return /([zZ]|[+-]\d{2}:?\d{2})$/.test(value.trim())
}

function readParts(
    parts: Intl.DateTimeFormatPart[]
): {
    year: number
    month: number
    day: number
    hour: number
    minute: number
    second: number
} {
    const get = (type: Intl.DateTimeFormatPartTypes) => {
        const raw = parts.find((p) => p.type === type)?.value
        return Number(raw)
    }
    return {
        year: get("year"),
        month: get("month"),
        day: get("day"),
        hour: get("hour"),
        minute: get("minute"),
        second: get("second"),
    }
}

/** Interpret naive wall time (YYYY-MM-DDTHH:mm:ss) in an IANA zone → UTC ms. */
function zonedWallTimeToUtcMs(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    timeZone: string
): number | null {
    try {
        const dtf = new Intl.DateTimeFormat("en-US", {
            timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23",
        })
        const wanted = Date.UTC(year, month - 1, day, hour, minute, second)
        let utc = wanted
        for (let i = 0; i < 3; i++) {
            const got = readParts(dtf.formatToParts(new Date(utc)))
            if (
                !Number.isFinite(got.year) ||
                !Number.isFinite(got.month) ||
                !Number.isFinite(got.day)
            ) {
                return null
            }
            const asUtc = Date.UTC(
                got.year,
                got.month - 1,
                got.day,
                got.hour,
                got.minute,
                got.second
            )
            utc += wanted - asUtc
        }
        return utc
    } catch {
        return null
    }
}

function parseTargetMs(value: string, timeZone = ""): number | null {
    if (!value) return null
    const trimmed = value.trim()

    if (hasExplicitOffset(trimmed)) {
        const ms = Date.parse(trimmed)
        return Number.isFinite(ms) ? ms : null
    }

    const match = trimmed.match(
        /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/
    )
    const tz = timeZone.trim()
    if (match && tz) {
        const year = Number(match[1])
        const month = Number(match[2])
        const day = Number(match[3])
        const hour = Number(match[4] ?? 0)
        const minute = Number(match[5] ?? 0)
        const second = Number(match[6] ?? 0)
        const zoned = zonedWallTimeToUtcMs(
            year,
            month,
            day,
            hour,
            minute,
            second,
            tz
        )
        if (zoned != null) return zoned
    }

    const ms = Date.parse(trimmed)
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

function parsePreviewRemaining(value: string): TimeParts {
    const parts = (value || DEFAULT_PREVIEW_REMAINING).split(":").map((p) => Number(p))
    const [days = 2, hours = 17, minutes = 45, seconds = 8] = parts
    const safe = {
        days: Number.isFinite(days) ? Math.max(0, Math.floor(days)) : 2,
        hours: Number.isFinite(hours) ? Math.max(0, Math.floor(hours)) : 17,
        minutes: Number.isFinite(minutes) ? Math.max(0, Math.floor(minutes)) : 45,
        seconds: Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 8,
    }
    const totalMs =
        (((safe.days * 24 + safe.hours) * 60 + safe.minutes) * 60 +
            safe.seconds) *
        1000
    return { ...safe, totalMs }
}

function formatUnit(value: number, padZeros: boolean, width: number): string {
    const safe = Math.max(0, Math.floor(value))
    if (!padZeros) return String(safe)
    return String(safe).padStart(width, "0")
}

/**
 * Alarm Clock
 *
 * Desk-alarm object. Face counts down to a launch datetime.
 *
 * @framerIntrinsicWidth 320
 * @framerIntrinsicHeight 240
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function Kern_AlarmClock(props: KernAlarmClockProps) {
    const content = { ...DEFAULT_CONTENT, ...props.content }
    const look = { ...DEFAULT_LOOK, ...props.look }
    const motion = { ...DEFAULT_MOTION, ...props.motion }
    const end = { ...DEFAULT_END, ...props.end }
    const preview = { ...DEFAULT_PREVIEW, ...props.preview }
    const { onComplete, style } = props

    const {
        targetDate,
        timeZone,
        showDays,
        showHours,
        showMinutes,
        showSeconds,
        padZeros,
        labels,
        labelDays,
        labelHours,
        labelMinutes,
        labelSeconds,
    } = content
    const { accent, paper, ink, size: sizeProp, showBody } = look
    const { digitMotion: motionInput } = motion
    const { endMode: endModeInput, endLabel } = end
    const { remaining: previewRemaining } = preview
    // Panel-only studio links — not rendered in the object
    void preview.exploreMore
    void preview.madeForFramer

    const endMode = resolveEndMode(String(endModeInput))
    const digitMotion = resolveDigitMotion(String(motionInput))
    const size = clampSize(typeof sizeProp === "number" ? sizeProp : 320)
    const zone = typeof timeZone === "string" ? timeZone.trim() : ""

    const isStatic = useIsStaticRenderer()
    const prefersReducedMotion = useReducedMotion()
    const reducedMotion = Boolean(prefersReducedMotion)
    const freeze = isStatic
    const motionMode: DigitMotion =
        freeze || reducedMotion ? "none" : digitMotion

    const darkPaper = isDarkPaper(paper)
    const inkMute = muteInk(ink)

    let daysOn = showDays !== false
    let hoursOn = showHours !== false
    let minutesOn = showMinutes !== false
    let secondsOn = showSeconds !== false
    if (!daysOn && !hoursOn && !minutesOn && !secondsOn) {
        minutesOn = true
        secondsOn = true
    }

    const [now, setNow] = useState(() => Date.now())
    const completedRef = useRef(false)

    useEffect(() => {
        if (freeze) return
        if (typeof window === "undefined") return
        const id = window.setInterval(() => {
            startTransition(() => setNow(Date.now()))
        }, 250)
        return () => window.clearInterval(id)
    }, [freeze])

    const liveParts = useMemo(() => {
        const targetMs = parseTargetMs(targetDate, zone)
        if (targetMs == null) return splitRemaining(0)
        return splitRemaining(targetMs - now)
    }, [now, targetDate, zone])

    const parts = freeze ? parsePreviewRemaining(previewRemaining) : liveParts
    const finished = parts.totalMs <= 0
    const fireComplete = !freeze && finished

    useEffect(() => {
        if (freeze || reducedMotion) return
        if (!fireComplete) {
            completedRef.current = false
            return
        }
        if (completedRef.current) return
        completedRef.current = true
        onComplete?.()
    }, [fireComplete, freeze, onComplete, reducedMotion])

    const units = useMemo(() => {
        const list: UnitBlock[] = []
        if (daysOn) {
            list.push({ key: "days", value: parts.days, label: labelDays })
        }
        if (hoursOn) {
            list.push({ key: "hours", value: parts.hours, label: labelHours })
        }
        if (minutesOn) {
            list.push({
                key: "minutes",
                value: parts.minutes,
                label: labelMinutes,
            })
        }
        if (secondsOn) {
            list.push({
                key: "seconds",
                value: parts.seconds,
                label: labelSeconds,
            })
        }
        return list
    }, [
        daysOn,
        hoursOn,
        labelDays,
        labelHours,
        labelMinutes,
        labelSeconds,
        minutesOn,
        parts.days,
        parts.hours,
        parts.minutes,
        parts.seconds,
        secondsOn,
    ])

    const isFixedWidth = style?.width === "100%"
    const width = isFixedWidth ? "100%" : size
    const unitCount = Math.max(1, units.length)
    const bodyRadius = Math.max(6, Math.min(8, Math.round(size * 0.016)))
    const unitGap = Math.max(6, Math.round(size * (unitCount >= 4 ? 0.018 : 0.028)))
    const showEndLabel = finished && endMode === "label"
    const showZeros = finished && endMode === "zeros"
    const hideFace = finished && endMode === "hide"

    const displayUnits = showZeros
        ? units.map((u) => ({ ...u, value: 0 }))
        : units

    const faceRef = useRef<HTMLDivElement>(null)
    const [faceWidth, setFaceWidth] = useState(0)

    useEffect(() => {
        const el = faceRef.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver((entries) => {
            const next = entries[0]?.contentRect.width ?? 0
            startTransition(() => setFaceWidth(next))
        })
        ro.observe(el)
        startTransition(() => setFaceWidth(el.clientWidth))
        return () => ro.disconnect()
    }, [size, showBody, unitCount])

    const maxChars = Math.max(
        2,
        ...displayUnits.map((u) =>
            formatUnit(
                u.value,
                padZeros,
                u.key === "days"
                    ? Math.max(2, String(u.value).length)
                    : 2
            ).length
        )
    )

    // Fit digits inside the face — leave air for labels + motion clip.
    const digitSize = useMemo(() => {
        const padX = Math.round(size * 0.046) * 2
        const budget =
            faceWidth > 0
                ? Math.max(48, faceWidth - padX)
                : size * (showBody ? 0.66 : 0.82)
        const gaps = (unitCount - 1) * unitGap
        const longestLabel = labels
            ? Math.max(1, ...displayUnits.map((u) => u.label.length))
            : 0
        // Digits + colons; labels can be wider than a 2-digit pair ("Seconds").
        const digitCoeff =
            unitCount * maxChars * 0.64 + Math.max(0, unitCount - 1) * 0.22
        const labelCoeff = labels ? unitCount * longestLabel * 0.09 : 0
        const coeff = Math.max(digitCoeff, labelCoeff)
        const fitted = ((budget - gaps) / Math.max(0.5, coeff)) * 0.86
        const softCap =
            unitCount >= 4
                ? size * 0.102
                : unitCount === 3
                  ? size * 0.132
                  : size * 0.162
        return Math.max(16, Math.min(Math.floor(fitted), Math.round(softCap)))
    }, [
        faceWidth,
        size,
        showBody,
        unitCount,
        unitGap,
        maxChars,
        labels,
        displayUnits,
    ])

    const ariaSummary = displayUnits
        .map((u) => `${u.value} ${u.label}`)
        .join(", ")

    return (
        <div
            style={{
                ...style,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: isFixedWidth ? "100%" : "max-content",
                height: style?.height === "100%" ? "100%" : "auto",
            }}
        >
            <div
                role="timer"
                aria-live="off"
                aria-label={ariaSummary || endLabel}
                style={{
                    position: "relative",
                    width,
                    maxWidth: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {showBody ? (
                    <div
                        aria-hidden="true"
                        style={{
                            position: "relative",
                            width: "42%",
                            height: Math.max(22, Math.round(size * 0.072)),
                            marginBottom: -size * 0.012,
                            zIndex: 2,
                        }}
                    >
                        {/* Braun-ish handle — keep aspect so thumb ≠ snooze blob */}
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 100 32"
                            preserveAspectRatio="xMidYMax meet"
                            style={{ display: "block", overflow: "visible" }}
                        >
                            <path
                                d="M16 30 V14 C16 5 30 2 50 2 C70 2 84 5 84 14 V30"
                                fill="none"
                                stroke={accent}
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="50" cy="2.2" r="2.1" fill={accent} />
                        </svg>
                    </div>
                ) : null}

                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        overflow: "hidden",
                        background: showBody ? paper : "transparent",
                        borderRadius: showBody ? bodyRadius : 0,
                        padding: showBody
                            ? `${Math.round(size * 0.055)}px ${Math.round(size * 0.045)}px ${Math.round(size * 0.06)}px`
                            : 0,
                        boxShadow: showBody
                            ? darkPaper
                                ? "0 10px 24px rgba(0,0,0,0.4)"
                                : "0 10px 22px rgba(40,32,24,0.07)"
                            : undefined,
                        border: showBody
                            ? darkPaper
                                ? "1px solid rgba(255,255,255,0.1)"
                                : "1px solid rgba(40,32,24,0.1)"
                            : undefined,
                    }}
                >
                    {showBody ? (
                        <span
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "inherit",
                                opacity: darkPaper ? 0.08 : 0.035,
                                pointerEvents: "none",
                                backgroundImage:
                                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
                                mixBlendMode: darkPaper ? "soft-light" : "multiply",
                                zIndex: 0,
                            }}
                        />
                    ) : null}

                    <div
                        ref={faceRef}
                        style={{
                            position: "relative",
                            overflow: "hidden",
                            background: darkPaper
                                ? "rgba(255,255,255,0.045)"
                                : "#FFFEFB",
                            borderRadius: Math.max(4, bodyRadius - 2),
                            padding: `${Math.round(size * 0.055)}px ${Math.round(size * 0.046)}px ${Math.round(size * 0.052)}px`,
                            boxShadow: showBody
                                ? darkPaper
                                    ? "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -10px 18px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.08)"
                                    : "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -12px 20px rgba(40,32,24,0.045), inset 0 0 0 1px rgba(40,32,24,0.07)"
                                : undefined,
                            minHeight: size * 0.36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                    >
                        {showBody ? (
                            <span
                                aria-hidden="true"
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    height: "42%",
                                    pointerEvents: "none",
                                    borderRadius: "inherit",
                                    background: darkPaper
                                        ? "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 100%)"
                                        : "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)",
                                    zIndex: 1,
                                }}
                            />
                        ) : null}
                        {hideFace ? null : showEndLabel ? (
                            <div
                                style={{
                                    position: "relative",
                                    zIndex: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: Math.max(8, size * 0.022),
                                    padding: `${Math.round(size * 0.01)}px ${Math.round(size * 0.04)}px`,
                                    width: "100%",
                                    maxWidth: "100%",
                                    boxSizing: "border-box",
                                }}
                            >
                                <span
                                    style={{
                                        width: Math.max(32, size * 0.09),
                                        height: 2,
                                        background: accent,
                                        borderRadius: 1,
                                    }}
                                />
                                <span
                                    style={{
                                        color: ink,
                                        fontSize: Math.max(
                                            22,
                                            Math.min(
                                                digitSize * 0.72,
                                                size * 0.078
                                            )
                                        ),
                                        fontWeight: 700,
                                        letterSpacing: "-0.045em",
                                        textAlign: "center",
                                        lineHeight: 1.05,
                                        maxWidth: "100%",
                                    }}
                                >
                                    {endLabel}
                                </span>
                                <span
                                    style={{
                                        color: inkMute,
                                        fontSize: Math.max(
                                            9,
                                            Math.round(digitSize * 0.155)
                                        ),
                                        fontWeight: 500,
                                        letterSpacing: "0.18em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Now
                                </span>
                            </div>
                        ) : (
                            <div
                                style={{
                                    position: "relative",
                                    zIndex: 2,
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "flex-start",
                                    justifyContent: "center",
                                    gap: unitGap,
                                    width: "100%",
                                    minWidth: 0,
                                    boxSizing: "border-box",
                                }}
                            >
                                {displayUnits.map((unit, index) => (
                                    <div
                                        key={unit.key}
                                        style={{
                                            display: "contents",
                                        }}
                                    >
                                        {index > 0 ? (
                                            <Colon
                                                color={ink}
                                                height={digitSize * 1.02}
                                            />
                                        ) : null}
                                        <Unit
                                            text={formatUnit(
                                                unit.value,
                                                padZeros,
                                                unit.key === "days"
                                                    ? Math.max(
                                                          2,
                                                          String(unit.value)
                                                              .length
                                                      )
                                                    : 2
                                            )}
                                            label={unit.label}
                                            showLabel={labels}
                                            ink={ink}
                                            inkMute={inkMute}
                                            digitSize={digitSize}
                                            motion={motionMode}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {showBody ? (
                    <div
                        aria-hidden="true"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "58%",
                            marginTop: Math.max(0, Math.round(size * 0.004)),
                            zIndex: 0,
                        }}
                    >
                        <Foot accent={accent} size={size} />
                        <Foot accent={accent} size={size} />
                    </div>
                ) : null}
            </div>
        </div>
    )
}

function Foot(props: { accent: string; size: number }) {
    const w = Math.max(18, Math.round(props.size * 0.058))
    const h = Math.max(5, Math.round(props.size * 0.016))
    return (
        <span
            style={{
                width: w,
                height: h,
                borderRadius: 1,
                background: props.accent,
                opacity: 0.9,
                boxShadow: "0 1px 0 rgba(0,0,0,0.14)",
            }}
        />
    )
}

function Colon(props: { color: string; height: number }) {
    const markW = Math.max(2, Math.round(props.height * 0.042))
    const markH = Math.max(2.5, Math.round(props.height * 0.058))
    return (
        <div
            aria-hidden="true"
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: props.height,
                gap: props.height * 0.155,
                paddingBottom: 0,
                alignSelf: "flex-start",
                marginTop: props.height * 0.12,
                opacity: 0.34,
            }}
        >
            <span
                style={{
                    width: markW,
                    height: markH,
                    borderRadius: 0.6,
                    background: props.color,
                }}
            />
            <span
                style={{
                    width: markW,
                    height: markH,
                    borderRadius: 0.6,
                    background: props.color,
                }}
            />
        </div>
    )
}

function Unit(props: {
    text: string
    label: string
    showLabel: boolean
    ink: string
    inkMute: string
    digitSize: number
    motion: DigitMotion
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: Math.max(7, props.digitSize * 0.16),
                minWidth: 0,
                flex: "0 1 auto",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 0,
                    fontSize: props.digitSize,
                    fontWeight: 700,
                    letterSpacing: "-0.06em",
                    lineHeight: 0.92,
                    color: props.ink,
                    fontVariantNumeric: "tabular-nums",
                }}
            >
                {props.text.split("").map((digit, index) => (
                    <Digit
                        key={index}
                        digit={digit}
                        ink={props.ink}
                        motion={props.motion}
                        size={props.digitSize}
                    />
                ))}
            </div>
            {props.showLabel ? (
                <span
                    style={{
                        color: props.inkMute,
                        fontSize: Math.max(
                            8,
                            Math.round(props.digitSize * 0.145)
                        ),
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                    }}
                >
                    {props.label}
                </span>
            ) : null}
        </div>
    )
}

function Digit(props: {
    digit: string
    ink: string
    motion: DigitMotion
    size: number
}) {
    const { digit, ink, motion: motionMode } = props
    void props.size

    const box: CSSProperties = {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "0.62em",
        height: "1em",
        overflow: "hidden",
        color: ink,
        flex: "0 0 auto",
        perspective: motionMode === "flip" ? 900 : undefined,
        transformStyle: "preserve-3d",
    }

    if (motionMode === "none") {
        return <span style={box}>{digit}</span>
    }

    if (motionMode === "flip") {
        return (
            <span style={box}>
                <FlipDigit digit={digit} ink={ink} />
            </span>
        )
    }

    // fade — calm 1Hz crossfade in the fixed box
    return (
        <span style={box}>
            <AnimatePresence initial={false} mode="sync">
                <motion.span
                    key={digit}
                    initial={{ opacity: 0, y: "0.08em" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "-0.06em" }}
                    transition={{ duration: MOTION_SEC, ease: MOTION_EASE }}
                    style={digitGlyphStyle}
                >
                    {digit}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}

const digitGlyphStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}

/**
 * Two-phase split flap: top of outgoing folds down, then bottom folds away.
 * Underlay is the incoming digit. No opaque cards — ink glyph only.
 * Purpose: spatial continuity on a 1Hz tick (not decorative 3D soup).
 */
function FlipDigit(props: { digit: string; ink: string }) {
    const { digit, ink } = props
    const prevRef = useRef(digit)
    const [current, setCurrent] = useState(digit)
    const [outgoing, setOutgoing] = useState<string | null>(null)
    const [stage, setStage] = useState<"idle" | "top" | "bottom">("idle")

    useEffect(() => {
        if (digit === prevRef.current) return
        const from = prevRef.current
        prevRef.current = digit
        setOutgoing(from)
        setCurrent(digit)
        setStage("top")

        if (typeof window === "undefined") return
        const half = window.setTimeout(() => setStage("bottom"), FLIP_HALF_MS)
        const done = window.setTimeout(() => {
            setOutgoing(null)
            setStage("idle")
        }, FLIP_TOTAL_MS)
        return () => {
            window.clearTimeout(half)
            window.clearTimeout(done)
        }
    }, [digit])

    const flipping = stage !== "idle" && outgoing != null
    const hingePeak = isLightInk(ink) ? 0.55 : 0.38
    const flapShadow = isLightInk(ink)
        ? "drop-shadow(0 1px 1px rgba(0,0,0,0.55))"
        : "drop-shadow(0 1px 0.5px rgba(0,0,0,0.12))"

    return (
        <>
            <span style={digitGlyphStyle}>{current}</span>
            {outgoing != null && stage === "top" ? (
                <>
                    <span
                        aria-hidden="true"
                        style={{
                            ...digitGlyphStyle,
                            clipPath: "inset(50% 0 0 0)",
                            zIndex: 2,
                        }}
                    >
                        {outgoing}
                    </span>
                    <motion.span
                        key={`flip-top-${outgoing}-${current}`}
                        aria-hidden="true"
                        initial={{ rotateX: 0, opacity: 1 }}
                        animate={{ rotateX: -90, opacity: 0.9 }}
                        transition={{
                            duration: FLIP_HALF_SEC,
                            ease: MOTION_EASE,
                        }}
                        style={{
                            ...digitGlyphStyle,
                            clipPath: "inset(0 0 50% 0)",
                            transformOrigin: "50% 100%",
                            transformPerspective: 900,
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            willChange: "transform, opacity",
                            filter: flapShadow,
                            zIndex: 3,
                        }}
                    >
                        {outgoing}
                    </motion.span>
                </>
            ) : null}
            {outgoing != null && stage === "bottom" ? (
                <motion.span
                    key={`flip-bot-${outgoing}-${current}`}
                    aria-hidden="true"
                    initial={{ rotateX: 0, opacity: 1 }}
                    animate={{ rotateX: 90, opacity: 0.85 }}
                    transition={{
                        duration: FLIP_HALF_SEC,
                        ease: MOTION_EASE,
                    }}
                    style={{
                        ...digitGlyphStyle,
                        clipPath: "inset(50% 0 0 0)",
                        transformOrigin: "50% 0%",
                        transformPerspective: 900,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        willChange: "transform, opacity",
                        filter: flapShadow,
                        zIndex: 3,
                    }}
                >
                    {outgoing}
                </motion.span>
            ) : null}
            <motion.span
                aria-hidden="true"
                initial={false}
                animate={
                    flipping
                        ? { opacity: [0, hingePeak, hingePeak, 0] }
                        : { opacity: 0 }
                }
                transition={
                    flipping
                        ? {
                              duration: FLIP_TOTAL_SEC,
                              times: [0, 0.2, 0.8, 1],
                              ease: MOTION_EASE,
                          }
                        : { duration: 0.08 }
                }
                style={{
                    position: "absolute",
                    left: "16%",
                    right: "16%",
                    top: "50%",
                    height: isLightInk(ink) ? 1.25 : 1,
                    background: ink,
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    zIndex: 4,
                }}
            />
        </>
    )
}

Kern_AlarmClock.displayName = "Alarm Clock"
Kern_AlarmClock.defaultProps = defaultProps

addPropertyControls(Kern_AlarmClock, {
    content: {
        type: ControlType.Object,
        title: "Content",
        icon: "object",
        description:
            "Countdown target and which units appear on the face.",
        controls: {
            targetDate: {
                type: ControlType.Date,
                title: "Target",
                displayTime: true,
                defaultValue: DEFAULT_TARGET,
                description:
                    "Launch / unlock moment. Naive ISO (no Z/offset) uses Timezone below. ISO with Z or ±offset stays absolute.",
            },
            timeZone: {
                type: ControlType.String,
                title: "Timezone",
                defaultValue: "",
                placeholder: "Europe/Madrid",
                description:
                    "IANA id for naive targets, e.g. Europe/Madrid. Empty = browser local. Ignored when Target already has Z/offset.",
            },
            showDays: {
                type: ControlType.Boolean,
                title: "Days",
                defaultValue: true,
                enabledTitle: "Show",
                disabledTitle: "Hide",
                description: "Days column on the face.",
            },
            showHours: {
                type: ControlType.Boolean,
                title: "Hours",
                defaultValue: true,
                enabledTitle: "Show",
                disabledTitle: "Hide",
                description: "Hours column on the face.",
            },
            showMinutes: {
                type: ControlType.Boolean,
                title: "Minutes",
                defaultValue: true,
                enabledTitle: "Show",
                disabledTitle: "Hide",
                description: "Minutes column on the face.",
            },
            showSeconds: {
                type: ControlType.Boolean,
                title: "Seconds",
                defaultValue: true,
                enabledTitle: "Show",
                disabledTitle: "Hide",
                description: "Seconds column (ticks every second when live).",
            },
            padZeros: {
                type: ControlType.Boolean,
                title: "Pad Zeros",
                defaultValue: true,
                enabledTitle: "On",
                disabledTitle: "Off",
                description: "01 vs 1. Keeps digit width stable for motion.",
            },
            labels: {
                type: ControlType.Boolean,
                title: "Labels",
                defaultValue: true,
                enabledTitle: "On",
                disabledTitle: "Off",
                description: "Unit labels under each column (Days, Hours…).",
            },
            labelDays: {
                type: ControlType.String,
                title: "Days Label",
                defaultValue: "Days",
                hidden: (p) => !p.labels,
                description: "Copy under the days digits.",
            },
            labelHours: {
                type: ControlType.String,
                title: "Hours Label",
                defaultValue: "Hours",
                hidden: (p) => !p.labels,
                description: "Copy under the hours digits.",
            },
            labelMinutes: {
                type: ControlType.String,
                title: "Minutes Label",
                defaultValue: "Minutes",
                hidden: (p) => !p.labels,
                description: "Copy under the minutes digits.",
            },
            labelSeconds: {
                type: ControlType.String,
                title: "Seconds Label",
                defaultValue: "Seconds",
                hidden: (p) => !p.labels,
                description: "Copy under the seconds digits.",
            },
        },
        defaultValue: DEFAULT_CONTENT,
    },
    look: {
        type: ControlType.Object,
        title: "Look",
        icon: "color",
        description:
            "Site colors live here — no theme enum. Set Paper + Ink to match the page.",
        controls: {
            paper: {
                type: ControlType.Color,
                title: "Paper",
                defaultValue: "#F4F3F0",
                description:
                    "Alarm body fill. Dark paper auto-tunes glass lip, border, and shadow.",
            },
            ink: {
                type: ControlType.Color,
                title: "Ink",
                defaultValue: "#0A0A0A",
                description:
                    "Digit color. Labels mute to 50% of this ink automatically.",
            },
            accent: {
                type: ControlType.Color,
                title: "Accent",
                defaultValue: "#C45C26",
                description:
                    "One accent max — handle, feet, and end-state rule only.",
            },
            size: {
                type: ControlType.Number,
                title: "Size",
                defaultValue: 320,
                min: 160,
                max: 720,
                step: 8,
                unit: "px",
                description:
                    "Object width in px. Height follows. Digits fit the face automatically.",
            },
            showBody: {
                type: ControlType.Boolean,
                title: "Body",
                defaultValue: true,
                enabledTitle: "Object",
                disabledTitle: "Face",
                description:
                    "Desk-alarm case + handle + feet. Face-only keeps Alarm proportions (not a naked LED row).",
            },
        },
        defaultValue: DEFAULT_LOOK,
    },
    motion: {
        type: ControlType.Object,
        title: "Motion",
        icon: "effect",
        description:
            "Digit change only — body stays still. Canvas + reduced-motion snap to None.",
        controls: {
            digitMotion: {
                type: ControlType.Enum,
                title: "Digit Motion",
                options: ["fade", "flip", "none"],
                optionTitles: ["Fade", "Flip", "None"],
                defaultValue: "fade",
                displaySegmentedControl: true,
                description:
                    "Fade: calm opacity + tiny Y. Flip: two-phase split flap (≤240ms). None: instant. Forced None on canvas / prefers-reduced-motion.",
            },
        },
        defaultValue: DEFAULT_MOTION,
    },
    end: {
        type: ControlType.Object,
        title: "End",
        icon: "object",
        description: "What the face shows when now ≥ Target.",
        controls: {
            endMode: {
                type: ControlType.Enum,
                title: "End Mode",
                options: ["zeros", "label", "hide"],
                optionTitles: ["Zeros", "Label", "Hide"],
                defaultValue: "label",
                description:
                    "Zeros: 00 columns. Label: End Label + Now. Hide: empty face.",
            },
            endLabel: {
                type: ControlType.String,
                title: "End Label",
                defaultValue: "We're live",
                hidden: (p) => p.endMode !== "label" && p.endMode !== "Label",
                description: "Headline when End Mode is Label.",
            },
        },
        defaultValue: DEFAULT_END,
    },
    preview: {
        type: ControlType.Object,
        title: "Preview",
        icon: "object",
        description: PREVIEW_DESCRIPTION,
        controls: {
            remaining: {
                type: ControlType.String,
                title: "Remaining",
                defaultValue: DEFAULT_PREVIEW_REMAINING,
                description:
                    "DD:HH:MM:SS rest pose on the Framer canvas / export (static renderer). Live preview ignores this.",
            },
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
                    "[Made for Framer](https://framer.link/qIg9LiG) — referral sign-up. Opens in a new tab. Panel link only; does not render on the clock.",
            },
        },
        defaultValue: DEFAULT_PREVIEW,
    },
    onComplete: {
        type: ControlType.EventHandler,
        title: "On Complete",
        description:
            "Fires once when the countdown crosses Target (live only, not on canvas).",
    },
})
