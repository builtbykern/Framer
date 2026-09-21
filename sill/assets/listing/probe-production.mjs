import { chromium } from "../../../components/alarm-clock/node_modules/playwright-core/index.mjs"
const browser = await chromium.launch({ channel: "chrome", headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto("https://sill.framer.website/", { waitUntil: "networkidle" })
const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
const h1c = await page.evaluate(() => {
  const h = document.querySelector("h1")
  return h ? getComputedStyle(h).color : null
})
await page.screenshot({
  path: "/Users/noel/Desktop/Framer/sill/assets/listing/probe-production.png",
})
const thumb = await page.goto("https://sill.framer.website/thumbnail", {
  waitUntil: "domcontentloaded",
})
console.log(
  JSON.stringify(
    {
      home: page.url(),
      bg,
      h1c,
      thumbStatus: thumb?.status(),
      thumbTitle: await page.title(),
    },
    null,
    2
  )
)
await browser.close()
