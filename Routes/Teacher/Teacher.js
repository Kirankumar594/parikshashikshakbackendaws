const express=require('express');
const router=express.Router();
const multer = require("multer");
const { 
  registerTeacher, 
  loginTeacher, 
  getAllTeachers,
  getAllUserById, 
  updateTeacher, 
  makeBlockAndUnblockTeachers, 
  deleteTeacher,
  updatepassword
 } = require('../../Controller/Teacher/Teacher');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/Teacher");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const { Authentication, Authorization } = require('../../Authentication/auth');

const upload = multer();
router.post("/registerTeacher",registerTeacher);
router.post("/loginTeacher",loginTeacher);
router.get("/getAllTeachers/:authId",Authentication, Authorization,getAllTeachers);
router.get("/getUserById/:id",getAllUserById);
router.put("/updateTeacher",upload.any(),Authentication, Authorization,updateTeacher)
router.put("/makeBlockAndUnblockTeachers",Authentication, Authorization,makeBlockAndUnblockTeachers);
router.delete("/deleteTeacher/:id/:authId",Authentication, Authorization,deleteTeacher);
router.put("/updatepassword",updatepassword);
module.exports=router; 