const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  visits: Number,
  visitDetails: Array,
  clicks: Number,
  clickDetails: Array,
  buttonClicks: Array,
  referrals: Array,
  visitorCountries: Array,
}, { timestamps: true });

module.exports = mongoose.model("Report", ReportSchema);
