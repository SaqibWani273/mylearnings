const {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
} = require("drizzle-orm/pg-core");

const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  firstname: varchar("first_name", { length: 255 }).notNull(),
  lastname: varchar("last_name", { length: 255 }),

  age: integer(),

  password: text().notNull(),
  salt: text().notNull(),

  email: varchar({ length: 255 }).notNull().unique(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
module.exports = {
  usersTable,
};
