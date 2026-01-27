const express = require("express");
const app = express();
const port = process.env.port ?? 2000;
app.use(express.json());
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});
