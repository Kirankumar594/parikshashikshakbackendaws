const { toTitleCase } = require("../../Config/function");
const ClassModel = require("../../Module/Admin/CLASS");

class ClassM {
  async addClass(req, res) {
    try {
      let { mediumName, className, subclassName } = req.body;
      if (!className)
        return res.status(400).json({ error: "Please enter class name" });
      if (!mediumName)
        return res.status(400).json({ error: "Please Select Medium Name" });
      if (!subclassName)
        return res.status(400).json({ error: "Please enter sub class name" });
      className = toTitleCase(className);
      let data = await ClassModel.findOne({
        className: className,
        mediumName: mediumName,
        subclassName: subclassName,
      });
      if (data)
        return res.status(400).json({ error: `${className} already exits` });
      await ClassModel.create({ className, mediumName, subclassName });
      return res.status(200).json({ success: "Successfully added" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something Went Wrong !!!" });
    }
  }

  async updateClass(req, res) {
    try {
      let { id, className, mediumName, subclassName } = req.body;
      let obj = {};
      if (className) {
        className = toTitleCase(className);
        let data = await ClassModel.findOne({
          className: className,
          mediumName: mediumName,
          subclassName: subclassName,
        });
        if (data)
          return res.status(400).json({ error: `${className} already exits` });
        obj["className"] = className;
        obj["mediumName"] = mediumName;
        obj["subclassName"] = subclassName;
      }
      let data = await ClassModel.findOneAndUpdate({ _id: id }, { $set: obj });
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully updated" });
    } catch (error) {
      console.log(error);
    }
  }
  async getAllClass(req, res) {
    try {
      let data = await ClassModel.find({});
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Server error" });
    }
  }

  // New optimized method with pagination and filtering
  async getClassesWithPagination(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        mediumName = "",
        className = "",
        subclassName = "",
        sortBy = "createdAt",
        sortOrder = "desc"
      } = req.query;

      // Build filter query
      let filterQuery = {};
      
      if (search) {
        filterQuery.$or = [
          { mediumName: { $regex: search, $options: "i" } },
          { className: { $regex: search, $options: "i" } },
          { subclassName: { $regex: search, $options: "i" } }
        ];
      }
      
      if (mediumName) filterQuery.mediumName = mediumName;
      if (className) filterQuery.className = className;
      if (subclassName) filterQuery.subclassName = subclassName;

      // Pagination
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Sorting
      const sortObj = {};
      sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Execute queries in parallel
      const [classes, totalCount] = await Promise.all([
        ClassModel.find(filterQuery)
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        ClassModel.countDocuments(filterQuery)
      ]);

      const totalPages = Math.ceil(totalCount / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      return res.status(200).json({
        success: true,
        data: {
          classes,
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
            className,
            subclassName,
            sortBy,
            sortOrder
          }
        }
      });
    } catch (error) {
      console.log("Error in getClassesWithPagination:", error);
      return res.status(500).json({
        success: false,
        error: "Server error while fetching classes"
      });
    }
  }

  // Get filter options for dropdowns
  async getClassFilterOptions(req, res) {
    try {
      const [mediumOptions, classOptions, subclassOptions] = await Promise.all([
        ClassModel.distinct("mediumName"),
        ClassModel.distinct("className"),
        ClassModel.distinct("subclassName")
      ]);

      return res.status(200).json({
        success: true,
        data: {
          mediumOptions: mediumOptions.filter(Boolean).sort(),
          classOptions: classOptions.filter(Boolean).sort(),
          subclassOptions: subclassOptions.filter(Boolean).sort()
        }
      });
    } catch (error) {
      console.log("Error in getClassFilterOptions:", error);
      return res.status(500).json({
        success: false,
        error: "Server error while fetching filter options"
      });
    }
  }

  async deleteClass(req, res) {
    try {
      let id = req.params.id;
      let data = await ClassModel.deleteOne({ _id: id });
      if (data.deletedCount == 0)
        return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Sucessfully deleted" });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new ClassM();
