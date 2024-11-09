const UserModel = require('./user.model');

async function updateUser(userId, updateData) {
    const user = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    return user;
}

module.exports = { updateUser };