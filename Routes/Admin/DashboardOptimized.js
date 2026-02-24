const express = require('express');
const router = express.Router();
const dashboardController = require('../../Controller/Admin/DashboardOptimized');
const { Authentication, Authorization } = require('../../Authentication/auth');

// Get dashboard statistics with loading optimization
router.get("/getDashboardStats/:authId", Authentication, Authorization, dashboardController.getDashboardStats);

// Get paginated teachers list with search and filters
router.get("/getTeachersPaginated/:authId", Authentication, Authorization, dashboardController.getTeachersPaginated);

// Get user activity details
router.get("/getUserActivity/:teacherId/:authId", Authentication, Authorization, dashboardController.getUserActivity);

// Get dashboard overview (quick stats only)
router.get("/getDashboardOverview/:authId", Authentication, Authorization, dashboardController.getDashboardOverview);

module.exports = router;