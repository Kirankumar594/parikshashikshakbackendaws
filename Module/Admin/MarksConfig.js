const mongoose = require("mongoose");

const marksConfigSchema = new mongoose.Schema(
  {
    authId: {
      type: String,
      required: true
    },
    examTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamType",
      required: true
    },
    className: {
      type: String,
      required: true
    },
    maxMarks: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { timestamps: true }
);

// Add index for better query performance
marksConfigSchema.index({ authId: 1 });
marksConfigSchema.index({ examTypeId: 1 });
marksConfigSchema.index({ className: 1 });
marksConfigSchema.index({ authId: 1, examTypeId: 1, className: 1 }, { unique: true }); // Prevent duplicate configs per admin

module.exports = mongoose.model("MarksConfig", marksConfigSchema);