const app = require("express");
const { eq } = require("drizzle-orm");
const authorsTable = require("../models/author.model");
const db = require("../src");
const booksTable = require("../models/book.model");
const router = app.Router();
router.get("/", async (req, res) => {
  const authors = await db.select().from(authorsTable);
  return res.json(authors);
});
router.get("/:id", async (req, res) => {
  try {
    const author = await db
      .select()
      .from(authorsTable)
      .where(eq(authorsTable.id, req.params.id));
    return res.json(author);
  } catch (_) {
    return res.status(400).json({ error: "Author not found" });
  }
});
router.get("/:id/books", async (req, res) => {
  try {
    const books = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.authorId, req.params.id));
    return res.json(books);
  } catch (_) {
    return res.status(400).json({ error: "Books not found" });
  }
});
router.post("/addauthor", async (req, res) => {
  const [author] = await db
    .insert(authorsTable)
    .values({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    })
    .returning({ id: authorsTable.id });
  return res.json({ id: author.id });
});

module.exports = router;
