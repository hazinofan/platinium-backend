const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  ip: String,
  userId: String, // Unique User ID
  location: Object,
  userAgent: Object,
  referrer: String,
  page: String,
  timeSpent: Number,
  isReturning: Boolean, // True if the user visited before
  timestamp: { type: Date, default: Date.now },
});

const Visit = mongoose.model("Visit", visitSchema);
module.exports = Visit;
