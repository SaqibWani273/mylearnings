const express = require("express");
const { register, login } = require("../controller/user.controller");
const router = express.Router();

router.post("/register", register);
router.get("/login", login);
module.exports = { user: router };
