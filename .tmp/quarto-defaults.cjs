const field = "var(--token-14d41f00-d3b3-4455-b994-8566aa84333e)"

const defaults = await framer.agent.applyChanges(
    `
SET OdvHkNWXz $control__title="Hours Bound";
SET OdvHkNWXz $control__description="A daybook in eight gatherings. The type is the weather.";
SET S4aeyJLQaebjghUxzc textStylePreset="Label" width="100%";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

console.log(JSON.stringify({ defaults }, null, 2))
