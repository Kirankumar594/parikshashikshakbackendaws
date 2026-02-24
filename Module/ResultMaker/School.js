const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  schoolLogo: {
    type: String,
    default: null
  },
  principalSignature: {
    type: String,
    default: null
  },
  schoolName: {
    type: String,
    required: true
  },
  schoolAddress: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  affiliationNumber: {
    type: String,
    default: ''
  },
  educationalBoard: {
    type: String,
    required: true
  },
  schoolWebsite: {
    type: String,
    default: ''
  },
  selectedSession: {
    type: String,
    default: '2025-2026'
  },
  schoolCode: {
    type: String,
    default: null,
    sparse: true  // Allows multiple null values
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
    
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

module.exports = mongoose.model('School', schoolSchema);
