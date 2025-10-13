const mongoose = require("mongoose");
const SchoolModel = require("./Module/Admin/School");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Guru_Resource_Mangament", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to generate unique school code
const generateSchoolCode = async () => {
  let schoolCode;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate a 6-character alphanumeric code
    schoolCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Check if this code already exists
    const existingSchool = await SchoolModel.findOne({ schoolCode });
    if (!existingSchool) {
      isUnique = true;
    }
  }
  
  return schoolCode;
};

// Function to fix schools with null schoolCode
const fixSchoolCodes = async () => {
  try {
    console.log("Starting to fix school codes...");
    
    // Find all schools with null or undefined schoolCode
    const schoolsWithNullCode = await SchoolModel.find({
      $or: [
        { schoolCode: null },
        { schoolCode: { $exists: false } },
        { schoolCode: "" }
      ]
    });
    
    console.log(`Found ${schoolsWithNullCode.length} schools with null/empty schoolCode`);
    
    // Update each school with a unique school code
    for (const school of schoolsWithNullCode) {
      const newSchoolCode = await generateSchoolCode();
      await SchoolModel.findByIdAndUpdate(school._id, { schoolCode: newSchoolCode });
      console.log(`Updated school "${school.schoolName}" with code: ${newSchoolCode}`);
    }
    
    console.log("All school codes have been fixed!");
    
  } catch (error) {
    console.error("Error fixing school codes:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the fix
fixSchoolCodes();
