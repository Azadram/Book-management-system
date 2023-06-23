const books = [
    {
        ISBN:"12345Book",
        title:"Tesla!!!!",
        pubDate:"2021-08-05",
        language: "en",
        numpage:250,
        author: [1,2],
        publication: [1],
        category: ["tech", "space", "education" ]
    }
]

const author = [
    {
        id:1,
        name: "Aradhana",
        books:["12345Book", "secretBook"]
    },
    {
        id:2,
        name: "Elon Mask",
        books:["12345Book"]
    }
]

const publication = [
    {
        id:1,
        name: "writex",
        books: ["12345book"]
    },
    {
        id:2,
        name: "writex",
        books: []
    }

]

module.exports = {books , author , publication};