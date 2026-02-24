const express = require("express");
const router = express.Router();
const {
  saveUserSubscription,
  getUserSubscriptions,
  checkSubscription,
  usePaper,
  getAllUserSubscriptions,
} = require("../../Controller/Admin/UserSubscription");
const { Authentication, Authorization } = require("../../Authentication/auth");

// User routes
router.post("/saveUserSubscription", saveUserSubscription);
router.get("/getUserSubscriptions/:userId", getUserSubscriptions);
router.post("/checkSubscription", checkSubscription);
router.post("/usePaper", usePaper);

// Admin routes
router.get("/getAllUserSubscriptions", Authentication, Authorization, getAllUserSubscriptions);

module.exports = router;
