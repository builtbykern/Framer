const { chromium } = require("playwright")
const ffmpeg = require("ffmpeg-static")
const { spawnSync } = require("child_process")
const fs = require("fs")
const path = require("path")
const os = require("os")

const outDir = "/Users/noel/Desktop/Framer/docs/projects/listings"
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "glass-demo-"))
const raw = path.join(tmpDir, "raw.mp4")
const mp4 = path.join(outDir, "Kern_GlassType_demo_3s.mp4")

function run(bin, args) {
    const r = spawnSync(bin, args, { encoding: "utf8" })
    if (r.status !== 0) {
        console.error((r.stderr || "").slice(-2500))
        throw new Error(args[0] || "cmd failed")
    }
    return r
}

;(async () => {
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
        viewport: { width: 1600, height: 1200 },
        deviceScaleFactor: 1,
        recordVideo: {
            dir: tmpDir,
            size: { width: 1600, height: 1200 },
        },
    })
    const page = await context.newPage()
    await page.goto("https://social-track-366523.framer.app/thumbnail", {
        waitUntil: "networkidle",
        timeout: 60000,
    })
    const glass = page.getByRole("img", { name: /BuiltByKern/ })
    await glass.waitFor({ timeout: 20000 })
    await page.waitForFunction(() => {
        const el = document.querySelector('[role="img"] canvas')
        return !!(el && el.width > 100 && el.height > 100)
    })
    await page.waitForTimeout(1800)

    const box = await glass.boundingBox()
    if (!box) throw new Error("no glass box")
    console.log("glass", JSON.stringify(box))

    const y = box.y + box.height * 0.48
    const left = box.x + box.width * 0.16
    const right = box.x + box.width * 0.84
    const mid = box.x + box.width * 0.5

    await page.mouse.move(mid, y)
    await page.waitForTimeout(700)
    await page.mouse.move(left, y - 10, { steps: 36 })
    await page.waitForTimeout(250)
    await page.mouse.move(right, y + 8, { steps: 52 })
    await page.waitForTimeout(250)
    await page.mouse.move(mid + 30, y - 16, { steps: 28 })
    await page.waitForTimeout(800)

    await context.close()
    await browser.close()

    const files = fs.readdirSync(tmpDir).filter((f) => f.endsWith(".webm"))
    if (!files.length) throw new Error("no webm")
    const webm = path.join(tmpDir, files[0])
    console.log("webm", webm, fs.statSync(webm).size)

    run(ffmpeg, [
        "-y",
        "-i",
        webm,
        "-an",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        raw,
    ])

    run(ffmpeg, [
        "-y",
        "-ss",
        "2.4",
        "-i",
        raw,
        "-t",
        "4.2",
        "-an",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        mp4,
    ])

    const st = fs.statSync(mp4)
    console.log("mp4", mp4, st.size)
    const probe = run(ffmpeg, ["-i", mp4])
    console.log(
        (probe.stderr || "")
            .split("\n")
            .filter((l) => /Duration|Video:|Audio:/.test(l))
            .join("\n")
    )

    run(ffmpeg, [
        "-y",
        "-i",
        mp4,
        "-ss",
        "0.15",
        "-update",
        "1",
        "-frames:v",
        "1",
        path.join(outDir, "Kern_GlassType_demo_idle.png"),
    ])
    run(ffmpeg, [
        "-y",
        "-i",
        mp4,
        "-ss",
        "2.1",
        "-update",
        "1",
        "-frames:v",
        "1",
        path.join(outDir, "Kern_GlassType_demo_hover.png"),
    ])
})().catch((e) => {
    console.error(e)
    process.exit(1)
})
