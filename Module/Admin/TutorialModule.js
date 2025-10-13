const mongoose = require("mongoose");

const tutorialSchema = new mongoose.Schema({
  code: { type: String, required: true }, 
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String }, // New field for both videos and PDFs
  videoUrl: { type: String }, // Keep old field for backward compatibility
}, { timestamps: true });

module.exports = mongoose.model("Tutorial", tutorialSchema);
