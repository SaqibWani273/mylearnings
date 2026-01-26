const express = require("express");
require("dotenv").config();
const { connectMongoDb } = require("./connection");
const app = express();
const PORT = process.env.PORT ?? 9000;
connectMongoDb(process.env.MONGODBURL).then(() =>
  console.log("MongoDB connected"),
);
app.listen(PORT, () => console.log(`server is live at port ${PORT}`));
