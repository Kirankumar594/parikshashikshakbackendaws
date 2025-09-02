// const express = require("express");
// const {
//   addweightage,
//   getallcontent,
//   updateallcontent,
//   deleteweightage,
// } = require("../../Controller/Admin/Weighttageofthecontent");
// const { Authentication, Authorization } = require("../../Authentication/auth");
// const router = express.Router();

// router.post("/addweightage", Authentication, Authorization, addweightage);
// router.get("/getallcontent", getallcontent);
// router.put(
//   "/updateallcontent",
//   Authentication,
//   Authorization,
//   updateallcontent
// );
// router.delete(
//   "/deleteweightage/:id/:authId",
//   Authentication,
//   Authorization,
//   deleteweightage
// );
// module.exports = router; 
 
 
 
const express = require("express");
const {
  addweightage,
  getallcontent,
  updateallcontent,
  deleteweightage,
} = require("../../Controller/Admin/Weighttageofthecontent");
const { Authentication, Authorization } = require("../../Authentication/auth");
const router = express.Router();

router.post("/addweightage", Authentication, Authorization, addweightage);
// Updated route to support pagination and search
router.get("/getallcontent", getallcontent);
router.put(
  "/updateallcontent",
  Authentication,
  Authorization,
  updateallcontent
);
router.delete(
  "/deleteweightage/:id/:authId",
  Authentication,
  Authorization,
  deleteweightage
);

module.exports = router;
