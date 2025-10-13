const express = require("express");
const router = express.Router();
const { Authentication, Authorization } = require("../../Authentication/auth");
const {
  getDashboardStats,
  getTeachersWithPagination,
  getUserQuestionPapers,
  getAllQuestionPapersWithPagination,
  searchTeachers,
  deleteTeacher
} = require("../../Controller/Admin/Dashboard");

// Dashboard statistics
router.get("/getDashboardStats/:authId", Authentication, Authorization, getDashboardStats);

// Teachers with pagination and search
router.get("/getTeachersWithPagination/:authId", Authentication, Authorization, getTeachersWithPagination);

// Search teachers
router.get("/searchTeachers/:authId", Authentication, Authorization, searchTeachers);

// Get user's question papers with filtering
router.get("/getUserQuestionPapers/:teacherId/:authId", Authentication, Authorization, getUserQuestionPapers);

// Get all question papers with pagination
router.get("/getAllQuestionPapersWithPagination/:authId", Authentication, Authorization, getAllQuestionPapersWithPagination);

// Delete teacher
router.delete("/deleteTeacher/:teacherId/:authId", Authentication, Authorization, deleteTeacher);

module.exports = router;

