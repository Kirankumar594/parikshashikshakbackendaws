const express=require('express');
const { addClass, updateClass, getAllClass, deleteClass, getClassesWithPagination, getClassFilterOptions } = require('../../Controller/Admin/CLASS');
const { Authentication, Authorization } = require('../../Authentication/auth');
const router=express.Router();

router.post("/addClass",Authentication,Authorization,addClass)
router.put("/updateClass",Authentication,Authorization,updateClass)
router.get("/getAllClass",getAllClass)
router.get("/getClassesWithPagination",getClassesWithPagination)
router.get("/getClassFilterOptions",getClassFilterOptions)
router.delete("/deleteClass/:id/:authId",Authentication,Authorization,deleteClass)
module.exports=router;