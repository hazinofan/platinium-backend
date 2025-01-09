const mongoose = require("mongoose");

const buttonClickSchema = new mongoose.Schema({
  buttonId: String, // Unique ID of the button
  clicks: { type: Number, default: 0 }, // Total clicks
  date: { type: Date, default: Date.now }, // Tracking daily clicks
});

const ButtonClick = mongoose.model("ButtonClick", buttonClickSchema);
module.exports = ButtonClick;
