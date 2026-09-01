import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { useLayoutEffect, useRef, type CSSProperties } from "react"

const BLENDS = [
    "normal",
    "multiply",
    "difference",
    "exclusion",
    "screen",
    "overlay",
] as const
type Blend = (typeof BLENDS)[number]

const FIELD_REVIVE = "vitrine-field-revive"

interface MarkFont {
    fontFamily?: string
    fontSelector?: string
    fontWeight?: number | string
    fontStyle?: string
    variant?: string
}

interface InkCursorProps {
    color?: string
    blend?: Blend | string
    size?: number
    lag?: number
    hideOnTouch?: boolean
    label?: string
    viewLabel?: string
    font?: MarkFont
    labelColor?: string
    style?: CSSProperties
}

const VARIANT_KEYS = [
    "thin",
    "extra light",
    "light",
    "regular",
    "medium",
    "semibold",
    "bold",
    "extra bold",
    "black",
    "variable",
] as const
type VariantKey = (typeof VARIANT_KEYS)[number]

function asVariantKey(raw: string): VariantKey {
    for (const key of VARIANT_KEYS) {
        if (key === raw) return key
    }
    return "bold"
}

function variantFace(variant: string | undefined): {
    weight: string
    style: string
} {
    const v = (variant || "Bold").toLowerCase()
    const italic = v.includes("italic")
    const key = asVariantKey(v.replace("italic", "").trim() || "regular")
    const style = italic ? "italic" : "normal"
    switch (key) {
        case "thin":
            return { weight: "100", style }
        case "extra light":
            return { weight: "200", style }
        case "light":
            return { weight: "300", style }
        case "regular":
            return { weight: "400", style }
        case "medium":
            return { weight: "500", style }
        case "semibold":
            return { weight: "600", style }
        case "bold":
            return { weight: "700", style }
        case "extra bold":
            return { weight: "800", style }
        case "black":
            return { weight: "900", style }
        case "variable":
            return { weight: "700", style }
        default: {
            const _exhaustive: never = key
            void _exhaustive
            return { weight: "700", style }
        }
    }
}

function fromSelector(selector: string | undefined): {
    family?: string
    weight?: string
} {
    if (!selector) return {}
    const body = selector.replace(/^(FS|GF);/i, "")
    const dash = body.lastIndexOf("-")
    if (dash < 0) return { family: body.trim() }
    const family = body.slice(0, dash).trim()
    const faceName = body.slice(dash + 1).toLowerCase().replace(/\s+/g, "")
    const weights: Record<string, string> = {
        thin: "100",
        extralight: "200",
        light: "300",
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
    }
    const numbered = Number.parseInt(faceName, 10)
    return {
        family,
        weight:
            weights[faceName] ||
            (Number.isFinite(numbered) ? String(numbered) : "700"),
    }
}

