import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { useInView } from "framer-motion"

interface EdgeRefractionShaderProps {
    topEnabled: boolean
    bottomEnabled: boolean
    edgeDepth: number
    curvature: number
    stretch: number
    chromaticAberration: number
    scrollResponse: number
    idleAmount: number
    idleSpeed: number
    style?: React.CSSProperties
}

type GLResources = {
    gl: WebGLRenderingContext
    program: WebGLProgram
    positionBuffer: WebGLBuffer
    indexBuffer: WebGLBuffer
    uniforms: Record<string, WebGLUniformLocation | null>
    attribs: { aPosition: number; aUV: number }
    indexCount: number
    segmentsX: number
    segmentsY: number
}

type RuntimeParams = {
    topEnabled: boolean
    bottomEnabled: boolean
    edgeDepth: number
    curvature: number
    stretch: number
    chromaticAberration: number
    scrollResponse: number
    idleAmount: number
    idleSpeed: number
}

const QUIET_MS = 200
const QUIET_INTENSITY = 0.02
const MAX_CONTEXT_RESTORES = 2

const VERTEX_SHADER = `
attribute vec2 aPosition;
attribute vec2 aUV;
varying vec2 vUV;
uniform float uCurvature;
uniform float uEdgeDepth;
uniform float uStretch;
uniform float uTopEnabled;
uniform float uBottomEnabled;
uniform float uPhase;
uniform float uIntensity;

void main() {
    vec2 pos = aPosition;
    vUV = aUV;

    float topMask = step(0.0, pos.y) * uTopEnabled;
    float bottomMask = step(pos.y, 0.0) * uBottomEnabled;
    float edgeMask = topMask + bottomMask;

    float edgeN = pow(abs(pos.y), 1.35);
    float bow = pow(edgeN, 1.35) * uCurvature;
    float inward = -sign(pos.y) * bow * (0.55 + 0.45 * abs(pos.x));
    float stretchX = (1.0 + edgeN * uStretch * 0.28) * pos.x;

    float dyn = 1.0 + uIntensity * 0.6;
    pos.y += inward * uEdgeDepth * edgeMask * dyn;
    pos.x = mix(pos.x, stretchX, edgeMask);

    float phaseWave = sin((pos.x * 2.8 + pos.y * 1.3) + uPhase) * 0.02 * uIntensity;
    pos.y += phaseWave * edgeMask * edgeN;

    gl_Position = vec4(pos, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision mediump float;
varying vec2 vUV;
uniform float uCurvature;
uniform float uEdgeDepth;
uniform float uStretch;
uniform float uChromatic;
uniform float uTopEnabled;
uniform float uBottomEnabled;
uniform float uPhase;
uniform float uIntensity;

void main() {
    vec2 uv = vUV;
    float edgeN = pow(abs(uv.y * 2.0 - 1.0), 1.7);
    float topMask = step(0.5, uv.y) * uTopEnabled;
    float bottomMask = step(uv.y, 0.5) * uBottomEnabled;
    float edgeMask = topMask + bottomMask;

    float centerDist = abs(uv.x - 0.5) * 2.0;
    float lens = edgeN * edgeMask;
    float pull = uCurvature * uEdgeDepth * (0.08 + 0.20 * centerDist) * (1.0 + 0.45 * uIntensity);
    float squeeze = uStretch * edgeN * 0.06;

    vec2 warp = vec2(
        (uv.x - 0.5) * squeeze,
        -(uv.y - 0.5) * pull
    );

    float phaseWave = sin((uv.x * 7.0 + uv.y * 3.5) + uPhase) * 0.004 * uIntensity;
    warp.y += phaseWave * lens;

    vec2 baseUV = clamp(uv + warp * lens, 0.0, 1.0);
    float ca = uChromatic * lens * (0.004 + 0.012 * uIntensity);
    vec2 caDir = normalize(vec2(uv.x - 0.5, uv.y - 0.5) + vec2(0.0001, 0.0));
    vec2 offset = caDir * ca;

    float band = smoothstep(0.10, 1.0, lens) * (0.18 + 0.42 * uEdgeDepth);
    float wave = 0.5 + 0.5 * sin((baseUV.x * 8.0 + baseUV.y * 5.0) + uPhase * 0.8);
    float alpha = band * (0.35 + 0.65 * wave);
    vec3 baseTint = vec3(1.0);
    vec3 rgb = mix(baseTint, vec3(1.0 + offset.x * 18.0, 1.0, 1.0 - offset.x * 18.0), min(1.0, uChromatic * lens * 2.0));
    gl_FragColor = vec4(rgb, alpha * 0.28);
}
`

function createShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
): WebGLShader | null {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
    }
    return shader
}

function createProgram(
    gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string
): WebGLProgram | null {
    const vs = createShader(gl, gl.VERTEX_SHADER, vertexSource)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
    if (!vs || !fs) return null
    const program = gl.createProgram()
    if (!program) return null
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program)
        return null
    }
    return program
}

function buildMesh(segmentsX: number, segmentsY: number) {
    const vertices: number[] = []
    const indices: number[] = []
    for (let y = 0; y <= segmentsY; y++) {
        for (let x = 0; x <= segmentsX; x++) {
            const u = x / segmentsX
            const v = y / segmentsY
            vertices.push(u * 2 - 1, v * 2 - 1, u, v)
        }
    }
    for (let y = 0; y < segmentsY; y++) {
        for (let x = 0; x < segmentsX; x++) {
            const i = y * (segmentsX + 1) + x
            const a = i
            const b = i + 1
            const c = i + segmentsX + 1
            const d = c + 1
            indices.push(a, c, b, b, c, d)
        }
    }
    return {
        vertices: new Float32Array(vertices),
        indices: new Uint16Array(indices),
    }
}

/** Desktop ≤48×36, narrow/mobile ≤32×24 */
function meshSegmentsForWidth(cssWidth: number): { x: number; y: number } {
    if (cssWidth < 600) return { x: 32, y: 24 }
    return { x: 48, y: 36 }
}

function setupGL(
    canvas: HTMLCanvasElement,
    segmentsX: number,
    segmentsY: number
): GLResources | null {
    const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
    })
    if (!gl) return null
    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER)
    if (!program) return null
    const mesh = buildMesh(segmentsX, segmentsY)
    const positionBuffer = gl.createBuffer()
    const indexBuffer = gl.createBuffer()
    if (!positionBuffer || !indexBuffer) return null

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW)

    const aPosition = gl.getAttribLocation(program, "aPosition")
    const aUV = gl.getAttribLocation(program, "aUV")
    const uniforms = {
        uCurvature: gl.getUniformLocation(program, "uCurvature"),
        uEdgeDepth: gl.getUniformLocation(program, "uEdgeDepth"),
        uStretch: gl.getUniformLocation(program, "uStretch"),
        uChromatic: gl.getUniformLocation(program, "uChromatic"),
        uTopEnabled: gl.getUniformLocation(program, "uTopEnabled"),
        uBottomEnabled: gl.getUniformLocation(program, "uBottomEnabled"),
        uPhase: gl.getUniformLocation(program, "uPhase"),
        uIntensity: gl.getUniformLocation(program, "uIntensity"),
    }
    return {
        gl,
        program,
        positionBuffer,
        indexBuffer,
        uniforms,
        attribs: { aPosition, aUV },
        indexCount: mesh.indices.length,
        segmentsX,
        segmentsY,
    }
}

function tearDownGL(glRes: GLResources) {
    glRes.gl.deleteBuffer(glRes.positionBuffer)
    glRes.gl.deleteBuffer(glRes.indexBuffer)
    glRes.gl.deleteProgram(glRes.program)
}

