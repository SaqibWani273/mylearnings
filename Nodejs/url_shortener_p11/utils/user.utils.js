const db = require("../src/index");
const { usersTable } = require("../src/db/models/index");
const jwt = require("jsonwebtoken");
const { eq } = require("drizzle-orm");

const existingUser = async (email) => {
  return await db

    .select({
      id: usersTable.id,
      password: usersTable.password,
      salt: usersTable.salt,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));
};
const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      age: user.age,
    },
    process.env.JWT_SECRET,
  );
};
const validateToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (_) {
    return null;
  }
};
module.exports = {
  existingUser,
  createToken,
  validateToken,
};
