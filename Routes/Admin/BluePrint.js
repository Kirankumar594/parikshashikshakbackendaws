const express = require("express");
const router = express.Router();

const {
  registerBLUEPRINT,
  getAllBLUEPRINTs,
  updateBLUEPRINT,
  makeBlockAndUnblockBLUEPRINTs,
  deleteBLUEPRINT,
  getblueprintsbyid,
  updateweigtage,
  updatemarksdetails,
  getAllBluePrintByClass,
  getBluePrintGetByTeacherRequired,
} = require("../../Controller/Admin/BluePrint");

const { Authentication, Authorization } = require("../../Authentication/auth");

router.post("/registerBLUEPRINT", registerBLUEPRINT);
// router.post("/loginTeacher",loginTeacher);
router.get(
  "/getAllBLUEPRINTs/:authId",
  Authentication,
  Authorization,
  getAllBLUEPRINTs,
  
);

router.get("/getblueprintsbyid/:id", getblueprintsbyid);

router.put("/updateBLUEPRINT", Authentication, Authorization, updateBLUEPRINT);

router.put(
  "/makeBlockAndUnblockBLUEPRINTs",
  Authentication,
  Authorization,
  makeBlockAndUnblockBLUEPRINTs
);
router.delete(
  "/deleteBLUEPRINT/:id/:authId",
  Authentication,
  Authorization,
  deleteBLUEPRINT
);

router.put("/updateweatge/:id",updateweigtage);
router.put("/updatemarksdetails/:id",updatemarksdetails)
router.get("/getAllBluePrintByClass/:class/:authId",Authentication,Authorization,getAllBluePrintByClass);
router.put("/getBluePrintGetByTeacherRequired",Authentication,Authorization,getBluePrintGetByTeacherRequired)
module.exports = router;
