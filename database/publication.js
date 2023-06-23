const mongoose = require("mongoose");

// create Publication Schema

const PublicationSchema = mongoose.Schema(
    {
        id:Number,
        name: Number,
        books: [String]
    }
);

const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;
