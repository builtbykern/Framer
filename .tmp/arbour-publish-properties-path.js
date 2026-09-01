# Publish Arbour path rename + contact polish delta
const preview = await framer.agent.publish({ action: "preview" })
if (preview?.errors?.length) {
  console.log(JSON.stringify({ ok: false, stage: "preview", preview }, null, 2))
} else {
  const confirmed = await framer.agent.publish({
    action: "confirm_publish",
    confirmationHash: preview.confirmationHash,
  })
  const info = await framer.getPublishInfo()
  console.log(
    JSON.stringify(
      {
        ok: true,
        preview: {
          changesCount: preview.changesCount,
          status: preview.status,
          changes: preview.changes,
          version: preview.version,
        },
        confirmed: {
          status: confirmed?.status,
          message: confirmed?.message,
          version: confirmed?.version,
          versions: confirmed?.versions,
          optimizationStatus: confirmed?.optimizationStatus,
        },
        production: info?.production?.url,
        staging: info?.staging?.url,
      },
      null,
      2
    )
  )
}
