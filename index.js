require("dotenv").config();


const express = require("express");

var bodyparser = require("body-parser");
//Database
const database = require("./database/database");

const mongoose = require("mongoose");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const Publication = require("./database/publication");

//Initialise express
const booky = express();

booky.use(bodyparser.urlencoded({extended:true}));
booky.use(bodyparser.json());

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connection Established"));

/*
Route          /
Description   Get all the books
Access        PUBLIC
Parameter     NONE
Methods       Get       
*/

booky.get("/",async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*
Route          /is
Description   Get specific book on ISBN
Access        PUBLIC
Parameter     isbn
Methods       Get       
*/

booky.get("/is/:isbn", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
    }

    return res.json({book:getSpecificBook});
});

/*
Route          /is
Description   Get specific book on category
Access        PUBLIC
Parameter     category
Methods       Get       
*/

booky.get("/c/:category", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    )

    if(getSpecificBook.length === 0 ) {
        return res.json({error:`No book found for the category of ${req.params.category}`})
    }

    return res.json({book:getSpecificBook});

});

/*
Route          /lang
Description   Get a book based on language
Access        PUBLIC
Parameter     NONE
Methods       Get       
*/

booky.get("/lang/:language", (req,res) => {
    const getSpecificLanguage = database.books.filter(
        (book) => book.language.includes(req.params.language)
    );

    if(getSpecificLanguage.length === 0){
        return res.json({error:`No book found for the language of ${req.params.language}`})
    }

    return res.json({book:getSpecificLanguage})
})


/*
Route          /author
Description   Get all the authors
Access        PUBLIC
Parameter     NONE
Methods       Get       
*/

booky.get("/author", (req,res) => {
    return res.json({authors: database.author});
});

/*
Route          /id
Description   Get specific author based on id
Access        PUBLIC
Parameter     id
Methods       Get       
*/

booky.get("/id/:id", (req,res) => {
    const getSpecificAuthorId = database.author.filter(
        (book) => book.id === parseInt(req.params.id)
    )

    if(getSpecificAuthorId.length === 0){
        return res.json({error: `No book found for the ID of ${req.params.id}`})
    }

    return res.json({book:getSpecificAuthorId})
})


/*
Route          /author/book
Description   Get all authors based on books
Access        PUBLIC
Parameter     isbn
Methods       Get       
*/

booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthor.length === 0){
        return res.json({error:`No author found for book of ${req.params.isbn}`})
    }                  

    return res.json({authors: getSpecificAuthor});
});

/*
Route          /publications
Description   Get all publications
Access        PUBLIC
Parameter     NONE
Methods       Get       
*/

booky.get("/publications", async (req,res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
})


/*
Route          /publications
Description   Get a specific publications
Access        PUBLIC
Parameter     NONE
Methods       Get       
*/

booky.get("/pub/:publication", (req,res) => {
    const getSpecificPublication = database.publication.filter(
        (book) => book.name.includes(req.params.publication)
    )

    if(getSpecificPublication.length === 0){
        return res.json({error:`No book found for publication of ${req.params.publication}`})
    }                  

    return res.json({authors: getSpecificPublication});

})

/*
Route          /pub/book/
Description   Get a publications based on book
Access        PUBLIC
Parameter     isbn
Methods       Get       
*/

booky.get("/pub/book/:isbn", (req,res) => {
    const getSpecificPublication = database.publication.filter(
        (book) => book.books.includes(req.params.isbn)
    )

    if(getSpecificPublication.length === 0){
        return res.json({error:`No book found for publication of ${req.params.isbn}`})
    }                  
    
    return res.json({publication: getSpecificPublication});
    
});

//POST METHOD------------------------------------------------------------------------>

/*
Route          /book/new
Description   Add new book
Access        PUBLIC
Parameter     NONE
Methods       POST
*/

booky.post("/book/new", (req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBook: database.books});
});

/*
Route          /book/new
Description   Add new Author
Access        PUBLIC
Parameter     NONE
Methods       POST
*/

booky.post("/author/new",(req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({updatedAthor:database.author})
});

/*
Route          /book/new
Description   Add new Publication
Access        PUBLIC
Parameter     NONE
Methods       POST
*/

booky.post("/publication/new",(req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json({updatedPublication:database.publication})
});

/*********PUT METHOD********/

/*
Route         /publication/update/book 
Description   Update/add new publiaction
Access        PUBLIC
Parameter     isbn
Methods       PUT
*/

booky.put("/publication/update/book/:isbn", (req,res) => {
    //update the publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId){
            return pub.books.push(req.params.isbn);
        }
    });

    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.body.isbn){
            return book.publication.push(req.params.pubId);
        }
    })

    return res.json(
        {
            books : database.books,
            publications : database.publication,
            message : "Successfully updated publications"
        }
    )
});


/********DELETE METHOD *********** */

/*
Route         /book/delete/ 
Description   delete a book
Access        PUBLIC
Parameter     isbn
Methods       DELETE
*/

booky.delete("/book/delete/:isbn",(req,res) => {
// Whichever book that does not match with isbn, just sent it to an a updatedBookDatabase array
// And rest will be filtered out 

    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBookDatabase;

    return res.json({books:database.books})
})

/*
Route         /book/delete/ 
Description   delete a book
Access        PUBLIC
Parameter     isbn
Methods       DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //Update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            )
            book.author = newAuthorList;
            return;
        }
    });

    //Update the author database
    database.author.forEach((eachAuthor) => {
        if(eachAuthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            )
            eachAuthor.books = newBookList;
            return;
        }
    });

    return res.json({
        book: database.books,
        author: database.author,
        message: "Author was deleted!!!!!"
    });
});

booky.listen(3000, () => {
    console.log("Server is up and running");
});
