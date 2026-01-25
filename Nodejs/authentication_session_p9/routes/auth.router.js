const express = require("express");

const router = express.Router();
const {
  register,
  deleteUser,
  login,
  profile,
  updateProfile,
} = require("../controller/auth.controller");
router.post("/register", register);
router.delete("/delete", deleteUser);
router.get("/login", login);
router.get("/profile", profile);
router.patch("/update", updateProfile);

module.exports = router;
