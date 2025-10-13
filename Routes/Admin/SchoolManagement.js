const express = require("express");
const router = express.Router();
const SchoolManagement = require("../../Controller/Admin/SchoolManagement");

// School Management Routes
router.post("/addSchool/:authId", SchoolManagement.addSchool);
router.get("/getSchools/:authId", SchoolManagement.getSchools);
router.get("/getAllSchools", SchoolManagement.getAllSchools);
router.put("/updateSchool/:schoolId/:authId", SchoolManagement.updateSchool);
router.delete("/deleteSchool/:schoolId/:authId", SchoolManagement.deleteSchool);
router.get("/getSchoolById/:schoolId/:authId", SchoolManagement.getSchoolById);
router.get("/getSchoolStats/:authId", SchoolManagement.getSchoolStats);

module.exports = router;