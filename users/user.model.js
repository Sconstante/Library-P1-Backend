const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "books" },
    bookName: { type: String, required: true },
    reservationDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
  },
  { versionKey: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permissions: { type: [String], default: [] }, // e.g., ['create_books', 'update_users', 'update_books', 'disable_users', 'disable_books']
    reservations: [reservationSchema],
    softDelete: { type: Boolean, default: false },
  },
  { versionKey: false }
);

const UserModel = mongoose.model("User", userSchema, "users");
module.exports = UserModel;
