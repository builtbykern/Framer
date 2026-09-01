const pagePath = "/properties-2/:Properties"

const dsl = `
SET AgSQrniYR visible="false";
SET IQmBTrFpbAgSQrniYR visible="false";
SET MrTKJzwELAgSQrniYR visible="false";
SET TanN7b8Lp appearEffect.trigger="onMount" appearEffect.replay="false" appearEffect.threshold="0" appearEffect.enter.opacity="0" appearEffect.enter.scale="1.06" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.rotate="0" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.45s 0s";
SET IQmBTrFpbTanN7b8Lp appearEffect.trigger="onMount" appearEffect.replay="false" appearEffect.threshold="0" appearEffect.enter.opacity="0" appearEffect.enter.scale="1.06" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.rotate="0" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.45s 0s";
SET MrTKJzwELTanN7b8Lp appearEffect.trigger="onMount" appearEffect.replay="false" appearEffect.threshold="0" appearEffect.enter.opacity="0" appearEffect.enter.scale="1.06" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.rotate="0" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.45s 0s";
`

const result = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify(result, null, 2))

async function check(id) {
  const n = await framer.agent.serialize(
    { id, depth: 0, attributeFilter: ["name", "visible", "appearEffect"] },
    { pagePath }
  )
  return {
    id,
    name: n?.name,
    visible: n?.attributes?.visible,
    appear: n?.attributes?.appearEffect,
    comp: n?.$componentDisplayName,
  }
}

const checks = []
for (const id of [
  "AgSQrniYR",
  "IQmBTrFpbAgSQrniYR",
  "MrTKJzwELAgSQrniYR",
  "TanN7b8Lp",
  "IQmBTrFpbTanN7b8Lp",
  "MrTKJzwELTanN7b8Lp",
]) {
  checks.push(await check(id))
}
console.log("VERIFY", JSON.stringify(checks, null, 2))
