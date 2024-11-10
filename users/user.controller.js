const { createUser } = require("./createUser.action");
const { softDeleteUser } = require("./deleteUser.action");
const { updateUser } = require("./updateUser.action");
const { getUser, getUserById } = require("./readUser.action");
const { createToken } = require("../utils/authentication");
const argon2 = require("argon2");

async function signUp(req, res) {
  const { name, lastname, email, password, permissions } = req.body;

  if (!name || !lastname || !email || !password) {
    return res.status(400).json({ error: "Incomplete data" });
  }

  try {
    const hashedPassword = await argon2.hash(password);
    const newUser = await createUser({
      name,
      lastname,
      email,
      password: hashedPassword,
      permissions,
    });
    const token = await createToken({ userId: newUser._id });

    res
      .status(200)
      .json({ authorization: token, message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Incomplete data" });
  }

  const user = await getUser(email);

  if (!user) {
    return res.status(404).json({ error: "Invalid credentials" });
  }

  const validPassword = await argon2.verify(user.password, password);

  if (!validPassword) {
    return res.status(404).json({ error: "Invalid credentials" });
  }

  const token = await createToken({ userId: user._id });
  res
    .status(200)
    .json({ authorization: token, message: "User login successfully" });
}

async function updateUserData(req, res) {
  const { name, lastname, email, password } = req.body;
  const { userId: requesterId } = req;
  const { email: userEmail } = req.query; // Correo del usuario a modificar

  if (!requesterId) {
    return res.status(400).json({ error: "No user id provided" });
  }

  const requester = await getUserById(requesterId);
  if (!requester) {
    return res.status(403).json({ error: "Invalid authentication token" });
  }

  const userToUpdate = await getUser(userEmail);
  if (!userToUpdate) {
    return res.status(404).json({ error: "User doesn't exist" });
  }


  // Permitir que un usuario se modifique a sí mismo sin verificar permisos
  if (
    requesterId !== userToUpdate._id.toString() &&
    !requester.permissions.includes("update_users")
  ) {
    return res.status(403).json({ error: "Permission denied" });
  }


  // Verificar si el nuevo correo electrónico ya existe
  if (email && email !== userToUpdate.email) {
    const existingUser = await getUser(email, includeDisabled = true);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
      
    }
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (lastname) updateData.lastname = lastname;
  if (email) updateData.email = email;
  if (password) updateData.password = await argon2.hash(password);

  const user = await updateUser(userToUpdate._id, updateData);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({ message: "User updated successfully", user });
}

async function deleteUser(req, res) {
  const { userId: requesterId } = req;
  const { userId } = req.params; // ID del usuario a inhabilitar
  if (!requesterId) {
    return res.status(400).json({ error: "Invalid authentication token" });
  }
  try {
    const requester = await getUserById(requesterId);
    const userToDisable = await getUserById(userId, includeDisabled = true);
    if (!userToDisable) {
      return res.status(401).json({ error: "User to disable doesn't exist" });
    }
    if (
      !requester ||
      (requesterId !== userToDisable._id.toString() &&
        !requester.permissions.includes("disable_users"))
    ) {
      return res.status(403).json({ error: "Permission denied" });
    }
    if (userToDisable.softDelete) {
      return res.status(400).json({ error: "User is already disabled" });
    }
    await softDeleteUser(userToDisable._id);
    res.status(200).json({ message: "User disabled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserData(req, res) {
  const { userId } = req.params;
  const { includeDisabled } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "No user id provided" });
  }

  const user = await getUserById(userId, includeDisabled === 'true');

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
}

module.exports = {
  signUp,
  login,
  updateUserData,
  deleteUser,
  getUserData,
};
