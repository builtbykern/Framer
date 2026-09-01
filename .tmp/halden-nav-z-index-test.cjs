const NAV_Z = 10

const file = await framer.getCodeFile("Menu_Paper_Reveal.tsx")
if (!file) throw new Error("Menu_Paper_Reveal.tsx not found")

const match = file.content.match(/const VEIL_Z = (\d+)/)
if (!match) throw new Error("VEIL_Z constant not found")

const veilZ = Number(match[1])
if (veilZ >= NAV_Z) {
    throw new Error(
        `Menu veil z-index ${veilZ} covers Nav Bar z-index ${NAV_Z}`
    )
}

console.log(JSON.stringify({ ok: true, navZ: NAV_Z, veilZ }, null, 2))
