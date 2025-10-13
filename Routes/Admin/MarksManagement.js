const express = require("express");
const router = express.Router();
const { Authentication, Authorization } = require("../../Authentication/auth");
const {
  getMarksConfigs,
  addMarksConfig,
  updateMarksConfig,
  deleteMarksConfig
} = require("../../Controller/Admin/MarksManagement");

// Get all marks configurations
router.get("/getMarksConfigs/:authId", Authentication, Authorization, getMarksConfigs);

// Add new marks configuration
router.post("/addMarksConfig/:authId", Authentication, Authorization, addMarksConfig);

// Update marks configuration
router.put("/updateMarksConfig/:configId/:authId", Authentication, Authorization, updateMarksConfig);

// Delete marks configuration
router.delete("/deleteMarksConfig/:configId/:authId", Authentication, Authorization, deleteMarksConfig);

module.exports = router;
