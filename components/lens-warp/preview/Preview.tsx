import Kern_LensWarp from "../Kern_LensWarp"

const PAPER = "#F4F3F0"
const INK = "#0A0A0A"

function queryNumber(name: string, fallback: number): number {
    if (typeof window === "undefined") {
        return fallback
    }
    const raw = new URLSearchParams(window.location.search).get(name)
    if (raw == null || raw === "") {
        return fallback
    }
    const value = Number(raw)
    return Number.isFinite(value) ? value : fallback
}

export function Preview() {
    const distortionStrength = queryNumber("d", -1.4)
    const columns = queryNumber("cols", 3)
    const gap = queryNumber("gap", 8)
    const autoScroll = queryNumber("scroll", 0) === 1
    return (
        <main
            style={{
                minHeight: "100vh",
                margin: 0,
                background: PAPER,
                color: INK,
                fontFamily:
                    'Inter, Geist, "Helvetica Neue", Helvetica, Arial, sans-serif',
                boxSizing: "border-box",
                padding: "64px 24px 72px",
            }}
        >
            <div
                data-testid="lens-warp-frame"
                style={{
                    width: "min(1040px, 100%)",
                    height: 1232,
                    margin: "0 auto",
                }}
            >
                <Kern_LensWarp
                    distortionStrength={distortionStrength}
                    radius={1}
                    zoom={1.05}
                    aberration={0.012}
                    gloss={0.55}
                    backgroundColor={PAPER}
                    columns={columns}
                    gap={gap}
                    cellRadius={32}
                    autoScroll={autoScroll}
                    inertia={0.42}
                    viscosity={0.58}
                />
            </div>
            <p
                style={{
                    width: "min(1040px, 100%)",
                    margin: "40px auto 0",
                    fontSize: 13,
                    letterSpacing: "0.06em",
                    textAlign: "center",
                }}
            >
                <a
                    href="https://framer.link/builtbykern"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: "#5C5C59",
                        textDecoration: "none",
                    }}
                >
                    BuiltByKern
                </a>
            </p>
        </main>
    )
}
