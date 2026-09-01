// @framerDisableUnlink
// BuiltByKern — Glass Type. One radial pincushion lens, two kinetic scenes.

import {
    addPropertyControls,
    ControlType,
    useIsStaticRenderer,
} from "framer"
import { useInView, useReducedMotion } from "framer-motion"
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
} from "react"

const PAPER = "#00000000"
const INK = "#F4F1EA"

const COPY = "BuiltByKern"
const A_FRAMES = 41
const A_Y = [
    0.864, 0.842, 0.826, 0.812, 0.801, 0.792, 0.784, 0.777, 0.733, 0.71, 0.689,
    0.63, 0.611, 0.593, 0.579, 0.567, 0.556, 0.546, 0.537, 0.528, 0.52, 0.511,
    0.503, 0.494, 0.486, 0.476, 0.464, 0.453, 0.439, 0.426, 0.409, 0.391, 0.371,
    0.349, 0.323, 0.292, 0.256, 0.182, 0.133, 0.104, 0.069,
]
const A_TEXT_W = 1.49

const C_FRAMES = 52
const C_SEGMENTS: [number, number][] = [
    [0, 17],
    [18, 34],
    [35, 51],
]
const C_X = [
    0.422, 0.21, 0.113, 0.068, 0.042, 0.026, 0.014, 0.007, 0.001, -0.002, -0.004,
    -0.004, -0.006, -0.01, -0.016, -0.027, -0.043, -0.076, 0.416, 0.304, 0.223,
    0.159, 0.107, 0.069, 0.019, 0.004, -0.004, -0.009, -0.011, -0.013, -0.023,
    -0.039, -0.066, -0.108, -0.169, 0.45, 0.268, 0.156, 0.093, 0.056, 0.031,
    0.017, 0.008, 0, -0.004, -0.007, -0.007, -0.009, -0.02, -0.031, -0.053,
    -0.093,
]
const C_TEXT_W = 0.76

const FPS = 24
const FONT_STACK = '"Instrument Serif", Georgia, "Times New Roman", serif'
const FONT_WEIGHT = 400
const KERN_CREDIT =
    "BuiltByKern\n[Explore more components](https://www.framer.com/%40builtbykern/)"

const LENS = {
    a: { rl: 1.05, str: 2.4, pow: 3.0, rip: 0.35, wave: 0.34, rim0: 0.25 },
    c: { rl: 0.85, str: 0.9, pow: 2.2, rip: 0.28, wave: 0.42, rim0: 0.1 },
}

const RIP_DRIFT = 1.1
const DISPERSE = 0.04
const FIT_PCT = 80
const FIT_MIN = 0.4
const FIT_MAX = 1.4
const AMOUNT_PCT = 100
const POINTER_PULL = 0.72
const POINTER_EASE = 6.0
const POINTER_IN = 0.22
const POINTER_OUT = 0.5
const TEX_SS = 2

type SceneId = 0 | 1
type SceneMode = "rise" | "wave"
type PlayMode = "loop" | "once" | "hover"
type DriftN = 1 | 2 | 3

interface FontValue extends CSSProperties {
    fontSelector?: string
}

interface ContentOptions {
    font?: FontValue
    text?: string
}

interface LookOptions {
    paper?: string
    ink?: string
    disperse?: number
}

interface LayoutOptions {
    scale?: number
}

interface MotionOptions {
    mode?: SceneMode
    play?: PlayMode
    amount?: number
    hover?: boolean
}

interface GlassTypeProps {
    font?: FontValue
    content?: ContentOptions
    look?: LookOptions
    layout?: LayoutOptions
    motion?: MotionOptions
    style?: CSSProperties
}

function padDrift(words: string[]): [string, string, string] {
    const clean = words.map((w) => w.trim()).filter(Boolean)
    const fallback = COPY.split(/\s+/).filter(Boolean)
    const a = clean[0] || fallback[0] || COPY
    const b = clean[1] || a
    const c = clean[2] || b
    return [a, b, c]
}

function driftNOf(words: string[]): DriftN {
    const n = words.map((w) => w.trim()).filter(Boolean).length
    if (n <= 1) return 1
    if (n === 2) return 2
    return 3
}

function splitCopy(text?: string) {
    const rise = (text ?? "").trim() || COPY
    const words = rise.split(/\s+/).filter(Boolean)
    const [waveA, waveB, waveC] = padDrift(words)
    return { rise, waveA, waveB, waveC, driftN: driftNOf(words) }
}

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uU;
uniform vec2 uOff;
uniform vec2 uCen;
uniform float uRL;
uniform float uStr, uPow, uRip, uWave, uRim0;
uniform float uRipPh;
uniform float uDisp;
uniform vec3 uInk;
uniform vec4 uPaper;

