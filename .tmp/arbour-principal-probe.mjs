function slim(n, d = 0) {
    if (!n || d > 7) return null
    const a = n.attributes || {}
    const controls = {}
    for (const [k, v] of Object.entries(a)) {
        if (k.startsWith("$control__")) controls[k] = v
    }
    return {
        id: n.id,
        name: n.name,
        type: n.type,
        layout: a.layout || null,
        pad: a.padding || null,
        gap: a.gap || null,
        w: a.width || null,
        h: a.height || null,
        fill: a.fill ? String(a.fill).slice(0, 70) : null,
        bg: a.backgroundColor ? String(a.backgroundColor).slice(0, 50) : null,
        preset: a.textStylePreset || null,
        controls: Object.keys(controls).length ? controls : null,
        children: (n.children || []).map((c) => slim(c, d + 1)).filter(Boolean),
    }
}

const full = await framer.agent.serialize({ id: "GViAPxZ97", depth: 8 }, {})
const inst1 = await framer.getNode("lG0XIx4Ew")
const inst2 = await framer.getNode("VRBMO9k6V")

return {
    component: slim(full),
    inst1: inst1
        ? {
              id: inst1.id,
              name: inst1.name,
              comp: inst1.componentIdentifier,
              controls: inst1.controls,
              w: inst1.width,
              h: inst1.height,
              opacity: inst1.opacity,
          }
        : null,
    inst2: inst2
        ? {
              id: inst2.id,
              name: inst2.name,
              comp: inst2.componentIdentifier,
              controls: inst2.controls,
              w: inst2.width,
              h: inst2.height,
          }
        : null,
}
