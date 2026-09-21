import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { useReducedMotion } from "framer-motion"
import {
    useEffect,
    useRef,
    type CSSProperties,
    type PointerEvent as ReactPointerEvent,
    type ReactElement,
} from "react"

/**
 * Kern — Lens Warp
 * Paste into Framer Code. FREE. One still, radial glass pincushion/barrel.
 * Optics feel from pincushion-warp.creativestefan.work — not DialKit, not Stefan brand.
 * Do not publish — Noel RED. VERIFY stays BLOCKED until a published preview clip.
 */

type PointerMode = "rest" | "follow" | "reduced"

type FramerImage =
    | string
    | {
          src?: string
          url?: string
      }

interface KernLensWarpProps {
    image: FramerImage
    distortionStrength: number
    radius: number
    zoom: number
    aberration: number
    followPointer: boolean
    backgroundColor: string
    gloss: number
    verticalScale: number
    inertia: number
    viscosity: number
    width?: number
    style?: CSSProperties
}

interface WarpParams {
    distortionStrength: number
    radius: number
    zoom: number
    aberration: number
    gloss: number
    verticalScale: number
    backgroundColor: string
    lensX: number
    lensY: number
}

const CLASS = "kern-lens-warp"
const REST_X = 0.5
const REST_Y = 0.5
const MAX_PIXEL_RATIO = 2
const SETTLE_EPS = 0.00018
const PAPER = "#F4F3F0"

/** Neutral architecture still — not Creative Stefan grid 1–9 */
const DEFAULT_STILL =
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1800&q=80"

const VERT_SRC = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = vec2(aPosition.x * 0.5 + 0.5, aPosition.y * 0.5 + 0.5);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const FRAG_SRC = `
precision highp float;
uniform sampler2D tDiffuse;
uniform float uDistortionStrength;
uniform float uRadius;
uniform float uZoom;
uniform float uAberration;
uniform float uGlossIntensity;
uniform float uVerticalScale;
uniform float uHasImage;
uniform vec3 uBgColor;
uniform vec2 uLensCenter;
uniform vec2 uResolution;
uniform vec2 uImageSize;
varying vec2 vUv;

vec2 coverUv(vec2 uv) {
  float imgAspect = max(uImageSize.x, 1.0) / max(uImageSize.y, 1.0);
  float frameAspect = max(uResolution.x, 1.0) / max(uResolution.y, 1.0);
  vec2 scale = vec2(1.0);
  if (frameAspect > imgAspect) {
    scale.y = imgAspect / frameAspect;
  } else {
    scale.x = frameAspect / imgAspect;
  }
  return (uv - 0.5) * scale + 0.5;
}

vec4 sampleBuffer(vec2 coord) {
  if (uHasImage < 0.5) {
    return vec4(uBgColor, 1.0);
  }
  vec2 mapped = coverUv(coord);
  if (mapped.x < 0.0 || mapped.x > 1.0 || mapped.y < 0.0 || mapped.y > 1.0) {
    return vec4(uBgColor, 1.0);
  }
  return texture2D(tDiffuse, mapped);
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 fromCenter = vUv - uLensCenter;
  vec2 uvDist = vec2(fromCenter.x * aspect, fromCenter.y) / max(uZoom, 0.0001);

  float r = max(uRadius, 0.0001);
  float vScale = clamp(uVerticalScale, 0.0, 1.0);
  float distSq = (uvDist.x * uvDist.x) + (uvDist.y * uvDist.y) * vScale;
  float dist = sqrt(max(distSq, 0.0));
  float normDist = dist / r;
  float warp = normDist * normDist;

  vec2 displacement = vec2(
    (uvDist.x / max(aspect, 0.0001)) * warp * uDistortionStrength,
    uvDist.y * warp * uDistortionStrength * vScale
  );
  vec2 refractedUV = vUv + displacement;

  vec2 chromOffset = vec2(
    uvDist.x / max(aspect, 0.0001),
    uvDist.y
  ) * (uAberration * 0.02 * (warp + 0.15));

  vec4 colR = sampleBuffer(refractedUV + chromOffset);
  vec4 colG = sampleBuffer(refractedUV);
  vec4 colB = sampleBuffer(refractedUV - chromOffset);
  vec3 refractedRgb = vec3(colR.r, colG.g, colB.b);

  vec2 dir = dist > 0.0001 ? (uvDist / dist) : vec2(0.0);
  float slope = 2.0 * abs(uDistortionStrength) * normDist;
  vec3 normal = normalize(vec3(-dir * slope * 1.5, 1.0));
  vec3 lightDir = normalize(vec3(-0.25, 0.65, 0.72));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfVec = normalize(lightDir + viewDir);
  float specular = pow(max(dot(normal, halfVec), 0.0), 36.0);
  float rimMask = smoothstep(0.2, 0.8, normDist) * smoothstep(1.3, 0.85, normDist);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
  float edgeGleam = fresnel * smoothstep(0.35, 0.95, normDist) * 0.35;
  float gloss = (specular * rimMask + edgeGleam) * uGlossIntensity;

  gl_FragColor = vec4(refractedRgb + vec3(gloss), 1.0);
}
`

