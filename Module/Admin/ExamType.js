const mongoose = require("mongoose");

const examTypeSchema = new mongoose.Schema(
  {
    authId: {
      type: String,
      required: true
    },
    examName: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

// Add index for better query performance
examTypeSchema.index({ authId: 1 });
examTypeSchema.index({ examName: 1 });

module.exports = mongoose.model("ExamType", examTypeSchema);