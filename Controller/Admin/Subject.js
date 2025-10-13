const Subject = require("../../Module/Admin/Subject"); // Assuming Subject.js is in the same directory
const SubClassModel = require("../../Module/Admin/SubClass"); // Adjust path as needed
const Board = require("./Board"); // Adjust path as needed


function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

class SubjectController {
  async addSubjects(req, res) {
    try {
      const { mediumName, subjectName, subClass,boardName} = req.body;

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
        boardName
      });

      const existingSubject = await Subject.findOne({
        mediumName: newSubject.mediumName,
        subjectName: newSubject.subjectName,
        subClass: newSubject.subClass,
      });

      if (existingSubject) {
        return res
          .status(400)
          .json({ error: `${subjectName} already exists for this medium` });
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
      const { id, mediumName, subjectName, subClass,boardName } = req.body;
      const updates = {};
      if (mediumName) updates.mediumName = toTitleCase(mediumName);
      if (subjectName) updates.subjectName = toTitleCase(subjectName);
      if (subClass) updates.subClass = subClass;
      if(boardName) updates.boardName = boardName;

      const updatedSubject = await Subject.findByIdAndUpdate(id, updates, {
        new: true,
      }).populate("subClass");

      if (!updatedSubject) {
        return res.status(404).json({ error: "Subject not found" });
      }
      return res.status(200).json({ success: updatedSubject });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  async getAllSujects(req, res) {
    try {
      const subjects = await Subject.find({})
        .populate("subClass") // Correct the populate path here
        .sort({ _id: -1 });
      return res.status(200).json({ success: subjects });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  // New optimized method with pagination and filtering
  async getSubjectsWithPagination(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        mediumName = "",
        boardName = "",
        sortBy = "createdAt",
        sortOrder = "desc"
      } = req.query;

      // Build filter query
      let filterQuery = {};
      
      if (search) {
        filterQuery.$or = [
          { mediumName: { $regex: search, $options: "i" } },
          { subjectName: { $regex: search, $options: "i" } },
          { boardName: { $regex: search, $options: "i" } }
        ];
      }
      
      if (mediumName) filterQuery.mediumName = mediumName;
      if (boardName) filterQuery.boardName = boardName;

      // Pagination
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Sorting
      const sortObj = {};
      sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Execute queries in parallel
      const [subjects, totalCount] = await Promise.all([
        Subject.find(filterQuery)
          .populate("subClass")
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Subject.countDocuments(filterQuery)
      ]);

      const totalPages = Math.ceil(totalCount / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      return res.status(200).json({
        success: true,
        data: {
          subjects,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalCount,
            limit: limitNum,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? pageNum + 1 : null,
            prevPage: hasPrevPage ? pageNum - 1 : null
          },
          filters: {
            search,
            mediumName,
            boardName,
            sortBy,
            sortOrder
          }
        }
      });
    } catch (error) {
      console.log("Error in getSubjectsWithPagination:", error);
      return res.status(500).json({
        success: false,
        error: "Server error while fetching subjects"
      });
    }
  }

  // Get filter options for dropdowns
  async getSubjectFilterOptions(req, res) {
    try {
      const [mediumOptions, boardOptions] = await Promise.all([
        Subject.distinct("mediumName"),
        Subject.distinct("boardName")
      ]);

      return res.status(200).json({
        success: true,
        data: {
          mediumOptions: mediumOptions.filter(Boolean).sort(),
          boardOptions: boardOptions.filter(Boolean).sort()
        }
      });
    } catch (error) {
      console.log("Error in getSubjectFilterOptions:", error);
      return res.status(500).json({
        success: false,
        error: "Server error while fetching filter options"
      });
    }
  }

  async deleteSubjects(req, res) {
    try {
      const id = req.params.id;
      const deletedSubject = await Subject.findByIdAndDelete(id);
      if (!deletedSubject) {
        return res.status(404).json({ error: "Subject not found" });
      }
      return res.status(200).json({ success: "Successfully deleted" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  }
}

module.exports = new SubjectController();
