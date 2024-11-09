# Library-P1-Backend

## Description / Descripción

EN: This project is a backend for a library management system. Provides functionalities for user authentication, book management, user management, book reservation and return.

ES: Este proyecto es un backend para un sistema de gestión de bibliotecas. Proporciona funcionalidades para la autenticación de usuarios, gestión de libros, gestión de usuarios, reserva y retorno de libros.

## Installation / Instalación

1. Clone the repository / Clonar el repositorio:

   ```bash
   git clone https://github.com/yourusername/Library-P1-Backend.git
   ```

2. Navigate to the project directory / Navegar al directorio del proyecto:

   ```bash
   cd Library-P1-Backend
   ```

3. Install dependencies / Instalar dependencias:
   ```bash
   npm install
   ```

## Configuration / Configuración

1. Create a `.env` file in the root directory and add the following environment variables / Crear un archivo `.env` en el directorio raíz y agregar las siguientes variables de entorno:
   ```properties
   DB_USER="your_db_user"
   DB_PASSWORD="your_db_password"
   JWT_KEY="your_jwt_key"
   ```

## Running the Project / Ejecutar el Proyecto

1. Start the server / Iniciar el servidor:

   ```bash
   node index.js
   ```

2. The server will run on port 3000 by default / El servidor se ejecutará en el puerto 3000 por defecto.

## API Endpoints / Puntos de API

### User Routes / Rutas de Usuario

- `POST /user/register` - Register a new user / Registrar un nuevo usuario
- `POST /user/login` - Login a user / Iniciar sesión de un usuario
- `PATCH /user` - Update user data (requires token) / Actualizar datos del usuario (requiere token)
- `DELETE /user` - Delete a user (requires token) / Eliminar un usuario (requiere token)
- `GET /user` - Get user data / Obtener datos del usuario

### Book Routes / Rutas de Libros

- `POST /book` - Create a new book (requires token) / Crear un nuevo libro (requiere token)
- `GET /book` - Get list of books / Obtener lista de libros
- `GET /book/details` - Get book details / Obtener detalles del libro
- `PATCH /book` - Update book data (requires token) / Actualizar datos del libro (requiere token)
- `DELETE /book` - Delete a book (requires token) / Eliminar un libro (requiere token)
- `POST /book/reserve` - Reserve a book (requires token) / Reservar un libro (requiere token)
- `POST /book/return` - Return a book (requires token) / Devolver un libro (requiere token)

## License / Licencia

This project is licensed under the MIT License / Este proyecto está licenciado bajo la Licencia MIT.
