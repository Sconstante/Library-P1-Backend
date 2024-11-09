const UserModel = require('./user.model');

async function createUser(userData) {
    try {
        const newUser = new UserModel(userData);
        await newUser.save();
        return newUser;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
}

module.exports = { createUser };