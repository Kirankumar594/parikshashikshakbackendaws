const Student = require('../../Module/ResultMaker/Student');
const Class = require('../../Module/ResultMaker/Class');
const School = require('../../Module/ResultMaker/School');

// Add Student
exports.addStudent = async (req, res) => {
  try {
    const { admissionNo, className, studentName, fatherName, motherName, mobileNo } = req.body;
    const userId = req.user._id;

    // Get school for this user
    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }

    // Find class
    const classData = await Class.findOne({ 
      $or: [
        { className: className },
        { $expr: { $eq: [{ $concat: ['$className', ' - ', '$section'] }, className] } }
      ],
      schoolId: school._id 
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if admission number already exists
    const existingStudent = await Student.findOne({ 
      admissionNo, 
      schoolId: school._id 
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this admission number already exists'
      });
    }

    // Create new student
    const newStudent = new Student({
      admissionNo,
      studentName,
      fatherName,
      motherName,
      mobileNo,
      classId: classData._id,
      schoolId: school._id,
      userId
    });

    await newStudent.save();

    // Update student count in class
    classData.studentCount += 1;
    await classData.save();

    return res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: newStudent
    });
  } catch (error) {
    console.error('Error adding student:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding student',
      error: error.message
    });
  }
};

// Get All Students by Class
exports.getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user._id;

    const students = await Student.find({ classId, userId })
      .populate('classId')
      .sort({ studentName: 1 });

    return res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const userId = req.user._id;

    const school = await School.findOne({ userId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School profile not found'
      });
    }

    const students = await Student.find({ schoolId: school._id })
      .populate('classId')
      .sort({ studentName: 1 });

    return res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { admissionNo, studentName, fatherName, motherName, mobileNo } = req.body;
    const userId = req.user._id;

    const student = await Student.findOne({ _id: studentId, userId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    student.admissionNo = admissionNo;
    student.studentName = studentName;
    student.fatherName = fatherName;
    student.motherName = motherName;
    student.mobileNo = mobileNo;
    student.updatedAt = Date.now();

    await student.save();

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user._id;

    const student = await Student.findOne({ _id: studentId, userId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update student count in class
    const classData = await Class.findById(student.classId);
    if (classData) {
      classData.studentCount = Math.max(0, classData.studentCount - 1);
      await classData.save();
    }

    await Student.findByIdAndDelete(studentId);

    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};
