import express from "express";
const app = express();
const PORT = 8000;
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const emails = new Set();
const userDiary = {};
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("name, email and password are required");
  }
  if (emails.has(email)) {
    return res.status(400).send("Email already registered");
  }
  emails.add(email);
  const userToken = Date.now();
  userDiary[userToken] = { name, password, email };
  res.status(201).send("User registered successfully : " + userToken);
});
app.get("/me", (req, res) => {
  const { userToken } = req.body;
  if (!userToken) {
    return res.status(400).send("userToken is required");
  }
  //   if (!userDiary.has(userToken)) {
  if (!(userToken in userDiary)) {
    return res.status(404).send("User not found");
  }
  res.status(200).send(userDiary[userToken]);
});
