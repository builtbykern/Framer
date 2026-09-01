const methods = Object.keys(framer)
    .filter((k) => /name|title|project|rename|set/i.test(k))
    .sort()

await framer.agent.readProject(
    [
        { type: "font-search", name: "Fraunces" },
        { type: "font-search", name: "Newsreader" },
        { type: "font-search", name: "IBM Plex Sans" },
    ],
    { pagePath: "/" }
)

const books = await framer.agent.queryImages({
    source: "unsplash",
    query: "open hardcover book printed pages",
    count: 4,
    orientation: "landscape",
    width: 1600,
})
const press = await framer.agent.queryImages({
    source: "unsplash",
    query: "letterpress print shop metal type",
    count: 4,
    orientation: "landscape",
    width: 1600,
})
const paper = await framer.agent.queryImages({
    source: "unsplash",
    query: "stack of printed paper sheets",
    count: 4,
    orientation: "portrait",
    width: 1200,
})
const spines = await framer.agent.queryImages({
    source: "unsplash",
    query: "row of book spines on a shelf",
    count: 4,
    orientation: "portrait",
    width: 1200,
})

function urls(pack) {
    return (pack?.results || []).map((b) => ({ url: b.url, alt: b.alt }))
}

const styles = await framer.agent.applyChanges(
    `
SET 14d41f00-d3b3-4455-b994-8566aa84333e name="field" light="rgb(232, 236, 231)";
SET 724c8003-5371-4e26-9bfa-187223cdcf10 name="ink" light="rgb(22, 36, 30)";
SET 41c8b9ae-e604-40b6-9d37-a14c3803c179 name="mute" light="rgb(90, 102, 94)";
+ColorStyleTokenNode tRule0001 name="rule";
SET tRule0001 light="rgb(176, 42, 28)";
SET dPXgkd9PP fontName="Fraunces" fontWeight="600" fontSize="28px" letterSpacing="-0.03em" lineHeight="1.05em" textTransform="none" textColor="rgb(22, 36, 30)";
SET nzsp03Fh5 fontName="Fraunces" fontWeight="600" fontSize="20px" letterSpacing="-0.02em" lineHeight="1.15em" textTransform="none" textColor="rgb(22, 36, 30)";
SET BEFvspdZd fontName="IBM Plex Sans" fontWeight="500" fontSize="11px" letterSpacing="0.04em" lineHeight="1.3em" textTransform="uppercase" textColor="rgb(90, 102, 94)";
SET t5y0e5eot fontName="Newsreader" fontWeight="400" fontSize="15px" letterSpacing="0em" lineHeight="1.45em" textColor="rgb(22, 36, 30)";
SET rootNode metadata.title="Quarto" metadata.description="A small press catalog. Editions in the order they were bound.";
SET MmqIQ0wEw link.textColor="rgb(22, 36, 30)" link.hover.textColor="rgb(176, 42, 28)" link.current.textColor="rgb(176, 42, 28)";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

const imgs = {
    books: urls(books),
    press: urls(press),
    paper: urls(paper),
    spines: urls(spines),
}
require("fs").writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/quarto-images.json",
    JSON.stringify(imgs, null, 2)
)

console.log(JSON.stringify({ methods, styles, counts: {
    books: imgs.books.length,
    press: imgs.press.length,
    paper: imgs.paper.length,
    spines: imgs.spines.length,
} }, null, 2))
