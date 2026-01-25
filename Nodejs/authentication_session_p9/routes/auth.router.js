const express = require("express");

const router = express.Router();
const {
  register,
  deleteUser,
  login,
} = require("../controller/auth.controller");
router.post("/register", register);
router.delete("/delete", deleteUser);
router.get("/login", login);

module.exports = router;
