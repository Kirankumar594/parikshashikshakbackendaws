const express = require("express");
const router = express.Router();
const studentResultController = require("../../Controller/Student/Result");

// Get student result by register number and DOB
router.get("/getResult/:registerNumber/:dob", studentResultController.getResult);

// Get result by student ID (for internal use)
router.get("/getResultById/:studentId", studentResultController.getResultById);

// Get all results for a school
router.get("/getSchoolResults/:schoolId", studentResultController.getSchoolResults);

// Get students by school and class (public endpoint for student result view)
router.get("/getStudentsBySchoolAndClass/:schoolId/:className", studentResultController.getStudentsBySchoolAndClass);

// Get result statistics
router.get("/getResultStats/:schoolId", studentResultController.getResultStats);

module.exports = router;

