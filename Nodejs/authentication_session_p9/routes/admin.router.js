const express = require("express");

const router = express.Router();
const { getUsers } = require("../controller/admin.cntroller");
const {
  ensureAdminMiddleware,
  ensureRoleMiddleware,
} = require("../middleware/authmiddleware");

// router.get("/users", ensureAdminMiddleware, getUsers);
// router.get("/users/:userId", ensureAdminMiddleware, getUsers);
router.get("/users", ensureRoleMiddleware("ADMIN"), getUsers);
router.get("/users/:userId", ensureRoleMiddleware("ADMIN"), getUsers);
module.exports = router;