function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = React.useState(true)

    React.useEffect(() => {
        if (typeof window === "undefined") return
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        const sync = () => setReduced(mq.matches)
        sync()
        mq.addEventListener("change", sync)
        return () => mq.removeEventListener("change", sync)
    }, [])

    return reduced
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function EdgeRefractionShader(props: EdgeRefractionShaderProps) {
    const {
        topEnabled,
        bottomEnabled,
        edgeDepth,
        curvature,
        stretch,
        chromaticAberration,
        scrollResponse,
        idleAmount,
        idleSpeed,
        style,
    } = props
    const isStatic = useIsStaticRenderer()
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const wrapperRef = React.useRef<HTMLDivElement | null>(null)
    const inView = useInView(wrapperRef, { amount: 0.1 })
    const glRef = React.useRef<GLResources | null>(null)
    const rafRef = React.useRef(0)
    const isAnimatingRef = React.useRef(false)
    const ensureRafRef = React.useRef<() => void>(() => {})
    const restoreAttemptsRef = React.useRef(0)
    const runtimeRef = React.useRef<RuntimeParams>({
        topEnabled,
        bottomEnabled,
        edgeDepth,
        curvature,
        stretch,
        chromaticAberration,
        scrollResponse,
        idleAmount,
        idleSpeed,
    })
    const motionRef = React.useRef({
        phase: 0,
        smoothVel: 0,
        targetVel: 0,
        scrollKick: 0,
        lastScrollY: 0,
        lastScrollT: 0,
        quietSince: 0,
    })
    const [webglFailed, setWebglFailed] = React.useState(false)
    const reducedMotion = usePrefersReducedMotion()

    const isAnimating = !reducedMotion && !isStatic && inView
    React.useEffect(() => {
        isAnimatingRef.current = isAnimating
    }, [isAnimating])

    React.useEffect(() => {
        runtimeRef.current = {
            topEnabled,
            bottomEnabled,
            edgeDepth,
            curvature,
            stretch,
            chromaticAberration,
            scrollResponse,
            idleAmount,
            idleSpeed,
        }
    }, [
        topEnabled,
        bottomEnabled,
        edgeDepth,
        curvature,
        stretch,
        chromaticAberration,
        scrollResponse,
        idleAmount,
        idleSpeed,
    ])

    const resizeCanvas = React.useCallback(() => {
        const canvas = canvasRef.current
        const host = wrapperRef.current
        const glRes = glRef.current
        if (!canvas || !host || !glRes) return
        const rect = host.getBoundingClientRect()
        const dpr =
            typeof window !== "undefined"
                ? Math.min(window.devicePixelRatio || 1, 2)
                : 1
        const w = Math.max(1, Math.floor(rect.width * dpr))
        const h = Math.max(1, Math.floor(rect.height * dpr))
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w
            canvas.height = h
        }
        glRes.gl.viewport(0, 0, canvas.width, canvas.height)

        const next = meshSegmentsForWidth(rect.width)
        if (
            next.x !== glRes.segmentsX ||
            next.y !== glRes.segmentsY
        ) {
            const rebuilt = setupGL(canvas, next.x, next.y)
            if (rebuilt) {
                tearDownGL(glRes)
                glRef.current = rebuilt
                rebuilt.gl.viewport(0, 0, canvas.width, canvas.height)
            }
        }
    }, [])

    const drawFrame = React.useCallback(
        (t: number) => {
            const glRes = glRef.current
            if (!glRes) return
            const { gl } = glRes
            resizeCanvas()

            const runtime = runtimeRef.current
            const motion = motionRef.current

            motion.smoothVel += (motion.targetVel - motion.smoothVel) * 0.1
            motion.scrollKick +=
                (Math.abs(motion.smoothVel) - motion.scrollKick) * 0.08
            motion.targetVel *= 0.94

            const shouldAnimate = isAnimatingRef.current
            const idle = shouldAnimate
                ? Math.sin(t * 0.001 * runtime.idleSpeed) * runtime.idleAmount
                : 0
            const scrollAmt = shouldAnimate
                ? motion.smoothVel * runtime.scrollResponse
                : 0
            const intensity = Math.max(
                0,
                Math.min(
                    1.8,
                    Math.abs(scrollAmt) +
                        motion.scrollKick * runtime.scrollResponse +
                        Math.abs(idle)
                )
            )
            motion.phase += 0.012 + idle * 0.04 + scrollAmt * 0.05

            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(glRes.program)
            gl.bindBuffer(gl.ARRAY_BUFFER, glRes.positionBuffer)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glRes.indexBuffer)
            gl.enableVertexAttribArray(glRes.attribs.aPosition)
            gl.vertexAttribPointer(
                glRes.attribs.aPosition,
                2,
                gl.FLOAT,
                false,
                16,
                0
            )
            gl.enableVertexAttribArray(glRes.attribs.aUV)
            gl.vertexAttribPointer(glRes.attribs.aUV, 2, gl.FLOAT, false, 16, 8)

            gl.uniform1f(glRes.uniforms.uCurvature, runtime.curvature)
            gl.uniform1f(glRes.uniforms.uEdgeDepth, runtime.edgeDepth)
            gl.uniform1f(glRes.uniforms.uStretch, runtime.stretch)
            gl.uniform1f(glRes.uniforms.uChromatic, runtime.chromaticAberration)
            gl.uniform1f(glRes.uniforms.uTopEnabled, runtime.topEnabled ? 1 : 0)
            gl.uniform1f(
                glRes.uniforms.uBottomEnabled,
                runtime.bottomEnabled ? 1 : 0
            )
            gl.uniform1f(glRes.uniforms.uPhase, motion.phase)
            gl.uniform1f(glRes.uniforms.uIntensity, intensity)
            gl.drawElements(
                gl.TRIANGLES,
                glRes.indexCount,
                gl.UNSIGNED_SHORT,
                0
            )

            if (!shouldAnimate) return

            const busy =
                intensity > QUIET_INTENSITY ||
                runtime.idleAmount > 0 ||
                Math.abs(motion.targetVel) > 0.001 ||
                motion.scrollKick > QUIET_INTENSITY

            if (busy) {
                motion.quietSince = 0
                rafRef.current = requestAnimationFrame(drawFrame)
                return
            }

            if (!motion.quietSince) motion.quietSince = t
            if (t - motion.quietSince < QUIET_MS) {
                rafRef.current = requestAnimationFrame(drawFrame)
                return
            }
            rafRef.current = 0
        },
        [resizeCanvas]
    )

    const ensureRaf = React.useCallback(() => {
        if (!isAnimatingRef.current) return
        if (rafRef.current) return
        motionRef.current.quietSince = 0
        rafRef.current = requestAnimationFrame(drawFrame)
    }, [drawFrame])

    React.useEffect(() => {
        ensureRafRef.current = ensureRaf
    }, [ensureRaf])

    React.useEffect(() => {
        if (isStatic) return
        const canvas = canvasRef.current
        if (!canvas) return

        const host = wrapperRef.current
        const cssW = host?.getBoundingClientRect().width ?? 800
        const segs = meshSegmentsForWidth(cssW)

        const initGL = () => {
            const glRes = setupGL(canvas, segs.x, segs.y)
            if (!glRes) {
                React.startTransition(() => setWebglFailed(true))
                return null
            }
            glRef.current = glRes
            React.startTransition(() => setWebglFailed(false))
            return glRes
        }

        let glRes = initGL()
        if (!glRes) return

        const motion = motionRef.current
        motion.lastScrollY = typeof window !== "undefined" ? window.scrollY : 0
        motion.lastScrollT =
            typeof performance !== "undefined" ? performance.now() : 0
        resizeCanvas()

        const onScroll = () => {
            if (
                typeof window === "undefined" ||
                typeof performance === "undefined"
            )
                return
            const now = performance.now()
            const y = window.scrollY
            const dt = Math.max(8, now - motion.lastScrollT)
            const vy = (y - motion.lastScrollY) / dt
            motion.targetVel = Math.max(-4, Math.min(4, vy))
            motion.lastScrollY = y
            motion.lastScrollT = now
            motion.quietSince = 0
            ensureRafRef.current()
        }

        const onContextLost = (event: Event) => {
            event.preventDefault()
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = 0
            }
            if (glRef.current) {
                tearDownGL(glRef.current)
                glRef.current = null
            }
        }

        const onContextRestored = () => {
            if (restoreAttemptsRef.current >= MAX_CONTEXT_RESTORES) {
                React.startTransition(() => setWebglFailed(true))
                return
            }
            restoreAttemptsRef.current += 1
            const hostW = wrapperRef.current?.getBoundingClientRect().width ?? 800
            const nextSegs = meshSegmentsForWidth(hostW)
            const restored = setupGL(canvas, nextSegs.x, nextSegs.y)
            if (!restored) {
                React.startTransition(() => setWebglFailed(true))
                return
            }
            glRef.current = restored
            React.startTransition(() => setWebglFailed(false))
            resizeCanvas()
            drawFrame(typeof performance !== "undefined" ? performance.now() : 0)
            ensureRafRef.current()
        }

        canvas.addEventListener("webglcontextlost", onContextLost, false)
        canvas.addEventListener("webglcontextrestored", onContextRestored, false)

        const resizeObserver =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(resizeCanvas)
                : null
        if (resizeObserver && wrapperRef.current)
            resizeObserver.observe(wrapperRef.current)

        const scrollAttached =
            typeof window !== "undefined" && !reducedMotion
        if (scrollAttached)
            window.addEventListener("scroll", onScroll, { passive: true })

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = 0
            }
            if (scrollAttached)
                window.removeEventListener("scroll", onScroll)
            if (resizeObserver) resizeObserver.disconnect()
            canvas.removeEventListener("webglcontextlost", onContextLost, false)
            canvas.removeEventListener(
                "webglcontextrestored",
                onContextRestored,
                false
            )
            if (glRef.current) {
                tearDownGL(glRef.current)
                glRef.current = null
            }
        }
    }, [drawFrame, resizeCanvas, isStatic, reducedMotion])

    React.useEffect(() => {
        if (isStatic) return
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = 0
        }
        drawFrame(typeof performance !== "undefined" ? performance.now() : 0)
        if (isAnimating) {
            motionRef.current.quietSince = 0
            rafRef.current = requestAnimationFrame(drawFrame)
        }
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = 0
            }
        }
    }, [isAnimating, drawFrame, isStatic])

    React.useEffect(() => {
        drawFrame(typeof performance !== "undefined" ? performance.now() : 0)
    }, [
        topEnabled,
        bottomEnabled,
        edgeDepth,
        curvature,
        stretch,
        chromaticAberration,
        scrollResponse,
        idleAmount,
        idleSpeed,
        drawFrame,
    ])

    const placeholderText = React.useMemo(() => {
        if (webglFailed) return "WebGL unavailable in this environment."
        return ""
    }, [webglFailed])

    return (
        <div
            ref={wrapperRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    background: "transparent",
                }}
                aria-hidden={true}
            />
            {placeholderText ? (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: 16,
                        color: "#000000",
                        background: "rgba(255,255,255,0.22)",
                        fontSize: 13,
                        lineHeight: 1.35,
                    }}
                >
                    {placeholderText}
                </div>
            ) : null}
        </div>
    )
}

