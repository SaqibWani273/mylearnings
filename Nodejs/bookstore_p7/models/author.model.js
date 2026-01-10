const { pgTable, uuid, varchar } = require("drizzle-orm/pg-core");
const authorsTable = pgTable("authors", {
  id: uuid().primaryKey().defaultRandom(),
  firstname: varchar({ length: 255 }).notNull(),
  lastname: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
});
module.exports = authorsTable;
