const MarksConfigModel = require("../../Module/Admin/MarksConfig");
const ExamTypeModel = require("../../Module/Admin/ExamType");

class MARKS_CONFIG_MANAGEMENT {
  // Get all marks configurations
  async getMarksConfigs(req, res) {
    try {
      const { authId } = req.params;

      const marksConfigs = await MarksConfigModel.find({ authId })
        .populate('examTypeId', 'examName')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: marksConfigs });
    } catch (error) {
      console.log("Error fetching marks configs:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get all marks configurations (for teachers to see all marks configs)
  async getAllMarksConfigs(req, res) {
    try {
      const marksConfigs = await MarksConfigModel.find({})
        .populate('examTypeId', 'examName')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: marksConfigs });
    } catch (error) {
      console.log("Error fetching all marks configs:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Add new marks configuration
  async addMarksConfig(req, res) {
    try {
      const { authId } = req.params;
      const { examTypeId, className, maxMarks } = req.body;

      console.log("Adding marks config with data:", { authId, examTypeId, className, maxMarks });

      // Validate required fields
      if (!examTypeId || !className || !maxMarks) {
        console.log("Validation failed: Missing required fields");
        return res.status(400).json({ error: "Exam type, class, and max marks are required" });
      }

      // Validate max marks is a positive number
      if (maxMarks <= 0) {
        console.log("Validation failed: Invalid max marks");
        return res.status(400).json({ error: "Max marks must be a positive number" });
      }

      // Check if exam type exists
      console.log("Checking if exam type exists:", examTypeId);
      const examType = await ExamTypeModel.findById(examTypeId);
      if (!examType) {
        console.log("Exam type not found:", examTypeId);
        return res.status(400).json({ error: "Exam type not found" });
      }

      // Check if configuration already exists for this exam type and class
      console.log("Checking for existing config...");
      const existingConfig = await MarksConfigModel.findOne({
        authId,
        examTypeId,
        className
      });

      if (existingConfig) {
        console.log("Existing config found:", existingConfig);
        return res.status(400).json({ error: "Marks configuration already exists for this exam type and class" });
      }

      const marksConfigData = {
        authId,
        examTypeId,
        className,
        maxMarks: parseInt(maxMarks)
      };

      console.log("Creating marks config with data:", marksConfigData);
      const newMarksConfig = await MarksConfigModel.create(marksConfigData);
      
      // Populate the exam type name for response
      await newMarksConfig.populate('examTypeId', 'examName');
      
      console.log("Marks config created successfully:", newMarksConfig);
      return res.status(200).json({ success: "Marks configuration added successfully", data: newMarksConfig });
    } catch (error) {
      console.log("Error adding marks config:", error);
      console.log("Error details:", {
        name: error.name,
        message: error.message,
        code: error.code,
        keyPattern: error.keyPattern,
        keyValue: error.keyValue
      });
      
      // Handle duplicate key error specifically
      if (error.code === 11000) {
        if (error.keyPattern && error.keyPattern.authId && error.keyPattern.examTypeId && error.keyPattern.className) {
          return res.status(400).json({ error: "Marks configuration already exists for this exam type and class" });
        }
      }
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ error: `Validation error: ${errors.join(', ')}` });
      }
      
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Update marks configuration
  async updateMarksConfig(req, res) {
    try {
      const { configId, authId } = req.params;
      const { examTypeId, className, maxMarks } = req.body;

      // Validate required fields
      if (!examTypeId || !className || !maxMarks) {
        return res.status(400).json({ error: "Exam type, class, and max marks are required" });
      }

      // Validate max marks is a positive number
      if (maxMarks <= 0) {
        return res.status(400).json({ error: "Max marks must be a positive number" });
      }

      // Check if exam type exists
      const examType = await ExamTypeModel.findById(examTypeId);
      if (!examType) {
        return res.status(400).json({ error: "Exam type not found" });
      }

      // Check if another configuration already exists for this exam type and class
      const existingConfig = await MarksConfigModel.findOne({
        authId,
        examTypeId,
        className,
        _id: { $ne: configId }
      });

      if (existingConfig) {
        return res.status(400).json({ error: "Marks configuration already exists for this exam type and class" });
      }

      const updatedMarksConfig = await MarksConfigModel.findByIdAndUpdate(
        configId,
        {
          examTypeId,
          className,
          maxMarks: parseInt(maxMarks)
        },
        { new: true }
      ).populate('examTypeId', 'examName');

      if (!updatedMarksConfig) {
        return res.status(404).json({ error: "Marks configuration not found" });
      }

      return res.status(200).json({ success: "Marks configuration updated successfully", data: updatedMarksConfig });
    } catch (error) {
      console.log("Error updating marks config:", error);
      
      // Handle duplicate key error specifically
      if (error.code === 11000) {
        if (error.keyPattern && error.keyPattern.authId && error.keyPattern.examTypeId && error.keyPattern.className) {
          return res.status(400).json({ error: "Marks configuration already exists for this exam type and class" });
        }
      }
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ error: `Validation error: ${errors.join(', ')}` });
      }
      
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete marks configuration
  async deleteMarksConfig(req, res) {
    try {
      const { configId, authId } = req.params;

      const deletedMarksConfig = await MarksConfigModel.findByIdAndDelete(configId);

      if (!deletedMarksConfig) {
        return res.status(404).json({ error: "Marks configuration not found" });
      }

      return res.status(200).json({ success: "Marks configuration deleted successfully" });
    } catch (error) {
      console.log("Error deleting marks config:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get marks configuration by ID
  async getMarksConfigById(req, res) {
    try {
      const { configId, authId } = req.params;

      const marksConfig = await MarksConfigModel.findById(configId)
        .populate('examTypeId', 'examName');

      if (!marksConfig) {
        return res.status(404).json({ error: "Marks configuration not found" });
      }

      return res.status(200).json({ success: marksConfig });
    } catch (error) {
      console.log("Error fetching marks config:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get marks configuration by exam type and class
  async getMarksConfigByCriteria(req, res) {
    try {
      const { authId } = req.params;
      const { examTypeId, className } = req.query;

      let filterQuery = { authId };
      if (examTypeId) filterQuery.examTypeId = examTypeId;
      if (className) filterQuery.className = className;

      const marksConfigs = await MarksConfigModel.find(filterQuery)
        .populate('examTypeId', 'examName')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: marksConfigs });
    } catch (error) {
      console.log("Error fetching marks configs by criteria:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get statistics
  async getMarksStats(req, res) {
    try {
      const { authId } = req.params;

      const totalConfigs = await MarksConfigModel.countDocuments({ authId });
      
      // Get unique classes
      const classes = await MarksConfigModel.distinct('className', { authId });
      
      // Get configs by exam type
      const configsByExamType = await MarksConfigModel.aggregate([
        { $match: { authId } },
        { $group: { _id: '$examTypeId', count: { $sum: 1 } } },
        { $lookup: { from: 'examtypes', localField: '_id', foreignField: '_id', as: 'examType' } },
        { $unwind: '$examType' },
        { $project: { examName: '$examType.examName', count: 1 } }
      ]);

      const stats = {
        totalConfigs,
        totalClasses: classes.length,
        classes,
        configsByExamType
      };

      return res.status(200).json({ success: stats });
    } catch (error) {
      console.log("Error fetching marks stats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new MARKS_CONFIG_MANAGEMENT();
