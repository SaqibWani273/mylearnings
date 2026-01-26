const { UserModel } = require("../models/user.model");
const crypto = require("crypto");

const register = async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .send({ message: "User already exists, please login" });
  }
  const salt = crypto.randomBytes(256).toString("hex");
  const hashedPassword = crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  const [user] = await UserModel.insertOne({
    name,
    email,
    password: hashedPassword,
    salt,
  }).returning({
    id: UserModel._id,
  });
  return res
    .status(201)
    .json({ message: "User registered successfully", id: user.id });
};
const login = (req, res) => {
  res.send("User Login");
};
module.exports = { register, login };
