const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    userName: { type: String, required: true },
    reservationDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    returned: { type: Boolean, default: false },
  },
  { versionKey: false }
);

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    genre: { type: String, required: true },
    publicationYear: { type: Number, required: true },
    publisher: { type: String, required: true },
    author: { type: String, required: true },
    totalCopies: { type: Number, required: true },
    availableCopies: { type: Number, required: true },
    reservations: [reservationSchema],
    softDelete: { type: Boolean, default: false },
  },
  { versionKey: false }
);

const BookModel = mongoose.model("Book", bookSchema, "books");
module.exports = BookModel;
