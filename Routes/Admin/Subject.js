// const express=require('express');
// const { addSubjects, updateSubjects, getAllSujects, deleteSubjects } = require('../../Controller/Admin/Subject');
// const { Authentication, Authorization } = require('../../Authentication/auth');
// const router=express.Router();

// router.post("/addSubjects",Authentication,Authorization,addSubjects)
// router.put("/updateSubjects",Authentication,Authorization,updateSubjects)
// router.get("/getAllSujects",getAllSujects)
// router.delete("/deleteSubjects/:id/:authId",Authentication,Authorization,deleteSubjects)
// module.exports=router; 
 
 
const express = require('express');
const { 
  addSubjects, 
  updateSubjects, 
  getAllSujects, 
  deleteSubjects,
  getSubjectsBasic,
  getSubjectStats
} = require('../../Controller/Admin/Subject');
const { Authentication, Authorization } = require('../../Authentication/auth');

const router = express.Router();

// Add new subject
router.post("/addSubjects", Authentication, Authorization, addSubjects);

// Update existing subject
router.put("/updateSubjects", Authentication, Authorization, updateSubjects);

// Get all subjects with advanced pagination, search, and filters
router.get("/getAllSujects", getAllSujects);

// Get subjects with basic pagination (alternative endpoint)
router.get("/getSubjectsBasic", getSubjectsBasic);

// Get subject statistics
router.get("/getSubjectStats", getSubjectStats);

// Delete subject
router.delete("/deleteSubjects/:id/:authId", Authentication, Authorization, deleteSubjects);

module.exports = router;