const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const lint = await framer.agent.applyChanges(
    [
        'SET MmqIQ0wEw link.textColor="rgb(168, 168, 164)" link.hover.textColor="rgb(232, 230, 225)" link.current.textColor="rgb(232, 230, 225)";',
        'SET dPXgkd9PP breakpoint.default.fontSize="16px" breakpoint.default.letterSpacing="-0.04em" fontWeight="500";',
        'SET nzsp03Fh5 breakpoint.default.fontSize="15px";',
        'SET t5y0e5eot breakpoint.default.fontSize="12px" breakpoint.default.lineHeight="1.35em";',
        'SET yZes1fNVs padding="16px 32px 12px 32px";',
        'SET Nx5jccWgMyZes1fNVs padding="14px 22px 10px 22px";',
        'SET tKUMOkWpPyZes1fNVs padding="12px 16px 10px 16px";',
        'SET GiR6fF7o5 gap="8px";',
        'SET Nx5jccWgM gap="8px";',
        'SET tKUMOkWpP gap="6px";',
        'SET orXs4NZw2 gap="22px";',
        'SET yAd2lMDSW gap="40px" padding="28px 32px 96px 32px";',
        'SET t62LHpSTayAd2lMDSW gap="48px" padding="24px 22px 80px 22px";',
        'SET u75vHQkARyAd2lMDSW gap="40px" padding="20px 16px 72px 16px";',
        'SET omF0gODuR gap="6px";',
        'SET BZgqwOKfT gap="6px";',
        'SET GLlag6b9R gap="6px";',
        'SET S4aeyJLQa gap="6px";',
        'SET augiA20Il metadata.title="Vitrine" metadata.description="A catalogue of printed work. Sheets in the order they were issued.";',
        'SET FZFYEKdG1 metadata.title="Vitrine" metadata.description="A sheet from the catalogue.";',
        'SET eT5aUzOXW metadata.title="House — Vitrine" metadata.description="The house keeps a catalogue of printed work.";',
        'SET pTPGQ4L6O metadata.title="Desk — Vitrine" metadata.description="For commissions and prints, write the desk.";',
        'SET GPILtKFJP metadata.title="Not on the wall — Vitrine" metadata.description="That sheet is not in the catalogue.";',
    ].join(" "),
    { pagePath: "/" }
)

const copies = []
for (const [id, search, replace] of [
    ["QhfNwiny9", "Vitrine", "vitrine"],
    [
        "oSHXrizqB",
        "The house keeps a catalogue of work from the bench. Each piece has a date, a name, a note, an object, and a still.",
        "The house keeps a catalogue of printed work. Each sheet has a date, a name, a note, a cover, and a still.",
    ],
    [
        "DZIMTQiKB",
        "For commissions and studio visits, write the desk.",
        "For commissions and prints, write the desk.",
    ],
    ["BU8_2gg2U", "Not on the bench", "Not on the wall"],
    [
        "axW_NfbLI",
        "That piece is not in the catalogue. Return to the index.",
        "That sheet is not in the catalogue. Return to the index.",
    ],
    ["i5CphXhmV", "No pieces on the bench.", "No sheets on the wall."],
]) {
    try {
        copies.push({
            id,
            ok: await framer.agent.replaceText({ id, searchText: search, replaceText: replace }, { pagePath: "/" }),
        })
    } catch (e) {
        copies.push({ id, err: String(e) })
    }
}

const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
    ["tVu2ncruf", "house-desktop.jpg"],
    ["J1kd1wjJe", "desk-desktop.jpg"],
    ["pWw0UM2JG", "404-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
}

console.log(
    JSON.stringify(
        {
            lint: { message: lint.message, errors: lint.linter?.errors, warnings: lint.linter?.warnings },
            copies,
        },
        null,
        2
    )
)
