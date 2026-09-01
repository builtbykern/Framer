function fail(msg) {
    throw new Error(msg)
}
function val(v) {
    return v && typeof v === "object" && "value" in v ? v.value : v
}
function img(v) {
    const r = val(v)
    if (!r) return null
    return {
        url: typeof r === "string" ? r : r.url || r.src || "",
        alt: typeof r === "string" ? "" : String(r.alt || r.altText || ""),
    }
}
function rows(v) {
    const r = val(v)
    return Array.isArray(r) ? r : []
}

const col = await framer.getCollection("amTC8pcIG")
const fields = await col.getFields()
const names = fields.map((f) => f.name)
if (names.includes("Date Label")) fail("Date Label field still exists")
if (names.includes("Gallery 2")) fail("Gallery 2 field still exists")

const id = Object.fromEntries(fields.map((f) => [f.name, f.id]))
const salt = (await col.getItems()).find((i) => i.slug === "salt-light")
const stills = rows(salt.fieldData[id.Gallery]).map((row) =>
    img(row.fieldData?.ZkP9UsFFL || Object.values(row.fieldData || {})[0])
)

function still(re) {
    const hit = stills.find((s) => re.test(s.alt))
    if (!hit) fail(`missing still alt ${re}`)
    return hit
}

const rail = still(/rusted rail/i)
if (!/TITWDFPTE3rvk38|mge10rQn0Y74/.test(rail.url)) {
    fail(`Rusted rail alt on wrong file: ${rail.url} / ${rail.alt}`)
}
const lamps = still(/lamps/i)
if (!/g0b9SJ6KkkJMHc1mShP4nvRmI/.test(lamps.url)) {
    fail(`Lamps alt on wrong file: ${lamps.url} / ${lamps.alt}`)
}
const wave = still(/wave/i)
if (!/2Qyl9G77xnlCo5jlCSS9oFI6CDg/.test(wave.url)) {
    fail(`Wave alt on wrong file: ${wave.url} / ${wave.alt}`)
}

console.log(JSON.stringify({ ok: true, fields: names, stillAlts: stills.map((s) => s.alt) }))
