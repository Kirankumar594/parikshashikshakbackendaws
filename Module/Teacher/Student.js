const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true
    },
    className: {
      type: String,
      required: true,
      trim: true
    },
    academicYear: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    fatherName: {
      type: String,
      required: true,
      trim: true
    },
    motherName: {
      type: String,
      trim: true
    },
    dob: {
      type: Date
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    registerNumber: {
      type: String,
      required: true,
      trim: true
    },
    parentContact: {
      type: String,
      trim: true
    },
    aadhaarNumber: {
      type: String,
      trim: true
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },
    caste: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST"]
    },
    height: {
      type: Number,
      min: 0
    },
    weight: {
      type: Number,
      min: 0
    },
    address: {
      state: {
        type: String,
        trim: true
      },
      district: {
        type: String,
        trim: true
      },
      taluk: {
        type: String,
        trim: true
      },
      village: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      pincode: {
        type: String,
        trim: true
      }
    },
    subjects: {
      firstLanguage: {
        FA1: { type: Number, min: 0, max: 100, default: 0 },
        FA2: { type: Number, min: 0, max: 100, default: 0 },
        SA1: { type: Number, min: 0, max: 100, default: 0 },
        FA3: { type: Number, min: 0, max: 100, default: 0 },
        FA4: { type: Number, min: 0, max: 100, default: 0 },
        SA2: { type: Number, min: 0, max: 100, default: 0 }
      },
      secondLanguage: {
        FA1: { type: Number, min: 0, max: 100, default: 0 },
        FA2: { type: Number, min: 0, max: 100, default: 0 },
        SA1: { type: Number, min: 0, max: 100, default: 0 },
        FA3: { type: Number, min: 0, max: 100, default: 0 },
        FA4: { type: Number, min: 0, max: 100, default: 0 },
        SA2: { type: Number, min: 0, max: 100, default: 0 }
      },
      mathematics: {
        FA1: { type: Number, min: 0, max: 100, default: 0 },
        FA2: { type: Number, min: 0, max: 100, default: 0 },
        SA1: { type: Number, min: 0, max: 100, default: 0 },
        FA3: { type: Number, min: 0, max: 100, default: 0 },
        FA4: { type: Number, min: 0, max: 100, default: 0 },
        SA2: { type: Number, min: 0, max: 100, default: 0 }
      },
      science: {
        FA1: { type: Number, min: 0, max: 100, default: 0 },
        FA2: { type: Number, min: 0, max: 100, default: 0 },
        SA1: { type: Number, min: 0, max: 100, default: 0 },
        FA3: { type: Number, min: 0, max: 100, default: 0 },
        FA4: { type: Number, min: 0, max: 100, default: 0 },
        SA2: { type: Number, min: 0, max: 100, default: 0 }
      },
      socialScience: {
        FA1: { type: Number, min: 0, max: 100, default: 0 },
        FA2: { type: Number, min: 0, max: 100, default: 0 },
        SA1: { type: Number, min: 0, max: 100, default: 0 },
        FA3: { type: Number, min: 0, max: 100, default: 0 },
        FA4: { type: Number, min: 0, max: 100, default: 0 },
        SA2: { type: Number, min: 0, max: 100, default: 0 }
      },
      environmentScience: {
        FA1: { type: Number, min: 0, max: 100, default: 0 },
        FA2: { type: Number, min: 0, max: 100, default: 0 },
        SA1: { type: Number, min: 0, max: 100, default: 0 },
        FA3: { type: Number, min: 0, max: 100, default: 0 },
        FA4: { type: Number, min: 0, max: 100, default: 0 },
        SA2: { type: Number, min: 0, max: 100, default: 0 }
      }
    },
    coScholastic: {
      physicalEducation: {
        type: String,
        trim: true
      },
      art: {
        type: String,
        trim: true
      },
      music: {
        type: String,
        trim: true
      },
      supw: {
        type: String,
        trim: true
      }
    },
    attendance: {
      semester1: {
        attended: { type: Number, min: 0, default: 0 },
        workingDays: { type: Number, min: 0, default: 0 }
      },
      semester2: {
        attended: { type: Number, min: 0, default: 0 },
        workingDays: { type: Number, min: 0, default: 0 }
      }
    },
    specialAchievements: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    }
  },
  { timestamps: true }
);

// Add compound index to ensure uniqueness
studentSchema.index({ registerNumber: 1, schoolId: 1 }, { unique: true });

// Add index for better query performance
studentSchema.index({ schoolId: 1 });
studentSchema.index({ className: 1 });
studentSchema.index({ academicYear: 1 });
studentSchema.index({ name: 1 });
studentSchema.index({ registerNumber: 1 });

module.exports = mongoose.model("Student", studentSchema);

