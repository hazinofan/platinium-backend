const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true, default: "Admin" },
  createdAt: { type: Date, default: Date.now },
  published: { type: Boolean, default: true }
});

module.exports = mongoose.model('Blog', BlogSchema);