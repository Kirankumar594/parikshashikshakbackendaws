const express = require("express");
const {
  addChapter,
  updateChapter,
  getAllChapter,
  deleteChapter,
  getChaptersWithFilters,
  getFilterOptions,
  getCascadingFilterOptions,
} = require("../../Controller/Admin/Chapter");
const { Authentication, Authorization } = require("../../Authentication/auth");
const router = express.Router();

router.post("/addChapter", Authentication, Authorization, addChapter);
router.put("/updateChapter", Authentication, Authorization, updateChapter);
router.get("/getAllChapter", getAllChapter);
router.delete(
  "/deleteChapter/:id/:authId",
  Authentication,
  Authorization,
  deleteChapter
);

// New optimized routes for filtering and pagination
router.get("/getChaptersWithFilters", getChaptersWithFilters);
router.get("/getChapterFilterOptions", getFilterOptions);
router.get("/getCascadingFilterOptions", getCascadingFilterOptions);

module.exports = router;
