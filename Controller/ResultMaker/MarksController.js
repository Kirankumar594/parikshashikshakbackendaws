const Marks = require('../../Module/ResultMaker/Marks');
const School = require('../../Module/ResultMaker/School');

// Save or update marks for multiple students
exports.saveMarks = async (req, res) => {
  try {
    const userId = req.userId;
    const { classId, termId, assessmentTypeId, subjectId, maxMarks, marksData } = req.body;

    console.log('Received marks save request:', {
      classId,
      termId,
      assessmentTypeId,
      subjectId,
      maxMarks,
      marksDataLength: marksData ? marksData.length : 0
    });

    // Validate required fields
    if (!classId || !termId || !assessmentTypeId || !subjectId || !maxMarks || !marksData) {
      console.log('Validation failed - missing fields:', {
        hasClassId: !!classId,
        hasTermId: !!termId,
        hasAssessmentTypeId: !!assessmentTypeId,
        hasSubjectId: !!subjectId,
        hasMaxMarks: !!maxMarks,
        hasMarksData: !!marksData
      });
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        missing: {
          classId: !classId,
          termId: !termId,
          assessmentTypeId: !assessmentTypeId,
          subjectId: !subjectId,
          maxMarks: !maxMarks,
          marksData: !marksData
        }
      });
    }

    // Get school profile
    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found. Please create school profile first.'
      });
    }

    const schoolId = school._id;

    // Process each student's marks
    const savedMarks = [];
    const errors = [];

    for (const markEntry of marksData) {
      try {
        const { studentId, marks } = markEntry;

        // Validate marks
        if (parseFloat(marks) > parseFloat(maxMarks)) {
          errors.push({
            studentId,
            error: `Marks ${marks} exceeds maximum marks ${maxMarks}`
          });
          continue;
        }

        // Update or create marks entry
        const marksRecord = await Marks.findOneAndUpdate(
          {
            studentId,
            termId,
            assessmentTypeId,
            subjectId,
            schoolId
          },
          {
            studentId,
            classId,
            termId,
            assessmentTypeId,
            subjectId,
            marks: parseFloat(marks) || 0,
            maxMarks: parseFloat(maxMarks),
            schoolId,
            userId,
            updatedAt: Date.now()
          },
          {
            new: true,
            upsert: true,
            runValidators: true
          }
        );

        savedMarks.push(marksRecord);
      } catch (error) {
        errors.push({
          studentId: markEntry.studentId,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Marks saved successfully',
      data: {
        saved: savedMarks.length,
        errors: errors.length > 0 ? errors : undefined
      }
    });
  } catch (error) {
    console.error('Error saving marks:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving marks',
      error: error.message
    });
  }
};

// Get marks for a specific class, term, assessment, and subject
exports.getMarks = async (req, res) => {
  try {
    const userId = req.userId;
    const { classId, termId, assessmentTypeId, subjectId } = req.query;

    // Validate required fields
    if (!classId || !termId || !assessmentTypeId || !subjectId) {
      return res.status(400).json({
        success: false,
        message: 'Class, term, assessment type, and subject are required'
      });
    }

    // Get school profile
    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }

    const schoolId = school._id;

    // Fetch marks
    const marks = await Marks.find({
      classId,
      termId,
      assessmentTypeId,
      subjectId,
      schoolId
    }).populate('studentId', 'admissionNo studentName');

    res.status(200).json({
      success: true,
      data: marks
    });
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching marks',
      error: error.message
    });
  }
};

// Get all marks for a student
exports.getStudentMarks = async (req, res) => {
  try {
    const userId = req.userId;
    const { studentId } = req.params;

    // Get school profile
    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }

    const schoolId = school._id;

    // Fetch all marks for the student
    const marks = await Marks.find({
      studentId,
      schoolId
    })
      .populate('termId', 'termName')
      .populate('assessmentTypeId', 'assessmentName')
      .populate('subjectId', 'subjectName');

    res.status(200).json({
      success: true,
      data: marks
    });
  } catch (error) {
    console.error('Error fetching student marks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student marks',
      error: error.message
    });
  }
};

// Delete marks entry
exports.deleteMarks = async (req, res) => {
  try {
    const userId = req.userId;
    const { marksId } = req.params;

    // Get school profile
    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }

    const schoolId = school._id;

    // Delete marks
    const deletedMarks = await Marks.findOneAndDelete({
      _id: marksId,
      schoolId
    });

    if (!deletedMarks) {
      return res.status(404).json({
        success: false,
        message: 'Marks entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Marks deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting marks:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting marks',
      error: error.message
    });
  }
};
