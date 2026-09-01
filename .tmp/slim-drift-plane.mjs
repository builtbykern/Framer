import fs from "node:fs"

const path = "/Users/noel/Desktop/Framer/.tmp/halden-src/Drift_Plane.tsx"
let src = fs.readFileSync(path, "utf8")

function cut(startMarker, endMarker, replacement) {
    const a = src.indexOf(startMarker)
    if (a < 0) throw new Error(`missing start: ${startMarker.slice(0, 80)}`)
    const b = src.indexOf(endMarker, a)
    if (b < 0) throw new Error(`missing end: ${endMarker.slice(0, 80)}`)
    src = src.slice(0, a) + replacement + src.slice(b)
}

src = src.replace(
    'type PlaneView = "drift" | "collection"\ntype CollectionRule = "off" | "dotted" | "line"\n\n',
    'type PlaneView = "drift"\n\n'
)

cut(
    `    /** Layout for this instance. Breakpoint replicas override this. */
    view?: PlaneView | string
    /** @deprecated Width-routed trio — replica View is the source of truth. */
    viewDesktop?: PlaneView | string
    viewTablet?: PlaneView | string
    viewPhone?: PlaneView | string
`,
    `    layout: {`,
    `    view?: PlaneView | string
`
)

cut(
    `    /** Collection strip only. Hidden when View is Drift. */
    collection?: {`,
    `    padTop?: number`,
    `    padTop?: number`
)

src = src.replace(
    `\nconst COLLECTION_VEIL_Y = 48
const COLLECTION_VEIL_BLUR = "blur(4px)"
const COLLECTION_VEIL_MS = 490
const COLLECTION_VEIL_EASE = "cubic-bezier(0.5, 0, 0.5, 1)"
`,
    "\n"
)

cut(
    `\nconst DEFAULT_COLLECTION = {`,
    `\ninterface LayoutSlot {`,
    `\ninterface LayoutSlot {`
)

cut(
    `function coerceView(value: unknown, fallback: PlaneView): PlaneView {
    if (value === "collection" || value === "Collection") return "collection"
    if (value === "drift" || value === "Drift") return "drift"
    return fallback
}

function breakpointForWidth(width: number): "phone" | "tablet" | "desktop" {
    if (width <= 390) return "phone"
    if (width <= 810) return "tablet"
    return "desktop"
}

`,
    `function unwrapControlValue(value: unknown): unknown {`,
    `function unwrapControlValue(value: unknown): unknown {`
)

cut(
    `function coerceColor(value: unknown, fallback: string): string {
    const raw = unwrapControlValue(value)
    return typeof raw === "string" && raw.trim() ? raw : fallback
}

`,
    `function coerceBoolean(value: unknown, fallback: boolean): boolean {`,
    `function coerceBoolean(value: unknown, fallback: boolean): boolean {`
)

cut(
    `function familyFromSelector(selector: unknown): string | undefined {`,
    `function computeTile(layout: LayoutItem[], gap: number): TileBounds {`,
    `const INK = "rgb(17, 17, 17)"

function computeTile(layout: LayoutItem[], gap: number): TileBounds {`
)

cut(
    `type CollectionMod = "square" | "portrait" | "landscape" | "cluster"`,
    `function promoteToStage(node: HTMLElement, host: HTMLElement) {`,
    `function promoteToStage(node: HTMLElement, host: HTMLElement) {`
)

src = src.replace(
    `[data-driftplane-root]:not([data-driftplane-mode="collection"]) [data-driftplane-cms] a:nth-child(`,
    `[data-driftplane-root] [data-driftplane-cms] a:nth-child(`
)

cut(
    `        view,
        viewDesktop,
        viewTablet,
        viewPhone,
        layout = DEFAULT_LAYOUT_CTRL,
        motion: motionCtrl = DEFAULT_MOTION,
        depth = DEFAULT_DEPTH,
        input = DEFAULT_INPUT,
        collection: collectionCtrl = DEFAULT_COLLECTION,
        type: typeCtrl = DEFAULT_TYPE,
        padTop: padTopCtrl = 0,
        padBottom: padBottomCtrl = 0,
        style,
    } = props
`,
    `    const hintedW = layoutPx(style?.width)`,
    `        layout = DEFAULT_LAYOUT_CTRL,
        motion: motionCtrl = DEFAULT_MOTION,
        depth = DEFAULT_DEPTH,
        input = DEFAULT_INPUT,
        padTop: padTopCtrl = 0,
        padBottom: padBottomCtrl = 0,
        style,
    } = props
`
)

src = src.replace(
    `    const cmsHostRef = useRef<HTMLDivElement>(null)
    const collectionStripRef = useRef<HTMLDivElement>(null)
`,
    `    const cmsHostRef = useRef<HTMLDivElement>(null)
`
)

cut(
    `    const collectionGap = clamp(
        coerceNumber(collectionCtrl?.gap, DEFAULT_COLLECTION.gap),
        8,
        80
    )`,
    `    const chromePadTop = clamp(coerceNumber(padTopCtrl, 0), 0, 240)`,
    `    const chromePadTop = clamp(coerceNumber(padTopCtrl, 0), 0, 240)`
)

src = src.replace(
    `    const collectionDrag = useRef({
        id: null as number | null,
        x: 0,
        scroll: 0,
        moved: false,
    })
    const suppressDriftClick = useRef(false)
    const suppressCollectionClick = useRef(false)
`,
    `    const suppressDriftClick = useRef(false)
`
)