function resolveImageSrc(image: FramerImage | undefined): string {
    if (typeof image === "string" && image.length > 0) {
        return image
    }
    if (image && typeof image === "object") {
        if (typeof image.src === "string" && image.src.length > 0) {
            return image.src
        }
        if (typeof image.url === "string" && image.url.length > 0) {
            return image.url
        }
    }
    return DEFAULT_STILL
}

function parseCssColor(input: string): [number, number, number] {
    const value = input.trim()
    const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value)
    if (hex && hex[1]) {
        let h = hex[1]
        if (h.length === 3) {
            h = `${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`
        }
        return [
            parseInt(h.slice(0, 2), 16) / 255,
            parseInt(h.slice(2, 4), 16) / 255,
            parseInt(h.slice(4, 6), 16) / 255,
        ]
    }
    const rgb =
        /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)/i.exec(value)
    if (rgb) {
        const r = Number(rgb[1])
        const g = Number(rgb[2])
        const b = Number(rgb[3])
        const scale = r > 1 || g > 1 || b > 1 ? 255 : 1
        return [r / scale, g / scale, b / scale]
    }
    return [0.0667, 0.0667, 0.0667]
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}

function damp(current: number, target: number, lambda: number, dt: number): number {
    return current + (target - current) * (1 - Math.exp(-lambda * dt))
}

/** Pack inertia 0–1: 0 snap, 0.15 calm lag, 1 heavy trail. */
function followLambda(inertia: number): number {
    const t = clamp(inertia, 0, 1)
    return 1 / Math.max(0.04 + t * 0.35, 0.04)
}

/** Pack viscosity 0–1: lag damping (higher = less coast). */
function velocityLambda(viscosity: number): number {
    return 3 + clamp(viscosity, 0, 1) * 22
}

function pointerMode(
    followPointer: boolean,
    reducedMotion: boolean,
    isStatic: boolean
): PointerMode {
    if (reducedMotion || isStatic) {
        return "reduced"
    }
    if (followPointer) {
        return "follow"
    }
    return "rest"
}

function modeFollowsPointer(mode: PointerMode): boolean {
    switch (mode) {
        case "follow":
            return true
        case "rest":
        case "reduced":
            return false
        default: {
            const exhaustive: never = mode
            return exhaustive
        }
    }
}

function compileShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
): WebGLShader | null {
    const shader = gl.createShader(type)
    if (!shader) {
        return null
    }
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
    }
    return shader
}

class LensWarpGL {
    private gl: WebGLRenderingContext | null
    private program: WebGLProgram | null = null
    private buffer: WebGLBuffer | null = null
    private texture: WebGLTexture | null = null
    private imageSize: [number, number] = [1, 1]
    private hasImage = 0
    private locs: Record<string, WebGLUniformLocation | null> = {}

