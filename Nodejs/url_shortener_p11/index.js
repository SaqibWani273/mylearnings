const express = require("express");
const { authenticationMiddleware } = require("./middleware/auth.middleware");
const app = express();
const port = process.env.port ?? 2000;
app.use(express.json());
app.use(authenticationMiddleware);
const userRouter = require("./routes/user.route");
const urlRouter = require("./routes/url.route");
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/user", userRouter);
app.use("/url", urlRouter);
