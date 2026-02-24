const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  termId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Term',
    required: true
  },
  assessmentTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssessmentType',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResultMakerSubject',
    required: true
  },
  marks: {
    type: Number,
    required: true,
    min: 0
  },
  maxMarks: {
    type: Number,
    required: true,
    min: 1
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create unique index to prevent duplicate marks entry for same student, term, assessment, subject
marksSchema.index({ studentId: 1, termId: 1, assessmentTypeId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('Marks', marksSchema);
