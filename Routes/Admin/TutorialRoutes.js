const express = require("express");
const router = express.Router();
const upload = require("../../Middleware/uploadVideo")
const {
  createTutorial,
  getTutorials,
  getTutorialById,
  updateTutorial,
  deleteTutorial,
  cleanupOrphanedFiles,
} = require("../../Controller/Admin/TutorialController");
router.get("/getalltutorials", getTutorials);
// Create tutorial (Admin upload video)
router.post("/tutorials", upload.any(""), createTutorial);

// Get all tutorials


// Get single tutorial
router.get("/tutorials/:id", getTutorialById);

// Update tutorial
router.put("/tutorials/:id", upload.any(""), updateTutorial);

// Delete tutorial
router.delete("/tutorials/:id", deleteTutorial);

// Clean up orphaned files
router.post("/cleanup-orphaned-files", cleanupOrphanedFiles);

module.exports = router;
