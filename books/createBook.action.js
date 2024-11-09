const BookModel = require('./book.model');

async function createBook(bookData) {
    const newBook = new BookModel(bookData);
    await newBook.save();
    return newBook;
}

module.exports = { createBook };