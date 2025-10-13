const StudentModel = require("../../Module/Teacher/Student");

class TEACHER_STUDENT_MANAGEMENT {
  // Get all students for teacher
  async getStudents(req, res) {
    try {
      const { authId } = req.params;
      const { schoolId, className, searchTerm, page = 1, limit = 10 } = req.query;

      console.log("=== TEACHER STUDENT ACCESS CONTROL ===");
      console.log("Teacher ID:", authId);
      console.log("Query params:", { schoolId, className, searchTerm, page, limit });

      // Build filter query - CRITICAL: Only show students created by this teacher
      let filterQuery = {
        createdBy: authId  // This ensures teacher can only see their own students
      };
      
      if (schoolId) filterQuery.schoolId = schoolId;
      if (className) filterQuery.className = className;
      if (searchTerm) {
        filterQuery.$or = [
          { name: { $regex: searchTerm, $options: 'i' } },
          { registerNumber: { $regex: searchTerm, $options: 'i' } },
          { fatherName: { $regex: searchTerm, $options: 'i' } }
        ];
      }

      console.log("Final filter query:", filterQuery);

      const skip = (page - 1) * limit;
      const students = await StudentModel.find(filterQuery)
        .populate('schoolId', 'schoolName schoolCode')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const totalStudents = await StudentModel.countDocuments(filterQuery);

      return res.status(200).json({
        success: students,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalStudents / limit),
          totalStudents,
          hasNext: page < Math.ceil(totalStudents / limit),
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.log("Error fetching students:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Save new student
  async saveStudent(req, res) {
    try {
      const { authId } = req.params;
      const studentData = req.body;

      console.log("Received student data:", studentData);
      console.log("Teacher ID:", authId);

      // Validate required fields
      if (!studentData.name || !studentData.registerNumber || !studentData.schoolId || !studentData.className) {
        return res.status(400).json({ error: "Missing required fields: name, registerNumber, schoolId, className" });
      }

      // Add required fields that might be missing
      studentData.createdBy = authId;
      
      // Ensure schoolId is a valid ObjectId
      if (typeof studentData.schoolId === 'string') {
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(studentData.schoolId)) {
          return res.status(400).json({ error: "Invalid schoolId format" });
        }
      }

      // Check if register number already exists
      const existingStudent = await StudentModel.findOne({
        registerNumber: studentData.registerNumber,
        schoolId: studentData.schoolId
      });

      if (existingStudent) {
        return res.status(400).json({ error: "Student with this register number already exists in this school" });
      }

      const newStudent = await StudentModel.create(studentData);
      return res.status(200).json({ success: "Student saved successfully", data: newStudent });
    } catch (error) {
      console.log("Error saving student:", error);
      console.log("Error details:", error.message);
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  }

  // Update student
  async updateStudent(req, res) {
    try {
      const { studentId, authId } = req.params;
      const updateData = req.body;

      console.log("=== UPDATE STUDENT DEBUG ===");
      console.log("Student ID:", studentId);
      console.log("Auth ID:", authId);
      console.log("Update Data:", JSON.stringify(updateData, null, 2));

      // First, check if the student exists and belongs to this teacher
      const existingStudent = await StudentModel.findById(studentId);
      if (!existingStudent) {
        console.log("Student not found for ID:", studentId);
        return res.status(404).json({ error: "Student not found" });
      }

      // Check if the student belongs to this teacher
      if (existingStudent.createdBy !== authId) {
        console.log("Access denied: Student belongs to different teacher");
        console.log("Student created by:", existingStudent.createdBy);
        console.log("Requesting teacher:", authId);
        return res.status(403).json({ error: "Access denied: You can only update your own students" });
      }

      const updatedStudent = await StudentModel.findByIdAndUpdate(
        studentId,
        updateData,
        { new: true }
      ).populate('schoolId', 'schoolName schoolCode');

      if (!updatedStudent) {
        console.log("Student not found for ID:", studentId);
        return res.status(404).json({ error: "Student not found" });
      }

      console.log("Student updated successfully:", {
        id: updatedStudent._id,
        name: updatedStudent.name,
        subjects: updatedStudent.subjects
      });

      return res.status(200).json({ success: "Student updated successfully", data: updatedStudent });
    } catch (error) {
      console.log("Error updating student:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete student
  async deleteStudent(req, res) {
    try {
      const { studentId, authId } = req.params;

      // First, check if the student exists and belongs to this teacher
      const existingStudent = await StudentModel.findById(studentId);
      if (!existingStudent) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Check if the student belongs to this teacher
      if (existingStudent.createdBy !== authId) {
        console.log("Access denied: Student belongs to different teacher");
        console.log("Student created by:", existingStudent.createdBy);
        console.log("Requesting teacher:", authId);
        return res.status(403).json({ error: "Access denied: You can only delete your own students" });
      }

      const deletedStudent = await StudentModel.findByIdAndDelete(studentId);

      return res.status(200).json({ success: "Student deleted successfully" });
    } catch (error) {
      console.log("Error deleting student:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get student by ID
  async getStudentById(req, res) {
    try {
      const { studentId, authId } = req.params;

      const student = await StudentModel.findById(studentId)
        .populate('schoolId', 'schoolName schoolCode');

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Check if the student belongs to this teacher
      if (student.createdBy !== authId) {
        console.log("Access denied: Student belongs to different teacher");
        console.log("Student created by:", student.createdBy);
        console.log("Requesting teacher:", authId);
        return res.status(403).json({ error: "Access denied: You can only view your own students" });
      }

      return res.status(200).json({ success: student });
    } catch (error) {
      console.log("Error fetching student:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get statistics
  async getStudentStats(req, res) {
    try {
      const { authId } = req.params;

      // Only count students belonging to this teacher
      const totalStudents = await StudentModel.countDocuments({ createdBy: authId });
      const schools = await StudentModel.distinct('schoolId', { createdBy: authId });
      const classes = await StudentModel.distinct('className', { createdBy: authId });
      const academicYears = await StudentModel.distinct('academicYear', { createdBy: authId });

      const stats = {
        totalStudents,
        totalSchools: schools.length,
        totalClasses: classes.length,
        totalAcademicYears: academicYears.length,
        schools,
        classes,
        academicYears
      };

      return res.status(200).json({ success: stats });
    } catch (error) {
      console.log("Error fetching student stats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Bulk update marks
  async bulkUpdateMarks(req, res) {
    try {
      const { authId } = req.params;
      const { students } = req.body;

      if (!Array.isArray(students) || students.length === 0) {
        return res.status(400).json({ error: "Students array is required" });
      }

      const updatePromises = students.map(async student => {
        // First check if the student belongs to this teacher
        const existingStudent = await StudentModel.findById(student.studentId);
        if (!existingStudent) {
          throw new Error(`Student with ID ${student.studentId} not found`);
        }
        if (existingStudent.createdBy !== authId) {
          throw new Error(`Access denied: Student ${student.studentId} belongs to different teacher`);
        }
        
        return StudentModel.findByIdAndUpdate(
          student.studentId,
          { subjects: student.subjects },
          { new: true }
        );
      });

      const updatedStudents = await Promise.all(updatePromises);

      return res.status(200).json({
        success: "Marks updated successfully",
        data: updatedStudents
      });
    } catch (error) {
      console.log("Error bulk updating marks:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new TEACHER_STUDENT_MANAGEMENT();


