const { pgTable, uuid, varchar, text, index } = require("drizzle-orm/pg-core");
const { sql } = require("drizzle-orm");
const authorsTable = require("./author.model");
const booksTable = pgTable(
  "books",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: varchar({ length: 100 }).notNull(),
    description: text(),
    authorId: uuid()
      .references(() => authorsTable.id)
      .notNull(),
  },
  (table) => [
    //for Exact matches
    // index("description_idx").on(table.description),
    //for Searching words inside text | full text search index
    index("title_search_index").using(
      "gin",
      sql`to_tsvector('english', ${table.description})`
    ),
  ]
);

module.exports = booksTable;
