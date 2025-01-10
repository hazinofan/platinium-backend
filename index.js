require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Import Routes
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allow frontend requests with cookies
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Enable cookie parsing

// Connect to Database
connectDB();

// Routes
app.use("/api/auth", authRoutes); // Authentication Routes
app.use("/api", analyticsRoutes); // Analytics Routes

// Root Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
