const mongoose = require("mongoose");

const resultConfigSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true
    },
    className: {
      type: String,
      required: true,
      enum: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"]
    },
    academicYear: {
      type: String,
      required: true,
      trim: true
    },
    examTypes: {
      FA1: {
        weightage: { type: Number, required: true, min: 0, max: 100 },
        maxMarks: { type: Number, required: true, min: 1 }
      },
      FA2: {
        weightage: { type: Number, required: true, min: 0, max: 100 },
        maxMarks: { type: Number, required: true, min: 1 }
      },
      SA1: {
        weightage: { type: Number, required: true, min: 0, max: 100 },
        maxMarks: { type: Number, required: true, min: 1 }
      },
      FA3: {
        weightage: { type: Number, required: true, min: 0, max: 100 },
        maxMarks: { type: Number, required: true, min: 1 }
      },
      FA4: {
        weightage: { type: Number, required: true, min: 0, max: 100 },
        maxMarks: { type: Number, required: true, min: 1 }
      },
      SA2: {
        weightage: { type: Number, required: true, min: 0, max: 100 },
        maxMarks: { type: Number, required: true, min: 1 }
      }
    },
    subjects: {
      firstLanguage: {
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
      },
      secondLanguage: {
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
      },
      mathematics: {
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
      },
      science: {
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
      },
      socialScience: {
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
      },
      environmentScience: {
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true }
      }
    },
    gradingSystem: {
      A: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
      },
      B: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
      },
      C: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
      },
      D: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
      },
      F: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
      }
    },
    attendance: {
      minimumPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      semester1WorkingDays: {
        type: Number,
        required: true,
        min: 1
      },
      semester2WorkingDays: {
        type: Number,
        required: true,
        min: 1
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    }
  },
  { timestamps: true }
);

// Add validation to ensure weightage totals are correct
resultConfigSchema.pre('save', function(next) {
  const examTypes = this.examTypes;
  const semester1Total = examTypes.FA1.weightage + examTypes.FA2.weightage + examTypes.SA1.weightage;
  const semester2Total = examTypes.FA3.weightage + examTypes.FA4.weightage + examTypes.SA2.weightage;
  
  if (semester1Total !== 100 || semester2Total !== 100) {
    return next(new Error('Total weightage for each semester must be 100%'));
  }
  
  next();
});

// Add compound index to ensure uniqueness
resultConfigSchema.index({ schoolId: 1, className: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model("ResultConfig", resultConfigSchema);

