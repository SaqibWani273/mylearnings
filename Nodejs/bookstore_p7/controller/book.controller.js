const { books } = require("../tempdb/books");

exports.getAllBooks = (req, res) => res.json(books);
exports.getBookById = (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ error: "enter valid id" });
  }
  console.log("type of id ->" + typeof id);
  const book = books.find((b) => b.id == id);
  console.log("book = " + book);
  if (book === undefined) return res.json({ error: "book not found" });
  return res.json(book);
};
exports.addBook = (req, res) => {
  const { bookname } = req.body;
  if (!bookname || bookname == "")
    return res.status(400).end({ error: "bookname is required" });
  books.push({ id: books.length + 1, bookname: bookname });
  console.log(req.headers);
  return res.status(201).end("Book added Succesfully with id " + books.length);
};
exports.deleteBookById = (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ error: "Enter a valid number" });
  }
  const book = books.find((b) => b.id == id);
  console.log(` bidtodelete : ${book}`);
  if (book == undefined) {
    return res.status(404).json({ message: "No book found with id " });
  }
  books.splice(id - 1, 1);
  return res
    .status(201)
    .json({ message: "Book Delete Successfully", books: books });
};
