const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    authId: {
      type: String,
      required: true
    },
    schoolName: {
      type: String,
      required: true,
      trim: true
    },
    schoolCode: {
      type: String,
      unique: true,
      sparse: true, // This allows multiple null values
      trim: true
    },
    board: {
      type: String,
      required: true,
      enum: ["CBSE", "STATE", "ICSE", "IB"]
    },
    medium: {
      type: String,
      required: true,
      enum: ["English", "Hindi", "Kannada", "Tamil", "Telugu"]
    }
  },
  { timestamps: true }
);

// Add index for better query performance
schoolSchema.index({ board: 1 });
schoolSchema.index({ authId: 1 });

module.exports = mongoose.model("School", schoolSchema);