const BookModel = require("./book.model");
const UserModel = require("../users/user.model");
const mongoose = require("mongoose");

/**
 * Función para devolver un libro reservado.
 * @param {string} reservationId - ID de la reserva.
 * @returns {Object} - Objeto con los detalles del libro y del usuario.
 * @throws {Error} - Si el libro, el usuario o la reserva no se encuentran.
 */
async function returnBook(userId, reservationId) {
  // Verificar si el ID de la reserva es válido
  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    throw new Error("Reservation not found");
  }

  // Buscar el libro que contiene la reserva
  const book = await BookModel.findOne({ "reservations._id": reservationId });
  // Buscar el usuario que contiene la reserva
  const user = await UserModel.findOne({
    "reservations._id": reservationId,
    _id: userId,
  });

  //verificar si la reserva existe
  if (!book || !user) {
    throw new Error("Reservation not found");
  }

  // Encontrar la reserva específica en el libro
  const bookReservation = book.reservations.find(
    (reservation) => reservation._id.toString() === reservationId
  );
  // Encontrar la reserva específica en el usuario
  const userReservation = user.reservations.find(
    (reservation) => reservation._id.toString() === reservationId
  );

  // Verificar si la reserva fue encontrada tanto en el libro como en el usuario
  if (!bookReservation || !userReservation) {
    throw new Error("Reservation not found");
  }

  // Verificar si la reserva ya ha sido devuelta
  if (bookReservation.returned || userReservation.returned) {
    throw new Error("This reservation has already been returned");
  }

  // Marcar la reserva como devuelta
  bookReservation.returned = true;
  userReservation.returned = true;

  // Actualizar la fecha de devolución de la reserva en el libro y en el usuario
  bookReservation.returnDate = new Date();
  userReservation.returnDate = new Date();
  // Incrementar el número de copias disponibles del libro
  book.availableCopies += 1;

  // Guardar los cambios en el libro y en el usuario
  await book.save();
  await user.save();

  // Devolver los detalles del libro y del usuario
  return { book, user };
}

module.exports = { returnBook };
