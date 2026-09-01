import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { useReducedMotion } from "framer-motion"
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from "react"

interface MenuPaperRevealProps {
    open?: boolean | string | number
    color?: string
    blur?: number
    style?: CSSProperties
}

const CLIP_CLOSED = "inset(0 0 100% 0)"
const CLIP_OPEN = "inset(0)"
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"
const PAPER = "rgb(247, 241, 232)"
const GRAIN_OPACITY = 0.05
const GRAIN_URI = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`
)
const ENTER_MS = 490
const EXIT_MS = 280
const CONTENT_EXIT_MS = 180
const CONTENT_EXIT_Y = 24
const MENU_EXIT_EVENT = "halden:menu-exit"
const BLUR_MAX = 20
const VEIL_Z = 9
const STACK_MAX = 1199

const DOSSIER_STACK_CSS = `
html:has(nav[data-framer-name="open"]),
body:has(nav[data-framer-name="open"]) {
    overflow: hidden !important;
}
@media (max-width: ${STACK_MAX}px) {
    [data-framer-name="Dossier"] {
        flex-direction: column !important;
        flex-wrap: nowrap !important;
        align-items: stretch !important;
        justify-content: flex-start !important;
    }
    [data-framer-name="Dossier"] > *,
    [data-framer-name="Menu Info"],
    [data-framer-name="Menu Contact"] {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        flex: 0 0 auto !important;
    }
    [data-framer-name="Identity Fields"] {
        flex-direction: column !important;
    }
    [data-framer-name="Name Field"],
    [data-framer-name="Email Field"] {
        width: 100% !important;
        min-width: 0 !important;
    }
    [data-framer-name="Menu Sheet"] {
        justify-content: flex-start !important;
        padding: 72px 20px 48px !important;
    }
}
@media (max-width: 479px) {
    [data-framer-name="Menu Sheet"] {
        padding: 48px 16px 40px !important;
    }
}
`

function coerceOpen(value: unknown): boolean {
    if (value === true || value === 1 || value === "true" || value === "1") {
        return true
    }
    return false
}

function clampBlur(value: number): number {
    if (!Number.isFinite(value)) return 12
    return Math.min(BLUR_MAX, Math.max(0, value))
}

function grainLayer(): ReactNode {
    return (
        <div
            aria-hidden
            data-halden-paper-grain="true"
            style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: GRAIN_OPACITY,
                mixBlendMode: "multiply",
                backgroundImage: `url("data:image/svg+xml,${GRAIN_URI}")`,
                backgroundRepeat: "repeat",
                backgroundSize: "160px 160px",
            }}
        />
    )
}

function nodeLabel(node: HTMLElement): string {
    return `${node.getAttribute("data-framer-name") || ""} ${node.getAttribute("data-name") || ""}`
}

function findDossierHost(start: HTMLElement | null): HTMLElement | null {
    let node: HTMLElement | null = start
    for (let i = 0; i < 8 && node; i++) {
        if (/dossier clip/i.test(nodeLabel(node))) return node
        node = node.parentElement
    }
    return null
}

function findNamed(
    start: HTMLElement | null,
    pattern: RegExp,
    direction: "up" | "down"
): HTMLElement | null {
    if (!start) return null
    if (direction === "up") {
        let node: HTMLElement | null = start
        for (let i = 0; i < 12 && node; i++) {
            if (pattern.test(nodeLabel(node))) return node
            node = node.parentElement
        }
        return null
    }
    const all = start.querySelectorAll("[data-framer-name], [data-name]")
    for (const el of all) {
        if (el instanceof HTMLElement && pattern.test(nodeLabel(el))) return el
    }
    return null
}

function setImportant(
    node: HTMLElement | null,
    property: string,
    value: string | null
): void {
    if (!node) return
    if (value === null) node.style.removeProperty(property)
    else node.style.setProperty(property, value, "important")
}

function applyDossierStack(host: HTMLElement, vertical: boolean): void {
    const dossier = findNamed(host, /^dossier$/i, "down")
    const sheet = findNamed(host, /menu sheet/i, "up")
    const info = findNamed(host, /menu info/i, "down")
    const contact = findNamed(host, /menu contact/i, "down")
    const identity = findNamed(host, /identity fields/i, "down")
    const nameField = findNamed(host, /name field/i, "down")
    const emailField = findNamed(host, /email field/i, "down")
    const columns = [info, contact].filter(Boolean) as HTMLElement[]
    const fields = [nameField, emailField].filter(Boolean) as HTMLElement[]

    if (!vertical) {
        setImportant(dossier, "flex-direction", null)
        setImportant(dossier, "flex-wrap", null)
        setImportant(dossier, "align-items", null)
        setImportant(dossier, "justify-content", null)
        for (const col of columns) {
            setImportant(col, "width", null)
            setImportant(col, "min-width", null)
            setImportant(col, "max-width", null)
            setImportant(col, "flex", null)
        }
        setImportant(identity, "flex-direction", null)
        for (const field of fields) {
            setImportant(field, "width", null)
            setImportant(field, "min-width", null)
        }
        setImportant(sheet, "justify-content", null)
        setImportant(sheet, "padding", null)
        return
    }

    setImportant(dossier, "flex-direction", "column")
    setImportant(dossier, "flex-wrap", "nowrap")
    setImportant(dossier, "align-items", "stretch")
    setImportant(dossier, "justify-content", "flex-start")
    for (const col of columns) {
        setImportant(col, "width", "100%")
        setImportant(col, "min-width", "0")
        setImportant(col, "max-width", "100%")
        setImportant(col, "flex", "0 0 auto")
    }
    setImportant(identity, "flex-direction", "column")
    for (const field of fields) {
        setImportant(field, "width", "100%")
        setImportant(field, "min-width", "0")
    }
    setImportant(sheet, "justify-content", "flex-start")
    const sheetWidth = sheet?.getBoundingClientRect().width ?? 0
    if (sheetWidth > 0 && sheetWidth < 480) {
        setImportant(sheet, "padding", "48px 16px 40px")
    } else {
        setImportant(sheet, "padding", "72px 20px 48px")
    }
}

function applyMenuExit(
    host: HTMLElement,
    reduceMotion: boolean
): () => void {
    const sheet = findNamed(host, /menu sheet/i, "down")
    if (!sheet) return () => {}

    const previousOpacity = sheet.style.opacity
    const previousTransform = sheet.style.transform
    const previousTransition = sheet.style.transition

    sheet.style.transition = reduceMotion
        ? `opacity 120ms ${EASE_OUT}`
        : [
              `opacity ${CONTENT_EXIT_MS}ms ${EASE_OUT}`,
              `transform ${CONTENT_EXIT_MS}ms ${EASE_OUT}`,
          ].join(", ")
    sheet.style.opacity = "0"
    sheet.style.transform = reduceMotion
        ? "none"
        : `translate3d(0, ${CONTENT_EXIT_Y}px, 0)`

    return () => {
        sheet.style.opacity = previousOpacity
        sheet.style.transform = previousTransform
        sheet.style.transition = previousTransition
    }
}

/**
 * Clipped paper plus a Page Veil wash contained by the Nav variant.
 * Drawer ease-out: 490ms open / 280ms close. When wrapped in
 * “Dossier Clip”, the same clip-path eats Menu Sheet. Reduced motion: opacity only.
 * Below 1200px the open dossier stacks Info over Contact (Phone + Tablet).
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function Menu_Paper_Reveal(props: MenuPaperRevealProps) {
    const { open: openProp = false, color = PAPER, blur = 12, style } = props
    const isStatic = useIsStaticRenderer()
    const reduceMotion = useReducedMotion()
    const open = coerceOpen(openProp)
    const freeze = isStatic || Boolean(reduceMotion)
    const blurAmount = clampBlur(blur)
    const rootRef = useRef<HTMLDivElement>(null)

    const [shown, setShown] = useState(() => (isStatic ? open : false))
    const [closing, setClosing] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") return
        if (freeze) {
            setShown(open)
            setClosing(false)
            return
        }
        if (!open) {
            setShown(false)
            return
        }
        setClosing(false)
        setShown(false)
        let second: number | null = null
        const first = window.requestAnimationFrame(() => {
            second = window.requestAnimationFrame(() => {
                setShown(true)
            })
        })
        return () => {
            window.cancelAnimationFrame(first)
            if (second !== null) window.cancelAnimationFrame(second)
        }
    }, [open, freeze])

    useEffect(() => {
        if (isStatic || typeof window === "undefined") return
        const handleExit = () => {
            if (!open) return
            setClosing(true)
            setShown(false)
        }
        window.addEventListener(MENU_EXIT_EVENT, handleExit)
        return () => window.removeEventListener(MENU_EXIT_EVENT, handleExit)
    }, [isStatic, open])

    const washOn = isStatic ? open : closing ? false : freeze ? open : shown
    const clipPath = washOn ? CLIP_OPEN : CLIP_CLOSED
    const washOpacity = washOn ? 1 : 0
    const blurPx = isStatic || reduceMotion ? 0 : shown ? blurAmount : 0
    const motionMs = closing ? EXIT_MS : ENTER_MS

    let clipTransition: string | undefined
    let blurTransition: string | undefined
    let washTransition: string | undefined
    if (isStatic) {
        clipTransition = undefined
        blurTransition = undefined
        washTransition = undefined
    } else if (reduceMotion) {
        clipTransition = undefined
        blurTransition = undefined
        washTransition = `opacity 200ms ${EASE_OUT}`
    } else {
        clipTransition = `clip-path ${motionMs}ms ${EASE_OUT}`
        blurTransition = [
            `backdrop-filter ${motionMs}ms ${EASE_OUT}`,
            `-webkit-backdrop-filter ${motionMs}ms ${EASE_OUT}`,
        ].join(", ")
        washTransition = `opacity ${motionMs}ms ${EASE_OUT}`
    }

    useLayoutEffect(() => {
        if (typeof document === "undefined") return
        const host = findDossierHost(rootRef.current)
        if (!host) return

        const prevClip = host.style.clipPath
        const prevTransition = host.style.transition
        const prevOpacity = host.style.opacity
        const restoreMenuExit =
            !isStatic && closing
                ? applyMenuExit(host, Boolean(reduceMotion))
                : () => {}

        if (isStatic) {
            host.style.transition = ""
            host.style.clipPath = open ? CLIP_OPEN : CLIP_CLOSED
            host.style.opacity = "1"
        } else if (reduceMotion) {
            host.style.clipPath = washOn ? CLIP_OPEN : CLIP_CLOSED
            host.style.opacity = washOn ? "1" : "0"
            host.style.transition = `opacity 200ms ${EASE_OUT}`
        } else {
            host.style.opacity = "1"
            host.style.clipPath = clipPath
            host.style.transition = clipTransition || ""
        }

        return () => {
            host.style.clipPath = prevClip
            host.style.transition = prevTransition
            host.style.opacity = prevOpacity
            restoreMenuExit()
        }
    }, [
        clipPath,
        clipTransition,
        closing,
        isStatic,
        open,
        reduceMotion,
        washOn,
    ])

    useLayoutEffect(() => {
        if (typeof document === "undefined") return
        const host = findDossierHost(rootRef.current)
        if (!host) return

        const sync = () => {
            const width = host.getBoundingClientRect().width
            applyDossierStack(host, width > 0 && width <= STACK_MAX)
        }
        sync()
        if (typeof ResizeObserver === "undefined") {
            return () => applyDossierStack(host, false)
        }
        const observer = new ResizeObserver(sync)
        observer.observe(host)
        return () => {
            observer.disconnect()
            applyDossierStack(host, false)
        }
    }, [])

    const frost: ReactNode = (
        <div
            aria-hidden
            data-halden-menu-veil="true"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100dvh",
                zIndex: VEIL_Z,
                pointerEvents: "none",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : "none",
                    WebkitBackdropFilter:
                        blurPx > 0 ? `blur(${blurPx}px)` : "none",
                    transition: blurTransition,
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: washOpacity,
                    transition: washTransition,
                    pointerEvents: "none",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: color,
                        pointerEvents: "none",
                    }}
                />
                {grainLayer()}
            </div>
        </div>
    )

    return (
        <div
            ref={rootRef}
            aria-hidden
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "visible",
                pointerEvents: "none",
                ...style,
            }}
        >
            <style>{DOSSIER_STACK_CSS}</style>
            {frost}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    background: color,
                    clipPath,
                    transition: clipTransition,
                    overflow: "hidden",
                }}
            >
                {grainLayer()}
            </div>
        </div>
    )
}

addPropertyControls(Menu_Paper_Reveal, {
    open: {
        type: ControlType.Boolean,
        title: "Open",
        defaultValue: false,
        enabledTitle: "Open",
        disabledTitle: "Closed",
    },
    color: {
        type: ControlType.Color,
        title: "Paper",
        defaultValue: PAPER,
    },
    blur: {
        type: ControlType.Number,
        title: "Blur",
        defaultValue: 12,
        min: 0,
        max: BLUR_MAX,
        step: 1,
        unit: "px",
        description: "Page Veil backdrop blur. Cap 20px.",
    },
})

Menu_Paper_Reveal.displayName = "Menu Paper Reveal"
