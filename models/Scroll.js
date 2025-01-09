const mongoose = require("mongoose");

const scrollSchema = new mongoose.Schema({
  page: String,
  userId: String,
  scrollPercentage: Number,
  timestamp: { type: Date, default: Date.now },
});

const Scroll = mongoose.model("Scroll", scrollSchema);
module.exports = Scroll;
