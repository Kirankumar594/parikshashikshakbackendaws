const School = require('../../Module/ResultMaker/School');

// Create or Update School Profile
exports.saveSchoolProfile = async (req, res) => {
  try {
    const { 
      schoolLogo,
      principalSignature,
      schoolName, 
      schoolAddress, 
      mobileNumber, 
      affiliationNumber, 
      educationalBoard, 
      schoolWebsite, 
      selectedSession 
    } = req.body;

    const userId = req.user._id; // Assuming auth middleware sets req.user

    // Check if school profile already exists for this user
    let school = await School.findOne({ userId });

    if (school) {
      // Update existing school
      school.schoolLogo = schoolLogo || school.schoolLogo;
      school.principalSignature = principalSignature !== undefined ? principalSignature : school.principalSignature;
      school.schoolName = schoolName;
      school.schoolAddress = schoolAddress;
      school.mobileNumber = mobileNumber;
      school.affiliationNumber = affiliationNumber;
      school.educationalBoard = educationalBoard;
      school.schoolWebsite = schoolWebsite;
      school.selectedSession = selectedSession;
      school.updatedAt = Date.now();

      await school.save();

      return res.status(200).json({
        success: true,
        message: 'School profile updated successfully',
        data: school
      });
    } else {
      // Create new school
      school = new School({
        schoolLogo,
        principalSignature,
        schoolName,
        schoolAddress,
        mobileNumber,
        affiliationNumber,
        educationalBoard,
        schoolWebsite,
        selectedSession,
        userId
      });

      await school.save();

      return res.status(201).json({
        success: true,
        message: 'School profile created successfully',
        data: school
      });
    }
  } catch (error) {
    console.error('Error saving school profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error saving school profile',
      error: error.message
    });
  }
};

// Get School Profile
exports.getSchoolProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const school = await School.findOne({ userId });

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: school
    });
  } catch (error) {
    console.error('Error fetching school profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching school profile',
      error: error.message
    });
  }
};
