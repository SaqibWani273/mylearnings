const { usersTable } = require("./src/db/schema");
const { db } = require("./src/index");
require("dotenv/config");
// dotenv.config();

async function getAllUsers() {
  const users = await db.select().from(usersTable);
  console.log(`users in userTable : `, users);
  return users;
}
async function createUser({ id, name, email }) {
  await db.insert(usersTable).values({ id, name, email });
}
// createUser({ id: 1, name: "Saqib", email: "saqibwani123@gmail.com" });
// createUser({ id: 2, name: "Suhail", email: "suhai123@gmail.com" });
// createUser({ id: 3, name: "Faisal", email: "faisal123@gmail.com" });
getAllUsers();
