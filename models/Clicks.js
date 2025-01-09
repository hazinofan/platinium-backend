const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
  page: String,
  userId: String,
  x: Number, // X-coordinate of the click
  y: Number, // Y-coordinate of the click
  timestamp: { type: Date, default: Date.now },
});

const Click = mongoose.model("Click", clickSchema);
module.exports = Click;