EdgeRefractionShader.displayName = "EdgeRefractionShader"

addPropertyControls(EdgeRefractionShader, {
    topEnabled: {
        type: ControlType.Boolean,
        title: "Top",
        defaultValue: true,
    },
    bottomEnabled: {
        type: ControlType.Boolean,
        title: "Bottom",
        defaultValue: true,
    },
    edgeDepth: {
        type: ControlType.Number,
        title: "Edge Depth",
        defaultValue: 0.68,
        min: 0,
        max: 1.5,
        step: 0.01,
    },
    curvature: {
        type: ControlType.Number,
        title: "Curvature",
        defaultValue: 0.95,
        min: 0,
        max: 2,
        step: 0.01,
    },
    stretch: {
        type: ControlType.Number,
        title: "Stretch",
        defaultValue: 0.85,
        min: 0,
        max: 2.2,
        step: 0.01,
    },
    chromaticAberration: {
        type: ControlType.Number,
        title: "Chromatic",
        defaultValue: 0.28,
        min: 0,
        max: 1,
        step: 0.01,
    },
    scrollResponse: {
        type: ControlType.Number,
        title: "Scroll",
        defaultValue: 0.65,
        min: 0,
        max: 1.5,
        step: 0.01,
    },
    idleAmount: {
        type: ControlType.Number,
        title: "Idle Amt",
        defaultValue: 0,
        min: 0,
        max: 0.7,
        step: 0.01,
    },
    idleSpeed: {
        type: ControlType.Number,
        title: "Idle Speed",
        defaultValue: 0.9,
        min: 0.1,
        max: 3,
        step: 0.01,
    },
})
