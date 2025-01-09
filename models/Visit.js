const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  ip: String,
  userId: String,
  location: Object, // Stores country, region, and city data
  userAgent: Object,
  referrer: String,
  page: String,
  timeSpent: Number,
  isReturning: Boolean,
  timestamp: { type: Date, default: Date.now },
});

const Visit = mongoose.model("Visit", visitSchema);
module.exports = Visit;
