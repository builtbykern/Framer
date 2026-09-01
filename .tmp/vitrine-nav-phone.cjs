const nav = await framer.agent.serializeNodes({
    ids: [
        "QhfNwiny9",
        "KVgGkkS4z",
        "ViBjWFaCI",
        "aqpa10Il4",
        "tKUMOkWpPQhfNwiny9",
        "tKUMOkWpPKVgGkkS4z",
        "tKUMOkWpPViBjWFaCI",
        "tKUMOkWpPaqpa10Il4",
        "u75vHQkARNBF_dDp3H",
        "GiR6fF7o5",
        "Nx5jccWgM",
        "tKUMOkWpP",
        "augiA20Il",
    ],
    depth: 2,
    attributeFilter: ["name", "text", "left", "width", "layoutTemplate", "$control__variant"],
})
console.log(JSON.stringify(nav, null, 2))
