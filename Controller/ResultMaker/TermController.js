const Term = require('../../Module/ResultMaker/Term');
const mongoose = require('mongoose');

// Add Term
exports.addTerm = async (req, res) => {
  try {
    const { termName, classId } = req.body;
    const userId = req.user._id;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: 'Class ID is required'
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Class ID format'
      });
    }

    const existingTerm = await Term.findOne({ termName, classId, userId });
    if (existingTerm) {
      return res.status(400).json({
        success: false,
        message: 'Term already exists for this class'
      });
    }

    const newTerm = new Term({ termName, classId, userId });
    await newTerm.save();

    return res.status(201).json({
      success: true,
      message: 'Term added successfully',
      data: newTerm
    });
  } catch (error) {
    console.error('Error adding term:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding term',
      error: error.message
    });
  }
};

// Get All Terms (optionally filter by classId)
exports.getAllTerms = async (req, res) => {
  try {
    const userId = req.user._id;
    const { classId } = req.query;

    const query = { userId };
    if (classId) {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Class ID format. Please create classes through the API.'
        });
      }
      query.classId = classId;
    }

    const terms = await Term.find(query).populate('classId').sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: terms
    });
  } catch (error) {
    console.error('Error fetching terms:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching terms',
      error: error.message
    });
  }
};

// Delete Term
exports.deleteTerm = async (req, res) => {
  try {
    const { termId } = req.params;
    const userId = req.user._id;

    const term = await Term.findOne({ _id: termId, userId });
    if (!term) {
      return res.status(404).json({
        success: false,
        message: 'Term not found'
      });
    }

    await Term.findByIdAndDelete(termId);

    return res.status(200).json({
      success: true,
      message: 'Term deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting term:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting term',
      error: error.message
    });
  }
};
