const SchoolModel = require("../../Module/Admin/School");

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

class SCHOOL_MANAGEMENT {
  // Get all schools
  async getSchools(req, res) {
    try {
      const { authId } = req.params;
      const { board } = req.query;

      // Build filter query
      let filterQuery = { authId };
      if (board) filterQuery.board = board;

      const schools = await SchoolModel.find(filterQuery)
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: schools });
    } catch (error) {
      console.log("Error fetching schools:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get all schools (for teachers to see all schools)
  async getAllSchools(req, res) {
    try {
      const { board } = req.query;

      // Build filter query
      let filterQuery = {};
      if (board) filterQuery.board = board;

      const schools = await SchoolModel.find(filterQuery)
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: schools });
    } catch (error) {
      console.log("Error fetching all schools:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Add new school
  async addSchool(req, res) {
    try {
      const { authId } = req.params;
      const schoolData = req.body;

      // Validate required fields
      if (!schoolData.schoolName || !schoolData.board || !schoolData.medium) {
        return res.status(400).json({ error: "School name, board, and medium are required" });
      }

      // Add authId to school data
      schoolData.authId = authId;

      // Generate school code if not provided
      if (!schoolData.schoolCode) {
        schoolData.schoolCode = await generateSchoolCode();
      }

      const newSchool = await SchoolModel.create(schoolData);
      return res.status(200).json({ success: "School added successfully", data: newSchool });
    } catch (error) {
      console.log("Error adding school:", error);
      
      // Handle duplicate key error specifically
      if (error.code === 11000) {
        if (error.keyPattern && error.keyPattern.schoolCode) {
          return res.status(400).json({ error: "School code already exists. Please try again." });
        }
      }
      
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Update school
  async updateSchool(req, res) {
    try {
      const { schoolId, authId } = req.params;
      const updateData = req.body;

      // If schoolCode is being updated, ensure it's unique
      if (updateData.schoolCode) {
        const existingSchool = await SchoolModel.findOne({ 
          schoolCode: updateData.schoolCode, 
          _id: { $ne: schoolId } 
        });
        
        if (existingSchool) {
          return res.status(400).json({ error: "School code already exists" });
        }
      }

      const updatedSchool = await SchoolModel.findByIdAndUpdate(
        schoolId,
        updateData,
        { new: true }
      );

      if (!updatedSchool) {
        return res.status(404).json({ error: "School not found" });
      }

      return res.status(200).json({ success: "School updated successfully", data: updatedSchool });
    } catch (error) {
      console.log("Error updating school:", error);
      
      // Handle duplicate key error specifically
      if (error.code === 11000) {
        if (error.keyPattern && error.keyPattern.schoolCode) {
          return res.status(400).json({ error: "School code already exists" });
        }
      }
      
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete school
  async deleteSchool(req, res) {
    try {
      const { schoolId, authId } = req.params;

      const deletedSchool = await SchoolModel.findByIdAndDelete(schoolId);

      if (!deletedSchool) {
        return res.status(404).json({ error: "School not found" });
      }

      return res.status(200).json({ success: "School deleted successfully" });
    } catch (error) {
      console.log("Error deleting school:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get school by ID
  async getSchoolById(req, res) {
    try {
      const { schoolId, authId } = req.params;

      const school = await SchoolModel.findById(schoolId);

      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      return res.status(200).json({ success: school });
    } catch (error) {
      console.log("Error fetching school:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get statistics
  async getSchoolStats(req, res) {
    try {
      const { authId } = req.params;

      const totalSchools = await SchoolModel.countDocuments({ authId });

      // Get unique boards and mediums
      const boards = await SchoolModel.distinct('board', { authId });
      const mediums = await SchoolModel.distinct('medium', { authId });

      const stats = {
        totalSchools,
        totalBoards: boards.length,
        totalMediums: mediums.length,
        boards,
        mediums
      };

      return res.status(200).json({ success: stats });
    } catch (error) {
      console.log("Error fetching school stats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new SCHOOL_MANAGEMENT();