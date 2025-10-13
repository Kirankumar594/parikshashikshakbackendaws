const AchievementModel = require("../../Module/Admin/Achievement");

class ACHIEVEMENT_CARD {
  // Get all students
  async getStudents(req, res) {
    try {
      const { authId } = req.params;
      const { examType, subject, class: className, search } = req.query;

      // Build filter query
      let filterQuery = {};
      if (examType) filterQuery.examType = examType;
      if (subject) filterQuery.subject = subject;
      if (className) filterQuery.class = className;
      if (search) {
        filterQuery.$or = [
          { name: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } }
        ];
      }

      const students = await AchievementModel.find(filterQuery)
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: students });
    } catch (error) {
      console.log("Error fetching students:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Save student data
  async saveStudent(req, res) {
    try {
      const { authId } = req.params;
      const studentData = req.body;

      // Clean the data to prevent null values
      const cleanedData = { ...studentData };
      
      // Convert empty strings to null for optional fields, but keep required fields as strings
      const requiredFields = ['name', 'rollNumber', 'examType', 'subject', 'class'];
      requiredFields.forEach(field => {
        if (cleanedData[field] === '') {
          return res.status(400).json({ error: `${field} cannot be empty` });
        }
      });

      // Validate required fields
      if (!cleanedData.name || !cleanedData.rollNumber || !cleanedData.examType || !cleanedData.subject || !cleanedData.class) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if student record already exists
      const existingStudent = await AchievementModel.findOne({
        rollNumber: cleanedData.rollNumber,
        examType: cleanedData.examType,
        subject: cleanedData.subject,
        class: cleanedData.class
      });

      if (existingStudent) {
        return res.status(400).json({ error: "Student record already exists for this exam" });
      }

      const newStudent = await AchievementModel.create(cleanedData);
      return res.status(200).json({ success: "Student record saved successfully", data: newStudent });
    } catch (error) {
      console.log("Error saving student:", error);
      
      // Handle duplicate key error specifically
      if (error.code === 11000) {
        if (error.keyPattern && error.keyPattern.rollNumber && error.keyPattern.examType && error.keyPattern.subject && error.keyPattern.class) {
          return res.status(400).json({ error: "Student record already exists for this exam type, subject, and class" });
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

  // Update student data
  async updateStudent(req, res) {
    try {
      const { studentId, authId } = req.params;
      const updateData = req.body;

      const updatedStudent = await AchievementModel.findByIdAndUpdate(
        studentId,
        updateData,
        { new: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ error: "Student record not found" });
      }

      return res.status(200).json({ success: "Student record updated successfully", data: updatedStudent });
    } catch (error) {
      console.log("Error updating student:", error);
      
      // Handle duplicate key error specifically
      if (error.code === 11000) {
        if (error.keyPattern && error.keyPattern.rollNumber && error.keyPattern.examType && error.keyPattern.subject && error.keyPattern.class) {
          return res.status(400).json({ error: "Student record already exists for this exam type, subject, and class" });
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

  // Delete student data
  async deleteStudent(req, res) {
    try {
      const { studentId, authId } = req.params;

      const deletedStudent = await AchievementModel.findByIdAndDelete(studentId);

      if (!deletedStudent) {
        return res.status(404).json({ error: "Student record not found" });
      }

      return res.status(200).json({ success: "Student record deleted successfully" });
    } catch (error) {
      console.log("Error deleting student:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get student by ID
  async getStudentById(req, res) {
    try {
      const { studentId, authId } = req.params;

      const student = await AchievementModel.findById(studentId);

      if (!student) {
        return res.status(404).json({ error: "Student record not found" });
      }

      return res.status(200).json({ success: student });
    } catch (error) {
      console.log("Error fetching student:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get statistics
  async getAchievementStats(req, res) {
    try {
      const { authId } = req.params;

      const totalStudents = await AchievementModel.countDocuments();
      const gradeA = await AchievementModel.countDocuments({ 'marks.grade': 'A' });
      const gradeB = await AchievementModel.countDocuments({ 'marks.grade': 'B' });
      const gradeC = await AchievementModel.countDocuments({ 'marks.grade': 'C' });
      const gradeD = await AchievementModel.countDocuments({ 'marks.grade': 'D' });
      const gradeF = await AchievementModel.countDocuments({ 'marks.grade': 'F' });

      // Get unique classes
      const classes = await AchievementModel.distinct('class');
      const subjects = await AchievementModel.distinct('subject');
      const examTypes = await AchievementModel.distinct('examType');

      const stats = {
        totalStudents,
        gradeDistribution: {
          A: gradeA,
          B: gradeB,
          C: gradeC,
          D: gradeD,
          F: gradeF
        },
        totalClasses: classes.length,
        totalSubjects: subjects.length,
        totalExamTypes: examTypes.length,
        classes,
        subjects,
        examTypes
      };

      return res.status(200).json({ success: stats });
    } catch (error) {
      console.log("Error fetching achievement stats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Bulk import students
  async bulkImportStudents(req, res) {
    try {
      const { authId } = req.params;
      const { students } = req.body;

      if (!students || !Array.isArray(students)) {
        return res.status(400).json({ error: "Invalid students data" });
      }

      const savedStudents = [];
      const errors = [];

      for (let i = 0; i < students.length; i++) {
        try {
          const student = students[i];
          
          // Validate required fields
          if (!student.name || !student.rollNumber || !student.examType || !student.subject || !student.class) {
            errors.push(`Row ${i + 1}: Missing required fields`);
            continue;
          }

          // Check if student record already exists
          const existingStudent = await AchievementModel.findOne({
            rollNumber: student.rollNumber,
            examType: student.examType,
            subject: student.subject,
            class: student.class
          });

          if (existingStudent) {
            errors.push(`Row ${i + 1}: Student record already exists`);
            continue;
          }

          const newStudent = await AchievementModel.create(student);
          savedStudents.push(newStudent);
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error.message}`);
        }
      }

      return res.status(200).json({ 
        success: "Bulk import completed", 
        data: {
          saved: savedStudents.length,
          errors: errors.length,
          details: errors
        }
      });
    } catch (error) {
      console.log("Error in bulk import:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new ACHIEVEMENT_CARD();
