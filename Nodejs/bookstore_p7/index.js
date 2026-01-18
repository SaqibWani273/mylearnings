// https://expressjs.com/en/guide/using-middleware.html
require("dotenv/config");
const express = require("express");
const bookRouter = require("./routes/book.routes");
const authorRouter = require("./routes/author.routes");
const { logger } = require("./moddleware/logger");

const app = new express();
const port = "3000";
//middleware | json parser
app.use(express.json());
//middleware | text parser
// app.use(express.text());
//custom middleware
app.use(logger);
app.use("/book", bookRouter);
app.use("/author", authorRouter);
app.listen(port, () => console.log(`live at port ${port}`));
