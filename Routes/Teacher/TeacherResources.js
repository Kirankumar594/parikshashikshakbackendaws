const express = require("express");
const router = express.Router();
const { Authentication, Authorization } = require("../../Authentication/auth");
const SchoolModel = require("../../Module/Admin/School");
const ClassModel = require("../../Module/Admin/CLASS");

// Get schools for teacher
router.get("/getSchools/:teacherId", Authentication, Authorization, async (req, res) => {
  try {
    const schools = await SchoolModel.find({ isActive: true })
      .select('schoolName schoolCode board medium address')
      .sort({ schoolName: 1 });

    return res.status(200).json({ success: schools });
  } catch (error) {
    console.log("Error fetching schools:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get classes for teacher
router.get("/getClasses/:teacherId", Authentication, Authorization, async (req, res) => {
  try {
    const classes = await ClassModel.find({ isActive: true })
      .select('className')
      .sort({ className: 1 });

    return res.status(200).json({ success: classes });
  } catch (error) {
    console.log("Error fetching classes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

