const express = require("express");
const router = express.Router();
const { Authentication, Authorization } = require("../../Authentication/auth");
const {
  getStudents,
  saveStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getAchievementStats,
  bulkImportStudents
} = require("../../Controller/Admin/AchievementCard");

// Get all students
router.get("/getStudents/:authId", Authentication, Authorization, getStudents);

// Get student by ID
router.get("/getStudentById/:studentId/:authId", Authentication, Authorization, getStudentById);

// Get achievement statistics
router.get("/getAchievementStats/:authId", Authentication, Authorization, getAchievementStats);

// Save student data
router.post("/saveStudent/:authId", Authentication, Authorization, saveStudent);

// Update student data
router.put("/updateStudent/:studentId/:authId", Authentication, Authorization, updateStudent);

// Delete student data
router.delete("/deleteStudent/:studentId/:authId", Authentication, Authorization, deleteStudent);

// Bulk import students
router.post("/bulkImportStudents/:authId", Authentication, Authorization, bulkImportStudents);

module.exports = router;

