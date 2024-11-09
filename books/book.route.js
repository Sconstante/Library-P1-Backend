const express = require("express");
const { tokenVerification } = require("../utils/authentication");
const {
  createNewBook,
  updateBookData,
  deleteBook,
  getBooksList,
  getBookDetails,
  reserveaBook,
  returnaBook,
} = require("./book.controller");

const router = express.Router();

const handleRequest = (controller) => async (req, res) => {
  try {
    await controller(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.post("/", tokenVerification, handleRequest(createNewBook));
router.get("/", handleRequest(getBooksList));
router.get("/details", handleRequest(getBookDetails));
router.patch("/", tokenVerification, handleRequest(updateBookData));
router.delete("/", tokenVerification, handleRequest(deleteBook));
router.post("/reserve", tokenVerification, handleRequest(reserveaBook));
router.post("/return", tokenVerification, handleRequest(returnaBook));

module.exports = router;
