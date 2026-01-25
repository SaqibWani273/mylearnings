const { randomBytes, createHmac } = require("node:crypto");
const db = require("../src/db");
const { usersTable, userSessionsTable } = require("../src/db/schema");
const { eq } = require("drizzle-orm");

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ error: "email,name & password are required" });
    }
    const [emailExists] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (emailExists) {
      return res.status(400).json({ message: `email ${email} already exists` });
    }
    const salt = randomBytes(256).toString("hex");
    const hashedPw = createHmac("sha256", salt).update(password).digest("hex");
    const [user] = await db
      .insert(usersTable)
      .values({
        name,
        password: hashedPw,
        salt,
        email,
      })
      .returning({
        id: usersTable.id,
      });
    return res
      .status(201)
      .json({ message: "User registered successfully", id: user.id });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.body;
  if (id) {
    return res
      .status(201)
      .json({ message: `user with id ${id} deleted successfully` });
  }
  await db.delete(usersTable);
  return res.status(201).json("Deleted all users");
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email & password are required" });
  }
  const [user] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      password: usersTable.password,
      salt: usersTable.salt,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (!user) {
    return res
      .status(400)
      .json({ message: `User with email ${email} not found` });
  }
  const passwordHash = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");
  if (user.password !== passwordHash) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const [userSession] = await db
    .insert(userSessionsTable)
    .values({ userId: user.id })
    .returning({
      id: userSessionsTable.id,
    });
  return res.status(200).json({
    message: "Login successful",
    userId: `${user.id}`,
    sessionId: `${userSession.id}`,
  });
};
const profile = async (req, res) => {
  //   const sessionId = req.headers["session-id"];
  //   if (!sessionId) {
  //     return res.status(400).json({ message: "session-id header is required" });
  //   }
  //   const [data] = await db
  //     .select({
  //       id: usersTable.id,
  //       name: usersTable.name,
  //       email: usersTable.email,
  //     })
  //     .from(userSessionsTable)
  //     /*
  //     Rule of thumb

  // Auth → INNER JOIN

  // Optional relations → LEFT JOIN

  // RIGHT JOIN → almost never needed in APIs
  //     */
  //     .innerJoin(usersTable, eq(userSessionsTable.userId, usersTable.id))

  //     .where(eq(userSessionsTable.id, sessionId));
  //   if (!data) {
  //     return res.status(400).json({ message: "Invalid session-id" });
  //   }
  //   return res.status(200).json({ data: data });
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.status(200).json({ data: req.user });
};
const updateProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }
  const [updatedUser] = await db
    .update(usersTable)
    .set({ name })
    .where(eq(usersTable.id, req.user.id))
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    });
  return res
    .status(200)
    .json({ message: "Profile updated successfully", data: updatedUser });
};
module.exports = { register, deleteUser, login, profile, updateProfile };
// export default register;
