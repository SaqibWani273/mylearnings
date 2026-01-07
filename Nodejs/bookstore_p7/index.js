// https://expressjs.com/en/guide/using-middleware.html

const express = require("express");
const bookRouter = require("./routes/book.routes");
const { logger } = require("./moddleware/logger");

const app = new express();
const port = "8080";
//middleware | json parser
app.use(express.json());
//middleware | text parser
// app.use(express.text());
//custom middleware
app.use(logger);
app.use("/book", bookRouter);
app.listen(port, () => console.log(`live at port ${port}`));
