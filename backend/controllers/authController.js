// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User  from "../models/User.js";

export async function register(req, res) {
  const { email, password, name, phone } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ email, password_hash: hash, name, phone });
    res.json({ email: user.email, name: user.name, phone: user.phone });
  } catch (e) {
    res.status(400).json({ error: "Email in use" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { userId: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.json({ token, name: user.name });
}
