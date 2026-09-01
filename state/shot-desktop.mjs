const fs = await import("fs")
const shot = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync("state/ers-desktop-shot.png", shot.data)
console.log(
    JSON.stringify({
        ok: true,
        bytes: shot.data?.length || 0,
        mimeType: shot.mimeType,
    })
)
