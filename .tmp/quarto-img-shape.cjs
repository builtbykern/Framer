const books = await framer.agent.queryImages({
    source: "unsplash",
    query: "open hardcover book on a table printed pages",
    count: 3,
    orientation: "landscape",
    width: 1600,
})
console.log(typeof books, Array.isArray(books), JSON.stringify(books).slice(0, 2000))
