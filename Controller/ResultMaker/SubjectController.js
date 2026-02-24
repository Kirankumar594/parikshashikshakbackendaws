const ResultMakerSubject = require('../../Module/ResultMaker/Subject');

// Add Subject
exports.addSubject = async (req, res) => {
  try {
    const { subjectName, classId } = req.body;
    const userId = req.user._id;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID is required'
      });
    }

    const existing = await ResultMakerSubject.findOne({ subjectName, classId, userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Subject already exists for this class'
      });
    }

    const newSubject = new ResultMakerSubject({ subjectName, classId, userId });
    await newSubject.save();

    return res.status(201).json({
      success: true,
      message: 'Subject added successfully',
      data: newSubject
    });
  } catch (error) {
    console.error('Error adding subject:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding subject',
      error: error.message
    });
  }
};

// Get All Subjects (optionally filter by classId)
exports.getAllSubjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const { classId } = req.query;

    const query = { userId };
    if (classId) {
      query.classId = classId;
    }

    const subjects = await ResultMakerSubject.find(query).populate('classId').sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: subjects
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message
    });
  }
};

// Delete Subject
exports.deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user._id;

    const subject = await ResultMakerSubject.findOne({ _id: subjectId, userId });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    await ResultMakerSubject.findByIdAndDelete(subjectId);

    return res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting subject',
      error: error.message
    });
  }
};
