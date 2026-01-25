const {
  uuid,
  text,
  pgTable,
  varchar,
  timestamp,
} = require("drizzle-orm/pg-core");

const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  password: text().notNull(),
  salt: text().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
const userSessionsTable = pgTable("user_sessions", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

module.exports = { usersTable, userSessionsTable };