src = src.replace(
    `    const collectionBp = breakpointForWidth(frameW)
    const activeView = instanceView(view, viewDesktop, viewTablet, viewPhone)
    const isCollection = activeView === "collection"
    const appearOn = coerceBoolean(motionGroup.appear, DEFAULT_MOTION.appear)
`,
    `    const appearOn = coerceBoolean(motionGroup.appear, DEFAULT_MOTION.appear)
`
)

src = src.replace(
    `    const [introHot, setIntroHot] = useState(playIntro)
    const [collectionNudgeDone, setCollectionNudgeDone] = useState(false)
`,
    `    const [introHot, setIntroHot] = useState(playIntro)
`
)

src = src.replace(
    `    // Phone Home is Collection. Never snap the desktop Drift instance just
    // because Preview/editor chrome measured the frame under 390px.
    const useSnapMode = false
`,
    `    const useSnapMode = false
`
)

cut(
    `    useLayoutEffect(() => {
        if (!isCollection) setCollectionNudgeDone(false)
    }, [isCollection])

    useEffect(() => {
        if (!isCollection) return
        if (freezeAll) return
        if (prefersReduced) return
        if (collectionNudgeDone) return
`,
    `    useLayoutEffect(() => {
        if (cmsSource) return
`,
    `    useLayoutEffect(() => {
        if (cmsSource) return
`
)

src = src.replace(
    `    useLayoutEffect(() => {
        if (isCollection) return
        if (!cmsSource) return
`,
    `    useLayoutEffect(() => {
        if (!cmsSource) return
`
)

src = src.replace(
    `        useSnapMode,
        isCollection,
        tile,
`,
    `        useSnapMode,
        tile,
`
)

cut(
    `    useLayoutEffect(() => {
        if (!isCollection) return
        if (!cmsSource) return
        const host = cmsHostRef.current
        const root = rootRef.current
        if (!host) return
        let lastBoxW = -1
`,
    `    useLayoutEffect(() => {
        const root = rootRef.current
        if (!root) return
        const apply = () => {
            const box = nodeLayoutSize(root)
`,
    `    useLayoutEffect(() => {
        const root = rootRef.current
        if (!root) return
        const apply = () => {
            const box = nodeLayoutSize(root)
`
)

src = src.replace(
    `    useEffect(() => {
        if (isCollection) return
        if (useSnapMode) return
        if (freezeAll) return
        if (typeof window === "undefined") return
`,
    `    useEffect(() => {
        if (useSnapMode) return
        if (freezeAll) return
        if (typeof window === "undefined") return
`
)

src = src.replace(
    `        useSnapMode,
        isCollection,
    ])

    const endPan = (`,
    `        useSnapMode,
    ])

    const endPan = (`
)

cut(
    `    const onCollectionPointerDown = (`,
    `    const rootStyle: CSSProperties = {`,
    `    const rootStyle: CSSProperties = {`
)

src = src.replace(
    `DriftPlane.defaultProps = {
    view: "drift",
    viewDesktop: "drift",
    viewTablet: "collection",
    viewPhone: "collection",
    collection: { ...DEFAULT_COLLECTION },
    type: { ...DEFAULT_TYPE },
    padTop: 0,
    padBottom: 0,
}
`,
    `DriftPlane.defaultProps = {
    view: "drift",
    padTop: 0,
    padBottom: 0,
}
`
)

cut(
    `    view: {
        type: ControlType.Enum,
        title: "View",
`,
    `    layout: {`,
    `    layout: {`
)

src = src.replace(
    `        hidden: (props) => planeViewFromProps(props) !== "drift",
        description: "Overall size of the card scatter.",
`,
    `        description: "Overall size of the card scatter.",
`
)

src = src.replace(
    `        hidden: (props) => planeViewFromProps(props) !== "drift",
        description: "How the plane moves and settles.",
`,
    `        description: "How the plane moves and settles.",
`
)

src = src.replace(
    `        hidden: (props) => planeViewFromProps(props) !== "drift",
        description: "Parallax speed per layer — near moves more.",
`,
    `        description: "Parallax speed per layer — near moves more.",
`
)

src = src.replace(
    `        hidden: (props) => planeViewFromProps(props) !== "drift",
        description: "Drag and scroll sensitivity.",
`,
    `        description: "Drag and scroll sensitivity.",
`
)

if (!src.includes('title: "Pad Top"')) {
    src = src.replace(
        `    layout: {
        type: ControlType.Object,
        title: "Layout",`,
        `    padTop: {
        type: ControlType.Number,
        title: "Pad Top",
        description: "Inset above the plane. Clears the nav.",
        defaultValue: 0,
        min: 0,
        max: 240,
        step: 1,
        unit: "px",
    },
    padBottom: {
        type: ControlType.Number,
        title: "Pad Bottom",
        description: "Inset below the plane.",
        defaultValue: 0,
        min: 0,
        max: 240,
        step: 1,
        unit: "px",
    },
    layout: {
        type: ControlType.Object,
        title: "Layout",`
    )
}

const leftovers = [
    "isCollection",
    "COLLECTION_",
    "DEFAULT_COLLECTION",
    "DEFAULT_TYPE",
    "collectionCtrl",
    "collectionStrip",
    "collectionNudge",
    "collectionDrag",
    "collectionBp",
    "onCollection",
    "planeViewFromProps",
    "instanceView",
    "FONT_CSS_KEYS",
    "fontToCss",
    "coerceRule",
    "viewDesktop",
    "data-driftplane-mode=\"collection\"",
]
const hits = leftovers.filter((k) => src.includes(k))
fs.writeFileSync(path, src)
console.log(
    JSON.stringify(
        { bytes: src.length, lines: src.split("\n").length, leftovers: hits },
        null,
        2
    )
)
