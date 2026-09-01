import * as React from "react"
import { type ComponentType } from "react"

function createFilterSvg(
    filterId: string,
    yDispId: string,
    xDispId: string
): SVGSVGElement {
    const svgNS = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(svgNS, "svg")
    svg.setAttribute("width", "0")
    svg.setAttribute("height", "0")
    svg.setAttribute("aria-hidden", "true")
    svg.style.position = "absolute"
    svg.style.left = "-99999px"
    svg.style.top = "-99999px"
    svg.style.pointerEvents = "none"

    const defs = document.createElementNS(svgNS, "defs")
    const filter = document.createElementNS(svgNS, "filter")
    filter.setAttribute("id", filterId)
    filter.setAttribute("x", "-8%")
    filter.setAttribute("y", "-8%")
    filter.setAttribute("width", "116%")
    filter.setAttribute("height", "116%")
    filter.setAttribute("color-interpolation-filters", "sRGB")

    const yMap = document.createElementNS(svgNS, "feImage")
    yMap.setAttribute("result", "yMap")
    yMap.setAttribute("preserveAspectRatio", "none")
    yMap.setAttribute(
        "href",
        "data:image/svg+xml;utf8," +
            encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>
                  <defs>
                    <linearGradient id='gY' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='0%' stop-color='rgb(255,255,255)'/>
                      <stop offset='50%' stop-color='rgb(128,128,128)'/>
                      <stop offset='100%' stop-color='rgb(0,0,0)'/>
                    </linearGradient>
                  </defs>
                  <rect width='100' height='100' fill='url(#gY)'/>
                </svg>`
            )
    )

    const xMap = document.createElementNS(svgNS, "feImage")
    xMap.setAttribute("result", "xMap")
    xMap.setAttribute("preserveAspectRatio", "none")
    xMap.setAttribute(
        "href",
        "data:image/svg+xml;utf8," +
            encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>
                  <defs>
                    <linearGradient id='gx' x1='0' y1='0' x2='1' y2='0'>
                      <stop offset='0%' stop-color='rgb(0,0,0)'/>
                      <stop offset='50%' stop-color='rgb(128,128,128)'/>
                      <stop offset='100%' stop-color='rgb(255,255,255)'/>
                    </linearGradient>
                  </defs>
                  <rect width='100' height='100' fill='url(#gx)'/>
                </svg>`
            )
    )

    const edgeMask = document.createElementNS(svgNS, "feImage")
    edgeMask.setAttribute("result", "edgeMask")
    edgeMask.setAttribute("preserveAspectRatio", "none")
    edgeMask.setAttribute(
        "href",
        "data:image/svg+xml;utf8," +
            encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>
                  <defs>
                    <linearGradient id='gm' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='0%' stop-color='white'/>
                      <stop offset='18%' stop-color='white'/>
                      <stop offset='50%' stop-color='black'/>
                      <stop offset='82%' stop-color='white'/>
                      <stop offset='100%' stop-color='white'/>
                    </linearGradient>
                  </defs>
                  <rect width='100' height='100' fill='url(#gm)'/>
                </svg>`
            )
    )

    const xEdge = document.createElementNS(svgNS, "feComposite")
    xEdge.setAttribute("in", "xMap")
    xEdge.setAttribute("in2", "edgeMask")
    xEdge.setAttribute("operator", "arithmetic")
    xEdge.setAttribute("k1", "1")
    xEdge.setAttribute("k2", "0")
    xEdge.setAttribute("k3", "0")
    xEdge.setAttribute("k4", "0")
    xEdge.setAttribute("result", "xEdge")

    const dispY = document.createElementNS(svgNS, "feDisplacementMap")
    dispY.setAttribute("id", yDispId)
    dispY.setAttribute("in", "SourceGraphic")
    dispY.setAttribute("in2", "yMap")
    dispY.setAttribute("xChannelSelector", "R")
    dispY.setAttribute("yChannelSelector", "R")
    dispY.setAttribute("scale", "0")
    dispY.setAttribute("result", "warpY")

    const dispX = document.createElementNS(svgNS, "feDisplacementMap")
    dispX.setAttribute("id", xDispId)
    dispX.setAttribute("in", "warpY")
    dispX.setAttribute("in2", "xEdge")
    dispX.setAttribute("xChannelSelector", "R")
    dispX.setAttribute("yChannelSelector", "R")
    dispX.setAttribute("scale", "0")
    dispX.setAttribute("result", "warped")

    const fringeR = document.createElementNS(svgNS, "feOffset")
    fringeR.setAttribute("in", "warped")
    fringeR.setAttribute("dx", "0.4")
    fringeR.setAttribute("dy", "0")
    fringeR.setAttribute("result", "rOff")

    const fringeB = document.createElementNS(svgNS, "feOffset")
    fringeB.setAttribute("in", "warped")
    fringeB.setAttribute("dx", "-0.4")
    fringeB.setAttribute("dy", "0")
    fringeB.setAttribute("result", "bOff")

    const merge = document.createElementNS(svgNS, "feMerge")
    const n1 = document.createElementNS(svgNS, "feMergeNode")
    n1.setAttribute("in", "rOff")
    const n2 = document.createElementNS(svgNS, "feMergeNode")
    n2.setAttribute("in", "warped")
    const n3 = document.createElementNS(svgNS, "feMergeNode")
    n3.setAttribute("in", "bOff")
    merge.appendChild(n1)
    merge.appendChild(n2)
    merge.appendChild(n3)

    filter.appendChild(yMap)
    filter.appendChild(xMap)
    filter.appendChild(edgeMask)
    filter.appendChild(xEdge)
    filter.appendChild(dispY)
    filter.appendChild(dispX)
    filter.appendChild(fringeR)
    filter.appendChild(fringeB)
    filter.appendChild(merge)
    defs.appendChild(filter)
    svg.appendChild(defs)
    return svg
}

/**
 * Experimental page-content warp (SVG displacement).
 * Not the Marketplace primary — use EdgeRefractionShader for insertable chrome.
 * Apply on a Frame/Page breakpoint via Code Override.
 */
export function withEdgeRefractionOverride(
    Component: ComponentType<any>
): ComponentType {
    return React.forwardRef((props: any, ref) => {
        const filterId = React.useMemo(
            () => `edge-refraction-${Math.random().toString(36).slice(2)}`,
            []
        )
        const yDispId = React.useMemo(
            () => `edge-refraction-y-${Math.random().toString(36).slice(2)}`,
            []
        )
        const xDispId = React.useMemo(
            () => `edge-refraction-x-${Math.random().toString(36).slice(2)}`,
            []
        )
        const [filterReady, setFilterReady] = React.useState(false)
        const [reduced, setReduced] = React.useState(true)

        React.useEffect(() => {
            if (typeof window === "undefined") return
            const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
            const sync = () => setReduced(mq.matches)
            sync()
            mq.addEventListener("change", sync)
            return () => mq.removeEventListener("change", sync)
        }, [])

        React.useEffect(() => {
            if (typeof window === "undefined" || typeof document === "undefined")
                return

            if (reduced) {
                React.startTransition(() => setFilterReady(false))
                return
            }

            const svg = createFilterSvg(filterId, yDispId, xDispId)
            document.body.appendChild(svg)

            const yEl = svg.querySelector(
                `#${yDispId}`
            ) as SVGFEDisplacementMapElement | null
            const xEl = svg.querySelector(
                `#${xDispId}`
            ) as SVGFEDisplacementMapElement | null
            if (!yEl || !xEl) {
                if (svg.parentNode) svg.parentNode.removeChild(svg)
                return
            }

            React.startTransition(() => setFilterReady(true))

            let raf = 0
            let targetVel = 0
            let smoothVel = 0
            let kick = 0
            let phase = 0
            let lastY = window.scrollY
            let lastT = performance.now()

            const onScroll = () => {
                const now = performance.now()
                const y = window.scrollY
                const dt = Math.max(8, now - lastT)
                const velocity = (y - lastY) / dt
                targetVel = Math.max(-4, Math.min(4, velocity))
                lastY = y
                lastT = now
            }

            const tick = (t: number) => {
                smoothVel += (targetVel - smoothVel) * 0.11
                targetVel *= 0.94
                kick += (Math.abs(smoothVel) - kick) * 0.08
                phase += 0.012
                const pulse = Math.sin(t * 0.0012 + phase) * 0.35
                const intensity = Math.min(
                    1.8,
                    Math.abs(smoothVel) * 1.2 + kick * 0.9 + Math.abs(pulse) * 0.35
                )

                yEl.setAttribute("scale", `${8 + intensity * 36}`)
                xEl.setAttribute("scale", `${2 + intensity * 10}`)
                raf = requestAnimationFrame(tick)
            }

            window.addEventListener("scroll", onScroll, { passive: true })
            tick(performance.now())

            return () => {
                if (raf) cancelAnimationFrame(raf)
                window.removeEventListener("scroll", onScroll)
                if (svg.parentNode) svg.parentNode.removeChild(svg)
                React.startTransition(() => setFilterReady(false))
            }
        }, [filterId, xDispId, yDispId, reduced])

        const filterActive = filterReady && !reduced
        return (
            <Component
                ref={ref}
                {...props}
                style={{
                    ...props.style,
                    filter: filterActive
                        ? `url(#${filterId})`
                        : props.style?.filter,
                    WebkitFilter: filterActive
                        ? `url(#${filterId})`
                        : props.style?.WebkitFilter,
                    pointerEvents: props.style?.pointerEvents ?? "auto",
                    willChange: filterActive ? "filter" : props.style?.willChange,
                }}
            />
        )
    })
}
