const UserModel = require("./user.model");

async function getUser(email, includeDisabled = false) {
  const filter = { email };
  if (!includeDisabled) {
    filter.softDelete = false;
  }

  const user = await UserModel.findOne(filter);
  return user;
}

async function getUserById(userId, includeDisabled = false) {
  const filter = { _id: userId };
  if (!includeDisabled) {
    filter.softDelete = false;
  }

  const user = await UserModel.findOne(filter);
  return user;
}

module.exports = { getUser, getUserById };
