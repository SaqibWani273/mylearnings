const {
  integer,
  pgTable,
  varchar,
  uuid,
  text,
  timestamp,
} = require("drizzle-orm/pg-core");

const { usersTable } = require("./user");
// const { timeStamp } = require("console");
const urlsTable = pgTable("urls", {
  id: uuid().primaryKey().defaultRandom(),
  shortUrl: varchar({ length: 155 }).notNull().unique(),
  targetUrl: text().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});
module.exports = urlsTable;
