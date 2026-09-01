/**
 * About Opening Copy spacing — more top/bottom air before Beat 2.
 * Beat 1 was 100vh (image 70vh + copy) which can crush bottom pad.
 */
const NL = String.fromCharCode(10)
const lines = [
    // Beat 1 shell: auto height so Opening Copy padding can breathe
    `SET QjoW3yYRJ height="auto";`,
    `SET xvqDXw58eQjoW3yYRJ height="auto";`,
    `SET CYNrpU04tQjoW3yYRJ height="auto";`,
    // Opening Copy — balanced air (top M-ish, bottom L)
    `SET QzWTnDkey padding="64px 48px 128px 48px";`,
    `SET QzWTnDkey gap="24px";`,
    `SET xvqDXw58eQzWTnDkey padding="48px 40px 96px 40px";`,
    `SET xvqDXw58eQzWTnDkey gap="24px";`,
    `SET CYNrpU04tQzWTnDkey padding="40px 16px 64px 16px";`,
    `SET CYNrpU04tQzWTnDkey gap="20px";`,
]

const result = await framer.agent.applyChanges(lines.join(NL), {})

// verify
const pages = await framer.getNodesWithType("WebPageNode")
const p = pages.find((x) => x.path === "/about")
const ser = await framer.agent.serialize({ id: p.id, depth: 4 }, {})
const check = []
for (const bp of ser.children || []) {
    function walk(n) {
        if (!n) return
        if (/Opening Copy|Beat 1/i.test(n.name || "")) {
            const a = n.attributes || {}
            check.push({ bp: bp.name, name: n.name, pad: a.padding || null, h: a.height || null, gap: a.gap || null })
        }
        for (const c of n.children || []) walk(c)
    }
    walk(bp)
}
return { result: result?.message || result, check }
