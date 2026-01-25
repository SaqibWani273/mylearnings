const db = require("../src/db");
const { usersTable, userSessionsTable } = require("../src/db/schema");
const { eq } = require("drizzle-orm");

const authMiddleware = async (req, res, next) => {
  const sessionId = req.headers["session-id"];
  if (!sessionId) {
    next();
    //    return res.status(400).json({ message: "session-id header is required" });
  }
  const [data] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(userSessionsTable)
    /*
    Rule of thumb

Auth → INNER JOIN

Optional relations → LEFT JOIN

RIGHT JOIN → almost never needed in APIs
    */
    .innerJoin(usersTable, eq(userSessionsTable.userId, usersTable.id))

    .where(eq(userSessionsTable.id, sessionId));
  if (!data) {
    next();
    // return res.status(400).json({ message: "Invalid session-id" });
  }
  req.user = data;
  next();
  //   return res.status(200).json({ data: data });
};
module.exports = { authMiddleware };
