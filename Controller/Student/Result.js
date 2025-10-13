const mongoose = require("mongoose");
const StudentModel = require("../../Module/Teacher/Student");

class STUDENT_RESULT {
  // Get student result by register number and DOB
  async getResult(req, res) {
    try {
      const { registerNumber, dob } = req.params;

      if (!registerNumber || !dob) {
        return res.status(400).json({ error: "Register number and date of birth are required" });
      }

      // Find student by register number and DOB
      const student = await StudentModel.findOne({
        registerNumber: registerNumber,
        dob: new Date(dob)
      }).populate('schoolId', 'schoolName schoolCode board medium');

      if (!student) {
        return res.status(404).json({ error: "No result found for the given details" });
      }

      // Calculate additional result data
      const resultData = {
        ...student.toObject(),
        calculatedResults: {
          semester1Totals: {},
          semester2Totals: {},
          semester1Grades: {},
          semester2Grades: {},
          attendancePercentages: {
            semester1: 0,
            semester2: 0
          },
          overallResult: "Pass"
        }
      };

      // Calculate totals and grades for each subject
      const subjects = ['firstLanguage', 'secondLanguage', 'mathematics', 'science', 'socialScience', 'environmentScience'];
      const calculateGrade = (totalMarks) => {
        if (totalMarks < 30) return "F";
        if (totalMarks >= 90) return "A+";
        if (totalMarks >= 70) return "A";
        if (totalMarks >= 50) return "B+";
        if (totalMarks >= 30) return "B";
        return "F";
      };
      const calculateOverallResult = (semester1Grades, semester2Grades, attendancePercentages) => {
        const subjects = ['firstLanguage', 'secondLanguage', 'mathematics', 'science', 'socialScience', 'environmentScience'];
        
        // Check if any subject has F grade in either semester
        for (const subject of subjects) {
          if (semester1Grades[subject] === "F" || semester2Grades[subject] === "F") {
            return "Fail";
          }
        }
        
        // Check attendance requirements
        if (attendancePercentages.semester1 < 75 || attendancePercentages.semester2 < 75) {
          return "Fail (Attendance)";
        }
        
        return "Pass";
      };
      
      subjects.forEach(subject => {
        const subjectData = student.subjects[subject];
        
        // Semester 1 calculations
        const semester1Total = Math.round(
          (subjectData.FA1 * 0.1) + 
          (subjectData.FA2 * 0.1) + 
          (subjectData.SA1 * 0.8)
        );
        resultData.calculatedResults.semester1Totals[subject] = semester1Total;
        resultData.calculatedResults.semester1Grades[subject] = calculateGrade(semester1Total);
        
        // Semester 2 calculations
        const semester2Total = Math.round(
          (subjectData.FA3 * 0.1) + 
          (subjectData.FA4 * 0.1) + 
          (subjectData.SA2 * 0.8)
        );
        resultData.calculatedResults.semester2Totals[subject] = semester2Total;
        resultData.calculatedResults.semester2Grades[subject] = calculateGrade(semester2Total);
      });

      // Calculate attendance percentages
      if (student.attendance.semester1.workingDays > 0) {
        resultData.calculatedResults.attendancePercentages.semester1 = 
          Math.round((student.attendance.semester1.attended / student.attendance.semester1.workingDays) * 100);
      }
      
      if (student.attendance.semester2.workingDays > 0) {
        resultData.calculatedResults.attendancePercentages.semester2 = 
          Math.round((student.attendance.semester2.attended / student.attendance.semester2.workingDays) * 100);
      }

      // Calculate overall result
      resultData.calculatedResults.overallResult = calculateOverallResult(
        resultData.calculatedResults.semester1Grades,
        resultData.calculatedResults.semester2Grades,
        resultData.calculatedResults.attendancePercentages
      );

      return res.status(200).json({ success: resultData });
    } catch (error) {
      console.log("Error fetching student result:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Calculate grade based on marks
  calculateGrade(totalMarks) {
    if (totalMarks < 30) return "F";
    if (totalMarks >= 90) return "A+";
    if (totalMarks >= 70) return "A";
    if (totalMarks >= 50) return "B+";
    if (totalMarks >= 30) return "B";
    return "F";
  }

  // Calculate overall result
  calculateOverallResult(semester1Grades, semester2Grades, attendancePercentages) {
    const subjects = ['firstLanguage', 'secondLanguage', 'mathematics', 'science', 'socialScience', 'environmentScience'];
    
    // Check if any subject has F grade in either semester
    for (const subject of subjects) {
      if (semester1Grades[subject] === "F" || semester2Grades[subject] === "F") {
        return "Fail";
      }
    }
    
    // Check attendance
    if (attendancePercentages.semester1 < 75 || attendancePercentages.semester2 < 75) {
      return "Fail (Attendance)";
    }
    
    return "Pass";
  }

  // Get result by student ID (for internal use)
  async getResultById(req, res) {
    try {
      const { studentId } = req.params;
      console.log("Getting result for student ID:", studentId);

      // Validate studentId format
      if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
        console.log("Invalid student ID format:", studentId);
        return res.status(400).json({ error: "Invalid student ID format" });
      }

      const student = await StudentModel.findById(studentId)
        .populate('schoolId', 'schoolName schoolCode board medium');

      if (!student) {
        console.log("Student not found for ID:", studentId);
        return res.status(404).json({ error: "Student not found" });
      }

      console.log("Student found:", {
        name: student.name,
        registerNumber: student.registerNumber,
        className: student.className,
        hasSubjects: !!student.subjects,
        subjectsKeys: student.subjects ? Object.keys(student.subjects) : []
      });

      // Calculate additional result data
      const resultData = {
        ...student.toObject(),
        calculatedResults: {
          semester1Totals: {},
          semester2Totals: {},
          semester1Grades: {},
          semester2Grades: {},
          attendancePercentages: {
            semester1: 0,
            semester2: 0
          },
          overallResult: "Pass"
        }
      };

      // Calculate totals and grades for each subject
      const subjects = ['firstLanguage', 'secondLanguage', 'mathematics', 'science', 'socialScience', 'environmentScience'];
      const calculateGrade = (totalMarks) => {
        if (totalMarks < 30) return "F";
        if (totalMarks >= 90) return "A+";
        if (totalMarks >= 70) return "A";
        if (totalMarks >= 50) return "B+";
        if (totalMarks >= 30) return "B";
        return "F";
      };
      const calculateOverallResult = (semester1Grades, semester2Grades, attendancePercentages) => {
        const subjects = ['firstLanguage', 'secondLanguage', 'mathematics', 'science', 'socialScience', 'environmentScience'];
        
        // Check if any subject has F grade in either semester
        for (const subject of subjects) {
          if (semester1Grades[subject] === "F" || semester2Grades[subject] === "F") {
            return "Fail";
          }
        }
        
        // Check attendance requirements
        if (attendancePercentages.semester1 < 75 || attendancePercentages.semester2 < 75) {
          return "Fail (Attendance)";
        }
        
        return "Pass";
      };
      
      subjects.forEach(subject => {
        const subjectData = student.subjects && student.subjects[subject] ? student.subjects[subject] : null;
        
        if (!subjectData) {
          console.log(`No subject data found for ${subject}`);
          resultData.calculatedResults.semester1Totals[subject] = 0;
          resultData.calculatedResults.semester2Totals[subject] = 0;
          resultData.calculatedResults.semester1Grades[subject] = "F";
          resultData.calculatedResults.semester2Grades[subject] = "F";
          return;
        }
        
        console.log(`Processing ${subject}:`, subjectData);
        
        // Semester 1 calculations
        const semester1Total = Math.round(
          ((subjectData.FA1 || 0) * 0.1) + 
          ((subjectData.FA2 || 0) * 0.1) + 
          ((subjectData.SA1 || 0) * 0.8)
        );
        resultData.calculatedResults.semester1Totals[subject] = semester1Total;
        resultData.calculatedResults.semester1Grades[subject] = calculateGrade(semester1Total);
        
        // Semester 2 calculations
        const semester2Total = Math.round(
          ((subjectData.FA3 || 0) * 0.1) + 
          ((subjectData.FA4 || 0) * 0.1) + 
          ((subjectData.SA2 || 0) * 0.8)
        );
        resultData.calculatedResults.semester2Totals[subject] = semester2Total;
        resultData.calculatedResults.semester2Grades[subject] = calculateGrade(semester2Total);
      });

      // Calculate attendance percentages
      if (student.attendance && student.attendance.semester1 && student.attendance.semester1.workingDays > 0) {
        resultData.calculatedResults.attendancePercentages.semester1 = 
          Math.round((student.attendance.semester1.attended / student.attendance.semester1.workingDays) * 100);
      }
      
      if (student.attendance && student.attendance.semester2 && student.attendance.semester2.workingDays > 0) {
        resultData.calculatedResults.attendancePercentages.semester2 = 
          Math.round((student.attendance.semester2.attended / student.attendance.semester2.workingDays) * 100);
      }

      // Calculate overall result
      resultData.calculatedResults.overallResult = calculateOverallResult(
        resultData.calculatedResults.semester1Grades,
        resultData.calculatedResults.semester2Grades,
        resultData.calculatedResults.attendancePercentages
      );

      console.log("Result data prepared successfully");
      return res.status(200).json({ success: resultData });
    } catch (error) {
      console.log("Error fetching student result by ID:", error);
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  }

  // Get all results for a school (for admin/teacher use)
  async getSchoolResults(req, res) {
    try {
      const { schoolId } = req.params;
      const { className, academicYear, page = 1, limit = 10 } = req.query;

      let filterQuery = { schoolId };
      if (className) filterQuery.className = className;
      if (academicYear) filterQuery.academicYear = academicYear;

      const skip = (page - 1) * limit;
      const students = await StudentModel.find(filterQuery)
        .populate('schoolId', 'schoolName schoolCode')
        .sort({ registerNumber: 1 })
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
      console.log("Error fetching school results:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get students by school and class (public endpoint for student result view)
  async getStudentsBySchoolAndClass(req, res) {
    try {
      const { schoolId, className } = req.params;

      console.log("Getting students for schoolId:", schoolId, "className:", className);

      if (!schoolId || !className) {
        return res.status(400).json({ error: "School ID and class name are required" });
      }

      const students = await StudentModel.find({
        schoolId: schoolId,
        className: className
      })
        .select('_id name registerNumber className schoolId')
        .sort({ registerNumber: 1 });

      console.log("Found students:", students.length);

      return res.status(200).json({ success: students });
    } catch (error) {
      console.log("Error fetching students by school and class:", error);
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  }

  // Get result statistics
  async getResultStats(req, res) {
    try {
      const { schoolId } = req.params;
      const { className, academicYear } = req.query;

      let filterQuery = { schoolId };
      if (className) filterQuery.className = className;
      if (academicYear) filterQuery.academicYear = academicYear;

      const totalStudents = await StudentModel.countDocuments(filterQuery);
      const classes = await StudentModel.distinct('className', filterQuery);
      const academicYears = await StudentModel.distinct('academicYear', filterQuery);

      const stats = {
        totalStudents,
        totalClasses: classes.length,
        totalAcademicYears: academicYears.length,
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

module.exports = new STUDENT_RESULT();

