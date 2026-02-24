const teacherModel = require("../../Module/Teacher/Teacher");
const questionPaperModel = require("../../Module/Teacher/GenrateQA");

class DashboardOptimized {
  // Get quick dashboard overview (minimal data for fast loading)
  async getDashboardOverview(req, res) {
    try {
      const { authId } = req.params;
      
      // Get basic counts only (fastest queries)
      const [totalUsers, totalQuestionPapers] = await Promise.all([
        teacherModel.countDocuments({}),
        questionPaperModel.countDocuments({})
      ]);

      const overview = {
        totalUsers,
        totalQuestionPapers,
        totalSharedPapers: 0, // Will be calculated separately if needed
        totalSavedPapers: 0   // Will be calculated separately if needed
      };

      return res.status(200).json({ 
        success: overview,
        message: "Dashboard overview loaded successfully"
      });
    } catch (error) {
      console.log("Dashboard overview error:", error);
      return res.status(500).json({ error: "Failed to load dashboard overview" });
    }
  }

  // Get detailed dashboard statistics (called after initial load)
  async getDashboardStats(req, res) {
    try {
      const { authId } = req.params;
      
      // Get detailed statistics
      const [
        totalUsers,
        totalQuestionPapers,
        sharedPapers,
        savedPapers,
        recentUsers,
        activeUsers
      ] = await Promise.all([
        teacherModel.countDocuments({}),
        questionPaperModel.countDocuments({}),
        questionPaperModel.countDocuments({ isShared: true }),
        questionPaperModel.countDocuments({ isSaved: true }),
        teacherModel.countDocuments({ 
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
        }),
        teacherModel.countDocuments({ 
          lastLoginAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
        })
      ]);

      // Get monthly registration trend
      const monthlyStats = await teacherModel.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);

      const stats = {
        totalUsers,
        totalQuestionPapers,
        totalSharedPapers: sharedPapers,
        totalSavedPapers: savedPapers,
        recentUsers,
        activeUsers,
        monthlyRegistrations: monthlyStats,
        lastUpdated: new Date()
      };

      return res.status(200).json({ 
        success: stats,
        message: "Dashboard statistics loaded successfully"
      });
    } catch (error) {
      console.log("Dashboard stats error:", error);
      return res.status(500).json({ error: "Failed to load dashboard statistics" });
    }
  }

  // Get paginated teachers list with search and filters
  async getTeachersPaginated(req, res) {
    try {
      const { authId } = req.params;
      const { 
        page = 1, 
        limit = 10, 
        search = '', 
        sortBy = 'createdAt', 
        sortOrder = 'desc',
        filter = 'all' // all, active, inactive, recent
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Build search query
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [
            { FirstName: { $regex: search, $options: 'i' } },
            { LastName: { $regex: search, $options: 'i' } },
            { Email: { $regex: search, $options: 'i' } },
            { Mobile: { $regex: search, $options: 'i' } },
            { teacherId: { $regex: search, $options: 'i' } }
          ]
        };
      }

      // Apply filters
      switch (filter) {
        case 'active':
          searchQuery.lastLoginAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
          break;
        case 'inactive':
          searchQuery.lastLoginAt = { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
          break;
        case 'recent':
          searchQuery.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
          break;
      }

      // Build sort object
      const sortObj = {};
      sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute queries in parallel
      const [teachers, totalCount] = await Promise.all([
        teacherModel
          .find(searchQuery)
          .select('FirstName LastName Email Mobile teacherId createdAt lastLoginAt isActive referralStats')
          .sort(sortObj)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(), // Use lean() for better performance
        teacherModel.countDocuments(searchQuery)
      ]);

      const totalPages = Math.ceil(totalCount / parseInt(limit));
      
      const response = {
        teachers,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: parseInt(page) < totalPages,
          hasPreviousPage: parseInt(page) > 1,
          limit: parseInt(limit)
        },
        filters: {
          search,
          sortBy,
          sortOrder,
          filter
        }
      };

      return res.status(200).json({ 
        success: response,
        message: "Teachers loaded successfully"
      });
    } catch (error) {
      console.log("Get teachers paginated error:", error);
      return res.status(500).json({ error: "Failed to load teachers" });
    }
  }

  // Get user activity details (for modal)
  async getUserActivity(req, res) {
    try {
      const { teacherId, authId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // Get user details
      const user = await teacherModel
        .findById(teacherId)
        .select('FirstName LastName Email Mobile teacherId createdAt lastLoginAt referralStats')
        .lean();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get user's question papers with pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [questionPapers, totalPapers] = await Promise.all([
        questionPaperModel
          .find({ teacherId: teacherId })
          .select('paperId Institute_Name Board Class Medium Test_Date status createdAt School_Logo ExamTime')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        questionPaperModel.countDocuments({ teacherId: teacherId })
      ]);

      // Get activity summary
      const activitySummary = await questionPaperModel.aggregate([
        { $match: { teacherId: teacherId } },
        {
          $group: {
            _id: null,
            totalPapers: { $sum: 1 },
            completedPapers: {
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
            },
            inProgressPapers: {
              $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] }
            },
            sharedPapers: {
              $sum: { $cond: ["$isShared", 1, 0] }
            },
            savedPapers: {
              $sum: { $cond: ["$isSaved", 1, 0] }
            }
          }
        }
      ]);

      const summary = activitySummary[0] || {
        totalPapers: 0,
        completedPapers: 0,
        inProgressPapers: 0,
        sharedPapers: 0,
        savedPapers: 0
      };

      const response = {
        user,
        questionPapers,
        summary,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPapers / parseInt(limit)),
          totalCount: totalPapers,
          hasNextPage: parseInt(page) < Math.ceil(totalPapers / parseInt(limit)),
          hasPreviousPage: parseInt(page) > 1,
          limit: parseInt(limit)
        }
      };

      return res.status(200).json({ 
        success: response,
        message: "User activity loaded successfully"
      });
    } catch (error) {
      console.log("Get user activity error:", error);
      return res.status(500).json({ error: "Failed to load user activity" });
    }
  }
}

module.exports = new DashboardOptimized();