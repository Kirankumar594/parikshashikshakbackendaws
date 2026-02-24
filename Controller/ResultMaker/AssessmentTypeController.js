const AssessmentType = require('../../Module/ResultMaker/AssessmentType');

// Add Assessment Type
exports.addAssessmentType = async (req, res) => {
  try {
    const { assessmentName, classId } = req.body;
    const userId = req.user._id;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID is required'
      });
    }

    const existing = await AssessmentType.findOne({ assessmentName, classId, userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Assessment type already exists for this class'
      });
    }

    const newAssessment = new AssessmentType({ assessmentName, classId, userId });
    await newAssessment.save();

    return res.status(201).json({
      success: true,
      message: 'Assessment type added successfully',
      data: newAssessment
    });
  } catch (error) {
    console.error('Error adding assessment type:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding assessment type',
      error: error.message
    });
  }
};

// Get All Assessment Types (optionally filter by classId)
exports.getAllAssessmentTypes = async (req, res) => {
  try {
    const userId = req.user._id;
    const { classId } = req.query;

    const query = { userId };
    if (classId) {
      query.classId = classId;
    }

    const assessmentTypes = await AssessmentType.find(query).populate('classId').sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: assessmentTypes
    });
  } catch (error) {
    console.error('Error fetching assessment types:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching assessment types',
      error: error.message
    });
  }
};

// Delete Assessment Type
exports.deleteAssessmentType = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const userId = req.user._id;

    const assessment = await AssessmentType.findOne({ _id: assessmentId, userId });
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment type not found'
      });
    }

    await AssessmentType.findByIdAndDelete(assessmentId);

    return res.status(200).json({
      success: true,
      message: 'Assessment type deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting assessment type:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting assessment type',
      error: error.message
    });
  }
};
