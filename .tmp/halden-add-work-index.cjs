const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const staleIndex = await framer.getNode("J5sjNyUoy")
if (staleIndex) await staleIndex.remove()

const [center] = await framer.agent.serializeNodes({
    ids: ["bgKZOuJSQ"],
    depth: 1,
})
const hasCenteredIndex = (center.children || []).some(
    (child) => child.name === "Index"
)

let applied = { message: "Centered INDEX already exists" }
if (!hasCenteredIndex) {
    applied = await framer.agent.applyChanges(`
+RichTextNode workIndexLinkCentered parent="bgKZOuJSQ" name="Index" text="INDEX" link.href="/" linkStylePreset="Info Link" cursor="pointer" pointerEvents="auto" position="relative" width="auto" height="auto" fontName="IBM Plex Mono" fontStyle="normal" fontWeight="500" fontSize="11px" letterSpacing="0.08em" lineHeight="1.2em" textAlignment="center" textTransform="uppercase" textDecorationStyle="solid" textColor="var(--token-24aaa6c6-0b98-4eac-b695-5f20471f6b92)";
`)
    if (applied.errors) throw new Error(JSON.stringify(applied.errors))
}

console.log(JSON.stringify(applied, null, 2))
