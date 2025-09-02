// const Subject = require("../../Module/Admin/Subject"); // Assuming Subject.js is in the same directory
// const SubClassModel = require("../../Module/Admin/SubClass"); // Adjust path as needed
// const Board = require("./Board"); // Adjust path as needed


// function toTitleCase(str) {
//   return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
// }

// class SubjectController {
//   async addSubjects(req, res) {
//     try {
//       const { mediumName, subjectName, subClass,boardName} = req.body;

//       if (!mediumName || !subjectName || !subClass || !boardName) {
//         return res
//           .status(400)
//           .json({ error: "Please fill all required fields" });
//       }

//       const subClassData = await SubClassModel.findById(subClass);

//       if (!subClassData) {
//         return res.status(404).json({ error: "SubClass not found" });
//       }

//       const newSubject = new Subject({
//         mediumName: toTitleCase(mediumName),
//         subjectName: toTitleCase(subjectName),
//         subClass,
//         boardName
//       });

//       const existingSubject = await Subject.findOne({
//         mediumName: newSubject.mediumName,
//         subjectName: newSubject.subjectName,
//         subClass: newSubject.subClass,
//       });

//       if (existingSubject) {
//         return res
//           .status(400)
//           .json({ error: `${subjectName} already exists for this medium` });
//       }

//       await newSubject.save();
//       return res.status(200).json({ success: "Successfully added" });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: "Server Error" });
//     }
//   }

//   async updateSubjects(req, res) {
//     try {
//       const { id, mediumName, subjectName, subClass,boardName } = req.body;
//       const updates = {};
//       if (mediumName) updates.mediumName = toTitleCase(mediumName);
//       if (subjectName) updates.subjectName = toTitleCase(subjectName);
//       if (subClass) updates.subClass = subClass;
//       if(boardName) updates.boardName = boardName;

//       const updatedSubject = await Subject.findByIdAndUpdate(id, updates, {
//         new: true,
//       }).populate("subClass");

//       if (!updatedSubject) {
//         return res.status(404).json({ error: "Subject not found" });
//       }
//       return res.status(200).json({ success: updatedSubject });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: "Server Error" });
//     }
//   }

//   async getAllSujects(req, res) {
//     try {
//       const subjects = await Subject.find({})
//         .populate("subClass") // Correct the populate path here
//         .sort({ _id: -1 });
//       return res.status(200).json({ success: subjects });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: "Server Error" });
//     }
//   }

//   async deleteSubjects(req, res) {
//     try {
//       const id = req.params.id;
//       const deletedSubject = await Subject.findByIdAndDelete(id);
//       if (!deletedSubject) {
//         return res.status(404).json({ error: "Subject not found" });
//       }
//       return res.status(200).json({ success: "Successfully deleted" });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: "Server Error" });
//     }
//   }
// }

// module.exports = new SubjectController();
 
 
 
const Subject = require("../../Module/Admin/Subject");
const SubClassModel = require("../../Module/Admin/SubClass");

function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

