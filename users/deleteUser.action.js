const UserModel = require('./user.model');

async function softDeleteUser(userId) {
    const user = await UserModel.findById(userId);
    user.softDelete = true;
    await user.save();
    return user;
}

module.exports = { softDeleteUser};