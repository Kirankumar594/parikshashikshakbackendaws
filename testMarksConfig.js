const mongoose = require("mongoose");
const MarksConfigModel = require("./Module/Admin/MarksConfig");
const ExamTypeModel = require("./Module/Admin/ExamType");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Guru_Resource_Mangament", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testMarksConfig() {
  try {
    console.log("Testing marks config creation...");
    
    // Test data
    const testData = {
      authId: "65aa5913d1462c759243d6cb",
      examTypeId: "65aa5913d1462c759243d6cc", // This might not exist
      className: "1",
      maxMarks: 100
    };
    
    console.log("Test data:", testData);
    
    // Check if exam type exists
    const examType = await ExamTypeModel.findById(testData.examTypeId);
    console.log("Exam type found:", examType);
    
    if (!examType) {
      console.log("Creating a test exam type...");
      const newExamType = await ExamTypeModel.create({
        authId: testData.authId,
        examName: "Test Exam"
      });
      testData.examTypeId = newExamType._id;
      console.log("Created exam type:", newExamType);
    }
    
    // Check for existing config
    const existingConfig = await MarksConfigModel.findOne({
      authId: testData.authId,
      examTypeId: testData.examTypeId,
      className: testData.className
    });
    console.log("Existing config:", existingConfig);
    
    if (existingConfig) {
      console.log("Config already exists, deleting it...");
      await MarksConfigModel.findByIdAndDelete(existingConfig._id);
    }
    
    // Try to create the config
    console.log("Creating marks config...");
    const newConfig = await MarksConfigModel.create(testData);
    console.log("Created successfully:", newConfig);
    
    // Try to populate
    await newConfig.populate('examTypeId', 'examName');
    console.log("Populated config:", newConfig);
    
  } catch (error) {
    console.error("Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue
    });
  } finally {
    mongoose.connection.close();
  }
}

testMarksConfig();