class SubjectController {
  async addSubjects(req, res) {
    try {
      const { mediumName, subjectName, subClass, boardName } = req.body;

      if (!mediumName || !subjectName || !subClass || !boardName) {
        return res
          .status(400)
          .json({ error: "Please fill all required fields" });
      }

      const subClassData = await SubClassModel.findById(subClass);

      if (!subClassData) {
        return res.status(404).json({ error: "SubClass not found" });
      }

      const newSubject = new Subject({
        mediumName: toTitleCase(mediumName),
        subjectName: toTitleCase(subjectName),
        subClass,
        boardName: toTitleCase(boardName)
      });

      const existingSubject = await Subject.findOne({
        mediumName: newSubject.mediumName,
        subjectName: newSubject.subjectName,
        subClass: newSubject.subClass,
        boardName: newSubject.boardName
      });

      if (existingSubject) {
        return res
          .status(400)
          .json({ error: `${subjectName} already exists for this medium and board` });
      }

      await newSubject.save();
      return res.status(200).json({ success: "Successfully added" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  async updateSubjects(req, res) {
    try {
      const { id, mediumName, subjectName, subClass, boardName } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: "Subject ID is required" });
      }

      const updates = {};
      if (mediumName) updates.mediumName = toTitleCase(mediumName);
      if (subjectName) updates.subjectName = toTitleCase(subjectName);
      if (subClass) updates.subClass = subClass;
      if (boardName) updates.boardName = toTitleCase(boardName);

      // Check for existing subject with same details (excluding current one)
      if (Object.keys(updates).length > 0) {
        const existingSubject = await Subject.findOne({
          ...updates,
          _id: { $ne: id }
        }).populate("subClass");

        if (existingSubject) {
          return res.status(400).json({ 
            error: "A subject with these details already exists" 
          });
        }
      }

      const updatedSubject = await Subject.findByIdAndUpdate(id, updates, {
        new: true,
      }).populate("subClass");

      if (!updatedSubject) {
        return res.status(404).json({ error: "Subject not found" });
      }
      
      return res.status(200).json({ 
        success: "Successfully updated",
        data: updatedSubject 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  async getAllSujects(req, res) {
    try {
      // Extract query parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      const boardName = req.query.boardName || '';
      const mediumName = req.query.mediumName || '';

      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Build search query
      let searchQuery = {};

      // Text search across multiple fields
      if (search) {
        searchQuery.$or = [
          { subjectName: { $regex: search, $options: 'i' } },
          { mediumName: { $regex: search, $options: 'i' } },
          { boardName: { $regex: search, $options: 'i' } }
        ];
      }

      // Filter by board name
      if (boardName) {
        searchQuery.boardName = { $regex: boardName, $options: 'i' };
      }

      // Filter by medium name
      if (mediumName) {
        searchQuery.mediumName = { $regex: mediumName, $options: 'i' };
      }

      // Build sort object
      const sortObject = {};
      sortObject[sortBy] = sortOrder;

      // Execute aggregation pipeline for better performance with population
      const pipeline = [
        { $match: searchQuery },
        {
          $lookup: {
            from: 'subclassdatas', // Collection name for SubClass
            localField: 'subClass',
            foreignField: '_id',
            as: 'subClass'
          }
        },
        { $unwind: '$subClass' },
        { $sort: sortObject },
        {
          $facet: {
            subjects: [
              { $skip: skip },
              { $limit: limit }
            ],
            totalCount: [
              { $count: 'count' }
            ]
          }
        }
      ];

      const result = await Subject.aggregate(pipeline);
      
      const subjects = result[0].subjects;
      const totalCount = result[0].totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      // Response with pagination metadata
      return res.status(200).json({
        success: true,
        data: subjects,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        },
        filters: {
          search,
          boardName,
          mediumName,
          sortBy,
          sortOrder: sortOrder === 1 ? 'asc' : 'desc'
        }
      });

    } catch (error) {
      console.error('Error in getAllSujects:', error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  // Get subjects with basic pagination (fallback method)
  async getSubjectsBasic(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const subjects = await Subject.find({})
        .populate("subClass")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalCount = await Subject.countDocuments({});
      const totalPages = Math.ceil(totalCount / limit);

      return res.status(200).json({
        success: true,
        data: subjects,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  async deleteSubjects(req, res) {
    try {
      const id = req.params.id;
      
      if (!id) {
        return res.status(400).json({ error: "Subject ID is required" });
      }

      const deletedSubject = await Subject.findByIdAndDelete(id);
      
      if (!deletedSubject) {
        return res.status(404).json({ error: "Subject not found" });
      }
      
      return res.status(200).json({ 
        success: "Successfully deleted",
        deletedId: id 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  // Get subject statistics
  async getSubjectStats(req, res) {
    try {
      const stats = await Subject.aggregate([
        {
          $group: {
            _id: null,
            totalSubjects: { $sum: 1 },
            uniqueBoards: { $addToSet: '$boardName' },
            uniqueMediums: { $addToSet: '$mediumName' }
          }
        },
        {
          $project: {
            _id: 0,
            totalSubjects: 1,
            totalBoards: { $size: '$uniqueBoards' },
            totalMediums: { $size: '$uniqueMediums' },
            boardNames: '$uniqueBoards',
            mediumNames: '$uniqueMediums'
          }
        }
      ]);

      const boardStats = await Subject.aggregate([
        {
          $group: {
            _id: '$boardName',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const mediumStats = await Subject.aggregate([
        {
          $group: {
            _id: '$mediumName',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return res.status(200).json({
        success: true,
        stats: stats[0] || {
          totalSubjects: 0,
          totalBoards: 0,
          totalMediums: 0,
          boardNames: [],
          mediumNames: []
        },
        boardStats,
        mediumStats
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  }
}

module.exports = new SubjectController();