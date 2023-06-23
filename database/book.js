const mongoose = require("mongoose");

// create book Schema

const BookSchema = mongoose.Schema(
    {
        ISBN: String,
        title: String,
        pubDate: String,
        language: String,
        numpage: Number,
        author: [Number],
        publication: [Number],
        category: [String ]
    }
);

//books is used because we have create books in mongodb
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;