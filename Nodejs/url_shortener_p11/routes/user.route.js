const express = require("express");
const router = express.Router();
const db = require("../src/index");
const { usersTable } = require("../src/db/models");
const { registerRequestSchema } = require("../validations/request.validations");
const { hashedPassword } = require("../utils/hash.utils");
const { z } = require("zod");
const { createToken, existingUser } = require("../utils/user.utils");
router.post("/register", async (req, res) => {
  const validationResult = await registerRequestSchema.safeParseAsync(req.body);
  if (validationResult.error) {
    return res
      .status(400)
      .json({ error: z.treeifyError(validationResult.error) });
  }
  const { firstname, lastname, email, age, password } = validationResult.data;
  const [eUser] = await existingUser(email);
  if (eUser) {
    return res.status(409).json({ error: "User already exists" });
  }
  const { hashedpw, salt } = hashedPassword(password);

  const [insertedUser] = await db
    .insert(usersTable)
    .values({
      firstname,
      lastname,
      age,
      password: hashedpw,
      salt,
      email,
    })
    .returning({
      id: usersTable.id,
    });
  res
    .status(201)
    .json({ message: "User registered successfully", id: insertedUser.id });
});
router.post("/login", async (req, res) => {
  const validationResult = await registerRequestSchema.safeParseAsync(req.body);
  if (validationResult.error) {
    return res
      .status(400)
      .json({ error: z.treeifyError(validationResult.error) });
  }
  const { email, password } = validationResult.data;
  const [eUser] = await existingUser(email);
  if (!eUser) {
    return res.status(409).json({ error: "User not found" });
  }

  const { hashedpw, _ } = hashedPassword(password, eUser.salt);
  if (hashedpw !== eUser.password) {
    return res.status(400).json({ Error: "Incorrect password" });
  }
  const jwtToken = createToken(eUser);
  return res.status(200).json({
    message: " Login Successfull",
    token: jwtToken,
  });
});
module.exports = router;
