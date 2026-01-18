// const { db } = require("./src/db");
// const { booksTable } = require("./models/book.model");

const db = require("../src/index");
const booksTable = require("../models/book.model");
const books = require("../tempdb/books");
const authorsTable = require("../models/author.model");
const { sql } = require("drizzle-orm");
const { eq, ilike } = require("drizzle-orm");

// exports.getAllBooks = (req, res) => res.json(books);
exports.getAllBooks = async (req, res) => {
  const queryp = req.query.search;
  var books;
  if (queryp != undefined) {
    books = await db
      .select()
      .from(booksTable)
      // .where(ilike(booksTable.description, `%${queryp}%`)); //normal search
      .where(
        sql`to_tsvector('english', ${booksTable.description}) @@ to_tsquery('english', ${queryp})`
      );

    return res.json(books);
    console.log(`books -> ${books.toString()}`);
    if (books.length === 0) {
      return res
        .status(404)
        .json({ error: "No book found with the search criteria" });
    }
  }

  books = await db.select().from(booksTable);

  return res.json(books);
};

exports.getBookById = async (req, res) => {
  const id = req.params.id;
  console.log("type of id ->" + typeof id);
  const [book] = await db //destructured as result is a list
    .select()
    .from(booksTable)
    .where(eq(booksTable.id, id))
    .leftJoin(authorsTable, eq(authorsTable.id, booksTable.authorId))
    .limit(1);
  // const book = await db.select().from(booksTable).where((table)=> eq(table.id, id));
  console.log("book = " + book);
  if (book === undefined) return res.json({ error: "book not found" });
  return res.json(book);
};
exports.addBook = async (req, res) => {
  console.log("inside addbook endpoint");
  console.log(`addbook req.body -> ${req.body}`);
  const { title, description, authorId } = req.body;
  if (!title || title == "" || !authorId || authorId == "")
    return res.status(400).end({ error: "title & authorId are required" });
  const [result] = await db
    .insert(booksTable)
    .values({
      title,
      description,
      authorId,
    })
    .returning({
      id: booksTable.id,
    }); //here result would be {id:"<book-id>"}
  console.log(req.headers);
  return res
    .status(201)
    .json({ message: "Book added Successfully", bookId: result.id });
};
exports.deleteBookById = async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db
      .delete(booksTable)
      .where(eq(booksTable.id, id))
      .returning({
        title: booksTable.title,
      });

    if (result.length === 0) {
      return res.status(404).json({ message: "No book found with id " + id });
    }

    return res
      .status(201)
      .json({ message: "Book Delete Successfully", bookTitle: result.title });
  } catch (_) {
    return res.status(500).json({
      message: `Book Not found.Enter proper id & try again`,
    });
  }
};
