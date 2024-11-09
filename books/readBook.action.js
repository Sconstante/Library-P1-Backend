const BookModel = require('./book.model');

async function getBooks(filter) {
    const books = await BookModel.find(filter);
    return books;
}

async function getBookById(bookId, includeDisabled = false) {
    const filter = { _id: bookId };
    if (!includeDisabled) {
        filter.softDelete = false;
    }

    const book = await BookModel.findOne(filter);
    return book;
}

module.exports = { getBooks, getBookById };