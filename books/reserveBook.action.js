const BookModel = require('./book.model');
const UserModel = require('../users/user.model');
const mongoose = require('mongoose');

/**
 * Función para reservar un libro.
 * @param {string} userId - ID del usuario que realiza la reserva.
 * @param {string} bookId - ID del libro a reservar.
 * @param {Date} [returnDate] - Fecha de devolución opcional.
 * @returns {Object} - Objeto con los detalles del libro y del usuario.
 * @throws {Error} - Si el libro, el usuario no se encuentran o no hay copias disponibles.
 */
async function reserveBook(userId, bookId, returnDate) {
    // Buscar el libro por su ID
    const book = await BookModel.findById(bookId);
    // Buscar el usuario por su ID
    const user = await UserModel.findById(userId);

    // Verificar si el libro fue encontrado
    if (!book) {
        throw new Error('Book not found');
    }

    // Verificar si el libro está inhabilitado
    if (book.softDelete) {
        throw new Error('Book is not available');
    }

    // Verificar si el usuario fue encontrado
    if (!user) {
        throw new Error('User not found');
    }

    // Verificar si hay copias disponibles del libro
    if (book.availableCopies <= 0) {
        throw new Error('No available copies');
    }

    // Establecer la fecha de reserva y la fecha de devolución por defecto (7 días después)
    const reservationDate = new Date();
    const defaultReturnDate = new Date(reservationDate);
    defaultReturnDate.setDate(reservationDate.getDate() + 7);

    // Generar un nuevo ID para la reserva
    const reservationId = new mongoose.Types.ObjectId();

    // Actualizar el número de copias disponibles del libro
    book.availableCopies -= 1;

    // Agregar la reserva al libro
    book.reservations.push({
        _id: reservationId,
        userId: user._id,
        userName: `${user.name} ${user.lastname}`,
        reservationDate: reservationDate,
        returnDate: returnDate || defaultReturnDate
    });

    // Agregar la reserva al usuario
    user.reservations.push({
        _id: reservationId,
        bookId: book._id,
        bookName: book.name,
        reservationDate: reservationDate,
        returnDate: returnDate || defaultReturnDate
    });

    // Guardar los cambios en el libro y en el usuario
    await book.save();
    await user.save();

    // Devolver los detalles del libro y del usuario
    return { book, user };
}

module.exports = { reserveBook };