const { chromium } = require("playwright")
const fs = require("fs")

const BASE = "https://arbour.framer.website"
const PAGES = ["/", "/properties-2", "/neighbourhoods", "/contact", "/about"]

;(async () => {
  const browser = await chromium.launch()
  const out = []
  for (const path of PAGES) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 90000 })
      await page.waitForTimeout(1200)
      const slug = path === "/" ? "home" : path.slice(1).replace(/\//g, "-")
      const shot = `.tmp/arbour-hero-audit-${slug}.png`
      await page.screenshot({ path: shot, fullPage: false })
      const info = await page.evaluate(() => {
        const h1 = document.querySelector("h1")
        const texts = [...document.querySelectorAll("h1, h2, p")]
          .slice(0, 8)
          .map((el) => ({
            tag: el.tagName,
            text: (el.innerText || "").trim().slice(0, 120),
            fontSize: getComputedStyle(el).fontSize,
          }))
        const imgs = [...document.querySelectorAll("img")].filter((img) => {
          const r = img.getBoundingClientRect()
          return r.top < innerHeight && r.height > 120 && r.width > 120
        })
        const videos = document.querySelectorAll("video").length
        const bgMedia = [...document.querySelectorAll("*")].filter((el) => {
          const r = el.getBoundingClientRect()
          if (r.top > innerHeight * 0.85 || r.height < 200) return false
          const bg = getComputedStyle(el).backgroundImage || ""
          return bg.includes("url(")
        }).length
        return {
          title: document.title,
          h1: h1?.innerText?.trim()?.slice(0, 160) || null,
          viewportTexts: texts,
          heroImgs: imgs.length,
          videos,
          bgMediaNearTop: bgMedia,
        }
      })
      out.push({ path, shot, ...info })
    } catch (e) {
      out.push({ path, err: e.message })
    }
    await page.close()
  }
  fs.writeFileSync(".tmp/arbour-hero-audit.json", JSON.stringify(out, null, 2))
  console.log(JSON.stringify(out, null, 2))
  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
