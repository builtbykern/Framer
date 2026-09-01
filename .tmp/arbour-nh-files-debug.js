const info = await framer.getProjectInfo()
const files = await framer.getCodeFiles()
const inst = await framer.agent.serialize({ id: "z2kRrpzAZ", depth: 1 }, {})
const photo = await framer.agent.serialize({ id: "hX5NduSNi", depth: 2 }, {})

console.log(
  JSON.stringify(
    {
      project: info,
      fileCount: files.length,
      files: files.map((f) => ({ id: f.id, name: f.name })),
      instType: inst?.type,
      instName: inst?.name,
      instAttrs: inst?.attributes,
      photoKids: (photo?.children || []).map((c) => ({
        id: c.id,
        type: c.type,
        name: c.name,
        attrs: c.attributes,
      })),
    },
    null,
    2
  )
)
