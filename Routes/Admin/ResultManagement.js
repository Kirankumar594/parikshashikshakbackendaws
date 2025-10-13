const express = require("express");
const router = express.Router();
const SchoolManagement = require("../../Controller/Admin/SchoolManagement");
const ExamTypeManagement = require("../../Controller/Admin/ExamTypeManagement");
const MarksManagement = require("../../Controller/Admin/MarksManagement");

// School Management Routes
router.post("/addSchool/:authId", SchoolManagement.addSchool);
router.get("/getSchools/:authId", SchoolManagement.getSchools);
router.put("/updateSchool/:schoolId/:authId", SchoolManagement.updateSchool);
router.delete("/deleteSchool/:schoolId/:authId", SchoolManagement.deleteSchool);
router.get("/getSchoolById/:schoolId/:authId", SchoolManagement.getSchoolById);
router.get("/getSchoolStats/:authId", SchoolManagement.getSchoolStats);

// Exam Type Management Routes
router.post("/examTypes/addExamType/:authId", ExamTypeManagement.addExamType);
router.get("/examTypes/getExamTypes/:authId", ExamTypeManagement.getExamTypes);
router.get("/examTypes/getAllExamTypes", ExamTypeManagement.getAllExamTypes);
router.put("/examTypes/updateExamType/:examTypeId/:authId", ExamTypeManagement.updateExamType);
router.delete("/examTypes/deleteExamType/:examTypeId/:authId", ExamTypeManagement.deleteExamType);
router.get("/examTypes/getExamTypeById/:examTypeId/:authId", ExamTypeManagement.getExamTypeById);
router.get("/examTypes/getExamTypeStats/:authId", ExamTypeManagement.getExamTypeStats);

// Marks Management Routes
router.post("/marks/addMarksConfig/:authId", MarksManagement.addMarksConfig);
router.get("/marks/getMarksConfigs/:authId", MarksManagement.getMarksConfigs);
router.get("/marks/getAllMarksConfigs", MarksManagement.getAllMarksConfigs);
router.put("/marks/updateMarksConfig/:configId/:authId", MarksManagement.updateMarksConfig);
router.delete("/marks/deleteMarksConfig/:configId/:authId", MarksManagement.deleteMarksConfig);
router.get("/marks/getMarksConfigById/:configId/:authId", MarksManagement.getMarksConfigById);
router.get("/marks/getMarksConfigByCriteria/:authId", MarksManagement.getMarksConfigByCriteria);
router.get("/marks/getMarksStats/:authId", MarksManagement.getMarksStats);

module.exports = router;