function face(font: MarkFont | undefined): {
    family: string
    weight: string
    style: string
} {
    const fromVariant = variantFace(font?.variant)
    const fromSel = fromSelector(font?.fontSelector)
    const family = font?.fontFamily?.trim() || fromSel.family || "Archivo, sans-serif"
    const quoted =
        family.includes(",") || /^["']/.test(family)
            ? family
            : /\s/.test(family)
              ? `"${family}"`
              : family
    return {
        family: quoted,
        weight: String(font?.fontWeight ?? fromSel.weight ?? fromVariant.weight),
        style: font?.fontStyle || fromVariant.style,
    }
}

function asBlend(value: unknown): Blend {
    const raw = String(value || "")
        .trim()
        .toLowerCase()
    for (const blend of BLENDS) {
        if (blend === raw) return blend
    }
    return "multiply"
}

function reducedMotion(): boolean {
    if (typeof window === "undefined") return true
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function coarsePointer(): boolean {
    if (typeof window === "undefined") return true
    return window.matchMedia("(pointer: coarse)").matches
}

const CHROME_HIT =
    "header, nav, [data-framer-name='Chrome'], [data-framer-name='Nav'], [data-framer-name='Rail'], [data-framer-name='Socials'], [data-framer-name='Chrome Left'], [data-framer-name='Mark Nav'], [data-framer-name='Index Roll'], [data-framer-name='House Roll'], [data-framer-name='Desk Roll'], [data-framer-name='Instagram Roll'], [data-framer-name='Vimeo Roll']"

function inNavChrome(node: Element): boolean {
    return Boolean(node.closest(CHROME_HIT))
}

function isInkLayer(node: Element): boolean {
    return (
        node.hasAttribute("data-ink-layer") ||
        Boolean(node.closest("[data-ink-layer]"))
    )
}

function pageHitAt(x: number, y: number): Element | null {
    if (typeof document === "undefined") return null
    const stack = document.elementsFromPoint(x, y)
    for (const el of stack) {
        if (isInkLayer(el)) continue
        if (inNavChrome(el)) return el
    }
    for (const el of stack) {
        if (isInkLayer(el)) continue
        return el
    }
    return null
}

function isTypeLink(node: EventTarget | null): boolean {
    if (!(node instanceof Element)) return false
    if (inNavChrome(node)) {
        const host = node.closest(CHROME_HIT) || node
        return Boolean(
            node.closest("a, button, [role='button']") ||
                host.querySelector("a, button, [role='button']")
        )
    }
    const hit = node.closest(
        "a, button, [role='button'], input, textarea, select, summary, label"
    )
    if (!hit) return false
    if (hit.querySelector("img, picture, video, canvas")) return false
    const box = hit.getBoundingClientRect()
    if (box.height > 48 || box.width > 220) return false
    return true
}

function isMark(node: Element): boolean {
    return Boolean(
        node.closest(
            "[data-framer-name='Mark Home'], [data-framer-name='Floor Mark']"
        )
    )
}

function isViewHint(node: EventTarget | null): boolean {
    if (!(node instanceof Element)) return false
    if (isMark(node) || inNavChrome(node)) return false
    if (node.closest("[data-ink='view']")) return true
    if (node.closest("[data-framer-name='Piece Item']")) return true
    const hit = node.closest("a[href]")
    if (!hit || isTypeLink(hit)) return false
    return Boolean(hit.querySelector("img, picture, video"))
}

function isDragHint(node: EventTarget | null): boolean {
    if (!(node instanceof Element)) return false
    if (isMark(node) || inNavChrome(node)) return false
    if (isViewHint(node)) return false
    if (node.closest("[data-ink='drag']")) return true
    return Boolean(node.closest("[data-framer-name='Piece List']"))
}

function isHidden(el: HTMLElement | null): boolean {
    if (!el) return true
    const s = window.getComputedStyle(el)
    if (s.display === "none" || s.visibility === "hidden") return true
    return el.getClientRects().length === 0
}

function follow(clamped: number, dt: number): number {
    const rate = -Math.log(1 - clamped) * 60
    return 1 - Math.exp(-dt * rate)
}

const layer: CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    pointerEvents: "none",
    zIndex: 9999,
    transformOrigin: "center center",
}

/**
 * Dual ink follower: snappy filled slab + laggy ghost. Hairline on type
 * links. DRAG is a flat bar that sits below the pointer on the rail.
 * VIEW is a taller window locked to the pointer on a piece card. Live
 * layers portal to document.body so mix-blend can see the page. Scroll
 * and grab squash/stretch the slab along the pan (~5%), then it eases back.
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function InkCursor(props: InkCursorProps) {
    const {
        color = "rgb(18, 17, 16)",
        blend,
        size = 8,
        lag = 0.22,
        hideOnTouch = true,
        label = "DRAG",
        viewLabel = "VIEW",
        font,
        labelColor = "rgb(247, 246, 242)",
        style,
    } = props
    const mix = asBlend(blend)
    const dragHint = label.trim()
    const viewHint = viewLabel.trim()
    const isStatic = useIsStaticRenderer()
    const wrapRef = useRef<HTMLDivElement>(null)
    const inkRef = useRef<HTMLDivElement>(null)
    const ghostRef = useRef<HTMLDivElement>(null)
    const labelRef = useRef<HTMLDivElement>(null)
    const type = face(font)
    const fontKey = `${font?.fontFamily ?? ""}|${font?.fontSelector ?? ""}|${font?.fontWeight ?? ""}|${font?.variant ?? ""}`

    useLayoutEffect(() => {
        const ink = inkRef.current
        const ghost = ghostRef.current
        const wrap = wrapRef.current
        const tag = labelRef.current
        if (!ink || !ghost || !wrap || typeof window === "undefined") return

        const touch = hideOnTouch && coarsePointer()
        const hiddenHost = isHidden(wrap)
        const freeze = isStatic || reducedMotion() || touch || hiddenHost
        const rest = Math.max(2, size)
        const halo = rest * 2
        const pillDragH = Math.max(rest, 18)
        const pillViewH = Math.max(rest, 26)
        const dragDrop = 26
        let pillDragW = Math.max(rest * 4, 64)
        let pillViewW = Math.max(rest * 4, 52)
        let tx = 0
        let ty = 0
        let ix = 0
        let iy = 0
        let gx = 0
        let gy = 0
        let onLink = false
        let onDrag = false
        let onView = false
        let linkMix = 0
        let dragMix = 0
        let viewMix = 0
        let down = false
        let seen = false
        let raf = 0
        let running = false
        let last = performance.now()
        let pullX = 0
        let pullY = 0
        let lastPtrX = 0
        let lastPtrY = 0
        const prevHtmlCursor = document.documentElement.style.cursor
        const prevBodyCursor = document.body.style.cursor
        const sheet = document.createElement("style")
        sheet.setAttribute("data-ink-cursor", "true")
        sheet.textContent =
            "html.vitrine-ink, html.vitrine-ink body, html.vitrine-ink * { cursor: none !important; }"

        const measure = () => {
            if (!tag) return
            const previous = tag.textContent
            const previousTrack = tag.style.letterSpacing
            if (dragHint) {
                tag.style.letterSpacing = "0.16em"
                tag.textContent = dragHint
                const w = tag.scrollWidth
                if (w > 1) pillDragW = Math.max(rest + 16, w + 28)
            }
            if (viewHint) {
                tag.style.letterSpacing = "0.05em"
                tag.textContent = viewHint
                const w = tag.scrollWidth
                if (w > 1) pillViewW = Math.max(rest + 16, w + 18)
            }
            tag.style.letterSpacing = previousTrack
            tag.textContent = previous || dragHint
        }

        const paint = () => {
            const hide = freeze || !seen
            const linkSx = 1 + 1.65 * linkMix
            const linkSy = 1 - 0.86 * linkMix
            const press = down ? 0.97 : 1
            const hx = Math.abs(pullX)
            const hy = Math.abs(pullY)
            const sxPull = 1 + Math.min(0.055, hx * 0.055) - Math.min(0.028, hy * 0.028)
            const syPull = 1 + Math.min(0.055, hy * 0.055) - Math.min(0.028, hx * 0.028)
            const sx = linkSx * sxPull * press
            const scaleY = linkSy * syPull * press
            const winW =
                rest + (pillDragW - rest) * dragMix + (pillViewW - rest) * viewMix
            const winH =
                rest + (pillDragH - rest) * dragMix + (pillViewH - rest) * viewMix
            const drop = dragDrop * dragMix
            const hintMix = Math.min(1, dragMix + viewMix)
            const inkX = ix
            const inkY = iy + drop
            const ghostX = gx
            const ghostY = gy + drop
            const ghostW = halo + (winW - rest)
            const ghostH = halo + (winH - rest)

            ink.style.width = `${winW}px`
            ink.style.height = `${winH}px`
            ink.style.mixBlendMode = mix
            ink.style.background = color
            ghost.style.width = `${ghostW}px`
            ghost.style.height = `${ghostH}px`
            ghost.style.background = "transparent"
            ghost.style.border = `1px solid ${color}`
            ghost.style.mixBlendMode = mix
            ink.style.opacity = hide ? "0" : "1"
            ghost.style.opacity = hide
                ? "0"
                : String(0.3 * (1 - linkMix) * (1 - hintMix * 0.35))

            ink.style.transform = `translate3d(${inkX - winW / 2}px, ${inkY - winH / 2}px, 0) scale(${sx}, ${scaleY})`
            ghost.style.transform = `translate3d(${ghostX - ghostW / 2}px, ${ghostY - ghostH / 2}px, 0) scale(${sxPull * press}, ${syPull * press})`

            if (tag) {
                const next = onView ? viewHint : onDrag ? dragHint : ""
                if (tag.textContent !== next) tag.textContent = next
                tag.style.width = `${winW}px`
                tag.style.height = `${winH}px`
                tag.style.letterSpacing = `${0.05 + 0.11 * dragMix}em`
                tag.style.opacity = hide ? "0" : String(hintMix)
                tag.style.transform = `translate3d(${inkX - winW / 2}px, ${inkY - winH / 2}px, 0)`
            }

            if (!freeze && seen) {
                window.dispatchEvent(
                    new CustomEvent("vitrine-ink", { detail: { x: ix, y: iy } })
                )
            }
        }

        const settle = () =>
            Math.abs(tx - ix) < 0.12 &&
            Math.abs(ty - iy) < 0.12 &&
            Math.abs(tx - gx) < 0.18 &&
            Math.abs(ty - gy) < 0.18 &&
            linkMix < 0.02 &&
            dragMix < 0.02 &&
            viewMix < 0.02 &&
            !down &&
            Math.abs(pullX) < 0.012 &&
            Math.abs(pullY) < 0.012

        const frame = (now: number) => {
            const dt = Math.min(0.033, (now - last) / 1000)
            last = now
            const outer = Math.min(0.96, Math.max(0.05, lag))
            const inner = Math.min(0.96, Math.max(0.72, outer + 0.45))
            const ki = freeze ? 1 : follow(inner, dt)
            const ko = freeze ? 1 : follow(outer, dt)
            ix += (tx - ix) * ki
            iy += (ty - iy) * ki
            gx += (tx - gx) * ko
            gy += (ty - gy) * ko
            const morph = 1 - Math.exp(-dt * 14)
            linkMix += ((onLink ? 1 : 0) - linkMix) * morph
            if (onLink) {
                dragMix = 0
                viewMix = 0
            } else {
                dragMix += ((onDrag ? 1 : 0) - dragMix) * morph
                viewMix += ((onView ? 1 : 0) - viewMix) * morph
            }
            const restPull = 1 - Math.exp(-dt * 16)
            pullX += (0 - pullX) * restPull
            pullY += (0 - pullY) * restPull
            paint()
            if (freeze || settle()) {
                running = false
                raf = 0
                return
            }
            raf = window.requestAnimationFrame(frame)
        }

        const kick = () => {
            if (running && raf) return
            running = true
            last = performance.now()
            raf = window.requestAnimationFrame(frame)
        }

        const revive = () => {
            if (freeze) return
            if (document.visibilityState === "hidden") return
            running = false
            if (raf) {
                window.cancelAnimationFrame(raf)
                raf = 0
            }
            kick()
        }

        const addPull = (ax: number, ay: number) => {
            pullX = Math.max(-1, Math.min(1, pullX + ax))
            pullY = Math.max(-1, Math.min(1, pullY + ay))
            kick()
        }

        const onMove = (e: PointerEvent) => {
            if (freeze) return
            const hit = pageHitAt(e.clientX, e.clientY)
            onLink = isTypeLink(hit)
            onView = !onLink && Boolean(viewHint) && isViewHint(hit)
            onDrag = !onLink && !onView && Boolean(dragHint) && isDragHint(hit)
            if (down) {
                addPull((e.clientX - lastPtrX) / 48, (e.clientY - lastPtrY) / 48)
            }
            lastPtrX = e.clientX
            lastPtrY = e.clientY
            tx = e.clientX
            ty = e.clientY
            if (!seen) {
                seen = true
                ix = gx = tx
                iy = gy = ty
            }
            kick()
        }

        const onDown = (e: PointerEvent) => {
            if (freeze) return
            down = true
            lastPtrX = e.clientX
            lastPtrY = e.clientY
            kick()
        }

        const onUp = () => {
            down = false
            kick()
        }

        const onWheel = (e: WheelEvent) => {
            if (freeze) return
            addPull(e.deltaX / 220, e.deltaY / 220)
        }

        measure()

        ink.setAttribute("data-ink-layer", "")
        ghost.setAttribute("data-ink-layer", "")
        if (tag) tag.setAttribute("data-ink-layer", "")

        if (freeze) {
            ink.style.position = "absolute"
            ghost.style.position = "absolute"
            if (tag) tag.style.position = "absolute"
            ink.style.left = "0"
            ink.style.top = "0"
            ghost.style.left = "0"
            ghost.style.top = "0"
            ix = gx = rest / 2
            iy = gy = rest / 2
            tx = ix
            ty = iy
            paint()
        } else {
            ink.style.position = "fixed"
            ghost.style.position = "fixed"
            if (tag) tag.style.position = "fixed"
            ink.style.left = "0"
            ink.style.top = "0"
            ghost.style.left = "0"
            ghost.style.top = "0"
            if (tag) {
                tag.style.left = "0"
                tag.style.top = "0"
            }
            document.body.appendChild(ghost)
            document.body.appendChild(ink)
            if (tag) document.body.appendChild(tag)
            document.head.appendChild(sheet)
            document.documentElement.classList.add("vitrine-ink")
            document.documentElement.style.cursor = "none"
            document.body.style.cursor = "none"
            window.addEventListener("pointermove", onMove, { passive: true })
            window.addEventListener("pointerdown", onDown)
            window.addEventListener("pointerup", onUp)
            window.addEventListener("pointercancel", onUp)
            window.addEventListener("wheel", onWheel, { passive: true })
            window.addEventListener(FIELD_REVIVE, revive)
            window.addEventListener("pageshow", revive)
            window.addEventListener("pagereveal", revive)
            window.addEventListener("popstate", revive)
            document.addEventListener("visibilitychange", revive)
            const nav = (window as unknown as { navigation?: EventTarget })
                .navigation
            nav?.addEventListener("currententrychange", revive)
            if (document.fonts?.ready) {
                void document.fonts.ready.then(() => {
                    measure()
                    paint()
                })
            }
            paint()
        }

        return () => {
            if (raf) window.cancelAnimationFrame(raf)
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerdown", onDown)
            window.removeEventListener("pointerup", onUp)
            window.removeEventListener("pointercancel", onUp)
            window.removeEventListener("wheel", onWheel)
            window.removeEventListener(FIELD_REVIVE, revive)
            window.removeEventListener("pageshow", revive)
            window.removeEventListener("pagereveal", revive)
            window.removeEventListener("popstate", revive)
            document.removeEventListener("visibilitychange", revive)
            const nav = (window as unknown as { navigation?: EventTarget })
                .navigation
            nav?.removeEventListener("currententrychange", revive)
            document.documentElement.style.cursor = prevHtmlCursor
            document.body.style.cursor = prevBodyCursor
            document.documentElement.classList.remove("vitrine-ink")
            wrap.appendChild(ghost)
            wrap.appendChild(ink)
            if (tag) wrap.appendChild(tag)
            if (sheet.parentNode) sheet.parentNode.removeChild(sheet)
        }
    }, [
        color,
        mix,
        size,
        lag,
        hideOnTouch,
        dragHint,
        viewHint,
        fontKey,
        labelColor,
        isStatic,
    ])

    return (
        <div
            ref={wrapRef}
            aria-hidden
            style={{
                position: "relative",
                width: size,
                height: size,
                pointerEvents: "none",
                overflow: "visible",
                ...style,
            }}
        >
            <div
                ref={ghostRef}
                style={{
                    ...layer,
                    zIndex: 9998,
                    width: size * 2,
                    height: size * 2,
                    background: "transparent",
                    border: `1px solid ${color}`,
                    boxSizing: "border-box",
                    mixBlendMode: mix,
                    opacity: 0,
                }}
            />
            <div
                ref={inkRef}
                style={{
                    ...layer,
                    width: size,
                    height: size,
                    background: color,
                    mixBlendMode: mix,
                }}
            />
            <div
                ref={labelRef}
                style={{
                    ...layer,
                    zIndex: 10000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: size,
                    height: size,
                    fontFamily: type.family,
                    fontWeight: type.weight,
                    fontStyle: type.style,
                    fontSize: 11,
                    lineHeight: 1,
                    letterSpacing: "0.05em",
                    color: labelColor,
                    mixBlendMode: "normal",
                    whiteSpace: "nowrap",
                    opacity: 0,
                    userSelect: "none",
                }}
            >
                {dragHint}
            </div>
        </div>
    )
}

InkCursor.displayName = "InkCursor"

InkCursor.defaultProps = {
    color: "rgb(18, 17, 16)",
    blend: "multiply",
    size: 8,
    lag: 0.22,
    hideOnTouch: true,
    label: "DRAG",
    viewLabel: "VIEW",
    font: { variant: "Bold" },
    labelColor: "rgb(247, 246, 242)",
}

addPropertyControls(InkCursor, {
    color: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "rgb(18, 17, 16)",
        description: "Ink. Bind the same token as FloorMark.",
    },
    blend: {
        type: ControlType.Enum,
        title: "Blend",
        options: [...BLENDS],
        optionTitles: [
            "Normal",
            "Multiply",
            "Difference",
            "Exclusion",
            "Screen",
            "Overlay",
        ],
        defaultValue: "multiply",
        description:
            "How the slab mixes with the page. Exclusion inverts on charcoal. Live cursor portals to the document so the blend is not trapped in the Stage.",
    },
    size: {
        type: ControlType.Number,
        title: "Size",
        unit: "px",
        min: 4,
        max: 24,
        step: 1,
        defaultValue: 8,
    },
    lag: {
        type: ControlType.Number,
        title: "Lag",
        min: 0.08,
        max: 1,
        step: 0.01,
        defaultValue: 0.22,
        description:
            "Ghost follow. 1 = stick. Lower = heavier. Inner slab stays snappy.",
    },
    hideOnTouch: {
        type: ControlType.Boolean,
        title: "Hide On Touch",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    label: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "DRAG",
        description:
            "Word over Piece List gaps (or data-ink=drag). Flat bar below the pointer. Empty keeps the small slab there.",
    },
    viewLabel: {
        type: ControlType.String,
        title: "View Label",
        defaultValue: "VIEW",
        description:
            "Word over a piece card (image link, or data-ink=view). Taller window locked to the pointer. Empty keeps the small slab on cards.",
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "basic",
        defaultFontType: "sans-serif",
        displayFontSize: false,
        displayTextAlignment: false,
        defaultValue: {
            variant: "Bold",
        },
        hidden: (props) =>
            !String(props.label || "").trim() &&
            !String(props.viewLabel || "").trim(),
        description: "Family and weight for the window word. Size is locked.",
    },
    labelColor: {
        type: ControlType.Color,
        title: "Label Color",
        defaultValue: "rgb(247, 246, 242)",
        hidden: (props) =>
            !String(props.label || "").trim() &&
            !String(props.viewLabel || "").trim(),
        description: "Sits above the blend so the word stays readable.",
    },
})


