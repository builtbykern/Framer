import {
    startTransition,
    useCallback,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from "react"
import { createPortal } from "react-dom"
import { useReducedMotion } from "framer-motion"
import {
    addPropertyControls,
    ControlType,
    useIsStaticRenderer,
} from "framer"

interface PageVeilProps {
    paper?: string
    paperColor?: string
    blur?: number
    blurAmount?: number
    delay?: number
    duration?: number
    zIndex?: number
    preview?: boolean
    style?: CSSProperties
}

type VeilPhase = "hidden" | "covering" | "covered" | "revealing"

const EASE = "cubic-bezier(0.5, 0, 0.5, 1)"
const PAPER = "#F6F3EE"
const BLUR_MAX = 20

function clampBlur(value: number): number {
    if (!Number.isFinite(value)) return 12
    return Math.min(BLUR_MAX, Math.max(0, value))
}

function prefersReducedMotion(): boolean {
    if (typeof window === "undefined") return false
    if (typeof window.matchMedia !== "function") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function isModifiedClick(event: MouseEvent): boolean {
    return (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    )
}

type HaldenWindow = Window & { __haldenAllowFramerNav?: boolean }

type VeilNavigateDetail = {
    href?: string
    native?: HTMLAnchorElement | null
}

function allowFramerNav(): boolean {
    if (typeof window === "undefined") return false
    return Boolean((window as HaldenWindow).__haldenAllowFramerNav)
}

function isWorkPath(href: string): boolean {
    try {
        return new URL(href, window.location.href).pathname
            .toLowerCase()
            .includes("/work/")
    } catch {
        return /\/work\//i.test(href)
    }
}

function firstAnchor(node: Element | null): HTMLAnchorElement | null {
    if (!node) return null
    if (node instanceof HTMLAnchorElement) return node
    const wrap = node.closest("a")
    if (wrap instanceof HTMLAnchorElement) return wrap
    const inner = node.querySelector("a[href]")
    if (inner instanceof HTMLAnchorElement) return inner
    return null
}

function nativeWorkAnchorFromHref(href: string): HTMLAnchorElement | null {
    if (typeof document === "undefined" || !href) return null
    let slug = ""
    try {
        slug = new URL(href, window.location.href).pathname
            .replace(/^\/work\//i, "")
            .replace(/\/+$/, "")
    } catch {
        return null
    }
    if (!slug || /:(?:slug|Work)\b/i.test(slug)) return null
    const cards = document.querySelectorAll(
        '[data-framer-name="Work Card"], [data-framer-name="Plane Card"]'
    )
    for (const card of Array.from(cards)) {
        const named = card.querySelector('[data-framer-name="Slug"]')
        const text = (named?.textContent || "").trim()
        if (text !== slug) continue
        const fromFrame = firstAnchor(
            card.querySelector('[data-framer-name="Work Link"]')
        )
        if (fromFrame) return fromFrame
        const fromCard = firstAnchor(card)
        if (fromCard) return fromCard
    }
    return null
}

function clickFramerAnchor(anchor: HTMLAnchorElement) {
    const w = window as HaldenWindow
    w.__haldenAllowFramerNav = true
    const prevPointer = anchor.style.pointerEvents
    anchor.style.pointerEvents = "auto"
    try {
        const opts: MouseEventInit = {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0,
            buttons: 1,
        }
        anchor.dispatchEvent(new MouseEvent("click", opts))
    } finally {
        anchor.style.pointerEvents = prevPointer
        w.__haldenAllowFramerNav = false
    }
}

function isPlaceholderPath(pathname: string): boolean {
    if (/\/work\/:(?:slug|Work)\b/i.test(pathname)) return true
    return false
}

function internalHref(anchor: HTMLAnchorElement): string | null {
    if (!anchor.href) return null
    if (anchor.target && anchor.target !== "_self") return null
    if (anchor.hasAttribute("download")) return null
    if (anchor.getAttribute("rel")?.includes("external")) return null

    let url: URL
    try {
        url = new URL(anchor.href, window.location.href)
    } catch {
        return null
    }

    if (url.origin !== window.location.origin) return null
    if (url.protocol !== "http:" && url.protocol !== "https:") return null
    if (isPlaceholderPath(url.pathname)) return null

    const next = `${url.pathname}${url.search}`
    const current = `${window.location.pathname}${window.location.search}`
    if (next === current) return null

    return url.href
}

function exhaustive(_phase: never): void {}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function PageVeil(props: PageVeilProps) {
    const paperColor = props.paper || props.paperColor || PAPER
    const blurAmount = clampBlur(props.blur ?? props.blurAmount ?? 4)
    const delay = Math.max(0, props.delay ?? 100)
    const duration = Math.max(0, props.duration ?? 490)
    const zIndex = props.zIndex ?? 20

    const isStatic = useIsStaticRenderer()
    const reduceMotion = Boolean(useReducedMotion())
    const reducedRef = useRef(isStatic || reduceMotion || prefersReducedMotion())
    const [phase, setPhase] = useState<VeilPhase>(() =>
        isStatic || reduceMotion || prefersReducedMotion() ? "hidden" : "covered"
    )
    const [portalReady, setPortalReady] = useState(false)
    const delayTimerRef = useRef<number | null>(null)
    const doneTimerRef = useRef<number | null>(null)
    const rafRef = useRef<number | null>(null)
    const navigatingRef = useRef(false)
    const lastPathRef = useRef("")
    const exitCoverRef = useRef(false)

    const clearTimers = useCallback(() => {
        if (typeof window === "undefined") return
        if (delayTimerRef.current !== null) {
            window.clearTimeout(delayTimerRef.current)
            delayTimerRef.current = null
        }
        if (doneTimerRef.current !== null) {
            window.clearTimeout(doneTimerRef.current)
            doneTimerRef.current = null
        }
        if (rafRef.current !== null) {
            window.cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
    }, [])

    const runReveal = useCallback(() => {
        clearTimers()
        if (isStatic || reducedRef.current) {
            startTransition(() => setPhase("hidden"))
            return
        }

        exitCoverRef.current = false
        startTransition(() => setPhase("covered"))
        delayTimerRef.current = window.setTimeout(() => {
            startTransition(() => setPhase("revealing"))
        }, delay)
        doneTimerRef.current = window.setTimeout(() => {
            startTransition(() => setPhase("hidden"))
        }, delay + duration)
    }, [clearTimers, delay, duration, isStatic])

    const coverThenGo = useCallback(
        (href: string, native?: HTMLAnchorElement | null) => {
            if (navigatingRef.current) return
            navigatingRef.current = true
            clearTimers()

            if (isStatic) return
            const go = () => {
                const target = native || nativeWorkAnchorFromHref(href)
                if (target) {
                    clickFramerAnchor(target)
                    return
                }
                if (isWorkPath(href)) return
                window.location.assign(href)
            }
            if (reducedRef.current) {
                go()
                return
            }

            exitCoverRef.current = true
            startTransition(() => setPhase("covering"))
            rafRef.current = window.requestAnimationFrame(() => {
                rafRef.current = window.requestAnimationFrame(() => {
                    startTransition(() => setPhase("covered"))
                })
            })
            doneTimerRef.current = window.setTimeout(go, duration)
        },
        [clearTimers, duration, isStatic]
    )

    useEffect(() => {
        if (typeof window === "undefined") return

        const media = window.matchMedia("(prefers-reduced-motion: reduce)")
        const syncReduced = () => {
            reducedRef.current = isStatic || reduceMotion || media.matches
            if (reducedRef.current) startTransition(() => setPhase("hidden"))
        }
        syncReduced()

        if (typeof media.addEventListener === "function") {
            media.addEventListener("change", syncReduced)
        } else {
            media.addListener(syncReduced)
        }

        return () => {
            if (typeof media.removeEventListener === "function") {
                media.removeEventListener("change", syncReduced)
            } else {
                media.removeListener(syncReduced)
            }
        }
    }, [isStatic, reduceMotion])

    useEffect(() => {
        if (isStatic || typeof window === "undefined") return

        lastPathRef.current = `${window.location.pathname}${window.location.search}`
        runReveal()

        const onPathChange = () => {
            const next = `${window.location.pathname}${window.location.search}`
            if (next === lastPathRef.current) return
            lastPathRef.current = next
            navigatingRef.current = false
            runReveal()
        }

        const onClick = (event: MouseEvent) => {
            if (allowFramerNav()) return
            if (navigatingRef.current) return
            if (isModifiedClick(event)) return
            const target = event.target
            if (!(target instanceof Element)) return
            const anchor = target.closest("a[href]")
            if (!(anchor instanceof HTMLAnchorElement)) return
            if (anchor.hasAttribute("data-halden-work-nav")) return
            if (anchor.closest("[data-halden-work-nav]")) return
            // Native CMS Frame links — Play only routes a trusted click.
            if (anchor.closest('[data-framer-name="Work Card"]')) return
            if (anchor.closest('[data-framer-name="Plane Card"]')) return
            if (anchor.closest('[data-framer-name="Series"]')) return
            if (anchor.closest('[data-framer-name="Phone Series"]')) return
            if (anchor.closest('[data-framer-name="Work Link"]')) return
            if (anchor.hasAttribute("data-driftplane-link")) return
            const href = internalHref(anchor)
            if (!href) return
            if (isWorkPath(href)) return
            event.preventDefault()
            coverThenGo(href, anchor)
        }

        const onVeilNavigate = (event: Event) => {
            const custom = event as CustomEvent<VeilNavigateDetail>
            const raw = custom.detail?.href
            if (!raw) return
            let resolved: string
            try {
                resolved = new URL(raw, window.location.href).href
            } catch {
                return
            }
            const next = new URL(resolved)
            if (next.origin !== window.location.origin) return
            if (isPlaceholderPath(next.pathname)) return
            const native = custom.detail?.native
            event.preventDefault()
            coverThenGo(
                resolved,
                native instanceof HTMLAnchorElement ? native : null
            )
        }

        window.addEventListener("popstate", onPathChange)
        window.addEventListener("halden:veil-navigate", onVeilNavigate)
        document.addEventListener("click", onClick, true)
        const poll = window.setInterval(onPathChange, 250)

        startTransition(() => setPortalReady(true))

        return () => {
            clearTimers()
            window.removeEventListener("popstate", onPathChange)
            window.removeEventListener("halden:veil-navigate", onVeilNavigate)
            document.removeEventListener("click", onClick, true)
            window.clearInterval(poll)
        }
    }, [clearTimers, coverThenGo, isStatic, runReveal])

    const animating =
        phase === "revealing" || (phase === "covered" && exitCoverRef.current)
    const shown = phase !== "hidden"

    let washOpacity = 0
    let blurPx = 0
    switch (phase) {
        case "hidden":
            washOpacity = 0
            blurPx = 0
            break
        case "covering":
            washOpacity = 0
            blurPx = 0
            break
        case "covered":
            washOpacity = 1
            blurPx = blurAmount
            break
        case "revealing":
            washOpacity = 0
            blurPx = 0
            break
        default:
            exhaustive(phase)
    }

    const overlay = (
        <div
            aria-hidden="true"
            data-halden-page-veil="true"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100dvh",
                zIndex,
                pointerEvents: shown ? "auto" : "none",
                visibility: shown ? "visible" : "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backdropFilter: `blur(${blurPx}px)`,
                    WebkitBackdropFilter: `blur(${blurPx}px)`,
                    transition: animating
                        ? `backdrop-filter ${duration}ms ${EASE}, -webkit-backdrop-filter ${duration}ms ${EASE}`
                        : "none",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: paperColor,
                    opacity: washOpacity,
                    transition: animating ? `opacity ${duration}ms ${EASE}` : "none",
                    pointerEvents: "none",
                }}
            />
        </div>
    )

    const tree: ReactNode =
        !isStatic && portalReady && typeof document !== "undefined"
            ? createPortal(overlay, document.body)
            : overlay

    return (
        <div
            style={{
                position: "relative",
                width: 0,
                height: 0,
                pointerEvents: "none",
                ...props.style,
            }}
        >
            {tree}
        </div>
    )
}

PageVeil.displayName = "Page Veil"

addPropertyControls(PageVeil, {
    paper: {
        type: ControlType.Color,
        title: "Paper",
        defaultValue: PAPER,
        description: "Wash color over the leaving page.",
    },
    blur: {
        type: ControlType.Number,
        title: "Blur",
        defaultValue: 4,
        min: 0,
        max: BLUR_MAX,
        step: 1,
        unit: "px",
        description: "Backdrop blur at full cover. Cap 20px.",
    },
    delay: {
        type: ControlType.Number,
        title: "Delay",
        defaultValue: 100,
        min: 0,
        max: 800,
        step: 10,
        unit: "ms",
        description: "Hold cover before the incoming page dissolves.",
    },
    duration: {
        type: ControlType.Number,
        title: "Duration",
        defaultValue: 490,
        min: 120,
        max: 800,
        step: 10,
        unit: "ms",
        description: "Cover and reveal length.",
    },
    zIndex: {
        type: ControlType.Number,
        title: "Z-Index",
        defaultValue: 20,
        min: 1,
        max: 29,
        step: 1,
        description: "Below Nav (30). Covers page content.",
    },
    preview: {
        type: ControlType.Boolean,
        title: "Preview",
        defaultValue: false,
        description:
            "BuiltByKern\n[Explore more components](https://www.framer.com/%40builtbykern/)",
    },
})
