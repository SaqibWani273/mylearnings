const { UserModel } = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

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
  const user = await UserModel.insertOne({
    name,
    email,
    password: hashedPassword,
    salt,
  });
  return res
    .status(201)
    .json({ message: "User registered successfully", id: user._id });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "email & password are required" });
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: "User Not Found" });
  }
  const passwordHash = crypto
    .createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");
  if (user.password !== passwordHash) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "48h" },
  );
  return res.status(200).json({ message: "Login successful", token: token });
};
module.exports = { register, login };
