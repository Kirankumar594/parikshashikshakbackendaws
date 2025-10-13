// const express = require("express");
// const { Authentication, Authorization } = require("../../Authentication/auth");
// const router = express.Router();
// const multer = require("multer");
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "Public/QuestionPdf");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "_" + file.originalname);
//   },
// });
// const upload = multer();
// const {
//   addUploadQuestions,
//   updateUploadQuestions,
//   getAllUploadQuestions,
//   deletedUploadQuestionPdf
//   // getslybusbyid,
// } = require("../../Controller/Admin/UploadQuestionpdf");



// router.post("/addUploadQuestions",upload.any(),Authentication, Authorization, addUploadQuestions);
// router.put("/updateUploadQuestions", Authentication, Authorization, updateUploadQuestions);
// router.get("/getAllpdf/:authId",Authentication, Authorization,getAllUploadQuestions);
// router.delete("/deleteuploadquestion/:id/:authId", Authentication,  Authorization, deletedUploadQuestionPdf);

// module.exports = router; 

 const express = require("express");
const { Authentication, Authorization } = require("../../Authentication/auth");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../Public/QuestionPdf");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created upload directory:", uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  },
});

// Configure multer with file validation
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    // Only allow PDF files
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

const {
  addUploadQuestions,
  updateUploadQuestions,
  getAllUploadQuestions,
  deletedUploadQuestionPdf,
  getUploadPdfQuestionbyid
} = require("../../Controller/Admin/UploadQuestionpdf");

// POST route for adding questions with file upload
router.post(
  "/addUploadQuestions",
  upload.fields([
    { name: "questionPdf", maxCount: 1 },
    { name: "answerPdf", maxCount: 1 }
  ]),
  Authentication,
  Authorization,
  (req, res, next) => {
    // Error handling middleware for multer
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }
    next();
  },
  addUploadQuestions
);

// PUT route for updating questions
router.put(
  "/updateUploadQuestions",
  upload.fields([
    { name: "questionPdf", maxCount: 1 },
    { name: "answerPdf", maxCount: 1 }
  ]),
  Authentication,
  Authorization,
  updateUploadQuestions
);

// GET route for fetching all questions
router.get(
  "/getAllpdf/:authId",
  Authentication,
  Authorization,
  getAllUploadQuestions
);

// GET route for fetching single question by ID
router.get(
  "/getUploadQuestion/:id",
  Authentication,
  Authorization,
  getUploadPdfQuestionbyid
);

// DELETE route for deleting question
router.delete(
  "/deleteuploadquestion/:id/:authId",
  Authentication,
  Authorization,
  deletedUploadQuestionPdf
);

// Route to serve PDF files
router.get("/pdf/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set appropriate headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error serving PDF:", error);
    res.status(500).json({ error: "Error serving file" });
  }
});

// Error handling middleware
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large" });
    }
  }
  
  if (error.message === "Only PDF files are allowed") {
    return res.status(400).json({ error: error.message });
  }

  console.error("Upload error:", error);
  res.status(500).json({ error: "File upload failed" });
});

module.exports = router;