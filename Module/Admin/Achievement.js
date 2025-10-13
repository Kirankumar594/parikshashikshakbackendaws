const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true
    },
    examType: {
      type: String,
      required: true,
      enum: ["SA1", "SA2", "FA1", "FA2", "FA3", "FA4", "Final"]
    },
    subject: {
      type: String,
      required: true,
      enum: ["English", "Mathematics", "Science", "Social Science", "Hindi", "Kannada"]
    },
    class: {
      type: String,
      required: true,
      enum: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"]
    },
    marks: {
      obtainedMarks: {
        type: Number,
        required: true,
        min: 0
      },
      totalMarks: {
        type: Number,
        required: true,
        min: 1
      },
      grade: {
        type: String,
        required: true,
        enum: ["A", "B", "C", "D", "F"]
      },
      percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      }
    },
    attendance: {
      present: {
        type: Number,
        required: true,
        min: 0
      },
      total: {
        type: Number,
        required: true,
        min: 1
      },
      percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      }
    },
    remarks: {
      type: String,
      trim: true
    },
    teacherName: {
      type: String,
      required: true,
      trim: true
    },
    examDate: {
      type: Date,
      required: true
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

// Add validation to ensure obtained marks is not greater than total marks
achievementSchema.pre('save', function(next) {
  if (this.marks.obtainedMarks > this.marks.totalMarks) {
    return next(new Error('Obtained marks cannot be greater than total marks'));
  }
  
  if (this.attendance.present > this.attendance.total) {
    return next(new Error('Present days cannot be greater than total days'));
  }
  
  next();
});

// Add compound index to ensure uniqueness (sparse to handle null values)
achievementSchema.index({ rollNumber: 1, examType: 1, subject: 1, class: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Achievement", achievementSchema);

