const express = require("express");
require("dotenv").config();
const { connectMongoDb } = require("./connection");
const { user } = require("./routes/user.route");
const app = express();
const PORT = process.env.PORT ?? 9000;
app.listen(PORT, () => console.log(`server is live at port ${PORT}`));
connectMongoDb(process.env.MONGODBURL).then(() =>
  console.log("MongoDB connected"),
);
app.use(express.json());
app.use("/user", user);
