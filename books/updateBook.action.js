const BookModel = require('./book.model');

async function updateBook(bookId, updateData) {
    const book = await BookModel.findByIdAndUpdate(bookId, updateData, { new: true });
    return book;
}

module.exports = { updateBook };