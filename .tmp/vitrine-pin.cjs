const r = await framer.agent.applyChanges(
    `SET N8rSuGdDW $control__cover.src="https://images.unsplash.com/photo-1755542234308-587524229b49?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400" $control__cover.alt="Small vase on wood" $control__still.src="https://images.unsplash.com/photo-1784387663026-f66c79d7d73d?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400" $control__still.alt="Ribbed cup on wood"; SET EDUlD2m19 $control__still.src="https://images.unsplash.com/photo-1775612069408-bd9b567fc095?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400" $control__still.alt="Ceramic cups on a shelf";`,
    { pagePath: "/" }
)
console.log(JSON.stringify(r, null, 2))
