const { createBook } = require("./createBook.action");
const { softDeleteBook } = require("./deleteBook.action");
const { updateBook } = require("./updateBook.action");
const { getBooks, getBookById } = require("./readBook.action");
const { reserveBook } = require("./reserveBook.action");
const { returnBook } = require("./returnBook.action");
const { getUserById } = require("../users/readUser.action");
const mongoose = require("mongoose");

async function createNewBook(req, res) {
  const {
    name,
    genre,
    publicationYear,
    publisher,
    author,
    totalCopies,
    availableCopies,
  } = req.body;
  const { userId: requesterId } = req;

  if (
    !name ||
    !genre ||
    !publicationYear ||
    !publisher ||
    !author ||
    totalCopies === undefined ||
    availableCopies === undefined
  ) {
    return res.status(400).json({ error: "Incomplete data" });
  }

  const requester = await getUserById(requesterId);
  if (!requester || !requester.permissions.includes("create_books")) {
    return res.status(403).json({ error: "Permission denied" });
  }

  const newBook = await createBook({
    name,
    genre,
    publicationYear,
    publisher,
    author,
    totalCopies,
    availableCopies,
  });
  res.status(200).json({ message: "Book created successfully", book: newBook });
}

async function updateBookData(req, res) {
  const {
    bookId,
    name,
    genre,
    publicationYear,
    publisher,
    author,
    totalCopies,
    availableCopies,
  } = req.body;
  const { userId: requesterId } = req;

  if (!bookId) {
    return res.status(400).json({ error: "No book id provided" });
  }

  const requester = await getUserById(requesterId);
  if (!requester || !requester.permissions.includes("update_books")) {
    return res.status(403).json({ error: "Permission denied" });
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (genre) updateData.genre = genre;
  if (publicationYear) updateData.publicationYear = publicationYear;
  if (publisher) updateData.publisher = publisher;
  if (author) updateData.author = author;
  if (totalCopies !== undefined) updateData.totalCopies = totalCopies;
  if (availableCopies !== undefined)
    updateData.availableCopies = availableCopies;

  const book = await updateBook(bookId, updateData);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(200).json({ message: "Book updated successfully", book });
}

async function deleteBook(req, res) {
  const { id } = req.query; // Obtener el bookId de los query params
  const { userId } = req;

  if (!id) {
    return res.status(400).json({ error: "No book id provided" });
  }

  const requester = await getUserById(userId);
  if (!requester || !requester.permissions.includes("disable_books")) {
    return res.status(403).json({ error: "Permission denied" });
  }

  try {
    // Convertir bookId a ObjectId
    const bookObjectId = new mongoose.Types.ObjectId(id);

    const book = await getBookById(bookObjectId, true);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (book.softDelete) {
      return res.status(400).json({ error: "Book is already disabled" });
    }

    await softDeleteBook(bookObjectId);

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(`Error converting bookId to ObjectId: ${error.message}`);
    return res.status(400).json({ error: "Invalid book id provided" });
  }
}

async function getBooksList(req, res) {
  const validParams = [
    "name",
    "genre",
    "publicationYear",
    "publisher",
    "author",
    "totalCopies",
    "availableCopies",
    "includeDisabled",
  ];
  const {
    name,
    genre,
    publicationYear,
    publisher,
    author,
    totalCopies,
    availableCopies,
    includeDisabled,
  } = req.query;
  const filter = {};

  // Verificar parámetros no válidos
  const invalidParams = Object.keys(req.query).filter(
    (param) => !validParams.includes(param)
  );
  if (invalidParams.length > 0) {
    return res
      .status(400)
      .json({
        error: `Invalid query parameters: ${invalidParams.join(
          ", "
        )}. Valid parameters are: ${validParams.join(", ")}`,
      });
  }

  if (name) filter.name = name;
  if (genre) filter.genre = genre;
  if (publicationYear) filter.publicationYear = publicationYear;
  if (publisher) filter.publisher = publisher;
  if (author) filter.author = author;
  if (totalCopies !== undefined) filter.totalCopies = totalCopies;
  if (availableCopies !== undefined) filter.availableCopies = availableCopies;
  if (includeDisabled !== "true") filter.softDelete = false;

  const books = await getBooks(filter);

  if (books.length === 0) {
    return res
      .status(404)
      .json({ error: "No books found matching the search criteria" });
  }

  res.status(200).json({ books });
}

async function getBookDetails(req, res) {
  const { id, includeDisabled } = req.query;

  if (!id) {
    return res.status(400).json({ error: "No book id provided" });
  }

  // Convertir bookId a ObjectId
  const bookObjectId = new mongoose.Types.ObjectId(id);

  const book = await getBookById(bookObjectId, includeDisabled === "true");

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(200).json({ book });
}


async function reserveaBook(req, res) {
    const { bookId, returnDate } = req.body;
    const { userId } = req;

    try {
        const { book, user } = await reserveBook(userId, bookId, returnDate);
        res.status(200).json({ message: 'Book reserved successfully', book, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function returnaBook(req, res) {
    const { reservationId } = req.body;

    try {
        const { book, user } = await returnBook(reservationId);
        res.status(200).json({ message: 'Book returned successfully', book, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
  createNewBook,
  updateBookData,
  deleteBook,
  getBooksList,
  getBookDetails,
  reserveaBook,
  returnaBook
};