    constructor(canvas: HTMLCanvasElement) {
        const gl = canvas.getContext("webgl", {
            alpha: false,
            antialias: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: true,
        })
        this.gl = gl
        if (!gl) {
            return
        }
        const vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC)
        const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC)
        if (!vert || !frag) {
            return
        }
        const program = gl.createProgram()
        if (!program) {
            return
        }
        gl.attachShader(program, vert)
        gl.attachShader(program, frag)
        gl.bindAttribLocation(program, 0, "aPosition")
        gl.linkProgram(program)
        gl.deleteShader(vert)
        gl.deleteShader(frag)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.deleteProgram(program)
            return
        }
        this.program = program
        this.buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
        )
        this.texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array([17, 17, 17, 255])
        )
        this.locs = {
            tDiffuse: gl.getUniformLocation(program, "tDiffuse"),
            uDistortionStrength: gl.getUniformLocation(
                program,
                "uDistortionStrength"
            ),
            uRadius: gl.getUniformLocation(program, "uRadius"),
            uZoom: gl.getUniformLocation(program, "uZoom"),
            uAberration: gl.getUniformLocation(program, "uAberration"),
            uGlossIntensity: gl.getUniformLocation(program, "uGlossIntensity"),
            uVerticalScale: gl.getUniformLocation(program, "uVerticalScale"),
            uHasImage: gl.getUniformLocation(program, "uHasImage"),
            uBgColor: gl.getUniformLocation(program, "uBgColor"),
            uLensCenter: gl.getUniformLocation(program, "uLensCenter"),
            uResolution: gl.getUniformLocation(program, "uResolution"),
            uImageSize: gl.getUniformLocation(program, "uImageSize"),
        }
    }

    get ok(): boolean {
        return this.gl !== null && this.program !== null
    }

    setImage(image: HTMLImageElement | null): void {
        const gl = this.gl
        if (!gl || !this.texture) {
            return
        }
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        if (!image || image.naturalWidth < 1) {
            this.hasImage = 0
            this.imageSize = [1, 1]
            return
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        this.imageSize = [image.naturalWidth, image.naturalHeight]
        this.hasImage = 1
    }

    resize(width: number, height: number, pixelRatio: number): void {
        const gl = this.gl
        if (!gl) {
            return
        }
        const w = Math.max(1, Math.round(width * pixelRatio))
        const h = Math.max(1, Math.round(height * pixelRatio))
        if (gl.canvas.width !== w) {
            gl.canvas.width = w
        }
        if (gl.canvas.height !== h) {
            gl.canvas.height = h
        }
        gl.viewport(0, 0, w, h)
    }

    draw(params: WarpParams): void {
        const gl = this.gl
        const program = this.program
        if (!gl || !program || !this.buffer) {
            return
        }
        const [br, bg, bb] = parseCssColor(params.backgroundColor)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(br, bg, bb, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.useProgram(program)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.uniform1i(this.locs.tDiffuse, 0)
        gl.uniform1f(this.locs.uDistortionStrength, params.distortionStrength)
        gl.uniform1f(this.locs.uRadius, params.radius)
        gl.uniform1f(this.locs.uZoom, params.zoom)
        gl.uniform1f(this.locs.uAberration, params.aberration)
        gl.uniform1f(this.locs.uGlossIntensity, params.gloss)
        gl.uniform1f(this.locs.uVerticalScale, params.verticalScale)
        gl.uniform1f(this.locs.uHasImage, this.hasImage)
        gl.uniform3f(this.locs.uBgColor, br, bg, bb)
        gl.uniform2f(this.locs.uLensCenter, params.lensX, params.lensY)
        gl.uniform2f(
            this.locs.uResolution,
            gl.canvas.width,
            gl.canvas.height
        )
        gl.uniform2f(this.locs.uImageSize, this.imageSize[0], this.imageSize[1])
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    dispose(): void {
        const gl = this.gl
        if (!gl) {
            return
        }
        if (this.buffer) {
            gl.deleteBuffer(this.buffer)
        }
        if (this.texture) {
            gl.deleteTexture(this.texture)
        }
        if (this.program) {
            gl.deleteProgram(this.program)
        }
        this.gl = null
        this.program = null
    }
}

function eventToUv(
    event: { clientX: number; clientY: number },
    el: HTMLElement
): { x: number; y: number } {
    const rect = el.getBoundingClientRect()
    const w = Math.max(rect.width, 1)
    const h = Math.max(rect.height, 1)
    return {
        x: clamp((event.clientX - rect.left) / w, 0, 1),
        y: clamp(1 - (event.clientY - rect.top) / h, 0, 1),
    }
}

export default function Kern_LensWarp(props: KernLensWarpProps): ReactElement {
    const {
        image,
        distortionStrength = -0.65,
        radius = 0.45,
        zoom = 1,
        aberration = 0.015,
        followPointer = true,
        backgroundColor = PAPER,
        gloss = 0.25,
        verticalScale = 1,
        inertia = 0.15,
        viscosity = 0.2,
        width,
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const reducedMotionPref = useReducedMotion()
    const reducedMotion = Boolean(reducedMotionPref)
    const mode = pointerMode(followPointer, reducedMotion, Boolean(isStatic))
    const liveFollow = modeFollowsPointer(mode)

    const wrapRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const engineRef = useRef<LensWarpGL | null>(null)
    const targetRef = useRef({ x: REST_X, y: REST_Y })
    const lensRef = useRef({ x: REST_X, y: REST_Y, vx: 0, vy: 0 })
    const hoveringRef = useRef(false)
    const kickRef = useRef<(() => void) | null>(null)
    const src = resolveImageSrc(image)

    useEffect(() => {
        const canvas = canvasRef.current
        const wrap = wrapRef.current
        if (!canvas || !wrap) {
            return
        }

        const engine = new LensWarpGL(canvas)
        engineRef.current = engine
        if (!engine.ok) {
            return
        }

        const paramsOf = (): WarpParams => ({
            distortionStrength,
            radius,
            zoom,
            aberration,
            gloss,
            verticalScale,
            backgroundColor,
            lensX: lensRef.current.x,
            lensY: lensRef.current.y,
        })

        const pixelRatio = () =>
            Math.min(
                typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
                MAX_PIXEL_RATIO
            )

        const fit = () => {
            const rect = wrap.getBoundingClientRect()
            engine.resize(rect.width, rect.height, pixelRatio())
        }

        let raf = 0
        let last = performance.now()
        let running = true

        const tick = (now: number) => {
            if (!running) {
                return
            }
            const dt = clamp((now - last) / 1000, 0.0001, 0.08)
            last = now
            const lens = lensRef.current
            if (liveFollow) {
                const target = hoveringRef.current
                    ? targetRef.current
                    : { x: REST_X, y: REST_Y }
                if (inertia <= 0.001) {
                    lens.x = target.x
                    lens.y = target.y
                    lens.vx = 0
                    lens.vy = 0
                } else {
                    const lambda = followLambda(inertia)
                    const nx = damp(lens.x, target.x, lambda, dt)
                    const ny = damp(lens.y, target.y, lambda, dt)
                    lens.x = clamp(nx + lens.vx * inertia * dt, 0.04, 0.96)
                    lens.y = clamp(ny + lens.vy * inertia * dt, 0.04, 0.96)
                    const decay = Math.exp(-velocityLambda(viscosity) * dt)
                    lens.vx *= decay
                    lens.vy *= decay
                }
            } else {
                lens.x = REST_X
                lens.y = REST_Y
                lens.vx = 0
                lens.vy = 0
            }
            engine.draw(paramsOf())
            const settled =
                !hoveringRef.current &&
                Math.abs(lens.x - REST_X) < SETTLE_EPS &&
                Math.abs(lens.y - REST_Y) < SETTLE_EPS &&
                Math.abs(lens.vx) < SETTLE_EPS &&
                Math.abs(lens.vy) < SETTLE_EPS
            raf = 0
            if (liveFollow && !settled) {
                raf = requestAnimationFrame(tick)
            }
        }

        const kick = () => {
            if (!running || raf !== 0) {
                return
            }
            last = performance.now()
            raf = requestAnimationFrame(tick)
        }
        kickRef.current = kick

        fit()
        engine.draw(paramsOf())

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.decoding = "async"
        img.onload = () => {
            engine.setImage(img)
            fit()
            engine.draw(paramsOf())
        }
        img.src = src

        const ro = new ResizeObserver(() => {
            fit()
            engine.draw(paramsOf())
        })
        ro.observe(wrap)

        return () => {
            running = false
            cancelAnimationFrame(raf)
            ro.disconnect()
            img.onload = null
            kickRef.current = null
            engine.dispose()
            engineRef.current = null
        }
    }, [
        aberration,
        backgroundColor,
        distortionStrength,
        gloss,
        inertia,
        liveFollow,
        radius,
        src,
        verticalScale,
        viscosity,
        zoom,
    ])

    const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!liveFollow) {
            return
        }
        const uv = eventToUv(event, event.currentTarget)
        const prev = targetRef.current
        targetRef.current = uv
        hoveringRef.current = true
        lensRef.current.vx += (uv.x - prev.x) * 8
        lensRef.current.vy += (uv.y - prev.y) * 8
        lensRef.current.vx = clamp(lensRef.current.vx, -1.8, 1.8)
        lensRef.current.vy = clamp(lensRef.current.vy, -1.8, 1.8)
        kickRef.current?.()
    }

    const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!liveFollow) {
            return
        }
        event.currentTarget.setPointerCapture(event.pointerId)
        onPointerMove(event)
    }

    const restLens = () => {
        hoveringRef.current = false
        targetRef.current = { x: REST_X, y: REST_Y }
        kickRef.current?.()
    }

    const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse") {
            return
        }
        restLens()
    }

    return (
        <div
            ref={wrapRef}
            className={CLASS}
            role="img"
            aria-label="Lens warp"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={restLens}
            onPointerLeave={restLens}
            style={{
                position: "relative",
                width: width && width > 0 ? width : "100%",
                height: "100%",
                overflow: "hidden",
                backgroundColor,
                touchAction: "none",
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
                    pointerEvents: "none",
                }}
            />
        </div>
    )
}

