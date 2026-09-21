import Kern_LensWarp from "../Kern_LensWarp"

const PAPER = "#F4F3F0"
const INK = "#0A0A0A"
const STILL = "/still.jpg"

export function Preview() {
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
                padding: "40px 24px 48px",
            }}
        >
            <div
                data-testid="lens-warp-frame"
                style={{
                    width: "min(800px, 100%)",
                    height: 520,
                    margin: "0 auto",
                }}
            >
                <Kern_LensWarp
                    image={STILL}
                    distortionStrength={-0.65}
                    radius={0.45}
                    zoom={1}
                    aberration={0.015}
                    followPointer
                    backgroundColor={PAPER}
                    gloss={0.25}
                    verticalScale={1}
                    inertia={0.15}
                    viscosity={0.2}
                />
            </div>
            <p
                style={{
                    width: "min(800px, 100%)",
                    margin: "18px auto 0",
                    fontSize: 13,
                    letterSpacing: "0.02em",
                }}
            >
                <a
                    href="https://framer.link/builtbykern"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: INK,
                        textDecoration: "none",
                    }}
                >
                    BuiltByKern
                </a>
            </p>
        </main>
    )
}
