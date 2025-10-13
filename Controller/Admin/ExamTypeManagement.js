const ExamTypeModel = require("../../Module/Admin/ExamType");

class EXAM_TYPE_MANAGEMENT {
  // Get all exam types
  async getExamTypes(req, res) {
    try {
      const { authId } = req.params;

      const examTypes = await ExamTypeModel.find({ authId })
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: examTypes });
    } catch (error) {
      console.log("Error fetching exam types:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get all exam types (for teachers to see all exam types)
  async getAllExamTypes(req, res) {
    try {
      const examTypes = await ExamTypeModel.find({})
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: examTypes });
    } catch (error) {
      console.log("Error fetching all exam types:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Add new exam type
  async addExamType(req, res) {
    try {
      const { authId } = req.params;
      const { examName } = req.body;

      // Validate required fields
      if (!examName) {
        return res.status(400).json({ error: "Exam name is required" });
      }

      const examTypeData = {
        authId,
        examName
      };

      const newExamType = await ExamTypeModel.create(examTypeData);
      return res.status(200).json({ success: "Exam type added successfully", data: newExamType });
    } catch (error) {
      console.log("Error adding exam type:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Update exam type
  async updateExamType(req, res) {
    try {
      const { examTypeId, authId } = req.params;
      const { examName } = req.body;

      if (!examName) {
        return res.status(400).json({ error: "Exam name is required" });
      }

      const updatedExamType = await ExamTypeModel.findByIdAndUpdate(
        examTypeId,
        { examName },
        { new: true }
      );

      if (!updatedExamType) {
        return res.status(404).json({ error: "Exam type not found" });
      }

      return res.status(200).json({ success: "Exam type updated successfully", data: updatedExamType });
    } catch (error) {
      console.log("Error updating exam type:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete exam type
  async deleteExamType(req, res) {
    try {
      const { examTypeId, authId } = req.params;

      const deletedExamType = await ExamTypeModel.findByIdAndDelete(examTypeId);

      if (!deletedExamType) {
        return res.status(404).json({ error: "Exam type not found" });
      }

      return res.status(200).json({ success: "Exam type deleted successfully" });
    } catch (error) {
      console.log("Error deleting exam type:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get exam type by ID
  async getExamTypeById(req, res) {
    try {
      const { examTypeId, authId } = req.params;

      const examType = await ExamTypeModel.findById(examTypeId);

      if (!examType) {
        return res.status(404).json({ error: "Exam type not found" });
      }

      return res.status(200).json({ success: examType });
    } catch (error) {
      console.log("Error fetching exam type:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get statistics
  async getExamTypeStats(req, res) {
    try {
      const { authId } = req.params;

      const totalExamTypes = await ExamTypeModel.countDocuments({ authId });

      const stats = {
        totalExamTypes
      };

      return res.status(200).json({ success: stats });
    } catch (error) {
      console.log("Error fetching exam type stats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new EXAM_TYPE_MANAGEMENT();