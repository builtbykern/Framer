import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { useNavigate } from "react-router-dom"
import {
  featuredWork,
  workPath,
  type CoverFormat,
  type WorkSeries,
} from "../data/work"

interface DriftPlaneProps {
  items: WorkSeries[]
}

interface CardMetrics {
  width: number
  height: number
  col: number
  row: number
}

interface WorldSize {
  worldW: number
  worldH: number
  strideX: number
  strideY: number
}

const COLS = 4
const GAP = 28
const DRIFT_X = 0.18
const DRIFT_Y = 0.09
const DRAG_THRESHOLD = 6

function cardSize(format: CoverFormat): { width: number; height: number } {
  switch (format) {
    case "portrait":
      return { width: 260, height: 340 }
    case "landscape":
      return { width: 380, height: 250 }
    case "square":
      return { width: 280, height: 280 }
    default: {
      const exhaustive: never = format
      return exhaustive
    }
  }
}

function wrap(value: number, size: number): number {
  return ((value % size) + size) % size
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function DriftPlane({ items }: DriftPlaneProps) {
  const navigate = useNavigate()
  const viewportRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const offset = useRef({ x: 40, y: 80 })
  const drag = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
    moved: boolean
  } | null>(null)
  const frame = useRef(0)
  const metrics = useRef<CardMetrics[]>([])
  const world = useRef<WorldSize>({
    worldW: 1,
    worldH: 1,
    strideX: 1,
    strideY: 1,
  })

  const tiles = useMemo(() => {
    const featured = featuredWork(items)
    if (featured.length === 0) {
      return []
    }
    return [...featured, ...featured]
  }, [items])

  const measure = useCallback(() => {
    if (tiles.length === 0) {
      return
    }
    const cols = COLS
    const rows = Math.max(2, Math.ceil(tiles.length / cols))
    let maxW = 0
    let maxH = 0
    metrics.current = tiles.map((item, index) => {
      const size = cardSize(item.coverFormat)
      maxW = Math.max(maxW, size.width)
      maxH = Math.max(maxH, size.height)
      return {
        width: size.width,
        height: size.height,
        col: index % cols,
        row: Math.floor(index / cols),
      }
    })
    world.current = {
      strideX: maxW + GAP,
      strideY: maxH + GAP,
      worldW: cols * (maxW + GAP),
      worldH: rows * (maxH + GAP),
    }
  }, [tiles])

  const paint = useCallback(() => {
    const layer = layerRef.current
    const viewport = viewportRef.current
    if (!layer || !viewport) {
      return
    }
    const { worldW, worldH, strideX, strideY } = world.current
    const viewW = viewport.clientWidth
    const viewH = viewport.clientHeight
    const nodes = layer.children

    tiles.forEach((item, index) => {
      const node = nodes[index] as HTMLElement | undefined
      const card = metrics.current[index]
      if (!node || !card) {
        return
      }
      const wrappedX = wrap(card.col * strideX + offset.current.x, worldW)
      const wrappedY = wrap(card.row * strideY + offset.current.y, worldH)

      let bestX = wrappedX
      let bestY = wrappedY
      let bestVisible = false

      for (const dx of [0, -worldW, worldW]) {
        for (const dy of [0, -worldH, worldH]) {
          const x = wrappedX + dx
          const y = wrappedY + dy
          const visible =
            x < viewW &&
            y < viewH &&
            x + card.width > 0 &&
            y + card.height > 0
          if (visible) {
            bestX = x
            bestY = y
            bestVisible = true
          }
        }
      }

      node.style.width = `${card.width}px`
      node.style.height = `${card.height}px`
      node.style.transform = `translate3d(${bestX}px, ${bestY}px, 0)`
      node.style.visibility = bestVisible ? "visible" : "hidden"
      node.dataset.slug = item.slug
    })
  }, [tiles])

  useEffect(() => {
    measure()
    paint()
    const reduced = prefersReducedMotion()

    const tick = () => {
      if (!drag.current && !reduced) {
        offset.current.x += DRIFT_X
        offset.current.y += DRIFT_Y
      }
      paint()
      frame.current = requestAnimationFrame(tick)
    }

    frame.current = requestAnimationFrame(tick)
    const onResize = () => {
      measure()
      paint()
    }
    window.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener("resize", onResize)
    }
  }, [measure, paint])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.current.x,
      originY: offset.current.y,
      moved: false,
    }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const session = drag.current
    if (!session || session.pointerId !== event.pointerId) {
      return
    }
    const dx = event.clientX - session.startX
    const dy = event.clientY - session.startY
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      session.moved = true
    }
    offset.current.x = session.originX + dx
    offset.current.y = session.originY + dy
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const session = drag.current
    if (!session || session.pointerId !== event.pointerId) {
      return
    }
    const moved = session.moved
    drag.current = null
    if (moved) {
      return
    }
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-slug]"
    )
    const slug = target?.dataset.slug
    if (slug) {
      navigate(workPath(slug))
    }
  }

  const onCardKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    slug: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      navigate(workPath(slug))
    }
  }

  return (
    <div
      ref={viewportRef}
      className="plane"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <p className="plane__hint">Pan the plane · click a series</p>
      <div ref={layerRef} className="plane__layer">
        {tiles.map((item, index) => {
          const style: CSSProperties = { visibility: "hidden" }
          return (
            <button
              key={`${item.slug}-${index}`}
              type="button"
              className="plane__card"
              data-slug={item.slug}
              style={style}
              aria-label={`Open series ${item.title}`}
              onClick={(event) => event.preventDefault()}
              onKeyDown={(event) => onCardKeyDown(event, item.slug)}
            >
              <img
                src={item.cover}
                alt=""
                draggable={false}
                className="plane__image"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
