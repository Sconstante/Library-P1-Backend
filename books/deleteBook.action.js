const BookModel = require('./book.model');

async function softDeleteBook(bookId) {
    const book = await BookModel.findById(bookId);
    book.softDelete = true;
    await book.save();
    return book;
}

module.exports = { softDeleteBook };