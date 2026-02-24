const express = require("express");
const router = express.Router();
const {
  addSubscription,
  updateSubscription,
  getAllSubscriptions,
  getActiveSubscriptions,
  getSubscriptionById,
  getSubscriptionsBySubclass,
  deleteSubscription,
  toggleSubscriptionStatus,
} = require("../../Controller/Admin/Subscription");
const { Authentication, Authorization } = require("../../Authentication/auth");

// Admin routes (protected)
router.post("/addSubscription", Authentication, Authorization, addSubscription);
router.put("/updateSubscription", Authentication, Authorization, updateSubscription);
router.delete("/deleteSubscription/:id/:authId", Authentication, Authorization, deleteSubscription);
router.put("/toggleSubscriptionStatus/:id/:authId", Authentication, Authorization, toggleSubscriptionStatus);

// Public routes
router.get("/getAllSubscriptions", getAllSubscriptions);
router.get("/getActiveSubscriptions", getActiveSubscriptions);
router.get("/getSubscriptionById/:id", getSubscriptionById);
router.get("/getSubscriptionsBySubclass/:subclassId", getSubscriptionsBySubclass);

module.exports = router;
