const express = require("express");
const router = express.Router();
const { Authentication, Authorization } = require("../../Authentication/auth");
const studentManagementController = require("../../Controller/Teacher/StudentManagement");

// Get all students
router.get("/getStudents/:authId", Authentication, Authorization, studentManagementController.getStudents);

// Get student by ID
router.get("/getStudentById/:studentId/:authId", Authentication, Authorization, studentManagementController.getStudentById);

// Save new student
router.post("/saveStudent/:authId", Authentication, Authorization, studentManagementController.saveStudent);

// Update student
router.put("/updateStudent/:studentId/:authId", Authentication, Authorization, studentManagementController.updateStudent);

// Delete student
router.delete("/deleteStudent/:studentId/:authId", Authentication, Authorization, studentManagementController.deleteStudent);

// Get student statistics
router.get("/getStudentStats/:authId", Authentication, Authorization, studentManagementController.getStudentStats);

// Bulk update marks
router.put("/bulkUpdateMarks/:authId", Authentication, Authorization, studentManagementController.bulkUpdateMarks);

module.exports = router;

