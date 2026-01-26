const {
  uuid,
  text,
  pgTable,
  varchar,
  timestamp,
  pgEnum,
} = require("drizzle-orm/pg-core");

const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN"]);
const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  password: text().notNull(),
  salt: text().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: userRoleEnum("role").notNull().default("USER"),
});
const userSessionsTable = pgTable("user_sessions", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

module.exports = { usersTable, userSessionsTable, userRoleEnum };
