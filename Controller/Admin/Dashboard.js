const TeacherModel = require("../../Module/Teacher/Teacher");
const QuestionPaperModel = require("../../Module/Admin/QuestionPaper");
const GenrateQAModel = require("../../Module/Teacher/GenrateQA");

class DASHBOARD {
  // Get dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const { authId } = req.params;

      // Get total users count
      const totalUsers = await TeacherModel.countDocuments();

      // Get total question papers count
      const totalQuestionPapers = await GenrateQAModel.countDocuments();

      // Get shared papers count (assuming isShared field exists or we can add it)
      const totalSharedPapers = 0; // GenrateQAModel doesn't have isShared field yet

      // Get saved papers count (assuming isSaved field exists or we can add it)
      const totalSavedPapers = 0; // GenrateQAModel doesn't have isSaved field yet

      // Get recent registrations (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentRegistrations = await TeacherModel.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });

      // Get recent question papers (last 30 days)
      const recentQuestionPapers = await GenrateQAModel.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });

      // Get completion rate
      const completedPapers = await GenrateQAModel.countDocuments({ status: 'Completed' });
      const completionRate = totalQuestionPapers > 0 ? 
        ((completedPapers / totalQuestionPapers) * 100).toFixed(2) : 0;

      const stats = {
        totalUsers,
        totalQuestionPapers,
        totalSharedPapers,
        totalSavedPapers,
        recentRegistrations,
        recentQuestionPapers,
        completionRate: `${completionRate}%`,
        completedPapers,
        inProgressPapers: totalQuestionPapers - completedPapers
      };

      return res.status(200).json({ success: stats });
    } catch (error) {
      console.log("Error fetching dashboard stats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get teachers with pagination and search
  async getTeachersWithPagination(req, res) {
    try {
      const { authId } = req.params;
      const { 
        page = 1, 
        limit = 10, 
        search = '', 
        sortBy = 'createdAt', 
        sortOrder = 'desc' 
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Build search query
      let searchQuery = {};
      if (search && search.trim() !== '') {
        searchQuery = {
          $or: [
            { FirstName: { $regex: search, $options: 'i' } },
            { LastName: { $regex: search, $options: 'i' } },
            { teacherId: { $regex: search, $options: 'i' } },
            { Email: { $regex: search, $options: 'i' } },
            { Mobile: { $regex: search, $options: 'i' } },
            { City: { $regex: search, $options: 'i' } },
            { State: { $regex: search, $options: 'i' } },
            { Institution: { $regex: search, $options: 'i' } }
          ]
        };
      }

      // Build sort query
      const sortQuery = {};
      sortQuery[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Get total count for pagination
      const totalTeachers = await TeacherModel.countDocuments(searchQuery);

      // Get teachers with pagination
      const teachers = await TeacherModel.find(searchQuery)
        .select('FirstName LastName teacherId Email Mobile City State Institution Department createdAt updatedAt status')
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum);

      // Calculate pagination info
      const totalPages = Math.ceil(totalTeachers / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      return res.status(200).json({ 
        success: {
          teachers,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalTeachers,
            hasNextPage,
            hasPrevPage,
            limit: limitNum
          }
        }
      });
    } catch (error) {
      console.log("Error fetching teachers with pagination:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Search teachers
  async searchTeachers(req, res) {
    try {
      const { authId } = req.params;
      const { query, limit = 20 } = req.query;

      if (!query || query.trim() === '') {
        return res.status(400).json({ error: "Search query is required" });
      }

      const searchQuery = {
        $or: [
          { FirstName: { $regex: query, $options: 'i' } },
          { LastName: { $regex: query, $options: 'i' } },
          { teacherId: { $regex: query, $options: 'i' } },
          { Email: { $regex: query, $options: 'i' } },
          { Mobile: { $regex: query, $options: 'i' } }
        ]
      };

      const teachers = await TeacherModel.find(searchQuery)
        .select('FirstName LastName teacherId Email Mobile createdAt')
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: teachers });
    } catch (error) {
      console.log("Error searching teachers:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get user's question papers with filtering
  async getUserQuestionPapers(req, res) {
    try {
      const { teacherId, authId } = req.params;
      const { 
        page = 1, 
        limit = 10, 
        status = '', 
        sortBy = 'createdAt', 
        sortOrder = 'desc' 
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Build filter query
      let filterQuery = { teacherId: teacherId };

      if (status && status !== '') {
        filterQuery.status = status;
      }

      // Build sort query
      const sortQuery = {};
      sortQuery[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Get total count for pagination
      const totalPapers = await GenrateQAModel.countDocuments(filterQuery);

      // Get question papers with pagination
      const questionPapers = await GenrateQAModel.find(filterQuery)
        .populate('teacherId', 'FirstName LastName teacherId Email')
        .select('paperId Institute_Name Board Class Subject Medium Test_Date ExamTime status Questions School_Logo createdAt updatedAt')
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum);

      // Calculate pagination info
      const totalPages = Math.ceil(totalPapers / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      // Get summary statistics for this user
      const userStats = await GenrateQAModel.aggregate([
        { $match: { teacherId: teacherId } },
        {
          $group: {
            _id: null,
            totalPapers: { $sum: 1 },
            completedPapers: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
            inProgressPapers: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } },
            notCompletedPapers: { $sum: { $cond: [{ $eq: ["$status", "Not Complete Staps"] }, 1, 0] } }
          }
        }
      ]);

      const stats = userStats.length > 0 ? userStats[0] : {
        totalPapers: 0,
        completedPapers: 0,
        inProgressPapers: 0,
        notCompletedPapers: 0
      };

      const response = {
        questionPapers,
        stats,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalPapers,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      };

      return res.status(200).json({ success: response });
    } catch (error) {
      console.log("Error fetching user question papers:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get all question papers with pagination
  async getAllQuestionPapersWithPagination(req, res) {
    try {
      const { authId } = req.params;
      const { 
        page = 1, 
        limit = 10, 
        status = '', 
        teacherId = '',
        sortBy = 'createdAt', 
        sortOrder = 'desc' 
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Build filter query
      let filterQuery = {};

      if (status && status !== '') {
        filterQuery.status = status;
      }

      if (teacherId && teacherId !== '') {
        filterQuery.teacherId = teacherId;
      }

      // Build sort query
      const sortQuery = {};
      sortQuery[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Get total count for pagination
      const totalPapers = await GenrateQAModel.countDocuments(filterQuery);

      // Get question papers with pagination
      const questionPapers = await GenrateQAModel.find(filterQuery)
        .populate('teacherId', 'FirstName LastName teacherId Email Mobile')
        .select('paperId Institute_Name Board Class Subject Medium Test_Date ExamTime status Questions School_Logo createdAt updatedAt')
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum);

      // Calculate pagination info
      const totalPages = Math.ceil(totalPapers / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      const response = {
        questionPapers,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalPapers,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      };

      return res.status(200).json({ success: response });
    } catch (error) {
      console.log("Error fetching all question papers:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete teacher
  async deleteTeacher(req, res) {
    try {
      const { teacherId, authId } = req.params;

      // Check if teacher exists
      const teacher = await TeacherModel.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      // Delete teacher's question papers first
      await GenrateQAModel.deleteMany({ teacherId: teacherId });

      // Delete the teacher
      await TeacherModel.findByIdAndDelete(teacherId);

      return res.status(200).json({ success: "Teacher deleted successfully" });
    } catch (error) {
      console.log("Error deleting teacher:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new DASHBOARD();
