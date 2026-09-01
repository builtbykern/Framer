import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useReducedMotion } from "framer-motion"
import {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react"
import { createPortal } from "react-dom"

interface LogoMenuRollFont {
    fontFamily?: string
    fontSelector?: string
    fontSize?: string | number
    fontWeight?: number | string
    fontStyle?: string
    letterSpacing?: string | number
    lineHeight?: string | number
}

interface LogoMenuRollProps {
    logo?: string
    menu?: string
    close?: string
    open?: boolean | string | number
    /** White + difference. Off on paper variants so canvas stays ink. */
    blend?: boolean | string | number
    color?: string
    font?: LogoMenuRollFont
    holdLogo?: number
    holdMenu?: number
    roll?: number
    stagger?: number
    onTap?: () => void
    style?: CSSProperties
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const
const PRESS_EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
const PRESS_SCALE = 0.98
const PRESS_MS = 120
const MENU_EXIT_EVENT = "halden:menu-exit"

const DEFAULT_FONT: LogoMenuRollFont = {
    fontFamily: "Inter",
    fontSize: "16px",
    fontWeight: 400,
    fontStyle: "normal",
    letterSpacing: "0em",
    lineHeight: "1em",
}

/**
 * Per-glyph cells disable the font kern table. IBM Plex Sans still needs a
 * light A–L / L–D pull so HALDEN doesn’t read HA LDEN.
 * Values are margin-right on the left glyph, in em.
 */
const PAIR_KERN_EM: Record<string, number> = {
    AL: -0.1,
    LD: -0.06,
    DE: -0.04,
    EN: -0.08,
    CL: -0.03,
    LO: -0.08,
}

function pairKern(left: string, right: string): number {
    if (!left || !right || left === " " || right === " ") return 0
    const pair = PAIR_KERN_EM[`${left}${right}`]
    if (pair != null) return pair
    if (left === "L") return -0.05
    return 0
}

function coerceFlag(value: unknown): boolean {
    if (value === true || value === 1 || value === "true" || value === "1") {
        return true
    }
    return false
}

function padCenter(value: string, length: number): string {
    const text = value.toUpperCase()
    if (text.length >= length) return text
    const left = Math.floor((length - text.length) / 2)
    return `${" ".repeat(left)}${text}${" ".repeat(length - text.length - left)}`
}

function cssLength(value: unknown, fallback: string): string {
    if (typeof value === "string" && value.length > 0) return value
    if (typeof value === "number" && Number.isFinite(value)) return `${value}px`
    if (Array.isArray(value) && value.length >= 2) {
        return `${value[0]}${value[1]}`
    }
    return fallback
}

function isCssFontFamily(value: unknown): value is string {
    if (typeof value !== "string" || value.length === 0) return false
    if (/^(FS|GF);/i.test(value)) return false
    return true
}

const SELECTOR_FAMILY: Record<string, string> = {
    ibmplexsans: "IBM Plex Sans",
    ibmplexmono: "IBM Plex Mono",
    syne: "Syne",
    inter: "Inter",
}

const SELECTOR_WEIGHT: Record<string, number> = {
    thin: 100,
    extralight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
}

function resolveLogoFont(
    font: LogoMenuRollFont,
    style?: CSSProperties
): { family: string; weight: number | string; style: string } {
    const selector = font.fontSelector || ""
    const body = selector.replace(/^(FS|GF);/i, "")
    const dash = body.lastIndexOf("-")
    const cut = (dash >= 0 ? body.slice(0, dash) : body).trim()
    const face = (dash >= 0 ? body.slice(dash + 1) : "").toLowerCase()
    const fromSelector =
        SELECTOR_FAMILY[cut.replace(/\s+/g, "").toLowerCase()] ||
        (cut.includes(" ") ? cut : undefined)
    const family = isCssFontFamily(style?.fontFamily)
        ? style.fontFamily
        : isCssFontFamily(font.fontFamily)
          ? font.fontFamily
          : fromSelector || DEFAULT_FONT.fontFamily || "Inter"
    const weight =
        font.fontWeight ??
        SELECTOR_WEIGHT[face] ??
        (Number.parseInt(face, 10) || undefined) ??
        DEFAULT_FONT.fontWeight ??
        400
    const fontStyle = font.fontStyle || "normal"
    const quoted =
        family.includes(",") || /^["']/.test(family)
            ? family
            : /\s/.test(family)
              ? `"${family}"`
              : family
    return { family: quoted, weight, style: fontStyle }
}

function glyph(char: string): string {
    return char === " " ? "\u00A0" : char
}

const BLEND_Z = 31

function GlyphCell(props: {
    from: string
    to: string
    rolled: boolean
    freeze: boolean
    delay: number
    duration: number
    kernEm: number
}) {
    const fromG = glyph(props.from)
    const toG = glyph(props.to)
    return (
        <span
            style={{
                display: "inline-grid",
                gridTemplateRows: "1em",
                overflow: "hidden",
                verticalAlign: "top",
                marginRight: props.kernEm ? `${props.kernEm}em` : undefined,
            }}
        >
            <span
                aria-hidden
                style={{ gridArea: "1 / 1", visibility: "hidden" }}
            >
                {fromG}
            </span>
            <span
                aria-hidden
                style={{ gridArea: "1 / 1", visibility: "hidden" }}
            >
                {toG}
            </span>
            <span
                style={{
                    gridArea: "1 / 1",
                    display: "block",
                    overflow: "hidden",
                    height: "1em",
                }}
            >
                <motion.span
                    initial={false}
                    animate={{ y: props.rolled ? "-50%" : "0%" }}
                    transition={
                        props.freeze
                            ? { duration: 0 }
                            : {
                                  duration: props.duration,
                                  delay: props.delay,
                                  ease: EASE_OUT,
                              }
                    }
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <span style={{ height: "1em", lineHeight: "1em" }}>
                        {fromG}
                    </span>
                    <span style={{ height: "1em", lineHeight: "1em" }}>
                        {toG}
                    </span>
                </motion.span>
            </span>
        </span>
    )
}

function TypeMark(props: {
    pairs: { from: string; to: string }[]
    rolled: boolean
    freeze: boolean
    stagger: number
    duration: number
    style: CSSProperties
}) {
    return (
        <div aria-hidden style={props.style}>
            {props.pairs.map((pair, index) => {
                const next = props.pairs[index + 1]
                const left = props.rolled ? pair.to : pair.from
                const right = next
                    ? props.rolled
                        ? next.to
                        : next.from
                    : " "
                return (
                    <GlyphCell
                        key={`g-${index}`}
                        from={pair.from}
                        to={pair.to}
                        rolled={props.rolled}
                        freeze={props.freeze}
                        delay={index * props.stagger}
                        duration={props.duration}
                        kernEm={pairKern(left, right)}
                    />
                )
            })}
        </div>
    )
}

/**
 * Idle letter-roll between the wordmark and MENU.
 * Same tree on Canvas/Export — loop gated by useIsStaticRenderer.
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 88
 * @framerIntrinsicHeight 16
 */
export default function Logo_Menu_Roll(props: LogoMenuRollProps) {
    const {
        logo = "HALDEN",
        menu = "MENU",
        close: closeLabel = "CLOSE",
        open: openProp = false,
        blend: blendProp = false,
        color = "#F6F3EE",
        font = DEFAULT_FONT,
        holdLogo = 2.4,
        holdMenu = 1.8,
        roll: duration = 0.42,
        stagger = 0.04,
        onTap,
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const reduceMotion = useReducedMotion()
    const open = coerceFlag(openProp)
    const blend = coerceFlag(blendProp)
    const freezeMotion = isStatic || Boolean(reduceMotion) || open

    const [showMenu, setShowMenu] = useState(false)
    const [pressed, setPressed] = useState(false)
    const [portalReady, setPortalReady] = useState(false)
    const [box, setBox] = useState<{
        top: number
        left: number
        width: number
        height: number
    } | null>(null)
    const anchorRef = useRef<HTMLButtonElement>(null)

    const pairs = useMemo(() => {
        const wordA = open ? closeLabel : logo
        const wordB = open ? closeLabel : menu
        const length = Math.max(wordA.length, wordB.length, 1)
        const from = padCenter(wordA, length)
        const to = padCenter(wordB, length)
        return Array.from({ length }, (_, index) => ({
            from: from[index] ?? " ",
            to: to[index] ?? " ",
        }))
    }, [logo, menu, closeLabel, open])

    const rollMs = (duration + stagger * Math.max(pairs.length - 1, 0)) * 1000

    useEffect(() => {
        if (typeof window === "undefined") return
        if (freezeMotion) {
            setShowMenu(false)
            return
        }

        let cancelled = false
        let timeoutId = 0

        const wait = (ms: number) =>
            new Promise<void>((resolve) => {
                timeoutId = window.setTimeout(resolve, ms)
            })

        const cycle = async () => {
            while (!cancelled) {
                setShowMenu(false)
                await wait(Math.max(holdLogo, 0.4) * 1000)
                if (cancelled) break
                setShowMenu(true)
                await wait(rollMs + Math.max(holdMenu, 0.4) * 1000)
            }
        }

        void cycle()

        return () => {
            cancelled = true
            window.clearTimeout(timeoutId)
        }
    }, [freezeMotion, holdLogo, holdMenu, rollMs])

    const rolled = !freezeMotion && showMenu

    useLayoutEffect(() => {
        if (isStatic || typeof document === "undefined") return
        setPortalReady(true)
    }, [isStatic])

    useLayoutEffect(() => {
        if (isStatic || typeof window === "undefined") return
        const el = anchorRef.current
        if (!el) return
        const update = () => {
            const rect = el.getBoundingClientRect()
            setBox({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            })
        }
        update()
        const observer = new ResizeObserver(update)
        observer.observe(el)
        window.addEventListener("scroll", update, true)
        window.addEventListener("resize", update)
        return () => {
            observer.disconnect()
            window.removeEventListener("scroll", update, true)
            window.removeEventListener("resize", update)
        }
    }, [isStatic, rolled, open, logo, menu, closeLabel])

    const resolvedFont = resolveLogoFont(font, style)
    const blending = blend && !open
    const liveBlend = blending && !isStatic
    const pressScale = !isStatic && !reduceMotion && pressed ? PRESS_SCALE : 1
    const pressOpacity = !isStatic && reduceMotion && pressed ? 0.72 : 1
    const pressTransition = isStatic
        ? undefined
        : `transform ${PRESS_MS}ms ${PRESS_EASE}, opacity ${PRESS_MS}ms ${PRESS_EASE}`
    const handleClick = () => {
        if (!isStatic && open && typeof window !== "undefined") {
            window.dispatchEvent(new Event(MENU_EXIT_EVENT))
        }
        onTap?.()
    }

    const markStyle: CSSProperties = {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        color,
        fontSize: cssLength(font.fontSize, "16px"),
        fontStyle: resolvedFont.style,
        letterSpacing: cssLength(font.letterSpacing, "0em"),
        lineHeight: cssLength(font.lineHeight, "1em"),
        fontSynthesis: "none",
        textTransform: "uppercase",
        userSelect: "none",
        cursor: "pointer",
        appearance: "none",
        background: "none",
        border: 0,
        margin: 0,
        padding: 0,
        ...style,
        fontFamily: resolvedFont.family,
        fontWeight: resolvedFont.weight,
        // In-flow mark must stay a hit target. The difference portal is
        // pointer-events none; visibility:hidden would also drop clicks.
        pointerEvents: "auto",
        visibility: "visible",
        opacity: liveBlend ? 0 : pressOpacity,
        transform: `scale(${pressScale})`,
        transformOrigin: "50% 50%",
        transition: pressTransition,
    }

    const paintStyle: CSSProperties = {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        color: "#FFFFFF",
        fontFamily: resolvedFont.family,
        fontSize: markStyle.fontSize,
        fontWeight: resolvedFont.weight,
        fontStyle: resolvedFont.style,
        letterSpacing: markStyle.letterSpacing,
        lineHeight: markStyle.lineHeight,
        fontSynthesis: "none",
        textTransform: "uppercase",
        userSelect: "none",
        pointerEvents: "none",
    }

    const flowStyle: CSSProperties = {
        ...paintStyle,
        color,
        pointerEvents: "auto",
    }

    const blendPortal =
        liveBlend &&
        portalReady &&
        box &&
        typeof document !== "undefined"
            ? createPortal(
                  <div
                      aria-hidden
                      data-halden-logo-blend="true"
                      style={{
                          position: "fixed",
                          top: box.top,
                          left: box.left,
                          mixBlendMode: "difference",
                          zIndex: BLEND_Z,
                          pointerEvents: "none",
                          color: "#FFFFFF",
                          fontFamily: resolvedFont.family,
                          fontWeight: resolvedFont.weight,
                          fontStyle: resolvedFont.style,
                          fontSize: markStyle.fontSize,
                          letterSpacing: markStyle.letterSpacing,
                          lineHeight: markStyle.lineHeight,
                          fontSynthesis: "none",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                          userSelect: "none",
                          opacity: pressOpacity,
                          transform: `scale(${pressScale})`,
                          transformOrigin: "50% 50%",
                          transition: pressTransition,
                      }}
                  >
                      <TypeMark
                          pairs={pairs}
                          rolled={rolled}
                          freeze={freezeMotion}
                          stagger={stagger}
                          duration={duration}
                          style={paintStyle}
                      />
                  </div>,
                  document.body
              )
            : null

    return (
        <button
            ref={anchorRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            style={markStyle}
            onPointerDown={() => {
                if (!isStatic) setPressed(true)
            }}
            onPointerUp={() => setPressed(false)}
            onPointerCancel={() => setPressed(false)}
            onPointerLeave={() => setPressed(false)}
            onClick={handleClick}
        >
            <TypeMark
                pairs={pairs}
                rolled={rolled}
                freeze={freezeMotion}
                stagger={stagger}
                duration={duration}
                style={flowStyle}
            />
            {blendPortal}
        </button>
    )
}

addPropertyControls(Logo_Menu_Roll, {
    logo: {
        type: ControlType.String,
        title: "Logo",
        defaultValue: "HALDEN",
    },
    menu: {
        type: ControlType.String,
        title: "Menu",
        defaultValue: "MENU",
    },
    close: {
        type: ControlType.String,
        title: "Close",
        defaultValue: "CLOSE",
    },
    open: {
        type: ControlType.Boolean,
        title: "Open",
        defaultValue: false,
        enabledTitle: "Close",
        disabledTitle: "Loop",
    },
    blend: {
        type: ControlType.Boolean,
        title: "Blend",
        defaultValue: false,
        enabledTitle: "Difference",
        disabledTitle: "Solid",
        description:
            "White + difference over photography. Off on paper / Close.",
    },
    color: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "#F6F3EE",
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { ...DEFAULT_FONT },
    },
    holdLogo: {
        type: ControlType.Number,
        title: "Hold Logo",
        defaultValue: 2.4,
        min: 0.4,
        max: 6,
        step: 0.1,
        unit: "s",
    },
    holdMenu: {
        type: ControlType.Number,
        title: "Hold Menu",
        defaultValue: 1.8,
        min: 0.4,
        max: 6,
        step: 0.1,
        unit: "s",
    },
    roll: {
        type: ControlType.Number,
        title: "Roll",
        defaultValue: 0.42,
        min: 0.16,
        max: 1,
        step: 0.02,
        unit: "s",
    },
    stagger: {
        type: ControlType.Number,
        title: "Stagger",
        defaultValue: 0.04,
        min: 0,
        max: 0.16,
        step: 0.01,
        unit: "s",
    },
    onTap: {
        type: ControlType.EventHandler,
        title: "On Tap",
    },
})

Logo_Menu_Roll.displayName = "Logo Menu Roll"
