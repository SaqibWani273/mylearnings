const express = require("express");
const app = express();
const authRouter = require("./routes/auth.router");
// const PORT = process.env.PORT ?? 8000;
const PORT = 8000;
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Welcome to the Authentication Session ");
});
app.use("/auth", authRouter);