addPropertyControls(Kern_LensWarp, {
    image: {
        type: ControlType.ResponsiveImage,
        title: "Image",
    },
    distortionStrength: {
        type: ControlType.Number,
        title: "Distortion",
        defaultValue: -0.65,
        min: -1.5,
        max: 1.5,
        step: 0.01,
    },
    radius: {
        type: ControlType.Number,
        title: "Radius",
        defaultValue: 0.45,
        min: 0.1,
        max: 1.5,
        step: 0.01,
    },
    zoom: {
        type: ControlType.Number,
        title: "Zoom",
        defaultValue: 1,
        min: 0.5,
        max: 2,
        step: 0.01,
    },
    aberration: {
        type: ControlType.Number,
        title: "Aberration",
        defaultValue: 0.015,
        min: 0,
        max: 0.15,
        step: 0.001,
    },
    followPointer: {
        type: ControlType.Boolean,
        title: "Follow",
        defaultValue: true,
        enabledTitle: "Pointer",
        disabledTitle: "Rest",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Fill",
        defaultValue: "#F4F3F0",
    },
    gloss: {
        type: ControlType.Number,
        title: "Gloss",
        defaultValue: 0.25,
        min: 0,
        max: 2,
        step: 0.05,
    },
    verticalScale: {
        type: ControlType.Number,
        title: "Vertical",
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.01,
    },
    inertia: {
        type: ControlType.Number,
        title: "Inertia",
        defaultValue: 0.15,
        min: 0,
        max: 1,
        step: 0.01,
    },
    viscosity: {
        type: ControlType.Number,
        title: "Viscosity",
        defaultValue: 0.2,
        min: 0,
        max: 1,
        step: 0.01,
    },
})
