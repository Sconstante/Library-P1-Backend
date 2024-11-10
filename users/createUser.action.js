const UserModel = require('./user.model');

async function createUser(userData) {
  try {
    // Verificar si el email ya está en uso
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Email is already in use");
    }

    const newUser = new UserModel(userData);
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
}

module.exports = { createUser };
