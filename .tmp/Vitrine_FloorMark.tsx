import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { useLayoutEffect, useRef, type CSSProperties } from "react"

interface FloorMarkProps {
    text?: string
    color?: string
    ink?: string
    tracking?: number
    strength?: number
    radius?: number
    persistence?: number
    idle?: number
    melt?: boolean
    style?: CSSProperties
}

const TRAIL = 16
const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec3 uTrail[${TRAIL}];
uniform vec2 uVel;
uniform float uRadius;
uniform float uStrength;
uniform float uTime;
uniform float uIdle;

void main() {
    vec2 uv = vUv;
    uv.x += sin(uv.y * 7.2 + uTime * 0.42) * uIdle * 0.01;
    uv.y += cos(uv.x * 3.1 + uTime * 0.27) * uIdle * 0.004;
    vec2 aspect = vec2(uRes.x / max(uRes.y, 1.0), 1.0);
    for (int i = 0; i < ${TRAIL}; i++) {
        vec3 t = uTrail[i];
        if (t.z >= 0.002) {
            vec2 p = vec2(t.x, t.y);
            vec2 d = (uv - p) * aspect;
            float dist = length(d);
            float sigma = max(uRadius * mix(0.55, 1.1, t.z), 0.07);
            float fall = exp(-dist * dist / (sigma * sigma));
            vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0);
            vec2 curl = vec2(-dir.y, dir.x);
            float vlen = length(uVel);
            vec2 smear = vlen > 0.0004 ? uVel / vlen : dir;
            uv -= (smear * 0.78 + curl * 0.22) * fall * uStrength * t.z * 0.72;
        }
    }
    uv = clamp(uv, 0.0, 1.0);
    gl_FragColor = texture2D(uTex, uv);
}
`

function reducedMotion(): boolean {
    if (typeof window === "undefined") return true
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function coarsePointer(): boolean {
    if (typeof window === "undefined") return true
    return window.matchMedia("(pointer: coarse)").matches
}

function isHidden(el: HTMLElement | null): boolean {
    if (!el) return true
    const s = window.getComputedStyle(el)
    if (s.display === "none" || s.visibility === "hidden") return true
    return el.getClientRects().length === 0
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
    const sh = gl.createShader(type)
    if (!sh) return null
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh)
        return null
    }
    return sh
}

function makeProgram(gl: WebGLRenderingContext) {
    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return null
    const prog = gl.createProgram()
    if (!prog) return null
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
    return prog
}

function paintWord(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    text: string,
    color: string,
    tracking: number
) {
    ctx.clearRect(0, 0, w, h)
    if (w < 2 || h < 2) return
    ctx.fillStyle = color
    ctx.textAlign = "left"
    ctx.textBaseline = "alphabetic"
    const spaced = ctx as CanvasRenderingContext2D & { letterSpacing: string }
    const apply = (px: number) => {
        ctx.font = `700 ${px}px Archivo, sans-serif`
        spaced.letterSpacing = `${tracking * px}px`
    }
    apply(h)
    const ink = ctx.measureText(text).actualBoundingBoxAscent
    apply(ink > 1 ? (h * h) / ink : h * 1.22)
    const measured = Math.max(ctx.measureText(text).width, 1)
    ctx.save()
    ctx.setTransform(w / measured, 0, 0, 1, 0, 0)
    ctx.fillText(text, 0, h)
    ctx.restore()
}

/**
 * Floor wordmark: one-line type that fills the parent, pointer-warped.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function FloorMark(props: FloorMarkProps) {
    const {
        text = "vitrine",
        color,
        ink,
        tracking = -0.05,
        strength = 0.36,
        radius = 0.22,
        persistence = 0.93,
        idle = 0.02,
        melt = true,
        style,
    } = props
    const fill = color || ink || "rgb(18, 17, 16)"
    const isStatic = useIsStaticRenderer()
    const wrapRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useLayoutEffect(() => {
        const canvas = canvasRef.current
        const wrap = wrapRef.current
        if (!canvas || !wrap || typeof window === "undefined") return

        const liveStrength = melt ? strength : 0
        const liveIdle = melt ? idle : 0
        const freeze = isStatic || reducedMotion() || coarsePointer()
        const trail = new Float32Array(TRAIL * 3)
        let raf = 0
        let running = false
        let gl: WebGLRenderingContext | null = null
        let prog: WebGLProgram | null = null
        let tex: WebGLTexture | null = null
        let buf: WebGLBuffer | null = null
        let word: HTMLCanvasElement | null = null
        let wordCtx: CanvasRenderingContext2D | null = null
        let locTex: WebGLUniformLocation | null = null
        let locRes: WebGLUniformLocation | null = null
        let locTrail: WebGLUniformLocation | null = null
        let locVel: WebGLUniformLocation | null = null
        let locRadius: WebGLUniformLocation | null = null
        let locStrength: WebGLUniformLocation | null = null
        let locTime: WebGLUniformLocation | null = null
        let locIdle: WebGLUniformLocation | null = null
        let cssW = 0
        let cssH = 0
        let lastNx = 0.5
        let lastNy = 0.4
        let velX = 0
        let velY = 0
        let hasPtr = false

        const energy = () => {
            let m = 0
            for (let i = 0; i < TRAIL; i++) m = Math.max(m, trail[i * 3 + 2])
            return m
        }

        const decay = () => {
            for (let i = 0; i < TRAIL; i++) {
                trail[i * 3 + 2] *= persistence
                if (trail[i * 3 + 2] < 0.002) trail[i * 3 + 2] = 0
            }
            velX *= 0.9
            velY *= 0.9
            if (Math.abs(velX) < 0.00005) velX = 0
            if (Math.abs(velY) < 0.00005) velY = 0
        }

        const push = (nx: number, ny: number) => {
            if (hasPtr) {
                velX = velX * 0.55 + (nx - lastNx) * 0.45
                velY = velY * 0.55 + (ny - lastNy) * 0.45
            }
            lastNx = nx
            lastNy = ny
            hasPtr = true
            for (let i = TRAIL - 1; i > 0; i--) {
                trail[i * 3] = trail[(i - 1) * 3]
                trail[i * 3 + 1] = trail[(i - 1) * 3 + 1]
                trail[i * 3 + 2] = trail[(i - 1) * 3 + 2]
            }
            trail[0] = nx
            trail[1] = ny
            trail[2] = 1
        }

        const drawWord = () => {
            if (!word || !wordCtx) return
            paintWord(wordCtx, word.width, word.height, text, fill, tracking)
            if (gl && tex) {
                gl.bindTexture(gl.TEXTURE_2D, tex)
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    word
                )
            }
        }

        const blit2d = () => {
            const ctx = canvas.getContext("2d")
            if (!ctx || !word) return
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(word, 0, 0)
        }

        const renderGl = (now: number) => {
            if (!gl || !prog) return
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(prog)
            gl.uniform1i(locTex, 0)
            gl.uniform2f(locRes, cssW, cssH)
            gl.uniform3fv(locTrail, trail)
            gl.uniform2f(locVel, velX, velY)
            gl.uniform1f(locRadius, radius)
            gl.uniform1f(locStrength, liveStrength)
            gl.uniform1f(locTime, now / 1000)
            gl.uniform1f(locIdle, liveIdle)
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        }

        const frame = (now: number) => {
            decay()
            if (gl && prog) renderGl(now)
            else blit2d()
            if (!freeze && (liveIdle > 0 || energy() > 0.002)) {
                raf = window.requestAnimationFrame(frame)
            } else {
                running = false
                raf = 0
            }
        }

        const kick = () => {
            if (freeze || running) return
            running = true
            raf = window.requestAnimationFrame(frame)
        }

        const setupGl = () => {
            if (freeze) return false
            const context = canvas.getContext("webgl", {
                alpha: true,
                premultipliedAlpha: true,
                antialias: false,
                preserveDrawingBuffer: true,
            })
            if (!context) return false
            gl = context
            prog = makeProgram(gl)
            if (!prog) return false
            buf = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buf)
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
                gl.STATIC_DRAW
            )
            const aPos = gl.getAttribLocation(prog, "aPos")
            gl.enableVertexAttribArray(aPos)
            gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
            tex = gl.createTexture()
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, tex)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
            locTex = gl.getUniformLocation(prog, "uTex")
            locRes = gl.getUniformLocation(prog, "uRes")
            locTrail = gl.getUniformLocation(prog, "uTrail")
            locVel = gl.getUniformLocation(prog, "uVel")
            locRadius = gl.getUniformLocation(prog, "uRadius")
            locStrength = gl.getUniformLocation(prog, "uStrength")
            locTime = gl.getUniformLocation(prog, "uTime")
            locIdle = gl.getUniformLocation(prog, "uIdle")
            return true
        }

        const sizeTo = () => {
            const r = wrap.getBoundingClientRect()
            cssW = Math.max(1, Math.round(r.width))
            cssH = Math.max(1, Math.round(r.height))
            if (cssW < 2 || cssH < 2) return
            const dpr = Math.min(2, window.devicePixelRatio || 1)
            const pw = Math.max(1, Math.round(cssW * dpr))
            const ph = Math.max(1, Math.round(cssH * dpr))
            const resized = canvas.width !== pw || canvas.height !== ph
            canvas.style.width = `${cssW}px`
            canvas.style.height = `${cssH}px`
            if (resized) {
                canvas.width = pw
                canvas.height = ph
                gl = null
                prog = null
                tex = null
                buf = null
                if (!freeze) setupGl()
            }
            if (!word) {
                word = document.createElement("canvas")
                wordCtx = word.getContext("2d")
            }
            if (word && (word.width !== pw || word.height !== ph)) {
                word.width = pw
                word.height = ph
            }
            drawWord()
            if (gl && prog && !freeze) {
                renderGl(
                    typeof performance !== "undefined" ? performance.now() : 0
                )
            } else blit2d()
        }

        let inkDrive = false

        const applyClient = (clientX: number, clientY: number) => {
            if (freeze || isHidden(wrap)) return
            const r = canvas.getBoundingClientRect()
            if (r.width < 2 || r.height < 2) return
            const nx = (clientX - r.left) / r.width
            const ny = 1 - (clientY - r.top) / r.height
            push(nx, ny)
            kick()
        }

        const onInk = (e: Event) => {
            const d = (e as CustomEvent<{ x: number; y: number }>).detail
            if (!d) return
            inkDrive = true
            applyClient(d.x, d.y)
        }

        const onPtr = (e: PointerEvent) => {
            if (inkDrive) return
            applyClient(e.clientX, e.clientY)
        }

        let cancelled = false
        const start = () => {
            if (cancelled) return
            sizeTo()
            if (!freeze && liveIdle > 0) kick()
        }

        if (document.fonts?.load) {
            void document.fonts.load(`700 200px Archivo`).then(start)
        }
        if (document.fonts?.ready) void document.fonts.ready.then(start)
        start()

        const ro = new ResizeObserver(() => sizeTo())
        ro.observe(wrap)
        if (!freeze) {
            window.addEventListener("vitrine-ink", onInk)
            window.addEventListener("pointermove", onPtr, { passive: true })
        }

        return () => {
            cancelled = true
            ro.disconnect()
            window.removeEventListener("vitrine-ink", onInk)
            window.removeEventListener("pointermove", onPtr)
            if (raf) window.cancelAnimationFrame(raf)
            if (gl && tex) gl.deleteTexture(tex)
            if (gl && buf) gl.deleteBuffer(buf)
            if (gl && prog) gl.deleteProgram(prog)
        }
    }, [text, fill, tracking, strength, radius, persistence, idle, melt, isStatic])

    return (
        <div
            ref={wrapRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                pointerEvents: "none",
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                aria-hidden
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />
        </div>
    )
}

FloorMark.displayName = "FloorMark"

FloorMark.defaultProps = {
    text: "vitrine",
    color: "rgb(18, 17, 16)",
    tracking: -0.05,
    strength: 0.36,
    radius: 0.22,
    persistence: 0.93,
    idle: 0.02,
    melt: true,
}

addPropertyControls(FloorMark, {
    text: {
        type: ControlType.String,
        title: "Text",
        defaultValue: "vitrine",
        description: "Studio name on the floor. Remixer changes this.",
    },
    color: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "rgb(18, 17, 16)",
        description: "Ink. Bind the same token as InkCursor.",
    },
    tracking: {
        type: ControlType.Number,
        title: "Tracking",
        min: -0.12,
        max: 0.28,
        step: 0.005,
        defaultValue: -0.05,
    },
    melt: {
        type: ControlType.Boolean,
        title: "Melt",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
        description: "Off keeps the floor word still. Remixer kill switch.",
    },
    strength: {
        type: ControlType.Number,
        title: "Strength",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0.36,
        description: "Warp under the pointer. Archive sits around 0.2–0.4.",
        hidden: (props) => props.melt === false,
    },
    radius: {
        type: ControlType.Number,
        title: "Radius",
        min: 0.04,
        max: 0.8,
        step: 0.01,
        defaultValue: 0.22,
        hidden: (props) => props.melt === false,
    },
    persistence: {
        type: ControlType.Number,
        title: "Persistence",
        min: 0.7,
        max: 0.99,
        step: 0.01,
        defaultValue: 0.93,
        description: "Trail decay. Higher = longer melt.",
        hidden: (props) => props.melt === false,
    },
    idle: {
        type: ControlType.Number,
        title: "Idle",
        min: 0,
        max: 0.2,
        step: 0.01,
        defaultValue: 0.02,
        description: "Breath at rest. Near 0 for a photo catalogue. 0 = pointer only.",
        hidden: (props) => props.melt === false,
    },
})
