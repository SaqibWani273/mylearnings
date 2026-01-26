const express = require("express");
const { ensureAuthMiddleware } = require("../middleware/authmiddleware");

const router = express.Router();
const {
  register,
  deleteUser,
  login,
  profile,
  updateProfile,
} = require("../controller/auth.controller");
router.post("/register", register);
router.delete("/delete", ensureAuthMiddleware, deleteUser);
router.get("/login", login);
router.get("/profile", ensureAuthMiddleware, profile);
router.patch("/update", ensureAuthMiddleware, updateProfile);

module.exports = router;
