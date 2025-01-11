const express = require("express");
const { loginAdmin, logoutAdmin, checkAuthStatus } = require("../controllers/authController");
const { verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin Login Route
router.post("/login", loginAdmin);

// Admin Logout Route
router.post("/logout", logoutAdmin);

router.get("/auth/status", checkAuthStatus);

// Example Protected Route (Requires Authentication)
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard!" });
});

module.exports = router;
