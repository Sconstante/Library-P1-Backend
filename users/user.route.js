const express = require("express");
const { tokenVerification } = require("../utils/authentication");
const {
  signUp,
  login,
  updateUserData,
  deleteUser,
  getUserData,
} = require("./user.controller");

const router = express.Router();

const handleRequest = (controller) => async (req, res) => {
  try {
    await controller(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.post("/register", handleRequest(signUp));
router.post("/login", handleRequest(login));
router.patch("/", tokenVerification, handleRequest(updateUserData));
router.delete("/:userId", tokenVerification, handleRequest(deleteUser));
router.get("/:userId", handleRequest(getUserData));

module.exports = router;
