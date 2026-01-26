const db = require("../src/db");
const {
  usersTable,
  userSessionsTable,
  userRoleEnum,
} = require("../src/db/schema");
const { eq } = require("drizzle-orm");
const { isUUID } = require("validator");

const getUsers = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    //return all users
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
      })
      .from(usersTable);
    return res.status(200).json(users);
  }
  if (!isUUID(userId)) {
    return res.status(400).json({
      error: "Invalid USerID",
    });
  }
  //return a specific user
  const [user] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.status(200).json(user);
};

module.exports = {
  getUsers,
};
