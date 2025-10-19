// https://expressjs.com/en/guide/using-middleware.html

const express = require("express");
const fs = require("node:fs");
const app = new express();
const port = "8080";
//middleware | json parser
app.use(express.json());
//middleware | text parser
app.use(express.text());
//custom middleware
app.use(middleWare1);
app.use(logger);
app.listen(port, () => console.log(`live at port ${port}`));
const books = [
  {
    id: 1,
    bookname: "Java, The Complete Guide",
  },
  {
    id: 2,
    bookname: "Flutter Cookbook",
  },
];
app.get("/books", (req, res) => res.json(books));
app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ error: "enter valid id" });
  }
  console.log("type of id ->" + typeof id);
  const book = books.find((b) => b.id == id);
  console.log("book = " + book);
  if (book === undefined) return res.json({ error: "book not found" });
  return res.json(book);
});
app.post("/addbook", (req, res) => {
  const { bookname } = req.body;
  if (!bookname || bookname == "")
    return res.status(400).end({ error: "bookname is required" });
  books.push({ id: books.length + 1, bookname: bookname });
  console.log(req.headers);
  return res.status(201).end("Book added Succesfully with id " + books.length);
});
app.delete("/deletebook/:id", (req, res) => {
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
});
function logger(req, res, next) {
  const logData = `\n${Date.now()} : ${req.method} | ${req.url}`;
  fs.appendFileSync("log.txt", logData, "utf-8");
  next();
}
function middleWare1(req, res, next) {
  //   return res.status(200).json("Returned from middleware1");
  next();
}