float magAt(float r, float k) {
  float rn = r / uRL;
  float m = 1.0
    + uStr * k * pow(clamp(rn, 0.0, 1.6), uPow)
    + uRip * sin(6.28318 * r / (uWave * uU) - uRipPh)
        * smoothstep(uRim0, 1.0, rn);
  return max(m, 0.35);
}

float inkAt(vec2 q, vec2 c, float m) {
  vec2 src = c + q / m - uOff;
  return 1.0 - texture2D(uTex, src / uRes).r;
}

void main() {
  vec2 px = vUv * uRes;
  vec2 c = uCen;
  vec2 q = px - c;
  float r = length(q);
  float rn = r / uRL;

  float d = uDisp * clamp(rn, 0.0, 1.0);
  float mR = magAt(r, 1.0 + d);
  float mG = magAt(r, 1.0);
  float mB = magAt(r, 1.0 - d);

  vec3 ink = vec3(inkAt(q, c, mR), inkAt(q, c, mG), inkAt(q, c, mB));

  vec3 cover = clamp(ink, 0.0, 1.0);
  float aInk = max(cover.r, max(cover.g, cover.b));
  vec3 premul = uInk * cover + uPaper.rgb * uPaper.a * (1.0 - cover);
  float a = aInk + uPaper.a * (1.0 - aInk);
  gl_FragColor = vec4(premul, a);
}`

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    const hue = (((h % 360) + 360) % 360) / 360
    if (s <= 0) return [l, l, l]
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    const channel = (t: number) => {
        let x = t
        if (x < 0) x += 1
        if (x > 1) x -= 1
        if (x < 1 / 6) return p + (q - p) * 6 * x
        if (x < 1 / 2) return q
        if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6
        return p
    }
    return [channel(hue + 1 / 3), channel(hue), channel(hue - 1 / 3)]
}

function rgba01(input: string): [number, number, number, number] {
    const s = input.trim()
    if (s[0] === "#" && (s.length === 9 || s.length === 7)) {
        const a = s.length === 9 ? parseInt(s.slice(7, 9), 16) / 255 : 1
        return [
            parseInt(s.slice(1, 3), 16) / 255,
            parseInt(s.slice(3, 5), 16) / 255,
            parseInt(s.slice(5, 7), 16) / 255,
            a,
        ]
    }
    if (s[0] === "#" && s.length === 4) {
        return [
            parseInt(s[1] + s[1], 16) / 255,
            parseInt(s[2] + s[2], 16) / 255,
            parseInt(s[3] + s[3], 16) / 255,
            1,
        ]
    }
    const rgb = s.match(
        /^rgba?\(\s*([\d.]+)(%?)\s*,\s*([\d.]+)(%?)\s*,\s*([\d.]+)(%?)(?:\s*[,/]\s*([\d.]+)\s*(%?))?\s*\)/i
    )
    if (rgb) {
        const n = (v: string, pct: string) =>
            pct ? Number(v) / 100 : Number(v) / 255
        const aRaw = rgb[7]
        const a = aRaw
            ? rgb[8]
                ? Number(aRaw) / 100
                : Number(aRaw) > 1
                  ? Number(aRaw) / 255
                  : Number(aRaw)
            : 1
        return [n(rgb[1], rgb[2]), n(rgb[3], rgb[4]), n(rgb[5], rgb[6]), a]
    }
    const hsl = s.match(
        /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*[,/]\s*([\d.]+)\s*(%?))?\s*\)/i
    )
    if (hsl) {
        const [r, g, b] = hslToRgb(
            Number(hsl[1]),
            Number(hsl[2]) / 100,
            Number(hsl[3]) / 100
        )
        const aRaw = hsl[4]
        const a = aRaw
            ? hsl[5]
                ? Number(aRaw) / 100
                : Number(aRaw) > 1
                  ? Number(aRaw) / 255
                  : Number(aRaw)
            : 1
        return [r, g, b, a]
    }
    return [0.039, 0.039, 0.039, 1]
}

function tableAt(tab: number[], frame: number, lo = 0, hi = tab.length - 1) {
    const x = Math.min(Math.max(frame, lo), hi)
    const i = Math.floor(x)
    const j = Math.min(i + 1, hi)
    return tab[i] + (tab[j] - tab[i]) * (x - i)
}

function lensFor(scene: SceneId) {
    switch (scene) {
        case 0:
            return LENS.a
        case 1:
            return LENS.c
        default: {
            const _exhaustive: never = scene
            return _exhaustive
        }
    }
}

function framesFor(scene: SceneId, driftN: DriftN) {
    switch (scene) {
        case 0:
            return A_FRAMES
        case 1: {
            switch (driftN) {
                case 1:
                    return C_SEGMENTS[0][1] + 1
                case 2:
                    return C_SEGMENTS[1][1] + 1
                case 3:
                    return C_FRAMES
                default: {
                    const _exhaustive: never = driftN
                    return _exhaustive
                }
            }
        }
        default: {
            const _exhaustive: never = scene
            return _exhaustive
        }
    }
}

function sceneFromMode(mode: SceneMode): SceneId {
    switch (mode) {
        case "rise":
            return 0
        case "wave":
            return 1
        default: {
            const _exhaustive: never = mode
            return _exhaustive
        }
    }
}

function lastMs(scene: SceneId, driftN: DriftN) {
    return ((framesFor(scene, driftN) - 1) / FPS) * 1000
}

function restMs(scene: SceneId, driftN: DriftN) {
    const frames = framesFor(scene, driftN)
    const stillFrame = scene === 0 ? 30 : frames / 2
    return (stillFrame / FPS) * 1000
}

function pingPongMs(elapsed: number, last: number) {
    if (last <= 0) return 0
    const period = last * 2
    const u = ((elapsed % period) + period) % period
    return u <= last ? u : period - u
}

function compileShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
) {
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

interface EngineOptions {
    paper: string
    ink: string
    disperse: number
    fit: number
    amount: number
    hover: boolean
    play: PlayMode
    lock: SceneId
    rise: string
    waveA: string
    waveB: string
    waveC: string
    driftN: DriftN
    fontFamily: string
    fontWeight: number | string
    fontStyle: string
}

class GlassType {
    ok = false

    private canvas: HTMLCanvasElement
    private gl: WebGLRenderingContext | null = null
    private prog: WebGLProgram | null = null
    private quad: WebGLBuffer | null = null
    private tex: WebGLTexture | null = null
    private u: Record<string, WebGLUniformLocation | null> = {}

    private src: HTMLCanvasElement
    private srcCtx: CanvasRenderingContext2D | null
    private fontFamily = FONT_STACK
    private fontWeight: number | string = FONT_WEIGHT
    private fontStyle = "normal"
    private texKey = ""

    private raf = 0
    private running = false
    private disposed = false
    private canDraw = false
    private pausedAt = 0

    private scene: SceneId = 0
    private sceneT0 = 0
    private lock: SceneId = 0
    private hoverOn = true
    private play: PlayMode = "hover"
    private held = false
    private holdMs = 0
    private disperse = DISPERSE
    private fit = 1
    private amount = 1
    private paper: [number, number, number, number] = [0, 0, 0, 0]
    private ink: [number, number, number] = [0.957, 0.945, 0.918]
    private rise = COPY
    private waveA = "Kern"
    private waveB = "Still"
    private waveC = "Still"
    private driftN: DriftN = 1

    private ptrX = 0.5
    private ptrY = 0.5
    private lensX = 0.5
    private lensY = 0.5
    private hover = 0
    private hoverTo = 0
    private lastNow = 0
    private W = 0
    private H = 0
    private dpr = 1
    private aPos = -1

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.src = document.createElement("canvas")
        this.srcCtx = this.src.getContext("2d")
        const gl = canvas.getContext("webgl", {
            alpha: true,
            antialias: false,
            premultipliedAlpha: true,
            powerPreference: "low-power",
        })
        if (!gl || !this.srcCtx) return
        this.gl = gl

        const v = compileShader(gl, gl.VERTEX_SHADER, VERT)
        const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
        if (!v || !frag) return
        const p = gl.createProgram()
        if (!p) {
            gl.deleteShader(v)
            gl.deleteShader(frag)
            return
        }
        gl.attachShader(p, v)
        gl.attachShader(p, frag)
        gl.linkProgram(p)
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
            gl.deleteProgram(p)
            gl.deleteShader(v)
            gl.deleteShader(frag)
            return
        }
        this.prog = p

        this.quad = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 3, -1, -1, 3]),
            gl.STATIC_DRAW
        )

        for (const n of [
            "uTex",
            "uRes",
            "uU",
            "uOff",
            "uRL",
            "uStr",
            "uPow",
            "uRip",
            "uWave",
            "uRim0",
            "uRipPh",
            "uDisp",
            "uInk",
            "uPaper",
            "uCen",
        ]) {
            this.u[n] = gl.getUniformLocation(p, n)
        }

        this.tex = gl.createTexture()
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        gl.bindTexture(gl.TEXTURE_2D, this.tex)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.detachShader(p, v)
        gl.detachShader(p, frag)
        gl.deleteShader(v)
        gl.deleteShader(frag)
        this.aPos = gl.getAttribLocation(p, "aPos")

        this.ok = true
        this.sceneT0 = performance.now()
        this.resize()
    }

    enableDraw() {
        this.canDraw = true
        this.texKey = ""
        if (!this.disposed) this.renderStill()
    }

    applyOptions(next: EngineOptions) {
        this.paper = rgba01(next.paper)
        const ink = rgba01(next.ink)
        this.ink = [ink[0], ink[1], ink[2]]
        this.disperse = next.disperse
        const fit = Math.min(FIT_MAX, Math.max(FIT_MIN, next.fit))
        if (fit !== this.fit) this.texKey = ""
        this.fit = fit
        this.amount = Math.min(1, Math.max(0, next.amount))
        this.hoverOn = next.hover
        this.lock = next.lock
        this.scene = next.lock
        if (next.play !== this.play) {
            this.play = next.play
            this.held = false
            this.pausedAt = 0
            this.sceneT0 = performance.now()
        }
        this.play = next.play
        if (
            next.rise !== this.rise ||
            next.waveA !== this.waveA ||
            next.waveB !== this.waveB ||
            next.waveC !== this.waveC ||
            next.driftN !== this.driftN
        ) {
            this.texKey = ""
        }
        this.rise = next.rise
        this.waveA = next.waveA
        this.waveB = next.waveB
        this.waveC = next.waveC
        this.driftN = next.driftN
        const family = next.fontFamily
        if (
            family !== this.fontFamily ||
            next.fontWeight !== this.fontWeight ||
            next.fontStyle !== this.fontStyle
        ) {
            this.fontFamily = family
            this.fontWeight = next.fontWeight
            this.fontStyle = next.fontStyle
            this.texKey = ""
        }
        if (!this.hoverOn) {
            this.hoverTo = 0
        }
        if (!this.running && !this.disposed) this.renderStill()
    }

    setFont(family: string, weight: number | string, style: string) {
        this.fontFamily = family
        this.fontWeight = weight
        this.fontStyle = style
        this.texKey = ""
        if (!this.running && !this.disposed) this.renderStill()
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        this.dpr = Math.min(window.devicePixelRatio || 1, 2)
        this.W = Math.round(rect.width * this.dpr)
        this.H = Math.round(rect.height * this.dpr)
        this.canvas.width = this.W
        this.canvas.height = this.H
        this.src.width = this.W * TEX_SS
        this.src.height = this.H * TEX_SS
        this.texKey = ""
        if (!this.running && this.canDraw) this.renderStill()
    }

    start() {
        if (this.running || this.disposed || !this.ok || !this.canDraw) return
        this.running = true
        this.lastNow = performance.now()
        switch (this.play) {
            case "once":
                if (!this.held) {
                    this.sceneT0 =
                        this.pausedAt > 0
                            ? this.lastNow - this.pausedAt
                            : this.lastNow
                }
                this.scene = this.lock
                break
            case "hover":
                this.sceneT0 = this.lastNow
                this.scene = this.lock
                break
            case "loop":
                this.sceneT0 = this.lastNow - this.pausedAt
                break
            default: {
                const _exhaustive: never = this.play
                return _exhaustive
            }
        }
        this.raf = requestAnimationFrame(this.loop)
    }

    setPointer(p: { x: number; y: number } | null) {
        if (!this.hoverOn || !p) {
            this.hoverTo = 0
            return
        }
        this.ptrX = p.x
        this.ptrY = p.y
        if (this.hoverTo === 0 && this.hover < 0.01) {
            this.lensX = p.x
            this.lensY = p.y
        }
        this.hoverTo = 1
    }

    stop() {
        if (this.running) this.pausedAt = performance.now() - this.sceneT0
        this.running = false
        if (this.raf) cancelAnimationFrame(this.raf)
        this.raf = 0
    }

    renderStill() {
        if (!this.canDraw) return
        const scene = this.lock
        const last = lastMs(scene, this.driftN)
        if (this.held) {
            this.drawScene(this.scene, this.holdMs)
            return
        }
        switch (this.play) {
            case "hover":
                this.drawScene(scene, restMs(scene, this.driftN))
                return
            case "once":
                if (this.pausedAt > 0) {
                    this.drawScene(scene, Math.min(this.pausedAt, last))
                    return
                }
                this.drawScene(scene, restMs(scene, this.driftN))
                return
            case "loop":
                if (this.pausedAt > 0) {
                    this.drawScene(scene, pingPongMs(this.pausedAt, last))
                    return
                }
                this.drawScene(scene, restMs(scene, this.driftN))
                return
            default: {
                const _exhaustive: never = this.play
                return _exhaustive
            }
        }
    }

    destroy() {
        this.disposed = true
        this.stop()
        const gl = this.gl
        if (gl) {
            if (this.tex) gl.deleteTexture(this.tex)
            if (this.quad) gl.deleteBuffer(this.quad)
            if (this.prog) gl.deleteProgram(this.prog)
            const lose = gl.getExtension("WEBGL_lose_context")
            if (lose) lose.loseContext()
        }
        this.gl = null
        this.prog = null
    }

    private loop = () => {
        if (!this.running) return
        const now = performance.now()
        const dt = Math.min(Math.max((now - this.lastNow) / 1000, 1 / 240), 0.1)
        this.lastNow = now
        const hr = this.hoverTo > this.hover ? POINTER_IN : POINTER_OUT
        this.hover += (this.hoverTo - this.hover) * (1 - Math.exp(-dt / hr))
        const k = 1 - Math.exp(-dt * POINTER_EASE)
        this.lensX += (this.ptrX - this.lensX) * k
        this.lensY += (this.ptrY - this.lensY) * k
        this.drawPlay(now)
        this.raf = requestAnimationFrame(this.loop)
    }

    private drawPlay(now: number) {
        this.scene = this.lock
        const last = lastMs(this.scene, this.driftN)

        switch (this.play) {
            case "hover":
                this.drawScene(this.scene, restMs(this.scene, this.driftN))
                return
            case "loop":
                this.drawScene(
                    this.scene,
                    pingPongMs(now - this.sceneT0, last)
                )
                return
            case "once": {
                if (this.held) {
                    this.drawScene(this.scene, this.holdMs)
                    return
                }
                const el = now - this.sceneT0
                if (el >= last) {
                    this.held = true
                    this.holdMs = last
                    this.drawScene(this.scene, last)
                } else {
                    this.drawScene(this.scene, el)
                }
                return
            }
            default: {
                const _exhaustive: never = this.play
                return _exhaustive
            }
        }
    }

    private setContent(text: string, widthU: number, U: number) {
        const key = `${text}|${widthU.toFixed(3)}|${U.toFixed(1)}|${this.fontFamily}|${this.fontWeight}|${this.fontStyle}`
        if (key === this.texKey) return
        this.texKey = key
        const ctx = this.srcCtx
        const gl = this.gl
        if (!ctx || !gl) return

        const S = TEX_SS
        const W = this.W * S
        const H = this.H * S
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = "#000000"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        const face = `${this.fontStyle} ${this.fontWeight} `
        ctx.font = `${face}100px ${this.fontFamily}`
        const w100 = ctx.measureText(text).width || 1
        const size = (widthU * U * S * 100) / w100
        ctx.font = `${face}${size}px ${this.fontFamily}`
        ctx.fillText(text, W / 2, H / 2)

        gl.bindTexture(gl.TEXTURE_2D, this.tex)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            this.src
        )
    }

    private drawScene(scene: SceneId, ms: number) {
        const gl = this.gl
        if (!this.canDraw || !gl || !this.prog || !this.W) return
        const { W, H } = this
        const U = Math.max(1, Math.min(H, W / (16 / 9)) * this.fit)
        const frame = (ms / 1000) * FPS
        const t = this.running
            ? (this.lastNow - this.sceneT0) / 1000
            : ms / 1000

        let offX = 0
        let offY = 0
        let rl = 1
        const k = this.amount
        const lens = lensFor(scene)

        switch (scene) {
            case 0: {
                this.setContent(this.rise, A_TEXT_W, U)
                const y = tableAt(A_Y, frame)
                offY = -(y - 0.5) * U * k
                rl = lens.rl * U
                break
            }
            case 1: {
                const hi = this.driftN - 1
                const seg = C_SEGMENTS.findIndex(
                    ([a, b]) => frame >= a && frame <= b + 1
                )
                const s = seg < 0 ? hi : Math.min(seg, hi)
                const word =
                    s === 0 ? this.waveA : s === 1 ? this.waveB : this.waveC
                this.setContent(word, C_TEXT_W, U)
                const lo = C_SEGMENTS[s][0]
                const end = C_SEGMENTS[s][1]
                const x = tableAt(C_X, frame, lo, end)
                offX = x * U * k
                rl = lens.rl * U
                break
            }
            default: {
                const _exhaustive: never = scene
                return _exhaustive
            }
        }

        gl.viewport(0, 0, W, H)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.useProgram(this.prog)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad)
        if (this.aPos >= 0) {
            gl.enableVertexAttribArray(this.aPos)
            gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0)
        }

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.tex)
        gl.uniform1i(this.u.uTex, 0)
        gl.uniform2f(this.u.uRes, W, H)
        gl.uniform1f(this.u.uU, U)
        gl.uniform2f(this.u.uOff, offX, offY)

        const pull = this.hover * POINTER_PULL
        gl.uniform2f(
            this.u.uCen,
            W * (0.5 + (this.lensX - 0.5) * pull),
            H * (0.5 - (this.lensY - 0.5) * pull)
        )
        gl.uniform1f(this.u.uRL, rl)
        gl.uniform1f(this.u.uStr, lens.str * k)
        gl.uniform1f(this.u.uPow, lens.pow)
        gl.uniform1f(this.u.uRip, lens.rip * k)
        gl.uniform1f(this.u.uWave, lens.wave)
        gl.uniform1f(this.u.uRim0, lens.rim0)
        gl.uniform1f(this.u.uRipPh, t * RIP_DRIFT)
        gl.uniform1f(this.u.uDisp, this.disperse)
        gl.uniform3fv(this.u.uInk, this.ink)
        gl.uniform4fv(this.u.uPaper, this.paper)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
}

function fontFromProps(props: GlassTypeProps): FontValue | undefined {
    const extra = props as GlassTypeProps & {
        $control__font?: FontValue
    }
    return extra.font ?? extra.$control__font ?? extra.content?.font
}

function cssFamily(family: unknown): string {
    if (typeof family !== "string" || !family.trim()) return FONT_STACK
    const t = family.trim()
    if (t.includes(",") || t.startsWith('"') || t.startsWith("'")) return t
    return `"${t.replace(/"/g, "")}"`
}

