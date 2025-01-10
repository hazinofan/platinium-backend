const jwt = require("jsonwebtoken");
require("dotenv").config();

// Admin Credentials from .env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASS;
const JWT_SECRET = process.env.JWT_SECRET;

// Admin Login Function
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Check if credentials match
  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ message: "Unauthorized: Invalid email" });
  }

  // Verify password with bcrypt
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized: Invalid password" });
  }

  // Generate JWT Token
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "2h" });

  // Send token as HTTP-only cookie
  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
  });

  res.json({ message: "Login successful", token });
};

// Admin Logout Function
exports.logoutAdmin = (req, res) => {
  res.clearCookie("admin_token");
  res.json({ message: "Logout successful" });
};
