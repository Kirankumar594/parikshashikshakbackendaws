const Tutorial = require("../../Module/Admin/TutorialModule");
const mongoose = require("mongoose");

// CREATE
// CREATE
// exports.createTutorial = async (req, res) => {
//   try {
//     const { code, title, description } = req.body;
//     const videoUrl = "/uploads/tutorials/" + req.file.filename;

//     const tutorial = new Tutorial({ code, title, description, videoUrl }); 
//     await tutorial.save();
//     res.status(201).json({ success: true, tutorial });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };  
 
 exports.createTutorial = async (req, res) => {
  try {
    const { code, title, description } = req.body;

    let fileUrl = null;
    if (req.file) {
      fileUrl = "/uploads/tutorials/" + req.file.filename;
    }

    const tutorial = new Tutorial({
      code,
      title,
      description,
      fileUrl 
    });

    await tutorial.save();
    res.status(201).json({ success: true, tutorial });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// UPDATES
exports.updateTutorial = async (req, res) => {
  try {
    const updates = { 
      code: req.body.code, 
      title: req.body.title,
      description: req.body.description
    };
    if (req.file) updates.fileUrl = "/uploads/tutorials/" + req.file.filename;

    const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!tutorial) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, tutorial });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// READ (all)
exports.getTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({ createdAt: 1 });
    
    // Handle migration from videoUrl to fileUrl
    const migratedTutorials = tutorials.map(tutorial => {
      const tutorialObj = tutorial.toObject();
      // If fileUrl doesn't exist but videoUrl does, use videoUrl as fileUrl
      if (!tutorialObj.fileUrl && tutorialObj.videoUrl) {
        tutorialObj.fileUrl = tutorialObj.videoUrl;
      }
      return tutorialObj;
    });
    
    res.json({ success: true, tutorials: migratedTutorials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ (single)


exports.getTutorialById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid tutorial ID" });
    }
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, tutorial });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};





// DELETE
exports.deleteTutorial = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid tutorial ID" });
    }
    const tutorial = await Tutorial.findByIdAndDelete(req.params.id);
    if (!tutorial) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, message: "Tutorial deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Clean up orphaned tutorial files
exports.cleanupOrphanedFiles = async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const tutorials = await Tutorial.find();
    const uploadDir = path.join(__dirname, '../../Public/uploads/tutorials');
    
    let cleanedCount = 0;
    const orphanedTutorials = [];
    
    for (const tutorial of tutorials) {
      const fileUrl = tutorial.fileUrl || tutorial.videoUrl;
      
      if (fileUrl) {
        const fileName = fileUrl.split('/').pop();
        const filePath = path.join(uploadDir, fileName);
        
        if (!fs.existsSync(filePath)) {
          orphanedTutorials.push({
            id: tutorial._id,
            code: tutorial.code,
            title: tutorial.title,
            missingFile: fileName
          });
          
          // Clean up the orphaned reference
          await Tutorial.findByIdAndUpdate(tutorial._id, {
            $unset: { fileUrl: 1, videoUrl: 1 }
          });
          
          cleanedCount++;
        }
      }
    }
    
    res.json({
      success: true,
      message: `Cleaned up ${cleanedCount} orphaned file references`,
      orphanedTutorials: orphanedTutorials
    });
    
  } catch (error) {
    console.log("Error cleaning up orphaned files:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