function familyFromControl(font?: FontValue): string {
    if (
        typeof font?.fontFamily === "string" &&
        font.fontFamily.trim() &&
        !/^(GF|FS|BI);/i.test(font.fontFamily)
    ) {
        return cssFamily(font.fontFamily)
    }
    const selector = font?.fontSelector || ""
    if (selector.startsWith("BI;")) {
        const name = selector.slice(3).split("/")[0].trim()
        return name ? cssFamily(name) : FONT_STACK
    }
    if (/^(GF|FS);/i.test(selector)) {
        const body = selector.replace(/^(GF|FS);/i, "").trim()
        const dash = body.lastIndexOf("-")
        const name = (dash > 0 ? body.slice(0, dash) : body).trim()
        return name ? cssFamily(name) : FONT_STACK
    }
    return FONT_STACK
}

/**
 * Glass Type
 *
 * High-contrast serif on paper, seen through one glass lens.
 * Two scenes. Hover moves the glass, not the type.
 *
 * @framerIntrinsicWidth 960
 * @framerIntrinsicHeight 444
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function BuiltByKern_GlassType(props: GlassTypeProps) {
    const {
        content = {},
        look = {},
        layout = {},
        motion = {},
        style,
    } = props
    const typeFace = fontFromProps(props)

    const { text = COPY } = content
    const { rise, waveA, waveB, waveC, driftN } = splitCopy(text)
    const {
        paper = PAPER,
        ink = INK,
        disperse = DISPERSE,
    } = look
    const { scale = FIT_PCT } = layout
    const fit = Math.min(FIT_MAX, Math.max(FIT_MIN, scale / 100))
    const {
        mode = "rise",
        play = "hover",
        amount = AMOUNT_PCT,
        hover = true,
    } = motion

    const fontFamily = familyFromControl(typeFace)
    const fontWeight = typeFace?.fontWeight ?? FONT_WEIGHT
    const fontStyle = typeFace?.fontStyle || "normal"
    const lock = sceneFromMode(mode)
    const motionAmt = Math.min(1, Math.max(0, amount / 100))

    const wrapRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const typeRef = useRef<HTMLDivElement>(null)
    const engineRef = useRef<GlassType | null>(null)
    const freezeRef = useRef(false)
    const inViewRef = useRef(false)
    const [glOk, setGlOk] = useState(true)
    const isStatic = useIsStaticRenderer()
    const reduced = useReducedMotion() ?? false
    const inView = useInView(wrapRef, { amount: 0.05, once: false })
    const freeze = isStatic || reduced
    freezeRef.current = freeze
    inViewRef.current = inView
    const optsRef = useRef<EngineOptions>({
        paper,
        ink,
        disperse,
        fit,
        amount: motionAmt,
        hover,
        play,
        lock,
        rise,
        waveA,
        waveB,
        waveC,
        driftN,
        fontFamily,
        fontWeight,
        fontStyle,
    })
    optsRef.current = {
        paper,
        ink,
        disperse,
        fit,
        amount: motionAmt,
        hover,
        play,
        lock,
        rise,
        waveA,
        waveB,
        waveC,
        driftN,
        fontFamily,
        fontWeight,
        fontStyle,
    }

    useEffect(() => {
        if (typeof document === "undefined") return
        if (/Instrument Serif/i.test(fontFamily)) {
            const id = "bbk-gt-instrument-serif"
            if (!document.getElementById(id)) {
                const link = document.createElement("link")
                link.id = id
                link.rel = "stylesheet"
                link.href =
                    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
                document.head.appendChild(link)
            }
        }
        const selector = typeFace?.fontSelector || ""
        if (!selector.startsWith("GF;")) return
        const name = familyFromControl(typeFace).replace(/["']/g, "")
        if (!name || name === "Instrument Serif") return
        const faceId = `bbk-gt-${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`
        if (document.getElementById(faceId)) return
        const face = document.createElement("link")
        face.id = faceId
        face.rel = "stylesheet"
        const fam = encodeURIComponent(name).replace(/%20/g, "+")
        face.href = `https://fonts.googleapis.com/css2?family=${fam}:ital,wght@0,100;0,400;0,700;1,400&display=swap`
        document.head.appendChild(face)
    }, [typeFace?.fontSelector, fontFamily])

    useEffect(() => {
        if (typeof window === "undefined") return
        const canvas = canvasRef.current
        const wrap = wrapRef.current
        if (!canvas || !wrap) return

        const engine = new GlassType(canvas)
        engineRef.current = engine
        setGlOk(engine.ok)
        engine.applyOptions(optsRef.current)

        let hidden = document.hidden
        const sync = () => {
            if (!engine.ok) return
            if (freezeRef.current || hidden || !inViewRef.current) {
                engine.stop()
                engine.renderStill()
            } else {
                engine.start()
            }
        }

        const ro = new ResizeObserver(() => engine.resize())
        ro.observe(wrap)

        const onVis = () => {
            hidden = document.hidden
            sync()
        }
        document.addEventListener("visibilitychange", onVis)

        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return
            const r = wrap.getBoundingClientRect()
            if (!r.width || !r.height) return
            engine.setPointer({
                x: (e.clientX - r.left) / r.width,
                y: (e.clientY - r.top) / r.height,
            })
        }
        const onLeave = () => engine.setPointer(null)
        wrap.addEventListener("pointerenter", onMove)
        wrap.addEventListener("pointermove", onMove)
        wrap.addEventListener("pointerleave", onLeave)
        window.addEventListener("blur", onLeave)

        sync()

        return () => {
            ro.disconnect()
            document.removeEventListener("visibilitychange", onVis)
            wrap.removeEventListener("pointerenter", onMove)
            wrap.removeEventListener("pointermove", onMove)
            wrap.removeEventListener("pointerleave", onLeave)
            window.removeEventListener("blur", onLeave)
            engine.destroy()
            if (engineRef.current === engine) engineRef.current = null
        }
    }, [])

    useEffect(() => {
        const engine = engineRef.current
        if (!engine) return
        engine.applyOptions({
            paper,
            ink,
            disperse,
            fit,
            amount: motionAmt,
            hover,
            play,
            lock,
            rise,
            waveA,
            waveB,
            waveC,
            driftN,
            fontFamily,
            fontWeight,
            fontStyle,
        })
    }, [
        paper,
        ink,
        disperse,
        fit,
        motionAmt,
        hover,
        play,
        lock,
        rise,
        waveA,
        waveB,
        waveC,
        driftN,
        fontFamily,
        fontWeight,
        fontStyle,
    ])

    useLayoutEffect(() => {
        const engine = engineRef.current
        const el = typeRef.current
        if (!engine) return
        let cancelled = false
        const bake = () => {
            if (cancelled || engineRef.current !== engine) return
            const live = el ? getComputedStyle(el) : null
            const family = cssFamily(live?.fontFamily || fontFamily)
            const weight = live?.fontWeight || String(fontWeight)
            const faceStyle = live?.fontStyle || fontStyle
            engine.setFont(family, weight, faceStyle)
            engine.enableDraw()
            if (freezeRef.current || document.hidden || !inViewRef.current) {
                engine.stop()
                engine.renderStill()
            } else {
                engine.start()
            }
        }
        const spec = `${fontWeight} 120px ${fontFamily}`
        const timer = window.setTimeout(bake, 2000)
        if (typeof document !== "undefined" && document.fonts?.load) {
            document.fonts
                .load(spec)
                .then(bake)
                .catch(bake)
                .finally(() => window.clearTimeout(timer))
        } else {
            bake()
            window.clearTimeout(timer)
        }
        return () => {
            cancelled = true
            window.clearTimeout(timer)
        }
    }, [fontFamily, fontWeight, fontStyle, text, freeze, inView])

    useEffect(() => {
        const engine = engineRef.current
        if (!engine || !engine.ok) return
        if (freeze || !inView || document.hidden) {
            engine.stop()
            engine.renderStill()
        } else {
            engine.start()
        }
    }, [freeze, inView])

    return (
        <div
            ref={wrapRef}
            role="img"
            aria-label={`${text}. Hover moves the glass, not the type.`}
            style={{
                position: "relative",
                display: "block",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                userSelect: "none",
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    width: "100%",
                    height: "100%",
                    display: glOk ? "block" : "none",
                }}
            />
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: glOk ? 0 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    opacity: glOk ? 0.01 : 1,
                    color: glOk ? "transparent" : ink,
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    fontSize: 80,
                }}
            >
                <div ref={typeRef} style={props.font}>
                    {text}
                </div>
            </div>
        </div>
    )
}

BuiltByKern_GlassType.displayName = "Glass Type"

const DEFAULT_PROPS: GlassTypeProps = {
    font: {
        fontSize: 16,
    },
    content: {
        text: COPY,
    },
    look: {
        paper: PAPER,
        ink: INK,
        disperse: DISPERSE,
    },
    layout: {
        scale: FIT_PCT,
    },
    motion: {
        mode: "rise",
        play: "hover",
        amount: AMOUNT_PCT,
        hover: true,
    },
}

BuiltByKern_GlassType.defaultProps = DEFAULT_PROPS

addPropertyControls(BuiltByKern_GlassType, {
    font: {
        type: ControlType.Font,
        title: "Font",
        defaultFontType: "serif",
        controls: "extended",
        displayFontSize: false,
        displayTextAlignment: false,
        defaultValue: {
            fontSize: 16,
        },
        description:
            "The typeface. Hairlines read through the glass.",
    },
    content: {
        type: ControlType.Object,
        title: "Content",
        icon: "object",
        description:
            "One copy. Scene in Motion is how it moves.",
        controls: {
            text: {
                type: ControlType.String,
                title: "Text",
                defaultValue: COPY,
                placeholder: COPY,
                description:
                    "Line plays it whole. Drift walks each word once. One word, one pass.",
            },
        },
    },
    look: {
        type: ControlType.Object,
        title: "Look",
        icon: "color",
        description: "No fill on drop. Ink is the letters. Fringe is the rim.",
        controls: {
            paper: {
                type: ControlType.Color,
                title: "Paper",
                defaultValue: PAPER,
                description: "Optional fill. Transparent on drop so the page shows through.",
            },
            ink: {
                type: ControlType.Color,
                title: "Ink",
                defaultValue: INK,
                description: "The type. Not the glass.",
            },
            disperse: {
                type: ControlType.Number,
                title: "Fringe",
                defaultValue: DISPERSE,
                min: 0,
                max: 0.06,
                step: 0.001,
                displayStepper: true,
                description: "Color split at the rim.",
            },
        },
    },
    layout: {
        type: ControlType.Object,
        title: "Layout",
        icon: "object",
        description: "Optical size inside the frame. Type and glass stay locked.",
        controls: {
            scale: {
                type: ControlType.Number,
                title: "Scale",
                defaultValue: FIT_PCT,
                min: FIT_MIN * 100,
                max: FIT_MAX * 100,
                step: 5,
                unit: "%",
                description: "Optical size. Type and glass stay locked.",
            },
        },
    },
    motion: {
        type: ControlType.Object,
        title: "Motion",
        icon: "effect",
        description: KERN_CREDIT,
        controls: {
            mode: {
                type: ControlType.Enum,
                title: "Scene",
                options: ["rise", "wave"],
                optionTitles: ["Line", "Drift"],
                defaultValue: "rise",
                displaySegmentedControl: true,
                description:
                    "Line rises. Drift walks the words through.",
            },
            play: {
                type: ControlType.Enum,
                title: "Play",
                options: ["hover", "once", "loop"],
                optionTitles: ["Hover", "Once", "Loop"],
                defaultValue: "hover",
                displaySegmentedControl: true,
                description:
                    "Hover keeps type still. Once plays through and holds. Loop rises and falls.",
            },
            amount: {
                type: ControlType.Number,
                title: "Amount",
                defaultValue: AMOUNT_PCT,
                min: 0,
                max: 100,
                step: 5,
                unit: "%",
                description:
                    "How far the type travels, and how hard the glass pinches. 0 is still.",
            },
            hover: {
                type: ControlType.Boolean,
                title: "Lens",
                defaultValue: true,
                enabledTitle: "On",
                disabledTitle: "Off",
                description: "Mouse only. The glass follows. Type does not.",
            },
        },
    },
})
