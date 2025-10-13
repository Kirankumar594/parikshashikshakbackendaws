const ResultConfigModel = require("../../Module/Admin/ResultConfig");

class RESULT_MANAGEMENT {
  // Get all result configurations
  async getResultConfigs(req, res) {
    try {
      const { authId } = req.params;
      const { schoolId, className, academicYear, isActive } = req.query;

      // Build filter query
      let filterQuery = {};
      if (schoolId) filterQuery.schoolId = schoolId;
      if (className) filterQuery.className = className;
      if (academicYear) filterQuery.academicYear = academicYear;
      if (isActive !== undefined) filterQuery.isActive = isActive === 'true';

      const configs = await ResultConfigModel.find(filterQuery)
        .populate('schoolId', 'schoolName schoolCode')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: configs });
    } catch (error) {
      console.log("Error fetching result configs:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Add new result configuration
  async addResultConfig(req, res) {
    try {
      const { authId } = req.params;
      const configData = req.body;

      // Validate required fields
      if (!configData.schoolId || !configData.className || !configData.academicYear) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if configuration already exists
      const existingConfig = await ResultConfigModel.findOne({
        schoolId: configData.schoolId,
        className: configData.className,
        academicYear: configData.academicYear
      });

      if (existingConfig) {
        return res.status(400).json({ error: "Configuration already exists for this school, class, and academic year" });
      }

      const newConfig = await ResultConfigModel.create(configData);
      return res.status(200).json({ success: "Result configuration added successfully", data: newConfig });
    } catch (error) {
      console.log("Error adding result config:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Update result configuration
  async updateResultConfig(req, res) {
    try {
      const { configId, authId } = req.params;
      const updateData = req.body;

      const updatedConfig = await ResultConfigModel.findByIdAndUpdate(
        configId,
        updateData,
        { new: true }
      ).populate('schoolId', 'schoolName schoolCode');

      if (!updatedConfig) {
        return res.status(404).json({ error: "Result configuration not found" });
      }

      return res.status(200).json({ success: "Result configuration updated successfully", data: updatedConfig });
    } catch (error) {
      console.log("Error updating result config:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete result configuration
  async deleteResultConfig(req, res) {
    try {
      const { configId, authId } = req.params;

      const deletedConfig = await ResultConfigModel.findByIdAndDelete(configId);

      if (!deletedConfig) {
        return res.status(404).json({ error: "Result configuration not found" });
      }

      return res.status(200).json({ success: "Result configuration deleted successfully" });
    } catch (error) {
      console.log("Error deleting result config:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get result configuration by criteria
  async getResultConfigByCriteria(req, res) {
    try {
      const { schoolId, className, academicYear } = req.query;

      if (!schoolId || !className || !academicYear) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const config = await ResultConfigModel.findOne({
        schoolId,
        className,
        academicYear,
        isActive: true
      }).populate('schoolId', 'schoolName schoolCode');

      if (!config) {
        return res.status(404).json({ error: "No active configuration found for the given criteria" });
      }

      return res.status(200).json({ success: config });
    } catch (error) {
      console.log("Error fetching result config by criteria:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get statistics
  async getResultStats(req, res) {
    try {
      const { authId } = req.params;

      const totalConfigs = await ResultConfigModel.countDocuments();
      const activeConfigs = await ResultConfigModel.countDocuments({ isActive: true });
      const inactiveConfigs = await ResultConfigModel.countDocuments({ isActive: false });

      // Get unique schools, classes, and academic years
      const schools = await ResultConfigModel.distinct('schoolId');
      const classes = await ResultConfigModel.distinct('className');
      const academicYears = await ResultConfigModel.distinct('academicYear');

      const stats = {
        totalConfigs,
        activeConfigs,
        inactiveConfigs,
        totalSchools: schools.length,
        totalClasses: classes.length,
        totalAcademicYears: academicYears.length,
        schools,
        classes,
        academicYears
      };

      return res.status(200).json({ success: stats });
    } catch (error) {
      console.log("Error fetching result stats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new RESULT_MANAGEMENT();

